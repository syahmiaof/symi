import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.QA_URL || "http://localhost:3000";
const out = process.env.QA_OUTPUT || ".work/qa";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const viewports = [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [430, 932],
  [390, 844],
  [375, 812],
  [1920, 1080],
];
const results = [];
for (const [width, height] of viewports) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}/${width}-hero.png` });
  const layout = await page.evaluate(() => ({
    viewport: innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    pageHeight: document.documentElement.scrollHeight,
    brokenImages: [...document.images]
      .filter((i) => i.complete && !i.naturalWidth)
      .map((i) => i.src),
    h1: document.querySelector("h1")?.textContent,
  }));
  for (const name of ["swirl", "flavors", "story", "experience", "launch"]) {
    await page.evaluate(
      (id) => document.querySelector(`a[href="#${id}"]`)?.click(),
      name,
    );
    await page.waitForTimeout(1600);
    if (name === "swirl") {
      await page.mouse.wheel(0, width >= 1024 ? height * 1.5 : height * 0.5);
      await page.waitForTimeout(1600);
    }
    await page.screenshot({ path: `${out}/${width}-${name}.png` });
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (width < 1024) {
    await page.locator(".menu-toggle").click();
    await page.waitForTimeout(150);
    const modal = await page.locator("dialog").evaluate((el) => el.open);
    await page.keyboard.press("Escape");
    const closed = await page.locator("dialog").evaluate((el) => !el.open);
    layout.menu = { modal, closed };
  }
  if (width === 1440 || width === 390) {
    await page.evaluate(() =>
      document.querySelector('a[href="#flavors"]')?.click(),
    );
    await page.waitForTimeout(1800);
    await page.getByRole("button", { name: "Next flavor" }).click();
    await page.waitForTimeout(1800);
    layout.nextFlavor = await page.locator(".flavor-current").textContent();
    await page.screenshot({ path: `${out}/${width}-flavor-next.png` });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    layout.accessibility = axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => n.target),
    }));
  }
  results.push({ width, height, ...layout, overflow, errors });
  await context.close();
  await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
  console.log(`Verified ${width} x ${height}`);
}
for (const width of [1440, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({
    path: `${out}/${width}-reduced.png`,
    fullPage: true,
  });
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
await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
await browser.close();
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (r) =>
      r.overflow ||
      r.errors?.length ||
      r.brokenImages?.length ||
      r.accessibility?.length ||
      (r.reducedMotion && r.pins),
  )
)
  process.exitCode = 1;
