import { useState, useEffect, useCallback } from 'react';

import { safeJSONParse } from '../utils/safeJSONParse.js';

// Single source of truth for gamification state: one monotonically
// increasing growthValue and the classic/gamified mode toggle. Consumed
// exclusively through GamificationContext's useGamification().
//
// growthValue is only ever awarded while isGamified is true, and only for a
// correctly answered exercise (handleSuccess in useExerciseSession.js).
// Errors and skips never increment it (handleSkip in App.jsx doesn't touch
// it). The gate lives in the setter returned below rather than in
// useExerciseSession.js, because that hook must stay mode-agnostic (see
// productInvariants.test.js): the same exercise flow runs in both
// conditions, and only this state decides whether the counter moves.
//
// During a guided study-mode session (see useStudyMode.js), isGamified is
// driven by the current block rather than this toggle — App.jsx overrides
// it there. Outside of that, this is the only source for it.
export function useGamificationState() {
  const [growthValue, setGrowthValueRaw] = useState(
    () => Number(localStorage.getItem('growthValue')) || 0,
  );
  const [isGamified, setIsGamified] = useState(() =>
    safeJSONParse(localStorage.getItem('cfg_gamified'), false),
  );

  useEffect(() => {
    localStorage.setItem('growthValue', String(growthValue));
  }, [growthValue]);

  useEffect(() => {
    localStorage.setItem('cfg_gamified', JSON.stringify(isGamified));
  }, [isGamified]);

  const setGrowthValue = useCallback(
    (next) => {
      if (!isGamified) return;
      setGrowthValueRaw(next);
    },
    [isGamified],
  );

  return {
    growthValue: growthValue,
    setGrowthValue: setGrowthValue,
    isGamified: isGamified,
    setIsGamified: setIsGamified,
  };
}
