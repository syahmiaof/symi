# SYMI — Crafted Frozen Yogurt

Frontend-only brand experience for SYMI, launching 2027. The five supplied PNG mockups are the visual specification.

## Run and verify

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

## Experience

- Hero: navy Mediterranean architecture, large kiwi cup, bold editorial headline, cream CTA and four benefit icons. A compact cream story preview completes the supplied hero composition.
- Swirl: a photographic exploded keyframe with yogurt, sauce ribbons, kiwi, granola and a tilted cup; real HTML annotations and marble benefit row. Desktop scroll transitions into the frame, holds it, then reassembles. Mobile is naturally scrolling.
- Flavors: 28.3vw photographic environments, approximately three and a half visible, with controlled horizontal desktop scrolling. Mobile uses a cream product showcase and native swipe. Arrow buttons and keyboard controls work in both modes.
- Story: deliberate 45/55 editorial opening, staff/product/copy mosaic and three photographic zones. Mobile has cream copy, a badge, staff image, brand statements and a coastal image.
- Accessibility: reduced motion removes pinning and smooth scrolling; navigation uses anchors; the native mobile dialog supports Escape and restores focus.

Page content is rendered with Server Components. `MotionProvider`, `Header` and `FlavorControls` provide client interaction. Scoped GSAP handles cleanup, with one ticker driving desktop Lenis. No backend, authentication, payments or analytics collection.

## Visual sources

Read `DESIGN.md` before UI changes. The authority is the supplied PNGs, followed by that file. Bodoni Moda supplies the heavier high-contrast editorial typography; static Manrope WOFF2 weights serve body/navigation text.

`data/visual-assets.md` records the generated photographic plates, transparent cutouts, source-photo crops and exact prompts. All production assets are local WebP files. The original reference PNGs are preserved locally and excluded from Git and deployment. No complete mockup screenshot is used as a webpage.

`scripts/prepare_assets.py` reproduces the original product extractions. `scripts/prepare_fonts.py` reproduces static Manrope subsets. These build-time Python tools are not deployment dependencies.

## Browser QA

```sh
npx playwright install chromium webkit
npm run qa
```

`QA_URL` overrides the target server; `QA_OUTPUT` overrides the evidence directory. Defaults: `http://localhost:3000` and `.work/visual-correction/final`.

The suite captures hero, peak Swirl, Flavors and Story at 1440×1080, 1440×900, 1280×800, 1024×768, 430×932, 390×844 and 375×812. WebKit adds desktop/mobile checks. It verifies overflow, browser errors, missing images, menu focus restoration, flavor navigation, Axe accessibility and reduced-motion pin removal. Visual comparisons are reviewed separately from automated checks; evidence is summarized in `qa/verification.md`.

## Deployment

Private source: [syahmiaof/symi](https://github.com/syahmiaof/symi).

Production: [symi-frozen-yogurt.vercel.app](https://symi-frozen-yogurt.vercel.app).

Vercel Git integration deploys `main`. Credentials and `.vercel` are excluded from Git. Temporary screenshots/comparison files remain in `.work` and are not deployed.

## Limits

Missing photographic layers were reconstructed from references, so individual pixels and some scene details differ. The exploded product uses two clipped photographic layers plus an assembled cutout, rather than a 3D fluid simulation. Browser checks do not establish physical-device Safari performance.
