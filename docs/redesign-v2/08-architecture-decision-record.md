# Architecture Decision Record

## Decision

Keep the existing static React + esbuild + server-prerender architecture and restructure it around locale-aware content and route metadata.

## Current Stack vs Astro

| Criterion | Static React/esbuild | Astro |
|---|---|---|
| Existing code/assets | Reused directly | Migration required |
| Static HTML | Existing SSR prerender emits complete HTML | Native strength |
| Interactive islands | Small shared bundle; acceptable at current scale | Finer-grained by default |
| GitHub Pages | Existing known path | Also supported |
| Build safety | Existing scripts and generated-file convention | New adapters and migration risk |
| Bilingual schema | Straightforward structured modules | Straightforward content collections |
| Risk for this redesign | Lower | Higher without a user-visible gain |

Astro remains a reasonable future option if the site grows into many independently authored case studies. It is not justified for the current 24-route bilingual build and bounded interactions.

## Build Boundaries

- `content.en.js`, `content.zh-TW.js`, and `feature-content.js` are the public-copy sources.
- `seo.js` owns 24 route records, canonical URLs, hreflang, ScholarlyArticle metadata, and TechArticle metadata.
- `template.html` is the document source; route `index.html` files and `assets/app.bundle.js` are generated.
- `data/github.json` is a committed last-known-good API snapshot.
- `data/updates.json` is a curated LinkedIn/public-update record.
- CV HTML is canonical; four PDFs and two legacy aliases are generated.
- `worker/` owns the optional Cloudflare boundary for NVIDIA NIM, Turnstile, per-IP rate limiting, and allowlisted aggregate events.

The static site remains fully useful without the Worker. `PORTFOLIO_AI_ENDPOINT` and `TURNSTILE_SITE_KEY` are public build inputs; `NVIDIA_API_KEY` and `TURNSTILE_SECRET` are encrypted Worker secrets. The deployment command checks the exact NVIDIA model catalog before calling Wrangler.

No automatic website or Worker deployment workflow is introduced. CI and refresh automation remain non-deploying.
