import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildDates, nyDate, fetchYear, damSvg, snakeSvg, validate } from "./commit-maps.mjs";

const read = (f) => fs.readFileSync(new URL("../assets/commit-maps/" + f, import.meta.url), "utf8");
const goodYear = () => ({ repos: 2, days: buildDates("2026-11-11").map((d, i) => [d, i % 3]) });
const json = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test("buildDates returns 365 consecutive days ending on the given day", () => {
  const d = buildDates("2026-11-11");
  assert.equal(d.length, 365);
  assert.equal(d.at(-1), "2026-11-11");
  assert.equal(d[0], "2025-11-12");
  d.forEach((x, i) => i && assert.equal(Date.parse(x) - Date.parse(d[i - 1]), 864e5));
});

test("buildDates crosses a leap day and a DST change without gaps or repeats", () => {
  const d = buildDates("2024-12-31");
  assert.ok(d.includes("2024-02-29") && d.includes("2024-03-10") && d.includes("2024-11-03"));
  assert.equal(new Set(d).size, 365);
  assert.equal(d[0], "2024-01-02");
});

test("nyDate maps just after midnight UTC to the previous New York date", () => {
  assert.equal(nyDate("2026-07-02T00:30:00Z"), "2026-07-01");
  assert.equal(nyDate("2026-01-02T04:59:59Z"), "2026-01-01");
  assert.equal(nyDate("2026-01-02T05:00:00Z"), "2026-01-02");
});

test("committed year.json reproduces the committed SVGs byte for byte", () => {
  const year = JSON.parse(read("year.json"));
  assert.equal(damSvg(year), read("activity-dam.svg"));
  assert.equal(snakeSvg(year), read("activity-snake.svg"));
  validate(year, read("activity-dam.svg"), read("activity-snake.svg"));
});

test("validate rejects bad input", () => {
  const dam = "<svg></svg>", snake = "<svg></svg>";
  validate(goodYear(), dam, snake);
  const short = goodYear(); short.days.pop();
  assert.throws(() => validate(short, dam, snake), /365/);
  const date = goodYear(); date.days[0][0] = "2025-11-12<b>";
  assert.throws(() => validate(date, dam, snake), /bad date/);
  const neg = goodYear(); neg.days[5][1] = -1;
  assert.throws(() => validate(neg, dam, snake), /bad count/);
  const frac = goodYear(); frac.days[5][1] = 1.5;
  assert.throws(() => validate(frac, dam, snake), /bad count/);
  const zero = goodYear(); zero.days.forEach((d) => (d[1] = 0));
  assert.throws(() => validate(zero, dam, snake), /total commits/);
  const norepo = goodYear(); norepo.repos = 0;
  assert.throws(() => validate(norepo, dam, snake), /repos/);
  assert.throws(() => validate(goodYear(), "<svg>NaN</svg>", snake), /NaN/);
  assert.throws(() => validate(goodYear(), dam, "<svg><script></script></svg>"), /script/);
  assert.throws(() => validate(goodYear(), "nope", snake), /<svg/);
});

const repo = (name) => ({ name, fork: false, private: false, pushed_at: "2026-11-01T00:00:00Z" });
const commit = (iso) => ({ commit: { author: { date: iso } } });

test("fetchYear paginates past 100 items, filters repos, treats 409 as zero", async () => {
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(url);
    const u = new URL(url);
    if (u.pathname === "/users/WenyuChiou/repos") {
      const page = +u.searchParams.get("page");
      if (page === 1) return json(Array.from({ length: 100 }, (_, i) => (i === 0 ? repo("busy") : i === 1 ? { ...repo("forked"), fork: true } : i === 2 ? repo("empty") : { ...repo("old" + i), pushed_at: "2020-01-01T00:00:00Z" })));
      return json([{ ...repo("private"), private: true }]);
    }
    if (u.pathname.endsWith("/empty/commits")) return json({}, 409);
    if (u.pathname.endsWith("/busy/commits")) {
      const page = +u.searchParams.get("page");
      return json(page === 1 ? Array.from({ length: 100 }, () => commit("2026-11-10T15:00:00Z")) : [commit("2026-11-11T02:00:00Z"), commit("2020-01-01T00:00:00Z")]);
    }
    throw new Error("unexpected " + url);
  };
  const y = await fetchYear({ end: "2026-11-11", token: "t", fetchImpl });
  assert.equal(y.repos, 2);
  assert.equal(y.days.length, 365);
  assert.deepEqual(y.days.at(-1), ["2026-11-11", 0]);
  assert.deepEqual(y.days.at(-2), ["2026-11-10", 101]);
  assert.ok(urls.some((u) => u.includes("/repos?") && u.includes("page=2")));
  assert.ok(urls.some((u) => u.includes("/busy/commits") && u.includes("page=2")));
  assert.ok(!urls.some((u) => u.includes("/forked/")));
});

test("fetchYear fails closed on any other error status", async () => {
  for (const status of [500, 403]) {
    const fetchImpl = async (url) => (new URL(url).pathname.endsWith("/repos") ? json([repo("a")]) : json({}, status));
    await assert.rejects(fetchYear({ end: "2026-11-11", token: "t", fetchImpl }), new RegExp(String(status)));
  }
  await assert.rejects(fetchYear({ end: "2026-11-11", token: "t", fetchImpl: async () => json({}, 403) }), /403/);
  await assert.rejects(fetchYear({ end: "2026-11-11", token: "t", fetchImpl: async () => { throw new Error("boom"); } }), /network error/);
});

test("fetchYear never puts the token in an error message", async () => {
  await assert.rejects(fetchYear({ end: "2026-11-11", token: "SECRET123", fetchImpl: async () => json({}, 500) }), (e) => !e.message.includes("SECRET123"));
});
