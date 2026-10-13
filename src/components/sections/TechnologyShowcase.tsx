import { technologySummary } from '@/content/technology';
import { CommandCenterDemo } from './CommandCenterDemo';
import { TrackedLink } from '@/components/ui/TrackedLink';

export function TechnologyShowcase() { return <section className="technology-section content-section"><div className="section-heading"><p className="eyebrow">Technology</p><h2>Your supply chain. Visible.</h2><p>{technologySummary}</p><TrackedLink className="button" event="technology_cta_clicked" to="/technology" properties={{ source: 'homepage-technology' }}>Explore Technology</TrackedLink></div><CommandCenterDemo /></section>; }
