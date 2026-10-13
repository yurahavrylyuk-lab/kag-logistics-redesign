'use client';

import { InternalLink } from '@/components/ui/InternalLink';
import type { ComponentProps } from 'react';
import type { AnalyticsEventName } from '@/features/analytics/types';
import { track } from '@/features/analytics/track';

type TrackedLinkProps = ComponentProps<typeof InternalLink> & { event: AnalyticsEventName; properties: Record<string, unknown> };

export function TrackedLink({ event, onClick, properties, ...props }: TrackedLinkProps) {
  return <InternalLink {...props} onClick={(click) => { track(event, properties); onClick?.(click); }} />;
}
