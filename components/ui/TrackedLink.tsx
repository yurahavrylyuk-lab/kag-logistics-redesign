'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { AnalyticsEventName } from '@/features/analytics/types';
import { track } from '@/features/analytics/track';

type TrackedLinkProps = ComponentProps<typeof Link> & { event: AnalyticsEventName; properties: Record<string, unknown> };

export function TrackedLink({ event, onClick, properties, ...props }: TrackedLinkProps) {
  return <Link {...props} onClick={(click) => { track(event, properties); onClick?.(click); }} />;
}
