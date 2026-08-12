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
}) {
  const size =
    controlBtnSize ||
    (bigTargets
      ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
      : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl');

  if (error === 'unsupported') {
    return (
      <p
        role="status"
        className="max-w-[28ch] text-center text-xs font-medium text-slate-500"
      >
        {unsupportedHint ||
          t('micUnsupported') ||
          "Voice input isn't supported in this browser. You can tap your answer above instead."}
      </p>
    );
  }

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
      {error === 'not-allowed' || error === 'service-not-allowed' ? (
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-red-800"
        >
          {t('micPermissionDenied') ||
            "Microphone access was denied. Check your browser's site settings to allow it."}
        </p>
      ) : error === 'no-speech' ? (
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-slate-500"
        >
          {t('micNoSpeech') || "Didn't catch that — try again."}
        </p>
      ) : error ? (
        // Every other code (audio-capture, network, aborted, start-failed,
        // unknown, ...) used to fall through with no message at all: the
        // button just quietly went back to idle, which reads as "the
        // microphone doesn't work" with no clue why or what to do about it.
        <p
          role="status"
          className="max-w-[28ch] text-center text-xs font-medium text-red-800"
        >
          {t('micGenericError') ||
            'Something went wrong with the microphone — try again.'}
        </p>
      ) : null}
    </div>
  );
}
