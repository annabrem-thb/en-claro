import React, { createContext, useContext } from 'react';

import { useUserSettings } from '../hooks/useUserSettings';

// Typed `Context<any>` rather than the inferred `Context<null>` — otherwise
// TypeScript consumers (e.g. SurveyComponent.tsx) see useUserSettingsContext()
// narrow to `never` after the `if (!context) throw` guard below (the only
// type left once `null` is excluded from a `Context<null>` is nothing at
// all), which then makes every `settings.foo` access a hard type error.
/** @type {React.Context<any>} */
const UserSettingsContext = createContext(null);

export function UserSettingsProvider({ children }) {
  const userSettings = useUserSettings();

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      'useUserSettingsContext must be used within a UserSettingsProvider',
    );
  }
  return context;
}
