import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AboutPage', () => {
  it('presents KAG company facts, capabilities, industries, and both conversion actions', async () => {
    renderWithRouter(<RouterProvider router={getRouter()} />, '/about');
    await screen.findByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' });
    expect(screen.getByRole('heading', { name: 'Built to keep complex supply chains moving.' })).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByText(/North Canton, Ohio/i)).toBeInTheDocument();
    expect(screen.getByText('Transportation Management')).toBeInTheDocument();
    expect(screen.getByText('Industrial Gas')).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Get a Quote' })).toHaveAttribute('href', '/quote');
    expect(within(screen.getByRole('main')).getByRole('link', { name: /ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });

  it('keeps its composition boundaries visible to progressive choreography without changing semantics', async () => {
    const { container } = renderWithRouter(<RouterProvider router={getRouter()} />, '/about');
    await screen.findByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' });
    expect(container.querySelectorAll('main > section[data-choreography]')).toHaveLength(4);
  });
});
