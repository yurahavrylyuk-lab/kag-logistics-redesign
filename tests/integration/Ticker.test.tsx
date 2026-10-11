import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Ticker } from '@/components/sections/Ticker';

describe('Ticker', () => {
  it('keeps ticker content available when animation is disabled', () => {
    render(<Ticker items={['North American Coverage', '24/7 Operations']} />);

    expect(screen.getAllByText('North American Coverage')[0]).toBeVisible();
    expect(screen.getAllByText('24/7 Operations')[0]).toBeVisible();
  });

  it('duplicates the visual sequence outside the accessibility tree for seamless motion', () => {
    render(<Ticker items={['North American Coverage', '24/7 Operations']} />);
    expect(screen.getAllByText('North American Coverage')).toHaveLength(2);
    expect(document.querySelector('[aria-hidden="true"].ticker-sequence')).toBeInTheDocument();
  });
});
