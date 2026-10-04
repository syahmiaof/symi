# Scroll and welcome correction — 2026-10-04

## Reproduced cause

Both pins were gated by `min-height: 600px`, including desktop. Local and production Chromium at 1280×573 had zero pin spacers, while 1440×900 and portrait phones had two. Browser zoom can reduce CSS viewport height into this failing range. The old 680px minimum scene also exceeded the short viewport.

## Changes

- Keep both pins on desktop and portrait phones; compact desktop composition below 700px reserves navbar clearance and fits the scene to the viewport.
- Preserve the explosion's held poses and horizontal flavor journey. Short, narrow landscape screens retain natural scrolling; reduced motion remains static.
- Deliver a 768×432, all-intra H.264 MP4 to phones/tablets (3,867,645 bytes versus desktop's 7,870,007). Coarse-pointer scrub settles in 0.22 seconds. Keep decoder requests coalesced, and avoid refreshes caused by mobile toolbar resizing.
- Render ingredient annotations above the video.
- Add a cream/navy welcome with SYMI branding, a rotating orbit, “Brighter days start with a swirl.” and Enter SYMI. It clears automatically before the existing hero intro. Escape/Enter, deep links, restored pages, reduced motion and no-JavaScript fallback are covered.

## Verification

- Production build and ESLint passed.
- `qa:repair`: Chromium 1280×573, 1440×900, 390×844, 375×580 and WebKit 390×844. Verified welcome-to-hero sequence, skip, deep links, both scene pins, video forward/reverse, responsive MP4 selection, horizontal flavor movement, title/header clearance, overflow and runtime errors.
- `qa`: nine desktop/mobile Chromium and WebKit profiles; no browser errors, missing images or overflow. Axe-covered desktop/mobile profiles reported zero violations. Reduced-motion profiles had no pins.
- `qa:mobile`: three Chromium phone sizes and WebKit portrait; native Chromium touch gestures, flavor controls, four compositions, video poses, reverse, rotation, menu anchors and reduced motion passed.
- `qa:text`: fresh-load and refresh hero movement verified in Chromium and WebKit after the welcome clears.
- Edge checks: rapid flavor requests, keyboard flavor navigation, breakpoints, footer visibility, reduced-motion changes and interruptible hero intro passed.
- Separate welcome checks covered keyboard PageDown blocking, Escape, reduced-motion Axe and no-JavaScript timeout.
- Visually inspected welcome, compact desktop explosion/flavors, and phone explosion/flavors. Temporary reports/screenshots remain in `.work/scroll-repair/`.

Phone tests use browser emulation, including WebKit, not a physical iPhone. CPU-throttled decoding checks are useful regression evidence, not a hardware frame-rate guarantee.
