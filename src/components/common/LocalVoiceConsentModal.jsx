import { memo } from 'react';

import BionicText from './BionicText.jsx';
import Dialog from './Dialog.jsx';

// Shown by VoiceAnswerButton in browsers with no native SpeechRecognition
// (Firefox, Safari, ...) before the local-Whisper fallback ever touches the
// network — explains the one-time ~150MB model download and requires an
// explicit tap before it starts, since that's real data on someone's phone
// plan. Two views driven by `status`: the consent ask, then a progress bar
// once the download is under way. Built on the shared Dialog wrapper (same
// as MicHelpModal/LevelUpModal) for a real focus trap and Escape-to-close.
function LocalVoiceConsentModalComponent({
  open,
  status,
  progress,
  onConfirm,
  onDecline,
  isHighContrast,
  noFlash,
  bionicReading = false,
  t,
}) {
  const isLoading = status === 'loading-model';

  return (
    <Dialog
      open={open}
      onClose={onDecline}
      labelledBy="local-voice-consent-title"
      overlayClassName={`fixed inset-0 z-50 flex items-center justify-center p-6 text-center ${isHighContrast ? 'bg-black/90 backdrop-blur-sm' : 'bg-slate-50/90 backdrop-blur-md'}`}
      className={`no-scrollbar flex max-h-[90dvh] w-full max-w-sm flex-col items-center overflow-y-auto rounded-4xl border p-6 text-center shadow-lg sm:p-8 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-300'} ${isHighContrast ? 'border-white bg-black' : 'border-slate-200 bg-white'}`}
    >
      <h2
        id="local-voice-consent-title"
        className={`mb-3 text-lg font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
      >
        <BionicText
          text={t('micLocalConsentTitle') || 'Enable offline voice input?'}
          enabled={bionicReading}
        />
      </h2>

      {isLoading ? (
        <div className="w-full">
          <p
            className={`mb-4 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            <BionicText
              text={t('micLocalDownloading') || 'Downloading voice model…'}
              enabled={bionicReading}
            />
          </p>
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress || 0)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`h-2 w-full overflow-hidden rounded-full ${isHighContrast ? 'bg-white/20' : 'bg-slate-100'}`}
          >
            <div
              className={`h-full rounded-full transition-all ${isHighContrast ? 'bg-white' : 'bg-slate-500'}`}
              style={{ width: `${Math.round(progress || 0)}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <p
            className={`mb-6 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            <BionicText
              text={
                t('micLocalConsentBody') ||
                "This browser doesn't support built-in voice input, but you can still use the microphone by downloading a one-time offline voice model (~150MB). It runs entirely on this device — nothing is uploaded. Wi-Fi is recommended."
              }
              enabled={bionicReading}
            />
          </p>
          <div className="flex w-full flex-col gap-2">
            <button
              onClick={onConfirm}
              className={`w-full rounded-3xl py-3 text-sm font-bold transition-all active:scale-95 ${isHighContrast ? 'bg-white text-black' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            >
              <BionicText
                text={t('micLocalConsentAccept') || 'Download (~150MB)'}
                enabled={bionicReading}
              />
            </button>
            <button
              onClick={onDecline}
              className={`w-full rounded-3xl py-3 text-sm font-bold transition-all active:scale-95 ${isHighContrast ? 'bg-transparent text-white/70' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
            >
              <BionicText
                text={t('micLocalConsentDecline') || 'Not now'}
                enabled={bionicReading}
              />
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}

export default memo(LocalVoiceConsentModalComponent);
