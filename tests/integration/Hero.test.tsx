import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test-router';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/components/sections/Hero';

describe('Hero', () => {
  it('renders the logistics scene with a terminal, warehouse, route nodes, and static fallback', async () => {
    const { container } = renderWithRouter(<Hero />);
    await screen.findByLabelText('Logistics network from origin to destination');

    expect(screen.getByLabelText('Logistics network from origin to destination')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Warehouse')).toBeInTheDocument();
    expect(container.querySelectorAll('.route-node')).toHaveLength(3);
  });
});
