import { useRef, useState } from 'react';

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 50, isFirstTab = false, isLastTab = false }) {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const hasVibrated = useRef(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const onTouchStart = (e) => {
    touchEnd.current = null;
    hasVibrated.current = false;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (!touchStart.current) return;

    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      let rawOffset = -distanceX;

      // Efekt "gumki" (opór) na skrajnych zakładkach
      if ((isFirstTab && rawOffset > 0) || (isLastTab && rawOffset < 0)) {
        rawOffset = rawOffset * 0.25;
        
        // Pojedyncze, delikatne haptyczne "puknięcie" imitujące opór
        if (!hasVibrated.current && typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(10);
          hasVibrated.current = true;
        }
      }

      setSwipeOffset(rawOffset);
    }
  };

  const onTouchEnd = () => {
    setIsSwiping(false);
    setSwipeOffset(0); // Resetujemy po puszczeniu ekranu

    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;

    // Ignorujemy przewijanie góra-dół (scrollowanie ćwiczeń)
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Sprawdzamy próg i blokujemy wywołanie akcji, jeśli jesteśmy na skraju
      if (distanceX > threshold && onSwipeLeft && !isLastTab) {
        onSwipeLeft();
      } else if (distanceX < -threshold && onSwipeRight && !isFirstTab) {
        onSwipeRight();
      }
    }
    
    touchStart.current = null;
    touchEnd.current = null;
  };

  return { onTouchStart, onTouchMove, onTouchEnd, swipeOffset, isSwiping };
}