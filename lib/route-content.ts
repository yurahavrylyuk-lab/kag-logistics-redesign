import { industries, type Industry } from '@/content/industries';
import { resources, type Resource } from '@/content/resources';
import { solutions, type Solution } from '@/content/solutions';

export type RouteSection = 'solutions' | 'industries' | 'resources';
export type RouteContent = Solution | Industry | Resource;

const collections: Record<RouteSection, RouteContent[]> = {
  solutions,
  industries,
  resources,
};

export function getRouteContent(section: RouteSection, slug: string): RouteContent | undefined {
  return collections[section].find((entry) => entry.slug === slug);
}
