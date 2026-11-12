# wenyuchiou.github.io

Personal site of Wenyu Chiou — Ph.D. candidate, Civil & Environmental Engineering, Lehigh University.

Static bilingual site: React 18 prerendered to 16 English and Traditional Chinese routes with esbuild, no CDN dependencies (fonts and scripts self-hosted), and fail-closed content linting on every build.

## Build

```bash
npm ci
npm run build     # bundle -> prerender 16 routes -> sitemap/robots -> hash-stamp -> copy linter
npm test          # route/locale/metadata/fact/PDF checks
npm run qa:browser
npm run qa:lighthouse
```

The build **fails** if `scripts/check-copy.mjs` finds a banned pattern, drifted canonical fact, leaked placeholder, or status-language violation in source files, built HTML, or the four PDFs.

## CV / resume PDFs

```bash
npm run pdf       # industry/academic x English/Traditional Chinese
```

Requires a local Chrome or Edge (auto-detected; override with `CHROME_PATH`). Sources are the four HTML files under `cv/`, with shared `cv/print.css`. The script enforces one-page industry resumes and academic CV page limits.

## Serve locally

```bash
python -m http.server 4173 --bind 127.0.0.1
```

## Deployment

GitHub Pages deploys from the **`standalone-portfolio`** branch (not `main`).
Deploying = merging the reviewed feature branch into `standalone-portfolio` and pushing — **only with explicit owner approval**. Nothing in this repo auto-deploys.

## Layout

- `content.js` / `seo.js` — all site content + per-route metadata (single source of copy)
- `app.jsx` — page components (PAGES registry), hydrated per route via `data-page`
- `template.html` + `prerender.mjs` — static prerendering; `index.html` and `*/index.html` are **generated**
- `styles.css` — design tokens + components; self-hosted fonts in `assets/fonts/`
- `cv/` — CV/resume sources + PDF pipeline
- `scripts/check-copy.mjs` — fail-closed copy linter (runs inside every build)
