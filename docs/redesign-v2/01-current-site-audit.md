# Current Site Audit

Baseline branch: `origin/standalone-portfolio` at `bc131b7`. Audit date: 2026-08-23.

## Preserve

- Static prerendered React architecture with no CDN runtime.
- Strong editorial type hierarchy and restrained scientific tone.
- Real portrait, AGU poster photograph, poster PDF, and public evidence links.
- Explicit research statuses and a working no-JavaScript reading path.
- Existing canonical, Open Graph, robots, sitemap, and DOI metadata foundations.

## Problems

| Area | Evidence | Consequence |
|---|---|---|
| Identity | Global Research/Industry toggle changes copy and priority | Visitors must choose between artificial identities; shared links are ambiguous |
| Positioning | Hero leads with “quantitative behavioral simulation and psychometric evaluation” | Accurate but slow to decode for broad AI hiring audiences |
| Information architecture | Six project pages compete with the research argument | Open-source tools overtake the three flagship systems |
| Copy | Stale 5K+/700+, 2028, old AGU title, and human-substitute language | Credibility and consistency risk |
| Accessibility | Homepage: 6 serious contrast nodes, 1 ARIA-role issue; mobile: 22 targets below 44 px | Keyboard and low-vision friction |
| Performance | Lab mobile LCP 1.856 s, CLS 0.0276, 151 ms long task | Good baseline; bundle can still be simplified |
| SEO | No Twitter metadata, no hreflang, sitemap lacks lastmod | Bilingual and social discovery are incomplete |
| Profiles | LinkedIn old URL and narrative; GitHub bio typo and second email | Search results show a different professional identity |

Baseline evidence lives in `outputs/gate0-20260823/` outside this repository worktree. All 10 original routes returned HTTP 200 and had no console errors or internal broken links.
