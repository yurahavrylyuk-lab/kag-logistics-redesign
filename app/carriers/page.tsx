import Link from 'next/link';
import { CapabilityList } from '@/components/sections/CapabilityList';
import { HubHero } from '@/components/sections/HubHero';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { externalDestinations } from '@/content/destinations';
import { createPageMetadata } from '@/lib/metadata';

const carrierBenefits = ['Clear lane and equipment conversations', 'A practical place to understand the handoff', 'Operational context before you choose a next step'];
export const metadata = createPageMetadata({ title: 'Carriers', description: 'A focused carrier journey for logistics relationships.', path: '/carriers' });

export default function CarriersPage() {
  return <main id="main-content">
    <HubHero eyebrow="Carriers" title="Move with a network that values the work">
      <p>A deliberate starting point for carrier relationships, with the practical information needed to decide whether to start a conversation.</p>
      <Link className="button button-primary" href="/quote">Discuss freight opportunities</Link>
    </HubHero>
    <section className="content-section"><p className="eyebrow">Carrier experience</p><h2>Clarity at every handoff</h2><p>Explore the relationship themes this prototype is designed to support: opportunities, predictable communication, document visibility, and resource access once verified destinations are available.</p><CapabilityList items={carrierBenefits} /><div className="hub-actions"><LinkOrUnavailable destination={externalDestinations.carrierRegistration}>Carrier registration</LinkOrUnavailable><LinkOrUnavailable destination={externalDestinations.carrierResources}>Carrier resources</LinkOrUnavailable></div></section>
  </main>;
}
