import { describe, expect, it } from 'vitest';

import {
  BIGGER_TEXT_PRESET,
  DESIGN_TOKEN_SLIDERS,
  LRS_PRESET,
  MORE_SPACING_PRESET,
} from './designTokens.js';

const limits = Object.fromEntries(
  DESIGN_TOKEN_SLIDERS.map(({ key, min, max }) => [key, { min, max }]),
);

describe('design token presets stay within their slider range', () => {
  const presets = {
    BIGGER_TEXT_PRESET,
    MORE_SPACING_PRESET,
    LRS_PRESET,
  };

  for (const [name, preset] of Object.entries(presets)) {
    for (const [key, value] of Object.entries(preset)) {
      it(`${name}.${key} = ${value}`, () => {
        expect(limits[key], `no slider for ${key}`).toBeDefined();
        expect(value).toBeGreaterThanOrEqual(limits[key].min);
        expect(value).toBeLessThanOrEqual(limits[key].max);
      });
    }
  }
});
