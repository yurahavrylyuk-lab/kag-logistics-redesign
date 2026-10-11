export function Ticker({ items }: { items: string[] }) {
  return <section aria-label="KAG capabilities" className="ticker"><div className="ticker-track">{items.map((item) => <span key={item}>{item}</span>)}<span aria-hidden="true" className="ticker-duplicate">{items.join(' • ')}</span></div></section>;
}
