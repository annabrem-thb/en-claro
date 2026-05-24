import React, { useState } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';

/**
 * AccessibleButton Component
 * 
 * Function: A wrapper around the standard HTML button that introduces a debounce mechanism.
 * If the "Motorik" (Big Targets / Motor impairment) setting is active, it temporarily locks
 * the button for 600ms after a click to prevent accidental double-clicks caused by hand tremors.
 */
export default function AccessibleButton({ onClick, children, className = '', ...props }) {
  const { a11yAddons, inclusiveOptions } = useAppSettings();
  const [isLocked, setIsLocked] = useState(false);

  const handleClick = (e) => {
    // Ignore click if the button is currently locked (debouncing)
    if (isLocked) return;

    // If Motorik or bigTargets mode is active, lock the button for 600ms to prevent double clicks
    const isMotorikActive = a11yAddons?.includes('Motorik') || inclusiveOptions?.bigTargets;
    if (isMotorikActive) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
      }, 600);
    }

    // Trigger the externally provided onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={props.disabled || isLocked}
      className={`${className} transition-opacity duration-200 ${isLocked ? 'opacity-70 cursor-wait' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}