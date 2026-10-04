---
version: alpha
name: SYMI Crafted Frozen Yogurt
description: Faithful implementation of the five supplied SYMI visual specifications.
colors:
  primary: "#06263B"
  navy: "#06263B"
  ink: "#0D1D30"
  cream: "#F8F4EC"
  white: "#FFFAF4"
  kiwi: "#B8C477"
  mango: "#EAB754"
  berry: "#BE737B"
  chocolate: "#623D22"
typography:
  display:
    fontFamily: Bodoni Moda, serif
    fontSize: 102px
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: -0.055em
  body:
    fontFamily: Manrope, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Manrope, sans-serif
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.8
    letterSpacing: 0.2em
spacing:
  sm: 16px
  md: 32px
  lg: 64px
  xl: 128px
rounded:
  none: 0px
  arch: 110px
  full: 9999px
---

# SYMI reference implementation

## Authority

The five named PNGs supplied by the user are the primary visual specification. This document records their geometry; it does not authorize a new art direction. Follow the PNGs, then this document, then Astra Frontend Design.

- `symi_crafted_frozen_yogurt_landing_page.png`: hero and lower cream preview.
- `symi_swirl_mediterranean_kiwi_delight.png`: peak explosion composition.
- `symi_flavor_universe_carousel.png`: horizontal flavor environments.
- `symi_a_brighter_way_to_yogurt.png`: editorial story mosaic.
- `symi_frozen_yogurt_mobile_showcase.png`: the content inside each phone.

## Desktop geometry

The reference artboards are 1448 by 1086. Hero height is 55.66vw capped to the viewport (minimum 680px on desktop), with copy at 9.45% left / 17.5% top. The broad product occupies approximately x720–1100 and y132–685 at reference dimensions. Header is an 80px floating navy surface (64px mobile), inset from the viewport with a subtle border. Section headings reserve at least 112px above their content. Four thin benefit icons sit below the CTA. Cream story preview begins at the hero boundary.

Swirl uses the user-provided video1.mp4, optimized as a silent 1280×720 H.264 MP4 with independent frames for seeking. Desktop scroll pins the section for 2.8 viewport heights: hold the cup, rotate/explode, hold the separated ingredients, and reassemble. Mobile follows natural section scrolling. Poster imagery remains available before video data arrives and under reduced motion. Darkened Mediterranean scenery blends with the source video's dark stage; HTML copy and annotations remain separate.

Flavor headings reserve 260–340px including navbar clearance; the navigation floor reserves 74px. Portrait panels use the smaller of 28.3vw and 80% of available panel height. Cup images always use contain to preserve natural proportions. Vertical scroll translates the rail by three complete panel strides on desktop. Repeated previews continue the environment at the far end; repeated copy is hidden from assistive technology and links are excluded from keyboard order. Mobile uses one complete flavor with swipe and arrow controls.

Story uses a 45/55 top split, then 38/30.5/31.5 staff, product and copy columns. Bottom photos use 32.2/36.3/31.5 columns. Photographic zones have 4px gutters. No detached cards, masonry layout, oversized section gaps or ingredient marquee.

## Typography

Bodoni Moda supplies the high-contrast, heavier editorial letterforms visible in the PNGs. Use 900 for large desktop statements and 700 for mobile. Manrope static WOFF2 weights 400/500/600/800 remain the UI/body face. Only these two families. Hero line breaks are two lines on desktop and three on mobile. Body text must remain readable at tablet sizes.

## Mobile composition

Use a dedicated portrait navy/arch photographic plate. Headline at the upper left, two-line subtitle, compact body and cream CTA, four vertical benefits, a large bottom-right cup. No phone hardware. Flavor becomes a cream screen with three-line heading, a large centered product, native horizontal swipe, arrow controls, caption and bottom CTA. Story uses cream copy, a circular badge, one rounded staff image, three brand statements and a scenic image below. Header switches to navy ink on cream sections.

## Assets and layering

All typography, buttons, navigation, benefit icons, annotations and layout are HTML/SVG/CSS. No whole reference screenshot is displayed as a page. Photographic background plates and transparent cutouts were separated from references with the built-in image tool. The top story store zone is a photo-only crop. Original staff/product photography is retained. Asset provenance and generation prompts are recorded in `data/visual-assets.md`.

## Motion and accessibility

Rendered headings and paragraphs enter only after reaching 70% of the viewport; pinned copy waits until 75% of its scene is visible. Headlines reveal by word over approximately 1.5 seconds. Short labels reveal by character. Text stays readable until it approaches the navbar, then exits softly. Scrolling backward restores it. Horizontal flavor captions additionally follow panel visibility. Footer copy finishes revealing before the document ends.

A fresh-load/refresh hero timeline introduces the background, cup, navigation, headline, supporting copy and CTA over approximately 2.4 seconds. Scrolling interrupts and completes the intro without trapping input. Before hydration, a short CSS fallback prevents permanent concealment if JavaScript fails. Reduced motion restores static unsplit copy and the video poster.

GSAP/useGSAP owns scoped cleanup. Video events, queued seeks and visibility observers are explicitly disposed. Lenis is desktop only; mobile uses native scrolling. Preserve native dialog focus restoration, accessible anchors, keyboard flavor controls, visible focus and semantic text.

## Verification

Capture 1900x860, 1536x688, 1440x1080, 1440x900, 1280x800, 1024x768, 430x932, 390x844 and 375x812. Compare hero, peak swirl, flavor entry and story against the PNGs. Check WebKit, reduced motion, menu focus, flavor controls, overflow, image loading and browser errors. Temporary comparison imagery stays under `.work/` and is not deployed.
