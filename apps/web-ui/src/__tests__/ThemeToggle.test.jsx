import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import * as useThemeModule from '../hooks/useTheme.jsx';

describe('ThemeToggle', () => {
  it('renders and calls toggleTheme', () => {
    const toggleTheme = vi.fn();
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({ theme: 'light', toggleTheme });
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(toggleTheme).toHaveBeenCalled();
  });
});
