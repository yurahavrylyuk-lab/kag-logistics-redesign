import { createFileRoute } from '@tanstack/react-router';
import { CategoryIndex } from '@/components/sections/CategoryIndex';
import { solutions } from '@/content/solutions';

function SolutionsPage() { return <CategoryIndex entries={solutions} section="solutions" summary="Explore the ways KAG coordinates transportation across a supply chain." title="Solutions" />; }

export const Route = createFileRoute('/solutions/')({ component: SolutionsPage });
