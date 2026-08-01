import React from 'react';
import BionicText from './BionicText';
import { useTranslation } from '../../i18n/i18n.js';

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
      {}
      {!zenMode && instruction && (
        <h3 className="mb-6 px-4 text-center text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          <BionicText text={instruction} enabled={bionicReading} />
        </h3>
      )}

      {}
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
        {children}
      </div>

      {}
      {transcript && (
        <p className="mt-4 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase sm:text-xs">
          {t.heard || (language === 'pl' ? 'Usłyszano' : language === 'de' ? 'Gehört' : 'Heard')}:{' '}
          <span className="text-slate-600">{transcript}</span>
        </p>
      )}
    </div>
  );
};

export default ExerciseWrapper;
