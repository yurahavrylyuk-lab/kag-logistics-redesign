// @vitest-environment node
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from '@tanstack/react-router';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { AppProviders } from '@/app/providers';
import { useCurrentPathname } from '@/app/use-current-pathname';
import { RouteAnalytics } from '@/features/analytics/RouteAnalytics';
import { noopAnalyticsAdapter } from '@/features/analytics/noop-adapter';
import { AmbientCursor } from '@/features/motion/AmbientCursor';
import { SectionChoreography } from '@/features/motion/SectionChoreography';
import { ThemeBootstrapScript } from '@/features/theme/ThemeScript';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

function CurrentPathname() {
  return <output>{useCurrentPathname()}</output>;
}

it('statically renders all migrated features in Node without browser globals or analytics side effects', () => {
  expect(typeof window).toBe('undefined');
  expect(typeof document).toBe('undefined');
  const send = vi.spyOn(noopAnalyticsAdapter, 'track');
  const router = createRouter({
    routeTree: createRootRoute(),
    history: createMemoryHistory({ initialEntries: ['/about'] }),
    isServer: true,
  });
  const html = renderToStaticMarkup(
    <RouterContextProvider router={router}>
      <ThemeBootstrapScript />
      <AppProviders>
        <span>content</span>
        <CurrentPathname />
        <ThemeToggle />
        <AmbientCursor />
        <SectionChoreography />
        <RouteAnalytics event="solution_viewed" properties={{ solutionId: 'bulk' }} />
      </AppProviders>
    </RouterContextProvider>,
  );
  expect(html).toContain('<span>content</span>');
  expect(html).toContain('<output>/about</output>');
  expect(html).toContain('Color theme');
  expect(send).not.toHaveBeenCalled();
});
