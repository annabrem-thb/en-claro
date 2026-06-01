// ScrabbleExercise.jsx — a11y-aware with Shared Logic for Voice, Bionic Reading & fluid layout
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Importing shared components and hooks to maintain professional architecture
import BionicText from '../common/BionicText';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * ScrabbleExercise Component
 * Refactored to use centralized utilities.
 * Focuses on word assembly from scrambled tiles with image support.
 */
function ScrabbleExercise({
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
  voiceAssistant = true, // Zawsze true z powodu wyjątku w App.jsx
}) {
  const [userScrabble, setUserScrabble] = useState([]);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  const clearAudioTimeouts = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAudioTimeouts]);

  // Predictable shuffle logic based on ID to avoid unnecessary reshuffling on renders
  const shuffledLetters = useMemo(() => {
    if (!data.scrambled && !data.word) return [];
    const letters = [...(data.scrambled || data.word.split('')), ...(data.distractors || [])];
    const seed = (data.id || 0) + data.word.length;
    let m = letters.length,
      tmp,
      i;
    const rand = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    while (m) {
      i = Math.floor(rand(seed + m) * m--);
      tmp = letters[m];
      letters[m] = letters[i];
      letters[i] = tmp;
    }
    return letters;
  }, [data.word, data.id, data.scrambled, data.distractors]);

  // Main validation logic
  const handleDone = useCallback(() => {
    if (userScrabble.length === 0) return;
    const assembled = userScrabble
      .map((x) => x.letter)
      .join('')
      .toUpperCase();
    if (assembled === data.word.toUpperCase()) {
      onSuccess();
    } else {
      onError();
      setUserScrabble([]); // Reset on failure
      // Wait for the error feedback to complete, then read the target word as a hint
      setSafeTimeout(() => {
        speak(data.word, extendedTime);
      }, extendedTime ? 3500 : 2500);
    }
  }, [userScrabble, data.word, onSuccess, onError, setSafeTimeout, speak, extendedTime]);

  // Handle assembly of tiles
  const addLetter = (letter, index) => {
    clearAudioTimeouts();
    if (userScrabble.some((x) => x.index === index)) return;
    setUserScrabble((prev) => [...prev, { letter, index }]);
  };

  // --- Read Word & Available Tiles Aloud ---
  const readWordAndLetters = () => {
    clearAudioTimeouts();

    speak(data.word, extendedTime);
  };

  // Auto-submit logic when all letters are exhausted
  useEffect(() => {
    if (data.word && userScrabble.length === data.word.length) {
      const delay = extendedTime ? 1000 : 500;
      const timer = setTimeout(handleDone, delay);
      return () => clearTimeout(timer);
    }
  }, [userScrabble, data.word, handleDone, extendedTime]);

  // Dynamic Class Definitions
  const animClass = noFlash ? '' : 'animate-in zoom-in duration-500';

  // Responsive dynamic sizing to integrate long words (e.g., German compound words)
  const wordLen = data.word?.length || 0;
  const isLong = wordLen > 12;
  const isVeryLong = wordLen > 18;

  const tileSize = bigTargets
    ? isVeryLong ? 'w-10 h-14 sm:w-14 sm:h-20 text-2xl sm:text-4xl' : isLong ? 'w-11 h-15 sm:w-16 sm:h-22 text-3xl sm:text-5xl' : 'w-12 h-16 sm:w-20 sm:h-24 text-3xl sm:text-5xl'
    : isVeryLong ? 'w-8 h-12 sm:w-12 sm:h-16 text-xl sm:text-3xl' : isLong ? 'w-9 h-13 sm:w-14 sm:h-18 text-2xl sm:text-4xl' : 'w-10 h-14 sm:w-16 sm:h-20 text-2xl sm:text-4xl';

  const letterBtn = bigTargets
    ? 'w-14 h-14 sm:w-24 sm:h-24 text-2xl sm:text-4xl rounded-2xl sm:rounded-[2rem]'
    : 'w-12 h-12 sm:w-20 sm:h-20 text-xl sm:text-3xl rounded-xl sm:rounded-3xl';
  const slideAnim = noFlash ? '' : 'animate-in slide-in-from-bottom-2';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-1 flex-col items-center justify-start pt-6 sm:pt-10 pb-2 px-2 overflow-hidden`}
    >
      {/* 1. Header & Voice Controls */}
      <div className="mb-2 flex w-full shrink-0 flex-col items-center justify-center sm:mb-4">
        {!zenMode && (
          <div
            className="mb-1 text-4xl drop-shadow-sm sm:mb-2 sm:text-6xl shrink-0"
            aria-hidden="true"
          >
            {data.image || '🧩'}
          </div>
        )}

        <div className="mb-2 flex justify-center">
          <TTSController
            onReadAloud={readWordAndLetters}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            t={t}
            controlBtnSize={controlBtnSize}
          />
        </div>
      </div>

      {/* 2. Target Word Slots */}
      <div className="mb-2 sm:mb-4 flex min-h-[3rem] w-full max-w-4xl shrink flex-wrap justify-center gap-1.5 border-b-4 border-dashed border-slate-100 px-2 pt-2 pb-3 sm:mb-6 sm:min-h-16 sm:gap-2 sm:pb-5 min-h-0 overflow-y-auto">
        {userScrabble.map((x, i) => (
          <div
            key={i}
            className={`${tileSize} flex items-center justify-center font-black ${themeStyles.accent} rounded-lg border-2 bg-white shadow-sm md:shadow-none sm:rounded-xl ${themeStyles.border} ${slideAnim}`}
          >
            {x.letter}
          </div>
        ))}
      </div>

      {/* 3. Available Tiles container */}
      <div className="flex w-full max-w-4xl shrink flex-wrap justify-center gap-2 px-2 pt-4 pb-4 sm:gap-3 min-h-0 overflow-y-auto">
        {shuffledLetters.map((l, i) => {
          const isUsed = userScrabble.some((x) => x.index === i);
          return (
            <button
              key={i}
              disabled={isUsed}
              onClick={() => addLetter(l, i)}
              className={`relative ${letterBtn} font-black shadow-md md:shadow-sm transition-all active:scale-90 ${
                isUsed
                  ? 'cursor-default border-slate-200 bg-slate-100 text-slate-400 opacity-30'
                  : activeHighlight === i
                    ? `scale-110 ring-4 ring-yellow-400 bg-yellow-50 shadow-xl z-10 text-slate-900`
                    : 'border-transparent bg-slate-100 text-slate-700 hover:bg-white hover:shadow-lg md:hover:shadow-sm'
              }`}
            >
              {!isUsed && (
                <span
                  className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[9px] text-white shadow-sm sm:h-6 sm:w-6 sm:text-[10px]"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              )}
              {l}
            </button>
          );
        })}
      </div>

      {/* 4. Action Buttons */}
      <div className="mt-auto flex w-full max-w-2xl shrink-0 gap-2 px-2 pt-2 sm:gap-4 sm:pt-4">
        <button
          onClick={() => { clearAudioTimeouts(); setUserScrabble([]); }}
          className={`flex-1 ${bigTargets ? 'py-4' : 'py-3 sm:py-4'} rounded-2xl bg-slate-50 text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-slate-600 sm:text-[10px]`}
        >
          <BionicText text={t.delete || 'Delete'} enabled={bionicReading} />
        </button>
        <button
          onClick={() => { clearAudioTimeouts(); handleDone(); }}
          disabled={userScrabble.length === 0}
          className={`flex-2 ${bigTargets ? 'py-4' : 'py-3 sm:py-4'} ${themeStyles.button} ${themeStyles.buttonText} rounded-2xl font-black shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:grayscale`}
        >
          <BionicText text={t.check || t.done} enabled={bionicReading} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(ScrabbleExercise);
