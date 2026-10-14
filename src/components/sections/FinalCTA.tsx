import { Link } from '@tanstack/react-router';

export function FinalCTA() { return <section className="final-cta" data-floating-cta-suppress><p className="eyebrow">Ready when you are</p><h2>Ready to simplify your supply chain?</h2><div className="hero-actions"><Link className="button" to="/quote">Talk to a Logistics Expert</Link><Link className="button button-primary" to="/quote">Get a Quote</Link></div></section>; }
