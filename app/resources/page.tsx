import { CategoryIndex } from '@/components/sections/CategoryIndex';
import { resources } from '@/content/resources';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({ title: 'Resources', description: 'Representative logistics resources and prototype editorial patterns.', path: '/resources' });
export default function ResourcesPage() { return <CategoryIndex entries={resources} section="resources" summary="A concise representative resource center for logistics insights and future verified editorial content." title="Resources" />; }
