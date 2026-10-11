import { describe, expect, it } from 'vitest';
import { getRouteContent } from '@/lib/route-content';

describe('getRouteContent', () => {
  it('returns the approved freight-brokerage prototype content', () => {
    expect(getRouteContent('solutions', 'freight-brokerage')?.title).toBeTruthy();
  });

  it('returns undefined for a route that is not approved for the prototype', () => {
    expect(getRouteContent('industries', 'unverified-industry')).toBeUndefined();
  });
});
