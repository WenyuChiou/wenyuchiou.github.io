#!/usr/bin/env node
import assert from "node:assert/strict";
import { createRequestGate, createSemanticRanker, rankLocally, requestNvidiaSummary, toSemanticQuery, validateNavigatorResponse } from "../navigator.js";
import { NAVIGATOR_INDEX } from "../navigator-data.js";
import { buildLocalFitReport, requestNvidiaFit, validateFitResponse } from "../fit-explorer.js";

const cases = [
  ["agent governance constraints", "en", "wagf"],
  ["LLM behavior across social groups", "en", "human-grounded-llm-evaluation"],
  ["download academic CV", "en", "documents"],
  ["找洪水模型", "zh-TW", "floodabm"],
  ["找論文", "zh-TW", "publications"],
  ["我想了解你的實習時間", "zh-TW", "contact"],
  ["驗證器與失敗模式文章", "zh-TW", "articles"],
  ["AI research engineer role fit", "en", "hire"],
  ["LangChain MATLAB Claude Code skills", "en", "hire"],
  ["模型上下文協定", "zh-TW", "hire"],
  ["檢索增強生成", "zh-TW", "hire"],
  ["結構方程模型", "zh-TW", "hire"],
  ["貝葉斯校準", "zh-TW", "hire"],
  ["代理人基礎模型", "zh-TW", "floodabm"],
];

for (const [query, locale, expected] of cases) {
  const [first] = rankLocally(query, locale);
  assert.equal(first?.record.id, expected, `${locale} query did not rank ${expected} first: ${query}`);
  assert.ok(first?.score > 0, `${locale} query ranked by record order instead of a positive lexical score: ${query}`);
}

const expanded = toSemanticQuery("找論文與代理治理");
assert.match(expanded, /journal articles/);
assert.match(expanded, /agent governance/);

const dimensions = NAVIGATOR_INDEX.records.length;
const corpus = Array.from({ length: dimensions }, (_, index) => (
  Array.from({ length: dimensions }, (__, dimension) => Number(index === dimension))
));
const semanticTarget = NAVIGATOR_INDEX.records.findIndex((record) => record.id === "wagf");
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

const validated = validateNavigatorResponse({ mode: "nvidia", answer: "Start with the governance case.", matches: [{ id: "wagf", reason: "It shows validators." }] });
assert.equal(validated.matches[0].record.id, "wagf");
assert.throws(() => validateNavigatorResponse({ mode: "nvidia", answer: "Unknown", matches: [{ id: "invented", reason: "No" }] }));

let nvidiaRequest;
const nvidia = await requestNvidiaSummary({
  endpoint: "https://worker.example/v1/navigate",
  query: "agent governance",
  locale: "en",
  turnstileToken: "test-token",
  fetchImpl: async (_url, init) => {
    nvidiaRequest = JSON.parse(init.body);
    return new Response(JSON.stringify({ mode: "nvidia", answer: "See WAGF.", matches: [{ id: "wagf", reason: "Governance evidence." }] }), { status: 200, headers: { "Content-Type": "application/json" } });
  },
});
assert.equal(nvidiaRequest.query, "agent governance");
assert.equal(nvidiaRequest.turnstileToken, "test-token");
assert.equal(nvidia.matches[0].record.id, "wagf");

const presetFit = buildLocalFitReport({ rolePreset: "llm-evaluation", locale: "en" });
assert.equal(presetFit.strongFit.length, 3);
assert.equal(presetFit.evidenceGaps.length, 0);
assert.equal(presetFit.strongFit[0].evidence[0].id, "human-grounded-llm-evaluation");
const fallbackPresetFit = buildLocalFitReport({ rolePreset: "unknown-role", locale: "en" });
assert.equal(fallbackPresetFit.role.id, "llm-evaluation");

const jobFit = buildLocalFitReport({
  rolePreset: "agent-systems",
  locale: "en",
  jobDescription: "Build validators and audit traces for agent actions. Operate a production Kubernetes platform.",
});
assert.ok(jobFit.strongFit.some((item) => item.evidence.some((record) => record.id === "wagf")));
assert.ok(jobFit.evidenceGaps.some((item) => /Kubernetes/.test(item.requirement)));

const localizedFit = buildLocalFitReport({ rolePreset: "ai-science", locale: "zh-TW" });
assert.equal(localizedFit.role.title, "AI 研究／AI for Science");
assert.match(localizedFit.strongFit[0].evidence[0].href, /^\/zh\//);
const localizedJobFit = buildLocalFitReport({ rolePreset: "ai-science", locale: "zh-TW", jobDescription: "建立水文與社會水文模型。管理正式環境 Kubernetes 平台。" });
assert.ok(localizedJobFit.strongFit.some((item) => item.evidence.some((record) => record.id === "floodabm")));
assert.ok(localizedJobFit.evidenceGaps.some((item) => /Kubernetes/.test(item.requirement)));

const fitResponse = {
  mode: "nvidia",
  role: { id: "llm-evaluation" },
  strongFit: [{ id: "strong-1", requirement: "Evaluate model behavior", priority: "required", capability: "Human-grounded LLM evaluation", evidence: [{ id: "human-grounded-llm-evaluation" }] }],
  adjacentFit: [],
  evidenceGaps: [{ id: "gap-1", requirement: "Production Kubernetes", priority: "contextual", capability: "No verified mapping", evidence: [] }],
  ownership: ["Design evaluation protocols."],
  recommendedEvidence: [{ id: "human-grounded-llm-evaluation" }],
};
assert.equal(validateFitResponse(fitResponse, "llm-evaluation", "en").strongFit[0].evidence[0].id, "human-grounded-llm-evaluation");
assert.throws(() => validateFitResponse({ ...fitResponse, recommendedEvidence: [{ id: "invented" }] }, "llm-evaluation", "en"));

let fitRequest;
const fitResult = await requestNvidiaFit({
  endpoint: "https://worker.example/v1/fit",
  rolePreset: "llm-evaluation",
  jobDescription: "Evaluate model behavior",
  locale: "en",
  turnstileToken: "fit-token",
  fetchImpl: async (_url, init) => {
    fitRequest = JSON.parse(init.body);
    return new Response(JSON.stringify(fitResponse), { status: 200, headers: { "Content-Type": "application/json" } });
  },
});
assert.equal(fitRequest.rolePreset, "llm-evaluation");
assert.equal(fitRequest.turnstileToken, "fit-token");
assert.equal(fitResult.mode, "nvidia");

console.log(`navigator-test: ${cases.length} bilingual routes plus recruiter fit local, NVIDIA, localization, retry, and grounding checks passed`);
