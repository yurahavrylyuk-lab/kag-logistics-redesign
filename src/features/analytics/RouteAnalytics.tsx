import { useEffect } from 'react';
import { useCurrentPathname } from '@/app/use-current-pathname';
import type { AnalyticsEventName } from './types';
import { track } from './track';

export function RouteAnalytics({ event, properties }: { event: AnalyticsEventName; properties: Record<string, unknown> }) {
  const pathname = useCurrentPathname();
  useEffect(() => { track(event, properties); }, [event, properties, pathname]);
  return null;
}
