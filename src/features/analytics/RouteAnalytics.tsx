import { useEffect } from 'react';
import { useMatch } from '@tanstack/react-router';
import type { AnalyticsEventName } from './types';
import { track } from './track';

export function RouteAnalytics({ event, properties }: { event: AnalyticsEventName; properties: Record<string, unknown> }) {
  // A page mounts before the shell's resolvedLocation acknowledgement. Its own
  // match identifies that mount without firing again when acknowledgement lands.
  const pathname = useMatch({ strict: false, shouldThrow: false, select: (match) => match.pathname });
  useEffect(() => {
    if (pathname !== undefined) track(event, properties);
  }, [event, properties, pathname]);
  return null;
}
