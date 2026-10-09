<div align="center">
  <h1>SYMI — Crafted Frozen Yogurt</h1>
  <p><strong>Screenshot-driven interactive brand experience with editorial motion.</strong></p>
  <p><a href="https://symi.syahmiaof.my">Live experience</a> · <a href="https://syahmiaof.my/projects">Portfolio</a></p>
</div>

![SYMI Crafted Frozen Yogurt website](https://raw.githubusercontent.com/syahmiaof/syahmiaof/main/public/images/symi.png)

Frontend-only brand experience for SYMI, launching 2027. The supplied mockups define the visual direction; the implementation rebuilds the experience as responsive HTML, React, CSS and GSAP motion.

## Experience

- Editorial hero with product photography and direct navigation.
- Scroll-controlled Swirl sequence with a rendered explosion video and HTML annotations.
- Horizontal desktop flavor exploration with keyboard controls and native mobile swipe.
- Responsive story layouts designed separately for desktop and mobile.
- Reduced-motion behavior that removes pinning and smooth scrolling.
- Accessible mobile navigation with Escape and focus restoration.

Page content uses Next.js Server Components. Scoped GSAP handles animation cleanup, with one ticker driving desktop Lenis. The project contains no backend, authentication, payments or analytics collection.

## Run

~~~bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
~~~

## Visual sources

Read DESIGN.md before visual changes. Production artwork is stored locally as optimised WebP assets. data/visual-assets.md records generated plates, source crops and prompts. The supplied reference mockups are preserved outside deployment and are not used as full-page backgrounds.

## Browser QA

~~~bash
npx playwright install chromium webkit
npm run qa
node scripts/motion-qa.mjs
npm run qa:text
npm run qa:mobile
npm run qa:repair
~~~

The checks cover desktop and mobile layouts, overflow, missing images, browser errors, navigation, keyboard controls, accessibility and reduced motion. Visual review remains a separate human step.

## Deployment

Production: [symi.syahmiaof.my](https://symi.syahmiaof.my)

Vercel deploys the main branch. Credentials, original source video and temporary QA evidence stay outside deployment.

## Limits

The explosion uses optimised rendered video with HTML annotations; it is not a live 3D fluid simulation. Generated photographic details can differ from the supplied references. Browser emulation does not establish physical-device Safari performance.

## Builder

[Muhammad Syahmi](https://syahmiaof.my)
