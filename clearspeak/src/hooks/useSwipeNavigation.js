import { useRef } from 'react';

/**
 * Recognizes horizontal swipe gestures and triggers corresponding actions.
 */
export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };
  
  const onTouchMove = (e) => { 
    touchEnd.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY }; 
  };
  
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(touchStart.current.y - touchEnd.current.y);
    
    if (isHorizontalSwipe) {
      if (distanceX > threshold && onSwipeLeft) onSwipeLeft();
      if (distanceX < -threshold && onSwipeRight) onSwipeRight();
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}