import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { staticRouteManifest } from '../src/app/route-manifest';
import { configuredSiteOrigin } from '../src/lib/metadata';

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export async function generateSeo(outputDirectory: string) {
  const origin = configuredSiteOrigin();
  const urls = origin ? staticRouteManifest.map(({ path }) => `  <url><loc>${escapeXml(`${origin}${path}`)}</loc></url>\n`).join('') : '';
  await writeFile(join(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`);
  await writeFile(join(outputDirectory, 'robots.txt'), `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
}
