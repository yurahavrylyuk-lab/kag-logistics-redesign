import { HubHero } from '@/components/sections/HubHero';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { externalDestinations } from '@/content/destinations';

export default function CareersPage() {
  return <main id="main-content">
    <HubHero eyebrow="Careers" title="Build what moves industry">
      <p>For people who want their work to have operational weight: solve problems, support customers, and help keep critical supply chains moving.</p>
      <LinkOrUnavailable destination={externalDestinations.jobs}>Search open positions</LinkOrUnavailable>
    </HubHero>
    <section className="content-section careers-story"><p className="eyebrow">People &amp; purpose</p><h2>Work with momentum and responsibility</h2><p>This focused prototype gives careers a purposeful route without inventing open roles, an ATS, or employer claims that have not been supplied and approved.</p></section>
  </main>;
}
