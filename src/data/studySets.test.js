import { describe, expect, it } from 'vitest';

import { belongsToActiveSet } from './studySets.js';

describe('belongsToActiveSet', () => {
  it('includes everything when no set is active', () => {
    expect(belongsToActiveSet({ id: 1 }, null)).toBe(true);
    expect(belongsToActiveSet({ id: 1, set: 'A' }, null)).toBe(true);
  });

  it('includes unassigned tasks regardless of the active set', () => {
    expect(belongsToActiveSet({ id: 1 }, 'A')).toBe(true);
    expect(belongsToActiveSet({ id: 1 }, 'B')).toBe(true);
  });

  it('includes a task only when its set matches the active set', () => {
    expect(belongsToActiveSet({ id: 1, set: 'A' }, 'A')).toBe(true);
    expect(belongsToActiveSet({ id: 1, set: 'A' }, 'B')).toBe(false);
    expect(belongsToActiveSet({ id: 1, set: 'B' }, 'A')).toBe(false);
  });
});
