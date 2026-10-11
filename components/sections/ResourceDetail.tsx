import type { Resource } from '@/content/resources';
import { DetailPageTemplate } from './DetailPageTemplate';

export function ResourceDetail({ resource }: { resource: Resource }) {
  return <DetailPageTemplate content={resource} section="resources" />;
}
