import { createFileRoute, notFound } from '@tanstack/react-router';
import { DetailPageTemplate } from '@/components/sections/DetailPageTemplate';
import { getRouteContent } from '@/lib/route-content';

export const Route = createFileRoute('/industries/$slug')({
  loader: ({ params }) => {
    const content = getRouteContent('industries', params.slug);
    if (!content) throw notFound();
    return content;
  },
  component: IndustryDetailPage,
});

function IndustryDetailPage() {
  const content = Route.useLoaderData();
  return <DetailPageTemplate content={content} section="industries" />;
}
