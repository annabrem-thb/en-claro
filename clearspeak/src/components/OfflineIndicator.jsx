import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { useUserSettingsContext } from './UserSettingsContext';

/**
 * OfflineIndicator Component
 * Displays a non-intrusive banner at the bottom of the screen when the browser
 * loses internet connectivity. It relies on the standard `navigator.onLine` API.
 */
export default function OfflineIndicator() {
  const { settings } = useUserSettingsContext();
  const { language, contrast: isHighContrast } = settings;
  const t = useTranslation(language);
  
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline',handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] p-3 text-center text-xs font-bold ${isHighContrast ? 'bg-white text-black' : 'bg-yellow-400 text-yellow-900'} animate-in fade-in slide-in-from-bottom-4`} 
      role="status"
    >
      <span aria-hidden="true">⚠️ </span>
      {t.offlineMessage || 'You are currently offline. Some features may be unavailable.'}
    </div>
  );
}