# KAG Logistics Modern Redesign

Phase-one front-end prototype for KAG Logistics.

Vite + React + TypeScript, TanStack Router, and locally owned shadcn/ui primitives.
The production build prerenders every public route into static HTML, then React
hydrates the interactive features. There is no application backend.

## Run locally

```bash
npm ci
npm run dev
```

For the production-like static site:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

## Verify

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Install Chromium once with `npx playwright install chromium` if needed. The e2e
command builds fresh output and starts its own preview at `http://127.0.0.1:4173`;
stop a manually started preview before running it. Browser checks include all 18
public URLs, JavaScript-disabled content, hydration, quote email preparation,
keyboard navigation, accessibility, motion, responsive layout, and a 500 kB
homepage JavaScript transfer budget.

## Static deployment

Vercel uses the committed `vercel.json` to build and serve `dist/` as a Vite project.
Existing files and generated route documents take precedence over the narrow
extensionless-path fallback. Set `VITE_SITE_URL` to the final public HTTP(S) origin
at build time to generate canonical URLs and populate the sitemap. With no origin,
canonical/OG URLs and sitemap entries are intentionally omitted; no production
domain is invented. Variables prefixed with `VITE_` are public build inputs.

The quote wizard prepares an email addressed to `delta.qoralis@gmail.com`; the user
must send it from their email client. Ship Now remains
`https://www.kaglogistics.com/ship-now-2/`.

See [the architecture guide](docs/architecture.md) for file ownership, route and
content changes, static rendering, import rules, and adding shadcn/ui primitives.
