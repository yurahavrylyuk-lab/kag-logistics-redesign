import { notFound } from 'next/navigation';
import { DetailPageTemplate } from '@/components/sections/DetailPageTemplate';
import { industries } from '@/content/industries';
import { getRouteContent } from '@/lib/route-content';

export const dynamicParams = false;
export function generateStaticParams() { return industries.map(({ slug }) => ({ slug })); }
export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getRouteContent('industries', slug);
  if (!content) notFound();
  return <DetailPageTemplate content={content} section="industries" />;
}
