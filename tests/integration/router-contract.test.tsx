import { RouterProvider, useMatch } from '@tanstack/react-router';
import { act, screen, within } from '@testing-library/react';
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

  it('wraps the outlet with the accessible global KAG shell', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/');
    const header = await screen.findByRole('banner');
    const main = screen.getByRole('main');
    const footer = screen.getByRole('contentinfo');
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip).toHaveAttribute('href', '#main-content');
    expect(document.getElementById('main-content')).toBe(main);
    expect(header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(screen.getByRole('navigation', { name: 'Footer navigation' })).getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
    expect(document.getElementById('floating-cta-top-sentinel')).toHaveAttribute('aria-hidden', 'true');
    expect(footer).toHaveAttribute('data-floating-cta-suppress');
  });

  it('renders the accessible not-found boundary for an unknown path', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/missing');

    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
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
