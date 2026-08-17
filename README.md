# wenyuchiou.github.io

Personal site of Wenyu Chiou — Ph.D. candidate, Civil & Environmental Engineering, Lehigh University.

Static multi-page site: React 18 prerendered to 10 HTML routes with esbuild, no CDN dependencies (fonts and scripts self-hosted), fail-closed content linting on every build.

## Build

```bash
npm ci
npm run build     # bundle -> prerender 10 routes -> sitemap/robots -> hash-stamp -> copy linter (strict)
```

The build **fails** if `scripts/check-copy.mjs` finds any banned pattern, drifted canonical string, or leaked `[CONFIRM` placeholder in source files, built HTML, or the extracted text of the two PDFs. Canonical strings live in `scripts/canonical-strings.json` and are regenerated from the (private) strategy workspace — never edit that file ad hoc.

## CV / resume PDFs

```bash
npm run pdf       # cv/build-pdf.mjs -> assets/Wenyu_Chiou_Academic_CV.pdf + assets/Wenyu_Chiou_AI_Research_Resume.pdf
```

Requires a local Chrome or Edge (auto-detected; override with `CHROME_PATH`). Sources are `cv/academic.html` and `cv/resume.html` with shared `cv/print.css`. The script refuses to emit PDFs if the banned-string scan fails.

## Serve locally

```bash
npx http-server -p 8080    # routes are real directories; no SPA fallback needed
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
