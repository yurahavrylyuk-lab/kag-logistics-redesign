import { Link } from '@tanstack/react-router';

const problems = [
  { title: 'Capacity', copy: 'Need dependable transportation capacity?' },
  { title: 'Visibility', copy: 'Need a clearer view of shipments in motion?' },
  { title: 'Cost', copy: 'Need more control over transportation spend?' },
  { title: 'Complexity', copy: 'Managing too many transportation vendors?' },
];

export function ProblemCards() {
  return (
    <section className="content-section">
      <p className="eyebrow">The operating challenge</p>
      <h2>What’s slowing your supply chain down?</h2>
      <div className="lane-list">
        {problems.map((problem, index) => (
          <Link className="lane" to="/solutions/$slug" params={{ slug: 'freight-brokerage' }} key={problem.title}>
            <span className="lane-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{problem.title}</h3>
            <p>{problem.copy}</p>
            <span className="lane-action">Explore solution →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
