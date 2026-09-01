// Recorded audio for isolated phonemes isn't available yet: a synthesized
// voice attaches a schwa to plosives ("buh" for /b/), which no configuration
// of the existing TTS engines (see useGlobalTTS.js/useLocalTTS.js) fixes —
// it's an inherent limit of reading text aloud, not a tuning problem. Until
// a (language, grapheme) pair has a recorded clip here, this falls back to
// having speak() read the grapheme's own text, the closest approximation a
// synthesizer can produce. Real recordings can be dropped into
// RECORDED_PHONEME_AUDIO later without any exercise component changing.
const RECORDED_PHONEME_AUDIO = {
  de: {},
  en: {},
  pl: {},
};

export function playPhoneme(grapheme, language, speak, extendedTime, onEnd) {
  const recordedSrc = RECORDED_PHONEME_AUDIO[language]?.[grapheme];
  if (recordedSrc) {
    const audio = new Audio(recordedSrc);
    if (onEnd) audio.addEventListener('ended', onEnd, { once: true });
    audio.play();
    return;
  }
  speak(grapheme, extendedTime, onEnd);
}
