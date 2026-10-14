import { SupplyChainVisibility } from '@/components/visuals/SupplyChainVisibility';

const shipments = [
  { route: 'Cleveland → Toronto', state: 'In transit', eta: 'ETA 14:20', carrier: 'Carrier confirmed' },
  { route: 'Houston → Chicago', state: 'Attention needed', eta: 'Appointment review', carrier: 'Document available' },
  { route: 'Columbus → Nashville', state: 'Planned', eta: 'Pickup scheduled', carrier: 'Carrier assigned' },
  { route: 'Detroit → Indianapolis', state: 'Delivered', eta: 'Delivered 09:10', carrier: 'Proof available' },
];

export function CommandCenterDemo() {
  return <section aria-label="Illustrative Command Center" className="command-center">
    <div className="command-map"><p>Illustrative shipment visibility view</p><SupplyChainVisibility /><p className="supply-stops"><span>Origin</span><span>Transfer point</span><span>Destination</span></p><small>Illustrative data — not connected to live KAG systems.</small></div>
    <div className="shipment-list">{shipments.map((shipment) => <article key={shipment.route}><strong>{shipment.route}</strong><span className={`status status-${shipment.state.toLowerCase().replaceAll(' ', '-')}`}>{shipment.state}</span><span>{shipment.eta}</span><span>{shipment.carrier}</span></article>)}</div>
    <aside aria-label="Operational summary" className="command-kpis"><strong>Operational summary</strong><span>On-time focus</span><span>Exception review</span><span>Documents ready</span><ul aria-label="Shipment status legend"><li><span className="status status-planned">Planned</span></li><li><span className="status status-in-transit">In transit</span></li><li><span className="status status-attention-needed">Attention needed</span></li><li><span className="status status-delivered">Delivered</span></li></ul></aside>
  </section>;
}
