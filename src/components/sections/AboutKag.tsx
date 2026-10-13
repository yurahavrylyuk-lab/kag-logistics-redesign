import { Link } from '@tanstack/react-router';
import { aboutSummary } from '@/content/about';
export function AboutKag() { return <section className="about-kag content-section"><p className="eyebrow">Company</p><h2>About KAG Logistics</h2><p>{aboutSummary}</p><div className="about-signals"><strong>People</strong><strong>Network</strong><strong>Technology</strong></div><Link className="text-link" to="/about">Discover KAG Logistics →</Link></section>; }
