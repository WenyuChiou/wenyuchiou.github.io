# Final Handoff

Status: candidate implementation and local verification complete. Production has not been merged or deployed.

## Current vs Redesigned

| Area | Current site | Redesigned candidate |
|---|---|---|
| Identity | Global Research/Industry switch | One professional identity; document-specific resumes |
| Locales | English only | English plus route-parity Traditional Chinese |
| Hero | Technical category first | Capability-led LLM behavior evaluation, over a real AGU image |
| Main interaction | Four-stage mode-dependent map | Five-stage Decision Provenance Explorer plus a two-track human–environment SVG and static fallback |
| Work hierarchy | Six similarly weighted project pages | Unframed editorial rows for three flagship systems, led by role and problem |
| Facts | Stale date/count/title conflicts | Owner-approved ledger and automated checks |
| Updates | Static project copy | Curated LinkedIn updates plus build-time GitHub API snapshot |
| Documents | Two English PDFs | Industry/academic × English/Traditional Chinese |
| SEO | English canonical and basic OG | 24 canonicals, reciprocal hreflang, article social previews, lastmod, and TechArticle JSON-LD |
| Automation | Local build only | Non-deploying CI and reviewed public-data refresh PRs |

## Reproducible Commands

```text
npm ci
npm run refresh:github
npm run build
npm run pdf
npm test
npm run test:worker
npm run qa:browser
npm run qa:lighthouse
npm run qa:screenshots
```

## Concise Changelog

- Reframed the homepage around LLM behavior evaluation, governed agents, and behavioral simulation rather than study-size metrics.
- Replaced the numeric proof strip with an unframed expertise model and moved Selected Work ahead of the detailed observatory.
- Removed the repeated homepage evidence ledger; publication status remains in Selected Work and Publications.
- Replaced the previous font stack with self-hosted Literata, Atkinson Hyperlegible Next, Chiron Sung HK, and Chiron Hei HK subsets.
- Removed gradients, glass treatment, monospace labels, colored top rules, and equal-height case cards.
- Added presentation-like chapter switching to the evidence chain, based on the useful structure in the supplied storytelling reference rather than its dark advertising aesthetic.
- Added eight mirrored routes, three flagship cases, and three evidence-focused interactions.
- Added a dated GitHub snapshot and curated public-update source.
- Added four CV outputs and legacy PDF aliases.
- Added route/copy validators, metadata parity, redirects, CI, and non-deploying refresh automation.
- Added three bilingual methods articles and three accessible HTML/CSS technical diagrams.
- Added Decision Provenance lenses, case Evidence Slices, and a two-track human–environment feedback SVG.
- Added an optional Cloudflare Worker boundary for grounded NVIDIA NIM summaries, Turnstile, rate limiting, and aggregate events; local search remains the fallback.

## Owner Decisions Still Required

1. Authenticate Wrangler and enter Cloudflare/NVIDIA/Turnstile secrets without placing them in Git or chat.
2. Review the 48 candidate screenshots and the website pull request.
3. Approve merge into `standalone-portfolio` and the separate GitHub Pages deployment step.

## Release Boundaries

- This revision targets `standalone-portfolio` through a new website pull request.
- LinkedIn, GitHub Profile, and all four CV sources remain outside this revision.
- The Worker must be deployed and its exact HTTPS endpoint supplied to the site build before NVIDIA mode is enabled. Until then, the production Navigator continues to use lexical and MiniLM search.

## Agent and Review Record

- Codex: architecture, UI implementation, bilingual integration, browser inspection, QA, and release preparation.
- Luna: read-only visual and bilingual-copy review; identified the mobile Navigator position, FLOODABM status ambiguity, and one literal Chinese label, all corrected before final review.
- Independent code reviewer: final staged-diff security, quality, and maintainability gate before commit.

## Review vs Deploy

Review the PR branch and local preview first. Merge/deploy is a separate owner-approved action; CI and data-refresh workflows do not deploy the site. See `10-test-report.md` for the 2.0 s zh-TW mobile lab LCP, Worker deployment blocker, and remaining manual screen-reader check.
