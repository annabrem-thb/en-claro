import React, { useState, useEffect, useRef, useCallback } from 'react';
import BionicText from '../common/BionicText';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

export default function DictationExercise({
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
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  // Auto-play the dictation audio prompt shortly after the component mounts
  useEffect(() => {
    setSafeTimeout(() => {
      speak(data.audioPrompt, extendedTime);
    }, 500);
    return () => {
      clearAllTimeouts();
      window.speechSynthesis.cancel();
    };
  }, [data.audioPrompt, extendedTime, speak, setSafeTimeout, clearAllTimeouts]);

  const handleReplay = useCallback(() => {
    window.speechSynthesis.cancel();
    clearAllTimeouts();
    speak(data.audioPrompt, extendedTime);
    if (inputRef.current) inputRef.current.focus();
  }, [data.audioPrompt, extendedTime, speak, clearAllTimeouts]);

  const handleCheck = () => {
    // Normalize strings for forgiving validation (ignore case and punctuation)
    const cleanInput = userInput.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    const cleanCorrect = data.correct.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    
    if (cleanInput === cleanCorrect) {
      onSuccess();
    } else {
      onError();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}>
      {!zenMode && (
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 sm:mb-8" aria-live="polite">
          <BionicText text={t.categories?.Dictation || 'Dictation'} enabled={bionicReading} />
        </h3>
      )}

      <div className="mb-10">
        <TTSController
          onReadAloud={handleReplay}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          t={t}
        controlBtnSize={bigTargets ? 'w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-4xl' : 'w-14 h-14 sm:w-20 sm:h-20 text-2xl sm:text-3xl'}
        />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && userInput.trim().length > 0 && handleCheck()}
        className={`w-full max-w-md text-center text-xl sm:text-2xl md:text-3xl font-bold p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 focus:outline-none focus:ring-4 transition-shadow ${
          isHighContrast 
            ? 'bg-black border-4 border-white text-white focus:ring-white/50' 
            : 'bg-white border-2 border-slate-200 text-slate-800 focus:border-indigo-400 focus:ring-indigo-100 shadow-inner'
        }`}
        placeholder={t.typeHere || "..."}
        aria-label={t.typeWhatYouHear || "Type what you heard"}
        autoComplete="off"
        spellCheck="false"
      />

      <button
        onClick={handleCheck}
        disabled={userInput.trim().length === 0}
        className={`w-full max-w-xs ${bigTargets ? 'py-3 sm:py-5 text-sm sm:text-base' : 'py-2.5 sm:py-4 text-xs sm:text-sm'} rounded-full font-black uppercase tracking-widest transition-all active:scale-95 focus-visible:ring-4 focus:outline-none ${
          userInput.trim().length === 0
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : `${themeStyles.button} text-white shadow-xl md:shadow-md hover:brightness-110`)
        }`}
      >
        <BionicText text={t.check || 'Check'} enabled={bionicReading} />
      </button>
    </div>
  );
}