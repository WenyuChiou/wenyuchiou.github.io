import { NAVIGATOR_INDEX } from './navigator-data.js';

export const GUIDE_INTENTS = [
  {
    id: 'research',
    label: { en: 'Understand the research', 'zh-TW': '理解研究' },
    query: { en: 'Why evaluate AI decisions with human behavior evidence?', 'zh-TW': '為什麼用人類行為證據評估 AI 決策？' },
    intro: {
      en: 'Start with the question: does an AI decision agree with measured human behavior? Then inspect a household simulation and the evidence behind it.',
      'zh-TW': '先看問題：AI 的決策是否符合實測的人類行為？再看模擬家戶如何做選擇，以及背後的研究證據。',
    },
    evidence: ['human-grounded-llm-evaluation', 'floodabm', 'publications'],
    reasons: {
      en: ['The evaluation question, my contribution, and its current research status.', 'How simulated households respond to flood risk and resource limits.', 'Public articles and presentations, separate from synthetic demonstrations.'],
      'zh-TW': ['評估的問題、我的貢獻，以及目前研究狀態。', '模擬家戶如何面對洪災風險與資源限制。', '公開文章與發表紀錄，和合成展示分開呈現。'],
    },
  },
  {
    id: 'tools',
    label: { en: 'Explore agents & tools', 'zh-TW': '探索代理與工具' },
    query: { en: 'How do validators and research tools constrain AI agents?', 'zh-TW': '驗證器與研究工具如何約束 AI 代理？' },
    intro: {
      en: 'Follow a proposal through validation, then explore the tools for evidence-linked research. An AI research agent is software, not a human respondent.',
      'zh-TW': '先追蹤提案如何經過驗證，再探索有證據鏈的科研工具。科研 AI 代理是軟體，不是真實受訪者。',
    },
    evidence: ['wagf', 'open-source', 'articles'],
    reasons: {
      en: ['Inspect checks, rejected actions, and targeted repair before a state change.', 'Find the public research skills, workflow tools, and their GitHub sources.', 'Read the reasoning behind evaluation, validators, and system consequences.'],
      'zh-TW': ['查看狀態改變前的檢查、被拒絕行動與針對性修復。', '找到公開的研究技能、工作流工具及 GitHub 原始碼。', '閱讀評估、驗證器與系統後果背後的方法判斷。'],
    },
  },
  {
    id: 'collaboration',
    label: { en: 'Collaboration or role fit', 'zh-TW': '評估合作或職位' },
    href: '/hire/#fit-explorer',
  },
];

export function buildReadingPath(intentId, locale = 'en') {
  const language = locale === 'zh-TW' ? 'zh-TW' : 'en';
  const intent = GUIDE_INTENTS.find(item => item.id === intentId && item.evidence);
  if (!intent) throw new TypeError('Unknown reading path');
  return {
    intro: intent.intro[language],
    matches: intent.evidence.map((id, index) => {
      const record = NAVIGATOR_INDEX.records.find(item => item.id === id);
      if (!record) throw new Error('Reading path references unknown evidence');
      return { record, reason: intent.reasons[language][index] };
    }),
  };
}

export const GUIDE_COPY = {
  en: {
    launch: 'Portfolio Guide', launchShort: 'AI guide', launchScope: 'Projects · research · articles',
    eyebrow: 'Portfolio Guide', title: 'Where would you like to start?',
    intro: 'Choose a reading path or ask a question. Evidence is available before you request an AI summary.',
    placeholder: 'Ask about a research question or capability', submit: 'Generate a guide',
    ready: 'Local reading path', matching: 'Local evidence match', loading: 'Preparing your guide…',
    generatedReady: 'Cited guide ready',
    local: 'Local evidence match', semantic: 'Local semantic match',
    fallback: 'AI unavailable. These are local results, not a generated answer.',
    privacy: 'Only Generate a guide sends your question to NVIDIA. Questions are not saved. Local evidence remains available if AI fails.',
  },
  'zh-TW': {
    launch: '作品導覽', launchShort: 'AI 導覽', launchScope: '專案 · 研究 · 文章',
    eyebrow: 'Portfolio Guide', title: '想從哪裡開始了解？',
    intro: '選擇閱讀路徑或提出問題；不必使用 AI，也能先查看證據。',
    placeholder: '詢問研究問題或專長', submit: '生成導覽',
    ready: '本機閱讀路徑', matching: '本機證據比對', loading: '正在準備導覽…',
    generatedReady: '引用導覽已備妥',
    local: '本機證據比對', semantic: '本機語意比對',
    fallback: 'AI 目前無法使用。以下是本機結果，不是生成回答。',
    privacy: '只有點擊「生成導覽」才會將問題送至 NVIDIA；問題不會儲存。AI 失敗時，仍可閱讀本機證據。',
  },
};
