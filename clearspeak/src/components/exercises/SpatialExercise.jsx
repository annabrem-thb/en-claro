import React, { useState, useEffect, useCallback } from 'react';
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * SpatialExercise Component
 * Refactored to use centralized utilities for voice recognition and text processing.
 * Focuses on directional or spatial recognition tasks using flashcards.
 */
function SpatialExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language,
  t,
  speak,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState('');

  // Centralized voice logic using custom hook
  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  const [activeHighlight, setActiveHighlight] = useState(null);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  const clearAudioTimeouts = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
      window.speechSynthesis.cancel();
    };
  }, [clearAudioTimeouts]);

  const currentItem = data.items[currentIndex];

  // Delayed feedback on error with visual indication
  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(() => {
      window.speechSynthesis.cancel();
      clearAudioTimeouts();

      const currentTaskItem = data.items[currentIndex];
      const correctIndex = data.options.findIndex((o) => o.value === currentTaskItem.target);
      
      if (correctIndex !== -1) {
        const correctOpt = data.options[correctIndex];
        const cleanLabel = correctOpt.label.replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FACF}\u{1FAD0}-\u{1FADF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
          '',
        );

        setActiveHighlight(correctIndex);
        speak(cleanLabel, extendedTime);

        setSafeTimeout(() => {
          setActiveHighlight(null);
        }, cleanLabel.length * (extendedTime ? 100 : 75) + 1500);
      }
    }, extendedTime ? 3500 : 2500);
  }, [onError, setSafeTimeout, clearAudioTimeouts, data, currentIndex, speak, extendedTime]);

  /**
   * Logic for selecting an answer.
   * Includes transition animations between items in a multi-item task.
   */
  const handleChoice = (selectedValue) => {
    clearAudioTimeouts();
    window.speechSynthesis.cancel();
    if (selectedValue === currentItem.target) {
      if (currentIndex + 1 >= data.items.length) {
        onSuccess();
      } else {
        if (!noFlash) {
          // Trigger card transition animation
          setAnimation('scale-95 opacity-0 transition-all duration-200');
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
            setAnimation('animate-in slide-in-from-right fade-in duration-300');
          }, 200);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    } else {
      handleMistake();
    }
  };

  /**
   * Voice Recognition Callbacks
   * Maps spoken numbers (1-4) to the corresponding option value.
   */
  const handleVoiceMatch = (num) => {
    const option = data.options[num - 1];
    if (option) handleChoice(option.value);
    else handleMistake();
  };

  // --- Read Instruction & Options Aloud Logic ---
  const readInstructionAndOptions = () => {
    window.speechSynthesis.cancel();
    clearAudioTimeouts();

    speak(data.instruction, extendedTime);
    let delayAcc = (data.instruction || '').length * (extendedTime ? 100 : 75) + 1500;

    data.options.forEach((opt, index) => {
      const optionPrefix =
        {
          pl: `Opcja ${index + 1}: `,
          en: `Option ${index + 1}: `,
          de: `Option ${index + 1}: `,
        }[language] || `Option ${index + 1}: `;

      // Strip emojis from the label for the Text-to-Speech engine
      // to ensure clean pronunciation without character codes.
      const cleanLabel = opt.label.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FACF}\u{1FAD0}-\u{1FADF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        '',
      );
      
      // Remove colon from the prefix so TTS doesn't cut the sentence short
      const spokenPrefix = optionPrefix.replace(':', '.');
      const fullSpokenText = `${spokenPrefix} ${cleanLabel}`;
      
      // Calculate pause duration based on SPOKEN text with a safe buffer
      const stepDuration = fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;
      
      setSafeTimeout(() => {
        setActiveHighlight(index);
        speak(fullSpokenText);
      }, delayAcc);
      
      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === index ? null : prev));
      }, delayAcc + stepDuration - 200);

      delayAcc += stepDuration;
    });
  };

  // Dynamic Class Definitions based on a11y props
  const btnPadding = bigTargets ? 'py-8' : 'py-6';
  const cardSize = bigTargets ? 'w-52 h-64 text-9xl' : 'w-44 h-56 text-8xl';
  const pulseClass = noFlash
    ? 'bg-red-500'
    : 'bg-red-500 animate-pulse ring-4 ring-red-100';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl'
    : 'w-12 h-12 text-xl';

  return (
    <div className="flex min-h-96 w-full flex-col items-center justify-between">
      {/* 1. Voice & Audio Controls */}
      <div className="mb-2 flex shrink-0 gap-4">
        <TTSController
          onReadAloud={readInstructionAndOptions}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={controlBtnSize}
        />

        <button
          onClick={() => startListening(handleVoiceMatch)}
          className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-md transition-all active:scale-95 ${
            isListening
              ? pulseClass + ' text-white'
              : `${themeStyles.button} text-white hover:brightness-110`
          }`}
          aria-label={isListening ? t.listening : t.speakOptionNumber}
          aria-pressed={isListening}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      {transcript && (
        <p className="mb-2 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {t.heard}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      {/* 2. Header & Progress Dots (Hidden in Zen Mode) */}
      <div className="mb-4 w-full shrink-0 text-center">
        {!zenMode && (
          <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            <BionicText text={data.instruction} enabled={bionicReading} />
          </h3>
        )}

        {!zenMode && (
          <div className="flex justify-center gap-1.5">
            {data.items.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? `w-6 ${themeStyles.button}`
                    : i < currentIndex
                      ? `w-2 ${themeStyles.button} opacity-30`
                      : 'w-2 bg-slate-100'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Main Flashcard Area */}
      <div className="my-4 flex min-h-0 w-full flex-1 items-center justify-center">
        <div
          className={`${cardSize} font-dyslexic flex items-center justify-center rounded-[50px] border-4 bg-white shadow-xl transition-all ${themeStyles.border} ${themeStyles.accent} ${animation}`}
        >
          {/* Symbols often require bolding for d/b or p/q differentiation */}
          <BionicText text={currentItem?.symbol} enabled={bionicReading} />
        </div>
      </div>

      {/* 4. Choice Buttons Grid */}
      <div className="grid w-full max-w-sm shrink-0 grid-cols-2 gap-4 px-4">
        {data.options?.map((option, i) => (
          <button
            key={i}
            onClick={() => handleChoice(option.value)}
            disabled={isListening}
            className={`relative ${btnPadding} rounded-[35px] border-b-4 text-lg font-black tracking-widest uppercase transition-all active:translate-y-1 active:border-b-0 ${
              isListening 
                ? 'border-slate-500 bg-slate-400 opacity-50 grayscale text-white' 
                : activeHighlight === i
                  ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 border-yellow-400 text-slate-900 shadow-xl z-10'
                  : `${themeStyles.button} text-white hover:brightness-110`
            } flex items-center justify-center gap-2 shadow-lg`}
          >
            {/* Numeric visual indicator for voice selection */}
            <span
              className="absolute top-3 left-4 text-xs font-black text-white/50"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <BionicText text={option.label} enabled={bionicReading} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SpatialExercise;
