// Precompile the site to a single bundle so the browser never ships Babel.
// Each source file keeps its "global script" shape (sets window.CONTENT /
// window.Icons / window.Covers; app.jsx reads them + renders). We transform
// JSX -> React.createElement (classic, global React) and minify whitespace +
// syntax only — identifiers are preserved so cross-file globals never break.
// Run: npm run build   (then commit assets/app.bundle.js)
import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const ORDER = [
  { src: "content.js", loader: "js" },
  { src: "icons.jsx", loader: "jsx" },
  { src: "covers.jsx", loader: "jsx" },
  { src: "app.jsx", loader: "jsx" }, // last: sets up + renders the app
];

let out = "";
for (const f of ORDER) {
  const code = readFileSync(f.src, "utf8");
  const res = await esbuild.transform(code, {
    loader: f.loader,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: false,
    target: "es2019",
  });
  out += `\n/* ${f.src} */\n${res.code}`;
}

mkdirSync("assets", { recursive: true });
writeFileSync("assets/app.bundle.js", out);
console.log(`Built assets/app.bundle.js — ${(out.length / 1024).toFixed(1)} KB`);

// Cache-bust: stamp index.html's asset refs with a content hash. The asset
// filenames are stable across builds, so without this GitHub Pages / the browser
// can serve a stale bundle for ~10min after a deploy. A content hash changes only
// when the file changes, so caches stay warm yet every deploy is picked up at once.
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 8);
const bundleV = hash(out);
// Normalize CRLF→LF so the hash is identical to the committed (LF) bytes
// GitHub Pages serves, and stable if the repo is built on Linux/macOS too.
const cssV = hash(readFileSync("styles.css", "utf8").replace(/\r\n/g, "\n"));
const html = readFileSync("index.html", "utf8")
  .replace(/(href=")styles\.css(?:\?v=[a-f0-9]+)?(")/g, `$1styles.css?v=${cssV}$2`)
  .replace(/(src=")assets\/app\.bundle\.js(?:\?v=[a-f0-9]+)?(")/g, `$1assets/app.bundle.js?v=${bundleV}$2`);
writeFileSync("index.html", html);
console.log(`Stamped index.html — styles.css?v=${cssV} · app.bundle.js?v=${bundleV}`);
