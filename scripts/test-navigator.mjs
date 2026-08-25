#!/usr/bin/env node
import assert from "node:assert/strict";
import { createRequestGate, createSemanticRanker, rankLocally, toSemanticQuery } from "../navigator.js";

const cases = [
  ["agent governance constraints", "en", "wagf"],
  ["LLM behavior across social groups", "en", "human-grounded-llm-evaluation"],
  ["download academic CV", "en", "documents"],
  ["找洪水模型", "zh-TW", "floodabm"],
  ["找論文", "zh-TW", "publications"],
  ["我想了解你的實習時間", "zh-TW", "contact"],
];

for (const [query, locale, expected] of cases) {
  const [first] = rankLocally(query, locale);
  assert.equal(first?.record.id, expected, `${locale} query did not rank ${expected} first: ${query}`);
}

const expanded = toSemanticQuery("找論文與代理治理");
assert.match(expanded, /journal articles/);
assert.match(expanded, /agent governance/);

const dimensions = cases.length + 4;
const corpus = Array.from({ length: dimensions }, (_, index) => (
  Array.from({ length: dimensions }, (__, dimension) => Number(index === dimension))
));
const semanticTarget = 2;
let moduleLoads = 0;
let pipelineLoads = 0;
let corpusLoads = 0;
const fakeExtractor = async (input) => {
  if (Array.isArray(input)) {
    corpusLoads += 1;
    return { tolist: () => corpus };
  }
  return { tolist: () => [corpus[semanticTarget]] };
};
const rankSemantically = createSemanticRanker({
  loadTransformers: async () => {
    moduleLoads += 1;
    return {
      env: { backends: { onnx: { wasm: {} } } },
      pipeline: async () => {
        pipelineLoads += 1;
        return fakeExtractor;
      },
    };
  },
});
const [semanticA, semanticB] = await Promise.all([
  rankSemantically("unmapped alpha", "en"),
  rankSemantically("unmapped beta", "en"),
]);
assert.equal(semanticA[0].record.id, "wagf");
assert.equal(semanticB[0].record.id, "wagf");
assert.equal(moduleLoads, 1, "concurrent searches should share one module load");
assert.equal(pipelineLoads, 1, "concurrent searches should share one pipeline");
assert.equal(corpusLoads, 1, "concurrent searches should share one corpus embedding pass");

let moduleAttempts = 0;
const retryModule = createSemanticRanker({
  loadTransformers: async () => {
    moduleAttempts += 1;
    if (moduleAttempts === 1) throw new Error("simulated module failure");
    return {
      env: { backends: { onnx: { wasm: {} } } },
      pipeline: async () => fakeExtractor,
    };
  },
});
await assert.rejects(() => retryModule("first attempt", "en"));
await retryModule("second attempt", "en");
assert.equal(moduleAttempts, 2, "a failed module load must be retryable");

let corpusAttempts = 0;
const retryCorpus = createSemanticRanker({
  loadTransformers: async () => ({
    env: { backends: { onnx: { wasm: {} } } },
    pipeline: async () => async (input) => {
      if (Array.isArray(input)) {
        corpusAttempts += 1;
        if (corpusAttempts === 1) throw new Error("simulated corpus failure");
        return { tolist: () => corpus };
      }
      return { tolist: () => [corpus[semanticTarget]] };
    },
  }),
});
await assert.rejects(() => retryCorpus("first corpus", "en"));
await retryCorpus("second corpus", "en");
assert.equal(corpusAttempts, 2, "a failed corpus embedding pass must be retryable");

const gate = createRequestGate();
const staleRequest = gate.next();
const currentRequest = gate.next();
assert.equal(gate.isCurrent(staleRequest), false, "stale semantic results must not replace a newer query");
assert.equal(gate.isCurrent(currentRequest), true);

console.log(`navigator-test: ${cases.length} bilingual routes, semantic loading, retry, and race handling passed`);
