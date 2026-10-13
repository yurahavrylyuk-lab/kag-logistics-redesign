import { createFileRoute } from '@tanstack/react-router';
import { CategoryIndex } from '@/components/sections/CategoryIndex';
import { resources } from '@/content/resources';

function ResourcesPage() { return <CategoryIndex entries={resources} section="resources" summary="A concise representative resource center for logistics insights and future verified editorial content." title="Resources" />; }

export const Route = createFileRoute('/resources/')({ component: ResourcesPage });
