import { describe, expect, it } from 'vitest';
import { getRouteMeta, staticRouteManifest } from '@/app/route-manifest';

describe('public route manifest', () => {
  it('enumerates every supported canonical URL exactly once', () => {
    expect(staticRouteManifest.map(route => route.path).sort()).toEqual([
      '/', '/about', '/careers', '/carriers', '/industries', '/industries/chemicals',
      '/industries/energy-renewables', '/industries/food-beverage', '/quote', '/resources',
      '/resources/building-supply-chain-control', '/resources/transportation-management-pattern',
      '/resources/visibility-exceptions', '/solutions', '/solutions/dedicated-transportation',
      '/solutions/freight-brokerage', '/solutions/transportation-management', '/technology',
    ]);
    for (const route of staticRouteManifest) {
      expect(route.metadata.canonicalPath).toBe(route.path);
      expect(route.metadata.title).toMatch(/\| KAG Logistics$/);
      expect(route.metadata.description).not.toBe('');
    }
  });

  it('provides route-specific content metadata for consumers without Next dependencies', () => {
    expect(getRouteMeta('/about')).toMatchObject({
      title: 'About KAG Logistics | KAG Logistics',
      description: 'Managed transportation and logistics expertise across North America.',
      canonicalPath: '/about',
    });
    expect(getRouteMeta('/solutions/freight-brokerage')).toMatchObject({
      title: 'Freight Brokerage | KAG Logistics',
      description: 'Access a managed carrier network through a single accountable logistics relationship.',
      canonicalPath: '/solutions/freight-brokerage',
    });
    expect(getRouteMeta('/solutions/not-real').title).toBe('Page not found | KAG Logistics');
  });
});
