import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CommandCenterDemo } from '@/components/sections/CommandCenterDemo';

describe('CommandCenterDemo', () => {
  it('labels simulated data as illustrative and exposes shipment state text', () => {
    render(<CommandCenterDemo />);

    expect(screen.getByText('Illustrative shipment visibility view')).toBeInTheDocument();
    expect(screen.getByText('In transit')).toBeInTheDocument();
    expect(screen.getByText('Attention needed')).toBeInTheDocument();
  });
});
