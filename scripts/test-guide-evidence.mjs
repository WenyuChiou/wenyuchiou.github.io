import assert from "node:assert/strict";
import test from "node:test";

import { GUIDE_EVIDENCE } from "../guide-evidence.js";

const EXPECTED_IDS = [
  "human-grounded-llm-evaluation",
  "wagf",
  "floodabm",
  "repo-ai-research-skills",
  "repo-research-hub",
  "repo-agent-collab-skills",
  "repo-awesome-agentic-ai-zh",
  "repo-codex-delegate",
];
const RECORD_KEYS = [
  "agentType",
  "contribution",
  "how",
  "href",
  "id",
  "keywords",
  "kind",
  "limitations",
  "source",
  "tasks",
  "title",
  "why",
];
const LOCALES = ["en", "zh-TW"];
const AGENT_TYPES = new Set([
  "human-reference",
  "llm-agent",
  "household-agent",
  "research-agent",
  "collaboration",
  "catalog",
  "delegation",
]);
const TASKS = new Set(["research", "observatory", "tools"]);
const SHA = /^[0-9a-f]{40}$/;

test("guide evidence exposes the exact eight unique records", () => {
  assert.equal(GUIDE_EVIDENCE.length, 8);
  assert.deepEqual(GUIDE_EVIDENCE.map(({ id }) => id), EXPECTED_IDS);
  assert.equal(new Set(GUIDE_EVIDENCE.map(({ id }) => id)).size, 8);
});

test("every record follows the bilingual evidence contract", () => {
  for (const record of GUIDE_EVIDENCE) {
    assert.deepEqual(Object.keys(record).sort(), RECORD_KEYS);
    assert.ok(["case", "tool"].includes(record.kind));
    assert.ok(AGENT_TYPES.has(record.agentType));
    assert.ok(Array.isArray(record.tasks) && record.tasks.length > 0);
    assert.ok(record.tasks.every((task) => TASKS.has(task)));
    assert.equal(new Set(record.tasks).size, record.tasks.length);

    for (const field of ["title", "why", "how", "contribution", "limitations", "keywords"]) {
      assert.deepEqual(Object.keys(record[field]).sort(), LOCALES);
    }
    for (const field of ["title", "why", "how", "contribution", "limitations"]) {
      for (const locale of LOCALES) {
        assert.equal(typeof record[field][locale], "string");
        assert.ok(record[field][locale].length > 0 && record[field][locale].length <= 240);
      }
    }
    for (const locale of LOCALES) {
      assert.ok(Array.isArray(record.keywords[locale]) && record.keywords[locale].length > 0);
      assert.ok(record.keywords[locale].every((keyword) => typeof keyword === "string" && keyword.length > 0 && keyword.length <= 240));
    }

    const source = new URL(record.source.url);
    assert.equal(source.protocol, "https:");
    assert.equal(record.source.checkedAt, "2026-10-13");
    assert.ok(record.source.revision === null || SHA.test(record.source.revision));
  }
});

test("tool records use public immutable README sources and state their boundaries", () => {
  const tools = GUIDE_EVIDENCE.filter(({ kind }) => kind === "tool");
  assert.equal(tools.length, 5);

  for (const record of tools) {
    const href = new URL(record.href);
    const source = new URL(record.source.url);
    assert.equal(href.hostname, "github.com");
    assert.equal(source.hostname, "github.com");
    assert.match(source.pathname, /^\/WenyuChiou\/[^/]+\/blob\/[0-9a-f]{40}\/README\.md$/);
    assert.ok(SHA.test(record.source.revision));
  }

  const limits = Object.fromEntries(tools.map(({ id, limitations }) => [id, limitations.en.toLowerCase()]));
  assert.match(limits["repo-ai-research-skills"], /catalog|runtime/);
  assert.match(limits["repo-research-hub"], /environment|integration/);
  assert.match(limits["repo-agent-collab-skills"], /not.*general agent runtime|host/);
  assert.match(limits["repo-awesome-agentic-ai-zh"], /learning catalog|not executable/);
  assert.match(limits["repo-codex-delegate"], /codex cli|evidence checker/);
});

test("case records retain public boundaries, including FLOODABM's non-LLM scope", () => {
  const cases = GUIDE_EVIDENCE.filter(({ kind }) => kind === "case");
  assert.equal(cases.length, 3);
  assert.ok(cases.every(({ href, source }) => href.startsWith("/work/") && new URL(source.url).hostname === "wenyuchiou.github.io"));

  const floodabm = GUIDE_EVIDENCE.find(({ id }) => id === "floodabm");
  assert.match(floodabm.limitations.en, /not an integrated LLM system/i);
  assert.doesNotMatch(`${floodabm.why.en} ${floodabm.how.en} ${floodabm.contribution.en}`, /\bLLM\b/i);
});
