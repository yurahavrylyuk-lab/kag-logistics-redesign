import { Link } from '@tanstack/react-router';

const dispatchLanes = [
  { code: 'NA', label: 'North American Coverage' },
  { code: 'MM', label: 'Multimodal Transportation' },
  { code: 'DX', label: 'Dedicated Logistics Experts' },
];

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span className="lane-index">01</span> North American Logistics</p>
        <h1>Bring complex supply chains under control.</h1>
        <p>Managed transportation, dependable capacity, supply-chain technology, and 24/7 logistics expertise—coordinated around your operation.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/quote">Get a Quote</Link>
          <Link className="text-link" to="/solutions">Explore Solutions</Link>
        </div>
      </div>
      <aside aria-label="Dispatch board" className="dispatch-sign">
        <p className="dispatch-kicker">Dispatch board</p>
        <p className="dispatch-figure">24/7</p>
        <span aria-hidden="true" className="chrome-rule" />
        <p className="dispatch-caption">Operations</p>
        <ul>
          {dispatchLanes.map((lane) => (
            <li key={lane.code}><span>{lane.code}</span>{lane.label}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
