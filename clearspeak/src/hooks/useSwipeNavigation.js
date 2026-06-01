import { useState, useCallback } from 'react';

/**
 * Hook obsługujący gesty przesunięcia palcem (Swipe) na urządzeniach mobilnych.
 * Obsługuje również przeciąganie myszką (Mouse Drag) na komputerach.
 * Implementuje próg czułości (threshold), aby odróżnić przypadkowe dotknięcia
 * i przewijanie w dół (scroll) od celowego przewijania w bok.
 */
export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, swipeThreshold = 60 }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- GESTY DOTYKOWE (Touch) ---
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null); // Reset przy nowym dotknięciu
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  // --- WSPÓLNA LOGIKA OBLICZANIA GESTU ---
  const handleSwipeEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;

    // Sprawdzamy czy gest był bardziej poziomy niż pionowy (zapobiega konfliktom ze scrollowaniem w dół)
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > swipeThreshold) {
      if (distanceX > 0) {
        // Przesunięcie palcem w lewo (użytkownik chce przejść do następnej zakładki po prawej)
        if (onSwipeLeft) onSwipeLeft();
      } else {
        // Przesunięcie palcem w prawo (użytkownik chce przejść do poprzedniej zakładki po lewej)
        if (onSwipeRight) onSwipeRight();
      }
    }
    
    // Reset stanu po wykonaniu gestu
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight, swipeThreshold]);

  const onTouchEnd = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  // --- GESTY MYSZKĄ (Mouse) ---
  const onMouseDown = useCallback((e) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging) return;
    // Wyłączamy domyślne zachowanie przeglądarki (np. zaznaczanie tekstu podczas przeciągania)
    e.preventDefault();
    setTouchEnd({ x: e.clientX, y: e.clientY });
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    handleSwipeEnd();
  }, [isDragging, handleSwipeEnd]);

  const onMouseLeave = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    handleSwipeEnd(); // Rozpatrujemy gest, nawet jeśli kursor opuścił obszar
  }, [isDragging, handleSwipeEnd]);

  return { 
    onTouchStart, onTouchMove, onTouchEnd,
    onMouseDown, onMouseMove, onMouseUp, onMouseLeave
  };
}