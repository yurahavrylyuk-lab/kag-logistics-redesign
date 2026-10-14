import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getRouter } from '@/app/router';
import { RouteMain, RouteNavigation } from '@/app/RouteMain';
import { renderWithRouter } from '../test-router';

describe('committed client route accessibility', () => {
  it('announces the committed destination from persistent footer navigation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RouterProvider router={getRouter()} />, '/');
    const footer = await screen.findByRole('navigation', { name: 'Footer navigation' });
    await user.click(within(footer).getByRole('link', { name: 'About', exact: true }));
    await screen.findByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' });
    expect(await screen.findByRole('status', { name: 'Page navigation' })).toHaveTextContent('Built to keep complex supply chains moving.');
  });

  it('moves keyboard focus from persistent footer navigation to the destination and announces it', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RouterProvider router={getRouter()} />, '/');
    const footer = await screen.findByRole('navigation', { name: 'Footer navigation' });
    const about = within(footer).getByRole('link', { name: 'About', exact: true });
    about.focus();
    await user.keyboard('{Enter}');
    const heading = await screen.findByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' });
    await waitFor(() => expect(heading).toHaveFocus());
    const announcement = screen.getByRole('status', { name: 'Page navigation' });
    expect(announcement).toHaveAttribute('aria-live', 'polite');
    expect(announcement).toHaveAttribute('aria-atomic', 'true');
    expect(announcement).toHaveTextContent('Built to keep complex supply chains moving.');
    await user.tab();
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Get a Quote' })).toHaveFocus();
  });

  it('leaves initial focus and same-page hash navigation alone', async () => {
    const { router } = renderWithRouter(<RouterProvider router={getRouter()} />, '/about');
    const footer = await screen.findByRole('navigation', { name: 'Footer navigation' });
    expect(document.body).toHaveFocus();
    expect(screen.getByRole('status', { name: 'Page navigation' })).toBeEmptyDOMElement();
    const about = within(footer).getByRole('link', { name: 'About', exact: true });
    about.focus();
    await act(async () => { await router.navigate({ to: '/about', hash: 'main-content', hashScrollIntoView: false }); });
    expect(about).toHaveFocus();
    expect(screen.getByRole('status', { name: 'Page navigation' })).toBeEmptyDOMElement();
  });

  it('announces history traversal without overriding restored focus', async () => {
    const { router } = renderWithRouter(<RouterProvider router={getRouter()} />, '/');
    await screen.findByRole('main');
    await act(async () => { await router.navigate({ to: '/about' }); });
    const resources = within(screen.getByRole('navigation', { name: 'Footer navigation' })).getByRole('link', { name: 'Resources' });
    resources.focus();
    await act(async () => { router.history.back(); });
    await screen.findByRole('heading', { level: 1, name: 'Bring complex supply chains under control.' });
    expect(resources).toHaveFocus();
    expect(screen.getByRole('status', { name: 'Page navigation' })).toHaveTextContent('Bring complex supply chains under control.');
  });

  it.each([false, true])('waits for the destination and respects focus moved while loading (%s)', async (moveFocus) => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    let release!: () => void;
    const loaded = new Promise<void>(resolve => { release = resolve; });
    const root = createRootRoute({ component: () => <><RouteNavigation /><button>Persistent control</button><Outlet /><button>Footer control</button></> });
    const home = createRoute({ getParentRoute: () => root, path: '/', component: () => <RouteMain id="main-content"><h1>Initial page</h1></RouteMain> });
    const destination = createRoute({ getParentRoute: () => root, path: '/destination', loader: () => loaded, component: () => <RouteMain id="main-content"><h1>Destination page</h1></RouteMain> });
    const router = createRouter({ routeTree: root.addChildren([home, destination]), history: createMemoryHistory({ initialEntries: ['/'] }), defaultPendingMs: 10_000, defaultPendingMinMs: 0 });
    render(<RouterProvider router={router} />);
    await screen.findByRole('heading', { name: 'Initial page' });
    const footer = screen.getByRole('button', { name: 'Footer control' });
    footer.focus();
    await act(async () => { router.history.push('/destination'); });
    await waitFor(() => expect(router.state.isLoading).toBe(true));
    expect(footer).toHaveFocus();
    expect(screen.getByRole('status', { name: 'Page navigation' })).toBeEmptyDOMElement();
    const control = screen.getByRole('button', { name: 'Persistent control' });
    if (moveFocus) control.focus();
    await act(async () => { release(); });
    const heading = await screen.findByRole('heading', { name: 'Destination page' });
    await waitFor(() => expect(screen.getByRole('status', { name: 'Page navigation' })).toHaveTextContent('Destination page'));
    expect(moveFocus ? control : heading).toHaveFocus();
  });
});
