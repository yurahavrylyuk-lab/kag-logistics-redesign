# KAG Logistics Modern Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the phase-one KAG Logistics prototype: a conversion-led, accessible, high-performance flagship homepage with focused Technology, Carriers, Careers, and Quote experiences.

**Architecture:** Use a Next.js App Router application with TypeScript and server-rendered marketing content by default. Keep client boundaries narrow: theme control, navigation drawer/menus, selective motion, and the quote wizard. Store editorial content, media references, and destination configuration in typed modules; use reusable detail-page patterns for representative solution, industry, and resource routes.

**Tech Stack:** Next.js App Router (latest stable at implementation time), TypeScript (strict), React, CSS Modules plus global token CSS, `motion` for nontrivial optional interaction motion, React Hook Form + Zod for the quote wizard, Vitest + React Testing Library, Playwright + axe-core/playwright, `next/image`, and a self-hosted IBM Plex Sans variable font.

**Spec:** `docs/superpowers/specs/2026-10-11-kag-modern-redesign-design.md`

## Stack decisions

| Decision | Recommendation and rationale |
| --- | --- |
| Framework | **Next.js App Router + TypeScript + React.** It provides static/server rendering, route-level metadata, filesystem routing, code splitting, and a clean server/client split appropriate to marketing pages. Node 24.18 satisfies Next.js's documented Node 20.9+ minimum. |
| Styling | **CSS Modules plus global token CSS**, not Tailwind. The visual system has a substantial semantic-token and responsive-art-direction layer; named CSS remains easier to audit for theme, motion, and no-JS behavior without utility-string drift. |
| Font | **IBM Plex Sans variable**, self-hosted through `next/font/local`. It has the industrial/technical clarity requested, broad UI-oriented family support, and OFL licensing. Use one variable family to protect performance. |
| Forms | **React Hook Form + Zod + `@hookform/resolvers`**. This provides client-side validation, accessible field error wiring, typed data transfer, and testable schema/service boundaries without a backend. |
| Motion | CSS for transitions, marquee, and route stroke animation; **`motion`** only for client components that genuinely need reveal orchestration or pointer-aware interaction. Respect the spec's tokens and reduced-motion behavior. |
| Hero | **SVG/CSS first.** An authored SVG logistics scene is the phase-one implementation. No Three.js/React Three Fiber dependency is installed initially. A separate measured comparison is required before adding WebGL. |
| Testing | **Vitest + React Testing Library** for units/integration; **Playwright + axe-core/playwright** for browser and accessibility checks. This matches the official Next.js testing guidance without making server-component unit tests a dependency. |
| Media | Local, centrally configured images/SVGs behind `media.ts`; `next/image` for raster assets. Use art-directed placeholders only in the registry; never scatter remote URLs. |

## Exact phase-one route scope

| Delivery | Route(s) |
| --- | --- |
| Fully implemented experiences | `/`, `/technology`, `/carriers`, `/careers`, `/quote` |
| Reusable polished prototype/detail templates | `/solutions/[slug]`, `/industries/[slug]`, `/resources/[slug]`, and `/company` if its verified content fits the shared information-page pattern |
| Representative content at launch | Three approved solution entries, three industry entries, and three resource entries; additional content is added only through typed collections and valid static params |
| Excluded | A unique, deeply authored route for every sitemap item; production login, ATS, carrier portal, or CRM flows |

The active header/footer is rendered from `navigation.ts`; it exposes only implemented internal routes or verified configured external destinations. `Customer Login`, `Ship Now`, job search, carrier portal/resource, legal, and other external actions are omitted or rendered as an accessible unavailable state until a URL is configured. Never use `href="#"` or a fabricated URL.

## Planned project structure

```text
app/
  layout.tsx                         # document shell, metadata, theme bootstrap
  page.tsx                           # homepage composition
  quote/page.tsx                     # canonical standalone quote experience
  technology/page.tsx                # focused hub
  carriers/page.tsx                  # focused hub
  careers/page.tsx                   # focused hub
  solutions/[slug]/page.tsx          # shared detail route
  industries/[slug]/page.tsx         # shared detail route
  resources/[slug]/page.tsx          # shared detail route
  company/page.tsx                   # shared info template only if content is approved
  globals.css                         # tokens, reset, base, no-JS/reduced-motion rules
  sitemap.ts                          # generated only from delivered routes
  robots.ts                           # environment-safe robots rules
components/
  ui/                                 # Button, LinkOrUnavailable, Card, Field, Section, Logo
  layout/                             # SiteHeader, nav variants, SiteFooter
  sections/                           # focused homepage/hub sections
  visuals/                            # LogisticsSceneSvg, CommandCenterDemo
features/
  theme/                              # ThemeProvider, useTheme, theme utilities
  quote/                              # schema, types, service, mock service, wizard and steps
  analytics/                          # AnalyticsAdapter and no-op implementation
content/
  navigation.ts, destinations.ts, media.ts, solutions.ts, industries.ts,
  resources.ts, company.ts, contact.ts, technology.ts
lib/
  route-content.ts, metadata.ts, cn.ts
public/
  logos/, icons/, media/, fonts/
tests/
  unit/, integration/
e2e/
  homepage.spec.ts, quote.spec.ts, navigation.spec.ts, accessibility.spec.ts
```

## Global Constraints

- Fully deliver `/`, `/technology`, `/carriers`, `/careers`, and `/quote`; use polished reusable detail templates for representative solution, industry, resource, and approved company content.
- No `href="#"`, invented production destinations, fake login/ATS/carrier portals, or scattered external URLs.
- Use semantic light/dark tokens; `system` preference follows live OS changes, while explicit `light`/`dark` does not.
- Render a deliberate SVG/CSS hero and static reduced-motion/mobile fallback; add WebGL only after a measured, approved comparison meets the spec performance budget.
- Keep all Command Center data permanently labeled illustrative; do not imply live KAG systems or fabricate KAG metrics.
- Honor `prefers-reduced-motion`; use motion tokens and no layout-affecting continuous animation.
- Target WCAG 2.2 AA, Lighthouse Performance ≥90 where realistic, Accessibility/Best Practices/SEO ≥95, LCP ≤2.5s, CLS ≤0.10, and INP ≤200ms where measurable.
- Without JavaScript, marketing content, essential contact information, and technically available navigation remain usable; the quote area supplies a usable fallback contact action.
- Quote flow is exactly four numbered data-entry steps followed by an unnumbered Review & Submit state; success/error are result states.
- Follow TDD: write and observe each focused failing test before implementation; make focused commits after every independently reviewable task.

## Review Focus

1. **No-JS / slow-JS page load:** the homepage remains readable and the quote region shows a usable fallback action; covered by Task 10 Playwright JavaScript-disabled test.
2. **OS theme change after choosing system:** the resolved theme updates only when preference is `system`, while explicit choices persist; covered by Task 2 theme controller integration tests.
3. **Unconfigured external action:** navigation never emits a fake or `#` link and communicates an intentional unavailable state; covered by Task 3 component tests.
4. **Quote failure after data entry:** network/server failure preserves entered values, announces the error, and makes retry usable; covered by Task 7 integration and E2E tests.
5. **Reduced-motion mobile view:** the hero and marquee stay visually complete without WebGL/continuous animation or overflow; covered by Tasks 5 and 10 browser tests.

---

### Task 1: Bootstrap the strict Next.js application and quality harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tests/setup.ts`, `tests/unit/smoke.test.ts`
- Create: `.gitignore`, `README.md`

**Interfaces:**
- Produces: `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build` scripts used by all later tasks.

- [ ] **Step 1: Write the failing smoke test**

```ts
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('runs TypeScript tests', () => expect(true).toBe(true));
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `npm run test -- tests/unit/smoke.test.ts`

Expected: FAIL because test tooling is not configured.

- [ ] **Step 3: Scaffold the app with strict TypeScript and the selected test/lint configuration**

Use the latest stable Next.js App Router scaffold, then add only these dependencies: `motion`, `react-hook-form`, `zod`, `@hookform/resolvers`, Vitest, React Testing Library, `@testing-library/user-event`, jsdom, Playwright, and `@axe-core/playwright`. Pin resolved versions in the lockfile. Configure the test aliases to match `@/*`.

- [ ] **Step 4: Run baseline checks**

Run: `npm run lint && npm run typecheck && npm run test -- tests/unit/smoke.test.ts && npm run build`

Expected: PASS, production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs vitest.config.ts playwright.config.ts app tests .gitignore README.md
git commit -m "chore: bootstrap KAG Next.js prototype"
```

### Task 2: Implement design tokens and theme resolution

**Files:**
- Create: `features/theme/types.ts`, `features/theme/theme-storage.ts`, `features/theme/resolve-theme.ts`, `features/theme/ThemeProvider.tsx`, `features/theme/ThemeToggle.tsx`
- Modify: `app/layout.tsx`, `app/globals.css`
- Test: `tests/unit/resolve-theme.test.ts`, `tests/integration/ThemeToggle.test.tsx`

**Interfaces:**
- Produces: `ThemePreference = 'light' | 'dark' | 'system'`, `resolveTheme(preference, systemDark): 'light' | 'dark'`, `ThemeProvider`, and `ThemeToggle`.
- Consumes: document root `data-theme`, local storage, and `matchMedia('(prefers-color-scheme: dark)')`.

- [ ] **Step 1: Write failing theme tests**

```ts
it('uses the current OS value and subscribes only for system preference', () => {
  expect(resolveTheme('system', true)).toBe('dark');
  expect(resolveTheme('light', true)).toBe('light');
});

it('persists an explicit preference and exposes the resolved document theme', async () => {
  // render ThemeProvider + ThemeToggle; select dark; assert storage and data-theme
});
```

- [ ] **Step 2: Run the theme test files to verify failure**

Run: `npm run test -- tests/unit/resolve-theme.test.ts tests/integration/ThemeToggle.test.tsx`

Expected: FAIL because theme modules do not exist.

- [ ] **Step 3: Implement theme resolution, early no-flash initialization, and token CSS**

Implement the exact `ThemePreference` type above. Set root semantic tokens, typography/spacing/radius/z-index/motion tokens, light/dark colors, focus ring, and reduced-motion CSS. Add a minimal inline document bootstrap that reads the persisted preference before hydration. `ThemeProvider` listens to media-query changes only while preference is `system`.

- [ ] **Step 4: Run tests and a manual theme-flash check**

Run: `npm run test -- tests/unit/resolve-theme.test.ts tests/integration/ThemeToggle.test.tsx && npm run build`

Expected: PASS; build emits no hydration error.

- [ ] **Step 5: Commit**

```bash
git add app features/theme tests
git commit -m "feat: add accessible persistent theme system"
```

### Task 3: Create centralized content, media, and destination configuration

**Files:**
- Create: `content/navigation.ts`, `content/destinations.ts`, `content/media.ts`, `content/solutions.ts`, `content/industries.ts`, `content/resources.ts`, `content/contact.ts`, `content/technology.ts`
- Create: `components/ui/LinkOrUnavailable.tsx`, `lib/route-content.ts`
- Test: `tests/unit/route-content.test.ts`, `tests/integration/LinkOrUnavailable.test.tsx`

**Interfaces:**
- Produces: `ExternalDestination = { kind: 'url'; href: string } | { kind: 'unavailable'; message: string }`, `getRouteContent(section, slug)`, and `LinkOrUnavailable`.
- Consumes: Route slugs from page templates and navigation items.

- [ ] **Step 1: Write failing content/destination tests**

```ts
it('returns content only for an approved representative slug', () => {
  expect(getRouteContent('solutions', 'freight-brokerage')?.title).toBeTruthy();
});

it('does not render an anchor when an external destination is unavailable', () => {
  // render LinkOrUnavailable({ kind: 'unavailable', message: 'Not configured' })
  // expect no href and an accessible explanation
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/unit/route-content.test.ts tests/integration/LinkOrUnavailable.test.tsx`

Expected: FAIL because the collections and component are absent.

- [ ] **Step 3: Implement typed collections and destination guards**

Populate only representative prototype content and verified KAG facts from the approved spec. Set external destinations to `unavailable` by default until independently verified. Reference images by media key and local path, not remote URLs. Ensure routing helpers return `undefined` for unknown slugs so pages can call `notFound()`.

- [ ] **Step 4: Run tests**

Run: `npm run test -- tests/unit/route-content.test.ts tests/integration/LinkOrUnavailable.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content components/ui/LinkOrUnavailable.tsx lib/route-content.ts tests
git commit -m "feat: centralize KAG content and destination configuration"
```

### Task 4: Build reusable primitives, logo registry, and responsive navigation

**Files:**
- Create: `components/ui/{Button,Card,Section,Field,Logo}.tsx`, `components/layout/{SiteHeader,DesktopNavigation,MobileNavigation,SiteFooter}.tsx`, `public/logos/*.svg`
- Modify: `app/layout.tsx`, `app/globals.css`
- Test: `tests/integration/{SiteHeader,MobileNavigation,Logo}.test.tsx`

**Interfaces:**
- Produces: `Button`, `Logo({ variant, size })`, `SiteHeader`, and `SiteFooter` that consume typed navigation/destination configuration.
- Consumes: Task 2 theme state and Task 3 content/destination interfaces.

- [ ] **Step 1: Write failing navigation and logo tests**

```tsx
it('opens, closes with Escape, and restores focus for the mobile menu', async () => { /* ... */ });
it('uses the dark logo variant when the resolved theme is dark', () => { /* ... */ });
it('does not emit a hash link for an unavailable customer-login destination', () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx tests/integration/Logo.test.tsx`

Expected: FAIL because layout components are absent.

- [ ] **Step 3: Implement primitives, conceptual SVG logo variants, and navigation**

Create original conceptual SVG wordmark/mark variants with the registry API `LogoVariant = 'light' | 'dark' | 'mono-light' | 'mono-dark' | 'mark'`. Implement semantic desktop navigation, accessible drawer behavior, conditional external destinations, sticky header state, footer contact/security content, and visible focus styles. Do not claim an official rebrand.

- [ ] **Step 4: Run component checks**

Run: `npm run test -- tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx tests/integration/Logo.test.tsx && npm run lint`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components app public/logos tests
git commit -m "feat: add KAG navigation logo and UI primitives"
```

### Task 5: Implement the SVG/CSS hero and motion-safe visual primitives

**Files:**
- Create: `components/visuals/LogisticsSceneSvg.tsx`, `components/sections/Hero.tsx`, `components/sections/Ticker.tsx`, `components/sections/ProcessTimeline.tsx`
- Modify: `app/globals.css`
- Test: `tests/integration/{Hero,Ticker,ProcessTimeline}.test.tsx`, `e2e/reduced-motion.spec.ts`

**Interfaces:**
- Produces: an SVG-first `LogisticsSceneSvg({ reducedMotion?: boolean })`, static readable ticker content, and ordered process timeline.
- Consumes: motion tokens and `prefers-reduced-motion` rules from Task 2.

- [ ] **Step 1: Write failing visual-structure and reduced-motion tests**

```tsx
it('renders terminal, warehouse, route nodes, and an accessible static route fallback', () => { /* ... */ });
it('keeps ticker content available when animation is disabled', () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/integration/Hero.test.tsx tests/integration/Ticker.test.tsx tests/integration/ProcessTimeline.test.tsx`

Expected: FAIL because scene and sections do not exist.

- [ ] **Step 3: Implement the approved logistics visual at SVG/CSS complexity**

Compose terminal, warehouse, road, rail/container reference, route nodes, and one active route. Use CSS/SVG stroke animation only, responsive art direction, and a static finished route fallback. Add ticker duplication that is visually seamless but hidden from the accessibility tree. Do not install or use WebGL.

- [ ] **Step 4: Run tests and reduced-motion browser check**

Run: `npm run test -- tests/integration/Hero.test.tsx tests/integration/Ticker.test.tsx tests/integration/ProcessTimeline.test.tsx && npm run test:e2e -- e2e/reduced-motion.spec.ts`

Expected: PASS; reduced-motion page has no animation-driven overflow.

- [ ] **Step 5: Commit**

```bash
git add components/visuals components/sections app/globals.css tests e2e
git commit -m "feat: add motion-safe logistics hero and information rails"
```

### Task 6: Assemble the flagship homepage and Command Center proof module

**Files:**
- Create: `components/sections/{ProblemCards,SolutionsGrid,TechnologyShowcase,CommandCenterDemo,IndustrySelector,CaseStudyCards,CarrierCTA,CareersCTA,Resources,FinalCTA}.tsx`
- Modify: `app/page.tsx`
- Test: `tests/integration/{CommandCenterDemo,HomepageSections}.test.tsx`

**Interfaces:**
- Produces: Homepage section components and `CommandCenterDemo({ shipments, label: 'Illustrative shipment visibility view' })`.
- Consumes: Task 3 collections, Task 4 primitives, Task 5 visual primitives.

- [ ] **Step 1: Write failing homepage and illustrative-data tests**

```tsx
it('labels the Command Center as illustrative and exposes shipment state text', () => { /* ... */ });
it('renders the shipper conversion path before the carrier and careers routes', () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/integration/CommandCenterDemo.test.tsx tests/integration/HomepageSections.test.tsx`

Expected: FAIL because homepage sections are absent.

- [ ] **Step 3: Implement focused homepage proof/story sections**

Follow the section sequence in the design spec. Use a dominant shipper path; render technology as operational proof with illustrative map, statuses, ETA, alert, document, and carrier status, not a live dashboard. Route every deeper action through Task 3 content/destination controls. Keep carrier/career blocks visually subordinate to quote conversion.

- [ ] **Step 4: Run tests and production build**

Run: `npm run test -- tests/integration/CommandCenterDemo.test.tsx tests/integration/HomepageSections.test.tsx && npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/sections tests
git commit -m "feat: build KAG conversion-led homepage"
```

### Task 7: Deliver the canonical accessible Quote Wizard with mock submission service

**Files:**
- Create: `features/quote/{types,schema,service,mock-service,QuoteWizard,QuoteProgress,QuoteReview,QuoteFallback}.tsx`
- Create: `app/quote/page.tsx`, `components/sections/QuoteSection.tsx`
- Test: `tests/unit/{quote-schema,mock-service}.test.ts`, `tests/integration/QuoteWizard.test.tsx`, `e2e/quote.spec.ts`

**Interfaces:**
- Produces: `QuoteSubmissionService.submit(request: QuoteRequest): Promise<QuoteSubmissionResult>`, `QuoteWizard`, and a `QuoteFallback` no-JS element.
- Consumes: Task 3 external destination configuration, Task 4 fields/buttons, Task 2 theme tokens.

- [ ] **Step 1: Write failing schema, state, and retry tests**

```tsx
it('uses Step X of 4 only for data-entry steps and enters an unnumbered review state', async () => { /* ... */ });
it('preserves entered values and announces a retry action after a server error', async () => { /* ... */ });
it('submits the typed QuoteRequest through QuoteSubmissionService', async () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/unit/quote-schema.test.ts tests/unit/mock-service.test.ts tests/integration/QuoteWizard.test.tsx`

Expected: FAIL because quote modules are absent.

- [ ] **Step 3: Implement schema, mock service, and four-step wizard**

Implement the exact `QuoteRequest`, `QuoteSubmissionResult`, and `QuoteSubmissionService` contract in the spec. Create Freight, Route, Timing, Contact, then unnumbered Review & Submit. Add loading, success, recoverable error, focus/aria-live behavior, review/back preservation, and a deterministic mock service configurable for test outcomes. Render the same `QuoteWizard` on `/quote` and homepage `QuoteSection`; hero actions navigate/scroll to this canonical experience. Render `QuoteFallback` in the no-script path with centralized configured contact information.

- [ ] **Step 4: Run tests and E2E flow**

Run: `npm run test -- tests/unit/quote-schema.test.ts tests/unit/mock-service.test.ts tests/integration/QuoteWizard.test.tsx && npm run test:e2e -- e2e/quote.spec.ts`

Expected: PASS; test covers happy path and recoverable failure.

- [ ] **Step 5: Commit**

```bash
git add app/quote components/sections/QuoteSection.tsx features/quote tests e2e
git commit -m "feat: add accessible mock quote wizard"
```

### Task 8: Build focused hub routes and reusable prototype detail templates

**Files:**
- Create: `app/{technology,carriers,careers}/page.tsx`, `app/{solutions,industries,resources}/[slug]/page.tsx`, `app/company/page.tsx`
- Create: `components/sections/{HubHero,CapabilityList,DetailPageTemplate,ResourceDetail}.tsx`
- Test: `tests/integration/{HubRoutes,DetailPageTemplate}.test.tsx`, `e2e/navigation.spec.ts`

**Interfaces:**
- Produces: fully authored hubs and `DetailPageTemplate({ content })` for only approved static params.
- Consumes: Task 3 content and Task 4 layout components.

- [ ] **Step 1: Write failing route/template tests**

```tsx
it('renders a Technology hub with an illustrative-data disclosure', async () => { /* ... */ });
it('returns notFound for an unapproved detail slug', async () => { /* ... */ });
it('exposes accessible Carriers and Careers primary routes', async () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/integration/HubRoutes.test.tsx tests/integration/DetailPageTemplate.test.tsx`

Expected: FAIL because routes/templates are absent.

- [ ] **Step 3: Implement exact route scope**

Fully author `/technology`, `/carriers`, and `/careers` using their dedicated journey requirements. Implement static representative detail pages via the shared template and Task 3 collections; return `notFound()` for unknown routes. Implement `/company` only if its supplied verified content produces a complete shared information page; otherwise omit the active navigation item. Preserve external destination safeguards on every CTA.

- [ ] **Step 4: Run route tests and browser navigation check**

Run: `npm run test -- tests/integration/HubRoutes.test.tsx tests/integration/DetailPageTemplate.test.tsx && npm run test:e2e -- e2e/navigation.spec.ts`

Expected: PASS; active nav routes resolve without dead/fake links.

- [ ] **Step 5: Commit**

```bash
git add app components/sections tests e2e
git commit -m "feat: add KAG hubs and reusable detail templates"
```

### Task 9: Add metadata, analytics boundary, media optimization, and no-JS support

**Files:**
- Create: `features/analytics/{types,noop-adapter,track}.ts`, `lib/metadata.ts`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`, route pages, `components/sections/QuoteSection.tsx`, `content/media.ts`
- Test: `tests/unit/{metadata,analytics}.test.ts`, `tests/integration/QuoteFallback.test.tsx`

**Interfaces:**
- Produces: `AnalyticsAdapter.track(event)` and route metadata factory; a no-op default adapter.
- Consumes: quote/CTA events and configured media assets.

- [ ] **Step 1: Write failing metadata, analytics, and fallback tests**

```ts
it('does not include contact or freight payload values in analytics events', () => { /* ... */ });
it('builds canonical metadata only when a production origin is configured', () => { /* ... */ });
```

```tsx
it('renders a usable quote contact fallback in the no-script section', () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- tests/unit/metadata.test.ts tests/unit/analytics.test.ts tests/integration/QuoteFallback.test.tsx`

Expected: FAIL because adapters and metadata modules are absent.

- [ ] **Step 3: Implement SEO, safe analytics, and optimization boundaries**

Implement unique metadata, Open Graph/Twitter fields, sitemap/robots readiness, and verified JSON-LD only. Add event calls for the spec event names through the no-op adapter. Use `next/image` and media keys, provide correct image dimensions/alt text, and preserve a no-JS quote fallback. Do not connect an analytics vendor or CRM.

- [ ] **Step 4: Run tests and production build**

Run: `npm run test -- tests/unit/metadata.test.ts tests/unit/analytics.test.ts tests/integration/QuoteFallback.test.tsx && npm run build`

Expected: PASS; build has no missing configured media reference.

- [ ] **Step 5: Commit**

```bash
git add app features/analytics lib content components tests
git commit -m "feat: add SEO analytics boundary and quote fallback"
```

### Task 10: Execute end-to-end accessibility, responsive, no-JS, and performance verification

**Files:**
- Create: `e2e/{accessibility,responsive,no-js,performance}.spec.ts`
- Create: `docs/qa/2026-10-11-kag-visual-qa.md`
- Modify: implementation files only for verified defects discovered by these checks.

**Interfaces:**
- Consumes: all delivered routes and the scripts established in Task 1.
- Produces: automated evidence for release criteria and a concise manual visual-QA record.

- [ ] **Step 1: Write failing browser acceptance tests**

```ts
test('homepage has no critical automated accessibility violations in both themes', async ({ page }) => { /* axe scan */ });
test('disabling JavaScript leaves content and a quote fallback available', async ({ browser }) => { /* JS-disabled context */ });
test('compact mobile view has no horizontal overflow and routes to quote', async ({ page }) => { /* 390px viewport */ });
```

- [ ] **Step 2: Run acceptance tests to verify remaining gaps**

Run: `npm run test:e2e -- e2e/accessibility.spec.ts e2e/responsive.spec.ts e2e/no-js.spec.ts e2e/performance.spec.ts`

Expected: Any discovered failure is captured before remediation; no failure is ignored.

- [ ] **Step 3: Correct only defects exposed by verification and document visual QA**

Inspect desktop, laptop, tablet, and mobile in light/dark themes for typography, overflow, focus, layout shifts, motion, Command Center labeling, wizard states, and unavailable destinations. Run Lighthouse on the production build; record scores and any justified limits. Do not add WebGL unless a separate comparison satisfies the spec decision gate.

- [ ] **Step 4: Run full release verification**

Run: `npm run lint && npm run typecheck && npm run test && npm run build && npm run test:e2e`

Expected: PASS. Record exact result counts, Lighthouse values, tested viewports, and known constraints in `docs/qa/2026-10-11-kag-visual-qa.md`.

- [ ] **Step 5: Commit**

```bash
git add app components content features lib e2e docs/qa tests
git commit -m "test: verify KAG prototype quality gates"
```

### Task 11: Superpowers completion workflow

**Files:**
- Modify: only files required to address confirmed review findings.
- Create: no speculative production integrations.

**Interfaces:**
- Consumes: verified branch from Task 10.

- [ ] **Step 1: Invoke `superpowers:requesting-code-review` and submit the completed change set for review**

Expected: actionable findings are verified before changes are made.

- [ ] **Step 2: For each confirmed finding, write a failing regression test before correction**

Expected: the regression test fails on the reviewed state.

- [ ] **Step 3: Implement the minimal correction and rerun the owning test plus full relevant checks**

Expected: regression and suite pass; no unrelated refactor.

- [ ] **Step 4: Invoke `superpowers:verification-before-completion` and record the exact final commands/results**

Expected: evidence supports every completion claim.

- [ ] **Step 5: Invoke `superpowers:finishing-a-development-branch` to decide handoff/integration without automatic merge**

Expected: branch is clean, reviewed, and ready for the user-selected integration path.

## Plan self-review

### Spec coverage

- Product/route scope: Tasks 1, 6–8.
- Design tokens, themes, and logo: Tasks 2 and 4.
- SVG/CSS hero, motion rules, and reduced motion: Task 5.
- Command Center, factual/illustrative separation: Task 6.
- Quote UX, mock adapter, review state, analytics events, and fallback: Task 7 and Task 9.
- Content/media/destination integrity: Task 3.
- Accessibility, performance, SEO, no-JS behavior, responsive visual QA: Tasks 9–10.
- Required Superpowers review/verification/branch finish: Task 11.

### Consistency and scope checks

The plan uses the exact `QuoteSubmissionService` contract from the approved spec and maintains the four-step-plus-review quote model in all tasks. WebGL is expressly excluded from initial implementation. No task introduces CRM, live data, authentication, ATS, CMS, production analytics, or an official rebrand. The task sequence creates stable interfaces before homepage and route composition.

### Execution recommendation

**Recommended method: Native execution.** The tasks have tightly coupled interfaces (content configuration, theme controller, reusable primitives, and quote service), and the project is a single new codebase. Implementing them sequentially in this session is faster and avoids expensive context handoffs; use one independent whole-branch review at the end through the required Superpowers review workflow.
