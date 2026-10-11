import type { ExternalDestination } from './destinations';
import { externalDestinations } from './destinations';

export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: 'Solutions', href: '/solutions/freight-brokerage' },
  { label: 'Industries', href: '/industries/chemicals' },
  { label: 'Technology', href: '/technology' },
  { label: 'Resources', href: '/resources/building-supply-chain-control' },
  { label: 'Carriers', href: '/carriers' },
  { label: 'Careers', href: '/careers' },
];

export const utilityDestinations: Record<'customerLogin' | 'shipNow', ExternalDestination> = {
  customerLogin: externalDestinations.customerLogin,
  shipNow: externalDestinations.shipNow,
};
