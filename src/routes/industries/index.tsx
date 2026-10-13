import { createFileRoute } from '@tanstack/react-router';
import { CategoryIndex } from '@/components/sections/CategoryIndex';
import { industries } from '@/content/industries';

function IndustriesPage() { return <CategoryIndex entries={industries} section="industries" summary="Explore representative industry contexts and the operational questions they introduce." title="Industries" />; }

export const Route = createFileRoute('/industries/')({ component: IndustriesPage });
