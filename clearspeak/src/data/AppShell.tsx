import React from 'react';
import { useTherapyStore } from '../store/TherapyStore';
import { TherapyExerciseView } from './TherapyExerciseView';
import { RewardChoiceModal } from './RewardChoiceModal';

export const AppShell: React.FC = () => {
  const { state, dispatch } = useTherapyStore();

  const isExerciseActive = state.currentPhase === 'EXERCISE';

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf6] text-slate-800 font-sans">
      {/* WCAG Standard: Skip link for keyboard users */}
      <a 
        href="#main-content" 
        className="absolute top-[-40px] left-0 bg-indigo-600 text-white p-2 z-[100] focus:top-0 transition-all"
      >
        Skip to main content
      </a>

      {/* Hide the navigation and header completely during an exercise to prevent cognitive overload */}
      {!isExerciseActive && (
        <header role="banner" className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-indigo-900 tracking-tight">FocusTherapy</h1>
          <nav aria-label="Main Navigation" role="navigation" className="flex gap-4">
            <button 
              onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })}
              className="font-medium text-slate-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
              aria-current={state.currentPhase === 'DASHBOARD' ? 'page' : undefined}
            >
              Dashboard
            </button>
            <button 
              onClick={() => dispatch({ type: 'VIEW_GARDEN' })}
              className="font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
              aria-current={state.currentPhase === 'GARDEN' ? 'page' : undefined}
            >
              My Garden ({state.competencePoints} 🌱)
            </button>
          </nav>
        </header>
      )}

      {/* Main Content Area */}
      <main id="main-content" role="main" aria-live="polite" className="flex-1 flex flex-col relative">
        {state.currentPhase === 'DASHBOARD' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <button 
              onClick={() => dispatch({ type: 'START_EXERCISE' })}
              className="bg-indigo-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-indigo-700 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-all"
            >
              Start Daily Practice
            </button>
          </div>
        )}

        {state.currentPhase === 'EXERCISE' && <TherapyExerciseView />}
        
        {state.currentPhase === 'REWARD_CHOICE' && <RewardChoiceModal />}
        
        {state.currentPhase === 'GARDEN' && <div className="p-8 text-center text-xl font-bold text-emerald-800">Virtual Garden Implementation...</div>}
      </main>
    </div>
  );
};