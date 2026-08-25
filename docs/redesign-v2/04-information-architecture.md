# Information Architecture

## Canonical Routes

English routes are canonical at `/`; Traditional Chinese routes mirror them under `/zh/`.

1. `/` — recruiter-first capability and evidence path
2. `/work/` — three flagship cases plus supporting open source
3. `/work/human-grounded-llm-evaluation/`
4. `/work/floodabm/`
5. `/work/wagf/`
6. `/research/` — questions, methods, validity boundaries
7. `/publications/` — explicit-status research record
8. `/articles/` — methods and engineering judgment
9. `/articles/evaluating-llm-agents-against-measured-human-behavior/`
10. `/articles/why-governed-agents-need-validators-before-state-changes/`
11. `/articles/from-individual-decisions-to-system-consequences/`
12. `/about/` — biography, education, trajectory, four documents

The 24 locale routes have reciprocal `hreflang` links and route-parity checks.

## Homepage Sequence

Hero and capability summary → Selected Work → Decision Provenance Explorer → three open-source systems → Articles → Contact.

The full six-stage Observatory remains on Research. Publications, recent updates, and documents remain available on their dedicated routes instead of repeating on the homepage.

## Legacy URL Policy

Old `/engineering/` and `/projects/*/` URLs remain as static redirects. LLM evaluation and FLOODABM redirect to their flagship cases; supporting repositories redirect to `/work/#open-source`.

## Locale Policy

English is the default U.S. recruiting route. Traditional Chinese is an equal-QA mirror from the same schema, not a separate identity. Industry/academic remain document types in both languages.
