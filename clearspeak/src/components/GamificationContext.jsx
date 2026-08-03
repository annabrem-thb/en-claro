import React, { createContext, useContext } from 'react';

import { useGamificationState } from '../hooks/useGamificationState.js';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const gamification = useGamificationState();

  return (
    <GamificationContext.Provider value={gamification}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error(
      'useGamification must be used within a GamificationProvider',
    );
  }
  return context;
}
