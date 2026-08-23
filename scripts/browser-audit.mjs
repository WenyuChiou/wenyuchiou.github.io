#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import axe from "axe-core";
import { SEO } from "../seo.js";

const root = process.cwd();
const browserCandidates = [process.env.CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe") : null, "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium"].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error("browser-audit: Chrome/Edge not found; set CHROME_PATH");

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".pdf": "application/pdf", ".woff2": "font/woff2" };
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!relative || relative.endsWith("/")) relative += "index.html";
  const file = path.resolve(root, relative);
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
  response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const browser = await puppeteer.launch({ executablePath, headless: true });
const failures = [];
try {
  for (const route of Object.keys(SEO.routes)) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    const consoleErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    const response = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle0" });
    if (!response || response.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(async () => window.axe.run(document, { resultTypes: ["violations"] }));
    for (const violation of result.violations) failures.push(`${route}: axe ${violation.id} (${violation.impact}) on ${violation.nodes.length} node(s): ${violation.nodes.map((node) => node.target.join(" ")).join("; ")}`);
    const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - window.innerWidth, h1: document.querySelectorAll("h1").length, undersized: [...document.querySelectorAll(".button,.icon-button,.locale-link,summary,.segmented-control button,.document-link,.icon-link")].filter((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return style.display !== "none" && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44); }).length }));
    if (layout.overflow > 1) failures.push(`${route}: horizontal overflow ${layout.overflow}px`);
    if (layout.h1 !== 1) failures.push(`${route}: expected 1 h1, found ${layout.h1}`);
    if (layout.undersized) failures.push(`${route}: ${layout.undersized} key target(s) below 44px`);
    for (const error of consoleErrors) failures.push(`${route}: console ${error}`);
    await page.close();
  }
  for (const route of ["/", "/zh/"]) {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    const response = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "load" });
    const staticState = await page.evaluate(() => ({ h1: document.querySelector("h1")?.textContent?.trim(), stages: document.querySelectorAll(".stage").length, links: document.querySelectorAll("a[href]").length }));
    if (!response || response.status() !== 200 || !staticState.h1 || staticState.stages !== 6 || staticState.links < 10) failures.push(`${route}: no-JavaScript fallback incomplete`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`browser-audit: ${failures.length} failure(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`browser-audit: ${Object.keys(SEO.routes).length} mobile routes passed axe, console, overflow, h1, target-size, and no-JavaScript checks`);
