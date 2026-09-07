import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import axe from 'axe-core';

const base = process.env.PROVENANCE_BASE || 'http://127.0.0.1:4188';
const out = path.resolve(process.env.PROVENANCE_OUT || 'outputs/provenance-audit');
fs.mkdirSync(out, { recursive: true });
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(file => file && fs.existsSync(file));
const browser = await puppeteer.launch({ executablePath, headless: true });
const results = [];
const errors = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const click = async (page, selector) => { await page.$eval(selector, node => node.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.click(selector); await pause(60); };
const get = (page, selector) => page.$eval(selector, node => node.textContent.trim());
const activate = async page => {
  await page.$eval('[data-provenance-island]', node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForSelector('[data-provenance-island][data-ready="true"]');
  await page.evaluate(() => document.fonts.ready);
};
const pixelDifference = async (a,b) => {
  const aa = await sharp(a).ensureAlpha().raw().toBuffer();
  const bb = await sharp(b).ensureAlpha().raw().toBuffer();
  assert.equal(aa.length,bb.length);
  let different=0; for(let i=0;i<aa.length;i+=4) if(Math.abs(aa[i]-bb[i])+Math.abs(aa[i+1]-bb[i+1])+Math.abs(aa[i+2]-bb[i+2])>12) different++;
  return different;
};

try {
  for (const locale of ['en','zh-TW']) for(const theme of ['light','dark']) for(const width of [360,390,768,1440]) {
    const name = `${locale}-${theme}-${width}`;
    if(process.env.PROVENANCE_CASE && !process.env.PROVENANCE_CASE.split(',').includes(name)) continue;
    const page = await browser.newPage();
    try {
      const runtimeErrors=[];
      page.on('pageerror', error => runtimeErrors.push(error.message));
      const requests=[]; page.on('request', request => requests.push(request.url()));
      await page.setViewport({width,height:1000,deviceScaleFactor:1});
      await page.evaluateOnNewDocument(value => localStorage.setItem('wy-theme',value),theme);
      await page.goto(base+(locale==='en'?'/':'/zh/'),{waitUntil:'networkidle0'});
      await pause(1300);
      assert.ok(!requests.some(url=>/assets\/provenance\/.*\.js/.test(url)),'Workbench JS must not load at top of home');
      await activate(page);
      assert.equal(await page.$('[data-provenance-scene]'),null,'Home has no second animated scene');
      for(const lens of ['evaluation','governance','simulation']) {
        await click(page,`[data-provenance-lens="${lens}"]`);
        await click(page,'[data-provenance-stage="4"]');
        const destination=await page.$eval('[data-provenance-case]',node=>node.href);
        assert.ok(destination.endsWith(`#trace=${lens}&stage=validation`));
        const textOverflow=await page.$eval('.provenance-workbench',root=>[...root.querySelectorAll('p,dd,strong')].filter(node=>node.clientWidth>0&&!node.closest('.sr-only,.pw-static-flow')).some(node=>node.scrollWidth>node.clientWidth+1));
        assert.equal(textOverflow,false,`${name}: compact text overflow`);
      }
      await (await page.$('.provenance-workbench')).screenshot({path:path.join(out,`${name}-home.png`)});
      await click(page,'[data-provenance-case]');
      await page.waitForSelector('[data-provenance-island][data-ready="true"]');
      await pause(150);
      assert.equal(await page.$eval('.provenance-workbench',node=>node.dataset.lens),'simulation');
      assert.equal(await page.$eval('[data-provenance-stage="4"]',node=>node.getAttribute('aria-current')),'step');
      const destinationTop=await page.$eval('[data-provenance-island]',node=>node.getBoundingClientRect().top);
      assert.ok(destinationTop>=0 && destinationTop<200,'Deep link scrolls to the case interaction');
      const prefix=locale==='en'?'':'/zh';
      for(const [slug,lens] of [['human-grounded-llm-evaluation','evaluation'],['wagf','governance'],['floodabm','simulation']]) {
        await page.goto(`${base}${prefix}/work/${slug}/`,{waitUntil:'networkidle0'});
        await activate(page);
        assert.equal(await page.$eval('.provenance-workbench',node=>node.dataset.lens),lens,'Case defaults to its own lens');
        assert.equal(await page.$eval('.case-research-context',node=>node.open),false);
      }
      for(const lens of ['evaluation','governance','simulation']) {
        await click(page,`[data-provenance-lens="${lens}"]`);
        await click(page,'[data-scene-play]');
        const bounds=await page.$eval('.provenance-workbench', root=>{
          const visible=node=>{const r=node.getBoundingClientRect();return r.width>0&&r.height>0&&!node.closest('.pw-static-flow,.sr-only');};
          const small=[...root.querySelectorAll('button')].filter(visible).filter(node=>{const r=node.getBoundingClientRect();return r.width<43.9||r.height<43.9;}).map(node=>node.textContent||node.getAttribute('aria-label'));
          const overflow=[...root.querySelectorAll('button,strong,p,dd,th,td')].filter(visible).filter(node=>node.scrollWidth>node.clientWidth+1).map(node=>node.textContent.slice(0,60));
          return { overflow, small, pageOverflow:document.documentElement.scrollWidth-innerWidth, words:[...root.querySelectorAll('.pw-stages strong')].map(node=>getComputedStyle(node).wordBreak), svgText:root.querySelectorAll('svg text').length, staticHidden:getComputedStyle(root.querySelector('.pw-static-flow')).display==='none' };
        });
        assert.deepEqual(bounds.small,[],`${name}/${lens}: targets`);
        assert.deepEqual(bounds.overflow,[],`${name}/${lens}: text overflow`);
        assert.ok(bounds.pageOverflow<=1,`${name}/${lens}: horizontal overflow`);
        assert.equal(bounds.svgText,0);
        assert.ok(bounds.staticHidden);
        await page.$eval('.pw-lenses',node=>node.scrollIntoView({block:'start',behavior:'instant'}));
        const element=await page.$('.provenance-workbench');
        await element.screenshot({path:path.join(out,`${name}-${lens}.png`)});
        if(lens==='evaluation') {
          for(const mode of ['direction','groups','repeats']) { await click(page,`[data-comparison-mode="${mode}"]`); assert.equal(await page.$eval(`[data-comparison-mode="${mode}"]`,node=>node.getAttribute('aria-pressed')),'true'); }
          await click(page,'[data-record="B3"]'); assert.match(await get(page,'[data-paired-record]'),/B3/);
        }
        if(lens==='governance') {
          await click(page,'[data-provenance-stage="5"]'); assert.equal(await get(page,'[data-state-resources]'),'6');
          const checks=await page.$$eval('.pv-validator [data-check]',nodes=>nodes.map(node=>node.dataset.check)); assert.deepEqual(checks,['true','true','false']);
          await page.focus('[data-provenance-repair]'); await page.keyboard.press('Enter'); await pause(80);
          assert.equal(await get(page,'[data-state-resources]'),'4');
          assert.ok(await page.$eval('[data-provenance-repair]',node=>node.disabled));
          await click(page,'[data-scene-reset]'); assert.equal(await get(page,'[data-state-resources]'),'6');
        }
        if(lens==='simulation') {
          await click(page,'[data-tenure="renter"]'); await click(page,'[data-provenance-stage="3"]');
          assert.equal(await get(page,'[data-provenance-title]'),locale==='en'?'Agent decision':'代理決策');
          const river=await page.$eval('.pv-water',node=>node.getAttribute('d'));
          await click(page,'[data-provenance-stage="5"]'); assert.equal(await get(page,'[data-hazard]'),'3'+(locale==='en'?'Unchanged by household action':'不受住戶行動影響'));
          assert.equal(await get(page,'[data-simulation-resources]'),'5');
          assert.equal(await page.$eval('.pv-water',node=>node.getAttribute('d')),river);
        }
        // Pause state is independent of lens and reset; return to running explicitly.
        const paused=await page.$eval('[data-scene-play]',node=>node.getAttribute('aria-pressed')==='true');
        if(paused)await click(page,'[data-scene-play]');
      }
      await page.focus('[data-provenance-lens="simulation"]'); await page.keyboard.press('Home');
      assert.equal(await page.$eval('[data-provenance-lens="evaluation"]',node=>node.getAttribute('aria-selected')),'true');
      await page.focus('[data-provenance-stage="1"]'); await page.keyboard.press('End');
      assert.equal(await page.$eval('[data-provenance-stage="5"]',node=>node.getAttribute('aria-current')),'step');
      await page.$eval('[data-provenance-scene]',node=>node.scrollIntoView({block:'center',behavior:'instant'}));
      // DevTools evaluates axe without changing the site's CSP policy.
      const client=await page.createCDPSession();
      await client.send('Runtime.evaluate',{expression:axe.source});
      const accessibility=await page.evaluate(()=>axe.run(document.querySelector('.provenance-workbench'),{resultTypes:['violations']}));
      assert.deepEqual(accessibility.violations.map(v=>v.id),[],`${name}: axe`);
      assert.deepEqual(runtimeErrors,[],`${name}: runtime errors`);
      results.push({name,views:4,layout:'pass',interactions:'pass',axe:'pass'});
      console.log(`${name}: PASS`);
    } catch(error) { errors.push(`${name}: ${error.message}`); console.error(errors.at(-1)); }
    finally { await page.close(); }
  }

  const page=await browser.newPage(); await page.setViewport({width:1440,height:1000});
  await page.goto(base+'/work/floodabm/#trace=simulation&stage=consequence',{waitUntil:'networkidle0'}); await activate(page);
  assert.equal(await page.$eval('[data-provenance-lens="simulation"]',node=>node.getAttribute('aria-selected')),'true');
  assert.equal(await page.$eval('[data-provenance-stage="5"]',node=>node.getAttribute('aria-current')),'step');
  await page.$eval('.pw-scene',node=>node.scrollIntoView({block:'center',behavior:'instant'})); await pause(200);
  assert.equal(await page.$eval('.provenance-workbench',node=>node.dataset.running),'true');
  const scene=await page.$('.pw-art-row');
  const frame1=await scene.screenshot(); await pause(450); const frame2=await scene.screenshot();
  const motionPixels=await pixelDifference(frame1,frame2); assert.ok(motionPixels>30,`Scene motion ${motionPixels}`);
  await click(page,'[data-scene-play]'); await page.$eval('.pw-scene',node=>node.scrollIntoView({block:'center',behavior:'instant'}));
  const still1=await scene.screenshot(); await pause(400); const still2=await scene.screenshot();
  assert.equal(await pixelDifference(still1,still2),0,'Manual pause pixels');
  await page.evaluate(()=>scrollTo(0,0)); await pause(150); await page.$eval('.pw-scene',node=>node.scrollIntoView({block:'center',behavior:'instant'})); await pause(150);
  assert.equal(await page.$eval('.provenance-workbench',node=>node.dataset.running),'false','Manual pause survives re-entry');
  await click(page,'[data-scene-play]'); await page.evaluate(()=>scrollTo(0,0)); await pause(200);
  assert.equal(await page.$eval('.provenance-workbench',node=>node.dataset.running),'false','Offscreen stopped');
  await page.$eval('.pw-scene',node=>node.scrollIntoView({block:'center',behavior:'instant'})); await pause(200);
  const other=await browser.newPage(); await other.bringToFront(); await pause(200);
  assert.equal(await page.$eval('.provenance-workbench',node=>node.dataset.running),'false','Background tab stopped');
  await other.close(); await page.bringToFront(); await pause(100);
  const loopCapture=async time=>{await page.evaluate(time=>{for(const animation of document.querySelector('.pw-art-row').getAnimations({subtree:true})){animation.pause(); animation.currentTime=time;}},time);return scene.screenshot();};
  const loopA=await loopCapture(0),loopB=await loopCapture(9600);
  const loopPixels=await pixelDifference(loopA,loopB);assert.ok(loopPixels<10,`Loop endpoint difference ${loopPixels}`);
  results.push({motionPixels,loopPixels,pause:'pass',offscreen:'pass',background:'pass',hash:'pass'});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await pause(100);
  assert.equal(await page.$eval('.provenance-workbench',node=>node.getAnimations({subtree:true}).length),0);
  await click(page,'[data-provenance-lens="governance"]'); await click(page,'[data-provenance-repair]'); assert.equal(await get(page,'[data-state-resources]'),'4');
  await page.close();
  const failure=await browser.newPage();
  await failure.setRequestInterception(true);
  failure.on('request',request=>/assets\/provenance\/.*\.js/.test(request.url())?request.abort():request.continue());
  await failure.goto(base+'/',{waitUntil:'networkidle0'});
  await failure.$eval('[data-provenance-island]',node=>node.scrollIntoView({block:'start',behavior:'instant'}));
  await failure.waitForSelector('[data-provenance-island][data-failed="true"]');
  assert.ok(await failure.$eval('.pw-static-flow',node=>getComputedStyle(node).display!=='none'));
  assert.equal(await failure.$$eval('.pw-static-flow li',nodes=>nodes.length),15);
  await failure.close();
  results.push({deferredLoadFailure:'static flow preserved',reducedMotion:'pass'});
  for(const locale of ['en','zh-TW']) {
    const staticPage=await browser.newPage();await staticPage.setJavaScriptEnabled(false);await staticPage.setViewport({width:360,height:800});
    await staticPage.goto(base+(locale==='en'?'/':'/zh/'),{waitUntil:'load'});
    assert.equal(await staticPage.$$eval('.pw-static-flow section',nodes=>nodes.length),3);
    assert.equal(await staticPage.$$eval('.pw-static-flow li',nodes=>nodes.length),15);
    assert.ok(await staticPage.$eval('.pw-static-flow',node=>getComputedStyle(node).display!=='none'));
    await staticPage.close();
  }
} catch(error) { errors.push(error.stack); }
finally { await browser.close(); }
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));
if(errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`provenance-audit: ${results.reduce((sum,result)=>sum+(result.views||0),0)} views, state invariants, keyboard, no-JS, reduced motion, and animation pixels PASS`);
