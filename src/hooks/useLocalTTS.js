import { useCallback, useEffect, useRef, useState } from 'react';

// Local, in-browser TTS (meSpeak/eSpeak formant synthesis, see ttsWorker.js)
// for browsers that report zero installed system voices — mainly desktop
// Firefox/Opera, which unlike Chrome have no bundled network voices of
// their own and depend entirely on OS-registered ones. Only ever
// instantiated by App.jsx, which decides whether the native engine has
// usable voices at all.
//
// Previously ran a neural VITS model here, gated behind an explicit
// download-consent modal (~110MB). That model was swapped for meSpeak — a
// rule-based, classically "robotic"-sounding engine that trades voice
// naturalism for synthesis that completes in well under a second (the
// neural model took 25-90s *per read-aloud click*, not just once) and a
// one-time engine download small enough not to need its own consent step.
export function useLocalTTS() {
  // idle | loading-model | synthesizing | error
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const statusRef = useRef('idle');
  const workerRef = useRef(null);
  // Which languages' voices the worker has already finished loading —
  // mirrored here (not just inside the worker) so speak() knows whether to
  // go straight to 'synthesize' or send 'load' first, without a round trip.
  const loadedLanguagesRef = useRef(new Set());
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  // The one request currently in flight (loading or synthesizing) — TTS
  // only ever needs to say one thing at a time, so a new speak() call
  // always supersedes whatever was pending, the same way
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
  // those calls fired before a voice finished loading once would each send
  // its own 'load'.
  const loadInFlightRef = useRef(new Set());
  // True while the worker is actually synthesizing some request. Mirrors
  // loadInFlightRef's reasoning for the *already loaded* fast path.
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
    (requestId, wavBytes) => {
      if (requestId !== requestIdRef.current || cancelledRef.current) return;
      const ctx = ensureAudioContext();
      const rate = pendingRef.current?.rate || 1;
      ctx.decodeAudioData(wavBytes.buffer, (buffer) => {
        if (requestId !== requestIdRef.current || cancelledRef.current) return;
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
      });
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
      if (type === 'ready') {
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
        playAudio(event.data.requestId, event.data.audio);
      } else if (type === 'error') {
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
      startRequest(pendingRef.current);
    },
    [startRequest],
  );

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    requestIdRef.current += 1;
    sourceNodeRef.current?.stop?.();
    sourceNodeRef.current = null;
    pendingRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    updateStatus('idle');
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
    error,
    isSpeaking,
    isPaused,
    speak,
    cancel,
    pause,
    resume,
  };
}
