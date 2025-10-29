import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { FileDropZone } from '../components/FileDropZone.jsx';

describe('FileDropZone', () => {
  it('renders drop zone', () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDropZone onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
  });

  it('calls onFiles when files are selected', () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDropZone onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]');
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });
});
