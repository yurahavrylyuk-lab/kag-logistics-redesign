import { InternalLink } from '@/components/ui/InternalLink';
import { LogisticsSceneSvg } from '@/components/visuals/LogisticsSceneSvg';

export function Hero() { return <section className="hero" id="hero"><div className="hero-copy"><p className="eyebrow">North American Logistics</p><h1>Bring complex supply chains under control.</h1><p>Managed transportation, dependable capacity, supply-chain technology, and 24/7 logistics expertise—coordinated around your operation.</p><div className="hero-actions"><InternalLink className="button button-primary" to="/quote">Get a Quote</InternalLink><InternalLink className="button" to="/solutions">Explore Solutions</InternalLink></div></div><div className="hero-visual"><LogisticsSceneSvg /></div></section>; }
