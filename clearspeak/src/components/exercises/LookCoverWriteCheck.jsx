import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings.js';
import { useTranslation } from '../../i18n/i18n.js';
import BionicText from '../common/BionicText';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * LookCoverWriteCheck Component
 * 
 * Dyslexia-focused spelling strategy:
 * 1. Look: User studies the word without pressure.
 * 2. Cover & Write: The word is hidden; user types from working memory.
 * 3. Check: User compares their input to the target word and self-evaluates.
 * 
 * Strictly avoids automatic grading (no red text or error sounds) to build self-efficacy.
 */
export default function LookCoverWriteCheck({ targetWord, onSelfEvaluate, language: propLang, t: propT, speak, extendedTime, bigTargets }) {
  // Phases: 'look' -> 'write' -> 'check'
  const [phase, setPhase] = useState('look');
  const [userInput, setUserInput] = useState('');
  
  const { a11yAddons, inclusiveOptions, language: hookLang } = useAppSettings();
  const language = propLang || hookLang || 'pl';
  const t = propT || useTranslation(language);

  const isHighContrast = a11yAddons?.includes('Kontrast');
  const bionicReading = inclusiveOptions?.bionicReading;

  const inputRef = useRef(null);
  const { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  const handleReadWord = useCallback(() => {
    window.speechSynthesis.cancel();
    clearAllTimeouts();
    if (speak) speak(targetWord, extendedTime);
  }, [speak, targetWord, extendedTime, clearAllTimeouts]);

  // WCAG Focus Management: Automatically focus the input when entering the 'write' phase
  useEffect(() => {
    if (phase === 'write' && inputRef.current) {
      inputRef.current.focus();
    }
    if (phase === 'look' && speak) {
      setSafeTimeout(() => handleReadWord(), 500);
    }
    return () => {
      clearAllTimeouts();
      window.speechSynthesis.cancel();
    };
  }, [phase, speak, setSafeTimeout, handleReadWord, clearAllTimeouts]);

  // Render Step 1: Look
  if (phase === 'look') {
    return (
      <div className="flex flex-col items-center justify-center w-full animate-in fade-in duration-500">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8" aria-live="polite">
          {t.lookAndListen || 'Step 1: Study the word'}
        </h2>
        
        <div className="mb-6">
          <TTSController
            onReadAloud={handleReadWord}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            t={t}
            controlBtnSize={bigTargets ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'}
          />
        </div>

        <div className={`px-10 py-16 rounded-3xl w-full max-w-md flex justify-center mb-12 shadow-sm ${isHighContrast ? 'bg-black border-2 border-white text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
          <span className="text-5xl md:text-6xl font-black tracking-widest break-all text-center">
            <BionicText text={targetWord} enabled={bionicReading} />
          </span>
        </div>

        <button
          onClick={() => setPhase('write')}
          className={`px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 text-sm sm:text-base focus-visible:ring-4 focus:outline-none ${
            isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-500'
          }`}
          aria-label={t.coverAndWrite || "Hide word and start typing"}
        >
          {t.coverAndWrite || 'Hide Word & Write'}
        </button>
      </div>
    );
  }

  // Render Step 2: Write
  if (phase === 'write') {
    return (
      <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-right-4 fade-in duration-500">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8" aria-live="polite">
          {t.typeFromMemory || 'Step 2: Type from memory'}
        </h2>
        
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={`w-full max-w-md text-center text-4xl font-bold p-8 rounded-3xl mb-12 focus:outline-none focus:ring-4 transition-shadow ${
            isHighContrast 
              ? 'bg-black border-4 border-white text-white focus:ring-white/50' 
              : 'bg-white border-2 border-indigo-100 text-slate-800 focus:border-indigo-400 focus:ring-indigo-100 shadow-inner'
          }`}
          placeholder={t.typeHere || "..."}
          aria-label={t.typeFromMemory || "Type the hidden word"}
          autoComplete="off"
          spellCheck="false"
        />

        <button
          onClick={() => setPhase('check')}
          disabled={userInput.trim().length === 0}
          className={`px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 text-sm sm:text-base focus-visible:ring-4 focus:outline-none ${
            userInput.trim().length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : (isHighContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-emerald-500 text-white shadow-xl hover:bg-emerald-400')
          }`}
        >
          {t.checkSpelling || 'Check My Answer'}
        </button>
      </div>
    );
  }

  // Render Step 3: Check (Self-Evaluation)
  if (phase === 'check') {
    return (
      <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8" aria-live="polite">
          {t.compareSpelling || 'Step 3: Self-Evaluation'}
        </h2>
        
        <div className="w-full max-w-md flex flex-col gap-6 mb-12">
          {/* Target Word */}
          <div className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 ${isHighContrast ? 'bg-black border-white/50' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.targetWord || 'Correct Spelling'}</span>
            <span className={`text-3xl font-black tracking-widest ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
              {targetWord}
            </span>
          </div>

          {/* User Input */}
          <div className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 ${isHighContrast ? 'bg-black border-white/50' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.yourSpelling || 'Your Spelling'}</span>
            <span className={`text-3xl font-bold tracking-widest ${isHighContrast ? 'text-white' : 'text-slate-600'}`}>
              {userInput}
            </span>
          </div>
        </div>

        {/* Non-punitive self-evaluation choices */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => onSelfEvaluate({ correct: true, input: userInput })}
            className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 text-xs sm:text-sm border-2 focus:outline-none focus-visible:ring-4 ${
              isHighContrast 
                ? 'bg-white text-black border-white hover:bg-slate-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-400 hover:bg-emerald-100 shadow-sm'
            }`}
          >
            {t.spelledCorrectly || 'Matched Perfectly'}
          </button>
          
          <button
            onClick={() => onSelfEvaluate({ correct: false, input: userInput })}
            className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 text-xs sm:text-sm border-2 focus:outline-none focus-visible:ring-4 ${
              isHighContrast 
                ? 'bg-black text-white border-white/50 hover:border-white' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {t.tryAgain || 'Needs More Practice'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}