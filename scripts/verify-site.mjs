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
    if (page.id !== "home" && !html.includes('"@type":"BreadcrumbList"')) errors.push(`${file}: missing BreadcrumbList JSON-LD`);
    if (html.includes("Research view") || html.includes("Industry view")) errors.push(`${file}: old identity toggle leaked`);
  }
}

const enKeys = Object.keys(CONTENT.en.caseStudies).sort().join(",");
const zhKeys = Object.keys(CONTENT["zh-TW"].caseStudies).sort().join(",");
if (enKeys !== zhKeys) errors.push(`case-study locale mismatch: en=${enKeys}; zh=${zhKeys}`);
if (CONTENT.en.observatory.stages.length !== 6 || CONTENT["zh-TW"].observatory.stages.length !== 6) errors.push("both locales must have six evidence stages");
if (CONTENT.en.articlesPage.articles.length !== 3 || CONTENT["zh-TW"].articlesPage.articles.length !== 3) errors.push("both locales must have three articles");
if (CONTENT.en.articlesPage.articles.map(({ slug }) => slug).join(",") !== CONTENT["zh-TW"].articlesPage.articles.map(({ slug }) => slug).join(",")) errors.push("article locale routes are not mirrored");
for (const file of ["index.html", "zh/index.html"]) {
  const html = readFileSync(file, "utf8");
  const visibleCopy = html.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
  if (["937 human profiles", "52,141 simulated households", "50 runs per", "937 份人類", "52,141 戶", "50 次模擬"].some((value) => visibleCopy.includes(value.toLowerCase()))) errors.push(`${file}: research scale leaked onto homepage`);
  for (const selectorCopy of ["selected-work", "decision-provenance", "open-source", "articles-preview-title", "contact"]) if (!html.includes(selectorCopy)) errors.push(`${file}: missing homepage section ${selectorCopy}`);
}
const recruiterFiles = ["hire/index.html", "zh/hire/index.html"];
for (const file of recruiterFiles) {
  const html = readFileSync(file, "utf8");
  for (const marker of ["hire-role-title", "hire-own-title", "hire-evidence-title", "hire-fit-title", "hire-availability-title", "hire-ask-title", "hire-contact-title"]) if (!html.includes(marker)) errors.push(`${file}: missing recruiter section ${marker}`);
  if (!html.includes('"@type":"WebPage"') || !html.includes('"@id":"https://wenyuchiou.github.io/#wenyu-chiou"')) errors.push(`${file}: recruiter identity JSON-LD is incomplete`);
  if (!html.includes('/assets/og/recruiter-brief.png')) errors.push(`${file}: missing recruiter social preview`);
  if (!html.includes("data-inline=\"true\"")) errors.push(`${file}: missing inline recruiter navigator`);
}
for (const marker of ["LangChain", "Model Context Protocol (MCP)", "Retrieval-Augmented Generation (RAG)", "Agent Skills", "OpenAI Codex", "Claude Code", "MATLAB", "Structural Equation Modeling (SEM)", "Agent-Based Modeling (ABM)", "Hydrological Modeling"]) if (!readFileSync("hire/index.html", "utf8").includes(marker)) errors.push(`hire/index.html: missing verified technical term ${marker}`);
for (const marker of ["LangChain", "Model Context Protocol, MCP", "Retrieval-Augmented Generation, RAG", "Agent Skills", "OpenAI Codex", "Claude Code", "MATLAB", "Structural Equation Modeling, SEM", "Agent-Based Modeling, ABM", "Hydrological Modeling"]) if (!readFileSync("zh/hire/index.html", "utf8").includes(marker)) errors.push(`zh/hire/index.html: missing verified technical term ${marker}`);
if (!existsSync("assets/og/recruiter-brief.png")) errors.push("missing recruiter social preview asset");
for (const file of ["about/index.html", "zh/about/index.html"]) {
  const html = readFileSync(file, "utf8");
  if (!html.includes('"@type":"ProfilePage"') || !html.includes('"@id":"https://wenyuchiou.github.io/#wenyu-chiou"')) errors.push(`${file}: ProfilePage identity JSON-LD is incomplete`);
}
for (const route of routes.filter(({ page }) => page.startsWith("article:"))) {
  const file = `${route.path.slice(1)}index.html`;
  const html = readFileSync(file, "utf8");
  if (!html.includes('"@type":"TechArticle"')) errors.push(`${file}: missing TechArticle JSON-LD`);
  if (!existsSync(route.ogImage.slice(1))) errors.push(`${file}: missing article social preview ${route.ogImage}`);
  if (!html.includes('class="article-byline"') || !html.includes('href="/about/"') && !html.includes('href="/zh/about/"')) errors.push(`${file}: missing visible author byline`);
}

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
