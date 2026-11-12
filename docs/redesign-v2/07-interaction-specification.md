# Interaction Specification

## Decision Provenance Explorer

The homepage signature interaction offers Evaluation, Governance, and Simulation lenses over a shared five-stage structure: human evidence, persona/context, LLM decision, validation/repair, and system consequence. Every stage names its evidence status in text. The adjacent two-track SVG connects human interpretation and adaptation with environmental hazard, loss, and state updates.

- Keyboard: lens and stage controls are native buttons with pressed/current state.
- Static fallback: every stage explanation and the complete SVG remain in prerendered HTML when JavaScript is unavailable.
- Motion: paths highlight only after an explicit lens or stage change; reduced-motion removes the transition.
- Evidence boundary: unpublished cases show synthetic examples and never expose respondent records, coefficients, or unpublished findings.

## Research Observatory

Six native `<details>` stages: human evidence, decision pathways, behavioral simulation, LLM evaluation, governance/repair, and external feedback. Each exposes question, input, method, output, validity risk, AI-team relevance, and a case-study link. The interaction adopts a chapter-based storytelling pattern: one stage is foregrounded at a time, the active chapter receives a persistent visual marker, and the newly opened chapter is repositioned below the sticky header.

- Keyboard: summary elements receive native focus and Enter/Space activation.
- Mobile: one-column expansion; no horizontal scroll.
- Static fallback: all stages are present in prerendered HTML and remain operable without JavaScript.
- Motion: a short content reveal and chevron rotation clarify the state change; `prefers-reduced-motion` reduces both to effectively zero and essential content never depends on animation.

## LLM Pathway Explorer

Segmented lenses switch an overall/homeowner/renter schematic. The diagram shows the approved comparison architecture only. It explicitly states that unpublished coefficients are absent and provides all labels as text.

## FLOODABM Feedback Timeline

Owner/renter lenses show the system sequence: household state → adaptation choice → flood event → damage/payout/out-of-pocket update → next annual step. The detailed case combines the textual annual timeline with the same accessible two-track SVG used in the homepage preview.

## AI Portfolio Navigator

Lexical results render immediately. When a deployed Worker endpoint and Turnstile site key are configured, the visitor is told that the question will be sent to NVIDIA. A grounded summary may then replace the ordering with one to three allowlisted record IDs. Timeout, quota, validation, network, or challenge failure preserves the local result and falls back to the existing MiniLM semantic ranker.

## WAGF Governance Trace

A frozen proposal fails the financial check and blocks later steps. The targeted-repair state reduces the declared cost, passes named checks, writes an audit record, then permits a state update. No live model call occurs.
