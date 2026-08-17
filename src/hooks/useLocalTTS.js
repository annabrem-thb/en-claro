import { useCallback, useEffect, useRef, useState } from 'react';

// Local, in-browser neural TTS (MMS-TTS via transformers.js, see
// ttsWorker.js) for browsers that report zero installed system voices —
// mainly desktop Firefox, which unlike Chrome has no bundled network voices
// of its own and depends entirely on OS-registered ones. Mirrors
// useLocalWhisper.js's shape (worker, one-time consent, download-once) —
// speech-out instead of speech-in. Only ever instantiated by App.jsx, which
// decides whether the native engine has usable voices at all.
const CONSENT_STORAGE_KEY = 'localTTSConsent';

export function useLocalTTS() {
  // idle | awaiting-consent | loading-model | synthesizing | error
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const statusRef = useRef('idle');
  const workerRef = useRef(null);
  // Which languages' pipelines the worker has already finished loading —
  // mirrored here (not just inside the worker) so speak() knows whether to
  // go straight to 'synthesize' or send 'load' first, without a round trip.
  const loadedLanguagesRef = useRef(new Set());
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  // The one request currently in flight (awaiting consent, loading, or
  // synthesizing) — TTS only ever needs to say one thing at a time, so a new
  // speak() call always supersedes whatever was pending, the same way
  // speechSynthesis.speak() implicitly cancels-then-speaks.
  const pendingRef = useRef(null);
  const cancelledRef = useRef(false);
  // Bumped on every speak()/cancel() — lets a 'result' or 'ready' message
  // that arrives after the request it answers was superseded be dropped
  // instead of speaking a stale answer or starting a stale synthesis.
  const requestIdRef = useRef(0);
  // Languages with a 'load' message already sent but no 'ready'/'error' back
  // yet. Several exercises (e.g. ContextExercise's readContextAndOptions)
  // call speak() several times in quick succession — one per sentence/
  // option — trusting that each new call cancels the last, exactly like
  // native speechSynthesis.speak() does. Without this guard, every one of
  // those calls fired before the model finished loading once would each
  // send its own 'load', and the single-threaded worker would process them
  // one at a time — session setup, tens of seconds each — turning a handful
  // of near-simultaneous calls into several minutes of silent, invisible
  // backlog before anything was ever heard.
  const loadInFlightRef = useRef(new Set());
  // True while the worker is actually running inference for some request.
  // Mirrors loadInFlightRef's reasoning for the *already loaded* fast path:
  // once a model is cached, every speak() call would otherwise fire its own
  // 'synthesize' immediately, and the same one-at-a-time worker backlog
  // would happen again, just with inference time instead of load time.
  const synthesizeInFlightRef = useRef(false);
  // startRequest is defined after ensureWorker but referenced from inside
  // it (to pick up a request that superseded one whose result just came
  // back) — routed through a ref, kept in sync every render below, so the
  // worker's one-time onmessage closure always calls the current version
  // rather than freezing on whatever startRequest was at worker-creation
  // time.
  const startRequestRef = useRef(null);

  const updateStatus = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  }, []);

  const finishRequest = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    updateStatus('idle');
    const onEnd = pendingRef.current?.onEnd;
    pendingRef.current = null;
    onEnd?.();
  }, [updateStatus]);

  const playAudio = useCallback(
    (requestId, audioData, samplingRate) => {
      if (requestId !== requestIdRef.current || cancelledRef.current) return;
      const ctx = ensureAudioContext();
      const rate = pendingRef.current?.rate || 1;
      const buffer = ctx.createBuffer(1, audioData.length, samplingRate);
      buffer.copyToChannel(audioData, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = rate;
      source.connect(ctx.destination);
      source.onended = finishRequest;
      sourceNodeRef.current = source;
      setIsSpeaking(true);
      setIsPaused(false);
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => source.start());
      } else {
        source.start();
      }
    },
    [ensureAudioContext, finishRequest],
  );

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker(
      new URL('../workers/ttsWorker.js', import.meta.url),
      { type: 'module' },
    );
    worker.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'progress') {
        setProgress(event.data.progress);
      } else if (type === 'ready') {
        loadedLanguagesRef.current.add(event.data.language);
        loadInFlightRef.current.delete(event.data.language);
        const pending = pendingRef.current;
        if (!cancelledRef.current && pending?.language === event.data.language) {
          // Always the *latest* pending request, not necessarily the one
          // whose speak() call originally triggered this load — any calls
          // in between were absorbed by the loadInFlightRef guard in
          // startRequest instead of queuing their own redundant loads.
          startRequestRef.current(pending);
        } else {
          updateStatus('idle');
        }
      } else if (type === 'result') {
        synthesizeInFlightRef.current = false;
        if (
          event.data.requestId !== requestIdRef.current ||
          cancelledRef.current
        ) {
          // Superseded while this was synthesizing — a newer speak() call
          // is now pending; run that instead of playing a stale answer.
          if (pendingRef.current) startRequestRef.current(pendingRef.current);
          else updateStatus('idle');
          return;
        }
        updateStatus('idle');
        playAudio(event.data.requestId, event.data.audio, event.data.samplingRate);
      } else if (type === 'error') {
        // Mirrors useLocalWhisper.js's error logging — the UI only ever
        // shows a generic code, so this is the one place the underlying
        // transformers.js/onnxruntime-web message is visible at all.
        console.error(
          `[useLocalTTS] ${event.data.phase} failed:`,
          event.data.message,
        );
        if (event.data.phase === 'load' && event.data.language) {
          loadInFlightRef.current.delete(event.data.language);
        } else {
          synthesizeInFlightRef.current = false;
        }
        updateStatus('error');
        setError(
          event.data.phase === 'load'
            ? 'local-download-error'
            : 'local-engine-failure',
        );
        const onEnd = pendingRef.current?.onEnd;
        pendingRef.current = null;
        onEnd?.();
      }
    };
    workerRef.current = worker;
    return worker;
  }, [updateStatus, playAudio]);

  const startRequest = useCallback(
    (request) => {
      const worker = ensureWorker();
      if (loadedLanguagesRef.current.has(request.language)) {
        updateStatus('synthesizing');
        if (synthesizeInFlightRef.current) {
          // The worker is already synthesizing an earlier (now superseded)
          // request — pendingRef already holds this one, so the 'result'
          // handler above will pick it up the moment the current inference
          // finishes instead of this piling another 'synthesize' message
          // in behind it.
          return;
        }
        synthesizeInFlightRef.current = true;
        worker.postMessage({
          type: 'synthesize',
          language: request.language,
          text: request.text,
          requestId: request.requestId,
        });
      } else {
        updateStatus('loading-model');
        if (loadInFlightRef.current.has(request.language)) {
          // Same idea as the synthesize guard above, for the load phase —
          // pendingRef holds this request; the 'ready' handler will start
          // it once the one in-flight load finishes.
          return;
        }
        loadInFlightRef.current.add(request.language);
        setProgress(0);
        worker.postMessage({ type: 'load', language: request.language });
      }
    },
    [ensureWorker, updateStatus],
  );

  useEffect(() => {
    startRequestRef.current = startRequest;
  }, [startRequest]);

  const speak = useCallback(
    (text, language, rate, onEnd) => {
      if (!text) {
        onEnd?.();
        return;
      }
      cancelledRef.current = false;
      sourceNodeRef.current?.stop?.();
      sourceNodeRef.current = null;
      setError(null);
      const requestId = ++requestIdRef.current;
      pendingRef.current = { text, language, rate, onEnd, requestId };

      if (localStorage.getItem(CONSENT_STORAGE_KEY) !== 'granted') {
        updateStatus('awaiting-consent');
        return;
      }
      startRequest(pendingRef.current);
    },
    [startRequest, updateStatus],
  );

  const confirmDownload = useCallback(() => {
    cancelledRef.current = false;
    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    if (!pendingRef.current) {
      updateStatus('idle');
      return;
    }
    startRequest(pendingRef.current);
  }, [startRequest, updateStatus]);

  const declineDownload = useCallback(() => {
    cancelledRef.current = true;
    const onEnd = pendingRef.current?.onEnd;
    pendingRef.current = null;
    updateStatus('idle');
    onEnd?.();
  }, [updateStatus]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    requestIdRef.current += 1;
    sourceNodeRef.current?.stop?.();
    sourceNodeRef.current = null;
    pendingRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    if (
      statusRef.current !== 'awaiting-consent' &&
      statusRef.current !== 'loading-model'
    ) {
      updateStatus('idle');
    }
  }, [updateStatus]);

  const pause = useCallback(() => {
    audioCtxRef.current?.suspend();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    audioCtxRef.current?.resume();
    setIsPaused(false);
  }, []);

  useEffect(
    () => () => {
      sourceNodeRef.current?.stop?.();
      workerRef.current?.terminate();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    },
    [],
  );

  return {
    status,
    progress,
    error,
    isSpeaking,
    isPaused,
    speak,
    cancel,
    pause,
    resume,
    confirmDownload,
    declineDownload,
  };
}
