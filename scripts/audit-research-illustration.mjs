import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

async function auditCycleEndpoints(context, origin) {
  const page = await context.newPage();
  try {
    for (const locale of ["", "-zh-TW"]) for (const mobile of ["", "-mobile"]) for (const dark of ["", "-dark"]) {
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
      await page.goto(`${origin}/assets/research/research-loop${locale}${mobile}${dark}.svg?v=loop-1`, { waitUntil: "load" });
      const cycles = await page.evaluate(() => document.getAnimations().map(animation => {
        const frames = animation.effect.getKeyframes(), first = frames[0], last = frames.at(-1);
        const hiddenBoundary = first.opacity === "0" && last.opacity === "0";
        return { name: animation.animationName, infinite: animation.effect.getTiming().iterations === Infinity, closed: first.opacity === last.opacity && (hiddenBoundary || first.transform === last.transform) };
      }));
      assert(cycles.length >= 25, "all major elements animate");
      assert(cycles.every(cycle => cycle.infinite && cycle.closed), `continuous, closed keyframes: ${JSON.stringify(cycles.filter(cycle => !cycle.infinite || !cycle.closed))}`);
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await page.waitForFunction(() => document.getAnimations().length === 0);
    }
  } finally { await page.close(); }
}

export async function auditResearchIllustration(browser, origin) {
  const context = await browser.createBrowserContext();
  try {
  const output = path.resolve("outputs/research-illustration");
  fs.mkdirSync(output, { recursive: true });
  await auditCycleEndpoints(context, origin);
  let states = 0;
  for (const locale of ["en", "zh-TW"]) for (const width of [360, 390, 621, 667, 768, 1440]) for (const theme of ["light", "dark"]) for (const reduced of [false, true]) {
    const page = await context.newPage();
    try {
      await page.setViewport({ width, height: 1000 });
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
      await page.evaluateOnNewDocument(value => localStorage.setItem("wy-theme", value), theme);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const requests = [];
      page.on("request", request => { if (request.url().includes("/assets/research/")) requests.push(request.url()); });
      await page.goto(`${origin}${locale === "en" ? "/" : "/zh/"}`, { waitUntil: "load" });
      assert(requests.every(url => url.includes("-static.svg")), "animation must not preload before its section is visible");
      await page.$eval("[data-research-illustration]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForFunction(() => [...document.querySelectorAll("[data-research-illustration] img")].some(img => img.getBoundingClientRect().width > 0 && img.complete && img.naturalWidth > 0 && (matchMedia("(prefers-reduced-motion: reduce)").matches ? img.currentSrc.includes("-static.svg") : img.currentSrc.includes("play=1"))), { timeout: 10000 });
      const state = await page.evaluate(() => {
        const img = [...document.querySelectorAll("[data-research-illustration] img")].find(node => node.getBoundingClientRect().width > 0);
        const figure = img.closest("figure"), box = img.getBoundingClientRect(), button = figure.querySelector("button");
        return { src: img.currentSrc, alt: img.alt, width: box.width, height: box.height, overflow: document.documentElement.scrollWidth > innerWidth + 1, replay: getComputedStyle(button).display !== "none", replayBelowArt: button.getBoundingClientRect().top >= box.bottom };
      });
      assert(state.alt.includes("Wenyu Chiou") && !state.overflow);
      assert.equal(state.src.includes("-zh-TW"), locale === "zh-TW");
      assert.equal(state.src.includes("-dark"), theme === "dark");
      assert.equal(state.src.includes("-mobile"), width <= 620);
      assert.equal(state.replay, !reduced);
      if (state.replay) assert(state.replayBelowArt, "replay control never overlaps artwork");
      assert(Math.abs(state.width / state.height - (width <= 620 ? 480 / 1480 : 1.6)) < 0.01, "stable reserved aspect ratio");
      if (!reduced) {
        await page.focus(".research-illustration-toggle");
        await page.keyboard.press("Space");
        await page.waitForFunction(() => [...document.querySelectorAll("[data-research-illustration] img")].some(img => img.getBoundingClientRect().width > 0 && img.currentSrc.includes("-static.svg") && img.complete), { timeout: 5000 });
        assert.equal(await page.$eval(".research-illustration-toggle", button => button.getAttribute("aria-label")), locale === "en" ? "Play research animation" : "播放研究動畫");
        await page.keyboard.press("Enter");
        await page.waitForFunction(() => [...document.querySelectorAll("[data-research-illustration] img")].some(img => img.getBoundingClientRect().width > 0 && img.currentSrc.includes("play=1") && img.complete && img.naturalWidth > 0), { timeout: 5000 });
        // currentSrc changes before the replacement SVG is decoded and its timeline starts.
        await page.$$eval("[data-research-illustration] img", images => Promise.all(images.filter(img => img.getBoundingClientRect().width > 0).map(img => img.decode())));
      }
      if (width === 1440 && locale === "en" && theme === "light" && !reduced) {
        const artwork = await page.$(".research-art-light img");
        let frame = 0;
        // Sample the artwork, not the independent 150ms hover transition on its control.
        const pixels = async () => sharp(await artwork.screenshot({ path: path.join(output, `motion-${frame++}.png`) })).removeAlpha().raw().toBuffer();
        const first = await pixels();
        await new Promise(resolve => setTimeout(resolve, 700));
        assert(!first.equals(await pixels()), "embedded SVG visibly animates");
        for (const cycle of [2, 3]) {
          await new Promise(resolve => setTimeout(resolve, 4900));
          const later = await pixels();
          await new Promise(resolve => setTimeout(resolve, 700));
          assert(!later.equals(await pixels()), `animation continues into cycle ${cycle}`);
        }
        await page.click(".research-illustration-toggle");
        await page.waitForFunction(() => document.querySelector(".research-art-light img").currentSrc.includes("-static.svg"));
        await page.$eval(".research-art-light img", img => img.decode());
        const paused = await pixels();
        await new Promise(resolve => setTimeout(resolve, 700));
        assert(paused.equals(await pixels()), "pause shows a stable complete workflow");
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.$eval("[data-research-illustration]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
        assert.equal(await page.$eval(".research-illustration-toggle", button => button.dataset.paused), "true", "scrolling never overrides manual pause");
        await page.click(".research-illustration-toggle");
        await page.waitForFunction(() => document.querySelector(".research-art-light img").currentSrc.includes("play=1"));
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForFunction(() => document.querySelector(".research-art-light img").currentSrc.includes("-static.svg"));
        await page.$eval("[data-research-illustration]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
        await page.waitForFunction(() => document.querySelector(".research-art-light img").currentSrc.includes("play=1"));
      }
      if (reduced) await (await page.$("[data-research-illustration]")).screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
      assert.deepEqual(errors, [], "no runtime errors");
      states++;
    } finally { await page.close(); }
  }
  for (const locale of ["en", "zh-TW"]) {
    const page = await context.newPage();
    try {
      await page.setJavaScriptEnabled(false);
      await page.goto(`${origin}${locale === "en" ? "/" : "/zh/"}`, { waitUntil: "load" });
      const staticSources = await page.$$eval("[data-research-illustration] img", images => images.map(img => img.getAttribute("src")));
      assert(staticSources.length === 2 && staticSources.every(src => new URL(src, origin).pathname.endsWith("-static.svg")), "no-JavaScript static artwork");
      assert.equal(await page.$eval(".research-illustration-toggle", button => getComputedStyle(button).display), "none");
    } finally { await page.close(); }
  }
  console.log(`research-illustration: ${states} locale/theme/viewport/motion states, eight SVG closed-loop variants, three-cycle pixels, keyboard pause/play, offscreen stop and two no-JavaScript pages passed`);
  } finally { await context.close(); }
}
