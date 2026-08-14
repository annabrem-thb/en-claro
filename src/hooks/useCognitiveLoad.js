import { useState, useEffect, useCallback } from 'react';

import { useUserSettingsContext } from './useUserSettingsContext.js';

export function useCognitiveLoad(activeTab, zenModeEnabled) {
  const { settings } = useUserSettingsContext();
  const [sessionStartTime, setSessionStartTime] = useState(() => Date.now());
  const [errorTimestamps, setErrorTimestamps] = useState([]);
  const [loadLevel, setLoadLevel] = useState('green');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakDismissed, setBreakDismissed] = useState(false);
  const [lastBreakTime, setLastBreakTime] = useState(0);
  const resetCognitiveLoad = useCallback(() => {
    setSessionStartTime(Date.now());
    setErrorTimestamps([]);
    setLoadLevel('green');
    setBreakDismissed(false);
    setLastBreakTime(Date.now());
    setShowBreakModal(false);
  }, []);
  // Resets tracking the moment activeTab becomes 'Garden' — adjusted
  // directly during render (React's own recommended pattern for "reset
  // state when a prop changes": https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // rather than in an effect, so the reset lands in the same render as the
  // tab switch instead of a visible extra pass one tick later.
  const [lastSeenTab, setLastSeenTab] = useState(activeTab);
  if (activeTab !== lastSeenTab) {
    setLastSeenTab(activeTab);
    if (activeTab === 'Garden') {
      resetCognitiveLoad();
    }
  }
  useEffect(() => {
    if (activeTab === 'Garden' || zenModeEnabled) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const recentErrors = errorTimestamps.filter((t) => now - t < 18e4).length;
      const durationMins = (now - sessionStartTime) / 6e4;
      let newLevel = 'green';
      if (recentErrors >= 4 || durationMins >= 15) newLevel = 'red';
      else if (recentErrors >= 2 || durationMins >= 7) newLevel = 'yellow';
      setLoadLevel(newLevel);
      const breaksEnabled = settings.cognitiveBreaks;
      const COOLDOWN_MS = 10 * 60 * 1e3;
      const isCooldownOver = now - lastBreakTime > COOLDOWN_MS;
      if (
        breaksEnabled &&
        newLevel === 'red' &&
        !breakDismissed &&
        !showBreakModal &&
        isCooldownOver
      ) {
        if (
          typeof navigator !== 'undefined' &&
          navigator.vibrate &&
          !zenModeEnabled
        ) {
          navigator.vibrate([40, 60, 40]);
        }
        setShowBreakModal(true);
        setLastBreakTime(now);
      }
    }, 5e3);
    return () => clearInterval(interval);
  }, [
    errorTimestamps,
    sessionStartTime,
    breakDismissed,
    showBreakModal,
    activeTab,
    zenModeEnabled,
    settings.cognitiveBreaks,
    lastBreakTime,
  ]);
  return {
    loadLevel: loadLevel,
    showBreakModal: showBreakModal,
    breakDismissed: breakDismissed,
    setSessionStartTime: setSessionStartTime,
    setErrorTimestamps: setErrorTimestamps,
    setLoadLevel: setLoadLevel,
    setShowBreakModal: setShowBreakModal,
    setBreakDismissed: setBreakDismissed,
    resetCognitiveLoad: resetCognitiveLoad,
  };
}
