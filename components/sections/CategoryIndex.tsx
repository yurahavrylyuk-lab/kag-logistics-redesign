import Link from 'next/link';

type Entry = { slug: string; title: string; summary: string; eyebrow?: string; category?: string };

export function CategoryIndex({ entries, section, summary, title }: { entries: Entry[]; section: 'solutions' | 'industries' | 'resources'; summary: string; title: string }) {
  return <main id="main-content"><section className="detail-hero content-section"><p className="eyebrow">KAG Logistics prototype</p><h1>{title}</h1><p>{summary}</p></section><section className="content-section"><div className="card-grid">{entries.map((entry) => <Link className="card" href={`/${section}/${entry.slug}`} key={entry.slug}><p className="eyebrow">{entry.eyebrow ?? entry.category ?? section}</p><h2>{entry.title}</h2><p>{entry.summary}</p></Link>)}</div></section></main>;
}
