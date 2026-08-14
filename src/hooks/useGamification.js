import { createContext, useContext } from 'react';

// Split out from GamificationContext.jsx: Vite Fast Refresh only hot-swaps
// files that exclusively export components — mixing the context object
// and/or a hook export in there meant every edit to that file forced a
// full page reload instead.
//
// Typed `Context<any>` rather than the inferred `Context<null>` — otherwise
// TypeScript consumers see useGamification() narrow to `never` after the
// `if (!context) throw` guard below (the only type left once `null` is
// excluded from a `Context<null>` is nothing at all).
/** @type {React.Context<any>} */
export const GamificationContext = createContext(null);

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error(
      'useGamification must be used within a GamificationProvider',
    );
  }
  return context;
}
