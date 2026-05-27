import React, { createContext, useContext } from 'react';
import { useUserSettings } from '../hooks/useUserSettings';

// 1. Create a new context
const UserSettingsContext = createContext(null);

// 2. Create a Provider to inject the custom hook
export function UserSettingsProvider({ children }) {
  const userSettings = useUserSettings();

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}

// 3. Custom hook to consume the data in any component
export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettingsContext must be used within a UserSettingsProvider');
  }
  return context;
}