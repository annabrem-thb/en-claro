import { memo } from 'react';

import { ACHIEVEMENTS } from '../data/achievements.js';

// Mirrors NewTreeToast.jsx/AffirmationToast.jsx, with one difference: takes
// just the unlocked achievement's *id* (from useAchievements.js) and
// resolves title/desc via t() here, at render time, rather than the hook
// pre-resolving them once at unlock time — see useAchievements.js's own
// comment for why (an achievement already met on the very first render can
// unlock before the app's language-sync effect has run).
function AchievementToastComponent({ achievementId, t, isHighContrast, noFlash }) {
  if (!achievementId) return null;
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!achievement) return null;

  return (
    <div
      className="pointer-events-none fixed top-16 left-1/2 z-110 w-full max-w-sm -translate-x-1/2 px-4 sm:top-20"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex items-center gap-3 rounded-3xl border-2 p-4 shadow-2xl sm:gap-4 sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-top-8 fade-in duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-amber-700 bg-amber-900 text-white'}`}
      >
        <span
          className="text-4xl drop-shadow-md sm:text-5xl"
          aria-hidden="true"
        >
          {achievement.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-xs font-black tracking-widest uppercase sm:text-sm">
            {t(achievement.titleKey)}
          </h4>
          <p
            className={`text-[10px] leading-tight font-medium wrap-break-word hyphens-auto sm:text-xs ${isHighContrast ? 'text-white/80' : 'text-amber-50'}`}
          >
            {t(achievement.descKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(AchievementToastComponent);
