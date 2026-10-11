export type ExternalDestination =
  | { kind: 'url'; href: string }
  | { kind: 'unavailable'; message: string };

export const externalDestinations = {
  carrierRegistration: {
    kind: 'unavailable',
    message: 'Carrier registration is not configured for this prototype.',
  },
  carrierResources: {
    kind: 'unavailable',
    message: 'Carrier resources are not configured for this prototype.',
  },
  customerLogin: {
    kind: 'unavailable',
    message: 'Customer Login is not configured for this prototype.',
  },
  jobs: {
    kind: 'unavailable',
    message: 'The job-search destination is not configured for this prototype.',
  },
  shipNow: {
    kind: 'unavailable',
    message: 'The urgent-shipping destination is not configured for this prototype.',
  },
} satisfies Record<string, ExternalDestination>;
