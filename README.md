# Wenyu Chiou — Portfolio

Personal site for Wenyu Chiou, PhD candidate at Lehigh University (Catastrophe Modeling & Resilience).

Bilingual (English / 繁中). Research focus: **LLM-agent frameworks
and multi-agent systems coupled with catastrophe flood models** for
long-term household adaptation under risk.

**Live site:** https://wenyuchiou.github.io/

## What's in here

Site source — `index.html` + `content.js` + the `*.jsx` components +
`styles.css`. The browser loads a **precompiled bundle**
(`assets/app.bundle.js`), so after editing source you MUST rebuild and
commit the bundle or the live site serves stale code.

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

## Deploy

GitHub Pages serves from the `standalone-portfolio` branch (legacy build, root).

Live: https://wenyuchiou.github.io/
