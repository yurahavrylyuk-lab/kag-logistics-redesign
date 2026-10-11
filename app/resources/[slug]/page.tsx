import { notFound } from 'next/navigation';
import { ResourceDetail } from '@/components/sections/ResourceDetail';
import { resources } from '@/content/resources';
import { getRouteContent } from '@/lib/route-content';
import { createPageMetadata } from '@/lib/metadata';

export const dynamicParams = false;
export function generateStaticParams() { return resources.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getRouteContent('resources', slug);
  if (!content) return {};
  return createPageMetadata({ title: content.title, description: content.summary, path: `/resources/${slug}` });
}
export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getRouteContent('resources', slug);
  if (!content || !('category' in content)) notFound();
  return <ResourceDetail resource={content} />;
}
