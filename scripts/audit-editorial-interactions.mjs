import assert from "node:assert/strict";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

export async function auditEditorialInteractions(browser, origin) {
  const context = await browser.createBrowserContext();
  try {
  for (const locale of ["", "/zh"]) {
    for (const width of [360, 390, 768, 1440]) for (const theme of ["light", "dark"]) for (const reduced of [false, true]) {
      const page = await context.newPage();
      try {
        await page.setViewport({ width, height: 900 });
        await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
        await page.evaluateOnNewDocument(value => localStorage.setItem("wy-theme", value), theme);
        await page.goto(origin + locale + "/", { waitUntil: "load" });
        await page.$eval("[data-provenance-signature]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
        await page.waitForFunction(() => document.querySelector(".provenance-workbench")?.dataset.ready === "true");
        const signature = await page.$("[data-provenance-signature]");
        const first = await sharp(await signature.screenshot()).raw().toBuffer();
        await new Promise(resolve => setTimeout(resolve, 450));
        const second = await sharp(await signature.screenshot()).raw().toBuffer();
        if (!reduced && width === 1440) assert(!first.equals(second), "visible signature animates");
        if (reduced) {
          const motion = await page.$$eval("[data-provenance-signature] .pv-motion", nodes => nodes.every(node => getComputedStyle(node).animationName === "none"));
          assert(motion, "reduced motion disables all signature loops");
        }
        await page.click('[data-observatory-view="governance"]');
        assert.equal(await page.$eval('[data-provenance-stage][aria-current="step"]', node => node.dataset.provenanceStage), "4");
        assert.equal(await page.$eval(".provenance-workbench", node => node.dataset.lens), "governance");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        if (!reduced && width === 1440 && theme === "light") {
          await page.click("[data-scene-play]");
          await page.$eval("[data-provenance-signature]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
          await page.evaluate(() => document.fonts.ready);
          await page.waitForFunction(() => {
            const scene = document.querySelector('[data-provenance-signature]');
            return scene?.dataset.motion === 'paused' && scene.getAnimations({ subtree: true }).every(animation => animation.playState === 'paused');
          });
          await new Promise(resolve => setTimeout(resolve, 320));
          const box = await signature.boundingBox();
          const offset = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
          const clip = { ...box, x: box.x + offset.x, y: box.y + offset.y };
          const pausedImage = await page.screenshot({ clip });
          const paused = await sharp(pausedImage).raw().toBuffer();
          await new Promise(resolve => setTimeout(resolve, 450));
          const laterImage = await page.screenshot({ clip });
          const later = await sharp(laterImage).raw().toBuffer();
          // Fractional static borders can differ by one color level in Chromium.
          const frozen = paused.length === later.length && paused.every((value, index) => Math.abs(value - later[index]) <= 1);
          assert.equal(await page.$eval('[data-provenance-signature]', node => node.dataset.motion), 'paused');
          assert(await page.$eval('[data-provenance-signature]', node => node.getAnimations({ subtree: true }).every(animation => animation.playState === 'paused')));
          if (!frozen) {
            const directory = path.resolve('outputs', 'browser-audit', 'pause-failure');
            fs.mkdirSync(directory, { recursive: true });
            const name = `${locale ? 'zh' : 'en'}-${Date.now()}`;
            fs.writeFileSync(path.join(directory, `${name}-before.png`), pausedImage);
            fs.writeFileSync(path.join(directory, `${name}-after.png`), laterImage);
            console.error('Pause failure images:', directory, name);
          }
          assert(frozen, `${locale || 'en'}: manual pause freezes artwork`);
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
          await page.$eval("[data-provenance-signature]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
          assert.equal(await page.$eval("[data-scene-play]", node => node.getAttribute("aria-pressed")), "true", "scroll does not undo manual pause");
        }
      } finally { await page.close(); }
    }
    const page = await context.newPage();
    try {
      await page.setViewport({ width: 1440, height: 1000 });
      await page.goto(origin + locale + "/about/", { waitUntil: "load" });
      await page.$eval("[data-experience-timeline]", node => node.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.waitForSelector('[data-timeline-mode="desktop"]');
      const summaries = await page.$$("[data-timeline-summary]");
      const panelText = () => page.$eval("[data-timeline-panel-body]", node => node.textContent);
      const latest = await panelText();
      await summaries[0].hover();
      await new Promise(resolve => setTimeout(resolve, 230));
      assert.notEqual(await panelText(), latest, "hover previews another milestone");
      await summaries[0].click();
      const pinned = await panelText();
      const semantics = await summaries[0].evaluate(node => ({
        expanded: node.getAttribute('aria-expanded'), open: node.parentElement.open,
        panel: document.getElementById(node.getAttribute('aria-controls'))?.hasAttribute('data-timeline-panel'),
      }));
      assert.deepEqual(semantics, { expanded: 'true', open: true, panel: true }, 'desktop disclosure describes its visible panel');
      await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
      await summaries[1].focus();
      assert.notEqual(await panelText(), pinned, 'BFCache pagehide retains keyboard interaction');
      await page.keyboard.press("Escape");
      assert.equal(await panelText(), pinned, "Escape restores pinned milestone");
      await page.setViewport({ width: 390, height: 844 });
      await page.waitForSelector('[data-timeline-mode="mobile"]');
      const before = await summaries[0].evaluate(node => node.parentElement.open);
      await summaries[0].click();
      assert.equal(await summaries[0].evaluate(node => node.parentElement.open), !before, "mobile disclosure uses native click");
      assert.equal(await summaries[0].evaluate(node => node.hasAttribute('aria-expanded')), false, 'mobile uses native disclosure semantics');
    } finally { await page.close(); }
  }
  console.log("editorial-interactions: 64 observatory locale/theme/viewport/motion states and bilingual timeline preview/pin/Escape/mobile passed");
  } finally { await context.close(); }
}
