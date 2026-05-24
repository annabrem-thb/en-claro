import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/i18n';

export function useAffirmativeNotifications(points, language = 'pl') {
  const [affirmation, setAffirmation] = useState(null);
  const t = useTranslation(language);
  const lastRewardedPoints = useRef(0);

  useEffect(() => {
    // Zapobiega ponownemu odpaleniu tego samego komunikatu dla tych samych punktów
    if (points > 0 && points % 15 === 0 && points !== lastRewardedPoints.current) {
      const pool = t.affirmations || ["Great effort!"];
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setAffirmation(randomMsg);
      
      lastRewardedPoints.current = points;
    }
  }, [points, t.affirmations]);

  // Niezależny licznik czasu - zapobiega "zawieszeniu" się Toasta po zdobyciu kolejnego punktu
  useEffect(() => {
    if (affirmation) {
      const timer = setTimeout(() => setAffirmation(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [affirmation]);

  return { affirmation, setAffirmation };
}