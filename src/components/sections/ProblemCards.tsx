import { Link } from '@tanstack/react-router';

const problems = [{ title: 'Capacity', copy: 'Need dependable transportation capacity?' }, { title: 'Visibility', copy: 'Need a clearer view of shipments in motion?' }, { title: 'Cost', copy: 'Need more control over transportation spend?' }, { title: 'Complexity', copy: 'Managing too many transportation vendors?' }];

export function ProblemCards() { return <section className="content-section"><p className="eyebrow">The operating challenge</p><h2>What’s slowing your supply chain down?</h2><div className="card-grid">{problems.map((problem) => <Link className="card" to="/solutions/$slug" params={{ slug: 'freight-brokerage' }} key={problem.title}><h3>{problem.title}</h3><p>{problem.copy}</p><span>Explore solution →</span></Link>)}</div></section>; }
