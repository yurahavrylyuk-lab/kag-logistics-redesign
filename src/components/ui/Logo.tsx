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
  if (size === 'mark' || variant !== 'light') {
    return <img alt="KAG Logistics" height={40} fetchPriority="high" sizes={`${width}px`} src={sources[variant]} width={width} />;
  }

  return <span className="logo"><img alt="KAG Logistics" className="logo-on-light" height={40} fetchPriority="high" sizes={`${width}px`} src={sources.light} width={width} /><img alt="KAG Logistics" className="logo-on-dark" height={40} fetchPriority="high" sizes={`${width}px`} src={sources.dark} width={width} /></span>;
}
