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

export function configuredSiteOrigin() {
  return import.meta.env.VITE_SITE_URL?.replace(/\/$/, '');
}

export function createPageMetadata({ title, description, path }: PageMetadataInput, origin = configuredSiteOrigin()): PageMetadata {
  const canonical = origin ? `${origin.replace(/\/$/, '')}${path}` : undefined;
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
