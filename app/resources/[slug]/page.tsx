import { notFound } from 'next/navigation';
import { ResourceDetail } from '@/components/sections/ResourceDetail';
import { resources } from '@/content/resources';
import { getRouteContent } from '@/lib/route-content';

export const dynamicParams = false;
export function generateStaticParams() { return resources.map(({ slug }) => ({ slug })); }
export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getRouteContent('resources', slug);
  if (!content || !('category' in content)) notFound();
  return <ResourceDetail resource={content} />;
}
