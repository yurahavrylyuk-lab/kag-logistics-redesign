import Image from 'next/image';

export type LogoVariant = 'light' | 'dark' | 'mono-light' | 'mono-dark' | 'mark';

const sources: Record<LogoVariant, string> = {
  light: '/logos/kag-light.svg',
  dark: '/logos/kag-dark.svg',
  'mono-light': '/logos/kag-mono-light.svg',
  'mono-dark': '/logos/kag-mono-dark.svg',
  mark: '/logos/kag-mark.svg',
};

export function Logo({ variant = 'light', size = 'wordmark' }: { variant?: LogoVariant; size?: 'wordmark' | 'mark' }) {
  const width = size === 'mark' ? 40 : 150;
  return <Image alt="KAG Logistics" height={40} priority sizes={`${width}px`} src={sources[variant]} width={width} />;
}
