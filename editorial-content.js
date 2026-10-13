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
      wagf: "Demonstrations illustrate validation behavior, not a real-world safety guarantee.",
    },
    aboutLink: "More about my research path", portraitAlt: "Portrait of Wenyu Chiou",
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
      wagf: "示例呈現驗證行為，不代表真實世界的安全保證。",
    },
    aboutLink: "了解我的研究歷程", portraitAlt: "邱文昱的個人照片",
  },
};
