#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { SEO } from "../seo.js";
import { CONTENT, PAGE_DEFINITIONS, localizedPath } from "../content.js";

const errors = [];
const githubData = JSON.parse(readFileSync("data/github.json", "utf8"));
const previewEntries = Object.entries(githubData.repositories).filter(([, repo]) => repo.previewUrl);
if (!previewEntries.length) errors.push("GitHub snapshot has no custom repository social previews");
const expectedPreviewAssets = new Set(previewEntries.map(([, repo]) => repo.previewUrl.slice(1)));
for (const [name, repo] of previewEntries) {
  const source = new URL(repo.previewSourceUrl);
  if (!repo.previewUrl.startsWith("/assets/github/") || !existsSync(repo.previewUrl.slice(1))) errors.push(`${name}: missing local repository preview asset`);
  if (source.protocol !== "https:" || source.hostname !== "repository-images.githubusercontent.com") errors.push(`${name}: invalid custom repository preview source URL`);
}
for (const entry of existsSync("assets/github") ? readdirSync("assets/github", { withFileTypes: true }) : []) {
  const assetPath = `assets/github/${entry.name}`;
  if (entry.isFile() && entry.name.endsWith(".webp") && !expectedPreviewAssets.has(assetPath)) errors.push(`${assetPath}: orphaned repository preview asset`);
}
const routes = Object.values(SEO.routes);
if (routes.length !== PAGE_DEFINITIONS.length * 2) errors.push(`expected ${PAGE_DEFINITIONS.length * 2} routes, found ${routes.length}`);

for (const page of PAGE_DEFINITIONS) {
  for (const locale of ["en", "zh-TW"]) {
    const route = localizedPath(page.path, locale);
    const meta = SEO.routes[route];
    if (!meta) { errors.push(`missing metadata for ${route}`); continue; }
    const file = route === "/" ? "index.html" : `${route.slice(1)}index.html`;
    if (!existsSync(file)) { errors.push(`missing generated file ${file}`); continue; }
    const html = readFileSync(file, "utf8");
    const expectedLang = locale === "en" ? "en" : "zh-Hant-TW";
    if (!html.includes(`<html lang="${expectedLang}">`)) errors.push(`${file}: wrong lang`);
    if (!html.includes(`<link rel="canonical" href="${meta.canonical}">`)) errors.push(`${file}: missing canonical`);
    if (!html.includes(`data-page="${page.id}"`)) errors.push(`${file}: wrong page id`);
    if (!html.includes("<h1")) errors.push(`${file}: no h1`);
    if (!html.includes('hreflang="en"') || !html.includes('hreflang="zh-Hant-TW"')) errors.push(`${file}: incomplete hreflang`);
    if (html.includes("Research view") || html.includes("Industry view")) errors.push(`${file}: old identity toggle leaked`);
  }
}

const enKeys = Object.keys(CONTENT.en.caseStudies).sort().join(",");
const zhKeys = Object.keys(CONTENT["zh-TW"].caseStudies).sort().join(",");
if (enKeys !== zhKeys) errors.push(`case-study locale mismatch: en=${enKeys}; zh=${zhKeys}`);
if (CONTENT.en.observatory.stages.length !== 6 || CONTENT["zh-TW"].observatory.stages.length !== 6) errors.push("both locales must have six evidence stages");

const sitemap = existsSync("sitemap.xml") ? readFileSync("sitemap.xml", "utf8") : "";
for (const route of routes) {
  if (!sitemap.includes(`<loc>${route.canonical}</loc>`)) errors.push(`sitemap missing ${route.canonical}`);
  if (!sitemap.includes(`<lastmod>${route.lastModified}</lastmod>`)) errors.push(`sitemap missing lastmod for ${route.canonical}`);
}

if (errors.length) {
  console.error(`verify-site: ${errors.length} error(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`verify-site: ${routes.length} routes, locale parity, metadata, sitemap, and h1 checks passed`);
