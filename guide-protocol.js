export const GUIDE_TASKS = ['research', 'observatory', 'tools'];
export const GUIDE_DEPTHS = ['beginner', 'method'];
export const GUIDE_LENSES = ['evaluation', 'governance', 'simulation'];
export const GUIDE_STAGES = ['evidence', 'context', 'decision', 'validation', 'consequence'];

const common = new Set('a an the this that these those it its is are was were be been by for from to of and or with as in on at i you your we our my me why how what which could should can does do about explain please tell work works works use uses using need not only then through before after against whether where more rather just so will would into they their must makes make made provides provide includes include'.split(' '));
function meaningfulUnits(text) {
  const words = (text.toLocaleLowerCase().match(/[a-z][a-z-]{2,}/g) || []).filter(word => !common.has(word));
  const runs = text.match(/[\p{Script=Han}]{2,}/gu) || [];
  return [...words, ...runs.flatMap(run => Array.from({ length: run.length - 1 }, (_, index) => run.slice(index, index + 2)))];
}

export function sceneGrounding(context, locale) {
  if (!context) return '';
  if (context.lens === 'governance') return locale === 'zh-TW'
    ? (context.repaired ? '修復後的提案通過格式、權限與預算檢查，只有驗證通過才可改變狀態。' : '被拒絕的提案因資源成本超過可用預算，格式與權限檢查通過，狀態維持不變。先檢查預算，再查看後果與稽核軌跡。')
    : (context.repaired ? 'The repaired proposal passes shape, authority and budget checks. Only validated actions change state.' : 'The proposal is rejected because its resource cost exceeds the available budget. Shape and authority checks pass; state remains unchanged. Inspect the budget check and consequence audit trail.');
  if (context.lens === 'simulation') return locale === 'zh-TW' ? '合成家戶代理不是真人或 LLM。屋主與租客的權限不同，租客不能抬高房屋，調適措施不改變河流危害。' : 'Synthetic household agents are not people or LLM agents. Owners and renters have different permissions. Renters cannot elevate homes. Housing adaptation does not change river hazard.';
  return locale === 'zh-TW' ? '合成人類參考與模型紀錄，檢查方向、群體差異或穩定性，不是個別問卷或實測結果。' : 'Synthetic human reference and model records compare direction, subgroup differences or stability, not individual surveys or measured results.';
}

function mentionsGuideName(query, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9-])${escaped}($|[^a-z0-9-])`).test(query);
}

export function namedGuideTools(query, evidence) {
  const text = query.toLocaleLowerCase();
  return evidence.filter(record => {
    if (record.kind !== 'tool' || !record.id.startsWith('repo-')) return false;
    return mentionsGuideName(text, record.id.slice(5));
  });
}

export function isSupportedGuideQuery(query, task, evidence) {
  const text = query.toLocaleLowerCase();
  const allowed = evidence.filter(record => record.tasks.includes(task));
  const terms = allowed.flatMap(record => [...record.keywords.en, ...record.keywords['zh-TW'], record.title.en, record.title['zh-TW']]);
  const domain = /\b(wenyu|llm|agent|agents|research|literature|citation|citations|zotero|obsidian|notebooklm|evidence|workflow|workflows|proposal|validation|simulation|synthetic|flood|codex|skills)\b|邱文昱|研究|文獻|引用|證據|代理|決策|工作流|驗證|模擬|洪災|提案|合成|工具/i;
  return namedGuideTools(text, allowed).length > 0 || allowed.some(record => record.kind === 'case' && mentionsGuideName(text, record.id)) || domain.test(text) || terms.some(term => text.includes(term.toLocaleLowerCase()));
}

export function verifyGuideGrounding(payload, evidence, options, locale) {
  const byId = new Map(evidence.map(record => [record.id, record]));
  for (const section of payload.sections) {
    const source = section.evidenceIds.map(id => {
      const record = byId.get(id);
      return [record.title[locale], record.why[locale], record.how[locale], record.contribution[locale], record.limitations[locale]].join(' ');
    }).join(' ') + ' ' + sceneGrounding(options.context, locale);
    const units = meaningfulUnits(section.text);
    const known = new Set(meaningfulUnits(source));
    const minimumCoverage = locale === 'zh-TW' ? 0.5 : 0.55;
    if (units.length < 2 || units.filter(unit => known.has(unit)).length / units.length < minimumCoverage) throw new Error('unsupported_guide_prose');
    const sourceNumbers = new Set(source.match(/\b\d+(?:[.,]\d+)*\b/g) || []);
    if ((section.text.match(/\b\d+(?:[.,]\d+)*\b/g) || []).some(number => !sourceNumbers.has(number))) throw new Error('unsupported_guide_number');
  }
}

export function validateGuideContext(value) {
  if (value === undefined || value === null) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid_guide_context');
  const keys = ['lens', 'stage', 'mode', 'tenure', 'repaired'];
  if (Object.keys(value).some(key => !keys.includes(key)) || !GUIDE_LENSES.includes(value.lens) || !GUIDE_STAGES.includes(value.stage)) throw new Error('invalid_guide_context');
  if (!['direction', 'subgroup', 'stability'].includes(value.mode) || !['owner', 'renter'].includes(value.tenure) || typeof value.repaired !== 'boolean') throw new Error('invalid_guide_context');
  return { lens: value.lens, stage: value.stage, mode: value.mode, tenure: value.tenure, repaired: value.repaired };
}

export function validateGuideOptions({ task = 'research', depth = 'beginner', context } = {}) {
  if (!GUIDE_TASKS.includes(task) || !GUIDE_DEPTHS.includes(depth)) throw new Error('invalid_guide_options');
  const scene = validateGuideContext(context);
  if (scene && task !== 'observatory') throw new Error('unexpected_guide_context');
  return { task, depth, context: scene };
}

export function validateGuidePayload(payload, evidence, options) {
  const allowed = evidence.filter(record => record.tasks.includes(options.task));
  const byId = new Map(allowed.map(record => [record.id, record]));
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Object.keys(payload).some(key => !['sections', 'matches', 'suggestedView'].includes(key))) throw new Error('invalid_guide_payload');
  if (!Array.isArray(payload.matches) || payload.matches.length < 1 || payload.matches.length > 3 || new Set(payload.matches.map(item => item?.id)).size !== payload.matches.length) throw new Error('invalid_guide_matches');
  const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max && !/[<>]|https?:\/\//i.test(value);
  for (const match of payload.matches) {
    if (!match || Object.keys(match).length !== 2 || !byId.has(match.id) || !text(match.reason, 240)) throw new Error('invalid_guide_matches');
  }
  if (options.task === 'observatory' && options.context) {
    const primary = { evaluation: 'human-grounded-llm-evaluation', governance: 'wagf', simulation: 'floodabm' }[options.context.lens];
    if (payload.matches.length !== 1 || payload.matches[0].id !== primary) throw new Error('invalid_scene_citation');
  }
  if (!Array.isArray(payload.sections) || payload.sections.length !== 3) throw new Error('invalid_guide_sections');
  const kinds = ['why', 'how', 'contribution'];
  payload.sections.forEach((section, index) => {
    if (!section || Object.keys(section).length !== 3 || section.kind !== kinds[index] || !text(section.text, 480) || !Array.isArray(section.evidenceIds) || section.evidenceIds.length < 1 || section.evidenceIds.length > 3 || new Set(section.evidenceIds).size !== section.evidenceIds.length || section.evidenceIds.some(id => !payload.matches.some(match => match.id === id))) throw new Error('invalid_guide_sections');
    if (options.task === 'observatory' && options.context) {
      const record = byId.get(payload.matches[0].id);
      const sceneTexts = ['en', 'zh-TW'].flatMap(locale => [sceneGrounding(options.context, locale), ...['why', 'how', 'contribution', 'limitations'].map(field => record[field][locale])]);
      if (!sceneTexts.includes(section.text)) throw new Error('invalid_scene_prose');
    }
  });
  if (!Object.hasOwn(payload, 'suggestedView')) throw new Error('invalid_guide_view');
  if (payload.suggestedView !== null) {
    const view = payload.suggestedView;
    if (options.task !== 'observatory' || !options.context || !view || typeof view !== 'object' || Array.isArray(view) || Object.keys(view).length !== 2 || !GUIDE_LENSES.includes(view.lens) || !GUIDE_STAGES.includes(view.stage)) throw new Error('invalid_guide_view');
  }
  return payload;
}
