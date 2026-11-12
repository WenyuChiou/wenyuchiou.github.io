import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { GUIDE_INTENTS, GUIDE_COPY, buildReadingPath } from '../portfolio-guide-data.js';
import { NAVIGATOR_INDEX } from '../navigator-data.js';
import { GUIDE_EVIDENCE } from '../guide-evidence.js';
import { requestNvidiaSummary } from '../navigator.js';

const summaryRequest = { endpoint: 'https://worker.example/v1/navigate', query: 'WAGF', locale: 'en', turnstileToken: 'fixture-token' };
const summaryResponse = () => Response.json({ mode: 'nvidia', answer: 'See WAGF.', matches: [{ id: 'wagf', reason: 'Governance evidence.' }] });

test('overall request allows verification and transport overhead beyond the provider deadline', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let signal, complete;
  const pending = requestNvidiaSummary({ ...summaryRequest, fetchImpl: async (_url, init) => {
    signal = init.signal;
    return new Promise(resolve => { complete = resolve; });
  } });
  context.mock.timers.tick(9500);
  const prematurelyAborted = signal.aborted;
  complete(summaryResponse());
  assert.equal((await pending).matches[0].record.id, 'wagf');
  assert.equal(prematurelyAborted, false);
});

test('overall request still aborts at its bounded 15-second deadline', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const pending = requestNvidiaSummary({ ...summaryRequest, fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')), { once: true });
  }) });
  const rejected = assert.rejects(pending, { name: 'AbortError' });
  context.mock.timers.tick(15000);
  await rejected;
});

test('changing context cancels the request immediately despite the overall deadline', async () => {
  const controller = new AbortController();
  const pending = requestNvidiaSummary({ ...summaryRequest, signal: controller.signal, fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true });
  }) });
  const rejected = assert.rejects(pending, { name: 'AbortError' });
  controller.abort();
  await rejected;
});

test('bilingual named-tool entries retain their requested repository as the first local result', () => {
  for (const record of GUIDE_EVIDENCE.filter(item => item.kind === 'tool')) {
    const name = record.id.slice(5);
    for (const locale of ['en', 'zh-TW']) {
      const query = locale === 'en' ? `When should I use ${name}?` : `何時適合使用 ${name}？`;
      assert.equal(buildReadingPath('tools', locale, { query }).matches[0].record.id, record.id, query);
    }
  }
});

test('three bilingual intents are research-centered and use controlled sources', () => {
  assert.deepEqual(GUIDE_INTENTS.map(item => item.id), ['research', 'observatory', 'tools']);
  assert.ok(GUIDE_INTENTS.every(item => !item.href));
  for (const locale of ['en', 'zh-TW']) {
    for (const id of ['research', 'observatory', 'tools']) {
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
