import { Link } from '@tanstack/react-router';
import type { RouteContent, RouteSection } from '@/lib/route-content';
import { CapabilityList } from './CapabilityList';
import { RouteAnalytics } from '@/features/analytics/RouteAnalytics';

type DetailPageTemplateProps = {
  content: RouteContent;
  section: RouteSection;
};

export function DetailPageTemplate({ content, section }: DetailPageTemplateProps) {
  const capabilities = 'capabilities' in content ? content.capabilities : [];
  const eyebrow = 'eyebrow' in content ? content.eyebrow : 'KAG Logistics prototype';

  return (
    <main id="main-content">
      {section === 'solutions' ? <RouteAnalytics event="solution_viewed" properties={{ solutionId: content.slug, source: 'detail-page' }} /> : null}
      <section className="detail-hero content-section">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.summary}</p>
        <Link className="button button-primary" to="/quote">Request pricing</Link>
      </section>
      <section className="content-section detail-body">
        <p className="eyebrow">Designed to explore</p>
        <h2>A focused prototype detail pattern</h2>
        {'category' in content ? <p>{content.category}. This representative page is a structured content pattern, not a published case study or editorial claim.</p> : <p>This representative page is designed to route visitors into a focused conversation about operational needs.</p>}
        {capabilities.length > 0 ? <CapabilityList items={capabilities} /> : null}
        <Link className="text-link" to={section === 'resources' ? '/technology' : '/quote'}>{section === 'resources' ? 'Explore Technology' : 'Start a shipment conversation'} →</Link>
      </section>
    </main>
  );
}
