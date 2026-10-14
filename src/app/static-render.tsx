import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { routeTree } from '@/routeTree.gen';
import { staticRouteManifest } from './route-manifest';
import type { PageMetadata } from '@/lib/metadata';

/** Load the same route tree used by the browser before rendering its full body. */
export async function renderStaticRoute(path: string): Promise<{ html: string; metadata: PageMetadata }> {
  const route = staticRouteManifest.find(entry => entry.path === path);
  if (!route) throw new Error(`Unknown static route: ${path}`);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    isServer: true,
  });
  await router.load();
  if (router.state.matches.some(match => match.status !== 'success')) {
    throw new Error(`Failed to load static route: ${path}`);
  }
  // The client router adds this boundary around its matches. Retain its React
  // hydration markers while server loading stays entirely browser-independent.
  return { html: renderToString(<Suspense><RouterProvider router={router} /></Suspense>), metadata: route.metadata };
}
