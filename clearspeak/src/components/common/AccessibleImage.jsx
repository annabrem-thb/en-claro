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
  
  const isHighContrast = a11ySettings?.contrast;

  if (standardEmoji && contrastEmoji) {
    return (
      <span role="img" aria-label={alt} className={className}>
        {isHighContrast ? contrastEmoji : standardEmoji}
      </span>
    );
  }

  const currentSrc = isHighContrast ? contrastSrc : standardSrc;

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={`transition-opacity duration-300 ${className}`} 
    />
  );
}