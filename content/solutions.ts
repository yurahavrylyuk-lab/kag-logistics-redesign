export type Solution = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  capabilities: string[];
};

export const solutions: Solution[] = [
  {
    slug: 'transportation-management',
    title: 'Transportation Management',
    eyebrow: 'Control the complete movement',
    summary: 'A coordinated transportation approach for organizations that need a clearer operating picture across their supply chain.',
    capabilities: ['Planning support', 'Carrier coordination', 'Shipment visibility'],
  },
  {
    slug: 'freight-brokerage',
    title: 'Freight Brokerage',
    eyebrow: 'Capacity that keeps moving',
    summary: 'Access a managed carrier network through a single accountable logistics relationship.',
    capabilities: ['Mode flexibility', 'Carrier network access', 'Operational support'],
  },
  {
    slug: 'dedicated-transportation',
    title: 'Dedicated Transportation',
    eyebrow: 'A network built around your operation',
    summary: 'Dedicated transportation support designed around the rhythm and constraints of a specific operation.',
    capabilities: ['Operational continuity', 'Dedicated support', 'Network coordination'],
  },
];
