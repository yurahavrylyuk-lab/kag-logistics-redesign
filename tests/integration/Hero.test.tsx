import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test-router';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/components/sections/Hero';

describe('Hero', () => {
  it('renders the dispatch board beside the quote action', async () => {
    renderWithRouter(<Hero />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Dispatch board' })).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('North American Coverage')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get a Quote' })).toHaveAttribute('href', '/quote');
    expect(screen.getByRole('link', { name: 'Explore Solutions' })).toHaveAttribute('href', '/solutions');
  });
});
