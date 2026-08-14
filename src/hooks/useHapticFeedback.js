import { useCallback } from 'react';

// Nearly every navigation/menu interaction in the app fires a short
// vibration as tactile confirmation, but only when the platform supports it
// and Zen Mode (which suppresses all non-essential sensory stimulation)
// isn't active. This hook centralizes that three-part guard so call sites
// are a single `vibrate(pattern)` instead of repeating
// `typeof navigator !== 'undefined' && navigator.vibrate && !zenMode` at
// every button handler.
export function useHapticFeedback(zenMode) {
  return useCallback(
    (pattern) => {
      if (typeof navigator !== 'undefined' && navigator.vibrate && !zenMode) {
        navigator.vibrate(pattern);
      }
    },
    [zenMode],
  );
}
