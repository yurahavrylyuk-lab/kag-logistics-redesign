# KAG Logistics Brand, Company and Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the KAG Logistics identity and company story, add verified Ship Now conversion paths, and deliver a CSS-first, accessible scroll interaction system without changing the established quote-email workflow.

**Architecture:** Server-rendered route and company content remain the source of truth. Small isolated client enhancements provide the Ship Now visibility state, section lifecycle attributes, and fine-pointer ambient effect; CSS owns visual transitions, theme palettes, and responsive/reduced-motion simplification. Existing quote submission code remains untouched, including its `mailto:` recipient.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS custom properties, `IntersectionObserver`, `requestAnimationFrame`, Vitest/Testing Library, Playwright, axe-core/playwright. Existing `motion` may be used only if a local state transition cannot be expressed more simply with CSS; no new runtime animation dependency is added.

**Spec:** `docs/superpowers/specs/2026-10-12-kag-brand-company-motion-design.md`

## Global Constraints

- Work only on `feature/kag-brand-company-motion`, based on production commit `024acf5cffa7b186bc1376d2206a6ff12b1d9810`.
- The company name is **KAG Logistics** everywhere: visual artwork, alt text, copy, metadata, tests, and configuration. Never introduce `KED` or an incorrect KAG spelling.
- Preserve the live quote-email flow and `delta.qoralis@gmail.com` recipient; do not modify `features/quote/mailto-service.ts`, quote schemas, review state, or email-preparation semantics.
- Use the centralized verified Ship Now URL exactly: `https://www.kaglogistics.com/ship-now-2/`; never use `href="#"` or an invented external URL.
- Keep Resources off primary desktop/mobile navigation only; retain it in footer/contextual discovery.
- Keep all essential content and standard links usable without JavaScript. JavaScript is progressive enhancement only.
- Do not add WebGL, canvas, Three.js, CRM/database/CMS work, unrelated architecture, or a new heavy animation dependency.
- Use compositor-friendly CSS `transform`/`opacity`, `IntersectionObserver`, and one fine-pointer-only `requestAnimationFrame` cursor loop. Avoid scroll-event React state, layout-animation, and large persistent blur effects.
- Respect `prefers-reduced-motion`, coarse pointers, keyboard navigation, focus visibility, touch target size, responsive layouts, route metadata, sitemap behavior, and existing no-JavaScript quote fallback.
- Do not modify the approved design specification. If planning or implementation reveals a true contradiction, stop and report it rather than changing the spec.

## Review Focus

1. **Configured external action:** Ship Now must be an actual accessible anchor to the verified HTTPS URL while Customer Login remains an intentional unavailable state; task 1 and task 3 add the unit/integration coverage.
2. **No competing CTA state:** the floating Ship Now control must use the homepage hero when available or the shared top-page sentinel everywhere else, remain absent before that sentinel exits, and suppress around marked/focused bottom interaction zones; task 4 adds component and multi-route mobile end-to-end checks.
3. **Email regression:** traversing the four-step quote wizard must still prepare a `mailto:` draft for `delta.qoralis@gmail.com`; task 7 retains the existing quote end-to-end check in the Phase 1 gate.
4. **Motion capability changes:** switching to reduced motion or a coarse pointer after load must suppress choreography/ambient behavior safely; task 8 adds media-query and observer lifecycle tests, task 11 covers browser behavior.
5. **No-JavaScript route usability:** homepage and About content, normal navigation, header Ship Now link, and quote contact fallback must remain present with scripts disabled; task 11 extends Playwright no-JS coverage.

---

## File map

| Path | Action | Responsibility |
| --- | --- | --- |
| `public/logos/kag-light.svg`, `kag-dark.svg`, `kag-mono-light.svg`, `kag-mono-dark.svg`, `kag-mark.svg` | Modify | Lightweight conceptual KAG Logistics wordmark/mark variants with correct embedded text and theme contrast. |
| `components/ui/Logo.tsx` | Modify | Single theme/size-aware SVG registry and exact `KAG Logistics` accessible name. |
| `content/navigation.ts` | Modify | Header-only primary collection and a footer/contextual collection that retains Resources. |
| `content/destinations.ts` | Modify | Single verified `shipNow` URL configuration; leave unverified destinations unavailable. |
| `components/ui/ShipNowLink.tsx` | Create | Reusable external Ship Now anchor, accessible name, optional compact presentation, and external navigation safety. |
| `components/layout/SiteHeader.tsx`, `DesktopNavigation.tsx`, `MobileNavigation.tsx`, `SiteFooter.tsx` | Modify | Correct route hierarchy, logo variants, desktop/mobile action placements, and footer suppression marker. |
| `components/layout/FloatingShipNow.tsx` | Create | Client-only IntersectionObserver enhancement that uses a homepage hero or shared top-page sentinel, plus marked suppression regions, to control the persistent CTA cross-site. |
| `content/about.ts` | Create | Approved factual About copy and typed capability/industry data only. |
| `app/about/page.tsx` | Create | Server-rendered About route and route metadata. |
| `components/sections/AboutKag.tsx` | Create | Concise homepage company proof and `/about` route action. |
| `app/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`, `app/quote/page.tsx` | Modify | Homepage placement, shared top-page sentinel/progressive clients, About sitemap entry, and quote-page suppression marker. |
| `components/sections/QuoteSection.tsx`, `FinalCTA.tsx` | Modify | Mark homepage quote/final conversion zones that must temporarily suppress the floating CTA. |
| `features/motion/SectionChoreography.tsx` | Create | Small client observer that writes discrete section lifecycle data attributes. |
| `features/motion/AmbientCursor.tsx` | Create | Fine-pointer-only, reduced-motion-aware `requestAnimationFrame` CSS-variable updater and non-interactive ambient layer. |
| `app/globals.css` | Modify | Theme tokens, logo/header/floating CTA/About styling, choreography states, hover/focus families, and capability-specific responsive/reduced-motion rules. |
| `tests/unit/navigation.test.ts` | Create | Pure assertions for ordered navigation data and the verified Ship Now destination. |
| `tests/integration/Logo.test.tsx`, `SiteHeader.test.tsx`, `MobileNavigation.test.tsx`, `HomepageSections.test.tsx` | Modify | Phase 1 visual-semantic, action, and hierarchy contracts. |
| `tests/integration/AboutPage.test.tsx`, `FloatingShipNow.test.tsx`, `MotionEnhancements.test.tsx` | Create | About content/metadata, floating CTA observer state, and motion capability/lifecycle contracts. |
| `tests/setup.ts` | Modify | Deterministic test helpers for `IntersectionObserver`, `matchMedia`, and animation-frame cleanup where the new component tests need them. |
| `e2e/navigation.spec.ts`, `responsive.spec.ts`, `reduced-motion.spec.ts`, `no-js.spec.ts`, `accessibility.spec.ts` | Modify | Browser-level route, CTA URL/state, viewport, reduced-motion, no-JS, and axe checks. |
| `e2e/floating-ship-now.spec.ts` | Create | Homepage, About, and Technology visibility/suppression/non-occlusion coverage for the persistent CTA. |

## Phase 1 — brand, navigation, Ship Now, and About

### Task 1: Define failing Phase 1 contracts

**Files:**
- Create: `tests/unit/navigation.test.ts`
- Create: `tests/integration/AboutPage.test.tsx`
- Create: `tests/integration/FloatingShipNow.test.tsx`
- Modify: `tests/integration/Logo.test.tsx`
- Modify: `tests/integration/SiteHeader.test.tsx`
- Modify: `tests/integration/MobileNavigation.test.tsx`
- Modify: `tests/integration/HomepageSections.test.tsx`
- Modify: `e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: existing `primaryNavigation`, `externalDestinations`, `Logo`, `SiteHeader`, `MobileNavigation`, and homepage exports.
- Produces: required test contracts for `footerNavigation`, `ShipNowLink`, `FloatingShipNow`, `AboutPage`, and `AboutKag` used by tasks 2–6.

- [ ] **Step 1: Write the Phase 1 failing tests**

Add focused assertions for this exact primary label sequence: `Solutions`, `Industries`, `Technology`, `About`, `Carriers`, `Careers`; assert `Resources` is absent from primary desktop/mobile navigation and present in footer data. Assert `externalDestinations.shipNow` equals `{ kind: 'url', href: 'https://www.kaglogistics.com/ship-now-2/' }`, KAG logo images use alt text `KAG Logistics`, header and mobile drawer expose Ship Now anchors with that URL, About renders its required headline/capabilities/industries/actions, and the homepage About link targets `/about`. Add a browser route check for `/about` and both CTA hrefs.

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `npm run test -- tests/unit/navigation.test.ts tests/integration/Logo.test.tsx tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx tests/integration/HomepageSections.test.tsx tests/integration/AboutPage.test.tsx tests/integration/FloatingShipNow.test.tsx`

Expected: FAIL because About, footer navigation split, Ship Now URL/link components, and floating control do not exist yet.

- [ ] **Step 3: Add the `/about` browser assertion without changing production behavior**

Extend `e2e/navigation.spec.ts` to include `/about`, then assert header Ship Now and opened-drawer Ship Now resolve to the single verified URL. Do not remove the existing quote route assertion.

- [ ] **Step 4: Run the new focused test file to preserve a red baseline**

Run: `npm run test -- tests/unit/navigation.test.ts`

Expected: FAIL only on the unimplemented navigation/destination values, not a test-runner configuration error.

### Task 2: Replace the conceptual KAG Logistics SVG identity and central logo mapping

**Files:**
- Modify: `public/logos/kag-light.svg`
- Modify: `public/logos/kag-dark.svg`
- Modify: `public/logos/kag-mono-light.svg`
- Modify: `public/logos/kag-mono-dark.svg`
- Modify: `public/logos/kag-mark.svg`
- Modify: `components/ui/Logo.tsx`
- Modify: `app/globals.css`
- Test: `tests/integration/Logo.test.tsx`

**Interfaces:**
- Consumes: `LogoVariant = 'light' | 'dark' | 'mono-light' | 'mono-dark' | 'mark'`.
- Produces: `Logo({ variant?: LogoVariant; size?: 'wordmark' | 'mark' })` with exact image alt text `KAG Logistics`, light/dark image classes, and a compact mark source for tasks 3 and 6.

- [ ] **Step 1: Run the logo contract test and capture the failing assertion**

Run: `npm run test -- tests/integration/Logo.test.tsx`

Expected: FAIL for the new source/variant or accessibility assertions added in task 1.

- [ ] **Step 2: Replace each SVG with the approved conceptual identity direction**

Use a bold horizontal `KAG` wordmark, smaller `LOGISTICS` descriptor, and restrained route/directional motif. Keep the SVGs dependency-free, scalable, and visually legible at 40px header height. Ensure no SVG contains `KED` or other incorrect naming.

- [ ] **Step 3: Update `Logo` and its CSS theme selection**

Keep `Logo` as the only source registry. Preserve its public props; ensure normal wordmark output renders the appropriate light/dark assets and mark output renders the compact mark. Replace any footer-only inversion behavior with explicit variant/theme styling that remains readable in both themes.

- [ ] **Step 4: Run brand-focused checks**

Run: `npm run test -- tests/integration/Logo.test.tsx && rg -n -i '\\bKED\\b|ked logistics|kag logisitcs|kaglogisitcs' --glob '!node_modules/**' --glob '!package-lock.json' .`

Expected: Logo tests PASS; the brand audit produces no matches.

### Task 3: Restructure navigation and make Ship Now a centralized accessible action

**Files:**
- Modify: `content/navigation.ts`
- Modify: `content/destinations.ts`
- Create: `components/ui/ShipNowLink.tsx`
- Modify: `components/layout/SiteHeader.tsx`
- Modify: `components/layout/DesktopNavigation.tsx`
- Modify: `components/layout/MobileNavigation.tsx`
- Modify: `components/layout/SiteFooter.tsx`
- Modify: `components/ui/LinkOrUnavailable.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/navigation.test.ts`
- Test: `tests/integration/SiteHeader.test.tsx`
- Test: `tests/integration/MobileNavigation.test.tsx`

**Interfaces:**
- Consumes: `externalDestinations.shipNow` as `{ kind: 'url'; href: 'https://www.kaglogistics.com/ship-now-2/' }`.
- Produces: `primaryNavigation` for exactly the six header routes; `footerNavigation` that includes Resources; `ShipNowLink({ className?: string; compact?: boolean }): JSX.Element` for task 4 and Phase 2 styling.

- [ ] **Step 1: Run navigation/header/mobile tests to preserve the red baseline**

Run: `npm run test -- tests/unit/navigation.test.ts tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx`

Expected: FAIL until Resources is split from primary navigation and Ship Now is rendered as a configured external link.

- [ ] **Step 2: Implement the configuration and shared action boundary**

Set only `shipNow` to the verified URL. Keep Customer Login and other unverified destinations as accessible unavailable states. Split header and footer arrays. Implement `ShipNowLink` using the centralized destination and safe external anchor attributes; it must not duplicate the URL string or render a fallback `#` destination.

- [ ] **Step 3: Integrate exact actions in responsive layout components**

Place Ship Now after Get a Quote in the desktop header action group and as a full-width action in the mobile dialog. Render Resources from `footerNavigation` in the footer. Preserve the menu’s current Escape handling, focus trap, and focus restoration; close the drawer after an internal navigation click without compromising the external Ship Now anchor.

- [ ] **Step 4: Add the required restrained header/mobile Ship Now treatment and run tests**

Implement theme-aware base styling, visible keyboard focus, and 44px targets. In Phase 1, give the header Ship Now action a low-intensity border/background illumination or shine transition, small arrow translation, and slight hover elevation; stop the continuous/decorative portion under reduced motion. Keep the mobile drawer action touch-first and static outside hover-capable contexts. Run: `npm run test -- tests/unit/navigation.test.ts tests/integration/SiteHeader.test.tsx tests/integration/MobileNavigation.test.tsx tests/integration/LinkOrUnavailable.test.tsx`

Expected: PASS.

### Task 4: Add the progressive persistent Ship Now control

**Files:**
- Create: `components/layout/FloatingShipNow.tsx`
- Modify: `components/sections/Hero.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/quote/page.tsx`
- Modify: `components/layout/SiteFooter.tsx`
- Modify: `components/sections/QuoteSection.tsx`
- Modify: `components/sections/FinalCTA.tsx`
- Modify: `app/globals.css`
- Modify: `tests/setup.ts`
- Test: `tests/integration/FloatingShipNow.test.tsx`
- Create: `e2e/floating-ship-now.spec.ts`
- Modify: `e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: `ShipNowLink`, optional homepage hero sentinel `id="hero"`, shared layout sentinel `id="floating-cta-top-sentinel"`, `[data-floating-cta-suppress]`, `IntersectionObserver`, and `(prefers-reduced-motion: reduce)`.
- Produces: `FloatingShipNow(): JSX.Element`, initially hidden and then rendered/visible after the preferred opening sentinel is no longer intersecting unless a marked suppression region or focus within one is active.

- [ ] **Step 1: Write observer-state tests and install only the required deterministic test double**

In `FloatingShipNow.test.tsx`, mock `IntersectionObserver` and render: (a) a homepage hero plus shared sentinel, and (b) only the shared sentinel. Assert the hero is preferred when present; an intersecting preferred sentinel keeps the action hidden; a non-intersecting preferred sentinel reveals exactly one accessible Ship Now link at the configured URL; a `[data-floating-cta-suppress]` observer entry hides it; leaving that region reveals it again; and unmount disconnects every observer. Add a focused-element case proving that focus inside a marked suppression region hides the action. In `tests/setup.ts`, add a resettable observer helper only if the local test cannot safely define it.

- [ ] **Step 2: Run the floating-control test to verify it fails**

Run: `npm run test -- tests/integration/FloatingShipNow.test.tsx`

Expected: FAIL because the client control has not been implemented.

- [ ] **Step 3: Implement the universal `FloatingShipNow` visibility contract and mount its shared sentinel**

Mount a visually inert shared top-page sentinel immediately after the opening header/top area in `app/layout.tsx`. In `FloatingShipNow`, observe `#hero` when the current route has one; otherwise observe `#floating-cta-top-sentinel`. Also observe every `[data-floating-cta-suppress]` region with a small active-region set and add minimal `focusin`/`focusout` handling for focus inside those marked regions. Visibility is `opening sentinel has exited AND no suppression region/focused suppression region is active`. Disconnect all observers and remove focus listeners on unmount. Use the shared link with an `aria-label` that distinguishes the persistent action without changing its visible `SHIP NOW` wording. Do not add a scroll event listener, a second hard-coded URL, or a general overlay manager.

- [ ] **Step 4: Style safe desktop/mobile placement and verify it**

Add `data-floating-cta-suppress` to the footer, homepage quote section, homepage final CTA, and `/quote` main/quote-control region so the action never covers those controls. Use a fixed lower-right desktop pill and a bottom-safe mobile position with `env(safe-area-inset-bottom)`. Use transform/opacity for entry, and disable that transition under reduced motion. In `e2e/floating-ship-now.spec.ts`, scroll beyond the opening region on `/`, `/about`, and `/technology`; assert the same configured action appears. On `/`, `/quote`, and a mobile viewport, assert it hides while a marked suppression region is active and reappears after it leaves where further page content remains. Assert the action is in viewport when shown and does not overlap the active quote/form control.

- [ ] **Step 5: Run the focused checks**

Run: `npm run test -- tests/integration/FloatingShipNow.test.tsx && npm run test:e2e -- e2e/floating-ship-now.spec.ts e2e/responsive.spec.ts`

Expected: PASS.

### Task 5: Add factual About content and the first-class `/about` route

**Files:**
- Create: `content/about.ts`
- Create: `app/about/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/integration/AboutPage.test.tsx`
- Modify: `tests/unit/metadata.test.ts`

**Interfaces:**
- Consumes: `createPageMetadata`, `ShipNowLink`, and typed data from `content/about.ts`.
- Produces: `aboutCapabilities: readonly string[]`, `aboutIndustries: readonly string[]`, `aboutSummary: string`, and default `AboutPage` with KAG-specific metadata.

- [ ] **Step 1: Run About and metadata tests to confirm the route/content is absent**

Run: `npm run test -- tests/integration/AboutPage.test.tsx tests/unit/metadata.test.ts`

Expected: FAIL because `app/about/page.tsx` and `content/about.ts` do not exist.

- [ ] **Step 2: Create the factual content module**

Define concise original copy only for the approved headquarters, subsidiary relationship, managed transportation/value-added services, North American scope, six named industries, six required capabilities, and People + Network + Technology narrative. Do not add dates, customer names, locations beyond North Canton, performance figures, awards, or unsupported claims.

- [ ] **Step 3: Implement the server-rendered `/about` page**

Use `createPageMetadata({ title: 'About KAG Logistics', description: ..., path: '/about' })`. Render semantic hero, company overview, capability card/list region, industry list, People/Network/Technology section, Get a Quote link, and `ShipNowLink`. Keep the visual treatment page-specific but reuse existing section/card conventions where they fit.

- [ ] **Step 4: Run route tests**

Run: `npm run test -- tests/integration/AboutPage.test.tsx tests/unit/metadata.test.ts`

Expected: PASS.

### Task 6: Place the concise homepage About KAG section and complete route discovery

**Files:**
- Create: `components/sections/AboutKag.tsx`
- Modify: `app/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/globals.css`
- Modify: `tests/integration/HomepageSections.test.tsx`
- Modify: `e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: `aboutSummary` and People/Network/Technology labels from `content/about.ts`.
- Produces: `AboutKag(): JSX.Element` and an `/about` sitemap path.

- [ ] **Step 1: Run the homepage and navigation contracts**

Run: `npm run test -- tests/integration/HomepageSections.test.tsx && npm run test:e2e -- e2e/navigation.spec.ts`

Expected: Homepage assertion remains red until the About section is placed after the early solutions/value story; browser test becomes green once `/about` exists.

- [ ] **Step 2: Implement `AboutKag` and position it in `app/page.tsx`**

Use a visually distinctive industrial-grid/split composition, the exact visible heading `About KAG Logistics`, concise approved summary, three People/Network/Technology mini-signals, and one descriptive `/about` link named `Discover KAG Logistics`. Place it after `SolutionsGrid` and before the technology/industry proof sections so it complements rather than duplicates the full route.

- [ ] **Step 3: Add `/about` to the sitemap and responsive styles**

Append `/about` to the static paths while preserving current conditional-origin behavior. Ensure the section becomes a single readable column before any mobile clipping or dense tile layout can occur.

- [ ] **Step 4: Run focused checks**

Run: `npm run test -- tests/integration/HomepageSections.test.tsx tests/integration/AboutPage.test.tsx && npm run test:e2e -- e2e/navigation.spec.ts e2e/responsive.spec.ts`

Expected: PASS.

### Task 7: Verify and commit Phase 1 as an independently stable delivery

**Files:**
- Modify only if verification exposes a Phase 1 defect: files owned by tasks 2–6.
- Test: all Phase 1 test and end-to-end files.

**Interfaces:**
- Consumes: completed Phase 1 features and the unchanged quote-email service.
- Produces: one verified Phase 1 commit, ready for the Phase 2 test baseline.

- [ ] **Step 1: Run static quality gates**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`

Expected: all commands exit 0.

- [ ] **Step 2: Run browser, accessibility, and no-JavaScript checks**

Run: `npm run test:e2e`

Expected: PASS, including four-step quote flow preparing the email draft, desktop/mobile navigation, `/about`, both themes, reduced motion, responsive containment, and no-JavaScript fallback.

- [ ] **Step 3: Perform manual Phase 1 visual QA**

Inspect homepage light/dark desktop, homepage mobile, `/about`, `/quote`, header, mobile drawer, footer, both Ship Now states, and an opened email-preparation confirmation. Confirm no console/hydration errors, incorrect logo text, KED spelling, clipping, focus loss, or CTA obstruction.

- [ ] **Step 4: Commit the verified Phase 1 slice**

```bash
git add public/logos components content app tests e2e
git commit -m "feat: add KAG brand, about experience and ship-now CTAs"
```

Expected: one commit containing only Phase 1 product/test changes; no changes to the approved spec or quote-email service.

## Phase 2 — motion and interaction system (only after Task 7 passes)

### Task 8: Define failing progressive-enhancement and motion contracts

**Files:**
- Create: `tests/integration/MotionEnhancements.test.tsx`
- Modify: `tests/integration/FloatingShipNow.test.tsx`
- Modify: `tests/setup.ts`
- Modify: `e2e/reduced-motion.spec.ts`
- Modify: `e2e/no-js.spec.ts`
- Modify: `e2e/accessibility.spec.ts`

**Interfaces:**
- Consumes: the Phase 1 global layout, `FloatingShipNow`, `matchMedia`, and test observer helpers.
- Produces: exact behavior contracts for `SectionChoreography` and `AmbientCursor` used by tasks 9–11.

- [ ] **Step 1: Write failing motion tests**

Test that an opted-in section receives `data-choreography-state="entering"`, `"centered"`, and `"exiting"` only from observer entries; test that reduced motion does not attach an observer or cursor listener; test that coarse-pointer media does not start the cursor loop; and test cleanup cancels the pending animation frame/removes listeners. Extend no-JS browser coverage to `/about` and visible static Ship Now/quote contact content. Extend axe coverage to `/about` and a post-hero floating CTA state.

- [ ] **Step 2: Run these tests to verify they fail**

Run: `npm run test -- tests/integration/MotionEnhancements.test.tsx tests/integration/FloatingShipNow.test.tsx`

Expected: FAIL because the choreography and ambient modules are absent.

- [ ] **Step 3: Prepare deterministic capability doubles**

Make `matchMedia`, `IntersectionObserver`, and `requestAnimationFrame` helpers resettable after each test. Do not permanently force reduced-motion/coarse-pointer behavior globally, because existing theme and quote tests require the normal DOM environment.

### Task 9: Implement reusable section choreography and apply coordinated home/About composition

**Files:**
- Create: `features/motion/SectionChoreography.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/integration/MotionEnhancements.test.tsx`

**Interfaces:**
- Consumes: elements marked `data-choreography` and `matchMedia('(prefers-reduced-motion: reduce)')`.
- Produces: `SectionChoreography(): null`, which assigns exactly `entering`, `centered`, or `exiting` to `data-choreography-state` and disconnects on cleanup.

- [ ] **Step 1: Run choreography tests against the absent module**

Run: `npm run test -- tests/integration/MotionEnhancements.test.tsx`

Expected: FAIL with an unresolved module or missing lifecycle state assertions.

- [ ] **Step 2: Implement `SectionChoreography`**

Mount one client-only instance from `app/layout.tsx`. Query only `[data-choreography]`, seed an immediate readable static state, observe each element with a documented center-oriented root margin/threshold, write the three named state values, and disconnect on cleanup. Return `null`; do not wrap or hide server content.

- [ ] **Step 3: Mark homepage and About composition boundaries**

Add lightweight attributes/wrappers around Hero, About KAG, problem cards, solutions, Technology, Industries, result/process, quote, carrier, careers, resources, final CTA, and About page sections. Preserve each existing landmark/heading relationship; wrappers are presentational only. Implement CSS state rules that emphasize centered content, subtly reduce departing emphasis, and create parent-controlled card-grid assembly rather than independent card drift.

- [ ] **Step 4: Run motion tests and focused browser reduced-motion check**

Run: `npm run test -- tests/integration/MotionEnhancements.test.tsx && npm run test:e2e -- e2e/reduced-motion.spec.ts`

Expected: PASS.

### Task 10: Establish theme-specific interaction palettes and component-family hover/focus language

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/ShipNowLink.tsx`
- Modify: `components/layout/FloatingShipNow.tsx`
- Modify: `tests/integration/SiteHeader.test.tsx`
- Modify: `e2e/accessibility.spec.ts`

**Interfaces:**
- Consumes: shared class names from existing buttons/cards/nav/footer/form controls and `ShipNowLink` class hooks.
- Produces: CSS variables for light/dark interaction tokens plus distinct hover/focus/active behavior for navigation/footer links, quote buttons, Ship Now links, cards, form controls, and theme control.

- [ ] **Step 1: Add targeted semantic/class assertions before styling**

Assert the header and floating CTA expose the Ship Now semantic class hook used by CSS and retain a visible accessible link name. Keep behavior tests independent of computed pixel values.

- [ ] **Step 2: Implement family-specific interaction tokens and CSS**

Define theme-scoped interaction surface, border, and ambient colors. Give navigation/footer links a route-line/foreground response; quote actions a constrained lift; cards a border/elevation response; form controls focus/validation clarity; and Ship Now the strongest restrained expansion, illumination, and arrow movement. Retain `:focus-visible` outlines and never depend on hover for required information.

- [ ] **Step 3: Unify the existing Ship Now behavior with the Phase 2 interaction language**

Retain the Phase 1 header animation and apply compatible persistent-CTA variants so both actions remain visually connected but scale appropriately. Use only transition/transform/opacity and pause/simplify under reduced motion. Do not alter destination, role, or keyboard behavior.

- [ ] **Step 4: Run interaction/accessibility checks**

Run: `npm run test -- tests/integration/SiteHeader.test.tsx tests/integration/FloatingShipNow.test.tsx && npm run test:e2e -- e2e/accessibility.spec.ts`

Expected: PASS in light and dark themes.

### Task 11: Implement ambient cursor, reduced-motion/touch simplification, and static fallback verification

**Files:**
- Create: `features/motion/AmbientCursor.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `tests/integration/MotionEnhancements.test.tsx`
- Modify: `e2e/reduced-motion.spec.ts`
- Modify: `e2e/responsive.spec.ts`
- Modify: `e2e/no-js.spec.ts`

**Interfaces:**
- Consumes: `(pointer: fine)`, `(prefers-reduced-motion: reduce)`, document `pointermove`, `requestAnimationFrame`, and CSS variables `--cursor-x`/`--cursor-y`.
- Produces: `AmbientCursor(): JSX.Element | null`, which adds a decorative `aria-hidden` layer only for supported input/motion capability and removes listeners/frames on cleanup.

- [ ] **Step 1: Run ambient capability and cleanup tests while red**

Run: `npm run test -- tests/integration/MotionEnhancements.test.tsx`

Expected: FAIL for missing cursor component and cleanup expectations.

- [ ] **Step 2: Implement the fine-pointer ambient controller**

Gate mounting on both media queries. Store target/current coordinates in refs, schedule at most one animation frame, ease toward the latest pointer point, and update CSS custom properties on the ambient element or document root. Use a fixed `pointer-events: none`, `aria-hidden="true"` layer with a small theme-specific radial gradient. Do not use React state per pointer move, canvas, or layout reads.

- [ ] **Step 3: Complete capability-specific CSS and browser checks**

Disable ambient and continuous choreography on reduced motion; disable ambient on coarse pointers; keep touch-safe floating CTA placement; retain static readable section/card states and normal focus/hover feedback. Extend no-JS test to visit `/about`, verify a header Ship Now href and quote fallback, and extend mobile/reduced-motion tests to assert no overflow or overlay obstruction.

- [ ] **Step 4: Run focused capability verification**

Run: `npm run test -- tests/integration/MotionEnhancements.test.tsx && npm run test:e2e -- e2e/reduced-motion.spec.ts e2e/responsive.spec.ts e2e/no-js.spec.ts`

Expected: PASS.

### Task 12: Verify, whole-branch review, and create the PR without merging

**Files:**
- Modify only if verification exposes a Phase 2 defect: files owned by tasks 8–11.
- Test: complete unit, integration, end-to-end, accessibility, and production-build suites.

**Interfaces:**
- Consumes: completed Phase 1 baseline and Phase 2 progressive enhancements.
- Produces: one or more verified Phase 2 commits and a pull request targeting `main`, ready for merge approval but not merged.

- [ ] **Step 1: Run final required commands**

Run:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Expected: every command exits 0.

- [ ] **Step 2: Perform final manual visual and interaction QA**

Inspect homepage desktop light, homepage desktop dark, homepage mobile, `/about`, `/technology`, `/quote`, header, mobile navigation, header/persistent Ship Now, scroll composition, hover/focus treatments, cursor ambient behavior, reduced-motion behavior, touch behavior, console, and hydration output. Confirm the quote wizard still prepares an email to `delta.qoralis@gmail.com`.

- [ ] **Step 3: Commit the verified Phase 2 changes**

```bash
git add app components features tests e2e content
git commit -m "feat: add KAG scroll interaction system"
```

Use an additional `fix:` commit only if final verification identifies a focused defect. Do not amend the Phase 1 commit or the approved specification.

- [ ] **Step 4: Run a fresh final whole-branch review**

Use the Native execution workflow’s fresh reviewer on the completed branch. Provide the verified diff, required-command results, and the accessibility/no-JavaScript/mobile evidence. Treat Critical and Important findings as blocking.

- [ ] **Step 5: Resolve review findings and re-verify when necessary**

For every Critical or Important finding, add a focused regression test when applicable, implement the narrow fix, rerun the affected test plus all five final required commands, and request a follow-up review. Commit focused `fix:` changes. Do not change the approved specification to dismiss a finding.

- [ ] **Step 6: Push, create the PR, report results, and stop before merge**

Push `feature/kag-brand-company-motion`, create a PR targeting `main` without seeking another authorization, attach the PR to the task, and report the PR URL/number, target branch, final commit SHA, review outcome, and final verification results. Stop at the merge approval gate; never merge automatically.

## Commit boundaries

1. `feat: add KAG brand, about experience and ship-now CTAs` — only tasks 1–7 product/test changes after Phase 1 verification.
2. `feat: add KAG scroll interaction system` — tasks 8–12 product/test changes after final verification.
3. Optional narrow `fix:` commit only for a defect found in the final required verification suite; do not use it for unrelated refactoring.

## Execution recommendation

Use the **Native** execution method: implement the tasks sequentially in this session with TDD and the required final whole-branch review. The Phase 2 interfaces intentionally build on a verified Phase 1 layout and test baseline, so a single implementation context minimizes handoff mistakes while the final independent review still provides a separate quality gate.
