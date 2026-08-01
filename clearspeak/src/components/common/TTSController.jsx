import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TTSController Component
 * Manages text-to-speech execution, supporting pause/resume actions
 * and synchronization with UI highlighting timeouts.
 */
export default function TTSController({
  onReadAloud,
  pauseAllTimeouts,
  resumeAllTimeouts,
  controlBtnSize = 'w-16 h-16 text-2xl'
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { t } = useTranslation();

  // Polling Web Speech API state bypasses known event bugs on Android/iOS
  // and allows for dynamic icon updates when the assistant finishes speaking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
      setIsPaused(window.speechSynthesis.paused);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isSpeaking) {
      // Start reading
      onReadAloud();
    } else if (isPaused) {
      // Resume speech and internal highlighting
      window.speechSynthesis.resume();
      if (resumeAllTimeouts) resumeAllTimeouts();
      setIsPaused(false);
    } else {
      // Pause speech and freeze highlights
      window.speechSynthesis.pause();
      if (pauseAllTimeouts) pauseAllTimeouts();
      setIsPaused(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`${controlBtnSize} flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 shadow-sm transition-all hover:text-slate-600 active:scale-90`}
      aria-label={isPaused ? t('resume') : (isSpeaking ? t('pause') : t('readAloudTitle'))}
    >
      {isPaused ? '▶️' : (isSpeaking ? '⏸️' : '🔊')}
    </button>
  );
}