# Test Report

Status: capability-led revision verified on 2026-08-23. Production has not been merged or deployed.

## Baseline

- `npm ci`: passed; 35 packages; one moderate audit advisory recorded without force-upgrading.
- `npm run build`: passed; 10 old routes prerendered; 212.1 KB bundle; copy linter clean.
- `npm run pdf`: passed; old English academic CV 3 pages and industry resume 1 page.
- Lab mobile: FCP 1.2 s, LCP 1.856 s, CLS 0.0276, 151 ms long task, load 2.006 s.
- Axe: homepage 6 serious contrast nodes plus 1 minor ARIA issue; each other old route had a serious footer contrast issue; 22 mobile targets below 44 px.

## Final Gates

- `npm run build`: passed; 16 localized routes, 7 legacy redirects, reciprocal hreflang, 16-URL sitemap, one h1 per canonical route, and a 233.5 KB uncompressed production bundle.
- `npm test`: passed; route parity, metadata, canonical links, copy lint, fact checks, and four required PDFs.
- `npm run qa:browser`: passed on all 16 routes. The audit covers axe in light and dark themes, console errors, horizontal overflow, h1 structure, key target sizes, language counterparts, internal fragments, external-link safety, PDF signatures, theme persistence, static and React mobile menus, keyboard activation, all three case interactions, reduced motion, and no-JavaScript fallback on every route. First-fold assertions cover widths 360, 390, 620, 621, 768, 980, 981, 1100, and 1440 px.
- `npm run qa:lighthouse`: passed four isolated runs using gzip delivery. Mobile EN scored 99/100/100/100 and mobile zh-TW scored 94/100/100/100; both desktop locales scored 100/100/100/100 for Performance/Accessibility/Best Practices/SEO. LCP was 2.3 s EN mobile, 2.9 s zh-TW mobile, and 0.7 s on both desktop runs; TBT was 0 ms throughout.
- `npm run qa:screenshots -- --routes=/,/zh/`: produced 16 full-page homepage images covering 360, 390, 768, and 1440 px in both locales and both themes. Visual review found no overlap, clipping, broken glyphs, or horizontal overflow.
- `npx --yes impeccable --json app.jsx`: returned `[]`.
- The four industry/academic, English/Traditional Chinese PDFs were not regenerated or edited in this revision; `npm test -- --require-pdfs` confirmed that all four required files remain present and pass copy checks.

## Residual Risks

- The zh-TW mobile lab LCP is 2.9 s, above the 2.5 s aspirational target but within the configured Lighthouse gate. No field Core Web Vitals data exists for this unmerged candidate.
- Automated axe, keyboard, focus, reduced-motion, and static-fallback checks passed, but a manual pass with a real screen reader remains an owner-side release check.
- LinkedIn does not provide a reliable public member-post feed for this use case. Posts remain curated data; only GitHub metrics use the reviewed refresh workflow.

## Evidence Paths

- Capability-led homepage screenshots: `screenshots/{light,dark}/{narrow-mobile,mobile,tablet,desktop}/`
- Deployed baseline screenshots: `outputs/redesign-visuals/baseline/`
- Final first-fold screenshots: `outputs/functional-visual-audit-20260823/final-folds/`
- Lighthouse JSON and summary: `lighthouse-results/`
- Case and dark-theme states: `outputs/functional-visual-audit-20260823/interactions/` and `outputs/functional-visual-audit-20260823/dark-theme/`
- PDF page renders: `outputs/pdf-review/`

The evidence directories are intentionally untracked so QA artifacts do not increase the GitHub Pages payload.
