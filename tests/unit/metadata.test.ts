import { describe, expect, it } from 'vitest';
import { createPageMetadata } from '@/lib/metadata';
import { generateMetadata as generateSolutionMetadata } from '@/app/solutions/[slug]/page';

describe('metadata factory', () => {
  it('builds canonical metadata only when a production origin is configured', () => {
    expect(createPageMetadata({ title: 'Technology', description: 'Operational clarity.', path: '/technology' }).alternates).toBeUndefined();
    expect(createPageMetadata({ title: 'Technology', description: 'Operational clarity.', path: '/technology' }, 'https://example.com').alternates).toEqual({ canonical: 'https://example.com/technology' });
  });

  it('creates route-specific metadata for a representative detail page', async () => {
    const metadata = await generateSolutionMetadata({ params: Promise.resolve({ slug: 'freight-brokerage' }) });
    expect(metadata.title).toBe('Freight Brokerage | KAG Logistics');
  });
});
