import { RouterProvider } from '@tanstack/react-router';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';

describe('router contract', () => {
  it('creates a typed route tree that renders the homepage at /', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/');

    expect(await screen.findByRole('main')).toBeInTheDocument();
  });

  it('renders the accessible not-found boundary for an unknown path', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/missing');

    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
