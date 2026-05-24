import React, { useEffect } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';

/**
 * FocusExerciseLayout Component
 * Enforces a linear, single-task flow by stripping away sidebars and complex navigation.
 * Prevents multitasking and cognitive overload by dedicating 100% of the screen space to one exercise.
 * Supports accessibility: High Contrast, Reduced Motion (noFlash), and Large Targets (bigTargets).
 */
export default function FocusExerciseLayout({ 
  children, 
  onExit, 
  currentTaskNumber, 
  totalTasks,
  categoryColor = 'bg-sky-500',
  t
}) {
  const { a11yAddons, inclusiveOptions } = useAppSettings();
  const isHighContrast = a11yAddons?.includes('Kontrast');
  const noFlash = !!(inclusiveOptions?.noFlash || a11yAddons?.includes('Redukcja'));
  const bigTargets = !!(inclusiveOptions?.bigTargets || a11yAddons?.includes('Motorik'));

  // Ensure the user starts at the top of the screen to prevent disorientation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col ${isHighContrast ? 'bg-black text-white' : 'bg-[#fdfaf6] text-slate-800'}`}
      role="main"
      aria-label={t?.activeExerciseView || "Active Exercise View"}
    >
      {/* Minimal Header */}
      <header className={`flex items-center justify-between ${bigTargets ? 'p-6 sm:p-8' : 'p-4 sm:p-6'} shrink-0 border-b-4 ${isHighContrast ? 'border-white' : categoryColor}`}>
        <button 
          onClick={onExit}
          className={`flex items-center gap-2 ${bigTargets ? 'px-8 py-5 text-base' : 'px-5 py-3 text-sm'} rounded-full font-bold uppercase tracking-widest transition-all active:scale-95 focus-visible:ring-4 focus:outline-none ${
            isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
          }`}
          aria-label={t?.exitExercise || "Exit Exercise and Return to Dashboard"}
        >
          <span className={`${bigTargets ? 'text-2xl' : 'text-lg'} leading-none`} aria-hidden="true">✕</span> 
          <span className="hidden sm:inline">{t?.exit || 'Exit'}</span>
        </button>

        {/* Simplified Progress Bar */}
        <div className="flex items-center gap-4" aria-live="polite">
          <span className={`${bigTargets ? 'text-sm' : 'text-xs'} font-black uppercase tracking-widest opacity-70`}>
            {t?.task || 'Task'} {currentTaskNumber} {t?.of || 'of'} {totalTasks}
          </span>
          <div 
            className={`${bigTargets ? 'w-24 sm:w-40 h-3.5' : 'w-20 sm:w-32 h-2.5'} rounded-full bg-slate-200/50 overflow-hidden shadow-inner`} 
            aria-hidden="true"
          >
            <div 
              className={`h-full transition-all duration-700 ease-out ${isHighContrast ? 'bg-white' : categoryColor}`}
              style={{ width: `${(currentTaskNumber / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Single-Task Flow Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-h-0 overflow-y-auto">
        <div className={`w-full max-w-3xl flex-1 flex flex-col items-center justify-center ${noFlash ? '' : 'animate-in fade-in zoom-in-95 duration-500'}`}>
          {children}
        </div>
      </div>
      
    </div>
  );
}