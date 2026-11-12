import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEPLOYMENT_CONFIG } from '../deployment-config.mjs';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.txt': 'text/plain', '.xml': 'application/xml' };
const ROUTES = new Set(['', 'about', 'research', 'work', 'publications', 'hire']);

export function isPublicPath(relative) {
  const parts = relative.split('/');
  if (parts.some(part => !part || part.startsWith('.') || part.includes('\\') || part.includes(':'))) return false;
  if (relative.startsWith('assets/')) return Object.hasOwn(TYPES, path.extname(relative));
  if (['styles.css', 'editorial.css', 'robots.txt', 'sitemap.xml', 'data/github.json', 'data/updates.json', 'features/editorial/interactions.css', 'features/editorial/timeline.js'].includes(relative)) return true;
  if (parts.at(-1) !== 'index.html') return false;
  const route = parts[0] === 'zh' ? parts.slice(1, -1) : parts.slice(0, -1);
  return route.length === 0 || (ROUTES.has(route[0]) && (route.length === 1 || (route[0] === 'work' && route.length === 2)));
}

export function previewHtml(html, origin, testVerification = false) {
  const marker = `<meta name="portfolio-ai-endpoint" content="${DEPLOYMENT_CONFIG.aiEndpoint}">`;
  if (html.split(marker).length !== 2) throw new Error('Unexpected preview HTML configuration');
  let result = html.replace(marker, `<meta name="portfolio-ai-endpoint" content="${origin}/v1/navigate">`).replace('; upgrade-insecure-requests', '');
  if (testVerification) {
    const label = html.includes('<html lang="zh') ? '\u672c\u6a5f\u9810\u89bd \u00b7 \u6e2c\u8a66\u9a57\u8b49\uff08\u975e\u771f\u4eba\u9a57\u8b49\uff09 \u00b7 NVIDIA \u771f\u5be6\u751f\u6210' : 'Local preview \u00b7 Test verification (not a human check) \u00b7 NVIDIA live';
    result = result.replace('</head>', '<meta name="preview-verification" content="test-only"><script src="/__preview/turnstile-test.js"></script></head>');
    result = result.replace('<body>', `<body><aside role="status"><p>${label}</p></aside>`);
  }
  return result;
}

export function createPreviewServer({ root, port = 4187, workerOrigin = 'http://127.0.0.1:8999', testVerification = false, fetchImpl = fetch, fsImpl = fs, logger = console.log }) {
  if (typeof testVerification !== 'boolean') throw new Error('Invalid preview verification mode');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port');
  const upstream = new URL(workerOrigin);
  if (upstream.protocol !== 'http:' || upstream.hostname !== '127.0.0.1' || upstream.pathname !== '/' || upstream.search || upstream.hash || upstream.username || upstream.password) throw new Error('Worker preview must be a loopback origin');
  const origin = `http://localhost:${port}`;
  const rootPath = path.resolve(root);
  const state = { origin, workerOrigin: upstream.origin, verificationMode: testVerification ? 'test-only' : 'real', lastGeneration: null };
  const server = http.createServer(async (request, response) => {
    const send = (status, body, type = 'application/json') => {
      response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(typeof body === 'string' ? body : JSON.stringify(body));
    };
    try {
      if (![`localhost:${port}`, `127.0.0.1:${port}`].includes(request.headers.host)) return send(403, { error: 'host_not_allowed' });
      const url = new URL(request.url, origin);
      if (request.method === 'GET' && request.headers.host === `127.0.0.1:${port}`) {
        response.writeHead(302, { Location: `${origin}${url.pathname}${url.search}`, 'Cache-Control': 'no-store' });
        return response.end();
      }
      if (url.pathname.startsWith('/v1/')) {
        if (request.method !== 'POST') return send(405, { error: 'method_not_allowed' });
        if (request.headers.origin !== origin) return send(403, { error: 'origin_not_allowed' });
        if (!['/v1/navigate', '/v1/fit', '/v1/events'].includes(url.pathname) || url.search) return send(404, { error: 'not_found' });
        if (request.headers['content-type']?.split(';')[0] !== 'application/json') return send(415, { error: 'json_required' });
        let size = 0;
        const chunks = [];
        for await (const chunk of request) {
          size += chunk.length;
          if (size > 65536) return send(413, { error: 'request_too_large' });
          chunks.push(chunk);
        }
        const body = Buffer.concat(chunks).toString('utf8');
        let input;
        try { input = JSON.parse(body); } catch { return send(400, { error: 'invalid_json' }); }
        // Local acceptance traffic never enters production Analytics Engine.
        if (url.pathname === '/v1/events') { response.writeHead(204); return response.end(); }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 50000);
        response.once('close', () => controller.abort());
        try {
          const result = await fetchImpl(`${upstream.origin}${url.pathname}`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body, signal: controller.signal, redirect: 'error' });
          const text = await result.text();
          let mode = null;
          try { mode = JSON.parse(text).mode || null; } catch {}
          const safeChecks = ['not_called', 'provider_ok', 'provider_error', 'validated', 'invalid_guide_payload', 'invalid_guide_matches', 'invalid_scene_citation', 'invalid_guide_sections', 'invalid_guide_view', 'unsupported_guide_prose', 'unsupported_guide_number', 'invalid_generation'];
          const check = result.headers.get('X-Preview-Generation-Check');
          state.lastGeneration = { status: result.status, mode, check: safeChecks.includes(check) ? check : null, locale: ['en', 'zh-TW'].includes(input?.locale) ? input.locale : null, at: new Date().toISOString() };
          logger(`[preview AI] ${url.pathname} status=${result.status} mode=${mode || 'none'} locale=${state.lastGeneration.locale || 'none'} check=${state.lastGeneration.check || 'none'}`);
          return send(result.status, text);
        } catch {
          state.lastGeneration = { status: 502, mode: null, locale: null, at: new Date().toISOString() };
          return send(502, { error: 'preview_worker_unavailable' });
        } finally { clearTimeout(timer); }
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') return send(405, { error: 'method_not_allowed' });
      if (url.pathname === '/__preview/status') return send(200, state);
      if (url.pathname === '/__preview/turnstile-test.js') {
        if (!testVerification) return send(404, { error: 'not_found' });
        return send(200, await fsImpl.readFile(new URL('./preview-turnstile-test.js', import.meta.url), 'utf8'), 'text/javascript');
      }
      let relative;
      try { relative = decodeURIComponent(url.pathname).replace(/^\/+/, ''); } catch { return send(400, { error: 'invalid_path' }); }
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      if (!isPublicPath(relative)) return send(404, { error: 'not_found' });
      const file = await fsImpl.realpath(path.resolve(rootPath, relative));
      const resolvedRoot = await fsImpl.realpath(rootPath);
      const distance = path.relative(resolvedRoot, file);
      if (distance.startsWith('..') || path.isAbsolute(distance) || !isPublicPath(distance.split(path.sep).join('/'))) return send(404, { error: 'not_found' });
      const bytes = await fsImpl.readFile(file);
      const body = file.endsWith('.html') ? previewHtml(bytes.toString('utf8'), origin, testVerification) : bytes;
      response.writeHead(200, { 'Content-Type': TYPES[path.extname(file)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) { send(error?.code === 'ENOENT' ? 404 : 500, { error: error?.code === 'ENOENT' ? 'not_found' : 'preview_failed' }); }
  });
  return { server, origin, state };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const args = process.argv.slice(2);
  if (args.some(value => value !== '--test-verification') || args.length > 1) throw new Error('Unsupported preview argument');
  const { server, origin } = createPreviewServer({ root, testVerification: args.includes('--test-verification') });
  server.on('error', error => { console.error(`Preview failed: ${error.code || 'unavailable'}`); process.exitCode = 1; });
  server.listen(4187, '127.0.0.1', () => console.log(`Portfolio preview: ${origin}/ and ${origin}/zh/`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { server.closeAllConnections(); server.close(); });
}
