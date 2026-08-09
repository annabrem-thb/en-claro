import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { useUserSettingsContext } from '../UserSettingsContext.jsx';
import BionicText from '../common/BionicText';
import TTSController from '../common/TTSController';

function LookCoverWriteCheck({
  targetWord,
  word,
  onSelfEvaluate,
  language: propLang,
  t: propT,
  speak,
  extendedTime,
  bigTargets,
  voiceAssistant = true,
  zenMode = false,
  noFlash = false,
}) {
  const activeWord = targetWord || word || '';
  const [phase, setPhase] = useState('look');
  const [userInput, setUserInput] = useState('');

  const { settings } = useUserSettingsContext();
  const language = propLang || settings.language || 'pl';
  const t = propT;

  const isHighContrast = settings.contrast;
  const bionicReading = settings.bionicReading;

  const inputRef = useRef(null);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const handleReadWord = useCallback(() => {
    clearAllTimeouts();
    if (speak) speak(activeWord, extendedTime);
  }, [speak, activeWord, extendedTime, clearAllTimeouts]);

  useAutoReadAloud(voiceAssistant && phase === 'look', handleReadWord);

  useEffect(() => {
    if (phase === 'write' && inputRef.current) {
      inputRef.current.focus();
    }
    return () => {
      clearAllTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [phase, clearAllTimeouts]);

  if (phase === 'look') {
    return (
      <div
        className={`flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2 ${noFlash ? '' : 'animate-in fade-in duration-500'}`}
      >
        {!zenMode && (
          <h2
            className={`mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
            aria-live="polite"
          >
            {t('lookAndListen') || 'Step 1: Study the word'}
          </h2>
        )}

        <div className="mb-3 shrink-0 sm:mb-6">
          <TTSController
            onReadAloud={handleReadWord}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            t={t}
            controlBtnSize={
              bigTargets ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'
            }
          />
        </div>

        <div
          className={`mb-4 flex min-h-0 w-full max-w-md shrink items-center justify-center overflow-y-auto rounded-3xl px-4 py-6 shadow-sm sm:mb-8 sm:px-8 sm:py-10 ${isHighContrast ? 'border-2 border-white bg-black text-white' : 'border border-slate-200 bg-white text-slate-800'}`}
        >
          <span className="text-center text-3xl font-black tracking-widest break-all sm:text-4xl md:text-5xl">
            <BionicText text={activeWord} enabled={bionicReading} />
          </span>
        </div>

        <button
          onClick={() => setPhase('write')}
          className={`mt-auto shrink-0 rounded-full px-8 py-4 text-xs font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 active:scale-95 sm:px-10 sm:py-5 sm:text-sm ${
            isHighContrast
              ? 'bg-white text-black hover:bg-slate-200'
              : 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-500'
          }`}
          aria-label={t('coverAndWrite') || 'Hide word and start typing'}
        >
          {t('coverAndWrite') || 'Hide Word & Write'}
        </button>
      </div>
    );
  }

  if (phase === 'write') {
    return (
      <div
        className={`flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2 ${noFlash ? '' : 'animate-in slide-in-from-right-4 fade-in duration-500'}`}
      >
        {!zenMode && (
          <h2
            className={`mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
            aria-live="polite"
          >
            {t('typeFromMemory') || 'Step 2: Type from memory'}
          </h2>
        )}

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={`mb-4 min-h-0 w-full max-w-md shrink rounded-2xl p-4 text-center text-2xl font-bold transition-shadow focus:ring-4 focus:outline-none sm:mb-6 sm:rounded-3xl sm:p-6 sm:text-3xl ${
            isHighContrast
              ? 'border-4 border-white bg-black text-white focus:ring-white/50'
              : 'border-2 border-indigo-100 bg-white text-slate-800 shadow-inner focus:border-indigo-400 focus:ring-indigo-100'
          }`}
          placeholder={t('typeHere') || '...'}
          aria-label={t('typeFromMemory') || 'Type the hidden word'}
          autoComplete="off"
          spellCheck="false"
        />

        <button
          onClick={() => setPhase('check')}
          disabled={userInput.trim().length === 0}
          className={`mt-auto shrink-0 rounded-full px-8 py-4 text-xs font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 active:scale-95 sm:px-10 sm:py-5 sm:text-sm ${
            userInput.trim().length === 0
              ? 'cursor-not-allowed bg-slate-200 text-slate-600'
              : isHighContrast
                ? 'bg-white text-black hover:bg-slate-200'
                : 'bg-emerald-700 text-white shadow-xl hover:bg-emerald-600'
          }`}
        >
          {t('checkSpelling') || 'Check My Answer'}
        </button>
      </div>
    );
  }

  if (phase === 'check') {
    const isCorrect =
      userInput.trim().toLowerCase() === activeWord.trim().toLowerCase();

    return (
      <div
        className={`flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2 ${noFlash ? '' : 'animate-in slide-in-from-bottom-4 fade-in duration-500'}`}
      >
        {!zenMode && (
          <h2
            className={`mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
            aria-live="polite"
          >
            {t('compareSpelling') || 'Step 3: Comparison'}
          </h2>
        )}

        <div className="mb-4 flex min-h-0 w-full max-w-md shrink flex-col gap-3 overflow-y-auto sm:mb-6 sm:gap-4">
          {}
          <div
            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 sm:gap-2 sm:p-5 ${isHighContrast ? 'border-white/50 bg-black' : 'border-slate-200 bg-slate-50'}`}
          >
            <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase sm:text-xs">
              {t('targetWord') || 'Correct Spelling'}
            </span>
            <span
              className={`text-xl font-black tracking-widest break-all sm:text-2xl ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
            >
              {activeWord}
            </span>
          </div>

          {}
          <div
            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 sm:gap-2 sm:p-5 ${
              isHighContrast
                ? 'border-white/50 bg-black'
                : isCorrect
                  ? 'border-[var(--color-success)]/40 bg-[var(--color-success)]/10 shadow-sm'
                  : 'border-[var(--color-error)]/40 bg-[var(--color-error)]/10 shadow-sm'
            }`}
          >
            {/* Correctness is never color-only: the checkmark/cross carries
                the same meaning as the color for colorblind users and (since
                high-contrast mode drops the tint entirely) for high-contrast
                mode too — matching WCAG 1.4.1 (use of color). */}
            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-600 uppercase sm:text-xs">
              {t('yourSpelling') || 'Your Spelling'}
              <span aria-hidden="true">{isCorrect ? '✅' : '❌'}</span>
            </span>
            <span
              className={`text-xl font-bold tracking-widest break-all sm:text-2xl ${isHighContrast ? 'text-white' : isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
            >
              {userInput}
            </span>
          </div>
        </div>

        {}
        <div className="mt-auto flex w-full max-w-md shrink-0 pt-2">
          <button
            onClick={() =>
              onSelfEvaluate({ correct: isCorrect, input: userInput })
            }
            className={`w-full rounded-2xl border-2 py-4 text-xs font-black tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-4 active:scale-95 sm:py-5 sm:text-sm ${
              isHighContrast
                ? 'border-white bg-white text-black hover:bg-slate-200'
                : 'border-indigo-600 bg-indigo-600 text-white shadow-xl hover:bg-indigo-500'
            }`}
          >
            {t('next') || t('done') || 'Next'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default React.memo(LookCoverWriteCheck);
