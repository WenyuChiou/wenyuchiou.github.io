# Test Report

Status: evidence-led and AI-Navigator candidate verified on 2026-08-25. Production has not been merged or deployed.

## Final Gates

- `npm run build`: passed; 24 localized routes, 7 legacy redirects, reciprocal hreflang, 24-URL sitemap, one H1 per route, TechArticle JSON-LD, and three raster article social previews.
- JavaScript: 298.7 KiB raw and 90.4 KiB gzip, below the 250 KiB transferred target.
- `npm test`: passed route parity, metadata, canonical links, copy lint, seven bilingual Navigator queries, semantic retry/race checks, and ten Worker tests.
- Worker tests cover exact CORS, Turnstile action/hostname binding, navigation and event rate limits, timeout, provider failure, malicious prompt handling, malformed/scalar JSON, unknown record IDs, deterministic evidence text, and allowlisted anonymous events.
- `npx wrangler deploy --dry-run --config worker/wrangler.jsonc`: passed; upload 19.73 KiB raw and 6.46 KiB gzip with Analytics Engine, 5-request/60-second Navigator limiting, and 30-request/60-second event limiting.
- `npm run qa:browser`: passed all 24 routes. Coverage includes axe in light/dark themes, 360/390/620/621/768/980/981/1100/1440 px, overflow, 44 px targets, keyboard controls, Decision Provenance lenses, three case interactions, locale switching, links, PDFs, reduced motion, and no-JavaScript fallback.
- `npm run qa:lighthouse`: passed four gzip-served runs. EN mobile scored 98/100/100/100; zh-TW mobile 97/100/100/100; EN desktop 100/100/100/100; zh-TW desktop 96/100/100/100 for Performance/Accessibility/Best Practices/SEO. LCP was 2.5 s, 2.0 s, 0.8 s, and 1.3 s respectively; CLS was 0 in all runs.
- Screenshot capture produced 48 full-page images for the English and Traditional Chinese home, FLOODABM case, and governance article across 360/390/768/1440 px and both themes. Visual review found no clipping, horizontal overflow, broken glyphs, or illegible SVG state.
- `npx --yes impeccable --json app.jsx`: returned `[]`.
- `npm run pdf`: passed four-document source scanning and generated the expected 3/1/3/1 page counts. Generated binary changes were restored because CV content is outside this revision; no PDF diff remains.

## Independent Review

Luna's read-only candidate review found two P2 issues: a mobile floating Navigator overlapping old screenshots and ambiguous FLOODABM publication wording. The mobile control now sits in the header as a 46 px icon, and the Evidence Slice distinguishes the public WRR article, AGU poster, and repository from the case-study manuscript still in revision. It also suggested replacing the literal Traditional Chinese phrase `相連能力`; this is now `延伸能力`.

## Deployment Blocker

Worker code is deployable but was not published from this environment. Wrangler is not authenticated, and `NVIDIA_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `TURNSTILE_SITE_KEY` are absent. Secrets must be entered by the owner through Cloudflare; they must not be committed or sent through the site build.

## Residual Risks

- No field Core Web Vitals data exists for the unmerged candidate.
- Automated accessibility checks pass, but a manual pass with the owner's preferred real screen reader remains a release check.
- NVIDIA Developer API availability and quota can change. Lexical and MiniLM results remain the functional fallback.

## Evidence Paths

- Candidate screenshots: `C:/Users/wenyu/.codex/visualizations/2026/06/08/019ea839-5d03-7512-8ae3-bb46ac6c5a26/portfolio-evidence-ai/`
- Lighthouse JSON and summary: `lighthouse-results/`

Screenshot and Lighthouse output directories remain untracked so QA artifacts do not increase the GitHub Pages payload.
