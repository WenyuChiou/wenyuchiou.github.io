# Test Report

Status: candidate implementation verified on 2026-08-23. Production has not been merged or deployed.

## Baseline

- `npm ci`: passed; 35 packages; one moderate audit advisory recorded without force-upgrading.
- `npm run build`: passed; 10 old routes prerendered; 212.1 KB bundle; copy linter clean.
- `npm run pdf`: passed; old English academic CV 3 pages and industry resume 1 page.
- Lab mobile: FCP 1.2 s, LCP 1.856 s, CLS 0.0276, 151 ms long task, load 2.006 s.
- Axe: homepage 6 serious contrast nodes plus 1 minor ARIA issue; each other old route had a serious footer contrast issue; 22 mobile targets below 44 px.

## Final Gates

- `npm run build`: passed; 16 localized routes, 7 legacy redirects, reciprocal hreflang, 16-URL sitemap, one h1 per canonical route, and 231.0 KB uncompressed production bundle.
- `npm test`: passed; route parity, metadata, canonical links, copy lint, fact checks, and four required PDFs.
- `npm run qa:browser`: passed on all 16 routes. The audit covers axe in light and dark themes, console errors, horizontal overflow, h1 structure, key target sizes, language counterparts, internal fragments, external-link safety, PDF signatures, theme persistence, static and React mobile menus, keyboard activation, all three case interactions, reduced motion, and no-JavaScript fallback on every route. First-fold assertions cover widths 360, 390, 620, 621, 768, 980, 981, 1100, and 1440 px.
- `npm run qa:lighthouse`: passed four isolated reruns using gzip delivery. Mobile EN and zh-TW scored 90/100/100/100; desktop EN and zh-TW scored 100/100/100/100 for Performance/Accessibility/Best Practices/SEO. CLS was 0 in all runs; mobile TBT was 10 ms EN and 100 ms zh-TW. One preceding zh-TW mobile run scored 89 with 140 ms TBT, so the passing rerun and the variance are both retained.
- `npm run qa:screenshots`: produced 48 final full-page images and 48 final first-fold images (16 routes x desktop/tablet/mobile). The baseline set contains 20 images for the 10 deployed routes. Twelve case-interaction states and eight dark-theme states were also captured. Visual review found no overlap, clipping, broken glyphs, or incoherent responsive reflow.
- `npm run pdf`: passed. Academic CVs are 3 pages each; industry resumes are 1 page each. All 8 rendered pages were visually inspected with no clipping, overlap, missing glyphs, or blank pages.

## Residual Risks

- Mobile lab LCP is 3.6 s in both locales, above the 2.5 s aspirational target. No field Core Web Vitals data exists for this unmerged candidate; the score gate still passes at 90.
- Automated axe, keyboard, focus, reduced-motion, and static-fallback checks passed, but a manual pass with a real screen reader remains an owner-side release check.
- LinkedIn does not provide a reliable public member-post feed for this use case. Posts remain curated data; only GitHub metrics use the reviewed refresh workflow.

## Evidence Paths

- Final screenshots: `outputs/redesign-visuals/final/`
- Deployed baseline screenshots: `outputs/redesign-visuals/baseline/`
- Final first-fold screenshots: `outputs/functional-visual-audit-20260823/final-folds/`
- Lighthouse JSON and summary: `outputs/functional-visual-audit-20260823/lighthouse-rerun/`
- Case and dark-theme states: `outputs/functional-visual-audit-20260823/interactions/` and `outputs/functional-visual-audit-20260823/dark-theme/`
- PDF page renders: `outputs/pdf-review/`

The evidence directories are intentionally untracked so QA artifacts do not increase the GitHub Pages payload.
