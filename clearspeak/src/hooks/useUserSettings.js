import { useState, useEffect, useCallback } from 'react';

// Domyślne wartości odpowiadające atrybutom w a11y.css
const DEFAULT_SETTINGS = {
  lrs: true, // Zgodnie z a11y.css, domyślnie włączone (OpenDyslexic)
  contrast: false,
  motorik: false,
  vision: false,
  color: false,
  motion: false,
  spacing: false,
  desaturation: false,
  minimalist: false,
  textScale: 1, // Używane w index.css jako --user-text-scale
  appMode: 'gamified' // 'classic' lub 'gamified'
};

export function useUserSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('claro_user_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error("Błąd odczytu ustawień:", e);
      return DEFAULT_SETTINGS;
    }
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  // --- EFEKT 1: Synchronizacja ustawień do CSS (HTML data-attributes) ---
  useEffect(() => {
    // Zapisz do localStorage
    localStorage.setItem('claro_user_settings', JSON.stringify(settings));
    
    const html = document.documentElement;
    
    // Wstrzyknięcie atrybutów dla a11y.css (np. data-a11y-contrast="true")
    Object.keys(settings).forEach(key => {
      if (typeof settings[key] === 'boolean') {
        html.setAttribute(`data-a11y-${key}`, settings[key].toString());
      }
    });

    // Wstrzyknięcie skalowania tekstu dla index.css
    html.style.setProperty('--user-text-scale', settings.textScale);

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