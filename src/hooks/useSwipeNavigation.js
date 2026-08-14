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
    // A real vertical scroll on a touchscreen is rarely perfectly straight —
    // fingers drift sideways too, and `abs(X) > abs(Y)` alone was firing a
    // tab change mid-scroll whenever that drift happened to edge past the
    // vertical movement. Requiring X to clearly dominate (2x) *and* capping
    // how much vertical movement is allowed at all means an ordinary scroll
    // — which moves well past 60px vertically — can never be mistaken for a
    // swipe, no matter how much horizontal drift it has.
    const isHorizontalSwipe =
      Math.abs(distanceX) > Math.abs(distanceY) * 2 && Math.abs(distanceY) < 60;
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
