import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1900, height: 860 } });
const base = process.env.QA_URL || "http://localhost:3001";
await p.goto(base, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const checks = [];
await p
  .getByRole("navigation", { name: "Main navigation", exact: true })
  .getByRole("link", { name: "Flavors", exact: true })
  .click();
await p.waitForTimeout(2400);
assert.equal(new URL(p.url()).hash, "#flavors");
assert(
  Math.abs(
    await p
      .locator(".flavor-scene")
      .evaluate((e) => e.getBoundingClientRect().top),
  ) < 3,
);
checks.push("Navbar anchor reaches pinned flavor scene");
for (let i = 0; i < 3; i++)
  await p.getByRole("button", { name: "Next flavor", exact: true }).click();
await p.waitForTimeout(2000);
assert.equal(await p.locator(".flavor-current").textContent(), "04");
checks.push("Rapid next requests reach fourth flavor");
await p.locator(".flavor-track").focus();
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(1700);
assert.equal(await p.locator(".flavor-current").textContent(), "03");
checks.push("Keyboard flavor navigation");
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(1000);
await p.setViewportSize({ width: 390, height: 844 });
await p.waitForTimeout(1800);
assert.equal(await p.locator(".pin-spacer").count(), 2);
await p.setViewportSize({ width: 1440, height: 900 });
await p.waitForTimeout(1800);
assert.equal(await p.locator(".pin-spacer").count(), 2);
checks.push("Desktop/mobile breakpoint preserves two clean scene pins");
await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
await p.waitForTimeout(2000);
assert(
  await p
    .locator(".site-footer")
    .evaluate((e) => e.getBoundingClientRect().bottom <= innerHeight + 3),
);
assert(
  await p
    .locator(".site-footer .motion-word")
    .evaluateAll((es) => es.every((e) => +getComputedStyle(e).opacity > 0.99)),
);
checks.push("Footer remains readable at bottom");
await p.emulateMedia({ reducedMotion: "reduce" });
await p.waitForTimeout(700);
await p.emulateMedia({ reducedMotion: "no-preference" });
await p.waitForTimeout(1500);
assert.equal(await p.locator(".motion-word .motion-word").count(), 0);
checks.push("Reduced-motion toggle does not duplicate text wrappers");
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(700);
await p.reload({ waitUntil: "domcontentloaded" });
await p.waitForTimeout(300);
await p.mouse.wheel(0, 1000);
await p.waitForTimeout(1200);
assert(await p.evaluate(() => scrollY > 100));
checks.push("Scrolling during intro remains responsive");
await fs.writeFile(
  ".work/polish/edge-checks.json",
  JSON.stringify(checks, null, 2),
);
console.log(checks);
await b.close();
