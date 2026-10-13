import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('HomePage', () => {
  it('renders the shipper conversion path before carrier and careers routes', async () => {
    const { container } = renderWithRouter(<RouterProvider router={getRouter()} />, '/');
    await screen.findByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' });
    const content = container.textContent ?? '';

    expect(content.indexOf('What’s slowing your supply chain down?')).toBeLessThan(content.indexOf('Freight for carriers'));
    expect(content.indexOf('What’s slowing your supply chain down?')).toBeLessThan(content.indexOf('Build the career behind the supply chain.'));
    expect(screen.getAllByRole('link', { name: 'Get a Quote' }).length).toBeGreaterThan(0);
  });

  it('introduces KAG Logistics and links to the full About route', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/');
    await screen.findByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' });
    expect(screen.getByRole('heading', { name: 'About KAG Logistics' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /discover kag logistics/i })).toHaveAttribute('href', '/about');
  });
});
