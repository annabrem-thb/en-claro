import { useState, useEffect, useRef } from 'react';

/**
 * Manages the position of the interactive "focus ruler" based on mouse/finger movements within the selected element's area.
 */
export function useReadingRuler(isActive) {
  const cardRef = useRef(null);
  const [rulerPos, setRulerPos] = useState({ y: 0, visible: false });

  useEffect(() => {
    if (!isActive) return;
    
    const updateRuler = (clientX, clientY) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          setRulerPos({ y: clientY - rect.top, visible: true });
        } else {
          setRulerPos(prev => prev.visible ? { ...prev, visible: false } : prev);
        }
      }
    };

    const handleMouseMove = (e) => updateRuler(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) updateRuler(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [isActive]);

  return { cardRef, rulerPos };
}