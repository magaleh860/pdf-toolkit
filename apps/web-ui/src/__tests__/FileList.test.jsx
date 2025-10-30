import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FileList } from '../components/FileList.jsx';

describe('FileList', () => {
  it('renders file names', () => {
    const files = [
      new File(['dummy'], 'a.pdf', { type: 'application/pdf' }),
      new File(['dummy'], 'b.pdf', { type: 'application/pdf' })
    ];
    const { getByText } = render(<FileList files={files} onMove={() => {}} onRemove={() => {}} />);
    expect(getByText('a.pdf')).toBeTruthy();
    expect(getByText('b.pdf')).toBeTruthy();
  });

  it('shows empty state when no files', () => {
    const { container } = render(<FileList files={[]} onMove={() => {}} onRemove={() => {}} />);
    expect(container.querySelector('.files')).toBeFalsy();
  });
});
