// Precompile the site to a single bundle so the browser never ships Babel.
// Each source file keeps its "global script" shape (sets window.CONTENT /
// window.Icons / window.Covers; app.jsx reads them + renders). We transform
// JSX -> React.createElement (classic, global React) and minify whitespace +
// syntax only — identifiers are preserved so cross-file globals never break.
// Run: npm run build   (then commit assets/app.bundle.js)
import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

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
