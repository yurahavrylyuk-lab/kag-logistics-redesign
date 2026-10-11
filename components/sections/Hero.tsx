import Link from 'next/link';
import { LogisticsSceneSvg } from '@/components/visuals/LogisticsSceneSvg';

export function Hero() { return <section className="hero"><div className="hero-copy"><p className="eyebrow">North American Logistics</p><h1>Bring complex supply chains under control.</h1><p>Managed transportation, dependable capacity, supply-chain technology, and 24/7 logistics expertise—coordinated around your operation.</p><div className="hero-actions"><Link className="button button-primary" href="/quote">Get a Quote</Link><Link className="button" href="/solutions">Explore Solutions</Link></div></div><div className="hero-visual"><LogisticsSceneSvg /></div></section>; }
