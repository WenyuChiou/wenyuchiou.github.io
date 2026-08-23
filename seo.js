import { PAGE_DEFINITIONS, localizedPath } from "./content.js";

const siteUrl = "https://wenyuchiou.github.io";
const checkedAt = "2026-08-23";

const EN_META = {
  home: {
    title: "Wenyu Chiou — Human-Grounded LLM Evaluation & Behavioral Simulation",
    description: "Ph.D. researcher building human-grounded LLM evaluations, governed agents, and behavioral simulations from 937 human profiles to 52,141 simulated households.",
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
    description: "Peer-reviewed publications, manuscripts, and presentations including Water Resources Research 2026, ISDSA 2026, AGU25, and ISHC 2025.",
  },
  about: {
    title: "About — Wenyu Chiou",
    description: "Wenyu Chiou is a Lehigh University Ph.D. candidate working across human decision evidence, LLM evaluation, governed agents, and coupled simulation.",
  },
};

const ZH_META = {
  home: { title: "邱文昱｜以人類證據為基礎的 LLM 評估與行為模擬", description: "理海大學博士候選人，研究以人類證據為基礎的 LLM 評估、受治理代理與行為模擬，涵蓋 937 份人類資料與 52,141 個模擬家戶。" },
  work: { title: "精選工作｜邱文昱", description: "以人類證據為基礎的 LLM 評估、家戶洪水模擬、受治理代理與開源研究系統案例。" },
  "case:human-grounded-llm-evaluation": { title: "以人類證據為基礎的 LLM 評估｜邱文昱", description: "以 937 份家戶資料為基準，從整體與社會群體路徑比較 LLM 生成決策，並檢查重複執行穩定性。" },
  "case:floodabm": { title: "FLOODABM｜邱文昱", description: "涵蓋 52,141 個家戶、27 個人口普查區、2011 至 2023 年，且每個情境執行 50 次的耦合代理與巨災模型。" },
  "case:wagf": { title: "WAGF 受治理代理系統｜邱文昱", description: "在代理決策更新耦合模擬狀態前，進行解析、限制檢查、針對性修正與稽核的開發中框架。" },
  research: { title: "研究計畫｜邱文昱", description: "串連心理計量、群體感知 LLM 評估、代理模擬、治理與人類—環境回饋的研究計畫。" },
  publications: { title: "出版與演講｜邱文昱", description: "同儕審查出版、論文與公開發表，包括 2026 Water Resources Research、ISDSA 2026、AGU25 與 ISHC 2025。" },
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
      ogType: page.id.startsWith("case:") ? "article" : "website",
      lastModified: checkedAt,
    };
  }
}

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
  person: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Wenyu Chiou",
    alternateName: "邱文昱",
    jobTitle: "Ph.D. Researcher in Human-Grounded LLM Evaluation, Governed Agents, and Behavioral Simulation",
    affiliation: { "@type": "CollegeOrUniversity", name: "Lehigh University" },
    email: "mailto:wec324@lehigh.edu",
    url: siteUrl,
    sameAs: [
      "https://github.com/WenyuChiou",
      "https://www.linkedin.com/in/wenyu-chiou",
      "https://scholar.google.com/citations?user=vSQ3zT4AAAAJ&hl=en",
      "https://orcid.org/0009-0005-8006-1288",
    ],
  },
  article: {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: "Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions",
    author: [{ "@type": "Person", name: "Y. C. Ethan Yang" }, { "@type": "Person", name: "Wenyu Chiou" }],
    datePublished: "2026-06",
    isPartOf: { "@type": "Periodical", name: "Water Resources Research" },
    sameAs: "https://doi.org/10.1029/2025WR042111",
  },
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
