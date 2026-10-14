export type PageMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
  alternates?: { canonical: string };
  openGraph: { title: string; description: string; type: 'website'; url?: string };
  twitter: { card: 'summary'; title: string; description: string };
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function normalizeSiteOrigin(value?: string) {
  if (!value?.trim()) return undefined;
  const url = new URL(value.trim());
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) site origin without credentials');
  }
  return url.origin;
}

export function configuredSiteOrigin() {
  return normalizeSiteOrigin(import.meta.env?.VITE_SITE_URL
    ?? (typeof process === 'undefined' ? undefined : process.env.VITE_SITE_URL));
}

export function createPageMetadata({ title, description, path }: PageMetadataInput, origin = configuredSiteOrigin()): PageMetadata {
  const normalizedOrigin = normalizeSiteOrigin(origin);
  const canonical = normalizedOrigin ? `${normalizedOrigin}${path}` : undefined;
  const pageTitle = `${title} | KAG Logistics`;
  return {
    title: pageTitle,
    description,
    canonicalPath: path,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title: pageTitle, description, type: 'website', url: canonical },
    twitter: { card: 'summary', title: pageTitle, description },
  };
}
