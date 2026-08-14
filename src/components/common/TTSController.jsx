import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

export default function TTSController({
  onReadAloud,
  pauseAllTimeouts,
  resumeAllTimeouts,
  controlBtnSize = 'w-16 h-16 text-2xl',
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Optional-chained like every other `window.speechSynthesis` access in
    // this codebase (see useGlobalTTS.js, useExerciseVoice.jsx, etc.) — a
    // browser/context without the Web Speech API would otherwise throw here
    // every 200ms for as long as this button stays mounted.
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis?.speaking || false);
      setIsPaused(window.speechSynthesis?.paused || false);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
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

  return (
    <button
      onClick={handleToggle}
      className={`${controlBtnSize} flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-600 shadow-sm transition-all hover:text-slate-600 active:scale-90`}
      aria-label={
        isPaused ? t('resume') : isSpeaking ? t('pause') : t('readAloudTitle')
      }
    >
      {isPaused ? '▶️' : isSpeaking ? '⏸️' : '🔊'}
    </button>
  );
}
