import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import TTSController from '../common/TTSController';

function DictationExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  t,
  speak,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  isHighContrast = false,
  zenMode = false,
}) {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);
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
    };
  }, [clearAllTimeouts]);

  const handleReplay = useCallback(() => {
    clearAllTimeouts();
    speak(data.audioPrompt, extendedTime);
    if (inputRef.current) inputRef.current.focus();
  }, [data.audioPrompt, extendedTime, speak, clearAllTimeouts]);

  const handleCheck = () => {
    const cleanInput = userInput
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, '');
    const cleanCorrect = data.correct
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, '');

    if (cleanInput === cleanCorrect) {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}
    >
      {!zenMode && (
        <h3
          className="mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase sm:mb-4"
          aria-live="polite"
        >
          <BionicText
            text={t('categories.Dictation') || 'Dictation'}
            enabled={bionicReading}
          />
        </h3>
      )}

      <div className="mb-4 shrink-0 sm:mb-6">
        <TTSController
          onReadAloud={handleReplay}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
          controlBtnSize={
            bigTargets
              ? 'w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-4xl'
              : 'w-14 h-14 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
          }
        />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && userInput.trim().length > 0 && handleCheck()
        }
        className={`mb-4 w-full max-w-md shrink rounded-2xl p-4 text-center text-lg font-bold transition-shadow focus:ring-4 focus:outline-none sm:mb-6 sm:rounded-3xl sm:p-5 sm:text-xl md:text-2xl ${
          isHighContrast
            ? 'border-4 border-white bg-black text-white focus:ring-white/50'
            : 'border-2 border-slate-200 bg-white text-slate-800 shadow-inner focus:border-indigo-400 focus:ring-indigo-100'
        }`}
        placeholder={t('typeHere') || '...'}
        aria-label={t('typeWhatYouHear') || 'Type what you heard'}
        autoComplete="off"
        spellCheck="false"
      />

      <button
        onClick={handleCheck}
        disabled={userInput.trim().length === 0}
        className={`mt-auto w-full max-w-xs shrink-0 pt-2 ${bigTargets ? 'py-3 text-sm sm:py-5 sm:text-base' : 'py-2.5 text-xs sm:py-4 sm:text-sm'} rounded-full font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 active:scale-95 ${
          userInput.trim().length === 0
            ? 'cursor-not-allowed bg-slate-200 text-slate-600'
            : isHighContrast
              ? 'bg-white text-black hover:bg-slate-200'
              : `${themeStyles.button} text-white shadow-xl hover:brightness-110 md:shadow-md`
        }`}
      >
        <BionicText text={t('check') || 'Check'} enabled={bionicReading} />
      </button>
    </div>
  );
}

export default React.memo(DictationExercise);
