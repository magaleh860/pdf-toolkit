import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme, ThemeProvider } from '../hooks/useTheme.jsx';

describe('useTheme', () => {
  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider
    });
    const initialTheme = result.current.theme;
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).not.toBe(initialTheme);
  });
});
