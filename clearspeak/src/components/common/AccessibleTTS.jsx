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
  // role/tabIndex/onKeyDown *and* the local onClick: a click event on an
  // ancestor <button> never bubbles *down* into a descendant's onClick, only
  // up from a target through its ancestors, so a keyboard user who
  // Tab+Enters the outer button would get its primary action but never this
  // component's read-the-label-aloud side effect — while a mouse user who
  // happened to click exactly on this label would double-fire it (once here
  // via bubbling target, once via the ancestor's own handler). Nesting this
  // way means the ancestor owns the read-aloud call entirely (see
  // SidebarNav.jsx's 4 `interactive={false}` usages, each of which calls
  // `speak()` itself in its button's onClick) so it fires exactly once for
  // every input method instead of zero or two times depending on how you
  // clicked.
  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: handleRead,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleRead(e);
        },
      }
    : {};

  return (
    <div
      className={`group relative inline-flex w-full cursor-pointer items-center gap-1 ${className}`}
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
