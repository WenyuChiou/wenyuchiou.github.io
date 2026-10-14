import { NAVIGATOR_INDEX } from './navigator-data.js';
import { GUIDE_EVIDENCE } from './guide-evidence.js';
import { namedGuideTools } from './guide-protocol.js';

export const GUIDE_INTENTS = [
  {
    id: 'research',
    label: { en: 'Understand the research', 'zh-TW': '理解研究' },
    query: { en: 'Why evaluate AI decisions with human behavior evidence?', 'zh-TW': '為什麼用人類行為證據評估 AI 決策？' },
    intro: {
      en: 'Start with the question: does an AI decision agree with measured human behavior? Then inspect a household simulation and the evidence behind it.',
      'zh-TW': '先看問題：AI 的決策是否符合實測的人類行為？再看模擬家戶如何做選擇，以及背後的研究證據。',
    },
    evidence: ['human-grounded-llm-evaluation', 'wagf', 'floodabm'],
    reasons: {
      en: ['Why compare generated decisions with measured human behavior?', 'How can validators block a proposal before it changes state?', 'What happens when simulated household decisions affect later losses?'],
      'zh-TW': ['為什麼要用實測人類行為檢查生成決策？', '驗證器如何在提案改變狀態前阻擋錯誤？', '模擬家戶的選擇如何影響後續損失？'],
    },
  },
  {
    id: 'observatory',
    label: { en: 'Explain the decision example', 'zh-TW': '看懂決策示例' },
    query: { en: 'Explain this synthetic scene and what I should inspect next.', 'zh-TW': '解釋目前的合成場景，以及接下來值得檢查什麼。' },
    intro: { en: 'Inspect the current view, its checks and its consequence. AI explains; you decide whether to change the view.', 'zh-TW': '查看目前的檢視、驗證與後果。AI 提供講解，由你決定是否切換位置。' },
    evidence: ['human-grounded-llm-evaluation', 'wagf', 'floodabm'],
    reasons: { en: ['Compare measured and generated behavior.', 'Inspect the boundary before a state change.', 'Follow simulated household consequences.'], 'zh-TW': ['比較實測與生成行為。', '檢查狀態改變前的邊界。', '追蹤模擬家戶的後果。'] },
  },
  {
    id: 'tools',
    label: { en: 'Find a research tool', 'zh-TW': '找到合適工具' },
    query: { en: 'Which tools could help me organize literature and research workflows?', 'zh-TW': '哪些工具適合整理文獻與科研工作流？' },
    intro: {
      en: 'Follow a proposal through validation, then explore the tools for evidence-linked research. An AI research agent is software, not a human respondent.',
      'zh-TW': '先追蹤提案如何經過驗證，再探索有證據鏈的科研工具。科研 AI 代理是軟體，不是真實受訪者。',
    },
    evidence: ['repo-ai-research-skills', 'repo-research-hub', 'repo-agent-collab-skills'],
    reasons: {
      en: ['Start with portable research skills and explicit evidence handoffs.', 'Use an executable research workflow with recoverable state.', 'Scope, reconcile, and accept multi-agent work.'],
      'zh-TW': ['從可攜式科研技能與明確的證據交接開始。', '使用可執行且狀態可復原的科研工作流。', '界定、整合與驗收多代理工作。'],
    },
  },
];

export function buildReadingPath(intentId, locale = 'en', { query = '', context = null } = {}) {
  const language = locale === 'zh-TW' ? 'zh-TW' : 'en';
  const intent = GUIDE_INTENTS.find(item => item.id === intentId && item.evidence);
  if (!intent) throw new TypeError('Unknown reading path');
  let ids = intent.evidence;
  if (intentId === 'observatory' && context) {
    const first = { evaluation: 'human-grounded-llm-evaluation', governance: 'wagf', simulation: 'floodabm' }[context.lens];
    if (first) ids = [first, ...ids.filter(id => id !== first)];
  }
  if (intentId === 'tools' && query) {
    const needle = query.toLocaleLowerCase();
    const named = new Set(namedGuideTools(query, GUIDE_EVIDENCE).map(record => record.id));
    ids = GUIDE_EVIDENCE.filter(record => record.kind === 'tool').map((record, index) => ({ record, index, named: Number(named.has(record.id)), score: record.keywords[language].reduce((score, word) => score + (needle.includes(word.toLocaleLowerCase()) ? 1 : 0), 0) })).sort((a, b) => b.named - a.named || b.score - a.score || a.index - b.index).slice(0, 3).map(item => item.record.id);
  }
  return {
    intro: intent.intro[language],
    matches: ids.map((id) => {
      const record = NAVIGATOR_INDEX.records.find(item => item.id === id);
      const evidence = GUIDE_EVIDENCE.find(item => item.id === id);
      if (!record) throw new Error('Reading path references unknown evidence');
      return { record, reason: evidence.why[language], limitations: evidence.limitations[language], source: evidence.source };
    }),
  };
}

export const GUIDE_COPY = {
  en: {
    launch: 'Portfolio Guide', launchShort: 'AI guide', launchScope: 'Research · decisions · tools',
    eyebrow: 'Portfolio Guide', title: 'Where would you like to start?',
    intro: 'Choose a reading path or ask a question. Evidence is available before you request an AI summary.',
    placeholder: 'What would you like to understand?', submit: 'Get AI explanation',
    beginner: 'Plain language', method: 'Methods', depthLabel: 'Reading depth', contextLabel: 'Current synthetic view', viewAction: 'Inspect suggested view', why: 'Why it matters', how: 'How it works', contribution: 'What it contributes', boundaries: 'Conditions & limits', source: 'Original source', evidence: 'Evidence trail',
    ready: 'Local reading path', matching: 'Local evidence match', loading: 'Preparing your guide…',
    generatedReady: 'Cited guide ready',
    local: 'Local evidence match', semantic: 'Local semantic match',
    fallback: 'AI unavailable. These are local results, not a generated answer.',
    unsupported: 'This question is outside the portfolio evidence. These local sources may help you explore my work.',
    privacy: 'Get AI explanation sends your question and selected view to NVIDIA. This site does not save either. Local evidence remains available if AI fails.',
  },
  'zh-TW': {
    launch: '作品導覽', launchShort: 'AI 導覽', launchScope: '研究 · 決策 · 工具',
    eyebrow: 'Portfolio Guide', title: '想從哪裡開始了解？',
    intro: '選擇閱讀路徑或提出問題；不必使用 AI，也能先查看證據。',
    placeholder: '你想了解什麼？', submit: '取得 AI 講解',
    beginner: '白話理解', method: '深入方法', depthLabel: '閱讀深度', contextLabel: '目前的合成檢視', viewAction: '查看建議位置', why: '為什麼要做', how: '如何處理', contribution: '帶來什麼貢獻', boundaries: '條件與限制', source: '原始來源', evidence: '證據路徑',
    ready: '本機閱讀路徑', matching: '本機證據比對', loading: '正在準備導覽…',
    generatedReady: '引用導覽已備妥',
    local: '本機證據比對', semantic: '本機語意比對',
    fallback: 'AI 目前無法使用。以下是本機結果，不是生成回答。',
    unsupported: '這個問題不在網站證據範圍內。以下本機來源可協助你了解我的工作。',
    privacy: '點擊「取得 AI 講解」才將問題與選取的檢視送至 NVIDIA；本站不會儲存兩者。AI 失敗時，仍可閱讀本機證據。',
  },
};
