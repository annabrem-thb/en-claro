import React, { createContext, useState, useEffect, useContext } from 'react';

// Tworzymy kontekst
const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  // Stan przechowujący aktywne tryby. Domyślnie ładujemy z localStorage.
  const [a11ySettings, setA11ySettings] = useState(() => {
    const saved = localStorage.getItem('a11ySettings');
    return saved ? JSON.parse(saved) : {
      motorik: false,
      contrast: false,
      vision: false,
      color: false
    };
  });

  // Główna logika: ten efekt "nasłuchuje" zmian w a11ySettings 
  // i synchronizuje je z tagiem <html> w dokumencie DOM.
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

    // Zapisujemy wybór użytkownika, by działał po odświeżeniu strony
    localStorage.setItem('a11ySettings', JSON.stringify(a11ySettings));
  }, [a11ySettings]);

  // Funkcja pomocnicza do przełączania konkretnego trybu
  const toggleSetting = (key) => {
    setA11ySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <A11yContext.Provider value={{ a11ySettings, toggleSetting }}>
      {children}
    </A11yContext.Provider>
  );
};

export const useA11y = () => useContext(A11yContext);