import { chromium, webkit } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_URL || "http://localhost:3001";
const out = ".work/polish/intro";
await fs.mkdir(out, { recursive: true });
const results = [];
for (const engine of [chromium, webkit]) {
  const b = await engine.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(() => {
    window.__introSamples = [];
    const sample = () => {
      const cup = document.querySelector(".hero-cup");
      if (
        cup &&
        document.querySelector("[data-motion-ready]") &&
        !document.querySelector("[data-welcoming]")
      ) {
        window.__introSamples.push({
          opacity: +getComputedStyle(cup).opacity,
          transform: getComputedStyle(cup).transform,
        });
      }
      if (window.__introSamples.length < 200) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  for (let pass = 0; pass < 2; pass++) {
    if (pass) await p.reload({ waitUntil: "domcontentloaded" });
    else await p.goto(base, { waitUntil: "domcontentloaded" });
    await p.locator("[data-motion-ready]").waitFor();
    await p.locator(".welcome-screen[hidden]").waitFor({ state: "attached" });
    const states = [];
    for (const wait of [0, 350, 650, 1800]) {
      await p.waitForTimeout(wait);
      states.push(
        await p.locator(".hero-cup").evaluate((e) => ({
          opacity: +getComputedStyle(e).opacity,
          transform: getComputedStyle(e).transform,
        })),
      );
      await p.screenshot({
        path: `${out}/${engine.name()}-${pass}-${states.length}.png`,
      });
    }
    const frames = await p.evaluate(() => window.__introSamples);
    assert(
      frames.some((s) => s.opacity < 0.8),
      "No entrance frames recorded",
    );
    assert(states.at(-1).opacity > 0.99);
    assert(
      new Set(frames.map((s) => s.transform)).size > 3,
      "No product movement",
    );
    results.push({
      engine: engine.name(),
      pass,
      states,
      sampledFrames: frames.length,
    });
  }
  await b.close();
}
await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2));
console.log("Intro fresh load and refresh verified in Chromium and WebKit");
