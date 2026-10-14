import { Link } from '@tanstack/react-router';
import { solutions } from '@/content/solutions';

export function SolutionsGrid() {
  return (
    <section className="content-section solutions-section">
      <div className="section-heading">
        <p className="eyebrow">Solutions</p>
        <h2>One coordinated network. Multiple ways to move.</h2>
        <Link className="text-link" to="/solutions">Explore all solutions →</Link>
      </div>
      <div className="solution-lanes">
        {solutions.map((solution, index) => (
          <Link className="solution-lane" to="/solutions/$slug" params={{ slug: solution.slug }} key={solution.slug}>
            <p className="eyebrow"><span className="lane-index">{String(index + 1).padStart(2, '0')}</span> {solution.eyebrow}</p>
            <h3>{solution.title}</h3>
            <p>{solution.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
