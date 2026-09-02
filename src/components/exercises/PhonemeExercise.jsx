import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

function PhonemeExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language,
  t,
  speak,
  ttsFallback,
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

  const [userInput, setUserInput] = useState('');

  const {
    isListening,
    transcript,
    startListening,
    error,
    voiceStatus,
    modelDownloadProgress,
    confirmModelDownload,
    declineModelDownload,
  } = useExerciseVoice(language, t);

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

  // First and last letter stay visible (so the learner still has an anchor
  // to work from), everything between is masked with "_" — same idea as a
  // hangman blank. Words of 2 letters or fewer have no room for a blank at
  // all, so they're shown in full rather than producing an empty puzzle.
  const maskedChars = useMemo(() => {
    const chars = Array.from(targetWord);
    if (chars.length <= 2) return chars;
    return chars.map((char, i) =>
      i === 0 || i === chars.length - 1 ? char : '_',
    );
  }, [targetWord]);

  const clean = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, '');

  const checkAnswer = useCallback(
    (attempt) => {
      clearAllTimeouts();
      if (clean(attempt) === clean(targetWord)) {
        onSuccess();
      } else {
        onError();
      }
    },
    [targetWord, onSuccess, onError, clearAllTimeouts],
  );

  // The speaker reads the *definition*, not the word — the word itself is
  // what the learner is meant to produce, so speaking it aloud automatically
  // would give the answer away. Hearing the whole word out loud is instead
  // an explicit, separate hint (see readWholeWord below).
  const readDefinition = useCallback(() => {
    clearAllTimeouts();
    const instruction =
      t('phonemeInstruction') ||
      'Guess the missing letters from the definition';
    speak(instruction, extendedTime);
    if (hintText) {
      const delay = instruction.length * (extendedTime ? 90 : 65) + 1200;
      setSafeTimeout(() => speak(hintText, extendedTime), delay);
    }
  }, [t, hintText, speak, extendedTime, setSafeTimeout, clearAllTimeouts]);

  useAutoReadAloud(voiceAssistant, readDefinition);

  const readWholeWord = useCallback(() => {
    clearAllTimeouts();
    speak(targetWord, extendedTime);
  }, [targetWord, speak, extendedTime, clearAllTimeouts]);

  const handleVoiceMatch = (spoken) => checkAnswer(spoken);

  const animClass = noFlash ? '' : 'animate-in zoom-in duration-500';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-24 sm:h-24 text-3xl sm:text-4xl'
    : 'w-12 h-12 sm:w-20 sm:h-20 text-2xl sm:text-3xl';
  const wordSize = bigTargets ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full max-w-md flex-col items-center justify-center overflow-hidden px-2 py-2`}
    >
      {!zenMode && (
        <h3
          className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-4 sm:text-xs md:text-sm ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('phonemeInstruction') ||
            'Guess the missing letters from the definition'}
        </h3>
      )}

      <div
        className={`font-black ${wordSize} break-word mb-2 flex min-h-0 w-full shrink flex-wrap justify-center gap-1 px-2 text-center leading-tight tracking-widest sm:gap-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
      >
        {maskedChars.map((char, i) => (
          <span
            key={i}
            className={
              char === '_'
                ? isHighContrast
                  ? 'text-white/30'
                  : 'text-slate-300'
                : ''
            }
          >
            {char}
          </span>
        ))}
      </div>

      {hintText && (
        <div
          className={`mx-auto mb-2 min-h-0 max-w-[65ch] shrink overflow-y-auto px-2 text-center text-[10px] leading-relaxed font-medium sm:mb-4 sm:px-4 sm:text-xs md:text-sm ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
        >
          💡 <BionicText text={hintText} enabled={bionicReading} />
        </div>
      )}

      <ExerciseControlsRow className="mb-2 flex shrink-0 items-center justify-center gap-4 sm:mb-4">
        <TTSController
          onReadAloud={readDefinition}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          controlBtnSize={controlBtnSize}
          noFlash={noFlash}
          ttsFallback={ttsFallback}
        />

        <VoiceAnswerButton
          isListening={isListening}
          onStart={() =>
            startListening(undefined, undefined, undefined, handleVoiceMatch)
          }
          error={error}
          t={t}
          themeStyles={themeStyles}
          noFlash={noFlash}
          bigTargets={bigTargets}
          isHighContrast={isHighContrast}
          bionicReading={bionicReading}
          voiceStatus={voiceStatus}
          modelDownloadProgress={modelDownloadProgress}
          confirmModelDownload={confirmModelDownload}
          declineModelDownload={declineModelDownload}
          controlBtnSize={controlBtnSize}
          idleLabel={t('speakTheWord')}
        />

        <button
          type="button"
          onClick={readWholeWord}
          className={`${controlBtnSize} flex items-center justify-center rounded-full border-2 border-dashed transition-all active:scale-90 ${isHighContrast ? 'border-white/50 text-white/80 hover:bg-white/10' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}
          aria-label={t('phonemeRevealHint')}
          title={t('phonemeRevealHint')}
        >
          💡
        </button>
      </ExerciseControlsRow>

      {transcript && (
        <p
          className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-3 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      <div className="flex w-full max-w-xs shrink-0 items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            userInput.trim().length > 0 &&
            checkAnswer(userInput)
          }
          disabled={isListening}
          className={`min-w-0 flex-1 rounded-2xl p-3 text-center text-base font-bold transition-shadow focus:ring-4 focus:outline-none disabled:opacity-50 sm:p-4 sm:text-lg ${
            isHighContrast
              ? 'border-4 border-white bg-black text-white focus:ring-white/50'
              : 'border-2 border-slate-200 bg-white text-slate-800 shadow-inner focus:border-indigo-400 focus:ring-indigo-100'
          }`}
          placeholder={t('typeHere') || '...'}
          aria-label={t('speakTheWord')}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          onClick={() => checkAnswer(userInput)}
          disabled={userInput.trim().length === 0}
          className={`shrink-0 rounded-full px-4 py-3 text-xs font-black tracking-widest uppercase transition-all active:scale-95 sm:px-6 sm:py-4 sm:text-sm ${
            userInput.trim().length === 0
              ? 'cursor-not-allowed bg-slate-200 text-slate-600'
              : isHighContrast
                ? 'bg-white text-black hover:bg-slate-200'
                : `${themeStyles.button} ${themeStyles.buttonText} shadow-md hover:brightness-110`
          }`}
        >
          <BionicText text={t('check') || 'Check'} enabled={bionicReading} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(PhonemeExercise);
