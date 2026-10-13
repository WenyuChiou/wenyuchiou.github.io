import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { GUIDE_INTENTS, GUIDE_COPY, buildReadingPath } from '../portfolio-guide-data.js';
import { NAVIGATOR_INDEX } from '../navigator-data.js';

test('three bilingual intents use controlled reading paths and the existing recruiter tool', () => {
  assert.deepEqual(GUIDE_INTENTS.map(item => item.id), ['research', 'tools', 'collaboration']);
  assert.equal(GUIDE_INTENTS[2].href, '/hire/#fit-explorer');
  for (const locale of ['en', 'zh-TW']) {
    for (const id of ['research', 'tools']) {
      const path = buildReadingPath(id, locale);
      assert.equal(path.matches.length, 3);
      assert.ok(path.intro.length > 20);
      for (const match of path.matches) {
        assert.ok(NAVIGATOR_INDEX.records.includes(match.record));
        assert.ok(match.record.title[locale] && match.reason);
      }
    }
    assert.ok(GUIDE_COPY[locale].privacy.includes('NVIDIA'));
    assert.ok(GUIDE_COPY[locale].fallback);
  }
  assert.deepEqual(Object.keys(GUIDE_COPY.en), Object.keys(GUIDE_COPY['zh-TW']));
});

test('reading paths reject unsupported intents instead of interpreting arbitrary content', () => {
  for (const id of ['', 'collaboration', '__proto__', '<script>alert(1)</script>']) {
    assert.throws(() => buildReadingPath(id), /Unknown reading path/);
  }
  assert.deepEqual(buildReadingPath('research', 'unsupported'), buildReadingPath('research', 'en'));
});

test('curated social display does not mislabel a snapshot check as a post publication date', () => {
  const updates = JSON.parse(readFileSync('data/updates.json', 'utf8'));
  const posts = updates.items.filter(item => item.type.en === 'LinkedIn');
  assert.ok(posts.length >= 1 && posts.length <= 3);
  assert.ok(posts.every(item => /^https:\/\/www\.linkedin\.com\/(?:posts\/|feed\/update\/urn:li:activity:)/.test(item.url)));
  assert.equal(new Set(posts.map(item => item.url)).size, posts.length);
  assert.ok(posts.every(item => item.title.en && item.title['zh-TW'] && item.summary.en && item.summary['zh-TW']));
  const app = readFileSync('app.jsx', 'utf8');
  assert.doesNotMatch(app, /dateTime=\{updatesData\.checkedAt\}/);
});
