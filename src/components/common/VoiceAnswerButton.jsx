import { useState } from 'react';

import LocalVoiceConsentModal from './LocalVoiceConsentModal.jsx';
import MicHelpModal from './MicHelpModal.jsx';

// Accessible microphone toggle for hands-free exercise answering. Every
// exercise that supports voice input (Clock, Context, Grapheme, ReadAloud,
// Sequence, Spatial, Syllable) used to duplicate this same button markup
// inline with only cosmetic differences — consolidated here so the
// touch-target sizing, contrast-safe pulse state, and error/permission
// messaging only need to be got right in one place.
export default function VoiceAnswerButton({
  isListening,
  onStart,
  disabled = false,
  error,
  t,
  themeStyles,
  noFlash = false,
  bigTargets = false,
  isHighContrast = false,
  bionicReading = false,
  controlBtnSize,
  // Most exercises ask for a spoken option/tile number, but the wording
  // that actually makes sense varies (e.g. Syllable's "speak gap number" —
  // there is no "option" here, just a position between letters).
  idleLabel,
  // Overrides the "voice unsupported" message for exercises where the
  // default's suggested fallback ("tap your answer above instead") isn't
  // actually true — ReadAloudExercise has no tappable options, only the
  // mic, so it needs to point at the universal Skip button instead.
  unsupportedHint,
  // Same idea as unsupportedHint but for the shorter line appended after a
  // *different* specific error (permission denied, hardware/network
  // failure, ...) — kept separate from unsupportedHint because that one
  // opens with "voice input isn't supported here," which would be false
  // when the real problem was e.g. a denied permission on a browser that
  // does support it.
  fallbackHint,
  // The four fields below only exist on useExerciseVoice's local-Whisper
  // fallback path (browsers with no native SpeechRecognition) — undefined
  // on every native-engine caller, so nothing here changes for them.
  voiceStatus,
  modelDownloadProgress,
  confirmModelDownload,
  declineModelDownload,
}) {
  const [showHelp, setShowHelp] = useState(false);
  const awaitingLocalVoiceSetup =
    voiceStatus === 'awaiting-consent' || voiceStatus === 'loading-model';

  const size =
    controlBtnSize ||
    (bigTargets
      ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
      : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl');

  // Shown alongside every error branch below except "no-speech" (the mic
  // already works there, so pointing someone at their phone's permission
  // settings would be a non-sequitur). Opens MicHelpModal rather than
  // navigating anywhere, since the fix lives in the phone's own Settings
  // app, not on a page this app could deep-link to.
  const seeMoreInfoButton = (
    <button
      type="button"
      onClick={() => setShowHelp(true)}
      className="text-xs font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800"
    >
      {t('micHelpLinkText') || 'See more information'}
    </button>
  );

  if (error === 'unsupported') {
    return (
      <div className="flex flex-col items-center gap-1">
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-slate-500"
        >
          {unsupportedHint ||
            t('micUnsupported') ||
            "Voice input isn't supported in this browser. You can tap your answer above instead."}
        </p>
        {seeMoreInfoButton}
        <MicHelpModal
          open={showHelp}
          onClose={() => setShowHelp(false)}
          isHighContrast={isHighContrast}
          noFlash={noFlash}
          bionicReading={bionicReading}
          t={t}
        />
      </div>
    );
  }

  // The concrete reason a *different* mic attempt fails varies a lot by
  // device (denied permission, no network for the cloud recognizer many
  // mobile browsers rely on, an in-app/WebView browser that blocks the API
  // outright even though it reports as supported, ...) — too many distinct
  // causes to reliably diagnose from here. What matters to the person stuck
  // on it is the same regardless of which one it is: a way to answer
  // anyway. So this same actionable line is shown alongside every failure
  // state below — only "no-speech" skips it, since that one means the mic
  // *is* working and simply asks for a retry.
  const resolvedFallbackHint =
    fallbackHint ||
    t('micFallbackHint') ||
    'You can tap your answer above instead.';

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onStart}
        disabled={disabled}
        className={`${size} flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale ${
          isListening
            ? `bg-red-500 text-white ring-8 ring-red-100 ${noFlash ? '' : 'animate-pulse'}`
            : `${themeStyles.button} ${themeStyles.buttonText} hover:brightness-110`
        }`}
        aria-label={
          isListening
            ? t('listening') || 'Listening...'
            : idleLabel || t('speakOptionNumber') || 'Speak option number'
        }
        aria-pressed={isListening}
      >
        {isListening ? '🛑' : '🎤'}
      </button>
      {voiceStatus === 'transcribing' ? (
        // Local-Whisper only: the mic already stopped capturing by this
        // point (that's what triggered transcription), but `isListening`
        // stays true through this state too so the button keeps its
        // pulsing "stop" look rather than flicking back to idle for the
        // second or two inference takes — this line is what tells the
        // difference apart from "still listening."
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-slate-500"
        >
          {t('micLocalTranscribing') ||
            'Thinking… this can take up to a minute on this device.'}
        </p>
      ) : error === 'not-allowed' || error === 'service-not-allowed' ? (
        <div className="flex flex-col items-center gap-1">
          <p
            role="status"
            className="max-w-[28ch] text-center text-xs font-medium text-red-800"
          >
            {t('micPermissionDenied') ||
              "Microphone access was denied. Check your browser's site settings to allow it."}
          </p>
          <p className="max-w-[28ch] text-center text-xs font-medium text-slate-500">
            {resolvedFallbackHint}
          </p>
          {seeMoreInfoButton}
        </div>
      ) : error === 'no-speech' ? (
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-slate-500"
        >
          {t('micNoSpeech') || "Didn't catch that — try again."}
        </p>
      ) : error === 'local-download-error' ? (
        <div className="flex flex-col items-center gap-1">
          <p
            role="status"
            className="max-w-[28ch] text-center text-xs font-medium text-red-800"
          >
            {t('micLocalDownloadError') ||
              "The voice model couldn't be downloaded — check your connection and try again."}
          </p>
          <p className="max-w-[28ch] text-center text-xs font-medium text-slate-500">
            {resolvedFallbackHint}
          </p>
        </div>
      ) : error ? (
        // Every other code (audio-capture, network, aborted, start-failed,
        // unknown, ...) used to fall through with no message at all: the
        // button just quietly went back to idle, which reads as "the
        // microphone doesn't work" with no clue why or what to do about it.
        <div className="flex flex-col items-center gap-1">
          <p
            role="status"
            className="max-w-[28ch] text-center text-xs font-medium text-red-800"
          >
            {t('micGenericError') ||
              'Something went wrong with the microphone — try again.'}
          </p>
          <p className="max-w-[28ch] text-center text-xs font-medium text-slate-500">
            {resolvedFallbackHint}
          </p>
          {seeMoreInfoButton}
        </div>
      ) : null}
      <MicHelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        isHighContrast={isHighContrast}
        noFlash={noFlash}
        bionicReading={bionicReading}
        t={t}
      />
      <LocalVoiceConsentModal
        open={awaitingLocalVoiceSetup}
        status={voiceStatus}
        progress={modelDownloadProgress}
        onConfirm={confirmModelDownload}
        onDecline={declineModelDownload}
        isHighContrast={isHighContrast}
        noFlash={noFlash}
        bionicReading={bionicReading}
        t={t}
      />
    </div>
  );
}
