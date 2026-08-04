import { useEffect } from 'react';

const DEFAULT_ACCENT = '#10b981';
const DEFAULT_BG = '#FDFBF7';

// Wong (2011) colorblind-safe palette: swapped in as a complete set rather
// than recoloring individual elements, so every consumer of these CSS
// custom properties (success/error/warning states, the active theme accent)
// stays mutually consistent under deuteranopia/protanopia simulation.
const COLORBLIND_PALETTE = {
  accent: '#0072B2',
  success: '#0072B2',
  error: '#D55E00',
  warning: '#F0E442',
};

const STANDARD_PALETTE = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

// Exercise feedback colors and the active theme's accent are read as CSS
// custom properties by plain CSS/Tailwind arbitrary-value classes
// elsewhere, rather than threaded through props to every consumer.
export function useThemeCSSVariables({
  themeStyles,
  isHighContrast,
  isColorblind,
  language,
}) {
  useEffect(() => {
    const root = document.documentElement;

    const accent = isColorblind
      ? COLORBLIND_PALETTE.accent
      : themeStyles?.hex || DEFAULT_ACCENT;
    root.style.setProperty('--theme-accent', accent);
    root.style.setProperty(
      '--color-success',
      isColorblind ? COLORBLIND_PALETTE.success : STANDARD_PALETTE.success,
    );
    root.style.setProperty(
      '--color-error',
      isColorblind ? COLORBLIND_PALETTE.error : STANDARD_PALETTE.error,
    );
    root.style.setProperty(
      '--color-warning',
      isColorblind ? COLORBLIND_PALETTE.warning : STANDARD_PALETTE.warning,
    );

    const bgHex = themeStyles?.bg?.match(/\[(.*?)\]/)?.[1] || DEFAULT_BG;
    root.style.setProperty('--theme-bg', isHighContrast ? '#000000' : bgHex);

    root.lang = language;
  }, [themeStyles, isHighContrast, isColorblind, language]);
}
