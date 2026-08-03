import { useState, useCallback } from 'react';

export function useSwipeNavigation({
  onSwipeLeft: onSwipeLeft,
  onSwipeRight: onSwipeRight,
  swipeThreshold: swipeThreshold = 60,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);
  const onTouchMove = useCallback((e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);
  const handleSwipeEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    if (isHorizontalSwipe && Math.abs(distanceX) > swipeThreshold) {
      if (distanceX > 0) {
        if (onSwipeLeft) onSwipeLeft();
      } else {
        if (onSwipeRight) onSwipeRight();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight, swipeThreshold]);
  const onTouchEnd = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);
  const onMouseDown = useCallback((e) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart({ x: e.clientX, y: e.clientY });
  }, []);
  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      setTouchEnd({ x: e.clientX, y: e.clientY });
    },
    [isDragging],
  );
  const onMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    handleSwipeEnd();
  }, [isDragging, handleSwipeEnd]);
  const onMouseLeave = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    handleSwipeEnd();
  }, [isDragging, handleSwipeEnd]);
  return {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd,
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp,
    onMouseLeave: onMouseLeave,
  };
}
