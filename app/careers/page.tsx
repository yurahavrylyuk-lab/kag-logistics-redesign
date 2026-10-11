import { HubHero } from '@/components/sections/HubHero';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { externalDestinations } from '@/content/destinations';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({ title: 'Careers', description: 'A careers route for people who help keep critical supply chains moving.', path: '/careers' });

export default function CareersPage() {
  return <main id="main-content">
    <HubHero eyebrow="Careers" title="Build what moves industry">
      <p>For people who want their work to have operational weight: solve problems, support customers, and help keep critical supply chains moving.</p>
      <LinkOrUnavailable destination={externalDestinations.jobs}>Search open positions</LinkOrUnavailable>
    </HubHero>
    <section className="content-section careers-story"><p className="eyebrow">People &amp; purpose</p><h2>Work with momentum and responsibility</h2><div className="card-grid"><article className="card"><h3>Career Growth</h3><p>Explore work that develops operational judgment, collaboration, and the confidence to take ownership.</p></article><article className="card"><h3>Training &amp; learning</h3><p>See how a people-first logistics story can make room for continued learning across the work.</p></article><article className="card"><h3>Benefits &amp; wellbeing</h3><p>Use this route to understand the benefits conversation before official, verified details are provided.</p></article><article className="card"><h3>Life at KAG</h3><p>A warmer view of the people, safety mindset, and shared responsibility behind the movement of freight.</p></article></div><p>Open positions remain intentionally unavailable until a verified job-search destination is configured.</p></section>
  </main>;
}
