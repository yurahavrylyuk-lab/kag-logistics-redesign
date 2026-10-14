# KAG Vite, TanStack Router, and Design-System Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js App Router shell with a statically prerendered Vite + TanStack Router application, preserving the complete KAG experience while adopting a focused feature-based architecture and locally owned shadcn/ui primitives.

**Architecture:** Vite builds the browser application and TanStack Router owns every internal URL. A build-time route manifest drives typed dynamic-route validation, static HTML rendering, sitemap/robots generation, and direct-link verification. Presentation remains reusable KAG components; `quote`, `theme`, `motion`, and `analytics` retain ownership of their behavior under `src/features`.

**Tech Stack:** React 19, TypeScript, Vite, `@tanstack/react-router` plus its Vite plugin, Tailwind CSS v4 only for shadcn primitives, shadcn/ui-owned component source, React Hook Form, Zod, Vitest, Testing Library, Playwright, axe-core, and a lightweight `tsx` build script for prerendering.

**Spec:** `docs/superpowers/specs/2026-10-12-kag-vite-tanstack-migration-design.md`

## Global Constraints

- Start from `origin/main` merge commit `6d51ecd`; preserve every current public URL exactly.
- Remove Next.js entirely at cutover; do not keep an App Router compatibility layer or duplicate `app/` and `src/` implementations.
- Preserve the quote contract, including four data-entry steps plus Review & Submit, fallback, and recipient `delta.qoralis@gmail.com`; add no backend/API/CRM behavior.
- Preserve Ship Now as the centralized `https://www.kaglogistics.com/ship-now-2/` URL and preserve intentional unavailable external destinations.
- Preserve the existing KAG visual language, theme behavior, responsive behavior, focus/keyboard semantics, reduced-motion and touch simplification, and no-JavaScript marketing fallback.
- Keep IntersectionObserver as the only viewport trigger and requestAnimationFrame limited to the fine-pointer ambient cursor. Do not introduce WebGL, canvas, Three.js, or a heavy animation library.
- Add only shadcn dependencies needed by adopted primitives. `motion` is removed unless an implementation demonstrates a concrete existing need.
- Output must be deployable as Vite static files to Vercel, including direct links and generated SEO documents.
- Required final checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`.

## Review Focus

- A hard refresh or JavaScript-disabled visit to a nested public route must show the correct full page rather than a Vite shell; cover this in Task 7 static-output tests and Task 8 browser checks.
- A client navigation must reset route-scoped IntersectionObserver and floating-CTA state; cover it in Task 4 unit tests and Task 8 browser checks.
- A route slug that is absent from content must render the router's accessible not-found boundary rather than throwing; cover it in Task 5.
- Browser-only theme and motion code must not access `window` during static rendering; cover it in Task 3 and Task 7.
- Replacing form controls with shadcn primitives must preserve labels, errors, focus, and all quote data; cover it in Task 6.

## File Map

| Area | Files | Responsibility |
| --- | --- | --- |
| Vite/tooling | `package.json`, `package-lock.json`, `vite.config.ts`, `index.html`, `tsconfig.json`, `eslint.config.mjs`, `components.json`, `playwright.config.ts`, `vitest.config.ts`, `.gitignore` | Vite build/test commands, aliases, route generation, shadcn registry, generated-file policy |
| Application | `src/main.tsx`, `src/app/router.tsx`, `src/app/providers.tsx`, `src/app/route-manifest.ts`, `src/app/static-render.tsx`, `src/styles/globals.css` | client bootstrap, providers, route registry, static-render entry, migrated global design tokens/styles |
| Router | `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/about.tsx`, `src/routes/careers.tsx`, `src/routes/carriers.tsx`, `src/routes/technology.tsx`, `src/routes/quote.tsx`, `src/routes/solutions/index.tsx`, `src/routes/solutions/$slug.tsx`, `src/routes/industries/index.tsx`, `src/routes/industries/$slug.tsx`, `src/routes/resources/index.tsx`, `src/routes/resources/$slug.tsx`, `src/routes/$404.tsx`, generated `src/routeTree.gen.ts` | typed route contract, page composition, metadata, not-found behavior |
| Features | move `features/{quote,theme,motion,analytics}/**` to `src/features/**` | behavior-owning domains with framework imports changed to React/TanStack APIs only |
| Components/content | move `components/{layout,sections,visuals}/**`, `components/ui/{Logo,LinkOrUnavailable,ShipNowLink,TrackedLink,Section}.tsx`, `content/**`, and `lib/{route-content,metadata}.ts` under `src/` | shared KAG presentation, content, route-content lookup, framework-neutral metadata |
| shadcn | `src/lib/utils.ts`, `src/components/ui/{button,card,field,input,label,select,sheet,progress,textarea}.tsx` | owned accessible primitives plus KAG variants |
| Static output | `scripts/prerender.tsx`, `scripts/generate-seo.ts`, `src/lib/metadata.ts`, `vercel.json` | HTML documents, sitemap, robots, Vercel deep-link fallback |
| Tests/docs | `tests/test-router.tsx`, updated `tests/**`, updated `e2e/**`, `docs/architecture.md` | router-aware tests, browser checks, architecture/import rules |

### Task 1: Establish Vite, router, and test foundations

**Files:**
- Create: `vite.config.ts`, `index.html`, `src/main.tsx`, `src/app/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/$404.tsx`, `tests/test-router.tsx`, `tests/integration/router-contract.test.tsx`
- Modify: `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`
- Delete at cutover: `next.config.ts`, `next-env.d.ts`

**Interfaces:**
- Produces: `getRouter(): Router`, `renderWithRouter(ui: ReactElement, initialPath?: string)`, and root-route `Outlet` composition for all later route tasks.
- Consumes: React 19 and existing Vitest/Playwright configuration.

- [ ] **Step 1: Write the failing router-contract tests**

```tsx
it('creates a typed route tree that renders the homepage at /', async () => {
  renderWithRouter(<RouterProvider router={getRouter()} />, '/');
  expect(await screen.findByRole('main')).toBeInTheDocument();
});

it('renders the accessible not-found boundary for an unknown path', async () => {
  renderWithRouter(<RouterProvider router={getRouter()} />, '/missing');
  expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the router-contract test and verify it fails**

Run: `npm run test -- tests/integration/router-contract.test.tsx`

Expected: FAIL because the Vite router/test helper does not exist.

- [ ] **Step 3: Add the minimal Vite/TanStack toolchain**

Replace Next scripts with `dev`, `build`, `preview`, and `start` backed by Vite; preserve the existing lint/typecheck/test/e2e command names. Add Vite, `@vitejs/plugin-react`, `@tanstack/react-router`, `@tanstack/router-plugin`, and `tsx`; remove `next`, `eslint-config-next`, and unused `motion`. Configure `@/*` to `src/*`, generated route-tree handling, a static `index.html`, and Playwright against `vite preview --host 127.0.0.1 --port 4173`.

`src/app/router.tsx` creates the browser router from `routeTree`; `src/main.tsx` hydrates it; `tests/test-router.tsx` creates a memory-history router. Keep the initial root/index route minimal enough to make the tests green; later tasks fill it with the real shell and pages.

- [ ] **Step 4: Run foundation checks and observe green**

Run: `npm run typecheck && npm run test -- tests/integration/router-contract.test.tsx && npm run build`

Expected: TypeScript passes, both router assertions pass, and Vite generates client output plus the route tree.

- [ ] **Step 5: Commit the Vite/router foundation**

```bash
git add package.json package-lock.json vite.config.ts index.html tsconfig.json eslint.config.mjs vitest.config.ts playwright.config.ts .gitignore src tests
git commit -m "build: bootstrap Vite and TanStack Router"
```

### Task 2: Install owned shadcn primitives and migrate KAG design tokens

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/field.tsx`, `src/components/ui/input.tsx`, `src/components/ui/label.tsx`, `src/components/ui/select.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/progress.tsx`, `src/components/ui/textarea.tsx`, `tests/integration/shadcn-primitives.test.tsx`
- Move/modify: `app/globals.css` → `src/styles/globals.css`; `components/ui/Button.tsx`, `components/ui/Card.tsx`, `components/ui/Field.tsx` → their explicit `src/components/ui` replacements
- Modify: `package.json`, `package-lock.json`, `src/routes/__root.tsx`

**Interfaces:**
- Produces: KAG variants `Button`, `Card`, `Field`, `Input`, `Label`, `Select`, `Sheet`, `Progress`, and `Textarea`; `cn(...inputs)`; CSS variables compatible with current light/dark tokens.
- Consumes: Task 1 aliases and application root.

- [ ] **Step 1: Write failing primitive accessibility tests**

```tsx
it('associates KAG field labels and invalid messages with their controls', () => {
  render(<Field><Label htmlFor="city">City</Label><Input aria-describedby="city-error" id="city" aria-invalid="true" /></Field>);
  expect(screen.getByLabelText('City')).toHaveAttribute('aria-describedby', 'city-error');
});

it('uses the KAG primary button variant without losing native button semantics', () => {
  render(<Button variant="primary">Continue</Button>);
  expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass('button-primary');
});
```

- [ ] **Step 2: Run the primitive test and verify it fails**

Run: `npm run test -- tests/integration/shadcn-primitives.test.tsx`

Expected: FAIL because the generated primitives and variants do not exist.

- [ ] **Step 3: Configure shadcn/UI ownership and KAG variants**

Add only the shadcn dependencies required for Button/Card, form controls, progress, and the dialog-backed mobile Sheet: Tailwind v4 Vite integration, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, and the specific Radix primitives. Create `components.json` with the `@/` alias. Port current design tokens and non-utility KAG layout/motion CSS to `src/styles/globals.css`; map shadcn variables and component variants to those tokens rather than accepting stock styles.

- [ ] **Step 4: Run primitive and existing visual-component tests**

Run: `npm run test -- tests/integration/shadcn-primitives.test.tsx tests/integration/Logo.test.tsx tests/integration/LinkOrUnavailable.test.tsx`

Expected: PASS; light/dark variables and accessible primitive semantics remain available.

- [ ] **Step 5: Commit the design-system foundation**

```bash
git add components.json package.json package-lock.json src/styles src/lib/utils.ts src/components/ui tests/integration/shadcn-primitives.test.tsx
git commit -m "feat: add KAG shadcn design primitives"
```

### Task 3: Port behavior-owning features under `src/features`

**Files:**
- Move/modify: `features/theme/{ThemeProvider,ThemeScript,ThemeToggle,resolve-theme,theme-storage,types}.ts*` → `src/features/theme/**`; `features/motion/{AmbientCursor,SectionChoreography}.tsx` → `src/features/motion/**`; `features/analytics/{RouteAnalytics,noop-adapter,track,types}.ts*` → `src/features/analytics/**`
- Create: `src/app/providers.tsx`, `tests/integration/app-providers.test.tsx`
- Modify: `tests/integration/{ThemeToggle,MotionEnhancements,FloatingShipNow}.test.tsx`, `tests/unit/{analytics,resolve-theme}.test.ts`, `tests/setup.ts`

**Interfaces:**
- Produces: `AppProviders({ children })`, `useTheme()`, `ThemeBootstrapScript`, `useCurrentPathname()`, `SectionChoreography`, `AmbientCursor`, and existing typed analytics facade.
- Consumes: Task 1 router state and Task 2 shared styles.

- [ ] **Step 1: Write failing provider/static-safety tests**

```tsx
it('renders the provider shell without reading browser globals during static rendering', () => {
  expect(() => renderToStaticMarkup(<AppProviders><span>content</span></AppProviders>)).not.toThrow();
});

it('rebinds choreography after a router pathname change', async () => {
  // render with memory router, navigate from / to /about, and assert observers disconnect/re-observe.
});
```

- [ ] **Step 2: Run the feature migration tests and verify they fail**

Run: `npm run test -- tests/integration/app-providers.test.tsx tests/integration/MotionEnhancements.test.tsx tests/integration/ThemeToggle.test.tsx`

Expected: FAIL because features still import Next navigation/client directives or no provider shell exists.

- [ ] **Step 3: Move features and replace framework coupling**

Keep behavior and test-visible contracts unchanged. Replace `usePathname` with a small TanStack Router pathname selector used by choreography, floating CTA, and analytics. Make all browser work effect-bound and preserve the inline no-flash theme script as `ThemeBootstrapScript`. `AppProviders` composes theme context only; static document composition stays outside effects.

- [ ] **Step 4: Run moved feature tests**

Run: `npm run test -- tests/unit/analytics.test.ts tests/unit/resolve-theme.test.ts tests/integration/app-providers.test.tsx tests/integration/ThemeToggle.test.tsx tests/integration/MotionEnhancements.test.tsx`

Expected: PASS, including current system-theme and reduced-motion assertions.

- [ ] **Step 5: Commit feature migration**

```bash
git add src/features src/app/providers.tsx tests
git commit -m "refactor: move behavioral features into app structure"
```

### Task 4: Port shared KAG components, navigation, and application shell

**Files:**
- Move/modify: `components/layout/{DesktopNavigation,FloatingShipNow,MobileNavigation,SiteFooter,SiteHeader}.tsx` → `src/components/layout/**`; `components/sections/**` → `src/components/sections/**`; `components/visuals/LogisticsSceneSvg.tsx` → `src/components/visuals/LogisticsSceneSvg.tsx`; `components/ui/{Logo,LinkOrUnavailable,ShipNowLink,TrackedLink,Section}.tsx` → `src/components/ui/**`; `content/**` → `src/content/**`; `lib/route-content.ts` → `src/lib/route-content.ts`
- Modify: `src/routes/__root.tsx`, `tests/integration/{SiteHeader,MobileNavigation,FloatingShipNow,HomepageSections,HubRoutes,Logo,LinkOrUnavailable,Ticker,ProcessTimeline,Hero,CommandCenterDemo,DetailPageTemplate,CategoryIndexPages,AboutPage}.test.tsx`, `tests/unit/{navigation,route-content,logo-assets}.test.ts`

**Interfaces:**
- Produces: `AppShell`, `InternalLink` usage through TanStack `Link`, `FloatingShipNow`, shared content imports, and all preserved visual sections.
- Consumes: Tasks 1–3.

- [ ] **Step 1: Add failing router-shell tests**

```tsx
it('uses a typed router link for each primary in-site destination', () => {
  renderWithRouter(<SiteHeader />, '/');
  expect(screen.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
});

it('cleans up and rebinds floating Ship Now observers after client navigation', async () => {
  // use the IntersectionObserver mock, navigate to /about, assert old observers disconnect and the global sentinel is observed.
});
```

- [ ] **Step 2: Run shell tests and verify they fail**

Run: `npm run test -- tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx tests/integration/FloatingShipNow.test.tsx`

Expected: FAIL because shared components still import `next/link` or `next/navigation`.

- [ ] **Step 3: Move shared code and convert navigation APIs**

Use TanStack `Link` for every internal target and native anchors for external destinations, telephone links, hash targets, and unavailable-state content. Replace the hand-built mobile focus trap with the shadcn Sheet only if it maintains current labels, Escape behavior, close-on-navigation, and trigger focus restoration. Root route composes skip link, header, top sentinel, outlet, progressive enhancements, floating CTA, and footer in the existing order.

- [ ] **Step 4: Run shared component, navigation, and motion tests**

Run: `npm run test -- tests/unit/navigation.test.ts tests/unit/route-content.test.ts tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx tests/integration/FloatingShipNow.test.tsx tests/integration/HomepageSections.test.tsx`

Expected: PASS; Resources remains absent from primary navigation but present in the footer, and configured/unavailable destinations remain unchanged.

- [ ] **Step 5: Commit the shared shell migration**

```bash
git add src/components src/content src/lib/route-content.ts src/routes/__root.tsx tests
git commit -m "refactor: port KAG shell and shared components"
```

### Task 5: Implement the complete typed public route tree

**Files:**
- Create: `src/app/route-manifest.ts`, `src/routes/{about,careers,carriers,technology,quote}.tsx`, `src/routes/{solutions,industries,resources}/index.tsx`, `src/routes/{solutions,industries,resources}/$slug.tsx`, `tests/integration/{public-routes,dynamic-route-boundaries}.test.tsx`
- Modify: `src/routes/index.tsx`, `src/routes/$404.tsx`, `src/lib/route-content.ts`, `tests/integration/{AboutPage,HubRoutes,CategoryIndexPages,DetailPageTemplate,CommandCenterDemo}.test.tsx`
- Delete after parity: `app/about/page.tsx`, `app/careers/page.tsx`, `app/carriers/page.tsx`, `app/industries/page.tsx`, `app/industries/[slug]/page.tsx`, `app/page.tsx`, `app/quote/page.tsx`, `app/resources/page.tsx`, `app/resources/[slug]/page.tsx`, `app/solutions/page.tsx`, `app/solutions/[slug]/page.tsx`, `app/technology/page.tsx`

**Interfaces:**
- Produces: `staticRouteManifest: StaticRoute[]`, `getRouteMeta(path: string): PageMetadata`, and route modules that validate `$slug` against `getRouteContent(section, slug)`.
- Consumes: Task 4 components/content and Task 1 generated route tree.

- [ ] **Step 1: Write failing public-route and invalid-slug tests**

```tsx
it.each(['/about', '/technology', '/carriers', '/careers', '/quote', '/solutions', '/industries', '/resources'])('renders %s through TanStack Router', async (path) => {
  renderWithRouter(<RouterProvider router={getRouter()} />, path);
  expect(await screen.findByRole('main')).toBeInTheDocument();
});

it('renders the not-found boundary for /solutions/not-a-real-solution', async () => {
  renderWithRouter(<RouterProvider router={getRouter()} />, '/solutions/not-a-real-solution');
  expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run route tests and verify they fail**

Run: `npm run test -- tests/integration/public-routes.test.tsx tests/integration/dynamic-route-boundaries.test.tsx`

Expected: FAIL because all public route modules and manifest entries do not yet exist.

- [ ] **Step 3: Port page composition into exact route modules**

Recreate every existing page with the same components/copy and `data-choreography` behavior. Dynamic routes derive allowed slugs from `src/content`, call the not-found boundary for invalid parameters, and register their full paths in `staticRouteManifest`. Route metadata has no Next type dependency.

- [ ] **Step 4: Run route and page-composition tests**

Run: `npm run test -- tests/integration/public-routes.test.tsx tests/integration/dynamic-route-boundaries.test.tsx tests/integration/AboutPage.test.tsx tests/integration/HubRoutes.test.tsx tests/integration/CategoryIndexPages.test.tsx tests/integration/DetailPageTemplate.test.tsx`

Expected: PASS for all preserved URLs and content-specific assertions.

- [ ] **Step 5: Commit the typed route tree**

```bash
git add src/routes src/app/route-manifest.ts src/lib/metadata.ts tests/integration
git commit -m "feat: port public routes to TanStack Router"
```

### Task 6: Move the quote feature unchanged onto shadcn controls

**Files:**
- Move/modify: `features/quote/{QuoteExperience,QuoteFallback,QuoteProgress,QuoteReview,QuoteWizard,mailto-service,mock-service,schema,service,types}.ts*` → `src/features/quote/**`
- Create: `tests/integration/quote-shadcn-controls.test.tsx`
- Modify: `src/routes/quote.tsx`, `tests/integration/{QuoteFallback,QuoteWizard}.test.tsx`, `tests/unit/{mailto-service,mock-service,quote-schema}.test.ts`, `e2e/quote.spec.ts`

**Interfaces:**
- Produces: unchanged `QuoteExperience`, `QuoteWizard`, `QuoteSubmissionService`, `buildQuoteMailto`, and `QUOTE_EMAIL_RECIPIENT` interfaces from `src/features/quote`.
- Consumes: Task 2 form primitives and Task 5 quote route.

- [ ] **Step 1: Write the failing shadcn quote-control regression tests**

```tsx
it('keeps a field validation error associated with the focused shadcn input', async () => {
  render(<QuoteWizard />);
  // advance to Route without required values
  expect(screen.getByLabelText('Origin city')).toHaveAttribute('aria-describedby', expect.stringContaining('origin-city-error'));
});

it('still produces a mailto request for the fixed recipient', () => {
  expect(buildQuoteMailto(validRequest)).toContain('mailto:delta.qoralis@gmail.com');
});
```

- [ ] **Step 2: Run quote tests and verify they fail**

Run: `npm run test -- tests/integration/quote-shadcn-controls.test.tsx tests/integration/QuoteWizard.test.tsx tests/unit/mailto-service.test.ts`

Expected: FAIL because quote imports and/or controls have not been migrated.

- [ ] **Step 3: Move quote code with behavior parity**

Use shadcn field primitives only as semantic control presentation; retain React Hook Form, Zod schemas, service interfaces, progress language, review state, loading/error state, and accessible non-JavaScript fallback. Do not alter mailto service output, recipient, or temporary service boundary.

- [ ] **Step 4: Run complete quote tests**

Run: `npm run test -- tests/unit/quote-schema.test.ts tests/unit/mock-service.test.ts tests/unit/mailto-service.test.ts tests/integration/QuoteFallback.test.tsx tests/integration/QuoteWizard.test.tsx tests/integration/quote-shadcn-controls.test.tsx`

Expected: PASS, including all four data-entry steps, review, recovery, and recipient assertions.

- [ ] **Step 5: Commit quote migration**

```bash
git add src/features/quote src/routes/quote.tsx tests e2e/quote.spec.ts
git commit -m "refactor: preserve quote flow with shadcn controls"
```

### Task 7: Add deterministic static rendering, metadata, and SEO files

**Files:**
- Create: `src/app/static-render.tsx`, `scripts/prerender.tsx`, `scripts/generate-seo.ts`, `tests/unit/static-output.test.ts`, `tests/integration/static-render.test.tsx`
- Modify: `src/app/route-manifest.ts`, `src/lib/metadata.ts`, `package.json`, `vite.config.ts`, `index.html`
- Delete after parity: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`

**Interfaces:**
- Produces: `renderStaticRoute(path: string): { html: string; metadata: PageMetadata }`, `staticRouteManifest`, `dist/<path>/index.html`, `dist/sitemap.xml`, and `dist/robots.txt`.
- Consumes: Tasks 3–6 and `VITE_SITE_URL` as an optional normalized build-time origin.

- [ ] **Step 1: Write failing static-render/output tests**

```tsx
it('renders the About route to static HTML with its canonical metadata and full heading', () => {
  const result = renderStaticRoute('/about');
  expect(result.html).toContain('Built to keep complex supply chains moving');
  expect(result.metadata.canonicalPath).toBe('/about');
});

it('writes marketing content, quote fallback, robots, and every manifest URL to dist', async () => {
  await runPrerenderFixture();
  expect(readFileSync('dist/quote/index.html', 'utf8')).toContain('For a quote request, call');
  expect(readFileSync('dist/sitemap.xml', 'utf8')).toContain('/solutions/freight-brokerage');
});
```

- [ ] **Step 2: Run static-render tests and verify they fail**

Run: `npm run test -- tests/integration/static-render.test.tsx tests/unit/static-output.test.ts`

Expected: FAIL because no static render entry or generated output exists.

- [ ] **Step 3: Implement Vite post-build prerendering and SEO generation**

After `vite build`, use `tsx scripts/prerender.tsx` to read Vite's HTML shell, render every manifest path with a memory router via `renderToStaticMarkup`, inject the route-specific root markup/head metadata, and write directory `index.html` documents with absolute asset references. `scripts/generate-seo.ts` derives `sitemap.xml` and `robots.txt` from the same manifest; it must omit a sitemap URL only when `VITE_SITE_URL` is absent.

Ensure render-time code does not invoke effects or browser globals. Preserve the inline theme bootstrap in the static head and fallback quote content in the document body.

- [ ] **Step 4: Run static build and output checks**

Run: `npm run build && npm run test -- tests/integration/static-render.test.tsx tests/unit/static-output.test.ts`

Expected: PASS; `dist/` includes all route documents, sitemap, robots, correct titles/canonicals, and meaningful no-JavaScript content.

- [ ] **Step 5: Commit static delivery work**

```bash
git add src/app/static-render.tsx src/app/route-manifest.ts src/lib/metadata.ts scripts package.json vite.config.ts index.html tests
git commit -m "feat: prerender KAG routes and SEO output"
```

### Task 8: Cut over deployment config and update browser verification

**Files:**
- Create: `vercel.json`, `docs/architecture.md`
- Modify: `playwright.config.ts`, `e2e/{accessibility,floating-ship-now,navigation,no-js,performance,quote,reduced-motion,responsive}.spec.ts`, `.gitignore`, `README.md` if present
- Delete: `app/`, `components/`, `content/`, `features/`, `lib/`, `next.config.ts`, `next-env.d.ts`

**Interfaces:**
- Produces: static-first Vercel deployment configuration, documented feature/import boundaries, and browser suite against the Vite preview server.
- Consumes: the complete `src/` app and static output from Tasks 1–7.

- [ ] **Step 1: Write failing deep-link/no-JavaScript browser assertions**

```ts
test('a JavaScript-disabled nested detail URL renders its route heading and Ship Now destination', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/solutions/freight-brokerage');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('a Vite preview hard refresh resolves every representative direct URL', async ({ page }) => {
  for (const path of ['/', '/about', '/technology', '/quote', '/resources/building-supply-chain-control']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
  }
});
```

- [ ] **Step 2: Run the browser checks and verify they fail before cutover**

Run: `npm run build && npm run test:e2e -- e2e/no-js.spec.ts e2e/navigation.spec.ts`

Expected: FAIL until Vite preview/deep-link configuration and static files are the only runtime path.

- [ ] **Step 3: Complete Vercel/static cutover and remove obsolete source**

Add a narrowly scoped Vercel rewrite fallback that does not override existing files. Update browser server startup to Vite preview. Move all surviving code to `src/`, delete Next-only source/configuration only after equivalent router/static behavior passes, and document architecture, allowed import direction, generated route-tree workflow, and how to add a shadcn primitive.

- [ ] **Step 4: Run browser, accessibility, motion, responsiveness, and performance checks**

Run: `npm run test:e2e`

Expected: PASS for direct navigation, no-JavaScript content, the fixed quote recipient behavior, floating Ship Now on homepage/About/Technology/Quote, keyboard/mobile navigation, reduced motion, axe critical/serious violations, and the existing JavaScript-transfer budget.

- [ ] **Step 5: Commit cutover and verification suite updates**

```bash
git add -A
git commit -m "build: complete Vite static application migration"
```

### Task 9: Execute final full verification and review the branch

**Files:**
- Modify only if verification exposes a concrete regression: the narrow owning source/test file and `docs/superpowers/plans/2026-10-12-kag-vite-tanstack-migration.md` task checkboxes
- Create if needed: `.superpowers/execution-ledger/2026-10-12-kag-vite-tanstack-migration.md` (ignored local execution record)

**Interfaces:**
- Consumes: completed Tasks 1–8.
- Produces: verified branch state and a recorded explanation for any risk ruling or deferred minor issue.

- [ ] **Step 1: Run the complete required suite from a clean build**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Expected: every command exits 0; Vite `dist/` contains static documents and no Next build output is required.

- [ ] **Step 2: Perform a whole-branch review against the specification**

Review router route parity, public/SEO static output, quote recipient/payload, inaccessible JS-free pages, theme bootstrap, shadcn keyboard semantics, external URL configuration, Vercel fallback scope, and removed Next dependencies.

- [ ] **Step 3: Apply one focused regression-test-first fix pass if Critical or Important findings exist**

For each actual-user-impact finding, add a focused regression test, observe RED, make the narrow fix, observe GREEN, and record any ruling. Do not expand scope for Minor findings; record them instead.

- [ ] **Step 4: Re-run the complete required suite after the fix pass**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Expected: all commands exit 0 after the final change set.

- [ ] **Step 5: Commit only verified final fixes**

```bash
git add <owning-source-and-regression-test-files>
git commit -m "fix: address Vite migration review findings"
```

Skip this commit if review finds no Critical/Important issues.

## Commit Boundaries

1. `build: bootstrap Vite and TanStack Router`
2. `feat: add KAG shadcn design primitives`
3. `refactor: move behavioral features into app structure`
4. `refactor: port KAG shell and shared components`
5. `feat: port public routes to TanStack Router`
6. `refactor: preserve quote flow with shadcn controls`
7. `feat: prerender KAG routes and SEO output`
8. `build: complete Vite static application migration`
9. Optional verified review-fix commit only

## Plan Self-Review

- **Spec coverage:** Tasks 1, 5, 7, and 8 cover Vite, all router routes, prerendering, direct links, and SEO. Tasks 2 and 6 cover owned shadcn primitives and form behavior. Tasks 3 and 4 preserve theme/motion/analytics and global layout. Tasks 6–8 preserve quote, no-JavaScript, navigation, Ship Now, and responsive/accessibility behavior. Task 9 covers final verification/review.
- **Step scan:** Each task begins with a named failing test, validates the failure, defines the responsible implementation surface, then verifies and commits. No task depends on an unspecified interface.
- **Type consistency:** `staticRouteManifest` and `getRouteMeta` are introduced in Task 5 and consumed by Task 7; `renderStaticRoute` is introduced in Task 7 and exercised in Task 8; `getRouter`/`renderWithRouter` originate in Task 1 and are used by later tests.
- **Review Focus:** The five likely cross-cutting regressions are assigned to Tasks 3–8 and have concrete test steps.
- **Proportion:** The plan identifies every architectural file family and the exact route/static contracts without transcribing component implementations.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-12-kag-vite-tanstack-migration.md`. Please review the plan and choose an execution approach:

- **Subagent-driven** — a fresh subagent implements each task and a fresh reviewer checks it before the next one; highest assurance for this migration, but more context and turnaround cost.
- **Native** — I execute the tasks sequentially in this session and request one fresh whole-branch review at the end; faster, but independent review occurs only after implementation.

For this migration I recommend **Subagent-driven**, because router/static-render/tooling changes have independent, high-impact verification boundaries and accidental loss of no-JavaScript/SEO behavior would be costly. Does the plan capture what you want, and which approach should we use?
