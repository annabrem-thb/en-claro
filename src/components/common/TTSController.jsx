import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import LocalTTSConsentModal from './LocalTTSConsentModal.jsx';

export default function TTSController({
  onReadAloud,
  pauseAllTimeouts,
  resumeAllTimeouts,
  controlBtnSize = 'w-16 h-16 text-2xl',
  isHighContrast = false,
  noFlash = false,
  bionicReading = false,
  // Undefined for every caller except when App.jsx has detected zero
  // installed system voices (see useLocalTTS.js) — every other call site is
  // unaffected, same pattern as VoiceAnswerButton's local-Whisper fields.
  // `speak()` itself already routes to the fallback engine transparently;
  // this is only what the button needs to show its own state (speaking/
  // paused/downloading) and drive pause/resume, since those can't be read
  // off `window.speechSynthesis` when nothing is actually using it.
  ttsFallback,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t } = useTranslation();

  const usingFallback = !!ttsFallback?.active;

  useEffect(() => {
    // The fallback reports its own isSpeaking/isPaused via props instead —
    // window.speechSynthesis stays permanently idle since nothing calls it.
    if (usingFallback) return;
    // Optional-chained like every other `window.speechSynthesis` access in
    // this codebase (see useGlobalTTS.js, useExerciseVoice.jsx, etc.) — a
    // browser/context without the Web Speech API would otherwise throw here
    // every 200ms for as long as this button stays mounted.
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis?.speaking || false);
      setIsPaused(window.speechSynthesis?.paused || false);
    }, 200);
    return () => clearInterval(interval);
  }, [usingFallback]);

  const displayIsSpeaking = usingFallback ? ttsFallback.isSpeaking : isSpeaking;
  const displayIsPaused = usingFallback ? ttsFallback.isPaused : isPaused;

  const handleToggle = () => {
    if (usingFallback) {
      if (!ttsFallback.isSpeaking) {
        onReadAloud();
      } else if (ttsFallback.isPaused) {
        ttsFallback.resume();
        if (resumeAllTimeouts) resumeAllTimeouts();
      } else {
        ttsFallback.pause();
        if (pauseAllTimeouts) pauseAllTimeouts();
      }
      return;
    }
    if (!isSpeaking) {
      onReadAloud();
    } else if (isPaused) {
      window.speechSynthesis.resume();
      if (resumeAllTimeouts) resumeAllTimeouts();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      if (pauseAllTimeouts) pauseAllTimeouts();
      setIsPaused(true);
    }
  };

  const awaitingLocalSetup =
    usingFallback &&
    (ttsFallback.status === 'awaiting-consent' ||
      ttsFallback.status === 'loading-model');

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggle}
        className={`${controlBtnSize} flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-600 shadow-sm transition-all hover:text-slate-600 active:scale-90`}
        aria-label={
          displayIsPaused
            ? t('resume')
            : displayIsSpeaking
              ? t('pause')
              : t('readAloudTitle')
        }
      >
        {displayIsPaused ? '▶️' : displayIsSpeaking ? '⏸️' : '🔊'}
      </button>
      {usingFallback && ttsFallback.status === 'error' && (
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-red-800"
        >
          {ttsFallback.error === 'local-download-error'
            ? t('ttsLocalDownloadError') ||
              "The voice model couldn't be downloaded — check your connection and try again."
            : t('ttsLocalEngineError') ||
              'Something went wrong reading this aloud — try again.'}
        </p>
      )}
      {usingFallback && (
        <LocalTTSConsentModal
          open={awaitingLocalSetup}
          status={ttsFallback.status}
          progress={ttsFallback.progress}
          onConfirm={ttsFallback.confirmDownload}
          onDecline={ttsFallback.declineDownload}
          isHighContrast={isHighContrast}
          noFlash={noFlash}
          bionicReading={bionicReading}
          t={t}
        />
      )}
    </div>
  );
}
