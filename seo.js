import { PAGE_DEFINITIONS, localizedPath } from "./content.js";
import { FEATURE_CONTENT } from "./feature-content.js";

const siteUrl = "https://wenyuchiou.github.io";
const checkedAt = "2026-08-25";
const personId = `${siteUrl}/#wenyu-chiou`;

const EN_META = {
  home: {
    title: "Wenyu Chiou — LLM Evaluation & AI Research Engineer",
    description: "LLM behavior evaluation grounded in measured human evidence, governed agents that validate actions before state changes, and behavioral simulation for AI for science.",
  },
  work: {
    title: "Selected Work — Wenyu Chiou",
    description: "Case studies in human-grounded LLM evaluation, coupled household simulation, governed agents, and open-source research systems.",
  },
  "case:human-grounded-llm-evaluation": {
    title: "Human-Grounded LLM Evaluation — Wenyu Chiou",
    description: "A subgroup-aware study comparing LLM-generated decisions with pathways measured in 937 household profiles, with repeated-run stability checks.",
  },
  "case:floodabm": {
    title: "FLOODABM — Wenyu Chiou",
    description: "A 52,141-household coupled agent-based and catastrophe flood model spanning 27 census tracts, 2011–2023, with 50 runs per scenario.",
  },
  "case:wagf": {
    title: "WAGF Governed Agent System — Wenyu Chiou",
    description: "An in-preparation framework that parses, checks, repairs, and audits LLM-agent decisions before coupled simulation state updates.",
  },
  research: {
    title: "Research Program — Wenyu Chiou",
    description: "Research connecting psychometrics, subgroup-aware LLM evaluation, agent-based simulation, governance, and human–environment feedback.",
  },
  publications: {
    title: "Publications & Talks — Wenyu Chiou",
    description: "Journal articles, manuscripts, and presentations including Water Resources Research 2026, ISDSA 2026, AGU25, and ISHC 2025.",
  },
  articles: {
    title: "Articles on LLM Evaluation, Agent Governance & Simulation — Wenyu Chiou",
    description: "Practical articles on human-grounded LLM evaluation, validators for governed agents, and tracing individual decisions into system consequences.",
  },
  "article:evaluating-llm-agents-against-measured-human-behavior": { title: "Evaluating LLM Agents Against Measured Human Behavior — Wenyu Chiou", description: "Why behavioral LLM evaluation should compare decision structure, subgroup patterns, and stability rather than answer similarity alone." },
  "article:why-governed-agents-need-validators-before-state-changes": { title: "Why Governed Agents Need Validators Before State Changes — Wenyu Chiou", description: "A practical architecture that treats LLM outputs as proposals and validates, repairs, and audits them before state mutation." },
  "article:from-individual-decisions-to-system-consequences": { title: "From Individual Decisions to System Consequences — Wenyu Chiou", description: "How coupled simulation traces constrained decisions through environmental damage, updated state, and later behavior." },
  hire: {
    title: "Hire Wenyu Chiou — LLM Evaluation & AI Research Engineer",
    description: "Recruiter brief for Wenyu Chiou: human-grounded LLM evaluation, governed agent systems, behavioral simulation, verified technical fit, availability, resume, and contact.",
  },
  about: {
    title: "About — Wenyu Chiou",
    description: "Wenyu Chiou is a Lehigh University Ph.D. candidate working across human decision evidence, LLM evaluation, governed agents, and coupled simulation.",
  },
};

const ZH_META = {
  home: { title: "邱文昱｜LLM Evaluation 與 AI Research Engineer", description: "以實測人類行為為基礎的 LLM 評估、在狀態更新前驗證行動的受治理代理，以及用於 AI for Science 的行為模擬。" },
  work: { title: "精選工作｜邱文昱", description: "以人類證據為基礎的 LLM 評估、家戶洪水模擬、受治理代理與開源研究系統案例。" },
  "case:human-grounded-llm-evaluation": { title: "以人類證據為基礎的 LLM 評估｜邱文昱", description: "以 937 份家戶資料為基準，從整體與社會群體路徑比較 LLM 生成決策，並檢查重複執行穩定性。" },
  "case:floodabm": { title: "FLOODABM｜邱文昱", description: "涵蓋 52,141 個家戶、27 個人口普查區、2011 至 2023 年，且每個情境執行 50 次的耦合代理與巨災模型。" },
  "case:wagf": { title: "WAGF 受治理代理系統｜邱文昱", description: "在代理決策更新耦合模擬狀態前，進行解析、限制檢查、針對性修正與稽核的開發中框架。" },
  research: { title: "研究計畫｜邱文昱", description: "串連心理計量、群體感知 LLM 評估、代理模擬、治理與人類—環境回饋的研究計畫。" },
  publications: { title: "出版與演講｜邱文昱", description: "期刊文章、論文手稿與公開發表，包括 2026 Water Resources Research、ISDSA 2026、AGU25 與 ISHC 2025。" },
  articles: { title: "LLM 評估、代理治理與行為模擬文章｜邱文昱", description: "以實測人類行為評估 LLM、在狀態更新前驗證代理提案，以及追蹤個別決策到系統後果的實務文章。" },
  "article:evaluating-llm-agents-against-measured-human-behavior": { title: "以實測人類行為評估 LLM 代理｜邱文昱", description: "說明為何 LLM 行為評估應比較決策結構、群體差異與穩定性，而不只看答案相似度。" },
  "article:why-governed-agents-need-validators-before-state-changes": { title: "為何代理必須在狀態更新前通過驗證｜邱文昱", description: "把 LLM 輸出視為提案，在改變狀態前完成驗證、針對性修正與稽核。" },
  "article:from-individual-decisions-to-system-consequences": { title: "從個別決策到系統後果｜邱文昱", description: "以耦合模擬追蹤受限決策、環境損害、狀態更新與後續行為。" },
  hire: { title: "招聘邱文昱｜LLM 評估與 AI 研究職位摘要", description: "邱文昱的招聘摘要：以人類行為為基礎的 LLM 評估、受治理代理、行為模擬、可驗證技術能力、可任職時間、履歷與聯絡方式。" },
  about: { title: "關於邱文昱", description: "理海大學土木與環境工程博士候選人，研究人類決策證據、LLM 評估、受治理代理與耦合模擬。" },
};

const routes = {};
for (const locale of ["en", "zh-TW"]) {
  for (const page of PAGE_DEFINITIONS) {
    const path = localizedPath(page.path, locale);
    const meta = (locale === "en" ? EN_META : ZH_META)[page.id];
    routes[path] = {
      ...meta,
      path,
      basePath: page.path,
      page: page.id,
      locale,
      lang: locale === "en" ? "en" : "zh-Hant-TW",
      ogLocale: locale === "en" ? "en_US" : "zh_TW",
      canonical: siteUrl + path,
      alternate: siteUrl + localizedPath(page.path, locale === "en" ? "zh-TW" : "en"),
      xDefault: siteUrl + page.path,
      ogType: page.id.startsWith("case:") || page.id.startsWith("article:") ? "article" : "website",
      ogImage: page.id === "hire" ? "/assets/og/recruiter-brief.png" : page.id.startsWith("article:") ? `/assets/og/${page.id.slice(8)}.png` : "/assets/og-card.png",
      ogImageAlt: page.id === "hire" ? (locale === "en" ? "Wenyu Chiou — LLM Evaluation and AI Research Engineer recruiter profile" : "邱文昱 — LLM 評估與 AI 研究職位摘要") : meta.title,
      lastModified: checkedAt,
    };
  }
}

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: "Wenyu Chiou",
  alternateName: "邱文昱",
  jobTitle: "LLM Evaluation & AI Research Engineer",
  description: "Research engineer working on human-grounded LLM behavior evaluation, governed agent systems, behavioral simulation, computational social science, and AI for science.",
  image: { "@type": "ImageObject", url: `${siteUrl}/assets/portrait.jpg`, width: 768, height: 1024 },
  affiliation: { "@type": "CollegeOrUniversity", "@id": "https://www.lehigh.edu/#organization", name: "Lehigh University", url: "https://www.lehigh.edu/" },
  email: "mailto:wec324@lehigh.edu",
  url: siteUrl,
  knowsAbout: ["LLM evaluation", "Human-grounded AI evaluation", "LangChain", "Model Context Protocol", "Retrieval-Augmented Generation", "Agent Skills", "AI agent governance", "Multi-agent systems", "Behavioral simulation", "Agent-based modeling", "Hydrological modeling", "Sociohydrological modeling", "Computational social science", "AI for science", "MATLAB", "Research software engineering"],
  sameAs: [
    "https://github.com/WenyuChiou",
    "https://www.linkedin.com/in/wenyu-chiou",
    "https://www.threads.com/@wenyu_chiou",
    "https://scholar.google.com/citations?user=vSQ3zT4AAAAJ&hl=en",
    "https://orcid.org/0009-0005-8006-1288",
  ],
};

const pageSchemas = Object.fromEntries(["en", "zh-TW"].flatMap((locale) => {
  const language = locale === "en" ? "en" : "zh-Hant-TW";
  return [
    [localizedPath("/about/", locale), { "@context": "https://schema.org", "@type": "ProfilePage", "@id": `${siteUrl}${localizedPath("/about/", locale)}#profile`, url: `${siteUrl}${localizedPath("/about/", locale)}`, inLanguage: language, mainEntity: { "@id": personId } }],
    [localizedPath("/hire/", locale), { "@context": "https://schema.org", "@type": "WebPage", "@id": `${siteUrl}${localizedPath("/hire/", locale)}#page`, url: `${siteUrl}${localizedPath("/hire/", locale)}`, inLanguage: language, about: { "@id": personId }, mainEntity: { "@id": personId } }],
  ];
}));

const breadcrumbParents = { "case:human-grounded-llm-evaluation": "/work/", "case:floodabm": "/work/", "case:wagf": "/work/", "article:evaluating-llm-agents-against-measured-human-behavior": "/articles/", "article:why-governed-agents-need-validators-before-state-changes": "/articles/", "article:from-individual-decisions-to-system-consequences": "/articles/" };
const breadcrumbs = Object.fromEntries(Object.values(routes).filter((route) => route.page !== "home").map((route) => {
  const homePath = localizedPath("/", route.locale);
  const parentBase = breadcrumbParents[route.page];
  const parentPath = parentBase ? localizedPath(parentBase, route.locale) : null;
  const items = [
    { "@type": "ListItem", position: 1, name: route.locale === "en" ? "Home" : "首頁", item: siteUrl + homePath },
    ...(parentPath ? [{ "@type": "ListItem", position: 2, name: routes[parentPath].title, item: siteUrl + parentPath }] : []),
    { "@type": "ListItem", position: parentPath ? 3 : 2, name: route.title, item: route.canonical },
  ];
  return [route.path, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items }];
}));

export const SEO = {
  siteUrl,
  checkedAt,
  routes,
  ogImage: {
    file: "/assets/og-card.png",
    alt: "Wenyu Chiou — Human-Grounded LLM Evaluation, Governed Agents, and Behavioral Simulation",
  },
  citationMeta: {
    paths: ["/publications/", "/zh/publications/"],
    tags: {
      citation_title: "Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions",
      citation_author: ["Y. C. Ethan Yang", "Wenyu Chiou"],
      citation_publication_date: "2026/06",
      citation_journal_title: "Water Resources Research",
      citation_volume: "62",
      citation_issue: "6",
      citation_firstpage: "e2025WR042111",
      citation_doi: "10.1029/2025WR042111",
    },
  },
  person,
  pageSchemas,
  breadcrumbs,
  article: {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: "Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions",
    author: [{ "@type": "Person", name: "Y. C. Ethan Yang" }, { "@type": "Person", "@id": personId, name: "Wenyu Chiou" }],
    datePublished: "2026-06",
    isPartOf: { "@type": "Periodical", name: "Water Resources Research" },
    sameAs: "https://doi.org/10.1029/2025WR042111",
  },
  techArticles: Object.fromEntries(["en", "zh-TW"].flatMap((locale) => FEATURE_CONTENT[locale].articlesPage.articles.map((article) => {
    const path = localizedPath(`/articles/${article.slug}/`, locale);
    return [path, {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: article.title,
      description: article.dek,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: locale === "en" ? "en" : "zh-Hant-TW",
      author: { "@type": "Person", "@id": personId, name: "Wenyu Chiou", url: siteUrl },
      mainEntityOfPage: siteUrl + path,
      image: `${siteUrl}/assets/og/${article.slug}.png`,
    }];
  }))),
};

export const LEGACY_REDIRECTS = {
  "/engineering/": "/work/",
  "/projects/llm-evaluation/": "/work/human-grounded-llm-evaluation/",
  "/projects/floodabm/": "/work/floodabm/",
  "/projects/research-hub/": "/work/#open-source",
  "/projects/codex-delegate/": "/work/#open-source",
  "/projects/awesome-agentic-ai-zh/": "/work/#open-source",
  "/projects/cat-framework/": "/work/",
};
