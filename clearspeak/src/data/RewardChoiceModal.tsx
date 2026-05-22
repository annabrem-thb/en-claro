import React, { useEffect, useRef } from 'react';
import { useTherapyStore } from '../store/TherapyStore';

const REWARD_OPTIONS = [
  { id: 'oak_sapling', name: 'Oak Sapling', icon: '🌱', desc: 'Plant a strong foundation.' },
  { id: 'fern', name: 'Fern', icon: '🌿', desc: 'Add greenery to your garden.' },
];

export const RewardChoiceModal: React.FC = () => {
  const { dispatch } = useTherapyStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // WCAG Focus Trap Implementation
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-2xl font-bold text-slate-800 mb-2 text-center">
          Excellent Focus!
        </h2>
        <p className="text-slate-600 text-center mb-8">
          Choose a new plant to add to your virtual garden.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REWARD_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => dispatch({ type: 'CHOOSE_REWARD', payload: option.id })}
              className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-500 transition-all"
              aria-label={`Select ${option.name}`}
            >
              <span className="text-4xl mb-3" aria-hidden="true">{option.icon}</span>
              <span className="font-bold text-slate-800">{option.name}</span>
              <span className="text-xs text-slate-500 mt-1 text-center">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};