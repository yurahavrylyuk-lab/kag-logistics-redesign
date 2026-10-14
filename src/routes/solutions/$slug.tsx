import { createFileRoute, notFound } from '@tanstack/react-router';
import { DetailPageTemplate } from '@/components/sections/DetailPageTemplate';
import { getRouteContent } from '@/lib/route-content';

export const Route = createFileRoute('/solutions/$slug')({
  loader: ({ params }) => {
    const content = getRouteContent('solutions', params.slug);
    if (!content) throw notFound();
    return content;
  },
  component: SolutionDetailPage,
});

function SolutionDetailPage() {
  const content = Route.useLoaderData();
  return <DetailPageTemplate content={content} section="solutions" />;
}
