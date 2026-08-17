// content.js — canonical content model (S4 staging draft, workcell W1).
// Ground truth order: docs/strategy/canonical-facts.md > positioning-strategy.md >
// audience-analysis.md > content-information-architecture.md (IA) > implementation-plan.md.
// Canonical strings are reused verbatim; they mirror scripts/canonical-strings.json,
// which is regenerated from canonical-facts.md and never edited ad hoc.
// English-only (IA §1.2). Status labels use only the canonical vocabulary:
// Published / Under review / Preprint / In preparation / Research prototype /
// Maintained open-source tool / Archived.

export const CONTENT = {
  meta: {
    name: "Wenyu Chiou",
    titleLine: "Ph.D. Candidate, Civil & Environmental Engineering, Lehigh University",
    email: "wec324@lehigh.edu",
    siteUrl: "https://wenyuchiou.github.io",
    github: "https://github.com/WenyuChiou",
    orcid: "https://orcid.org/0009-0005-8006-1288",
  },

  hero: {
    umbrella: "Quantitative behavioral simulation, psychometric evaluation of LLM behavior, and trustworthy agent systems",
    dialect: {
      industry: "Research engineer building human-grounded behavioral simulations and evaluating LLM agents with psychometric methods.",
      academic: "I model human decisions as a computational social scientist and test whether LLM agents reproduce them.",
    },
    portrait: {
      src: "/assets/portrait.jpg",
      alt: "Wenyu Chiou at the AGU Fall Meeting 2025, beside his research poster.",
    },
    workingFormulation:
      "I build quantitative simulations of human decision-making and evaluate LLM agents against behavioral and psychometric patterns measured in people. My work moves from a 937-household survey to 52,141 simulated households, then asks whether generated behavior is useful, calibrated, and safe to use.",
    facts: [
      { value: "937", label: "household responses" },
      { value: "52,141", label: "simulated households" },
      { value: "5K+", label: "GitHub stars" },
    ],
    availability:
      "Open to Summer 2027 internships in AI research, LLM evaluation, agent development, and computational social science.",
  },

  // Homepage research sequence — the site's primary interactive research surface.
  // Every metric is drawn from the canonical research and project records below.
  evidenceMap: {
    defaultFocus: "llm-evaluation",
    nodes: [
      {
        id: "survey",
        stage: "01",
        title: "Human decision data",
        metric: "937",
        metricLabel: "household responses",
        status: "Research prototype",
        summary:
          "Designed and fielded a 937-household flood-adaptation survey in New Jersey’s Passaic River Basin, separating owners and renters and preserving social-group comparisons.",
        evidence:
          "Calibration files in FLOODABM; empirical grounding for the Water Resources Research lineage and the current LLM evaluation study.",
        links: [
          { label: "Research program", href: "/research/" },
          { label: "FLOODABM", href: "/projects/floodabm/" },
        ],
        relatedProjects: ["floodabm", "llm-evaluation"],
        industryRelevance: "Measured human behavior before synthetic behavior enters a consequential system.",
        academicRelevance: "Primary data anchoring the instrument → inference → simulation chain.",
      },
      {
        id: "simulation",
        stage: "02",
        title: "Quantitative simulation",
        metric: "52,141",
        metricLabel: "simulated households",
        status: "Research prototype",
        summary:
          "Bayesian-calibrated behavioral simulation across 27 census tracts, coupled to a catastrophe flood model with NFIP mechanics and income-normalized equity analysis.",
        evidence:
          "FLOODABM, OpenFEMA/NFIP validation lineage, and the Water Resources Research paper.",
        links: [
          { label: "FLOODABM case study", href: "/projects/floodabm/" },
          { label: "WRR lineage", href: "https://doi.org/10.1029/2025WR042111" },
        ],
        relatedProjects: ["floodabm"],
        industryRelevance: "Behavioral assumptions become quantitative model inputs and validated loss outcomes.",
        academicRelevance: "Couples survey-grounded behavior with physical and financial consequences.",
      },
      {
        id: "llm-evaluation",
        stage: "03",
        title: "Psychometric evaluation of LLM behavior",
        metric: "937",
        metricLabel: "survey records",
        status: "In preparation",
        summary:
          "Tests whether label-blind socioeconomic personas reproduce measured decision pathways across social groups.",
        evidence:
          "A human-versus-LLM design grounded in the 937 survey records; the full study remains in preparation.",
        links: [
          { label: "LLM evaluation case study", href: "/projects/llm-evaluation/" },
          { label: "Research program", href: "/research/" },
        ],
        relatedProjects: ["llm-evaluation"],
        industryRelevance: "Tests whether LLM outputs reproduce behavioral and psychometric patterns instead of merely sounding plausible.",
        academicRelevance: "Human-grounded psychometric study of whether generative agents reproduce measured decision pathways.",
      },
      {
        id: "governance",
        stage: "04",
        title: "Constrained agent systems",
        metric: "WAGF",
        metricLabel: "framework in preparation",
        status: "In preparation",
        summary:
          "Constrains agent-driven decisions with physical, financial, and behavioral-theory checks, fail-closed handling, and audit trails.",
        evidence:
          "Governance methods in preparation; open-source echoes in research-hub and codex-delegate.",
        links: [
          { label: "Engineering record", href: "/engineering/" },
          { label: "research-hub", href: "/projects/research-hub/" },
        ],
        relatedProjects: ["research-hub", "codex-delegate"],
        industryRelevance: "Turns behavioral testing into runtime constraints and trustworthy agent infrastructure.",
        academicRelevance: "A general validation architecture beyond the flood domain.",
      },
    ],
  },

  // IA §2 Block 3 — fixed order in both modes: science → tool → community verification.
  pillars: [
    {
      id: "research-hub",
      kicker: "Shipped AI infrastructure",
      copy: "research-hub — an MCP server and CLI (PyPI: research-hub-pipeline v1.1.1) that makes Zotero, Obsidian, and NotebookLM AI-operable. Listed in Awesome MCP Servers; tested on Windows, macOS, and Linux.",
      href: "https://pypi.org/project/research-hub-pipeline/",
      caseStudy: "/projects/research-hub/",
      label: "Maintained open-source tool",
    },
    {
      id: "agent-stack",
      kicker: "Evaluation & governance",
      copy: "WAGF — a governance framework that checks LLM-agent decisions against physical, financial, and behavioral-theory constraints — alongside open-source agent skills and delegation tooling.",
      href: "/engineering/",
      label: "Research software in preparation",
    },
    {
      id: "awesome",
      kicker: "Community & education",
      copy: "awesome-agentic-ai-zh — a trilingual roadmap for building agentic AI, from LLM basics to production multi-agent systems, with automated checks that keep all three languages in sync.",
      href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh",
      label: "5K+ GitHub stars, 700+ forks (August 2026)",
    },
  ],

  // IA §2 Block 4 — one-line problem statement, status label, case-study link.
  // No star counts except the one allowed awesome-agentic-ai-zh string.
  selectedEngineering: [
    {
      slug: "research-hub",
      name: "research-hub",
      line: "Literature workflows are repetitive and easy to get subtly wrong across tools. research-hub turns Zotero, Obsidian, and NotebookLM into one AI-operable workspace — searching, ingesting, and syncing papers through a single CLI, MCP server, and REST API.",
      status: "Maintained open-source tool",
      category: "engineering",
      featured: true,
      metrics: ["PyPI v1.1.1", "MCP + CLI + REST API"],
      relatedEvidence: ["governance"],
      industryRelevance: "Published AI-operable infrastructure with explicit evaluation and cross-platform CI.",
      academicRelevance: "Reproducibility infrastructure for an everyday literature workflow.",
      href: "/projects/research-hub/",
    },
    {
      slug: "codex-delegate",
      name: "codex-delegate",
      line: "Delegating code work to a second AI agent is only economical if the delegate cannot fabricate success. codex-delegate verifies the delegate’s completion from git state rather than from its own report.",
      status: "Maintained open-source tool",
      category: "engineering",
      featured: true,
      metrics: ["Ubuntu + Windows CI", "stdin-hang regression test"],
      relatedEvidence: ["governance"],
      industryRelevance: "Evidence-based orchestration for agent workflows where completion claims need independent verification.",
      academicRelevance: "A reproducible control layer for multi-agent research workflows.",
      href: "/projects/codex-delegate/",
    },
    {
      slug: "awesome-agentic-ai-zh",
      name: "awesome-agentic-ai-zh",
      line: "Chinese-speaking learners lacked a staged path into agentic AI, and hand-mirrored translations drift. This trilingual curriculum keeps its locales verifiably in sync with CI.",
      status: "Maintained open-source tool",
      stars: "5K+ GitHub stars, 700+ forks (August 2026)",
      category: "community",
      featured: false,
      metrics: ["5K+ GitHub stars", "700+ forks"],
      relatedEvidence: ["governance"],
      industryRelevance: "Public teaching infrastructure that makes the agent ecosystem easier to enter and inspect.",
      academicRelevance: "Community-facing translation of agent-system concepts into a maintained learning path.",
      href: "/projects/awesome-agentic-ai-zh/",
    },
  ],

  // IA §2 Block 5.
  selectedResearch: [
    {
      slug: "llm-evaluation",
      name: "LLM evaluation study",
      line: "Fluent LLM responses are not the same as human behavior. This psychometric study compares measured survey pathways with responses generated from label-blind socioeconomic personas across social groups.",
      status: "In preparation",
      category: "research",
      featured: true,
      metrics: ["937 survey records", "Human-grounded comparison"],
      relatedEvidence: ["survey", "llm-evaluation"],
      industryRelevance: "Human-grounded behavioral and psychometric testing for agent applications where fluent outputs are not enough.",
      academicRelevance: "Study of whether generative agents reproduce measured decision pathways from primary survey data.",
      href: "/projects/llm-evaluation/",
    },
    {
      slug: "floodabm",
      name: "FLOODABM",
      line: "Flood-adaptation models usually assert household behavior instead of measuring it. FLOODABM grounds 52,141 simulated households in a 937-household survey and validates losses against observed insurance claims.",
      status: "Research prototype",
      category: "research",
      featured: true,
      metrics: ["52,141 households", "937-household survey"],
      relatedEvidence: ["survey", "simulation"],
      industryRelevance: "A testable behavioral simulation that exposes assumptions before they reach downstream decisions.",
      academicRelevance: "Couples primary behavioral data with physical and financial outcomes.",
      href: "/projects/floodabm/",
    },
    {
      slug: "cat-framework",
      name: "Cat_framework",
      line: "A loss number without an inspectable validation chain cannot be trusted. This Hazus-based seismic bridge-loss pipeline reports where the recipe fails, not only where it works.",
      status: "Research prototype",
      category: "research",
      featured: false,
      metrics: ["Hazus 6.1", "three-level validation"],
      relatedEvidence: ["simulation"],
      industryRelevance: "Validation-first modeling with visible failure modes and reproducible inputs.",
      academicRelevance: "A transparent computational pipeline for inspecting model validity.",
      href: "/projects/cat-framework/",
    },
  ],

  // IA §2 Block 6 — mode-invariant single string.
  currentFocus:
    "Current focus: quantitative behavioral simulation and psychometric evaluation for LLM agents — testing whether they reproduce real human decision pathways (grounded in a 937-household survey I designed and fielded) and constraining agent-driven simulations so they stay trustworthy. Research software in preparation for release.",

  // IA §2 Block 7 — mode decides primary/secondary in app.jsx.
  documents: {
    academic: { file: "/assets/Wenyu_Chiou_Academic_CV.pdf", label: "Academic CV (PDF)" },
    industry: { file: "/assets/Wenyu_Chiou_AI_Research_Resume.pdf", label: "Industry resume (PDF)" },
  },

  // IA §2 Block 8 — the single CTA.
  contact: {
    availability:
      "Open to Summer 2027 internships in AI research, LLM evaluation, agent development, and computational social science.",
    email: "wec324@lehigh.edu",
    ctaLabel: "Email wec324@lehigh.edu",
  },

  // /research/ — the five-stage arc (positioning §2.2) + the academic research summary (§4.10, verbatim).
  research: {
    programLink: { label: "The full research program", href: "/research/" },
    arc: [
      {
        n: 1,
        name: "Survey",
        what: "Designed and fielded a 937-household flood-adaptation survey (557 owners / 379 renters) in New Jersey’s Passaic River Basin.",
        evidence:
          "Calibration files in the FLOODABM repository; the empirical grounding of the Water Resources Research paper.",
        statusNote: "Instrument feeding one published article and manuscripts now under review.",
      },
      {
        n: 2,
        name: "Decision pathways (SEM)",
        what: "Identified flood-adaptation decision pathways through structural equation modeling — across owner and renter groups, and across marginalized and non-marginalized groups (the equity strand).",
          evidence:
            "Flood Adaptation Decision Variables and Pathways across Social Groups: A Comparison between Human Survey Responses and Responses Generated by Large Language Models. Planned submission to Progress in Disaster Science.",
          statusNote: "In preparation; the redesigned elicitation and study protocol are being validated.",
      },
      {
        n: 3,
        name: "Coupled ABM–CAT model",
        what: "Built a Bayesian-calibrated agent-based model of 52,141 households across 27 census tracts, coupled to a catastrophe flood model with National Flood Insurance Program premium, payout, and deductible mechanics and income-normalized equity analysis of who bears flood losses.",
          evidence:
            "Household Flood Adaptation and Financial Outcomes: A Coupled Human–Flood Modeling Analysis of Homeowners and Renters. Water Resources Research.",
          statusNote: "Code: Research prototype, archived. Paper: Under revision following peer review.",
      },
      {
        n: 4,
        name: "LLMs as the behavioral engine",
        what: "Applied large language models as the behavioral engine of an agent-based model of a human–water system — the core contribution. Because nothing guarantees a generative agent decides the way real households do, the work also checks LLM personas against empirically identified human decision pathways.",
        evidence:
          "Yang, Y. C. E., & Chiou, W. (2026). Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions. Water Resources Research, 62(6), e2025WR042111.",
        statusNote: "Published.",
      },
      {
        n: 5,
        name: "Governance methods",
        what: "Validation architecture for generative agents — hard physical and financial constraints plus behavioral-theory coherence, fail-closed, with audit trails — generalized beyond the flood domain.",
        evidence:
          "Research software in preparation for release; public echoes in the fail-closed design of the open-source tooling.",
        statusNote: "In preparation.",
      },
    ],
    photo: {
      src: "/assets/agu2025-photo.jpg",
      alt: "Wenyu Chiou standing beside his AGU Fall Meeting 2025 poster, NH41E-0449.",
      caption:
        "Presenting poster NH41E-0449 — Modeling Long-Term Household Flood Adaptation under Social Heterogeneity — at the AGU Fall Meeting 2025.",
    },
    // Academic research summary — positioning-strategy §4.10, 202 words, verbatim.
    // Recorded ruling (S4 second review): the summary describes the overall SEM work in
    // owner/renter terms (true of the survey + WRR strand); the SCS manuscript descriptor
    // below uses canonical-facts §4.2 marginalized/non-marginalized framing verbatim.
    summary:
      "My research asks a question generative AI has made urgent: when can a simulated human decision-maker be trusted? I approach it by connecting each stage of the research process. I designed and fielded a 937-household flood-adaptation survey in New Jersey’s Passaic River Basin, used structural equation modeling to identify how owners and renters actually decide among adaptation actions, and encoded those empirically identified pathways in a Bayesian-calibrated agent-based model of 52,141 households coupled to a catastrophe flood model with National Flood Insurance Program mechanics — including income-normalized equity analysis of who bears flood losses. With my advisor, I published a Water Resources Research article (62(6), e2025WR042111, 2026) substituting large language models as the behavioral engine of such simulations. That substitution creates a validity problem: nothing guarantees a generative agent decides the way real households do. My current work addresses it directly through an LLM evaluation study that compares human survey pathways with label-blind synthetic personas across social groups, alongside governance methods that constrain agent behavior with physical constraints and behavioral theory. The household flood-adaptation and financial-outcomes study is under revision following peer review at Water Resources Research; the social-group LLM study is in preparation for planned submission to Progress in Disaster Science. The longer-term agenda is a governance standard for generative agents in consequential simulation.",
  },

  // /engineering/ — positioning §3.
  engineering: {
    // §3.2 — problems solved, employer language.
    problems: [
      {
        id: "unverified-record",
        problem: "LLM outputs were entering a permanent record unverified.",
        response:
          "I built an AI-operable research workspace — an MCP server and CLI that lets an AI agent search, ingest, and sync papers across Zotero, Obsidian, and NotebookLM — with references that cannot be verified quarantined under an explicit failure taxonomy rather than silently accepted. Shipped and maintained publicly as research-hub-pipeline on PyPI.",
      },
      {
        id: "no-validity-standard",
        problem: "Generative agents entered consequential simulation with no governance standard.",
        response:
          "I co-authored the Water Resources Research (2026) study substituting LLM agents into a human-water simulation, and now build the evaluation methods that test whether such agents reproduce empirically measured human decisions — with ground truth I collected myself (a 937-household survey).",
      },
      {
        id: "unvalidated-loss",
        problem: "Catastrophe loss estimates are only as good as their validation.",
        response:
          "I built a flood-loss pipeline that publishes its validation honestly — a 52,141-household coupled agent-based and catastrophe model with NFIP financial mechanics, validated against observed insurance claims — and worked on a team-built Hazus-based seismic bridge-loss pipeline validated at three levels against the 1994 Northridge earthquake, with failures reported, not hidden.",
      },
    ],

    // §3.3 — the public flagship set.
    systems: [
      {
        name: "research-hub",
        what: "AI-operable research workspace: a CLI, MCP server, REST API, and dashboard that drive repeatable literature workflows across Zotero, Obsidian, and NotebookLM.",
        evidence:
          "PyPI research-hub-pipeline v1.1.1; listed in the Awesome MCP Servers catalog; tested on Windows, macOS, and Linux; an automated test suite that checks retrieval quality.",
        status: "Maintained open-source tool",
        href: "/projects/research-hub/",
        repo: "https://github.com/WenyuChiou/research-hub",
      },
      {
        name: "FLOODABM",
        what: "52,141-household coupled ABM × catastrophe flood model, Passaic River Basin, NFIP mechanics, calibrated on a 937-household survey I designed and fielded.",
        evidence:
          "Public repo; Zenodo archive with CITATION.cff and published seed lists; known-limitations register.",
        status: "Research prototype",
        statusDetail: "Archived companion code",
        href: "/projects/floodabm/",
        repo: "https://github.com/WenyuChiou/FLOODABM",
      },
      {
        name: "Cat_framework",
        what: "Team-built Hazus 6.1 seismic bridge-loss pipeline (hazard → exposure → fragility → EP/AAL).",
        evidence: "Public repo; three-level Northridge validation with honestly reported failures.",
        status: "Research prototype",
        statusDetail: "Team capstone",
        href: "/projects/cat-framework/",
        repo: "https://github.com/WenyuChiou/Cat_framework",
      },
      {
        name: "codex-delegate",
        what: "Cross-platform agent-delegation wrapper whose completion claims are verified from git state.",
        evidence: "Public repo; Ubuntu/Windows CI; regression test pinning a real upstream stdin hang.",
        status: "Maintained open-source tool",
        href: "/projects/codex-delegate/",
        repo: "https://github.com/WenyuChiou/codex-delegate",
      },
      {
        name: "awesome-agentic-ai-zh",
        what: "Trilingual agentic-AI curriculum (community/education line).",
        evidence:
          "5K+ GitHub stars, 700+ forks (August 2026); external contributors; automated checks keep all three languages in sync.",
        status: "Maintained open-source tool",
        href: "/projects/awesome-agentic-ai-zh/",
        repo: "https://github.com/WenyuChiou/awesome-agentic-ai-zh",
      },
    ],
    systemsNote: "WAGF — a governance framework for LLM agents in human–water simulation, keeping coupled behavioral outcomes stable and physically sensible; research software in preparation for release.",

    // §3.4 — every item inspectable in a public repo.
    evalRecord: [
      {
        project: "LLM evaluation study",
        item: "Two-arm human-versus-LLM design grounded in 937 survey records; the study compares generated responses with measured decision pathways while the full analysis remains in preparation.",
      },
      {
        project: "research-hub",
        item: "In-repo retrieval-recall evaluation suite against golden fixtures; observed failures recorded as explicit audit baselines.",
      },
      {
        project: "research-hub",
        item: "A fail-closed anti-fabrication module with a transient-vs-permanent failure taxonomy.",
      },
      {
        project: "codex-delegate",
        item: "A regression test that reproduces a real upstream failure mode and fails without the fix.",
      },
      {
        project: "Cat_framework",
        item: "Multi-level hazard-model validation with honestly reported misses.",
      },
      {
        project: "FLOODABM",
        item: "Simulation validation against observed insurance-claims data.",
      },
    ],
    evalThroughLine: "Systems designed so that failure is visible — no silent passes.",

    // §3.6 — the 18 merged third-party PRs, real URLs.
    oss: {
      intro: "18 merged pull requests in third-party open-source projects.",
      items: [
        {
          repo: "BuilderIO/agent-native",
          number: 1332,
          url: "https://github.com/BuilderIO/agent-native/pull/1332",
          desc: "Documentation fix in the development guide.",
        },
        {
          repo: "BuilderIO/agent-native",
          number: 1333,
          url: "https://github.com/BuilderIO/agent-native/pull/1333",
          desc: "Documentation-reference fixes across contributor docs.",
        },
        {
          repo: "BuilderIO/agent-native",
          number: 1334,
          url: "https://github.com/BuilderIO/agent-native/pull/1334",
          desc: "Documentation fix removing broken links from a skill guide.",
        },
        {
          repo: "BuilderIO/agent-native",
          number: 1362,
          url: "https://github.com/BuilderIO/agent-native/pull/1362",
          desc: "Root-caused engine-selection bug fix with a regression test that fails on main.",
        },
        {
          repo: "Nanako0129/coralline",
          number: 10,
          url: "https://github.com/Nanako0129/coralline/pull/10",
          desc: "Pure-bash UTF-8 / East-Asian-width display fix.",
        },
        {
          repo: "langchain-ai/openwiki",
          number: 367,
          url: "https://github.com/langchain-ai/openwiki/pull/367",
          desc: "Security fix restricting ~/.openwiki permissions on Windows, where chmod is a no-op.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1773,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1773",
          desc: "Taiwan market detection and routing.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1801,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1801",
          desc: "Made Taiwan a first-class market across the service layer, API schema, and typed frontend.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1829,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1829",
          desc: "Taiwan institutional-flow (foreign, trust, and dealer) fetcher over official TWSE/TPEx open data, fail-open.",
        },
        {
          repo: "NVIDIA/skills",
          number: 76,
          url: "https://github.com/NVIDIA/skills/pull/76",
          desc: "Documentation fix repairing the Skill Catalog link in the contributing guide.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1841,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1841",
          desc: "Coalesced concurrent institutional-flow fetches so a cold cache cannot trigger a stampede of duplicate requests.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1855,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1855",
          desc: "Network-marked drift tests for the institutional-flows fetcher, so an upstream format change fails loudly instead of silently.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1863,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1863",
          desc: "Surfaced Taiwan institutional flows in the report's institution block.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1864,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1864",
          desc: "Hardened the institutional fetcher with a circuit breaker and an exchange-date guard.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1866,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1866",
          desc: "Surfaced Taiwan institutional flows in the report and the LLM prompt, and corrected TWD currency handling.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1867,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1867",
          desc: "Fixed a dividend parse that made the trailing-twelve-month yield silently wrong.",
        },
        {
          repo: "ZhuLinsen/daily_stock_analysis",
          number: 1869,
          url: "https://github.com/ZhuLinsen/daily_stock_analysis/pull/1869",
          desc: "Detect the Taiwan closing-auction window (13:25-13:30) as a distinct market phase.",
        },
        {
          repo: "punkpeye/awesome-mcp-servers",
          number: 6921,
          url: "https://github.com/punkpeye/awesome-mcp-servers/pull/6921",
          desc: "Added research-hub to the Research category of the Awesome MCP Servers catalog.",
        },
      ],
    },

    // §3.6 — artifact-backed capabilities only.
    capabilities: [
      "Python",
      "Testing and CI",
      "Evaluation design",
      "LLM application and agent development",
      "Computational social-science methods",
      "Behavioral simulation",
      "MCP and agent tooling",
      "Git",
      "Cross-platform (Windows/POSIX) engineering",
      "Catastrophe-risk stack: FEMA Hazus, fragility functions, exceedance-probability curves, NFIP mechanics",
    ],
  },

  // /publications/ — IA §4.1. Statuses canonical; author order never obscured.
  publications: {
    peerReviewed: [
      {
        citation:
          "Yang, Y. C. E., & Chiou, W. (2026). Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions. Water Resources Research, 62(6), e2025WR042111.",
        doi: "10.1029/2025WR042111",
        doiUrl: "https://doi.org/10.1029/2025WR042111",
        venue: "Water Resources Research",
        year: "2026",
        authors: "Yang, Y. C. E., & Chiou, W.",
        status: "Published",
        authorNote: "Second author of two.",
      },
      // Reserved slot: the Journal of Taiwan Agricultural Engineering forest paper does not
      // ship until CONFIRM #10 resolves its title/year/author-position conflict.
    ],

    softwareNote: "WAGF — a governance framework for LLM agents in human–water simulation, keeping coupled behavioral outcomes stable and physically sensible; research software in preparation for release.",

    // Statuses are intentionally explicit: one study is under revision after peer review;
    // the LLM evaluation study is still being prepared for submission.
    underReview: [
      {
        descriptor:
          "Household Flood Adaptation and Financial Outcomes: A Coupled Human–Flood Modeling Analysis of Homeowners and Renters.",
        target: "Water Resources Research",
        status: "Under revision following peer review",
      },
      {
        descriptor:
          "Flood Adaptation Decision Variables and Pathways across Social Groups: A Comparison between Human Survey Responses and Responses Generated by Large Language Models.",
        target: "Progress in Disaster Science",
        status: "Planned submission",
      },
    ],

    // Verified facts only: venue + presentation ID. Exact titles are gated (CONFIRM #2/#12
    // and canonical-facts §4.3) and never invented.
    presentations: [
      {
        venue: "ISDSA 2026 Annual Meeting",
        detail:
          "What Makes AI Believable? Comparing AI and Human Responses in Mental Health Risk Assessment — recorded presentation.",
        note: "With Hawjeng Chiou, National Taiwan Normal University.",
      },
      {
        venue: "ISHC 2025, Tokyo, Japan",
        detail: "Oral presentation 38-03, July 2025.",
        note: "Co-authors across Lehigh, FAU, Kyoto, and the University of Tokyo.",
        href: "https://pub.confit.atlas.jp/en/event/ishc2025/presentation/38-03",
      },
      {
        venue: "AGU Fall Meeting 2025",
        detail:
          "Poster NH41E-0449 — Modeling Long-Term Household Flood Adaptation under Social Heterogeneity: A Coupled Agent-Based Modeling Framework.",
        note: "With co-authors at Lehigh and Kyoto University's Disaster Prevention Research Institute.",
      },
      {
        venue: "AGU Fall Meeting 2023",
        detail:
          "Abstract — submarine groundwater discharge study combining electrical resistivity tomography, field observation, and numerical simulation.",
      },
      // ISDSA 2026 above is fully identified (title + co-author supplied by the owner) and is
      // therefore NOT the reserved slot. The still-unidentified presentation behind CONFIRM #4
      // remains unrendered and ships only once identified. Do not add a placeholder entry.
    ],
  },

  // Case studies — IA §3.2–3.6. Each covers all 11 IA §3.1 content fields; on-page rendering
  // folds them into the 4-section VDS layout (implementation-plan §0.6 deviation 3).
  caseStudies: {
    "research-hub": {
      title: "research-hub — an AI-operable research workspace",
      status: "Maintained open-source tool",
      problem:
        "A literature workflow is spread across Zotero (references), Obsidian (notes), and NotebookLM (briefs), and moving papers between them by hand is repetitive, error-prone, and impossible for an AI assistant to drive reliably.",
      whyItMatters:
        "Researchers lose hours to manual copying between tools, and an AI assistant can only help if the whole workflow is exposed through a stable, scriptable interface rather than a pile of one-off clicks.",
      myRole:
        "Sole designer and maintainer, end to end — architecture, the CLI, the MCP server, the REST API and dashboard, CI design, the evaluation suite, and the release process.",
      approach:
        "One AI-operable workspace over all three tools: search papers across arXiv, Semantic Scholar, PubMed, and CrossRef; ingest them into Zotero; sync notes to Obsidian; and verify NotebookLM briefs against their sources — each step available from a CLI, an MCP server, and a REST API so an agent can run the whole pipeline.",
      system:
        "A Python package published to PyPI as research-hub-pipeline v1.1.1 (MIT), exposing a CLI, an MCP server (listed in the Awesome MCP Servers catalog), a REST API, and a dashboard. All three external tools are optional — start with any two.",
      keyChallenge:
        "Making three independent tools behave as one reliable, repeatable pipeline across operating systems — and keeping retrieval quality honest, which is why the repo ships an automated test suite for retrieval quality and records observed failures rather than hiding them.",
      figure: {
        src: "/assets/research-hub-dashboard.png",
        alt: "The research-hub dashboard over a live vault: 786 papers across 11 clusters, with tabs for library, briefings, writing, diagnostics, and management, and a treemap sizing each research cluster by paper count.",
        caption: "The dashboard over a live vault — 786 papers across 11 clusters, sized by paper count.",
      },
      evaluation:
        "Tested on Windows, macOS, and Linux; an automated test suite checks retrieval quality. The README states honestly that the tool is in daily use by one researcher tracking 7+ research clusters — the limitation is disclosed, not hidden.",
      results: "Maintained open-source tool; v1.1.1 live on PyPI with a documented release history.",
      evidenceLinks: [
        { label: "PyPI: research-hub-pipeline", href: "https://pypi.org/project/research-hub-pipeline/" },
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/research-hub" },
        { label: "Cross-platform CI workflow", href: "https://github.com/WenyuChiou/research-hub/blob/master/.github/workflows/ci.yml" },
        { label: "Retrieval quality tests", href: "https://github.com/WenyuChiou/research-hub/tree/master/tests/evals" },
        { label: "Changelog", href: "https://github.com/WenyuChiou/research-hub/blob/master/CHANGELOG.md" },
      ],
      relevance: {
        academic:
          "Reproducibility infrastructure — a scriptable, testable spine under an everyday literature workflow.",
        industry:
          "A published MCP server with a CLI, REST API, and CI matrix — directly legible for AI-tooling, agent-infrastructure, and research-engineering roles, with third-party recognition (Awesome MCP Servers).",
      },
    },

    "llm-evaluation": {
      title: "LLM evaluation study — human pathways vs. generated responses",
      status: "In preparation",
      problem:
        "An LLM can produce a fluent answer without reproducing how real households make decisions. The difficult question is not whether a response sounds human; it is whether a synthetic decision-maker preserves empirically observed pathways and meaningful differences between social groups.",
      whyItMatters:
        "If LLM agents replace human behavior inside consequential simulations, apparent plausibility is not enough. Evaluation needs a human ground truth, a frozen comparison design, and visible limits before synthetic behavior is used as a behavioral claim.",
      myRole:
        "Designed the evaluation scope, redesigned the elicitation protocol, implemented the analysis pipeline, and maintained the regression tests that protect the study from circular persona labels and coding drift.",
      approach:
        "A two-arm design: first establish the corrected human decision pathways with multi-group structural equation modeling, then ask LLMs to respond as label-blind socioeconomic personas drawn from the same survey population. The primary comparison asks whether the generated responses reproduce pathway structure and social-group differences.",
      system:
        "The study is grounded in 937 household records and a redesigned elicitation. Full subgroup and model-pilot details remain private while the study is in preparation.",
      keyChallenge:
        "Keeping the comparison label-blind and non-circular while separating genuine behavioral signal from prompt, coding, and model artifacts. The study records redesign decisions and retracted artifacts instead of carrying an attractive but unsupported finding into the paper.",
      evaluation:
        "Current milestones are the implemented redesign and corrected human ground truth. No final agreement score or subgroup claim is reported here until the full run and scope validation are complete.",
      results:
        "In preparation — planned submission to Progress in Disaster Science.",
      evidenceLinks: [
        { label: "Research program", href: "/research/" },
        { label: "Published WRR lineage", href: "https://doi.org/10.1029/2025WR042111" },
      ],
      relevance: {
        academic:
          "A validity study for generative agents grounded in primary survey data and explicit social-group comparisons.",
        industry:
          "Human-grounded LLM evaluation, regression-protected experiment design, and honest reporting of pending scope — directly legible to evaluation, agent, safety, and research-engineering teams.",
      },
    },

    floodabm: {
      title: "FLOODABM — coupled ABM × catastrophe flood model",
      status: "Research prototype",
      statusDetail: "Archived companion code",
      problem:
        "Flood-adaptation models typically treat households as rule-following automatons with behavior asserted rather than measured. Adaptation and insurance outcomes depend on how real owners and renters actually decide.",
      whyItMatters:
        "Policy conclusions and equity analyses drawn from uncalibrated behavior are conclusions about the modeler's assumptions. Grounding agent behavior in primary data is what makes the simulation's claims testable.",
      myRole:
        "Sole code owner; the companion manuscript's co-authors are paper collaborators, not committers. I also designed and fielded the survey that calibrates the model.",
      approach:
        "A 937-household flood-adaptation survey (Passaic River Basin, NJ) feeds a Bayesian calibration pipeline; the calibrated agent-based model couples to a catastrophe flood model so that individual adaptation decisions and basin-scale losses interact in both directions.",
      system:
        "A 52,141-household agent-based model across 27 census tracts with National Flood Insurance Program premium, payout, and deductible mechanics, tenure-differentiated adaptation actions, damage-to-threat-perception feedback, and income-normalized equity analysis of who bears flood losses.",
      keyChallenge:
        "Carrying measured psychology into simulation honestly — turning survey constructs into calibrated agent parameters without overfitting, and validating simulated losses against observed insurance-claims data rather than declaring plausibility.",
      evaluation:
        "Simulation outcomes validated against observed NFIP claims data (OpenFEMA), and a candid known-limitations register that names the model's silent-failure modes — published judgment, not marketing.",
      results:
        "Research prototype — archived companion code to a first-author manuscript under review. Zenodo-archived with citation metadata (CITATION.cff) and published seed lists.",
      // The exact Zenodo DOI string and archive link are gated on CONFIRM #11 and are not
      // rendered until resolved.
      evidenceLinks: [
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/FLOODABM" },
        { label: "Known-limitations register", href: "https://github.com/WenyuChiou/FLOODABM/blob/main/docs/KNOWN_LIMITATIONS.md" },
        { label: "NFIP validation script (simulation vs OpenFEMA claims)", href: "https://github.com/WenyuChiou/FLOODABM/blob/main/scripts/validation/validate_nfip.py" },
        { label: "Empirical-grounding lineage: Yang & Chiou (2026), Water Resources Research", href: "https://doi.org/10.1029/2025WR042111" },
      ],
      relevance: {
        academic:
          "The empirical anchor of the dissertation arc — instrument to inference to simulation in one chain.",
        industry:
          "Catastrophe-risk vocabulary in working code — AEP curves, NFIP mechanics, loss validation — legible to risk-analytics employers.",
      },
    },

    "cat-framework": {
      title: "Cat_framework — Hazus seismic bridge-loss pipeline",
      status: "Research prototype",
      statusDetail: "Team capstone",
      problem:
        "Catastrophe loss models are usually opaque; a loss number without an inspectable validation chain cannot be trusted or taught from. The goal was an open seismic bridge-loss pipeline following FEMA Hazus 6.1 end to end.",
      whyItMatters:
        "Loss estimates drive insurance and infrastructure decisions, and they are only as good as their validation. An honest pipeline shows where the recipe fails, not only where it works.",
      myRole:
        "Team-built capstone with two collaborators; presented as team work, with no individual claim made beyond team membership.",
      approach:
        "Hazard (ShakeMap/GMPE) → exposure (national bridge inventory) → fragility (Hazus 6.1) → loss, exceedance-probability, and average-annual-loss layers, with recalibration against observed data.",
      system:
        "A typed, layered Python pipeline implementing Hazus fragility mechanics, ground-motion modeling cross-checked against an independent implementation, and an EP/AAL finance layer.",
      keyChallenge:
        "Validating a national-recipe model against a real event. The pipeline is validated at three levels against the 1994 Northridge earthquake, and the failures are reported as findings — the baseline recipe's over-prediction is stated, not smoothed over.",
      figure: {
        src: "/assets/cat-framework-pipeline.png",
        alt: "Five-stage pipeline diagram: hazard (ground motion), exposure (bridge assets), vulnerability (fragility curves), loss (financial impact), and visualization (maps and reports), with the Python modules behind each stage.",
        caption: "The backbone pipeline: hazard → exposure → fragility → loss → visualization.",
      },
      evaluation:
        "The three-level Northridge validation with honestly reported failures is the centerpiece; recalibration is statistical, with uncertainty reported.",
      results: "Research prototype — team capstone; no releases.",
      evidenceLinks: [
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/Cat_framework" },
        { label: "Validation & calibration (README)", href: "https://github.com/WenyuChiou/Cat_framework#validation--calibration" },
      ],
      relevance: {
        academic:
          "Catastrophe-modeling literacy grounding the Lehigh Center for Catastrophe Modeling and Resilience affiliation.",
        industry:
          "The catastrophe-risk industry's native language — Hazus, fragility functions, exceedance-probability curves — plus model-validation practice with failures disclosed.",
      },
    },

    "codex-delegate": {
      title: "codex-delegate — agent delegation with verified completion",
      status: "Maintained open-source tool",
      problem:
        "Delegating mechanical coding work to a second AI agent is only economical if the delegate cannot fabricate success. Off-the-shelf delegation had no contract for detecting a fabricated \"done.\"",
      whyItMatters:
        "A multi-agent pipeline that trusts unverified completion claims fails silently at exactly the moments it was built to save — the same no-silent-pass problem as generative agents in simulation, in miniature.",
      myRole: "Sole author — wrappers, contract tests, CI, and release documentation.",
      approach:
        "Keep planning and review with the supervising agent; hand execution to the delegate through cross-platform wrappers that return a structured result contract, with change attribution captured from git state rather than the delegate's own report.",
      system:
        "Paired bash and PowerShell wrappers with anti-fabrication sentinels, quota-failure fallback handling, and a structured result file the supervisor verifies before accepting work.",
      keyChallenge:
        "A real upstream stdin hang. The failure was root-caused, fixed at the wrapper level, and pinned by a regression test that feeds a marker into stdin and asserts the delegate reads nothing — the test fails without the fix.",
      evaluation:
        "Tested on Windows and Linux across multiple Python versions; contract tests covering the wrappers' failure modes; measurement claims in the repo are labeled with their limitations.",
      results: "Maintained open-source tool.",
      evidenceLinks: [
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/codex-delegate" },
        { label: "CI workflow (Ubuntu/Windows)", href: "https://github.com/WenyuChiou/codex-delegate/blob/master/.github/workflows/test.yml" },
        { label: "Test suite", href: "https://github.com/WenyuChiou/codex-delegate/tree/master/tests" },
        { label: "Changelog", href: "https://github.com/WenyuChiou/codex-delegate/blob/master/CHANGELOG.md" },
      ],
      relevance: {
        academic:
          "Supervisor/executor separation with audit trails — the governance thesis applied to my own toolchain.",
        industry:
          "Incident-driven hardening, cross-platform (Windows/POSIX) correctness, and regression tests that encode real failure modes — directly legible to reliability and evaluation teams.",
      },
    },

    "awesome-agentic-ai-zh": {
      title: "awesome-agentic-ai-zh — trilingual agentic-AI curriculum",
      status: "Maintained open-source tool",
      problem:
        "Chinese-speaking learners lacked a structured, staged path into agentic AI, and multilingual technical content drifts out of sync the moment it is duplicated by hand.",
      whyItMatters:
        "Locale drift is a correctness problem, not a translation problem — a curriculum whose language versions disagree teaches different things to different readers. It is solvable with CI, not vigilance.",
      myRole:
        "Sole creator and maintainer; external contributors' pull requests have been reviewed and merged.",
      approach:
        "A staged trilingual learning roadmap with runnable exercises, maintained under the same engineering discipline as a software project.",
      system:
        "A curriculum repository whose automated checks keep all three languages in sync, catch link rot, and flag overclaims — content governance implemented as automation.",
      keyChallenge:
        "Keeping three locales verifiably synchronized. The answer is automated checks that fail the build when the languages drift apart, replacing manual mirroring.",
      figure: {
        src: "/assets/awesome-agentic-ai-zh-banner.png",
        alt: "AI Agent Learning Paths diagram: shared foundations in stages 0 to 2, then two tracks — CLI power user and agent builder — converging on shared hubs for the Claude Code ecosystem and agent interfaces, branching to paths for researchers, developers, teachers, knowledge workers, and everyday users.",
        caption: "Two tracks over a shared spine, ending in audience-specific paths.",
      },
      evaluation:
        "The repo discloses honestly what has been executed versus syntax-checked; external contributions and an externally filed internationalization issue are the community-review signal.",
      results:
        "Maintained open-source tool; 5K+ GitHub stars, 700+ forks (August 2026) — the one community-adoption count permitted in public copy, re-verified before each publish.",
      evidenceLinks: [
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh" },
        { label: "CI workflows (language sync, link checks)", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh/tree/main/.github/workflows" },
        { label: "Contributors", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh/graphs/contributors" },
        { label: "trendshift listing", href: "https://trendshift.io/repositories/27540" },
      ],
      relevance: {
        academic:
          "Near zero, and the page says nothing to pretend otherwise — it is presented as the community/education line.",
        industry:
          "Automated content governance and bilingual technical communication; a distribution channel into the Chinese-speaking AI community.",
      },
    },
  },

  // IA §5.2 — footer, identical on all pages. Google Scholar is added only after the profile
  // shows "Wenyu Chiou" with the WRR paper attached; LinkedIn only after CONFIRM #6.
  footer: {
    line1: "Wenyu Chiou — Ph.D. Candidate, Civil & Environmental Engineering, Lehigh University",
    links: [
      { label: "GitHub", href: "https://github.com/WenyuChiou" },
      { label: "ORCID", href: "https://orcid.org/0009-0005-8006-1288" },
      { label: "Academic CV (PDF)", href: "/assets/Wenyu_Chiou_Academic_CV.pdf" },
      { label: "Industry resume (PDF)", href: "/assets/Wenyu_Chiou_AI_Research_Resume.pdf" },
    ],
    email: "wec324@lehigh.edu",
    copyright: "© Wenyu Chiou",
  },
};
