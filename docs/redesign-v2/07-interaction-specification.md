# Interaction Specification

## Homepage Evidence Chain

Six native `<details>` stages: human evidence, decision pathways, behavioral simulation, LLM evaluation, governance/repair, and external feedback. Each exposes question, input, method, output, validity risk, AI-team relevance, and a case-study link. The interaction adopts a chapter-based storytelling pattern: one stage is foregrounded at a time, the active chapter receives a persistent visual marker, and the newly opened chapter is repositioned below the sticky header.

- Keyboard: summary elements receive native focus and Enter/Space activation.
- Mobile: one-column expansion; no horizontal scroll.
- Static fallback: all stages are present in prerendered HTML and remain operable without JavaScript.
- Motion: a short content reveal and chevron rotation clarify the state change; `prefers-reduced-motion` reduces both to effectively zero and essential content never depends on animation.

## LLM Pathway Explorer

Segmented lenses switch an overall/homeowner/renter schematic. The diagram shows the approved comparison architecture only. It explicitly states that unpublished coefficients are absent and provides all labels as text.

## FLOODABM Feedback Timeline

Owner/renter lenses show the system sequence: household state → adaptation choice → flood event → damage/payout/out-of-pocket update → next annual step. It is labeled illustrative architecture, not a reported result.

## WAGF Governance Trace

A frozen proposal fails the financial check and blocks later steps. The targeted-repair state reduces the declared cost, passes named checks, writes an audit record, then permits a state update. No live model call occurs.
