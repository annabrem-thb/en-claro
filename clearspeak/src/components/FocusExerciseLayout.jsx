import React, { useEffect } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';

export default function FocusExerciseLayout(
  { 
    children, 
    onExit, 
    currentTaskNumber, 
    totalTasks,
    categoryColor = 'bg-sky-500',
    t
  }
) {
  const { a11yAddons, inclusiveOptions } = useAppSettings();
  const isHighContrast = a11yAddons?.includes('Kontrast');
  const noFlash = !!(inclusiveOptions?.noFlash || a11yAddons?.includes('Redukcja'));
  const bigTargets = !!(inclusiveOptions?.bigTargets || a11yAddons?.includes('Motorik'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col min-h-0 overflow-hidden ${isHighContrast ? 'bg-black text-white' : 'bg-[#fdfaf6] text-slate-800'}`}
      role="dialog"
      aria-modal="true"
      aria-label={t?.activeExerciseView || "Active Exercise View"}
    >
      {}
      <header className={`flex items-center justify-between ${bigTargets ? 'p-4 sm:p-6' : 'p-2 sm:p-4'} shrink-0 border-b-4 ${isHighContrast ? 'border-white' : categoryColor} relative z-20 shadow-md`}>
        <button 
          onClick={onExit}
          className={`flex items-center gap-2 ${bigTargets ? 'px-5 py-3 text-sm' : 'px-4 py-2 text-xs'} rounded-full font-bold uppercase tracking-widest transition-all active:scale-95 focus-visible:ring-4 focus:outline-none ${
            isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
          }`}
          aria-label={t?.exitExercise || "Exit Exercise and Return to Dashboard"}
        >
          <span className={`${bigTargets ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'} leading-none`} aria-hidden="true">✕</span> 
          <span className="hidden sm:inline">{t('close')}</span>
        </button>

        {}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0" aria-live="polite" aria-atomic="true">
          <span className={`${bigTargets ? 'text-sm' : 'text-xs'} font-black uppercase tracking-widest opacity-70`}>
            {t?.task || 'Task'} {currentTaskNumber} {t?.of || 'of'} {totalTasks}
          </span>
          <div 
            className={`${bigTargets ? 'w-24 sm:w-48 h-3.5' : 'w-20 sm:w-40 h-2.5'} rounded-full bg-slate-200/50 overflow-hidden shadow-inner`} 
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
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 min-h-0 overflow-hidden">
        <div className={`w-full max-w-4xl flex-1 flex flex-col items-center justify-center min-h-0 shrink ${noFlash ? '' : 'animate-in fade-in slide-in-from-right-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}>
          {children}
        </div>
      </div>

    </div>
  );
}