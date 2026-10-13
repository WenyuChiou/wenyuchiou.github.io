import React, { useId } from 'react';
import { EvidenceArt, RiverArt, RobotArt } from './art.jsx';

const LABELS = {
  en: {
    eyebrow: 'Decision Observatory',
    title: 'Evidence enters. Decisions stay inspectable.',
    evidence: 'Measured evidence', ownerRenter: 'Homeowner + renter', river: 'River, rain + water gauge',
    notebook: 'Evidence notebook', validator: 'Validator',
    decision: 'LLM decision agent', environment: 'Human–environment', science: 'Scientific workflow',
    literature: 'Literature + source', claim: 'Claim–evidence', audit: 'Audit trail',
  },
  'zh-TW': {
    eyebrow: '決策觀測站',
    title: '證據進場，決策全程可檢視。',
    evidence: '實測證據', ownerRenter: '屋主＋租客', river: '河流、降雨＋水位尺',
    notebook: '證據筆記', validator: '驗證器',
    decision: 'LLM 決策代理', environment: '人與環境', science: '科研工作流',
    literature: '文獻＋來源', claim: '主張—證據', audit: '稽核軌跡',
  },
};

export function DecisionObservatory({ locale = 'en', lens, stage, selectLens, selectStage, motion = false }) {
  const C = LABELS[locale] ?? LABELS.en;
  const uid = `observatory-${useId().replaceAll(':', '')}`;
  const choose = (nextLens, nextStage) => lens === nextLens ? selectStage(nextStage) : selectLens(nextLens, nextStage);

  return <section className="decision-observatory" data-provenance-signature data-motion={motion ? 'running' : 'paused'} aria-labelledby={`${uid}-title`}>
    <header className="sr-only">
      <span>{C.eyebrow}</span>
      <h3 id={`${uid}-title`}>{C.title}</h3>
    </header>
    <div className="decision-observatory__diagram">
      <button type="button" className="decision-observatory__wing decision-observatory__evidence" data-observatory-view="simulation" aria-pressed={lens === 'simulation'} onClick={() => choose('simulation', 0)}>
        <svg viewBox="0 0 280 330" aria-hidden="true" focusable="false">
          <RiverArt uid={`${uid}-river`} />
          <path className="do-gauge" d="M232 106v112m-10-92h10m-15 23h15m-10 23h10m-15 23h15" />
        </svg>
        <span className="decision-observatory__label"><strong>{C.environment}</strong><small>{C.evidence} · {C.ownerRenter}</small><small>{C.river}</small></span>
      </button>

      <button type="button" className="decision-observatory__robot" data-observatory-view="governance" aria-pressed={lens === 'governance' && stage === 3} onClick={() => choose('governance', 3)}>
        <svg viewBox="0 0 280 330" aria-hidden="true" focusable="false">
          <RobotArt />
          <g className="do-validator" transform="translate(205 35)">
            <path d="M0 10 24 0l24 10v29c0 22-24 34-24 34S0 61 0 39Z" />
            <path d="m13 35 8 8 15-20" />
          </g>
        </svg>
        <span className="decision-observatory__label"><strong>{C.decision}</strong><small>{C.notebook} · {C.validator}</small></span>
      </button>

      <button type="button" className="decision-observatory__wing decision-observatory__sources" data-observatory-view="evaluation" aria-pressed={lens === 'evaluation'} onClick={() => choose('evaluation', 1)}>
        <svg viewBox="0 0 280 330" aria-hidden="true" focusable="false">
          <EvidenceArt />
          <g className="do-audit" transform="translate(188 186)">
            <path d="M0 0h65v92H0Z" />
            <path d="M13 20h39M13 35h30M13 58l9 9 20-23" />
          </g>
        </svg>
        <span className="decision-observatory__label"><strong>{C.science}</strong><small>{C.literature}</small><small>{C.claim} · {C.audit}</small></span>
      </button>
      <span className="decision-observatory__signal decision-observatory__signal--left" aria-hidden="true" />
      <span className="decision-observatory__signal decision-observatory__signal--right" aria-hidden="true" />
    </div>
  </section>;
}

export default DecisionObservatory;
