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
    umbrella: "Verified simulation of human decisions under climate risk",
    dialect: {
      industry: "AI evaluation / research engineer with catastrophe-risk domain depth.",
      academic: "Computational socio-hydrologist developing validated LLM-agent methods on his own empirical data.",
    },
    portrait: {
      src: "/assets/portrait.jpg",
      alt: "Wenyu Chiou at the AGU Fall Meeting 2025, beside his research poster.",
    },
    workingFormulation:
      "I build empirically grounded simulations of how people decide under flood risk — and the fail-closed validation systems that show when AI agents can (and cannot) stand in for real people.",
    availability:
      "Open to Summer 2027 internships in AI evaluation, research engineering, and risk analytics.",
  },

  // IA §2 Block 3 — fixed order in both modes: science → tool → community verification.
  pillars: [
    {
      id: "wrr",
      kicker: "Published research",
      copy: "Yang, Y. C. E., & Chiou, W. (2026). Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions. Water Resources Research, 62(6), e2025WR042111.",
      href: "https://doi.org/10.1029/2025WR042111",
      label: "Published · second author of two",
    },
    {
      id: "research-hub",
      kicker: "Shipped, verified tooling",
      copy: "research-hub-pipeline v1.1.1 on PyPI — a research-literature pipeline with a fail-closed anti-fabrication gate; CI across 3 OS × 4 Python versions.",
      href: "https://pypi.org/project/research-hub-pipeline/",
      caseStudy: "/projects/research-hub/",
      label: "Maintained open-source tool",
    },
    {
      id: "oss",
      kicker: "Externally reviewed code",
      copy: "8 merged pull requests in third-party open-source projects, including a root-caused bug fix with a regression test that fails on main. Verified July 2026.",
      href: "/engineering/#oss",
      label: "",
    },
  ],

  // IA §2 Block 4 — one-line problem statement, status label, case-study link.
  // No star counts except the one allowed awesome-agentic-ai-zh string.
  selectedEngineering: [
    {
      slug: "research-hub",
      name: "research-hub",
      line: "LLM-assisted literature workflows fabricate references. research-hub places a fail-closed verification gate at the write boundary, so an unverifiable citation fails loudly instead of entering the record.",
      status: "Maintained open-source tool",
      href: "/projects/research-hub/",
    },
    {
      slug: "codex-delegate",
      name: "codex-delegate",
      line: "Delegating code work to a second AI agent is only economical if the delegate cannot fabricate success. codex-delegate wraps delegation in anti-fabrication contracts, verified from git state rather than the delegate's own report.",
      status: "Maintained open-source tool",
      href: "/projects/codex-delegate/",
    },
    {
      slug: "awesome-agentic-ai-zh",
      name: "awesome-agentic-ai-zh",
      line: "Chinese-speaking learners lacked a staged path into agentic AI, and hand-mirrored translations drift. This trilingual curriculum keeps its locales verifiably in sync with CI.",
      status: "Maintained open-source tool",
      stars: "4.5k+ GitHub stars (July 2026)",
      href: "/projects/awesome-agentic-ai-zh/",
    },
  ],

  // IA §2 Block 5.
  selectedResearch: [
    {
      slug: "floodabm",
      name: "FLOODABM",
      line: "Flood-adaptation models usually assert household behavior instead of measuring it. FLOODABM grounds 52,141 simulated households in a 937-household survey and validates losses against observed insurance claims.",
      status: "Research prototype",
      href: "/projects/floodabm/",
    },
    {
      slug: "cat-framework",
      name: "Cat_framework",
      line: "A loss number without an inspectable validation chain cannot be trusted. This Hazus-based seismic bridge-loss pipeline reports where the recipe fails, not only where it works.",
      status: "Research prototype",
      href: "/projects/cat-framework/",
    },
  ],

  // IA §2 Block 6 — mode-invariant single string.
  currentFocus:
    "Current focus: validation methods that test whether LLM agents reproduce empirically identified human decision pathways — grounded in a 937-household survey I designed and fielded — and governance methods for generative agents, research software now in preparation for release.",

  // IA §2 Block 7 — mode decides primary/secondary in app.jsx.
  documents: {
    academic: { file: "/assets/Wenyu_Chiou_Academic_CV.pdf", label: "Academic CV (PDF)" },
    industry: { file: "/assets/Wenyu_Chiou_AI_Research_Resume.pdf", label: "Industry resume (PDF)" },
  },

  // IA §2 Block 8 — the single CTA.
  contact: {
    availability:
      "Open to Summer 2027 internships in AI evaluation, research engineering, and risk analytics.",
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
        evidence: "First-author manuscript targeting Sustainable Cities and Society.",
        statusNote: "Under review.",
      },
      {
        n: 3,
        name: "Coupled ABM–CAT model",
        what: "Built a Bayesian-calibrated agent-based model of 52,141 households across 27 census tracts, coupled to a catastrophe flood model with National Flood Insurance Program premium, payout, and deductible mechanics and income-normalized equity analysis of who bears flood losses.",
        evidence:
          "FLOODABM repository — Zenodo-archived with CITATION.cff, published seed lists, and a candid known-limitations register; first-author manuscript targeting the Journal of Hydrology.",
        statusNote: "Code: Research prototype, archived. Paper: Under review.",
      },
      {
        n: 4,
        name: "LLM-agent validity",
        what: "Substituted LLM agents as the behavioral engine of the simulation, then treated the substitution itself as the validity problem: nothing guarantees a generative agent decides the way real households do, so the question becomes whether LLM personas reproduce empirically identified human decision pathways.",
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
      "My research asks a question generative AI has made urgent: when can a simulated human decision-maker be trusted? I approach it by owning every link of the evidence chain. I designed and fielded a 937-household flood-adaptation survey in New Jersey’s Passaic River Basin, used structural equation modeling to identify how owners and renters actually decide among adaptation actions, and encoded those empirically identified pathways in a Bayesian-calibrated agent-based model of 52,141 households coupled to a catastrophe flood model with National Flood Insurance Program mechanics — including income-normalized equity analysis of who bears flood losses. With my advisor, I published a Water Resources Research article (62(6), e2025WR042111, 2026) substituting large language models as the behavioral engine of such simulations. That substitution creates a validity problem: nothing guarantees a generative agent decides the way real households do. My current work confronts it directly — testing whether LLM personas reproduce the decision pathways identified in my own survey data, and developing governance methods that validate agent behavior against physical constraints and behavioral theory — research software now in preparation for release. First-author manuscripts on the coupled model and on adaptation decision pathways are under review. The longer-term agenda is a validation standard for generative agents in consequential simulation.",
  },

  // /engineering/ — positioning §3.
  engineering: {
    // §3.2 — problems solved, employer language.
    problems: [
      {
        id: "unverified-record",
        problem: "LLM outputs were entering a permanent record unverified.",
        response:
          "I built a research-literature pipeline whose write path is guarded by a fail-closed anti-fabrication gate: references that cannot be verified are quarantined with an explicit failure taxonomy, never silently accepted. Shipped and maintained publicly as research-hub-pipeline on PyPI.",
      },
      {
        id: "no-validity-standard",
        problem: "Generative agents entered consequential simulation with no validity standard.",
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
        what: "Local-first research-literature pipeline (Zotero / Obsidian / NotebookLM orchestration) with a fail-closed authenticity gate.",
        evidence:
          "PyPI research-hub-pipeline v1.1.1; CI across 3 OS × 4 Python versions; in-repo retrieval-recall evaluation suite against golden fixtures; observed failures recorded as explicit audit baselines; in-repo failure taxonomy.",
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
        what: "Cross-platform agent-delegation wrapper with anti-fabrication contracts.",
        evidence: "Public repo; Ubuntu/Windows CI; regression test pinning a real upstream stdin hang.",
        status: "Maintained open-source tool",
        href: "/projects/codex-delegate/",
        repo: "https://github.com/WenyuChiou/codex-delegate",
      },
      {
        name: "awesome-agentic-ai-zh",
        what: "Trilingual agentic-AI curriculum (community/education line).",
        evidence:
          "4.5k+ GitHub stars (July 2026); external contributors; CI-enforced locale parity.",
        status: "Maintained open-source tool",
        href: "/projects/awesome-agentic-ai-zh/",
        repo: "https://github.com/WenyuChiou/awesome-agentic-ai-zh",
      },
    ],
    systemsNote: "WAGF — research software in preparation for release.",

    // §3.4 — every item inspectable in a public repo.
    evalRecord: [
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

    // §3.6 — the 8 merged third-party PRs, real URLs.
    oss: {
      intro: "8 merged pull requests in third-party open-source projects.",
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
          desc: "Taiwan-market data feature, re-scoped through maintainer review.",
        },
        {
          repo: "NVIDIA/skills",
          number: 76,
          url: "https://github.com/NVIDIA/skills/pull/76",
          desc: "Documentation fix repairing the Skill Catalog link in the contributing guide.",
        },
      ],
    },

    // §3.6 — artifact-backed capabilities only.
    capabilities: [
      "Python",
      "Testing and CI",
      "Evaluation design",
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

    softwareNote: "WAGF — research software in preparation for release.",

    // Descriptor entries only — exact titles are inserted after CONFIRM #3 resolves; nothing
    // is inflated beyond "Under review". The LLM-persona validity study is not listed at all
    // until its status resolves (CONFIRM #3).
    underReview: [
      {
        descriptor:
          "First-author manuscript — coupled agent-based × catastrophe-model flood adaptation (FLOODABM companion).",
        target: "Journal of Hydrology",
        status: "Under review",
      },
      {
        descriptor:
          "First-author manuscript — flood-adaptation decision pathways across marginalized and non-marginalized groups (structural equation modeling).",
        target: "Sustainable Cities and Society",
        status: "Under review",
      },
    ],

    // Verified facts only: venue + presentation ID. Exact titles are gated (CONFIRM #2/#12
    // and canonical-facts §4.3) and never invented.
    presentations: [
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
      // NO fourth slot is rendered: the fourth presentation is reserved pending CONFIRM #4
      // and ships only once identified. Do not add a placeholder entry.
    ],
  },

  // Case studies — IA §3.2–3.6. Each covers all 11 IA §3.1 content fields; on-page rendering
  // folds them into the 4-section VDS layout (implementation-plan §0.6 deviation 3).
  caseStudies: {
    "research-hub": {
      title: "research-hub — fail-closed literature pipeline",
      status: "Maintained open-source tool",
      problem:
        "LLM-assisted literature workflows fabricate references, and those references were entering a permanent research record (Zotero, Obsidian, NotebookLM) unverified. Nothing in the standard toolchain makes an unverifiable citation fail loudly.",
      whyItMatters:
        "A fabricated reference corrupts a knowledge base silently and propagates into manuscripts. The failure mode must be visible at write time, not discovered at submission time.",
      myRole:
        "Sole designer and maintainer, end to end — architecture, the authenticity gate, the MCP server, CI design, the evaluation suite, and the release process.",
      approach:
        "A local-first pipeline (discover → verify → ingest → brief) with the verification gate placed at the write boundary: references that cannot be verified are quarantined with an explicit failure reason, never silently accepted.",
      system:
        "A Python package published to PyPI as research-hub-pipeline v1.1.1 (MIT). The core is a fail-closed anti-fabrication module with a transient-vs-permanent failure taxonomy and quarantine-not-delete handling, plus an MCP server exposing the pipeline to agent hosts.",
      keyChallenge:
        "Distinguishing transient metadata-service failures from genuinely unverifiable references, so the gate fails closed without quarantining everything during an upstream outage. The answer is the explicit failure taxonomy, inspectable in the repo.",
      evaluation:
        "CI across 3 operating systems × 4 Python versions; in-repo retrieval-recall evaluation suite against golden fixtures; observed failures recorded as explicit audit baselines. The README states honestly that the tool is in daily use by one researcher — the limitation is disclosed, not hidden.",
      results: "Maintained open-source tool; v1.1.1 live on PyPI with a documented release history.",
      evidenceLinks: [
        { label: "PyPI: research-hub-pipeline", href: "https://pypi.org/project/research-hub-pipeline/" },
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/research-hub" },
        { label: "CI workflow (3 OS × 4 Python)", href: "https://github.com/WenyuChiou/research-hub/blob/master/.github/workflows/ci.yml" },
        { label: "Retrieval-recall evaluation suite", href: "https://github.com/WenyuChiou/research-hub/tree/master/tests/evals" },
        { label: "Changelog", href: "https://github.com/WenyuChiou/research-hub/blob/master/CHANGELOG.md" },
      ],
      relevance: {
        academic:
          "Reproducibility infrastructure — governance applied to LLM-assisted research practice.",
        industry:
          "The write-path gate is the same design problem as production AI-output validation; demonstrates evaluation design, CI-matrix engineering, and release discipline for AI-evaluation and research-engineering roles.",
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
      title: "codex-delegate — agent delegation with anti-fabrication contracts",
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
        "CI on Ubuntu and Windows across multiple Python versions; contract tests covering the wrappers' failure modes; measurement claims in the repo are labeled with their limitations.",
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
        "A curriculum repository whose CI enforces cross-locale parity, checks link rot, and lints for overclaims — content governance implemented as automation.",
      keyChallenge:
        "Keeping three locales verifiably synchronized. The answer is CI-enforced parity checks that fail the build on drift, replacing manual mirroring.",
      evaluation:
        "The repo discloses honestly what has been executed versus syntax-checked; external contributions and an externally filed internationalization issue are the community-review signal.",
      results:
        "Maintained open-source tool; 4.5k+ GitHub stars (July 2026) — the one star count permitted in public copy, re-verified before each publish.",
      evidenceLinks: [
        { label: "GitHub repository", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh" },
        { label: "CI workflows (locale parity, link checks)", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh/tree/main/.github/workflows" },
        { label: "Contributors", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh/graphs/contributors" },
        { label: "trendshift listing", href: "https://trendshift.io/repositories/27540" },
      ],
      relevance: {
        academic:
          "Near zero, and the page says nothing to pretend otherwise — it is presented as the community/education line.",
        industry:
          "CI-enforced content governance and bilingual technical communication; a distribution channel into the Chinese-speaking AI community.",
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
