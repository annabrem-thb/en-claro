import { useState, useCallback } from 'react';

export function useExerciseVoice(language, t, options = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const speak = useCallback(
    (text, extendedTime = false) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language];
      msg.rate = extendedTime ? 0.55 : 0.85; // Slower rate for accessibility
      window.speechSynthesis.speak(msg);
    },
    [language],
  );

  const startListening = (onNumberMatch, onCommandMatch) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = { de: 'de-DE', pl: 'pl-PL', en: 'en-US' }[language];
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase().trim();
      setTranscript(result);

      // Pobieranie dozwolonych słów z aktualnego słownika i18n i tworzenie Regex
      const undoRegex = new RegExp(t?.commands?.undo?.join('|') || 'undo|cofnij|zurück|delete|usuń|löschen', 'i');
      const checkRegex = new RegExp(t?.commands?.check?.join('|') || 'check|sprawdź|prüfen|gotowe|done|fertig', 'i');

      // Map voice commands to actions
      const commands = {
        undo: undoRegex,
        check: checkRegex,
      };

      if (commands.undo.test(result)) onCommandMatch?.('undo');
      else if (commands.check.test(result)) onCommandMatch?.('check');

      // Map voice to numbers (1-10)
      const numbers = {
        1: /1|jeden|one|first|eins/i,
        2: /2|dwa|two|second|zwei/i,
        3: /3|trzy|three|third|drei/i,
        4: /4|cztery|four|fourth|vier/i,
        5: /5|pięć|five|fifth|fünf/i, // ... etc
      };

      for (const [num, regex] of Object.entries(numbers)) {
        if (regex.test(result)) {
          onNumberMatch?.(parseInt(num));
          return;
        }
      }
    };
    recognition.start();
  };

  return { isListening, transcript, speak, startListening };
}
