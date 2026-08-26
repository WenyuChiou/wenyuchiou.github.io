import { CONTENT } from "./content.js";
import { FIT_CAPABILITIES, FIT_OWNERSHIP, FIT_ROLE_PRESETS } from "./fit-data.js";
import { NAVIGATOR_INDEX } from "./navigator-data.js";
import { createRequestGate, getTurnstileToken, rankLocally, rankSemantically, trackPortfolioEvent } from "./navigator.js";

const RECORDS = new Map(NAVIGATOR_INDEX.records.map((record) => [record.id, record]));
const MAX_JD_LENGTH = 8000;
const SOURCE_LABELS = {
  "verified-profile": { en: "Verified profile", "zh-TW": "可驗證職位摘要" },
  "portfolio-profile": { en: "Portfolio profile", "zh-TW": "作品集能力摘要" },
  "case-study": { en: "Case study", "zh-TW": "案例研究" },
  "published-case": { en: "Published research", "zh-TW": "已發表研究" },
  "research-program": { en: "Research program", "zh-TW": "研究計畫" },
  "publication-record": { en: "Publication record", "zh-TW": "著作紀錄" },
  "methods-article": { en: "Methods article", "zh-TW": "方法文章" },
  "github-repository": { en: "GitHub repository", "zh-TW": "GitHub 專案" },
  "resume-cv": { en: "Resume and CV", "zh-TW": "履歷與學術 CV" },
  "profile-page": { en: "Profile page", "zh-TW": "個人簡介" },
  contact: { en: "Contact", "zh-TW": "聯絡方式" },
};

const localizeHref = (href, locale) => {
  if (locale !== "zh-TW" || !href.startsWith("/") || href.startsWith("/assets/") || href.startsWith("/zh/")) return href;
  return `/zh${href}`.replace(/\/+/g, "/");
};

const localizedRecord = (record, locale) => ({
  id: record.id,
  title: record.title[locale],
  summary: record.summary[locale],
  href: localizeHref(record.href, locale),
  sourceType: SOURCE_LABELS[record.fit.sourceType]?.[locale] || record.fit.sourceType,
  evidenceStrength: record.fit.evidenceStrength,
});

function splitRequirements(jobDescription) {
  const matches = jobDescription.match(/[^.!?。！？\r\n]+[.!?。！？]?/g) || [];
  const cleaned = matches
    .map((item) => item.replace(/^\s*[-*•\d.)]+\s*/, "").replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 8);
  return [...new Set(cleaned)].slice(0, 6);
}

function capabilityFor(record, locale, fallback) {
  const capabilityId = record?.fit.capabilities[0];
  return capabilityId && FIT_CAPABILITIES[capabilityId] ? FIT_CAPABILITIES[capabilityId][locale] : fallback;
}

function defaultItem(item, locale) {
  return {
    id: `${item.fit}-${item.capabilityId}`,
    requirement: item.requirement[locale],
    priority: item.priority,
    capability: FIT_CAPABILITIES[item.capabilityId][locale],
    evidence: item.evidenceIds.map((id) => localizedRecord(RECORDS.get(id), locale)),
  };
}

export function buildLocalFitReport({ rolePreset, jobDescription = "", locale = "en" }) {
  const language = locale === "zh-TW" ? "zh-TW" : "en";
  const presetId = FIT_ROLE_PRESETS[rolePreset] ? rolePreset : "llm-evaluation";
  const preset = FIT_ROLE_PRESETS[presetId];
  const copy = CONTENT[language].hire.fitExplorer;
  const requirements = splitRequirements(jobDescription.trim().slice(0, MAX_JD_LENGTH));
  const classified = requirements.length ? requirements.map((requirement, index) => {
    const candidates = rankLocally(requirement, language, NAVIGATOR_INDEX.records.length)
      .filter(({ record }) => record.fit.roleRelevance.includes(presetId));
    const best = candidates[0];
    const direct = best?.record.fit.evidenceStrength === "direct";
    const fit = best?.score >= 6 && direct ? "strong" : best?.score >= 2 ? "adjacent" : "gap";
    const evidence = fit === "gap" ? [] : candidates.filter(({ score }) => score > 0).slice(0, 2).map(({ record }) => localizedRecord(record, language));
    return {
      fit,
      item: {
        id: `${fit}-local-${index}`,
        requirement,
        priority: index < 3 ? "required" : "preferred",
        capability: fit === "gap" ? copy.notVerified : capabilityFor(best?.record, language, copy.notVerified),
        evidence,
      },
    };
  }) : preset.defaultRequirements.map((item) => ({ fit: item.fit, item: defaultItem(item, language) }));

  const select = (fit) => classified.filter((item) => item.fit === fit).map((item) => item.item);
  const evidence = classified.flatMap(({ item }) => item.evidence);
  const recommendedEvidence = [...new Map(evidence.map((item) => [item.id, item])).values()].slice(0, 4);
  return {
    mode: "local",
    locale: language,
    role: { id: presetId, title: preset.title[language], interpretation: preset.interpretation[language] },
    strongFit: select("strong"),
    adjacentFit: select("adjacent"),
    evidenceGaps: select("gap"),
    ownership: preset.ownershipIds.map((id) => FIT_OWNERSHIP[id][language]),
    recommendedEvidence,
  };
}

function validateEvidence(evidence, locale) {
  if (!Array.isArray(evidence)) throw new Error("invalid_fit_evidence");
  return evidence.map((item) => {
    if (!item || typeof item.id !== "string" || !RECORDS.has(item.id)) throw new Error("invalid_fit_evidence");
    return localizedRecord(RECORDS.get(item.id), locale);
  });
}

export function validateFitResponse(payload, expectedRole, locale) {
  if (!payload || payload.mode !== "nvidia" || payload.role?.id !== expectedRole) throw new Error("invalid_fit_response");
  const language = locale === "zh-TW" ? "zh-TW" : "en";
  const parseItems = (items, allowEmptyEvidence = false) => {
    if (!Array.isArray(items)) throw new Error("invalid_fit_response");
    return items.slice(0, 6).map((item) => {
      if (!item || typeof item.requirement !== "string" || typeof item.capability !== "string") throw new Error("invalid_fit_response");
      const evidence = validateEvidence(item.evidence, language);
      if (!allowEmptyEvidence && evidence.length < 1) throw new Error("invalid_fit_response");
      return { id: String(item.id || "fit-item"), requirement: item.requirement.slice(0, 180), priority: item.priority, capability: item.capability.slice(0, 160), evidence };
    });
  };
  if (!Array.isArray(payload.ownership) || !Array.isArray(payload.recommendedEvidence)) throw new Error("invalid_fit_response");
  return {
    mode: "nvidia",
    locale: language,
    role: {
      id: expectedRole,
      title: FIT_ROLE_PRESETS[expectedRole].title[language],
      interpretation: FIT_ROLE_PRESETS[expectedRole].interpretation[language],
    },
    strongFit: parseItems(payload.strongFit),
    adjacentFit: parseItems(payload.adjacentFit),
    evidenceGaps: parseItems(payload.evidenceGaps, true),
    ownership: payload.ownership.filter((item) => typeof item === "string").slice(0, 4),
    recommendedEvidence: validateEvidence(payload.recommendedEvidence, language).slice(0, 4),
  };
}

export async function requestNvidiaFit({ endpoint, rolePreset, jobDescription, locale, turnstileToken, fetchImpl = fetch, timeoutMs = 8000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rolePreset, jobDescription, locale, turnstileToken }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`fit_http_${response.status}`);
    return validateFitResponse(await response.json(), rolePreset, locale);
  } finally {
    clearTimeout(timeout);
  }
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderFitSection(container, title, tone, items, copy) {
  const section = element("section", `fit-result-group is-${tone}`);
  const heading = element("div", "fit-result-heading");
  const icon = element("span", "fit-result-symbol", tone === "strong" ? "✓" : tone === "adjacent" ? "↗" : "?");
  const headingText = element("h4", "", title);
  const count = element("span", "fit-result-count", String(items.length).padStart(2, "0"));
  heading.append(icon, headingText, count);
  const list = element("ol", "fit-result-list");
  if (!items.length) {
    const empty = element("p", "fit-result-empty", tone === "gap" ? copy.noGaps : copy.noMatches);
    section.append(heading, empty);
    container.append(section);
    return;
  }
  items.forEach((item, index) => {
    const row = element("li", "fit-result-item");
    const button = element("button", "fit-result-toggle");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    const detailsId = `fit-details-${tone}-${index + 1}`;
    button.setAttribute("aria-controls", detailsId);
    const requirement = element("span", "fit-result-requirement");
    requirement.append(element("small", "", copy.requirementLabel), element("strong", "", item.requirement));
    const capability = element("span", "fit-result-capability");
    capability.append(element("small", "", copy.capabilityLabel), element("strong", "", item.capability));
    const evidenceLabel = item.evidence.length ? `${item.evidence.length} ${item.evidence.length === 1 ? copy.sourceLabel : copy.sourcesLabel}` : copy.discussLabel;
    const evidence = element("span", "fit-result-evidence");
    evidence.append(element("small", "", copy.evidenceLabel), element("strong", "", evidenceLabel));
    const arrow = element("span", "fit-result-arrow", "↓");
    arrow.setAttribute("aria-hidden", "true");
    button.append(requirement, capability, evidence, arrow);
    const details = element("div", "fit-result-details");
    details.id = detailsId;
    details.hidden = true;
    if (item.evidence.length) {
      const links = element("ul", "fit-evidence-links");
      item.evidence.forEach((record) => {
        const listItem = element("li");
        const link = element("a");
        link.href = record.href;
        link.dataset.fitEvidence = record.id;
        link.append(element("strong", "", record.title), element("span", "", record.summary), element("span", "fit-evidence-source", `${record.sourceType} ↗`));
        listItem.append(link);
        links.append(listItem);
      });
      details.append(links);
    } else {
      details.append(element("p", "fit-gap-note", copy.gapNote));
    }
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      details.hidden = expanded;
      row.classList.toggle("is-open", !expanded);
    });
    row.append(button, details);
    list.append(row);
  });
  section.append(heading, list);
  container.append(section);
}

function renderReport(shell, report, copy) {
  const result = shell.querySelector("[data-fit-result]");
  const status = shell.querySelector("[data-fit-status]");
  result.replaceChildren();
  const header = element("header", "fit-report-header");
  const kicker = element("p", "eyebrow", report.mode === "nvidia" ? copy.nvidiaMode : copy.localMode);
  const title = element("h3", "", report.role.title);
  const interpretation = element("p", "", report.role.interpretation);
  header.append(kicker, title, interpretation);
  result.append(header);

  const groups = element("div", "fit-result-groups");
  renderFitSection(groups, copy.strongTitle, "strong", report.strongFit, copy);
  renderFitSection(groups, copy.adjacentTitle, "adjacent", report.adjacentFit, copy);
  renderFitSection(groups, copy.gapTitle, "gap", report.evidenceGaps, copy);
  result.append(groups);

  const lower = element("div", "fit-report-lower");
  const ownership = element("section", "fit-ownership");
  ownership.append(element("h4", "", copy.ownershipTitle));
  const ownershipList = element("ul");
  report.ownership.forEach((item) => ownershipList.append(element("li", "", item)));
  ownership.append(ownershipList);
  const recommended = element("section", "fit-recommended");
  recommended.append(element("h4", "", copy.recommendedTitle));
  const recommendedList = element("ol");
  report.recommendedEvidence.forEach((record, index) => {
    const item = element("li");
    const link = element("a");
    link.href = record.href;
    link.dataset.fitEvidence = record.id;
    link.append(element("span", "", String(index + 1).padStart(2, "0")), element("strong", "", record.title), element("span", "", "↗"));
    item.append(link);
    recommendedList.append(item);
  });
  recommended.append(recommendedList);
  lower.append(ownership, recommended);
  result.append(lower);
  const actions = element("div", "fit-report-actions");
  const actionDefinitions = [
    [shell.dataset.resumeHref, copy.resumeLabel, "resume"],
    [shell.dataset.emailHref, copy.emailLabel, "email"],
    [shell.dataset.linkedinHref, copy.linkedinLabel, "linkedin"],
  ];
  actionDefinitions.forEach(([href, label, action]) => {
    const link = element("a", action === "resume" ? "button button-dark" : "button button-outline", label);
    link.href = href;
    link.dataset.fitAction = action;
    if (action === "resume") link.setAttribute("download", "");
    actions.append(link);
  });
  result.append(actions);
  result.hidden = false;
  status.textContent = report.mode === "nvidia" ? copy.complete : copy.localComplete;
}

function fitEndpoint(navigateEndpoint) {
  if (!navigateEndpoint) return "";
  try {
    const url = new URL(navigateEndpoint);
    url.pathname = "/v1/fit";
    return url.href;
  } catch {
    return "";
  }
}

export function initRecruiterFitExplorer(root = document) {
  const shell = root.querySelector("[data-recruiter-fit-explorer]");
  if (!shell) return;
  const locale = shell.dataset.locale === "zh-TW" ? "zh-TW" : "en";
  const copy = CONTENT[locale].hire.fitExplorer;
  const form = shell.querySelector("[data-fit-form]");
  const textarea = shell.querySelector("[data-fit-jd]");
  const counter = shell.querySelector("[data-fit-count]");
  const status = shell.querySelector("[data-fit-status]");
  const submit = shell.querySelector("[data-fit-submit]");
  const turnstileContainer = shell.querySelector("[data-fit-turnstile]");
  const navigateEndpoint = document.querySelector('meta[name="portfolio-ai-endpoint"]')?.content.trim() || "";
  const endpoint = fitEndpoint(navigateEndpoint);
  const sitekey = document.querySelector('meta[name="turnstile-site-key"]')?.content.trim() || "";
  const gate = createRequestGate();
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  const initialRole = FIT_ROLE_PRESETS[requestedRole] ? requestedRole : "llm-evaluation";
  const initialControl = shell.querySelector(`[data-fit-role][value="${initialRole}"]`);
  if (initialControl) initialControl.checked = true;
  counter.textContent = "0";
  trackPortfolioEvent("fit_explorer_open", locale, initialRole);

  textarea.addEventListener("input", () => {
    if (textarea.value.length > MAX_JD_LENGTH) textarea.value = textarea.value.slice(0, MAX_JD_LENGTH);
    counter.textContent = String(textarea.value.length);
  });
  shell.querySelectorAll("[data-fit-role]").forEach((control) => control.addEventListener("change", () => {
    trackPortfolioEvent("fit_role_selected", locale, control.value);
  }));
  shell.addEventListener("click", (event) => {
    const rolePreset = shell.querySelector("[data-fit-role]:checked")?.value || "llm-evaluation";
    const link = event.target.closest?.("[data-fit-evidence]");
    if (link) trackPortfolioEvent("fit_evidence_open", locale, rolePreset);
    const action = event.target.closest?.("[data-fit-action]")?.dataset.fitAction;
    if (action === "resume") trackPortfolioEvent("fit_resume_download", locale, rolePreset);
    if (action === "email" || action === "linkedin") trackPortfolioEvent("fit_contact_click", locale, rolePreset);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const rolePreset = shell.querySelector("[data-fit-role]:checked")?.value || "llm-evaluation";
    const jobDescription = textarea.value.trim().slice(0, MAX_JD_LENGTH);
    const requestId = gate.next();
    submit.disabled = true;
    shell.dataset.state = "analyzing";
    status.textContent = copy.analyzing;
    trackPortfolioEvent("fit_analysis_started", locale, rolePreset);
    try {
      const local = buildLocalFitReport({ rolePreset, jobDescription, locale });
      renderReport(shell, local, copy);

      if (navigator.onLine && !navigator.connection?.saveData && endpoint && sitekey) {
        try {
          status.textContent = copy.verifying;
          const turnstileToken = await getTurnstileToken(turnstileContainer, sitekey, "fit");
          const nvidia = await requestNvidiaFit({ endpoint, rolePreset, jobDescription, locale, turnstileToken });
          if (!gate.isCurrent(requestId)) return;
          renderReport(shell, nvidia, copy);
          trackPortfolioEvent("fit_result_mode", locale, rolePreset, "success", { mode: "nvidia", strongCount: nvidia.strongFit.length, adjacentCount: nvidia.adjacentFit.length, gapCount: nvidia.evidenceGaps.length });
          return;
        } catch {
          if (!gate.isCurrent(requestId)) return;
        }
      }

      if (navigator.onLine && !navigator.connection?.saveData) {
        try {
          const semantic = await rankSemantically(jobDescription || FIT_ROLE_PRESETS[rolePreset].semanticQuery, locale);
          if (gate.isCurrent(requestId)) {
            const existing = new Set(local.recommendedEvidence.map((item) => item.id));
            semantic.forEach(({ record }) => {
              if (!existing.has(record.id) && record.fit.roleRelevance.includes(rolePreset) && local.recommendedEvidence.length < 4) {
                local.recommendedEvidence.push(localizedRecord(record, locale));
                existing.add(record.id);
              }
            });
            renderReport(shell, local, copy);
          }
        } catch {}
      }
      if (gate.isCurrent(requestId)) trackPortfolioEvent("fit_result_mode", locale, rolePreset, "success", { mode: "local", strongCount: local.strongFit.length, adjacentCount: local.adjacentFit.length, gapCount: local.evidenceGaps.length });
    } finally {
      if (gate.isCurrent(requestId)) {
        submit.disabled = false;
        delete shell.dataset.state;
      }
    }
  });
}
