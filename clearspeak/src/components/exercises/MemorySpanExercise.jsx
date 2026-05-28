// MemorySpanExercise.jsx — a11y-aware with Shared Logic for Voice & Bionic Reading
import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Importing shared components and hooks to prevent code duplication
import BionicText from '../common/BionicText';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * MemorySpanExercise Component
 * Refactored to use centralized hooks for cleaner code.
 * Focuses on sequence memorization and manual/voice recall.
 */
function MemorySpanExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  t,
  language = 'en',
  speak,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
  voiceAssistant = false,
}) {
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  // Centralized voice logic using custom hook
  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  const [activeHighlight, setActiveHighlight] = useState(null);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
      setActiveHighlight(null);
    };
  }, [clearAllTimeouts]);

  const playMemorizationSequence = useCallback(() => {
    if (!data.displayItems) return;
    clearAllTimeouts();
    let delayAcc = 800; // Short pause before starting
    data.displayItems.forEach((item, index) => {
      const textToSpeak = String(item);
      const stepDuration = textToSpeak.length * (extendedTime ? 100 : 75) + 1500; // Long exposure time for memory retention

      setSafeTimeout(() => {
        setActiveHighlight(`mem-${index}`);
        speak(textToSpeak);
      }, delayAcc);

      setSafeTimeout(() => {
        setActiveHighlight(null);
      }, delayAcc + stepDuration - 200);

      delayAcc += stepDuration;
    });

    // Smoothly transition to the recall phase after the sequence is read aloud
    setSafeTimeout(() => {
      setIsMemorizing(false);
      setActiveHighlight(null);
    }, delayAcc + 500);
  }, [data.displayItems, extendedTime, speak, setSafeTimeout, clearAllTimeouts]);

  useEffect(() => {
    if (isMemorizing) {
      playMemorizationSequence();
    }
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [isMemorizing, playMemorizationSequence, clearAllTimeouts]);

  const stableScrambled = useMemo(
    () => (data.scrambled ? [...data.scrambled] : []),
    [data.scrambled],
  );

  const handleSelectItem = (item) => {
    clearAllTimeouts();
    if (isChecking || isMemorizing) return;
    const newSelected = [...selectedItems, item];
    setSelectedItems(newSelected);

    // Validation logic
    if (newSelected.length === data.correct.length) {
      setIsChecking(true);
      const isCorrect = newSelected.every((val, i) => val === data.correct[i]);
      if (isCorrect) {
        onSuccess();
      } else {
        onError();
        const resetDelay = extendedTime ? 1500 : 800;
        setTimeout(() => {
          setSelectedItems([]);
          setIsChecking(false);
        }, resetDelay);
      }
    }
  };

  // Voice recognition logic for numbers
  const handleVoiceMatch = (num) => {
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < stableScrambled.length) {
      const selectedItem = stableScrambled[selectedIndex];
      if (!selectedItems.includes(selectedItem)) {
        handleSelectItem(selectedItem);
      } else {
        onError(); // Item already selected
      }
    } else {
      onError();
    }
  };

  const handleHint = () => speak([...data.correct].reverse().join(', '), true);

  // --- Read Options Aloud Logic ---
  const readAvailableItems = () => {
    clearAllTimeouts();

    speak(data.instruction, extendedTime);

    const charCount = (data.instruction || '').length;
    let delayAcc = charCount * (extendedTime ? 100 : 75) + 1500;

    stableScrambled.forEach((item, index) => {
      if (!selectedItems.includes(item)) {
        const optionPrefix = t.optionPrefix ? t.optionPrefix(index + 1) : `Option ${index + 1}: `;

        // Remove colon from the prefix to prevent the TTS engine from cutting the sentence short
        const spokenPrefix = optionPrefix.replace(':', '.');
        const fullSpokenText = `${spokenPrefix} ${item}`;

        // Calculate the pause duration based on the SPOKEN text length
        const stepDuration = fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;

        setSafeTimeout(() => {
          setActiveHighlight(index);
          speak(fullSpokenText);
        }, delayAcc);

        setSafeTimeout(() => {
          setActiveHighlight((prev) => (prev === index ? null : prev));
        }, delayAcc + stepDuration - 200);

        delayAcc += stepDuration;
      }
    });
  };

  // Dynamic styling
  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const popAnim = noFlash ? '' : 'animate-in pop-in';
  const pulseClass = noFlash ? '' : 'animate-pulse';
  const tileSize = bigTargets ? 'w-20 h-24 sm:w-24 sm:h-28' : 'w-16 h-20 sm:w-20 sm:h-24';
  const tileText = bigTargets ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl';
  const letterBtn = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl rounded-3xl'
    : 'w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-2xl rounded-2xl';
  const hintPadding = bigTargets ? 'px-8 py-4' : 'px-6 py-3';
  const controlBtnSize = bigTargets
    ? 'w-20 h-20 text-3xl'
    : 'w-16 h-16 text-2xl';

  return (
    <div className={`${animClass} flex h-full w-full flex-col items-center justify-between`}>
      <div className="w-full text-center">
        <h3 className="mb-6 px-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          {isMemorizing ? t.memorize || 'Zapamiętaj!' : data.instruction}
        </h3>

        {/* Phase 1: memorization */}
        {isMemorizing ? (
          <div className="flex flex-col items-center gap-6">
            {voiceAssistant && (
              <TTSController
                onReadAloud={playMemorizationSequence}
                pauseAllTimeouts={pauseAllTimeouts}
                resumeAllTimeouts={resumeAllTimeouts}
                t={t}
                controlBtnSize={controlBtnSize}
              />
            )}
            <div
              className={`flex justify-center gap-4 ${pulseClass}`}
              aria-live="polite"
            >
              {data.displayItems?.map((item, i) => (
                <div
                  key={i}
                  className={`${tileSize} rounded-3xl border-4 bg-white transition-all duration-300 flex items-center justify-center ${tileText} font-bold shadow-sm md:shadow-none ${
                    activeHighlight === `mem-${i}`
                      ? 'scale-110 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl border-yellow-400 z-10'
                      : themeStyles.border
                  }`}
                >
                  <BionicText text={String(item)} enabled={bionicReading} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          !zenMode && (
            <div className="mb-8 text-6xl" aria-hidden="true">
              ❓
            </div>
          )
        )}
      </div>

      {/* Phase 2: user input */}
      {!isMemorizing && (
        <div
          className={`flex w-full flex-1 flex-col items-center ${noFlash ? '' : 'animate-in fade-in duration-500'}`}
        >
          {/* Voice Controls */}
          {voiceAssistant && (
            <div className="mb-8 flex gap-6">
              <TTSController
                onReadAloud={readAvailableItems}
                pauseAllTimeouts={pauseAllTimeouts}
                resumeAllTimeouts={resumeAllTimeouts}
                t={t}
                controlBtnSize={controlBtnSize}
              />

              <button
                onClick={() => startListening(handleVoiceMatch)}
                className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                  isListening
                    ? 'animate-pulse bg-red-500 text-white ring-8 ring-red-100'
                    : `${themeStyles.button} text-white hover:brightness-110`
                }`}
                aria-label={isListening ? t.listening : t.speakOptionNumber}
                aria-pressed={isListening}
              >
                {isListening ? '🛑' : '🎤'}
              </button>
            </div>
          )}

          {transcript && (
            <p className="mb-4 text-center text-xs font-black tracking-widest text-slate-400 uppercase">
              {t.heard}: <span className="text-slate-600">{transcript}</span>
            </p>
          )}

          {/* Selected sequence */}
          <div className="mb-6 flex min-h-16 w-full flex-wrap justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl px-4 py-2 font-bold shadow-sm md:shadow-none ${popAnim} ${themeStyles.button} text-white`}
              >
                <BionicText text={String(item)} enabled={bionicReading} />
              </div>
            ))}
          </div>

          {/* Available items Grid */}
          <div className="mb-6 flex w-full max-w-sm flex-wrap justify-center gap-3">
            {stableScrambled.map((item, index) => {
              const isSelected = selectedItems.includes(item);
              return (
                <button
                  key={index}
                  onClick={() => handleSelectItem(item)}
                  disabled={isSelected || isListening}
                className={`relative ${letterBtn} border-2 font-bold transition-all active:scale-90 ${
                  isSelected || isListening 
                    ? 'cursor-default border-slate-200 bg-slate-100 text-slate-400 opacity-30' 
                    : activeHighlight === index
                      ? 'scale-105 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl z-10 border-yellow-400 text-slate-900'
                      : `bg-white shadow-sm md:shadow-none ${themeStyles.border} ${themeStyles.accent} hover:bg-slate-50`
                }`}
                  aria-pressed={isSelected}
                >
                  {!isSelected && (
                    <span
                      className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[9px] text-white shadow-sm"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                  )}
                  <BionicText text={String(item)} enabled={bionicReading} />
                </button>
              );
            })}
          </div>

          {/* Hint Button */}
          {!zenMode && (
            <button
              onClick={handleHint}
              className={`flex items-center gap-2 ${hintPadding} rounded-full bg-slate-100 text-xs font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 active:scale-95`}
            >
              💡 {t.hint || 'Hint'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MemorySpanExercise;
