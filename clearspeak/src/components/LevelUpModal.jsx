import { memo } from 'react';

import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';

// The "another daily goal reached" celebration dialog. It only knows how to
// render itself and report "the user pressed Next" via onNext — deciding
// whether that press should resume the exercise queue or open the pending
// feedback survey is orchestration logic that belongs in App.jsx, not here.
//
// Built on the shared Dialog wrapper (the same one used for the feedback
// survey) instead of a bare `role="dialog"` div: this modal appears
// automatically whenever a daily goal is reached, without the user
// deliberately clicking anything, so a keyboard or screen-reader user has no
// other way to discover it. Dialog gives it a real focus trap, focus moving
// onto it the moment it opens, focus returning to whatever was focused
// before, and Escape-to-close — none of which a plain div can provide.
// Escape maps to the same onNext handler as the button, since this dialog
// has exactly one way to resolve (acknowledge and continue).
function LevelUpModalComponent({
  open,
  isHighContrast,
  noFlash,
  bigTargets,
  t,
  onNext,
  bionicReading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onNext}
      labelledBy="level-up-title"
      overlayClassName={`fixed inset-0 z-50 flex items-center justify-center p-6 text-center ${isHighContrast ? 'bg-black/90 backdrop-blur-sm' : 'bg-slate-50/90 backdrop-blur-md'}`}
      className={`flex w-full max-w-sm flex-col items-center rounded-4xl border p-6 shadow-lg sm:p-10 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-700'} ${isHighContrast ? 'border-white bg-black' : 'border-slate-200 bg-white'}`}
    >
      <div
        className={`mb-4 text-5xl opacity-80 drop-shadow-md ${noFlash ? '' : 'animate-bounce'}`}
        aria-hidden="true"
      >
        🌱
      </div>
      <h2
        id="level-up-title"
        className={`mb-4 text-2xl font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
      >
        <BionicText
          text={t('levelUpTitle') || 'Your garden is growing!'}
          enabled={bionicReading}
        />
      </h2>
      <p
        className={`mb-8 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
      >
        <BionicText
          text={
            t('levelUpDesc') || 'Another goal has been successfully achieved.'
          }
          enabled={bionicReading}
        />
      </p>
      <button
        onClick={onNext}
        className={`w-full ${bigTargets ? 'py-7 text-xl' : 'py-4 text-lg'} rounded-3xl font-bold transition-all active:scale-95 ${isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        <BionicText text={t('next') || 'Next'} enabled={bionicReading} />
      </button>
    </Dialog>
  );
}

export default memo(LevelUpModalComponent);
