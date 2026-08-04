import { useEffect } from 'react';

const NUMBER_KEY_TO_PILLAR_INDEX = { 1: 0, 2: 1, 3: 2, 4: 3 };

// App-wide keyboard shortcuts: plain Arrow/Enter step through the current
// exercise; Ctrl/Cmd/Alt + a key jumps to a pillar or opens Settings without
// needing pointer precision, which matters for the app's motor-impairment
// ("motorik") accessibility mode. Disabled while focus is inside a text
// input so typing an answer never triggers a shortcut.
export function useKeyboardShortcuts({
  isGamified,
  pillars,
  goNext,
  goPrev,
  onTabChange,
  onGardenClick,
  onOpenSettings,
  vibrate,
  // Any focus-trapped dialog (Settings, the level-up celebration, the
  // feedback survey, the cognitive-break prompt) must own all keyboard
  // input while it's open. Without this, ArrowRight/Enter/number keys meant
  // for a control inside the dialog would also be interpreted as "go to
  // next exercise" or "switch pillar" by this window-level listener, since
  // `window` still receives every bubbled keydown regardless of which
  // element currently holds focus.
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault();
          goNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        }
        return;
      }

      if (e.key === ',') {
        e.preventDefault();
        vibrate(15);
        onOpenSettings();
        return;
      }

      const availableTabs = isGamified ? [...pillars, 'Garden'] : pillars;
      const targetTab = availableTabs[NUMBER_KEY_TO_PILLAR_INDEX[e.key]];
      if (!targetTab) return;

      e.preventDefault();
      vibrate(15);
      targetTab === 'Garden' ? onGardenClick() : onTabChange(targetTab);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    isGamified,
    pillars,
    goNext,
    goPrev,
    onTabChange,
    onGardenClick,
    onOpenSettings,
    vibrate,
  ]);
}
