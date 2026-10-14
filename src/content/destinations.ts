export type ExternalDestination =
  | { kind: 'url'; href: string }
  | { kind: 'unavailable'; message: string };

export const externalDestinations = {
  carrierRegistration: {
    kind: 'unavailable',
    message: 'Carrier registration is not configured yet.',
  },
  carrierResources: {
    kind: 'unavailable',
    message: 'Carrier resources are not configured yet.',
  },
  customerLogin: {
    kind: 'unavailable',
    message: 'Customer Login is not configured yet.',
  },
  jobs: {
    kind: 'unavailable',
    message: 'The job-search destination is not configured yet.',
  },
  shipNow: {
    kind: 'url',
    href: 'https://www.kaglogistics.com/ship-now-2/',
  },
} satisfies Record<string, ExternalDestination>;
