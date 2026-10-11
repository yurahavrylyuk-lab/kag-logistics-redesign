import { CategoryIndex } from '@/components/sections/CategoryIndex';
import { solutions } from '@/content/solutions';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({ title: 'Solutions', description: 'Representative transportation and logistics solution patterns.', path: '/solutions' });
export default function SolutionsPage() { return <CategoryIndex entries={solutions} section="solutions" summary="Explore the representative solution patterns available in this focused phase-one prototype." title="Solutions" />; }
