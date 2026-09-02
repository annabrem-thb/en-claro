import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';

function DictationExercise({
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
  isHighContrast = false,
  zenMode = false,
  // Default true, same as the other "voice exception" exercises (Phoneme,
  // Scrabble, ReadAloud, LookCoverWriteCheck) — App.jsx's isVoiceException
  // also already forces this true for every dictation task regardless of
  // the user's voiceAssistant setting, since the audio *is* the question
  // here, not an optional accessibility read-aloud of already-visible text.
  voiceAssistant = true,
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

  // Only the automatic first read leads with the task instruction — replay
  // is a normal, expected repeated action here (re-listen as many times as
  // needed), so handleReplay itself (used by the manual TTSController
  // button) stays instruction-free to avoid repeating "listen carefully..."
  // before the actual word on every single tap.
  // Most dictation tasks are literal transcription ("listen, type what you
  // heard"), but the phoneme-manipulation tasks (substitution, deletion,
  // reversal, acrostics, counting) are puzzles spoken in full via
  // audioPrompt itself — showing the generic "listen carefully to the word"
  // header on those would misdescribe the task. `data.instruction` lets a
  // task override that header; plain dictation items simply omit it.
  const headerText =
    data.instruction || t('listenCarefully') || 'Listen carefully to the word.';

  const readInstructionThenPrompt = useCallback(() => {
    clearAllTimeouts();
    speak(headerText, extendedTime);
    const delay = headerText.length * (extendedTime ? 90 : 65) + 1200;
    setSafeTimeout(() => handleReplay(), delay);
  }, [
    speak,
    extendedTime,
    headerText,
    setSafeTimeout,
    clearAllTimeouts,
    handleReplay,
  ]);

  useAutoReadAloud(voiceAssistant, readInstructionThenPrompt);

  const clean = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, '');

  const handleCheck = () => {
    const cleanInput = clean(userInput);
    // Plain dictation and most phoneme puzzles have exactly one right
    // answer (data.correct is a string). Open-ended tasks — word chains,
    // "name a word starting with X" — genuinely have many valid answers,
    // so those tasks set data.correct to an array of pre-vetted acceptable
    // words instead; matching any one of them counts as correct rather than
    // requiring a single "the" answer that doesn't actually exist for them.
    const isMatch = Array.isArray(data.correct)
      ? data.correct.some((c) => clean(c) === cleanInput)
      : cleanInput === clean(data.correct);

    if (isMatch) {
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
          className={`mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          aria-live="polite"
        >
          <BionicText text={headerText} enabled={bionicReading} />
        </h3>
      )}

      <ExerciseControlsRow className="mb-4 shrink-0 sm:mb-6">
        <TTSController
          onReadAloud={handleReplay}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          controlBtnSize={
            bigTargets
              ? 'w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-4xl'
              : 'w-14 h-14 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
          }
          noFlash={noFlash}
          ttsFallback={ttsFallback}
        />
      </ExerciseControlsRow>

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
              : `${themeStyles.button} ${themeStyles.buttonText} shadow-xl hover:brightness-110 md:shadow-md`
        }`}
      >
        <BionicText text={t('check') || 'Check'} enabled={bionicReading} />
      </button>
    </div>
  );
}

export default React.memo(DictationExercise);
