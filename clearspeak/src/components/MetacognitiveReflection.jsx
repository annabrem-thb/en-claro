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
 */
export default function MetacognitiveReflection({ onReflectionComplete }) {
  const { completeDailyTask } = useGamification();
  const { a11yAddons, inclusiveOptions, language } = useAppSettings();
  const t = useTranslation(language);
  const isHighContrast = a11yAddons?.includes('Kontrast');
  const noFlash = !!(inclusiveOptions?.noFlash || a11yAddons?.includes('Redukcja'));
  
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
    <div className={`flex flex-col items-center justify-center w-full max-w-xl mx-auto py-10 ${noFlash ? '' : 'animate-in fade-in zoom-in-95 duration-500'}`}>
      
      <div className="text-6xl mb-6" aria-hidden="true">🧠</div>
      
      <h2 className={`text-2xl sm:text-3xl font-black text-center mb-3 ${isHighContrast ? 'text-white' : 'text-slate-800'}`} aria-live="polite">
        {refl.title || 'A moment of reflection'}
      </h2>
      
      <p className={`text-center font-medium mb-12 max-w-sm ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
        {refl.desc || 'There are no grades here. How comfortable did you feel completing this exercise?'}
      </p>

      {/* Metacognitive Choices */}
      <div className="flex flex-col sm:flex-row gap-4 w-full mb-12" role="radiogroup" aria-label="Reflection rating">
        {RATING_OPTIONS.map((option) => {
          const isSelected = selectedRating === option.id;
          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedRating(option.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 rounded-3xl border-2 transition-all active:scale-95 focus:outline-none focus-visible:ring-4 ${
                isSelected
                  ? (isHighContrast ? 'bg-white text-black border-white ring-4 ring-white/30' : 'bg-indigo-50 border-indigo-400 text-indigo-800 shadow-md')
                  : (isHighContrast ? 'bg-black text-white border-white/30 hover:border-white/60' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50')
              }`}
            >
              <span className="text-4xl mb-2" aria-hidden="true">{option.icon}</span>
              <span className="font-bold text-sm uppercase tracking-widest">{option.label}</span>
              <span className={`text-[10px] text-center ${isSelected ? (isHighContrast ? 'text-black/70' : 'text-indigo-600/70') : (isHighContrast ? 'text-white/50' : 'text-slate-400')}`}>
                {option.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submission Action */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleSubmit}
          disabled={!selectedRating}
          className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all focus-visible:ring-4 focus:outline-none ${
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