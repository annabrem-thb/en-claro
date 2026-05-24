import React, { useState, useEffect } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';

/**
 * TTSController Component
 * Manages text-to-speech execution, supporting pause/resume actions
 * and synchronization with UI highlighting timeouts.
 */
export default function TTSController({
  onReadAloud,
  pauseAllTimeouts,
  resumeAllTimeouts,
  t,
  controlBtnSize = 'w-16 h-16 text-2xl'
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { language } = useAppSettings();
  const fallbacks = {
    pl: { resume: "Wznów", pause: "Wstrzymaj", readAloud: "Czytaj na głos" },
    de: { resume: "Fortsetzen", pause: "Pausieren", readAloud: "Vorlesen" },
    en: { resume: "Resume", pause: "Pause", readAloud: "Read aloud" }
  };
  const l = fallbacks[language] || fallbacks.en;

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
      aria-label={isPaused ? (t?.resume || l.resume) : (isSpeaking ? (t?.pause || l.pause) : (t?.readAloudTitle || l.readAloud))}
    >
      {isPaused ? '▶️' : (isSpeaking ? '⏸️' : '🔊')}
    </button>
  );
}