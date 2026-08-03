import React, { useEffect, useState } from 'react';

import { useUserSettingsContext } from '../UserSettingsContext';

export default function ReadingRuler() {
  const { settings } = useUserSettingsContext();
  const [mouseY, setMouseY] = useState(0);

  const isActive = settings.ruler;
  const variant = 'shade';

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e) => setMouseY(e.clientY);
    const handleTouchMove = (e) => setMouseY(e.touches[0].clientY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isActive]);

  if (!isActive) return null;

  if (variant === 'underline') {
    return (
      <div
        className="pointer-events-none fixed right-0 left-0 z-[9999] border-b-4 border-yellow-400 transition-transform duration-75 ease-out"
        style={{ top: `${mouseY + 20}px` }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'shade') {
    return (
      <div
        className="pointer-events-none fixed right-0 left-0 z-[9999] h-20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-transform duration-75 ease-out"
        style={{ top: `${mouseY}px`, transform: 'translateY(-50%)' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="pointer-events-none fixed right-0 left-0 z-[9999] h-20 border-y border-slate-500/30 bg-slate-400/20 transition-transform duration-75 ease-out"
      style={{ top: `${mouseY}px`, transform: 'translateY(-50%)' }}
      aria-hidden="true"
    />
  );
}
