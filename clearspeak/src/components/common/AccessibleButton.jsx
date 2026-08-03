import React, { useState } from 'react';

import { useUserSettingsContext } from '../UserSettingsContext';

export default function AccessibleButton({
  onClick,
  children,
  className = '',
  ...props
}) {
  const { settings } = useUserSettingsContext();
  const [isLocked, setIsLocked] = useState(false);

  const handleClick = (e) => {
    if (isLocked) return;

    const isMotorikActive = settings.motorik || settings.bigTargets;
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
      className={`${className} transition-opacity duration-200 ${isLocked ? 'cursor-wait opacity-70' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
