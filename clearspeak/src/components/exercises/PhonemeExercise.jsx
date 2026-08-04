import React, { useState, useEffect, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import TTSController from '../common/TTSController';

function PhonemeExercise({
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
  isHighContrast = false,
  voiceAssistant = true,
}) {
  const targetWord = data.word || '';
  const hintText = data.hint?.[language] || data.hint?.en || '';

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

  const readWordAndHint = () => {
    clearAudioTimeouts();

    const instruction =
      t('phonemeInstruction') || 'Listen to the word, then say it aloud';
    speak(instruction, extendedTime);
    let delayAcc = instruction.length * (extendedTime ? 90 : 65) + 1200;
    const chars = Array.from(targetWord);

    chars.forEach((char, i) => {
      const stepDuration = extendedTime ? 900 : 600;
      setSafeTimeout(() => {
        setActiveHighlight(`char-${i}`);
        speak(char);
      }, delayAcc);
      setSafeTimeout(
        () => {
          setActiveHighlight((prev) => (prev === `char-${i}` ? null : prev));
        },
        delayAcc + stepDuration - 100,
      );
      delayAcc += stepDuration;
    });

    delayAcc += 800;

    if (hintText) {
      const hintDuration = hintText.length * (extendedTime ? 90 : 65) + 1000;
      setSafeTimeout(() => {
        setActiveHighlight('hint');
        speak(hintText);
      }, delayAcc);
      setSafeTimeout(
        () => {
          setActiveHighlight((prev) => (prev === 'hint' ? null : prev));
        },
        delayAcc + hintDuration - 200,
      );
    }
  };

  useAutoReadAloud(voiceAssistant, readWordAndHint);

  const animClass = noFlash ? '' : 'animate-in zoom-in duration-500';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-4xl'
    : 'w-12 h-12 sm:w-20 sm:h-20 text-2xl sm:text-3xl';
  const wordSize = bigTargets ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-6xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full max-w-md flex-col items-center justify-center overflow-hidden px-2 py-2`}
    >
      {!zenMode && (
        <h3
          className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-4 sm:text-xs md:text-sm ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('phonemeInstruction') || 'Listen to the word, then say it aloud'}
        </h3>
      )}

      <div
        className={`font-black ${wordSize} mb-2 flex min-h-0 w-full shrink flex-wrap justify-center px-2 text-center leading-tight tracking-tight break-words ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
      >
        {Array.from(targetWord).map((char, i) => {
          const isBionicBold =
            bionicReading && i < Math.ceil(targetWord.length / 2);
          return (
            <span
              key={i}
              className={`inline-block transition-all duration-200 ${
                activeHighlight === `char-${i}`
                  ? isHighContrast
                    ? 'z-10 scale-110 rounded bg-white px-1 text-black'
                    : 'z-10 scale-110 text-yellow-500 drop-shadow-md'
                  : ''
              } ${isBionicBold ? 'font-black' : bionicReading ? 'font-medium opacity-80' : 'font-black'}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {data.phonetic && (
        <div
          className={`mb-2 shrink-0 rounded-xl border px-3 py-1.5 font-mono text-base font-bold tracking-widest sm:mb-4 sm:px-4 sm:py-2 sm:text-lg md:text-xl ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
        >
          {data.phonetic}
        </div>
      )}

      {!zenMode && hintText && (
        <div
          className={`mx-auto mb-2 min-h-0 max-w-[65ch] shrink overflow-y-auto px-2 text-center text-[10px] leading-relaxed font-medium transition-all duration-300 sm:mb-4 sm:px-4 sm:text-xs md:text-sm ${
            activeHighlight === 'hint'
              ? isHighContrast
                ? 'scale-105 text-white'
                : 'scale-105 text-yellow-600 drop-shadow-sm'
              : isHighContrast
                ? 'text-white/70'
                : 'text-slate-500'
          }`}
        >
          💡 <BionicText text={hintText} enabled={bionicReading} />
        </div>
      )}

      <div className="mb-2 flex shrink-0 justify-center sm:mb-4">
        <TTSController
          onReadAloud={readWordAndHint}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={controlBtnSize}
        />
      </div>

      <div className="mt-2 flex shrink-0 justify-center">
        <button
          onClick={onSuccess}
          className={`rounded-full border-2 bg-transparent px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-colors sm:px-6 sm:py-3 sm:text-xs md:text-sm ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-600'}`}
          aria-label={t('skipPronunciation')}
        >
          {t('done') || 'Done'}
        </button>
      </div>
    </div>
  );
}

export default React.memo(PhonemeExercise);
