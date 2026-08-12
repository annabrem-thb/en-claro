import { useEffect, useRef } from 'react';

import { isAudioUnlocked, onAudioUnlocked } from '../utils/audioUnlock.js';

// A small delay before auto-reading: long enough that narration doesn't
// talk over the still-running success/streak announcement from the
// previous answer (useExerciseSession.js already waits 1500-3000ms before
// advancing, so that's normally finished) or the screen's own enter
// animation, short enough that it doesn't feel sluggish.
const AUTO_READ_DELAY_MS = 500;

// Every exercise already defines a zero-argument "read the question/options
// aloud" function wired to a manual TTSController button (only rendered
// `{voiceAssistant && (...)}`). This hook makes that same function fire on
// its own once `enabled` is true, instead of requiring a tap every time —
// "wenn der Sprachassistent aktiviert ist, automatisch Anweisungen/Optionen
// vorlesen" per user request.
//
// Each exercise's `key={...}` in App.jsx remounts the whole exercise
// subtree per question (see App.jsx's `exercise-wrapper-${activeTab}-
// ${currentIndex}`), so a plain effect keyed only on `enabled` fires exactly
// once per fresh question when the assistant is already on, and fires again
// immediately if the learner switches it on mid-question — matching "read
// on activation" literally, not just "read on the next question".
export function useAutoReadAloud(enabled, readAloud) {
  // `readAloud` is read through a ref, updated in its own effect (never
  // written during render — React flags direct `ref.current = ...` in the
  // render body as unsafe under concurrent rendering), rather than listed
  // as a dependency of the effect below: most callers pass a fresh,
  // unmemoized function on every render, so depending on it directly would
  // re-fire the timer on every render instead of only when `enabled`
  // changes.
  const latestReadAloud = useRef(readAloud);
  useEffect(() => {
    latestReadAloud.current = readAloud;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    let unsubscribe;
    const timer = setTimeout(() => {
      // speechSynthesis silently drops a call made before the very first
      // user gesture on mobile browsers (see audioUnlock.js) — if that
      // gesture hasn't happened yet by the time this timer fires (most
      // likely on the very first screen the app shows, with voiceAssistant
      // already on from a previous session), wait for it instead of
      // speaking into a call that would just be dropped.
      if (isAudioUnlocked()) {
        latestReadAloud.current();
      } else {
        unsubscribe = onAudioUnlocked(() => latestReadAloud.current());
      }
    }, AUTO_READ_DELAY_MS);
    return () => {
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, [enabled]);
}
