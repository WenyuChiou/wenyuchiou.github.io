// seo.js — per-route metadata + citation metadata (S4 staging draft, workcell W1).
// Titles/descriptions transcribed from IA §8; citation metadata from IA §4.2.
// Deviation (recorded): the /publications/ description ends "…with accurate statuses for
// unpublished manuscripts." instead of IA §8's "…for work under review.", because the IA
// string places "under review" within 200 characters of the article identifier and would
// fail implementation-plan §1.4's grep audit (decision-6 proximity rule). Meaning preserved.
// JSON-LD Person sameAs: GitHub + ORCID only — Google Scholar is added only after the
// profile shows "Wenyu Chiou" with the WRR paper attached; LinkedIn only after CONFIRM #6.
// citation_* tags and ScholarlyArticle markup exist for published work only (IA §4.2.4).

export const SEO = {
  siteUrl: "https://wenyuchiou.github.io",

  ogImage: {
    file: "/assets/og-card.png",
    alt: "Wenyu Chiou — Quantitative Behavioral Simulation & Psychometric LLM Evaluation",
  },

  routes: {
    "/": {
      title: "Wenyu Chiou — Quantitative Behavioral Simulation & Psychometric LLM Evaluation",
      description:
        "Quantitative behavioral simulation and psychometric LLM evaluation grounded in a 937-household survey, a 52,141-household coupled model, and open-source agent tooling. Ph.D. candidate at Lehigh University, open to AI internships.",
      ogType: "website",
      canonical: "https://wenyuchiou.github.io/",
    },
    "/research/": {
      title: "Research & Academic Work — Wenyu Chiou",
      description:
        "From a 937-household survey to a 52,141-household coupled agent-based–catastrophe flood model to human-grounded LLM evaluation — one continuous research program.",
      ogType: "website",
      canonical: "https://wenyuchiou.github.io/research/",
    },
    "/engineering/": {
      title: "AI, Engineering & Systems — Wenyu Chiou",
      description:
        "Fail-closed AI systems in public repos: research-hub-pipeline v1.1.1 on PyPI, tested on Windows, macOS, and Linux, regression-tested agent infrastructure, and selected security and reliability contributions.",
      ogType: "website",
      canonical: "https://wenyuchiou.github.io/engineering/",
    },
    "/publications/": {
      title: "Publications — Wenyu Chiou",
      description:
        "Publications and talks by Wenyu Chiou, including Yang & Chiou (2026), Water Resources Research, 62(6), e2025WR042111 — with explicit statuses for research in progress.",
      ogType: "website",
      canonical: "https://wenyuchiou.github.io/publications/",
    },
    "/projects/research-hub/": {
      title: "research-hub — an AI-operable research workspace",
      description:
        "An MCP server and CLI that makes Zotero, Obsidian, and NotebookLM AI-operable — search, ingest, and sync papers through one pipeline. PyPI research-hub-pipeline v1.1.1; tested on Windows, macOS, and Linux.",
      ogType: "article",
      canonical: "https://wenyuchiou.github.io/projects/research-hub/",
    },
    "/projects/floodabm/": {
      title: "FLOODABM — coupled ABM × catastrophe flood model",
      description:
        "A 52,141-household agent-based flood-adaptation model coupled to a catastrophe model with NFIP mechanics, calibrated on a 937-household survey. Research prototype, archived with citation metadata.",
      ogType: "article",
      canonical: "https://wenyuchiou.github.io/projects/floodabm/",
    },
    "/projects/cat-framework/": {
      title: "Cat_framework — Hazus seismic bridge-loss pipeline",
      description:
        "A team-built Hazus-based seismic bridge-loss pipeline validated at three levels against the 1994 Northridge earthquake, with failures reported, not hidden.",
      ogType: "article",
      canonical: "https://wenyuchiou.github.io/projects/cat-framework/",
    },
    "/projects/codex-delegate/": {
      title: "codex-delegate — agent delegation with verified completion",
      description:
        "A cross-platform agent-delegation wrapper whose completion claims are verified from git state, with a regression test pinning a real upstream stdin hang. Tested on Windows and Linux.",
      ogType: "article",
      canonical: "https://wenyuchiou.github.io/projects/codex-delegate/",
    },
    "/projects/awesome-agentic-ai-zh/": {
      title: "awesome-agentic-ai-zh — trilingual agentic-AI curriculum",
      description:
        "A trilingual agentic-AI curriculum with automated checks that keep all three languages in sync, and external contributors. 5K+ GitHub stars, 700+ forks (August 2026).",
      ogType: "article",
      canonical: "https://wenyuchiou.github.io/projects/awesome-agentic-ai-zh/",
    },
    "/projects/llm-evaluation/": {
      title: "LLM evaluation study — Wenyu Chiou",
      description:
        "A human-grounded evaluation study asking whether LLM-generated responses reproduce decision pathways observed in 937 household survey records across social groups. In preparation; planned submission to Progress in Disaster Science.",
      ogType: "article",
      canonical: "https://wenyuchiou.github.io/projects/llm-evaluation/",
    },
  },

  // Google-Scholar-style tags — rendered into the <head> of /publications/ only (IA §4.2.1).
  citationMeta: {
    route: "/publications/",
    tags: {
      citation_title:
        "Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions",
      citation_author: ["Y. C. Ethan Yang", "Wenyu Chiou"], // two tags, published order
      citation_publication_date: "2026/06",
      citation_journal_title: "Water Resources Research",
      citation_volume: "62",
      citation_issue: "6",
      citation_firstpage: "e2025WR042111",
      citation_doi: "10.1029/2025WR042111",
    },
  },

  jsonLd: {
    // Rendered on "/" only (IA §4.2.2b).
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Wenyu Chiou",
      jobTitle: "Research Engineer — Quantitative Behavioral Simulation & Psychometric LLM Evaluation",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Lehigh University",
      },
      email: "mailto:wec324@lehigh.edu",
      url: "https://wenyuchiou.github.io",
      sameAs: [
        "https://github.com/WenyuChiou",
        "https://orcid.org/0009-0005-8006-1288",
      ],
    },

    // Rendered on "/publications/" only (IA §4.2.2a). Published work only.
    scholarlyArticle: {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline:
        "Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions",
      author: [
        { "@type": "Person", name: "Y. C. Ethan Yang" },
        { "@type": "Person", name: "Wenyu Chiou" },
      ],
      datePublished: "2026-06",
      pageStart: "e2025WR042111",
      isPartOf: {
        "@type": "PublicationIssue",
        issueNumber: "6",
        isPartOf: {
          "@type": "PublicationVolume",
          volumeNumber: "62",
          isPartOf: {
            "@type": "Periodical",
            name: "Water Resources Research",
          },
        },
      },
      sameAs: "https://doi.org/10.1029/2025WR042111",
    },
  },
};
