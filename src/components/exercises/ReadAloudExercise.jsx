import React, { useEffect, useCallback } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

function ReadAloudExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language,
  t,
  speak,
  ttsFallback,
  noFlash,
  bigTargets,
  extendedTime,
  bionicReading,
  zenMode,
  voiceAssistant,
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
  const { pauseAllTimeouts, resumeAllTimeouts } = useSafeTimeouts();

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const normalizeText = (text) =>
    text
      .toLowerCase()
      .replace(/[.,!?;:„”"'-]/g, '')
      .trim();

  const handleCheck = useCallback(() => {
    if (!transcript) return;
    const cleanSpoken = normalizeText(transcript);
    const cleanTarget = normalizeText(data.text);

    // Deliberately one-directional: the *target* must appear in full inside
    // what was spoken (cleanSpoken.includes(cleanTarget) tolerates a stray
    // recognized word/filler at either end), but the reverse used to also
    // pass — meaning reading just one word of a multi-word sentence, or any
    // other truncated fragment, was silently scored as a correct full read.
    if (cleanSpoken === cleanTarget || cleanSpoken.includes(cleanTarget)) {
      onSuccess();
    } else {
      onError();
    }
  }, [transcript, data.text, onSuccess, onError]);

  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';
  const handleReadAloud = useCallback(() => {
    speak(data.text, extendedTime);
  }, [speak, data.text, extendedTime]);

  useAutoReadAloud(voiceAssistant, handleReadAloud);

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-500'}`}
    >
      {!zenMode && (
        <h3
          className={`mb-2 shrink-0 text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          <BionicText
            text={t('readAloudTitle') || 'Read aloud'}
            enabled={bionicReading}
          />
        </h3>
      )}

      <div className="mb-3 flex min-h-0 w-full max-w-[65ch] shrink flex-col items-center justify-center overflow-y-auto rounded-3xl border-2 border-slate-100 bg-white px-4 py-4 text-center shadow-sm sm:mb-6 sm:px-8 sm:py-8">
        <span className="text-lg leading-relaxed font-bold text-slate-700 sm:text-2xl md:text-3xl lg:text-4xl">
          <BionicText text={data.text} enabled={bionicReading} />
        </span>
      </div>

      <ExerciseControlsRow>
        <TTSController
          onReadAloud={handleReadAloud}
          pauseAllTimeouts={pauseAllTimeouts}
          resumeAllTimeouts={resumeAllTimeouts}
          controlBtnSize={controlBtnSize}
          noFlash={noFlash}
          ttsFallback={ttsFallback}
        />

        <VoiceAnswerButton
          isListening={isListening}
          onStart={() => startListening()}
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
          idleLabel={t('speakTextAloud')}
          unsupportedHint={t('micUnsupportedReadAloud')}
          fallbackHint={t('micFallbackHintReadAloud')}
        />
      </ExerciseControlsRow>

      {/* Before this, the only clue that the mic here expects the displayed
          text read verbatim — not an option number, unlike every other
          exercise's mic — was the button's aria-label, invisible to sighted
          users. It also defaulted to the generic "speak option number"
          wording, which was simply wrong for this exercise. */}
      {!transcript && (
        <p className="mb-2 shrink-0 text-center text-[10px] font-medium text-slate-600">
          {t('speakTextAloud')}
        </p>
      )}

      {transcript && (
        <div className="flex w-full max-w-sm shrink-0 flex-col items-center gap-3 sm:gap-4">
          <p className="text-center text-xs font-black tracking-widest text-slate-600 uppercase">
            {t('heard')}: <span className="text-slate-600">{transcript}</span>
          </p>
          <button
            onClick={handleCheck}
            className={`w-full rounded-full py-4 font-black tracking-widest uppercase transition-all active:scale-95 ${themeStyles.button} ${themeStyles.buttonText} shadow-xl hover:brightness-110`}
          >
            <BionicText text={t('check') || 'Check'} enabled={bionicReading} />
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(ReadAloudExercise);
