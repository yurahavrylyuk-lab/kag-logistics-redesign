# KAG Logistics Brand, Company and Motion — Design Specification

**Status:** Approved for specification; implementation requires a separately approved implementation plan.

**Date:** 2026-10-12

**Branch baseline:** `feature/kag-brand-company-motion`, created from verified `origin/main` commit `024acf5cffa7b186bc1376d2206a6ff12b1d9810`.

**Scope:** An additive update to the deployed KAG Logistics prototype. It corrects and reinforces the KAG Logistics identity, adds a first-class company story, makes the verified Ship Now destination operationally prominent, and layers a performance-conscious cinematic interaction system over the existing site.

## 1. Product intent and fixed constraints

### Outcome

The site should present KAG Logistics as an experienced, operationally disciplined managed-transportation partner. The page should feel like one continuous logistics interface as a visitor scrolls, while still prioritizing clear navigation, direct conversion, content legibility, and human trust signals.

The change is not an official corporate rebrand. The logo assets are conceptual prototype artwork that can later be swapped for approved brand assets without restructuring layout components.

### Fixed constraints

- The company name is always **KAG Logistics**. No `KED`, `KED Logistics`, misspellings, incorrect logo text, incorrect alt text, or wrong-company metadata may remain.
- Existing quote-email submission behavior, including its current recipient/destination, stays unchanged. This work must not reintroduce a mock quote service or alter the quote workflow.
- Existing public routes, metadata behavior, responsiveness, accessibility, no-JavaScript content, and SEO remain functional.
- The verified external Ship Now destination is `https://www.kaglogistics.com/ship-now-2/`. No alternate or invented Ship Now URL is permitted.
- No WebGL, canvas, Three.js, or new heavy animation package is introduced. Existing `motion` is optional and only acceptable where it materially simplifies a small stateful transition.
- Core marketing content is server-rendered and usable without JavaScript. JavaScript layers interaction and motion progressively; it never gates route content, navigation destinations, the About page, or the primary quote path.
- `prefers-reduced-motion: reduce` and touch/mobile contexts receive a substantially simplified visual treatment.

### Factual source boundary

The About route uses the official KAG Logistics About page as its source, rewritten into concise original copy rather than reproduced text. Approved facts include North Canton, Ohio headquarters; wholly owned subsidiary status within Kenan Advantage Group, Inc.; managed transportation and value-added logistics services; North American supply-chain support; Energy, Renewable Energy, Chemicals, Specialty Products, Food, and Industrial Gas focus; experienced teams, processes, and technology; dedicated operations; multimodal transportation; capacity/brokerage; carrier management/procurement; technology/integration; and expedited, cross-border, inventory, transloading, emergency/disruption, and supply-chain consulting/design services. No unsupported statistics, awards, customers, dates, locations, or performance claims are added.

## 2. Information architecture and conversion behavior

### Primary navigation

The desktop and mobile primary navigation is exactly:

`Solutions · Industries · Technology · About · Carriers · Careers`

`Resources` is removed only from the header/mobile primary navigation. Its route and content remain accessible through the footer and contextual links. Customer Login remains an intentionally unavailable prototype action unless separately configured with a verified destination.

Header action order is: low-emphasis Customer Login (when present), theme control, `Get a Quote`, then high-emphasis external `SHIP NOW`. The shipper conversion path remains the dominant visual hierarchy. Carriers and Careers are equal, intentional navigation routes but do not compete with quote or Ship Now actions.

### Ship Now behavior

The header action and persistent action are one destination, not duplicate conversion systems. Both are sourced from `content/destinations.ts` and render an external link safely and consistently.

| Context | Behavior | Visibility |
| --- | --- | --- |
| Header desktop | Prominent operational CTA with restrained animated surface/border, arrow response, hover elevation, and focus styling | Available while the header is visible |
| Header mobile drawer | Full-width, touch-safe operational CTA in the navigation action area | Available when the drawer is open |
| Persistent desktop | Compact lower-right floating pill, outside normal reading gutters and safe from essential controls | Enters only after the hero/header action is no longer useful; exits before it would obstruct a focused/footer control |
| Persistent mobile | Bottom-safe compact action above browser UI and safe-area inset | Enters after the hero, does not cover primary content or form controls |

The persistent control is hidden before the hero threshold so a visitor never sees two competing Ship Now actions during the opening experience. It has a visible focus indicator, descriptive `aria-label`, at least a 44px touch target, and an accessible external-destination cue when project conventions require one. Reduced motion replaces its animated entrance with an immediate, non-distracting visibility change.

### About route and homepage introduction

`/about` is a first-class static route with page-specific metadata and a self-contained company narrative.

1. **Hero:** “Built to keep complex supply chains moving.” A concise introduction frames KAG Logistics as a North American managed transportation and logistics organization.
2. **Company overview:** North Canton headquarters, Kenan Advantage Group relationship, managed transportation expertise, and the intersection of experienced people, sound processes, and logistics technology.
3. **Core capabilities:** six accessible cards: Transportation Management; Multimodal Transportation; Freight & Capacity Solutions; Technology & Integration; Dedicated Account Operations; Value-Added Logistics.
4. **Industries:** compact, verified sector layout: Energy, Renewable Energy, Chemicals, Specialty Products, Food, and Industrial Gas.
5. **How KAG works:** a People + Network + Technology composition explaining coordinated operational execution without treating technology as a standalone SaaS product.
6. **Conversion:** a final `Get a Quote` link and verified external `SHIP NOW` link.

The homepage receives one concise, visually distinct **About KAG Logistics** section immediately after the early value/solutions story. It introduces the company without duplicating the route: a split industrial-grid composition, a concise company statement, three People/Network/Technology mini-signals, and `Discover KAG Logistics →` linking to `/about`.

## 3. Phase 1 — Brand, navigation, Ship Now, and About

Phase 1 is completed and fully verified before Phase 2 begins. It produces an independently reviewable commit.

### 3.1 Conceptual SVG identity

Replace the existing prototype identity assets with lightweight, original SVG artwork:

- A strong horizontal `KAG` wordmark with a smaller `LOGISTICS` descriptor.
- A restrained geometric route/directional motif that communicates transportation and forward movement at small and large sizes.
- Theme-specific light and dark wordmarks, mono variants as needed, and a compact mark for constrained mobile contexts.
- No text embedded in the logo asset differs from `KAG Logistics`; rendered image alt text is exactly `KAG Logistics`.

`components/ui/Logo.tsx` remains the single mapping boundary for logo variants. The header, footer, mobile menu, and any mark-only use consume it rather than addressing files directly. The asset registry supports light and dark theme use without relying on a filter that degrades legibility.

### 3.2 Navigation and centralized destinations

`content/navigation.ts` separates header navigation from any footer/contextual collection so the header can remove Resources without removing resource discovery. `content/destinations.ts` is the sole source of the Ship Now URL. The external-link component will use the existing application convention for safe external navigation and is responsible for any required `rel` protection. Unconfigured actions remain intentional accessible unavailable states; the verified Ship Now action is a real link.

### 3.3 Components and page boundaries

| Boundary | Responsibility |
| --- | --- |
| `Logo` and SVG assets | Theme-aware conceptual identity, semantic alt text, compact mark support |
| `SiteHeader`, `DesktopNavigation`, `MobileNavigation`, `SiteFooter` | Correct link hierarchy, logo treatments, responsive action placement, Resources retained outside primary navigation |
| `ShipNowLink` or equivalent small shared primitive | One verified external destination and consistent label/icon/accessibility behavior |
| `FloatingShipNow` client enhancement | Scroll-threshold visibility only; no content dependency; safe desktop/mobile placement |
| `AboutKag` homepage section | Concise company proof and internal `/about` conversion |
| `app/about/page.tsx` plus content module | Server-rendered company route, metadata, approved factual copy, structured capability/industry sections |

The exact file names may follow existing conventions, but route content and reusable content data remain separate from presentation components.

### 3.4 Phase 1 interaction language

The header Ship Now CTA earns the strongest call-to-action treatment: controlled color sweep or border illumination, small arrow translation, and slight hover elevation. It must not flash, bounce continuously, or use neon/glow that reduces contrast. Light mode uses industrial orange with deep/cobalt support; dark mode uses controlled orange against graphite/dark-steel surfaces with brighter cobalt for non-primary interaction context.

The scroll visibility controller observes the hero exit using `IntersectionObserver`. It uses a small client component and class/attribute state, not continuous scroll-driven React state. It remains unavailable under server rendering only as an extra convenience; the header and navigation still provide the real destination.

### 3.5 Phase 1 acceptance criteria

- A case-insensitive source audit finds no incorrect KED or KAG spelling.
- Header, footer, mobile drawer, light theme, and dark theme use legible KAG Logistics artwork and correct alt text.
- Resources is absent from top navigation and available in the footer/contextual resource paths; About appears in primary desktop and mobile navigation.
- `/about`, homepage About KAG section, quote flow, all existing routes, and no-JavaScript content work.
- Header and persistent Ship Now links resolve to the verified official URL.
- The floating CTA is absent while the header CTA is useful, is keyboard/touch accessible after the hero, and introduces no horizontal overflow or focus obstruction.
- Lint, typecheck, unit/integration tests, build, end-to-end suite, accessibility checks, responsive checks, and a manual visual pass are clean before the Phase 1 commit.

## 4. Phase 2 — CSS-first motion and interaction system

Phase 2 begins only after Phase 1 verification has passed. It creates one or more separate commits.

### 4.1 Architecture

The motion system has two isolated client enhancements:

1. **Section choreography controller:** one small `IntersectionObserver`-based registry assigns a discrete lifecycle state—such as `entering`, `centered`, or `exiting`—to opted-in sections. State is exposed through data attributes or classes. CSS owns transforms, opacity, contrast, depth, and timing. It must observe only marked sections, clean up observers on unmount, and avoid per-scroll React state updates.
2. **Cursor ambient controller:** for `(pointer: fine)` users who do not prefer reduced motion, one `requestAnimationFrame` loop eases cursor coordinates into CSS custom properties. A fixed `pointer-events: none` ambient layer uses theme-scoped radial gradients. It neither reads layout continuously nor stores pointer position in React state. It is not mounted for touch/coarse-pointer or reduced-motion users.

The existing `motion` dependency is not a default solution. It may be used for a local mount/unmount or stateful CTA transition only if the CSS/attribute approach would add more complexity. No route requires the library to be usable.

### 4.2 Scroll composition

The homepage uses a deliberately limited choreography vocabulary instead of universal fade-and-slide reveals:

- **Hero / About / challenge / solutions:** entering content resolves from slightly lower depth; centered content has full contrast; exiting content dims and shifts upward gently.
- **Cards and tiles:** related cards use a shared composition state, assembling into their intended grid near viewport center and relaxing apart at the edges. Individual cards do not bounce or drift independently.
- **Technology Command Center:** a focused operational panel gains modest illumination and route emphasis at center; it never pretends to show live data.
- **Industries, capability strip, results, process, quote, carrier, careers, resources, final CTA:** each participates only where a composition improves narrative continuity. Text remains readable before, during, and after each state.

Adjacent sections may visually bridge through compatible backgrounds, route details, or controlled overlap. They do not create stacking contexts that block links, controls, skip links, modal navigation, or quote inputs. Motion uses compositor-friendly `transform` and `opacity`; it avoids layout animation, wide continuous filters, huge blur layers, and long-lived simultaneous effects.

### 4.3 Component-family interactions

Every meaningful interactive element receives an intentional hover, focus-visible, and active response. Families vary rather than sharing a single generic effect:

| Family | Interaction response |
| --- | --- |
| Navigation and footer links | Underline/route-line progression, foreground shift, strong keyboard focus ring |
| Primary quote actions | Surface lift, controlled color contrast change, directional icon/text response |
| Ship Now actions | Strongest restrained expansion, border/background illumination, small arrow movement |
| Content cards and solution/industry links | Border/context shift and modest elevation; no movement that breaks pointer tracking |
| Form controls and quote actions | Clear focus/validation state and small surface response only |
| Theme control | Theme-aware selected state and keyboard-visible focus; no semantic reliance on color alone |

Light mode uses industrial orange, deep/cobalt blue, charcoal, and warm neutral surfaces. Dark mode uses graphite/dark-steel surfaces, brighter cobalt/electric-blue context cues, and controlled orange conversion emphasis. These are designed palettes, not simple inversion.

### 4.4 Reduced motion, touch, and no-JavaScript behavior

Under `prefers-reduced-motion: reduce`, route/ticker loops, continuous decorative motion, scroll choreography transitions, cursor ambient animation, and floating-CTA entrance animations are removed or reduced to immediate static states. Hover/focus contrast and other essential affordances remain.

On coarse-pointer/touch devices, cursor ambience is disabled. Scroll choreography is limited to light, non-blocking opacity/position changes where beneficial; content is otherwise static. The persistent Ship Now action follows mobile safe-area constraints and never obscures quote inputs, mobile navigation, or the final CTA.

Without JavaScript, all marketing sections, About content, standard navigation routes, footer resource links, header Ship Now link, primary quote link, and contact content remain readable and usable. The missing progressive enhancements do not leave empty wrappers or hide information.

### 4.5 Phase 2 acceptance criteria

- Choreography is visibly coordinated but content remains fully legible and operable in static, reduced-motion, touch, and no-JavaScript modes.
- No pointer overlay blocks selection, clicks, focus, or screen-reader behavior.
- No horizontal overflow, hydration warning, console error, scroll jank, trapped focus, poor hover contrast, or CTA occlusion occurs at tested breakpoints.
- Dark and light themes use intentionally distinct interaction palettes while meeting contrast requirements.
- The ambient field runs only for fine-pointer, non-reduced-motion users, uses one eased animation loop, and is disabled on cleanup.
- The Ship Now CTA maintains the same URL, visibility rules, focus behavior, and mobile safety after motion changes.

## 5. Accessibility, SEO, performance, and verification

### Accessibility

- Preserve semantic landmarks, skip link, meaningful heading sequence, accessible labels, focus restoration/trapping for mobile navigation, and visible `:focus-visible` treatment.
- Mark decorative SVG/network/motion layers as decorative. Provide concise text for any information-bearing Command Center or About visual.
- Do not rely on hover, color, motion, or cursor position to reveal required content or identify controls.
- Maintain target size, contrast, keyboard access, and external-action clarity for Ship Now.
- Add/adjust automated accessibility coverage for the new About route, both CTA placements, mobile navigation, and reduced-motion states.

### SEO and metadata

- Add a unique About title, description, canonical path, sitemap entry, and indexable server-rendered content.
- Preserve existing metadata generation and route behavior. Logo changes have no impact on semantic page identity beyond correct accessible names.
- Do not encode unverified performance claims in metadata or structured content.

### Performance

- Prefer static SVG, CSS, `IntersectionObserver`, `requestAnimationFrame`, `transform`, and `opacity`.
- Keep client components narrow; static content stays in server components.
- Reuse the existing dependency set. Do not add WebGL/canvas/Three.js or a new animation library.
- Verify production build output and the existing performance suite. Manually inspect CPU behavior during scroll and cursor movement at desktop and mobile viewport sizes.

### Test strategy and sequencing

1. Add or update tests that define Phase 1 identity, navigation, centralized URL, About content/metadata, responsive CTA behavior, and no-JavaScript behavior before implementation changes.
2. Implement Phase 1, then run lint, typecheck, unit/integration tests, build, end-to-end tests, axe checks, responsive checks, and manual desktop/mobile light/dark visual QA. Commit only after all pass.
3. Add focused behavior tests for choreography state boundaries, reduced-motion suppression, coarse-pointer ambient suppression, CTA non-occlusion, and hover/focus semantics. Tests assert behavior rather than brittle pixel positions.
4. Implement Phase 2, then rerun the full verification suite and manually inspect homepage desktop light/dark, homepage mobile, `/about`, `/technology`, `/quote`, desktop header, mobile drawer, both Ship Now CTAs, scroll composition, hover/focus behavior, cursor ambient behavior, reduced-motion, console, and hydration output.

Required commands before final delivery:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## 6. Delivery and integration boundaries

- Commit Phase 1 distinctly, using a message equivalent to `feat: add KAG brand, about experience and ship-now CTAs`.
- Commit Phase 2 separately with the motion-system changes and verification fixes.
- Push `feature/kag-brand-company-motion` and create a pull request targeting `main` only after both phases pass verification.
- Do not merge automatically. Delivery stops at the pull-request approval gate.

