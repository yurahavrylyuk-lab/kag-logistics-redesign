import { useEffect, useState, type ComponentProps } from 'react';
import { useRouter } from '@tanstack/react-router';
import { SectionChoreography } from '@/features/motion/SectionChoreography';

/** Run route DOM enhancement inside the same boundary as its hydrated content. */
export function RouteMain(props: ComponentProps<'main'>) {
  return <><main {...props} /><SectionChoreography /></>;
}

/** Keep the live region mounted across pages and act only on committed navigation. */
export function RouteNavigation() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    let clientNavigation = false;
    let departure: { focus: Element | null; drawerTrigger: Element | null } | undefined;
    const unsubscribeHistory = router.history.subscribe(({ action }) => {
      clientNavigation = action.type === 'PUSH' || action.type === 'REPLACE';
    });
    const unsubscribeBefore = router.subscribe('onBeforeNavigate', (event) => {
      departure = undefined;
      if (!event.fromLocation || !event.pathChanged) return;
      const focus = document.activeElement;
      const drawer = focus?.closest('[role="dialog"][id]');
      const drawerTrigger = drawer
        ? [...document.querySelectorAll('[aria-controls]')].find(element => element.getAttribute('aria-controls') === drawer.id) ?? null
        : null;
      departure = { focus, drawerTrigger };
    });
    const unsubscribeRendered = router.subscribe('onRendered', (event) => {
      const previous = departure;
      departure = undefined;
      // Initial hydration and same-page/search/hash changes retain browser focus.
      if (!previous || !event.pathChanged) return;
      const main = document.getElementById('main-content');
      if (!main) return;
      const heading = main.querySelector<HTMLElement>('h1');
      setAnnouncement(heading?.textContent?.trim() || document.title);
      const active = document.activeElement;
      // History traversal owns restoration; a user who moved focus while loading
      // also keeps it. Drawer close restoration is allowed to yield to the page.
      if (!clientNavigation || event.toLocation.hash || main.contains(active)) return;
      if (active !== document.body && active !== previous.focus && active !== previous.drawerTrigger) return;
      const destination = heading ?? main;
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    });
    return () => {
      unsubscribeHistory();
      unsubscribeBefore();
      unsubscribeRendered();
    };
  }, [router]);

  return <div aria-atomic="true" aria-label="Page navigation" aria-live="polite" className="sr-only" role="status">{announcement}</div>;
}
