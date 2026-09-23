import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAchievements } from './useAchievements.js';

const STORAGE_KEY = 'cfg_achievements';

beforeEach(() => {
  localStorage.clear();
});

describe('useAchievements', () => {
  it('unlocks nothing while disabled, even if every condition is met', () => {
    const { result } = renderHook(() =>
      useAchievements({
        enabled: false,
        growthValue: 5,
        consecutiveCorrect: 5,
        gardenVisited: true,
      }),
    );

    expect(result.current.unlocked).toEqual([]);
    expect(result.current.justUnlocked).toBeNull();
  });

  it('unlocks "firstCorrect" the moment growthValue reaches 1 while enabled', () => {
    const { result, rerender } = renderHook(
      ({ growthValue }) =>
        useAchievements({
          enabled: true,
          growthValue,
          consecutiveCorrect: 0,
          gardenVisited: false,
        }),
      { initialProps: { growthValue: 0 } },
    );

    expect(result.current.unlocked).toEqual([]);

    rerender({ growthValue: 1 });

    expect(result.current.unlocked).toEqual(['firstCorrect']);
    expect(result.current.justUnlocked).toBe('firstCorrect');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([
      'firstCorrect',
    ]);
  });

  it('unlocks "combo3" once consecutiveCorrect reaches 3', () => {
    const { result, rerender } = renderHook(
      ({ consecutiveCorrect }) =>
        useAchievements({
          enabled: true,
          growthValue: 3,
          consecutiveCorrect,
          gardenVisited: false,
        }),
      { initialProps: { consecutiveCorrect: 2 } },
    );

    // growthValue already >= 1 here too, so "firstCorrect" unlocks on the
    // very first render (see the "already-qualifying on mount" test below);
    // this test only asserts on combo3 specifically.
    expect(result.current.unlocked).not.toContain('combo3');

    rerender({ consecutiveCorrect: 3 });

    expect(result.current.unlocked).toContain('combo3');
    expect(result.current.justUnlocked).toBe('combo3');
  });

  it('unlocks "gardenVisit" once gardenVisited becomes true', () => {
    const { result, rerender } = renderHook(
      ({ gardenVisited }) =>
        useAchievements({
          enabled: true,
          growthValue: 0,
          consecutiveCorrect: 0,
          gardenVisited,
        }),
      { initialProps: { gardenVisited: false } },
    );

    expect(result.current.unlocked).toEqual([]);

    rerender({ gardenVisited: true });

    expect(result.current.unlocked).toEqual(['gardenVisit']);
    expect(result.current.justUnlocked).toBe('gardenVisit');
  });

  // Regression guard: a returning user can load the app with growthValue
  // and isGamified already persisted from before this feature ever
  // existed — that first qualifying render must still count as "just
  // unlocked" for them, not silently skip it because nothing "changed"
  // within this hook's own lifetime.
  it('unlocks achievements that are already met on the very first render', () => {
    const { result } = renderHook(() =>
      useAchievements({
        enabled: true,
        growthValue: 12,
        consecutiveCorrect: 4,
        gardenVisited: true,
      }),
    );

    expect(result.current.unlocked.sort()).toEqual(
      ['combo3', 'firstCorrect', 'gardenVisit'].sort(),
    );
  });

  it('never re-unlocks (or re-toasts) an achievement already persisted from a previous session', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['firstCorrect']));

    const { result } = renderHook(() =>
      useAchievements({
        enabled: true,
        growthValue: 1,
        consecutiveCorrect: 0,
        gardenVisited: false,
      }),
    );

    expect(result.current.unlocked).toEqual(['firstCorrect']);
    expect(result.current.justUnlocked).toBeNull();
  });

  it('auto-clears justUnlocked after the toast duration', () => {
    vi.useFakeTimers();
    try {
      const { result, rerender } = renderHook(
        ({ growthValue }) =>
          useAchievements({
            enabled: true,
            growthValue,
            consecutiveCorrect: 0,
            gardenVisited: false,
          }),
        { initialProps: { growthValue: 0 } },
      );

      rerender({ growthValue: 1 });
      expect(result.current.justUnlocked).toBe('firstCorrect');

      act(() => vi.advanceTimersByTime(6000));

      expect(result.current.justUnlocked).toBeNull();
      // The badge itself stays earned — only the transient toast clears.
      expect(result.current.unlocked).toEqual(['firstCorrect']);
    } finally {
      vi.useRealTimers();
    }
  });
});
