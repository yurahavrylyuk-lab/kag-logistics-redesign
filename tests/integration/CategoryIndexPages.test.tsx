import { RouterProvider } from '@tanstack/react-router';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';

describe('category index pages', () => {
  it.each([
    ['/solutions', 'Solutions', 'Freight Brokerage', '/solutions/freight-brokerage'],
    ['/industries', 'Industries', 'Chemicals', '/industries/chemicals'],
    ['/resources', 'Resources', 'Building a clearer operating picture', '/resources/building-supply-chain-control'],
  ])('renders %s with working content destinations', async (path, title, entry, destination) => {
    renderWithRouter(<RouterProvider router={getRouter()} />, path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    const main = within(screen.getByRole('main'));
    expect(main.getByRole('link', { name: new RegExp(entry) })).toHaveAttribute('href', destination);
    expect(main.getAllByRole('link')).toHaveLength(3);
  });
});
