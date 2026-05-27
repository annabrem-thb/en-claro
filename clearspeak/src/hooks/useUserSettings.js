import { useState, useEffect, useCallback } from 'react';

// Default values corresponding to attributes in a11y.css
const DEFAULT_SETTINGS = {
  lrs: false, // User choice by default
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
  textScale: 100,
  language: 'pl',
  theme: 'Natur',
  dailyGoal: 5,
  userDifficulty: 2,
  appMode: 'gamified'
};

export function useUserSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  // --- EFFECT 1: Synchronize settings to CSS (HTML data-attributes) ---
  useEffect(() => {
    const html = document.documentElement;
    
    // Inject attributes for a11y.css (e.g., data-a11y-contrast="true")
    Object.keys(settings).forEach(key => {
      if (typeof settings[key] === 'boolean') {
        html.setAttribute(`data-a11y-${key}`, settings[key].toString());
      }
    });

    // Inject text scaling variable for index.css
    html.style.setProperty('--user-text-scale', settings.textScale / 100);

  }, [settings]);

  // --- EFFECT 2: Handle PWA installation state ---
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      // Prevent the default native installation prompt
      e.preventDefault();
      // Save the prompt to trigger it via our custom button
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    // Listen to built-in browser events
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if the app is already running in standalone mode (installed on desktop/mobile)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const installPwa = useCallback(async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    settings,
    updateSetting,
    canInstallPwa: !!deferredPrompt && !isPwaInstalled,
    isPwaInstalled,
    installPwa
  };
}