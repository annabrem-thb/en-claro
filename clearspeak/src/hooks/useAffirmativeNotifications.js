import { useState, useEffect } from 'react';

// Zapewnia delikatne, niekarzące, opartce na wysiłku wsparcie.
export function useAffirmativeNotifications(points, language = 'pl') {
  const [affirmation, setAffirmation] = useState(null);

  const MESSAGES = {
    en: [
      "Your garden is growing beautifully thanks to your work today.",
      "Every step you take is a step forward. Great effort!",
      "Taking your time is the best way to learn.",
      "You are making steady progress. Keep going at your own pace.",
      "Thank you for showing up today. Your dedication matters."
    ],
    pl: [
      "Twój ogród rośnie pięknie dzięki Twojej dzisiejszej pracy.",
      "Każdy krok to postęp. Wspaniały wysiłek!",
      "Spokojne tempo to najlepszy sposób na naukę.",
      "Robisz stałe postępy. Kontynuuj we własnym tempie.",
      "Dziękujemy, że tu dziś jesteś. Twoje zaangażowanie ma znaczenie."
    ],
    de: [
      "Dein Garten wächst wunderbar dank deiner heutigen Arbeit.",
      "Jeder Schritt ist ein Fortschritt. Toller Einsatz!",
      "Sich Zeit zu nehmen ist der beste Weg zu lernen.",
      "Du machst stetige Fortschritte. Mach weiter in deinem eigenen Tempo.",
      "Danke, dass du heute hier bist. Dein Engagement zählt."
    ]
  };

  useEffect(() => {
    // Wyzwala delikatne powiadomienie afirmatywne np. co 15 punktów
    if (points > 0 && points % 15 === 0) {
      const pool = MESSAGES[language] || MESSAGES.en;
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setAffirmation(randomMsg);
      
      // Automatycznie ukrywa się po 6 sekundach, aby zachować minimalistyczny interfejs
      const timer = setTimeout(() => setAffirmation(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [points, language]);

  return { affirmation, setAffirmation };
}