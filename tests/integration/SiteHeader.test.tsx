import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../test-router';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

describe('SiteHeader', () => {
  it('does not emit a hash link for an unavailable customer login destination', async () => {
    renderWithRouter(<ThemeProvider><SiteHeader /></ThemeProvider>);
    await screen.findByRole('navigation', { name: 'Primary navigation' });

    expect(screen.queryByRole('link', { name: 'Customer Login' })).not.toBeInTheDocument();
    expect(screen.getByText('Customer Login is not configured for this prototype.')).toBeInTheDocument();
  });

  it('uses the approved primary navigation and configured Ship Now CTA', async () => {
    renderWithRouter(<ThemeProvider><SiteHeader /></ThemeProvider>);
    await screen.findByRole('navigation', { name: 'Primary navigation' });
    expect(screen.getByRole('navigation', { name: 'Primary navigation' }).textContent).toContain('About');
    expect(screen.getByRole('navigation', { name: 'Primary navigation' }).textContent).not.toContain('Resources');
    const shipNow = within(document.querySelector('.header-actions')!).getByRole('link', { name: /ship now/i });
    expect(shipNow).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
    expect(shipNow).toHaveClass('ship-now');
  });

  it('navigates primary in-site destinations through the client router', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(<ThemeProvider><SiteHeader /></ThemeProvider>);
    const navigation = await screen.findByRole('navigation', { name: 'Primary navigation' });
    for (const [name, href] of [['Solutions', '/solutions'], ['Industries', '/industries'], ['Technology', '/technology'], ['About', '/about'], ['Carriers', '/carriers'], ['Careers', '/careers']]) {
      const link = within(navigation).getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      await user.click(link);
      expect(router.state.location.pathname).toBe(href);
    }
  });
});
