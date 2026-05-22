import React, { useState } from 'react';
import { useA11y } from '../../context/A11yContext';

export default function AccessibleButton({ onClick, children, className = '', ...props }) {
  const { a11ySettings } = useA11y();
  const [isLocked, setIsLocked] = useState(false);

  const handleClick = (e) => {
    // Jeśli przycisk jest zablokowany (w trakcie debouncingu), ignorujemy kliknięcie
    if (isLocked) return;

    // Jeśli tryb Motoryka jest aktywny, blokujemy przycisk na 600ms
    if (a11ySettings?.motorik) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
      }, 600);
    }

    // Wywołujemy przekazaną z zewnątrz funkcję onClick
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