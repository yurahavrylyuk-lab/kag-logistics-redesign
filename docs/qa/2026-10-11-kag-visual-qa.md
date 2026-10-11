# KAG phase-one prototype — visual QA

Date: 2026-10-11  
Target: local Next.js production build

## Automated release checks

- Playwright: 7 browser checks passed — accessibility in light/dark, responsive 390px flow, no-JavaScript fallback, production JavaScript transfer budget, quote journey, navigation routes, and reduced motion.
- Axe: no critical or serious violations on the homepage in light or dark theme.
- No-JavaScript: core marketing content, semantic navigation, contact information, and the phone-based quote fallback remain available. The interactive wizard is intentionally a JavaScript enhancement.
- Production transfer budget: the SVG/CSS-first homepage stays below the enforced 500 KB JavaScript-transfer ceiling.

## Lighthouse

Lighthouse 13.5.0 against the local production server:

- Performance: 98
- Accessibility: 100
- First Contentful Paint: 0.8 s
- Largest Contentful Paint: 2.3 s
- Total Blocking Time: 40 ms
- Cumulative Layout Shift: 0
- Speed Index: 0.8 s

These are local measurements, not field data. Vercel deployment should be checked again after production caching and any future media additions.

## Manual visual inspection

- Desktop: 1280px, system-dark — checked header, logo contrast, hero hierarchy, primary CTA, logistics SVG, and Command Center.
- Tablet: 768 × 1024, system-dark — checked one-column hero flow, mobile navigation trigger, controls, and SVG containment.
- Mobile: 390 × 844, system-dark — checked typography scale, CTA wrapping, no horizontal overflow, and simplified logistics visual.
- Themes: light and dark were both checked by automated contrast/accessibility validation; system-dark was visually inspected.

## Known phase-one limits

- The page deliberately uses SVG/CSS visuals. No WebGL comparison was approved or added.
- Photography keys remain marked as needing approved licensed assets; no unverified image URL is rendered.
- Quote submission, analytics, external destinations, and canonical origin remain adapter/configuration boundaries, not production integrations.
