import React, { createContext, useContext } from 'react';

import { useGamificationState } from '../hooks/useGamificationState.js';

// See the matching comment in UserSettingsContext.jsx: without this, TS
// infers `Context<null>`, and the `if (!context) throw` guard in
// useGamification() below narrows the return type to `never` for any
// .ts/.tsx consumer.
/** @type {React.Context<any>} */
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
