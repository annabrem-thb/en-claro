import { useEffect, useState } from 'react';

import { ACHIEVEMENTS } from '../data/achievements.js';
import { safeJSONParse } from '../utils/safeJSONParse.js';

const STORAGE_KEY = 'cfg_achievements';
const TOAST_DURATION_MS = 6000;

// Discrete milestone badges, complementing the continuous growthValue
// counter — see data/achievements.js for the registry and why each
// unlock condition is sized to fit inside one short guided study block.
// Unlocking is permanent (persisted to localStorage) and, once earned,
// never re-fires; only the most recently unlocked badge id is surfaced
// (justUnlocked) for the caller to show as a toast.
//
// Deliberately returns just the achievement *id*, not its already-
// translated title/desc: an achievement that's already met on the very
// first render (see below) can unlock before App.jsx's own language-sync
// effect (`i18n.changeLanguage(settings.language)`) has run, since that
// effect fires after commit while this unlock happens during render. Any
// string resolved via t() right here would freeze in whatever language
// i18next's static default happens to be at that instant and never
// update again, unlike the rest of the UI. Resolving the copy from the id
// in the consuming component instead (AchievementToast.jsx) keeps it a
// live t() call like every other piece of UI text.
//
// Each condition's "did this just become true" check runs during render,
// mirroring App.jsx's own prevIsGamified pattern (state, not a ref — refs
// may not be mutated unconditionally during render, only in effects/event
// handlers) rather than a useEffect: these three conditions do nothing but
// derive more state from props already available at render time, so
// there's no external system to synchronize with and no need for the
// extra commit+effect cycle (see "You Might Not Need an Effect").
export function useAchievements({
  enabled,
  growthValue,
  consecutiveCorrect,
  gardenVisited,
}) {
  const [unlocked, setUnlocked] = useState(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEY), []),
  );
  const [justUnlocked, setJustUnlocked] = useState(null);

  const growthMet = !!enabled && growthValue >= 1;
  const comboMet = !!enabled && consecutiveCorrect >= 3;
  const gardenMet = !!enabled && !!gardenVisited;

  // Deliberately start all three at `false`, not at the already-computed
  // value: a returning user can load the app with growthValue/isGamified
  // already persisted from before this feature existed, and that first
  // qualifying render should still count as "just became true" for them —
  // tryUnlock()'s own `nextUnlocked.includes(id)` guard makes this a safe
  // no-op for anyone who has already earned the badge.
  const [prevGrowthMet, setPrevGrowthMet] = useState(false);
  const [prevComboMet, setPrevComboMet] = useState(false);
  const [prevGardenMet, setPrevGardenMet] = useState(false);

  if (
    growthMet !== prevGrowthMet ||
    comboMet !== prevComboMet ||
    gardenMet !== prevGardenMet
  ) {
    let nextUnlocked = unlocked;
    let newlyUnlockedId = null;
    const tryUnlock = (id) => {
      if (nextUnlocked.includes(id)) return;
      if (!ACHIEVEMENTS.some((a) => a.id === id)) return;
      nextUnlocked = [...nextUnlocked, id];
      newlyUnlockedId = id;
    };

    if (growthMet && !prevGrowthMet) tryUnlock('firstCorrect');
    if (comboMet && !prevComboMet) tryUnlock('combo3');
    if (gardenMet && !prevGardenMet) tryUnlock('gardenVisit');

    setPrevGrowthMet(growthMet);
    setPrevComboMet(comboMet);
    setPrevGardenMet(gardenMet);
    if (nextUnlocked !== unlocked) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUnlocked));
      setUnlocked(nextUnlocked);
    }
    if (newlyUnlockedId) setJustUnlocked(newlyUnlockedId);
  }

  // Genuinely synchronizing with an external system (a real setTimeout) —
  // this one stays a proper effect, same as useAffirmativeNotifications.js's
  // own auto-dismiss timer.
  useEffect(() => {
    if (!justUnlocked) return undefined;
    const timer = setTimeout(() => setJustUnlocked(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [justUnlocked]);

  return { unlocked, justUnlocked };
}
