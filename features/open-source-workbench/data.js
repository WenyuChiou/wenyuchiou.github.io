export const GROUPS = Object.freeze(["research", "collaboration", "learning"]);
export const REPOSITORIES = Object.freeze([
  ["ai-research-skills", "research"], ["research-hub", "research"],
  ["agent-collab-skills", "collaboration"], ["codex-delegate", "collaboration"],
  ["awesome-agentic-ai-zh", "learning"],
].map(([id, group]) => Object.freeze({ id, group, href: `https://github.com/WenyuChiou/${id}` })));

const LABELS = {
  en: {
    title: "From research methods to working tools", intro: "Three uses for my open-source work. Connections describe purpose, not software dependencies.",
    all: "All uses", research: "Research workflows", collaboration: "Agent collaboration", learning: "Learning resources",
    filter: "Highlight a use", selected: "Highlighted repositories", source: "Public source", ready: "All five repositories",
    descriptions: ["Skills and a catalog for research methods and reusable AI workflows.", "Executable research workflows, from evidence collection to synthesis.", "Task boundaries, shared context and acceptance checks for agent teams.", "Delegate bounded work to Codex and inspect the returned output.", "A Chinese-language guide to agentic AI projects and learning resources."],
  },
  "zh-TW": {
    title: "把研究方法帶進日常工具", intro: "以三種用途整理我的開源作品；連線表示用途關係，不表示軟體彼此依賴。",
    all: "全部用途", research: "研究工作流", collaboration: "代理協作", learning: "學習資源",
    filter: "選擇關注用途", selected: "對應專案", source: "公開原始碼", ready: "全部五個專案",
    descriptions: ["研究方法與可重用 AI 工作流程的技能與目錄。", "可執行的研究流程，串接證據蒐集與綜整。", "為代理團隊定義任務邊界、共用脈絡與驗收檢查。", "將範圍明確的工作交給 Codex，並檢視回傳產出。", "以中文整理 Agentic AI 專案與學習資源。"],
  },
};

export function selectGroup(group) {
  if (group !== "all" && !GROUPS.includes(group)) throw new Error("Unknown workbench group");
  return REPOSITORIES.filter((repo) => group === "all" || repo.group === group);
}

export function getWorkbench(locale) {
  const labels = LABELS[locale] || LABELS.en;
  return { ...labels, repos: REPOSITORIES.map((repo, index) => ({ ...repo, description: labels.descriptions[index] })) };
}
