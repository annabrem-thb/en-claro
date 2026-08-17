import { memo } from 'react';

import BionicText from './BionicText.jsx';
import Dialog from './Dialog.jsx';

// Shown by TTSController in browsers with zero installed system voices
// (desktop Firefox, mainly — unlike Chrome it has no bundled network voices
// and depends entirely on the OS) before the local-TTS fallback ever
// touches the network. Same shape as LocalVoiceConsentModal.jsx (mic's
// equivalent): the consent ask, then a progress bar once the download is
// under way. Kept as a separate component rather than a shared one since
// the two features have independent consent flags and can be accepted
// independently (someone who only ever uses the mic shouldn't be asked
// about the TTS download, and vice versa).
function LocalTTSConsentModalComponent({
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
      labelledBy="local-tts-consent-title"
      overlayClassName={`fixed inset-0 z-50 flex items-center justify-center p-6 text-center ${isHighContrast ? 'bg-black/90 backdrop-blur-sm' : 'bg-slate-50/90 backdrop-blur-md'}`}
      className={`no-scrollbar flex max-h-[90dvh] w-full max-w-sm flex-col items-center overflow-y-auto rounded-4xl border p-6 text-center shadow-lg sm:p-8 ${noFlash ? '' : 'animate-in fade-in zoom-in duration-300'} ${isHighContrast ? 'border-white bg-black' : 'border-slate-200 bg-white'}`}
    >
      <h2
        id="local-tts-consent-title"
        className={`mb-3 text-lg font-bold ${isHighContrast ? 'text-white' : 'text-slate-700'}`}
      >
        <BionicText
          text={t('ttsLocalConsentTitle') || 'Enable offline read-aloud?'}
          enabled={bionicReading}
        />
      </h2>

      {isLoading ? (
        <div className="w-full">
          <p
            className={`mb-4 text-sm leading-relaxed ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
          >
            <BionicText
              text={
                t('ttsLocalDownloading') ||
                'Downloading voice model… setup can take a few minutes the first time on this device.'
              }
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
                t('ttsLocalConsentBody') ||
                "This browser has no voices installed for reading aloud, but you can still hear exercises read out by downloading a one-time offline voice model (~110MB). It runs entirely on this device — nothing is uploaded. Wi-Fi is recommended."
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
                text={t('ttsLocalConsentAccept') || 'Download (~110MB)'}
                enabled={bionicReading}
              />
            </button>
            <button
              onClick={onDecline}
              className={`w-full rounded-3xl py-3 text-sm font-bold transition-all active:scale-95 ${isHighContrast ? 'bg-transparent text-white/70' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
            >
              <BionicText
                text={t('ttsLocalConsentDecline') || 'Not now'}
                enabled={bionicReading}
              />
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}

export default memo(LocalTTSConsentModalComponent);
