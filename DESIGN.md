---
version: alpha
name: SYMI Crafted Frozen Yogurt
description: Mediterranean frozen luxury with playful product motion and editorial photography.
colors:
  primary: "#06263B"
  navy: "#06263B"
  ink: "#071C2B"
  cream: "#F5F0E6"
  white: "#FFFDF8"
  stone: "#E8E0D4"
  kiwi: "#A8C94A"
  mango: "#F4B63C"
  berry: "#D95D70"
  chocolate: "#58331F"
typography:
  display:
    fontFamily: Instrument Serif, serif
    fontSize: 128px
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: -0.035em
  body:
    fontFamily: Manrope, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: Manrope, sans-serif
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.85
    letterSpacing: 0.2em
spacing:
  sm: 16px
  md: 32px
  lg: 64px
  xl: 128px
rounded:
  none: 0px
  arch: 160px
  full: 9999px
---

# SYMI — Crafted Frozen Yogurt

## Design thesis

Mediterranean frozen luxury × playful kinetic motion. One product story controlled by scroll: swirl, orbit, scatter, flow, assemble. Premium, bright, natural, editorial and joyful. The cup is the protagonist.

## Authority

Supplied mockups 9–13, this document, Astra Frontend Design, then UI UX Pro Max review guidance. References are never rendered as website content. Real production photography comes from assets 1–8 and 14–16. All originals stay untouched at project root, outside the shipped bundle.

## Colors

- Midnight navy: #06263B — primary canvas, navigation, cup continuity.
- Deep ink: #071C2B — light-surface text.
- Warm cream: #F5F0E6 — editorial scenes.
- Soft white: #FFFDF8 — primary text on navy.
- Muted stone: #E8E0D4 — rules and quiet surfaces.
- Kiwi: #A8C94A; mango: #F4B63C; berry: #D95D70; chocolate: #58331F.
- Muted on navy: #BEC9CC; muted on cream: #52626A.
  Flavor scenes use controlled solid backgrounds. No decorative gradients, glass cards, generic bento grids or invented social proof.

## Typography

Instrument Serif regular/italic for display; Manrope for UI and body. Two families only, locally served by next/font. H1 clamp(5rem,9vw,10.5rem); H2 clamp(3.5rem,7vw,8rem). Mobile H1 deliberately wraps into three lines. Main body 14–18px; mobile hero uses a shorter 15px description to leave space for the product. Eyebrows 9–12px with .2em tracking. Display lines tight but never overlapping; text-wrap balance.

## Layout and geometry

Generous 1600px container; 12-column editorial desktop compositions, 4-column mobile mental model. Gutters clamp(24px,5vw,96px). Spacing 8/16/24/32/48/64/96/128px. Arch geometry echoes store architecture. Straight edges for editorial photography, one arch per major composition. Rounded CTA only, no card grid. Hairline rules and small editorial numbers. Product cutouts sit on subtle elliptical grounding shadows.

## Scenes

1. Navy fullscreen hero: editorial left, large extracted kiwi cup right, arch-framed store view behind, cream CTA. Real HTML copy.
2. Navy Swirl: desktop pin + actual separate photo layers. Lift, explode, ingredient orbit, readable hold, reassemble. Matched kiwi scale/composition gives continuity.
3. Flavor Universe: 4 nearly full-screen horizontal desktop environments, large typography and extracted product. Mobile 90vw native snap with arrow alternatives.
4. Ingredient Flow: short cream kinetic typography with opposing ingredient layers.
5. Story: quieter cream split composition; arch-shaped lifestyle photo.
6. Experience: offset editorial photography assembles gently on scroll.
7. Final: large calm brand promise, leaf mark, launch date. Minimal truthful footer.

## Motion

GSAP is the sole motion engine. Lenis desktop only, autoRaf false, driven by GSAP ticker. Native touch on mobile. useGSAP + matchMedia cleanup. Primarily transform/opacity. Intro under 1 second. No permanent autonomous movement; scroll drives product motion. Desktop Swirl pin 300vh, mobile 100vh with 6 ingredients. Desktop flavors 330vh. Mobile flavors native horizontal snap. Reduced motion disables pinning, scrub and smooth scroll; assembled cup and complete readable content remain. No nested pins. Font and image completion refresh ScrollTrigger once safely.

## Interaction and accessibility

Anchors: home/swirl/flavors/story/experience/launch. Header and menu fully keyboard accessible. Mobile dialog traps focus, Escape closes, focus restores. Minimum 44px targets. Visible high-contrast focus, skip link, semantic headings, descriptive alt text, decorative layers hidden. No unavailable functionality, fake forms or ordering controls. Launching 2027 is informational.

## Content and conversion

English user-supplied copy, sparse and product specific. Primary conversion is exploration: hero-to-Swirl, flavor completion, launch reach. These are proposed measurement events, not implemented tracking or invented metrics. No analytics or consent-dependent services in this frontend. No fabricated store locations, addresses, testimonials or opening hours.

## QA

Inspect 1440×900, 1280×800, 1024×768, 430×932, 390×844, 375×812, 1920×1080; test reduced motion, keyboard menu, anchor navigation, pin release, resize, native swipe, image loading and production build. Record limitations truthfully.
