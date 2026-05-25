import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createLocalizedFormatters } from '../i18n-core/formatters';

interface UserProfileProps {
  user: {
    name: string;
    balance: number;
    inventoryCount: number;
    lastLoginDate: string;
    membership: string;
  };
}

export const UserProfileDashboard: React.FC<UserProfileProps> = ({ user }) => {
  // We load both 'profile' and 'common' namespaces. 
  // 'profile' is set as the default for this component scope.
  const { t, i18n } = useTranslation(['profile', 'common']);
  
  // Initialize formatters bound to the current language
  const formatters = useMemo(() => createLocalizedFormatters(i18n.language), [i18n.language]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-md max-w-md mx-auto">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-800">
          {t('title')}
        </h1>
        {/* Dynamic interpolation using {{name}} */}
        <p className="text-slate-500 mt-1">
          {t('welcome', { name: user.name })}
        </p>
      </header>

      <section className="flex flex-col gap-3 text-sm">
        {/* Utilizing the centralized date formatter */}
        <div className="flex justify-between">
          <span className="font-bold text-slate-400">{t('lastLogin')}</span>
          <span className="text-slate-700">{formatters.date(user.lastLoginDate)}</span>
        </div>
        
        {/* Utilizing the centralized currency formatter */}
        <div className="flex justify-between">
          <span className="font-bold text-slate-400">{t('balance')}</span>
          <span className="text-emerald-600 font-black">{formatters.currency(user.balance, 'USD')}</span>
        </div>

        {/* Utilizing automatic pluralization based on count suffix */}
        <p className="font-medium text-indigo-600 mt-2">
          {t('itemsCount', { count: user.inventoryCount })}
        </p>
      </section>

      <footer className="pt-4 flex gap-3">
        {/* Utilizing the shared 'common' namespace to adhere to DRY principles */}
        <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">
          {t('common:cancel')}
        </button>
        <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500">
          {t('common:save')}
        </button>
      </footer>
    </div>
  );
};