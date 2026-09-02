import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

function ScrabbleExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  t,
  speak,
  ttsFallback,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
  voiceAssistant = true,
  isHighContrast = false,
}) {
  const [userScrabble, setUserScrabble] = useState([]);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

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

  const shuffledLetters = useMemo(() => {
    if (!data.scrambled && !data.word) return [];
    const letters = [
      ...(data.scrambled || data.word.split('')),
      ...(data.distractors || []),
    ];
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
      setUserScrabble([]);
      setSafeTimeout(
        () => {
          speak(data.word, extendedTime);
        },
        extendedTime ? 3500 : 2500,
      );
    }
  }, [
    userScrabble,
    data.word,
    onSuccess,
    onError,
    setSafeTimeout,
    speak,
    extendedTime,
  ]);

  const addLetter = (letter, index) => {
    clearAudioTimeouts();
    if (userScrabble.some((x) => x.index === index)) return;
    setUserScrabble((prev) => [...prev, { letter, index }]);
  };

  const readWordAndLetters = () => {
    clearAudioTimeouts();

    const instruction =
      t('scrabbleInstruction') || 'Arrange the letters to spell the word';
    speak(instruction, extendedTime);
    const delay = instruction.length * (extendedTime ? 90 : 65) + 1200;
    setSafeTimeout(() => speak(data.word, extendedTime), delay);
  };

  useAutoReadAloud(voiceAssistant, readWordAndLetters);

  useEffect(() => {
    if (data.word && userScrabble.length === data.word.length) {
      const delay = extendedTime ? 1000 : 500;
      const timer = setTimeout(handleDone, delay);
      return () => clearTimeout(timer);
    }
  }, [userScrabble, data.word, handleDone, extendedTime]);

  const animClass = noFlash ? '' : 'animate-in zoom-in duration-500';

  const wordLen = data.word?.length || 0;
  const isLong = wordLen > 12;
  const isVeryLong = wordLen > 18;

  const tileSize = bigTargets
    ? isVeryLong
      ? 'w-8 h-10 sm:w-14 sm:h-20 text-xl sm:text-4xl'
      : isLong
        ? 'w-10 h-12 sm:w-16 sm:h-22 text-2xl sm:text-5xl'
        : 'w-12 h-16 sm:w-20 sm:h-24 text-3xl sm:text-5xl'
    : isVeryLong
      ? 'w-6 h-8 sm:w-12 sm:h-16 text-lg sm:text-3xl'
      : isLong
        ? 'w-8 h-10 sm:w-14 sm:h-18 text-xl sm:text-4xl'
        : 'w-10 h-14 sm:w-16 sm:h-20 text-2xl sm:text-4xl';

  const letterBtn = bigTargets
    ? isVeryLong
      ? 'w-8 h-8 sm:w-16 sm:h-16 text-lg sm:text-3xl rounded-lg'
      : isLong
        ? 'w-11 h-11 sm:w-20 sm:h-20 text-xl sm:text-3xl rounded-xl'
        : 'w-14 h-14 sm:w-24 sm:h-24 text-2xl sm:text-4xl rounded-2xl sm:rounded-[2rem]'
    : isVeryLong
      ? 'w-7 h-7 sm:w-12 sm:h-12 text-base sm:text-xl rounded-md'
      : isLong
        ? 'w-9 h-9 sm:w-16 sm:h-16 text-lg sm:text-2xl rounded-lg'
        : 'w-12 h-12 sm:w-20 sm:h-20 text-xl sm:text-3xl rounded-xl sm:rounded-3xl';
  const slideAnim = noFlash ? '' : 'animate-in slide-in-from-bottom-2';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-1 flex-col items-center justify-start overflow-hidden px-2 pt-2 pb-2 sm:pt-6`}
    >
      {}
      <div className="mb-2 flex w-full shrink-0 flex-col items-center justify-center sm:mb-4">
        {!zenMode && (
          <h3
            className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          >
            <BionicText
              text={
                t('scrabbleInstruction') ||
                'Arrange the letters to spell the word'
              }
              enabled={bionicReading}
            />
          </h3>
        )}
        {!zenMode && (
          <div
            className="mb-1 shrink-0 text-4xl drop-shadow-sm sm:mb-2 sm:text-6xl"
            aria-hidden="true"
          >
            {data.image || '🧩'}
          </div>
        )}

        <ExerciseControlsRow className="mb-2 flex justify-center">
          <TTSController
            onReadAloud={readWordAndLetters}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            controlBtnSize={controlBtnSize}
            noFlash={noFlash}
            ttsFallback={ttsFallback}
          />
        </ExerciseControlsRow>
      </div>

      {}
      <div className="no-scrollbar mb-2 flex max-h-[30dvh] min-h-12 w-full max-w-4xl shrink flex-wrap justify-center gap-1 overflow-y-auto border-b-4 border-dashed border-slate-100 px-1 pt-2 pb-2 sm:mb-4 sm:min-h-16 sm:gap-2 sm:px-2 sm:pb-4">
        {userScrabble.map((x, i) => (
          <div
            key={i}
            className={`${tileSize} flex items-center justify-center font-black ${themeStyles.accent} rounded-lg border-2 bg-white shadow-sm sm:rounded-xl md:shadow-none ${themeStyles.border} ${slideAnim}`}
          >
            {x.letter}
          </div>
        ))}
      </div>

      {}
      <div className="no-scrollbar flex max-h-[35dvh] min-h-0 w-full max-w-4xl shrink flex-wrap justify-center gap-1.5 overflow-y-auto px-1 pt-2 pb-2 sm:gap-3 sm:pt-4 sm:pb-4">
        {shuffledLetters.map((l, i) => {
          const isUsed = userScrabble.some((x) => x.index === i);
          return (
            <button
              key={i}
              disabled={isUsed}
              onClick={() => addLetter(l, i)}
              className={`relative ${letterBtn} font-black shadow-md transition-all active:scale-90 md:shadow-sm ${
                isUsed
                  ? 'cursor-default border-slate-200 bg-slate-100 text-slate-600 opacity-30'
                  : activeHighlight === i
                    ? `z-10 scale-110 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400`
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

      {}
      <div className="mt-auto flex w-full max-w-2xl shrink-0 gap-2 px-2 pt-2 sm:gap-4 sm:pt-4">
        <button
          onClick={() => {
            clearAudioTimeouts();
            setUserScrabble([]);
          }}
          className={`flex-1 ${bigTargets ? 'py-4' : 'py-3 sm:py-4'} rounded-2xl bg-slate-50 text-[9px] font-black tracking-[0.2em] text-slate-600 uppercase transition-colors hover:text-slate-600 sm:text-[10px]`}
        >
          <BionicText text={t('delete') || 'Delete'} enabled={bionicReading} />
        </button>
        <button
          onClick={() => {
            clearAudioTimeouts();
            handleDone();
          }}
          disabled={userScrabble.length === 0}
          className={`flex-2 ${bigTargets ? 'py-4' : 'py-3 sm:py-4'} ${themeStyles.button} ${themeStyles.buttonText} rounded-2xl font-black shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:grayscale`}
        >
          <BionicText text={t('check') || t('done')} enabled={bionicReading} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(ScrabbleExercise);
