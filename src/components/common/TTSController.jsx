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
  const [noVoicesAvailable, setNoVoicesAvailable] = useState(false);
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

  // Unlike native SpeechRecognition (see voiceCapabilities.js), speechSynthesis
  // reports itself as supported even with zero installed voices — desktop
  // Firefox has no bundled voices of its own (unlike Chrome, which ships
  // network-backed voices independent of the OS), so it silently does
  // nothing when the OS has none registered either. Without this, tapping
  // the button just looks broken with no indication why.
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const checkVoices = () => {
      setNoVoicesAvailable(window.speechSynthesis.getVoices().length === 0);
    };
    checkVoices();
    window.speechSynthesis.addEventListener('voiceschanged', checkVoices);
    // A browser with genuinely zero voices may never fire 'voiceschanged'
    // at all (there's nothing to notify a change to) — this re-check is
    // what catches that case instead of getting stuck on whatever the
    // synchronous check above happened to see before voices had a chance
    // to load.
    const timeoutId = setTimeout(checkVoices, 1000);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', checkVoices);
      clearTimeout(timeoutId);
    };
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
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggle}
        className={`${controlBtnSize} flex items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-600 shadow-sm transition-all hover:text-slate-600 active:scale-90`}
        aria-label={
          isPaused
            ? t('resume')
            : isSpeaking
              ? t('pause')
              : t('readAloudTitle')
        }
      >
        {isPaused ? '▶️' : isSpeaking ? '⏸️' : '🔊'}
      </button>
      {noVoicesAvailable && (
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-red-800"
        >
          {t('ttsNoVoicesAvailable') ||
            'This browser has no voices installed for reading aloud. Install a voice in your system speech settings, or try Chrome/Edge instead.'}
        </p>
      )}
    </div>
  );
}
