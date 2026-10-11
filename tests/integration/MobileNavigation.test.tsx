import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileNavigation } from '@/components/layout/MobileNavigation';

describe('MobileNavigation', () => {
  it('opens, closes with Escape, and restores focus to its trigger', async () => {
    const user = userEvent.setup();
    render(<MobileNavigation />);

    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
