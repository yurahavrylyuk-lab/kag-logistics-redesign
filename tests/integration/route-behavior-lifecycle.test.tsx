import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCurrentPathname } from '@/app/use-current-pathname';
import { RouteAnalytics } from '@/features/analytics/RouteAnalytics';
import { noopAnalyticsAdapter } from '@/features/analytics/noop-adapter';
import { SectionChoreography } from '@/features/motion/SectionChoreography';
import { installIntersectionObserverMock, setMediaCapabilities } from '../setup';

const outgoingProperties = { solutionId: 'outgoing' };
const destinationProperties = { solutionId: 'destination' };

function Shell() {
  const pathname = useCurrentPathname();
  return <><output data-testid="rendered-path">{pathname}</output><Outlet /><SectionChoreography /></>;
}

function OutgoingPage() {
  return <><section data-choreography data-testid="outgoing-section" /><RouteAnalytics event="solution_viewed" properties={outgoingProperties} /></>;
}

function DestinationPage() {
  return <><section data-choreography data-testid="destination-section" /><RouteAnalytics event="solution_viewed" properties={destinationProperties} /></>;
}

function PendingPage() {
  return <p>Loading destination</p>;
}

function renderDeferredNavigation(pendingMs = 10_000) {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  setMediaCapabilities();
  let release!: () => void;
  const loaded = new Promise<void>((resolve) => { release = resolve; });
  const root = createRootRoute({ component: Shell });
  const outgoing = createRoute({ getParentRoute: () => root, path: '/', component: OutgoingPage });
  const destination = createRoute({
    getParentRoute: () => root,
    path: '/destination',
    component: DestinationPage,
    loader: () => loaded,
  });
  const router = createRouter({
    routeTree: root.addChildren([outgoing, destination]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
    defaultPendingMs: pendingMs,
    defaultPendingMinMs: 0,
    defaultPendingComponent: PendingPage,
  });
  render(<RouterProvider router={router} />);
  return { router, release };
}

describe('rendered route behavior lifecycle', () => {
  it('keeps the displayed pathname while a distinct destination loader is pending', async () => {
    installIntersectionObserverMock();
    const { router, release } = renderDeferredNavigation();
    await screen.findByTestId('outgoing-section');
    await act(async () => { router.history.push('/destination'); });
    await waitFor(() => expect(router.state.isLoading).toBe(true));
    const pendingPathname = screen.getByTestId('rendered-path').textContent;
    const outgoingStillMounted = screen.queryByTestId('outgoing-section') !== null;
    const destinationNotMounted = screen.queryByTestId('destination-section') === null;
    await act(async () => { release(); });
    await screen.findByTestId('destination-section');
    expect(pendingPathname).toBe('/');
    expect(outgoingStillMounted).toBe(true);
    expect(destinationNotMounted).toBe(true);
    expect(screen.getByTestId('rendered-path')).toHaveTextContent('/destination');
  });

  it('rebinds root choreography to the distinct destination DOM after its loader resolves', async () => {
    const observers = installIntersectionObserverMock();
    const { router, release } = renderDeferredNavigation();
    const outgoing = await screen.findByTestId('outgoing-section');
    await waitFor(() => expect(observers).toHaveLength(1));
    expect(observers[0].observed).toContain(outgoing);
    await act(async () => { router.history.push('/destination'); });
    await waitFor(() => expect(router.state.isLoading).toBe(true));
    const observersWhilePending = observers.length;
    await act(async () => { release(); });
    const destination = await screen.findByTestId('destination-section');
    await waitFor(() => expect(observers.at(-1)!.observed).toContain(destination));
    expect(observersWhilePending).toBe(1);
    expect(observers).toHaveLength(2);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].observed).not.toContain(outgoing);
    expect(destination).toHaveAttribute('data-choreography-state', 'static');
  });

  it('emits no departing-page event while loading and exactly one destination event on mount', async () => {
    installIntersectionObserverMock();
    const send = vi.spyOn(noopAnalyticsAdapter, 'track');
    const { router, release } = renderDeferredNavigation();
    await screen.findByTestId('outgoing-section');
    await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    await act(async () => { router.history.push('/destination'); });
    await waitFor(() => expect(router.state.isLoading).toBe(true));
    const eventsWhilePending = [...send.mock.calls];
    await act(async () => { release(); });
    await screen.findByTestId('destination-section');
    await waitFor(() => expect(router.state.status).toBe('idle'));
    expect(eventsWhilePending).toEqual([[{ name: 'solution_viewed', properties: { solutionId: 'outgoing' } }]]);
    expect(send.mock.calls).toEqual([
      [{ name: 'solution_viewed', properties: { solutionId: 'outgoing' } }],
      [{ name: 'solution_viewed', properties: { solutionId: 'destination' } }],
    ]);
  });

  it('binds destination sections once the pending fallback is replaced, without duplicate analytics', async () => {
    const observers = installIntersectionObserverMock();
    const send = vi.spyOn(noopAnalyticsAdapter, 'track');
    const { router, release } = renderDeferredNavigation(0);
    await screen.findByTestId('outgoing-section');
    await waitFor(() => expect(observers).toHaveLength(1));
    await act(async () => { router.history.push('/destination'); });
    await screen.findByText('Loading destination');
    const observersWhilePending = observers.length;
    const eventsWhilePending = [...send.mock.calls];
    await act(async () => { release(); });
    const destination = await screen.findByTestId('destination-section');
    await waitFor(() => expect(router.state.status).toBe('idle'));
    await waitFor(() => expect(observers.at(-1)!.observed).toContain(destination));
    expect(observersWhilePending).toBe(1);
    expect(observers).toHaveLength(2);
    expect(eventsWhilePending).toEqual([[{ name: 'solution_viewed', properties: { solutionId: 'outgoing' } }]]);
    expect(send.mock.calls).toEqual([
      [{ name: 'solution_viewed', properties: { solutionId: 'outgoing' } }],
      [{ name: 'solution_viewed', properties: { solutionId: 'destination' } }],
    ]);
  });
});
