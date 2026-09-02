import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import { getSmartSpellingHint } from '../../utils/spellingHints';
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

function ContextExercise({
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
    const hash = (str) =>
      Array.from(str).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
    const seed = hash(data.sentence_part1 || 'context');
    return [...data.options].sort(
      (a, b) => hash((a.text || '') + seed) - hash((b.text || '') + seed),
    );
  }, [data]);

  const handleMistake = useCallback(() => {
    onError();
    setSafeTimeout(
      () => {
        clearAudioTimeouts();

        const correctOpt = shuffledOptions.find((o) => o.isCorrect);
        if (correctOpt) {
          const part1 = data.sentence_part1 || '';
          const part2 = data.sentence_part2 || '';
          const fullSentence = `${part1} ${correctOpt.text} ${part2}`
            .replace(/\s+([.,!?;:])/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
          speak(formatTimeForTTS(fullSentence, language), extendedTime);
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
    const selected = shuffledOptions[num - 1];
    if (selected) {
      selected.isCorrect ? onSuccess() : handleMistake();
    } else {
      handleMistake();
    }
  };

  const readContextAndOptions = () => {
    clearAudioTimeouts();

    let delayAcc = 0;

    const instruction = t('selectCorrect') || 'Select the correct word:';
    setSafeTimeout(() => speak(instruction, extendedTime), delayAcc);
    delayAcc += instruction.length * (extendedTime ? 90 : 65) + 1000;

    if (data.sentence_part1) {
      setSafeTimeout(
        () =>
          speak(formatTimeForTTS(data.sentence_part1, language), extendedTime),
        delayAcc,
      );
      delayAcc += data.sentence_part1.length * (extendedTime ? 90 : 65) + 1000;
    }

    if (data.sentence_part2) {
      const cleanPart2 = data.sentence_part2.replace(/^[.,!?;:]+$/, '');
      if (cleanPart2.trim()) {
        setSafeTimeout(
          () => speak(formatTimeForTTS(cleanPart2, language), extendedTime),
          delayAcc,
        );
      }
      delayAcc += data.sentence_part2.length * (extendedTime ? 90 : 65) + 1500;
    }

    const allOptionTexts = shuffledOptions.map((o) => o.text);
    shuffledOptions.forEach((opt, index) => {
      const optionPrefix = t('optionPrefix', { number: index + 1 });

      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);

      const spokenPrefix = optionPrefix.replace(':', '.');
      const spokenHint = formatTimeForTTS(hint, language);
      const fullSpokenText = `${spokenPrefix} ${spokenHint}`;

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

  useAutoReadAloud(voiceAssistant, readContextAndOptions);

  const animClass = noFlash
    ? ''
    : 'animate-in slide-in-from-bottom duration-500';
  const btnPadding = bigTargets ? 'py-5 sm:py-6' : 'py-4 sm:py-5';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-start overflow-hidden px-2 pt-6 pb-2 sm:pt-10`}
    >
      {!zenMode && (
        <h3
          className={`mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('selectCorrect') || 'Select the correct word'}
        </h3>
      )}

      <div className="mx-auto mb-3 min-h-0 max-w-[65ch] shrink px-2 text-center text-base leading-relaxed font-bold text-slate-700 sm:mb-4 sm:text-xl md:text-2xl">
        <BionicText text={data.sentence_part1} enabled={bionicReading} />
        <span
          className={`mx-1 border-b-4 px-3 sm:mx-2 sm:px-4 ${themeStyles.border} rounded-lg bg-slate-50 text-slate-600`}
        >
          ____
        </span>
        <BionicText text={data.sentence_part2} enabled={bionicReading} />
      </div>

      <ExerciseControlsRow className="mb-3 flex shrink-0 gap-4 sm:mb-6 sm:gap-6">
        <TTSController
          onReadAloud={readContextAndOptions}
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
        <p className="mb-2 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase sm:mb-3 sm:text-xs">
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      ) : (
        <p className="mb-2 shrink-0 text-center text-[10px] font-medium text-slate-600 sm:mb-3 sm:text-xs">
          {t('speakOptionNumber')}
        </p>
      )}

      <div className="no-scrollbar grid max-h-full min-h-0 w-full max-w-sm shrink grid-cols-1 gap-2 overflow-y-auto px-2 pt-2 pb-2 sm:gap-3">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : handleMistake();
            }}
            disabled={isListening}
            className={`relative ${btnPadding} rounded-2xl border-2 text-base font-black shadow-sm transition-all active:scale-95 sm:rounded-3xl sm:text-xl md:shadow-none ${
              isListening
                ? // Keeps the tile's normal border/text colors, just dimmed
                  // — dropping them outright left text-color-less option
                  // text relying on whatever's inherited, invisible on some
                  // themes once the local-Whisper fallback (Firefox/
                  // Safari) holds isListening true long enough to notice.
                  `${themeStyles.border} ${themeStyles.accent} bg-white opacity-50 grayscale`
                : activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.border} ${themeStyles.accent} bg-white hover:${themeStyles.bg}`
            }`}
          >
            <span
              className={`absolute top-4 left-5 text-sm font-black ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
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

export default React.memo(ContextExercise);
