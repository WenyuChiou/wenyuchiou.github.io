# Decision Provenance Workbench

The lower homepage explorer uses a deferred React island. The existing robot
cover and case-page interactions remain separate and unchanged.

## Rendering

- Server rendering uses `island.jsx` and produces the complete default scene,
  five stages, evidence inspector, and all three static text flows.
- The main build resolves that component to `client-island.jsx`, a stable
  container preserving the server HTML. It never imports workbench code.
- `loader.js` imports the content-hashed ESM entry when nearby, focused, clicked,
  or requested by WebMCP. The island owns its own React state. No remote API is
  called. Loading failure leaves the static flow and evidence links visible.
- CSS is linked in server HTML. JavaScript stays deferred.
- The five existing hash stage IDs and all `data-provenance-*` evidence hooks
  are preserved. WebMCP waits for hydration, then uses the same visible controls.

## Evidence and State

`behavior-data.js` is the unchanged `behavior-lab-v1` fixture module from
`codex/llm-behavior-comparison` (5457425). Each evaluation mode selects its
corresponding fixture and comparison together. These are authored choices,
not measured participants or live model outputs.

`state.js` owns the deterministic teaching rules. The rejected proposal asks
for nine tokens against six available. Repair changes only cost to two;
format, permission, and budget must all pass before state becomes four tokens
with contents protection applied. Selecting a stage does not authorize repair.

The simulation preview uses synthetic units. Owner and renter actions differ;
neither changes the river hazard. The renter cannot elevate the building.
Public research descriptions appear separately in the inspector and link to
the relevant case. No coefficients or unpublished findings are introduced.

## Motion

Local CSS loops animate only visual signals. IntersectionObserver and document
visibility stop offscreen/background animation. Manual pause remains paused
after re-entry and reset. Reduced motion disables all motion but not controls.
The art derives from the existing research-header generator without modifying
that generator or its assets. HTML carries labels; SVG remains decorative.

## Verification

Run `npm run build`, `npm test`, and `npm run qa:browser`.
With a local preview at port 4188, run `node scripts/audit-provenance.mjs`.
Set `PROVENANCE_BASE` for another preview; `PROVENANCE_CASE=en-light-360`
selects one targeted layout case. The audit writes screenshots and results
under untracked `outputs/provenance-audit/`.

The matrix covers English/Traditional Chinese, light/dark, 360/390/768/1440px,
paired records, rejection/repair, tenure limits, keyboard, axe, static fallback,
reduced motion, hash restoration, and actual cross-frame pixel differences.
Existing browser audits also execute the WebMCP tools on hydrated pages.
