<div align="center">
  <h1>symi</h1>
  <p><strong>SYMI — Mediterranean Crafted Frozen Yogurt Brand Experience</strong></p>
  <p>
    <a href="https://symi.syahmiaof.my"><img src="https://img.shields.io/badge/Demo-Live-60E1B5?style=for-the-badge&logoColor=60E1B5&labelColor=101713" alt="Demo"></a>
    <a href="https://github.com/syahmiaof/symi"><img src="https://img.shields.io/badge/Source-GitHub-60E1B5?style=for-the-badge&logo=github&logoColor=60E1B5&labelColor=101713" alt="GitHub"></a>
    <a href="https://github.com/syahmiaof/symi/actions"><img src="https://img.shields.io/badge/CI-Passing-60E1B5?style=for-the-badge&logo=githubactions&logoColor=60E1B5&labelColor=101713" alt="CI"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-60E1B5?style=for-the-badge&logoColor=60E1B5&labelColor=101713" alt="License"></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.3-101713?style=for-the-badge&logo=nextdotjs&logoColor=60E1B5" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19.3-101713?style=for-the-badge&logo=react&logoColor=60E1B5" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.9-101713?style=for-the-badge&logo=typescript&logoColor=60E1B5" alt="TypeScript">
    <img src="https://img.shields.io/badge/GSAP-3.14-101713?style=for-the-badge&logo=greensock&logoColor=60E1B5" alt="GSAP">
    <img src="https://img.shields.io/badge/Lenis-1.3-101713?style=for-the-badge&logoColor=60E1B5&labelColor=101713" alt="Lenis">
    <img src="https://img.shields.io/badge/Vitest-5.0-101713?style=for-the-badge&logo=vitest&logoColor=60E1B5" alt="Vitest">
  </p>
</div>

---

![SYMI Crafted Frozen Yogurt website](https://raw.githubusercontent.com/syahmiaof/syahmiaof/main/public/images/symi.png)

Frontend-only brand experience for SYMI, launching 2027. The supplied mockups define the visual direction; the implementation rebuilds the experience as responsive HTML, React, CSS and GSAP motion.

## 🍦 Experience

- **Editorial Hero**: Navy Mediterranean architecture, large kiwi cup, bold editorial headline, cream CTA and four benefit icons.
- **Swirl Keyframe**: A photographic exploded keyframe with yogurt, sauce ribbons, kiwi, granola and a tilted cup; real HTML annotations and marble benefit row.
- **Flavor Showcase**: Horizontal desktop flavor exploration with keyboard controls and native mobile swipe.
- **Responsive Story**: Deliberate 45/55 editorial opening, staff/product/copy mosaic and three photographic zones.
- **Accessibility & Motion**: Reduced-motion behavior removes pinning and smooth scrolling; mobile navigation with Escape and focus restoration.

## 🛠️ Run and Verify

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Run linters and typecheck
npm run lint
npm run typecheck

# Run automated unit tests
npm test

# Build and start production server
npm run build
npm start
```

## 📸 Visual Sources & Design

Read `DESIGN.md` before visual changes. Production artwork is stored locally as optimised WebP assets. `data/visual-assets.md` records generated plates, source crops and prompts. The supplied reference mockups are preserved outside deployment and are not used as full-page backgrounds.

## 🧪 Browser QA

```bash
npx playwright install chromium webkit
npm run qa
node scripts/motion-qa.mjs
npm run qa:text
npm run qa:mobile
npm run qa:repair
```

The checks cover desktop and mobile layouts, overflow, missing images, browser errors, navigation, keyboard controls, accessibility and reduced motion.

## 🚀 Deployment

- **Production Live**: [https://symi.syahmiaof.my](https://symi.syahmiaof.my)
- **Deployment Platform**: Vercel automated deployment on `main` branch.

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Copyright © 2026 Muhammad Syahmi (syahmiaof).
