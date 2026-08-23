# Test Report

Status: candidate implementation verified on 2026-08-23. Production has not been merged or deployed.

## Baseline

- `npm ci`: passed; 35 packages; one moderate audit advisory recorded without force-upgrading.
- `npm run build`: passed; 10 old routes prerendered; 212.1 KB bundle; copy linter clean.
- `npm run pdf`: passed; old English academic CV 3 pages and industry resume 1 page.
- Lab mobile: FCP 1.2 s, LCP 1.856 s, CLS 0.0276, 151 ms long task, load 2.006 s.
- Axe: homepage 6 serious contrast nodes plus 1 minor ARIA issue; each other old route had a serious footer contrast issue; 22 mobile targets below 44 px.

## Final Gates

- `npm run build`: passed; 16 localized routes, 7 legacy redirects, reciprocal hreflang, 16-URL sitemap, one h1 per canonical route, and 228.0 KB uncompressed production bundle.
- `npm test`: passed; route parity, metadata, canonical links, copy lint, fact checks, and four required PDFs.
- `npm run qa:browser`: passed on all 16 mobile routes; zero axe violations, console errors, horizontal overflow, undersized key targets, or h1 errors. English and Traditional Chinese homepages also passed the no-JavaScript fallback check.
- `npm run qa:lighthouse`: passed four isolated runs using gzip delivery. Mobile EN and zh-TW scored 90/100/100/100; desktop EN and zh-TW scored 100/100/100/100 for Performance/Accessibility/Best Practices/SEO. CLS was 0 in all runs; mobile TBT was 0 ms EN and 10 ms zh-TW.
- `npm run qa:screenshots`: produced 32 final full-page images (16 routes x desktop/mobile). The baseline set contains 20 images for the 10 deployed routes. Visual review found no overlap, clipping, broken glyphs, or incoherent responsive reflow.
- `npm run pdf`: passed. Academic CVs are 3 pages each; industry resumes are 1 page each. All 8 rendered pages were visually inspected with no clipping, overlap, missing glyphs, or blank pages.

## Evidence Paths

- Final screenshots: `outputs/redesign-visuals/final/`
- Deployed baseline screenshots: `outputs/redesign-visuals/baseline/`
- Lighthouse JSON and summary: `outputs/lighthouse-final-pass/`
- PDF page renders: `outputs/pdf-review/`

The evidence directories sit outside the deployable repository so QA artifacts do not increase the GitHub Pages payload.
