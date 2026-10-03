# SYMI verification — 3 October 2026

## Implementation gates

- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed; `/` statically prerendered.
- `DESIGN.md` linter: zero errors and zero warnings.
- `npm audit --omit=dev`: zero vulnerabilities.

## Rendered browser checks

Production build checked in Chromium at 1440×900, 1280×800, 1024×768, 430×932, 390×844, 375×812 and 1920×1080. Hero, exploded Swirl, flavors, story, experience and launch frames were captured and visually inspected. Corrections included mobile copy sizing, a shorter mobile description, ingredient offsets, tablet explosion scale, flavor arch clipping and cup/label clearance.

All seven viewports: no page overflow, missing images, hydration errors or console errors. See `responsive-checks.json`.

Final changed mobile layouts were additionally checked at 430×932 and 375×812, with touch-device emulation. WebKit checked at 390×844 and 1440×900: HTTP 200, no console errors/overflow, Swirl pin release, next-flavor navigation and launch navigation passed. See `cross-browser-checks.json`.

WebKit visual review also caught inconsistent variable-font weight rendering. Declaring separate CSS weights still reused the same variable font file in Vercel's build. Manrope is now instanced at build-time into four actual static WOFF2 assets (400/500/600/800), served with `next/font/local`. The four Latin font files total approximately 51 KiB and include the original SIL Open Font License.

## Interaction and accessibility

- Hero CTA and section anchors reach their correct scenes with header clearance.
- Desktop vertical scroll drives four horizontal flavor scenes; Next advances 01 → 02.
- Mobile/tablet native horizontal snap and button alternatives work; no long horizontal pin.
- Native mobile dialog opens, contains keyboard focus, closes on Escape and restores the opener.
- Mobile menu Story navigation lands 78px below the viewport top.
- Resizing mobile → desktop rebuilds responsive timelines; flavor navigation still advances.
- Reload at an arbitrary flavor scroll position retains two functioning desktop pins without overflow.
- Browser Back restores the prior flavor location without overflow or errors.
- Reduced-motion desktop/mobile: zero pin spacers, no horizontal page overflow, complete visible content.
- Axe WCAG 2 A/AA + 2.1 AA checks: zero detected violations at 1440px and 390px. This is automated coverage, not a claim of full accessibility conformance.

See `interaction-checks.json`. Local screenshot evidence is in `.work/qa-production` and `.work/final-check` (excluded from Git/deployment).

## Asset and performance checks

Originals preserved. No reference mockups, full-resolution originals, unused photographs, background-removal runtime, WebGL stack or extra animation engines are deployed. Fifteen optimized WebP assets total approximately 1.65 MiB, with responsive Next Image delivery. Fonts are served locally by Next Font.

A single unthrottled local production run at 430×932, before the final font portability fix, measured CLS **0** and initial resource transfer **467,808 bytes** (~457 KiB). The final static font files add approximately 51 KiB in place of the variable Manrope asset. Local timing is not representative of real mobile networks; no field Core Web Vitals or fabricated performance score is claimed.

## Remaining limits

- The ingredient separation is a 2.5D composition of extracted photographs; sauce is a stylized SVG orbit, not photorealistic fluid animation.
- Physical iOS/Android hardware has not been tested. Playwright WebKit and touch viewport emulation were tested.
- No analytics, backend, ordering or form submission exists by design.
- The development-only Next ESLint dependency tree reports five advisory entries propagated from a `braces` stack-exhaustion issue. Runtime audit is clean; npm offered a breaking lint-config downgrade rather than a compatible fix.
