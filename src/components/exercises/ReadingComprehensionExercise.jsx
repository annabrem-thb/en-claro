import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

function ReadingComprehensionExercise({
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
  voiceAssistant = false,
  isHighContrast = false,
}) {
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

  const shuffledOptions = useMemo(() => {
    if (!data.options) return [];
    const seed = data.id || 0;
    return [...data.options].sort(
      (a, b) =>
        (a.text?.charCodeAt(0) || 0) +
        seed -
        ((b.text?.charCodeAt(0) || 0) + seed),
    );
  }, [data]);

  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    const selected = shuffledOptions[num - 1];
    if (selected) {
      selected.isCorrect ? onSuccess() : onError();
    }
  };

  const passageText = data.passage?.[language] || data.passage?.en || '';
  const questionText = data.question?.[language] || data.question?.en || '';

  // The passage stays visible on screen throughout — unlike the short
  // question-only header other exercises use, comprehension tasks require
  // rereading a multi-sentence passage while weighing the answer options,
  // so it gets its own readable, larger-type card rather than the tiny
  // uppercase-tracked question style.
  const readAll = useCallback(() => {
    clearAudioTimeouts();
    speak(passageText, extendedTime);
    let delayAcc = passageText.length * (extendedTime ? 90 : 65) + 1500;

    setSafeTimeout(() => speak(questionText, extendedTime), delayAcc);
    delayAcc += questionText.length * (extendedTime ? 90 : 65) + 1200;

    shuffledOptions.forEach((opt, index) => {
      const prefix = t('optionPrefix', { number: index + 1 });
      const spokenPrefix = prefix.replace(':', '.');
      const fullSpokenText = `${spokenPrefix} ${opt.text}`;
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
    });
  }, [
    passageText,
    questionText,
    shuffledOptions,
    speak,
    extendedTime,
    t,
    setSafeTimeout,
    clearAudioTimeouts,
  ]);

  useAutoReadAloud(voiceAssistant, readAll);

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const btnPadding = bigTargets
    ? 'py-4 px-4 sm:py-6 sm:px-6'
    : 'py-3 px-3 sm:py-4 sm:px-4';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center overflow-hidden px-2 pt-4 pb-2 sm:pt-6`}
    >
      <ExerciseControlsRow className="mb-2 flex shrink-0 gap-4 sm:mb-3">
        <TTSController
          onReadAloud={readAll}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          controlBtnSize={controlBtnSize}
          noFlash={noFlash}
          ttsFallback={ttsFallback}
        />

        <VoiceAnswerButton
          isListening={isListening}
          onStart={() => startListening(handleVoiceMatch)}
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
        />
      </ExerciseControlsRow>

      {transcript && (
        <p
          className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-3 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}

      <div
        className={`prose-text no-scrollbar mb-2 min-h-0 w-full max-w-2xl flex-1 overflow-y-auto rounded-3xl border-2 p-3 sm:mb-4 sm:p-6 ${
          isHighContrast
            ? 'border-white/30 bg-black text-white'
            : `${themeStyles.border} bg-white text-slate-800`
        }`}
      >
        <p className="text-left text-sm leading-snug font-medium sm:text-lg sm:leading-relaxed">
          <BionicText text={passageText} enabled={bionicReading} />
        </p>
      </div>

      {!zenMode && (
        <h3
          className={`mx-auto mb-2 min-h-0 max-w-[65ch] shrink-0 px-4 text-center text-[10px] leading-snug font-black tracking-[0.15em] uppercase sm:mb-4 sm:text-[11px] sm:leading-relaxed ${isHighContrast ? 'text-white/50' : 'text-slate-500'}`}
        >
          <BionicText text={questionText} enabled={bionicReading} />
        </h3>
      )}

      <div className="no-scrollbar flex max-h-full w-full max-w-sm shrink-0 flex-wrap justify-center gap-2 overflow-y-auto px-2 pb-2 sm:gap-3">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : onError();
            }}
            disabled={isListening}
            className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-2 rounded-4xl border-b-8 shadow-lg transition-all active:translate-y-2 active:border-b-0 md:shadow-sm ${
              isListening
                ? // Keeps themeStyles.button's background instead of
                  // dropping it — the number badge below always uses
                  // themeStyles.buttonText, which was left illegible
                  // against the transparent fallback this state used to
                  // produce, most visibly once the local-Whisper fallback
                  // holds isListening true for several seconds.
                  `${themeStyles.button} ${themeStyles.buttonText} opacity-50 grayscale`
                : activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-105`
            }`}
          >
            <span
              className={`absolute top-3 left-4 text-xs font-black sm:top-4 sm:left-5 sm:text-sm ${themeStyles.buttonText}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="w-full text-center text-base font-bold wrap-break-word sm:text-lg">
              <BionicText text={opt.text} enabled={bionicReading} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ReadingComprehensionExercise);
