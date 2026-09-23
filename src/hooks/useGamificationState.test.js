import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useGamificationState } from './useGamificationState.js';

describe('useGamificationState growth gating', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ignores growth updates while the classic (non-gamified) mode is active', () => {
    const { result } = renderHook(() => useGamificationState());
    expect(result.current.isGamified).toBe(false);

    act(() => result.current.setGrowthValue(1));
    act(() => result.current.setGrowthValue(5));

    expect(result.current.growthValue).toBe(0);
    expect(localStorage.getItem('growthValue')).toBe('0');
  });

  it('applies growth updates once gamified mode is on', () => {
    const { result } = renderHook(() => useGamificationState());

    act(() => result.current.setIsGamified(true));
    act(() => result.current.setGrowthValue(1));

    expect(result.current.growthValue).toBe(1);
    expect(localStorage.getItem('growthValue')).toBe('1');
  });

  it('stops accumulating again after switching back to classic mode', () => {
    const { result } = renderHook(() => useGamificationState());

    act(() => result.current.setIsGamified(true));
    act(() => result.current.setGrowthValue(3));
    act(() => result.current.setIsGamified(false));
    act(() => result.current.setGrowthValue(4));

    expect(result.current.growthValue).toBe(3);
  });
});
