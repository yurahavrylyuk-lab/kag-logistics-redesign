import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuoteFallback } from '@/features/quote/QuoteFallback';

describe('QuoteFallback', () => {
  it('renders a usable quote contact fallback in the no-script section', () => {
    render(<QuoteFallback />);
    expect(screen.getByRole('link', { name: '800.536.3638' })).toHaveAttribute('href', 'tel:+18005363638');
  });
});
