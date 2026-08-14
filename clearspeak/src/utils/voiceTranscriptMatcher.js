// Shared by both voice engines useExerciseVoice.jsx can end up driving —
// native SpeechRecognition's onresult, and the local-Whisper fallback's
// transcribed text — so a spoken "trzecia"/"dritte"/"third" resolves to the
// same option regardless of which engine heard it. Kept as a pure function
// (no engine-specific state) so it's testable without a fake recognizer.

// Single spoken Latin letters (plus PL/DE diacritics) map straight through
// as a one-character transcript on every engine tested — recognized
// letter-by-letter dictation doesn't need a phonetic alphabet lookup table,
// just normalization of what the engine already returns.
const SINGLE_LETTER_PATTERN = /^[a-ząćęłńóśźżäöüß]$/i;

// Strips trailing/leading punctuation some engines include (e.g. "sprawdź."
// or "check!") before command/number/letter matching — matters most for
// languages whose command words are short and can otherwise fail a strict
// regex match on the trailing mark alone.
export function normalizeTranscript(rawTranscript) {
  return rawTranscript
    .toLowerCase()
    .trim()
    .replace(/^[.,!?;:]+|[.,!?;:]+$/g, '');
}

export function matchVoiceTranscript(
  result,
  t,
  { onCommandMatch, onNumberMatch, onLetterMatch, onWordMatch } = {},
) {
  // Fires unconditionally, independent of the command/number/letter routing
  // below — free-text exercises (e.g. "say the word you heard") need the
  // raw transcript itself, not a parsed selection, and calling this
  // straight from here (rather than relying on a `transcript` state-change
  // effect downstream) means saying the same word twice in a row still
  // triggers a fresh check instead of silently no-oping when React bails
  // out of a same-value state update.
  onWordMatch?.(result);

  const commandPatterns = {
    undo: t?.('commands.undo', { returnObjects: true }) || [
      'undo',
      'cofnij',
      'zurück',
    ],
    check: t?.('commands.check', { returnObjects: true }) || [
      'check',
      'sprawdź',
      'prüfen',
    ],
    skip: t?.('commands.skip', { returnObjects: true }) || [
      'skip',
      'pomiń',
      'überspringen',
    ],
    next: t?.('commands.next', { returnObjects: true }) || [
      'next',
      'dalej',
      'weiter',
    ],
  };
  for (const [command, phrases] of Object.entries(commandPatterns)) {
    const regex = new RegExp(phrases.join('|'), 'i');
    if (regex.test(result)) {
      onCommandMatch?.(command);
      return;
    }
  }

  // Each entry covers the cardinal *and* ordinal form in every supported
  // language — someone picking "option 3" naturally says an ordinal
  // ("trzecia"/"dritte"), not the cardinal ("trzy"/"drei"), which the
  // original pattern didn't recognize at all. Polish/German ordinals are
  // matched by their gender-invariant stem (e.g. "czwart" covers both
  // "czwarty" and "czwarta") rather than one full inflected form, since the
  // masculine and feminine endings differ and neither is a substring of the
  // other.
  const numbers = {
    1: /1|jeden|one|first|eins|pierwsz|erst/i,
    2: /2|dwa|two|second|zwei|drug|zweit/i,
    3: /3|trzy|three|third|drei|trzeci|dritt/i,
    4: /4|cztery|four|fourth|vier|czwart|viert/i,
    5: /5|pięć|five|fifth|fünf|piąt|fünft/i,
  };
  for (const [num, regex] of Object.entries(numbers)) {
    if (regex.test(result)) {
      onNumberMatch?.(parseInt(num));
      return;
    }
  }

  if (onLetterMatch && SINGLE_LETTER_PATTERN.test(result)) {
    onLetterMatch(result);
  }
}
