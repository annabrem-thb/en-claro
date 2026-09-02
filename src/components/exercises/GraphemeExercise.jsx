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

function GraphemeExercise({
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

  const questionText =
    data.question?.[language] ||
    data.question?.en ||
    t('chooseCorrectSpelling') ||
    'Choose the correct spelling:';

  const handleVoiceMatch = (num) => {
    clearAudioTimeouts();
    const selectedIndex = num - 1;
    if (selectedIndex >= 0 && selectedIndex < shuffledOptions.length) {
      shuffledOptions[selectedIndex].isCorrect ? onSuccess() : onError();
    } else {
      onError();
    }
  };

  // Chained off each utterance's actual onend/onerror (via speak()'s
  // optional third argument) rather than a guessed
  // characters-times-ms-per-char duration — that estimate silently drifted
  // out of sync with real speech (voice, rate, and especially the
  // extendedTime slowdown all change actual duration) and, once behind,
  // cancelled an option's narration mid-sentence the moment the next one's
  // guessed delay elapsed. With more than a couple of options that
  // compounded into some options never being heard at all.
  const readQuestionAndOptions = () => {
    clearAudioTimeouts();

    const sanitizedQuestion = formatTimeForTTS(
      questionText.replace(/_+/g, ''),
      language,
    );
    const allOptionTexts = shuffledOptions.map((o) => o.text);

    const readOption = (index) => {
      if (index >= shuffledOptions.length) return;
      const opt = shuffledOptions[index];
      const hint = getSmartSpellingHint(opt.text, allOptionTexts, language, t);
      const prefix = t('optionPrefix', { number: index + 1 });
      const spokenPrefix = prefix.replace(':', '.');
      const spokenHint = formatTimeForTTS(hint, language);
      const fullSpokenText = `${spokenPrefix} ${spokenHint}`;

      setActiveHighlight(index);
      speak(fullSpokenText, extendedTime, () => {
        setSafeTimeout(() => {
          setActiveHighlight((prev) => (prev === index ? null : prev));
          readOption(index + 1);
        }, 300);
      });
    };

    speak(sanitizedQuestion, extendedTime, () => {
      setSafeTimeout(() => readOption(0), 500);
    });
  };

  useAutoReadAloud(voiceAssistant, readQuestionAndOptions);

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const btnPadding = bigTargets
    ? 'py-5 px-4 sm:py-8 sm:px-6'
    : 'py-4 px-3 sm:py-6 sm:px-4';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 text-2xl sm:text-3xl'
    : 'w-12 h-12 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-start overflow-hidden px-2 pt-6 pb-2 sm:pt-10`}
    >
      {}
      <ExerciseControlsRow className="mb-2 flex shrink-0 gap-4 sm:mb-4 sm:gap-6">
        <TTSController
          onReadAloud={readQuestionAndOptions}
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
        <p
          className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-widest uppercase sm:mb-3 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      ) : (
        <p
          className={`mb-2 shrink-0 text-center text-[10px] font-medium sm:mb-3 sm:text-xs ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('speakOptionNumber')}
        </p>
      )}

      {!zenMode && (
        <h3
          className={`mx-auto mb-3 min-h-0 max-w-[65ch] shrink-0 px-4 text-center text-[10px] leading-relaxed font-black tracking-[0.15em] uppercase sm:mb-6 sm:text-[11px] ${isHighContrast ? 'text-white/50' : 'text-slate-500'}`}
        >
          <BionicText text={questionText} enabled={bionicReading} />
        </h3>
      )}

      <div className="no-scrollbar flex max-h-full min-h-0 w-full max-w-sm shrink flex-wrap justify-center gap-2 overflow-y-auto px-2 pt-2 pb-2 sm:gap-3">
        {shuffledOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              clearAudioTimeouts();
              opt.isCorrect ? onSuccess() : onError();
            }}
            disabled={isListening}
            className={`relative min-w-32 flex-1 ${btnPadding} flex flex-col items-center justify-center gap-3 rounded-4xl border-b-8 shadow-lg transition-all active:translate-y-2 active:border-b-0 md:shadow-sm ${
              isListening
                ? // Dims the tile in place rather than swapping its colors
                  // out — the previous 'text-white opacity-50 grayscale'
                  // dropped themeStyles.button's background entirely, which
                  // left white text with nothing but the transparent parent
                  // behind it. Barely noticeable with native speech
                  // recognition (isListening is true for a fraction of a
                  // second), but the local-Whisper fallback used on
                  // browsers without native support holds isListening true
                  // for several seconds (recording + transcribing), long
                  // enough for the invisible text to actually be seen.
                  `${themeStyles.button} ${themeStyles.buttonText} opacity-50 grayscale`
                : activeHighlight === i
                  ? 'z-10 scale-105 border-yellow-400 bg-yellow-50 text-slate-900 shadow-xl ring-4 ring-yellow-400'
                  : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-105`
            }`}
          >
            <span
              // `text-white/50` used to sit unconditionally on this badge
              // regardless of button state — against the theme's own button
              // color (the default, non-highlighted state) that blended out
              // to 1.76–2.15:1 on every theme, nowhere near 4.5:1.
              // `themeStyles.buttonText` is already proven safe (5.32–7.34:1)
              // against that same background for the option text right next
              // to it, and reads fine against the yellow highlight state too
              // — and now against the isListening state as well, since that
              // state keeps the same background instead of dropping it.
              className={`absolute top-3 left-4 text-xs font-black sm:top-4 sm:left-5 sm:text-sm ${themeStyles.buttonText}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            {opt.icon && (
              <span className="text-3xl sm:text-4xl" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            <span className="w-full text-center text-lg font-bold break-all sm:text-xl">
              <BionicText text={opt.text} enabled={bionicReading} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(GraphemeExercise);
