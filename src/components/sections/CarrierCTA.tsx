import { TrackedLink } from '@/components/ui/TrackedLink';

export function CarrierCTA() { return <section className="audience-cta carrier-cta"><div><p className="eyebrow">Carriers</p><h2>Freight for carriers who want to keep moving.</h2><p>Explore opportunities, dedicated lanes, operational support, and resources.</p></div><TrackedLink className="button" event="carrier_cta_clicked" to="/carriers" properties={{ source: 'homepage-carrier' }}>Become a KAG Carrier</TrackedLink></section>; }
