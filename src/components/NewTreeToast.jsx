import { memo } from 'react';

// Purely presentational: takes the already-computed "should this be
// visible right now" flag rather than deriving it (that derivation stays in
// App.jsx, next to the points/streak state it depends on). memo means this
// subtree is skipped entirely on the frequent re-renders that don't touch
// any of its four props.
function NewTreeToastComponent({ show, noFlash, isHighContrast, t }) {
  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed top-16 left-1/2 z-110 w-full max-w-sm -translate-x-1/2 px-4 sm:top-20"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex items-center gap-3 rounded-3xl border-2 p-4 shadow-2xl sm:gap-4 sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-top-8 fade-in duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-emerald-400 bg-emerald-600 text-white'}`}
      >
        <span
          className="text-4xl drop-shadow-md sm:text-5xl"
          aria-hidden="true"
        >
          🌳
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-xs font-black tracking-widest uppercase sm:text-sm">
            {t('realWorldImpact.newTreeTitle') || 'New tree'}
          </h4>
          <p
            className={`text-[10px] leading-tight font-medium wrap-break-word hyphens-auto sm:text-xs ${isHighContrast ? 'text-white/80' : 'text-emerald-50'}`}
          >
            {t('realWorldImpact.newTreeMsg') ||
              'Your consistent learning helped plant another tree, virtually.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(NewTreeToastComponent);
