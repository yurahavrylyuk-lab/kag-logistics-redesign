# KAG Logistics

This is a Vite + React static application with TanStack Router. Read
`docs/architecture.md` for ownership, import boundaries, route generation,
static delivery, and the locally owned shadcn/ui workflow.

Preserve the public URL manifest, no-JavaScript route content and quote fallback,
the configured quote recipient and Ship Now destination, accessible controls,
theme behavior, and reduced-motion support.

Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and
`npm run test:e2e` before completing application changes. The browser suite builds
and starts its own Vite preview on port 4173. Do not hand-edit
`src/routeTree.gen.ts` or generated `dist/` output.

## Cursor Cloud specific instructions

jsdom and undici require Node.js 22.22.2 or newer. Login shells prepend
`/usr/local/lib/nodejs/bin` (Node.js 22.23.3). An older `node` can appear earlier
on `PATH` as `/exec-daemon/node`; use `node -v` from a login shell before running
tests. The dev server listens on port 5173 (`npm run dev -- --host 0.0.0.0 --port 5173`).
`npm run test:e2e` does not reuse it. Install Playwright's Chromium with
`npx playwright install chromium` before the browser suite.
