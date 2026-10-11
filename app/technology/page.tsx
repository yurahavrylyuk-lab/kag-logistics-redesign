import { CapabilityList } from '@/components/sections/CapabilityList';
import { CommandCenterDemo } from '@/components/sections/CommandCenterDemo';
import { HubHero } from '@/components/sections/HubHero';
import { technologyCapabilities, technologySummary } from '@/content/technology';

export default function TechnologyPage() {
  return <main id="main-content">
    <HubHero eyebrow="Technology" title="Operational control at human scale">
      <p>{technologySummary}</p>
      <a className="button button-primary" href="#capabilities">Explore capabilities</a>
    </HubHero>
    <section className="technology-section content-section" id="capabilities">
      <div><p className="eyebrow">Command Center</p><h2>Signal over noise</h2><p>Technology is framed here as operational proof: a clearer picture for the people planning, moving, and resolving freight.</p><CapabilityList items={technologyCapabilities} /></div>
      <CommandCenterDemo />
    </section>
  </main>;
}
