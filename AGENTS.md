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
