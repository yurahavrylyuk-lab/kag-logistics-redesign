import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the shipper conversion path before carrier and careers routes', () => {
    const { container } = render(<HomePage />);
    const content = container.textContent ?? '';

    expect(content.indexOf('What’s slowing your supply chain down?')).toBeLessThan(content.indexOf('Freight for carriers'));
    expect(content.indexOf('What’s slowing your supply chain down?')).toBeLessThan(content.indexOf('Build the career behind the supply chain.'));
    expect(screen.getAllByRole('link', { name: 'Get a Quote' }).length).toBeGreaterThan(0);
  });

  it('introduces KAG Logistics and links to the full About route', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'About KAG Logistics' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /discover kag logistics/i })).toHaveAttribute('href', '/about');
  });
});
