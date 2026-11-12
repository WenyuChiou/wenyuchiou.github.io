#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { SEO } from "../seo.js";
import { CONTENT, PAGE_DEFINITIONS, localizedPath } from "../content.js";

const errors = [];
const githubData = JSON.parse(readFileSync("data/github.json", "utf8"));
const HOME_REPOS = ["awesome-agentic-ai-zh", "ai-research-skills", "academic-writing-skills", "zotero-skills", "research-hub", "codex-delegate", "agent-board", "agent-collab-skills"];
for (const name of HOME_REPOS) if (!Number.isInteger(githubData.repositories[name]?.stars)) errors.push(`data/github.json: no star count for ${name}`);
const year = existsSync("assets/commit-maps/year.json") ? JSON.parse(readFileSync("assets/commit-maps/year.json", "utf8")) : null;
if (!year || year.days?.length !== 365 || year.days.some(([date, count]) => !/^\d{4}-\d\d-\d\d$/.test(date) || !Number.isInteger(count) || count < 0)) errors.push("assets/commit-maps/year.json: expected 365 [date, count] days");
for (const file of ["assets/commit-maps/activity-dam.svg", "assets/commit-maps/activity-snake.svg"]) if (!existsSync(file) || !readFileSync(file, "utf8").startsWith("<svg")) errors.push(`${file}: missing or not an SVG`);
const assetVersion = (file) => createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);
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
    if (!html.includes(`<html lang="${expectedLang}" data-lang="${locale === "en" ? "en" : "zh"}" data-theme="dark">`)) errors.push(`${file}: wrong lang`);
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
if (routes.some(({ page }) => page === "articles" || page.startsWith("article:"))) errors.push("withdrawn generated articles must not be indexed");
for (const file of ["index.html", "zh/index.html"]) {
  const html = readFileSync(file, "utf8");
  const visibleCopy = html.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
  if (["937 human profiles", "52,141 simulated households", "50 runs per", "937 份人類", "52,141 戶", "50 次模擬"].some((value) => visibleCopy.includes(value.toLowerCase()))) errors.push(`${file}: research scale leaked onto homepage`);
  for (const id of ["research", "cv", "projects", "activity", "contact", "act5", "main"]) if (!html.includes(` id="${id}"`)) errors.push(`${file}: missing homepage section ${id}`);
  /* the page's Content-Security-Policy blocks inline styles and inline scripts other than the hashed ones */
  if (/\sstyle="/.test(html)) errors.push(`${file}: inline style attribute on the homepage`);
  if (html.includes(file === "index.html" ? '<span class="zh">' : '<span class="en">')) errors.push(`${file}: the other language leaked onto the page`);
  if (/WAGF/i.test(visibleCopy)) errors.push(`${file}: unreleased project named on the homepage`);
  for (const asset of ["assets/home/home.css", "assets/home/home.js"]) {
    if (!existsSync(asset)) { errors.push(`missing ${asset}`); continue; }
    if (!html.includes(`/${asset}?v=${assetVersion(asset)}"`)) errors.push(`${file}: ${asset} is stale or not linked; run npm run build`);
  }
  for (const [name, repo] of Object.entries(githubData.repositories)) if (HOME_REPOS.includes(name) && !html.includes(`<b>${repo.stars.toLocaleString("en-US")}</b>`)) errors.push(`${file}: star count for ${name} does not match data/github.json`);
  /* the daily job rewrites year.json without rebuilding the pages, so the page's own copy may be older; it still has to be a full year */
  const builtDays = html.match(/data-days='([^']+)'/)?.[1];
  let days = null; try { days = JSON.parse(builtDays); } catch { /* reported below */ }
  if (!Array.isArray(days) || days.length !== 365 || days.some(([date, count]) => !/^\d{4}-\d\d-\d\d$/.test(date) || !Number.isInteger(count) || count < 0)) errors.push(`${file}: the homepage's built-in commit data is not 365 valid days`);
  else if (year && days.at(-1)[0] > year.days.at(-1)[0]) errors.push(`${file}: the homepage's commit data is newer than assets/commit-maps/year.json`);
  if (!/connect-src [^;]*https:\/\/raw\.githubusercontent\.com\/WenyuChiou\/wenyuchiou\.github\.io\/standalone-portfolio\/assets\/commit-maps\/year\.json[ ;]/.test(html)) errors.push(`${file}: the homepage policy does not allow reading the daily commit data`);
}
const recruiterFiles = ["hire/index.html", "zh/hire/index.html"];
for (const file of recruiterFiles) {
  const html = readFileSync(file, "utf8");
  for (const marker of ["hire-role-title", "hire-own-title", "hire-evidence-title", "hire-fit-title", "hire-availability-title", "fit-explorer-title", "hire-contact-title"]) if (!html.includes(marker)) errors.push(`${file}: missing recruiter section ${marker}`);
  if (!html.includes('"@type":"WebPage"') || !html.includes('"@id":"https://wenyuchiou.github.io/#wenyu-chiou"')) errors.push(`${file}: recruiter identity JSON-LD is incomplete`);
  if (!html.includes('/assets/og/recruiter-brief.png')) errors.push(`${file}: missing recruiter social preview`);
  if (!html.includes("data-recruiter-fit-explorer=\"true\"") || !html.includes("data-fit-jd=\"true\"") || !html.includes("data-fit-role=\"true\"")) errors.push(`${file}: missing AI Recruiter Fit Explorer controls`);
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
