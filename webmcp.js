import { FIT_ROLE_PRESETS } from "./fit-data.js";
import { buildLocalFitReport } from "./fit-explorer.js";
import { NAVIGATOR_INDEX } from "./navigator-data.js";
import { rankLocally } from "./navigator.js";

const RECORDS = new Map(NAVIGATOR_INDEX.records.map((record) => [record.id, record]));
const RECORD_IDS = [...RECORDS.keys()];
const ROLE_IDS = Object.keys(FIT_ROLE_PRESETS);
const LENS_IDS = ["evaluation", "governance", "simulation"];
const registrations = new WeakMap();

const COPY = {
  en: {
    searchTitle: "Search Wenyu Chiou's portfolio",
    searchDescription: "Search Wenyu Chiou's public portfolio evidence for projects, research, articles, publications, open-source work, resumes, availability, or contact routes.",
    readTitle: "Read portfolio evidence",
    readDescription: "Read verified details for one or more evidence IDs returned by the portfolio search tool.",
    fitTitle: "Analyze recruiter fit",
    fitDescription: "Build a deterministic role-fit brief from Wenyu Chiou's public portfolio evidence. Gaps mean the website cannot verify a requirement, not that the candidate lacks it.",
    inspectTitle: "Inspect decision provenance",
    inspectDescription: "Select a Decision Provenance lens and stage in the visible page, then read its evidence status, validation focus, output, and linked case study.",
    fitNotice: "Based only on public portfolio evidence. An evidence gap means this website cannot verify the requirement.",
  },
  "zh-TW": {
    searchTitle: "搜尋邱文昱的作品集",
    searchDescription: "搜尋邱文昱公開作品集中的專案、研究、文章、著作、開源成果、履歷、可任職時間與聯絡入口。",
    readTitle: "讀取作品集證據",
    readDescription: "依作品集搜尋工具回傳的證據 ID，讀取一筆或多筆可驗證資料。",
    fitTitle: "分析招聘職位匹配",
    fitDescription: "只根據邱文昱的公開作品集證據建立確定性的職位匹配摘要；證據缺口表示網站目前無法證實，不代表候選人不具備該能力。",
    inspectTitle: "檢視決策來源軌跡",
    inspectDescription: "切換頁面上可見的 Decision Provenance lens 與階段，讀取證據狀態、驗證重點、產出及相關案例。",
    fitNotice: "結果只根據公開作品集證據。證據缺口代表本網站目前無法證實該項要求。",
  },
};

function pageLocale(documentRef) {
  return documentRef?.documentElement?.lang?.toLowerCase().startsWith("zh") ? "zh-TW" : "en";
}

function validateObject(input, allowedKeys) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new TypeError("invalid_input");
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) throw new TypeError("invalid_input");
  if (Object.keys(input).some((key) => !allowedKeys.includes(key))) throw new TypeError("unexpected_input");
}

function validateLocale(locale, fallback) {
  const value = locale === undefined ? fallback : locale;
  if (value !== "en" && value !== "zh-TW") throw new TypeError("invalid_locale");
  return value;
}

function localizeHref(href, locale) {
  if (locale !== "zh-TW" || !href.startsWith("/") || href.startsWith("/assets/") || href.startsWith("/zh/")) return href;
  return `/zh${href}`.replace(/\/+/g, "/");
}

function absoluteUrl(href, locale, windowRef) {
  const origin = windowRef?.location?.origin || "https://wenyuchiou.github.io";
  return new URL(localizeHref(href, locale), origin).href;
}

function publicRecord(record, locale, windowRef, detailed = false) {
  const result = {
    id: record.id,
    title: record.title[locale],
    summary: record.summary[locale],
    url: absoluteUrl(record.href, locale, windowRef),
    sourceType: record.fit.sourceType,
    evidenceStrength: record.fit.evidenceStrength,
  };
  if (detailed) {
    result.capabilities = [...record.fit.capabilities];
    result.roleRelevance = [...record.fit.roleRelevance];
    result.verifiedTerms = [...record.fit.verifiedTerms];
  }
  return result;
}

function safeSnippet(value, maximum) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximum);
}

function controlledRequirement(item, locale) {
  if (!/-local-\d+$/.test(String(item.id))) return safeSnippet(item.requirement, 180);
  if (item.evidence.length) {
    return locale === "zh-TW"
      ? `職缺需求對應至受控能力分類：${safeSnippet(item.capability, 120)}`
      : `Job requirement mapped to the controlled capability: ${safeSnippet(item.capability, 120)}`;
  }
  return locale === "zh-TW"
    ? "此網站目前無法證實職缺描述中的一項需求。"
    : "A requirement in the supplied job description is not verified by this website.";
}

function boundedFitItem(item, locale, windowRef) {
  return {
    id: safeSnippet(item.id, 80),
    requirement: controlledRequirement(item, locale),
    priority: ["required", "preferred", "contextual"].includes(item.priority) ? item.priority : "contextual",
    capability: safeSnippet(item.capability, 160),
    evidence: item.evidence.slice(0, 3).map((evidence) => publicRecord(RECORDS.get(evidence.id), locale, windowRef)),
  };
}

function frame(windowRef) {
  return new Promise((resolve) => {
    if (typeof windowRef?.requestAnimationFrame === "function") windowRef.requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });
}

function text(element) {
  return element?.textContent?.replace(/\s+/g, " ").trim() || "";
}

function schemas(locale) {
  const localeProperty = { type: "string", enum: ["en", "zh-TW"], default: locale };
  return {
    search: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 2, maxLength: 300, description: "Topic, capability, project, publication, document, availability, or contact information to find." },
        locale: localeProperty,
        limit: { type: "integer", minimum: 1, maximum: 5, default: 3 },
      },
      required: ["query"],
      additionalProperties: false,
    },
    read: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string", enum: RECORD_IDS }, minItems: 1, maxItems: 5, uniqueItems: true },
        locale: localeProperty,
      },
      required: ["ids"],
      additionalProperties: false,
    },
    fit: {
      type: "object",
      properties: {
        rolePreset: { type: "string", enum: ROLE_IDS },
        jobDescription: { type: "string", maxLength: 8000 },
        locale: localeProperty,
      },
      required: ["rolePreset"],
      additionalProperties: false,
    },
    inspect: {
      type: "object",
      properties: {
        lens: { type: "string", enum: LENS_IDS },
        stage: { type: "integer", minimum: 1, maximum: 5 },
      },
      required: ["lens", "stage"],
      additionalProperties: false,
    },
  };
}

export function createPortfolioWebMcpTools({ documentRef = globalThis.document, windowRef = globalThis.window } = {}) {
  const defaultLocale = pageLocale(documentRef);
  const copy = COPY[defaultLocale];
  const inputSchemas = schemas(defaultLocale);
  const tools = [
    {
      name: "search_portfolio",
      title: copy.searchTitle,
      description: copy.searchDescription,
      inputSchema: inputSchemas.search,
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute(input) {
        validateObject(input, ["query", "locale", "limit"]);
        const query = typeof input.query === "string" ? input.query.trim() : "";
        if (query.length < 2 || query.length > 300) throw new TypeError("invalid_query");
        const locale = validateLocale(input.locale, defaultLocale);
        const limit = input.limit === undefined ? 3 : input.limit;
        if (!Number.isInteger(limit) || limit < 1 || limit > 5) throw new TypeError("invalid_limit");
        const matches = rankLocally(query, locale, NAVIGATOR_INDEX.records.length)
          .filter(({ score }) => score > 0)
          .slice(0, limit)
          .map(({ record }) => publicRecord(record, locale, windowRef));
        return { locale, matches };
      },
    },
    {
      name: "read_portfolio_evidence",
      title: copy.readTitle,
      description: copy.readDescription,
      inputSchema: inputSchemas.read,
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      async execute(input) {
        validateObject(input, ["ids", "locale"]);
        if (!Array.isArray(input.ids) || input.ids.length < 1 || input.ids.length > 5 || input.ids.some((id) => typeof id !== "string")) throw new TypeError("invalid_ids");
        if (new Set(input.ids).size !== input.ids.length) throw new TypeError("duplicate_evidence_id");
        if (input.ids.some((id) => !RECORDS.has(id))) throw new TypeError("unknown_evidence_id");
        const locale = validateLocale(input.locale, defaultLocale);
        return { locale, records: input.ids.map((id) => publicRecord(RECORDS.get(id), locale, windowRef, true)) };
      },
    },
    {
      name: "analyze_recruiter_fit",
      title: copy.fitTitle,
      description: copy.fitDescription,
      inputSchema: inputSchemas.fit,
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      async execute(input) {
        validateObject(input, ["rolePreset", "jobDescription", "locale"]);
        if (!ROLE_IDS.includes(input.rolePreset)) throw new TypeError("invalid_role_preset");
        if (input.jobDescription !== undefined && (typeof input.jobDescription !== "string" || input.jobDescription.length > 8000)) throw new TypeError("invalid_job_description");
        const locale = validateLocale(input.locale, defaultLocale);
        const report = buildLocalFitReport({ rolePreset: input.rolePreset, jobDescription: input.jobDescription || "", locale });
        return {
          mode: "local_evidence_match",
          locale,
          notice: COPY[locale].fitNotice,
          role: {
            id: report.role.id,
            title: report.role.title,
            interpretation: report.role.interpretation,
          },
          strongFit: report.strongFit.slice(0, 6).map((item) => boundedFitItem(item, locale, windowRef)),
          adjacentFit: report.adjacentFit.slice(0, 6).map((item) => boundedFitItem(item, locale, windowRef)),
          evidenceGaps: report.evidenceGaps.slice(0, 6).map((item) => boundedFitItem(item, locale, windowRef)),
          ownership: report.ownership.slice(0, 4).map((item) => safeSnippet(item, 220)),
          recommendedEvidence: report.recommendedEvidence.slice(0, 4).map((item) => publicRecord(RECORDS.get(item.id), locale, windowRef)),
        };
      },
    },
  ];

  if (documentRef?.querySelector?.("[data-provenance-explorer]")) {
    tools.push({
      name: "inspect_decision_provenance",
      title: copy.inspectTitle,
      description: copy.inspectDescription,
      inputSchema: inputSchemas.inspect,
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input, options = {}) {
        validateObject(input, ["lens", "stage"]);
        if (!LENS_IDS.includes(input.lens)) throw new TypeError("invalid_lens");
        if (!Number.isInteger(input.stage) || input.stage < 1 || input.stage > 5) throw new TypeError("invalid_stage");
        options.signal?.throwIfAborted?.();
        const explorer = documentRef.querySelector("[data-provenance-explorer]");
        const lensButton = explorer?.querySelector(`[data-provenance-lens="${input.lens}"]`);
        if (!explorer || !lensButton) throw new Error("provenance_unavailable");
        lensButton.click();
        await frame(windowRef);
        const stageButton = explorer.querySelector(`[data-provenance-stage="${input.stage}"]`);
        if (!stageButton) throw new Error("provenance_stage_unavailable");
        stageButton.click();
        await frame(windowRef);
        await frame(windowRef);
        options.signal?.throwIfAborted?.();
        const inspector = explorer.querySelector("[data-provenance-inspector]");
        const caseHref = explorer.querySelector("[data-provenance-case]")?.getAttribute("href");
        if (!caseHref) throw new Error("provenance_case_unavailable");
        inspector?.scrollIntoView?.({ block: "center", behavior: "instant" });
        return {
          lens: input.lens,
          lensTitle: text(explorer.querySelector(`[data-provenance-lens="${input.lens}"] strong`)),
          stage: input.stage,
          summary: text(explorer.querySelector("[data-provenance-summary]")),
          status: text(explorer.querySelector("[data-provenance-status]")),
          title: text(explorer.querySelector("[data-provenance-title]")),
          description: text(explorer.querySelector("[data-provenance-description]")),
          focus: text(explorer.querySelector("[data-provenance-focus]")),
          output: text(explorer.querySelector("[data-provenance-output]")),
          caseUrl: absoluteUrl(caseHref, defaultLocale, windowRef),
        };
      },
    });
  }
  return tools;
}

export async function initWebMcpSiteTools({ documentRef = globalThis.document, windowRef = globalThis.window } = {}) {
  const context = documentRef?.modelContext;
  if (typeof context?.registerTool !== "function") return null;
  if (windowRef?.top && windowRef.top !== windowRef) return null;
  registrations.get(documentRef)?.abort();
  const lifecycle = new AbortController();
  registrations.set(documentRef, lifecycle);
  const stop = () => {
    if (registrations.get(documentRef) === lifecycle) registrations.delete(documentRef);
    lifecycle.abort();
  };
  try {
    for (const tool of createPortfolioWebMcpTools({ documentRef, windowRef })) {
      await Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal }));
    }
  } catch (error) {
    stop();
    throw error;
  }
  windowRef?.addEventListener?.("pagehide", stop, { once: true });
  return stop;
}
