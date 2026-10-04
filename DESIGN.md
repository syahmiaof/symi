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

The reference artboards are 1448 by 1086. Hero height is 55.66vw (806px at reference width), with copy at 9.45% left / 17.5% top. The broad product occupies approximately x720–1100 and y132–685 at reference dimensions. Header is 76–92px, with small spaced links and a launch control. Four thin benefit icons sit below the CTA. Cream story preview begins at the hero boundary.

Swirl is a full viewport scene with title left, photographic exploded product in the middle, four annotations, right progress rail and bottom marble benefit row. The static frame is authoritative. Animation moves 30 separately extracted photographic layers, holds the exact composition for the middle portion of its timeline, and transitions to and from a separate assembled cup. All transforms return to the same coordinates when scrolled backward.

Flavor environments are 28.3vw each with a 1vw gap and a clipped first edge, showing roughly three and a half panels. The heading occupies the top 30%, environments 60%, marble navigation floor the final 10%. Products dominate each panel's lower area. Vertical scroll translates the entire rail by three complete panel strides on desktop. Three repeat previews maintain the original 3.5-panel density at the far end; repeated copy is hidden from assistive technology and its links are excluded from keyboard order. Arrow and keyboard alternatives remain available.

Story uses a 45/55 top split, then 38/30.5/31.5 staff, product and copy columns. Bottom photos use 32.2/36.3/31.5 columns. Photographic zones have 4px gutters. No detached cards, masonry layout, oversized section gaps or ingredient marquee.

## Typography

Bodoni Moda supplies the high-contrast, heavier editorial letterforms visible in the PNGs. Use 900 for large desktop statements and 700 for mobile. Manrope static WOFF2 weights 400/500/600/800 remain the UI/body face. Only these two families. Hero line breaks are two lines on desktop and three on mobile. Body text must remain readable at tablet sizes.

## Mobile composition

Use a dedicated portrait navy/arch photographic plate. Headline at the upper left, two-line subtitle, compact body and cream CTA, four vertical benefits, a large bottom-right cup. No phone hardware. Flavor becomes a cream screen with three-line heading, a large centered product, native horizontal swipe, arrow controls, caption and bottom CTA. Story uses cream copy, a circular badge, one rounded staff image, three brand statements and a scenic image below. Header switches to navy ink on cream sections.

## Assets and layering

All typography, buttons, navigation, benefit icons, annotations and layout are HTML/SVG/CSS. No whole reference screenshot is displayed as a page. Photographic background plates and transparent cutouts were separated from references with the built-in image tool. The top story store zone is a photo-only crop. Original staff/product photography is retained. Asset provenance and generation prompts are recorded in `data/visual-assets.md`.

## Motion and accessibility

All rendered headings and paragraphs participate in reversible scroll choreography. Headlines rise by word with a slight perspective tilt; body copy has smaller word offsets; short eyebrow labels reveal characters in order. Hold fully legible text through the middle of each scene. Pinned text follows scene bounds, flavor captions follow the horizontal rail, and footer text must finish revealing before the document ends. Navigation has a staggered introduction and the mobile dialog has entrance/exit choreography. Reduced motion restores unsplit, static content. Custom `symi-text` split wrappers prevent legacy span selectors from changing layout.

GSAP/useGSAP owns scoped cleanup; Lenis is desktop only. Pin Swirl and Flavor scenes only above 1024px, with no pins under reduced motion. Mobile uses natural document scroll. Hold the keyframe before reassembly. Keep native dialog focus restoration, anchor access, keyboard flavor controls, visible focus, semantic headings and image descriptions. Never conceal text permanently behind an intro animation.

## Verification

Capture 1440x1080, 1440x900, 1280x800, 1024x768, 430x932, 390x844 and 375x812. Compare hero, peak swirl, flavor entry and story against the PNGs. Check WebKit, reduced motion, menu focus, flavor controls, overflow, image loading and browser errors. Temporary comparison imagery stays under `.work/` and is not deployed.
