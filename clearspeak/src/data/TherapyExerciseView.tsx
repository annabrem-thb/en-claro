import React, { useState } from 'react';
import { useTherapyStore } from '../store/TherapyStore';

export const TherapyExerciseView: React.FC = () => {
  const { dispatch } = useTherapyStore();

  // Cognitive Chunking: State to display only one micro-task or instruction at a time.
  // This prevents working memory overload by removing extraneous information.
  // Strict absence of time limits, countdown timers, or speed-based metrics.
  const [currentStep, setCurrentStep] = useState<number>(0);

  const exerciseChunks = [
    {
      instruction: "Read the sentence carefully.",
      content: "The company needs to _____ the new strategy.",
      actionLabel: "Next Step"
    },
    {
      instruction: "Select the word that correctly completes the sentence.",
      content: "The company needs to _____ the new strategy.",
      options: ["implement", "impliment", "inplement"]
    }
  ];

  const handleNextStep = () => {
    if (currentStep < exerciseChunks.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = (selectedOption: string) => {
    dispatch({ type: 'COMPLETE_EXERCISE' });
  };

  const currentChunk = exerciseChunks[currentStep];

  // The layout is intentionally devoid of colors, points, timers, or graphics.
  // High contrast text on a plain background minimizes cognitive load.
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-[#fdfaf6] text-slate-900 p-6"
      aria-label="Active Therapy Exercise"
    >
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 tracking-wide leading-relaxed text-slate-600">
          {currentChunk.instruction}
        </h2>
        
        <div className="text-4xl font-medium mb-12 leading-relaxed">
          {currentChunk.content}
        </div>
        
        {/* Minimalist interaction area, single step focused */}
        <div className="flex flex-col gap-4">
          {currentChunk.options ? (
            currentChunk.options.map((option) => (
              <button 
                key={option}
                onClick={() => handleComplete(option)}
                className="p-6 text-xl text-left border-2 border-slate-300 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-colors"
                aria-label={`Option: ${option}`}
              >
                {option}
              </button>
            ))
          ) : (
            <button 
              onClick={handleNextStep}
              className="p-6 text-xl text-center border-2 border-indigo-600 bg-indigo-50 text-indigo-900 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-colors"
              aria-label={currentChunk.actionLabel}
            >
              {currentChunk.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};