import React, { useState } from 'react';

import Dialog from './common/Dialog.jsx';

export function FeedbackCollector({
  open,
  onSubmit,
  onSkip,
  t,
  themeStyles,
  isHighContrast,
  noFlash,
  bigTargets,
}) {
  const [mental, setMental] = useState(3);
  const [effort, setEffort] = useState(3);
  const [frustration, setFrustration] = useState(3);

  const v = t('feedback', { returnObjects: true }) || {};

  const thumbBase = bigTargets
    ? '[&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer'
    : '';
  const thumbColor = isHighContrast
    ? '[&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:bg-white'
    : '[&::-webkit-slider-thumb]:bg-[var(--thumb-color)] [&::-moz-range-thumb]:bg-[var(--thumb-color)]';

  const RangeInput = ({
    label,
    desc,
    value,
    setValue,
    leftLabel,
    rightLabel,
  }) => (
    <div
      className={`flex flex-col gap-1.5 sm:gap-2 ${bigTargets ? 'p-4 sm:p-6' : 'p-3 sm:p-4'} shrink-0 rounded-2xl border-2 ${isHighContrast ? 'border-white/30 bg-black' : 'border-slate-100 bg-slate-50'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span
            className={`block text-[10px] font-black tracking-wider break-words uppercase sm:text-xs ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
          >
            {label}
          </span>
          <span
            className={`mt-0.5 block text-[9px] leading-tight font-medium break-words sm:text-[10px] ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            {desc}
          </span>
        </div>
        <span
          className={`shrink-0 text-lg font-black sm:text-xl ${themeStyles.accent}`}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${value} out of 5`}
        className={`mt-2 w-full cursor-pointer appearance-none rounded-lg ${isHighContrast ? 'bg-white/30' : 'bg-slate-200'} ${bigTargets ? `h-4 ${thumbBase} ${thumbColor}` : 'h-2'}`}
        style={{
          accentColor: isHighContrast
            ? '#ffffff'
            : themeStyles?.hex || '#10b981',
          '--thumb-color': isHighContrast
            ? '#ffffff'
            : themeStyles?.hex || '#10b981',
        }}
      />
      <div className="mt-1 flex justify-between gap-2">
        <span className="flex-1 text-left text-[8px] font-bold tracking-widest break-words text-slate-600 uppercase sm:text-[9px]">
          {leftLabel || v.low || 'Low'}
        </span>
        <span className="flex-1 text-right text-[8px] font-bold tracking-widest break-words text-slate-600 uppercase sm:text-[9px]">
          {rightLabel || v.high || 'High'}
        </span>
      </div>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onSkip}
      labelledBy="feedback-title"
      overlayClassName="z-[60] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
      className={`relative flex max-h-[98vh] w-full max-w-md flex-col overflow-y-auto rounded-3xl shadow-2xl outline-none sm:rounded-4xl ${noFlash ? '' : 'animate-in zoom-in duration-300'} ${isHighContrast ? 'border-2 border-white bg-black' : 'bg-white'}`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: isHighContrast
          ? '#ffffff #000000'
          : '#cbd5e1 transparent',
      }}
    >
      <div className="flex flex-col gap-4 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:gap-6 sm:p-6 md:p-8">
        <div className="shrink-0 text-center">
          <div className="mb-1 text-3xl sm:mb-2 sm:text-4xl" aria-hidden="true">
            🧠
          </div>
          <h2
            id="feedback-title"
            className={`mb-1 text-lg font-black sm:mb-2 sm:text-xl md:text-2xl ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
          >
            {v.title || 'A moment of reflection'}
          </h2>
          <p
            className={`text-[10px] leading-relaxed font-medium sm:text-xs ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            {v.desc || 'Your feedback helps us adapt the experience.'}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:gap-4">
          <h3
            className={`text-xs font-black tracking-widest uppercase ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
          >
            {v.nasaTitle || 'NASA-TLX'}
          </h3>
          <RangeInput
            label={v.nasa?.mental || v.mental}
            desc={v.nasa?.mentalDesc || v.mentalDesc}
            value={mental}
            setValue={setMental}
          />
          <RangeInput
            label={v.nasa?.physical || v.physical}
            desc={v.nasa?.physicalDesc || v.physicalDesc}
            value={effort}
            setValue={setEffort}
          />
          <RangeInput
            label={v.nasa?.frustration || v.frustration}
            desc={v.nasa?.frustrationDesc || v.frustrationDesc}
            value={frustration}
            setValue={setFrustration}
          />
        </div>

        {}
        <div className="mt-2 flex shrink-0 flex-col gap-2">
          <button
            onClick={() => {
              onSubmit({ mental, effort, frustration });
              setMental(3);
              setEffort(3);
              setFrustration(3);
            }}
            className={`w-full ${bigTargets ? 'py-4 text-sm sm:py-6 sm:text-base' : 'py-3 text-xs sm:py-4 sm:text-sm'} rounded-full font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} text-white`}`}
          >
            {v.submit || 'Save'}
          </button>
          <button
            onClick={onSkip}
            className={`w-full ${bigTargets ? 'py-3 text-xs sm:py-5 sm:text-sm' : 'py-2 text-[10px] sm:py-3 sm:text-xs'} rounded-full font-black tracking-widest uppercase transition-all ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {v.skip || 'Skip'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
