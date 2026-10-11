import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/components/sections/Hero';

describe('Hero', () => {
  it('renders the logistics scene with a terminal, warehouse, route nodes, and static fallback', () => {
    const { container } = render(<Hero />);

    expect(screen.getByLabelText('Logistics network from origin to destination')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Warehouse')).toBeInTheDocument();
    expect(container.querySelectorAll('.route-node')).toHaveLength(3);
  });
});
