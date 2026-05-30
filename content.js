// Real content for Wenyu Chiou — sourced from WenyuChiou/Wenyu-Portfolio
const CONTENT = {
  nav: {
    about:    { en: "About",        zh: "關於" },
    research: { en: "Research",     zh: "研究" },
    projects: { en: "Projects",     zh: "專案" },
    pubs:     { en: "Publications", zh: "著作" },
    repos:    { en: "Repos",        zh: "開源" },
    writing:  { en: "Writing",      zh: "文章" },
    contact:  { en: "Contact",      zh: "聯絡" },
  },

  hero: {
    eyebrow:   { en: "Ph.D. Candidate · Lehigh University · Center for Catastrophe Modeling & Resilience", zh: "博士候選人 · 理海大學 · 災害建模與韌性中心" },
    title_line1: { en: "Modeling how people", zh: "以語言模型驅動的智能體" },
    title_em:    { en: "decide",               zh: "模擬人類" },
    title_line2: { en: " under", zh: "在風險下的" },
    title_mark:  { en: "risk", zh: "決策行為" },
    title_tail:  { en: "—", zh: "—" },
    title_line3: { en: "and how cities adapt.", zh: "以及城市如何調適。" },
    lede: {
      en: "Advancing human-flood modeling from empirical foundations to LLM-based agent simulation. Open-source maintainer of agentic AI infrastructure — an 8-stage trilingual roadmap (★ 1.8k) and 7+ Claude Code skills.",
      zh: "推進「人—洪水」建模——從實證基礎到 LLM 驅動的智能體模擬。同時是開源 agentic AI 基礎設施的維護者：8 階段三語學習地圖（★ 1.8k）與 7+ 個 Claude Code skills。"
    },
    stats: [
      { label: { en: "Research group", zh: "研究團隊" }, value: { en: "Complex Water Adaptive System Group", zh: "複雜水系適應系統研究群" } },
      { label: { en: "Focus",          zh: "研究重心" }, value_en: ["ABM", "Flood Risk", "LLM Agents"], value_zh: ["智能體", "洪水風險", "LLM 代理"] },
      { label: { en: "Based in",       zh: "地點" }, value: { en: "Bethlehem, PA · USA", zh: "賓州伯利恆 · 美國" } },
      { label: { en: "Status",         zh: "狀態" }, value: { en: "Open to Summer 2027 internships", zh: "2027 暑期實習開放中" } },
    ],
    cv:       { en: "Download CV", zh: "下載 CV" },
    contact:  { en: "Get in touch", zh: "聯絡我" },
    name:     { en: "Wenyu Chiou", zh: "邱文昱" },
    id:       { en: "PhD · 2024→", zh: "博士生 · 2024→" },
  },


  about: {
    num: "01",
    kicker: { en: "About", zh: "關於" },
    p1: {
      en: "I am a Ph.D. Candidate at Lehigh University's Department of Civil & Environmental Engineering, and a member of the Center for Catastrophe Modeling and Resilience. My research advances human-flood modeling — from empirical foundations grounded in catastrophe simulation to LLM agents that emulate household decision-making under climate risk.",
      zh: "我是美國 Lehigh University 土木與環境工程系的博士候選人，隸屬於災害建模與韌性中心 (Center for Catastrophe Modeling and Resilience)。我的研究在推進「人—洪水」建模：從以災害模擬為基礎的實證方法，發展到以 LLM 智能體模擬家戶在氣候風險下的決策行為。"
    },
    p2: {
      en: "Beyond the dissertation, I build open-source agentic AI infrastructure for the research community: an 8-stage trilingual learning roadmap (awesome-agentic-ai-zh, ★ 1.8k), a 5-plugin Claude Code marketplace covering literature triage to manuscript writing (ai-research-skills), and skills for multi-LLM delegation, multi-agent orchestration, and academic writing.",
      zh: "博士論文之外，我為研究社群打造開源 agentic AI 基礎設施：8 階段三語學習地圖 (awesome-agentic-ai-zh，★ 1.8k)、涵蓋文獻分流到論文寫作的 5-plugin Claude Code 市集 (ai-research-skills)，以及多 LLM 委派、多代理協作、學術寫作等 skills。"
    },
    card: {
      role:     { en: "Role",     zh: "身分" },
      role_v:   { en: "Ph.D. Candidate", zh: "博士候選人" },
      inst:     { en: "Institution", zh: "任職" },
      inst_v:   { en: "Lehigh University · CEE", zh: "Lehigh 土木環境系" },
      group:    { en: "Group",    zh: "研究群" },
      group_v:  { en: "Complex Water Adaptive System", zh: "Complex Water Adaptive System" },
      center:   { en: "Center",   zh: "中心" },
      center_v: { en: "Catastrophe Modeling & Resilience", zh: "災害建模與韌性中心" },
      field:    { en: "Field",    zh: "領域" },
      field_v:  { en: "ABM · LLM Agents · Flood Risk", zh: "智能體 · LLM · 洪水風險" },
      orcid:    { en: "ORCID",    zh: "ORCID" },
      orcid_v:  { en: "0009-0005-8006-1288", zh: "0009-0005-8006-1288" },
    },
    interests_label: { en: "Research keywords", zh: "研究關鍵字" },
    interests: [
      { en: "Catastrophe Modeling", zh: "災害建模" },
      { en: "Agent-Based Models",   zh: "智能體模擬" },
      { en: "LLM Agents",           zh: "LLM 代理" },
      { en: "Flood Adaptation",     zh: "洪水調適" },
      { en: "Bayesian Inference",   zh: "貝氏推論" },
      { en: "Hydrology",            zh: "水文學" },
      { en: "Resilience",           zh: "韌性分析" },
    ],
  },

  experience: {
    num: "02",
    kicker: { en: "Experience", zh: "經歷" },
    items: [
      {
        date: { en: "Aug 2024 — Present", zh: "2024.08 — 迄今" },
        role: { en: "Ph.D. Candidate", zh: "博士候選人" },
        org:  { en: "Lehigh University · Center for Catastrophe Modeling and Resilience", zh: "Lehigh 大學 · 災害建模與韌性中心" },
        desc: {
          en: "Advancing human-flood modeling from empirical foundations to LLM-agent simulation, while shipping the open-source infrastructure that supports it.",
          zh: "從實證基礎推進到 LLM 代理模擬的「人—洪水」建模研究，同時發布支撐這條路徑的開源基礎設施。"
        },
        bullets: [
          {
            en: "Designed and analysed household-level surveys mapping how owners and renters perceive flood risk and translate it into adaptation decisions; integrated 12 years of NJ Passaic survey + claims data (2011–2023) as empirical ground truth.",
            zh: "設計並分析家戶層級調查，釐清業主與租屋者如何感知洪水風險、並轉譯為調適決策；整合紐澤西 Passaic 流域 12 年 (2011–2023) 調查與保險理賠資料作為實證基礎。"
          },
          {
            en: "Quantified the two-way interaction between household adaptation actions and flood loss outcomes by building the first coupled ABM × CAT (FEMA Hazus 6.1) framework — captures how individual mitigation choices reshape basin-scale loss distributions across 127k+ parcels.",
            zh: "首度將家戶調適行為與洪水損失結果的雙向交互量化：建立首套 ABM × CAT (FEMA Hazus 6.1) 耦合框架，捕捉個別減災選擇如何改寫流域層級 127k+ 戶的損失分布。"
          },
          {
            en: "Developed WAGF — a governed LLM-agent framework letting LLMs act as bounded-rational households. A 6-stage validation pipeline (physical · behavioral · financial · social) catches Logic-Action Gap failures before they propagate; multi-LLM ablation across Claude / GPT-5 / Gemini.",
            zh: "開發 WAGF——governed LLM 代理框架，讓 LLM 以有限理性 (bounded rationality) 扮演家戶角色；6 階段驗證管線（物理 · 行為 · 金融 · 社會）在動作落地前攔截邏輯—行動落差失敗；橫跨 Claude / GPT-5 / Gemini 的多 LLM 對比實驗。"
          },
          {
            en: "Built a multi-agent system coupled with catastrophe models so policy questions previously answered by expert judgement can now be quantified — three reference implementations spanning flood, multi-agent flood, and Colorado irrigation.",
            zh: "建立多代理系統 × 災害模型耦合架構，把過去依賴專家判斷的政策問題轉為可量化分析；完成洪水、多代理洪水、Colorado 灌溉三套參考實作。"
          },
          {
            en: "Shipped open-source agentic-workflow Skills and learning resources for the research community: ai-research-skills (5-plugin Claude Code marketplace · 14 skills · ★ 82), codex-delegate / agent-collab-skills (multi-LLM orchestration), awesome-agentic-ai-zh (★ 1.8k · 8-stage trilingual learning roadmap).",
            zh: "為研究社群發布開源 agentic workflow Skills 與學習資源：ai-research-skills (5-plugin Claude Code 市集 · 14 skills · ★ 82)、codex-delegate / agent-collab-skills (多 LLM 協作)、awesome-agentic-ai-zh (★ 1.8k · 8 階段三語學習地圖)。"
          }
        ],
        tags: ["ABM", "CAT Modeling", "LLM Agents", "Multi-Agent", "Open Source"]
      },
      {
        date: { en: "Jan 2024 — Jun 2024", zh: "2024.01 — 2024.06" },
        role: { en: "Research Assistant", zh: "研究助理" },
        org:  { en: "National Central University", zh: "國立中央大學" },
        desc: {
          en: "Developed 3D groundwater flow simulation models for coastal aquifer systems and contributed to Nature-Based Solutions (NBS) assessment indicators.",
          zh: "開發沿海含水層 3D 地下水模擬模型，並參與自然為本解方 (NBS) 評估指標的建立。"
        },
        tags: ["Groundwater", "NBS", "Modeling"]
      },
      {
        date: { en: "Jul 2022 — Aug 2022", zh: "2022.07 — 2022.08" },
        role: { en: "Summer Intern", zh: "暑期實習" },
        org:  { en: "NCDR (National Science and Technology Center for Disaster Reduction)", zh: "國家災害防救科技中心 (NCDR)" },
        desc: {
          en: "Conducted research on climate change adaptation strategies and disaster risk reduction (during M.S. studies).",
          zh: "進行氣候變遷調適策略與災害風險減輕之研究（碩士在學期間）。"
        },
        tags: ["Climate Adaptation", "Disaster Risk"]
      },
      {
        date: { en: "Aug 2021 — Jun 2023", zh: "2021.08 — 2023.06" },
        role: { en: "M.S. Researcher · Hydrological & Oceanic Sciences", zh: "碩士研究員 · 水文與海洋科學" },
        org:  { en: "National Central University · Department of Hydrological and Oceanic Sciences", zh: "國立中央大學 · 水文與海洋科學系" },
        desc: {
          en: "Master's thesis on submarine groundwater discharge along the Taoyuan coastline — built a 3D numerical model of coastal aquifer flow and salinity dynamics, calibrated against electrical resistivity tomography (ERT) surveys and field observations across the Taoyuan Tableland.",
          zh: "碩士論文聚焦桃園沿岸海底地下水潛流：建立沿海含水層流場與鹽度動態的 3D 數值模型，以電阻率層析成像 (ERT) 探勘與現地觀測資料校正，研究範圍涵蓋整個桃園台地。"
        },
        tags: ["Hydrology", "SGD", "MODFLOW", "Field Survey"]
      },
      {
        date: { en: "Jul 2020 — Aug 2020", zh: "2020.07 — 2020.08" },
        role: { en: "Research Intern", zh: "研究實習" },
        org:  { en: "Academia Sinica · Institute of Earth Sciences", zh: "中央研究院 · 地球科學研究所" },
        desc: {
          en: "Summer internship at IES; analysed seismic data and geological structures.",
          zh: "於地球科學研究所進行暑期研究，分析地震資料與地質構造。"
        },
        tags: ["Seismology", "Data Analysis"]
      },
    ],
  },

  education: {
    num: "03",
    kicker: { en: "Education", zh: "學歷" },
    items: [
      {
        date: { en: "Aug 2024 — present", zh: "2024.08 — 迄今" },
        role: { en: "Ph.D., Civil & Environmental Engineering", zh: "土木與環境工程博士" },
        org:  { en: "Lehigh University, USA", zh: "Lehigh 大學 · 美國" },
        desc: { en: "Dissertation direction: LLM-driven agent-based models of household decision-making under flood risk.", zh: "博士論文方向：以 LLM 驅動之智能體模擬，研究家戶面對洪水風險之決策行為。" },
        tags: ["ABM", "LLM Agents", "Flood"]
      },
      {
        date: { en: "Aug 2021 — Jun 2023", zh: "2021.08 — 2023.06" },
        role: { en: "M.S., Hydrological & Oceanic Sciences", zh: "水文與海洋科學碩士" },
        org:  { en: "National Central University, Taiwan", zh: "國立中央大學 · 台灣" },
        desc: { en: "Thesis: Submarine Groundwater Discharge and Salinity Dynamics in Coastal Taoyuan.", zh: "碩士論文：桃園沿岸地下水潛流與鹽度動態。" },
        tags: ["Hydrology", "Oceanic Science"]
      },
      {
        date: { en: "Sep 2017 — Jun 2021", zh: "2017.09 — 2021.06" },
        role: { en: "B.S., Earth Sciences", zh: "地球科學學士" },
        org:  { en: "National Central University, Taiwan", zh: "國立中央大學 · 台灣" },
        desc: { en: "Foundations in geophysics, hydrology, seismology and remote sensing; undergraduate research at Academia Sinica IES.", zh: "地球物理、水文、地震學與遙測基礎訓練；於中研院地科所進行大學部研究。" },
        tags: ["Earth Sciences", "Geophysics", "Hydrology"]
      },
    ],
  },

  skills: {
    num: "04",
    kicker: { en: "Skills", zh: "技能" },
    cats: [
      {
        icon: "brain",
        name: { en: "Research & Modeling", zh: "研究與建模" },
        items: ["Catastrophe Modeling", "Agent-Based Modeling", "Flood Adaptation", "Flood Risk Management", "Hydrology & Groundwater", "Risk & Resilience Analysis", "Bayesian Inference"]
      },
      {
        icon: "code",
        name: { en: "Programming & Tools", zh: "程式與工具" },
        items: ["Python", "Matlab", "R", "QGIS", "ArcGIS", "Git", "Jupyter"]
      },
      {
        icon: "ai",
        name: { en: "AI & Emerging Tech", zh: "AI 新興技術" },
        items: ["LLM-Enabled Agents", "Prompt Engineering", "Multi-Agent Systems", "Automated Workflows", "RAG", "MCP"]
      },
      {
        icon: "flow",
        name: { en: "AI-Native Workflows", zh: "AI 原生工作流" },
        items: ["Claude Code", "Cursor", "Windsurf", "Antigravity", "Codex", "Gemini CLI"]
      },
      {
        icon: "data",
        name: { en: "Data & Viz", zh: "資料與視覺化" },
        items: ["pandas", "NumPy", "scikit-learn", "matplotlib", "GeoPandas", "QGIS"]
      },
      {
        icon: "write",
        name: { en: "Writing & Comm.", zh: "寫作與溝通" },
        items: ["LaTeX", "Academic Writing", "中文", "English", "Conference Talks"]
      },
    ]
  },

  projects: {
    num: "05",
    kicker: { en: "Featured Projects", zh: "精選專案" },
    intro: { en: "Selected research code, posters, and open-source tools I designed, built and maintain.", zh: "以下是我獨立設計、開發並持續維護的精選研究程式碼、海報與開源工具。" },
    items: [
      {
        image: "assets/wagf-architecture.jpg",
        featured: true,
        category: "research",
        meta: { en: "Multi-Agent LLM Governance · 2026", zh: "多代理 LLM 治理 · 2026" },
        title: { en: "WAGF — Water Agent Governance Framework", zh: "WAGF — 水資源代理治理框架" },
        desc: {
          en: "Formalizing safety for LLM agents in consequential simulations. The first 6-stage validation pipeline (physical · behavioral · financial · social) that catches Logic-Action Gap failures — hallucination, logical drift, unsafe state mutation — before they propagate. Three reference implementations across flood, multi-agent flood, and Colorado irrigation; multi-LLM ablation. Paper in progress.",
          zh: "為高風險模擬中的 LLM 智能體建立安全機制。首套 6 階段驗證管線（物理 · 行為 · 金融 · 社會），在動作落地前攔截「邏輯—行動落差」失敗——幻覺、邏輯偏移、不安全的狀態變更。涵蓋洪水、多代理洪水、Colorado 灌溉三套參考實作；多 LLM 對比實驗。論文撰寫中。"
        },
        role: "lead",
        stack: ["Python", "LangGraph", "Claude", "GPT-5"],
        tags: ["LLM Agents", "Multi-Agent", "Agent Safety"],
        href: "https://github.com/WenyuChiou/WAGF",
        foot: { en: "github.com/WenyuChiou/WAGF", zh: "github.com/WenyuChiou/WAGF" }
      },
      {
        image: "assets/agu2025-poster.jpg",
        category: "research",
        meta: { en: "AGU 2025 · Poster NH41E-0449", zh: "AGU 2025 · 海報 NH41E-0449" },
        title: { en: "Agent-Based Flood Adaptation Model", zh: "家戶洪水調適智能體模型" },
        tldr: {
          en: "Couples FEMA Hazus 6.1 with household-level ABM; calibrated on 12 years of NJ survey + claims data.",
          zh: "FEMA Hazus 6.1 × 家戶層級 ABM 耦合，以紐澤西 12 年調查與理賠資料校正。"
        },
        desc: {
          en: "First framework to couple FEMA Hazus 6.1 catastrophe modeling with an agent-based model of household-level flood adaptation. Each agent is one Passaic River Basin household; decisions are calibrated against 12 years of NJ survey and claims data (2011–2023), accounting for social heterogeneity between owners and renters.",
          zh: "首度將 FEMA Hazus 6.1 災害模型與家戶層級的智能體模擬耦合。每個 agent 對應一戶 Passaic 流域家庭，決策以紐澤西 12 年 (2011–2023) 的調查與保險理賠資料校正，並涵蓋業主與租屋者間的社會異質性。"
        },
        role: "lead",
        stack: ["Python", "Mesa", "GeoPandas", "PyMC"],
        tags: ["ABM", "Flood Risk", "Adaptation"],
        href: "https://github.com/WenyuChiou/FLOODABM",
        foot: { en: "github.com/WenyuChiou/FLOODABM", zh: "github.com/WenyuChiou/FLOODABM" }
      },
      {
        image: "assets/cat-framework-pipeline.png",
        category: "research",
        meta: { en: "Earthquake · 2025", zh: "地震災害 · 2025" },
        title: { en: "Cat Framework — FEMA Hazus 6.1", zh: "Cat Framework — FEMA Hazus 6.1" },
        tldr: {
          en: "FEMA Hazus 6.1 reimplemented for bridge damage — adds spatial interpolation + calibration the official tool lacks.",
          zh: "重新實作 FEMA Hazus 6.1 於橋樑震損；補上官方未開放的空間內插與校正步驟。"
        },
        desc: {
          en: "Modular catastrophe pipeline for earthquake-induced bridge damage, implementing FEMA Hazus 6.1 with spatial interpolation, calibration, and probabilistic risk assessment.",
          zh: "模組化地震災害模擬，聚焦橋樑震損估算；實作 FEMA Hazus 6.1 並加入空間內插、校正與機率風險評估。"
        },
        role: "lead",
        stack: ["Python", "GeoPandas", "SciPy", "QGIS"],
        tags: ["CAT Modeling", "FEMA Hazus"],
        href: "https://github.com/WenyuChiou/Cat_framework",
        foot: { en: "github.com/WenyuChiou/Cat_framework", zh: "github.com/WenyuChiou/Cat_framework" }
      },
      {
        image: "assets/groundwater.gif",
        category: "research",
        meta: { en: "M.S. Thesis · 2023", zh: "碩士論文 · 2023" },
        title: { en: "Submarine Groundwater Discharge — Taoyuan", zh: "桃園台地海底地下水潛流模擬" },
        tldr: {
          en: "3D coastal aquifer flow + salinity simulation, integrating ERT survey with field observations.",
          zh: "結合 ERT 探勘與現地觀測，建立 3D 沿海含水層流場與鹽度模型。"
        },
        desc: {
          en: "3D numerical simulation of coastal aquifer flow and salinity dynamics, integrating electrical resistivity tomography with field observations across the Taoyuan Tableland.",
          zh: "結合電阻率層析成像與現地觀測，模擬桃園台地沿海含水層流場與鹽度動態的 3D 數值模型。"
        },
        role: "lead",
        stack: ["MATLAB", "MODFLOW", "Python", "ERT"],
        tags: ["Hydrology", "SGD"],
        href: "https://github.com/WenyuChiou",
        foot: { en: "NCU · 2021–2023 · Thesis archive", zh: "中央大學 · 2021–2023 · 論文存檔" }
      },
      {
        image: "assets/ai-research-skills-preview.jpg",
        category: "workflow",
        stars: 82,
        meta: { en: "Claude Code marketplace · 2026", zh: "Claude Code 市集 · 2026" },
        title: { en: "AI Research Skills — Claude Code Marketplace", zh: "AI Research Skills — Claude Code 市集" },
        tldr: {
          en: "5-plugin Claude Code marketplace · 14 skills from literature triage to manuscript writing.",
          zh: "5-plugin Claude Code 市集，14 個 skill 覆蓋文獻分流到論文撰寫。"
        },
        desc: {
          en: "Productizing the research workflow as composable AI infrastructure. A 5-plugin Claude Code marketplace shipping 14 skills that cover literature triage → research design → project context → manuscript writing → multi-LLM delegation. One command installs everything; works alongside Codex CLI, Gemini CLI, Cursor, or any host that loads SKILL.md.",
          zh: "把研究工作流產品化成可組合的 AI 基礎設施。5-plugin 的 Claude Code 市集，14 個 skill 覆蓋文獻分流 → 研究設計 → 專案 context → 論文撰寫 → 多 LLM 委派的整條流水線。一條指令安裝完成；也支援 Codex CLI、Gemini CLI、Cursor 等任何能載入 SKILL.md 的 host。"
        },
        role: "lead",
        stack: ["Claude Code", "Marketplace", "MCP", "CLI"],
        tags: ["Skills", "Open Source"],
        href: "https://github.com/WenyuChiou/ai-research-skills",
        foot: { en: "github.com/WenyuChiou/ai-research-skills · ★ 82", zh: "github.com/WenyuChiou/ai-research-skills · ★ 82" }
      },
      {
        category: "workflow",
        stars: 59,
        meta: { en: "Claude Code skill · 2026", zh: "Claude Code 技能 · 2026" },
        title: { en: "codex-delegate — cost-aware multi-LLM routing", zh: "codex-delegate — 多 LLM 路由策略" },
        tldr: {
          en: "Claude plans + reviews, Codex executes the bulk — reusable cost-aware routing pattern.",
          zh: "Claude 規劃與審查、Codex 執行繁重任務；可複用的 cost-aware 路由。"
        },
        desc: {
          en: "A Claude Code skill that delegates token-heavy coding tasks to Codex CLI, then reconciles outputs back. Establishes a reusable cost-aware routing pattern: Claude plans + reviews, Codex executes the bulk. Validated across 3 production codebases.",
          zh: "Claude Code 技能：把繁重程式任務委派給 Codex CLI，再回收整合輸出。建立可複用的 cost-aware 路由模式——Claude 負責規劃與審查、Codex 處理大量執行。已在 3 個 production codebase 驗證。"
        },
        role: "lead",
        stack: ["Markdown", "Claude Code", "Codex CLI"],
        tags: ["Skills", "Multi-LLM"],
        href: "https://github.com/WenyuChiou/codex-delegate",
        foot: { en: "github.com/WenyuChiou/codex-delegate · ★ 59", zh: "github.com/WenyuChiou/codex-delegate · ★ 59" }
      },
      {
        category: "workflow",
        meta: { en: "Multi-agent orchestration · 2026", zh: "多代理協作 · 2026" },
        title: { en: "agent-collab-skills — orchestration primitives", zh: "agent-collab-skills — 協作元件" },
        tldr: {
          en: "Five primitives — task splitter · reconciler · debate · shared memory · acceptance gate.",
          zh: "五個協作元件——任務分派 · 結果整合 · 辯論 · 共享記憶 · 收斂閘。"
        },
        desc: {
          en: "Five composable skills that turn ad-hoc multi-agent runs into reproducible workflows: task splitter, output reconciler, debate, shared memory, acceptance gate. Sits on top of codex-delegate / gemini-delegate; emits structured artifacts other skills can consume.",
          zh: "五個可組合的協作元件，把零散的多代理執行變成可重現的工作流：task splitter、output reconciler、debate、shared memory、acceptance gate。建立在 codex-delegate / gemini-delegate 之上，產出其他 skill 可消費的結構化結果。"
        },
        role: "lead",
        stack: ["Markdown", "YAML", "Claude Code"],
        tags: ["Multi-Agent", "Skills"],
        href: "https://github.com/WenyuChiou/agent-collab-skills",
        foot: { en: "github.com/WenyuChiou/agent-collab-skills", zh: "github.com/WenyuChiou/agent-collab-skills" }
      },
      {
        image: "assets/awesome-agentic-ai-zh-preview.jpg",
        featured: true,
        category: "learning",
        stars: 1803,
        meta: { en: "Open source · Trending 2026", zh: "開源 · 2026 Trending" },
        title: { en: "awesome-agentic-ai-zh — 8-Stage Learning Roadmap", zh: "awesome-agentic-ai-zh — 8 階段學習地圖" },
        tldr: {
          en: "Trilingual 8-stage roadmap from LLM basics to multi-agent production · 240+ curated projects.",
          zh: "三語 8 階段路線圖，從 LLM 基礎到多代理 production · 240+ curated projects。"
        },
        desc: {
          en: "Bridging the agentic AI knowledge gap for the bilingual community. An 8-stage trilingual learning roadmap (zh-TW canonical · zh-CN · English) from LLM basics to multi-agent production. 240+ curated projects, hands-on exercises per stage, 2 tracks (CLI Power User · Agent Builder), 5 audience-segmented branches. ★ 1.8k and 200+ forks across a growing bilingual community.",
          zh: "為中文社群彌合 agentic AI 知識落差。8 階段三語學習地圖 (zh-TW canonical · zh-CN · English)，從 LLM 基礎一路到多代理 production。240+ curated projects、每階段都有 hands-on 練習、2 條學習軌 (CLI Power User · Agent Builder)、5 條依使用者分流的延伸路線。★ 1.8k、200+ forks，社群持續成長中。"
        },
        role: "lead",
        stack: ["Markdown", "mdBook", "GitHub Pages", "Python"],
        tags: ["Open Source", "Curriculum", "Community"],
        href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh",
        foot: { en: "github.com/WenyuChiou/awesome-agentic-ai-zh · ★ 1.8k · trilingual", zh: "github.com/WenyuChiou/awesome-agentic-ai-zh · ★ 1.8k · 三語" }
      },
    ],
    categories: {
      research: {
        label: { en: "Research", zh: "研究專案" },
        sub:   { en: "Models, frameworks, peer-reviewed", zh: "模型 · 框架 · 同儕審查" }
      },
      workflow: {
        label: { en: "AI Workflow & Skills", zh: "AI 工作流 · Skills" },
        sub:   { en: "Production tooling, marketplaces, multi-LLM patterns", zh: "產品級工具 · 市集 · 多 LLM 模式" }
      },
      learning: {
        label: { en: "Learning & Community", zh: "學習資源 · 社群" },
        sub:   { en: "Curricula, open-source bilingual", zh: "課程 · 雙語開源" }
      },
    },
  },

  pubs: {
    num: "06",
    kicker: { en: "Publications & Posters", zh: "論文與會議海報" },
    intro: { en: "Peer-reviewed papers, conference posters and selected preprints. Highlighted names are mine.", zh: "已發表論文、會議海報與精選預印本；標黃為本人。" },
    items: [
      {
        title: { en: "Modeling Long-Term Household Flood Adaptation under Social Heterogeneity: A Coupled Agent-Based Modeling Framework", zh: "社會異質性下的家戶長期洪水調適建模：耦合式智能體框架" },
        authors: "Chiou, W.-Y., et al.",
        venue: "AGU Fall Meeting",
        venue_short: "AGU '25",
        year: "2025",
        type: "poster",
        featured: true,
        doi: "10.1002/essoar.2025.NH41E-0449",
        abstract: { en: "Couples a multilevel agent-based model with a catastrophe model (exposure · hazard · vulnerability · finance) to simulate long-term household flood adaptation across census tracts of the Passaic River Basin (Essex, Morris & Passaic Counties). Owners and renters choose insurance, elevation, buyout or relocation through a Bayesian decision model driven by threat/coping/stakeholder perceptions and tract-level social heterogeneity, with 2011–2023 peak flood depths from the 1K-DHM distributed hydrologic model. Adaptation yields a 35% payout advantage for owners and 43% for renters, with renters shifting toward relocation over time.", zh: "將多層級智能體模型 (ABM) 與災害模型（暴險 · 危害 · 脆弱度 · 財務）耦合，模擬 Passaic 流域（Essex、Morris、Passaic 三郡）各普查區的家戶長期洪水調適。屋主與租客依威脅／因應／利害關係人感知與普查區社會異質性，透過貝氏決策模型選擇投保、墊高、買斷或搬遷；危害以 1K-DHM 分布式水文模型的 2011–2023 尖峰淹水深度驅動。調適為屋主帶來 35%、租客 43% 的理賠優勢，租客並隨時間轉向搬遷。" },
      },
      {
        title: { en: "Integrating Electrical Resistivity Tomography, Field Observations, and Numerical Simulations to Investigate Submarine Groundwater Discharge of the Taoyuan Tableland, Taiwan", zh: "以電阻率層析成像、現地觀測與數值模擬探討桃園台地之海底地下水潛流動態" },
        authors: "Li, M.-H., Chiou, W.-Y., Chen, C.-C.",
        venue: "AGU Fall Meeting",
        venue_short: "AGU '23",
        year: "2023",
        type: "poster",
        abstract: { en: "Quantifies submarine groundwater discharge (SGD) along the Taoyuan coastline by integrating electrical resistivity tomography (ERT), water-quality and water-table observations, and coupled density-dependent flow-and-transport simulation. Estimates more than 0.5 Mt/day of fresh groundwater discharging to the sea, with a shallow clay layer retarding seawater intrusion while sustaining seaward freshwater outflow.", zh: "整合電阻率層析成像 (ERT)、水質與水位觀測，以及密度相依的耦合流動—傳輸模擬，量化桃園海岸的海底地下水潛流 (SGD)；估計每日逾 0.5 Mt 淡水向海洋潛流，並發現淺層黏土層延緩海水入侵、同時維持向海的淡水外流。" },
      },
      {
        title: { en: "Long-term variation of water isotope composition in Feitsui Reservoir", zh: "翡翠水庫水體同位素組成的長期變化" },
        authors: "Chiou, W.-Y., et al.",
        venue: "Academia Sinica — IES Summer Research",
        venue_short: "IES '20",
        year: "2020",
        type: "report",
        abstract: { en: "A biweekly δ18O/δ2H record of Feitsui Reservoir (Sep 2014 – May 2019), analyzed with EEMD. The seasonal isotope cycle (continental-moisture winters, tropical-moisture summers) is clear until early 2017 then vanishes, while a multi-year deuterium-excess cycle mirrors Taipei rainwater and tracks ENSO.", zh: "翡翠水庫 2014/9–2019/5 的雙週 δ18O/δ2H 同位素觀測，以 EEMD 分析；水同位素季節循環（冬季偏陸源、夏季偏熱帶水氣）在 2017 年初前清楚、之後消失，而 d-excess 的多年週期與台北雨水一致，歸因於 ENSO。" },
      },
      {
        title: { en: "Seasonal variations of water and energy budget of evergreen broad-leaved forest in central Taiwan", zh: "台灣中部常綠闊葉林之水量與能量收支季節變化" },
        authors: "Chiou, W.-Y., et al.",
        venue: "Journal of Taiwan Agricultural Engineering",
        venue_short: "JTAE",
        year: "2021",
        type: "journal",
        quartile: "Q3",
        abstract: { en: "Uses 2010–2020 eddy-covariance flux and micrometeorological observations at the Lianhuachi station to contrast dry- and wet-season water and energy budgets of a central-Taiwan evergreen broad-leaved forest. Classifying seasons by the 3-month Standardized Precipitation Index (SPI3), it finds the forest sustains evapotranspiration from soil moisture through mild-to-moderate drought.", zh: "以蓮華池站 2010–2020 年渦度共變通量與微氣象觀測，比較台灣中部常綠闊葉林乾、濕季的水與能量收支；以三個月標準化降水指數 (SPI3) 分類季節，發現森林在輕至中度乾旱期間仍能由土壤水分支撐蒸發散。" },
      },
    ]
  },

  repos: {
    num: "07",
    kicker: { en: "Open Source", zh: "開源專案" },
    intro: { en: "Curated repositories from github.com/WenyuChiou — research code, AI-agent skills, and trading infrastructure.", zh: "自 github.com/WenyuChiou 精選——研究程式碼、AI 代理技能包與交易系統。" },
    items: [
      { name: "awesome-agentic-ai-zh", desc: { en: "Trilingual 8-stage learning roadmap for agentic AI — 240+ curated projects, hands-on exercises per stage, 2 tracks, 5 audience-segmented branches.", zh: "三語 8 階段 agentic AI 學習地圖——240+ curated projects、每階段 hands-on 練習、2 條學習軌、5 條依使用者分流的延伸路線。" }, lang: "Markdown", color: "oklch(0.55 0.18 280)", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh", stars: 1803, forks: 206, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "ai-research-skills", desc: { en: "5-plugin Claude Code marketplace — 14 research skills, one-command install, bilingual.", zh: "5-plugin Claude Code 市集——14 個研究 skill、一條指令安裝、中英雙語。" }, lang: "TypeScript", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/ai-research-skills", stars: 82, forks: 6, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "codex-delegate", desc: { en: "Claude Code skill — delegate token-heavy coding to Codex CLI; cost-aware routing pattern.", zh: "Claude Code 技能：將繁重程式任務委派給 Codex CLI；建立 cost-aware 路由模式。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/codex-delegate", stars: 59, forks: 5, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "gemini-delegate-skill", desc: { en: "Claude Code skill — delegate large-context synthesis & CJK long-form drafting to Gemini CLI.", zh: "Claude Code 技能：將大 context 統整與中日韓長文撰寫委派給 Gemini CLI。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/gemini-delegate-skill", stars: 37, forks: 9, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "zotero-skills", desc: { en: "Programmatic Zotero skills — search, add, classify, annotate references via Claude Code.", zh: "Zotero 程式化技能：透過 Claude Code 搜尋、新增、分類、註解文獻。" }, lang: "TypeScript", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/zotero-skills", stars: 25, forks: 3, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "research-hub", desc: { en: "AI-operable research workspace integrating Zotero + Obsidian + NotebookLM via CLI / MCP / REST.", zh: "AI 可操作的研究 workspace，整合 Zotero + Obsidian + NotebookLM，提供 CLI / MCP / REST 介面。" }, lang: "TypeScript", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/research-hub", stars: 19, forks: 3, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "agent-collab-skills", desc: { en: "Multi-agent orchestration primitives — task splitter, output reconciler, debate, shared memory, acceptance gate.", zh: "多代理協作元件——task splitter、output reconciler、debate、shared memory、acceptance gate。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/agent-collab-skills", stars: 2, forks: 1, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "academic-writing-skills", desc: { en: "Findings-first paper writing skill — banned-word audits, figure-text consistency, submission checklists.", zh: "以 findings-first 為核心的論文寫作 skill——banned-word 稽核、圖文一致性、投稿 checklist。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/academic-writing-skills", stars: 5, forks: 1, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "FLOODABM", desc: { en: "Coupled ABM × catastrophe model — household flood adaptation (Passaic NJ, 2011–2023). AGU 2025 poster.", zh: "智能體 × 災害模型耦合：家戶洪水調適 (NJ Passaic 2011–2023)。AGU 2025 poster。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/FLOODABM", stars: 0, forks: 0, updated: { en: "Mar 2026", zh: "2026.03" }, status: "active" },
      { name: "WAGF", desc: { en: "Water Agent Governance Framework — first 6-stage validation pipeline catching Logic-Action Gap failures in LLM agents.", zh: "水資源代理治理框架——首套 6 階段驗證管線，攔截 LLM 智能體的「邏輯—行動落差」失敗。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/WAGF", stars: 0, forks: 0, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "Cat_framework", desc: { en: "FEMA Hazus 6.1 re-implementation for earthquake-induced bridge damage — adds spatial-interpolation + calibration the official tool doesn't expose.", zh: "FEMA Hazus 6.1 重新實作於地震震損橋樑——加入官方工具未開放的空間內插與校正步驟。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/Cat_framework", stars: 0, forks: 0, updated: { en: "Oct 2025", zh: "2025.10" }, status: "active" },
      { name: "moodring", desc: { en: "Daily sentiment scoring across 5 equity markets (US/TW/JP/KR/EU).", zh: "五大股市的每日情緒評分 (美/台/日/韓/歐)。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/moodring", stars: 10, forks: 5, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "multi-analyst-desk", desc: { en: "4 AI specialists + chief strategist for ETF options; bilingual reports.", zh: "四位 AI 分析師 + 首席策略師組成的 ETF 選擇權交易桌，雙語報告。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/multi-analyst-desk", stars: 0, forks: 0, updated: { en: "Oct 2025", zh: "2025.10" }, status: "archived" },
      { name: "ai-trader-ollama", desc: { en: "Autonomous trading system with multiple specialized AI agents and RAG memory.", zh: "多位專門化 AI 代理 + RAG 記憶的自主交易系統。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/ai-trader-ollama", stars: 0, forks: 0, updated: { en: "Sep 2025", zh: "2025.09" }, status: "archived" },
      { name: "session-sweep", desc: { en: "Claude Code plugin — clean stale git worktrees, reclaim disk.", zh: "Claude Code 外掛：清理 stale git worktrees、回收磁碟空間。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/session-sweep", stars: 0, forks: 0, updated: { en: "Nov 2025", zh: "2025.11" }, status: "active" },
      { name: "Event-Driven-Strategy", desc: { en: "ML trading inspired by hydraulic-jump fluid dynamics — detects market reversal events.", zh: "以水躍 (hydraulic jump) 流體力學啟發的機器學習交易策略——偵測市場反轉。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/Event-Driven-Strategy", stars: 0, forks: 0, updated: { en: "Jul 2024", zh: "2024.07" }, status: "archived" },
    ]
  },



  industry: {
    hero: {
      eyebrow: {
        en: ["AI Agent Engineer", "Water × LLM × Risk", "Available Summer 2027"],
        zh: ["AI 代理工程師", "水資源 × LLM × 風險", "2027 夏實習開放中"]
      },
      h1: {
        en: { a: "I build", b: "LLM-agent systems", c: "for water & climate risk —", d: "flood, reservoir, irrigation, catastrophe modeling." },
        zh: { a: "我打造", b: "LLM 代理系統", c: "處理水資源與氣候風險——", d: "洪水、水庫、灌溉、災害建模。" }
      },
      lede: {
        en: "Ph.D. researcher at Lehigh turning multi-agent systems coupled with catastrophe models into production-ready frameworks. I work where human decisions meet the physical environment — and LLMs now stand in for the humans.",
        zh: "我是 Lehigh 博士候選人，將多智能體系統與災害模型耦合，轉為可落地的生產框架。研究方向在「人與環境的互動」—— 而現在 LLM 代理扮演了人的角色。"
      },
      cta_primary: { en: "Email", zh: "來信" },
      cta_linkedin: { en: "LinkedIn DM", zh: "LinkedIn 私訊" },
      currently: {
        label: { en: "Currently shipping", zh: "目前開發中" },
        items: [
          { dot: "oklch(0.62 0.16 150)", text: { en: "Multi-agent flood-catastrophe framework (Lehigh research)", zh: "多智能體洪水—災害耦合框架 (Lehigh 研究)" } },
          { dot: "oklch(0.65 0.15 240)", text: { en: "WAGF — LLM agent governance framework (open source)", zh: "WAGF — LLM 代理治理框架（開源）" } },
          { dot: "oklch(0.70 0.14 60)", text: { en: "Open to 2027 ML/AI engineer internships — US & remote", zh: "2027 ML/AI 工程師實習開放中 — 美國/遠端" } }
        ]
      }
    },
    skills: {
      intro: { en: "The stack I actually ship in.", zh: "我真正拿來交付產品的技術棧。" },
      cats: [
        {
          icon: "ai",
          name: { en: "Agentic Systems & LLMs", zh: "代理系統與 LLM" },
          items: ["LLM Agents", "Multi-Agent Orchestration", "LangGraph", "MCP", "Claude / GPT-5 / Gemini", "Prompt Engineering", "RAG", "World Models"]
        },
        {
          icon: "code",
          name: { en: "Production ML & Engineering", zh: "生產級 ML 與工程" },
          items: ["Python", "PyTorch", "scikit-learn", "NumPy / pandas", "FastAPI", "Docker", "Git / CI-CD", "AWS"]
        },
        {
          icon: "data",
          name: { en: "Data, Geo & Simulation", zh: "資料 · 地理 · 模擬" },
          items: ["GeoPandas", "QGIS / ArcGIS", "Mesa (ABM)", "MODFLOW", "Monte Carlo", "Bayesian Inference (PyMC)"]
        },
        {
          icon: "brain",
          name: { en: "Domain — Water & Catastrophe", zh: "領域 — 水資源與災害" },
          items: ["Flood Risk", "Reservoir Modeling", "Irrigation / SGD", "FEMA Hazus 6.1", "Hydrology", "Climate Adaptation", "Insurance & Resilience"]
        },
        {
          icon: "flow",
          name: { en: "AI-Native Workflows", zh: "AI 原生工作流" },
          items: ["Claude Code", "Cursor", "Codex CLI", "Gemini CLI", "Agent Skills Development", "MCP Servers"]
        },
      ]
    }
  },

  contact: {
    num: "09",
    kicker: { en: "Contact", zh: "聯絡" },
    title: { en: "Let's build something thoughtful.", zh: "一起做點有意義的研究吧。" },
    body: {
      en: "I'm open to research collaborations, Summer 2027 ML / AI engineer internships, and conversations about LLM agents, agent safety, decision science, or catastrophe modeling.",
      zh: "歡迎研究合作、2027 暑期 ML / AI engineer 實習邀請，以及關於 LLM 代理、代理安全、決策科學或災害建模的討論。"
    },
    email_label: { en: "Email", zh: "來信" },
    github_label: { en: "GitHub", zh: "GitHub" },
    linkedin_label: { en: "LinkedIn", zh: "LinkedIn" },
    orcid_label: { en: "ORCID", zh: "ORCID" },
  },

  footer: {
    copy: { en: "© 2026 Wenyu Chiou · Lehigh University", zh: "© 2026 邱文昱 · Lehigh University" },
    note: { en: "Hydrology × AI × Decision Science", zh: "水文 × AI × 決策科學" }
  }
};
window.CONTENT = CONTENT;
