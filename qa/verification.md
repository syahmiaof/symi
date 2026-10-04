# SYMI verification — 4 October 2026

## Current polish pass

- Delayed section text entry: 70% viewport threshold for flowing copy, 75% scene visibility for desktop pinned copy. Timed word/character reveals hold before a separate scroll-linked exit.
- Hero: staged cup, background, navigation, headline, body, CTA and supporting details; user input can interrupt. CSS fallback restores content if JavaScript fails.
- Layout: floating navy navigation with reserved heading clearance; height-aware desktop hero and flavor panels; intrinsic cup proportions; contained horizontal rail.
- Explosion: the supplied video1.mp4 is served as a silent optimized MP4, with a first-frame poster. Frame-aligned, coalesced seeks follow forward/reverse scroll. Native decoder state prevents overlapping seeks. Desktop pins; mobile uses natural scroll.

## Validation and evidence

Production build and TypeScript validation, ESLint, and DESIGN.md validation pass.

`npm run qa` covers Chromium at 1440×1080, 1440×900, 1280×800, 1024×768, 430×932, 390×844 and 375×812, plus WebKit at 1440×900 and 390×844. It checks four sections, page overflow, missing images, browser errors, flavor arrows and mobile menu focus. Chromium 1440×1080 and 390×844 also run Axe across all four sections: zero detected violations. Automated accessibility checks do not establish full conformance.

`npm run qa:motion` exercises later text entry, gradual reveal, reading hold, exit/reverse, six MP4 scroll positions, reverse frame matching, navbar clearance, cup proportions, flavor arrows, repeated mobile menus, wheel input, reduced motion and browser errors. Profiles include 1900×860 and 1536×688 (wide/short layouts), Chromium mobile, and WebKit desktop/mobile.

`npm run qa:text` records actual animation frames on fresh load and reload in Chromium and WebKit. `node scripts/polish-edge-qa.mjs` checks anchor navigation, rapid flavor requests, keyboard controls, responsive pin cleanup, footer readability, reduced-motion reinitialization and interruptible intro.

Evidence is stored in the adjacent JSON reports. Screenshots, intro frames and recorded browser journeys are under `.work/polish/`, excluded from deployment. Source MP4s remain local; only the optimized derivative and poster are published. Tablet flavor intro positioning was refined after pixel inspection to avoid the bright arch backdrop.

## Limits

- The supplied AI video includes changing ingredient geometry and occasional logo distortions. This implementation controls playback; it does not regenerate the footage.
- This is scroll-controlled video, not a live 3D simulation.
- Physical phones, real Safari/iOS and field performance have not been measured; Playwright Chromium/WebKit and touch emulation were used.
- Reference PNG photography was reconstructed previously and is not pixel-identical. Updated navigation and video treatment follow the user's approved correction draft.
- No backend, ordering or analytics collection is implied. Launch copy remains 2027.
