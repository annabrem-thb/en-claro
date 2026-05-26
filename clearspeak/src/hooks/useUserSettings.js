import { useState, useEffect, useCallback } from 'react';

// Domyślne wartości odpowiadające atrybutom w a11y.css
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

  // --- EFEKT 1: Synchronizacja ustawień do CSS (HTML data-attributes) ---
  useEffect(() => {
    const html = document.documentElement;
    
    // Wstrzyknięcie atrybutów dla a11y.css (np. data-a11y-contrast="true")
    Object.keys(settings).forEach(key => {
      if (typeof settings[key] === 'boolean') {
        html.setAttribute(`data-a11y-${key}`, settings[key].toString());
      }
    });

    // Wstrzyknięcie skalowania tekstu dla index.css
    html.style.setProperty('--user-text-scale', settings.textScale / 100);

  }, [settings]);

  // --- EFEKT 2: Obsługa stanu instalacji PWA ---
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      // Zapobiegamy domyślnemu wyświetleniu natywnego paska instalacji
      e.preventDefault();
      // Zapisujemy prompt, aby wywołać go własnym przyciskiem
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    // Nasłuchiwanie na wbudowane eventy przeglądarki
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Sprawdzanie, czy aplikacja jest już uruchomiona w trybie standalone (zainstalowana na pulpicie/w telefonie)
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