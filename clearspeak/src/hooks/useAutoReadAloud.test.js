import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAutoReadAloud } from './useAutoReadAloud.js';

describe('useAutoReadAloud', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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
});
