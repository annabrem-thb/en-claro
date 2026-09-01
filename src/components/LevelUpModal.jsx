import { memo } from 'react';

import BionicText from './common/BionicText.jsx';

// A brief, self-dismissing notice that the garden has grown one stage.
// App.jsx shows it for a fixed duration and clears it automatically, the
// same way NewTreeToast/AffirmationToast behave — it used to be a focus-
// trapping modal that required an explicit "Next" click before the
// exercise queue would advance, which meant the exercise flow paused on a
// manual interaction whenever this appeared. Advancing must stay on a
// consistent, predictable schedule regardless of the gamification setting,
// so this component no longer drives navigation at all — advancing to the
// next exercise is entirely useExerciseSession's own fixed-delay timer now,
// independent of whether this is showing.
function LevelUpModalComponent({
  open,
  isHighContrast,
  noFlash,
  t,
  bionicReading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-none fixed top-16 left-1/2 z-110 w-full max-w-sm -translate-x-1/2 px-4 sm:top-20"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex items-center gap-3 rounded-3xl border-2 p-4 shadow-2xl sm:gap-4 sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-top-8 fade-in duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-200 bg-white text-slate-700'}`}
      >
        <span
          className="text-4xl drop-shadow-md sm:text-5xl"
          aria-hidden="true"
        >
          🌱
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-sm font-bold">
            <BionicText
              text={t('levelUpTitle') || 'Your garden is growing.'}
              enabled={bionicReading}
            />
          </h4>
          <p
            className={`text-xs leading-relaxed ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}
          >
            <BionicText
              text={
                t('levelUpDesc') || 'Another goal has been reached.'
              }
              enabled={bionicReading}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(LevelUpModalComponent);
