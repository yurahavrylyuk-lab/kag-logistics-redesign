# KAG Vite, TanStack Router, and Design-System Migration — Design Specification

**Status:** Approved direction; ready for implementation planning

**Baseline:** `origin/main` at `6d51ecd` (the merged KAG brand and company-motion work)

## 1. Goal

Replace the current Next.js application shell with a Vite + React application using TanStack Router, while preserving the complete public KAG experience and making future work easier to locate, test, and extend. Adopt a pragmatic feature-based architecture inspired by Bulletproof React and make locally owned shadcn/ui primitives the application design-system foundation.

This is an architectural migration, not a visual redesign. The approved KAG industrial visual system, public route contract, content, operational calls to action, quote workflow, motion constraints, and responsive behavior remain intact.

## 2. Non-negotiable preservation contract

- Preserve every current public route and canonical URL: `/`, `/about`, `/solutions`, `/solutions/$slug`, `/industries`, `/industries/$slug`, `/technology`, `/resources`, `/resources/$slug`, `/quote`, `/carriers`, and `/careers`.
- Preserve the existing quote wizard's validation, four data-entry steps plus Review & Submit, loading, success, error, accessible fallback, and mail-client submission behavior.
- Preserve the temporary quote destination exactly as `delta.qoralis@gmail.com` and retain the existing Ship Now URL exactly as `https://www.kaglogistics.com/ship-now-2/`.
- Preserve the theme preference model, including no-flash initialization, system-theme change handling, and explicit-preference precedence.
- Preserve CSS-first motion, reduced-motion and touch simplification, IntersectionObserver choreography, requestAnimationFrame fine-pointer cursor ambience, and floating Ship Now visibility/suppression behavior.
- Preserve responsive behavior, keyboard operation, semantic landmarks, skip link, focus treatment, and no-JavaScript marketing fallback.
- Preserve existing factual KAG content and intentional unavailable external-link states. Do not invent destinations, add a CMS, CRM, database, or production quote API.

## 3. Target runtime and delivery model

### 3.1 Vite application

The production application is a TypeScript React application built and served as Vite static output. Vite replaces Next.js commands, configuration, generated types, and App Router conventions. Development uses the Vite dev server; production verification uses the Vite preview server.

TanStack Router is the sole internal-navigation contract. Links to in-site routes use its typed `Link` API; verified external destinations retain ordinary anchors. Browser history navigation, direct deep linking, focus handling, active navigation state, route errors, and unknown-route handling must work without Next.js.

### 3.2 Static prerendering, SEO, and no-JavaScript baseline

A Vite post-build prerender stage produces static HTML for every known public route, including all solution, industry, and resource detail slugs sourced from the existing content modules. The static document includes the page title, description, canonical URL, language, theme bootstrap script, shared header/footer, and route body. Client React hydrates the same route after JavaScript loads.

This static-first strategy is intentional: a client-only empty shell would violate the existing no-JavaScript, SEO, and content-readability commitments. The app may use a Vercel fallback rewrite for unknown client paths, but known routes must resolve to their generated static documents. An unknown path presents an accessible in-app 404, not a server error or blank document.

The quote wizard is the only enhanced interaction allowed to require JavaScript. Its prerendered route must expose a meaningful contact/quote fallback instead of an inert form.

### 3.3 Deployment

Vercel deploys `dist/` as a Vite static project. Configuration must serve generated files first, preserve direct-link behavior, and not add server-only runtime dependencies. Existing production URLs and external destinations remain unchanged.

## 4. Architecture and ownership

Adopt Bulletproof React principles—small clear boundaries, feature ownership of behavior, shared code only when it is genuinely shared—without importing its sample application wholesale or introducing unrelated state, API, authentication, or data layers.

```text
src/
  app/             application bootstrap, providers, route setup, global styles
  routes/          TanStack route definitions and route-level composition only
  features/        behavior-owning domains (quote, theme, motion, analytics)
  components/      reusable KAG layout, sections, visuals, and UI composition
    ui/            locally generated/maintained shadcn primitives and KAG variants
  content/         typed factual page and navigation content
  lib/             framework-neutral formatting, metadata, route/content helpers
  styles/          KAG design tokens and global/component style layers
  assets/          local media and SVG assets
```

Test files remain under `tests/` and browser coverage remains under `e2e/`. A short architecture guide documents the import direction: routes may compose features and components; features own their behavior and can consume shared UI; shared components must not import a route; content and framework-neutral library code must not depend on React.

Do not classify every visual section as a feature. The existing `quote`, `theme`, `motion`, and `analytics` areas are features because they own behavior. The KAG hero, content sections, logo, navigation shell, and logistics visuals are shared presentation components.

## 5. Router design

Use TanStack Router's Vite integration with generated route-tree typing. The root route owns document-level application composition after hydration: theme provider, skip link, shared header, global top sentinel, main outlet, choreography enhancement, cursor enhancement, floating Ship Now control, and footer.

Route files own only route metadata and page composition. Dynamic route files validate a slug against the existing typed content source and route to the accessible not-found boundary when missing. Existing route-content helpers remain the source of truth rather than duplicating data in router definitions.

The route tree must preserve these relationships:

| URL family | Route responsibility |
| --- | --- |
| `/` | flagship homepage sections and hero sentinel |
| `/about`, `/technology`, `/carriers`, `/careers`, `/quote` | dedicated hubs/experiences |
| `/solutions`, `/industries`, `/resources` | prototype index templates |
| `/$family/$slug` | typed detail-page composition from existing content |
| unmatched | accessible 404 with a clear return-to-home action |

Navigation data stays centralized. Removing Resources from primary navigation remains intentional; Resources is still reachable through footer and contextual links.

## 6. shadcn/ui design system

Use the Vite-compatible shadcn/ui workflow and own generated source in `src/components/ui`. Configure the component registry to use the KAG alias and design tokens. Use Tailwind CSS only as the utility and variant layer needed by the generated primitives; retain the approved KAG CSS variables, custom layout styles, responsive rules, and visual treatments rather than replacing the site with default shadcn appearance.

Adopt only primitives that reduce duplicated accessibility behavior:

- `Button` and `Card` as KAG-branded base variants;
- `Input`, `Textarea`, `Label`, `Select`, and `Field` for quote controls;
- `Sheet` for mobile navigation;
- `Dialog` or `AlertDialog` only where an existing interaction needs it;
- `Progress`, `Tooltip`, `Toast`, and `Separator` where they directly replace an existing equivalent.

Each primitive is styled through semantic KAG CSS variables for light and dark themes. KAG orange/red stays reserved for primary operational actions and states; it must not be inherited indiscriminately from stock component defaults. Existing `Button`, `Card`, and `Field` public behavior migrates deliberately; no broad compatibility wrapper is retained merely to avoid updating call sites.

## 7. Feature migration requirements

### Quote

Move the quote feature as one cohesive domain. Keep its schemas, types, service contract, mock/service boundary, mailto formatter, wizard, review state, fallback, and test coverage together. The submission adapter continues to open a mail client only after client-side validation; no request to a backend is introduced.

### Theme

Keep theme storage, resolution, provider, toggle, and initial document bootstrap in the theme feature. The static document includes the minimal inline bootstrap before paint; the hydrated provider listens to operating-system changes only while the stored preference is `system`.

### Motion

Keep progressive enhancement isolated in the motion feature. It must add classes/attributes after hydration rather than hide content before JavaScript. IntersectionObserver remains the sole viewport trigger; requestAnimationFrame remains confined to the fine-pointer cursor controller; reduced-motion or coarse-pointer environments avoid nonessential work.

### Analytics

Keep the existing noop analytics adapter and typed event facade. Router navigation is the integration boundary for page-view tracking, but no real third-party analytics SDK is added.

## 8. Metadata, routes, and assets

Replace Next `Metadata`, `robots.ts`, and `sitemap.ts` with framework-neutral route metadata and a build-time metadata/sitemap/robots generator. Every prerendered route has an explicit title, description, and canonical path. The generated `robots.txt` and `sitemap.xml` enumerate the same static route manifest, including valid detail slugs.

Existing imagery and SVG logistics visuals stay local and retain meaningful alt text. Font loading and asset references must work from every generated nested route using absolute public asset paths. Do not use remote visual dependencies merely to recreate existing assets.

## 9. Testing and verification contract

Preserve the current Vitest + Testing Library, Playwright, axe, and TypeScript checks. Update tests to render router-aware components through a shared test router provider rather than relying on Next App Router mocks.

Add targeted coverage for:

- each preserved route resolving directly and rendering its title/landmark;
- typed internal links, dynamic valid slug links, and missing-slug not-found behavior;
- static build output containing full marketing content, metadata, sitemap, robots, and quote fallback without JavaScript;
- header/mobile/footer navigation retaining required destinations and unavailable-state behavior;
- the unchanged quote mailto recipient and generated payload;
- shadcn primitive keyboard, label, focus, and error behavior within the quote flow;
- theme and motion preservation after the new app bootstrap;
- no regression to floating Ship Now visibility/suppression on homepage, About, Technology, and Quote;
- accessibility, reduced-motion, responsive, performance, and deep-link browser checks against the Vite preview server.

Required completion commands are:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The e2e configuration must start the production-like Vite preview server and use its configured port. Build output inspection is a first-class verification step, not an optional deployment check.

## 10. Explicit exclusions

- No Next.js compatibility layer or duplicated `app/` and `src/` implementations.
- No WebGL, canvas, Three.js, heavy animation framework, CMS, CRM, database, authentication system, quote API, or new real analytics provider.
- No bulk installation of all shadcn components or Radix packages. Add only dependencies backing adopted primitives.
- No change to company content, approved visual direction, verified URLs, quote recipient, or external-destination policy.
- No automatic merge. The migration ships through a reviewable feature branch and pull request targeting `main`.

## 11. Migration completion criteria

The migration is complete only when Next.js application/configuration files and dependencies are removed, Vite/TanStack Router builds the entire preserved route set, static output satisfies the no-JavaScript baseline, all required checks pass, the feature-based ownership guide is present, and a production-like preview has passed visual, accessibility, route, quote, and responsive checks.
