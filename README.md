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

**Live site:** https://wenyuchiou.github.io/Wenyu-Portfolio/

## What's in here

| Branch | Purpose |
|---|---|
| `standalone-portfolio` | **Live deploy branch.** Single-page site, no build step — `index.html` + JSX/CSS via Babel standalone. GitHub Pages serves from here. |
| `gh-pages` | Built artifact (legacy). |
| `main` | Original Vite/React/TypeScript scaffold. Kept for reference; not deployed. |

## Edit + ship

The live site lives on `standalone-portfolio`. Content for projects,
publications, repos, etc. all lives in
[`content.js`](https://github.com/WenyuChiou/Wenyu-Portfolio/blob/standalone-portfolio/content.js)
on that branch — edit there, push, GitHub Pages refreshes.

```bash
git clone -b standalone-portfolio https://github.com/WenyuChiou/Wenyu-Portfolio
# Open index.html locally in a browser to preview, or run a static server:
python -m http.server 8000
```

## Stack

Babel standalone + plain JSX/CSS — no Vite, no npm install, no build
step on the deploy branch. Just commit `content.js` changes and push.
