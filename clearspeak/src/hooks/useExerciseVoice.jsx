import { useState, useCallback, useEffect, useRef } from 'react';

// Single spoken Latin letters (plus PL/DE diacritics) map straight through
// as a one-character transcript on every engine tested — recognized
// letter-by-letter dictation doesn't need a phonetic alphabet lookup table,
// just normalization of what the browser already returns.
const SINGLE_LETTER_PATTERN = /^[a-ząćęłńóśźżäöüß]$/i;

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
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        // Previously a silent no-op: tapping the mic button did nothing at
        // all, with no way for the UI to explain why. `unsupported` lets
        // VoiceAnswerButton show a real message instead (e.g. "try Chrome
        // or Edge") and disable itself rather than staying a dead control.
        setError('unsupported');
        return;
      }
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
        const rawResult = event.results[0][0].transcript.toLowerCase().trim();
        // Strip trailing/leading punctuation some engines include (e.g.
        // "sprawdź." or "check!") before command/number/letter matching —
        // matters most for languages whose command words are short and can
        // otherwise fail a strict regex match on the trailing mark alone.
        const result = rawResult.replace(/^[.,!?;:]+|[.,!?;:]+$/g, '');
        setTranscript(result);
        // Fires unconditionally, independent of the command/number/letter
        // routing below — free-text exercises (e.g. "say the word you
        // heard") need the raw transcript itself, not a parsed selection,
        // and calling this straight from the event handler (rather than
        // relying on a `transcript` state-change effect downstream) means
        // saying the same word twice in a row still triggers a fresh check
        // instead of silently no-oping when React bails out of a same-value
        // state update.
        onWordMatch?.(result);

        const commandPatterns = {
          undo: t?.('commands.undo', { returnObjects: true }) || [
            'undo',
            'cofnij',
            'zurück',
          ],
          check: t?.('commands.check', { returnObjects: true }) || [
            'check',
            'sprawdź',
            'prüfen',
          ],
          skip: t?.('commands.skip', { returnObjects: true }) || [
            'skip',
            'pomiń',
            'überspringen',
          ],
          next: t?.('commands.next', { returnObjects: true }) || [
            'next',
            'dalej',
            'weiter',
          ],
        };
        for (const [command, phrases] of Object.entries(commandPatterns)) {
          const regex = new RegExp(phrases.join('|'), 'i');
          if (regex.test(result)) {
            onCommandMatch?.(command);
            return;
          }
        }

        const numbers = {
          1: /1|jeden|one|first|eins/i,
          2: /2|dwa|two|second|zwei/i,
          3: /3|trzy|three|third|drei/i,
          4: /4|cztery|four|fourth|vier/i,
          5: /5|pięć|five|fifth|fünf/i,
        };
        for (const [num, regex] of Object.entries(numbers)) {
          if (regex.test(result)) {
            onNumberMatch?.(parseInt(num));
            return;
          }
        }

        if (onLetterMatch && SINGLE_LETTER_PATTERN.test(result)) {
          onLetterMatch(result);
        }
      };
      recognition.start();
    },
    [language, t, stopSpeaking, abortListening],
  );

  return {
    isListening: isListening,
    transcript: transcript,
    error: error,
    micPermissionGranted: micPermissionGranted,
    stopSpeaking: stopSpeaking,
    startListening: startListening,
    abortListening: abortListening,
  };
}
