import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { CONTENT, PAGE_DEFINITIONS } from '../content.js';
import { NAVIGATOR_INDEX } from '../navigator-data.js';
import { LEGACY_REDIRECTS } from '../seo.js';
import { linkedInEmbedSource } from '../features/editorial/linkedin.js';

test('both locales keep three primary destinations and two application contexts', () => {
  for (const content of Object.values(CONTENT)) {
    assert.deepEqual(content.nav.map(item => item.id), ['work', 'research', 'about']);
    assert.equal(content.editorial.contexts.length, 2);
    assert.equal(content.editorial.researchLinks.length, 2);
    assert.equal(content.hero.primary.href, '#selected-work');
    assert.equal(content.hero.secondary.href, '/about/');
    assert.doesNotMatch(JSON.stringify(content.hero), /937|52,141|\bCPT\b/);
    assert.deepEqual(Object.keys(content.editorial.limits), content.flagship.items.map(item => item.slug));
  }
  assert.equal(PAGE_DEFINITIONS.length * 2, 18);
});

test('only the verified featured post can supply a LinkedIn embed and no frame is prerendered', () => {
  const posts = JSON.parse(readFileSync('data/updates.json', 'utf8')).items;
  const featured = posts.filter(post => post.embedUrl);
  assert.equal(featured.length, 1);
  const source = 'https://www.linkedin.com/embed/feed/update/urn:li:share:7496270988519735296';
  assert.equal(featured[0].url, 'https://www.linkedin.com/feed/update/urn:li:activity:7496271834011734016/');
  assert.equal(linkedInEmbedSource(featured[0].embedUrl), source);
  for (const value of [null, {}, 42, 'javascript:alert(1)', source.replace('https:', 'http:'), source.replace('www.linkedin.com', 'www.linkedin.com.evil.test'), source.replace('/embed/', '/feed/'), source + '?url=evil', source + '#hash', source.replace('https://', 'https://user@'), 'x'.repeat(161)]) {
    assert.equal(linkedInEmbedSource(value), null);
  }
  const previewKeys = ['previewOriginal', 'previewClose', 'previewTitle', 'previewPrivacy', 'previewLoading', 'previewSlow', 'previewFallback', 'previewNoScript'];
  for (const prefix of ['', 'zh/']) {
    const html = readFileSync(`${prefix}index.html`, 'utf8');
    const copy = CONTENT[prefix ? 'zh-TW' : 'en'].editorial;
    for (const key of previewKeys) assert.ok(copy[key]?.trim(), key);
    assert.equal((html.match(/class="linkedin-preview"/g) || []).length, 1);
    assert.doesNotMatch(html, /<iframe/);
    assert.ok(html.includes(copy.previewOriginal));
    assert.ok(html.includes(copy.previewNoScript));
    const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
    assert.match(csp, /frame-src https:\/\/challenges.cloudflare.com https:\/\/www.linkedin.com\/embed\//);
    assert.doesNotMatch(csp, /https:\/\/\*\.linkedin.com/);
    const about = readFileSync(`${prefix}about/index.html`, 'utf8');
    const aboutCsp = about.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
    assert.doesNotMatch(aboutCsp, /linkedin.com/);
  }
});

test('prerendered first screen and visible evidence links do not depend on JavaScript', () => {
  for (const prefix of ['', 'zh/']) {
    const html = readFileSync(`${prefix}index.html`, 'utf8');
    assert.match(html, /href="#selected-work"/);
    assert.match(html, /class="application-contexts"/);
    assert.equal((html.match(/class="flagship-record /g) || []).length, 3);
    assert.equal((html.match(/class="text-link flagship-case-link"/g) || []).length, 3);
    assert.doesNotMatch(html, /class="recruiter-fit-teaser"/);
    assert.match(html, /href="\/editorial\.css\?v=[a-f0-9]+"/);
    assert.match(html, /rel="preload" href="\/assets\/agu2025-photo-tablet.webp" as="image"/);
    assert.doesNotMatch(html, /\/assets\/agu2025-photo\.webp/);
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
    assert.equal((html.match(/class="curated-note"/g) || []).length, 3);
    const posts = JSON.parse(readFileSync('data/updates.json', 'utf8')).items.filter(item => item.type.en === 'LinkedIn');
    assert.equal(posts.length, 3);
    for (const post of posts) assert.ok(html.includes(`href="${post.url}"`));
  }
});

test('case introductions explain why, how, and contribution before technical exhibits', () => {
  for (const prefix of ['', 'zh/']) {
    for (const slug of ['human-grounded-llm-evaluation', 'floodabm', 'wagf']) {
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
