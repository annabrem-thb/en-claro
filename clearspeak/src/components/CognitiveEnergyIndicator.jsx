import React from 'react';

import BionicText from './common/BionicText.jsx';
import Dialog from './common/Dialog.jsx';

export function CognitiveEnergyIndicator({
  loadLevel,
  showModal,
  onTakeBreak,
  onDismiss,
  t,
  themeStyles,
  isHighContrast,
  noFlash,
  bigTargets,
  bionicReading = false,
}) {
  // A colorblind user can't tell the active dot from the other two by hue
  // alone, so every dot always carries its own shape (✓ / − / ✕) — the
  // *symbol*, not the color, is what distinguishes "fine" from "tired" from
  // "needs a break". The active dot is simply the one drawn bold/full-size/
  // full-opacity; the other two stay small and faded, exactly like an
  // un-lit segment on a gauge.
  const DOT_STYLES = {
    green: {
      active: 'bg-[var(--color-success)] shadow-sm',
      symbol: '✓',
      symbolColor: 'text-white',
    },
    yellow: {
      active: 'bg-[var(--color-warning)] shadow-sm',
      symbol: '−',
      symbolColor: 'text-black',
    },
    red: {
      active: `bg-[var(--color-error)] shadow-sm ${noFlash ? '' : 'animate-pulse'}`,
      symbol: '✕',
      symbolColor: 'text-white',
    },
  };

  const renderDot = (color, isActive) => {
    const { active, symbol, symbolColor } = DOT_STYLES[color];
    return (
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
          isActive
            ? `h-3.5 w-3.5 sm:h-4 sm:w-4 ${active}`
            : 'h-2.5 w-2.5 bg-slate-300 opacity-40 sm:h-3 sm:w-3'
        }`}
        aria-hidden="true"
      >
        <span
          className={`font-black ${isActive ? `text-[9px] ${symbolColor}` : 'text-[7px] text-slate-500'}`}
        >
          {symbol}
        </span>
      </div>
    );
  };

  return (
    <>
      {}
      <div
        className={`flex items-center gap-1.5 rounded-full border p-1.5 ${isHighContrast ? 'border-white/30 bg-black' : 'border-slate-200 bg-slate-50 shadow-inner'}`}
        title={t('energyTitle') || 'Cognitive Energy'}
        role="status"
        aria-label={`${t('energyTitle') || 'Cognitive Energy'}: ${loadLevel}`}
      >
        {renderDot('green', loadLevel === 'green')}
        {renderDot('yellow', loadLevel === 'yellow')}
        {renderDot('red', loadLevel === 'red')}
      </div>

      {}
      <Dialog
        open={showModal}
        onClose={onDismiss}
        labelledBy="break-title"
        overlayClassName="z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
        className={`w-full max-w-sm ${bigTargets ? 'p-8 sm:p-10' : 'p-4 sm:p-6 md:p-8'} flex flex-col gap-3 rounded-4xl shadow-2xl outline-none ${noFlash ? '' : 'animate-in zoom-in duration-300'} ${isHighContrast ? 'border-2 border-white bg-black' : 'bg-white'}`}
      >
        <div className="text-center">
          <div
            className={`mb-4 text-5xl ${noFlash ? '' : 'animate-bounce'}`}
            aria-hidden="true"
          >
            ☕
          </div>
          <h2
            id="break-title"
            className={`mb-2 text-lg font-black sm:text-xl md:text-2xl ${isHighContrast ? 'text-white' : 'text-slate-800'}`}
          >
            <BionicText
              text={t('breakTitle') || 'Time for a break?'}
              enabled={bionicReading}
            />
          </h2>
          <p
            className={`mb-6 text-xs leading-relaxed font-medium sm:text-sm ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            <BionicText
              text={
                t('breakDesc') ||
                'We noticed you are working intensely. Take a rest in the garden to recharge.'
              }
              enabled={bionicReading}
            />
          </p>
        </div>

        {}
        <div className="flex flex-col gap-3">
          <button
            onClick={onTakeBreak}
            className={`w-full ${bigTargets ? 'py-5 text-base' : 'py-3 text-sm sm:py-4'} rounded-full font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} ${themeStyles.buttonText}`}`}
          >
            <BionicText
              text={t('takeBreakBtn') || 'Take a break (+2 💰)'}
              enabled={bionicReading}
            />
          </button>
          <button
            onClick={onDismiss}
            className={`w-full ${bigTargets ? 'py-5 text-sm' : 'py-3 text-xs'} rounded-full font-black tracking-widest uppercase transition-all ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BionicText
              text={t('continueBtn') || 'Keep going'}
              enabled={bionicReading}
            />
          </button>
        </div>
      </Dialog>
    </>
  );
}
