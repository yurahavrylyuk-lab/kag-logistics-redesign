import { RouterProvider } from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRouter } from '@/app/router';
import { renderWithRouter } from '../test-router';

describe('content route boundaries', () => {
  it.each([
    '/solutions/not-a-real-solution',
    '/industries/not-a-real-industry',
    '/resources/not-a-real-resource',
    '/solutions/chemicals',
    '/industries/freight-brokerage',
    '/resources/freight-brokerage',
    '/solutions/freight-brokerage/extra',
    '/missing',
  ])('renders an accessible not-found boundary for %s', async path => {
    renderWithRouter(<RouterProvider router={getRouter()} />, path);
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.queryByRole('heading', { name: 'Freight Brokerage' })).not.toBeInTheDocument();
  });

  it('revalidates slugs and recovers content after client-side navigation', async () => {
    const { router } = renderWithRouter(<RouterProvider router={getRouter()} />, '/solutions/freight-brokerage');
    expect(await screen.findByRole('heading', { level: 1, name: 'Freight Brokerage' })).toBeInTheDocument();
    await act(async () => { router.history.push('/solutions/not-a-real-solution'); });
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    await act(async () => { router.history.push('/industries/chemicals'); });
    expect(await screen.findByRole('heading', { level: 1, name: 'Chemicals' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Page not found' })).not.toBeInTheDocument();
  });
});
