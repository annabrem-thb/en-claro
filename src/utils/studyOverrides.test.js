import { describe, expect, it } from 'vitest';

import { applyStudyOverrides } from './studyOverrides.js';

describe('applyStudyOverrides', () => {
  const settings = { adaptiveDifficulty: true, userDifficulty: 2, zenMode: true };

  it('forces adaptive difficulty off while a guided study is active', () => {
    expect(applyStudyOverrides(settings, true)).toEqual({
      ...settings,
      adaptiveDifficulty: false,
    });
  });

  it('does not mutate the participant\'s stored settings', () => {
    applyStudyOverrides(settings, true);
    expect(settings.adaptiveDifficulty).toBe(true);
  });

  it('returns the settings untouched outside the study', () => {
    expect(applyStudyOverrides(settings, false)).toBe(settings);
  });
});
