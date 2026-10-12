import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FloatingShipNow } from '@/components/layout/FloatingShipNow';

describe('FloatingShipNow', () => {
  it('renders the configured accessible Ship Now action after its opening sentinel exits', () => {
    render(<><div id="floating-cta-top-sentinel" /><FloatingShipNow /></>);
    expect(screen.getByRole('link', { name: /persistent ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });
});
