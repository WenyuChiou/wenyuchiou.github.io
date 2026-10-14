import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import path from 'node:path';
import { createPreviewServer, isPublicPath, previewHtml } from './preview.mjs';
import { DEPLOYMENT_CONFIG } from '../deployment-config.mjs';
import { fileURLToPath } from 'node:url';

test('preview exposes only rendered routes and public assets', () => {
  for (const value of ['index.html', 'zh/index.html', 'work/wagf/index.html', 'zh/work/floodabm/index.html', 'assets/app.bundle.js', 'data/github.json', 'features/editorial/interactions.css', 'features/editorial/timeline.js']) assert.equal(isPublicPath(value), true);
  for (const value of ['.env', '.git/config', 'worker/src/index.js', 'navigator.js', 'scripts/preview.mjs', 'assets/../.env', 'assets/.env', 'assets/secret\\file.js']) assert.equal(isPublicPath(value), false);
});

test('local HTML override leaves production configuration unchanged', () => {
  const html = `<meta name="portfolio-ai-endpoint" content="${DEPLOYMENT_CONFIG.aiEndpoint}"><meta name="csp" content="default-src 'self'; upgrade-insecure-requests">`;
  assert.match(previewHtml(html, 'http://localhost:4187'), /content="http:\/\/localhost:4187\/v1\/navigate"/);
  assert.equal(DEPLOYMENT_CONFIG.aiEndpoint.startsWith('https://'), true);
  assert.throws(() => previewHtml('', 'http://localhost:4187'));
  assert.equal(previewHtml(html, 'http://localhost:4187').includes('turnstile-test.js'), false);
  assert.match(previewHtml(html + '</head><body>', 'http://localhost:4187', true), /Test verification \(not a human check\)/);
});

test('preview refuses non-loopback upstreams', () => {
  for (const workerOrigin of ['https://example.com', 'http://user:password@127.0.0.1:8999', 'http://127.0.0.1:8999/path']) assert.throws(() => createPreviewServer({ root: '.', workerOrigin }));
});

test('symlinks cannot expose private inside-root or outside-root targets', async () => {
  const root = path.resolve('fixture-preview-root');
  for (const [index, target] of [path.join(root, 'worker', 'private.js'), path.resolve(root, '..', 'external.js')].entries()) {
    let reads = 0;
    const port = 4190 + index;
    const fsImpl = { realpath: async file => file === root ? root : target, readFile: async () => { reads++; return Buffer.from('fixture private source'); } };
    const { server } = createPreviewServer({ root, port, fsImpl, logger: () => {} });
    server.listen(port, '127.0.0.1');
    await once(server, 'listening');
    try {
      const status = await new Promise((resolve, reject) => {
        const outgoing = http.get({ hostname: '127.0.0.1', port, path: '/assets/link.js', headers: { Host: `localhost:${port}` } }, incoming => { incoming.resume(); incoming.on('end', () => resolve(incoming.statusCode)); });
        outgoing.on('error', reject);
      });
      assert.equal(status, 404);
      assert.equal(reads, 0);
    } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
  }
});

test('preview gates Host, Origin, JSON and preserves real provider mode', async () => {
  const calls = [];
  const port = 4189;
  const origin = `http://localhost:${port}`;
  const { server, state } = createPreviewServer({ root: fileURLToPath(new URL('../', import.meta.url)), port, fetchImpl: async (url, options) => { calls.push({ url, headers: options.headers }); return Response.json({ mode: 'nvidia', sections: [] }); }, logger: () => {} });
  server.listen(port, '127.0.0.1');
  await once(server, 'listening');
  const request = (route, options = {}) => new Promise((resolve, reject) => {
    const outgoing = http.request({ hostname: '127.0.0.1', port, path: route, method: options.method || 'GET', headers: { Host: `localhost:${port}`, ...options.headers } }, incoming => {
      const chunks = [];
      incoming.on('data', chunk => chunks.push(chunk));
      incoming.on('end', () => resolve(new Response(incoming.statusCode === 204 ? null : Buffer.concat(chunks), { status: incoming.statusCode, headers: incoming.headers })));
    });
    outgoing.on('error', reject);
    outgoing.end(options.body);
  });
  try {
    assert.equal((await request('/', { headers: { Host: 'attacker.example' } })).status, 403);
    assert.equal((await request('/.env')).status, 404);
    assert.equal((await request('/worker/src/index.js')).status, 404);
    assert.match(await (await request('/zh/')).text(), new RegExp(`${origin}/v1/navigate`));
    assert.equal((await request('/v1/navigate', { method: 'POST', headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' }, body: '{}' })).status, 403);
    assert.equal((await request('/v1/navigate', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
    assert.equal((await request('/v1/navigate', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: 'x' })).status, 400);
    assert.equal(calls.length, 0);
    const result = await request('/v1/navigate', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: 'zh-TW', query: 'Public test question', turnstileToken: 'unit-only' }) });
    assert.equal(result.status, 200);
    assert.equal((await result.json()).mode, 'nvidia');
    assert.equal(calls[0].headers.Origin, origin);
    assert.equal(state.lastGeneration.locale, 'zh-TW');
    assert.equal(JSON.stringify(state).includes('Public test question'), false);
    assert.equal((await request('/v1/events', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' })).status, 204);
    assert.equal(calls.length, 1);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
