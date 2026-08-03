import React, { useState } from 'react';

import { useTranslation } from '../i18n/i18n';

import { useGamification } from './GamificationContext';
import { useUserSettingsContext } from './UserSettingsContext';

export default function MetacognitiveReflection({ onReflectionComplete }) {
  const { completeDailyTask } = useGamification();
  const { settings } = useUserSettingsContext();
  const { language } = settings;
  const t = useTranslation(language);
  const isHighContrast = settings.contrast;
  const noFlash = !!(settings.noFlash || settings.motion);
  const bigTargets = !!(settings.bigTargets || settings.motorik);

  const [selectedRating, setSelectedRating] = useState(null);
  const refl = t.reflection || {};

  const RATING_OPTIONS = [
    {
      id: 'difficult',
      label: refl.options?.difficult?.label || 'Difficult',
      icon: '⛰️',
      desc: refl.options?.difficult?.desc || 'I need more time',
    },
    {
      id: 'manageable',
      label: refl.options?.manageable?.label || 'Manageable',
      icon: '🚶',
      desc: refl.options?.manageable?.desc || 'I am getting there',
    },
    {
      id: 'easy',
      label: refl.options?.easy?.label || 'Easy',
      icon: '🚀',
      desc: refl.options?.easy?.desc || 'I felt confident',
    },
  ];

  const handleSubmit = () => {
    if (!selectedRating) return;

    completeDailyTask();

    onReflectionComplete({ reflection: selectedRating });
  };

  return (
    <div
      className={`mx-auto flex h-full min-h-0 w-full max-w-xl flex-col items-center justify-center overflow-hidden px-2 py-4 sm:py-8 ${noFlash ? '' : 'animate-in fade-in slide-in-from-right-8 sm:slide-in-from-bottom-12 duration-500 ease-out'}`}
    >
      <div
        className={`${bigTargets ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-6xl'} mb-2 shrink-0 sm:mb-6`}
        aria-hidden="true"
      >
        🧠
      </div>

      <h2
        className={`${bigTargets ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'} mb-1 shrink-0 text-center font-black sm:mb-3 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
        aria-live="polite"
      >
        {refl.title || 'A moment of reflection'}
      </h2>

      <p
        className={`mb-4 max-w-sm shrink-0 text-center font-medium sm:mb-8 ${bigTargets ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}
      >
        {refl.desc ||
          'There are no grades here. How comfortable did you feel completing this exercise?'}
      </p>

      {}
      <div
        className="mb-4 flex min-h-0 w-full shrink flex-col gap-3 overflow-y-auto sm:mb-8 sm:flex-row sm:gap-4"
        role="group"
        aria-label={refl.title || 'Reflection rating'}
      >
        {RATING_OPTIONS.map((option) => {
          const isSelected = selectedRating === option.id;
          return (
            <button
              key={option.id}
              aria-pressed={isSelected}
              onClick={() => setSelectedRating(option.id)}
              className={`flex flex-1 flex-col items-center justify-center gap-1.5 sm:gap-2 ${bigTargets ? 'p-4 sm:p-8' : 'p-3 sm:p-6'} shrink-0 rounded-3xl border-2 transition-all focus:outline-none focus-visible:ring-4 active:scale-95 sm:shrink ${
                isSelected
                  ? isHighContrast
                    ? 'border-white bg-white text-black ring-4 ring-white/30'
                    : 'border-indigo-400 bg-indigo-50 text-indigo-800 shadow-md'
                  : isHighContrast
                    ? 'border-white/30 bg-black text-white hover:border-white/60'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`${bigTargets ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'} mb-1 sm:mb-2`}
                aria-hidden="true"
              >
                {option.icon}
              </span>
              <span
                className={`font-bold ${bigTargets ? 'text-base' : 'text-sm'} tracking-widest uppercase`}
              >
                {option.label}
              </span>
              <span
                className={`text-center ${bigTargets ? 'text-xs' : 'text-[10px]'} ${isSelected ? (isHighContrast ? 'text-black/70' : 'text-indigo-600/70') : isHighContrast ? 'text-white/50' : 'text-slate-400'}`}
              >
                {option.desc}
              </span>
            </button>
          );
        })}
      </div>

      {}
      <div className="mt-auto w-full max-w-sm shrink-0 pt-2">
        <button
          onClick={handleSubmit}
          disabled={!selectedRating}
          className={`w-full ${bigTargets ? 'py-4 text-sm sm:py-6 sm:text-base' : 'py-3.5 text-xs sm:py-5 sm:text-sm'} rounded-full font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 ${
            !selectedRating
              ? 'cursor-not-allowed bg-slate-200 text-slate-400 opacity-60'
              : isHighContrast
                ? 'bg-white text-black shadow-lg hover:bg-slate-200'
                : 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-500'
          }`}
        >
          {refl.save || 'Save & Water Plant'}
        </button>
      </div>
    </div>
  );
}
