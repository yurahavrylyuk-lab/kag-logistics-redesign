export type MediaAsset = {
  src: string;
  alt: string;
};

export const media = {
  careers: { src: '/media/careers-team.jpg', alt: 'KAG team members collaborating at work' },
  hero: { src: '/media/hero-terminal.jpg', alt: 'Industrial logistics terminal' },
  industries: { src: '/media/industry-terminal.jpg', alt: 'Freight equipment at an industrial terminal' },
} satisfies Record<string, MediaAsset>;
