import Link from 'next/link';
import { CapabilityList } from '@/components/sections/CapabilityList';
import { HubHero } from '@/components/sections/HubHero';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { externalDestinations } from '@/content/destinations';
import { createPageMetadata } from '@/lib/metadata';

const carrierBenefits = ['A focused carrier journey', 'Clear operating expectations', 'Support without a fake portal promise'];
export const metadata = createPageMetadata({ title: 'Carriers', description: 'A focused carrier journey for logistics relationships.', path: '/carriers' });

export default function CarriersPage() {
  return <main id="main-content">
    <HubHero eyebrow="Carriers" title="Move with a network that values the work">
      <p>A dedicated starting point for carrier relationships, built with a clear boundary: this prototype does not simulate a registration or carrier portal.</p>
      <Link className="button button-primary" href="/quote">Discuss a shipment</Link>
    </HubHero>
    <section className="content-section"><p className="eyebrow">Carrier experience</p><h2>Direct, practical, and ready to connect</h2><CapabilityList items={carrierBenefits} /><div className="hub-actions"><LinkOrUnavailable destination={externalDestinations.carrierRegistration}>Carrier registration</LinkOrUnavailable><LinkOrUnavailable destination={externalDestinations.carrierResources}>Carrier resources</LinkOrUnavailable></div></section>
  </main>;
}
