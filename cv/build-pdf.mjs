#!/usr/bin/env node
/**
 * build-pdf.mjs — CV/resume PDF pipeline (implementation-plan §2.2).
 *
 * Renders cv/academic.html and cv/resume.html to Letter-size PDFs via
 * puppeteer-core driving a locally installed Chromium.
 *
 * Browser resolution order (first hit wins):
 *   1. env CHROME_PATH (explicit override)
 *   2. Standard Windows Chrome paths:
 *        C:\Program Files\Google\Chrome\Application\chrome.exe
 *        C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
 *        %LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
 *   3. Microsoft Edge fallback:
 *        C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
 *        C:\Program Files\Microsoft\Edge\Application\msedge.exe
 *
 * Outputs (relative to this script's directory; override with --out-dir=<path>
 * or env OUT_DIR):
 *   ../assets/Wenyu_Chiou_Academic_CV.pdf
 *   ../assets/Wenyu_Chiou_AI_Research_Resume.pdf
 *
 * FAIL-CLOSED: before printing, both HTML sources are scanned for banned
 * strings (kill list, CONFIRM-gate leaks, status-inflation patterns). Any hit
 * aborts with a named-violation report and a nonzero exit. No scan pass, no PDF.
 *
 * Module resolution note: `puppeteer-core` is resolved normally; if it is not
 * installed next to this script, set env PUPPETEER_MODULE_DIR to a directory
 * whose node_modules contains puppeteer-core (useful for scratch installs).
 */

import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const outDirArg = process.argv.find((a) => a.startsWith('--out-dir='));
const OUT_DIR = path.resolve(
  __dirname,
  outDirArg ? outDirArg.split('=').slice(1).join('=') : process.env.OUT_DIR || '../assets'
);

const DOCS = [
  {
    name: 'Academic CV',
    src: path.join(__dirname, 'academic.html'),
    out: path.join(OUT_DIR, 'Wenyu_Chiou_Academic_CV.pdf'),
    pageRule: { kind: 'min', pages: 2, label: 'CV must be >= 2 pages' },
  },
  {
    name: 'AI Research Resume',
    src: path.join(__dirname, 'resume.html'),
    out: path.join(OUT_DIR, 'Wenyu_Chiou_AI_Research_Resume.pdf'),
    pageRule: { kind: 'max', pages: 2, label: 'resume must be <= 2 pages' },
  },
];

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe')
    : null,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

function resolveBrowser() {
  if (process.env.CHROME_PATH) {
    if (fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
    fail(`CHROME_PATH is set but does not exist: ${process.env.CHROME_PATH}`);
  }
  for (const candidate of CHROME_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Fail-closed banned-string scan (runs BEFORE any printing)
// ---------------------------------------------------------------------------

// Any CJK codepoint (Han incl. U+90B1, kana, hangul, CJK punctuation, fullwidth forms).
const CJK_RE = new RegExp(
  '[\u2E80-\u2EFF\u3000-\u303F\u3040-\u30FF\u3130-\u318F' +
    '\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF' +
    '\uFF01-\uFF60\uFFE0-\uFFE6]'
);

const ALLOWED_EMAIL = 'wec324@lehigh.edu';

/** Each check: { name, test(html) -> violation message | null } */
const CHECKS = [
  literal('[CONFIRM leak', '[CONFIRM'),
  {
    name: 'WRR status inflation ("under review" within 200 chars of 2025WR042111)',
    test(html) {
      const idsRe = /2025WR042111/g;
      const urRe = /under\s+review/gi;
      const ids = [...html.matchAll(idsRe)].map((m) => m.index);
      const urs = [...html.matchAll(urRe)].map((m) => m.index);
      for (const i of ids) {
        for (const j of urs) {
          const gap = j > i ? j - (i + '2025WR042111'.length) : i - (j + 'under review'.length);
          // Excused only when an explicit "published" label sits between the
          // DOI and the match (mirrors scripts/check-copy.mjs) - a mislabeled
          // citation has no intervening Published label. Fail-closed otherwise.
          const lo = Math.min(i, j);
          const hi = Math.max(i, j);
          const excused = /published/i.test(html.slice(lo, hi));
          if (gap < 200 && !excused) return `distance ${gap} chars (index ${i} vs ${j}, no intervening Published label)`;
        }
      }
      return null;
    },
  },
  regex('stale star count "1.8k"', /1\.8k/i),
  regex('unverifiable multiplier "6–7"', /6[–-]7/),
  literal('falsified CI-gate claim ("gates in CI")', 'gates in CI'),
  regex('banned word "innovative"', /\binnovative\b/i),
  regex('banned word "visionary"', /\bvisionary\b/i),
  regex('banned word "expert"', /\bexpert/i),
  regex('banned word "cutting-edge"', /cutting[\s-]edge/i),
  regex('banned word "passionate"', /\bpassionate\b/i),
  literal('second gmail handle "wenyuchiou12"', 'wenyuchiou12'),
  {
    name: 'CJK codepoint (incl. 邱) — English-only surfaces',
    test(html) {
      const m = html.match(CJK_RE);
      return m ? `found ${JSON.stringify(m[0])} (U+${m[0].codePointAt(0).toString(16).toUpperCase()})` : null;
    },
  },
  regex('graduation-year leak "2024–2027"', /2024[–-]2027/),
  literal('graduation-year leak "May 2028"', 'May 2028'),
  regex('graduation-year leak "2028" (outside canonical expected-2028)', /(?<!expected )2028/i),
  {
    name: 'second email address (only wec324@lehigh.edu allowed)',
    test(html) {
      const emails = html.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
      const others = [...new Set(emails.filter((e) => e.toLowerCase() !== ALLOWED_EMAIL))];
      return others.length ? `found ${others.join(', ')}` : null;
    },
  },
  literal('wrong center name ("Center of Catastrophe")', 'Center of Catastrophe'),
  // Extra kill-list guards from implementation-plan §1.4 (cannot false-positive here):
  regex('uncited "first framework" superlative', /first (framework|governed|coupled)/i),
  literal('unverifiable "token saving" multiplier', 'token saving'),
  literal('star glyph', '★'),
  literal('buymeacoffee link', 'buymeacoffee'),
  literal('dead lane "gemini-delegate"', 'gemini-delegate'),
  regex('unevidenced skill chip (PyTorch/FastAPI/World Models)', /PyTorch|FastAPI|World Models/),
];

function literal(name, needle) {
  return {
    name,
    test: (html) => (html.includes(needle) ? `literal ${JSON.stringify(needle)} present` : null),
  };
}

function regex(name, re) {
  return {
    name,
    test: (html) => {
      const m = html.match(re);
      return m ? `pattern ${re} matched ${JSON.stringify(m[0])}` : null;
    },
  };
}

function scanSources() {
  const violations = [];
  for (const doc of DOCS) {
    if (!fs.existsSync(doc.src)) {
      violations.push({ file: doc.src, name: 'missing source file', detail: 'file not found' });
      continue;
    }
    const html = fs.readFileSync(doc.src, 'utf8');
    for (const check of CHECKS) {
      const detail = check.test(html);
      if (detail) violations.push({ file: path.basename(doc.src), name: check.name, detail });
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// PDF page counting (heuristic on the emitted PDF bytes)
// ---------------------------------------------------------------------------

function countPdfPages(buffer) {
  const text = buffer.toString('latin1');
  const pageObjects = (text.match(/\/Type\s*\/Page(?![s])/g) || []).length;
  if (pageObjects > 0) return pageObjects;
  const counts = [...text.matchAll(/\/Count\s+(\d+)/g)].map((m) => parseInt(m[1], 10));
  return counts.length ? Math.max(...counts) : 0;
}

// ---------------------------------------------------------------------------
// Puppeteer loading (normal resolution, then PUPPETEER_MODULE_DIR fallback)
// ---------------------------------------------------------------------------

async function loadPuppeteer() {
  try {
    return (await import('puppeteer-core')).default;
  } catch (primaryErr) {
    const dir = process.env.PUPPETEER_MODULE_DIR;
    if (dir) {
      const req = createRequire(path.join(dir, 'noop.js'));
      const resolved = req.resolve('puppeteer-core');
      return (await import(pathToFileURL(resolved).href)).default;
    }
    throw primaryErr;
  }
}

function fail(msg) {
  console.error(`\nFAIL: ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Fail-closed scan — no pass, no print.
  const violations = scanSources();
  if (violations.length) {
    console.error('\nBANNED-STRING SCAN FAILED — refusing to emit PDFs.\n');
    for (const v of violations) {
      console.error(`  [${v.file}] ${v.name}\n      ${v.detail}`);
    }
    process.exit(1);
  }
  console.log('Banned-string scan: PASS (both HTML sources clean).');

  // 2. Resolve browser.
  const executablePath = resolveBrowser();
  if (!executablePath) {
    fail(
      'No local Chrome/Edge found. Set CHROME_PATH or install Chrome/Edge.\nSearched:\n  ' +
        CHROME_CANDIDATES.join('\n  ')
    );
  }
  console.log(`Browser: ${executablePath}`);

  // 3. Print.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch({ executablePath, headless: true });
  const results = [];
  try {
    for (const doc of DOCS) {
      const page = await browser.newPage();
      await page.goto(pathToFileURL(doc.src).href, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: doc.out,
        format: 'Letter',
        preferCSSPageSize: true,
        printBackground: true,
      });
      await page.close();
      const pages = countPdfPages(fs.readFileSync(doc.out));
      results.push({ ...doc, pages });
      console.log(`Emitted: ${doc.out} (${pages} page${pages === 1 ? '' : 's'})`);
    }
  } finally {
    await browser.close();
  }

  // 4. Page-count assertions (implementation-plan §2.5).
  const pageFailures = results.filter((r) =>
    r.pageRule.kind === 'min' ? r.pages < r.pageRule.pages : r.pages > r.pageRule.pages
  );
  if (pageFailures.length) {
    for (const f of pageFailures) {
      console.error(`PAGE-COUNT VIOLATION: ${f.name} has ${f.pages} pages — ${f.pageRule.label}.`);
    }
    process.exit(1);
  }
  console.log('Page-count checks: PASS.');
}

main().catch((err) => fail(err && err.stack ? err.stack : String(err)));
