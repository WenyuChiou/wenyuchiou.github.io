export const EDITORIAL = {
  en: {
    writingLabel: "Writing",
    researchLinks: [{ label: "Research directions", href: "/research/" }, { label: "Publications & talks", href: "/publications/" }],
    methodLabel: "Methods", limitsLabel: "Boundaries", contributionLabel: "My contribution",
    contexts: [
      { title: "People and their environment", text: "Human surveys inform behavioral models; simulated households make adaptation choices under flood and resource constraints.", href: "/work/floodabm/" },
      { title: "Evidence-linked scientific work", text: "AI research agents handle literature and tasks. I build tools that make sources, validation checks, and workflow state inspectable.", href: "https://github.com/WenyuChiou/research-hub" },
    ],
    distinction: "Human respondents provide evidence. Simulated household agents and AI research agents are models and software, not people. These projects share a research approach, not one integrated published system.",
    limits: {
      "human-grounded-llm-evaluation": "The study is in preparation. Synthetic demonstrations are not respondent data or unpublished findings.",
      floodabm: "The archived research prototype models household adaptation. Its simulated households are not an integrated LLM system.",
      wagf: "The system is in preparation for release. Demonstrations illustrate validation behavior, not a real-world safety guarantee.",
    },
    aboutLink: "More about my research path", portraitAlt: "Portrait of Wenyu Chiou",
  },
  "zh-TW": {
    writingLabel: "文章",
    researchLinks: [{ label: "研究方向", href: "/research/" }, { label: "著作與演講", href: "/publications/" }],
    methodLabel: "方法", limitsLabel: "範圍與限制", contributionLabel: "我的貢獻",
    contexts: [
      { title: "人與環境的互動", text: "以真人問卷建立行為模型，讓模擬家戶在洪災與資源限制下做出調適選擇。", href: "/work/floodabm/" },
      { title: "有證據鏈的科研工作", text: "科研 AI 代理協助處理文獻與任務；我建立能檢視來源、驗證關卡與工作狀態的工具。", href: "https://github.com/WenyuChiou/research-hub" },
    ],
    distinction: "真實受訪者提供人類證據；模擬家戶代理與科研 AI 代理則是模型與軟體，不是真人。這些專案共用研究方法，不代表已整合成同一套發表系統。",
    limits: {
      "human-grounded-llm-evaluation": "研究撰寫中。合成展示不是受訪者資料，也不是未發表的研究結果。",
      floodabm: "已封存的研究原型模擬家戶調適；其中的家戶代理不是已整合 LLM 的系統。",
      wagf: "系統準備釋出中。示例呈現驗證行為，不代表真實世界的安全保證。",
    },
    aboutLink: "了解我的研究歷程", portraitAlt: "邱文昱的個人照片",
  },
};
