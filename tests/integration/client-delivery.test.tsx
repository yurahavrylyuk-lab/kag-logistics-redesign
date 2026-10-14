import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRouter } from '@/app/router';
import { renderStaticRoute } from '@/app/static-render';
import { bootstrapApp } from '@/app/bootstrap';
import { installIntersectionObserverMock, setMediaCapabilities } from '../setup';

afterEach(() => { document.head.innerHTML = ''; });

function clientRouter(path: string) {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  installIntersectionObserverMock();
  setMediaCapabilities({ reducedMotion: true });
  const router = getRouter();
  router.update({ history: createMemoryHistory({ initialEntries: [path] }), defaultPendingMinMs: 0 });
  return router;
}

describe('static document enhancement', () => {
  it('renders an accessible unknown route when the static host serves the homepage fallback', async () => {
    const router = clientRouter('/solutions/not-real');
    const container = document.createElement('div');
    container.innerHTML = (await renderStaticRoute('/')).html;
    document.body.append(container);
    let application: Awaited<ReturnType<typeof bootstrapApp>> | undefined;
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      await act(async () => { application = await bootstrapApp(container, router); });
      await waitFor(() => expect(container.querySelector('main h1')).toHaveTextContent('Page not found'));
      expect(errors.mock.calls).toEqual([]);
    } finally {
      if (application) await act(async () => { application!.unmount(); });
      container.remove();
    }
  });

  it('mounts the development shell when the root contains only its placeholder comment', async () => {
    const router = clientRouter('/about');
    const container = document.createElement('div');
    container.innerHTML = '<!--app-html-->';
    document.body.append(container);
    let application: Awaited<ReturnType<typeof bootstrapApp>> | undefined;
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      await act(async () => { application = await bootstrapApp(container, router); });
      await waitFor(() => expect(container.querySelector('main h1')).toHaveTextContent('Built to keep complex supply chains moving.'));
      expect(errors.mock.calls).toEqual([]);
    } finally {
      if (application) await act(async () => { application!.unmount(); });
      container.remove();
    }
  });

  it('hydrates the existing route nodes without a hydration recovery or replacing readable content', async () => {
    const router = clientRouter('/about');
    const container = document.createElement('div');
    container.innerHTML = (await renderStaticRoute('/about')).html;
    document.body.append(container);
    const heading = container.querySelector('h1');
    const header = container.querySelector('header');
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let application: Awaited<ReturnType<typeof bootstrapApp>> | undefined;
    try {
      await act(async () => { application = await bootstrapApp(container, router); });
      await waitFor(() => expect(container.querySelector('h1')).toHaveTextContent('Built to keep complex supply chains moving.'));
      expect(container.querySelector('h1')).toBe(heading);
      expect(container.querySelector('header')).toBe(header);
      expect(errors.mock.calls).toEqual([]);
    } finally {
      if (application) await act(async () => { application!.unmount(); });
      container.remove();
    }
  });

  it.each(['/about', '/about/'])('updates the head from %s through client navigation and clears stale origin links and unknown-route metadata', async (path) => {
    document.head.innerHTML = '<title>Previous page</title><meta name="description" content="Previous description"><link rel="canonical" href="https://old.example/old"><meta property="og:url" content="https://old.example/old">';
    const router = clientRouter(path);
    render(<RouterProvider router={router} />);
    await screen.findByRole('heading', { level: 1, name: 'Built to keep complex supply chains moving.' });
    await waitFor(() => expect(document.title).toBe('About KAG Logistics | KAG Logistics'));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Managed transportation and logistics expertise across North America.');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
    await act(async () => { await router.navigate({ to: '/solutions/$slug', params: { slug: 'freight-brokerage' } }); });
    await waitFor(() => expect(document.title).toBe('Freight Brokerage | KAG Logistics'));
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Freight Brokerage | KAG Logistics');
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', 'Freight Brokerage | KAG Logistics');
    expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    await act(async () => { router.history.push('/solutions/not-real'); });
    await screen.findByRole('heading', { level: 1, name: 'Page not found' });
    await waitFor(() => expect(document.title).toBe('Page not found | KAG Logistics'));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'The requested page could not be found.');
  });

  it('enhances the server quote fallback into the unchanged wizard after hydration', async () => {
    const router = clientRouter('/quote');
    const container = document.createElement('div');
    container.innerHTML = (await renderStaticRoute('/quote')).html;
    document.body.append(container);
    const fallback = container.querySelector('.quote-fallback');
    expect(container.querySelector('form')).toBeNull();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let application: Awaited<ReturnType<typeof bootstrapApp>> | undefined;
    try {
      await act(async () => { application = await bootstrapApp(container, router); });
      await waitFor(() => expect(container.querySelector('form')).not.toBeNull());
      expect(container.querySelector('.quote-fallback')).toBe(fallback);
      expect(document.documentElement).toHaveAttribute('data-quote-ready', 'true');
      expect(errors.mock.calls).toEqual([]);
    } finally {
      if (application) await act(async () => { application!.unmount(); });
      container.remove();
    }
    expect(document.documentElement).not.toHaveAttribute('data-quote-ready');
  });
});
