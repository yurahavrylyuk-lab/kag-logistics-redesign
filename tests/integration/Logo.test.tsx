import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from '@/components/ui/Logo';

describe('Logo', () => {
  it('uses the requested dark-background variant', () => {
    render(<Logo variant="dark" />);

    expect(screen.getByRole('img', { name: 'KAG Logistics' })).toHaveAttribute('src', '/logos/kag-dark.svg');
  });
});
