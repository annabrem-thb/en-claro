import { memo, useState } from 'react';

import {
  hasLocalFallbackSupport,
  hasNativeSpeechRecognition,
} from '../utils/voiceCapabilities.js';

import BionicText from './common/BionicText.jsx';

// Must match the key useLocalWhisper.js writes once someone accepts the
// in-exercise download prompt — if that already happened, this banner has
// nothing left to tell them.
const CONSENT_STORAGE_KEY = 'localWhisperConsent';
const DISMISS_STORAGE_KEY = 'voiceFallbackBannerDismissed';

// Surfaces the "this browser needs a one-time download for voice input"
// notice on the main screen, rather than only the moment someone taps a mic
// button mid-exercise — Firefox/Safari users otherwise have no way to know
// in advance that the first mic tap will kick off a ~150MB download instead
// of just working, which reads as the app hanging on a slow connection.
// Persisted via localStorage (unlike PwaUpdateBanner, which just resets on
// next reload) since this is about a fixed browser capability, not a
// one-off event — reappearing every single visit would be noise.
function VoiceFallbackBannerComponent({
  isHighContrast,
  noFlash,
  themeStyles,
  t,
  bionicReading = false,
}) {
  // A lazy initializer (not useEffect + setState) since this is a plain
  // client-side SPA with no SSR pass to worry about — computing it up front
  // means the banner is correct on the very first paint instead of
  // flashing in a render after mount.
  const [visible, setVisible] = useState(() => {
    if (hasNativeSpeechRecognition()) return false;
    if (!hasLocalFallbackSupport()) return false;
    if (localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted') return false;
    if (localStorage.getItem(DISMISS_STORAGE_KEY) === 'true') return false;
    return true;
  });

  const dismiss = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 left-4 z-50 w-auto rounded-3xl border-2 p-4 shadow-2xl sm:top-4 sm:right-4 sm:left-auto sm:w-full sm:max-w-xs sm:p-5 ${noFlash ? '' : 'animate-in slide-in-from-top duration-500'} ${isHighContrast ? 'border-white bg-black text-white' : 'border-slate-100 bg-white text-slate-800'}`}
      role="status"
      aria-live="polite"
    >
      <h4 className="mb-1 flex items-center gap-2 text-sm font-black">
        <span aria-hidden="true">🎙️</span>
        <BionicText
          text={t('voiceFallbackBannerTitle') || 'Voice input on this browser'}
          enabled={bionicReading}
        />
      </h4>
      <p
        className={`mb-4 text-xs leading-relaxed font-medium ${isHighContrast ? 'text-white/70' : 'text-slate-500'}`}
      >
        <BionicText
          text={
            t('voiceFallbackBannerBody') ||
            "This browser doesn't have built-in voice recognition. The microphone will still work — the first time you use it, you'll be asked to download a one-time offline voice model (~150MB)."
          }
          enabled={bionicReading}
        />
      </p>
      <button
        onClick={dismiss}
        className={`w-full rounded-xl py-3 text-[10px] font-black tracking-widest uppercase shadow-md transition-all active:scale-95 sm:text-xs ${themeStyles.button} ${themeStyles.buttonText}`}
      >
        <BionicText
          text={t('voiceFallbackBannerDismiss') || 'Got it'}
          enabled={bionicReading}
        />
      </button>
    </div>
  );
}

export default memo(VoiceFallbackBannerComponent);
