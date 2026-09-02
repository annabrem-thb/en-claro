import { useEffect } from 'react';

const NUMBER_KEY_TO_PILLAR_INDEX = { 1: 0, 2: 1, 3: 2, 4: 3 };

// App-wide keyboard shortcuts: plain Arrow/Enter step through the current
// exercise; Ctrl/Cmd/Alt + a key jumps to a pillar, opens Settings, or opens
// the Survey without needing pointer precision, which matters for the app's
// motor-impairment ("motorik") accessibility mode — and, since nav/Settings
// are hidden while a task is actively being worked on (App.jsx's
// isProcessingTask), this is the *only* way to reach the Survey during that
// window at all. Disabled while focus is inside a text input so typing an
// answer never triggers a shortcut.
export function useKeyboardShortcuts({
  isGamified,
  pillars,
  goNext,
  goPrev,
  onTabChange,
  onGardenClick,
  onOpenSettings,
  onOpenSurvey,
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
        // A Tab-focused native/ARIA control (an exercise's answer button,
        // the Settings/Garden nav buttons, a toggle switch…) already has
        // its own meaning for Enter: activate it. Without this check, Enter
        // was hijacked here — via preventDefault, before the browser could
        // ever synthesize that control's click — for every button in the
        // app, all the time, not just for the post-answer "Next" button
        // this shortcut was written for (see the "Press Enter" hint under
        // it in App.jsx). A keyboard user tabbing to an exercise's answer
        // option and pressing Enter got silently bounced to the next
        // exercise instead of selecting the option they'd focused.
        const isFocusedControl =
          e.key === 'Enter' &&
          (e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'A' ||
            e.target.closest?.(
              '[role="button"], [role="switch"], [role="radio"], [role="tab"], [role="menuitem"], [role="checkbox"]',
            ));
        if (isFocusedControl) return;

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

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        vibrate(15);
        onOpenSurvey();
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
    onOpenSurvey,
    vibrate,
  ]);
}
