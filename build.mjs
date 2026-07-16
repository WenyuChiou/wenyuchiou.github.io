// build.mjs — S8 pipeline: client bundle → prerender (9 static routes) →
// sitemap.xml + robots.txt → content-hash stamping across ALL generated pages
// → fail-closed copy linter (strict, includes the built HTML).
//
// The browser never ships Babel and never touches a CDN: React + ReactDOM are
// bundled from node_modules. entry.jsx imports app.jsx, which imports
// { CONTENT } from content.js and { Icons } from icons.jsx as ES modules and
// mounts the PAGES registry onto #root (guarded so prerender can import it).
// template.html is the HTML source of truth; index.html and the 8 route files
// are GENERATED here. Run: npm run build
import esbuild from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { SEO } from "./seo.js";

// Copy linter strictness: strict since S4 — check-copy.mjs fails the build on
// any banned string, drifted canonical string, or leaked [CONFIRM] placeholder
// in its strict SCOPE (which includes template.html + **/index.html from S8).
const STRICT_COPY = true;

// --- 1. Client bundle (IIFE, production React, automatic JSX runtime).
await esbuild.build({
  entryPoints: ["entry.jsx"],
  bundle: true,
  format: "iife",
  outfile: "assets/app.bundle.js",
  minify: true,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  target: "es2019",
  legalComments: "none",
});

// Normalize CRLF→LF so the committed bytes (and their hash) are identical to
// what GitHub Pages serves, and stable if the repo is built on Linux/macOS too.
const out = readFileSync("assets/app.bundle.js", "utf8").replace(/\r\n/g, "\n");
writeFileSync("assets/app.bundle.js", out);
console.log(`Built assets/app.bundle.js — ${(out.length / 1024).toFixed(1)} KB`);

// --- 2. Prerender the 9 static routes from template.html (see prerender.mjs).
const pre = spawnSync(process.execPath, ["prerender.mjs"], { stdio: "inherit" });
if (pre.status !== 0) {
  console.error(`Build FAILED: prerender.mjs exited ${pre.status}`);
  process.exit(pre.status ?? 1);
}

// --- 3. sitemap.xml (all 9 routes, absolute URLs, PDFs excluded — IA §4.2.3)
// + robots.txt (allow all).
const locs = Object.values(SEO.routes).map((r) => r.canonical);
if (locs.length !== 9 || locs.some((u) => !/^https:\/\//.test(u))) {
  console.error(`Build FAILED: sitemap expects 9 absolute canonical URLs, got ${JSON.stringify(locs)}`);
  process.exit(1);
}
writeFileSync(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locs.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    "\n</urlset>\n",
);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SEO.siteUrl}/sitemap.xml\n`);
console.log(`Wrote sitemap.xml (${locs.length} URLs) + robots.txt`);

// --- 4. Cache-bust: stamp every generated page's asset refs with a content
// hash. Filenames are stable across builds, so without this GitHub Pages / the
// browser can serve a stale bundle for ~10min after a deploy. A content hash
// changes only when the file changes, so caches stay warm yet every deploy is
// picked up at once. Paths are root-absolute (template.html) on all routes.
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 8);
const bundleV = hash(out);
const cssV = hash(readFileSync("styles.css", "utf8").replace(/\r\n/g, "\n"));
const pages = Object.keys(SEO.routes).map((r) => (r === "/" ? "index.html" : r.slice(1) + "index.html"));
for (const p of pages) {
  const html = readFileSync(p, "utf8")
    .replace(/(href=")\/styles\.css(?:\?v=[a-f0-9]+)?(")/g, `$1/styles.css?v=${cssV}$2`)
    .replace(/(src=")\/assets\/app\.bundle\.js(?:\?v=[a-f0-9]+)?(")/g, `$1/assets/app.bundle.js?v=${bundleV}$2`);
  writeFileSync(p, html);
}
console.log(`Stamped ${pages.length} pages — styles.css?v=${cssV} · app.bundle.js?v=${bundleV}`);

// --- 5. Fail-closed copy linter (implementation-plan §1.4). Runs after
// bundle+prerender+stamp so the built HTML for all 9 routes is scanned too.
const check = spawnSync(
  process.execPath,
  ["scripts/check-copy.mjs", ...(STRICT_COPY ? ["--strict"] : [])],
  { stdio: "inherit" },
);
if (check.status !== 0) {
  console.error(`Build FAILED: check-copy.mjs exited ${check.status}`);
  process.exit(check.status ?? 1);
}
