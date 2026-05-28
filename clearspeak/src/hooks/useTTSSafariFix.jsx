import { useEffect } from 'react';

/**
 * A hook to apply workarounds for common SpeechSynthesis bugs in iOS Safari.
 * This should be used once in a top-level component (e.g., App.jsx).
 *
 * - When the tab is backgrounded, it cancels any ongoing speech to prevent the engine from getting stuck.
 * - When the tab is brought back to the foreground, it "kickstarts" the engine to ensure it's responsive.
 */
export function useTTSSafariFix() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!window.speechSynthesis) {
        return;
      }

      if (document.visibilityState === 'hidden') {
        window.speechSynthesis.cancel();
      } else if (document.visibilityState === 'visible') {
        // Speaking a silent space is a known trick to "wake up" the speech engine on iOS
        // after a tab has been in the background.
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(' '));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
}