# Portfolio Navigator Worker

The Worker keeps NVIDIA credentials and abuse controls off the static site. It exposes `POST /v1/navigate` and `POST /v1/events`; both accept only the configured production origin.

Required encrypted secrets:

- `NVIDIA_API_KEY`
- `TURNSTILE_SECRET`

Set secrets with `wrangler secret put --config worker/wrangler.jsonc`. The public Turnstile site key and deployed Worker URL are supplied to the site build as `TURNSTILE_SITE_KEY` and `PORTFOLIO_AI_ENDPOINT`. The model check must pass before deployment.

Turnstile verification is bound to the `navigate` action and production hostname. Analytics records only allowlisted event, locale, target, and outcome values, and the event route has its own 30-request-per-minute limiter. Query text, IP address, User-Agent, and identifiers are not written.
