import { DEPLOYMENT_CONFIG } from '../deployment-config.mjs';
import axe from 'axe-core';

export async function auditPortfolioGuide(browser, origin, failures, { screenshots } = {}) {
  const initialFailures = failures.length;
  const context = await browser.createBrowserContext();
  try {
    for (const locale of ['en', 'zh-TW']) {
      const page = await context.newPage();
      await page.setBypassCSP(true);
      let calls = 0;
      let responseMode = 'success';
      const pendingResponses = [];
      const queries = [];
      await page.setViewport({ width: 390, height: 844 });
      await page.evaluateOnNewDocument(() => {
        window.guideTestTokens = [];
        window.turnstile = {
          render: (_element, options) => {
            if (window.guideTestHoldToken) window.guideTestTokens.push(options.callback);
            else setTimeout(() => options.callback('test-only-token'), 5);
            return 'test-widget';
          },
          remove: () => {},
        };
      });
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url() === DEPLOYMENT_CONFIG.aiEndpoint) {
          if (request.method() === 'OPTIONS') return void request.respond({ status: 204, headers: { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'Content-Type' } });
          calls++;
          queries.push(JSON.parse(request.postData()).query);
          const matches = responseMode !== 'invalid'
            ? [{ id: 'wagf', reason: '<img src=x onerror=alert(1)> View validation evidence.' }]
            : [{ id: 'invented-experience', reason: 'Unsupported claim' }];
          const respond = () => request.respond({ status: 200, headers: { 'access-control-allow-origin': origin, 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'nvidia', answer: 'Test-only cited summary', matches }) });
          if (responseMode === 'delayed') { pendingResponses.push(respond); return; }
          return void respond();
        }
        if (/huggingface|hf\.co|transformers-4\.2\.0|challenges\.cloudflare/.test(request.url())) return void request.abort();
        void request.continue();
      });
      await page.goto(`${origin}${locale === 'en' ? '/' : '/zh/'}`, { waitUntil: 'networkidle0' });
      await page.click('[data-navigator-launch]');
      await page.waitForSelector('[data-navigator-results] li');
      await page.click('[data-guide-intent="tools"]');
      const local = await page.evaluate(() => ({
        first: document.querySelector('[data-navigator-results] a').dataset.navigatorRecord,
        count: document.querySelectorAll('[data-navigator-results] li').length,
        mode: document.querySelector('[data-navigator-mode]').textContent,
        href: document.querySelector('[data-guide-collaboration]').getAttribute('href'),
      }));
      if (calls || local.first !== 'wagf' || local.count !== 3 || !local.mode || !local.href.endsWith('/hire/#fit-explorer')) failures.push(`${locale}: Guide opening/intent did not remain local or preserve recruiter routing`);
      await page.$eval('#navigator-query', input => { input.value = 'agent governance private-guide-marker'; input.dispatchEvent(new Event('input', { bubbles: true })); });
      if (calls) failures.push(`${locale}: typing called NVIDIA before explicit consent`);
      await page.click('.navigator-submit');
      await page.waitForFunction(() => !document.querySelector('[data-navigator-answer]').hidden);
      const generated = await page.evaluate(() => ({
        answer: document.querySelector('[data-navigator-answer]').textContent,
        injected: document.querySelector('[data-navigator-results] img'),
        first: document.querySelector('[data-navigator-results] a').dataset.navigatorRecord,
      }));
      if (calls !== 1 || generated.answer !== 'Test-only cited summary' || generated.injected || generated.first !== 'wagf') failures.push(`${locale}: explicit generated response was not bounded, allowlisted, and plain text`);
      responseMode = 'invalid';
      await page.click('.navigator-submit');
      await page.waitForFunction(() => {
        const shell = document.querySelector('[data-portfolio-navigator]');
        return document.querySelector('[data-navigator-status]').textContent === shell.dataset.fallback;
      });
      const fallback = await page.evaluate(() => ({
        hidden: document.querySelector('[data-navigator-answer]').hidden,
        count: document.querySelectorAll('[data-navigator-results] li').length,
        stored: [...Object.keys(localStorage), ...Object.keys(sessionStorage)].some(key => /query|guide|question/.test(key)),
      }));
      if (calls !== 2 || !fallback.hidden || fallback.count !== 3 || fallback.stored) failures.push(`${locale}: malformed provider output did not retain clearly local, private evidence`);
      await page.evaluate(() => window.guideTestHoldToken = true);
      await page.click('.navigator-submit');
      await page.waitForFunction(() => window.guideTestTokens.length === 1);
      await page.click('[data-navigator-close]');
      await page.click('[data-navigator-launch]');
      const cancelled = await page.evaluate(() => ({ busy: document.querySelector('.navigator-form').getAttribute('aria-busy'), disabled: document.querySelector('.navigator-submit').disabled, status: document.querySelector('[data-navigator-status]').textContent, loading: document.querySelector('[data-portfolio-navigator]').dataset.loading }));
      if (cancelled.busy || cancelled.disabled || cancelled.status === cancelled.loading) failures.push(`${locale}: close/reopen retained a false loading state`);
      await page.evaluate(() => { window.guideTestTokens.shift()('test-only-token'); window.guideTestHoldToken = false; });
      await new Promise(resolve => setTimeout(resolve, 100));
      if (calls !== 2) failures.push(`${locale}: a token resolved after cancellation called NVIDIA`);
      responseMode = 'delayed';
      await page.click('.navigator-submit');
      await page.waitForFunction(() => document.querySelector('.navigator-form').getAttribute('aria-busy') === 'true');
      for (let attempt = 0; attempt < 40 && !pendingResponses.length; attempt++) await new Promise(resolve => setTimeout(resolve, 25));
      if (pendingResponses.length !== 1) throw new Error(`${locale}: delayed test response was not intercepted`);
      await page.click('[data-navigator-close]');
      await page.click('[data-navigator-launch]');
      await page.click('[data-guide-intent="research"]');
      await pendingResponses.shift()();
      await new Promise(resolve => setTimeout(resolve, 100));
      const stale = await page.evaluate(() => ({ hidden: document.querySelector('[data-navigator-answer]').hidden, first: document.querySelector('[data-navigator-results] a').dataset.navigatorRecord, status: document.querySelector('[data-navigator-status]').textContent, ready: document.querySelector('[data-portfolio-navigator]').dataset.ready }));
      if (calls !== 3 || !stale.hidden || stale.first !== 'human-grounded-llm-evaluation' || stale.status !== stale.ready) failures.push(`${locale}: cancelled late response replaced the newly selected local path`);
      await page.evaluate(() => window.guideTestHoldToken = true);
      await page.click('.navigator-submit');
      await page.waitForFunction(() => window.guideTestTokens.length === 1);
      await page.click('[data-guide-intent="tools"]');
      await page.evaluate(() => { window.guideTestTokens.shift()('test-only-token'); window.guideTestHoldToken = false; });
      await new Promise(resolve => setTimeout(resolve, 100));
      if (calls !== 3) failures.push(`${locale}: changing intent during token validation sent a stale query`);
      {
        await page.addScriptTag({ content: axe.source });
        for (const theme of ['light', 'dark']) for (const width of [360, 390, 768, 1440]) {
          await page.setViewport({ width, height: width < 768 ? 844 : 1000 });
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await page.evaluate(async () => {
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            await new Promise(resolve => setTimeout(resolve, 300));
          });
          const layout = await page.evaluate(async () => {
            const dialog = document.querySelector('dialog');
            const frame = dialog.querySelector('.navigator-frame');
            const bounds = dialog.getBoundingClientRect();
            const privacy = dialog.querySelector('.navigator-privacy');
            const submit = dialog.querySelector('.navigator-submit');
            const audit = await window.axe.run(dialog, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
            return { overflow: document.documentElement.scrollWidth > innerWidth + 1 || frame.scrollWidth > frame.clientWidth + 1 || bounds.left < -1 || bounds.right > innerWidth + 1,
              privacyFirst: Boolean(privacy.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING),
              violations: audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })) };
          });
          if (layout.overflow || !layout.privacyFirst || layout.violations.length) failures.push(`${locale}/${theme}/${width}: Guide layout/privacy/accessibility ${JSON.stringify(layout)}`);
          if (screenshots) await page.screenshot({ path: `${screenshots}/${locale}-${theme}-${width}.jpg`, type: 'jpeg', quality: 85 });
        }
      }
      await page.keyboard.press('Escape');
      if (await page.$eval('dialog', dialog => dialog.open)) failures.push(`${locale}: Guide Escape did not close`);
      if (!await page.$eval('[data-navigator-launch]', launch => document.activeElement === launch)) failures.push(`${locale}: Guide close did not return focus`);
      await page.close();
    }
  } finally { await context.close(); }
  if (failures.length === initialFailures) console.log('portfolio-guide: bilingual local-first intent, explicit generation, invalid-ID fallback, plain text, privacy, accessibility and focus passed (mock provider)');
}
