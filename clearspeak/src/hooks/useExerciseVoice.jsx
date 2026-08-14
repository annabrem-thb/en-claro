import { useState, useCallback, useEffect, useRef } from 'react';

import {
  hasLocalFallbackSupport,
  hasNativeSpeechRecognition,
} from '../utils/voiceCapabilities.js';
import {
  matchVoiceTranscript,
  normalizeTranscript,
} from '../utils/voiceTranscriptMatcher.js';

import { useLocalWhisper } from './useLocalWhisper.js';

export function useExerciseVoice(language, t) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  // `null` = not yet requested this session; `true`/`false` once the
  // browser has actually reported a result — lets UI distinguish "hasn't
  // tried yet" from "the user said no" without needing the separate
  // Permissions API (which Safari doesn't support for the microphone).
  const [micPermissionGranted, setMicPermissionGranted] = useState(null);
  const recognitionRef = useRef(null);

  // Hooks can't be called conditionally, so this runs unconditionally even
  // on browsers with native support — it stays inert there (nothing ever
  // calls localWhisper.activate()), costing nothing beyond the initial
  // state allocation.
  const localWhisper = useLocalWhisper(language);
  const { activate: activateLocalFallback } = localWhisper;
  // Callbacks passed into the startListening() call that's currently in
  // flight on the fallback path — captured here rather than in a closure
  // like the native path's onresult, since the actual transcript arrives
  // asynchronously from the worker, well after startListening() returns.
  const pendingCallbacksRef = useRef({});
  // Guards the match-triggering effect below against re-running on mount
  // and against React's effect-dependency comparison silently no-oping a
  // second identical transcript in a row (see resultSeq's own comment in
  // useLocalWhisper.js).
  const matchedResultSeqRef = useRef(0);

  useEffect(() => {
    if (localWhisper.resultSeq === matchedResultSeqRef.current) return;
    matchedResultSeqRef.current = localWhisper.resultSeq;
    matchVoiceTranscript(
      localWhisper.transcript,
      t,
      pendingCallbacksRef.current,
    );
  }, [localWhisper.resultSeq, localWhisper.transcript, t]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Cutting a still-listening session off with .abort() — not just letting
  // it run — is what actually matters here. Every exercise using this hook
  // gets remounted on question change (App.jsx's key={exercise-wrapper-...}),
  // but nothing was ever stopping an in-flight SpeechRecognition when that
  // happened: if the mic was tapped and the browser hadn't answered yet by
  // the time the user skipped/answered/swiped away, the old recognition
  // kept listening in the background, then fired onresult — with THIS
  // question's onSuccess/onError baked into its closure — against whatever
  // question is current by the time the browser gets around to it. .stop()
  // would still let a pending result come through with those stale
  // closures; .abort() cuts it off immediately without one. Nulling the
  // handlers first is belt-and-suspenders in case an engine still fires
  // something in response to abort() itself.
  const abortListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
    recognition.onstart = null;
    recognition.abort();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  useEffect(
    () => () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      abortListening();
    },
    [abortListening],
  );

  const startListening = useCallback(
    (onNumberMatch, onCommandMatch, onLetterMatch, onWordMatch) => {
      if (!hasNativeSpeechRecognition()) {
        if (!hasLocalFallbackSupport()) {
          // Previously a silent no-op: tapping the mic button did nothing
          // at all, with no way for the UI to explain why. `unsupported`
          // lets VoiceAnswerButton show a real message instead and disable
          // itself rather than staying a dead control.
          setError('unsupported');
          return;
        }
        pendingCallbacksRef.current = {
          onNumberMatch,
          onCommandMatch,
          onLetterMatch,
          onWordMatch,
        };
        activateLocalFallback();
        return;
      }
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      // A second tap while still listening would otherwise leave the first
      // session's recognition running unattended alongside a brand new one.
      abortListening();
      setError(null);
      stopSpeaking();
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language];
      recognition.interimResults = false;
      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onend = () => {
        setIsListening(false);
        if (recognitionRef.current === recognition)
          recognitionRef.current = null;
      };
      recognition.onerror = (event) => {
        setIsListening(false);
        if (recognitionRef.current === recognition)
          recognitionRef.current = null;
        // 'not-allowed' / 'service-not-allowed' are the spec's codes for a
        // denied or blocked microphone permission — every other error
        // (no-speech, audio-capture, network, aborted, ...) leaves
        // micPermissionGranted alone since they say nothing about
        // permission state, just that this particular attempt failed.
        if (
          event.error === 'not-allowed' ||
          event.error === 'service-not-allowed'
        ) {
          setMicPermissionGranted(false);
        }
        setError(event.error || 'unknown');
      };
      recognition.onresult = (event) => {
        setMicPermissionGranted(true);
        const result = normalizeTranscript(event.results[0][0].transcript);
        setTranscript(result);
        matchVoiceTranscript(result, t, {
          onNumberMatch,
          onCommandMatch,
          onLetterMatch,
          onWordMatch,
        });
      };
      try {
        recognition.start();
      } catch {
        // .start() throws synchronously (rather than firing onerror) when
        // the browser considers the recognition already active — e.g. a
        // same-tab double-tap that outraces the abortListening() call above,
        // or another SpeechRecognition instance elsewhere on the page still
        // holding the mic. Without this catch, onstart never fires, so
        // isListening stays false forever and every symptom the user sees
        // is "I press the mic and nothing happens" with no way to recover
        // short of reloading — recognitionRef.current stayed pointed at
        // this dead instance, so the *next* tap's abortListening() would
        // call .abort() on an object that never started instead of setting
        // up a fresh one.
        recognitionRef.current = null;
        setIsListening(false);
        setError('start-failed');
      }
    },
    [language, t, stopSpeaking, abortListening, activateLocalFallback],
  );

  const usingLocalFallback =
    !hasNativeSpeechRecognition() && hasLocalFallbackSupport();

  return {
    isListening: usingLocalFallback
      ? localWhisper.status === 'recording' ||
        localWhisper.status === 'transcribing'
      : isListening,
    transcript: usingLocalFallback ? localWhisper.transcript : transcript,
    error: usingLocalFallback ? localWhisper.error : error,
    micPermissionGranted: usingLocalFallback
      ? localWhisper.micPermissionGranted
      : micPermissionGranted,
    stopSpeaking: stopSpeaking,
    startListening: startListening,
    abortListening: abortListening,
    // Only meaningful on the fallback path — VoiceAnswerButton treats
    // `undefined` as "nothing to show," so native-engine callers see no
    // change at all.
    voiceStatus: usingLocalFallback ? localWhisper.status : undefined,
    modelDownloadProgress: usingLocalFallback
      ? localWhisper.progress
      : undefined,
    confirmModelDownload: usingLocalFallback
      ? localWhisper.confirmDownload
      : undefined,
    declineModelDownload: usingLocalFallback
      ? localWhisper.declineDownload
      : undefined,
  };
}
