import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useUserSettingsContext } from './UserSettingsContext';

export default function OfflineIndicator() {
  const { settings } = useUserSettingsContext();
  const { contrast: isHighContrast } = settings;
  const { t } = useTranslation();

  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-100 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-center text-xs font-bold ${isHighContrast ? 'bg-white text-black' : 'bg-yellow-400 text-yellow-900'} animate-in fade-in slide-in-from-bottom-4`}
      role="status"
    >
      <span aria-hidden="true">⚠️ </span>
      {t(
        'offlineMessage',
        'You are currently offline. Some features may be unavailable.',
      )}
    </div>
  );
}
