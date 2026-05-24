import { useRef, useEffect, useCallback } from 'react';

export function useSafeTimeouts() {
  const timeoutsRef = useRef([]);

  // Funkcja do bezpiecznego dodawania opóźnień do kolejki
  const setSafeTimeout = useCallback((callback, delay) => {
    const timeoutObj = {
      callback,
      remaining: delay,
      startTime: Date.now(),
      id: null
    };

    const execute = () => {
      // Usuwamy wywołany timer z tablicy
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeoutObj);
      callback();
    };

    timeoutObj.execute = execute;
    timeoutObj.id = setTimeout(execute, delay);
    timeoutsRef.current.push(timeoutObj);
    
    return timeoutObj;
  }, []);

  // Ręczne czyszczenie całej kolejki (np. w przypadku akcji użytkownika)
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t.id));
    timeoutsRef.current = [];
  }, []);

  // Wstrzymanie wszystkich aktywnych timerów (Pauza)
  const pauseAllTimeouts = useCallback(() => {
    const now = Date.now();
    timeoutsRef.current.forEach((t) => {
      if (t.id !== null) {
        clearTimeout(t.id);
        t.id = null;
        t.remaining -= (now - t.startTime);
      }
    });
  }, []);

  // Wznowienie wszystkich wstrzymanych timerów
  const resumeAllTimeouts = useCallback(() => {
    const now = Date.now();
    timeoutsRef.current.forEach((t) => {
      if (t.id === null && t.remaining > 0) {
        t.startTime = now;
        t.id = setTimeout(t.execute, t.remaining);
      } else if (t.id === null && t.remaining <= 0) {
        t.execute();
      }
    });
  }, []);

  // Automatyczne czyszczenie (cleanup) przy odmontowaniu komponentu
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  return { setSafeTimeout, clearAllTimeouts, pauseAllTimeouts, resumeAllTimeouts };
}