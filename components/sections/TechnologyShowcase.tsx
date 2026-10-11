import Link from 'next/link';
import { technologySummary } from '@/content/technology';
import { CommandCenterDemo } from './CommandCenterDemo';

export function TechnologyShowcase() { return <section className="technology-section content-section"><div className="section-heading"><p className="eyebrow">Technology</p><h2>Your supply chain. Visible.</h2><p>{technologySummary}</p><Link className="button" href="/technology">Explore Technology</Link></div><CommandCenterDemo /></section>; }
