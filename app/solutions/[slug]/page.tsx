import { notFound } from 'next/navigation';
import { DetailPageTemplate } from '@/components/sections/DetailPageTemplate';
import { solutions } from '@/content/solutions';
import { getRouteContent } from '@/lib/route-content';

export const dynamicParams = false;
export function generateStaticParams() { return solutions.map(({ slug }) => ({ slug })); }
export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getRouteContent('solutions', slug);
  if (!content) notFound();
  return <DetailPageTemplate content={content} section="solutions" />;
}
