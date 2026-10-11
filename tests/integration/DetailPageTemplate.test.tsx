import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DetailPageTemplate } from '@/components/sections/DetailPageTemplate';
import { getRouteContent } from '@/lib/route-content';
import { generateStaticParams } from '@/app/solutions/[slug]/page';

describe('DetailPageTemplate', () => {
  it('renders approved prototype content', () => {
    const content = getRouteContent('solutions', 'freight-brokerage');
    if (!content) throw new Error('Expected approved fixture content.');
    render(<DetailPageTemplate content={content} section="solutions" />);
    expect(screen.getByRole('heading', { name: 'Freight Brokerage' })).toBeInTheDocument();
  });

  it('does not expose an unapproved detail slug as a static route', () => {
    expect(generateStaticParams()).not.toContainEqual({ slug: 'unapproved-route' });
  });
});
