import React, { useState, useEffect, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

function SpatialExercise({
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState('');

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

  const currentItem = data.items[currentIndex];

  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(
      () => {
        clearAudioTimeouts();

        const currentTaskItem = data.items[currentIndex];
        const correctIndex = data.options.findIndex(
          (o) => o.value === currentTaskItem.target,
        );

        if (correctIndex !== -1) {
          const correctOpt = data.options[correctIndex];
          const cleanLabel = correctOpt.label.replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FACF}\u{1FAD0}-\u{1FADF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
            '',
          );

          setActiveHighlight(correctIndex);
          speak(cleanLabel, extendedTime);

          setSafeTimeout(
            () => {
              setActiveHighlight(null);
            },
            cleanLabel.length * (extendedTime ? 100 : 75) + 1500,
          );
        }
      },
      extendedTime ? 3500 : 2500,
    );
  }, [
    onError,
    setSafeTimeout,
    clearAudioTimeouts,
    data,
    currentIndex,
    speak,
    extendedTime,
  ]);

  const handleChoice = (selectedValue) => {
    clearAudioTimeouts();
    if (selectedValue === currentItem.target) {
      if (currentIndex + 1 >= data.items.length) {
        onSuccess();
      } else {
        if (!noFlash) {
          setAnimation('scale-95 opacity-0 transition-all duration-200');
          setSafeTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
            setAnimation('animate-in slide-in-from-right fade-in duration-300');
          }, 200);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    } else {
      handleMistake();
    }
  };

  const handleVoiceMatch = (num) => {
    const option = data.options[num - 1];
    if (option) handleChoice(option.value);
    else handleMistake();
  };

  const readInstructionAndOptions = () => {
    clearAudioTimeouts();

    speak(data.instruction, extendedTime);
    let delayAcc =
      (data.instruction || '').length * (extendedTime ? 100 : 75) + 1500;

    data.options.forEach((opt, index) => {
      const optionPrefix = t('optionPrefix', { number: index + 1 });

      const cleanLabel = opt.label.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FACF}\u{1FAD0}-\u{1FADF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        '',
      );

      const spokenPrefix = optionPrefix.replace(':', '.');
      const fullSpokenText = `${spokenPrefix} ${cleanLabel}`;

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
  };

  useAutoReadAloud(voiceAssistant, readInstructionAndOptions);

  const btnPadding = bigTargets ? 'py-6 sm:py-8' : 'py-4 sm:py-6';
  const cardSize = bigTargets
    ? 'w-40 h-48 sm:w-48 sm:h-60 text-7xl sm:text-8xl'
    : 'w-32 h-40 sm:w-40 sm:h-52 text-6xl sm:text-7xl';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl'
    : 'w-12 h-12 text-xl';

  const isAlphaSymbol = /^[\p{L}]+$/u.test(currentItem?.symbol || '');

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-between overflow-hidden px-2 py-2">
      {}
      <ExerciseControlsRow className="mb-2 flex shrink-0 gap-4">
        <TTSController
          onReadAloud={readInstructionAndOptions}
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

      {/* Before this, the only clue that the mic expects a spoken *option
          number* was the button's aria-label — invisible to sighted users,
          who had no way to know what to say. */}
      {transcript ? (
        <p className="mb-2 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase">
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      ) : (
        <p className="mb-2 shrink-0 text-center text-[10px] font-medium text-slate-600">
          {t('speakOptionNumber')}
        </p>
      )}

      {}
      <div className="mb-2 w-full shrink-0 text-center sm:mb-4">
        {!zenMode && (
          <h3
            className={`mx-auto mb-2 max-w-[65ch] text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          >
            <BionicText text={data.instruction} enabled={bionicReading} />
          </h3>
        )}

        {!zenMode && (
          <div className="flex justify-center gap-1.5">
            {data.items.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? `w-6 ${themeStyles.button}`
                    : i < currentIndex
                      ? `w-2 ${themeStyles.button} opacity-30`
                      : 'w-2 bg-slate-100'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>

      {}
      <div className="my-2 flex min-h-0 w-full flex-1 items-center justify-center sm:my-4">
        <div
          className={`${cardSize} ${isAlphaSymbol ? 'font-dyslexic' : 'font-sans'} flex items-center justify-center rounded-[50px] border-4 bg-white wrap-break-word shadow-xl transition-all md:shadow-md ${themeStyles.border} ${themeStyles.accent} ${animation}`}
        >
          {}
          <BionicText
            text={currentItem?.symbol}
            enabled={bionicReading && isAlphaSymbol}
          />
        </div>
      </div>

      {}
      <div className="grid w-full max-w-sm shrink-0 grid-cols-2 gap-3 px-2 sm:gap-4">
        {data.options?.map((option, i) => (
          <button
            key={i}
            onClick={() => handleChoice(option.value)}
            disabled={isListening}
            className={`relative ${btnPadding} rounded-[35px] border-b-4 text-lg font-black tracking-widest uppercase transition-all active:translate-y-1 active:border-b-0 ${
              isListening
                ? // Dim the tile's own colors rather than swapping in an
                  // unrelated gray + white pairing — see GraphemeExercise
                  // for why this matters more now that the local-Whisper
                  // fallback holds isListening true for several seconds.
                  `${themeStyles.button} ${themeStyles.buttonText} opacity-50 grayscale`
                : activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-110`
            } flex items-center justify-center gap-2 shadow-lg md:shadow-sm`}
          >
            {}
            <span
              className={`absolute top-3 left-4 text-xs font-black ${themeStyles.buttonText}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <BionicText text={option.label} enabled={bionicReading} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(SpatialExercise);
