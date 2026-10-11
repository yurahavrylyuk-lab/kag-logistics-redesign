import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CommandCenterDemo } from '@/components/sections/CommandCenterDemo';

describe('CommandCenterDemo', () => {
  it('labels simulated data as illustrative and exposes shipment state text', () => {
    render(<CommandCenterDemo />);

    expect(screen.getByText('Illustrative shipment visibility view')).toBeInTheDocument();
    expect(screen.getAllByText('In transit').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Attention needed').length).toBeGreaterThan(0);
  });

  it('includes an accessible operational legend, KPI rail, transfer point, and every specified shipment state', () => {
    render(<CommandCenterDemo />);

    expect(screen.getByText('Transfer point')).toBeInTheDocument();
    expect(screen.getAllByText('Delivered').length).toBeGreaterThan(0);
    expect(screen.getByRole('list', { name: 'Shipment status legend' })).toHaveTextContent('Attention needed');
    expect(screen.getByRole('complementary', { name: 'Operational summary' })).toHaveTextContent('On-time focus');
  });
});
