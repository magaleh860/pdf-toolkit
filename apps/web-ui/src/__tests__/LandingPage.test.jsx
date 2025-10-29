import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage.jsx';

describe('LandingPage', () => {
  it('renders landing page with title', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(getByText('Privacy-First PDF Tools')).toBeTruthy();
  });

  it('displays feature cards', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(getByText('Merge PDFs')).toBeTruthy();
    expect(getByText('Split PDF')).toBeTruthy();
    expect(getByText('Edit PDF')).toBeTruthy();
  });

  it('shows privacy badges', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(getByText('Privacy First')).toBeTruthy();
    expect(getByText('Works Offline')).toBeTruthy();
    expect(getByText('Lightning Fast')).toBeTruthy();
  });

  it('renders links to feature pages', () => {
    const { container } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    const mergeLink = container.querySelector('a[href="/merge"]');
    const splitLink = container.querySelector('a[href="/split"]');
    const editLink = container.querySelector('a[href="/edit"]');
    expect(mergeLink).toBeTruthy();
    expect(splitLink).toBeTruthy();
    expect(editLink).toBeTruthy();
  });
});
