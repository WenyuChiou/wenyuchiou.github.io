# Accessibility and Performance Plan

## Accessibility

- One H1 per route and ordered heading structure.
- 44 px minimum interactive controls and visible `:focus-visible` outlines.
- Native navigation, buttons, links, details/summary, lists, and definition lists.
- High-contrast tokens in light and dark themes; coral/amber meaning is repeated in text.
- No hover-only information and no required pointer gesture.
- `prefers-reduced-motion` disables nonessential transitions.
- Explicit image dimensions and useful alt text.
- Manual checks at 200% zoom, 360/390/768/1440 px, keyboard-only, and no JavaScript.
- Automated axe scan on every canonical route before handoff.
- SVG interactions include `title`, `desc`, visible text equivalents, and native button controls.
- With JavaScript disabled, every provenance explanation remains visible and the site retains complete navigation.

## Performance

- Static HTML contains the complete narrative and links.
- No canvas, WebGL, animation library, or runtime framework for diagrams; the coupled flow is inline SVG and CSS.
- Self-hosted font files and one real hero image; no external font request.
- GitHub data refresh happens in CI, not in the visitor browser.
- Target mobile Lighthouse: Performance ≥90; Accessibility, Best Practices, and SEO ≥95.
- Target lab LCP ≤2.5 s, CLS ≤0.1, no console errors or hydration warnings.
- NVIDIA and Turnstile load only after a visitor asks the Navigator to use configured AI; local search appears first.

## Budgets

- Initial JavaScript target: less than 250 KB transferred after compression; report both raw and compressed sizes.
- No individual route may introduce horizontal page overflow at 360 px.
- All internal links, sitemap URLs, PDF links, and locale counterparts must resolve.
