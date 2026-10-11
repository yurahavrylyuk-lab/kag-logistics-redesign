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
});
