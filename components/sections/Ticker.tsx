export function Ticker({ items }: { items: string[] }) {
  return <section aria-label="KAG capabilities" className="ticker"><div className="ticker-track"><div className="ticker-sequence">{items.map((item) => <span key={item}>{item}</span>)}</div><div aria-hidden="true" className="ticker-sequence">{items.map((item) => <span key={item}>{item}</span>)}</div></div></section>;
}
