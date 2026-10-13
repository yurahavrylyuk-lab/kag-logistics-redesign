import { InternalLink } from '@/components/ui/InternalLink';
import { resources } from '@/content/resources';

export function Resources() { return <section className="content-section"><p className="eyebrow">Insights</p><h2>Stay close to the movement shaping logistics.</h2><div className="card-grid">{resources.map((resource) => <InternalLink className="card" to={`/resources/${resource.slug}`} key={resource.slug}><p className="eyebrow">{resource.category}</p><h3>{resource.title}</h3></InternalLink>)}</div></section>; }
