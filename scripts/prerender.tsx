import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadEnv } from 'vite';
import { ThemeBootstrapScript } from '../src/features/theme/ThemeScript';

// Match Vite's production .env loading before the route manifest is evaluated.
const env = loadEnv('production', process.cwd(), 'VITE_');
if (process.env.VITE_SITE_URL === undefined && env.VITE_SITE_URL !== undefined) {
  process.env.VITE_SITE_URL = env.VITE_SITE_URL;
}
const { staticRouteManifest } = await import('../src/app/route-manifest');
const { renderStaticRoute } = await import('../src/app/static-render');
const { generateSeo } = await import('./generate-seo');
const outputDirectory = resolve(process.argv[2] ?? 'dist');
const shell = await readFile(join(outputDirectory, 'index.html'), 'utf8');
if (!shell.includes('<!--app-head-->') || !shell.includes('<!--app-html-->')) {
  throw new Error('Vite HTML shell is missing static rendering placeholders');
}

for (const { path } of staticRouteManifest) {
  const { html, metadata } = await renderStaticRoute(path);
  const head = renderToStaticMarkup(<>
    <ThemeBootstrapScript />
    <meta name="theme-color" content="#f5f5f2" />
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
    {metadata.alternates ? <link rel="canonical" href={metadata.alternates.canonical} /> : null}
    <meta property="og:title" content={metadata.openGraph.title} />
    <meta property="og:description" content={metadata.openGraph.description} />
    <meta property="og:type" content={metadata.openGraph.type} />
    {metadata.openGraph.url ? <meta property="og:url" content={metadata.openGraph.url} /> : null}
    <meta name="twitter:card" content={metadata.twitter.card} />
    <meta name="twitter:title" content={metadata.twitter.title} />
    <meta name="twitter:description" content={metadata.twitter.description} />
  </>);
  const document = shell.replace(/<title>[^<]*<\/title>/, '').replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
  const directory = join(outputDirectory, path);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), document);
}
await generateSeo(outputDirectory);
console.log(`Prerendered ${staticRouteManifest.length} routes and generated sitemap.xml + robots.txt.`);
