import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export async function auditResearchIllustration(browser, origin) {
  const context = await browser.createBrowserContext();
  try {
  const output = path.resolve("outputs/research-illustration");
  fs.mkdirSync(output, { recursive: true });
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
        await page.focus(".research-illustration-replay");
        await page.keyboard.press("Space");
        await page.waitForFunction(() => [...document.querySelectorAll("[data-research-illustration] img")].some(img => img.getBoundingClientRect().width > 0 && img.currentSrc.includes("play=2") && img.complete && img.naturalWidth > 0), { timeout: 5000 });
        // currentSrc changes before the replacement SVG is decoded and its timeline starts.
        await page.$$eval("[data-research-illustration] img", images => Promise.all(images.filter(img => img.getBoundingClientRect().width > 0).map(img => img.decode())));
      }
      if (width === 1440 && locale === "en" && theme === "light" && !reduced) {
        const figure = await page.$("[data-research-illustration]");
        let frame = 0;
        const pixels = async () => sharp(await figure.screenshot({ path: path.join(output, `motion-${frame++}.png`) })).removeAlpha().raw().toBuffer();
        const first = await pixels();
        await new Promise(resolve => setTimeout(resolve, 700));
        assert(!first.equals(await pixels()), "embedded SVG visibly animates");
        await new Promise(resolve => setTimeout(resolve, 4900));
        const ended = await pixels();
        await new Promise(resolve => setTimeout(resolve, 300));
        assert(ended.equals(await pixels()), "animation settles without a persistent loop");
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
      assert(staticSources.length === 2 && staticSources.every(src => src.endsWith("-static.svg")), "no-JavaScript static artwork");
      assert.equal(await page.$eval(".research-illustration-replay", button => getComputedStyle(button).display), "none");
    } finally { await page.close(); }
  }
  console.log(`research-illustration: ${states} locale/theme/viewport/motion states, keyboard replay, finite pixels and two no-JavaScript pages passed`);
  } finally { await context.close(); }
}
