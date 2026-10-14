import type { ReactElement } from 'react';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import type { getRouter } from '@/app/router';

type AppRouter = ReturnType<typeof getRouter>;

export function renderWithRouter(ui: ReactElement, initialPath = '/') {
  // jsdom has no layout or scrolling implementation.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

  const history = createMemoryHistory({ initialEntries: [initialPath] });

  if (ui.type === RouterProvider) {
    const router = (ui as ReactElement<{ router: AppRouter }>).props.router;

    router.update({ history, defaultPendingMinMs: 0 });

    return { ...render(ui), router };
  }

  const rootRoute = createRootRoute({ component: Outlet });
  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: () => ui,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([testRoute]),
    history,
    defaultPendingMinMs: 0,
  });

  return {
    ...render(<RouterProvider router={router} />),
    router,
  };
}
