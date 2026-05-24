import React, { useEffect, useState } from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';

/**
 * ReadingRuler Component
 * Provides a focus tool that follows the cursor to prevent visual crowding.
 */
export default function ReadingRuler() {
  const { a11yAddons } = useAppSettings();
  const [mouseY, setMouseY] = useState(0);
  
  const isActive = a11yAddons?.includes('Linijka');
  // Variants could be expanded: 'shade', 'underline', 'greybar'
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

  // VARIANT 1: Underline - Helps track text without dimming the rest
  if (variant === 'underline') {
    return (
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9999] border-b-4 border-yellow-400 transition-transform duration-75 ease-out"
        style={{ top: `${mouseY + 20}px` }}
        aria-hidden="true"
      />
    );
  }

  // VARIANT 2: Shade - Dims everything except 1-2 lines of text
  if (variant === 'shade') {
    return (
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9999] h-20 transition-transform duration-75 ease-out shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        style={{ top: `${mouseY}px`, transform: 'translateY(-50%)' }}
        aria-hidden="true"
      />
    );
  }

  // VARIANT 3: Default Grey Bar
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 z-[9999] h-20 bg-slate-400/20 border-y border-slate-500/30 transition-transform duration-75 ease-out"
      style={{ top: `${mouseY}px`, transform: 'translateY(-50%)' }}
      aria-hidden="true"
    />
  );
}