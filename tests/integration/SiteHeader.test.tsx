import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

describe('SiteHeader', () => {
  it('does not emit a hash link for an unavailable customer login destination', () => {
    render(<ThemeProvider><SiteHeader /></ThemeProvider>);

    expect(screen.queryByRole('link', { name: 'Customer Login' })).not.toBeInTheDocument();
    expect(screen.getByText('Customer Login is not configured for this prototype.')).toBeInTheDocument();
  });

  it('uses the approved primary navigation and configured Ship Now CTA', () => {
    render(<ThemeProvider><SiteHeader /></ThemeProvider>);
    expect(screen.getByRole('navigation', { name: 'Primary navigation' }).textContent).toContain('About');
    expect(screen.getByRole('navigation', { name: 'Primary navigation' }).textContent).not.toContain('Resources');
    expect(screen.getByRole('link', { name: /ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });
});
