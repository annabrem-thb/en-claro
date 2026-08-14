import { createContext, useContext } from 'react';

// Split out from UserSettingsContext.jsx: Vite Fast Refresh only hot-swaps
// files that exclusively export components — mixing the context object
// and/or a hook export in there meant every edit to that file forced a
// full page reload instead.
//
// Typed `Context<any>` rather than the inferred `Context<null>` — otherwise
// TypeScript consumers (e.g. SurveyComponent.tsx) see useUserSettingsContext()
// narrow to `never` after the `if (!context) throw` guard below (the only
// type left once `null` is excluded from a `Context<null>` is nothing at
// all), which then makes every `settings.foo` access a hard type error.
/** @type {React.Context<any>} */
export const UserSettingsContext = createContext(null);

export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      'useUserSettingsContext must be used within a UserSettingsProvider',
    );
  }
  return context;
}
