import React from 'react';
import Lottie from 'lottie-react';
import { useAppSettings } from '../hooks/useAppSettings';

export default function LottieAnimation(
  { 
    animationData, 
    loop = false, 
    noFlash = false, 
    className = "", 
    fallbackEmoji = "🌱",
    ariaLabel = "Success animation"
  }
) {
  const { theme, a11yAddons } = useAppSettings();
  const isHighContrast = a11yAddons?.includes('Kontrast');

  const getThemeFilter = () => {
    if (isHighContrast)
      return 'grayscale(100%) contrast(150%) brightness(120%)';
    
    switch (theme) {
      case 'Musik':
        return 'hue-rotate(140deg) saturate(80%)';
      case 'Kunst':
        return 'hue-rotate(250deg) saturate(120%)';
      case 'Space':
        return 'hue-rotate(90deg) saturate(30%) brightness(90%)';
      case 'Ocean':
        return 'hue-rotate(60deg) saturate(110%)';
      case 'Natur':
      default:
        return 'none';
    }
  };

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

  return (
    <div 
      className={className} 
      aria-label={ariaLabel} 
      role="img"
      style={{ filter: getThemeFilter(), transition: 'filter 0.5s ease-in-out' }}
    >
      {}
      <Lottie 
        animationData={animationData} 
        loop={loop} 
        autoplay={true} 
        aria-hidden="true" 
      />
    </div>
  );
}