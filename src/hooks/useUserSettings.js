import { useState, useEffect, useCallback, useRef } from 'react';

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

// Minimums reproduce today's default look exactly (no slider movement =
// no visual change); maximums are the six design-token spec's stated caps.
// See src/styles/index.css for how each is actually applied.
const DEFAULT_SETTINGS = {
  lrs: false,
  contrast: false,
  motorik: false,
  color: false,
  motion: false,
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
  fontSizeExercise: 16, // px, max 32
  fontSizeUi: 16, // px, max 28
  lineHeight: 1.5, // unitless, max 2.2
  letterSpacing: 0, // em, max 0.24
  wordSpacing: 0, // em, max 0.32
  paragraphSpacing: 0, // em, max 3.0
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
    // Inline styles win over any selector in the stylesheet regardless of
    // specificity, so this is the one place these six tokens are ever set —
    // a11y.css only touches --dyn-font-family (the OpenDyslexic swap) now.
    html.style.setProperty('--font-size-exercise', `${settings.fontSizeExercise}px`);
    html.style.setProperty('--font-size-ui', `${settings.fontSizeUi}px`);
    html.style.setProperty('--line-height', settings.lineHeight);
    html.style.setProperty('--letter-spacing', `${settings.letterSpacing}em`);
    html.style.setProperty('--word-spacing', `${settings.wordSpacing}em`);
    html.style.setProperty(
      '--paragraph-spacing',
      `${settings.paragraphSpacing}em`,
    );
  }, [settings]);
  // `lrs` is a quick preset button dressed as a toggle, not a second
  // parallel mechanism: flipping it on writes its fixed values straight
  // into the same fields the sliders control (so a slider always shows the
  // value actually in effect, never silently overridden elsewhere), and
  // flipping it off returns to the plain baseline rather than trying to
  // remember whatever custom position a slider was at before.
  const prevLrsRef = useRef(settings.lrs);
  useEffect(() => {
    if (settings.lrs === prevLrsRef.current) return;
    prevLrsRef.current = settings.lrs;
    const preset = settings.lrs
      ? {
          fontSizeExercise: 14,
          fontSizeUi: 14,
          lineHeight: 1.75,
          letterSpacing: 0.08,
          wordSpacing: 0.2,
        }
      : {
          fontSizeExercise: DEFAULT_SETTINGS.fontSizeExercise,
          fontSizeUi: DEFAULT_SETTINGS.fontSizeUi,
          lineHeight: DEFAULT_SETTINGS.lineHeight,
          letterSpacing: DEFAULT_SETTINGS.letterSpacing,
          wordSpacing: DEFAULT_SETTINGS.wordSpacing,
        };
    setSettings((prev) => ({ ...prev, ...preset }));
  }, [settings.lrs]);
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
