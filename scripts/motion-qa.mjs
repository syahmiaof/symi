import { chromium, webkit } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3000";
const output = process.env.QA_OUTPUT || ".work/motion-audit/regression";
await fs.mkdir(output, { recursive: true });
const results = [];
async function wait(page) {
  await page.waitForTimeout(900);
}
async function go(page, id) {
  await page.evaluate(
    (id) => document.querySelector(`a[href="#${id}"]`)?.click(),
    id,
  );
  await page.waitForTimeout(1400);
}
async function scroll(page, y) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await wait(page);
}
async function pin(page, id) {
  return page.locator("#" + id).evaluate((el) => {
    const scene = el.querySelector('[class$="scene"]');
    const spacer = scene?.parentElement;
    return {
      start: el.getBoundingClientRect().top + scrollY,
      distance: spacer?.classList.contains("pin-spacer")
        ? spacer.offsetHeight - scene.offsetHeight
        : 0,
    };
  });
}
for (const [engine, width, height] of [
  [chromium, 1440, 900],
  [webkit, 1440, 900],
  [chromium, 390, 844],
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
  const checks = [];
  page.setDefaultTimeout(15000);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await wait(page);
  if (width >= 1024) {
    await page.locator(".pin-spacer-swirl-pin").waitFor({ state: "attached" });
    const geometry = await pin(page, "swirl");
    assert(
      geometry.distance > 0,
      "Explosion must have a desktop scroll timeline",
    );
    const frames = [];
    for (const progress of [0, 0.2, 0.45, 0.65, 0.85, 1]) {
      await scroll(page, geometry.start + geometry.distance * progress);
      frames.push(
        await page
          .locator(".explosion-kiwi")
          .first()
          .evaluate((el) => getComputedStyle(el).transform),
      );
      await page.screenshot({
        path: `${output}/${engine.name()}-${width}-swirl-${progress}.png`,
      });
    }
    assert(
      new Set(frames).size > 3,
      "Ingredients must move independently across multiple keyframes",
    );
    checks.push(
      "Explosion entry, separation, held peak and reassembly have distinct transforms",
    );
    await scroll(page, geometry.start + geometry.distance * 0.5);
    const forward = await page.locator(".explosion-cup").boundingBox();
    await scroll(page, geometry.start + geometry.distance * 0.9);
    await scroll(page, geometry.start + geometry.distance * 0.5);
    const backward = await page.locator(".explosion-cup").boundingBox();
    assert(
      Math.abs(forward.x - backward.x) < 1 &&
        Math.abs(forward.y - backward.y) < 1,
      "Reverse scroll must return to same peak",
    );
    checks.push("Reverse scrolling reproduces the same cup coordinates");
    await go(page, "flavors");
    let last = await page
      .locator(".flavor-track")
      .evaluate((e) => e.getBoundingClientRect().x);
    for (let i = 2; i <= 4; i++) {
      await page
        .getByRole("button", { name: "Next flavor", exact: true })
        .click();
      await page.waitForTimeout(1400);
      const current = await page.locator(".flavor-current").textContent();
      assert.equal(current, String(i).padStart(2, "0"));
      const x = await page
        .locator(".flavor-track")
        .evaluate((e) => e.getBoundingClientRect().x);
      assert(last - x > 350, "Next must travel a complete flavor panel");
      last = x;
    }
    checks.push("All four desktop flavors advance one full panel");
    await go(page, "flavors");
    await page
      .getByRole("button", { name: "Next flavor", exact: true })
      .click({ clickCount: 3, delay: 70 });
    await page.waitForTimeout(1600);
    assert.equal(await page.locator(".flavor-current").textContent(), "04");
    checks.push("Rapid arrow input reaches requested final flavor");
    if (engine === chromium) {
      await go(page, "flavors");
      await page.mouse.move(710, 500);
      const y = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(1000);
      assert(
        (await page.evaluate(() => scrollY)) - y > 500,
        "Wheel over flavor panel must continue page scroll",
      );
      checks.push(
        "Wheel input over the horizontal rail does not trap scrolling",
      );
    }
    await go(page, "story");
    assert(
      Math.abs((await page.locator("#story").boundingBox()).y) < 3,
      "Story anchor must resolve after both pin spacers",
    );
    checks.push("Navigation interrupts scrub and lands on Story correctly");
    await go(page, "home");
    await go(page, "story");
    await page.goBack();
    await page.waitForTimeout(1500);
    assert(
      (await page.evaluate(() => scrollY)) < 5,
      "Browser back must resolve home",
    );
    checks.push("Browser back restores section navigation");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1200);
    assert.equal(await page.locator(".pin-spacer").count(), 0);
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(1200);
    assert.equal(await page.locator(".pin-spacer").count(), 2);
    checks.push(
      "Breakpoint changes remove and rebuild exactly two desktop pins",
    );
  } else {
    assert.equal(await page.locator(".pin-spacer").count(), 0);
    checks.push("Touch layout uses natural scrolling without pins");
    await go(page, "flavors");
    for (let i = 2; i <= 4; i++) {
      await page
        .getByRole("button", { name: "Next flavor", exact: true })
        .click();
      await wait(page);
      assert.equal(
        await page.locator(".flavor-current").textContent(),
        String(i).padStart(2, "0"),
      );
    }
    for (let i = 3; i >= 1; i--) {
      await page
        .getByRole("button", { name: "Previous flavor", exact: true })
        .click();
      await wait(page);
      assert.equal(
        await page.locator(".flavor-current").textContent(),
        String(i).padStart(2, "0"),
      );
    }
    checks.push(
      "Mobile native carousel advances and reverses through every flavor",
    );
    await page.locator(".flavor-track").focus();
    await page.keyboard.press("ArrowRight");
    await wait(page);
    assert.equal(await page.locator(".flavor-current").textContent(), "02");
    checks.push("Keyboard right arrow controls native carousel");
    await page.locator(".menu-toggle").click();
    assert(await page.locator("dialog").evaluate((e) => e.open));
    await page.locator('dialog a[href="#story"]').click();
    await page.waitForTimeout(1300);
    assert(!(await page.locator("dialog").evaluate((e) => e.open)));
    assert(Math.abs((await page.locator("#story").boundingBox()).y) < 3);
    checks.push("Mobile menu closes and scrolls to Story without focus jump");
    assert(
      await page
        .locator(".site-header")
        .evaluate((e) => e.classList.contains("is-light")),
    );
    checks.push("Header remains readable on cream sections");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(1000);
  assert.equal(await page.locator(".pin-spacer").count(), 0);
  await go(page, "flavors");
  await page.locator(".flavor-track").evaluate((e) => {
    e.scrollLeft = 0;
    delete e.dataset.targetIndex;
  });
  await wait(page);
  await page.getByRole("button", { name: "Next flavor", exact: true }).click();
  await wait(page);
  assert.equal(await page.locator(".flavor-current").textContent(), "02");
  checks.push("Reduced motion removes pins and preserves flavor controls");
  assert(
    !(await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    )),
    "No document horizontal overflow",
  );
  assert.equal(errors.length, 0);
  results.push({ engine: engine.name(), width, height, checks, errors });
  console.log(
    `${engine.name()} ${width}: ${checks.length} motion/interaction checks passed`,
  );
  await fs.writeFile(
    `${output}/motion-report.json`,
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
