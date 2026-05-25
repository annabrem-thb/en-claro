import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/i18n';

export function useAffirmativeNotifications(points, language = 'pl') {
  const [affirmation, setAffirmation] = useState(null);
  const t = useTranslation(language);
  const lastRewardedPoints = useRef(0);

  useEffect(() => {
    // Prevents firing the same message again for the same points
    if (points > 0 && points % 15 === 0 && points !== lastRewardedPoints.current) {
      const pool = t.affirmations || ["Great effort!"];
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setAffirmation(randomMsg);
      
      lastRewardedPoints.current = points;
    }
  }, [points, t.affirmations]);

  // Independent timer - prevents the Toast from "hanging" after gaining another point
  useEffect(() => {
    if (affirmation) {
      const timer = setTimeout(() => setAffirmation(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [affirmation]);

  return { affirmation, setAffirmation };
}