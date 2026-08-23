# Final Handoff

Status: candidate implementation and local verification complete. Production has not been merged or deployed.

## Current vs Redesigned

| Area | Current site | Redesigned candidate |
|---|---|---|
| Identity | Global Research/Industry switch | One professional identity; document-specific resumes |
| Locales | English only | English plus route-parity Traditional Chinese |
| Hero | Technical category first | Person and human-grounded agent research first, over a real AGU image |
| Main interaction | Four-stage mode-dependent map | Six-stage chapter-based evidence chain with mutually exclusive switching, active-state focus, and static fallback |
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
npm run qa:browser
npm run qa:lighthouse
npm run qa:screenshots
```

## Concise Changelog

- Reframed the site as the Behavioral Systems Observatory.
- Added presentation-like chapter switching to the evidence chain, based on the useful structure in the supplied storytelling reference rather than its dark advertising aesthetic.
- Added eight mirrored routes, three flagship cases, and three evidence-focused interactions.
- Added a dated GitHub snapshot and curated public-update source.
- Added four CV outputs and legacy PDF aliases.
- Added route/copy validators, metadata parity, redirects, CI, and non-deploying refresh automation.

## Owner Decisions Still Required

1. Confirm the prepared LinkedIn headline/about update immediately before the public save action; no LinkedIn profile text has been changed yet.
2. Approve or request changes to the final browser/PDF screenshots and pull requests.
3. Approve merge into `standalone-portfolio` and the separate GitHub Pages deployment step.

## Prepared Pull Requests

- Website redesign: `WenyuChiou/wenyuchiou.github.io#1`, targeting `standalone-portfolio`.
- Daily reviewed data-refresh workflow: `WenyuChiou/wenyuchiou.github.io#2`, targeting `main`.
- GitHub profile alignment: `WenyuChiou/WenyuChiou#21`.

None of these pull requests has been merged. The LinkedIn profile has not been edited.

## Agent and Review Record

- Codex: architecture, UI implementation, bilingual integration, browser inspection, QA, and release preparation.
- Independent code reviewer: staged-diff review; identified tablet first-fold coverage, fragment-link validation, and response-body handling gaps, all corrected before the final targeted recheck.
- No additional model call was used for this final storytelling follow-up; both locales were verified by the same automated and visual gates.

## Review vs Deploy

Review the PR branch and local preview first. Merge/deploy is a separate owner-approved action; CI and data-refresh workflows do not deploy the site. The daily refresh workflow opens a reviewed pull request and never pushes public data directly to the production branch. See `10-test-report.md` for the 3.6 s mobile lab LCP, one-run performance variance, manual screen-reader release check, and LinkedIn feed limitation.
