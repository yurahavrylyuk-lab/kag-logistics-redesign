import { RouteMain } from '@/app/RouteMain';
import { createFileRoute, Link } from '@tanstack/react-router';
import { CapabilityList } from '@/components/sections/CapabilityList';
import { HubHero } from '@/components/sections/HubHero';
import { LinkOrUnavailable } from '@/components/ui/LinkOrUnavailable';
import { externalDestinations } from '@/content/destinations';

const carrierBenefits = ['Clear lane and equipment conversations', 'A practical place to understand the handoff', 'Operational context before you choose a next step'];

function CarriersPage() {
  return <RouteMain id="main-content">
    <HubHero eyebrow="Carriers" scene="carriers" title="Move with a network that values the work">
      <p>A deliberate starting point for carrier relationships, with the practical information needed to decide whether to start a conversation.</p>
      <Link className="button button-primary" to="/quote">Discuss freight opportunities</Link>
    </HubHero>
    <section className="content-section"><p className="eyebrow">Carrier experience</p><h2>Clarity at every handoff</h2><p>Explore the relationship themes this page is designed to support: opportunities, predictable communication, document visibility, and resource access once verified destinations are available.</p><CapabilityList items={carrierBenefits} /><div className="hub-actions"><LinkOrUnavailable destination={externalDestinations.carrierRegistration}>Carrier registration</LinkOrUnavailable><LinkOrUnavailable destination={externalDestinations.carrierResources}>Carrier resources</LinkOrUnavailable></div></section>
  </RouteMain>;
}

export const Route = createFileRoute('/carriers')({ component: CarriersPage });
