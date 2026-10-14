export const GUIDE_EVIDENCE = [
  {
    id: "human-grounded-llm-evaluation",
    title: { en: "Human-Grounded LLM Evaluation", "zh-TW": "以人類行為證據為基礎的 LLM 評估" },
    href: "/work/human-grounded-llm-evaluation/",
    kind: "case",
    agentType: "human-reference",
    tasks: ["research", "observatory"],
    why: {
      en: "Tests whether generated flood-insurance responses preserve measured household differences and decision relationships, not just plausible averages.",
      "zh-TW": "檢查生成的洪水保險回答是否保留實測家戶差異與決策關係，而不只比較看似合理的平均值。",
    },
    how: {
      en: "Compares household surveys with profile-based model responses through measurement checks, decision-pathway analysis, subgroup comparisons, and repeated runs.",
      "zh-TW": "以測量檢查、決策路徑分析、家戶限制群體比較與重複執行，對照真人問卷和依家戶設定生成的模型回答。",
    },
    contribution: {
      en: "Makes behavioral disagreement and run-to-run instability visible when average-response comparisons would miss them.",
      "zh-TW": "讓只比較平均回答時容易忽略的行為差異與跨次執行不穩定性變得可見。",
    },
    limitations: {
      en: "Interactive examples use synthetic records, not individual survey responses or research results; generated responses are not additional human participants.",
      "zh-TW": "互動示例使用合成紀錄，不是個別問卷回答或研究結果；生成回答也不能視為新增的真人受訪者。",
    },
    keywords: {
      en: ["human evidence", "LLM evaluation", "measurement", "decision pathways", "stability"],
      "zh-TW": ["人類證據", "LLM 評估", "測量", "決策路徑", "穩定性"],
    },
    source: {
      url: "https://wenyuchiou.github.io/work/human-grounded-llm-evaluation/",
      revision: "bdd651156cdde2467d6ac8351c65b71f98cb37ec",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "wagf",
    title: { en: "WAGF Governed Agent System", "zh-TW": "WAGF 受治理代理系統" },
    href: "/work/wagf/",
    kind: "case",
    agentType: "llm-agent",
    tasks: ["research", "observatory"],
    why: {
      en: "Prevents an invalid model proposal from changing simulation state before declared behavioral, financial, and physical constraints are checked.",
      "zh-TW": "在模型提案通過已宣告的行為、財務與物理限制檢查前，阻止無效提案改變模擬狀態。",
    },
    how: {
      en: "Keeps typed proposals separate from execution, blocks invalid fields, repairs only failed parts, reruns validation, and records an audit trail.",
      "zh-TW": "將型別化提案與執行分離，阻擋無效欄位，只修正失敗部分，再次驗證並留下稽核軌跡。",
    },
    contribution: {
      en: "Provides an inspectable proposal-to-action boundary in which only validated proposals can update the coupled model.",
      "zh-TW": "建立可檢視的提案到行動邊界，只有通過驗證的提案才能更新耦合模型。",
    },
    limitations: {
      en: "Demonstrations illustrate validation behavior, not a real-world safety guarantee; declared rules cannot cover every failure mode.",
      "zh-TW": "示例呈現驗證行為，不代表真實世界的安全保證；已宣告的規則也無法涵蓋所有失敗模式。",
    },
    keywords: {
      en: ["governed agents", "structured proposals", "constraint validation", "targeted repair", "audit trail"],
      "zh-TW": ["代理治理", "結構化提案", "限制驗證", "針對性修正", "稽核軌跡"],
    },
    source: {
      url: "https://wenyuchiou.github.io/work/wagf/",
      revision: "bdd651156cdde2467d6ac8351c65b71f98cb37ec",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "floodabm",
    title: { en: "FLOODABM", "zh-TW": "FLOODABM 洪災代理模型" },
    href: "/work/floodabm/",
    kind: "case",
    agentType: "household-agent",
    tasks: ["research", "observatory"],
    why: {
      en: "Studies how household adaptation and insurance choices change flood losses and the resources available in later years.",
      "zh-TW": "研究家戶的調適與保險選擇，如何改變洪災損失及後續年度可用的資源。",
    },
    how: {
      en: "Builds survey-grounded household decisions into an agent-based model coupled with hazard, property, insurance, and financial state transitions.",
      "zh-TW": "將問卷支持的家戶決策建成代理人基模型，並與危害、財產、保險及財務狀態轉移耦合。",
    },
    contribution: {
      en: "Links household choices to downstream loss, insurance, and resource consequences in a traceable stateful simulation.",
      "zh-TW": "在可追蹤且具狀態的模擬中，連結家戶選擇與後續損失、保險及資源後果。",
    },
    limitations: {
      en: "Household agents simplify decisions and inherit model uncertainty; scenarios are not household predictions, and FLOODABM is not an integrated LLM system.",
      "zh-TW": "家戶代理簡化決策並承接模型不確定性；情境不是個別家戶預測，FLOODABM 也不是已整合 LLM 的系統。",
    },
    keywords: {
      en: ["household agents", "flood adaptation", "agent-based modeling", "coupled simulation", "insurance"],
      "zh-TW": ["家戶代理", "洪災調適", "代理人基模型", "耦合模擬", "保險"],
    },
    source: {
      url: "https://wenyuchiou.github.io/work/floodabm/",
      revision: "bdd651156cdde2467d6ac8351c65b71f98cb37ec",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "repo-ai-research-skills",
    title: { en: "AI Research Skills", "zh-TW": "AI Research Skills 科研技能目錄" },
    href: "https://github.com/WenyuChiou/ai-research-skills",
    kind: "tool",
    agentType: "catalog",
    tasks: ["research", "tools"],
    why: {
      en: "Organizes portable research skills across a staged lifecycle so evidence, handoffs, and human decisions remain inspectable.",
      "zh-TW": "將可攜式科研技能依階段式生命週期整理，讓證據、交接與人工決策都可檢視。",
    },
    how: {
      en: "Provides skill contracts for orientation, literature work, study design, writing, verification, and release, with explicit handoffs and human gates.",
      "zh-TW": "提供研究定位、文獻工作、研究設計、寫作、查核與發布的技能合約，並明定交接與人工關卡。",
    },
    contribution: {
      en: "Offers a reusable catalog and visual map for composing evidence-aware research workflows across supported agent hosts.",
      "zh-TW": "提供可重用的技能目錄與視覺地圖，協助在支援的代理宿主中組合具證據意識的科研工作流。",
    },
    limitations: {
      en: "This repository is the catalog and portable skill layer, not the executable research runtime; execution is supplied by research-hub and host integrations.",
      "zh-TW": "此儲存庫是目錄與可攜式技能層，不是可執行的科研執行環境；實際執行由 research-hub 與宿主整合提供。",
    },
    keywords: {
      en: ["research skills", "catalog", "evidence handoffs", "human gates", "portable workflows"],
      "zh-TW": ["科研技能", "目錄", "證據交接", "人工關卡", "可攜式工作流"],
    },
    source: {
      url: "https://github.com/WenyuChiou/ai-research-skills/blob/eb3315fea793b4c7208dcfc9bbeb02f48c0a2351/README.md",
      revision: "eb3315fea793b4c7208dcfc9bbeb02f48c0a2351",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "repo-research-hub",
    title: { en: "research-hub", "zh-TW": "research-hub 科研執行環境" },
    href: "https://github.com/WenyuChiou/research-hub",
    kind: "tool",
    agentType: "research-agent",
    tasks: ["research", "tools"],
    why: {
      en: "Keeps literature, evidence, analyses, and manuscript work connected through traceable local research records.",
      "zh-TW": "透過可追蹤的本機研究紀錄，維持文獻、證據、分析與手稿工作之間的連結。",
    },
    how: {
      en: "Runs a local research workspace and pipeline, with optional Zotero, Obsidian, NotebookLM, and bounded writing integrations plus explicit review states.",
      "zh-TW": "執行本機科研工作區與管線，可選接 Zotero、Obsidian、NotebookLM 與有邊界的寫作整合，並保留明確審查狀態。",
    },
    contribution: {
      en: "Supplies the executable scientific runtime and recoverable workflow state behind portable research contracts.",
      "zh-TW": "為可攜式科研合約提供可執行的科學工作環境，以及可復原的工作流狀態。",
    },
    limitations: {
      en: "Requires a compatible local environment and explicit integration setup; some workspace and external integrations are preview, optional, or require independent verification.",
      "zh-TW": "需要相容的本機環境與明確的整合設定；部分工作區及外部整合仍屬預覽、選用功能，或需另行驗證。",
    },
    keywords: {
      en: ["research runtime", "local workspace", "provenance", "workflow state", "integrations"],
      "zh-TW": ["科研執行環境", "本機工作區", "來源追蹤", "工作流狀態", "整合"],
    },
    source: {
      url: "https://github.com/WenyuChiou/research-hub/blob/80eae8e6b34878e2df1ae9d8e232958b1f6da2f9/README.md",
      revision: "80eae8e6b34878e2df1ae9d8e232958b1f6da2f9",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "repo-agent-collab-skills",
    title: { en: "Agent Collab Skills", "zh-TW": "Agent Collab Skills 協作合約" },
    href: "https://github.com/WenyuChiou/agent-collab-skills",
    kind: "tool",
    agentType: "collaboration",
    tasks: ["tools"],
    why: {
      en: "Makes delegated work easier to scope, reconcile, challenge, and accept with explicit evidence and decision boundaries.",
      "zh-TW": "以明確的證據與決策邊界，讓委派工作更容易被界定、整合、質疑與驗收。",
    },
    how: {
      en: "Defines provider-neutral collaboration skills and machine-readable contracts for task splitting, debate, reconciliation, checkpoints, and acceptance gates.",
      "zh-TW": "定義供應商中立的協作技能與機器可讀合約，涵蓋任務拆解、辯論、整合、檢查點與驗收關卡。",
    },
    contribution: {
      en: "Adds reusable governance contracts and deterministic checks around work performed by host-provided agents.",
      "zh-TW": "為宿主提供的代理工作加入可重用的治理合約與確定性檢查。",
    },
    limitations: {
      en: "It is not a general agent runtime or autonomous full runner; a host must supply agents, execution, permissions, and delivery decisions.",
      "zh-TW": "它不是通用代理執行環境，也不是自主完整執行器；代理、執行、權限與交付決策仍由宿主提供。",
    },
    keywords: {
      en: ["collaboration contracts", "task splitting", "reconciliation", "acceptance gates", "governance"],
      "zh-TW": ["協作合約", "任務拆解", "結果整合", "驗收關卡", "治理"],
    },
    source: {
      url: "https://github.com/WenyuChiou/agent-collab-skills/blob/e7df8fd3a9a3f41f1d93eb4d447ee08923f002d3/README.md",
      revision: "e7df8fd3a9a3f41f1d93eb4d447ee08923f002d3",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "repo-awesome-agentic-ai-zh",
    title: { en: "Agentic AI Learning Roadmap", "zh-TW": "代理式 AI 學習地圖" },
    href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh",
    kind: "tool",
    agentType: "catalog",
    tasks: ["tools"],
    why: {
      en: "Provides a structured learning path from foundations and CLI use to agent building, evaluation, production, and interfaces.",
      "zh-TW": "提供從基礎、CLI 使用到代理建置、評估、生產與操作介面的結構化學習路徑。",
    },
    how: {
      en: "Curates staged reading routes, role-specific branches, comparisons, and practical resources for learners with different goals.",
      "zh-TW": "依不同學習目標整理分階段閱讀路線、角色分支、比較資料與實作資源。",
    },
    contribution: {
      en: "Maps concepts and tools into navigable learning routes for CLI users, agent builders, researchers, and developers.",
      "zh-TW": "將概念與工具整理成可導覽的學習路線，服務 CLI 使用者、代理開發者、研究人員與軟體開發者。",
    },
    limitations: {
      en: "This is a learning catalog and roadmap, not executable agent software; linked tools and practices need separate evaluation in their own environments.",
      "zh-TW": "這是學習目錄與路線圖，不是可執行的代理軟體；連結的工具與做法仍需在各自環境中另行評估。",
    },
    keywords: {
      en: ["learning catalog", "agentic AI", "roadmap", "CLI agents", "agent building"],
      "zh-TW": ["學習目錄", "代理式 AI", "路線圖", "CLI 代理", "代理建置"],
    },
    source: {
      url: "https://github.com/WenyuChiou/awesome-agentic-ai-zh/blob/f4282ac68907db2c82809c9cbfc5ba8af3d93ca6/README.md",
      revision: "f4282ac68907db2c82809c9cbfc5ba8af3d93ca6",
      checkedAt: "2026-10-13",
    },
  },
  {
    id: "repo-codex-delegate",
    title: { en: "Codex Delegate", "zh-TW": "Codex Delegate 委派工具" },
    href: "https://github.com/WenyuChiou/codex-delegate",
    kind: "tool",
    agentType: "delegation",
    tasks: ["tools"],
    why: {
      en: "Delegates bounded implementation-heavy coding work while leaving planning, review, acceptance, and delivery with the supervisor.",
      "zh-TW": "委派有邊界且實作量大的程式工作，同時讓規劃、審查、驗收與交付仍由監督者負責。",
    },
    how: {
      en: "Uses a thin synchronous wrapper and result contract to run Codex CLI as an execution specialist, followed by supervisor verification.",
      "zh-TW": "透過精簡的同步封裝與結果合約，讓 Codex CLI 擔任執行專家，再由監督者驗證。",
    },
    contribution: {
      en: "Provides a cross-platform compatibility path for scoped CLI delegation with explicit completion and acceptance boundaries.",
      "zh-TW": "提供跨平台相容路徑，以明確的完成與驗收邊界進行有限範圍的 CLI 委派。",
    },
    limitations: {
      en: "Requires a compatible Codex CLI and supervisor workflow; it is a delegation adapter, not a research-evidence checker or autonomous reviewer.",
      "zh-TW": "需要相容的 Codex CLI 與監督工作流；它是委派轉接工具，不是研究證據查核器，也不是自主審查者。",
    },
    keywords: {
      en: ["delegation", "Codex CLI", "execution specialist", "result contract", "supervisor acceptance"],
      "zh-TW": ["委派", "Codex CLI", "執行專家", "結果合約", "監督者驗收"],
    },
    source: {
      url: "https://github.com/WenyuChiou/codex-delegate/blob/4b517734aa20d7198d4c3e1b7b9eaeb0e8722f30/README.md",
      revision: "4b517734aa20d7198d4c3e1b7b9eaeb0e8722f30",
      checkedAt: "2026-10-13",
    },
  },
];
