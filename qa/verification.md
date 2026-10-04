# SYMI verification — 4 October 2026

## Repairs

- Explosion: 30 masked photographic layers, a shorter opaque transition, a held reference composition and reversible reassembly. Attached surfaces share transforms to avoid cut seams; floating ingredients have independent trajectories.
- Horizontal flavors: each step travels one complete panel (about 422px at 1440px), with repeated previews preserving reference density at the last flavor. Rapid inputs preserve the requested destination.
- Scrolling: wheel input over the rail continues the document journey. Anchors resolve after pin spacers; browser Back and responsive timeline teardown/rebuild are covered.
- Header: fixed positioning removes the absolute-to-fixed jump; cream sections get contrasting treatment. Section boundaries are cached instead of measured on every scroll event.
- Fonts: Manrope and Bodoni Moda use separate static WOFF2 weights. Visual inspection caught WebKit rendering variable Bodoni with thin weights despite correct computed CSS.

## Verification

`npm run build`, `npm run lint`, and `npx --yes --package @google/design.md designmd lint DESIGN.md` pass. The production build includes TypeScript validation and static prerendering.

Run `npm run qa` and `npm run qa:motion` against `next start`, with `QA_URL=http://localhost:3001`.

`responsive-checks.json` records Chromium at 1440×1080, 1440×900, 1280×800, 1024×768, 430×932, 390×844 and 375×812, plus reduced-motion desktop/mobile. `cross-browser-checks.json` records WebKit at 1440×900 and 390×844. Each profile checks hero, Swirl, flavors and story, with no overflow, broken images or browser errors. Next flavor reaches 02. Mobile menu closes on Escape and restores focus.

Chromium 1440×1080 and 390×844 run Axe WCAG 2 A/AA and 2.1 AA checks in all four scenes: zero detected violations. This is automated coverage, not a claim of full accessibility conformance.

`interaction-checks.json` records 29 motion/interaction checks across Chromium/WebKit desktop and touch-mobile emulation: six explosion frames, repeatable reverse-scroll coordinates, all four flavors, rapid arrow clicks, wheel scrolling, section navigation, browser Back, breakpoint changes, mobile keyboard arrows, dialog navigation, header contrast and reduced-motion controls.

## Visual review

### Text choreography pass

`npm run qa:text` exercises 26 additional assertions across Chromium/WebKit at 1440×900 and 390×844. It checks coverage of every rendered heading/paragraph, intermediate word positions and opacity, complete reading holds, exit, reverse playback, character reveals, mobile line breaks, repeated animated menu open/close, footer visibility and reduced-motion DOM restoration without duplicate splits. Evidence: `text-checks.json` and `.work/text-motion/qa`.

Small copy uses a clipping reveal to preserve contrast while it moves. CTA text remains opaque. Typewriter labels keep a complete visually hidden text equivalent; normal word splits preserve native text semantics. Static navigation remains available while scroll-driven scene copy enters and exits.

All five supplied PNGs were compared with browser captures. Desktop hero, explosion peak, horizontal flavors and story retain their reference layouts; mobile retains its portrait hero, cream flavor showcase and staff/story sequence. Intermediate explosion frames were inspected and repaired for transparency and cut seams. WebKit screenshots were checked separately for font rendering.

Local screenshots and side-by-side comparisons are in `.work/visual-correction/final`; animation frames are in `.work/motion-audit/regression`. These artifacts and original mockups are excluded from deployment.

## Limits

- References are flattened PNGs. Reconstructed photographic details, lettering and some crops differ; this is not pixel-identical reproduction.
- Motion uses photographic compositing, not 3D fluid simulation. Attached surfaces remain joined rather than exposing nonexistent image content.
- Playwright Chromium and WebKit were tested. Physical iOS/Android devices and field performance were not measured.
- No backend, ordering, analytics collection or real store locator is implied. Launch copy remains 2027.
