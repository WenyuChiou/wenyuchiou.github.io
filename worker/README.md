# Portfolio Navigator Worker

The Worker keeps NVIDIA credentials and abuse controls off the static site. It exposes `POST /v1/navigate`, `POST /v1/fit`, and `POST /v1/events`; all routes accept only the configured production origin.

Required encrypted secrets:

- `NVIDIA_API_KEY`
- `TURNSTILE_SECRET`

Set secrets with `wrangler secret put --config worker/wrangler.jsonc`. The public Turnstile site key and deployed Worker URL live in `deployment-config.mjs`; `TURNSTILE_SITE_KEY` and `PORTFOLIO_AI_ENDPOINT` remain available as build-time overrides. The model check must pass before deployment.

Turnstile verification is bound to the `navigate` or `fit` action and production hostname. `/v1/fit` accepts a role preset and an optional job description of at most 8,000 characters. NVIDIA may decompose requirements, but capability names, ownership statements, links, and evidence metadata are rebuilt from the controlled portfolio index.

Analytics records only allowlisted event, locale, page or action target, outcome, result mode, and bounded category counts. The Portfolio Navigator funnel records an entry impression, open, query submission, final result mode, and clicks on allowlisted portfolio evidence IDs. Fit events use the selected role preset as their only target. The event route has its own 30-request-per-minute limiter. Query text, job descriptions, IP addresses, User-Agent strings, referrers, and free-form values are not written.

Use `analytics-queries.sql` with the Workers Analytics Engine SQL API to inspect event-level entry open rate, query completion rate, result modes, and evidence clicks. These are aggregate event ratios, not unique-user or session conversion rates because the site deliberately does not assign visitor identifiers. Sampling-aware queries use `SUM(_sample_interval)` as documented by Cloudflare.
