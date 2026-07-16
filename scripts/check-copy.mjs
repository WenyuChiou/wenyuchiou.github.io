#!/usr/bin/env node
// check-copy.mjs — fail-closed copy linter (implementation-plan §1.3 S3, §1.4).
//
// Enforces the S4 grep-audit table (banned patterns), byte-identity of the
// canonical strings in scripts/canonical-strings.json (canonical-facts.md §2
// wins; regenerate the JSON from it, never edit ad hoc), and the
// single-public-email rule (wec324@lehigh.edu).
//
// Modes:
//   warn   (default)            — reports ALL violations across the strict
//                                 SCOPE *and* FUTURE_SCOPE (debt watch), exits 0.
//   strict (STRICT_COPY=1 or --strict)
//                               — exits 1 on any violation in the strict SCOPE
//                                 only; future-scope debt still printed as warnings.
//
// Test invocation: --scope-override=<fileA,fileB,...> replaces the strict
// SCOPE with the given paths (absolute, or relative to cwd) and empties
// FUTURE_SCOPE — used by the S3 red-test against scratch files.
//
// Zero external dependencies. Node ESM.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// SCOPE — files/globs the STRICT gate scans. Entries are relative to the repo
// root. "pdf:" prefix = extract text via pdftotext (skip with a loud warning
// if pdftotext is unavailable). Commented entries are enabled by the commit
// noted; until then they are watched in warn mode via FUTURE_SCOPE below.
// ---------------------------------------------------------------------------
const SCOPE = [
  "content.js",
  "seo.js", // created at S4 — missing file is only fatal in strict mode (strict flips at S4)
  "scripts/canonical-strings.json",
  "app.jsx",    // promoted at S5 (feat(app): homepage blocks — app.jsx rewrite landed)
  "styles.css", // promoted at S5 (rewritten token/component styles)
  // "template.html",  // enable at S8 (feat(prerender): template replaces index.html as source)
  // "**/index.html",  // enable at S8 (built static HTML for all 9 routes)
  // "cv/*.html",      // enable at S10 (feat(cv): CV/resume HTML sources)
  // "pdf:assets/Wenyu_Chiou_Academic_CV.pdf",        // enable at S10 (generated PDF, text via pdftotext)
  // "pdf:assets/Wenyu_Chiou_AI_Research_Resume.pdf", // enable at S10 (generated PDF, text via pdftotext)
];

// Future-scope debt watch: same entries as the commented SCOPE block above,
// scanned in BOTH modes but never fatal until promoted into SCOPE.
const FUTURE_SCOPE = [
  "template.html",
  "**/index.html",
  "cv/*.html",
  "pdf:assets/Wenyu_Chiou_Academic_CV.pdf",
  "pdf:assets/Wenyu_Chiou_AI_Research_Resume.pdf",
];

// ---------------------------------------------------------------------------
// Canonical strings (scripts/canonical-strings.json — canonical-facts.md wins)
// ---------------------------------------------------------------------------
const CANON = JSON.parse(
  readFileSync(path.join(REPO_ROOT, "scripts", "canonical-strings.json"), "utf8"),
);
const CANONICAL_EMAIL = CANON.email; // wec324@lehigh.edu — the ONLY allowed email
const AVAILABILITY = CANON.availability; // the ONE sentence in which "Summer 2027" is allowed

// ---------------------------------------------------------------------------
// BANNED PATTERNS — one row per implementation-plan §1.4 grep-audit table row.
// Case-insensitive where sensible (acronyms like AWS / FUNDING stay
// case-sensitive so prose "funding" / "aws" doesn't false-positive).
// ---------------------------------------------------------------------------
const BANNED = [
  { name: "first-superlative", re: /\bfirst[\s-]+(framework|governed|coupled)\b/giu, why: "kill list — 'first framework/governed/coupled' superlatives" },
  { name: "banned-multiplier", re: /6[–-]7[×x]|17[–-]22[×x]|token[\s-]+saving/giu, why: "kill list — unverified multipliers" },
  { name: "stale-star-count", re: /1\.8k/giu, why: "stale star count (only allowed: '4.5k+ GitHub stars (July 2026)')" },
  { name: "star-glyph", re: /★+/gu, why: "star glyphs banned in copy" },
  // CJK Unified Ideographs: Ext A, base block, compatibility, Ext B–G (astral).
  { name: "cjk-codepoint", re: /[㐀-䶿一-鿿豈-﫿\u{20000}-\u{2FA1F}]+/gu, why: "decision 2 — English-only v1" },
  { name: "second-gmail", re: /wenyuchiou12/giu, why: "decision 5 — second gmail removed from career surfaces" },
  { name: "buymeacoffee", re: /buymeacoffee/giu, why: "decision 5 — funding links removed" },
  { name: "funding-yml", re: /\bFUNDING\b/gu, why: "decision 5 — FUNDING.yml references removed (case-sensitive: prose 'funding' is fine)" },
  { name: "gemini-delegate", re: /gemini-delegate/giu, why: "kill list — dead lane" },
  { name: "banned-year-2028", re: /\b2028\b/gu, why: "decision 3 — no 2028 completion date" },
  { name: "banned-may-2027", re: /May 2027/gu, why: "decision 3 — banned date" },
  { name: "banned-range-2024-2027", re: /2024[–-]2027/gu, why: "decision 3 — banned range" },
  { name: "puffery", re: /\b(innovative|visionary|expert|cutting[\s-]edge|passionate)\b/giu, why: "decision 12 — puffery vocabulary" },
  { name: "unevidenced-skill", re: /\b(PyTorch|FastAPI|World[\s-]+Models)\b/giu, why: "unevidenced skills chips" },
  { name: "unevidenced-skill-aws", re: /\bAWS\b/gu, why: "unevidenced skills chips (case-sensitive acronym)" },
  { name: "confirm-flag", re: /\[CONFIRM/giu, why: "internal [CONFIRM] flags never render publicly" },
  { name: "center-of-catastrophe", re: /Center of Catastrophe/giu, why: "canonical is 'Center FOR Catastrophe Modeling and Resilience'" },
  { name: "falsified-ci-gates", re: /gates (?:enforced )?in CI|recall-floor evaluation gates/giu, why: "CONFIRM #15 — recall tests are xfail audit baselines, not CI gates" },
];

// Windowed check: "under review" within 200 chars of the WRR article id.
const WINDOWED = { name: "wrr-under-review-window", window: 200, a: /under review/giu, b: /2025WR042111/g, why: "decision 6 — WRR is always Published" };

// Whitelist check: "Summer 2027" allowed ONLY inside the exact availability
// sentence. (Other 2027-in-a-date usages are generally allowed; the banned
// set is exactly 2028 / May 2027 / 2024–2027 above.)
const SUMMER = { name: "summer-2027-outside-availability", re: /Summer 2027/g, why: "'Summer 2027' allowed only inside the verbatim availability sentence" };

// Byte-identity: canonical string prefix present but continuation drifts.
const DRIFT_PREFIX_LEN = 25;
const DRIFT_KEYS = Object.entries(CANON).filter(
  ([k, v]) => typeof v === "string" && !k.startsWith("_") && v.length > DRIFT_PREFIX_LEN,
);

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const strictMode = args.includes("--strict") || process.env.STRICT_COPY === "1";
const overrideArg = args.find((a) => a.startsWith("--scope-override="));

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === "\n") line++;
  return line;
}
const trunc = (s) => {
  const one = s.replace(/\s+/g, " ").trim();
  return one.length > 80 ? one.slice(0, 80) + "…" : one;
};

function globToRegex(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += glob[i + 2] === "/" ? "(?:.*/)?" : ".*";
        i += glob[i + 2] === "/" ? 2 : 1;
      } else re += "[^/]*";
    } else re += /[.+^${}()|[\]\\?]/.test(c) ? "\\" + c : c;
  }
  return new RegExp("^" + re + "$");
}

const WALK_SKIP = new Set(["node_modules", ".git", "assets"]);
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!WALK_SKIP.has(name)) walk(full, acc);
    } else acc.push(path.relative(REPO_ROOT, full).replace(/\\/g, "/"));
  }
  return acc;
}

// Resolve a scope entry to { label, kind: "text"|"pdf"|"missing", abs }
function resolveEntry(entry, { fromCwd = false } = {}) {
  const isPdf = entry.startsWith("pdf:");
  const rel = isPdf ? entry.slice(4) : entry;
  const base = fromCwd ? process.cwd() : REPO_ROOT;
  if (!isPdf && /[*]/.test(rel)) {
    const re = globToRegex(rel);
    return walk(REPO_ROOT)
      .filter((p) => re.test(p))
      .map((p) => ({ label: p, kind: "text", abs: path.join(REPO_ROOT, p) }));
  }
  const abs = path.isAbsolute(rel) ? rel : path.join(base, rel);
  if (!existsSync(abs)) return [{ label: rel, kind: "missing", abs }];
  return [{ label: rel, kind: isPdf ? "pdf" : "text", abs }];
}

let pdftotextChecked = false;
let pdftotextOk = false;
function readEntryText(item) {
  if (item.kind === "text") return readFileSync(item.abs, "utf8");
  // pdf
  if (!pdftotextChecked) {
    pdftotextChecked = true;
    pdftotextOk = !spawnSync("pdftotext", ["-v"], { encoding: "utf8" }).error;
  }
  if (!pdftotextOk) {
    console.warn(`\n!!! WARNING: pdftotext not available — SKIPPING PDF text scan for ${item.label}.`);
    console.warn(`!!! PDF copy is UNCHECKED. Install poppler (pdftotext) to close this gap.\n`);
    return null;
  }
  const r = spawnSync("pdftotext", [item.abs, "-"], { encoding: "utf8" });
  if (r.status !== 0) {
    console.warn(`\n!!! WARNING: pdftotext failed on ${item.label} (exit ${r.status}) — PDF copy UNCHECKED.\n`);
    return null;
  }
  return r.stdout;
}

// ---------------------------------------------------------------------------
// scanning
// ---------------------------------------------------------------------------
function scanText(label, text) {
  const found = []; // {file, name, line, match, detail?}
  const push = (name, index, match, detail) =>
    found.push({ file: label, name, line: lineOf(text, index), match: trunc(match), detail });

  // 1. banned patterns
  for (const p of BANNED) {
    p.re.lastIndex = 0;
    let m;
    while ((m = p.re.exec(text)) !== null) {
      push(p.name, m.index, m[0]);
      if (m.index === p.re.lastIndex) p.re.lastIndex++; // zero-width safety
    }
  }

  // 2. windowed: "under review" within 200 chars of 2025WR042111
  const ids = [...text.matchAll(WINDOWED.b)].map((m) => m.index);
  if (ids.length) {
    for (const m of text.matchAll(WINDOWED.a)) {
      const near = ids.some((i) => Math.abs(i - m.index) <= WINDOWED.window);
      if (near) push(WINDOWED.name, m.index, m[0]);
    }
  }

  // 3. "Summer 2027" only inside the exact availability sentence
  const availRanges = [];
  for (let i = text.indexOf(AVAILABILITY); i !== -1; i = text.indexOf(AVAILABILITY, i + 1))
    availRanges.push([i, i + AVAILABILITY.length]);
  for (const m of text.matchAll(SUMMER.re)) {
    const inside = availRanges.some(([s, e]) => m.index >= s && m.index + m[0].length <= e);
    if (!inside) push(SUMMER.name, m.index, m[0]);
  }

  // 4. byte-identity drift: canonical prefix present, continuation differs.
  // DECOMPOSITION_ALLOWLIST: exact component strings that legitimately share a
  // canonical string's prefix because structured data splits the canonical
  // value into fields (e.g. an `authors` field holds only the author list of
  // the WRR citation; JSON-LD jobTitle omits the university, which lives in
  // the separate affiliation field). A match is allowed ONLY when the text at
  // the match position equals the allowlisted string followed by a
  // non-word character (a delimiter — quote, newline, comma). Any other
  // divergence is still drift.
  const DECOMPOSITION_ALLOWLIST = [
    "Yang, Y. C. E., & Chiou, W.",
    "Ph.D. Candidate, Civil & Environmental Engineering",
  ];
  for (const [key, canon] of DRIFT_KEYS) {
    const prefix = canon.slice(0, DRIFT_PREFIX_LEN);
    for (let i = text.indexOf(prefix); i !== -1; i = text.indexOf(prefix, i + 1)) {
      const got = text.slice(i, i + canon.length);
      const decomposed = DECOMPOSITION_ALLOWLIST.some((a) => {
        if (!a.startsWith(prefix)) return false;
        if (text.slice(i, i + a.length) !== a) return false;
        // Only a STRING DELIMITER ends a legitimate decomposition; a space or
        // punctuation means the text continues (e.g. a drifted full citation
        // sharing the author-list prefix) and must face the drift check.
        const next = text[i + a.length];
        return next === undefined || next === String.fromCharCode(34) || next === String.fromCharCode(39) || next === String.fromCharCode(96) || next === String.fromCharCode(10) || next === String.fromCharCode(13);
      });
      if (decomposed) continue;
      if (got !== canon) {
        let d = 0;
        while (d < canon.length && got[d] === canon[d]) d++;
        const detail =
          `canonical-drift diff (from char ${d}):\n` +
          `      canonical: …${JSON.stringify(canon.slice(Math.max(0, d - 15), d + 45))}\n` +
          `      found    : …${JSON.stringify(got.slice(Math.max(0, d - 15), d + 45))}`;
        push(`canonical-drift:${key}`, i, got.slice(0, 80), detail);
      }
    }
  }

  // 5. email scan: canonical email must be the only email-like string
  for (const m of text.matchAll(EMAIL_RE)) {
    if (m[0] !== CANONICAL_EMAIL) push("email-not-canonical", m.index, m[0]);
  }

  return found;
}

function scanScope(entries, { fromCwd = false } = {}) {
  const violations = [];
  const missing = [];
  for (const entry of entries) {
    for (const item of resolveEntry(entry, { fromCwd })) {
      if (item.kind === "missing") {
        missing.push(item.label);
        continue;
      }
      const text = readEntryText(item);
      if (text == null) continue; // pdf skipped (loud warning already printed)
      violations.push(...scanText(item.label, text));
    }
  }
  return { violations, missing };
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------
let strictEntries = SCOPE;
let futureEntries = FUTURE_SCOPE;
let fromCwd = false;
if (overrideArg) {
  strictEntries = overrideArg.slice("--scope-override=".length).split(",").filter(Boolean);
  futureEntries = [];
  fromCwd = true;
}

const strict = scanScope(strictEntries, { fromCwd });
const future = scanScope(futureEntries);

const MAX_SHOWN_PER_FILE_PATTERN = 10;
function report(tag, violations) {
  const shown = new Map();
  for (const v of violations) {
    const k = `${v.file}::${v.name}`;
    const n = (shown.get(k) || 0) + 1;
    shown.set(k, n);
    if (n > MAX_SHOWN_PER_FILE_PATTERN) continue;
    console.log(`[${tag}] ${v.file}:${v.line}  ${v.name}  "${v.match}"`);
    if (v.detail) console.log(`      ${v.detail}`);
  }
  for (const [k, n] of shown) {
    if (n > MAX_SHOWN_PER_FILE_PATTERN)
      console.log(`[${tag}] ${k.replace("::", "  ")}  …and ${n - MAX_SHOWN_PER_FILE_PATTERN} more`);
  }
}

console.log(`check-copy: mode=${strictMode ? "STRICT" : "warn"} strict-scope=[${strictEntries.join(", ")}]`);
if (strict.missing.length) {
  for (const f of strict.missing)
    console.log(strictMode ? `[strict] ${f}  missing-file  "strict-scope file not found"` : `[note] strict-scope file not present yet: ${f}`);
}
report(strictMode ? "strict" : "warn", strict.violations);
if (future.violations.length || future.missing.length) {
  console.log(`-- future-scope debt watch (never fatal until promoted into SCOPE) --`);
  for (const f of future.missing) console.log(`[note] future-scope file not present yet: ${f}`);
  report("future", future.violations);
}

const strictCount = strict.violations.length + (strictMode ? strict.missing.length : 0);
console.log(
  `check-copy: ${strict.violations.length} strict-scope violation(s), ${future.violations.length} future-scope violation(s)`,
);

if (strictMode && strictCount > 0) {
  console.error(`check-copy: FAIL (strict) — ${strictCount} violation(s) in strict scope`);
  process.exit(1);
}
if (!strictMode && (strict.violations.length || future.violations.length)) {
  console.log(`check-copy: warn mode — violations reported above, exiting 0 (strict from S4)`);
}
process.exit(0);
