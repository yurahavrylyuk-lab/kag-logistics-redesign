export type MediaAsset = {
  src?: string;
  alt: string;
  status: 'available' | 'needs-approved-asset';
};

export const media = {
  careers: { alt: 'KAG team members collaborating at work', status: 'needs-approved-asset' },
  hero: { alt: 'Industrial logistics terminal', status: 'needs-approved-asset' },
  industries: { alt: 'Freight equipment at an industrial terminal', status: 'needs-approved-asset' },
} satisfies Record<string, MediaAsset>;
