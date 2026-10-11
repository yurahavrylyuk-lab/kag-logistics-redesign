import { noopAnalyticsAdapter } from './noop-adapter';
import type { AnalyticsAdapter, AnalyticsEvent, AnalyticsEventName } from './types';

type UntrustedProperties = Record<string, unknown>;

function safeProperties(properties: UntrustedProperties): AnalyticsEvent['properties'] {
  const next: NonNullable<AnalyticsEvent['properties']> = {};
  if (typeof properties.placement === 'string') next.placement = properties.placement;
  if (typeof properties.route === 'string') next.route = properties.route;
  if (properties.outcome === 'success' || properties.outcome === 'error') next.outcome = properties.outcome;
  return Object.keys(next).length ? next : undefined;
}

export function track(name: AnalyticsEventName, properties: UntrustedProperties = {}, adapter: AnalyticsAdapter = noopAnalyticsAdapter) {
  adapter.track({ name, properties: safeProperties(properties) });
}
