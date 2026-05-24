import React from 'react';
import BionicText from './BionicText';
import { useTranslation } from '../../i18n/i18n.js';

/**
 * Common wrapper for all exercise types to standardize UI structure.
 */
const ExerciseWrapper = ({
  children,
  instruction,
  transcript,
  zenMode,
  bionicReading,
  language,
  animationClass = 'animate-in fade-in zoom-in duration-500',
}) => {
  const t = useTranslation(language);

  return (
    <div
      className={`${animationClass} flex h-full min-h-0 w-full flex-1 flex-col items-center py-2`}
    >
      {/* 1. Header Logic */}
      {!zenMode && instruction && (
        <h3 className="mb-6 px-4 text-center text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          <BionicText text={instruction} enabled={bionicReading} />
        </h3>
      )}

      {/* 2. Main content area */}
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        {children}
      </div>

      {/* 3. Feedback / Transcript area */}
      {transcript && (
        <p className="mt-4 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase sm:text-xs">
          {t.heard || 'Usłyszano'}:{' '}
          <span className="text-slate-600">{transcript}</span>
        </p>
      )}
    </div>
  );
};

export default ExerciseWrapper;
