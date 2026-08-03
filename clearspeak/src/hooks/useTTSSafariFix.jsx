import { useEffect } from 'react';

export function useTTSSafariFix() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!window.speechSynthesis) {
        return;
      }
      if (document.visibilityState === 'hidden') {
        window.speechSynthesis.cancel();
      } else if (document.visibilityState === 'visible') {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(' '));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
}
