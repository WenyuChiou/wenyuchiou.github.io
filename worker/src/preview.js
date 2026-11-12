import { handleRequest, parseNvidiaContent } from './index.js';
import { validateGuideOptions, validateGuidePayload, verifyGuideGrounding } from '../../guide-protocol.js';
import { GUIDE_EVIDENCE } from '../../guide-evidence.js';

export const TEST_SECRET = '1x0000000000000000000000000000000AA';
export const TEST_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX';
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function handlePreviewRequest(request, env, fetchImpl = fetch, previewEnabled = false) {
  const url = new URL(request.url);
  // Wrangler rewrites remote-preview URLs. Only the explicit dev CLI build flag
  // enables this entrypoint; an ordinary deploy remains disabled by default.
  if (previewEnabled !== true || env.ALLOWED_HOSTNAME !== 'localhost' || env.ALLOWED_ORIGIN !== 'http://localhost:4187') return Response.json({ error: 'preview_local_only' }, { status: 403 });
  if (env.PREVIEW_TEST_VERIFICATION !== 'enabled') return handleRequest(request, env, fetchImpl);
  let input = null;
  if (request.headers.get('Origin') === env.ALLOWED_ORIGIN && request.method === 'POST' && url.pathname === '/v1/navigate') {
    if (Number(request.headers.get('Content-Length')) > 4096) return Response.json({ error: 'request_too_large' }, { status: 413 });
    const reader = request.body?.getReader();
    let size = 0, timer;
    const chunks = [];
    const deadline = new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('body_timeout')), 5000); });
    try {
      if (!reader) throw new Error('invalid_body');
      while (true) {
        const { value, done } = await Promise.race([reader.read(), deadline]);
        if (done) break;
        size += value.byteLength;
        if (size > 4096) { void reader.cancel().catch(() => {}); return Response.json({ error: 'request_too_large' }, { status: 413 }); }
        chunks.push(value);
      }
      const raw = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { raw.set(chunk, offset); offset += chunk.byteLength; }
      input = JSON.parse(new TextDecoder().decode(raw));
      request = new Request(request, { body: raw });
    } catch (error) {
      if (reader) void reader.cancel().catch(() => {});
      return Response.json({ error: 'invalid_request' }, { status: error?.message === 'body_timeout' ? 408 : 400 });
    } finally { clearTimeout(timer); reader?.releaseLock(); }
  }
  let generationCheck = 'not_called';
  const expectedAction = url.pathname === '/v1/fit' ? 'fit' : 'navigate';
  const transport = async (target, options) => {
    if (String(target) !== SITEVERIFY) {
      const response = await fetchImpl(target, options);
      if (String(target) === 'https://integrate.api.nvidia.com/v1/chat/completions' && input?.task) {
        generationCheck = response.ok ? 'provider_ok' : 'provider_error';
        if (response.ok) try {
          const completion = await response.clone().json();
          const guideOptions = validateGuideOptions(input);
          const payload = validateGuidePayload(parseNvidiaContent(completion?.choices?.[0]?.message?.content), GUIDE_EVIDENCE, guideOptions);
          verifyGuideGrounding(payload, GUIDE_EVIDENCE, guideOptions, input.locale);
          generationCheck = 'validated';
        } catch (error) {
          const safeCodes = ['invalid_guide_payload', 'invalid_guide_matches', 'invalid_scene_citation', 'invalid_guide_sections', 'invalid_guide_view', 'unsupported_guide_prose', 'unsupported_guide_number'];
          generationCheck = safeCodes.includes(error?.message) ? error.message : 'invalid_generation';
        }
      }
      return response;
    }
    if (options.body.get('secret') !== TEST_SECRET || options.body.get('response') !== TEST_TOKEN) return Response.json({ success: false });
    const response = await fetchImpl(target, options);
    if (!response.ok) return response;
    const result = await response.json();
    // Official dummy credentials do not prove browser hostname/action. Only this
    // explicit test boundary supplies them; production verifyTurnstile is unchanged.
    if (result.success !== true || result.hostname !== 'example.com') return Response.json({ success: false });
    return Response.json({ success: true, hostname: 'localhost', action: expectedAction });
  };
  const result = await handleRequest(request, { ...env, TURNSTILE_SECRET: TEST_SECRET }, transport);
  result.headers.set('X-Preview-Verification', 'test-only');
  result.headers.set('X-Preview-Generation-Check', generationCheck);
  return result;
}

export default { fetch(request, env) {
  const enabled = typeof PORTFOLIO_OWNER_PREVIEW !== 'undefined' && PORTFOLIO_OWNER_PREVIEW === true;
  return handlePreviewRequest(request, env, fetch, enabled);
} };
