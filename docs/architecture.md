# Architecture

KAG is a Vite + React static application. TanStack Router owns internal navigation;
Node runs React's rendering API only during the build. Deployments serve HTML,
CSS, JavaScript, and local public assets from `dist/`. There is no runtime SSR
framework, application server, quote API, or analytics SDK.

## Ownership and imports

| Location | Responsibility and allowed dependencies |
| --- | --- |
| `src/app/` | Bootstrap, providers, router, route manifest, metadata lifecycle, and static rendering. Composes routes and feature entry points. |
| `src/routes/` | Thin TanStack route definitions, slug validation, route metadata, and page composition. May compose features, components, content, and library helpers. |
| `src/features/quote/` | Quote schema, types, service contract, mailto/mock adapters, wizard, review, progress, and fallback. Consumes shared primitives and the analytics event facade. |
| `src/features/theme/` | Preference storage, resolution, early document script, provider, and toggle. Consumes the analytics event facade. |
| `src/features/motion/` | Progressive section choreography and fine-pointer cursor behavior. Reads the committed pathname through the small app hook. |
| `src/features/analytics/` | Typed, allowlisted event facade and noop adapter. Route tracking follows displayed route matches. |
| `src/components/` | Shared layout, KAG sections, visuals, and UI. Composes content and feature entry points where needed; never imports a route definition or route tree. |
| `src/components/ui/` | Locally owned shadcn/Radix primitives and KAG wrappers. Base primitives use `lib/utils` and semantic style tokens; wrappers may use typed content, router links, and the analytics facade. |
| `src/content/` | Typed factual copy, navigation, local media references, and verified destinations. No React runtime or browser effects; navigation uses router types only. |
| `src/lib/` | Framework-neutral metadata, content lookup, formatting, and class helpers. May consume typed content; no React runtime, hooks, or route imports. |
| `src/styles/globals.css` | KAG design tokens, theme mappings, component styles, Tailwind utility layer, responsive rules, and reduced-motion rules. |
| `public/` | Local assets copied unchanged to output, referenced with absolute paths such as `/logos/kag-dark.svg`. |
| `scripts/` | Build-time prerender/SEO work and the local static preview adapter. Never imported into browser features. |

Use the `@/` alias for `src/`. Keep domain behavior within its feature; other
features may use the typed analytics facade, but should not reach into quote or
theme implementation details. Routes compose features and presentation. Shared
components never import `src/routes` or `routeTree.gen.ts`; content and library
helpers remain usable by Node rendering without a browser.

Two intentional app integration points are reusable below the composition layer:
`useCurrentPathname` follows the committed, displayed route, and `RouteMain` binds
section choreography after its route boundary hydrates. Shared category/detail
templates use `RouteMain`. Keep these narrow integrations free of route imports so
they do not create a dependency back into the generated route tree.

## Adding a route or changing content

1. Add or edit a file under `src/routes/`. Static routes use `createFileRoute`;
   detail families validate `$slug` against the typed content helpers and call
   `notFound()` for missing content. Keep data and domain behavior out of route files.
2. Add fixed-route metadata to `src/app/route-manifest.ts`, or add a detail entry to
   the relevant `src/content/` collection. The manifest derives detail URLs from
   these collections and drives prerendering, metadata, sitemap, and robots output.
3. Run `npm run dev` or `npm run build`. The TanStack Vite plugin regenerates
   `src/routeTree.gen.ts`; commit its generated diff and never edit it by hand.
   `$404.tsx` is the root not-found boundary, deliberately excluded from path generation.
4. Use typed TanStack `Link` destinations/params for internal URLs. External actions
   use ordinary anchors and verified `content/destinations.ts` entries; preserve the
   unavailable state where a destination has not been verified.
5. Extend the route and static/browser tests with a literal expected heading. Check
   a hard refresh and direct JavaScript-disabled access, not only client navigation.

Primary navigation intentionally omits Resources; footer and contextual links keep
the Resources index and detail pages reachable.

## Build and hydration

`npm run build` runs Vite and `scripts/prerender.tsx`. The renderer loads each route
with a memory router, awaits its loaders, and writes hydratable body markup into
the Vite shell. The homepage is `dist/index.html`; other routes use
`dist/<path>/index.html`. The same route manifest generates `sitemap.xml` and
`robots.txt`. Current output contains 18 public documents.

The head includes route metadata, the early theme bootstrap, and absolute bundle
asset paths. `VITE_SITE_URL`, when configured at build time, supplies the normalized
HTTP(S) origin for canonical, Open Graph, sitemap, and robots URLs. Without it,
domain-specific metadata and sitemap entries are omitted. This is a public value.

`src/app/bootstrap.tsx` waits for the browser router to load before hydrating known
static documents. Unknown URLs delivered through the homepage fallback mount the
accessible not-found page instead of hydrating unrelated markup. `RouteHead`
updates metadata on committed client navigation. Static marketing copy stays
visible before JavaScript; quote pages render a telephone fallback and add the
wizard after hydration. The existing fallback node is preserved.

Theme preference uses the early script and hydrated provider. Motion enhances the
already visible markup after hydration, respects reduced motion and coarse
pointers, and rebinds to the displayed route. Floating Ship Now observes the
opening section and suppression regions, including quote controls and the footer.

## Static delivery

`vercel.json` explicitly selects Vite, `npm run build`, and `dist`. Vercel's
high-level `rewrites` check existing files before fallback routing. Generated route
directory indexes, `/assets/` bundles, `/logos/`, `robots.txt`, and `sitemap.xml`
therefore retain their own responses. The fallback matches only extensionless
paths outside the asset/logo namespaces and serves `/index.html`, allowing the
client router's not-found boundary to handle unknown page URLs. Missing files with
extensions do not receive the HTML fallback. No redirect changes the canonical
extensionless URL contract.

This uses the supported high-level rewrite API rather than deprecated `handle`
phases. See [Vercel's routing configuration](https://vercel.com/docs/project-configuration/vercel-json#routes)
and [Vite deployment guidance](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

Vite preview needs a small local adapter because its default extensionless
directory lookup otherwise falls through to the homepage. `scripts/static-preview.ts`
resolves only existing safe directory index files before Vite's normal handlers.
It is preview tooling, not a deployed runtime. Playwright runs a fresh build and
owns its preview on port 4173; it does not reuse a stale development server.
Vercel routing still needs its own deployment smoke check when a preview is created.

## Adding a shadcn/ui primitive

`components.json` is configured for Vite (`rsc: false`), TypeScript, the `@/` alias,
`src/components/ui`, and `src/styles/globals.css`. Source is locally owned; review
generated changes as application code.

1. Confirm an existing interaction needs the primitive and inspect the current UI
   folder first. Add only that component, for example `npx shadcn@latest add tooltip`.
   Review the current CLI/package version before running it and do not use blanket
   overwrite or bulk-install options.
2. Review its source and package/lockfile changes. Keep only dependencies used by
   the adopted primitive. Use `cn` from `@/lib/utils` and semantic tokens such as
   background, foreground, border, ring, and primary; preserve KAG's brand variants.
3. Keep Tailwind as the utility/variant layer. The existing CSS excludes its reset
   to preserve KAG typography and layout; do not replace it with a stock stylesheet.
4. Integrate the primitive into the feature that owns the behavior. Preserve label
   associations, field help/error IDs, keyboard operation, focus, disabled states,
   and both themes. A primitive's presence is not a reason to replace an unrelated
   working interaction.
5. Add behavior tests at the actual consumer boundary, then run lint, typecheck,
   unit/integration tests, build, and the relevant browser/axe checks. Before a
   migration or delivery change, run the full e2e suite as well.

The quote controls currently use Button, Input, Textarea, Field/Label, Select, and
Progress. Sheet is available as a local primitive; mobile navigation currently
retains its dedicated accessible drawer implementation.

## Verification and preservation

Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and
`npm run test:e2e`. Unit/integration tests live under `tests/`, with typed internal
link checks in `tests/types/`; browser tests live under `e2e/`.

Keep the quote recipient `delta.qoralis@gmail.com` and the Ship Now destination
`https://www.kaglogistics.com/ship-now-2/` unchanged. Quote submission prepares a
mail-client draft, never sends to a backend. Verify four data-entry steps followed
by review, validation/focus behavior, the telephone fallback, both themes,
keyboard/mobile navigation, reduced motion, post-hero/suppressed Ship Now states,
and the existing 500,000-byte JavaScript transfer ceiling. Generated output,
Playwright reports, local Vercel state, and environment files stay ignored.
