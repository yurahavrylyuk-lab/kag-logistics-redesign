import type { ReactElement } from 'react';
import { createMemoryHistory, RouterContextProvider, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { getRouter } from '@/app/router';

type AppRouter = ReturnType<typeof getRouter>;

export function renderWithRouter(ui: ReactElement, initialPath = '/') {
  // jsdom has no layout or scrolling implementation.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

  const router = ui.type === RouterProvider
    ? (ui as ReactElement<{ router: AppRouter }>).props.router
    : getRouter();

  router.update({
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    defaultPendingMinMs: 0,
  });

  return {
    ...render(<RouterContextProvider router={router}>{ui}</RouterContextProvider>),
    router,
  };
}
