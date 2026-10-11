import type { ExternalDestination } from './destinations';
import { externalDestinations } from './destinations';

export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Technology', href: '/technology' },
  { label: 'Resources', href: '/resources' },
  { label: 'Carriers', href: '/carriers' },
  { label: 'Careers', href: '/careers' },
];

export const utilityDestinations: Record<'customerLogin' | 'shipNow', ExternalDestination> = {
  customerLogin: externalDestinations.customerLogin,
  shipNow: externalDestinations.shipNow,
};
