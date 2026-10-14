import { Link } from '@tanstack/react-router';
import { solutions } from '@/content/solutions';

export function SolutionsGrid() { return <section className="content-section"><div className="section-heading"><p className="eyebrow">Solutions</p><h2>One coordinated network. Multiple ways to move.</h2></div><div className="solution-grid">{solutions.map((solution) => <Link className="card" to="/solutions/$slug" params={{ slug: solution.slug }} key={solution.slug}><p className="eyebrow">{solution.eyebrow}</p><h3>{solution.title}</h3><p>{solution.summary}</p></Link>)}</div><Link className="text-link" to="/solutions">Explore all solutions →</Link></section>; }
