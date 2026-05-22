import React, { useEffect, useState } from 'react';
import { useConfig } from '../../useConfig';

export default function ReadingRuler() {
  const { a11ySettings } = useConfig();
  const [mouseY, setMouseY] = useState(0);
  
  // Warianty: 'shade' (maska), 'underline' (podkreślenie), 'greybar' (pasek)
  const variant = a11ySettings?.rulerVariant || 'shade';

  useEffect(() => {
    // Podłączamy nasłuchiwanie tylko wtedy, gdy tryb Linijki jest włączony
    if (!a11ySettings?.ruler) return;

    const handleMouseMove = (e) => setMouseY(e.clientY);
    const handleTouchMove = (e) => setMouseY(e.touches[0].clientY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [a11ySettings?.ruler]);

  if (!a11ySettings?.ruler) return null;

  // WARIANT 1: Podkreślenie (Underline) - pomaga śledzić tekst bez przyciemniania reszty
  if (variant === 'underline') {
    return (
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9999] border-b-4 border-yellow-400 transition-transform duration-75 ease-out"
        style={{ top: `${mouseY + 20}px` }}
        aria-hidden="true"
      />
    );
  }

  // WARIANT 2: Maska z cieniem (Shade) - wygasza wszystko poza 1-2 linijkami tekstu
  if (variant === 'shade') {
    return (
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9999] h-20 transition-transform duration-75 ease-out shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        style={{ top: `${mouseY}px`, transform: 'translateY(-50%)' }}
        aria-hidden="true"
      />
    );
  }

  // WARIANT 3: Domyślny Szary Pasek (Grey Bar)
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 z-[9999] h-20 bg-slate-400/20 border-y border-slate-500/30 transition-transform duration-75 ease-out"
      style={{ top: `${mouseY}px`, transform: 'translateY(-50%)' }}
      aria-hidden="true"
    />
  );
}