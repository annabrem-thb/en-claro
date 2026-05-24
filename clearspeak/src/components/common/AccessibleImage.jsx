import React from 'react';
import { useA11y } from '../../context/A11yContext';

export default function AccessibleImage({ 
  standardSrc, 
  contrastSrc, 
  standardEmoji, 
  contrastEmoji, 
  alt, 
  className = '' 
}) {
  const { a11ySettings } = useA11y();
  
  // Check if High Contrast mode is enabled
  const isHighContrast = a11ySettings?.contrast;

  // Render text-based emojis/icons (commonly used in gamification)
  if (standardEmoji && contrastEmoji) {
    return (
      <span role="img" aria-label={alt} className={className}>
        {isHighContrast ? contrastEmoji : standardEmoji}
      </span>
    );
  }

  // Render actual image files (e.g., .png, .svg) with contrast support
  const currentSrc = isHighContrast ? contrastSrc : standardSrc;

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={`transition-opacity duration-300 ${className}`} 
    />
  );
}