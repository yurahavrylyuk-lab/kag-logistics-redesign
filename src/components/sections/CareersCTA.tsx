import { TrackedLink } from '@/components/ui/TrackedLink';

export function CareersCTA() { return <section className="audience-cta careers-cta"><div><p className="eyebrow">Careers</p><h2>Build the career behind the supply chain.</h2><p>Explore training, growth, benefits, and life at KAG.</p></div><TrackedLink className="button" event="careers_cta_clicked" to="/careers" properties={{ source: 'homepage-careers' }}>Explore Careers</TrackedLink></section>; }
