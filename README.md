# SYMI — Crafted Frozen Yogurt

A frontend-only, single-page brand experience. Navy and cream editorial art direction, real supplied product photography, and a scroll-controlled product story. Launching 2027.

## Run

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Experience

- **The SYMI Swirl:** assembled product → lift → separate photographed layers → ingredient orbit and annotations → hold → reassembly. Desktop pin is 300 viewport heights; mobile is 100.
- **Flavor Universe:** four full-width environments with vertical-to-horizontal desktop scrolling. Tablet/mobile use native horizontal snap, with keyboard-accessible previous/next controls.
- **Story and experience:** quieter editorial photography, an architectural arch, ingredient typography, and a calm launch finale.
- **Accessible motion:** reduced motion removes pinning, scrub and smooth scrolling. Navigation uses real anchors; the mobile menu uses a native modal dialog with Escape, focus containment and restoration.

The page and scene content are Server Components. `MotionProvider`, `Header` and `FlavorControls` are the interaction boundaries. GSAP owns animation, with a single ticker driving desktop Lenis; touch scrolling remains native. No backend, API routes, authentication, checkout, external tracking or fake forms.

## Assets

All 16 supplied files were inspected by actual image format, dimensions and appearance. See `data/assets.json` for the semantic map. Original photography remains untouched at the local project root and is excluded from Git and deployment. Mockups 9–13 are references only and never ship. Production contains 15 WebP assets, approximately 1.65 MiB combined before responsive delivery; `next/image` serves viewport-appropriate AVIF/WebP variants.

`scripts/prepare_assets.py` reproduces the build-time masks from the originals with Pillow, NumPy and OpenCV. Those tools are not dependencies of the browser or deployment. Cup/fruit/granola images are extracted from the supplied photos. The sauce orbit is an intentionally illustrative SVG line, not a generated photographic liquid simulation.

Manrope is bundled as four static, Latin-subset WOFF2 fonts through `next/font/local` for consistent WebKit weight rendering. `scripts/prepare_fonts.py` reproduces them from the official Google Fonts source with fontTools and Brotli. The font's SIL Open Font License is included in `app/fonts/OFL.txt`.

## Design source and skills

Read `DESIGN.md` before UI edits. It defines the navy/cream palette, Instrument Serif / Manrope pairing, arch geometry, scene rhythm, breakpoints and motion/accessibility rules.

Installed and applied:

- `Enixes/astra-frontend-design` — creative direction, reference translation and rendered QA.
- UI UX Pro Max — responsive, motion and accessibility review.
- `danieloleary/design-md-for-codex` → `skills/design-system` — durable design tokens and validation.

Skills were read directly during this session. The global design-system skill is available to subsequent Codex turns; project skills are under the local `.agents` directory and are not deployed.

Research references: [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Lenis integration](https://github.com/darkroomengineering/lenis), and [Codrops Scroll Panels](https://tympanus.net/Development/ScrollPanels/). Patterns informed choreography; supplied SYMI references remain the visual authority.

## Browser QA

```sh
npx playwright install chromium
npm run qa
```

Run against a production server or deployment using `QA_URL`; optional `QA_OUTPUT` sets the evidence directory. Defaults are `http://localhost:3000` and `.work/qa`.

The suite captures hero, Swirl, flavor, story, experience and launch at 1440×900, 1280×800, 1024×768, 430×932, 390×844, 375×812 and 1920×1080. It checks overflow, page errors, missing images, mobile menu open/Escape, flavor controls, Axe accessibility at desktop/mobile and reduced-motion pin removal. Evidence and final checks are summarized in `qa/verification.md`.

## Deployment

GitHub source: https://github.com/syahmiaof/symi (private).

Vercel project: `symi-frozen-yogurt`. Next.js is auto-detected; the production URL is resolved into metadata via Vercel's system environment variable. The `.vercel` folder and credentials are excluded from Git.

## Practical limits

The launch date and brand descriptions come from the supplied brief. No nutrition percentages, reviews, sales results or store addresses were invented. There is no analytics collection; possible future measurement events are hero-to-Swirl clicks, flavor completion and launch reach. Laboratory browser checks do not establish real-world mobile performance or physical-device Safari behavior.

`npm audit --omit=dev` reports zero vulnerabilities. The current Next.js ESLint development dependency tree reports a braces stack-exhaustion advisory; npm audit offered a breaking lint-config downgrade rather than a compatible fix. It is not included in the browser bundle, and the downgrade was not applied.
