import React, { useState, useEffect } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';

/**
 * Komponent kontrolujący odczytywanie na głos, uwzględniający pauzę/wznowienie 
 * oraz synchronizację z podświetlaniem (np. używając hooka useSafeTimeouts).
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

  // Nasłuchiwanie stanu Web Speech API (omija bugi z eventami w Android/iOS)
  // Pozwala dynamicznie odświeżać ikonę gdy asystent skończy mówić
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
      setIsPaused(window.speechSynthesis.paused);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isSpeaking) {
      // Start odczytu
      onReadAloud();
    } else if (isPaused) {
      // Wznowienie głosu i wstrzymanych podświetleń
      window.speechSynthesis.resume();
      if (resumeAllTimeouts) resumeAllTimeouts();
      setIsPaused(false);
    } else {
      // Pauzowanie głosu i zamrożenie podświetleń
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