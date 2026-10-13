import { InternalLink } from '@/components/ui/InternalLink';
import { resources } from '@/content/resources';

export function CaseStudyCards() { return <section className="content-section"><p className="eyebrow">Results, not promises</p><h2>Trust starts with a clearer operating model.</h2><div className="card-grid">{resources.slice(0, 2).map((resource) => <InternalLink className="card" to={`/resources/${resource.slug}`} key={resource.slug}><p className="eyebrow">{resource.category}</p><h3>{resource.title}</h3><p>{resource.summary}</p></InternalLink>)}</div></section>; }
