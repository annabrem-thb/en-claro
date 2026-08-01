import React, { useState } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';

export default function AccessibleButton({ onClick, children, className = '', ...props }) {
  const { a11yAddons, inclusiveOptions } = useAppSettings();
  const [isLocked, setIsLocked] = useState(false);

  const handleClick = (e) => {
    if (isLocked)
      return;

    const isMotorikActive = a11yAddons?.includes('Motorik') || inclusiveOptions?.bigTargets;
    if (isMotorikActive) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
      }, 600);
    }

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