// AppConfigContext.jsx
// Provides the AppConfigContext value to the component tree.
// App.jsx manages its own config state for performance — this provider
// exists for any future child components that want context access.

import React, { useState, useEffect } from 'react';
import { AppConfigContext } from './AppConfig';

export function AppConfigProvider({ children }) {
  const [theme, setTheme] = useState('Natur');
  const [accessibility, setAccessibility] = useState('Standard');
  const [language, setLanguage] = useState('de');

  // Stan przechowujący aktywne dodatki dostępności (wczytywany z localStorage)
  const [a11ySettings, setA11ySettings] = useState(() => {
    const saved = localStorage.getItem('cfg_a11ySettings');
    return saved ? JSON.parse(saved) : {
      motorik: false,
      contrast: false,
      vision: false,
      color: false,
      motion: false,
      bionic: false,
      ruler: false,
      spacing: false,
      desaturation: false,
      rulerVariant: 'shade', // 'shade' | 'underline' | 'greybar'
      customFont: false,     // Pozwala na włączenie opcji użytkownika
      fontFamily: "Helvetica, Arial, sans-serif",
      lineHeight: "2.0",
      wordSpacing: "0.25em"
    };
  });

  // Efekt synchronizujący aktywne ustawienia z tagiem <html> dla CSS
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(a11ySettings).forEach(([key, isActive]) => {
      const attributeName = `data-a11y-${key}`;
      if (isActive) {
        root.setAttribute(attributeName, 'true');
      } else {
        root.removeAttribute(attributeName);
      }
    });
    
    // Nadpisywanie zmiennych CSS dla zaawansowanej personalizacji typografii
    if (a11ySettings.customFont) {
      root.style.setProperty('--a11y-font-family', a11ySettings.fontFamily);
      root.style.setProperty('--a11y-line-height', a11ySettings.lineHeight);
      root.style.setProperty('--a11y-word-spacing', a11ySettings.wordSpacing);
    } else {
      root.style.removeProperty('--a11y-font-family');
      root.style.removeProperty('--a11y-line-height');
      root.style.removeProperty('--a11y-word-spacing');
    }

    localStorage.setItem('cfg_a11ySettings', JSON.stringify(a11ySettings));
  }, [a11ySettings]);

  // Funkcja pomocnicza do przełączania trybów
  const toggleA11ySetting = (key) => {
    setA11ySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppConfigContext.Provider
      value={{
        theme, setTheme,
        accessibility, setAccessibility,
        language, setLanguage,
        // Nowe właściwości ułatwień
        a11ySettings, setA11ySettings, toggleA11ySetting
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}
