# Final Handoff

Status: candidate implementation and local verification complete. Production has not been merged or deployed.

## Current vs Redesigned

| Area | Current site | Redesigned candidate |
|---|---|---|
| Identity | Global Research/Industry switch | One professional identity; document-specific resumes |
| Locales | English only | English plus route-parity Traditional Chinese |
| Hero | Technical category first | Person and human-grounded agent research first, over a real AGU image |
| Main interaction | Four-stage mode-dependent map | Six-stage native evidence chain with static fallback |
| Work hierarchy | Six similarly weighted project pages | Three flagship research systems plus supporting open source |
| Facts | Stale date/count/title conflicts | Owner-approved ledger and automated checks |
| Updates | Static project copy | Curated LinkedIn updates plus build-time GitHub API snapshot |
| Documents | Two English PDFs | Industry/academic × English/Traditional Chinese |
| SEO | English canonical and basic OG | 16 canonicals, reciprocal hreflang, Twitter cards, lastmod, expanded JSON-LD |
| Automation | Local build only | Non-deploying CI and reviewed public-data refresh PRs |

## Reproducible Commands

```text
npm ci
npm run refresh:github
npm run build
npm run pdf
npm test
```

## Concise Changelog

- Reframed the site as the Behavioral Systems Observatory.
- Added eight mirrored routes, three flagship cases, and three evidence-focused interactions.
- Added a dated GitHub snapshot and curated public-update source.
- Added four CV outputs and legacy PDF aliases.
- Added route/copy validators, metadata parity, redirects, CI, and non-deploying refresh automation.

## Owner Decisions Still Required

1. Confirm the prepared LinkedIn headline/about update before the public save action.
2. Approve or request changes to the final browser/PDF screenshots and pull request.
3. Approve merge into `standalone-portfolio` and the separate GitHub Pages deployment step.

## Review vs Deploy

Review the PR branch and local preview first. Merge/deploy is a separate owner-approved action; CI and data-refresh workflows do not deploy the site. The daily refresh workflow opens a reviewed pull request and never pushes public data directly to the production branch.
