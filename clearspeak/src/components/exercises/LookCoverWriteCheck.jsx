import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings.js';
import { useTranslation } from '../../i18n/i18n.js';
import BionicText from '../common/BionicText';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import TTSController from '../common/TTSController';

/**
 * LookCoverWriteCheck Component
 * 
 * Dyslexia-friendly spelling strategy implementation:
 * 1. Look: The user observes and listens to the target word without time pressure.
 * 2. Cover & Write: The word is hidden, and the user types it from working memory.
 * 3. Check: The app automatically compares the input with the target word.
 */
export default function LookCoverWriteCheck({ targetWord, onSelfEvaluate, language: propLang, t: propT, speak, extendedTime, bigTargets, voiceAssistant = true }) {
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

  // WCAG Accessibility: Manage focus and TTS playback based on the active phase
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

  // Step 1: Look Phase
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

  // Step 2: Write Phase
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

  // Step 3: Check Phase (Automatic Evaluation)
  if (phase === 'check') {
    const isCorrect = userInput.trim().toLowerCase() === targetWord.trim().toLowerCase();

    return (
      <div className="flex flex-col items-center justify-center w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8" aria-live="polite">
          {t.compareSpelling || 'Step 3: Comparison'}
        </h2>
        
        <div className="w-full max-w-md flex flex-col gap-6 mb-12">
          {/* Target Word Display */}
          <div className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 ${isHighContrast ? 'bg-black border-white/50' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.targetWord || 'Correct Spelling'}</span>
            <span className={`text-3xl font-black tracking-widest ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
              {targetWord}
            </span>
          </div>

          {/* User Input Display */}
          <div className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 ${isHighContrast ? 'bg-black border-white/50' : (isCorrect ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-red-50 border-red-200 shadow-sm')}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.yourSpelling || 'Your Spelling'}</span>
            <span className={`text-3xl font-bold tracking-widest ${isHighContrast ? 'text-white' : (isCorrect ? 'text-emerald-600' : 'text-red-500')}`}>
              {userInput}
            </span>
          </div>
        </div>

        {/* Automatic Evaluation Action Button */}
        <div className="flex w-full max-w-md">
          <button
            onClick={() => onSelfEvaluate({ correct: isCorrect, input: userInput })}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 text-xs sm:text-sm border-2 focus:outline-none focus-visible:ring-4 ${
              isHighContrast 
                ? 'bg-white text-black border-white hover:bg-slate-200'
                : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500 shadow-xl'
            }`}
          >
            {t.next || t.done || 'Dalej'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}