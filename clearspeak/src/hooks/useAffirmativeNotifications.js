import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';

export function useAffirmativeNotifications(points, language = 'pl') {
  const [affirmation, setAffirmation] = useState(null);
  const t = useTranslation(language);

  useEffect(() => {
    if (points > 0 && points % 15 === 0) {
      const pool = t.affirmations || ["Great effort!"];
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setAffirmation(randomMsg);
      
      const timer = setTimeout(() => setAffirmation(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [points, language]);

  return { affirmation, setAffirmation };
}