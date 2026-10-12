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
  { label: 'About', href: '/about' },
  { label: 'Carriers', href: '/carriers' },
  { label: 'Careers', href: '/careers' },
];
export const footerNavigation: NavigationItem[] = [...primaryNavigation.slice(0, 3), { label: 'Resources', href: '/resources' }, ...primaryNavigation.slice(3)];

export const utilityDestinations: Record<'customerLogin' | 'shipNow', ExternalDestination> = {
  customerLogin: externalDestinations.customerLogin,
  shipNow: externalDestinations.shipNow,
};
