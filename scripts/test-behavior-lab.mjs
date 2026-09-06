import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { transformSync } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SCENARIO_IDS, LENS_IDS, FIXTURES, getComparison, selectState } from "../features/behavior-lab/data.js";
import { getLabels } from "../features/behavior-lab/content.js";

test("fixtures contain exactly eight literal binary records and three repeats", () => {
  assert.deepEqual(SCENARIO_IDS, ["direction", "groups", "repeats"]);
  assert.deepEqual(LENS_IDS, SCENARIO_IDS);
  for (const fixture of Object.values(FIXTURES)) {
    assert.equal(fixture.version, "behavior-lab-v1");
    assert.equal(fixture.evidenceKind, "synthetic");
    assert.equal(fixture.records.length, 8);
    assert.equal(new Set(fixture.records.map(({ id }) => id)).size, 8);
    for (const group of ["A", "B"]) {
      const records = fixture.records.filter((record) => record.group === group);
      assert.deepEqual(records.map(({ efficacy }) => efficacy), ["low", "low", "high", "high"]);
      for (const record of records) {
        assert.equal(record.runs.length, 3);
        assert.ok([record.reference, ...record.runs].every((value) => value === 0 || value === 1));
      }
    }
    assert.ok(Object.isFrozen(fixture.records[0].runs));
  }
});

test("direction fixture reverses every reference choice on every run", () => {
  const records = FIXTURES.direction.records;
  assert.deepEqual(records.map(({ reference }) => reference), [0, 0, 1, 1, 0, 0, 1, 1]);
  records.forEach((record) => assert.deepEqual(record.runs, Array(3).fill(1 - record.reference)));
  const view = getComparison("direction", "direction");
  assert.deepEqual(view.rows.map(({ reference, model }) => [reference, model]), [[0, [4, 4, 4]], [4, [0, 0, 0]]]);
  assert.deepEqual(view.mismatches, [8, 8, 8]);
});

test("aggregate agreement hides the exact group swap", () => {
  assert.deepEqual(FIXTURES.groups.records.map(({ reference }) => reference), [1, 1, 1, 0, 1, 0, 0, 0]);
  for (let run = 0; run < 3; run++) {
    assert.deepEqual(FIXTURES.groups.records.map((record) => record.runs[run]), [1, 0, 0, 0, 1, 1, 1, 0]);
  }
  const view = getComparison("groups", "groups");
  assert.deepEqual(view.overall, { reference: 4, model: [4, 4, 4], total: 8 });
  assert.deepEqual(view.rows.map(({ reference, model, total }) => [reference, model, total]), [[3, [1, 1, 1], 4], [1, [3, 3, 3], 4]]);
  assert.deepEqual(view.mismatches, [4, 4, 4]);
});

test("repeat fixture flips all eight records without changing aggregate totals", () => {
  FIXTURES.repeats.records.forEach((record) => assert.deepEqual(record.runs, [record.reference, 1 - record.reference, record.reference]));
  const view = getComparison("repeats", "repeats");
  assert.equal(view.changedRecords, 8);
  assert.deepEqual(view.rows.map(({ changed }) => changed), [0, 8, 8]);
  assert.deepEqual(view.mismatches, [0, 8, 0]);
  assert.deepEqual(view.overall.model, [4, 4, 4]);
});

test("all nine comparisons are deterministic, bounded and do not mutate fixtures", () => {
  const original = JSON.stringify(FIXTURES);
  for (const scenario of SCENARIO_IDS) for (const lens of LENS_IDS) {
    const view = getComparison(scenario, lens);
    assert.deepEqual(view, getComparison(scenario, lens));
    assert.equal(view.scenarioId, scenario);
    assert.equal(view.lensId, lens);
    assert.equal(view.rows.length, lens === "repeats" ? 3 : 2);
    for (const row of view.rows) {
      assert.equal(row.total, lens === "repeats" ? 8 : 4);
      assert.ok([row.reference, ...row.model].every((count) => count >= 0 && count <= row.total));
    }
  }
  assert.equal(JSON.stringify(FIXTURES), original);
  assert.throws(() => getComparison("unknown", "groups"), /Unknown/);
  assert.throws(() => getComparison("groups", "unknown"), /Unknown/);
});

test("selection preserves the lens across scenarios and rejects invalid IDs", () => {
  const initial = { scenarioId: "direction", lensId: "groups", selectedRecordId: "B4" };
  assert.deepEqual(selectState(initial, "scenario", "repeats"), { ...initial, scenarioId: "repeats" });
  assert.deepEqual(selectState(initial, "lens", "repeats"), { ...initial, lensId: "repeats" });
  assert.deepEqual(selectState(initial, "record", "A2"), { ...initial, selectedRecordId: "A2" });
  for (const kind of ["scenario", "lens", "record", "unknown"]) assert.equal(selectState(initial, kind, "invalid"), initial);
});

test("English and Traditional Chinese expose the same scenario and lens IDs", () => {
  for (const locale of ["en", "zh-TW"]) {
    const labels = getLabels(locale);
    assert.deepEqual(Object.keys(labels.scenarios), SCENARIO_IDS);
    assert.deepEqual(Object.keys(labels.lenses), LENS_IDS);
    for (const scenario of SCENARIO_IDS) for (const lens of LENS_IDS) {
      assert.ok(labels.findings[scenario][lens].length > 12);
    }
    assert.ok(labels.boundary.length > 30);
    assert.ok(labels.synthetic.length > 0);
  }
  assert.equal(getLabels("unknown"), getLabels("en"));
});

// Compile only the JSX under test in memory: no site build or generated files.
const componentSource = readFileSync(new URL("../features/behavior-lab/component.jsx", import.meta.url), "utf8");
const module = { exports: {} };
const require = createRequire(import.meta.url);
runInNewContext(transformSync(componentSource, { loader: "jsx", format: "cjs", target: "es2022" }).code, {
  module, exports: module.exports,
  require: (id) => id === "./data.js" ? { FIXTURES, SCENARIO_IDS, LENS_IDS, getComparison, selectState }
    : id === "./content.js" ? { getLabels } : require(id),
});
const { BehaviorComparisonLab } = module.exports;

test("both locales SSR three native tables with one scenario open and controls hidden", () => {
  assert.equal(module.exports.default, BehaviorComparisonLab);
  for (const locale of ["en", "zh-TW"]) {
    const markup = renderToStaticMarkup(React.createElement(BehaviorComparisonLab, { locale }));
    assert.match(markup, /id="behavior-comparison" class="interactive-artifact behavior-lab"/);
    assert.match(markup, /data-enhanced="false" data-behavior-scenario="direction" data-behavior-lens="direction"/);
    assert.match(markup, /class="behavior-enhancement" hidden=""/);
    assert.match(markup, /class="behavior-fallback">/);
    const details = [...markup.matchAll(/<details[^>]*data-behavior-fallback="([^"]+)"[^>]*>/g)];
    assert.deepEqual(details.map((match) => match[1]), SCENARIO_IDS);
    assert.equal(details.filter((match) => match[0].includes('open=""')).length, 1);
    assert.ok(details[0][0].includes('open=""'));
    assert.equal((markup.match(/<caption>/g) || []).length, 3);
    assert.equal((markup.match(/<th scope="row">/g) || []).length, 24);
    assert.ok(markup.includes(getLabels(locale).synthetic));
    assert.ok(markup.includes(getLabels(locale).boundary));
    const prefix = locale === "zh-TW" ? "/zh" : "";
    assert.ok(markup.includes(`href="${prefix}/articles/evaluating-llm-agents-against-measured-human-behavior/"`));
  }
});

test("controls and record details expose explicit hooks and accessible selection", () => {
  const markup = renderToStaticMarkup(React.createElement(BehaviorComparisonLab));
  for (const kind of ["scenario", "lens"]) {
    for (const id of SCENARIO_IDS) {
      assert.ok(markup.includes(`data-behavior-${kind}-button="${id}" value="${id}" aria-pressed="${id === "direction"}"`));
    }
  }
  assert.equal((markup.match(/data-behavior-record-button=/g) || []).length, 8);
  assert.match(markup, /data-behavior-selected-record="A1"/);
  assert.match(markup, /aria-controls="behavior-record-detail"/);
  assert.match(markup, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.doesNotMatch(componentSource, /fetch\(|localStorage|sessionStorage|Math\.random|https?:\/\//);
});

test("feature CSS parses, scopes selectors and preserves hidden/reduced-motion states", () => {
  const css = readFileSync(new URL("../features/behavior-lab/styles.css", import.meta.url), "utf8");
  assert.equal(transformSync(css, { loader: "css" }).warnings.length, 0);
  assert.match(css, /\.behavior-lab \[hidden\] \{ display: none !important; \}/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /min-height: 44px/);
  assert.doesNotMatch(css, /text-transform:\s*uppercase|letter-spacing:\s*-/);
  for (const block of css.split("}")) {
    const selector = block.slice(0, block.indexOf("{")).trim();
    if (!selector || selector.startsWith("@")) continue;
    assert.ok(selector.split(",").every((part) => part.trim().startsWith(".behavior-lab")), selector);
  }
});
