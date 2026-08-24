#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { SEO } from "../seo.js";
import { CONTENT } from "../content.js";

const strict = process.argv.includes("--strict");
const requirePdfs = process.argv.includes("--require-pdfs");
const sourceFiles = ["content.en.js", "content.zh-TW.js", "seo.js", "app.jsx", "template.html", "cv/academic.html", "cv/resume.html", "cv/academic.zh-TW.html", "cv/resume.zh-TW.html"];
const routeFiles = Object.keys(SEO.routes).map((route) => route === "/" ? "index.html" : `${route.slice(1)}index.html`);
const files = [...sourceFiles, ...routeFiles];
const banned = [
  { name: "human-comparison-reproduce", pattern: /\breproduc(?:e|es|ed|ing|tion)\b/giu },
  { name: "human-substitute", pattern: /stand in for real people|human[- ]equivalent|validated human substitute/giu },
  { name: "absolute-trust", pattern: /\b(?:safe|trustworthy|production-ready) agents?\b/giu },
  { name: "inflated-ai-copy", pattern: /\b(?:redefining|revolutionizing|at the forefront|unlocking|cutting-edge)\b/giu },
  { name: "stale-year", pattern: /expected 2028|expected 2027(?![^\n]{0,20}December)|May 2027/giu },
  { name: "stale-scale", pattern: /\b5K\+|700\+ forks|6\.1K\+/giu },
  { name: "private-email", pattern: /wenyuchiou12/giu },
  { name: "placeholder", pattern: /\[CONFIRM|\{\{[A-Z_]+\}\}/gu },
];

const failures = [];
for (const file of files) {
  if (!existsSync(file)) {
    failures.push(`${file}: missing`);
    continue;
  }
  const text = readFileSync(file, "utf8");
  for (const rule of banned) {
    if (file === "template.html" && rule.name === "placeholder") continue;
    rule.pattern.lastIndex = 0;
    for (const match of text.matchAll(rule.pattern)) failures.push(`${file}: ${rule.name}: ${match[0]}`);
  }
  const emails = [...text.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)].map((match) => match[0]);
  for (const email of emails) if (email.toLowerCase() !== "wec324@lehigh.edu") failures.push(`${file}: noncanonical email ${email}`);
}

const english = readFileSync("content.en.js", "utf8");
for (const required of ["937", "52,141", "50 stochastic runs per scenario", "2024–Dec 2027 (expected)"]) {
  if (!english.includes(required)) failures.push(`content.en.js: missing canonical evidence string: ${required}`);
}

for (const [locale, content] of Object.entries(CONTENT)) {
  const homepageIntroduction = JSON.stringify({
    hero: content.hero,
    expertise: content.expertise,
    flagship: content.flagship,
    observatory: content.observatory,
  });
  for (const metric of ["937", "52,141", "50 stochastic runs per scenario", "每情境 50 次模擬"]) {
    if (homepageIntroduction.includes(metric)) failures.push(`${locale}: homepage introduction contains research-scale metric: ${metric}`);
  }
}

const homepageScalePatterns = [
  { name: "937", pattern: /\b937\b/gu },
  { name: "52,141", pattern: /52(?:,)?141/gu },
  { name: "50 runs", pattern: /\b50\s+(?:stochastic\s+)?(?:runs?|realizations?)\b/giu },
  { name: "50 次模擬", pattern: /(?:每(?:個)?情境\s*)?50\s*次(?:隨機)?(?:模擬|實現)/gu },
];
for (const file of ["index.html", "zh/index.html"]) {
  const text = readFileSync(file, "utf8");
  for (const rule of homepageScalePatterns) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(text)) failures.push(`${file}: homepage contains research-scale metric: ${rule.name}`);
  }
}

const pdfFiles = [
  "assets/Wenyu_Chiou_Industry_Resume_EN.pdf",
  "assets/Wenyu_Chiou_Industry_Resume_zh-TW.pdf",
  "assets/Wenyu_Chiou_Academic_CV_EN.pdf",
  "assets/Wenyu_Chiou_Academic_CV_zh-TW.pdf",
];
const pdfTool = spawnSync("pdftotext", ["-v"], { encoding: "utf8" });
if (!pdfTool.error) {
  for (const file of pdfFiles) {
    if (!existsSync(file)) {
      if (requirePdfs) failures.push(`${file}: missing`);
      else console.warn(`check-copy: ${file} not generated yet; PDF scan deferred`);
      continue;
    }
    const result = spawnSync("pdftotext", [file, "-"], { encoding: "utf8" });
    if (result.status !== 0) failures.push(`${file}: pdftotext failed`);
    else {
      for (const rule of banned.slice(0, 7)) {
        rule.pattern.lastIndex = 0;
        const match = rule.pattern.exec(result.stdout);
        if (match) failures.push(`${file}: ${rule.name}: ${match[0]}`);
      }
    }
  }
} else {
  console.warn("check-copy: pdftotext unavailable; PDF text scan skipped");
}

if (failures.length) {
  console.error(`check-copy: ${failures.length} violation(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  if (strict) process.exit(1);
} else console.log(`check-copy: 0 violations across ${files.length} text surfaces and ${pdfFiles.length} PDFs`);
