# Browser AI runtime

These files keep the portfolio navigator's executable runtime on the same origin as the site. The model weights remain lazy-loaded from the pinned Hugging Face revision in `navigator-data.js`; visitor queries are embedded and ranked in the browser.

- `transformers-4.2.0.mjs` is a browser-only, feature-extraction bundle built from `@huggingface/transformers@4.2.0` (Apache-2.0). It exposes only the BERT tokenizer/model path used by the navigator.
- `onnxruntime/ort-wasm-simd-threaded.asyncify.*` comes from `onnxruntime-web@1.26.0-dev.20260416-b7804b056c` (MIT). This is the no-cross-origin-isolation runtime used on GitHub Pages.
- `build.mjs` verifies the SHA-256 digest of each executable asset before every build.

Rebuild the Transformers bundle from a clean temporary install with:

```powershell
npm ci --ignore-scripts --prefix scripts/transformers-runtime
node scripts/build-transformers-vendor.mjs
```

The Apache license is in `TRANSFORMERS-LICENSE.txt`. ONNX Runtime Web is Copyright (c) Microsoft Corporation and licensed under the MIT License: https://github.com/microsoft/onnxruntime/blob/main/LICENSE
