'use client';

import { createLink } from '@tanstack/react-router';
import { forwardRef, type ComponentProps } from 'react';
import type { AnalyticsEventName } from '@/features/analytics/types';
import { track } from '@/features/analytics/track';

type TrackedAnchorProps = ComponentProps<'a'> & { event: AnalyticsEventName; properties: Record<string, unknown> };

const TrackedAnchor = forwardRef<HTMLAnchorElement, TrackedAnchorProps>(function TrackedAnchor({ event, onClick, properties, ...props }, ref) {
  return <a {...props} ref={ref} onClick={(click) => { track(event, properties); onClick?.(click); }} />;
});

export const TrackedLink = createLink(TrackedAnchor);
