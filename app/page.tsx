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

export default function HomePage() {
  return <main id="main-content"><Hero /><Ticker items={['24/7 Operations', 'North American Coverage', 'Multimodal Transportation', 'Dedicated Logistics Experts']} /><ProblemCards /><SolutionsGrid /><TechnologyShowcase /><IndustrySelector /><Ticker items={['Brokerage', 'Dedicated', 'Bulk', 'Drayage', 'Expedited', 'Cross-border']} /><CaseStudyCards /><ProcessTimeline /><section className="quote-preview content-section"><p className="eyebrow">Request pricing</p><h2>Let’s start with the shipment.</h2><p>Tell us what you are moving and where it needs to go.</p><a className="button button-primary" href="/quote">Get a Quote</a></section><CarrierCTA /><CareersCTA /><Resources /><FinalCTA /></main>;
}
