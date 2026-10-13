import { describe, expect, it } from 'vitest';
import { createPageMetadata, normalizeSiteOrigin } from '@/lib/metadata';
import { getRouteMeta } from '@/app/route-manifest';

describe('metadata factory', () => {
  it('builds canonical metadata only when a production origin is configured', () => {
    expect(createPageMetadata({ title: 'Technology', description: 'Operational clarity.', path: '/technology' }).alternates).toBeUndefined();
    expect(createPageMetadata({ title: 'Technology', description: 'Operational clarity.', path: '/technology' }, 'https://example.com').alternates).toEqual({ canonical: 'https://example.com/technology' });
  });

  it('creates route-specific metadata for a representative detail page', () => {
    const metadata = getRouteMeta('/solutions/freight-brokerage');
    expect(metadata.title).toBe('Freight Brokerage | KAG Logistics');
  });

  it('keeps the canonical metadata when a static directory URL has a trailing slash', () => {
    const metadata = getRouteMeta('/about/');
    expect(metadata.title).toBe('About KAG Logistics | KAG Logistics');
    expect(metadata.canonicalPath).toBe('/about');
  });

  it('normalizes deployment paths to a canonical HTTP(S) origin', () => {
    expect(normalizeSiteOrigin(' https://logistics.example/deployment/?ignored=yes#fragment ')).toBe('https://logistics.example');
    expect(normalizeSiteOrigin('')).toBeUndefined();
    expect(normalizeSiteOrigin('   ')).toBeUndefined();
    expect(() => normalizeSiteOrigin('ftp://logistics.example')).toThrow();
    expect(() => normalizeSiteOrigin('https://user:secret@logistics.example')).toThrow();
  });
});
