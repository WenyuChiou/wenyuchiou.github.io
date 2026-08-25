import { NAVIGATOR_INDEX } from "./navigator-data.js";

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

const rankSemantically = createSemanticRanker();

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
  const copy = shell.dataset;
  const requestGate = createRequestGate();

  const setStatus = (message, activeMode = "") => {
    status.textContent = message;
    mode.textContent = activeMode;
  };

  const renderResults = (ranked) => {
    results.replaceChildren();
    ranked.forEach(({ record }, index) => {
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
      summary.textContent = record.summary[locale];
      arrow.className = "navigator-result-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      text.append(title, summary);
      link.append(number, text, arrow);
      item.append(link);
      results.append(item);
    });
  };

  const openDialog = () => {
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => input.focus());
  };

  const runSearch = async (rawQuery) => {
    const query = rawQuery.trim().slice(0, 180);
    if (!query) {
      input.focus();
      return;
    }
    const currentRequest = requestGate.next();
    results.setAttribute("aria-busy", "true");
    setStatus(copy.matching, copy.local);
    const localResults = rankLocally(query, locale);
    renderResults(localResults);
    results.removeAttribute("aria-busy");

    if (!navigator.onLine || navigator.connection?.saveData) {
      setStatus(copy.fallback, copy.local);
      return;
    }

    setStatus(copy.loading, copy.local);
    try {
      const semanticResults = await rankSemantically(query, locale, () => {
        if (requestGate.isCurrent(currentRequest)) setStatus(copy.loading, copy.local);
      });
      if (!requestGate.isCurrent(currentRequest)) return;
      renderResults(semanticResults);
      setStatus(copy.ready, copy.semantic);
    } catch {
      if (!requestGate.isCurrent(currentRequest)) return;
      setStatus(copy.fallback, copy.local);
    }
  };

  launch.addEventListener("click", openDialog);
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => launch.focus());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(input.value);
  });
  shell.querySelectorAll("[data-navigator-query]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.navigatorQuery;
      runSearch(input.value);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
    event.preventDefault();
    openDialog();
  });
}
