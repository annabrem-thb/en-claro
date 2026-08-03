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
  // (axe: "Element has focusable descendants") and the outer element
  // already provides keyboard activation, so we only drop the redundant
  // role/tabIndex/onKeyDown here, not the click-to-read behavior itself.
  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleRead(e);
        },
      }
    : {};

  return (
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
