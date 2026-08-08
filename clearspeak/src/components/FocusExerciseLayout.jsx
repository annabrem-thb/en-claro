import React, { useEffect } from 'react';

import { useUserSettingsContext } from './UserSettingsContext';
import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';

export default function FocusExerciseLayout({
  children,
  onExit,
  currentTaskNumber,
  totalTasks,
  categoryColor = 'bg-sky-500',
  t,
}) {
  const { settings } = useUserSettingsContext();
  const isHighContrast = settings.contrast;
  const noFlash = !!(settings.noFlash || settings.motion);
  const bigTargets = !!(settings.bigTargets || settings.motorik);
  const bionicReading = !!settings.bionicReading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Dialog
      open={true}
      onClose={onExit}
      label={t('activeExerciseView', 'Active Exercise View')}
      overlayClassName="z-[100]"
      className={`flex min-h-full flex-col overflow-hidden outline-none ${isHighContrast ? 'bg-black text-white' : 'bg-[#fdfaf6] text-slate-800'}`}
    >
      {}
      <header
        className={`flex items-center justify-between ${bigTargets ? 'p-4 sm:p-6' : 'p-2 sm:p-4'} shrink-0 border-b-4 ${isHighContrast ? 'border-white' : categoryColor} relative z-20 shadow-md`}
      >
        <button
          onClick={onExit}
          className={`flex items-center gap-2 ${bigTargets ? 'px-5 py-3 text-sm' : 'px-4 py-2 text-xs'} rounded-full font-bold tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 active:scale-95 ${
            isHighContrast
              ? 'bg-white text-black hover:bg-slate-200'
              : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
          }`}
          aria-label={t(
            'exitExercise',
            'Exit Exercise and Return to Dashboard',
          )}
        >
          <span
            className={`${bigTargets ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'} leading-none`}
            aria-hidden="true"
          >
            ✕
          </span>
          <span className="hidden sm:inline">
            <BionicText text={t('close')} enabled={bionicReading} />
          </span>
        </button>

        {}
        <div
          className="flex shrink-0 items-center gap-3 sm:gap-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            className={`${bigTargets ? 'text-sm' : 'text-xs'} font-black tracking-widest uppercase opacity-70`}
          >
            <BionicText text={t('task', 'Task')} enabled={bionicReading} />{' '}
            {currentTaskNumber}{' '}
            <BionicText text={t('of', 'of')} enabled={bionicReading} />{' '}
            {totalTasks}
          </span>
          <div
            className={`${bigTargets ? 'h-3.5 w-24 sm:w-48' : 'h-2.5 w-20 sm:w-40'} overflow-hidden rounded-full bg-slate-200/50 shadow-inner`}
            aria-hidden="true"
          >
            <div
              className={`h-full transition-all duration-700 ease-out ${isHighContrast ? 'bg-white' : categoryColor}`}
              style={{ width: `${(currentTaskNumber / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-2 sm:p-4 md:p-6">
        <div
          className={`flex min-h-0 w-full max-w-4xl flex-1 shrink flex-col items-center justify-center ${noFlash ? '' : 'animate-in fade-in slide-in-from-right-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}
        >
          {children}
        </div>
      </div>
    </Dialog>
  );
}
