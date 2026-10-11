import { describe, expect, it } from 'vitest';
import { createPageMetadata } from '@/lib/metadata';

describe('metadata factory', () => {
  it('builds canonical metadata only when a production origin is configured', () => {
    expect(createPageMetadata({ title: 'Technology', description: 'Operational clarity.', path: '/technology' }).alternates).toBeUndefined();
    expect(createPageMetadata({ title: 'Technology', description: 'Operational clarity.', path: '/technology' }, 'https://example.com').alternates).toEqual({ canonical: 'https://example.com/technology' });
  });
});
