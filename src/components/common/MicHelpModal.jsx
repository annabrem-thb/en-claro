import { memo } from 'react';

import BionicText from './BionicText.jsx';
import Dialog from './Dialog.jsx';

// Phone-level microphone instructions, reachable via VoiceAnswerButton's
// "See more information" link whenever a mic attempt fails. The in-app error
// messages (permission denied, unsupported, ...) tell someone *that*
// something's wrong, but not *where* to go fix it on their specific device —
// most people hitting this on Android have never had a reason to find the
// OS-level mic switch or the browser's per-site permission screen before.
// Built on the shared Dialog wrapper (same as LevelUpModal) so it gets a
// real focus trap and Escape-to-close for free, since it's reached via a
// deliberate click, not sprung on the user automatically.
function MicHelpModalComponent({
  open,
  onClose,
  isHighContrast,
  noFlash,
  bionicReading = false,
  t,
}) {
  const steps = (key) => {
    const list = t?.(key, { returnObjects: true });
    return Array.isArray(list) ? list : [];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="mic-help-title"
      overlayClassName={`fixed inset-0 z-50 flex items-center justify-center p-6 text-center ${isHighContrast ? 'bg-black/90 backdrop-blur-sm' : 'bg-slate-50/90 backdrop-blur-md'}`}
      className={`no-scrollbar flex max-h-[90dvh] w-full max-w-sm flex-col items-start overflow-y-auto rounded-4xl border p-6 text-left shadow-lg sm:p-8 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-300'} ${isHighContrast ? 'border-white bg-black' : 'border-slate-200 bg-white'}`}
    >
      <h2
        id="mic-help-title"
        className={`mb-4 text-lg font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
      >
        <BionicText
          text={t('micHelpTitle') || 'How to enable the microphone'}
          enabled={bionicReading}
        />
      </h2>

      <h3
        className={`mb-2 text-sm font-bold ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
      >
        <BionicText
          text={t('micHelpGlobalTitle') || 'Global microphone switch'}
          enabled={bionicReading}
        />
      </h3>
      <ol
        className={`mb-5 list-decimal space-y-1 pl-5 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
      >
        {steps('micHelpGlobalSteps').map((step, i) => (
          <li key={i}>
            <BionicText text={step} enabled={bionicReading} />
          </li>
        ))}
      </ol>

      <h3
        className={`mb-2 text-sm font-bold ${isHighContrast ? 'text-white' : 'text-slate-600'}`}
      >
        <BionicText
          text={t('micHelpAppTitle') || 'App-specific permissions'}
          enabled={bionicReading}
        />
      </h3>
      <ol
        className={`mb-5 list-decimal space-y-1 pl-5 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
      >
        {steps('micHelpAppSteps').map((step, i) => (
          <li key={i}>
            <BionicText text={step} enabled={bionicReading} />
          </li>
        ))}
      </ol>

      <p
        className={`mb-6 text-xs leading-relaxed ${isHighContrast ? 'text-white/60' : 'text-slate-400'}`}
      >
        <BionicText
          text={
            t('micHelpChromeHint') ||
            'In Chrome, you can also tap the lock/info icon next to the address bar → Permissions → Microphone → Allow.'
          }
          enabled={bionicReading}
        />
      </p>

      <button
        onClick={onClose}
        className={`w-full rounded-3xl py-3 text-sm font-bold transition-all active:scale-95 ${isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        <BionicText text={t('close') || 'Close'} enabled={bionicReading} />
      </button>
    </Dialog>
  );
}

export default memo(MicHelpModalComponent);
