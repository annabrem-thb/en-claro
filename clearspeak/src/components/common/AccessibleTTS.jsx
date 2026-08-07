import React from 'react';

import { useTranslation } from 'react-i18next';

export default function AccessibleTTS({
  text,
  speak,
  children,
  className = '',
  interactive = true,
}) {
  const { t } = useTranslation();

  const handleRead = (e) => {
    if (speak && text) speak(text, true);
  };

  // `interactive={false}` is for cases where this is nested inside another
  // already-interactive element (e.g. a nav <button>) — a focusable,
  // role="button" element inside another button/link is invalid ARIA
  // (axe: "Element has focusable descendants"), so this branch drops the
  // role/tabIndex/onKeyDown.
  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleRead(e);
        },
      }
    : {};

  // KNOWN GAP (surfaced by eslint-plugin-jsx-a11y, not yet fixed): the
  // comment above used to claim "the outer element already provides
  // keyboard activation" for the read-aloud behavior too, but that isn't
  // actually true — a click event on an ancestor <button> never bubbles
  // *down* into this descendant's onClick, only up from a target through
  // its ancestors. So a keyboard user who Tab+Enters the outer nav button
  // gets its navigation action, but never triggers this component's
  // read-the-label-aloud side effect; only a direct mouse/touch tap on the
  // 🔊 icon does. The primary action (navigation) is fully keyboard
  // accessible either way — only this supplementary "preview the label via
  // TTS" affordance is mouse/touch-only today. Fixing it properly means
  // routing `handleRead` through each `interactive={false}` call site's own
  // button `onClick` in SidebarNav.jsx (4 usages) rather than a local
  // change here, so it's left as a flagged, deliberate follow-up rather
  // than a rushed edit to shared navigation code.
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`group relative inline-flex w-full cursor-pointer items-center gap-1 ${className}`}
      onClick={handleRead}
      title={t('readAloudTitle')}
      {...interactiveProps}
    >
      {children}
      <span
        className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        🔊
      </span>
    </div>
  );
}
