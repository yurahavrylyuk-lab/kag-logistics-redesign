import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

describe('MobileNavigation', () => {
  it('opens, closes with Escape, and restores focus to its trigger', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><MobileNavigation /></ThemeProvider>);

    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('provides a touch-accessible close control and moves focus into the drawer', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><MobileNavigation /></ThemeProvider>);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    const close = screen.getByRole('button', { name: 'Close navigation' });

    expect(close).toHaveFocus();
    await user.click(close);
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument();
  });
});
