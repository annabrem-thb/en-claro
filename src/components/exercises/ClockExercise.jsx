import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

const formatTimeForTTS = (text, lang) => {
  if (!text) return '';
  return text
    .replace(/\b0?(\d+):(\d+)\b/g, (match, h, m) => {
      const min = parseInt(m, 10);
      if (lang === 'pl') {
        return min === 0 ? `godzina ${h}` : `godzina ${h} i ${min} minut`;
      }
      if (lang === 'de') {
        return min === 0 ? `${h} Uhr` : `${h} Uhr ${min}`;
      }
      return min === 0 ? `${h}` : `${h} ${min}`;
    })
    .replace(/\s*Uhr\s*Uhr/gi, ' Uhr');
};

function ClockExercise({
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
    const hash = (s) =>
      Array.from(s).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
    const seed = hash(data.timeAnalog || 'clock');
    return [...data.options].sort(
      (a, b) => hash((a.text || '') + seed) - hash((b.text || '') + seed),
    );
  }, [data]);

  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(
      () => {
        clearAudioTimeouts();

        const correctIndex = shuffledOptions.findIndex((o) => o.isCorrect);
        if (correctIndex !== -1) {
          const correctOpt = shuffledOptions[correctIndex];
          setActiveHighlight(correctIndex);

          const spokenTime = formatTimeForTTS(correctOpt.text, language);
          speak(`${data.timeAnalog}. ${spokenTime}`, extendedTime);

          setSafeTimeout(
            () => {
              setActiveHighlight(null);
            },
            extendedTime ? 4000 : 3000,
          );
        }
      },
      extendedTime ? 3500 : 2500,
    );
  }, [
    onError,
    setSafeTimeout,
    clearAudioTimeouts,
    shuffledOptions,
    data,
    speak,
    extendedTime,
    language,
  ]);

  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < shuffledOptions.length) {
      shuffledOptions[selectedIndex].isCorrect ? onSuccess() : handleMistake();
    } else {
      handleMistake();
    }
  };

  const readTimeAndOptions = () => {
    clearAudioTimeouts();

    const instruction = t('clockInstruction') || 'Select the matching time';
    speak(instruction, extendedTime);
    const instructionDelay =
      instruction.length * (extendedTime ? 90 : 65) + 1200;
    setSafeTimeout(
      () => speak(data.timeAnalog, extendedTime),
      instructionDelay,
    );

    const charCount = (data.timeAnalog || '').length;
    let delayAcc =
      instructionDelay + charCount * (extendedTime ? 90 : 65) + 1500;

    shuffledOptions.forEach((opt, index) => {
      const prefix = t('optionPrefix', { number: index + 1 });

      const spokenPrefix = prefix.replace(':', '.');
      const spokenTime = formatTimeForTTS(opt.text, language);
      const fullSpokenText = `${spokenPrefix} ${spokenTime}`;

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

  useAutoReadAloud(voiceAssistant, readTimeAndOptions);

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const bounceClass = noFlash ? '' : 'animate-bounce duration-[3s]';
  const btnPadding = bigTargets
    ? 'py-5 px-2 text-lg sm:text-xl'
    : 'py-4 px-2 text-base sm:text-lg';
  const clockSize = bigTargets
    ? 'w-44 h-44 sm:w-60 sm:h-60'
    : 'w-36 h-36 sm:w-48 sm:h-48';
  const hourLen = bigTargets ? 'h-12 sm:h-18' : 'h-10 sm:h-14';
  const minLen = bigTargets ? 'h-18 sm:h-24' : 'h-14 sm:h-20';
  const controlBtnSize = bigTargets
    ? 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl'
    : 'w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2`}
    >
      {}
      <ExerciseControlsRow>
        <TTSController
          onReadAloud={readTimeAndOptions}
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

      {}
      {/* Before this, the only clue that the mic expects a spoken *option
          number* (not the time read aloud) was the button's aria-label —
          invisible to sighted users, who had no way to know what to say. */}
      {transcript ? (
        <p className="mb-1 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase sm:mb-2">
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      ) : (
        <p className="mb-1 shrink-0 text-center text-[10px] font-medium text-slate-600 sm:mb-2">
          {t('speakOptionNumber')}
        </p>
      )}

      {}
      <div className="mb-2 flex shrink-0 flex-col items-center sm:mb-4">
        {!zenMode && (
          <h3
            className={`mb-2 text-center text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          >
            {t('clockInstruction') || 'Select the matching time'}
          </h3>
        )}
        <div className={`mb-1 text-4xl ${bounceClass}`} aria-hidden="true">
          {data.isNight ? '🌙' : '☀️'}
        </div>
        {!zenMode && (
          <p
            className={`max-w-[65ch] text-xs font-medium tracking-wide italic ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          >
            <BionicText text={data.timeAnalog} enabled={bionicReading} />
          </p>
        )}
      </div>

      {}
      <style>{`
        @keyframes clock-tick {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className={`relative ${clockSize} mb-4 flex shrink-0 items-center justify-center rounded-full border-8 shadow-xl transition-colors duration-1000 sm:mb-6 md:shadow-md ${
          data.isNight
            ? 'border-slate-700 bg-slate-800 shadow-blue-900/20'
            : 'border-slate-100 bg-white shadow-slate-200/50'
        }`}
      >
        {}
        <div
          className={`absolute w-2 ${hourLen} rounded-full transition-all duration-700 ${data.isNight ? 'bg-blue-200' : 'bg-slate-800'}`}
          style={{
            transform: `rotate(${data.hourRotation}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
          }}
        />
        {}
        <div
          className={`absolute w-1.5 ${minLen} rounded-full transition-all duration-700 ${data.isNight ? 'bg-slate-400' : 'bg-slate-400'}`}
          style={{
            transform: `rotate(${data.minuteRotation}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
          }}
        />
        {}
        {!noFlash && (
          <div
            className={`absolute w-0.5 ${minLen} z-0 rounded-full bg-red-500`}
            style={{
              transformOrigin: 'bottom center',
              bottom: '50%',
              animation: 'clock-tick 60s steps(60) infinite',
            }}
          />
        )}
        {}
        <div
          className={`z-10 h-4 w-4 rounded-full shadow-md md:shadow-sm ${data.isNight ? 'bg-blue-300' : 'bg-slate-800'}`}
        />
        {}
        <div
          className={`absolute top-2 h-3 w-1.5 rounded-full sm:h-4 ${data.isNight ? 'bg-slate-600' : 'bg-slate-200'}`}
        />
        <div
          className={`absolute bottom-2 h-3 w-1.5 rounded-full sm:h-4 ${data.isNight ? 'bg-slate-600' : 'bg-slate-200'}`}
        />
        <div
          className={`absolute left-2 h-1.5 w-3 rounded-full sm:w-4 ${data.isNight ? 'bg-slate-600' : 'bg-slate-200'}`}
        />
        <div
          className={`absolute right-2 h-1.5 w-3 rounded-full sm:w-4 ${data.isNight ? 'bg-slate-600' : 'bg-slate-200'}`}
        />
      </div>

      {}
      <div className="grid w-full max-w-md shrink-0 grid-cols-2 gap-2 px-2 sm:max-w-lg sm:gap-3">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : handleMistake();
            }}
            disabled={isListening}
            className={`relative ${btnPadding} flex min-h-16 items-center justify-center overflow-hidden rounded-2xl border-2 text-center leading-tight font-black shadow-sm transition-all active:scale-95 sm:rounded-3xl md:shadow-none ${
              isListening
                ? // Keeps the tile's normal border/text colors, just dimmed
                  // — see ContextExercise/GraphemeExercise for why dropping
                  // them outright is a real invisible-text bug now that the
                  // local-Whisper fallback holds isListening true for
                  // several seconds instead of a barely-visible instant.
                  `${themeStyles.border} ${themeStyles.accent} bg-white opacity-50 grayscale`
                : activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.border} ${themeStyles.accent} bg-white hover:${themeStyles.bg}`
            }`}
          >
            <span
              className={`absolute top-2 left-3 text-xs font-black ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <BionicText text={opt.text} enabled={bionicReading} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ClockExercise);
