import { chromium, webkit } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3001";
const out = process.env.QA_OUTPUT || ".work/text-motion/qa";
await fs.mkdir(out, { recursive: true });
const report = [];
for (const [engine, width, height] of [
  [chromium, 1440, 900],
  [chromium, 390, 844],
  [webkit, 1440, 900],
  [webkit, 390, 844],
]) {
  const browser = await engine.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const checks = [];
  const scroll = async (y) => {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(900);
  };
  const opacity = (selector) =>
    page
      .locator(selector)
      .evaluateAll((nodes) =>
        nodes.map((el) => Number(getComputedStyle(el).opacity)),
      );
  assert((await page.locator("[data-text-motion]").count()) > 50);
  assert(
    await page
      .locator(".hero .button")
      .evaluate((e) => Number(getComputedStyle(e).opacity) > 0.95),
  );
  assert.deepEqual(await opacity("h1 .motion-word"), [1, 1, 1]);
  checks.push("Initial headline and CTA remain fully visible");
  const missing = await page
    .locator("main h1,main h2,main h3,main p")
    .evaluateAll((nodes) =>
      nodes
        .filter((e) => e.getClientRects().length && !e.dataset.textMotion)
        .map((e) => e.textContent),
    );
  assert.deepEqual(missing, []);
  checks.push(
    "Every rendered heading and paragraph participates in text motion",
  );
  const original = await page.locator("#story-title").textContent();
  const geometry = await page.locator("#story-title").evaluate((e) => ({
    top: e.getBoundingClientRect().top + scrollY,
    height: e.offsetHeight,
  }));
  const start = geometry.top - height * 0.96,
    end = geometry.top + geometry.height + height * 0.16;
  const states = [];
  for (const fraction of [0, 0.1, 0.45, 1, 0.45]) {
    await scroll(start + (end - start) * fraction);
    states.push(await opacity("#story-title .motion-word"));
    await page.screenshot({
      path: `${out}/${engine.name()}-${width}-story-${states.length}.png`,
    });
  }
  assert(states[0].every((n) => n < 0.03));
  assert(states[1].some((n) => n > 0 && n < 1));
  assert(states[2].every((n) => n > 0.98));
  assert(states[3].every((n) => n < 0.03));
  assert.deepEqual(states[2], states[4]);
  assert.equal(await page.locator("#story-title").textContent(), original);
  checks.push(
    "Headline scrubs through hidden, staggered entry, readable hold, exit and identical reverse",
  );
  const label = await page.locator(".story-copy .eyebrow").evaluate((e) => ({
    top: e.getBoundingClientRect().top + scrollY,
    height: e.offsetHeight,
  }));
  const labelStart = label.top - height * 0.96;
  await scroll(labelStart + (label.height + height * 1.12) * 0.095);
  const chars = await opacity(".story-copy .eyebrow .motion-char");
  assert(chars.some((n) => n === 0) && chars.some((n) => n === 1));
  checks.push(
    "Typewriter labels reveal individual characters while preserving full accessible text",
  );
  await scroll(0);
  if (width < 768) {
    const breaks = await page.locator(".hero-subtitle").evaluate((e) =>
      [...e.querySelectorAll(".motion-word")].map((w) => ({
        text: w.textContent,
        y: w.getBoundingClientRect().y,
      })),
    );
    assert(
      breaks.find((w) => w.text === "Pure").y >
        breaks.find((w) => w.text === "Real").y + 15,
    );
    for (let i = 0; i < 2; i++) {
      await page.locator(".menu-toggle").click();
      await page.waitForTimeout(800);
      assert((await opacity("dialog nav a")).every((n) => n > 0.98));
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog").open);
      assert(
        await page
          .locator(".menu-toggle")
          .evaluate((e) => e === document.activeElement),
      );
    }
    checks.push(
      "Mobile line breaks and repeated animated menu open/close preserve layout and focus",
    );
  }
  await scroll(
    await page.evaluate(() => document.documentElement.scrollHeight),
  );
  assert((await opacity(".site-footer .motion-word")).every((n) => n > 0.98));
  checks.push("Footer copy remains readable at the document end");
  const words = await page.locator(".motion-word").count();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(700);
  assert.equal(await page.locator(".motion-word").count(), 0);
  assert.equal(await page.locator(".pin-spacer").count(), 0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(900);
  assert.equal(await page.locator(".motion-word").count(), words);
  assert.equal(await page.locator(".motion-word .motion-word").count(), 0);
  checks.push(
    "Reduced motion restores original DOM; reenabling does not duplicate split words",
  );
  assert(
    !(await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    )),
  );
  assert.deepEqual(errors, []);
  report.push({ engine: engine.name(), width, height, checks, errors });
  console.log(`${engine.name()} ${width}: ${checks.length} text checks passed`);
  await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
