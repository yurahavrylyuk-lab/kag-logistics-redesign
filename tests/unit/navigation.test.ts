import { describe, expect, it } from 'vitest';
import { externalDestinations } from '@/content/destinations';
import { footerNavigation, primaryNavigation } from '@/content/navigation';

describe('KAG navigation configuration', () => {
  it('prioritizes the six approved primary routes while retaining Resources in the footer', () => {
    expect(primaryNavigation.map(({ label }) => label)).toEqual(['Solutions', 'Industries', 'Technology', 'About', 'Carriers', 'Careers']);
    expect(footerNavigation.map(({ label }) => label)).toContain('Resources');
  });

  it('uses the verified Ship Now destination', () => {
    expect(externalDestinations.shipNow).toEqual({ kind: 'url', href: 'https://www.kaglogistics.com/ship-now-2/' });
  });
});
