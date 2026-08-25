import esbuild from "esbuild";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import { SEO, LEGACY_REDIRECTS } from "./seo.js";
import { FEATURE_CONTENT } from "./feature-content.js";

const escapeSvg = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const titleLines = {
  "evaluating-llm-agents-against-measured-human-behavior": ["Evaluating LLM Agents", "Against Measured", "Human Behavior"],
  "why-governed-agents-need-validators-before-state-changes": ["Why Governed Agents", "Need Validators Before", "State Changes"],
  "from-individual-decisions-to-system-consequences": ["From Individual Decisions", "to System Consequences"],
};

mkdirSync("assets/og", { recursive: true });
for (const article of FEATURE_CONTENT.en.articlesPage.articles) {
  const lines = titleLines[article.slug];
  const title = lines.map((line, index) => `<text x="92" y="${250 + index * 92}" class="title">${escapeSvg(line)}</text>`).join("");
  const graphic = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#10201b"/><path d="M92 104H1108" stroke="#5ea99f" stroke-width="3"/><text x="92" y="162" class="meta">WENYU CHIOU · ARTICLES</text>${title}<circle cx="988" cy="426" r="78" fill="none" stroke="#5ea99f" stroke-width="3"/><path d="M862 426H1114M988 300V552" stroke="#d8ece7" stroke-width="2"/><text x="92" y="570" class="foot">LLM evaluation · agent governance · behavioral simulation</text><style>.meta,.foot{font-family:Arial,sans-serif;fill:#9fd5cd;font-size:24px;font-weight:700}.title{font-family:Georgia,serif;fill:#f3f8f5;font-size:68px;font-weight:600}.foot{font-size:21px;font-weight:400;fill:#c6d5d0}</style></svg>`;
  await sharp(Buffer.from(graphic)).png({ compressionLevel: 9 }).toFile(`assets/og/${article.slug}.png`);
}

const VENDOR_ASSETS = {
  "assets/vendor/transformers-4.2.0.mjs": "034dbecc87ac928f6f9eeb254ffe44f49757c1e5bfda1736fdaff6950e602db4",
  "assets/vendor/onnxruntime/ort-wasm-simd-threaded.asyncify.mjs": "5959c6733039619c9af710d8e1bae8d6e84402787990637be987c2b1bd6c5fa9",
  "assets/vendor/onnxruntime/ort-wasm-simd-threaded.asyncify.wasm": "e0c0c6d3e73d43b8a249972f8358f845b08cc16fec3c80efafdf8bed40366786",
};
for (const [file, expected] of Object.entries(VENDOR_ASSETS)) {
  const actual = createHash("sha256").update(readFileSync(file)).digest("hex");
  if (actual !== expected) throw new Error(`Vendor integrity check failed for ${file}`);
}

await esbuild.build({
  entryPoints: ["entry.jsx"],
  bundle: true,
  format: "iife",
  outfile: "assets/app.bundle.js",
  minify: true,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  target: "es2020",
  legalComments: "none",
});

const bundle = readFileSync("assets/app.bundle.js", "utf8").replace(/\r\n/g, "\n");
writeFileSync("assets/app.bundle.js", bundle);
console.log(`Built assets/app.bundle.js — ${(bundle.length / 1024).toFixed(1)} KB`);

const prerender = spawnSync(process.execPath, ["prerender.mjs"], { stdio: "inherit" });
if (prerender.status !== 0) process.exit(prerender.status ?? 1);

const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const routeValues = Object.values(SEO.routes);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...routeValues.map((route) => {
    const en = route.locale === "en" ? route.canonical : route.alternate;
    const zh = route.locale === "zh-TW" ? route.canonical : route.alternate;
    return `  <url><loc>${escapeXml(route.canonical)}</loc><lastmod>${route.lastModified}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}"/><xhtml:link rel="alternate" hreflang="zh-Hant-TW" href="${escapeXml(zh)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(route.xDefault)}"/></url>`;
  }),
  "</urlset>",
  "",
].join("\n");
writeFileSync("sitemap.xml", sitemap);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SEO.siteUrl}/sitemap.xml\n`);

const redirectHtml = (target) => `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${SEO.siteUrl}${target}"><title>Moved — Wenyu Chiou</title></head><body><p>This page moved to <a href="${target}">${target}</a>.</p></body></html>\n`;
for (const [from, target] of Object.entries(LEGACY_REDIRECTS)) {
  const relative = `${from.slice(1)}index.html`;
  mkdirSync(path.dirname(relative), { recursive: true });
  writeFileSync(relative, redirectHtml(target));
}

const hash = (value) => createHash("sha256").update(value).digest("hex").slice(0, 8);
const bundleHash = hash(bundle);
const cssHash = hash(readFileSync("styles.css", "utf8").replace(/\r\n/g, "\n"));
const generatedPages = [...routeValues.map((route) => route.path === "/" ? "index.html" : `${route.path.slice(1)}index.html`), ...Object.keys(LEGACY_REDIRECTS).map((route) => `${route.slice(1)}index.html`)];
for (const page of generatedPages) {
  const html = readFileSync(page, "utf8")
    .replace(/(href=")\/styles\.css(?:\?v=[a-f0-9]+)?(")/g, `$1/styles.css?v=${cssHash}$2`)
    .replace(/(src=")\/assets\/app\.bundle\.js(?:\?v=[a-f0-9]+)?(")/g, `$1/assets/app.bundle.js?v=${bundleHash}$2`);
  writeFileSync(page, html);
}
console.log(`Stamped ${generatedPages.length} pages; wrote sitemap.xml (${routeValues.length} URLs) and redirects (${Object.keys(LEGACY_REDIRECTS).length})`);

for (const script of [["scripts/verify-site.mjs"], ["scripts/check-copy.mjs", "--strict"]]) {
  const result = spawnSync(process.execPath, script, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
