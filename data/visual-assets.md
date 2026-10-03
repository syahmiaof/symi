# Visual asset provenance

All production assets live in `public/images/symi/`. The complete reference PNGs are excluded from Git and deployment. Page typography, headings, badges, controls, annotations and layout are rendered as HTML/SVG/CSS.

## Built-in image tool outputs

Generated on 2026-10-04 using the built-in image generation/editing tool, then cropped to alpha bounds where relevant and encoded as WebP. No API-key/CLI image generation path was used. These are reconstructed photographic layers; they are not guaranteed pixel-identical to the reference photographs.

| Saved production asset | Input reference | Operation |
| --- | --- | --- |
| `mediterranean-plate.webp` | Crafted frozen yogurt landing page | Remove all UI and central product; retain landscape architecture, foliage, marble and fruit |
| `hero-kiwi.webp` | Crafted frozen yogurt landing page | Extract central yogurt/cup on real alpha |
| `exploded-kiwi.webp` | Swirl Mediterranean kiwi delight | Extract explosion on real alpha; CSS clips split it into upper/lower motion layers |
| `swirl-plate.webp` | Swirl Mediterranean kiwi delight | Remove product and UI; retain wall, sea arch and marble floor |
| `kiwi-environment.webp`, `mango-environment.webp`, `berry-environment.webp`, `choco-environment.webp` | Flavor universe carousel | Reconstruct four clean photographic environments, then split the strip |
| `ingredients-scene.webp`, `seating-scene.webp`, `coast-scene.webp` | A brighter way to yogurt | Reconstruct bottom photographic strip without overprinted captions, then split the strip |
| `mobile-plate.webp` | Frozen yogurt mobile showcase | Reconstruct the left phone's background as a portrait plate without hardware, UI or cup |

## Other sources

- `store-interior.webp`: pure photographic crop `(650,77,1448,485)` from `symi_a_brighter_way_to_yogurt.png`; contains only the store photograph, no webpage text or controls.
- `staff-close.webp`: original supplied `16.jpg`, encoded as WebP. The browser crop is deliberate and keeps the staff member and cup visible.
- Mango, berry and chocolate transparent cups and small ingredients use the existing source-photo extractions from `scripts/prepare_assets.py`.
- Original supplied files were not modified.

## Final prompts

### Hero environment

Edit this reference into a clean photographic background plate for an HTML website. Preserve the EXACT upper hero scene composition, navy wall, cream Mediterranean arches, blue sea and distant mountains visible through right arch, realistic edge foliage, foreground marble circular pedestal, kiwi fruit on left of pedestal and granola bowl on right. CROP OUT the lower cream story section entirely, final image landscape approximately 1448 by 806. REMOVE all text, all logos, navigation, buttons, badges, progress indicators and UI. REMOVE the huge central yogurt cup and yogurt swirl completely, leaving its place empty with reconstructed navy wall/arch behind and marble pedestal underneath. Do not redesign the environment or move arches. Left half should be dark navy wall clear for HTML text. This is ONLY a photographic environment plate, no typography or UI whatsoever.

### Hero product

Extract ONLY the exact large central SYMI kiwi frozen yogurt cup and its entire towering yogurt swirl, attached kiwi slices, green kiwi sauce and granola toppings from this image. Transparent background. Preserve the exact photographic product shape, colors, brand lettering SYMI and small Crafted Frozen Yogurt typography on cup, cup condensation, front-facing cup angle and original proportions. Include the whole tip and cup bottom, crop tightly around the product with small padding. Remove ALL background, marble plinth, UI, other text, badge, detached fruit and bowl. One single product cutout, not a new design.

### Explosion

Extract the central exploded frozen yogurt product arrangement as one transparent cutout: tall ivory white yogurt swirl tip at top, kiwi sauce ribbons winding around it, floating kiwi wedges at upper right/middle left/lower right, granola clusters, tiny white yogurt droplets and green leaves, and the tilted dark blue SYMI cup below the swirl. Preserve EXACT photographic positions and shapes and relative proportions from the supplied image. Retain readable SYMI logo on cup. Remove ALL background, all text outside cup, all callout lines/icons, marble base, nav, page heading, benefit row and UI. Product only on transparent background, with small padding, portrait canvas. Do not invent a new composition.

The first output's alpha was verified by compositing on navy. A subsequent background-removal attempt was discarded; the first alpha-correct output is the asset used.

### Swirl environment

Create the clean photographic background plate of this exact scene. Remove ALL text, logos, icons, lines, UI, navigation and the entire floating central frozen yogurt product including every floating fruit, sauce, granola and leaf. Keep the navy wall, right cream Mediterranean arch with visible blue sea/mountains, edge foliage, plants, lower marble terrace and marble benefit strip. Preserve the exact original environment composition and aspect ratio 4:3. Leave left and central dark navy space clear. No new objects, no text, no graphics.

### Flavor environments

Extract the four photographic flavor environments as a clean wide production background plate. Remove the ENTIRE top navy header/heading area and bottom progress UI. Remove ALL overlaid typography, numbers, circles, arrows and EVERY yogurt cup/swirl. Keep the four adjacent tall photographic environments, approximately equal widths: muted light kiwi green wall with leaves and kiwi fruits at bottom; warm golden mango wall with leaf shadows and mango pieces at bottom; dusty raspberry pink wall with berries at bottom; warm cocoa brown wall with chocolate chunks/almonds at bottom. Preserve the original photo-realistic wall lighting, fruit, marble bases at the bottom and shadows. Straight rectangular environment boundaries, no rounded corners needed (CSS will clip). All four panels fully visible, each equal width, arranged left to right, no UI or typography. Final aspect ratio approximately 2.5:1. Upper two thirds of each panel should remain clear wall for real HTML text and product cutouts.

### Story photographs

Extract ONLY the bottom row of three photographic images from this reference and expand their vertical framing slightly into a clean panoramic strip (about 3.6:1 total width:height). Three equal-width photo zones: LEFT close-up fresh kiwi fruit and bowl of granola with leaves, CENTER the elegant navy and white SYMI cafe seating with Mediterranean arches and warm wood chairs overlooking sea, RIGHT blue Mediterranean sea and rocky coast from white stone terrace with leaves. Remove ALL overprinted marketing text and all UI. Preserve the exact subjects, colors, natural light and photographic style. No new logo, text, people or product cups. This will be cropped into 3 image assets for a real HTML editorial mosaic.

### Mobile environment

Extract and reconstruct ONLY the photographic environment from inside the LEFT phone screen. Final image portrait 9:20, no phone hardware, no status bar, no text, no logos, no UI, no icons, no product cup or yogurt. Preserve the very dark navy Mediterranean wall covering most of left and center, the ONE tall cream arch at far right with blue sea and mountain beyond, realistic foliage at left lower edge and bottom corners, and the white marble pedestal floor across bottom 12 percent. Keep a few kiwi slices and golden granola on bottom marble. Remove every yogurt cup, all headings and buttons and all phone framing. This is a clean mobile background plate behind real HTML text and a separate product cutout. Natural undistorted architecture, exact deep navy color and lighting of the left reference phone.
