import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('focused KAG hub routes', () => {
  it('renders a Technology hub with an illustrative-data disclosure', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/technology');
    await screen.findByRole('heading', { level: 1, name: 'Operational control at human scale' });
    expect(screen.getByRole('heading', { name: /operational control/i })).toBeInTheDocument();
    expect(screen.getByText(/illustrative data.*not connected to live KAG systems/i)).toBeInTheDocument();
  });

  it('exposes accessible Carriers and Careers primary routes', async () => {
    const { unmount } = renderWithRouter(<RouterProvider router={getRouter()} />, '/carriers');
    await screen.findByRole('heading', { level: 1, name: 'Move with a network that values the work' });
    expect(screen.getByRole('heading', { name: /move with a network/i })).toBeInTheDocument();
    expect(screen.getByText(/carrier registration is not configured/i)).toBeInTheDocument();
    unmount();
    renderWithRouter(<RouterProvider router={getRouter()} />, '/careers');
    await screen.findByRole('heading', { level: 1, name: 'Build what moves industry' });
    expect(screen.getByRole('heading', { name: /build what moves industry/i })).toBeInTheDocument();
    expect(screen.getByText(/job-search destination is not configured/i)).toBeInTheDocument();
  });

  it('frames focused carrier and career journeys around benefits, growth, training, and work life', async () => {
    const { unmount } = renderWithRouter(<RouterProvider router={getRouter()} />, '/carriers');
    await screen.findByRole('heading', { level: 1, name: 'Move with a network that values the work' });
    expect(screen.getByRole('heading', { name: /clarity at every handoff/i })).toBeInTheDocument();
    unmount();
    renderWithRouter(<RouterProvider router={getRouter()} />, '/careers');
    await screen.findByRole('heading', { level: 1, name: 'Build what moves industry' });
    expect(screen.getByRole('heading', { name: 'Career Growth' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Training & learning' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Life at KAG' })).toBeInTheDocument();
  });
});
