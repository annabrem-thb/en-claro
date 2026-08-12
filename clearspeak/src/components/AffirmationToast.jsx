import { memo } from 'react';

function AffirmationToastComponent({ message, isHighContrast, noFlash }) {
  if (!message) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-[100] w-full max-w-sm -translate-x-1/2 px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`rounded-2xl border p-4 shadow-lg ${noFlash ? '' : 'animate-in slide-in-from-bottom-8 fade-in duration-700'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-100 bg-white text-slate-700'}`}
      >
        <p className="text-center text-sm leading-relaxed font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

export default memo(AffirmationToastComponent);
