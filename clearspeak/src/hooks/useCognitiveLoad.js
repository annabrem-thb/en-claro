import { useState, useEffect, useCallback } from 'react';
import { useAppSettings } from './useAppSettings.js';

/**
 * Encapsulates the logic for tracking cognitive energy, "Error Velocity",
 * and determining if the user needs a break.
 */
export function useCognitiveLoad(activeTab, zenModeEnabled) {
  const { inclusiveOptions } = useAppSettings();
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [errorTimestamps, setErrorTimestamps] = useState([]);
  const [loadLevel, setLoadLevel] = useState('green');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakDismissed, setBreakDismissed] = useState(false);
  const [lastBreakTime, setLastBreakTime] = useState(0); // Tracking for the 10-minute cooldown

  const resetCognitiveLoad = useCallback(() => {
    setSessionStartTime(Date.now());
    setErrorTimestamps([]);
    setLoadLevel('green');
    setBreakDismissed(false);
    setLastBreakTime(Date.now()); // Restart the cooldown logic
    setShowBreakModal(false);
  }, []);

  useEffect(() => {
    // Resets energy load specifically when user explicitly enters the Garden
    if (activeTab === 'Garden') {
      resetCognitiveLoad();
    }
  }, [activeTab, resetCognitiveLoad]);

  // Calculate Cognitive Load using "Error Velocity" (Rolling 3-min window)
  useEffect(() => {
    if (activeTab === 'Garden' || zenModeEnabled) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const recentErrors = errorTimestamps.filter(t => now - t < 180000).length;
      const durationMins = (now - sessionStartTime) / 60000;

      let newLevel = 'green';
      if (recentErrors >= 4 || durationMins >= 15) newLevel = 'red';
      else if (recentErrors >= 2 || durationMins >= 7) newLevel = 'yellow';

      setLoadLevel(newLevel);

      // Enforce user setting and a 10-minute cooldown
      const breaksEnabled = inclusiveOptions?.cognitiveBreaks;
      const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
      const isCooldownOver = now - lastBreakTime > COOLDOWN_MS;

      if (breaksEnabled && newLevel === 'red' && !breakDismissed && !showBreakModal && isCooldownOver) {
        // Trigger a gentle, distinct "double-tap" haptic vibration for the break alert
        if (typeof navigator !== 'undefined' && navigator.vibrate && !zenModeEnabled) {
          navigator.vibrate([40, 60, 40]);
        }
        setShowBreakModal(true);
        setLastBreakTime(now); // Restart the cooldown timer
      }
    }, 5000); 
    return () => clearInterval(interval);
  }, [errorTimestamps, sessionStartTime, breakDismissed, showBreakModal, activeTab, zenModeEnabled, inclusiveOptions?.cognitiveBreaks, lastBreakTime]);

  return {
    loadLevel, showBreakModal, breakDismissed, setSessionStartTime, 
    setErrorTimestamps, setLoadLevel, setShowBreakModal, setBreakDismissed,
    resetCognitiveLoad
  };
}