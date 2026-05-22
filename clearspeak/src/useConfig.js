import { useContext } from 'react';
import { AppConfigContext } from './context/AppConfig';

// Globalny i bezpieczny hook do pobierania ustawień aplikacji
export function useConfig() {
  const context = useContext(AppConfigContext);
  
  if (context === undefined) {
    throw new Error('Hook useConfig musi być użyty wewnątrz <AppConfigProvider>');
  }
  
  return context;
}