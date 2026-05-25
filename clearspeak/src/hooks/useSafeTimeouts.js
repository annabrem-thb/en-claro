import { useRef, useCallback, useEffect } from 'react';

export function useSafeTimeouts() {
  const timeouts = useRef([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Immediately clear all active timeouts upon component unmount
      timeouts.current.forEach(t => clearTimeout(t.id));
      timeouts.current = [];
    };
  }, []);

  const setSafeTimeout = useCallback((callback, delay) => {
    // Guard 1: Prevent queuing new timeouts if the component has unmounted
    if (!isMounted.current) return null;

    const timeoutObj = {
      callback,
      remaining: delay,
      startTime: Date.now(),
      id: null
    };

    const execute = () => {
      // Guard 2: Prevent executing the callback if unmounted during the delay
      if (!isMounted.current) return;
      
      // Release the reference immediately to allow garbage collection
      timeouts.current = timeouts.current.filter(t => t !== timeoutObj);
      callback();
    };

    timeoutObj.execute = execute;
    timeoutObj.id = setTimeout(execute, delay);
    timeouts.current.push(timeoutObj);
    
    return timeoutObj;
  }, []);

  const clearSafeTimeout = useCallback((timeoutObj) => {
    if (!timeoutObj || !timeoutObj.id) return;
    clearTimeout(timeoutObj.id);
    timeouts.current = timeouts.current.filter(t => t !== timeoutObj);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeouts.current.forEach(t => clearTimeout(t.id));
    timeouts.current = [];
  }, []);

  const pauseAllTimeouts = useCallback(() => {
    if (!isMounted.current) return;
    const now = Date.now();
    timeouts.current.forEach(t => {
      if (t.id !== null) {
        clearTimeout(t.id);
        t.id = null;
        t.remaining -= (now - t.startTime);
      }
    });
  }, []);

  const resumeAllTimeouts = useCallback(() => {
    if (!isMounted.current) return;
    const now = Date.now();
    timeouts.current.forEach(t => {
      if (t.id === null && t.remaining > 0) {
        t.startTime = now;
        t.id = setTimeout(t.execute, t.remaining);
      } else if (t.id === null && t.remaining <= 0) {
        t.execute();
      }
    });
  }, []);

  return { 
    setSafeTimeout, 
    clearSafeTimeout, 
    clearAllTimeouts, 
    pauseAllTimeouts, 
    resumeAllTimeouts 
  };
}