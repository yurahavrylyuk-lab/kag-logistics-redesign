export type Industry = {
  slug: string;
  title: string;
  summary: string;
};

export const industries: Industry[] = [
  {
    slug: 'chemicals',
    title: 'Chemicals',
    summary: 'Transportation planning for complex, controlled supply chains.',
  },
  {
    slug: 'energy-renewables',
    title: 'Energy & Renewables',
    summary: 'Network coordination for time-sensitive and operationally demanding movement.',
  },
  {
    slug: 'food-beverage',
    title: 'Food & Beverage',
    summary: 'Visibility and transportation support for products that need dependable flow.',
  },
];
