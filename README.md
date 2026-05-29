<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Wenyu Chiou — Portfolio

Personal site for Wenyu Chiou, PhD candidate at Lehigh University
(Department of Civil & Environmental Engineering, Center for
Catastrophe Modeling and Resilience).

Bilingual (English / 繁中). Research focus: **LLM-agent frameworks
and multi-agent systems coupled with catastrophe flood models** for
long-term household adaptation under risk.

**Live site:** https://wenyuchiou.github.io/

## What's in here

| Branch | Purpose |
|---|---|
| `main` | Mirrors the live site source (HTML + JSX + CSS, precompiled to one bundle by esbuild), plus personal notes (`PDF/` posters, `Agentic AI.drawio`, `workflow/` images). |
| `standalone-portfolio` | **Deploy branch.** GitHub Pages serves from here. Same site source as `main`, without the personal notes. |
| `gh-pages` | Built artifact (legacy, no longer used). |

## Edit + ship

Site content lives in
[`content.js`](https://github.com/WenyuChiou/wenyuchiou.github.io/blob/standalone-portfolio/content.js)
(copy) and the `*.jsx` components, on the `standalone-portfolio` deploy
branch. **The browser loads a precompiled bundle (`assets/app.bundle.js`),
so after editing source you MUST rebuild and commit the bundle** or the
live site serves stale code.

```bash
git clone -b standalone-portfolio https://github.com/WenyuChiou/wenyuchiou.github.io
cd wenyuchiou.github.io
npm ci                      # first time only (installs esbuild)
# ...edit content.js / icons.jsx / covers.jsx / app.jsx ...
npm run build               # regenerates assets/app.bundle.js
git add -A && git commit -m "..." && git push   # Pages refreshes within a minute
```

To just preview locally without editing: `python -m http.server 8000`.

## Stack

Plain JSX + CSS, **precompiled by [esbuild](https://esbuild.github.io/)**
into a single `assets/app.bundle.js` (classic `React.createElement`,
React/ReactDOM from the unpkg CDN — production builds, no in-browser
Babel). No Vite, no CI: `npm run build` locally, commit the bundle, push.

## Old URL

The portfolio used to live at
`https://wenyuchiou.github.io/Wenyu-Portfolio/` while this repo was
named `Wenyu-Portfolio`. After the rename, the old URL is preserved
via a redirect stub repo at
[github.com/WenyuChiou/Wenyu-Portfolio](https://github.com/WenyuChiou/Wenyu-Portfolio).
