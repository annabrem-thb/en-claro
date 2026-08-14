import { GamificationContext } from '../hooks/useGamification.js';
import { useGamificationState } from '../hooks/useGamificationState.js';

export function GamificationProvider({ children }) {
  const gamification = useGamificationState();

  return (
    <GamificationContext.Provider value={gamification}>
      {children}
    </GamificationContext.Provider>
  );
}
