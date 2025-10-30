import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { PageThumbnails } from '../components/PageThumbnails.jsx';

describe('PageThumbnails', () => {
  it('renders page thumbnails', () => {
    const pages = ['data:image/png;base64,abc', 'data:image/png;base64,def'];
    const selectedPages = [0];
    const onTogglePage = vi.fn();
    const { getByText } = render(
      <PageThumbnails 
        pages={pages} 
        selectedPages={selectedPages} 
        onTogglePage={onTogglePage} 
        busy={false} 
      />
    );
    expect(getByText('Page 1')).toBeTruthy();
    expect(getByText('Page 2')).toBeTruthy();
  });

  it('calls onTogglePage when checkbox is clicked', () => {
    const pages = ['data:image/png;base64,abc'];
    const selectedPages = [];
    const onTogglePage = vi.fn();
    const { container } = render(
      <PageThumbnails 
        pages={pages} 
        selectedPages={selectedPages} 
        onTogglePage={onTogglePage} 
        busy={false} 
      />
    );
    const checkbox = container.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);
    expect(onTogglePage).toHaveBeenCalledWith(0);
  });

  it('disables checkboxes when busy', () => {
    const pages = ['data:image/png;base64,abc'];
    const selectedPages = [];
    const onTogglePage = vi.fn();
    const { container } = render(
      <PageThumbnails 
        pages={pages} 
        selectedPages={selectedPages} 
        onTogglePage={onTogglePage} 
        busy={true} 
      />
    );
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox.disabled).toBe(true);
  });
});
