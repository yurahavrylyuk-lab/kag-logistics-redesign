import type { MetadataRoute } from 'next';
import { industries } from '@/content/industries';
import { resources } from '@/content/resources';
import { solutions } from '@/content/solutions';
import { configuredSiteOrigin } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = configuredSiteOrigin();
  if (!origin) return [];
  const paths = ['/', '/quote', '/technology', '/carriers', '/careers', '/solutions', '/industries', '/resources', ...solutions.map(({ slug }) => `/solutions/${slug}`), ...industries.map(({ slug }) => `/industries/${slug}`), ...resources.map(({ slug }) => `/resources/${slug}`)];
  return paths.map((path) => ({ url: `${origin}${path}` }));
}
