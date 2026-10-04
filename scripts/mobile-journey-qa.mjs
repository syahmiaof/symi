import { chromium, webkit } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3001";
const out = process.env.QA_OUTPUT || ".work/mobile-first/qa";
await fs.mkdir(out, { recursive: true });
const results = [];
for (const [engine, width, height] of [
  [chromium, 375, 667],
  [chromium, 390, 844],
  [chromium, 430, 932],
  [webkit, 390, 844],
]) {
  const browser = await engine.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: true,
    hasTouch: true,
    recordVideo:
      width === 390 ? { dir: out, size: { width, height } } : undefined,
  });
  const p = await context.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForTimeout(2600);
  await p.touchscreen.tap(width - 10, 150);
  await p.waitForTimeout(300);
  assert.equal(await p.locator(".pin-spacer").count(), 2);
  const checks = ["Phone enables both pinned scenes"];
  const jump = async (y) => {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(1000);
  };
  const geo = async (id) =>
    p
      .locator("#" + id)
      .evaluate((e) => ({
        start: e.getBoundingClientRect().top + scrollY,
        height: e.querySelector('[class$="-scene"]').clientHeight,
      }));
  const swirl = await geo("swirl");
  const times = [];
  for (const f of [0.05, 0.3, 0.5, 0.85, 0.3]) {
    await jump(swirl.start + swirl.height * 3.2 * f);
    const time = f * 10.6;
    const expected =
      time < 0.6
        ? 0
        : time < 5.4
          ? ((time - 0.6) / 4.8) * 5.8
          : time < 6.5
            ? 5.8
            : 5.8 + ((time - 6.5) / 3.5) * 4.2;
    await p.waitForFunction(
      (t) => {
        const v = document.querySelector("video");
        return (
          v.readyState >= 2 && !v.seeking && Math.abs(v.currentTime - t) < 0.15
        );
      },
      expected,
      { timeout: 20000 },
    );
    times.push(await p.locator("video").evaluate((v) => v.currentTime));
    assert(
      Math.abs(
        await p
          .locator(".swirl-scene")
          .evaluate((e) => e.getBoundingClientRect().top),
      ) < 3,
    );
    if (f === 0.5) {
      await p.waitForTimeout(800);
      await p.screenshot({
        path: `${out}/${engine.name()}-${width}-explosion.png`,
      });
    }
  }
  assert(Math.abs(times[1] - times[4]) < 0.2);
  checks.push(
    "Assembled, rotating, exploded and reassembled frames stay in view; reverse matches",
  );
  const flavors = await geo("flavors");
  for (let i = 0; i < 4; i++) {
    await jump(flavors.start + (flavors.height * 3 * i) / 3);
    await p.waitForTimeout(1300);
    assert.equal(
      await p.locator(".flavor-current").textContent(),
      String(i + 1).padStart(2, "0"),
    );
    const panel = p.locator(".flavor-panel").nth(i);
    const rect = await panel.boundingBox();
    assert(Math.abs(rect.x) < 4, `Panel ${i} offscreen ${rect.x}`);
    assert(
      (await panel
        .locator(".mobile-flavor-caption h3")
        .evaluate((e) => e.getBoundingClientRect().bottom)) <
        height - 45,
    );
    await p.screenshot({
      path: `${out}/${engine.name()}-${width}-flavor-${i}.png`,
    });
  }
  checks.push(
    "Vertical scroll reaches all four full flavor compositions and captions",
  );
  await jump(flavors.start);
  await p.waitForTimeout(700);
  if (engine === chromium) {
    const cdp = await context.newCDPSession(p);
    const swipe = async (x1, y1, x2, y2) => {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: x1, y: y1 }],
      });
      for (let i = 1; i <= 12; i++) {
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            { x: x1 + ((x2 - x1) * i) / 12, y: y1 + ((y2 - y1) * i) / 12 },
          ],
        });
        await p.waitForTimeout(24);
      }
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await p.waitForTimeout(1500);
    };
    await swipe(width * 0.8, height * 0.55, width * 0.2, height * 0.55);
    assert.equal(await p.locator(".flavor-current").textContent(), "02");
    checks.push("Real horizontal touch gesture advances flavor");
    await jump(swirl.start + swirl.height * 0.2);
    const before = await p.evaluate(() => scrollY);
    await swipe(width * 0.5, height * 0.8, width * 0.5, height * 0.3);
    assert((await p.evaluate(() => scrollY)) > before + 100);
    assert(
      Math.abs(
        await p
          .locator(".swirl-scene")
          .evaluate((e) => e.getBoundingClientRect().top),
      ) < 3,
    );
    checks.push(
      "Real vertical touch scroll advances while explosion stays pinned",
    );
    await cdp.detach();
  }
  await jump(flavors.start);
  await p.getByRole("button", { name: "Next flavor", exact: true }).tap();
  await p.waitForTimeout(1800);
  assert.equal(await p.locator(".flavor-current").textContent(), "02");
  checks.push("Tap arrow stays synchronized with scroll");
  await p.locator(".menu-toggle").tap();
  await p.waitForTimeout(700);
  await p
    .getByRole("navigation", { name: "Mobile navigation", exact: true })
    .getByRole("link", { name: /Ingredients/ })
    .tap();
  await p.waitForTimeout(2000);
  assert(
    Math.abs(
      await p
        .locator(".swirl-scene")
        .evaluate((e) => e.getBoundingClientRect().top),
    ) < 3,
  );
  checks.push("Menu ingredient anchor resolves mobile pin");
  if (engine === chromium && width === 390) {
    await jump(flavors.start);
    await p.waitForTimeout(1800);
    const axe = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    assert.deepEqual(
      axe.violations.map((v) => v.id),
      [],
    );
    checks.push("No detected Axe violations at mobile flavor");
  }
  assert(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await p.setViewportSize({ width: height, height: width });
  await p.waitForTimeout(1800);
  assert.equal(await p.locator(".pin-spacer").count(), 0);
  await p.setViewportSize({ width, height });
  await p.waitForTimeout(1800);
  assert.equal(await p.locator(".pin-spacer").count(), 2);
  checks.push(
    "Rotation releases short landscape and restores portrait scenes without duplicate pins",
  );
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.waitForTimeout(700);
  assert.equal(await p.locator(".pin-spacer").count(), 0);
  assert.equal(await p.locator(".motion-word").count(), 0);
  checks.push("Reduced motion retains static native browsing");
  assert.deepEqual(errors, []);
  results.push({ engine: engine.name(), width, height, times, checks, errors });
  await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
  console.log(`${engine.name()} ${width}: ${checks.length} checks passed`);
  await context.close();
  await browser.close();
}
