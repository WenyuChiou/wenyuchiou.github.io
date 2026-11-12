import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { CONTENT, PAGE_DEFINITIONS } from '../content.js';
import { NAVIGATOR_INDEX } from '../navigator-data.js';
import { LEGACY_REDIRECTS } from '../seo.js';
import { createRequire } from 'node:module';

const { starTone, irisTone, ratio } = createRequire(import.meta.url)('../home/tiles.cjs');
test('homepage tile colours keep their text at 4.5:1 or better for every star count', () => {
  for (const tone of [starTone, irisTone]) for (let value = 0; value <= 2000; value++) {
    const [background, ink, softInk] = tone(value, 2000);
    assert.ok(ratio(background, ink) >= 4.5 && ratio(background, softInk) >= 4.5, `${value}: ${background} ${ink} ${softInk}`);
  }
});

test('both locales keep three primary destinations and two application contexts', () => {
  for (const content of Object.values(CONTENT)) {
    assert.deepEqual(content.nav.map(item => item.id), ['work', 'research', 'about']);
    assert.equal(content.editorial.contexts.length, 2);
    assert.equal(content.editorial.researchLinks.length, 2);
    assert.equal(content.hero.primary.href, '#selected-work');
    assert.equal(content.hero.secondary.href, '#decision-provenance');
    assert.doesNotMatch(JSON.stringify(content.hero), /937|52,141|\bCPT\b/);
    assert.deepEqual(Object.keys(content.editorial.limits), content.flagship.items.map(item => item.slug));
  }
  assert.equal(PAGE_DEFINITIONS.length * 2, 16);
});

test('the homepage is complete without JavaScript and loads only its own stylesheet and script', () => {
  for (const prefix of ['', 'zh/']) {
    const html = readFileSync(`${prefix}index.html`, 'utf8');
    for (const id of ['research', 'cv', 'projects', 'activity', 'contact']) assert.ok(html.includes(`<section id="${id}">`), `${prefix}index.html: section ${id}`);
    for (const page of ['work/', 'work/floodabm/', 'research/', 'publications/', 'hire/', 'about/']) assert.ok(html.includes(`href="/${prefix}${page}"`), `${prefix}index.html: link to ${page}`);
    assert.ok(html.includes(`href="${prefix ? '/' : '/zh/'}" hreflang=`), 'language switch links to the other homepage');
    assert.match(html, /<link rel="stylesheet" href="\/assets\/home\/home\.css\?v=[a-f0-9]{8}">/);
    assert.match(html, /<script defer src="\/assets\/home\/home\.js\?v=[a-f0-9]{8}"><\/script>/);
    assert.match(html, /rel="preload" href="\/assets\/fonts\/bricolage-grotesque-latin-wght-normal\.woff2" as="font"/);
    assert.doesNotMatch(html, /href="\/(styles|editorial)\.css|interactions\.css|inner\.css/);
    assert.doesNotMatch(html, /class="recruiter-fit-teaser"/);
  }
  for (const page of ['work/', 'zh/work/floodabm/', 'about/']) {
    const html = readFileSync(`${page}index.html`, 'utf8');
    assert.match(html, /href="\/editorial\.css\?v=[a-f0-9]+"/);
    assert.match(html, /href="\/assets\/home\/inner\.css\?v=[a-f0-9]{8}"/);
    assert.doesNotMatch(html, /home\.css|class="theme-button/);
  }
});

test('recruiter and publications destinations remain in the prerendered site', () => {
  assert.doesNotMatch(readFileSync('assets/app.bundle.js', 'utf8'), /\.\.\/features\/editorial\/Timeline\.jsx/);
  for (const prefix of ['', 'zh/']) {
    const html = readFileSync(`${prefix}about/index.html`, 'utf8');
    assert.match(html, /\/hire\//);
    assert.match(html, /\/publications\//);
    assert.doesNotMatch(html, /\bCPT\b/);
  }
});

test('unapproved articles are withdrawn without claiming authorship or breaking old links', () => {
  assert.ok(!NAVIGATOR_INDEX.records.some(record => record.id === 'articles'));
  const sitemap = readFileSync('sitemap.xml', 'utf8');
  assert.doesNotMatch(sitemap, /\/articles\//);
  const withdrawn = Object.entries(LEGACY_REDIRECTS).filter(([path]) => path.includes('/articles/'));
  assert.equal(withdrawn.length, 8);
  for (const [path, target] of withdrawn) {
    const html = readFileSync(`${path.slice(1)}index.html`, 'utf8');
    assert.match(html, /name="robots" content="noindex,follow"/);
    assert.ok(html.includes(`content="0;url=${target}"`));
    assert.doesNotMatch(html, /TechArticle|article-byline|article-body/);
  }
  for (const prefix of ['', 'zh/']) {
    const html = readFileSync(`${prefix}index.html`, 'utf8');
    assert.doesNotMatch(html, /href="[^"]*\/articles\/|In preparation|Research prototype · archived/);
  }
});

test('case introductions explain why, how, and contribution before technical exhibits', () => {
  for (const prefix of ['', 'zh/']) {
    for (const slug of ['human-grounded-llm-evaluation', 'floodabm']) {
      const html = readFileSync(`${prefix}work/${slug}/index.html`, 'utf8');
      const why = html.indexOf('data-case-why');
      const how = html.indexOf('data-case-how');
      const contribution = html.indexOf('data-case-contribution');
      assert.ok(why > 0 && how > why && contribution > how);
      assert.ok(contribution < html.indexOf('id="artifact-title"'));
      assert.doesNotMatch(html, /In preparation|Research prototype · archived|研究原型 · 已封存|撰寫中|準備釋出/);
    }
    const evaluation = readFileSync(`${prefix}work/human-grounded-llm-evaluation/index.html`, 'utf8');
    const visibleCopy = evaluation.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ');
    assert.doesNotMatch(visibleCopy, /\b937\b/);
    assert.match(evaluation, prefix ? /投保意願/ : /willingness to buy insurance/);
    assert.match(evaluation, prefix ? /不代表因果/ : /not causal effects/);
  }
});

test('the WAGF page is taken down: no route, no sitemap entry, its old address and the old article redirect to the Research stage, no built page links to it', () => {
  assert.ok(!PAGE_DEFINITIONS.some(page => page.id === 'case:wagf' || page.path.includes('wagf')), 'case:wagf route must not exist');
  for (const content of Object.values(CONTENT)) assert.ok(!content.flagship.items.some(item => item.slug === 'wagf'));
  const sitemap = readFileSync('sitemap.xml', 'utf8');
  assert.ok(!sitemap.includes('/work/wagf/'));
  for (const prefix of ['', 'zh/']) {
    const stub = readFileSync(`${prefix}work/wagf/index.html`, 'utf8');
    assert.match(stub, /<meta name="robots" content="noindex,follow">/);
    assert.ok(!stub.includes('id="root"') && !stub.includes('app.bundle'), 'the old address must be a redirect stub, not a page');
  }
  for (const [from, to] of [
    ['/work/wagf/', '/research/#observatory-stage-governance-repair'],
    ['/zh/work/wagf/', '/zh/research/#observatory-stage-governance-repair'],
    ['/articles/why-governed-agents-need-validators-before-state-changes/', '/research/#observatory-stage-governance-repair'],
    ['/zh/articles/why-governed-agents-need-validators-before-state-changes/', '/zh/research/#observatory-stage-governance-repair']
  ]) {
    assert.equal(LEGACY_REDIRECTS[from], to);
    assert.ok(readFileSync(`${from.slice(1)}index.html`, 'utf8').includes(`url=${to}"`));
  }
  const offenders = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', '.git', '.ai', 'worker'].includes(entry.name)) continue;
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html' && readFileSync(full, 'utf8').includes('work/wagf')) offenders.push(full);
    }
  };
  walk('.');
  assert.deepEqual(offenders, []);
});
