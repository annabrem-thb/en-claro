import { memo } from 'react';

function PwaUpdateBannerComponent({
  show,
  isHighContrast,
  noFlash,
  themeStyles,
  t,
  onUpdate,
  onDismiss,
}) {
  if (!show) return null;

  return (
    <div
      className={`fixed right-4 bottom-20 left-4 z-50 w-auto rounded-3xl border-2 p-4 shadow-2xl sm:right-4 sm:bottom-24 sm:left-auto sm:w-full sm:max-w-xs sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-bottom sm:slide-in-from-right duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-100 bg-white text-slate-800'}`}
      role="alert"
      aria-live="assertive"
    >
      <h4 className="mb-1 flex items-center gap-2 text-sm font-black">
        <span aria-hidden="true">🌱</span> {t('pwaNewVersion') || 'New version'}
      </h4>
      <p
        className={`mb-4 text-xs leading-relaxed font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
      >
        {t('pwaDescription') ||
          'New content is available. Please update the app to get the latest offline changes.'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onUpdate}
          className={`flex-1 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase shadow-md transition-all active:scale-95 sm:text-xs ${themeStyles.button} ${themeStyles.buttonText}`}
        >
          {t('pwaUpdate') || 'Update'}
        </button>
        <button
          onClick={onDismiss}
          className={`flex-1 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase transition-all sm:text-xs ${isHighContrast ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          {t('pwaLater') || 'Later'}
        </button>
      </div>
    </div>
  );
}

export default memo(PwaUpdateBannerComponent);
