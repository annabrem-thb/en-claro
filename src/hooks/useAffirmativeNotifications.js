import { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

export function useAffirmativeNotifications(points, language = 'pl', enabled = true) {
  const [affirmation, setAffirmation] = useState(null);
  const { t } = useTranslation();
  const lastRewardedPoints = useRef(0);
  useEffect(() => {
    if (
      enabled &&
      points > 0 &&
      points % 15 === 0 &&
      points !== lastRewardedPoints.current
    ) {
      const pool = t('affirmations', { returnObjects: true }) || [
        'Great effort!',
      ];
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setAffirmation(randomMsg);
      lastRewardedPoints.current = points;
    }
  }, [points, language, t, enabled]);
  useEffect(() => {
    if (affirmation) {
      const timer = setTimeout(() => setAffirmation(null), 6e3);
      return () => clearTimeout(timer);
    }
  }, [affirmation]);
  return { affirmation: affirmation, setAffirmation: setAffirmation };
}
