import { describe, expect, it, vi } from 'vitest';

import {
  matchVoiceTranscript,
  normalizeTranscript,
} from './voiceTranscriptMatcher.js';

describe('normalizeTranscript', () => {
  it('lowercases, trims, and strips leading/trailing punctuation', () => {
    expect(normalizeTranscript('  Sprawdź. ')).toBe('sprawdź');
    expect(normalizeTranscript('Check!')).toBe('check');
  });
});

describe('matchVoiceTranscript', () => {
  function matchNumber(transcript, language = 'pl') {
    const onNumberMatch = vi.fn();
    const t = (key) =>
      ({
        pl: { 'commands.undo': ['cofnij'] },
      })[language]?.[key];
    matchVoiceTranscript(normalizeTranscript(transcript), t, {
      onNumberMatch,
    });
    return onNumberMatch.mock.calls[0]?.[0];
  }

  // The reported bug this guards against: saying "opcja trzecia" (option
  // three, the natural way to say it) matched nothing, because the pattern
  // for 3 only covered the cardinal "trzy", not the ordinal "trzecia" a
  // person actually says when picking "the third option".
  it('matches "opcja trzecia" to option 3', () => {
    expect(matchNumber('opcja trzecia')).toBe(3);
  });

  it.each([
    ['pierwsza', 1],
    ['druga', 2],
    ['trzecia', 3],
    ['czwarta', 4],
    ['piąta', 5],
  ])('matches Polish ordinal "%s" to option %i', (word, expected) => {
    expect(matchNumber(word, 'pl')).toBe(expected);
  });

  it.each([
    ['erste', 1],
    ['zweite', 2],
    ['dritte', 3],
    ['vierte', 4],
    ['fünfte', 5],
  ])('matches German ordinal "%s" to option %i', (word, expected) => {
    expect(matchNumber(word, 'de')).toBe(expected);
  });

  it('still matches the Polish cardinal form ("trzy")', () => {
    expect(matchNumber('trzy')).toBe(3);
  });

  it('calls onWordMatch unconditionally, independent of command/number routing', () => {
    const onWordMatch = vi.fn();
    matchVoiceTranscript('trzecia', null, { onWordMatch });
    expect(onWordMatch).toHaveBeenCalledWith('trzecia');
  });

  it('matches a command and does not also fire onNumberMatch', () => {
    const onCommandMatch = vi.fn();
    const onNumberMatch = vi.fn();
    matchVoiceTranscript('pomiń', null, { onCommandMatch, onNumberMatch });
    expect(onCommandMatch).toHaveBeenCalledWith('skip');
    expect(onNumberMatch).not.toHaveBeenCalled();
  });

  it('matches a single letter via onLetterMatch when nothing else matches', () => {
    const onLetterMatch = vi.fn();
    matchVoiceTranscript('ą', null, { onLetterMatch });
    expect(onLetterMatch).toHaveBeenCalledWith('ą');
  });
});
