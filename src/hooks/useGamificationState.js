import { useState, useEffect } from 'react';

import { safeJSONParse } from '../utils/safeJSONParse.js';

// Single source of truth for gamification state: one monotonically
// increasing growthValue (incremented by a fixed amount per completed
// exercise unit, independent of correctness, retries or time — practising
// is what's rewarded, not performance) and the classic/gamified mode
// toggle. Consumed exclusively through GamificationContext's
// useGamification().
export function useGamificationState() {
  const [growthValue, setGrowthValue] = useState(
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

  return {
    growthValue: growthValue,
    setGrowthValue: setGrowthValue,
    isGamified: isGamified,
    setIsGamified: setIsGamified,
  };
}
