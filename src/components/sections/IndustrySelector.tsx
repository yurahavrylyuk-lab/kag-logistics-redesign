import { InternalLink } from '@/components/ui/InternalLink';
import { industries } from '@/content/industries';

export function IndustrySelector() { return <section className="content-section"><p className="eyebrow">Industry expertise</p><h2>Designed for operations where disruption is not an option.</h2><div className="card-grid">{industries.map((industry) => <InternalLink className="card" to={`/industries/${industry.slug}`} key={industry.slug}><h3>{industry.title}</h3><p>{industry.summary}</p></InternalLink>)}</div></section>; }
