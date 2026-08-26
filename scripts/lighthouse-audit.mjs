#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createGzip } from "node:zlib";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, "").split("=");
  return [key, value.join("=") || true];
}));
const root = process.cwd();
let baseUrl = args.base ? String(args.base).replace(/\/$/, "") : "";
const outDir = path.resolve(String(args.out || "lighthouse-results"));
const port = Number(args.port || 9224);
const browserCandidates = [process.env.CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe") : null].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error("Chrome not found; set CHROME_PATH");
fs.mkdirSync(outDir, { recursive: true });

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2" };
const compressible = new Set([".html", ".css", ".js", ".json", ".svg"]);
let server;
if (!baseUrl) {
  server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (!relative || relative.endsWith("/")) relative += "index.html";
    const file = path.resolve(root, relative);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    const extension = path.extname(file);
    const gzip = compressible.has(extension) && /\bgzip\b/.test(request.headers["accept-encoding"] || "");
    response.writeHead(200, { "Content-Type": types[extension] || "application/octet-stream", "Cache-Control": "no-store", "Vary": "Accept-Encoding", ...(gzip ? { "Content-Encoding": "gzip" } : {}) });
    const stream = fs.createReadStream(file);
    if (gzip) stream.pipe(createGzip()).pipe(response);
    else stream.pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

async function launchChrome(runPort, name) {
  const profile = path.join(outDir, `chrome-profile-${name}-${Date.now()}`);
  const chrome = spawn(executablePath, ["--headless=new", `--remote-debugging-port=${runPort}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-extensions", "about:blank"], { stdio: "ignore" });
  const versionUrl = `http://127.0.0.1:${runPort}/json/version`;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      if ((await fetch(versionUrl)).ok) return chrome;
    } catch {
      if (attempt === 49) throw new Error(`Chrome DevTools endpoint did not start for ${name}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return chrome;
}

const configuredRuns = [
  { name: "en-mobile", route: "/" },
  { name: "zh-mobile", route: "/zh/" },
  { name: "en-desktop", route: "/", config: desktopConfig },
  { name: "zh-desktop", route: "/zh/", config: desktopConfig },
  { name: "en-hire-mobile", route: "/hire/" },
  { name: "zh-hire-mobile", route: "/zh/hire/" },
];
const requestedRuns = args.runs ? new Set(String(args.runs).split(",")) : null;
const runs = requestedRuns ? configuredRuns.filter((run) => requestedRuns.has(run.name)) : configuredRuns;
if (!runs.length) throw new Error(`No Lighthouse runs matched --runs=${args.runs}`);
const summary = [];
try {
  for (const [index, run] of runs.entries()) {
    const runPort = port + index;
    const chrome = await launchChrome(runPort, run.name);
    try {
      const result = await lighthouse(`${baseUrl}${run.route}`, { port: runPort, logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] }, run.config);
      if (!result) throw new Error(`Lighthouse returned no result for ${run.name}`);
      fs.writeFileSync(path.join(outDir, `${run.name}.json`), JSON.stringify(result.lhr));
      const categories = result.lhr.categories;
      const scores = Object.fromEntries(Object.entries(categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
      const row = { run: run.name, ...scores, lcp: result.lhr.audits["largest-contentful-paint"].displayValue, cls: result.lhr.audits["cumulative-layout-shift"].displayValue, tbt: result.lhr.audits["total-blocking-time"].displayValue };
      summary.push(row);
      console.log(row);
    } finally {
      chrome.kill();
    }
  }
} finally {
  server?.close();
}
fs.writeFileSync(path.join(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
if (summary.some((run) => run.performance < 90 || run.accessibility < 95 || run["best-practices"] < 95 || run.seo < 95)) process.exit(1);
console.log(`lighthouse-audit: ${summary.length} runs met the configured score gates`);
