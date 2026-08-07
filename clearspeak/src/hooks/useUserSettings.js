import { useState, useEffect, useCallback } from 'react';

import { getDefaultActiveExercises } from '../data/exerciseTypes.js';

const DEFAULT_SETTINGS = {
  lrs: false,
  contrast: false,
  motorik: false,
  vision: false,
  color: false,
  motion: false,
  spacing: false,
  desaturation: false,
  minimalist: false,
  ruler: false,
  adaptiveDifficulty: true,
  bigTargets: false,
  noFlash: false,
  audioRewards: false,
  extendedTime: false,
  zenMode: false,
  bionicReading: true,
  muteNotifications: false,
  voiceAssistant: false,
  // Default on: with no cap on the point/streak system, this is the only
  // safety net against overlong sessions for users who never visit
  // Settings. Kept easily reachable as an opt-out toggle (A11yTab).
  cognitiveBreaks: true,
  textScale: 100,
  language: 'pl',
  theme: 'Natur',
  dailyGoal: 5,
  userDifficulty: 2,
  appMode: 'gamified',
  // Per-exercise-type opt-out (Exercise Manager, Settings > Exercises). All
  // exercise types are active by default; disabling one removes it from
  // that pillar's task pool (see activePillarTasks in useExerciseSession.js).
  activeExercises: getDefaultActiveExercises(),
};
const SETTINGS_STORAGE_KEY = 'cfg_settings';

// First-run only: if the user has never saved a preference, seed `motion`
// from the OS-level prefers-reduced-motion signal instead of defaulting to
// full animation. Once the user has an explicit saved choice (via the manual
// "Calm screen" toggle), that always wins on later loads.
function getDefaultSettings() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion
    ? { ...DEFAULT_SETTINGS, motion: true }
    : DEFAULT_SETTINGS;
}

export function useUserSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved
      ? { ...getDefaultSettings(), ...JSON.parse(saved) }
      : getDefaultSettings();
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    const html = document.documentElement;
    Object.keys(settings).forEach((key) => {
      if (typeof settings[key] === 'boolean') {
        html.setAttribute(`data-a11y-${key}`, settings[key].toString());
      }
    });
    html.style.setProperty('--user-text-scale', settings.textScale / 100);
  }, [settings]);
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);
  const installPwa = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome: outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);
  return {
    settings: settings,
    updateSetting: updateSetting,
    canInstallPwa: !!deferredPrompt && !isPwaInstalled,
    isPwaInstalled: isPwaInstalled,
    installPwa: installPwa,
  };
}
