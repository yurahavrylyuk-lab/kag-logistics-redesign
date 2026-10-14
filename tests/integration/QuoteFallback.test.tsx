import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuoteFallback } from '@/features/quote/QuoteFallback';
import { renderToStaticMarkup } from 'react-dom/server';
import { QuoteExperience } from '@/features/quote/QuoteExperience';

describe('QuoteFallback', () => {
  it('renders a usable quote contact fallback in the no-script section', () => {
    render(<QuoteFallback />);
    expect(screen.getByRole('link', { name: '800.536.3638' })).toHaveAttribute('href', 'tel:+18005363638');
  });

  it('includes the phone fallback in quote experience markup before effects run', () => {
    const markup = renderToStaticMarkup(<QuoteExperience />);
    const document = new DOMParser().parseFromString(markup, 'text/html');
    expect(document.querySelector('.quote-fallback a')?.getAttribute('href')).toBe('tel:+18005363638');
    expect(document.querySelector('.quote-fallback')?.textContent).toContain('800.536.3638');
  });
});
