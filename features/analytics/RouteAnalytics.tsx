'use client';

import { useEffect } from 'react';
import type { AnalyticsEventName } from './types';
import { track } from './track';

export function RouteAnalytics({ event, properties }: { event: AnalyticsEventName; properties: Record<string, unknown> }) {
  useEffect(() => { track(event, properties); }, [event, properties]);
  return null;
}
