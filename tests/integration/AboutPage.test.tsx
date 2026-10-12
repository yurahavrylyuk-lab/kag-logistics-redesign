import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from '@/app/about/page';

describe('AboutPage', () => {
  it('presents KAG company facts, capabilities, industries, and both conversion actions', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: 'Built to keep complex supply chains moving.' })).toBeInTheDocument();
    expect(screen.getByText(/North Canton, Ohio/i)).toBeInTheDocument();
    expect(screen.getByText('Transportation Management')).toBeInTheDocument();
    expect(screen.getByText('Industrial Gas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get a Quote' })).toHaveAttribute('href', '/quote');
    expect(screen.getByRole('link', { name: /ship now/i })).toHaveAttribute('href', 'https://www.kaglogistics.com/ship-now-2/');
  });
});
