import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as audioUnlock from '../utils/audioUnlock.js';

import { useAutoReadAloud } from './useAutoReadAloud.js';

describe('useAutoReadAloud', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Most of these tests are about the *pacing* (delay/re-fire/cleanup)
    // logic, not the audio-unlock gate — default to "already unlocked" (as
    // if the user already tapped something earlier in the session) so they
    // exercise that logic the same way they did before that gate existed.
    // The gate itself has its own tests below with this mocked back to
    // "not yet unlocked".
    vi.spyOn(audioUnlock, 'isAudioUnlocked').mockReturnValue(true);
    vi.spyOn(audioUnlock, 'onAudioUnlocked').mockImplementation((cb) => {
      cb();
      return () => {};
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not call readAloud when disabled', () => {
    const readAloud = vi.fn();
    renderHook(() => useAutoReadAloud(false, readAloud));

    act(() => vi.advanceTimersByTime(2000));

    expect(readAloud).not.toHaveBeenCalled();
  });

  it('calls readAloud once after the delay when enabled from the start', () => {
    const readAloud = vi.fn();
    renderHook(() => useAutoReadAloud(true, readAloud));

    act(() => vi.advanceTimersByTime(499));
    expect(readAloud).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(readAloud).toHaveBeenCalledTimes(1);
  });

  it('fires immediately-on-delay when enabled flips on mid-question (activation), not just on mount', () => {
    const readAloud = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) => useAutoReadAloud(enabled, readAloud),
      { initialProps: { enabled: false } },
    );

    act(() => vi.advanceTimersByTime(2000));
    expect(readAloud).not.toHaveBeenCalled();

    rerender({ enabled: true });
    act(() => vi.advanceTimersByTime(500));

    expect(readAloud).toHaveBeenCalledTimes(1);
  });

  it('does not re-fire on unrelated re-renders while enabled stays true', () => {
    const readAloud = vi.fn();
    const { rerender } = renderHook(
      ({ n }) => useAutoReadAloud(true, readAloud, n),
      { initialProps: { n: 1 } },
    );

    act(() => vi.advanceTimersByTime(500));
    expect(readAloud).toHaveBeenCalledTimes(1);

    rerender({ n: 2 });
    rerender({ n: 3 });
    act(() => vi.advanceTimersByTime(2000));

    expect(readAloud).toHaveBeenCalledTimes(1);
  });

  it('always calls the latest readAloud function, not a stale one captured at mount', () => {
    const firstReadAloud = vi.fn();
    const secondReadAloud = vi.fn();
    const { rerender } = renderHook(({ fn }) => useAutoReadAloud(true, fn), {
      initialProps: { fn: firstReadAloud },
    });

    rerender({ fn: secondReadAloud });
    act(() => vi.advanceTimersByTime(500));

    expect(firstReadAloud).not.toHaveBeenCalled();
    expect(secondReadAloud).toHaveBeenCalledTimes(1);
  });

  it('cancels the pending read if unmounted before the delay elapses', () => {
    const readAloud = vi.fn();
    const { unmount } = renderHook(() => useAutoReadAloud(true, readAloud));

    unmount();
    act(() => vi.advanceTimersByTime(2000));

    expect(readAloud).not.toHaveBeenCalled();
  });

  describe('when audio has not been unlocked by a user gesture yet', () => {
    beforeEach(() => {
      audioUnlock.isAudioUnlocked.mockReturnValue(false);
      audioUnlock.onAudioUnlocked.mockImplementation(() => () => {});
    });

    it('does not call readAloud once the delay elapses, since it would be silently dropped', () => {
      const readAloud = vi.fn();
      renderHook(() => useAutoReadAloud(true, readAloud));

      act(() => vi.advanceTimersByTime(500));

      expect(readAloud).not.toHaveBeenCalled();
      expect(audioUnlock.onAudioUnlocked).toHaveBeenCalledTimes(1);
    });

    it('calls readAloud as soon as the gesture unlocks audio, with no further delay', () => {
      const readAloud = vi.fn();
      let deliverUnlock;
      audioUnlock.onAudioUnlocked.mockImplementation((cb) => {
        deliverUnlock = cb;
        return () => {};
      });

      renderHook(() => useAutoReadAloud(true, readAloud));
      act(() => vi.advanceTimersByTime(500));
      expect(readAloud).not.toHaveBeenCalled();

      act(() => deliverUnlock());
      expect(readAloud).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes from the unlock wait if unmounted before the gesture happens', () => {
      const readAloud = vi.fn();
      const unsubscribe = vi.fn();
      audioUnlock.onAudioUnlocked.mockReturnValue(unsubscribe);

      const { unmount } = renderHook(() => useAutoReadAloud(true, readAloud));
      act(() => vi.advanceTimersByTime(500));

      unmount();

      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
