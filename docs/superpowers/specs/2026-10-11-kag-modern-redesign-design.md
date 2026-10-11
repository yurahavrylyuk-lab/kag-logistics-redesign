# KAG Logistics Modern Redesign — Design Specification

**Status:** Approved design direction; implementation requires a separate approved plan.

**Date:** 2026-10-11

**Scope:** Phase-one front-end prototype for a modern, conversion-led KAG Logistics website.

## 1. Product definition

### Purpose and business objective

Create a premium KAG Logistics digital experience that positions the company as a mission-critical transportation and logistics partner—not simply a trucking company. The site must make a prospective shipper understand, quickly and credibly, that KAG combines people, network, and technology to bring complex supply chains under control.

The business objective is qualified lead generation. The primary conversion is a quote request; the secondary conversion is starting a conversation with a logistics expert. Carrier acquisition and career discovery are important intentional journeys, but must not compete with the primary commercial path.

### Audiences

| Audience | Needs | Primary conversion |
| --- | --- | --- |
| Shippers / customers (primary) | Reliable capacity, visibility, cost control, a trusted logistics partner, industry fit | Get a Quote; Talk to a Logistics Expert |
| Carriers | Freight opportunities, support, lanes, payment confidence, registration | Become a Carrier; Carrier Resources |
| Candidates | Relevant roles, culture, training, growth, benefits | Search Open Positions; Explore Careers |

### Positioning

**Kinetic Industrial + Command Center:** industrial credibility first; premium and technology-forward presentation second. KAG is presented as an operational control partner for supply chains that cannot afford disruption. Technology is proof of coordinated execution, not a standalone SaaS product.

### Success criteria

- A shipper can identify the value proposition, relevant problem, solution, and quote path without needing to navigate away.
- Carrier and career routes are clear, intentional, and accessible from the header and homepage without diluting the shipper CTA.
- Visuals feel custom to KAG: industrial, human, and operationally intelligent.
- Both themes are deliberately designed and accessible.
- Quote flow is polished and realistic with no production integration implied.
- The experience meets the performance, accessibility, SEO, and testing release criteria in this specification.

### Phase-one boundaries and non-goals

Phase one includes a responsive front-end prototype, illustrative technology visuals, a mock quote-service layer, and analytics-ready interfaces. It does **not** include:

- production CRM, email, or quote API integration;
- live shipment data, real customer authentication, or customer login;
- carrier-registration backend processing;
- careers ATS integration beyond an optional verified external job link;
- a CMS or production analytics vendor;
- an officially approved KAG corporate rebrand.

The refreshed mark is a conceptual prototype evolution. It must be replaceable by official artwork without restructuring header or footer code.

## 2. Information architecture

### Sitemap

```text
/
├── solutions/
│   ├── transportation-management/
│   ├── freight-brokerage/
│   ├── dedicated-transportation/
│   ├── expedite-critical-freight/
│   ├── multimodal-specialized-logistics/
│   └── value-added-logistics/
├── industries/
│   ├── chemicals/
│   ├── energy-renewables/
│   ├── food-beverage/
│   ├── manufacturing/
│   ├── agriculture/
│   ├── construction-infrastructure/
│   ├── pharmaceutical/
│   └── environmental/
├── technology/
│   ├── transportation-management/
│   ├── tracking-visibility/
│   ├── integrations-and-automation/
│   └── analytics-and-optimization/
├── resources/
│   ├── case-studies/
│   ├── insights/
│   └── industry-updates/
├── carriers/
│   ├── benefits/
│   ├── resources/
│   └── registration/
├── careers/
│   ├── life-at-kag/
│   ├── growth-training/
│   ├── benefits/
│   └── jobs/ (external or future ATS route)
├── company/
│   ├── about/
│   ├── safety-and-security/
│   └── contact/
└── quote/
```

Routes beyond the homepage may initially be compact prototype pages or intentional placeholders where content has not been approved. The homepage must not absorb their full detail.

### Page responsibilities

| Area | Homepage role | Dedicated-page role |
| --- | --- | --- |
| Solutions | Introduce six solution paths and their business outcomes | Explain scope, industry fit, approach, and conversion CTA |
| Industries | Establish relevant specialization | Surface sector-specific operational complexity and proof |
| Technology | Prove operational control with an illustrative Command Center | Explain verified capabilities and integrations without unsupported claims |
| Case studies | Fast trust signal using qualitative outcomes or verified facts | Full story, evidence, and related next action |
| Carriers | Clear fork in journey | Benefits, resources, and registration experience |
| Careers | Human and growth signal | Recruiting narrative and job search |

### Audience journeys

**Shipper:** Hero → challenge that matches need → related solution → technology proof → qualitative/verified trust → quote wizard. A second route is Hero → Solutions → solution/industry detail → quote.

**Carrier:** Header or homepage carrier panel → Carrier hub → benefits/resources → registration. The full carrier form is never embedded on the homepage.

**Candidate:** Header or careers panel → Careers hub → culture/growth/benefits → Search Open Positions. The job action may use a verified external link until an ATS integration exists.

## 3. Homepage specification

### 3.1 Header

- **Purpose:** Establish identity and keep shipper conversion reachable.
- **Content:** Conceptual KAG wordmark; Solutions, Industries, Technology, Resources, Carriers, Careers, Company; Customer Login; theme switcher; Get a Quote.
- **Message/CTA:** Persistent `Get a Quote`; Customer Login remains a low-emphasis utility item.
- **Layout:** Transparent over hero, changing to an opaque elevated surface after a defined scroll threshold. Desktop uses structured mega menus for Solutions and Industries.
- **Responsive behavior:** Mobile uses an accessible drawer with all routes; quote CTA is persistent inside the drawer and may appear as a compact sticky action only where it does not cover content.
- **Interaction/motion:** Logo and nav never depend on hover to reveal critical routes. Transition opacity/background only; no disorienting repositioning.
- **Accessibility:** Skip link, semantic `nav`, keyboard-operable menus, escape-to-close drawer, focus trap only while drawer is open, 44px minimum targets.
- **Dependencies:** Navigation data, logo asset registry, utility links.

### 3.2 Hero

- **Purpose:** Explain KAG in an outcome-led sentence and immediately start the shipper path.
- **Content:** Eyebrow `North American Logistics`; outcome-led headline; concise support copy about managed transportation, reliable capacity, supply-chain technology, and 24/7 expertise; primary and secondary CTAs; urgent-transport link.
- **CTA:** `Get a Quote` and `Explore Solutions`; tertiary `Need urgent transportation? Ship Now →`.
- **Layout:** Two-column desktop composition with copy retaining priority over the hero visual. Large visual field uses the logistics-network composition specified in section 7.
- **Responsive behavior:** Stacked mobile layout; copy and primary CTA precede the simplified visual.
- **Motion:** Ambient route motion only; static fallback remains intentional.
- **Accessibility:** Visual is decorative unless a concise text alternative conveys additional essential meaning. No data is conveyed solely by color or movement.
- **Dependencies:** Approved copy; hero visual renderer; optional centralized media configuration.

### 3.3 Trust marquee

- **Purpose:** Establish scale and operating confidence without making unverified numerical claims.
- **Content:** `24/7/365 Operations`, `North American Coverage`, `Multimodal Transportation`, `Real-Time Visibility`, `Dedicated Logistics Experts` only after factual review; otherwise use approved equivalents.
- **Layout:** Full-width information rail separating hero from problem framing.
- **Behavior:** Seamless duplicated sequence, readable as static content; pause on hover/focus; static under reduced motion.
- **Accessibility:** The content appears once in the accessibility tree; duplicated animated copy is hidden.
- **Dependencies:** Approved factual copy.

### 3.4 Supply-chain challenges

- **Purpose:** Lead with buyer pain before presenting services.
- **Content:** Capacity, visibility, cost control, and vendor complexity, each with a concise outcome and a link to the relevant solution.
- **Layout:** Four asymmetric cards on desktop; stacked or scrollable cards on small screens only if each card remains fully keyboard accessible.
- **Motion:** Pointer hover elevation and directional route detail; disabled for touch/reduced motion.
- **Accessibility:** Use linked article/card patterns with descriptive link text, not clickable non-semantic divs.
- **Dependencies:** Challenge-to-solution mapping.

### 3.5 Solutions

- **Purpose:** Offer six clear paths without listing every service feature.
- **Content:** Transportation Management, Freight Brokerage, Dedicated Transportation, Expedite & Critical Freight, Multimodal & Specialized Logistics, Value-added Logistics Services.
- **CTA:** Each card routes deeper; section CTA is `Explore All Solutions`.
- **Layout:** Hierarchical grid: one anchor card plus supporting cards rather than a repeated six-card template.
- **Responsive behavior:** Single-column priority order follows shipper relevance; no dense two-column mobile tiles.
- **Motion/accessibility:** Modest elevation and line reveal; cards remain fully understandable with motion removed.
- **Dependencies:** Solution content collection, destination routes, optional icon registry.

### 3.6 Technology Command Center

- **Purpose:** Prove operational control through a realistic but illustrative product visual.
- **Content:** A labeled illustrative Command Center, a short verified capability statement, and a `Explore Technology` CTA.
- **Layout:** Copy/panel pairing on desktop with the application-like composition dominant but not overwhelming. Mobile uses a single prioritized status/story view.
- **Motion:** Only selected route progress, status transition, and small alert emphasis animate. No fake live counter loops.
- **Accessibility:** The complex visual has a concise textual summary; decorative granular UI is hidden from screen readers.
- **Dependencies:** Illustrative demo data; verified capability copy; technology destination.

### 3.7 Industries

- **Purpose:** Demonstrate specialized understanding without claiming unverified outcomes.
- **Content:** Chemicals, Energy/Renewables, Food & Beverage, Manufacturing, Agriculture, Construction & Infrastructure, Pharmaceutical, Environmental.
- **CTA:** `Explore Industries` plus deep links from selected items.
- **Layout:** Rich image/texture cards with a selectable featured industry or compact grid.
- **Responsive behavior:** Priority stacked list or swipe-safe carousel with no hidden essential content.
- **Accessibility:** Selector uses buttons/tabs only if it changes a visible panel and follows correct keyboard semantics.
- **Dependencies:** Industry content, centrally managed media, destinations.

### 3.8 Capability/industry strip

- **Purpose:** Show breadth after industry depth.
- **Content:** Approved mode/capability terms such as Brokerage, Dedicated, Bulk, Drayage, Expedited, Cross-border, Rail, Transloading.
- **Behavior:** Same information-rail rules as the trust marquee; do not add a third moving strip unless content density supports it.
- **Dependencies:** Factual mode list.

### 3.9 Results and case studies

- **Purpose:** Create trust quickly before the conversion form.
- **Content:** Up to three cards, classified as Case Study, Logistics Insight, or Industry Update. Use verified facts only; otherwise qualitative outcome language and clearly illustrative content.
- **CTA:** `View Case Studies` / `Explore Resources`.
- **Layout:** Editorial image-led cards, not dashboard tiles.
- **Accessibility/dependencies:** Descriptive image text when informative; case-study/resource collections.

### 3.10 How KAG Works

- **Purpose:** Lower perceived risk by explaining the operating model.
- **Content:** `01 Understand`, `02 Design`, `03 Execute`, `04 Monitor`, `05 Optimize`.
- **Layout:** Horizontal connected path on desktop; vertical numbered sequence on mobile.
- **Motion:** A single route line progresses once on entry; static numbered sequence under reduced motion.
- **Accessibility:** Ordered list semantics preserve the model independent of the visual line.

### 3.11 Quote wizard

- **Purpose:** Deliver the strongest conversion moment with minimal friction.
- **Placement:** Full module after proof and process; hero action scrolls to or opens this same canonical wizard—not a duplicate form.
- **Content/flow:** Freight type → Origin/Destination → Pickup timing → Contact/business context → review/submission confirmation.
- **CTA:** `Request Pricing`; secondary contextual `Talk to a Logistics Expert` near, but outside, the critical form flow.
- **Responsive behavior:** One column, visible textual progress, no modal-only interaction on mobile.
- **Accessibility:** Detailed in section 9.
- **Dependencies:** Form schema, mock quote service, analytics adapter.

### 3.12 Carrier section

- **Purpose:** Give carriers a deliberate exit route without interrupting the shipper story.
- **Content:** Freight opportunities, dedicated lanes, support, payments, and technology—only where publicly supportable.
- **CTA:** `Become a KAG Carrier`; `Carrier Resources`.
- **Layout:** Distinct but calmer composition, visually subordinate to the quote module.
- **Dependencies:** Carrier content and routes.

### 3.13 Careers section

- **Purpose:** Present KAG as a serious employer through people, training, growth, and safety.
- **Content:** Career Growth, Benefits, Training, Life at KAG.
- **CTA:** `Search Open Positions`; `Life at KAG`.
- **Layout:** Human photography-led panel, intentionally warmer than the technology visual.
- **Dependencies:** Central media configuration; verified jobs destination.

### 3.14 Resources

- **Purpose:** Start a future knowledge-center path without bloating the homepage.
- **Content:** Three selected resource cards with a category, title, short summary, and route.
- **CTA:** `Explore Resources`.
- **Dependencies:** Resource collection and card imagery.

### 3.15 Final CTA

- **Purpose:** Reassert shipper conversion after the complete narrative.
- **Content:** A succinct closing message about simplifying or controlling the supply chain, without repeating the hero verbatim.
- **CTA:** `Talk to a Logistics Expert`; `Get a Quote`.
- **Visual:** Strong dark or inverse surface with quiet route treatment; no competing marquee.
- **Accessibility:** Contrast and focus handling conform to the global system.

### 3.16 Footer

- **Purpose:** Provide reliable completion navigation and company credibility.
- **Content:** Grouped solution, industry, technology, carrier, career, resource, company, customer-login, contact, legal, and verified social links. Retain KAG's fraud/security warning after current-content verification.
- **Layout:** Responsive column groups that become ordered accordions/lists only if accessible.
- **Dependencies:** Contact/legal/social configuration, logo registry.

## 4. Design-system implementation tokens

Token names are normative; color values are prototype starting values to be contrast-tested before release.

```css
:root {
  --color-brand: #d94828;
  --color-brand-strong: #b8321c;
  --color-data: #2d6fae;
  --color-success: #19724a;
  --color-warning: #986000;
  --color-danger: #b42318;

  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem; --space-5: 1.5rem; --space-6: 2rem;
  --space-7: 3rem; --space-8: 4rem; --space-9: 6rem; --space-10: 8rem;
  --container-content: 80rem; --container-wide: 90rem;
  --gutter: clamp(1.25rem, 3vw, 2.5rem);
  --radius-sm: 0.375rem; --radius-md: 0.75rem; --radius-lg: 1.25rem;
  --border-hairline: 1px;
  --z-base: 0; --z-raised: 10; --z-header: 50; --z-drawer: 100; --z-dialog: 200; --z-toast: 300;
}

[data-theme="light"] {
  --background: #f5f5f2; --foreground: #17201f; --surface: #ffffff;
  --surface-elevated: #eef0ed; --surface-inverse: #17201f; --border: #cbd1cb;
  --muted: #5d6762; --focus-ring: #1a66a3;
}

[data-theme="dark"] {
  --background: #101514; --foreground: #f2f3ef; --surface: #18201e;
  --surface-elevated: #232c29; --surface-inverse: #f2f3ef; --border: #3d4944;
  --muted: #b0b8b3; --focus-ring: #8fc4ff;
}
```

### Typography

Planning must select a production-safe, licensable variable grotesk after evaluating visual fit, readability, file size, and font loading. Required characteristics: sturdy industrial forms, clear numerals, broad weight range, reliable Latin glyph coverage, and readable small labels. A technical companion style may be applied to metadata and numerals, but must not require a second heavy font download.

| Token | Value |
| --- | --- |
| `--text-xs` | 0.75rem / 1.2 |
| `--text-sm` | 0.875rem / 1.4 |
| `--text-base` | 1rem / 1.55 |
| `--text-lg` | clamp(1.125rem, 1.2vw, 1.25rem) / 1.45 |
| `--text-h4` | clamp(1.25rem, 1.5vw, 1.5rem) / 1.2 |
| `--text-h3` | clamp(1.5rem, 2.2vw, 2rem) / 1.15 |
| `--text-h2` | clamp(2rem, 4vw, 4rem) / 1.02 |
| `--text-h1` | clamp(3rem, 6.5vw, 6.5rem) / 0.94 |

Breakpoints: compact `< 640px`; tablet `640–1023px`; desktop `1024–1439px`; wide `1440px+`. The grid is four, eight, and twelve columns respectively. Use `--container-content` and `--container-wide` rather than arbitrary local widths.

### Controls and surfaces

- Primary button: `--color-brand` fill, accessible contrast, 44px minimum height, `--radius-md`.
- Secondary button: surface fill plus border; no orange fill.
- Focus: a visible 2px `--focus-ring` outline with 2px offset; never remove focus outlines.
- Shadows: use only `--shadow-card` (soft elevation) and `--shadow-float` (header/drawer). Define values centrally after theme contrast review.
- Status colors always pair color with icon/text label.

## 5. Theme architecture

1. The root document sets a theme before first paint from persisted preference; if absent, it uses `prefers-color-scheme`.
2. The user's explicit `light`, `dark`, or `system` preference is stored locally and exposed through a small theme controller.
3. The controller applies `data-theme` to the document root and updates browser `theme-color` metadata for the active theme.
4. The server/document shell emits the minimal anti-flash initialization before hydration. The implementation plan must select the framework-appropriate safe mechanism.
5. Logo components request a named variant from a logo registry: `light`, `dark`, `mono-light`, `mono-dark`, or `mark`; no component hard-codes asset paths.
6. All visual values consume semantic tokens. Components never branch on raw color literals when a semantic token exists.

## 6. Motion system

```css
:root {
  --motion-fast: 160ms; --motion-control: 220ms; --motion-reveal: 520ms;
  --motion-route: 10s; --motion-ambient: 14s;
  --ease-standard: cubic-bezier(.2, .8, .2, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
  --marquee-speed: 34s;
}
```

- Controls use `--motion-fast` or `--motion-control` and transform/opacity only.
- Section reveals use `--motion-reveal`, fire once, and never conceal essential content indefinitely.
- Route motion is slow linear progression; ambient motion is imperceptibly subtle.
- Marquees use `--marquee-speed`, duplicate content only visually, and pause on hover/focus.
- Tilt, magnetic effects, and parallax require a fine pointer, are disabled for keyboard/touch interactions, and must never move controls away from the pointer.
- `prefers-reduced-motion: reduce` removes automatic route travel, scroll reveal translation, marquee travel, parallax, camera drift, and card tilt. It retains instant, legible state changes.
- Motion budget: no more than three nonessential simultaneous animated regions above the fold; no layout-affecting animation.

## 7. Hero visual specification

### Story and composition

The hero is a stylized logistics network, not a literal simulation. It shows an isometric/oblique composition: an origin terminal, warehouse, road segment, discreet rail/container reference, transfer nodes, and destination node. One illuminated KAG-orange route traces a controlled path across a mostly graphite/steel scene. Deep blue or steel data accents may identify neutral network layers; orange/red identifies the active route only.

The copy occupies a high-contrast safe zone. The visual supports, rather than competes with, the headline and CTA. Human or industrial photography may sit outside the hero visual, avoiding a collage inside the scene.

### Responsive and fallback behavior

| Viewport/state | Behavior |
| --- | --- |
| Desktop | Full composition with mild depth and a single route animation; no required interaction |
| Tablet | Reduced scene detail, fixed perspective, still one route story |
| Mobile | Art-directed static SVG/illustration or minimal SVG route trace below copy |
| Reduced motion | Fully composed static visual with a visible finished route, not an empty fallback |
| Low capability / loading failure | Same static SVG or image fallback |

### Technology decision gate

Implement the experience in the lowest-complexity technology that preserves the intended spatial clarity:

1. CSS layers and gradients;
2. SVG scene and route animation;
3. Canvas;
4. dynamically loaded lightweight WebGL/React Three Fiber.

WebGL is permitted only if prototype comparison shows a meaningful depth/quality improvement, static fallback is equivalent in story, desktop performance remains within budget, and it is excluded from unsupported/mobile/reduced-motion paths. It must not block LCP or initial interaction.

## 8. Logo system

### Rationale and variants

The conceptual prototype mark retains `KAG` lettering, industrial weight, and forward movement. It refines proportion, spacing, terminal geometry, and may introduce a subtle route/cut-line relationship. It must not copy third-party marks or claim corporate approval.

| Variant | Use |
| --- | --- |
| Primary horizontal wordmark | Desktop header, footer, primary brand use |
| Compact mark | Mobile header where necessary, app/social contexts |
| Light-background | Default light theme |
| Dark-background | Dark theme and inverse surfaces |
| Monochrome | Small or restricted production contexts |
| Favicon mark | Browser/icon use at very small sizes |

Maintain clear space of at least the cap-height of the `K` around the mark. Do not display the wordmark below 112px wide; use the compact mark below that threshold. All artwork is SVG with a centralized registry, enabling an official logo swap without component restructuring.

## 9. Command Center specification

### Illustrative interface

The visual demonstrates operational control and is labeled `Illustrative shipment visibility view`. It contains:

- a simplified North American or regional abstract map with origin, transfer, and destination points;
- two to four plausible illustrative routes;
- a prioritized shipment list with reference labels rather than arbitrary revenue/load counts;
- states: `Planned`, `In transit`, `Attention needed`, and `Delivered`;
- ETA / scheduled window text; an exception alert; document-available marker; carrier-status pill; and compact operational KPI labels;
- a small legend explaining status colors.

Example data must use believable but non-identifying route labels and timestamps. It must never appear connected to live KAG systems.

### Composition and motion

Desktop has a large map/control panel with a narrow shipment/status column and a compact KPI rail. Mobile prioritizes the selected shipment, its route, and its next action/status; secondary data becomes a concise stacked list.

Only the selected route progress, a one-time alert emphasis, and a subtle state transition animate. Map geometry, numbers, and inactive rows remain static. All important information is available as real text outside or alongside decorative geometry.

## 10. Quote wizard and future integration contract

### UX flow and state model

1. **Freight:** `freightType` selection: Liquid Bulk, Dry Bulk, Dry Van, Refrigerated, Flatbed, Container, Expedited, Other/Not Sure.
2. **Route:** origin and destination (city, region/state, postal code, country); clear field-level guidance.
3. **Timing:** pickup date/window and flexible/urgent choice where appropriate.
4. **Contact:** name, company, email, phone, optional notes, and required privacy/consent acknowledgement if policy requires it.
5. **Review / result:** explicit confirmation before submission, followed by submitting, success, or recoverable error state.

The form states are `editing`, `validating`, `submitting`, `success`, and `error`. Next is disabled only when the current step has invalid required data; validation errors appear inline after the relevant interaction/submit attempt. Back preserves values. Progress is textual (`Step 2 of 4`) as well as visual. Enter follows native form conventions without unexpectedly advancing a control choice. Errors receive focus and are announced with an `aria-live` region. Success offers reset/start-over and a clear next action. A recoverable error preserves all inputs and exposes `Try again`.

### UI-independent service boundary

```ts
interface QuoteSubmissionService {
  submit(request: QuoteRequest): Promise<QuoteSubmissionResult>;
}

type QuoteRequest = {
  freightType: string;
  origin: { city: string; region: string; postalCode?: string; country: string };
  destination: { city: string; region: string; postalCode?: string; country: string };
  pickup: { date?: string; flexibility: 'scheduled' | 'flexible' | 'urgent' };
  contact: { firstName: string; lastName: string; company: string; email: string; phone?: string };
  notes?: string;
  consent: { privacyAccepted: boolean; marketingOptIn?: boolean };
  source: { page: string; campaign?: string };
};

type QuoteSubmissionResult =
  | { ok: true; referenceId: string }
  | { ok: false; kind: 'validation' | 'server' | 'network'; message: string; fieldErrors?: Record<string, string> };
```

Phase one supplies a deterministic mock implementation that simulates latency plus configured success and failure paths. The UI imports the interface from a service module, not the mock directly. Phase two adds a server-side CRM/API adapter at the composition boundary (for example `services/quote/createQuoteSubmissionService`), validates the same contract server-side, maps vendor errors to `QuoteSubmissionResult`, records consent, and avoids exposing CRM credentials to the browser.

Analytics-ready events: `quote_started`, `quote_step_completed`, `quote_submitted`, and `quote_failed`, emitted through a vendor-neutral analytics interface.

## 11. Component and content architecture

### Component boundaries

| Component group | Responsibility | Rendering strategy |
| --- | --- | --- |
| `SiteHeader`, `DesktopNavigation`, `MobileNavigation`, `ThemeToggle` | Global navigation and theme choice | Header/server-compatible; interactive subcomponents client-side |
| `Hero`, `LogisticsScene` | Outcome message and optional visual renderer | Scene dynamically loaded only if needed |
| `Ticker`, `ProblemCards`, `SolutionsGrid`, `IndustrySelector` | Homepage storytelling blocks | Mostly server-compatible; selector client-side only if interactive |
| `TechnologyShowcase`, `CommandCenterDemo` | Product-style operational proof | Demo client-side only where animation requires it |
| `ProcessTimeline`, `CaseStudyCards`, `ResourceCards` | Trust and explanation | Server-compatible with progressive enhancement |
| `QuoteWizard`, `QuoteStep`, `QuoteSubmissionService` | Conversion flow and separated submission behavior | Client-side wizard; service interface independent |
| `CarrierCTA`, `CareersCTA`, `FinalCTA`, `SiteFooter` | Audience routing and closing navigation | Server-compatible |

Do not create micro-components for trivial markup. Use a small set of reusable primitives for buttons, links, cards, fields, section wrappers, and media. Dynamic import is limited to optional 3D/canvas, noncritical visual animation, or a genuinely heavy client-only feature.

### Content and asset architecture

Marketing content lives in typed/structured collections rather than scattered JSX: navigation, solutions, industries, case studies, resources, marquee items, contact/legal data, and media. `media` configuration maps stable asset keys to local/approved replacements and alt text. Remote placeholder URLs must not be embedded throughout components. All illustrative data is separately labeled/configured from editorial content.

## 12. Accessibility requirements

Target WCAG 2.2 AA.

- Use landmark elements, one logical H1 per page, sequential headings, and genuine list/button/link semantics.
- Visible focus, keyboard navigation, Escape behavior for drawer/dialog patterns, and logical focus restoration are mandatory.
- Form controls have programmatic labels, instructions, field-level errors, required-state semantics, and accessible result announcements.
- Minimum touch target is 44px by 44px; spacing prevents accidental activation.
- Text and essential icons meet contrast targets in both themes; state is not color-only.
- Decorative SVG/3D/UI ornamentation is excluded from assistive technology. Meaningful visual information receives concise textual alternatives.
- Motion follows section 6; all core routes and conversion actions work with motion removed.

## 13. Performance budget and release criteria

| Measure | Target / rule |
| --- | --- |
| Lighthouse | Performance ≥90 where realistic; Accessibility ≥95; Best Practices ≥95; SEO ≥95 |
| LCP | ≤2.5s on a representative mobile profile |
| CLS | ≤0.10 |
| INP | ≤200ms where representative testing is available |
| Initial JS | Keep framework/app code lean; defer optional scene/animation code |
| Hero scene | Must not block LCP; dynamically load WebGL only after the primary experience is usable |
| Images | Responsive sizes, modern formats, declared dimensions, below-fold lazy loading |
| Fonts | One primary variable family where possible; subset/preload only critical files; `font-display: swap` or equivalent |
| Animation | Transform/opacity preferred; no continuous layout/reflow loops |

Release is blocked by an avoidable horizontal overflow, flashing theme, nonfunctional no-JS/core fallback, inaccessible primary form flow, or performance regression caused by optional 3D/motion.

## 14. SEO and content targeting

- Per-route title, concise meta description, canonical URL strategy, Open Graph and Twitter/X metadata.
- Semantic headings describe user value rather than repeat keyword lists.
- JSON-LD is added only for verified organization, website, breadcrumb, article, or job content; do not invent review/rating or performance data.
- Prepare sitemap and robots configuration; production domain values remain environment-configured.
- Target themes: transportation management, logistics services, freight brokerage, dedicated transportation, bulk transportation, supply-chain management, freight visibility, and North American logistics.

## 15. Testing and quality strategy

The implementation plan must follow test-driven development for behavior-bearing components.

| Layer | Required coverage |
| --- | --- |
| Unit | Theme preference resolution/persistence, quote schema validation, service result mapping, content utilities |
| Integration | Theme switcher, desktop/mobile navigation behavior, quote step progression/back preservation, errors, submitting/success/retry states, reduced-motion condition where testable |
| End-to-end | Primary shipper quote path, mobile navigation, theme change, keyboard form completion, key carrier/careers routes |
| Accessibility | Automated checks plus manual keyboard/focus/contrast review for key templates |
| Visual QA | Desktop, laptop, tablet, and mobile screenshots/inspection for light/dark themes, overflow, CLS, text clipping, and responsive grids |
| Release checks | Type check, lint, unit/integration tests, production build, relevant E2E tests, Lighthouse/quality audit |

## 16. Analytics-ready event model

Use a vendor-neutral `AnalyticsAdapter` interface. The initial implementation may no-op in production prototype mode and record events in test/dev instrumentation only.

| Event | Required properties |
| --- | --- |
| `quote_started` | source, entryPoint, freightType if selected |
| `quote_step_completed` | step, elapsedMs, validationErrorCount |
| `quote_submitted` | source, referenceId if available |
| `quote_failed` | step, failureKind |
| `solution_viewed` | solutionId, source |
| `technology_cta_clicked` | source |
| `carrier_cta_clicked` | source |
| `careers_cta_clicked` | source |
| `theme_changed` | theme, source |

Never include unnecessary sensitive contact or freight data in analytics payloads.

## 17. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Animation overload | Motion tokens, strict motion budget, reduced-motion fallback, and visual QA |
| 3D performance | Lowest-complexity implementation gate, dynamic loading, static fallback, mobile exclusion where needed |
| Dark-theme contrast | Semantic tokens and contrast validation in both modes |
| Mobile complexity | Mobile-first hierarchy, simplified scene/UI, explicit touch and drawer testing |
| Overlong homepage | Each section introduces/proves one idea and routes deeper; detailed content belongs on dedicated pages |
| Unverified claims | Source public facts before use; use qualitative text or illustrative labels when facts are unavailable |
| Live-data ambiguity | Permanent `Illustrative` labeling; no fake streaming counters or real-system claims |
| Asset availability | Central media registry and replaceable local placeholders |
| Dependency weight | Prefer native CSS/SVG; dynamically load noncritical animation/scene packages |

## 18. Remaining decisions for planning

The architecture is deliberately implementation-neutral until plan approval. The following are genuine planning decisions rather than unresolved design decisions:

1. Final framework/bootstrap selection appropriate to the target deployment environment (Next.js is preferred only if its SEO and routing benefits exceed project complexity).
2. Final production-safe variable font after licensing, file-size, and rendering evaluation.
3. Whether the hero achieves its approved visual standard with SVG/CSS or demonstrably benefits from a progressively loaded WebGL layer.
4. Approved/rights-cleared photography and any verified production URLs for customer login, jobs, legal, and carrier resources.

These choices must meet the fixed product, accessibility, and performance constraints above; they do not reopen the approved visual direction.
