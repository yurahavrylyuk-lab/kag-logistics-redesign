import { RouterProvider, useMatch } from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';

function CurrentRoute() {
  const match = useMatch({ strict: false });

  return <output aria-label="Current route">{match.pathname}</output>;
}

describe('router contract', () => {
  it('creates a typed route tree that renders the homepage at /', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/');

    expect(await screen.findByRole('main')).toBeInTheDocument();
  });

  it('renders the accessible not-found boundary for an unknown path', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/missing');

    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('initializes direct-component route hooks and follows memory history navigation', async () => {
    const { router } = renderWithRouter(<CurrentRoute />, '/initial');

    expect(await screen.findByText('/initial')).toBeInTheDocument();

    await act(async () => {
      router.history.push('/next');
    });

    expect(await screen.findByText('/next')).toBeInTheDocument();
  });
});
