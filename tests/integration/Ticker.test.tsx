import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ticker } from '@/components/sections/Ticker';

describe('Ticker', () => {
  it('keeps ticker content available when animation is disabled', () => {
    render(<Ticker items={['North American Coverage', '24/7 Operations']} />);

    expect(screen.getByText('North American Coverage')).toBeVisible();
    expect(screen.getByText('24/7 Operations')).toBeVisible();
  });
});
