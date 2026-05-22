import { useState, useEffect } from 'react';

/**
 * Encapsulates the logic for tracking cognitive energy, "Error Velocity",
 * and determining if the user needs a break.
 */
export function useCognitiveLoad(activeTab, zenModeEnabled) {
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [errorTimestamps, setErrorTimestamps] = useState([]);
  const [loadLevel, setLoadLevel] = useState('green');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakDismissed, setBreakDismissed] = useState(false);

  useEffect(() => {
    // Resets energy load specifically when user explicitly enters the Garden
    if (activeTab === 'Garden') {
      setSessionStartTime(Date.now());
      setErrorTimestamps([]);
      setLoadLevel('green');
      setBreakDismissed(false);
    }
  }, [activeTab]);

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

      if (newLevel === 'red' && !breakDismissed && !showBreakModal) {
        setShowBreakModal(true);
      }
    }, 5000); 
    return () => clearInterval(interval);
  }, [errorTimestamps, sessionStartTime, breakDismissed, showBreakModal, activeTab, zenModeEnabled]);

  return {
    loadLevel, showBreakModal, breakDismissed, setSessionStartTime, 
    setErrorTimestamps, setLoadLevel, setShowBreakModal, setBreakDismissed
  };
}