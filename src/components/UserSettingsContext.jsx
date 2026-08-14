import { useUserSettings } from '../hooks/useUserSettings';
import { UserSettingsContext } from '../hooks/useUserSettingsContext.js';

export function UserSettingsProvider({ children }) {
  const userSettings = useUserSettings();

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}
