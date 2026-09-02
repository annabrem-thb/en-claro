import { useState, useEffect } from 'react';

import { safeJSONParse } from '../utils/safeJSONParse.js';

import { useVariantOrder } from './useVariantOrder.js';

// How many completed exercise units (growthValue) a participant needs
// before the variant they *didn't* start on becomes selectable. Keeps the
// randomized starting order (useVariantOrder.js) from being undone by
// immediately hopping to the other variant. Exported (rather than also
// returned as a `tasksUntilUnlock` field below) so growthValue stays the
// hook's only numeric field — see the "single monotonic value" invariant
// test — and callers derive the countdown themselves from growthValue.
export const UNLOCK_AFTER_UNITS = 10;

// Single source of truth for gamification state: one monotonically
// increasing growthValue (incremented by a fixed amount per completed
// exercise unit, independent of correctness, retries or time — practising
// is what's rewarded, not performance) and the classic/gamified mode
// toggle. Consumed exclusively through GamificationContext's
// useGamification().
export function useGamificationState() {
  const { variantOrder } = useVariantOrder();
  const [growthValue, setGrowthValue] = useState(
    () => Number(localStorage.getItem('growthValue')) || 0,
  );
  const [isGamified, setIsGamifiedState] = useState(() => {
    const stored = localStorage.getItem('cfg_gamified');
    // Only a configured order overrides the very first launch (no stored
    // preference yet) — once a participant has an actual toggle state
    // saved, that's respected even if `?order=` is present on a later URL.
    if (stored === null && variantOrder) {
      return variantOrder === 'gamifiedFirst';
    }
    return safeJSONParse(stored, false);
  });

  useEffect(() => {
    localStorage.setItem('growthValue', String(growthValue));
  }, [growthValue]);

  useEffect(() => {
    localStorage.setItem('cfg_gamified', JSON.stringify(isGamified));
  }, [isGamified]);

  // The one variant value that's still off-limits, or null once unlocked
  // (or when no order was configured for this device at all).
  const lockedIsGamified =
    variantOrder && growthValue < UNLOCK_AFTER_UNITS
      ? variantOrder === 'classicFirst'
      : null;

  const setIsGamified = (value) => {
    if (lockedIsGamified !== null && value === lockedIsGamified) return;
    setIsGamifiedState(value);
  };

  return {
    growthValue: growthValue,
    setGrowthValue: setGrowthValue,
    isGamified: isGamified,
    setIsGamified: setIsGamified,
    lockedIsGamified: lockedIsGamified,
  };
}
