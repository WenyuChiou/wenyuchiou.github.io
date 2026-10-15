import assert from "node:assert/strict";
import axe from "axe-core";

const source = "https://www.linkedin.com/embed/feed/update/urn:li:share:7496270988519735296";
const fixture = "<!doctype html><html lang='en'><head><title>Controlled embed fixture</title></head><body><main><h1>Controlled LinkedIn fixture</h1><p>Original post content is supplied by LinkedIn in the real preview.</p></main></body></html>";

export async function auditLinkedInPreview(browser, origin) {
  let cases = 0;
  for (const locale of ["en", "zh-TW"]) {
    const route = locale === "en" ? "/" : "/zh/";
    for (const theme of ["light", "dark"]) {
      for (const width of [360, 390, 768, 1440]) {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        const requests = [];
        try {
          await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
          await page.evaluateOnNewDocument(theme => localStorage.setItem("wy-theme", theme), theme);
          await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: width === 360 ? "reduce" : "no-preference" }]);
          await page.setRequestInterception(true);
          page.on("request", request => {
            if (request.url() === source) {
              requests.push(request.url());
              void request.respond({ status: 200, contentType: "text/html", body: fixture });
            } else void request.continue();
          });
          await page.goto(origin + route, { waitUntil: "networkidle0" });
          await page.waitForFunction(() => document.documentElement.classList.contains("js"));
          assert.equal(requests.length, 0, "must not contact LinkedIn before visitor intent");
          assert.equal(await page.$("iframe"), null, "no initial frame");
          assert.equal(await page.$$eval(".curated-note h3", items => items.length), 3);
          const summary = ".linkedin-preview > summary";
          const label = await page.$eval(summary, node => node.textContent);
          assert.ok(locale === "en" ? label.includes("Preview original") : label.includes("展開"));
          await page.focus(summary);
          await page.keyboard.press("Space");
          await page.waitForSelector(".linkedin-preview iframe");
          await page.waitForFunction(() => document.querySelector(".linkedin-preview-status")?.textContent === "");
          assert.equal(requests.length, 1);
          const state = await page.$eval(".linkedin-preview iframe", node => {
            const rect = node.getBoundingClientRect();
            return { width: rect.width, left: rect.left, right: rect.right, title: node.title, policy: node.referrerPolicy, sandbox: node.getAttribute("sandbox"), overflow: document.documentElement.scrollWidth > innerWidth };
          });
          assert.ok(state.width > 240 && state.width <= 504 && state.left >= 0 && state.right <= width && !state.overflow, JSON.stringify(state));
          assert.ok(state.title.includes("awesome-agentic-ai-zh"));
          assert.equal(state.policy, "no-referrer");
          assert.ok(!state.sandbox.includes("allow-top-navigation"));
          // Run the test-only accessibility probe through DevTools; keep page CSP enforced.
          await page.evaluate(axe.source);
          const violations = await page.evaluate(async () => (await window.axe.run(document.querySelector("#public-updates"), { resultTypes: ["violations"] })).violations.map(item => item.id));
          assert.deepEqual(violations, []);
          await page.focus(".linkedin-preview-close");
          await page.keyboard.press("Enter");
          await page.waitForFunction(() => !document.querySelector(".linkedin-preview").open && !document.querySelector(".linkedin-preview iframe"));
          assert.equal(await page.$eval(summary, node => node === document.activeElement), true);
          await page.keyboard.press("Enter");
          await page.waitForSelector(".linkedin-preview iframe");
          await page.focus(summary);
          await page.keyboard.press("Escape");
          await page.waitForFunction(() => !document.querySelector(".linkedin-preview iframe"));
          assert.equal(requests.length, 2, "a fresh frame is created only after reopening");
          assert.equal(await page.$eval(".linkedin-preview-fallback", node => Boolean(node.href)), true);
          cases++;
        } finally { await context.close(); }
      }
    }
    for (const noScript of [false, true]) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      let requests = 0;
      try {
        await page.setViewport({ width: 360, height: 800 });
        await page.setRequestInterception(true);
        page.on("request", request => {
          if (request.url() === source) { requests++; return; }
          void request.continue();
        });
        if (noScript) await page.setJavaScriptEnabled(false);
        else await page.evaluateOnNewDocument(() => {
          const timeout = window.setTimeout.bind(window);
          window.setTimeout = (callback, delay, ...args) => timeout(callback, delay === 12000 ? 80 : delay, ...args);
        });
        await page.goto(origin + route, { waitUntil: "networkidle0" });
        if (!noScript) await page.waitForFunction(() => document.documentElement.classList.contains("js"));
        await page.click(".linkedin-preview > summary");
        if (noScript) {
          assert.equal(requests, 0);
          assert.equal(await page.$("iframe"), null);
          assert.ok(await page.$eval(".linkedin-preview noscript", node => node.textContent.trim()));
        } else {
          await page.waitForFunction(() => /longer|較久/.test(document.querySelector(".linkedin-preview-status")?.textContent));
          assert.equal(requests, 1, "failed frame does not auto-retry");
          assert.ok(await page.$eval(".linkedin-preview-fallback", node => node.getBoundingClientRect().height >= 44));
          await page.click(".linkedin-preview > summary");
          await page.waitForFunction(() => !document.querySelector(".linkedin-preview iframe"));
        }
        cases++;
      } finally { await context.close(); }
    }
  }
  console.log(`linkedin-preview: ${cases} bilingual/theme/viewport, keyboard, opt-in, timeout and no-JavaScript cases passed; LinkedIn responses explicitly mocked`);
}
