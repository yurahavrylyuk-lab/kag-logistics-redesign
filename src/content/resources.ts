export type Resource = {
  slug: string;
  category: 'Case Study' | 'Logistics Insight' | 'Industry Update';
  title: string;
  summary: string;
};

export const resources: Resource[] = [
  {
    slug: 'building-supply-chain-control',
    category: 'Logistics Insight',
    title: 'Building a clearer operating picture',
    summary: 'A logistics resource for operating pictures, education, and day-to-day control.',
  },
  {
    slug: 'transportation-management-pattern',
    category: 'Case Study',
    title: 'A transportation management pattern',
    summary: 'An illustrative transportation pattern. Published case studies require verified KAG results.',
  },
  {
    slug: 'visibility-exceptions',
    category: 'Industry Update',
    title: 'Visibility beyond a status update',
    summary: 'An example knowledge-center entry for a future approved editorial program.',
  },
];
