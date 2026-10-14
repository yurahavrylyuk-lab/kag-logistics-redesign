import { Link } from '@tanstack/react-router';
import { industries } from '@/content/industries';

export function IndustrySelector() { return <section className="content-section"><p className="eyebrow">Industry expertise</p><h2>Designed for operations where disruption is not an option.</h2><div className="card-grid">{industries.map((industry) => <Link className="card" to="/industries/$slug" params={{ slug: industry.slug }} key={industry.slug}><h3>{industry.title}</h3><p>{industry.summary}</p></Link>)}</div></section>; }
