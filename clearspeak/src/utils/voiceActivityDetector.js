// Pure end-of-utterance detector for the local-Whisper mic fallback
// (useLocalWhisper.js). Native SpeechRecognition decides for itself when an
// utterance is "done" and fires onresult once — capturing raw audio
// ourselves means we have to make that same call. Kept dependency-free (no
// Web Audio types) so it's driven entirely by feed(rms, timestampMs) and is
// unit-testable with synthetic RMS timelines, no real microphone or
// AudioContext needed.
export function createSilenceDetector({
  silenceThreshold = 0.015,
  silenceDurationMs = 1100,
  maxDurationMs = 8000,
} = {}) {
  let startTimeMs = null;
  let hasSpokenOnce = false;
  let lastLoudTimeMs = null;

  return {
    // Call once per RMS sample, in order. Returns { status: 'continue' } or
    // { status: 'stop', reason }, where reason is:
    //   'silence'           - spoke, then went quiet for silenceDurationMs
    //   'max-duration'      - hit the hard cap while still speaking
    //   'timeout-no-speech' - hit the hard cap without ever crossing the
    //                         threshold, mirroring the native engine's
    //                         'no-speech' error rather than handing Whisper
    //                         an empty/silent buffer to transcribe.
    feed(rms, timestampMs) {
      if (startTimeMs === null) startTimeMs = timestampMs;
      const elapsedMs = timestampMs - startTimeMs;

      if (rms >= silenceThreshold) {
        hasSpokenOnce = true;
        lastLoudTimeMs = timestampMs;
      }

      if (!hasSpokenOnce) {
        return elapsedMs >= maxDurationMs
          ? { status: 'stop', reason: 'timeout-no-speech' }
          : { status: 'continue' };
      }

      if (timestampMs - lastLoudTimeMs >= silenceDurationMs) {
        return { status: 'stop', reason: 'silence' };
      }

      return elapsedMs >= maxDurationMs
        ? { status: 'stop', reason: 'max-duration' }
        : { status: 'continue' };
    },
  };
}
