import { Link } from '@tanstack/react-router';
import { TrackedLink } from '@/components/ui/TrackedLink';
import type { NavigationItem } from '@/content/navigation';

// Typecheck-only regression fixtures: never render invalid links.
export function RouteLinkTypeContract() {
  const validStatic = <Link to="/about">About</Link>;
  const validDetail = <Link to="/solutions/$slug" params={{ slug: 'freight-brokerage' }}>Brokerage</Link>;
  const validTracked = <TrackedLink to="/technology" event="technology_cta_clicked" properties={{ source: 'test' }}>Technology</TrackedLink>;
  // @ts-expect-error Unregistered internal destinations must not compile.
  const invalidStatic = <Link to="/not-a-registered-page">Invalid</Link>;
  // @ts-expect-error Dynamic destinations require their slug parameter.
  const missingSlug = <Link to="/resources/$slug">Invalid</Link>;
  // @ts-expect-error Tracking must preserve TanStack's route constraints.
  const invalidTracked = <TrackedLink to="/not-a-registered-page" event="technology_cta_clicked" properties={{}}>Invalid</TrackedLink>;
  // @ts-expect-error Tracking must preserve required dynamic parameters.
  const missingTrackedSlug = <TrackedLink to="/industries/$slug" event="technology_cta_clicked" properties={{}}>Invalid</TrackedLink>;
  // @ts-expect-error Navigation data must reference registered destinations.
  const invalidNavigation: NavigationItem = { label: 'Invalid', href: '/not-a-registered-page' };
  return { validStatic, validDetail, validTracked, invalidStatic, missingSlug, invalidTracked, missingTrackedSlug, invalidNavigation };
}
