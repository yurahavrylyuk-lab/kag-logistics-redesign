import type { Metadata } from 'next';

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

function normalizeOrigin(origin?: string) {
  if (!origin) return undefined;
  return origin.replace(/\/$/, '');
}

export function createPageMetadata({ title, description, path }: PageMetadataInput, origin = process.env.NEXT_PUBLIC_SITE_URL): Metadata {
  const base = normalizeOrigin(origin);
  const canonical = base ? `${base}${path}` : undefined;
  return {
    title: `${title} | KAG Logistics`,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title: `${title} | KAG Logistics`, description, type: 'website', url: canonical },
    twitter: { card: 'summary', title: `${title} | KAG Logistics`, description },
  };
}

export function configuredSiteOrigin() {
  return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
}
