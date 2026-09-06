import test from "node:test";
import assert from "node:assert/strict";
import { GROUPS, REPOSITORIES, getWorkbench, selectGroup } from "../features/open-source-workbench/data.js";

test("five public repositories have one documented use and exact sources", () => {
  assert.equal(REPOSITORIES.length, 5);
  assert.equal(new Set(REPOSITORIES.map((repo) => repo.id)).size, 5);
  assert.deepEqual(GROUPS, ["research", "collaboration", "learning"]);
  for (const repo of REPOSITORIES) {
    assert.ok(GROUPS.includes(repo.group));
    assert.equal(repo.href, `https://github.com/WenyuChiou/${repo.id}`);
  }
  assert.deepEqual(GROUPS.map((id) => selectGroup(id).length), [2, 2, 1]);
  assert.equal(selectGroup("all").length, 5);
  assert.throws(() => selectGroup("<script>"));
});

test("locales share IDs and sources but have independent descriptions", () => {
  const en = getWorkbench("en"), zh = getWorkbench("zh-TW");
  assert.deepEqual(en.repos.map((r) => r.id), zh.repos.map((r) => r.id));
  for (let i = 0; i < 5; i++) { assert.equal(en.repos[i].href, zh.repos[i].href); assert.notEqual(en.repos[i].description, zh.repos[i].description); }
  assert.match(en.repos.find((r) => r.id === "research-hub").description, /Executable/);
  assert.match(en.repos.find((r) => r.id === "ai-research-skills").description, /Skills/);
});
