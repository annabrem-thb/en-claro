import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

function MemorySpanExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  t,
  language = 'en',
  speak,
  ttsFallback,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
  voiceAssistant = false,
  isHighContrast = false,
}) {
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const { isListening, transcript, startListening } = useExerciseVoice(
    language,
    t,
  );

  const [activeHighlight, setActiveHighlight] = useState(null);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

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
    let delayAcc = 800;
    data.displayItems.forEach((item, index) => {
      const textToSpeak = String(item);
      const stepDuration =
        textToSpeak.length * (extendedTime ? 100 : 75) + 1500;

      setSafeTimeout(() => {
        setActiveHighlight(`mem-${index}`);
        speak(textToSpeak);
      }, delayAcc);

      setSafeTimeout(
        () => {
          setActiveHighlight(null);
        },
        delayAcc + stepDuration - 200,
      );

      delayAcc += stepDuration;
    });

    setSafeTimeout(() => {
      setIsMemorizing(false);
      setActiveHighlight(null);
    }, delayAcc + 500);
  }, [
    data.displayItems,
    extendedTime,
    speak,
    setSafeTimeout,
    clearAllTimeouts,
  ]);

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

    if (newSelected.length === data.correct.length) {
      setIsChecking(true);
      const isCorrect = newSelected.every((val, i) => val === data.correct[i]);
      if (isCorrect) {
        onSuccess();
      } else {
        onError();
        const resetDelay = extendedTime ? 1500 : 800;
        setSafeTimeout(() => {
          setSelectedItems([]);
          setIsChecking(false);
        }, resetDelay);
      }
    }
  };

  const handleVoiceMatch = (num) => {
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < stableScrambled.length) {
      const selectedItem = stableScrambled[selectedIndex];
      if (!selectedItems.includes(selectedItem)) {
        handleSelectItem(selectedItem);
      } else {
        onError();
      }
    } else {
      onError();
    }
  };

  const handleHint = () => speak([...data.correct].reverse().join(', '), true);

  const readAvailableItems = () => {
    clearAllTimeouts();

    speak(data.instruction, extendedTime);

    const charCount = (data.instruction || '').length;
    let delayAcc = charCount * (extendedTime ? 100 : 75) + 1500;

    stableScrambled.forEach((item, index) => {
      if (!selectedItems.includes(item)) {
        const optionPrefix = t('optionPrefix', { number: index + 1 });

        const spokenPrefix = optionPrefix.replace(':', '.');
        const fullSpokenText = `${spokenPrefix} ${item}`;

        const stepDuration =
          fullSpokenText.length * (extendedTime ? 100 : 75) + 1500;

        setSafeTimeout(() => {
          setActiveHighlight(index);
          speak(fullSpokenText);
        }, delayAcc);

        setSafeTimeout(
          () => {
            setActiveHighlight((prev) => (prev === index ? null : prev));
          },
          delayAcc + stepDuration - 200,
        );

        delayAcc += stepDuration;
      }
    });
  };

  // Only once the recall phase actually starts — auto-reading the item list
  // during `isMemorizing` would read out the answer before the memorization
  // challenge even begins.
  useAutoReadAloud(voiceAssistant && !isMemorizing, readAvailableItems);

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const popAnim = noFlash ? '' : 'animate-in pop-in';
  const pulseClass = noFlash ? '' : 'animate-pulse';

  const itemCount = data.displayItems?.length || data.correct?.length || 0;
  const isMany = itemCount > 4;

  // `min-w`/`min-h` (not fixed `w`/`h`) so a tile grows for longer content —
  // this component was originally exercised with single short words/digits;
  // once real vocabulary items were wired in (multi-syllable business terms
  // like "Zaangażowanie"), fixed-size tiles at these font sizes overflowed
  // and overlapped neighboring tiles on every viewport. Font sizes are also
  // a step down from the original scale so a long word wraps to 2 lines
  // inside the tile instead of spilling past its edges.
  const tileSize = bigTargets
    ? isMany
      ? 'min-w-14 min-h-16 sm:min-w-20 sm:min-h-24 px-1.5 text-base sm:text-2xl'
      : 'min-w-20 min-h-24 sm:min-w-24 sm:min-h-28 px-2 text-xl sm:text-3xl'
    : isMany
      ? 'min-w-10 min-h-12 sm:min-w-16 sm:min-h-20 px-1 text-sm sm:text-lg'
      : 'min-w-16 min-h-20 sm:min-w-20 sm:min-h-24 px-1.5 text-lg sm:text-2xl';
  const letterBtn = bigTargets
    ? isMany
      ? 'min-w-12 min-h-12 sm:min-w-16 sm:min-h-16 px-1 text-sm sm:text-lg rounded-xl'
      : 'min-w-16 min-h-16 sm:min-w-20 sm:min-h-20 px-1.5 text-base sm:text-xl rounded-3xl'
    : isMany
      ? 'min-w-9 min-h-9 sm:min-w-14 sm:min-h-14 px-1 text-xs sm:text-base rounded-lg'
      : 'min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 px-1 text-sm sm:text-lg rounded-2xl';
  const hintPadding = bigTargets ? 'px-8 py-4' : 'px-6 py-3';
  const controlBtnSize = bigTargets
    ? 'w-20 h-20 text-3xl'
    : 'w-16 h-16 text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2`}
    >
      <div className="w-full shrink-0 text-center">
        <h3
          className={`mx-auto mb-2 max-w-[65ch] px-4 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
        >
          {isMemorizing ? t('memorize') || 'Memorize!' : data.instruction}
        </h3>

        {}
        {isMemorizing ? (
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <TTSController
              onReadAloud={playMemorizationSequence}
              pauseAllTimeouts={pauseAllTimeouts}
              resumeAllTimeouts={resumeAllTimeouts}
              controlBtnSize={controlBtnSize}
              noFlash={noFlash}
              ttsFallback={ttsFallback}
            />
            <div
              className={`flex flex-wrap justify-center gap-4 ${pulseClass}`}
              aria-live="polite"
            >
              {data.displayItems?.map((item, i) => (
                <div
                  key={i}
                  className={`${tileSize} flex items-center justify-center rounded-2xl border-4 text-center leading-tight font-bold wrap-break-word shadow-sm transition-all duration-300 sm:rounded-3xl md:shadow-none ${
                    activeHighlight === `mem-${i}`
                      ? 'z-10 scale-110 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                      : isHighContrast
                        ? 'border-white bg-black text-white'
                        : `bg-white ${themeStyles.border}`
                  }`}
                >
                  <BionicText text={String(item)} enabled={bionicReading} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          !zenMode && (
            <div
              className="mb-4 shrink-0 text-4xl sm:mb-8 sm:text-6xl"
              aria-hidden="true"
            >
              ❓
            </div>
          )
        )}
      </div>

      {}
      {!isMemorizing && (
        <div
          className={`flex min-h-0 w-full flex-1 flex-col items-center justify-center ${noFlash ? '' : 'animate-in fade-in duration-500'}`}
        >
          {}
          <ExerciseControlsRow className="mb-2 flex shrink-0 gap-4 sm:mb-4 sm:gap-6">
            <TTSController
              onReadAloud={readAvailableItems}
              pauseAllTimeouts={pauseAllTimeouts}
              resumeAllTimeouts={resumeAllTimeouts}
              controlBtnSize={controlBtnSize}
              noFlash={noFlash}
              ttsFallback={ttsFallback}
            />

            <button
              onClick={() => startListening(handleVoiceMatch)}
              className={`${controlBtnSize} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                isListening
                  ? `bg-red-500 text-white ring-8 ring-red-100 ${noFlash ? '' : 'animate-pulse'}`
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-110`
              }`}
              aria-label={isListening ? t('listening') : t('speakOptionNumber')}
              aria-pressed={isListening}
            >
              {isListening ? '🛑' : '🎤'}
            </button>
          </ExerciseControlsRow>

          {transcript && (
            <p
              className={`mb-1 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-2 sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-600'}`}
            >
              {t('heard')}:{' '}
              <span
                className={isHighContrast ? 'text-white' : 'text-slate-600'}
              >
                {transcript}
              </span>
            </p>
          )}

          {}
          <div
            className={`mb-2 flex min-h-12 w-full shrink flex-wrap justify-center gap-2 overflow-y-auto rounded-3xl border-2 border-dashed p-3 sm:mb-4 sm:min-h-16 sm:p-4 ${isHighContrast ? 'border-white/40 bg-black' : 'border-slate-200 bg-slate-50'}`}
          >
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl px-4 py-2 font-bold shadow-sm md:shadow-none ${popAnim} ${themeStyles.button} ${themeStyles.buttonText}`}
              >
                <BionicText text={String(item)} enabled={bionicReading} />
              </div>
            ))}
          </div>

          {}
          <div className="mb-2 flex min-h-0 w-full max-w-sm shrink flex-wrap justify-center gap-2 overflow-y-auto sm:mb-4 sm:gap-3">
            {stableScrambled.map((item, index) => {
              const isSelected = selectedItems.includes(item);
              return (
                <button
                  key={index}
                  onClick={() => handleSelectItem(item)}
                  disabled={isSelected || isListening}
                  className={`relative ${letterBtn} flex items-center justify-center border-2 text-center leading-tight font-bold wrap-break-word transition-all active:scale-90 ${
                    isSelected || isListening
                      ? isHighContrast
                        ? 'cursor-default border-white/30 bg-black text-white/40'
                        : 'cursor-default border-slate-200 bg-slate-100 text-slate-600 opacity-30'
                      : activeHighlight === index
                        ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                        : isHighContrast
                          ? `border-white bg-black text-white hover:bg-white/10`
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

          {}
          {!zenMode && (
            <button
              onClick={handleHint}
              className={`flex items-center gap-2 ${hintPadding} rounded-full text-xs font-bold tracking-widest uppercase transition-all active:scale-95 ${isHighContrast ? 'bg-black text-white/70 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              💡 {t('hint') || 'Hint'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(MemorySpanExercise);
