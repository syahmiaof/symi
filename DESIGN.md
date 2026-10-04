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

Swirl uses the user-provided video1.mp4, optimized as silent H.264 MP4s with independent frames for seeking: 1280×720 for desktop and 768×432 for phones/tablets. Desktop and portrait-phone scroll pin the section for 3.2 scene heights: hold the cup, rotate/explode, hold the separated ingredients, and reassemble. Phone scenes use the stable small viewport height, with compact copy above the cup and four ingredient annotations below. Only narrow landscape screens below 600px retain natural scrolling; desktop zoom must never disable either pin. Desktop viewports under 700px use compact composition and a 64px navbar. Poster imagery remains available before video data arrives and under reduced motion. Darkened Mediterranean scenery blends with the source video's dark stage; HTML copy and annotations remain separate and above the video.

Flavor headings reserve 260–340px including navbar clearance; the navigation floor reserves 74px. Portrait panels use the smaller of 28.3vw and 80% of available panel height. Cup images always use contain to preserve natural proportions. Vertical scroll translates the rail by three complete panel strides on desktop. Repeated previews continue the environment at the far end; repeated copy is hidden from assistive technology and links are excluded from keyboard order. Mobile pins one complete flavor composition and translates through all four products as the user scrolls vertically. Left/right touch gestures and arrows move to the same scroll positions.

Story uses a 45/55 top split, then 38/30.5/31.5 staff, product and copy columns. Bottom photos use 32.2/36.3/31.5 columns. Photographic zones have 4px gutters. No detached cards, masonry layout, oversized section gaps or ingredient marquee.

## Typography

Bodoni Moda supplies the high-contrast, heavier editorial letterforms visible in the PNGs. Use 900 for large desktop statements and 700 for mobile. Manrope static WOFF2 weights 400/500/600/800 remain the UI/body face. Only these two families. Hero line breaks are two lines on desktop and three on mobile. Body text must remain readable at tablet sizes.

## Mobile composition

Use a dedicated portrait navy/arch photographic plate. Headline at the upper left, two-line subtitle, compact body and cream CTA, four vertical benefits, a large bottom-right cup. No phone hardware. Flavor becomes a cream screen with three-line heading, a large centered product, a vertical-to-horizontal scroll journey, horizontal swipe and arrow controls, caption and bottom CTA. Story retains the cream copy, badge and staff photo, and also exposes the store interior, product, experience copy and all three gallery photographs on phones. Photos reveal with the scroll and the story product has a small rotation. The floating header retains its navy surface.

## Assets and layering

All typography, buttons, navigation, benefit icons, annotations and layout are HTML/SVG/CSS. No whole reference screenshot is displayed as a page. Photographic background plates and transparent cutouts were separated from references with the built-in image tool. The top story store zone is a photo-only crop. Original staff/product photography is retained. Asset provenance and generation prompts are recorded in `data/visual-assets.md`.

## Motion and accessibility

Rendered headings and paragraphs enter only after reaching 70% of the viewport; pinned copy waits until 75% of its scene is visible. Headlines reveal by word over approximately 1.5 seconds. Short labels reveal by character. Text stays readable until it approaches the navbar, then exits softly. Scrolling backward restores it. Horizontal flavor captions additionally follow panel visibility. Footer copy finishes revealing before the document ends.

A cream SYMI welcome opens fresh visits at the top: “Brighter days start with a swirl.” The wordmark and orbit arrive first, then the surface slides upward after 1.6 seconds plus its 0.85-second exit. Enter SYMI or Escape bypasses the wait; deep links, restored scroll positions and reduced motion skip it. Background content is inert only during this introduction. The hero's 2.4-second entrance starts after the welcome clears, introducing the background, cup, navigation, headline, supporting copy and CTA. Scrolling then completes the hero intro without trapping input. Before hydration, a short CSS fallback prevents permanent concealment if JavaScript fails. Reduced motion restores static unsplit copy and the video poster.

GSAP/useGSAP owns scoped cleanup. Video events, queued seeks and visibility observers are explicitly disposed. Lenis is desktop only; mobile uses native touch scrolling with GSAP scene pins. A first-touch handshake primes the muted inline video decoder. Horizontal gestures on the flavor track move to the corresponding pin progress without blocking vertical touches. Preserve native dialog focus restoration, accessible anchors, keyboard flavor controls, visible focus and semantic text.

## Verification

Capture 1900x860, 1536x688, 1440x1080, 1440x900, 1280x800, 1280x573, 1024x768, 430x932, 390x844 and 375x580. Compare hero, peak swirl, flavor entry and story against the PNGs. Check WebKit, reduced motion, welcome/hero sequencing, menu focus, flavor controls, forward/reverse video seeking, short desktop pinning, overflow, image loading and browser errors. Temporary comparison imagery stays under `.work/` and is not deployed.
