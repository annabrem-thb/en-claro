import React, { useState, useEffect, useCallback } from 'react';
import BionicText from '../common/BionicText';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * PhonemeExercise Component
 * 
 * Function: Focuses on pronunciation and Grapheme-to-Phoneme mapping.
 * The user must listen to the spelling and correctly pronounce the word aloud.
 */
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
  voiceAssistant = true, // Zawsze true z powodu wyjątku w App.jsx
}) {
  const targetWord = data.word || '';
  const hintText = data.hints?.[language] || data.hints?.en || '';

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

  // --- Read Word (Spelled Out) & Hint Aloud ---
  const readWordAndHint = () => {
    clearAudioTimeouts();

    let delayAcc = 0;
    const chars = Array.from(targetWord);

    // 1. Spell the word letter by letter
    chars.forEach((char, i) => {
      const stepDuration = extendedTime ? 900 : 600;
      setSafeTimeout(() => {
        setActiveHighlight(`char-${i}`);
        speak(char);
      }, delayAcc);
      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === `char-${i}` ? null : prev));
      }, delayAcc + stepDuration - 100);
      delayAcc += stepDuration;
    });

    delayAcc += 800; // Silent pause

    // 2. Read the supplementary hint
    if (hintText) {
      const hintDuration = hintText.length * (extendedTime ? 90 : 65) + 1000;
      setSafeTimeout(() => {
        setActiveHighlight('hint');
        speak(hintText);
      }, delayAcc);
      setSafeTimeout(() => {
        setActiveHighlight((prev) => (prev === 'hint' ? null : prev));
      }, delayAcc + hintDuration - 200);
    }
  };

  const animClass = noFlash ? '' : 'animate-in zoom-in duration-500';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-4xl'
    : 'w-12 h-12 sm:w-20 sm:h-20 text-2xl sm:text-3xl';
  const wordSize = bigTargets ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-6xl';

  return (
    <div className={`${animClass} flex h-full min-h-0 w-full max-w-md flex-col items-center justify-center overflow-hidden px-2 py-2`}>
      {!zenMode && (
        <h3 className={`mb-2 sm:mb-4 text-center text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase shrink-0 ${isHighContrast ? 'text-white/50' : 'text-slate-400'}`}>
          {t.categories?.Phonem || 'Phonemes'}
        </h3>
      )}

      <div
        className={`font-black ${wordSize} mb-2 text-center tracking-tight break-words leading-tight w-full px-2 flex justify-center flex-wrap shrink min-h-0 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
      >
        {Array.from(targetWord).map((char, i) => {
          const isBionicBold = bionicReading && i < Math.ceil(targetWord.length / 2);
          return (
            <span
              key={i}
              className={`transition-all duration-200 inline-block ${
                activeHighlight === `char-${i}` ? (isHighContrast ? 'text-black bg-white px-1 rounded scale-110 z-10' : 'text-yellow-500 scale-110 drop-shadow-md z-10') : ''
              } ${isBionicBold ? 'font-black' : bionicReading ? 'opacity-80 font-medium' : 'font-black'}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {data.phonetic && (
        <div className={`mb-2 sm:mb-4 rounded-xl border px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-base sm:text-lg md:text-xl font-bold tracking-widest shrink-0 ${isHighContrast ? 'bg-black border-white text-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
          {data.phonetic}
        </div>
      )}

      {!zenMode && hintText && (
        <div className={`mb-2 sm:mb-4 px-2 sm:px-4 text-center text-[10px] sm:text-xs md:text-sm leading-relaxed font-medium transition-all duration-300 shrink min-h-0 overflow-y-auto ${
          activeHighlight === 'hint' ? (isHighContrast ? 'text-white scale-105' : 'text-yellow-600 scale-105 drop-shadow-sm') : (isHighContrast ? 'text-white/70' : 'text-slate-500')
        }`}>
          💡 <BionicText text={hintText} enabled={bionicReading} />
        </div>
      )}

      <div className="mb-2 sm:mb-4 flex justify-center shrink-0">
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
          className={`rounded-full border-2 bg-transparent px-5 py-2.5 sm:px-6 sm:py-3 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase transition-colors ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          aria-label={t.skipPronunciation}
        >
          {t.done || 'Done'}
        </button>
      </div>
    </div>
  );
}

export default React.memo(PhonemeExercise);
