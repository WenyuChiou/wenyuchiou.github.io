#!/usr/bin/env node
/* Renders the first page of a PDF to a WebP preview for the homepage's hover cards.
   Needs Poppler's pdftoppm on PATH (not a build dependency: previews are committed).
   Usage: node scripts/pdf-preview.mjs <file.pdf> <out.webp> [width=960] */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const [pdf, out, width = "960"] = process.argv.slice(2);
if (!pdf || !out || !Number.isInteger(+width) || +width < 200) { console.error("usage: pdf-preview.mjs <file.pdf> <out.webp> [width]"); process.exit(2); }
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-preview-")), stem = path.join(dir, "page");
execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-singlefile", "-png", "-scale-to-x", String(+width * 2), "-scale-to-y", "-1", pdf, stem], { stdio: "inherit" });
const info = await sharp(stem + ".png").resize({ width: +width }).webp({ quality: 82 }).toFile(out);
console.log(`${out}: ${info.width}x${info.height}, ${info.size} bytes`);
