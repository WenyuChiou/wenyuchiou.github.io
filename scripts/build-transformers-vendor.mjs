import { build } from "esbuild";
import { resolve } from "node:path";

const output = process.argv[2] ?? "assets/vendor/transformers-4.2.0.mjs";

await build({
  entryPoints: ["scripts/transformers-runtime/entry.js"],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  minifyWhitespace: true,
  minifySyntax: true,
  legalComments: "none",
  outfile: resolve(output),
  plugins: [{
    name: "browser-only-transformers",
    setup(context) {
      context.onResolve({ filter: /^(?:node:(?:fs|path|url)|onnxruntime-node)$/ }, ({ path }) => ({
        path,
        namespace: "browser-empty",
      }));
      context.onLoad({ filter: /.*/, namespace: "browser-empty" }, () => ({
        contents: "export default {};",
        loader: "js",
      }));
    },
  }],
});
