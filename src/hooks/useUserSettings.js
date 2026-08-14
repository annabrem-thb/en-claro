import { useState, useEffect, useCallback } from 'react';

import { getDefaultActiveExercises } from '../data/exerciseTypes.js';
import { safeJSONParse } from '../utils/safeJSONParse.js';

const SUPPORTED_LANGUAGES = ['pl', 'en', 'de'];

// First-run only: picks the closest supported language from the browser's
// own reported language(s) instead of always starting in Polish, so a
// visitor never has to find Settings just to read the app in a language
// they understand. Falls back to 'en' (matching i18next's own fallbackLng)
// when the browser reports something this app doesn't have a translation
// for. Once a user has an explicit saved choice (LanguageSwitcher), that
// always wins on later loads — this only seeds the very first run.
function getDefaultLanguage() {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    const primary = candidate.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(primary)) return primary;
  }
  return 'en';
}

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
  adaptiveDifficulty: false,
  bigTargets: false,
  noFlash: false,
  audioRewards: false,
  extendedTime: false,
  zenMode: false,
  bionicReading: false,
  muteNotifications: false,
  voiceAssistant: false,
  cognitiveBreaks: false,
  textScale: 100,
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
  return {
    ...DEFAULT_SETTINGS,
    language: getDefaultLanguage(),
    motion: prefersReducedMotion,
  };
}

export function useUserSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved
      ? { ...getDefaultSettings(), ...safeJSONParse(saved, {}) }
      : getDefaultSettings();
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  // Lazy initializer, not an effect-time setState: matchMedia's result is
  // available synchronously at mount (same pattern already used for
  // prefersReducedMotion above), so there's no need to render once as
  // "not installed" and then flip a tick later.
  const [isPwaInstalled, setIsPwaInstalled] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches,
  );
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
