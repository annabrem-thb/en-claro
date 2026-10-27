import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { wordDatabaseEN } from '../data/vocabulary_en.js';

import { useExerciseSession } from './useExerciseSession.js';

// saveLog writes to IndexedDB, which jsdom does not provide.
vi.mock('../utils/indexedDB.js', () => ({
  saveLog: vi.fn(() => Promise.resolve()),
}));

const noop = () => {};

function renderSession(inclusiveOptions) {
  return renderHook(() =>
    useExerciseSession({
      db: wordDatabaseEN,
      activeTab: 'literacy',
      language: 'en',
      userDifficulty: 2,
      setUserDifficulty: noop,
      inclusiveOptions: { activeExercises: {}, ...inclusiveOptions },
      t: (key) => key,
      speak: noop,
      theme: 'Natur',
      growthValue: 0,
      setGrowthValue: noop,
      setErrorTimestamps: noop,
    }),
  );
}

// goNext always clears the feedback, so a still-present success feedback
// means the advance has not happened.
const isStillOnSuccess = (result) =>
  result.current.feedback?.type === 'success';

describe('auto-advance after a correct answer (WCAG 2.2.1)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('autoAdvance=false: does not advance after 1.5 s or 3 s, only on "Next"', () => {
    const { result } = renderSession({ autoAdvance: false });
    act(() => result.current.handleSuccess());
    expect(isStillOnSuccess(result)).toBe(true);

    act(() => vi.advanceTimersByTime(1500));
    expect(isStillOnSuccess(result)).toBe(true);
    act(() => vi.advanceTimersByTime(1500));
    expect(isStillOnSuccess(result)).toBe(true);
    act(() => vi.advanceTimersByTime(60000));
    expect(isStillOnSuccess(result)).toBe(true);

    act(() => result.current.goNext());
    expect(result.current.feedback).toBeNull();
  });

  it('autoAdvance=true (default): advances after 1.5 s', () => {
    const { result } = renderSession({ autoAdvance: true });
    act(() => result.current.handleSuccess());
    act(() => vi.advanceTimersByTime(1499));
    expect(isStillOnSuccess(result)).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.feedback).toBeNull();
  });

  it('setting absent: behaves like autoAdvance=true', () => {
    const { result } = renderSession({});
    act(() => result.current.handleSuccess());
    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.feedback).toBeNull();
  });

  it('autoAdvance=true with extendedTime: advances after 3 s, not 1.5 s', () => {
    const { result } = renderSession({ autoAdvance: true, extendedTime: true });
    act(() => result.current.handleSuccess());
    act(() => vi.advanceTimersByTime(1500));
    expect(isStillOnSuccess(result)).toBe(true);
    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.feedback).toBeNull();
  });
});
