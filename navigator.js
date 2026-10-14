import { NAVIGATOR_INDEX } from "./navigator-data.js";
import { GUIDE_INTENTS, buildReadingPath } from "./portfolio-guide-data.js";
import { GUIDE_EVIDENCE } from "./guide-evidence.js";
import { GUIDE_STAGES, validateGuideOptions, validateGuidePayload } from "./guide-protocol.js";
import { activateProvenance } from "./features/provenance/loader.js";

const normalize = (value) => value
  .normalize("NFKC")
  .toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}\s-]/gu, " ")
  .replace(/\s+/g, " ")
  .trim();

const tokenize = (value) => normalize(value)
  .split(/\s+/)
  .filter((token) => token.length > 1);

export function toSemanticQuery(query) {
  const normalized = normalize(query);
  const expansions = [];
  Object.entries(NAVIGATOR_INDEX.aliases).forEach(([phrase, expansion]) => {
    if (normalized.includes(normalize(phrase))) expansions.push(expansion);
  });
  return [query, ...expansions].join(" ").trim();
}

function lexicalScore(record, query, locale) {
  const expanded = normalize(toSemanticQuery(query));
  const queryTokens = new Set(tokenize(expanded));
  const title = normalize(record.title[locale]);
  const summary = normalize(record.summary[locale]);
  const keywords = record.keywords[locale].map(normalize);
  const searchable = `${title} ${summary} ${keywords.join(" ")} ${normalize(record.semantic)}`;
  let score = 0;

  if (title.includes(normalize(query))) score += 12;
  keywords.forEach((keyword) => {
    if (expanded.includes(keyword) || keyword.includes(expanded)) score += 8;
  });
  queryTokens.forEach((token) => {
    if (title.includes(token)) score += 4;
    else if (keywords.some((keyword) => keyword.includes(token))) score += 3;
    else if (searchable.includes(token)) score += 1;
  });
  return score;
}

export function rankLocally(query, locale = "en", limit = 3) {
  const normalizedLocale = locale === "zh-TW" ? "zh-TW" : "en";
  const ranked = NAVIGATOR_INDEX.records
    .map((record, index) => ({ record, index, score: lexicalScore(record, query, normalizedLocale) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const positive = ranked.filter((item) => item.score > 0);
  const remaining = ranked.filter((item) => item.score <= 0);
  return (positive.length ? [...positive, ...remaining] : ranked).slice(0, limit);
}

function localizeHref(href, locale) {
  if (locale !== "zh-TW" || !href.startsWith("/") || href.startsWith("/zh/")) return href;
  return href === "/" ? "/zh/" : `/zh${href}`;
}

const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);

export function createSemanticRanker({
  loadTransformers = () => import(NAVIGATOR_INDEX.model.moduleUrl),
} = {}) {
  let extractorPromise;
  let corpusEmbeddingsPromise;

  const getExtractor = async (onProgress) => {
    if (!extractorPromise) {
      const attempt = (async () => {
        const transformers = await loadTransformers();
        transformers.env.allowLocalModels = false;
        transformers.env.allowRemoteModels = true;
        transformers.env.useBrowserCache = true;
        transformers.env.backends.onnx.wasm.wasmPaths = NAVIGATOR_INDEX.model.wasmPath;
        transformers.env.backends.onnx.wasm.proxy = false;
        return transformers.pipeline("feature-extraction", NAVIGATOR_INDEX.model.id, {
          dtype: "q8",
          revision: NAVIGATOR_INDEX.model.revision,
          progress_callback: onProgress,
        });
      })();
      extractorPromise = attempt;
      attempt.catch(() => {
        if (extractorPromise === attempt) extractorPromise = undefined;
        corpusEmbeddingsPromise = undefined;
      });
    }
    return extractorPromise;
  };

  return async (query, locale, onProgress, limit = 3) => {
    const extractor = await getExtractor(onProgress);
    if (!corpusEmbeddingsPromise) {
      const attempt = extractor(
        NAVIGATOR_INDEX.records.map((record) => record.semantic),
        { pooling: "mean", normalize: true },
      ).then((tensor) => tensor.tolist());
      corpusEmbeddingsPromise = attempt;
      attempt.catch(() => {
        if (corpusEmbeddingsPromise === attempt) corpusEmbeddingsPromise = undefined;
      });
    }
    const [corpusEmbeddings, queryTensor] = await Promise.all([
      corpusEmbeddingsPromise,
      extractor(toSemanticQuery(query), { pooling: "mean", normalize: true }),
    ]);
    const [queryEmbedding] = queryTensor.tolist();
    const localScores = NAVIGATOR_INDEX.records.map((record) => lexicalScore(record, query, locale));
    const maxLocal = Math.max(...localScores, 1);
    return NAVIGATOR_INDEX.records
      .map((record, index) => ({
        record,
        index,
        score: (dot(corpusEmbeddings[index], queryEmbedding) * 0.68) + ((localScores[index] / maxLocal) * 0.32),
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, limit);
  };
}

export function createRequestGate() {
  let latest = 0;
  return {
    next: () => ++latest,
    isCurrent: (request) => request === latest,
  };
}

export function validateNavigatorResponse(payload, guideOptions) {
  if (!payload || payload.mode !== "nvidia" || typeof payload.answer !== "string" || !Array.isArray(payload.matches)) throw new Error("invalid_nvidia_response");
  if (guideOptions) validateGuidePayload({ sections: payload.sections, matches: payload.matches.map(match => ({ id: match.id, reason: match.reason })), suggestedView: payload.suggestedView }, GUIDE_EVIDENCE, guideOptions);
  const records = new Map(NAVIGATOR_INDEX.records.map((record) => [record.id, record]));
  const seen = new Set();
  const matches = payload.matches.map((match) => {
    if (!match || typeof match.id !== "string" || !records.has(match.id) || seen.has(match.id)) throw new Error("unknown_record_id");
    seen.add(match.id);
    return { record: records.get(match.id), reason: typeof match.reason === "string" ? match.reason.slice(0, 240) : "" };
  });
  if (!payload.answer.trim() || matches.length < 1 || matches.length > 3) throw new Error("invalid_nvidia_response");
  return { answer: payload.answer.trim().slice(0, 1200), matches, ...(guideOptions ? { sections: payload.sections, suggestedView: payload.suggestedView } : {}) };
}

export async function requestNvidiaSummary({ endpoint, query, locale, turnstileToken, task, depth, context, signal, fetchImpl = fetch, timeoutMs = 8000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const options = task ? validateGuideOptions({ task, depth, context }) : null;
    const response = await fetchImpl(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, locale, turnstileToken, ...(options || {}) }), signal: signal ? AbortSignal.any([signal, controller.signal]) : controller.signal });
    if (!response.ok) throw new Error(`navigator_${response.status}`);
    return validateNavigatorResponse(await response.json(), options);
  } finally { clearTimeout(timeout); }
}

let turnstileLoader;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileLoader) turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(window.turnstile), { once: true });
    script.addEventListener("error", () => reject(new Error("turnstile_load_failed")), { once: true });
    document.head.append(script);
  });
  return turnstileLoader;
}

const turnstileRequests = new WeakMap();

export function cancelTurnstile(container) {
  turnstileRequests.get(container)?.cancel();
}

export function getTurnstileToken(container, sitekey, action = "navigate") {
  if (!sitekey) return Promise.reject(new Error("turnstile_not_configured"));
  cancelTurnstile(container);
  return new Promise((resolve, reject) => {
    let settled = false;
    let widgetId;
    let turnstile;
    const owner = { cancel: () => finish(new Error("turnstile_cancelled")) };
    const finish = (error, token) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { if (widgetId !== undefined) turnstile?.remove(widgetId); } catch {}
      if (turnstileRequests.get(container) === owner) {
        turnstileRequests.delete(container);
        delete container.dataset.widgetId;
        container.replaceChildren();
      }
      if (error) reject(error);
      else resolve(token);
    };
    const timer = setTimeout(() => finish(new Error("turnstile_timeout")), 45000);
    turnstileRequests.set(container, owner);
    loadTurnstile().then((api) => {
      if (settled || turnstileRequests.get(container) !== owner) return;
      turnstile = api;
      try {
        container.replaceChildren();
        widgetId = turnstile.render(container, {
          sitekey, action, theme: "auto", size: "flexible",
          callback: (token) => finish(typeof token === "string" && token ? null : new Error("turnstile_failed"), token),
          "error-callback": () => finish(new Error("turnstile_failed")),
          "expired-callback": () => finish(new Error("turnstile_expired")),
        });
        if (!settled) container.dataset.widgetId = String(widgetId);
        else { try { turnstile.remove(widgetId); } catch {} }
      } catch { finish(new Error("turnstile_failed")); }
    }, () => finish(new Error("turnstile_load_failed")));
  });
}

function eventEndpoint(endpoint) {
  if (!endpoint) return "";
  const url = new URL(endpoint);
  url.pathname = "/v1/events";
  return url.toString();
}

export function trackPortfolioEvent(event, locale, target, outcome = "attempt", metadata = {}) {
  if (window.location.origin !== "https://wenyuchiou.github.io") return;
  const endpoint = document.querySelector('meta[name="portfolio-ai-endpoint"]')?.content.trim() || "";
  const url = eventEndpoint(endpoint);
  if (!url) return;
  const bounded = {
    ...(["nvidia", "semantic", "local"].includes(metadata.mode) ? { mode: metadata.mode } : {}),
    ...Object.fromEntries(["strongCount", "adjacentCount", "gapCount"].map((key) => [key, Number.isInteger(metadata[key]) ? Math.max(0, Math.min(metadata[key], 6)) : 0])),
  };
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, locale, target, outcome, ...bounded }), keepalive: true }).catch(() => {});
}

export const rankSemantically = createSemanticRanker();

function isEditable(target) {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

export function initPortfolioNavigator(root = document) {
  const shell = root.querySelector("[data-portfolio-navigator]");
  if (!shell) return;
  const locale = shell.dataset.locale === "zh-TW" ? "zh-TW" : "en";
  const launch = shell.querySelector("[data-navigator-launch]");
  const dialog = shell.querySelector("dialog");
  const close = shell.querySelector("[data-navigator-close]");
  const form = shell.querySelector("form");
  const input = shell.querySelector("input");
  const status = shell.querySelector("[data-navigator-status]");
  const mode = shell.querySelector("[data-navigator-mode]");
  const results = shell.querySelector("[data-navigator-results]");
  const answer = shell.querySelector("[data-navigator-answer]");
  const readingIntro = shell.querySelector("[data-guide-intro]");
  const sections = shell.querySelector('[data-guide-sections]');
  const viewButton = shell.querySelector('[data-guide-view]');
  const contextLabel = shell.querySelector('[data-guide-context]');
  const submit = form.querySelector('[type="submit"]');
  const turnstileContainer = shell.querySelector("[data-turnstile-container]");
  const endpoint = document.querySelector('meta[name="portfolio-ai-endpoint"]')?.content.trim() || "";
  const sitekey = document.querySelector('meta[name="turnstile-site-key"]')?.content.trim() || "";
  const copy = shell.dataset;
  const inline = shell.dataset.inline === "true";
  const eventTarget = inline ? "hire" : "home";
  const requestGate = createRequestGate();
  let impressionTracked = false;
  let openTracked = false;
  let activeTask = 'research';
  let depth = 'beginner';
  let providerController;
  let suggestedView;
  let viewContext;
  let returnFocus;

  const readContext = () => {
    const scene = document.querySelector('.provenance-workbench');
    if (!scene) return null;
    try { return validateGuideOptions({ task: 'observatory', context: { lens: scene.dataset.lens, stage: scene.dataset.guideStage, mode: scene.dataset.guideMode, tenure: scene.dataset.guideTenure, repaired: scene.dataset.guideRepaired === 'true' } }).context; } catch { return null; }
  };
  const refreshContext = () => {
    const context = activeTask === 'observatory' ? readContext() : null;
    if (contextLabel) {
      contextLabel.hidden = !context;
      const selectedLens = document.querySelector(`[data-provenance-lens="${context?.lens}"] strong`);
      const selectedStage = document.querySelector(`[data-provenance-stage="${GUIDE_STAGES.indexOf(context?.stage) + 1}"] strong`);
      const detail = context?.lens === 'evaluation' ? document.querySelector('[data-comparison-mode][aria-pressed="true"]') : context?.lens === 'simulation' ? document.querySelector('[data-tenure][aria-pressed="true"]') : null;
      contextLabel.textContent = context ? `${copy.contextLabel}: ${selectedLens?.textContent || context.lens} / ${selectedStage?.textContent || context.stage}${detail ? ` / ${detail.textContent.trim()}` : ''}` : '';
    }
    return context;
  };

  const trackImpression = () => {
    if (impressionTracked) return;
    impressionTracked = true;
    trackPortfolioEvent("navigator_impression", locale, "home");
  };

  const setStatus = (message, activeMode = "") => {
    status.textContent = message;
    mode.textContent = activeMode;
  };

  const renderResults = (ranked) => {
    results.replaceChildren();
    ranked.forEach(({ record, reason }, index) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const number = document.createElement("span");
      const text = document.createElement("span");
      const title = document.createElement("strong");
      const summary = document.createElement("small");
      const arrow = document.createElement("span");
      link.href = localizeHref(record.href, locale);
      link.setAttribute("aria-label", `${copy.resultLabel}: ${record.title[locale]}`);
      number.className = "navigator-result-number";
      number.textContent = String(index + 1).padStart(2, "0");
      title.textContent = record.title[locale];
      summary.textContent = reason || record.summary[locale];
      link.dataset.navigatorRecord = record.id;
      arrow.className = "navigator-result-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      text.append(title, summary);
      link.append(number, text, arrow);
      item.append(link);
      const details = GUIDE_EVIDENCE.find(evidence => evidence.id === record.id);
      if (details) {
        const disclosure = document.createElement('details');
        const label = document.createElement('summary');
        label.textContent = copy.boundaries;
        const boundary = document.createElement('p');
        boundary.textContent = details.limitations[locale];
        const source = document.createElement('a');
        source.href = details.source.url;
        source.textContent = copy.sourceLabel;
        source.rel = 'noopener noreferrer';
        disclosure.append(label, boundary, source);
        item.append(disclosure);
      }
      results.append(item);
    });
  };

  const invalidate = () => {
    providerController?.abort();
    cancelTurnstile(turnstileContainer);
    requestGate.next();
    submit.disabled = false;
    form.removeAttribute('aria-busy');
    suggestedView = null;
    if (viewButton) viewButton.hidden = true;
  };
  const localGuideResults = (query, context) => {
    const path = buildReadingPath(activeTask, locale, { query, context });
    if (activeTask !== 'research' || !query) return path.matches;
    const allowed = new Set(GUIDE_EVIDENCE.filter(record => record.tasks.includes(activeTask)).map(record => record.id));
    const seen = new Set();
    return [...rankLocally(query, locale, NAVIGATOR_INDEX.records.length).filter(item => allowed.has(item.record.id)), ...path.matches].filter(item => {
      if (seen.has(item.record.id)) return false;
      seen.add(item.record.id); return true;
    }).slice(0, 3);
  };
  const renderLocal = (rawQuery, intentId) => {
    invalidate();
    answer.hidden = true;
    answer.textContent = '';
    const query = rawQuery.trim().slice(0, 180);
    const path = !inline ? buildReadingPath(intentId || activeTask, locale, { query, context: refreshContext() }) : null;
    if (sections) { sections.replaceChildren(); sections.hidden = true; }
    if (readingIntro) {
      readingIntro.hidden = !path;
      readingIntro.textContent = path?.intro || '';
    }
    renderResults(path ? localGuideResults(query, refreshContext()) : rankLocally(query, locale));
    setStatus(path ? copy.ready : copy.matching, copy.local);
  };
  const chooseIntent = (id) => {
    const intent = GUIDE_INTENTS.find(item => item.id === id && item.query);
    if (!intent) return;
    activeTask = id;
    input.value = intent.query[locale];
    shell.querySelectorAll('[data-guide-intent]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.guideIntent === id)));
    renderLocal(input.value, id);
    if (id === 'observatory') void activateProvenance().then(() => refreshContext()).catch(() => {});
  };

  const openDialog = () => {
    if (!dialog) return;
    const wasOpen = dialog.open;
    if (!wasOpen) { returnFocus = document.activeElement; dialog.showModal(); }
    if (!input.value.trim()) {
      renderLocal('', 'research');
      shell.querySelectorAll('[data-guide-intent]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.guideIntent === activeTask)));
    }
    requestAnimationFrame(() => input.focus());
    if (!wasOpen && !inline) {
      trackImpression();
      if (!openTracked) {
        openTracked = true;
        trackPortfolioEvent("navigator_open", locale, eventTarget);
      }
    }
  };

  const trackResultMode = (activeMode) => {
    if (!inline) trackPortfolioEvent("navigator_result_mode", locale, "home", "success", { mode: activeMode });
  };

  const runSearch = async (rawQuery) => {
    const query = (rawQuery.trim() || (!inline && GUIDE_INTENTS.find(intent => intent.id === activeTask)?.query[locale]) || '').slice(0, 180);
    if (!query) {
      input.focus();
      return;
    }
    if (inline) trackPortfolioEvent("recruiter_navigator_use", locale, "hire");
    else trackPortfolioEvent("navigator_query_submit", locale, "home");
    const currentRequest = requestGate.next();
    providerController?.abort();
    providerController = new AbortController();
    const controller = providerController;
    const context = refreshContext();
    const contextKey = JSON.stringify(context);
    const current = () => requestGate.isCurrent(currentRequest) && (!context || contextKey === JSON.stringify(readContext()));
    const options = inline ? null : { task: activeTask, depth, context };
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    answer.hidden = true;
    answer.textContent = "";
    if (sections) { sections.replaceChildren(); sections.hidden = true; }
    if (viewButton) viewButton.hidden = true;
    if (readingIntro) readingIntro.hidden = true;
    results.setAttribute("aria-busy", "true");
    setStatus(copy.matching, copy.local);
    const localResults = inline ? rankLocally(query, locale) : localGuideResults(query, context);
    renderResults(localResults);
    results.removeAttribute("aria-busy");

    if (!navigator.onLine || navigator.connection?.saveData) {
      setStatus(copy.fallback, copy.local);
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      trackResultMode("local");
      return;
    }

    if (endpoint && sitekey) {
      setStatus(copy.loading, copy.local);
      try {
        const turnstileToken = await getTurnstileToken(turnstileContainer, sitekey);
        if (!current()) return;
        const nvidia = await requestNvidiaSummary({ endpoint, query, locale, turnstileToken, ...(options || {}), signal: controller.signal });
        if (!current()) return;
        if (sections && nvidia.sections) {
          nvidia.sections.forEach(section => {
            const block = document.createElement('section');
            const heading = document.createElement('h3');
            heading.textContent = copy[section.kind];
            const paragraph = document.createElement('p');
            paragraph.textContent = section.text;
            const citations = document.createElement('nav');
            citations.setAttribute('aria-label', `${heading.textContent}: ${copy.resultLabel}`);
            section.evidenceIds.forEach(id => {
              const record = NAVIGATOR_INDEX.records.find(item => item.id === id);
              const link = document.createElement('a');
              link.href = localizeHref(record.href, locale);
              link.textContent = record.title[locale];
              citations.append(link);
            });
            block.append(heading, paragraph, citations);
            sections.append(block);
          });
          sections.hidden = false;
          suggestedView = nvidia.suggestedView;
          viewContext = contextKey;
          if (viewButton) viewButton.hidden = !suggestedView;
        } else { answer.textContent = nvidia.answer; answer.hidden = false; }
        renderResults(nvidia.matches);
        setStatus(copy.generatedReady, copy.nvidia);
        submit.disabled = false;
        form.removeAttribute('aria-busy');
        trackPortfolioEvent(inline ? "recruiter_navigator_use" : "navigator_answer", locale, eventTarget, "success");
        trackResultMode("nvidia");
        return;
      } catch (error) {
        if (!current()) return;
        if (error.message === 'navigator_422') {
          setStatus(copy.unsupported || copy.fallback, copy.local);
          submit.disabled = false;
          form.removeAttribute('aria-busy');
          return;
        }
      }
    }

    setStatus(copy.fallback, copy.local);
    try {
      const semanticResults = await rankSemantically(query, locale, () => {
        if (current()) setStatus(copy.fallback, copy.local);
      });
      if (!current()) return;
      const allowed = new Set(GUIDE_EVIDENCE.filter(record => record.tasks.includes(activeTask)).map(record => record.id));
      const filtered = inline ? semanticResults : semanticResults.filter(item => allowed.has(item.record.id)).sort((a, b) => (b.score + lexicalScore(b.record, query, locale) * 0.1) - (a.score + lexicalScore(a.record, query, locale) * 0.1));
      if (filtered.length) renderResults(filtered);
      setStatus(copy.fallback, copy.semantic);
      trackResultMode("semantic");
    } catch {
      if (!current()) return;
      setStatus(copy.fallback, copy.local);
      trackResultMode("local");
    } finally {
      if (current()) {
        submit.disabled = false;
        form.removeAttribute('aria-busy');
      }
    }
  };

  launch?.addEventListener("click", openDialog);
  close?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("close", () => {
    if (form.getAttribute('aria-busy') === 'true') renderLocal(input.value);
    else invalidate();
    (returnFocus?.isConnected ? returnFocus : launch)?.focus();
  });
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    runSearch(input.value);
  });
  input.addEventListener('input', () => {
    shell.querySelectorAll('[data-guide-intent]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    renderLocal(input.value);
  });
  shell.querySelectorAll('[data-guide-intent]').forEach(control => control.addEventListener('click', () => chooseIntent(control.dataset.guideIntent)));
  shell.querySelectorAll('[data-guide-depth]').forEach(control => control.addEventListener('click', () => {
    depth = control.dataset.guideDepth;
    shell.querySelectorAll('[data-guide-depth]').forEach(button => button.setAttribute('aria-pressed', String(button === control)));
    renderLocal(input.value);
  }));
  document.addEventListener('click', event => {
    const entry = event.target.closest?.('[data-guide-open]');
    if (!entry || !dialog) return;
    chooseIntent(entry.dataset.guideOpen);
    if (entry.dataset.guideQuery) { input.value = entry.dataset.guideQuery; renderLocal(input.value); }
    openDialog();
  });
  document.addEventListener('provenance:change', () => {
    if (activeTask === 'observatory' && dialog?.open) renderLocal(input.value);
  });
  viewButton?.addEventListener('click', async () => {
    if (!suggestedView || viewContext !== JSON.stringify(readContext())) return;
    const target = suggestedView;
    dialog?.close();
    try {
      await activateProvenance();
      document.querySelector(`[data-provenance-lens="${target.lens}"]`)?.click();
      await new Promise(resolve => requestAnimationFrame(resolve));
      if (document.querySelector('.provenance-workbench')?.dataset.lens !== target.lens) return;
      document.querySelector(`[data-provenance-stage="${GUIDE_STAGES.indexOf(target.stage) + 1}"]`)?.click();
      document.querySelector('[data-provenance-inspector]')?.scrollIntoView({ block: 'center', behavior: 'instant' });
      document.querySelector(`[data-provenance-stage="${GUIDE_STAGES.indexOf(target.stage) + 1}"]`)?.focus();
    } catch { /* Existing scene and static sources remain readable. */ }
  });
  window.addEventListener('pagehide', invalidate);
  shell.querySelectorAll("[data-navigator-query]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      input.value = control.dataset.navigatorQuery;
      renderLocal(input.value);
    });
  });
  results.addEventListener("click", (event) => {
    const link = event.target.closest?.("[data-navigator-record]");
    if (!inline && link?.dataset.navigatorRecord) trackPortfolioEvent("navigator_evidence_open", locale, link.dataset.navigatorRecord, "success");
  });
  if (!inline && launch) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trackImpression();
        observer.disconnect();
      }, { threshold: 0.5 });
      observer.observe(launch);
    } else trackImpression();
  }
  if (!inline) document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
    event.preventDefault();
    openDialog();
  });
}
