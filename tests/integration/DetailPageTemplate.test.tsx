import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test-router';
import { describe, expect, it } from 'vitest';
import { DetailPageTemplate } from '@/components/sections/DetailPageTemplate';
import { getRouteContent } from '@/lib/route-content';

describe('DetailPageTemplate', () => {
  it('renders approved prototype content with a pricing destination', async () => {
    const content = getRouteContent('solutions', 'freight-brokerage');
    if (!content) throw new Error('Expected approved fixture content.');
    renderWithRouter(<DetailPageTemplate content={content} section="solutions" />);
    expect(await screen.findByRole('heading', { name: 'Freight Brokerage' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request pricing' })).toHaveAttribute('href', '/quote');
  });

  it('does not return content for an unapproved detail slug', () => {
    expect(getRouteContent('solutions', 'unapproved-route')).toBeUndefined();
  });
});
