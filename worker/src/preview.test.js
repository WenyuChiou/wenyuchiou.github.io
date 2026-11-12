import test from 'node:test';
import assert from 'node:assert/strict';
import { handlePreviewRequest, TEST_SECRET, TEST_TOKEN } from './preview.js';

const origin = 'http://localhost:4187';
const env = { ALLOWED_ORIGIN: origin, ALLOWED_HOSTNAME: 'localhost', PREVIEW_TEST_VERIFICATION: 'enabled', NVIDIA_API_KEY: 'unit-only', RATE_LIMITER: { limit: async () => ({ success: true }) } };
const body = { query: 'What is WAGF?', locale: 'en', task: 'research', depth: 'beginner', context: null, turnstileToken: TEST_TOKEN };
const request = (url = 'http://127.0.0.1:8999/v1/navigate', input = body) => new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(input) });

test('test diagnostics reject an invalid Origin before inspecting its body', async () => {
  let reads = 0;
  const invalid = new Request('http://127.0.0.1:8999/v1/navigate', { method: 'POST', headers: { Origin: 'https://invalid.example' }, body: '{}' });
  Object.defineProperty(invalid, 'body', { get() { reads++; throw new Error('must reject Origin before reading'); } });
  const result = await handlePreviewRequest(invalid, env, () => { throw new Error('must not call'); }, true);
  assert.equal(result.status, 403);
  assert.equal(reads, 0);
});

test('test diagnostics bound oversized bodies before parsing or any provider call', async () => {
  let calls = 0;
  const result = await handlePreviewRequest(request(undefined, { ...body, padding: 'x'.repeat(4097) }), env, () => { calls++; throw new Error('must not call'); }, true);
  assert.equal(result.status, 413);
  assert.equal(calls, 0);
});

test('test diagnostics stop chunked bodies at the same byte limit', async () => {
  let cancelled = false, calls = 0;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(4097)); }, cancel() { cancelled = true; } });
  const input = new Request('http://127.0.0.1:8999/v1/navigate', { method: 'POST', headers: { Origin: origin }, body: stream, duplex: 'half' });
  const result = await handlePreviewRequest(input, env, () => { calls++; throw new Error('must not call'); }, true);
  assert.equal(result.status, 413);
  assert.equal(cancelled, true);
  assert.equal(calls, 0);
});

test('unfinished diagnostic bodies time out without reaching verification or NVIDIA', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let cancelled = false, calls = 0;
  const stream = new ReadableStream({ cancel() { cancelled = true; } });
  const input = new Request('http://127.0.0.1:8999/v1/navigate', { method: 'POST', headers: { Origin: origin }, body: stream, duplex: 'half' });
  const pending = handlePreviewRequest(input, env, () => { calls++; throw new Error('must not call'); }, true);
  context.mock.timers.tick(5000);
  assert.equal((await pending).status, 408);
  assert.equal(cancelled, true);
  assert.equal(calls, 0);
});

test('test verification is disabled by default and refuses production configuration before provider calls', async () => {
  let calls = 0;
  const fetchImpl = () => { calls++; throw new Error('must not call'); };
  assert.equal((await handlePreviewRequest(request('https://wenyu-portfolio-navigator.wenyuchiou12.workers.dev/v1/navigate'), env, fetchImpl)).status, 403);
  assert.equal((await handlePreviewRequest(request(), { ...env, ALLOWED_HOSTNAME: 'wenyuchiou.github.io' }, fetchImpl, true)).status, 403);
  assert.equal(calls, 0);
});

test('test adapter still calls official Siteverify and never invents a NVIDIA answer', async () => {
  const calls = [];
  const result = await handlePreviewRequest(request(), env, async (url, options) => {
    calls.push(String(url));
    if (String(url).includes('siteverify')) {
      assert.equal(options.body.get('secret'), TEST_SECRET);
      return Response.json({ success: true, hostname: 'example.com' });
    }
    return new Response('unavailable', { status: 503 });
  }, true);
  assert.equal(result.status, 503);
  assert.equal(result.headers.get('X-Preview-Verification'), 'test-only');
  assert.equal(result.headers.get('X-Preview-Generation-Check'), 'provider_error');
  assert.equal(calls.length, 2);
  assert.equal(calls[1], 'https://integrate.api.nvidia.com/v1/chat/completions');
});

test('test diagnostics expose only a bounded failure code, never the query or model prose', async () => {
  const input = { ...body, task: 'observatory', query: 'Explain this rejected proposal', context: { lens: 'governance', stage: 'validation', mode: 'direction', tenure: 'renter', repaired: false } };
  const payload = {
    sections: ['why', 'how', 'contribution'].map(kind => ({ kind, text: 'private fixture prose', evidenceIds: ['human-grounded-llm-evaluation'] })),
    matches: [{ id: 'human-grounded-llm-evaluation', reason: 'fixture reason' }], suggestedView: null,
  };
  const result = await handlePreviewRequest(request(undefined, input), env, async url => String(url).includes('siteverify')
    ? Response.json({ success: true, hostname: 'example.com' })
    : Response.json({ choices: [{ message: { content: JSON.stringify(payload) } }] }), true);
  assert.equal(result.status, 503);
  assert.equal(result.headers.get('X-Preview-Generation-Check'), 'invalid_scene_citation');
  const exposed = JSON.stringify([...result.headers]) + await result.text();
  assert.equal(exposed.includes(input.query), false);
  assert.equal(exposed.includes('private fixture prose'), false);
});

test('test failures, wrong tokens and rate limits stop before generation', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; return Response.json({ success: false, hostname: 'example.com' }); };
  assert.equal((await handlePreviewRequest(request(), env, fetchImpl, true)).status, 403);
  assert.equal(calls, 1);
  calls = 0;
  assert.equal((await handlePreviewRequest(request(undefined, { ...body, turnstileToken: 'arbitrary-token' }), env, fetchImpl, true)).status, 403);
  assert.equal(calls, 0);
  assert.equal((await handlePreviewRequest(request(), { ...env, RATE_LIMITER: { limit: async () => ({ success: false }) } }, fetchImpl, true)).status, 429);
  assert.equal(calls, 0);
});
