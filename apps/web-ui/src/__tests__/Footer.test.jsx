import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from '../components/Footer.jsx';

describe('Footer', () => {
  it('renders footer with privacy information', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('PDF Toolkit')).toBeTruthy();
    expect(getByText(/Your privacy-first PDF solution/i)).toBeTruthy();
  });

  it('displays privacy features', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/All processing happens locally/i)).toBeTruthy();
    expect(getByText(/No data is sent to any server/i)).toBeTruthy();
  });

  it('shows current year in copyright', () => {
    const { getByText } = render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(getByText(new RegExp(currentYear.toString()))).toBeTruthy();
  });
});
