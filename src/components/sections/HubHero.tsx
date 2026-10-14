import type { ReactNode } from 'react';

type HubHeroProps = {
  eyebrow: string;
  title: string;
  scene?: string;
  children: ReactNode;
};

export function HubHero({ eyebrow, title, scene, children }: HubHeroProps) {
  return <section className="hub-hero content-section" data-scene={scene}><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div className="hub-hero-copy">{children}</div></section>;
}
