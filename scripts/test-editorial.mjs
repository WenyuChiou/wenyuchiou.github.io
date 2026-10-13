import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { CONTENT, PAGE_DEFINITIONS } from '../content.js';

test('both locales keep the same four primary destinations and two application contexts', () => {
  for (const content of Object.values(CONTENT)) {
    assert.deepEqual(content.nav.map(item => item.id), ['work', 'research', 'articles', 'about']);
    assert.equal(content.editorial.contexts.length, 2);
    assert.equal(content.editorial.researchLinks.length, 2);
    assert.equal(content.hero.primary.href, '#selected-work');
    assert.equal(content.hero.secondary.href, '/about/');
    assert.doesNotMatch(JSON.stringify(content.hero), /937|52,141|\bCPT\b/);
    assert.deepEqual(Object.keys(content.editorial.limits), content.flagship.items.map(item => item.slug));
  }
  assert.equal(PAGE_DEFINITIONS.length * 2, 26);
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
  for (const prefix of ['', 'zh/']) {
    const html = readFileSync(`${prefix}about/index.html`, 'utf8');
    assert.match(html, /\/hire\//);
    assert.match(html, /\/publications\//);
    assert.doesNotMatch(html, /\bCPT\b/);
  }
});
