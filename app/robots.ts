import type { MetadataRoute } from 'next';
import { configuredSiteOrigin } from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  const origin = configuredSiteOrigin();
  return { rules: { userAgent: '*', allow: '/' }, sitemap: origin ? `${origin}/sitemap.xml` : undefined };
}
