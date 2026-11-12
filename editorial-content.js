export const EDITORIAL = {
  en: {
    updatesEyebrow: "Public updates", updatesTitle: "Ideas shared in public",
    updatesIntro: "Selected posts I shared on LinkedIn, with links to the original context.",
    publicNotes: "Selected public notes", originalPost: "Read on LinkedIn", allPosts: "More on LinkedIn",
    observatoryLabel: "Decision Observatory", observatoryTitle: "Follow the evidence behind a decision.",
    observatoryIntro: "Two applications, one method: compare with human evidence, check the proposal, and inspect what changes. Select an object or a step to follow its source.",
    researchLinks: [{ label: "Research directions", href: "/research/" }, { label: "Publications & talks", href: "/publications/" }],
    methodLabel: "Methods", limitsLabel: "Boundaries", contributionLabel: "How I approached it", outcomeLabel: "What it contributes",
    contexts: [
      { title: "People and their environment", text: "Human surveys inform behavioral models; simulated households make adaptation choices under flood and resource constraints.", href: "/work/floodabm/" },
      { title: "Evidence-linked scientific work", text: "AI research agents handle literature and tasks. I build tools that make sources, validation checks, and workflow state inspectable.", href: "https://github.com/WenyuChiou/research-hub" },
    ],
    distinction: "Human respondents provide evidence. Simulated household agents and AI research agents are models and software, not people. These projects share a research approach, not one integrated published system.",
    limits: {
      "human-grounded-llm-evaluation": "The interactive examples use synthetic records, not individual survey responses or research results.",
      floodabm: "Simulated household agents model adaptation; they are not an integrated LLM system.",
    },
    aboutLink: "More about my research path", portraitAlt: "Portrait of Wenyu Chiou",
    chain: {
      label: "Research questions", feedback: "A loop: effects feed into the next decision", cta: "Follow one decision",
      steps: [
        { id: "evidence", label: "Human data", text: "Surveys measure what shapes decisions" },
        { id: "decision", label: "Coupled model", text: "How do LLM agents act in an environment?" },
        { id: "validation", label: "Evaluate and validate", text: "Do their decisions match human evidence and pass checks?" },
        { id: "consequence", label: "Coupled effects", text: "What does their interaction change over time?" },
      ],
    },
    roles: {
      title: "Four roles, kept apart",
      note: "These projects share a research approach, not one integrated published system.",
      items: [
        { id: "respondent", colorRole: "human", name: "Human respondents", text: "Real people whose survey answers provide the human evidence." },
        { id: "household", colorRole: "environment", name: "Simulated household agents", text: "Model households that make adaptation choices in FLOODABM; they are not people and not an LLM system." },
        { id: "llm", colorRole: "model", name: "LLM decision agents", text: "Language models that answer survey questions or propose actions. I compare their answers with human evidence (manuscript in preparation) and, in WAGF (in development), check proposals before a simulation changes." },
        { id: "research", colorRole: "context", name: "AI research agents", text: "Software that handles literature and tasks, while sources, checks, and workflow state stay inspectable." },
      ],
    },
    whyLabel: "Why", howLabel: "How", contributionShortLabel: "Contribution", sourceLabel: "Public source", expandLabel: "Methods and boundaries",
  },
  "zh-TW": {
    updatesEyebrow: "公開近況", updatesTitle: "我在公開交流的想法",
    updatesIntro: "精選我在 LinkedIn 分享的貼文，保留原文連結與完整脈絡。",
    publicNotes: "精選公開貼文", originalPost: "閱讀 LinkedIn 原文", allPosts: "更多 LinkedIn 貼文",
    observatoryLabel: "決策觀測台", observatoryTitle: "沿著證據，理解每個決策。",
    observatoryIntro: "兩種應用共用同一方法：對照人類證據、檢查提案，再追蹤改變了什麼。選擇圖中物件或階段，即可查看其來源。",
    researchLinks: [{ label: "研究方向", href: "/research/" }, { label: "著作與演講", href: "/publications/" }],
    methodLabel: "方法", limitsLabel: "範圍與限制", contributionLabel: "我如何處理", outcomeLabel: "帶來什麼貢獻",
    contexts: [
      { title: "人與環境的互動", text: "以真人問卷建立行為模型，讓模擬家戶在洪災與資源限制下做出調適選擇。", href: "/work/floodabm/" },
      { title: "有證據鏈的科研工作", text: "科研 AI 代理協助處理文獻與任務；我建立能檢視來源、驗證關卡與工作狀態的工具。", href: "https://github.com/WenyuChiou/research-hub" },
    ],
    distinction: "真實受訪者提供人類證據；模擬家戶代理與科研 AI 代理則是模型與軟體，不是真人。這些專案共用研究方法，不代表已整合成同一套發表系統。",
    limits: {
      "human-grounded-llm-evaluation": "互動示例使用合成紀錄，不是個別受訪者資料或研究結果。",
      floodabm: "家戶代理模擬調適行為，不是已整合 LLM 的系統。",
    },
    aboutLink: "了解我的研究歷程", portraitAlt: "邱文昱的個人照片",
    chain: {
      label: "研究問題", feedback: "這是一個迴圈：影響會回到下一輪決策", cta: "跟著一個決策走一遍",
      steps: [
        { id: "evidence", label: "人類資料", text: "問卷量測影響家戶決策的因素" },
        { id: "decision", label: "耦合模型", text: "LLM 代理在環境模型中如何行動？" },
        { id: "validation", label: "評估與驗證", text: "決策是否符合人類證據、通過檢查？" },
        { id: "consequence", label: "耦合影響", text: "兩者的互動隨時間改變了什麼？" },
      ],
    },
    roles: {
      title: "四種角色，各自分明",
      note: "這些專案共用研究方法，但並不是一套已整合、已發表的系統。",
      items: [
        { id: "respondent", colorRole: "human", name: "真人受訪者", text: "填答問卷的真實受訪者，是人類證據的來源。" },
        { id: "household", colorRole: "environment", name: "模擬家戶代理", text: "FLOODABM 中做出調適選擇的模型家戶，不是真人，也不是 LLM 系統。" },
        { id: "llm", colorRole: "model", name: "LLM 決策代理", text: "回答問卷題目或提出行動的語言模型。我把它們的回答與人類證據對照（論文準備中）；在仍開發中的 WAGF 裡，則在模擬狀態改變前先檢查提案。" },
        { id: "research", colorRole: "context", name: "科研 AI 代理", text: "協助處理文獻與任務的軟體，來源、檢查與工作狀態都可檢視。" },
      ],
    },
    whyLabel: "為什麼", howLabel: "怎麼做", contributionShortLabel: "貢獻", sourceLabel: "公開來源", expandLabel: "方法與限制",
  },
};
