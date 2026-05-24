import React, { useEffect, useRef } from 'react';
import { useGamification } from './GamificationContext';
import { useTranslation } from '../i18n/i18n';

/**
 * DailyTaskComplete Component
 * A WCAG-compliant modal that reinforces competence and satisfies autonomy 
 * by letting the user choose their next virtual garden reward.
 */
export default function DailyTaskComplete({ isOpen, onClose, language = 'pl', isHighContrast = false }) {
  const { selectedRewardId, chooseNextReward, unlockSelectedReward } = useGamification();
  const t = useTranslation(language);
  
  const dtc = t.dailyTaskComplete || {};

  const modalRef = useRef(null);

  // WCAG Focus Management: Trap focus inside the dialog when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Available autonomous choices for the user
  const REWARD_OPTIONS = [
    { id: 'oak_tree',  icon: '🌳', name: 'Oak Tree',  desc: 'A symbol of strength and endurance.' },
    { id: 'rose_bush', icon: '🌹', name: 'Rose Bush', desc: 'A beautiful reward for your focus.' },
    { id: 'bonsai',    icon: '🪴', name: 'Bonsai',    desc: 'Represents patience and steady growth.' }
  ];

  const handleConfirmChoice = () => {
    unlockSelectedReward();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      aria-describedby="completion-description"
    >
      <section 
        ref={modalRef}
        tabIndex="-1"
        className={`w-full max-w-lg rounded-[2rem] p-8 shadow-2xl focus:outline-none ${
          isHighContrast 
            ? 'bg-black border-4 border-white text-white' 
            : 'bg-white border border-slate-100 text-slate-800'
        }`}
      >
        {/* Affirmative Feedback (Competence) */}
        <header className="flex flex-col items-center text-center mb-8" aria-live="polite">
          <div className="text-6xl mb-4 drop-shadow-md" aria-hidden="true">🧠</div>
          <h1 id="completion-title" className="text-3xl font-black mb-2">
          {dtc.title || 'Excellent Effort Today!'}
          </h1>
          <p id="completion-description" className={`text-sm font-medium ${isHighContrast ? 'text-white/80' : 'text-slate-500'}`}>
          {dtc.desc || 'You have completed your daily practice. Your consistency is building strong foundations.'}
          </p>
        </header>

        {/* Choice Selection (Autonomy) */}
        <div className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-center mb-4 opacity-70">
          {dtc.chooseReward || 'Choose your next reward to grow'}
          </h2>
          
          <ul className="flex flex-col gap-3" role="radiogroup" aria-label="Available plants to grow">
            {REWARD_OPTIONS.map((option) => {
              const isSelected = selectedRewardId === option.id;
              return (
                <li key={option.id}>
                  <button
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => chooseNextReward(option.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-indigo-400 focus:outline-none ${
                      isSelected 
                        ? (isHighContrast ? 'bg-white text-black border-white' : 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md')
                        : (isHighContrast ? 'bg-black text-white border-white/30 hover:border-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')
                    }`}
                  >
                    <span className="text-3xl" aria-hidden="true">{option.icon}</span>
                    <div className="text-left flex-1">
                      <span className="block font-bold text-lg leading-none mb-1">{option.name}</span>
                      <span className={`block text-xs ${isSelected ? (isHighContrast ? 'text-black/70' : 'text-emerald-600') : (isHighContrast ? 'text-white/60' : 'text-slate-400')}`}>
                        {option.desc}
                      </span>
                    </div>
                    {/* Visual checkmark for cognitive clarity */}
                    {isSelected && <span className="text-xl" aria-hidden="true">✔️</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={handleConfirmChoice}
          disabled={!selectedRewardId}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all focus-visible:ring-4 focus-visible:ring-indigo-400 focus:outline-none ${
            !selectedRewardId 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
              : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl')
          }`}
        >
        {dtc.plantSeed || 'Plant Seed & Continue'}
        </button>
      </section>
    </div>
  );
}