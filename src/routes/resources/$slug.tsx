import { createFileRoute, notFound } from '@tanstack/react-router';
import { ResourceDetail } from '@/components/sections/ResourceDetail';
import { getRouteContent } from '@/lib/route-content';

export const Route = createFileRoute('/resources/$slug')({
  loader: ({ params }) => {
    const content = getRouteContent('resources', params.slug);
    if (!content) throw notFound();
    return content;
  },
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const content = Route.useLoaderData();
  return <ResourceDetail resource={content} />;
}
