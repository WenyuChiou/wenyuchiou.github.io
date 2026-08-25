#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { SEO } from "../seo.js";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, "").split("=");
  return [key, value.join("=") || true];
}));
const root = process.cwd();
const outDir = path.resolve(String(args.out || "screenshots"));
const routes = args.routes ? String(args.routes).split(",") : Object.keys(SEO.routes);
const fullPage = args.full !== "false";
const browserCandidates = [process.env.CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe") : null].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error("Chrome not found; set CHROME_PATH");

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2" };
let server;
let baseUrl = args.base ? String(args.base).replace(/\/$/, "") : "";
if (!baseUrl) {
  server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (!relative || relative.endsWith("/")) relative += "index.html";
    const file = path.resolve(root, relative);
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

const viewports = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  tablet: { width: 768, height: 800, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 1 },
  "narrow-mobile": { width: 360, height: 800, deviceScaleFactor: 1 },
};
const themes = ["light", "dark"];
const browser = await puppeteer.launch({ executablePath, headless: true });
let count = 0;
try {
  for (const theme of themes) {
    for (const [mode, viewport] of Object.entries(viewports)) {
      fs.mkdirSync(path.join(outDir, theme, mode), { recursive: true });
      for (const route of routes) {
        const page = await browser.newPage();
        await page.setViewport(viewport);
        await page.evaluateOnNewDocument((selectedTheme) => localStorage.setItem("wy-theme", selectedTheme), theme);
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle0", timeout: 60_000 });
        if (!response || response.status() >= 400) throw new Error(`${route} returned HTTP ${response?.status()}`);
        await page.evaluate(() => document.fonts.ready);
        if (fullPage) await page.evaluate(async () => {
          const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          for (let top = 0; top < document.documentElement.scrollHeight; top += Math.max(320, window.innerHeight * 0.8)) {
            window.scrollTo({ top, behavior: "instant" });
            await pause(70);
          }
          window.scrollTo({ top: 0, behavior: "instant" });
          await pause(140);
        });
        const name = route === "/" ? "home" : route.replace(/^\//, "").replace(/\/$/, "").replaceAll("/", "--");
        await page.screenshot({ path: path.join(outDir, theme, mode, `${name}.jpg`), type: "jpeg", quality: 82, fullPage });
        await page.close();
        count += 1;
      }
    }
  }
} finally {
  await browser.close();
  server?.close();
}
console.log(`capture-screenshots: wrote ${count} images to ${outDir}`);
