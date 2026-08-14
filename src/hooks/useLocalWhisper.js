import { useCallback, useEffect, useRef, useState } from 'react';

import { createSilenceDetector } from '../utils/voiceActivityDetector.js';
import { normalizeTranscript } from '../utils/voiceTranscriptMatcher.js';

// Only ever used by useExerciseVoice.jsx as a fallback when the browser has
// no native SpeechRecognition (Firefox, Safari, ...). Runs OpenAI Whisper
// entirely client-side via a Worker (whisperWorker.js) so no audio leaves
// the device. Remembered once per browser so the ~150MB download is only
// ever asked about once, not on every session.
const CONSENT_STORAGE_KEY = 'localWhisperConsent';

// Multilingual whisper-tiny expects full lowercase language names, not ISO
// codes, per the pipeline's own documented call-time options.
const WHISPER_LANGUAGE = { pl: 'polish', de: 'german', en: 'english' };

function mapGetUserMediaError(err) {
  return err?.name === 'NotAllowedError' ||
    err?.name === 'PermissionDeniedError'
    ? 'not-allowed'
    : 'unknown';
}

function concatenateFloat32(chunks) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

// Whisper requires mono 16kHz input, but the AudioContext's native rate
// varies by device (commonly 44100/48000, never something we should
// hardcode or request directly — Safari doesn't reliably honor a requested
// rate). Resampling after capture, via the standard AudioBuffer →
// OfflineAudioContext render trick, sidesteps that entirely: the browser
// does the resampling itself as part of rendering the graph.
async function resampleTo16kHz(float32Data, sourceSampleRate) {
  const TARGET_SAMPLE_RATE = 16000;
  if (sourceSampleRate === TARGET_SAMPLE_RATE) return float32Data;

  const OfflineAudioContextClass =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const durationSeconds = float32Data.length / sourceSampleRate;
  const offlineCtx = new OfflineAudioContextClass(
    1,
    Math.ceil(durationSeconds * TARGET_SAMPLE_RATE),
    TARGET_SAMPLE_RATE,
  );
  const sourceBuffer = offlineCtx.createBuffer(
    1,
    float32Data.length,
    sourceSampleRate,
  );
  sourceBuffer.copyToChannel(float32Data, 0);
  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = sourceBuffer;
  bufferSource.connect(offlineCtx.destination);
  bufferSource.start(0);
  const rendered = await offlineCtx.startRendering();
  return rendered.getChannelData(0);
}

export function useLocalWhisper(language) {
  // idle | awaiting-consent | loading-model | ready | recording |
  // transcribing | error
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  // Mirrors `status`, updated synchronously alongside every setStatus call
  // (see updateStatus below). The guards in maybeBeginCapture/activate run
  // from async callbacks (worker messages, getUserMedia resolution) that
  // can fire well after the useCallback closure that reads them was
  // created — reading React state directly there risks acting on a
  // snapshot several renders stale, since none of those callbacks are
  // recreated on every status change. The ref is always current.
  const statusRef = useRef('idle');
  const [transcript, setTranscript] = useState('');
  // Bumped on every new result, even an identical transcript twice in a
  // row — useExerciseVoice.jsx keys its match-triggering effect off this
  // rather than the transcript string itself, for the same reason the
  // native engine's onresult calls the matcher directly instead of relying
  // on a transcript-changed effect: React bails out of a same-value state
  // update, which would silently swallow saying the same word twice.
  const [resultSeq, setResultSeq] = useState(0);
  const [error, setError] = useState(null);
  const [micPermissionGranted, setMicPermissionGranted] = useState(null);

  const workerRef = useRef(null);
  const modelReadyRef = useRef(false);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const muteGainRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const workletNodeRef = useRef(null);
  const detectorRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingStartRef = useRef(0);
  // worker.onmessage below is assigned exactly once, the first time the
  // worker is created — but beginCapture/finishCapture are recreated
  // whenever `language` changes, so a direct closure reference to
  // maybeBeginCapture here would freeze it to whatever language was active
  // on that first call, silently ignoring a later language switch. Routing
  // through a ref that's kept in sync every render (below) means the
  // one-time handler always invokes the current version.
  const maybeBeginCaptureRef = useRef(null);
  // The model download already in flight can't be cancelled mid-fetch, so
  // declining after tapping "Download" doesn't stop it — without this flag,
  // the download finishing later would still satisfy maybeBeginCapture's
  // readiness check (status back at 'idle') and silently start recording
  // even though the user closed the dialog.
  const cancelledRef = useRef(false);

  const updateStatus = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(
      new URL('../workers/whisperWorker.js', import.meta.url),
      { type: 'module' },
    );
    worker.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'progress') {
        setProgress(event.data.progress);
      } else if (type === 'ready') {
        modelReadyRef.current = true;
        updateStatus('ready');
        maybeBeginCaptureRef.current();
      } else if (type === 'result') {
        // Normalized the same way native SpeechRecognition's transcript
        // already is (see voiceTranscriptMatcher.js) — so useExerciseVoice
        // can hand either engine's output to the same matcher and callers
        // never see a difference in casing/punctuation between engines.
        setTranscript(normalizeTranscript(event.data.text || ''));
        setResultSeq((seq) => seq + 1);
        updateStatus('idle');
      } else if (type === 'error') {
        // The UI only ever shows a generic code (see below) — this is the
        // one place the underlying transformers.js/onnxruntime-web message
        // is visible at all, which matters since failures here (wasm
        // backend issues, a blocked/failed model fetch, ...) are otherwise
        // silent beyond "something went wrong."
        console.error(
          `[useLocalWhisper] ${event.data.phase} failed:`,
          event.data.message,
        );
        updateStatus('error');
        setError(
          event.data.phase === 'load'
            ? 'local-download-error'
            : 'local-engine-failure',
        );
      }
    };
    workerRef.current = worker;
    return worker;
  }, [updateStatus]);

  const ensureAudioGraph = useCallback(async () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      await ctx.audioWorklet.addModule(
        new URL('../workers/recorderWorklet.js', import.meta.url),
      );
      // The worklet must be connected through to the destination for
      // process() to keep being called, but we don't want the raw mic
      // signal audible — routing it through a zeroed GainNode keeps the
      // graph "live" without producing any sound.
      const muteGain = ctx.createGain();
      muteGain.gain.value = 0;
      muteGain.connect(ctx.destination);
      audioContextRef.current = ctx;
      muteGainRef.current = muteGain;
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const finishCapture = useCallback(
    async (reason, sampleRate) => {
      if (reason === 'timeout-no-speech') {
        updateStatus('idle');
        setError('no-speech');
        chunksRef.current = [];
        return;
      }

      updateStatus('transcribing');
      const raw = concatenateFloat32(chunksRef.current);
      chunksRef.current = [];
      const resampled = await resampleTo16kHz(raw, sampleRate);
      // Copied (not the AudioBuffer-backed view directly) before transfer —
      // getChannelData()'s array isn't guaranteed safe to detach across
      // every implementation.
      const audioToSend = Float32Array.from(resampled);
      workerRef.current.postMessage(
        {
          type: 'transcribe',
          audio: audioToSend,
          language: WHISPER_LANGUAGE[language] || 'english',
        },
        [audioToSend.buffer],
      );
    },
    [language, updateStatus],
  );

  const beginCapture = useCallback(async () => {
    updateStatus('recording');
    setError(null);
    chunksRef.current = [];
    detectorRef.current = createSilenceDetector();
    recordingStartRef.current = performance.now();

    const ctx = await ensureAudioGraph();
    const sourceNode = ctx.createMediaStreamSource(micStreamRef.current);
    const workletNode = new AudioWorkletNode(ctx, 'recorder-worklet');

    workletNode.port.onmessage = (event) => {
      const { rms, samples } = event.data;
      chunksRef.current.push(samples);
      const elapsedMs = performance.now() - recordingStartRef.current;
      const decision = detectorRef.current.feed(rms, elapsedMs);
      if (decision.status === 'stop') {
        workletNode.port.onmessage = null;
        sourceNode.disconnect();
        workletNode.disconnect();
        finishCapture(decision.reason, ctx.sampleRate);
      }
    };

    sourceNode.connect(workletNode);
    workletNode.connect(muteGainRef.current);
    sourceNodeRef.current = sourceNode;
    workletNodeRef.current = workletNode;
  }, [ensureAudioGraph, finishCapture, updateStatus]);

  // Reads statusRef rather than the `status` state variable — this runs
  // from async callbacks (worker 'ready' message, getUserMedia resolution)
  // that fire well after this closure was created, and neither is recreated
  // on every status change, so `status` here could be several renders
  // stale by the time the callback actually executes.
  const maybeBeginCapture = useCallback(() => {
    if (
      modelReadyRef.current &&
      micStreamRef.current &&
      !cancelledRef.current &&
      statusRef.current !== 'recording' &&
      statusRef.current !== 'transcribing'
    ) {
      beginCapture();
    }
  }, [beginCapture]);
  useEffect(() => {
    maybeBeginCaptureRef.current = maybeBeginCapture;
  }, [maybeBeginCapture]);

  const loadAndStart = useCallback(() => {
    updateStatus('loading-model');
    setProgress(0);
    setError(null);

    if (!micStreamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          micStreamRef.current = stream;
          setMicPermissionGranted(true);
          maybeBeginCapture();
        })
        .catch((err) => {
          setMicPermissionGranted(false);
          updateStatus('error');
          setError(mapGetUserMediaError(err));
        });
    }

    const worker = ensureWorker();
    if (!modelReadyRef.current) {
      worker.postMessage({ type: 'load' });
    } else {
      maybeBeginCapture();
    }
  }, [ensureWorker, maybeBeginCapture, updateStatus]);

  const activate = useCallback(() => {
    cancelledRef.current = false;
    if (
      modelReadyRef.current &&
      micStreamRef.current &&
      statusRef.current !== 'recording' &&
      statusRef.current !== 'transcribing'
    ) {
      beginCapture();
      return;
    }
    if (localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted') {
      loadAndStart();
    } else {
      updateStatus('awaiting-consent');
    }
  }, [beginCapture, loadAndStart, updateStatus]);

  const confirmDownload = useCallback(() => {
    cancelledRef.current = false;
    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    loadAndStart();
  }, [loadAndStart]);

  const declineDownload = useCallback(() => {
    cancelledRef.current = true;
    updateStatus('idle');
  }, [updateStatus]);

  useEffect(
    () => () => {
      if (workletNodeRef.current) {
        workletNodeRef.current.port.onmessage = null;
        workletNodeRef.current.disconnect();
      }
      sourceNodeRef.current?.disconnect();
      workerRef.current?.terminate();
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close();
      }
    },
    [],
  );

  return {
    status,
    progress,
    transcript,
    resultSeq,
    error,
    micPermissionGranted,
    activate,
    confirmDownload,
    declineDownload,
  };
}
