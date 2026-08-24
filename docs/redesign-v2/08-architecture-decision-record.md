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

Astro remains a reasonable future option if the site grows into many independently authored case studies. It is not justified for eight mirrored pages and three small interactions.

## Build Boundaries

- `content.en.js` and `content.zh-TW.js` are the public-copy sources.
- `seo.js` owns 16 route records, canonical URLs, hreflang, and structured data.
- `template.html` is the document source; route `index.html` files and `assets/app.bundle.js` are generated.
- `data/github.json` is a committed last-known-good API snapshot.
- `data/updates.json` is a curated LinkedIn/public-update record.
- CV HTML is canonical; four PDFs and two legacy aliases are generated.

No deploy workflow is introduced. CI and refresh automation are non-deploying.
