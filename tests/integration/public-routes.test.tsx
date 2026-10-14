import { RouterProvider } from '@tanstack/react-router';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';

describe('public route compositions', () => {
  it.each([
    ['/', 'Bring complex supply chains under control.'],
    ['/about', 'Built to keep complex supply chains moving.'],
    ['/technology', 'Operational control at human scale'],
    ['/carriers', 'Move with a network that values the work'],
    ['/careers', 'Build what moves industry'],
    ['/quote', 'Request pricing'],
    ['/solutions', 'Solutions'],
    ['/industries', 'Industries'],
    ['/resources', 'Resources'],
    ['/solutions/transportation-management', 'Transportation Management'],
    ['/solutions/freight-brokerage', 'Freight Brokerage'],
    ['/solutions/dedicated-transportation', 'Dedicated Transportation'],
    ['/industries/chemicals', 'Chemicals'],
    ['/industries/energy-renewables', 'Energy & Renewables'],
    ['/industries/food-beverage', 'Food & Beverage'],
    ['/resources/building-supply-chain-control', 'Building a clearer operating picture'],
    ['/resources/transportation-management-pattern', 'A transportation management pattern'],
    ['/resources/visibility-exceptions', 'Visibility beyond a status update'],
  ])('renders %s with its original page content', async (path, heading) => {
    renderWithRouter(<RouterProvider router={getRouter()} />, path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('preserves homepage section choreography and conversion destinations', async () => {
    const { container } = renderWithRouter(<RouterProvider router={getRouter()} />);
    await screen.findByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' });
    expect(container.querySelectorAll('main > [data-choreography]')).toHaveLength(13);
    const main = within(screen.getByRole('main'));
    expect(main.getByRole('heading', { name: 'About KAG Logistics' })).toBeInTheDocument();
    expect(main.getByRole('heading', { name: 'Let’s start with the shipment.' })).toBeInTheDocument();
    expect(main.getAllByRole('link', { name: 'Get a Quote' }).every(link => link.getAttribute('href') === '/quote')).toBe(true);
  });
});
