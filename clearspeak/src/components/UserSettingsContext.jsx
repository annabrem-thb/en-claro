import React, { createContext, useContext } from 'react';
import { useUserSettings } from '../hooks/useUserSettings';

// 1. Tworzymy nowy kontekst
const UserSettingsContext = createContext(null);

// 2. Tworzymy Provider, który wstrzyknie nasz hook
export function UserSettingsProvider({ children }) {
  const userSettings = useUserSettings();

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}

// 3. Niestandardowy hook do wyciągania danych w dowolnym komponencie
export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettingsContext musi być użyty wewnątrz UserSettingsProvider');
  }
  return context;
}