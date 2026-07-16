// Bundle the site into a single self-contained IIFE so the browser never
// ships Babel and never touches a CDN: React + ReactDOM are bundled from
// node_modules instead of loaded from unpkg. entry.jsx imports content.js /
// icons.jsx / covers.jsx (side effects: window.CONTENT / window.Icons /
// window.Covers) and then app.jsx, which reads them + renders.
// JSX uses the automatic runtime (react/jsx-runtime), so icons.jsx and
// covers.jsx need no explicit React import.
// Run: npm run build   (then commit assets/app.bundle.js)
import esbuild from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

await esbuild.build({
  entryPoints: ["entry.jsx"],
  bundle: true,
  format: "iife",
  outfile: "assets/app.bundle.js",
  minify: true,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' }, // production React build
  target: "es2019",
  legalComments: "none",
});

// Normalize CRLF→LF so the committed bytes (and their hash) are identical to
// what GitHub Pages serves, and stable if the repo is built on Linux/macOS too.
const out = readFileSync("assets/app.bundle.js", "utf8").replace(/\r\n/g, "\n");
writeFileSync("assets/app.bundle.js", out);
console.log(`Built assets/app.bundle.js — ${(out.length / 1024).toFixed(1)} KB`);

// Cache-bust: stamp index.html's asset refs with a content hash. The asset
// filenames are stable across builds, so without this GitHub Pages / the browser
// can serve a stale bundle for ~10min after a deploy. A content hash changes only
// when the file changes, so caches stay warm yet every deploy is picked up at once.
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 8);
const bundleV = hash(out);
const cssV = hash(readFileSync("styles.css", "utf8").replace(/\r\n/g, "\n"));
const html = readFileSync("index.html", "utf8")
  .replace(/(href=")styles\.css(?:\?v=[a-f0-9]+)?(")/g, `$1styles.css?v=${cssV}$2`)
  .replace(/(src=")assets\/app\.bundle\.js(?:\?v=[a-f0-9]+)?(")/g, `$1assets/app.bundle.js?v=${bundleV}$2`);
writeFileSync("index.html", html);
console.log(`Stamped index.html — styles.css?v=${cssV} · app.bundle.js?v=${bundleV}`);
