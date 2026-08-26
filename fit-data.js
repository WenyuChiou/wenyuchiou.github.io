export const FIT_ROLE_PRESETS = {
  "llm-evaluation": {
    title: { en: "LLM Evaluation / Model Behavior", "zh-TW": "LLM 評估／模型行為" },
    shortTitle: { en: "LLM evaluation", "zh-TW": "LLM 評估" },
    interpretation: {
      en: "Evaluation work that tests whether model decisions correspond to measured human behavior across groups and repeated runs.",
      "zh-TW": "檢驗模型決策是否符合實測人類行為，並比較不同群體與重複執行結果的評估工作。",
    },
    semanticQuery: "human-grounded LLM evaluation model behavior subgroup stability psychometrics measured evidence",
    ownershipIds: ["evaluation-design", "validity-analysis", "reproducible-research"],
    defaultRequirements: [
      { requirement: { en: "Evaluate model decisions against measured human behavior", "zh-TW": "以實測人類行為評估模型決策" }, priority: "required", fit: "strong", capabilityId: "human-grounded-evaluation", evidenceIds: ["human-grounded-llm-evaluation", "articles"] },
      { requirement: { en: "Examine subgroup differences and repeated-run stability", "zh-TW": "檢視次群體差異與重複執行穩定性" }, priority: "required", fit: "strong", capabilityId: "subgroup-stability", evidenceIds: ["human-grounded-llm-evaluation", "research"] },
      { requirement: { en: "Build reproducible evaluation and analysis workflows", "zh-TW": "建立可重現的評估與分析工作流" }, priority: "preferred", fit: "strong", capabilityId: "research-engineering", evidenceIds: ["open-source", "research"] },
    ],
  },
  "agent-systems": {
    title: { en: "Agent Systems / Applied AI", "zh-TW": "代理系統／應用 AI" },
    shortTitle: { en: "Agent systems", "zh-TW": "代理系統" },
    interpretation: {
      en: "Applied agent work that constrains structured model proposals, repairs failures, and records decisions before state changes.",
      "zh-TW": "在模型提案改變系統狀態前，以結構化輸出、驗證、修正與稽核約束代理行動的應用工作。",
    },
    semanticQuery: "governed agent systems structured outputs validators targeted repair audit traces MCP RAG tools",
    ownershipIds: ["governed-agents", "agent-workflows", "reproducible-research"],
    defaultRequirements: [
      { requirement: { en: "Validate agent actions before they change system state", "zh-TW": "在代理行動改變系統狀態前完成驗證" }, priority: "required", fit: "strong", capabilityId: "agent-governance", evidenceIds: ["wagf", "articles"] },
      { requirement: { en: "Implement structured outputs, targeted repair, and audit traces", "zh-TW": "實作結構化輸出、針對性修正與稽核軌跡" }, priority: "required", fit: "strong", capabilityId: "validation-repair", evidenceIds: ["wagf"] },
      { requirement: { en: "Work with agent tools, MCP, RAG, skills, and multi-agent workflows", "zh-TW": "運用代理工具、MCP、RAG、Skills 與多代理工作流" }, priority: "preferred", fit: "adjacent", capabilityId: "agent-tooling", evidenceIds: ["hire", "open-source"] },
    ],
  },
  "ai-science": {
    title: { en: "AI Research / AI for Science", "zh-TW": "AI 研究／AI for Science" },
    shortTitle: { en: "AI for science", "zh-TW": "AI for Science" },
    interpretation: {
      en: "Research engineering that connects individual decisions, scientific models, and system-level environmental consequences.",
      "zh-TW": "串連個別決策、科學模型與系統層級環境後果的研究工程工作。",
    },
    semanticQuery: "AI for science behavioral simulation agent-based modeling hydrological sociohydrological coupled human environment",
    ownershipIds: ["behavioral-simulation", "scientific-modeling", "reproducible-research"],
    defaultRequirements: [
      { requirement: { en: "Connect individual decisions to system-level consequences", "zh-TW": "將個別決策連結到系統層級後果" }, priority: "required", fit: "strong", capabilityId: "coupled-simulation", evidenceIds: ["floodabm", "articles"] },
      { requirement: { en: "Build behavioral and agent-based simulations", "zh-TW": "建立行為與代理人基礎模擬" }, priority: "required", fit: "strong", capabilityId: "behavioral-simulation", evidenceIds: ["floodabm", "research"] },
      { requirement: { en: "Work across hydrological and sociohydrological modeling", "zh-TW": "執行水文與社會水文建模" }, priority: "preferred", fit: "strong", capabilityId: "scientific-modeling", evidenceIds: ["floodabm", "publications"] },
    ],
  },
};

export const FIT_CAPABILITIES = {
  "human-grounded-evaluation": { en: "Human-grounded LLM evaluation", "zh-TW": "以人類行為為基礎的 LLM 評估" },
  "subgroup-stability": { en: "Subgroup-aware and stability-aware evaluation", "zh-TW": "次群體與穩定性導向評估" },
  "research-engineering": { en: "Reproducible research engineering", "zh-TW": "可重現研究工程" },
  "agent-governance": { en: "Governed agent systems", "zh-TW": "受治理的代理系統" },
  "validation-repair": { en: "Validators, targeted repair, and audit traces", "zh-TW": "驗證器、針對性修正與稽核軌跡" },
  "agent-tooling": { en: "Agent tooling and orchestration", "zh-TW": "代理工具與協作編排" },
  "coupled-simulation": { en: "Coupled decision and consequence modeling", "zh-TW": "決策與後果的耦合建模" },
  "behavioral-simulation": { en: "Behavioral and agent-based simulation", "zh-TW": "行為與代理人基礎模擬" },
  "scientific-modeling": { en: "Hydrological and sociohydrological modeling", "zh-TW": "水文與社會水文建模" },
};

export const FIT_OWNERSHIP = {
  "evaluation-design": { en: "Design evaluation protocols, subgroup comparisons, stability checks, and validity boundaries.", "zh-TW": "設計評估協定、次群體比較、穩定性檢查與效度邊界。" },
  "validity-analysis": { en: "Translate measured behavioral evidence into testable model-behavior criteria.", "zh-TW": "將實測行為證據轉化為可檢驗的模型行為標準。" },
  "reproducible-research": { en: "Build reproducible Python research workflows with tests, CI, and auditable artifacts.", "zh-TW": "建立具測試、CI 與可稽核產物的可重現 Python 研究工作流。" },
  "governed-agents": { en: "Define structured outputs, deterministic validators, repair policies, and state-update gates.", "zh-TW": "定義結構化輸出、確定性驗證器、修正政策與狀態更新閘門。" },
  "agent-workflows": { en: "Integrate LLM APIs, tools, memory, MCP, RAG, skills, plugins, and multi-agent workflows.", "zh-TW": "整合 LLM APIs、工具、記憶、MCP、RAG、Skills、外掛與多代理工作流。" },
  "behavioral-simulation": { en: "Connect individual choices to agent-based and coupled system consequences.", "zh-TW": "把個別選擇連結至代理人基礎模型與耦合系統後果。" },
  "scientific-modeling": { en: "Work across hydrological, sociohydrological, behavioral, and catastrophe modeling.", "zh-TW": "整合水文、社會水文、行為與巨災建模。" },
};

export const FIT_EVIDENCE = {
  hire: { capabilities: ["research-engineering", "agent-tooling", "scientific-modeling"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "supporting", sourceType: "verified-profile", verifiedTerms: ["Python", "R", "MATLAB", "LangChain", "MCP", "RAG", "Agent Skills", "OpenAI Codex", "Claude Code", "SEM", "ABM", "Hydrological Modeling"] },
  expertise: { capabilities: ["human-grounded-evaluation", "agent-governance", "behavioral-simulation"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "supporting", sourceType: "portfolio-profile", verifiedTerms: [] },
  "human-grounded-llm-evaluation": { capabilities: ["human-grounded-evaluation", "subgroup-stability"], roleRelevance: ["llm-evaluation", "ai-science"], evidenceStrength: "direct", sourceType: "case-study", verifiedTerms: ["psychometrics", "Confirmatory Factor Analysis", "Structural Equation Modeling", "repeated-run stability"] },
  wagf: { capabilities: ["agent-governance", "validation-repair"], roleRelevance: ["agent-systems", "ai-science"], evidenceStrength: "direct", sourceType: "case-study", verifiedTerms: ["structured outputs", "validators", "targeted repair", "audit traces"] },
  floodabm: { capabilities: ["coupled-simulation", "behavioral-simulation", "scientific-modeling"], roleRelevance: ["ai-science", "llm-evaluation"], evidenceStrength: "direct", sourceType: "published-case", verifiedTerms: ["Agent-Based Modeling", "catastrophe modeling", "flood risk", "hydrological modeling"] },
  research: { capabilities: ["subgroup-stability", "research-engineering", "behavioral-simulation"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "supporting", sourceType: "research-program", verifiedTerms: ["survey design", "psychometrics", "Python workflows"] },
  publications: { capabilities: ["human-grounded-evaluation", "scientific-modeling"], roleRelevance: ["llm-evaluation", "ai-science"], evidenceStrength: "direct", sourceType: "publication-record", verifiedTerms: ["Water Resources Research", "AGU", "ISDSA"] },
  articles: { capabilities: ["human-grounded-evaluation", "agent-governance", "coupled-simulation"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "supporting", sourceType: "methods-article", verifiedTerms: [] },
  "open-source": { capabilities: ["research-engineering", "agent-tooling"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "direct", sourceType: "github-repository", verifiedTerms: ["Agent Skills", "plugins", "multi-agent workflows", "research software"] },
  documents: { capabilities: ["research-engineering"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "supporting", sourceType: "resume-cv", verifiedTerms: [] },
  about: { capabilities: ["human-grounded-evaluation", "behavioral-simulation"], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "contextual", sourceType: "profile-page", verifiedTerms: [] },
  contact: { capabilities: [], roleRelevance: ["llm-evaluation", "agent-systems", "ai-science"], evidenceStrength: "contextual", sourceType: "contact", verifiedTerms: [] },
};

export const FIT_ENUMS = {
  priorities: ["required", "preferred", "contextual"],
  categories: ["strong", "adjacent", "gap"],
};
