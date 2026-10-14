import { Link } from '@tanstack/react-router';
import { resources } from '@/content/resources';

export function Resources() {
  return <section className="content-section">
    <p className="eyebrow">Insights</p>
    <h2>Stay close to the movement shaping logistics.</h2>
    <div className="card-grid">{resources.map((resource) => <Link className="card" key={resource.slug} params={{ slug: resource.slug }} to="/resources/$slug"><p className="eyebrow">{resource.category}</p><h3>{resource.title}</h3><p>{resource.summary}</p></Link>)}</div>
  </section>;
}
