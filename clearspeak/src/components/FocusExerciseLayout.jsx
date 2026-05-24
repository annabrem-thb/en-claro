import React, { useEffect } from 'react';
import { useAppSettings } from '../hooks/useAppSettings';

/**
 * FocusExerciseLayout Component
 * Enforces a "Linear, Single-Task Flow" by stripping away sidebars, complex navigation, 
 * and gamification stats. This aggressively prevents multitasking and cognitive overload 
 * by giving 100% of the screen space to one single exercise at a time.
 */
export default function FocusExerciseLayout({ 
  children, 
  onExit, 
  currentTaskNumber, 
  totalTasks,
  categoryColor = 'bg-sky-500' // Inherits color-coding from the selected task type
}) {
  const { a11yAddons, inclusiveOptions } = useAppSettings();
  const isHighContrast = a11yAddons?.includes('Kontrast');
  const noFlash = !!(inclusiveOptions?.noFlash || a11yAddons?.includes('Redukcja'));

  // Ensure the user starts at the top of the screen to prevent disorientation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col ${isHighContrast ? 'bg-black text-white' : 'bg-[#fdfaf6] text-slate-800'}`}
      role="main"
      aria-label="Active Exercise View"
    >
      {/* Minimal Header: No menus, just a way out and a clear, simple progress indicator */}
      <header className={`flex items-center justify-between p-4 sm:p-6 shrink-0 border-b-4 ${isHighContrast ? 'border-white' : categoryColor}`}>
        <button 
          onClick={onExit}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all active:scale-95 focus-visible:ring-4 focus:outline-none ${
            isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'
          }`}
          aria-label="Exit Exercise and Return to Dashboard"
        >
          <span className="text-lg leading-none" aria-hidden="true">✕</span> 
          <span className="hidden sm:inline">Exit</span>
        </button>

        {/* Simplified Progress: Just a clean bar to manage expectations without numeric point anxiety */}
        <div className="flex items-center gap-4" aria-live="polite">
          <span className="text-xs font-black uppercase tracking-widest opacity-70">
            Task {currentTaskNumber} of {totalTasks}
          </span>
          <div 
            className="w-20 sm:w-32 h-2.5 rounded-full bg-slate-200/50 overflow-hidden shadow-inner" 
            aria-hidden="true"
          >
            <div 
              className={`h-full transition-all duration-700 ease-out ${isHighContrast ? 'bg-white' : 'bg-white'}`}
              style={{ width: `${(currentTaskNumber / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Single-Task Flow Area: 
          Generous whitespace. Stripped of all sidebars, allowing the eye to comfortably 
          track the single element presented on screen. */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-h-0 overflow-y-auto">
        <div className={`w-full max-w-3xl flex-1 flex flex-col items-center justify-center ${noFlash ? '' : 'animate-in fade-in zoom-in-95 duration-500'}`}>
          {children}
        </div>
      </div>
      
    </div>
  );
}