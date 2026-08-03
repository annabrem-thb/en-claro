import React from 'react';

import { useTranslation } from 'react-i18next';

import BionicText from './BionicText';

const ExerciseWrapper = ({
  children,
  instruction,
  transcript,
  zenMode,
  bionicReading,
  animationClass = 'animate-in fade-in zoom-in duration-500',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${animationClass} flex h-full min-h-0 w-full flex-1 flex-col items-center py-2`}
    >
      {}
      {!zenMode && instruction && (
        <h3 className="mb-6 px-4 text-center text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase">
          <BionicText text={instruction} enabled={bionicReading} />
        </h3>
      )}

      {}
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        {children}
      </div>

      {}
      {transcript && (
        <p className="mt-4 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase sm:text-xs">
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      )}
    </div>
  );
};

export default ExerciseWrapper;
