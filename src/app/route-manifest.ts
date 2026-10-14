import { industries } from '@/content/industries';
import { resources } from '@/content/resources';
import { solutions } from '@/content/solutions';
import { createPageMetadata, type PageMetadata } from '@/lib/metadata';

export type StaticRoute = {
  path: string;
  metadata: PageMetadata;
};

const fixedRoutes = [
  { path: '/', title: 'Logistics with operational control', description: 'North American logistics and transportation management.' },
  { path: '/about', title: 'About KAG Logistics', description: 'Managed transportation and logistics expertise across North America.' },
  { path: '/careers', title: 'Careers', description: 'A careers route for people who help keep critical supply chains moving.' },
  { path: '/carriers', title: 'Carriers', description: 'A focused carrier journey for logistics relationships.' },
  { path: '/technology', title: 'Technology', description: 'Operational technology capabilities for logistics coordination and visibility.' },
  { path: '/quote', title: 'Request pricing', description: 'Start a logistics shipment conversation with KAG Logistics.' },
  { path: '/solutions', title: 'Solutions', description: 'Representative transportation and logistics solution patterns.' },
  { path: '/industries', title: 'Industries', description: 'Representative industry logistics patterns.' },
  { path: '/resources', title: 'Resources', description: 'Logistics resources, insights, and editorial patterns.' },
];

export const staticRouteManifest: StaticRoute[] = [
  ...fixedRoutes.map(route => ({ path: route.path, metadata: createPageMetadata(route) })),
  ...[
    { section: 'solutions', entries: solutions },
    { section: 'industries', entries: industries },
    { section: 'resources', entries: resources },
  ].flatMap(({ section, entries }) => entries.map(entry => {
    const path = `/${section}/${entry.slug}`;
    return { path, metadata: createPageMetadata({ title: entry.title, description: entry.summary, path }) };
  })),
];

export function getRouteMeta(path: string): PageMetadata {
  const routePath = path.replace(/\/+$/, '') || '/';
  return staticRouteManifest.find(route => route.path === routePath)?.metadata
    ?? createPageMetadata({ title: 'Page not found', description: 'The requested page could not be found.', path });
}
