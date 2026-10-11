import { Hero } from '@/components/sections/Hero';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { Ticker } from '@/components/sections/Ticker';

export default function HomePage() {
  return <main id="main-content"><Hero /><Ticker items={['24/7 Operations', 'North American Coverage', 'Multimodal Transportation', 'Dedicated Logistics Experts']} /><ProcessTimeline /></main>;
}
