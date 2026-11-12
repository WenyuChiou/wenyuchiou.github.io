import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const tempRoot = mkdtempSync(join(tmpdir(), 'editorial-interactions-'));
const bundlePath = join(tempRoot, 'ssr.cjs');
buildSync({
  stdin: {
    contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { EN } from './content.en.js';
      import { ZH_TW } from './content.zh-TW.js';
      import { Timeline } from './features/editorial/Timeline.jsx';
      import { DecisionObservatory } from './features/provenance/signature.jsx';
      export { EN, ZH_TW };
      export const renderTimeline = (content, locale) => renderToStaticMarkup(React.createElement(Timeline, { content, locale }));
      export const renderTwoTimelines = content => renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(Timeline, { content, locale: 'en' }), React.createElement(Timeline, { content, locale: 'en' })));
      export const renderSignatures = () => { const noop = () => {}; return renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(DecisionObservatory, { locale: 'en', lens: 'evaluation', stage: 0, selectLens: noop, selectStage: noop, motion: true }), React.createElement(DecisionObservatory, { locale: 'zh-TW', lens: 'simulation', stage: 0, selectLens: noop, selectStage: noop, motion: false }))); };
    `,
    resolveDir: process.cwd(),
    sourcefile: 'editorial-interactions-ssr.jsx',
    loader: 'jsx',
  },
  bundle: true,
  format: 'cjs',
  platform: 'node',
  outfile: bundlePath,
  logLevel: 'silent',
});
const { EN, ZH_TW, renderTimeline, renderTwoTimelines, renderSignatures } = createRequire(import.meta.url)(bundlePath);
process.once('exit', () => rmSync(tempRoot, { recursive: true, force: true }));

const ids = html => [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);

test('timeline SSR preserves all three verified milestones in both locales', () => {
  for (const [locale, content] of [['en', EN], ['zh-TW', ZH_TW]]) {
    const html = renderTimeline(content, locale);
    assert.equal((html.match(/data-timeline-item/g) ?? []).length, 3);
    for (const item of content.aboutPage.trajectory) {
      assert.ok(html.includes(item.year));
      assert.ok(html.includes(item.text));
    }
    assert.equal((html.match(/<details/g) ?? []).length, 3);
    assert.equal((html.match(/<details open=""/g) ?? []).length, 1);
    assert.match(html, new RegExp(`<details open="">[\\s\\S]*${content.aboutPage.trajectory.at(-1).year}`));
  }
});

test('timeline instances scope IDs and retain native disclosure fallback', () => {
  const html = renderTwoTimelines(EN);
  const allIds = ids(html);
  assert.equal(new Set(allIds).size, allIds.length);
  for (const target of [...html.matchAll(/aria-controls="([^"]+)"/g)].map(match => match[1])) assert.ok(allIds.includes(target));
  assert.equal((html.match(/<summary/g) ?? []).length, 6);

  const initializer = readFileSync('features/editorial/timeline.js', 'utf8');
  assert.match(initializer, /new WeakMap\(\)/);
  assert.match(initializer, /setTimeout\(\(\) => render\(index\), 200\)/);
  assert.match(initializer, /pagehide/);
  assert.match(initializer, /event\.key === 'Escape'/);
});

test('Decision Observatory is bilingual, scoped, and view-only', () => {
  const html = renderSignatures();
  const allIds = ids(html);
  assert.equal(new Set(allIds).size, allIds.length);
  for (const expected of ['Decision Observatory', 'Measured evidence', 'Evidence notebook', 'Literature + source', '決策觀測站', '實測證據', '證據筆記', '文獻＋來源']) assert.ok(html.includes(expected));
  assert.equal((html.match(/data-observatory-view=/g) ?? []).length, 6);
  assert.ok(html.includes('data-motion="running"'));
  assert.ok(html.includes('data-motion="paused"'));

  const source = readFileSync('features/provenance/signature.jsx', 'utf8');
  assert.ok(!source.includes('applyProposal'));
  assert.ok(!source.includes('repair('));
  assert.ok(!html.includes('Repair and revalidate'));
  assert.ok(!html.includes('修正並重新驗證'));
});
