import { RouteMain } from '@/app/RouteMain';
import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/components/sections/Hero';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { Ticker } from '@/components/sections/Ticker';
import { ProblemCards } from '@/components/sections/ProblemCards';
import { SolutionsGrid } from '@/components/sections/SolutionsGrid';
import { TechnologyShowcase } from '@/components/sections/TechnologyShowcase';
import { IndustrySelector } from '@/components/sections/IndustrySelector';
import { CaseStudyCards } from '@/components/sections/CaseStudyCards';
import { CarrierCTA } from '@/components/sections/CarrierCTA';
import { CareersCTA } from '@/components/sections/CareersCTA';
import { Resources } from '@/components/sections/Resources';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { QuoteSection } from '@/components/sections/QuoteSection';
import { AboutKag } from '@/components/sections/AboutKag';

function HomePage() {
  return <RouteMain id="main-content"><div data-choreography><Hero /></div><Ticker items={['24/7 Operations', 'North American Coverage', 'Multimodal Transportation', 'Dedicated Logistics Experts']} /><div data-choreography><ProblemCards /></div><div data-choreography><SolutionsGrid /></div><div data-choreography><AboutKag /></div><div data-choreography><TechnologyShowcase /></div><div data-choreography><IndustrySelector /></div><Ticker items={['Brokerage', 'Dedicated', 'Bulk', 'Drayage', 'Expedited', 'Cross-border']} /><div data-choreography><CaseStudyCards /></div><div data-choreography><ProcessTimeline /></div><div data-choreography><QuoteSection /></div><div data-choreography><CarrierCTA /></div><div data-choreography><CareersCTA /></div><div data-choreography><Resources /></div><div data-choreography><FinalCTA /></div></RouteMain>;
}

export const Route = createFileRoute('/')({ component: HomePage });
