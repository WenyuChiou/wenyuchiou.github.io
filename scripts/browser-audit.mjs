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
const internalTargets = new Map();
const anchorTargets = new Map();
const origin = `http://127.0.0.1:${port}`;
const firstFoldSelectors = {
  home: ".proof-strip",
  work: ".flagship",
  research: "main > .section",
  publications: ".publication-groups",
  about: ".about-body img",
  "case:human-grounded-llm-evaluation": ".case-overview",
  "case:floodabm": ".case-overview",
  "case:wagf": ".case-overview",
};
const foldViewports = [
  ["narrow-mobile", { width: 360, height: 800, deviceScaleFactor: 1 }],
  ["mobile", { width: 390, height: 844, deviceScaleFactor: 1 }],
  ["mobile-boundary", { width: 620, height: 800, deviceScaleFactor: 1 }],
  ["tablet-lower-boundary", { width: 621, height: 800, deviceScaleFactor: 1 }],
  ["tablet", { width: 768, height: 800, deviceScaleFactor: 1 }],
  ["tablet-upper-boundary", { width: 980, height: 800, deviceScaleFactor: 1 }],
  ["desktop-lower-boundary", { width: 981, height: 800, deviceScaleFactor: 1 }],
  ["compact-desktop", { width: 1100, height: 800, deviceScaleFactor: 1 }],
  ["desktop", { width: 1440, height: 1000, deviceScaleFactor: 1 }],
];

const openPage = async (route, viewport = { width: 390, height: 844, deviceScaleFactor: 1 }) => {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle0" });
  if (!response || response.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
  return page;
};

const auditCaseControl = async (route, selector, expectedClass, resultSelector) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => localStorage.setItem("wy-theme", "dark"));
  const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle0" });
  if (!response || response.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
  const activeTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (activeTheme !== "dark") failures.push(`${route}: expected dark theme before axe, found ${activeTheme || "unset"}`);
  await page.addScriptTag({ content: axe.source });
  const axeResult = await page.evaluate(async () => window.axe.run(document, { resultTypes: ["violations"] }));
  for (const violation of axeResult.violations) failures.push(`${route}: dark-theme axe ${violation.id} (${violation.impact}) on ${violation.nodes.length} node(s)`);
  const initial = await page.$eval(resultSelector, (element) => element.textContent.trim());
  await page.focus(selector);
  await page.keyboard.press("Space");
  const state = await page.evaluate(({ selector, expectedClass, resultSelector }) => {
    const button = document.querySelector(selector);
    return {
      pressed: button?.getAttribute("aria-pressed"),
      classApplied: Boolean(document.querySelector(expectedClass)),
      result: document.querySelector(resultSelector)?.textContent.trim(),
    };
  }, { selector, expectedClass, resultSelector });
  if (state.pressed !== "true" || !state.classApplied || !state.result || state.result === initial) failures.push(`${route}: case control did not update its selected state, visual state, and explanation`);
  await page.close();
};

const auditEvidenceStage = async (route) => {
  const page = await openPage(route, { width: 1440, height: 1000, deviceScaleFactor: 1 });
  const initial = await page.evaluate(() => [...document.querySelectorAll(".stage")].map((stage) => stage.open));
  if (initial.filter(Boolean).length !== 1 || !initial[0]) failures.push(`${route}: evidence chain did not start with exactly the first chapter open`);
  const secondSummary = await page.$(".stage:nth-child(2) summary");
  if (!secondSummary) {
    failures.push(`${route}: second evidence-stage disclosure was not found`);
    await page.close();
    return;
  }
  await secondSummary.focus();
  await page.keyboard.press("Enter");
  await new Promise((resolve) => setTimeout(resolve, 700));
  const state = await page.evaluate(() => {
    const stages = [...document.querySelectorAll(".stage")];
    const second = stages[1]?.getBoundingClientRect();
    const header = document.querySelector(".site-header")?.getBoundingClientRect();
    return { open: stages.map((stage) => stage.open), secondTop: second?.top, headerBottom: header?.bottom };
  });
  if (state.open.filter(Boolean).length !== 1 || !state.open[1] || state.open[0]) failures.push(`${route}: evidence-stage switch did not leave exactly the second chapter open`);
  if (state.secondTop == null || state.headerBottom == null || state.secondTop < state.headerBottom || state.secondTop > state.headerBottom + 120) failures.push(`${route}: opened evidence chapter did not settle below the sticky header (${Math.round(state.secondTop)}px vs ${Math.round(state.headerBottom)}px)`);
  await page.close();
};

const auditMobileMenu = async (route) => {
  const page = await openPage(route);
  await page.click(".menu-button");
  const opened = await page.evaluate(() => {
    const button = document.querySelector(".menu-button");
    return {
      expanded: button?.getAttribute("aria-expanded"),
      label: button?.getAttribute("aria-label"),
      expectedLabel: button?.dataset.closeLabel,
      closeVisible: getComputedStyle(document.querySelector(".menu-close-icon")).display !== "none",
      navOpen: document.querySelector("#primary-navigation")?.classList.contains("is-open"),
    };
  });
  if (opened.expanded !== "true" || opened.label !== opened.expectedLabel || !opened.closeVisible || !opened.navOpen) failures.push(`${route}: mobile menu open state is incomplete`);
  await page.keyboard.press("Escape");
  const closed = await page.evaluate(() => {
    const button = document.querySelector(".menu-button");
    return { expanded: button?.getAttribute("aria-expanded"), focused: document.activeElement === button, navOpen: document.querySelector("#primary-navigation")?.classList.contains("is-open") };
  });
  if (closed.expanded !== "false" || !closed.focused || closed.navOpen) failures.push(`${route}: Escape did not close the mobile menu and restore focus`);
  await page.close();
};

try {
  for (const route of Object.keys(SEO.routes)) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    const consoleErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle0" });
    if (!response || response.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(async () => window.axe.run(document, { resultTypes: ["violations"] }));
    for (const violation of result.violations) failures.push(`${route}: axe ${violation.id} (${violation.impact}) on ${violation.nodes.length} node(s): ${violation.nodes.map((node) => node.target.join(" ")).join("; ")}`);
    const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - window.innerWidth, h1: document.querySelectorAll("h1").length, undersized: [...document.querySelectorAll(".button,.icon-button,.locale-link,summary,.segmented-control button,.document-link,.icon-link")].filter((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return style.display !== "none" && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44); }).length }));
    if (layout.overflow > 1) failures.push(`${route}: horizontal overflow ${layout.overflow}px`);
    if (layout.h1 !== 1) failures.push(`${route}: expected 1 h1, found ${layout.h1}`);
    if (layout.undersized) failures.push(`${route}: ${layout.undersized} key target(s) below 44px`);
    for (const [mode, viewport] of foldViewports) {
      await page.setViewport(viewport);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
      const fold = await page.evaluate((selector) => {
        const header = document.querySelector(".site-header")?.getBoundingClientRect();
        const h1 = document.querySelector("h1")?.getBoundingClientRect();
        const next = document.querySelector(selector)?.getBoundingClientRect();
        return { headerBottom: header?.bottom, h1Top: h1?.top, h1Bottom: h1?.bottom, nextTop: next?.top, overflow: document.documentElement.scrollWidth - window.innerWidth, viewportHeight: window.innerHeight };
      }, firstFoldSelectors[SEO.routes[route].page]);
      if (fold.h1Top < fold.headerBottom || fold.h1Bottom > fold.viewportHeight) failures.push(`${route}: ${mode} first viewport does not present the page heading clearly (heading ${Math.round(fold.h1Top)}–${Math.round(fold.h1Bottom)}px, header ${Math.round(fold.headerBottom)}px, viewport ${fold.viewportHeight}px)`);
      if (fold.nextTop == null || fold.nextTop >= fold.viewportHeight) failures.push(`${route}: ${mode} first viewport does not reveal the next content section (next ${Math.round(fold.nextTop)}px, viewport ${fold.viewportHeight}px)`);
      if (fold.overflow > 1) failures.push(`${route}: ${mode} has ${Math.round(fold.overflow)}px horizontal overflow`);
    }
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((link) => ({ href: link.getAttribute("href"), target: link.target, rel: link.rel })));
    const localePath = await page.$eval(".locale-link", (link) => new URL(link.href).pathname);
    const expectedLocalePath = new URL(SEO.routes[route].alternate).pathname;
    if (localePath !== expectedLocalePath) failures.push(`${route}: locale switch points to ${localePath}, expected ${expectedLocalePath}`);
    for (const link of links) {
      if (/^https?:/i.test(link.href) && !link.href.startsWith(SEO.siteUrl) && (link.target !== "_blank" || !link.rel.split(/\s+/).includes("noreferrer"))) failures.push(`${route}: external link missing target/rel safety: ${link.href}`);
      const target = new URL(link.href, `${origin}${route}`);
      if (target.origin !== origin && target.origin !== SEO.siteUrl) continue;
      internalTargets.set(target.pathname, route);
      if (target.hash) anchorTargets.set(`${target.pathname}${target.hash}`, route);
    }
    for (const error of consoleErrors) failures.push(`${route}: console ${error}`);
    await page.close();
  }

  for (const route of ["/", "/zh/", "/work/wagf/", "/zh/work/wagf/"]) await auditMobileMenu(route);

  const themePage = await openPage("/", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  await themePage.evaluate(() => localStorage.removeItem("wy-theme"));
  await themePage.click(".theme-button");
  const darkTheme = await themePage.evaluate(() => ({ theme: document.documentElement.dataset.theme, stored: localStorage.getItem("wy-theme"), sunVisible: getComputedStyle(document.querySelector(".theme-sun")).display !== "none" }));
  if (darkTheme.theme !== "dark" || darkTheme.stored !== "dark" || !darkTheme.sunVisible) failures.push("/: theme control did not apply and persist dark mode");
  await themePage.reload({ waitUntil: "networkidle0" });
  if (await themePage.evaluate(() => document.documentElement.dataset.theme) !== "dark") failures.push("/: saved theme did not survive reload");
  await themePage.close();

  for (const route of ["/", "/zh/"]) await auditEvidenceStage(route);

  for (const prefix of ["", "/zh"]) {
    await auditCaseControl(`${prefix}/work/human-grounded-llm-evaluation/`, ".segmented-control button:nth-child(3)", ".pathway-diagram.lens-renters", ".artifact-result");
    await auditCaseControl(`${prefix}/work/floodabm/`, ".segmented-control button:nth-child(2)", ".feedback-timeline.is-renter", ".artifact-result");
    await auditCaseControl(`${prefix}/work/wagf/`, ".segmented-control button:nth-child(2)", ".governance-trace.is-repaired", ".trace-result");
  }

  const reducedMotionPage = await browser.newPage();
  await reducedMotionPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await reducedMotionPage.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await reducedMotionPage.goto(`${origin}/`, { waitUntil: "networkidle0" });
  const reducedMotion = await reducedMotionPage.evaluate(() => {
    const toMilliseconds = (value) => value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
    const durations = [...document.querySelectorAll("*")].flatMap((element) => {
      const style = getComputedStyle(element);
      return [...style.animationDuration.split(","), ...style.transitionDuration.split(",")].map((value) => toMilliseconds(value.trim()));
    });
    return { maxDuration: Math.max(...durations), scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
  });
  if (reducedMotion.maxDuration > 0.1 || reducedMotion.scrollBehavior !== "auto") failures.push(`/: reduced-motion override incomplete (${reducedMotion.maxDuration}ms, scroll ${reducedMotion.scrollBehavior})`);
  await reducedMotionPage.close();

  for (const [pathname, source] of internalTargets) {
    const response = await fetch(`${origin}${pathname}`);
    if (!response.ok) failures.push(`${source}: internal target ${pathname} returned HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (pathname.toLowerCase().endsWith(".pdf")) {
      const signature = String.fromCharCode(...bytes.slice(0, 4));
      if (signature !== "%PDF") failures.push(`${source}: ${pathname} is not a valid PDF response`);
    }
  }

  for (const [target, source] of anchorTargets) {
    const url = new URL(target, origin);
    const page = await openPage(url.pathname);
    const exists = await page.evaluate((hash) => Boolean(document.getElementById(decodeURIComponent(hash.slice(1)))), url.hash);
    if (!exists) failures.push(`${source}: anchor target ${target} does not exist`);
    await page.close();
  }

  for (const route of Object.keys(SEO.routes)) {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    const response = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "load" });
    const staticState = await page.evaluate(() => ({ h1: document.querySelector("h1")?.textContent?.trim(), stages: document.querySelectorAll(".stage").length, artifacts: document.querySelectorAll(".interactive-artifact").length, links: document.querySelectorAll("a[href]").length }));
    const pageType = SEO.routes[route].page;
    if (!response || response.status() !== 200 || !staticState.h1 || staticState.links < 5 || (pageType === "home" && staticState.stages !== 6) || (pageType.startsWith("case:") && staticState.artifacts !== 1)) failures.push(`${route}: no-JavaScript fallback incomplete`);
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
console.log(`browser-audit: ${Object.keys(SEO.routes).length} localized routes passed accessibility, layout, navigation, theme, interaction, link, PDF, and no-JavaScript checks`);
