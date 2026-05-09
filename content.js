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
      en: "Advancing human-flood modeling from empirical foundations to LLM-based agent simulation. Open-source maintainer of agentic AI infrastructure — a 7-stage trilingual roadmap (★ 519 in week one) and 7+ Claude Code skills.",
      zh: "推進「人—洪水」建模——從實證基礎到 LLM 驅動的智能體模擬。同時是開源 agentic AI 基礎設施的維護者：7 階段三語學習地圖（首週 ★ 519）與 7+ 個 Claude Code skills。"
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

  marquee: {
    en: ["Agent-Based Modeling", "LLM Agents", "Catastrophe Modeling", "Flood Adaptation", "Bayesian Inference", "Hydrology", "Resilience", "Decision under Risk", "Multi-Agent Systems"],
    zh: ["智能體模擬", "LLM 代理", "災害建模", "洪水調適", "貝氏推論", "水文學", "韌性分析", "風險下的決策", "多代理系統"]
  },

  about: {
    num: "01",
    kicker: { en: "About", zh: "關於" },
    p1: {
      en: "I am a Ph.D. Candidate at Lehigh University's Department of Civil & Environmental Engineering, and a member of the Center for Catastrophe Modeling and Resilience. My research advances human-flood modeling — from empirical foundations grounded in catastrophe simulation to LLM agents that emulate household decision-making under climate risk.",
      zh: "我是美國 Lehigh University 土木與環境工程系的博士候選人，隸屬於災害建模與韌性中心 (Center for Catastrophe Modeling and Resilience)。我的研究在推進「人—洪水」建模：從以災害模擬為基礎的實證方法，發展到以 LLM 智能體模擬家戶在氣候風險下的決策行為。"
    },
    p2: {
      en: "Beyond the dissertation, I build open-source agentic AI infrastructure for the research community: a 7-stage trilingual learning roadmap (awesome-agentic-ai-zh, ★ 519 in week one), a 5-plugin Claude Code marketplace covering literature triage to manuscript writing (ai-research-skills), and skills for multi-LLM delegation, multi-agent orchestration, and academic writing.",
      zh: "博士論文之外，我為研究社群打造開源 agentic AI 基礎設施：7 階段三語學習地圖 (awesome-agentic-ai-zh，首週 ★ 519)、涵蓋文獻分流到論文寫作的 5-plugin Claude Code 市集 (ai-research-skills)，以及多 LLM 委派、多代理協作、學術寫作等 skills。"
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
          en: "Advancing human-flood modeling from empirical loss estimation to behavioral agent simulation. First to couple FEMA Hazus 6.1 with an agent-based model of household-level adaptation decisions, calibrated against 12 years of NJ Passaic survey + claims data (2011–2023). Concurrently developing the governance and safety layer for LLM agents in high-stakes simulations (WAGF, paper in progress).",
          zh: "推進「人—洪水」建模：從以實證損失估算為基礎，發展至行為層級的智能體模擬。首度將 FEMA Hazus 6.1 與家戶調適決策的智能體模型耦合，並以紐澤西 Passaic 流域 12 年 (2011–2023) 的調查與保險理賠資料校正。同時開發 LLM 智能體在高風險模擬中的治理與安全機制 (WAGF，論文撰寫中)。"
        },
        tags: ["ABM", "Flood Risk", "Resilience", "LLM Agents"]
      },
      {
        date: { en: "Jan 2024 — Jun 2024", zh: "2024.01 — 2024.06" },
        role: { en: "Research Assistant", zh: "研究助理" },
        org:  { en: "National Central University", zh: "國立中央大學" },
        desc: {
          en: "Developed 3D groundwater flow simulation models for coastal aquifer systems and established Nature-Based Solutions (NBS) assessment indicators.",
          zh: "開發沿海含水層 3D 地下水模擬模型，建立以自然為本解方 (NBS) 的評估指標。"
        },
        tags: ["Groundwater", "NBS", "Modeling"]
      },
      {
        date: { en: "Jul 2022 — Aug 2022", zh: "2022.07 — 2022.08" },
        role: { en: "Summer Intern", zh: "暑期實習" },
        org:  { en: "NCDR (National Science and Technology Center for Disaster Reduction)", zh: "國家災害防救科技中心 (NCDR)" },
        desc: {
          en: "Conducted research on climate change adaptation strategies and disaster risk reduction.",
          zh: "進行氣候變遷調適策略與災害風險減輕之研究。"
        },
        tags: ["Climate Adaptation", "Disaster Risk"]
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
        image: "assets/agu2025-poster.jpg",
        featured: true,
        meta: { en: "AGU 2025 · Poster NH41E-0449", zh: "AGU 2025 · 海報 NH41E-0449" },
        title: { en: "Agent-Based Flood Adaptation Model", zh: "家戶洪水調適智能體模型" },
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
        cover: "agentic",
        meta: { en: "Open source · Trending 2026", zh: "開源 · 2026 Trending" },
        title: { en: "awesome-agentic-ai-zh — 7-Stage Learning Roadmap", zh: "awesome-agentic-ai-zh — 7 階段學習地圖" },
        desc: {
          en: "Bridging the agentic AI knowledge gap for the bilingual community. A 7-stage trilingual learning roadmap (zh-TW canonical · zh-CN · English) from LLM basics to multi-agent production. 145+ curated projects, hands-on exercises per stage, 2 tracks (CLI Power User · Agent Builder), 5 audience-segmented branches. ★ 519 in week one with 3 community contributors.",
          zh: "為中文社群彌合 agentic AI 知識落差。7 階段三語學習地圖 (zh-TW canonical · zh-CN · English)，從 LLM 基礎一路到多代理 production。145+ curated projects、每階段都有 hands-on 練習、2 條學習軌 (CLI Power User · Agent Builder)、5 條依使用者分流的延伸路線。首週 ★ 519、3 位社群貢獻者。"
        },
        role: "lead",
        stack: ["Markdown", "mdBook", "GitHub Pages", "Python"],
        tags: ["Open Source", "Curriculum", "Community"],
        href: "https://wenyuchiou.github.io/awesome-agentic-ai-zh/",
        foot: { en: "Live preview: wenyuchiou.github.io/awesome-agentic-ai-zh · ★ 519 · trilingual", zh: "預覽：wenyuchiou.github.io/awesome-agentic-ai-zh · ★ 519 · 三語" }
      },
      {
        image: "assets/groundwater.gif",
        meta: { en: "M.S. Thesis · 2023", zh: "碩士論文 · 2023" },
        title: { en: "Submarine Groundwater Discharge — Taoyuan", zh: "桃園台地海底地下水潛流模擬" },
        desc: {
          en: "3D numerical simulation of coastal aquifer flow and salinity dynamics, integrating electrical resistivity tomography with field observations across the Taoyuan Tableland.",
          zh: "結合電阻率層析成像與現地觀測，模擬桃園台地沿海含水層流場與鹽度動態的 3D 數值模型。"
        },
        role: "lead",
        stack: ["MATLAB", "MODFLOW", "Python", "ERT"],
        tags: ["Hydrology", "SGD"],
        href: "https://github.com/WenyuChiou",
        foot: { en: "NCU · 2021–2023", zh: "中央大學 · 2021–2023" }
      },
      {
        cover: "wagf",
        meta: { en: "Research framework · 2025", zh: "研究框架 · 2025" },
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
        cover: "agentic",
        meta: { en: "Claude Code marketplace · 2026", zh: "Claude Code 市集 · 2026" },
        title: { en: "AI Research Skills — Claude Code Marketplace", zh: "AI Research Skills — Claude Code 市集" },
        desc: {
          en: "Productizing the research workflow as composable AI infrastructure. A 5-plugin Claude Code marketplace shipping 14 skills that cover literature triage → research design → project context → manuscript writing → multi-LLM delegation. One command installs everything; works alongside Codex CLI, Gemini CLI, Cursor, or any host that loads SKILL.md.",
          zh: "把研究工作流產品化成可組合的 AI 基礎設施。5-plugin 的 Claude Code 市集，14 個 skill 覆蓋文獻分流 → 研究設計 → 專案 context → 論文撰寫 → 多 LLM 委派的整條流水線。一條指令安裝完成；也支援 Codex CLI、Gemini CLI、Cursor 等任何能載入 SKILL.md 的 host。"
        },
        role: "lead",
        stack: ["Claude Code", "Marketplace", "MCP", "CLI"],
        tags: ["Skills", "Open Source"],
        href: "https://wenyuchiou.github.io/ai-research-skills/",
        foot: { en: "Live: wenyuchiou.github.io/ai-research-skills · ★ 61 · 5 plugins · 14 skills", zh: "預覽：wenyuchiou.github.io/ai-research-skills · ★ 61 · 5 個 plugin · 14 個 skill" }
      },
      {
        cover: "codex",
        meta: { en: "Earthquake · 2025", zh: "地震災害 · 2025" },
        title: { en: "Cat Framework — FEMA Hazus 6.1", zh: "Cat Framework — FEMA Hazus 6.1" },
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
    ],
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
        cites: 0,
        doi: "10.1002/essoar.2025.NH41E-0449",
        abstract: { en: "A coupled ABM + catastrophe-model framework simulating 13 years of household flood adaptation across 127,000 parcels in the Passaic River Basin (NJ). Captures social heterogeneity in risk perception, mitigation choices, and economic constraints.", zh: "耦合 ABM 與災害模型，模擬 Passaic 流域 127,000 戶家庭 13 年的洪水調適歷程，呈現風險感知、減災決策與經濟約束的社會異質性。" },
      },
      {
        title: { en: "Advancing Flood Risk Assessment", zh: "推進洪水風險評估方法" },
        authors: "Chiou, W.-Y., et al.",
        venue: "AGU Fall Meeting",
        venue_short: "AGU '24",
        year: "2024",
        type: "poster",
        cites: 2,
        abstract: { en: "Methodological review and proposal for integrating probabilistic flood hazard curves with behavioral response models.", zh: "整合機率洪水風險曲線與行為回應模型的方法論回顧與提案。" },
      },
      {
        title: { en: "Integrating Electrical Resistivity Tomography, Field Observations, and Numerical Simulations to Investigate Submarine Groundwater Discharge of the Taoyuan Tableland, Taiwan", zh: "以電阻率層析成像、現地觀測與數值模擬探討桃園台地之海底地下水潛流動態" },
        authors: "Chiou, W.-Y., et al.",
        venue: "AGU Fall Meeting",
        venue_short: "AGU '23",
        year: "2023",
        type: "poster",
        cites: 4,
        abstract: { en: "ERT + piezometer + MODFLOW triangulation to map SGD fluxes along the Taoyuan coastline. Reveals previously under-mapped freshwater discharge pathways.", zh: "結合 ERT、壓力計與 MODFLOW 三角驗證，繪製桃園海岸 SGD 通量分佈，揭示先前未識別的淡水潛流路徑。" },
      },
      {
        title: { en: "Long-term variation of water isotope composition in Feitsui Reservoir", zh: "翡翠水庫水體同位素組成的長期變化" },
        authors: "Chiou, W.-Y., et al.",
        venue: "Academia Sinica — IES Summer Research",
        venue_short: "IES '20",
        year: "2020",
        type: "report",
        cites: 1,
        abstract: { en: "Eight-year δ18O and δ2H record tracing reservoir mixing dynamics and climate-driven isotope excursions.", zh: "八年 δ18O 與 δ2H 觀測，追蹤水庫混合動態與氣候驅動的同位素變化。" },
      },
      {
        title: { en: "Seasonal variations of water and energy budget of evergreen broad-leaved forest in central Taiwan", zh: "台灣中部常綠闊葉林之水量與能量收支季節變化" },
        authors: "Chiou, W.-Y., et al.",
        venue: "Journal of Taiwan Agricultural Engineering",
        venue_short: "JTAE",
        year: "2020",
        type: "journal",
        quartile: "Q3",
        cites: 3,
        abstract: { en: "Eddy-covariance + sap-flow analysis of a subtropical evergreen forest; quantifies ET seasonality and canopy conductance response.", zh: "以渦度共變與莖流法分析亞熱帶常綠林,量化 ET 季節性與冠層導度響應。" },
      },
    ]
  },

  repos: {
    num: "07",
    kicker: { en: "Open Source", zh: "開源專案" },
    intro: { en: "Curated repositories from github.com/WenyuChiou — research code, AI-agent skills, and trading infrastructure.", zh: "自 github.com/WenyuChiou 精選——研究程式碼、AI 代理技能包與交易系統。" },
    items: [
      { name: "awesome-agentic-ai-zh", desc: { en: "Trilingual 7-stage learning roadmap for agentic AI — 145+ curated projects, hands-on exercises per stage, 2 tracks, 5 audience-segmented branches.", zh: "三語 7 階段 agentic AI 學習地圖——145+ curated projects、每階段 hands-on 練習、2 條學習軌、5 條依使用者分流的延伸路線。" }, lang: "Markdown", color: "oklch(0.55 0.18 280)", href: "https://github.com/WenyuChiou/awesome-agentic-ai-zh", stars: 519, forks: 34, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "ai-research-skills", desc: { en: "5-plugin Claude Code marketplace — 14 research skills, one-command install, bilingual.", zh: "5-plugin Claude Code 市集——14 個研究 skill、一條指令安裝、中英雙語。" }, lang: "TypeScript", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/ai-research-skills", stars: 61, forks: 1, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "codex-delegate", desc: { en: "Claude Code skill — delegate token-heavy coding to Codex CLI; cost-aware routing pattern.", zh: "Claude Code 技能：將繁重程式任務委派給 Codex CLI；建立 cost-aware 路由模式。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/codex-delegate", stars: 57, forks: 4, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "gemini-delegate-skill", desc: { en: "Claude Code skill — delegate large-context synthesis & CJK long-form drafting to Gemini CLI.", zh: "Claude Code 技能：將大 context 統整與中日韓長文撰寫委派給 Gemini CLI。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/gemini-delegate-skill", stars: 34, forks: 1, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "zotero-skills", desc: { en: "Programmatic Zotero skills — search, add, classify, annotate references via Claude Code.", zh: "Zotero 程式化技能：透過 Claude Code 搜尋、新增、分類、註解文獻。" }, lang: "TypeScript", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/zotero-skills", stars: 16, forks: 2, updated: { en: "Nov 2025", zh: "2025.11" }, status: "active" },
      { name: "research-hub", desc: { en: "AI-operable research workspace integrating Zotero + Obsidian + NotebookLM via CLI / MCP / REST.", zh: "AI 可操作的研究 workspace，整合 Zotero + Obsidian + NotebookLM，提供 CLI / MCP / REST 介面。" }, lang: "TypeScript", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/research-hub", stars: 14, forks: 3, updated: { en: "Dec 2025", zh: "2025.12" }, status: "active" },
      { name: "agent-collab-skills", desc: { en: "Multi-agent orchestration primitives — task splitter, output reconciler, debate, shared memory, acceptance gate.", zh: "多代理協作元件——task splitter、output reconciler、debate、shared memory、acceptance gate。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/agent-collab-skills", stars: 0, forks: 0, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "academic-writing-skills", desc: { en: "Findings-first paper writing skill — banned-word audits, figure-text consistency, submission checklists.", zh: "以 findings-first 為核心的論文寫作 skill——banned-word 稽核、圖文一致性、投稿 checklist。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/academic-writing-skills", stars: 2, forks: 0, updated: { en: "May 2026", zh: "2026.05" }, status: "active" },
      { name: "FLOODABM", desc: { en: "Coupled ABM × catastrophe model — household flood adaptation (Passaic NJ, 2011–2023). AGU 2025 poster.", zh: "智能體 × 災害模型耦合：家戶洪水調適 (NJ Passaic 2011–2023)。AGU 2025 poster。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/FLOODABM", stars: 0, forks: 0, updated: { en: "Dec 2025", zh: "2025.12" }, status: "active" },
      { name: "WAGF", desc: { en: "Water Agent Governance Framework — first 6-stage validation pipeline catching Logic-Action Gap failures in LLM agents.", zh: "水資源代理治理框架——首套 6 階段驗證管線，攔截 LLM 智能體的「邏輯—行動落差」失敗。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/WAGF", stars: 0, forks: 0, updated: { en: "Nov 2025", zh: "2025.11" }, status: "active" },
      { name: "Cat_framework", desc: { en: "FEMA Hazus 6.1 re-implementation for earthquake-induced bridge damage — adds spatial-interpolation + calibration the official tool doesn't expose.", zh: "FEMA Hazus 6.1 重新實作於地震震損橋樑——加入官方工具未開放的空間內插與校正步驟。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/Cat_framework", stars: 0, forks: 0, updated: { en: "Oct 2025", zh: "2025.10" }, status: "active" },
      { name: "moodring", desc: { en: "Daily sentiment scoring across 5 equity markets (US/TW/JP/KR/EU).", zh: "五大股市的每日情緒評分 (美/台/日/韓/歐)。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/moodring", stars: 9, forks: 1, updated: { en: "Aug 2025", zh: "2025.08" }, status: "active" },
      { name: "multi-analyst-desk", desc: { en: "4 AI specialists + chief strategist for ETF options; bilingual reports.", zh: "四位 AI 分析師 + 首席策略師組成的 ETF 選擇權交易桌，雙語報告。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/multi-analyst-desk", stars: 0, forks: 0, updated: { en: "Oct 2025", zh: "2025.10" }, status: "archived" },
      { name: "ai-trader-ollama", desc: { en: "Autonomous trading system with multiple specialized AI agents and RAG memory.", zh: "多位專門化 AI 代理 + RAG 記憶的自主交易系統。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/ai-trader-ollama", stars: 0, forks: 0, updated: { en: "Sep 2025", zh: "2025.09" }, status: "archived" },
      { name: "session-sweep", desc: { en: "Claude Code plugin — clean stale git worktrees, reclaim disk.", zh: "Claude Code 外掛：清理 stale git worktrees、回收磁碟空間。" }, lang: "Markdown", color: "oklch(0.55 0.18 220)", href: "https://github.com/WenyuChiou/session-sweep", stars: 0, forks: 0, updated: { en: "Nov 2025", zh: "2025.11" }, status: "active" },
      { name: "Event-Driven-Strategy", desc: { en: "ML trading inspired by hydraulic-jump fluid dynamics — detects market reversal events.", zh: "以水躍 (hydraulic jump) 流體力學啟發的機器學習交易策略——偵測市場反轉。" }, lang: "Python", color: "oklch(0.55 0.18 250)", href: "https://github.com/WenyuChiou/Event-Driven-Strategy", stars: 0, forks: 0, updated: { en: "Jul 2024", zh: "2024.07" }, status: "archived" },
    ]
  },

  linkedin: {
    num: "08",
    kicker: { en: "On LinkedIn", zh: "LinkedIn 動態" },
    intro: {
      en: "Recent notes on my research, AI-native workflows and what I'm building. Full feed on LinkedIn.",
      zh: "關於研究進展、AI 原生工作流與正在打造的東西的近期筆記。完整動態請至 LinkedIn。"
    },
    profile_url: "https://www.linkedin.com/in/wenyu-chiou",
    items: [
      {
        tag: { en: "Research", zh: "研究" },
        date: { en: "Dec 2025", zh: "2025.12" },
        title: { en: "Presenting at AGU Fall Meeting — Poster NH41E-0449", zh: "AGU 年會現場 · 海報 NH41E-0449" },
        excerpt: {
          en: "Sharing our coupled ABM × catastrophe framework for long-term household flood adaptation under social heterogeneity. New Orleans was wonderful — grateful for every conversation at the poster.",
          zh: "在 AGU 分享我們的耦合式 ABM × 災害模擬框架，聚焦家戶長期洪水調適與社會異質性。紐奧良非常棒，感謝每一位在海報前駐足討論的朋友。"
        },
        reactions: 142,
        comments: 18,
      },
      {
        tag: { en: "AI Workflows", zh: "AI 工作流" },
        date: { en: "Nov 2025", zh: "2025.11" },
        title: { en: "Why I built codex-delegate for Claude Code", zh: "為什麼我為 Claude Code 寫了 codex-delegate" },
        excerpt: {
          en: "A small Claude Code skill that hands token-heavy coding off to Codex or Gemini CLI — so the main agent stays fresh for reasoning while the grunt work runs elsewhere.",
          zh: "一個小小的 Claude Code 技能，把繁重的程式任務委派給 Codex 或 Gemini CLI——讓主代理保留給推理，粗活交給別人去跑。"
        },
        reactions: 96,
        comments: 11,
      },
      {
        tag: { en: "Thought", zh: "觀點" },
        date: { en: "Oct 2025", zh: "2025.10" },
        title: { en: "Bounded rationality is a prompt, not a personality", zh: "有限理性是一段 prompt，而不是一種人格" },
        excerpt: {
          en: "Asking an LLM to \"act as a rational human\" misses the point. A research-grade bounded-rational agent is about constraints, memory and feedback — not vibes.",
          zh: "要求 LLM「扮演理性人」抓不到重點。研究等級的有限理性代理，重點在於限制、記憶與回饋，而不是感覺。"
        },
        reactions: 214,
        comments: 32,
      },
      {
        tag: { en: "Open Source", zh: "開源" },
        date: { en: "Sep 2025", zh: "2025.09" },
        title: { en: "WAGF v1 — closing the Logic-Action Gap in LLM agents", zh: "WAGF v1 發布 · 彌合 LLM 代理的邏輯與行動落差" },
        excerpt: {
          en: "Released the Water Agent Governance Framework — lets LLM agents act as bounded-rational humans while keeping behavioral diversity across a population.",
          zh: "WAGF（水資源代理治理框架）v1 釋出——讓 LLM 代理能以有限理性扮演人類，同時保留群體間的行為多樣性。"
        },
        reactions: 187,
        comments: 24,
      },
    ]
  },

  blog: {
    num: "09",
    kicker: { en: "Writing", zh: "文章" },
    intro: { en: "Short essays on decision science, agent-based modeling and the craft of research engineering.", zh: "關於決策科學、智能體模擬與研究工程手藝的短文。" },
    items: [
      {
        cover: "essay1",
        meta: { en: "Essay · 8 min read", zh: "長文 · 閱讀 8 分鐘" },
        title: { en: "Bounded rationality is a prompt, not a personality", zh: "有限理性是一段 prompt，而不是一種人格" },
        excerpt: { en: "Why asking an LLM to 'act as a rational human' misses the point — and what a research-grade bounded-rational agent actually looks like.", zh: "為什麼要求 LLM「扮演理性人」會抓不到重點——以及研究等級的有限理性代理應該長什麼樣。" }
      },
      {
        cover: "essay2",
        meta: { en: "Notes · 5 min read", zh: "筆記 · 閱讀 5 分鐘" },
        title: { en: "Coupling hazard models with agents, in practice", zh: "把災害模型和智能體耦合起來：實務筆記" },
        excerpt: { en: "A field report on the interfaces, timestep tricks and calibration loops that make hybrid simulations usable.", zh: "一份實地報告——關於讓混合模擬真正可用的介面設計、時間步技巧與校正迴圈。" }
      },
      {
        cover: "essay3",
        meta: { en: "Tools · 6 min read", zh: "工具 · 閱讀 6 分鐘" },
        title: { en: "Agentic workflows for solo researchers", zh: "單打獨鬥研究者的代理工作流" },
        excerpt: { en: "The three small agents I wrote this year that, together, replaced a research-assistant team I never had the budget for.", zh: "我今年寫的三個小代理——它們加起來，取代了我從來請不起的研究助理團隊。" }
      },
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
