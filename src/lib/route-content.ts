import { industries, type Industry } from '@/content/industries';
import { resources, type Resource } from '@/content/resources';
import { solutions, type Solution } from '@/content/solutions';

export type RouteSection = 'solutions' | 'industries' | 'resources';
export type RouteContent = Solution | Industry | Resource;

type ContentBySection = {
  solutions: Solution;
  industries: Industry;
  resources: Resource;
};

const collections: { [Section in RouteSection]: ContentBySection[Section][] } = {
  solutions,
  industries,
  resources,
};

export function getRouteContent<Section extends RouteSection>(section: Section, slug: string): ContentBySection[Section] | undefined {
  return collections[section].find((entry) => entry.slug === slug);
}
