import { chromium, webkit } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3001";
const out = process.env.QA_OUTPUT || ".work/scroll-repair";
await fs.mkdir(out, { recursive: true });
const results = [];
for (const [engine, width, height, mobile] of [
  [chromium, 1280, 573, false],
  [chromium, 1440, 900, false],
  [chromium, 390, 844, true],
  [chromium, 375, 580, true],
  [webkit, 390, 844, true],
]) {
  const b = await engine.launch();
  const p = await b.newPage({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
  });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.addInitScript(() => {
    window.__frames = [];
    const sample = () => {
      const cup = document.querySelector(".hero-cup");
      if (cup && document.querySelector("[data-motion-ready]"))
        window.__frames.push({
          welcome: !!document.querySelector("[data-welcoming]"),
          opacity: +getComputedStyle(cup).opacity,
        });
      if (window.__frames.length < 500) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await p.goto(base, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("[data-welcoming]");
  await p.waitForTimeout(650);
  await p.screenshot({ path: `${out}/${engine.name()}-${width}-welcome.png` });
  if (!(mobile && engine === webkit)) await p.mouse.wheel(0, 300);
  assert.equal(await p.evaluate(() => scrollY), 0);
  await p.waitForSelector(".welcome-screen[hidden]", { state: "attached" });
  await p.waitForTimeout(2500);
  assert.equal(
    await p.locator(".site-content").evaluate((e) => e.inert),
    false,
  );
  assert(
    (await p
      .locator(".hero-cup")
      .evaluate((e) => +getComputedStyle(e).opacity)) > 0.99,
  );
  const frames = await p.evaluate(() => window.__frames);
  assert(
    frames.some((f) => f.welcome && f.opacity < 0.1),
    "Hero starts behind welcome",
  );
  assert(
    frames.some((f) => !f.welcome && f.opacity > 0.1 && f.opacity < 0.95),
    "Hero entrance not visible after welcome",
  );
  assert.equal(await p.locator(".pin-spacer").count(), 2);
  const geo = async (id) =>
    p
      .locator("#" + id)
      .evaluate((e) => ({
        start: e.getBoundingClientRect().top + scrollY,
        height: e.querySelector('[class$="-scene"]').clientHeight,
        span:
          e.querySelector(".pin-spacer").offsetHeight -
          e.querySelector('[class$="-scene"]').clientHeight,
      }));
  const jump = async (y) => {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(1000);
  };
  const swirl = await geo("swirl");
  assert.equal(swirl.height, height);
  const times = [];
  for (const f of [0.2, 0.5, 0.85, 0.5]) {
    await jump(swirl.start + swirl.span * f);
    await p.waitForFunction(() => {
      const v = document.querySelector("video");
      return v.readyState >= 2 && !v.seeking;
    });
    times.push(await p.locator("video").evaluate((v) => v.currentTime));
    assert(
      Math.abs(
        await p
          .locator(".swirl-scene")
          .evaluate((e) => e.getBoundingClientRect().top),
      ) < 3,
      "Explosion left viewport before animation completed",
    );
  }
  assert(times[0] < times[1] && times[1] < times[2]);
  assert(Math.abs(times[1] - times[3]) < 0.15);
  assert(
    (await p.locator("video").evaluate((v) => v.currentSrc)).endsWith(
      mobile ? "symi-swirl-mobile.mp4" : "symi-swirl.mp4",
    ),
  );
  await p.waitForTimeout(800);
  await p.screenshot({
    path: `${out}/${engine.name()}-${width}-explosion.png`,
  });
  const flavors = await geo("flavors");
  const positions = [];
  for (const f of [0.02, 0.5, 0.98]) {
    await jump(flavors.start + flavors.span * f);
    assert(
      Math.abs(
        await p
          .locator(".flavor-scene")
          .evaluate((e) => e.getBoundingClientRect().top),
      ) < 3,
      "Flavors not pinned",
    );
    positions.push(
      await p
        .locator(".flavor-track")
        .evaluate((e) => e.getBoundingClientRect().left),
    );
  }
  assert(positions[0] > positions[1] && positions[1] > positions[2]);
  await jump(flavors.start + flavors.span * 0.01);
  await p.waitForTimeout(1500);
  const nav = await p.locator(".site-header").boundingBox(),
    title = await p.locator(".flavor-heading h2").boundingBox();
  assert(title.y >= nav.y + nav.height, "Header overlaps flavor title");
  await p.screenshot({ path: `${out}/${engine.name()}-${width}-flavors.png` });
  assert(
    (await p.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    )) <= 1,
  );
  if (width === 390 && engine === chromium) {
    await jump(swirl.start + swirl.span * 0.5);
    await p.setViewportSize({ width, height: height + 60 });
    await p.waitForTimeout(800);
    assert.equal(await p.locator(".pin-spacer").count(), 2);
    assert(
      Math.abs(
        await p
          .locator(".swirl-scene")
          .evaluate((e) => e.getBoundingClientRect().top),
      ) < 3,
    );
  }
  // A refresh at home replays the welcome; Enter can bypass it immediately.
  await p.goto(base, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("[data-welcoming]");
  await p.locator(".welcome-enter").click();
  await p.waitForSelector(".welcome-screen[hidden]", { state: "attached" });
  await p.goto(base + "/#flavors");
  await p.waitForSelector("[data-motion-ready]");
  assert(await p.locator(".welcome-screen").isHidden());
  assert.equal(errors.length, 0, errors.join("\n"));
  results.push({
    engine: engine.name(),
    width,
    height,
    times,
    positions,
    checks:
      "welcome → hero, skip, anchors, both pins, reverse video, source selection, header clearance, no overflow/errors",
  });
  console.log(JSON.stringify(results.at(-1)));
  await b.close();
}
await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
