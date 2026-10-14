import { noopAnalyticsAdapter } from './noop-adapter';
import type { AnalyticsAdapter, AnalyticsEvent, AnalyticsEventName } from './types';

type UntrustedProperties = Record<string, unknown>;

function safeProperties(properties: UntrustedProperties): AnalyticsEvent['properties'] {
  const next: NonNullable<AnalyticsEvent['properties']> = {};
  if (typeof properties.source === 'string') next.source = properties.source;
  if (typeof properties.entryPoint === 'string') next.entryPoint = properties.entryPoint;
  if (typeof properties.freightType === 'string') next.freightType = properties.freightType;
  if (typeof properties.step === 'number') next.step = properties.step;
  if (typeof properties.elapsedMs === 'number') next.elapsedMs = properties.elapsedMs;
  if (typeof properties.validationErrorCount === 'number') next.validationErrorCount = properties.validationErrorCount;
  if (typeof properties.referenceId === 'string') next.referenceId = properties.referenceId;
  if (properties.failureKind === 'validation' || properties.failureKind === 'server' || properties.failureKind === 'network') next.failureKind = properties.failureKind;
  if (typeof properties.solutionId === 'string') next.solutionId = properties.solutionId;
  if (properties.theme === 'light' || properties.theme === 'dark' || properties.theme === 'system') next.theme = properties.theme;
  return Object.keys(next).length ? next : undefined;
}

export function track(name: AnalyticsEventName, properties: UntrustedProperties = {}, adapter: AnalyticsAdapter = noopAnalyticsAdapter) {
  adapter.track({ name, properties: safeProperties(properties) });
}
