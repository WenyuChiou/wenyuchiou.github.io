#!/usr/bin/env node
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const outArg = process.argv.find((arg) => arg.startsWith("--out-dir="));
const outDir = path.resolve(here, outArg ? outArg.slice("--out-dir=".length) : process.env.OUT_DIR || "../assets");
const docs = [
  { name: "Academic CV — English", src: "academic.html", out: "Wenyu_Chiou_Academic_CV_EN.pdf", locale: "en", min: 2, max: 4 },
  { name: "Industry Resume — English", src: "resume.html", out: "Wenyu_Chiou_Industry_Resume_EN.pdf", locale: "en", min: 1, max: 2 },
  { name: "Academic CV — Traditional Chinese", src: "academic.zh-TW.html", out: "Wenyu_Chiou_Academic_CV_zh-TW.pdf", locale: "zh-TW", min: 2, max: 4 },
  { name: "Industry Resume — Traditional Chinese", src: "resume.zh-TW.html", out: "Wenyu_Chiou_Industry_Resume_zh-TW.pdf", locale: "zh-TW", min: 1, max: 2 },
].map((doc) => ({ ...doc, src: path.join(here, doc.src), out: path.join(outDir, doc.out) }));

const browserCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe") : null,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error("No local Chrome or Edge found. Set CHROME_PATH.");

const banned = [
  /\[CONFIRM/giu,
  /\breproduc(?:e|es|ed|ing|tion)\b/giu,
  /stand in for real people|human[- ]equivalent|validated human substitute/giu,
  /expected 2028|May 2027|\b5K\+|700\+ forks/giu,
  /\b(?:redefining|revolutionizing|at the forefront|unlocking|cutting-edge)\b/giu,
  /wenyuchiou12/giu,
];
const cjk = /[\u2e80-\u2eff\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff01-\uff60]/u;
for (const doc of docs) {
  if (!fs.existsSync(doc.src)) throw new Error(`Missing source: ${doc.src}`);
  const html = fs.readFileSync(doc.src, "utf8");
  for (const pattern of banned) {
    pattern.lastIndex = 0;
    const match = pattern.exec(html);
    if (match) throw new Error(`${doc.name}: banned copy ${JSON.stringify(match[0])}`);
  }
  if (doc.locale === "en" && cjk.test(html)) throw new Error(`${doc.name}: CJK text found on English surface`);
  const emails = html.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
  if (emails.some((email) => email.toLowerCase() !== "wec324@lehigh.edu")) throw new Error(`${doc.name}: noncanonical email found`);
}
console.log(`CV source scan: PASS (${docs.length} documents)`);

function countPages(buffer) {
  const text = buffer.toString("latin1");
  const pages = (text.match(/\/Type\s*\/Page(?![s])/g) || []).length;
  if (pages) return pages;
  return Math.max(0, ...[...text.matchAll(/\/Count\s+(\d+)/g)].map((match) => Number(match[1])));
}

fs.mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true });
try {
  for (const doc of docs) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(doc.src).href, { waitUntil: "networkidle0" });
    await page.pdf({ path: doc.out, format: "Letter", preferCSSPageSize: true, printBackground: true });
    await page.close();
    const count = countPages(fs.readFileSync(doc.out));
    if (count < doc.min || count > doc.max) throw new Error(`${doc.name}: ${count} pages; expected ${doc.min}–${doc.max}`);
    console.log(`Emitted ${path.basename(doc.out)} — ${count} page(s)`);
  }
} finally {
  await browser.close();
}

fs.copyFileSync(path.join(outDir, "Wenyu_Chiou_Academic_CV_EN.pdf"), path.join(outDir, "Wenyu_Chiou_Academic_CV.pdf"));
fs.copyFileSync(path.join(outDir, "Wenyu_Chiou_Industry_Resume_EN.pdf"), path.join(outDir, "Wenyu_Chiou_AI_Research_Resume.pdf"));
console.log("Legacy PDF aliases updated.");
