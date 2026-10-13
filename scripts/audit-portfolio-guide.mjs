import { DEPLOYMENT_CONFIG } from '../deployment-config.mjs';
import axe from 'axe-core';

export async function auditPortfolioGuide(browser, origin, failures, { screenshots } = {}) {
  const startFailures = failures.length;
  const context = await browser.createBrowserContext();
  try {
    for (const locale of ['en', 'zh-TW']) {
      const page = await context.newPage();
      await page.setBypassCSP(true);
      await page.setViewport({ width: 390, height: 844 });
      let calls = 0;
      let responseMode = 'success';
      const pending = [];
      await page.evaluateOnNewDocument(() => {
        window.guideTestTokens = [];
        window.turnstile = { render(element, options) {
          const widget = document.createElement('div');
          widget.style.height = '70px'; widget.textContent = 'Test-only verification'; element.append(widget);
          if (window.guideHoldToken) window.guideTestTokens.push(options.callback);
          else setTimeout(() => options.callback('test-only-token'), 5);
          return 'test-widget';
        }, remove() {} };
      });
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url() === DEPLOYMENT_CONFIG.aiEndpoint) {
          if (request.method() === 'OPTIONS') return void request.respond({ status: 204, headers: { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'Content-Type' } });
          calls++;
          const body = JSON.parse(request.postData());
          const id = body.task === 'tools' ? 'repo-research-hub' : body.task === 'observatory' ? { evaluation: 'human-grounded-llm-evaluation', governance: 'wagf', simulation: 'floodabm' }[body.context?.lens] : 'wagf';
          const payload = { mode: 'nvidia', answer: 'Test-only model explanation', matches: [{ id: responseMode === 'invalid' ? 'invented' : id, reason: 'A source relevant to this request.' }], sections: ['why', 'how', 'contribution'].map(kind => ({ kind, text: locale === 'en' ? 'Test-only generated explanation with a verifiable source.' : '測試用生成講解，附上可核對來源。', evidenceIds: [id] })), suggestedView: body.task === 'observatory' ? { lens: 'simulation', stage: 'consequence' } : null };
          const respond = () => request.respond({ status: 200, headers: { 'access-control-allow-origin': origin, 'content-type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
          if (responseMode === 'delayed') { pending.push(respond); return; }
          return void respond();
        }
        if (/huggingface|hf\.co|transformers-4\.2\.0|challenges\.cloudflare/.test(request.url())) return void request.abort();
        void request.continue();
      });
      await page.goto(`${origin}${locale === 'en' ? '/' : '/zh/'}`, { waitUntil: 'networkidle0' });
      await page.click('[data-navigator-launch]');
      await page.waitForSelector('[data-navigator-results] li');
      await page.click('[data-guide-intent="tools"]');
      if (calls || await page.$eval('[data-navigator-results] a', element => element.dataset.navigatorRecord) !== 'repo-ai-research-skills') failures.push(`${locale}: local tool entry called a model or displayed a non-repository`);
      await page.$eval('#navigator-query', input => { input.value = 'research runtime private-guide-marker'; input.dispatchEvent(new Event('input', { bubbles: true })); });
      if (calls) failures.push(`${locale}: typing called the model`);
      await page.click('.navigator-submit');
      await page.waitForSelector('[data-guide-sections]:not([hidden])');
      if (calls !== 1 || await page.$$eval('[data-guide-sections] section', elements => elements.length) !== 3) failures.push(`${locale}: generated three-part explanation missing`);
      if (await page.$eval('[data-navigator-results] a', element => element.dataset.navigatorRecord) !== 'repo-research-hub') failures.push(`${locale}: generated tool recommendation missing`);
      await page.click('[data-navigator-results] summary');
      if (!await page.$('[data-navigator-results] details[open]')) failures.push(`${locale}: evidence boundaries cannot be disclosed`);
      responseMode = 'invalid';
      await page.click('.navigator-submit');
      try { await page.waitForFunction(() => document.querySelector('[data-navigator-status]').textContent === document.querySelector('[data-portfolio-navigator]').dataset.fallback); }
      catch (error) { console.log('GUIDE_DIAGNOSTIC', { locale, calls, state: await page.evaluate(() => ({ status: document.querySelector('[data-navigator-status]').textContent, mode: document.querySelector('[data-navigator-mode]').textContent, busy: document.querySelector('.navigator-form').getAttribute('aria-busy') })) }); throw error; }
      if (calls !== 2 || !await page.$eval('[data-guide-sections]', element => element.hidden)) failures.push(`${locale}: invalid result did not stay local`);
      const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }).includes('private-guide-marker'));
      if (stored) failures.push(`${locale}: guide question persisted`);
      await page.evaluate(() => window.guideHoldToken = true);
      await page.click('.navigator-submit');
      await page.waitForFunction(() => window.guideTestTokens.length === 1);
      await page.click('[data-navigator-close]');
      await page.click('[data-navigator-launch]');
      await page.evaluate(() => { window.guideTestTokens.shift()('obsolete'); window.guideHoldToken = false; });
      if (calls !== 2 || await page.$eval('.navigator-submit', element => element.disabled)) failures.push(`${locale}: obsolete challenge contaminated a reopened guide`);
      responseMode = 'delayed';
      await page.click('.navigator-submit');
      for (let attempt = 0; attempt < 50 && !pending.length; attempt++) await new Promise(resolve => setTimeout(resolve, 20));
      if (!pending.length) throw new Error('Delayed provider fixture did not start');
      await page.click('[data-guide-depth="method"]');
      await pending.shift()();
      if (!await page.$eval('[data-guide-sections]', element => element.hidden)) failures.push(`${locale}: stale answer survived a depth change`);
      responseMode = 'success';
      await page.click('[data-guide-intent="observatory"]');
      await page.waitForSelector('[data-provenance-island][data-ready="true"]');
      await page.click('.navigator-submit');
      await page.waitForSelector('[data-guide-view]:not([hidden])');
      const before = await page.$eval('.provenance-workbench', element => ({ lens: element.dataset.lens, stage: element.dataset.guideStage, repaired: element.dataset.guideRepaired }));
      if (before.lens !== 'evaluation' || before.repaired !== 'false') failures.push(`${locale}: generation changed the scene before approval`);
      await page.click('[data-guide-view]');
      await page.waitForFunction(() => document.querySelector('.provenance-workbench').dataset.lens === 'simulation' && document.querySelector('.provenance-workbench').dataset.guideStage === 'consequence');
      if (await page.$eval('.provenance-workbench', element => element.dataset.guideRepaired) !== 'false') failures.push(`${locale}: view suggestion executed a repair`);
      await page.click('[data-guide-open="observatory"]');
      await page.waitForSelector('dialog[open]');
      if (!(await page.$eval('[data-guide-context]', element => element.textContent)).length) failures.push(`${locale}: scene context missing`);
      await page.click('[data-guide-intent="research"]');
      await page.click('.navigator-submit');
      await page.waitForSelector('[data-guide-sections]:not([hidden])');
      await page.addScriptTag({ content: axe.source });
      for (const theme of ['light', 'dark']) for (const width of [360, 390, 768, 1440]) {
        await page.setViewport({ width, height: width >= 768 ? 1000 : 844 });
        await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
        await page.$eval('.navigator-frame', element => { element.scrollTop = 0; });
        await new Promise(resolve => setTimeout(resolve, 300));
        const sizes = await page.evaluate(() => {
          const dialog = document.querySelector('dialog[open]');
          return { overflow: dialog.scrollWidth > dialog.clientWidth + 1, body: Number.parseFloat(getComputedStyle(document.querySelector('[data-guide-sections] p')).fontSize), targets: [...dialog.querySelectorAll('button')].filter(element => element.getClientRects().length).some(element => element.getBoundingClientRect().height < 44) };
        });
        if (sizes.overflow || sizes.body < 16 || sizes.targets) failures.push(`${locale}/${theme}/${width}: guide overflow, text or tap target sizing`);
        const result = await page.evaluate(async () => window.axe.run(document.querySelector('dialog[open]'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
        for (const violation of result.violations) failures.push(`${locale}/${theme}/${width}: Guide axe ${violation.id}: ${violation.nodes.map(node => `${node.target.join(' ')} ${node.failureSummary}`).join('; ')}`);
        if (screenshots) await page.screenshot({ path: `${screenshots}/${locale}-${theme}-${width}.jpg`, type: 'jpeg', quality: 85 });
      }
      await page.keyboard.press('Escape');
      if (await page.$eval('dialog', element => element.open)) failures.push(`${locale}: Escape did not close Guide`);
      await page.close();
    }
  } finally { await context.close(); }
  if (failures.length === startFailures) console.log('portfolio-guide: bilingual 3-task/local-first/citation/context/cancellation/keyboard/16-view matrix passed; provider and Turnstile explicitly mocked');
}
