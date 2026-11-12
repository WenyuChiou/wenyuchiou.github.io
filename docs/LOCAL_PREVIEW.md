# Local owner preview

Run from this checkout, using its installed dependencies:

```powershell
npm run preview:worker
```

In another terminal:

```powershell
npm run preview
```

Open `http://localhost:4187/` or `http://localhost:4187/zh/`. The preview serves
the existing rendered site, including the deferred timeline, research scenes,
PDFs and shared Portfolio Guide. It does not build or deploy the website.

The frontend proxy and Wrangler listener are loopback-only. Their API accepts
the exact local Origin. The isolated remote Worker preview reuses encrypted
Cloudflare bindings without exporting a NVIDIA key. It retains the existing
model, real Siteverify, hostname/action validation, and a separate five-per-minute
rate-limit namespace. Local event requests are discarded, not sent to production
Analytics Engine. Only outcome metadata is logged; questions and JD are not.

The owner authorized `localhost` and `127.0.0.1` on the existing Managed
Turnstile widget for this preview. Production Worker configuration still permits
only `wenyuchiou.github.io`. This file does not authorize expanding that boundary,
creating keys, using test verification, or bypassing browser security warnings.

Use the visible Guide's Generate button. `NVIDIA` in the result and HTTP200 with
`mode: "nvidia"` demonstrate generated output. Local reading/semantic results
are available independently, but are not a successful generation test.
`/__preview/status` shows only the most recent outcome, not the question.

Stop both terminals with Ctrl+C. Re-run the same two commands to restart.
Nothing in this workflow merges a PR or deploys the production Worker.

```powershell
npm run test:preview
```

These unit tests use an explicit transport fixture. They are security/regression
checks, not proof of actual NVIDIA or Turnstile browser generation.

## Owner-authorized test verification

When a browser cannot reach the challenge iframe, the owner may explicitly
authorize this local-only alternative:

```powershell
npm run preview:worker:test-verification
npm run preview:test-verification
```

Run the commands in separate terminals. This mode visibly labels verification
as **test-only, not a human check**. A local widget adapter supplies Cloudflare's
documented dummy token; the remote preview calls official Siteverify with its
public dummy secret. Dummy Siteverify returns `example.com` without an action,
so only the isolated test adapter supplies local hostname/action fields. These
are not evidence of real human verification. NVIDIA transport, controlled
evidence validation and the real rate-limit binding are unchanged.

The test entrypoint is disabled unless the explicit development CLI compile flag
is present, rejects production configuration, is never used by `deploy:worker`,
and creates no public preview route. Wrangler rewrites private-preview request
URLs to the existing Worker host, so URL hostname alone is not a dev boundary. Production code,
keys, CORS, hostname/action checks and deployment remain unchanged.
Only HTTP200 `mode: "nvidia"` plus visible generated sections counts as an
actual model-generation pass. Official reference:
https://developers.cloudflare.com/turnstile/troubleshooting/testing/
