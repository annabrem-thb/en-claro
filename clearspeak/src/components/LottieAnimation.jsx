import React from 'react';
import Lottie from 'lottie-react';
import { useAppSettings } from '../hooks/useAppSettings';

/**
 * LottieAnimation Wrapper
 * 
 * SDT & WCAG Implementation:
 * - Provides satisfying visual feedback (Competence reinforcement).
 * - Respects cognitive/sensory load by falling back to a static element 
 *   if the user has "noFlash" or reduced motion enabled.
 * - Manages ARIA attributes to prevent screen reader clutter.
 */
export default function LottieAnimation({ 
  animationData, 
  loop = false, 
  noFlash = false, 
  className = "", 
  fallbackEmoji = "🌱",
  ariaLabel = "Success animation"
}) {
  const { theme, a11yAddons } = useAppSettings();
  const isHighContrast = a11yAddons?.includes('Kontrast');

  // Dynamiczna paleta barw za pomocą filtrów CSS 
  // (Zakładamy, że bazowa animacja ma kolory z motywu 'Natur' - odcienie zieleni)
  const getThemeFilter = () => {
    // W trybie wysokiego kontrastu konwertujemy na mocno odcięte szarości
    if (isHighContrast) return 'grayscale(100%) contrast(150%) brightness(120%)';
    
    switch (theme) {
      case 'Musik': // Z zieleni w fiolet
        return 'hue-rotate(140deg) saturate(80%)';
      case 'Kunst': // Z zieleni w bursztyn/pomarańcz
        return 'hue-rotate(250deg) saturate(120%)';
      case 'Space': // Z zieleni w chłodny, zgaszony błękit
        return 'hue-rotate(90deg) saturate(30%) brightness(90%)';
      case 'Ocean': // Z zieleni w morski/cyjan
        return 'hue-rotate(60deg) saturate(110%)';
      case 'Natur':
      default:
        return 'none';
    }
  };

  // 1. Accessibility Guard: Disable motion if requested
  if (noFlash) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
        role="img"
      >
        <span className="text-6xl drop-shadow-md animate-in fade-in duration-700">
          {fallbackEmoji}
        </span>
      </div>
    );
  }

  // 2. Standard Render: Smooth Lottie Animation
  return (
    <div 
      className={className} 
      aria-label={ariaLabel} 
      role="img"
      style={{ filter: getThemeFilter(), transition: 'filter 0.5s ease-in-out' }}
    >
      {/* aria-hidden is applied to the Lottie element itself so the screen reader 
          reads the wrapper's aria-label instead of parsing SVG nodes */}
      <Lottie 
        animationData={animationData} 
        loop={loop} 
        autoplay={true} 
        aria-hidden="true" 
      />
    </div>
  );
}