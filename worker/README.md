# Portfolio Navigator Worker

The Worker keeps NVIDIA credentials and abuse controls off the static site. It exposes `POST /v1/navigate`, `POST /v1/fit`, and `POST /v1/events`; all routes accept only the configured production origin.

The configured model is `nvidia/nemotron-3.5-lightning-30b-a3b`. Generation disables thinking and uses strict JSON schemas with an eight-second provider timeout. Navigator selects exact evidence IDs. Fit selects prevalidated classification/capability/evidence mappings; the Worker expands these mappings and rechecks the existing evidence validator. Unknown IDs or mappings reject the whole response.

Required encrypted secrets:

- `NVIDIA_API_KEY`
- `TURNSTILE_SECRET`

Set secrets with `wrangler secret put --config worker/wrangler.jsonc`. The public Turnstile site key and deployed Worker URL live in `deployment-config.mjs`; `TURNSTILE_SITE_KEY` and `PORTFOLIO_AI_ENDPOINT` remain available as build-time overrides. The model check must pass before deployment.

The model check reads the deployment configuration, verifies the live catalog, and runs the same grounded Navigator request and validator in English and Traditional Chinese. It fails if an environment model override differs from the deployment model. Never export platform secrets just to run this check; use a protected remote verification workflow when credentials only exist in encrypted Worker bindings.

Turnstile verification is bound to the `navigate` or `fit` action and production hostname. `/v1/fit` accepts a role preset and an optional job description of at most 8,000 characters. Requirements now come from controlled presets or source clauses, not model-authored prose. Unknown or compound qualifications remain gaps unless the complete clause matches a verified capability; this conservative behavior does not mean the person lacks that skill.

## Portfolio Guide

`POST /v1/navigate` remains compatible with the original `query`, `locale`, and `turnstileToken` request. New clients additionally send `task` (`research`, `observatory`, or `tools`), `depth` (`beginner` or `method`), and optional controlled scene `context`. The response retains `answer`, `matches`, and `mode`, and adds three cited `sections` and an optional view-only `suggestedView`.

The model generates plain-language Why/How/Contribution explanations from curated bilingual evidence. Record titles, URLs, conditions, and original-source metadata are expanded by the Worker. The observatory context distinguishes synthetic reference records, LLM proposals, and simulated household agents. A suggested view changes no state until a visitor clicks; it never repairs or applies proposals.

The Worker validates the complete output and citation scope, rejects off-topic queries, and checks lexical consistency against cited material. This heuristic can reject a valid paraphrase and cannot prove semantic truth or prevent every hallucination. Bilingual factual evaluation and source disclosure remain required. Failures expose no partial generation and retain clearly labeled local evidence. Questions and scene selections are not logged, cached, or persisted.

Model verification with encrypted bindings uses a private remote probe; abuse-control mocks must be disclosed. Production acceptance additionally requires a real browser token. A localhost preview does not bypass the configured production CORS or hostname-bound Turnstile policy.

The frontend allows up to 45 seconds for a visitor to complete Turnstile, independently of the eight-second generation timeout. Failed or expired widgets are disposed before a new attempt. Passing a provider probe with mocked Turnstile is not a production browser acceptance pass.

Analytics records only allowlisted event, locale, page or action target, outcome, result mode, and bounded category counts. The Portfolio Navigator funnel records an entry impression, open, query submission, final result mode, and clicks on allowlisted portfolio evidence IDs. Fit events use the selected role preset as their only target. The event route has its own 30-request-per-minute limiter. Query text, job descriptions, IP addresses, User-Agent strings, referrers, and free-form values are not written.

Use `analytics-queries.sql` with the Workers Analytics Engine SQL API to inspect event-level entry open rate, query completion rate, result modes, and evidence clicks. These are aggregate event ratios, not unique-user or session conversion rates because the site deliberately does not assign visitor identifiers. Sampling-aware queries use `SUM(_sample_interval)` as documented by Cloudflare.
