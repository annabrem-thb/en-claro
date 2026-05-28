import React, { useState } from 'react';
import { useGamification } from './GamificationContext';
import { useTranslation } from '../i18n/i18n';
import { useAppSettings } from '../hooks/useAppSettings';

/**
 * MetacognitiveReflection Component
 * 
 * Replaces traditional, anxiety-inducing score screens (e.g., "8/10").
 * Prompts the user to reflect on their learning experience.
 * Upon completion, it securely triggers the intrinsic reward loop 
 * via GamificationContext (e.g., watering the virtual garden).
 * Supports High Contrast, Reduced Motion (noFlash), and Large Touch Targets (bigTargets).
 */
export default function MetacognitiveReflection({ onReflectionComplete }) {
  const { completeDailyTask } = useGamification();
  const { a11yAddons, inclusiveOptions, language } = useAppSettings();
  const t = useTranslation(language);
  const isHighContrast = a11yAddons?.includes('Kontrast');
  const noFlash = !!(inclusiveOptions?.noFlash || a11yAddons?.includes('Redukcja'));
  const bigTargets = !!(inclusiveOptions?.bigTargets || a11yAddons?.includes('Motorik'));
  
  const [selectedRating, setSelectedRating] = useState(null);
  const refl = t.reflection || {};

  const RATING_OPTIONS = [
    { id: 'difficult', label: refl.options?.difficult?.label || 'Difficult', icon: '⛰️', desc: refl.options?.difficult?.desc || 'I need more time' },
    { id: 'manageable', label: refl.options?.manageable?.label || 'Manageable', icon: '🚶', desc: refl.options?.manageable?.desc || 'I am getting there' },
    { id: 'easy', label: refl.options?.easy?.label || 'Easy', icon: '🚀', desc: refl.options?.easy?.desc || 'I felt confident' }
  ];

  const handleSubmit = () => {
    if (!selectedRating) return;
    
    // Trigger non-punitive gamification loop (rewards effort, not perfection)
    completeDailyTask();
    
    // Proceed to next step or return to dashboard
    onReflectionComplete({ reflection: selectedRating });
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full min-h-0 overflow-hidden px-2 py-4 sm:py-8 max-w-xl mx-auto ${noFlash ? '' : 'animate-in fade-in slide-in-from-right-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}>
      
      <div className={`${bigTargets ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-6xl'} mb-2 sm:mb-6 shrink-0`} aria-hidden="true">🧠</div>
      
      <h2 className={`${bigTargets ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'} font-black text-center mb-1 sm:mb-3 shrink-0 ${isHighContrast ? 'text-white' : 'text-slate-800'}`} aria-live="polite">
        {refl.title || 'A moment of reflection'}
      </h2>
      
      <p className={`text-center font-medium mb-4 sm:mb-8 max-w-sm shrink-0 ${bigTargets ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
        {refl.desc || 'There are no grades here. How comfortable did you feel completing this exercise?'}
      </p>

      {/* Accessible Radio Group for Metacognitive Choices */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-4 sm:mb-8 shrink min-h-0 overflow-y-auto" role="group" aria-label={refl.title || 'Reflection rating'}>
        {RATING_OPTIONS.map((option) => {
          const isSelected = selectedRating === option.id;
          return (
            <button
              key={option.id}
              aria-pressed={isSelected}
              onClick={() => setSelectedRating(option.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 sm:gap-2 ${bigTargets ? 'p-4 sm:p-8' : 'p-3 sm:p-6'} rounded-3xl border-2 transition-all active:scale-95 focus:outline-none focus-visible:ring-4 shrink-0 sm:shrink ${
                isSelected
                  ? (isHighContrast ? 'bg-white text-black border-white ring-4 ring-white/30' : 'bg-indigo-50 border-indigo-400 text-indigo-800 shadow-md')
                  : (isHighContrast ? 'bg-black text-white border-white/30 hover:border-white/60' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50')
              }`}
            >
              <span className={`${bigTargets ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'} mb-1 sm:mb-2`} aria-hidden="true">{option.icon}</span>
              <span className={`font-bold ${bigTargets ? 'text-base' : 'text-sm'} uppercase tracking-widest`}>{option.label}</span>
              <span className={`text-center ${bigTargets ? 'text-xs' : 'text-[10px]'} ${isSelected ? (isHighContrast ? 'text-black/70' : 'text-indigo-600/70') : (isHighContrast ? 'text-white/50' : 'text-slate-400')}`}>
                {option.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submission Action */}
      <div className="w-full max-w-sm mt-auto pt-2 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={!selectedRating}
          className={`w-full ${bigTargets ? 'py-4 sm:py-6 text-sm sm:text-base' : 'py-3.5 sm:py-5 text-xs sm:text-sm'} rounded-full font-black uppercase tracking-widest transition-all focus-visible:ring-4 focus:outline-none ${
            !selectedRating
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              : (isHighContrast ? 'bg-white text-black hover:bg-slate-200 shadow-lg' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl')
          }`}
        >
          {refl.save || 'Save & Water Plant'}
        </button>
      </div>

    </div>
  );
}