import { chromium, webkit } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3000";
const out = process.env.QA_OUTPUT || ".work/visual-correction/final";
await fs.mkdir(out, { recursive: true });
const results = [];
async function settle(page) {
  await page.waitForTimeout(1000);
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        [...document.images]
          .filter(
            (i) =>
              i.getBoundingClientRect().top < innerHeight &&
              i.getBoundingClientRect().bottom > 0,
          )
          .map((i) => i.decode().catch(() => {})),
      ),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]),
  );
}
async function section(page, id, peak = false) {
  const top = await page
    .locator("#" + id)
    .evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate(
    (y) => scrollTo(0, y),
    top +
      (peak
        ? await page.evaluate(() =>
            innerWidth >= 1024 ? innerHeight * 1.1 : 0,
          )
        : 0),
  );
  await settle(page);
}
for (const [engine, viewports] of [
  [
    chromium,
    [
      [1440, 1080],
      [1440, 900],
      [1280, 800],
      [1024, 768],
      [430, 932],
      [390, 844],
      [375, 812],
    ],
  ],
  [
    webkit,
    [
      [1440, 900],
      [390, 844],
    ],
  ],
]) {
  const browser = await engine.launch();
  for (const [width, height] of viewports) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await settle(page);
    const result = {
      engine: engine.name(),
      width,
      height,
      errors,
      sections: [],
      accessibility: [],
      menu: null,
      nextFlavor: null,
    };
    for (const id of ["home", "swirl", "flavors", "story"]) {
      if (id !== "home") await section(page, id, id === "swirl");
      await page.screenshot({
        path: `${out}/${engine.name()}-${width}x${height}-${id}.png`,
      });
      result.sections.push(
        await page.evaluate(
          (id) => ({
            id,
            overflow: document.documentElement.scrollWidth > innerWidth,
            brokenImages: [...document.images]
              .filter((i) => i.complete && !i.naturalWidth)
              .map((i) => i.src),
          }),
          id,
        ),
      );
      if (
        engine === chromium &&
        ((width === 1440 && height === 1080) || width === 390)
      ) {
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        result.accessibility.push(
          ...axe.violations.map((v) => ({
            section: id,
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        );
      }
    }
    await section(page, "flavors");
    await page
      .getByRole("button", { name: "Next flavor", exact: true })
      .click();
    await settle(page);
    result.nextFlavor = await page.locator(".flavor-current").textContent();
    if (width < 768) {
      await page.locator(".menu-toggle").click();
      const opened = await page.locator("dialog").evaluate((e) => e.open);
      await page.keyboard.press("Escape");
      result.menu = {
        opened,
        closed: await page.locator("dialog").evaluate((e) => !e.open),
        focusRestored: await page
          .locator(".menu-toggle")
          .evaluate((e) => e === document.activeElement),
      };
    }
    results.push(result);
    await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
    console.log(
      `${engine.name()} ${width}x${height}: ${errors.length} errors, ${result.accessibility.length} accessibility findings, next=${result.nextFlavor}`,
    );
    await context.close();
  }
  await browser.close();
}
const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(base, { waitUntil: "networkidle" });
  results.push({
    width,
    reducedMotion: true,
    pins: await page.locator(".pin-spacer").count(),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
  await page.close();
}
await browser.close();
await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
if (
  results.some(
    (r) =>
      r.errors?.length ||
      r.accessibility?.length ||
      r.sections?.some((s) => s.overflow || s.brokenImages.length) ||
      r.pins ||
      r.overflow ||
      (r.menu && (!r.menu.opened || !r.menu.closed || !r.menu.focusRestored)) ||
      r.nextFlavor === "01",
  )
)
  process.exitCode = 1;
