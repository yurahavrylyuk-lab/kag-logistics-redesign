import { screen, within } from '@testing-library/react';
import { renderWithRouter } from '../test-router';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

describe('MobileNavigation', () => {
  it('opens, closes with Escape, and restores focus to its trigger', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ThemeProvider><MobileNavigation /></ThemeProvider>);

    const trigger = await screen.findByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('provides a touch-accessible close control and moves focus into the drawer', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ThemeProvider><MobileNavigation /></ThemeProvider>);

    await user.click(await screen.findByRole('button', { name: 'Open navigation' }));
    const close = screen.getByRole('button', { name: 'Close navigation' });

    expect(close).toHaveFocus();
    await user.click(close);
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument();
  });

  it('keeps Resources out of the mobile primary menu and exposes Ship Now', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ThemeProvider><MobileNavigation /></ThemeProvider>);
    await user.click(await screen.findByRole('button', { name: 'Open navigation' }));
    expect(screen.queryByRole('link', { name: 'Resources' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('dialog', { name: 'Navigation menu' })).getByRole('link', { name: /ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });

  it('closes after client navigation and restores focus to its trigger', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(<ThemeProvider><MobileNavigation /></ThemeProvider>);
    const trigger = await screen.findByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(router.state.location.pathname).toBe('/about');
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
