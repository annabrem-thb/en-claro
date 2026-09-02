import { createContext, useContext } from 'react';

// Split out from StudyModeContext.jsx for the same Fast Refresh reason as
// useGamification.js/GamificationContext.jsx: mixing a context object
// and/or hook export into a component-only file defeats hot-swapping.
/** @type {React.Context<any>} */
export const StudyModeContext = createContext(null);

export function useStudyMode() {
  const context = useContext(StudyModeContext);
  if (!context) {
    throw new Error('useStudyMode must be used within a StudyModeProvider');
  }
  return context;
}
