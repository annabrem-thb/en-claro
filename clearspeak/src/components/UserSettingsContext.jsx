import React, { createContext, useContext } from 'react';
import { useUserSettings } from '../hooks/useUserSettings';

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
    throw new Error('useUserSettingsContext must be used within a UserSettingsProvider');
  }
  return context;
}