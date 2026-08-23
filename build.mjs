import esbuild from "esbuild";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { SEO, LEGACY_REDIRECTS } from "./seo.js";

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
