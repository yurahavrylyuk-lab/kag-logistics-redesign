import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './router';
import { staticRouteManifest } from './route-manifest';

export async function bootstrapApp(container: HTMLElement, router = getRouter()) {
  await router.load();
  const content = <StrictMode><RouterProvider router={router} /></StrictMode>;
  const pathname = router.state.location.pathname.replace(/\/+$/, '') || '/';
  // Unknown paths receive the host's homepage fallback rather than a matching
  // prerendered document, so mount their accessible router boundary directly.
  const hasStaticDocument = staticRouteManifest.some(route => route.path === pathname);
  if (container.children.length && hasStaticDocument) return hydrateRoot(container, content);
  const application = createRoot(container);
  application.render(content);
  return application;
}
