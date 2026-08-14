import { useState, useEffect, useRef } from 'react';

const KEY_STEP = 24; // px per arrow-key press

export function useReadingRuler(isActive) {
  const cardRef = useRef(null);
  const [rulerPos, setRulerPos] = useState({ y: 0, visible: false });
  useEffect(() => {
    if (!isActive) return;
    const updateRuler = (clientX, clientY) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          setRulerPos({ y: clientY - rect.top, visible: true });
        } else {
          setRulerPos((prev) =>
            prev.visible ? { ...prev, visible: false } : prev,
          );
        }
      }
    };
    const handleMouseMove = (e) => updateRuler(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0)
        updateRuler(e.touches[0].clientX, e.touches[0].clientY);
    };
    // Keyboard alternative to the pointer-tracked ruler above: without this,
    // the guide is 100% unreachable for anyone who can't hold a mouse/finger
    // steady over a moving target — tremor, limited fine motor control,
    // switch-access or keyboard-only users. ArrowUp/Down are unused
    // elsewhere in the app (exercise navigation uses Left/Right/Enter — see
    // useKeyboardShortcuts.js), so this can't collide with anything.
    // Ignored while a text field has focus so it never fights typed input.
    const handleKeyDown = (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      const active = document.activeElement;
      if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') return;
      if (active?.isContentEditable) return;
      if (!cardRef.current) return;
      e.preventDefault();
      const rect = cardRef.current.getBoundingClientRect();
      setRulerPos((prev) => {
        const base = prev.visible ? prev.y : rect.height / 2;
        const delta = e.key === 'ArrowUp' ? -KEY_STEP : KEY_STEP;
        const nextY = Math.min(Math.max(base + delta, 0), rect.height);
        return { y: nextY, visible: true };
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  return { cardRef: cardRef, rulerPos: rulerPos };
}
