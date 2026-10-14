import { useEffect } from 'react';
import { getRouteMeta } from './route-manifest';
import { useCurrentPathname } from './use-current-pathname';

function updateMeta(attribute: 'name' | 'property', key: string, content?: string) {
  const current = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!content) {
    current?.remove();
    return;
  }
  const meta = current ?? document.createElement('meta');
  meta.setAttribute(attribute, key);
  meta.content = content;
  if (!current) document.head.append(meta);
}

/** Keep the prerendered head in sync with the route currently on screen. */
export function RouteHead() {
  const pathname = useCurrentPathname();
  useEffect(() => {
    const metadata = getRouteMeta(pathname);
    document.title = metadata.title;
    updateMeta('name', 'description', metadata.description);
    updateMeta('property', 'og:title', metadata.openGraph.title);
    updateMeta('property', 'og:description', metadata.openGraph.description);
    updateMeta('property', 'og:type', metadata.openGraph.type);
    updateMeta('property', 'og:url', metadata.openGraph.url);
    updateMeta('name', 'twitter:card', metadata.twitter.card);
    updateMeta('name', 'twitter:title', metadata.twitter.title);
    updateMeta('name', 'twitter:description', metadata.twitter.description);
    const current = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (metadata.alternates) {
      const canonical = current ?? document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = metadata.alternates.canonical;
      if (!current) document.head.append(canonical);
    } else {
      current?.remove();
    }
  }, [pathname]);
  return null;
}
