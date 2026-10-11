import { CategoryIndex } from '@/components/sections/CategoryIndex';
import { industries } from '@/content/industries';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({ title: 'Industries', description: 'Representative industry logistics patterns.', path: '/industries' });
export default function IndustriesPage() { return <CategoryIndex entries={industries} section="industries" summary="Explore representative industry contexts and the operational questions they introduce." title="Industries" />; }
