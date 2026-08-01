import React, { createContext, useContext, useState, useEffect } from 'react';

const TypographyContext = createContext();

export const TypographyProvider = ({ children }) => {
  const [typographySettings, setTypographySettings] = useState(() => {
    const saved = localStorage.getItem('cfg_typography');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      spacing: 'relaxed',
      fontFamily: 'dyslexic'
    };
  });

  useEffect(() => {
    localStorage.setItem('cfg_typography', JSON.stringify(typographySettings));
    const root = document.documentElement;
    
    const sizeMap = { small: '16px', medium: '18px', large: '22px' };
    root.style.setProperty('--dyn-font-size', sizeMap[typographySettings.fontSize]);

    const spacingMap = {
      normal: { line: '1.5', letter: '0.02em', word: '0.1em' },
      relaxed: { line: '1.65', letter: '0.04em', word: '0.15em' },
      loose: { line: '1.8', letter: '0.08em', word: '0.25em' }
    };
    const currentSpacing = spacingMap[typographySettings.spacing];
    root.style.setProperty('--dyn-line-height', currentSpacing.line);
    root.style.setProperty('--dyn-letter-spacing', currentSpacing.letter);
    root.style.setProperty('--dyn-word-spacing', currentSpacing.word);

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