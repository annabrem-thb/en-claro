import React from 'react';

export function CognitiveEnergyIndicator(
  {
    loadLevel, 
    showModal, 
    onTakeBreak, 
    onDismiss, 
    t, 
    themeStyles, 
    isHighContrast, 
    noFlash, 
    bigTargets
  }
) {
  const renderDot = (color, isActive) => {
    let classes = 'bg-slate-300 opacity-30';
    let shapeIcon = null;

    if (isActive) {
      if (color === 'green')
        { classes = 'bg-[var(--color-success)] shadow-sm'; shapeIcon = <span className="text-white text-[8px] font-black absolute inset-0 flex items-center justify-center" aria-hidden="true">✓</span>; }
      if (color === 'yellow') { classes = 'bg-[var(--color-warning)] shadow-sm'; shapeIcon = <span className="text-black text-[8px] font-black absolute inset-0 flex items-center justify-center" aria-hidden="true">-</span>; }
      if (color === 'red') { classes = `bg-[var(--color-error)] shadow-sm ${noFlash ? '' : 'animate-pulse'}`; shapeIcon = <span className="text-white text-[8px] font-black absolute inset-0 flex items-center justify-center" aria-hidden="true">✕</span>; }
    }
    return (
      <div className={`relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${classes}`} aria-hidden="true">
        {shapeIcon}
      </div>
    );
  };

  return (
    <>
      {}
      <div 
        className={`flex items-center gap-1.5 p-1.5 rounded-full border ${isHighContrast ? 'bg-black border-white/30' : 'bg-slate-50 border-slate-200 shadow-inner'}`}
        title={t.energyTitle || 'Cognitive Energy'}
        role="status"
        aria-label={`${t.energyTitle || 'Cognitive Energy'}: ${loadLevel}`}
      >
        {renderDot('green', loadLevel === 'green')}
        {renderDot('yellow', loadLevel === 'yellow')}
        {renderDot('red', loadLevel === 'red')}
      </div>

      {}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="break-title">
          <div className={`w-full max-w-sm ${bigTargets ? 'p-8 sm:p-10' : 'p-4 sm:p-6 md:p-8'} rounded-4xl shadow-2xl flex flex-col gap-3 ${noFlash ? '' : 'animate-in zoom-in duration-300'} ${isHighContrast ? 'bg-black border-2 border-white' : 'bg-white'}`}>
            <div className="text-center">
              <div className={`text-5xl mb-4 ${noFlash ? '' : 'animate-bounce'}`} aria-hidden="true">☕</div>
              <h2 id="break-title" className={`text-lg sm:text-xl md:text-2xl font-black mb-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
                {t.breakTitle || 'Time for a break?'}
              </h2>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-6 ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}>
                {t.breakDesc || 'We noticed you are working intensely. Take a rest in the garden to recharge.'}
              </p>
            </div>
            
            {}
            <div className="flex flex-col gap-3">
              <button onClick={onTakeBreak} className={`w-full ${bigTargets ? 'py-5 text-base' : 'py-3 sm:py-4 text-sm'} rounded-full font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all ${isHighContrast ? 'bg-white text-black' : `${themeStyles.button} ${themeStyles.buttonText}`}`}>
                {t.takeBreakBtn || 'Take a break (+2 💰)'}
              </button>
              <button onClick={onDismiss} className={`w-full ${bigTargets ? 'py-5 text-sm' : 'py-3 text-xs'} rounded-full font-black uppercase tracking-widest transition-all ${isHighContrast ? 'text-white/70 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-50'}`}>
                {t.continueBtn || 'Keep going'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}