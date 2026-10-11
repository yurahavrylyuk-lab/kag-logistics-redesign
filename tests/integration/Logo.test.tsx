import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from '@/components/ui/Logo';

describe('Logo', () => {
  it('renders light and dark wordmark variants for CSS theme selection', () => {
    const { container } = render(<Logo />);
    expect(container.querySelectorAll('.logo-on-light[alt="KAG Logistics"]')).toHaveLength(1);
    expect(container.querySelectorAll('.logo-on-dark[alt="KAG Logistics"]')).toHaveLength(1);
  });
});
