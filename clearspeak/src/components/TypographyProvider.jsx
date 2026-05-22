import React, { createContext, useContext, useState, useEffect } from 'react';

const TypographyContext = createContext();

export const TypographyProvider = ({ children }) => {
  // Initialize state from local storage or set reasonable dyslexia-friendly defaults
  const [typographySettings, setTypographySettings] = useState(() => {
    const saved = localStorage.getItem('cfg_typography');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',      // Options: 'small', 'medium', 'large'
      spacing: 'relaxed',      // Options: 'normal', 'relaxed', 'loose'
      fontFamily: 'dyslexic'   // Options: 'sans-serif', 'dyslexic'
    };
  });

  // Apply settings to CSS custom properties on the root element
  useEffect(() => {
    localStorage.setItem('cfg_typography', JSON.stringify(typographySettings));
    const root = document.documentElement;
    
    // Font size scale adjustments
    const sizeMap = { small: '16px', medium: '18px', large: '22px' };
    root.style.setProperty('--dyn-font-size', sizeMap[typographySettings.fontSize]);

    // Research-backed spacing configurations
    const spacingMap = {
      normal: { line: '1.5', letter: '0.02em', word: '0.1em' },
      relaxed: { line: '1.65', letter: '0.04em', word: '0.15em' },
      loose: { line: '1.8', letter: '0.08em', word: '0.25em' }
    };
    const currentSpacing = spacingMap[typographySettings.spacing];
    root.style.setProperty('--dyn-line-height', currentSpacing.line);
    root.style.setProperty('--dyn-letter-spacing', currentSpacing.letter);
    root.style.setProperty('--dyn-word-spacing', currentSpacing.word);

    // Clean sans-serif fallback chain vs dedicated dyslexia font
    const fontMap = {
      'sans-serif': 'Helvetica, Arial, Verdana, sans-serif',
      'dyslexic': "'OpenDyslexic', Helvetica, Arial, sans-serif"
    };
    root.style.setProperty('--dyn-font-family', fontMap[typographySettings.fontFamily]);
    
  }, [typographySettings]);

  return (
    <TypographyContext.Provider value={{ typographySettings, setTypographySettings }}>
      {children}
    </TypographyContext.Provider>
  );
};

export const useTypography = () => useContext(TypographyContext);