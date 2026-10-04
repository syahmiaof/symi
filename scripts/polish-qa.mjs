import { chromium, webkit } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3001";
const out = process.env.QA_OUTPUT || ".work/polish/motion";
await fs.mkdir(out, { recursive: true });
const report = [];
for (const [engine, width, height] of [
  [chromium, 1900, 860],
  [chromium, 1536, 688],
  [chromium, 390, 844],
  [webkit, 1440, 900],
  [webkit, 390, 844],
]) {
  if (
    process.env.QA_PROFILE &&
    `${engine.name()}-${width}` !== process.env.QA_PROFILE
  )
    continue;
  const b = await engine.launch();
  const ctx = await b.newContext({
    viewport: { width, height },
    isMobile: width < 768,
    hasTouch: width < 768,
    recordVideo:
      engine === chromium && width === 1900
        ? { dir: out, size: { width: 1280, height: 720 } }
        : undefined,
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base, { waitUntil: "networkidle" });
  await p.waitForFunction(
    () => {
      const words = [...document.querySelectorAll("h1 .motion-word")];
      return (
        words.length === 3 &&
        words.every((e) => +getComputedStyle(e).opacity > 0.99)
      );
    },
    { timeout: 10000 },
  );
  const checks = [];
  const shot = async (name) =>
    p.screenshot({ path: `${out}/${engine.name()}-${width}-${name}.png` });
  const scroll = async (y, wait = 1800) => {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(wait);
  };
  const top = async (sel) =>
    p.locator(sel).evaluate((e) => e.getBoundingClientRect().top + scrollY);
  const op = async (sel) =>
    p
      .locator(sel)
      .evaluateAll((es) => es.map((e) => Number(getComputedStyle(e).opacity)));
  const overflow = async () =>
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Page overflow",
    );
  await shot("hero");
  await overflow();
  assert((await op("h1 .motion-word")).every((x) => x > 0.99));
  assert(
    await p
      .locator(".hero-cup")
      .evaluate((e) => getComputedStyle(e).objectFit === "contain"),
  );
  checks.push("Hero readable after intro; cup keeps intrinsic proportions");
  const storyTop = await top("#story-title");
  await scroll(storyTop - height * 0.84);
  assert(
    (await op("#story-title .motion-word")).every((x) => x < 0.02),
    "Story appeared before entering",
  );
  await scroll(storyTop - height * 0.64, 240);
  const entering = await op("#story-title .motion-word");
  assert(
    entering.some((x) => x > 0 && x < 0.99),
    "No gradual entrance",
  );
  await p.waitForTimeout(1600);
  assert((await op("#story-title .motion-word")).every((x) => x > 0.99));
  await shot("story-entered");
  const storyHeight = await p
    .locator("#story-title")
    .evaluate((e) => e.offsetHeight);
  await scroll(storyTop + storyHeight + 10);
  assert((await op("#story-title"))[0] < 0.03, "No exit");
  await scroll(storyTop - height * 0.5);
  assert((await op("#story-title .motion-word")).every((x) => x > 0.99));
  assert((await op("#story-title"))[0] > 0.99);
  checks.push(
    "Text hidden before 70% threshold, gradual entrance, readable hold, exit and reverse",
  );
  const swirlTop = await top("#swirl");
  const swirlHeight = await p
    .locator(".swirl-scene")
    .evaluate((e) => e.offsetHeight);
  const start = width >= 1024 ? swirlTop : swirlTop - height * 0.55;
  const distance = width >= 1024 ? height * 2.8 : swirlHeight + height * 0.2;
  const times = [];
  for (const fraction of [0.05, 0.3, 0.5, 0.7, 0.92, 0.3]) {
    await scroll(start + distance * fraction, 1000);
    const time = fraction * 10.6;
    const expected =
      time < 0.6
        ? 0
        : time < 5.4
          ? ((time - 0.6) / 4.8) * 5.8
          : time < 6.5
            ? 5.8
            : time < 10
              ? 5.8 + ((time - 6.5) / 3.5) * 4.2
              : 9.95;
    await p.waitForFunction(
      (expected) => {
        const v = document.querySelector("video");
        return (
          v.readyState >= 2 &&
          !v.seeking &&
          Math.abs(v.currentTime - expected) < 0.12
        );
      },
      expected,
      { timeout: 12000 },
    );
    times.push(await p.locator("video").evaluate((e) => e.currentTime));
    await overflow();
    if (fraction === 0.5) await shot("explosion");
  }
  assert(
    times[2] > times[1] && times[4] > times[2],
    `MP4 does not advance: ${times}`,
  );
  assert(
    Math.abs(times[1] - times[5]) < 0.15,
    `Reverse seek mismatch: ${times}`,
  );
  checks.push(
    "MP4 seeks forward and backward to matching frames",
    ...times.map((t, i) => `seek ${i}: ${t.toFixed(3)}s`),
  );
  await scroll(await top("#flavors"));
  await shot("flavors");
  await overflow();
  if (width >= 1024) {
    const boxes = await p.evaluate(() => ({
      header: document.querySelector(".site-header").getBoundingClientRect()
        .bottom,
      title: document.querySelector("#flavor-title").getBoundingClientRect()
        .top,
    }));
    assert(boxes.title > boxes.header, JSON.stringify(boxes));
    checks.push("Flavor heading clears navbar");
  }
  assert(
    await p
      .locator(".flavor-product img")
      .first()
      .evaluate((e) => getComputedStyle(e).objectFit === "contain"),
  );
  await p.getByRole("button", { name: "Next flavor", exact: true }).click();
  await p.waitForTimeout(1800);
  assert.equal(await p.locator(".flavor-current").textContent(), "02");
  await p.getByRole("button", { name: "Previous flavor", exact: true }).click();
  await p.waitForTimeout(1800);
  assert.equal(await p.locator(".flavor-current").textContent(), "01");
  checks.push("Flavor next/previous controls and natural cup proportions");
  if (width < 768) {
    for (let i = 0; i < 2; i++) {
      await p.locator(".menu-toggle").click();
      await p.waitForTimeout(800);
      assert(await p.locator("dialog").evaluate((e) => e.open));
      await p.keyboard.press("Escape");
      await p.waitForTimeout(500);
      assert(
        await p
          .locator(".menu-toggle")
          .evaluate((e) => e === document.activeElement),
      );
    }
    checks.push(
      "Repeated menu opening, animated closing and focus restoration",
    );
  }
  await scroll(0);
  for (const delta of [130, 300, 680, 900, -400, -600]) {
    if (width < 768) await p.evaluate((delta) => scrollBy(0, delta), delta);
    else await p.mouse.wheel(0, delta);
    await p.waitForTimeout(260);
    await overflow();
  }
  checks.push(
    `${width < 768 ? "Native" : "Wheel"} slow/fast/reverse scrolling without document overflow`,
  );
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.waitForTimeout(600);
  assert.equal(await p.locator(".pin-spacer").count(), 0);
  assert.equal(await p.locator(".motion-word").count(), 0);
  checks.push("Reduced motion removes text splitting and pins");
  assert.deepEqual(errors, []);
  report.push({ engine: engine.name(), width, height, checks, errors });
  await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(`${engine.name()} ${width}: ${checks.length} checks passed`);
  await ctx.close();
  await b.close();
}
