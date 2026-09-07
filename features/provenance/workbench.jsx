import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, X, Pause, Play, RotateCcw, Users, ShieldCheck, Waves } from 'lucide-react';
import { COPY } from './copy.js';
import { FIXTURES, getComparison } from './behavior-data.js';
import { LENSES, STAGES, INITIAL_STATE, REJECTED_PROPOSAL, REPAIRED_PROPOSAL, validateProposal, applyProposal, simulationState, readTrace } from './state.js';
import { RobotArt, EvidenceArt, HomeArt, RiverArt, ValidatorArt, ResourceArt } from './art.jsx';

function ObjectView({ label, children, onClick, selected, tone, detail }) {
  const body = <><svg viewBox="0 0 280 330" aria-hidden="true" focusable="false">{children}</svg><strong>{label}</strong>{detail && <span>{detail}</span>}</>;
  return onClick ? <button type="button" className="pw-object" data-tone={tone} aria-pressed={selected} onClick={onClick}>{body}</button> : <div className="pw-object" data-tone={tone}>{body}</div>;
}

function Evaluation({ C, mode, setMode, recordId, setRecordId, stage, selectStage }) {
  const report = getComparison(mode, mode);
  const selected = FIXTURES[mode].records.find(record => record.id === recordId);
  return <>
    <div className="pw-segmented" role="group" aria-label={C.mode}>{Object.entries(C.modes).map(([id, label]) => <button key={id} type="button" data-comparison-mode={id} aria-pressed={mode === id} onClick={() => { setMode(id); setRecordId('A1'); }}>{label}</button>)}</div>
    <div className="pw-art-row pw-art-pair">
      <ObjectView label={C.human} tone="human" selected={stage < 2} onClick={() => selectStage(0)}><EvidenceArt /></ObjectView>
      <div className="pw-connection"><ArrowRight aria-hidden="true" /><span>{C.compare}</span><span className="pw-signal" /></div>
      <ObjectView label={C.model} tone="model" selected={stage >= 2} onClick={() => selectStage(2)}><RobotArt /></ObjectView>
    </div>
    <table className="pw-comparison"><caption>{C.modes[mode]}</caption><thead><tr><th scope="col">{mode === 'repeats' ? C.runs : C.modes[mode]}</th><th scope="col">{C.reference}</th><th scope="col">{C.model}</th></tr></thead><tbody>{report.rows.map(row => <tr key={row.id}><th scope="row">{C.rowLabels[row.id]}</th><td>{row.reference} / {row.total}</td><td>{row.model[0]} / {row.total}</td></tr>)}</tbody></table>
    <p className="pw-finding" data-comparison-finding>{C.findings[mode]}</p>
    <div className="pw-records" role="group" aria-label={C.pair}>{FIXTURES[mode].records.map(record => <button type="button" key={record.id} data-record={record.id} aria-pressed={recordId === record.id} onClick={() => setRecordId(record.id)}>{record.id}</button>)}</div>
    <p className="pw-paired-record" data-paired-record aria-live="polite"><strong>{C.record} {selected.id}</strong><span>{C.reference}: {selected.reference ? C.yes : C.no}</span><span>{C.runs}: {selected.runs.map(value => value ? C.yes : C.no).join(' / ')}</span></p>
    <p className="pw-note">{C.units}</p>
  </>;
}

function Governance({ C, state, repaired, repair, stage, selectStage }) {
  const proposal = repaired ? REPAIRED_PROPOSAL : REJECTED_PROPOSAL;
  const checks = validateProposal(proposal);
  return <>
    <p className="pw-verdict" data-accepted={repaired} role="status">{repaired ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}{repaired ? C.accepted : C.blocked}</p>
    <div className="pw-art-row pw-art-triple">
      <ObjectView label={C.proposal} tone="proposal" selected={stage === 2} onClick={() => selectStage(2)}><RobotArt /></ObjectView>
      <ObjectView label={C.gate} tone={repaired ? 'human' : 'reject'} selected={stage === 3} onClick={() => selectStage(3)}><ValidatorArt accepted={repaired} checks={[checks.format, checks.permission, checks.budget]} /></ObjectView>
      <ObjectView label={C.state} tone="environment" selected={stage === 4} onClick={() => selectStage(4)}><ResourceArt resources={state.resources} /></ObjectView>
    </div>
    <dl className="pw-state-fields"><div><dt>{C.action}</dt><dd>protect-contents</dd></div><div data-failed={!checks.budget}><dt>{C.cost}</dt><dd data-proposal-cost>{proposal.cost}</dd></div><div><dt>{C.remaining}</dt><dd data-state-resources>{state.resources}</dd></div><div><dt>{C.protection}</dt><dd data-state-protected>{state.protected ? C.active : C.inactive}</dd></div></dl>
    <ul className="pw-checks">{['format', 'permission', 'budget'].map((id, index) => <li key={id} data-pass={checks[id]}>{checks[id] ? <Check aria-hidden="true" size={18} /> : <X aria-hidden="true" size={18} />}<span>{C.checks[index]}: {checks[id] ? C.pass : C.fail}</span></li>)}</ul>
    <p className="pw-finding">{repaired ? C.repairedNote : C.budgetError}</p>
    <button type="button" className="pw-repair" data-provenance-repair disabled={repaired} onClick={repair}><ShieldCheck aria-hidden="true" size={20} />{repaired ? C.repaired : C.repair}</button>
    <p className="pw-note">{C.unitsGov}</p>
  </>;
}

function Simulation({ C, tenure, setTenure, stage, selectStage }) {
  const state = simulationState(tenure, stage);
  return <>
    <div className="pw-segmented" role="group" aria-label={C.tenure}>{['owner', 'renter'].map(id => <button type="button" key={id} data-tenure={id} aria-pressed={tenure === id} onClick={() => setTenure(id)}>{C[id]}</button>)}</div>
    <div className="pw-art-row pw-art-triple pw-simulation-art">
      <ObjectView label={C[tenure]} tone="human" selected={stage <= 2} onClick={() => selectStage(2)}><HomeArt tenure={tenure} /></ObjectView>
      <ObjectView label={C.environment} tone="environment" selected={stage === 0} onClick={() => selectStage(0)}><RiverArt uid="provenance-river" /></ObjectView>
      <ObjectView label={C.resources} tone="validation" selected={stage === 4} onClick={() => selectStage(4)}><ResourceArt resources={state.resources} /></ObjectView>
    </div>
    <div className="pw-feedback"><ArrowRight aria-hidden="true" /><span>{C.simulationStep[stage]}</span><RotateCcw aria-hidden="true" /></div>
    <dl className="pw-state-fields"><div><dt>{C.agent}</dt><dd data-household-action>{tenure === 'owner' ? C.barrier : C.contents}</dd></div><div><dt>{C.protection}</dt><dd>{state.applied ? C.active : C.inactive}</dd></div><div><dt>{C.hazard}</dt><dd data-hazard>{state.hazard}<small>{C.unchanged}</small></dd></div><div><dt>{C.tokens}</dt><dd data-simulation-resources>{state.resources}</dd></div></dl>
    <p className="pw-finding" data-tenure-limit>{tenure === 'owner' ? C.ownerLimit : C.renterLimit}</p>
    <p className="pw-note">{C.syntheticUnits}</p>
  </>;
}

export function Workbench({ provenance: P, locale }) {
  const C = COPY[locale] || COPY.en;
  const root = useRef(null);
  const [lens, setLens] = useState('evaluation');
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState('direction');
  const [recordId, setRecordId] = useState('A1');
  const [tenure, setTenure] = useState('owner');
  const [system, setSystem] = useState(INITIAL_STATE);
  const [repaired, setRepaired] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const active = P.lenses[lens];
  const names = C.stages.map((name, index) => lens === 'simulation' && index === 2 ? C.agent : name);
  const running = ready && !paused && visible && foreground && !reduced;

  useEffect(() => {
    const syncHash = () => { const next = readTrace(window.location.hash); setLens(next.lens); setStage(next.stage); };
    syncHash(); setReady(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMedia = () => setReduced(media.matches);
    const syncVisibility = () => setForeground(!document.hidden);
    syncMedia(); syncVisibility();
    media.addEventListener('change', syncMedia);
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('hashchange', syncHash);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0.05 }) : null;
    if (observer) observer.observe(root.current.querySelector('[data-provenance-scene]')); else setVisible(true);
    const island = root.current.closest('[data-provenance-island]');
    island.dataset.ready = 'true';
    island.dispatchEvent(new Event('provenance:ready'));
    return () => { observer?.disconnect(); media.removeEventListener('change', syncMedia); document.removeEventListener('visibilitychange', syncVisibility); window.removeEventListener('hashchange', syncHash); };
  }, []);

  const select = (nextLens, nextStage) => {
    setLens(nextLens); setStage(nextStage);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#trace=${nextLens}&stage=${STAGES[nextStage]}`);
  };
  const selectStage = next => select(lens, next);
  const reset = () => { setMode('direction'); setRecordId('A1'); setTenure('owner'); setSystem(INITIAL_STATE); setRepaired(false); selectStage(0); };
  const repair = () => {
    if (repaired) return;
    const next = applyProposal(system, REPAIRED_PROPOSAL);
    if (next === system) return;
    setSystem(next); setRepaired(true); selectStage(4);
  };
  const keyboard = (event, index, count, selector, update) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : delta == null ? null : (index + delta + count) % count;
    if (next === null) return;
    event.preventDefault(); update(next); root.current.querySelectorAll(selector)[next]?.focus();
  };
  const icons = [Users, ShieldCheck, Waves];
  const href = locale === 'zh-TW' ? `/zh${active.caseHref}` : active.caseHref;

  return <div ref={root} className="provenance-workbench" data-running={running} data-ready={ready} data-lens={lens}>
    <div className="pw-lenses" role="tablist" aria-label={P.controlLabel}>{LENSES.map((id, index) => {
      const Icon = icons[index];
      return <button type="button" key={id} id={`trace-tab-${id}`} role="tab" aria-selected={lens === id} tabIndex={lens === id ? 0 : -1} aria-controls="trace-workbench" data-provenance-lens={id} onClick={() => select(id, 0)} onKeyDown={event => keyboard(event, index, 3, '[data-provenance-lens]', next => select(LENSES[next], 0))}><Icon aria-hidden="true" size={22} /><strong>{P.lenses[id].label}</strong></button>;
    })}</div>
    <div id="trace-workbench" role="tabpanel" aria-labelledby={`trace-tab-${lens}`}>
      <ol className="pw-stages" aria-label={P.stageLabel}>{names.map((name, index) => <li key={STAGES[index]}><button type="button" data-provenance-stage={index + 1} aria-current={stage === index ? 'step' : undefined} onClick={() => selectStage(index)} onKeyDown={event => keyboard(event, index, 5, '[data-provenance-stage]', selectStage)}><span>0{index + 1}</span><strong>{name}</strong></button></li>)}</ol>
      <div className="pw-toolbar"><span>{C.synthetic}</span><div><button type="button" data-scene-play aria-label={paused ? C.play : C.pause} title={paused ? C.play : C.pause} aria-pressed={paused} disabled={reduced} onClick={() => setPaused(value => !value)}>{paused || reduced ? <Play aria-hidden="true" size={20} /> : <Pause aria-hidden="true" size={20} />}</button><button type="button" data-scene-reset aria-label={C.reset} title={C.reset} onClick={reset}><RotateCcw aria-hidden="true" size={20} /></button></div></div>
      <div className="pw-layout">
        <div className="pw-scene" data-provenance-scene>
          {lens === 'evaluation' && <Evaluation {...{ C, mode, setMode, recordId, setRecordId, stage, selectStage }} />}
          {lens === 'governance' && <Governance {...{ C, repaired, stage, selectStage, repair }} state={system} />}
          {lens === 'simulation' && <Simulation {...{ C, tenure, setTenure, stage, selectStage }} />}
        </div>
        <aside className="pw-inspector" data-provenance-inspector aria-live="polite" aria-atomic="true">
          <p className="pw-source-label">{C.publicSource}<span data-provenance-status>{P.statuses[active.stages[stage][0]]}</span></p>
          <h3 data-provenance-title>{names[stage]}</h3>
          <p data-provenance-description>{active.stages[stage][1]}</p>
          <dl><div><dt>{P.detailLabels.focus}</dt><dd data-provenance-focus>{active.focus[stage]}</dd></div><div><dt>{P.detailLabels.output}</dt><dd data-provenance-output>{active.outcomes[stage]}</dd></div></dl>
          <a className="text-link" data-provenance-case href={href}>{P.detailLabels.caseLink}<ArrowUpRight aria-hidden="true" size={18} /></a>
          <p className="sr-only" data-provenance-summary>{active.summary}</p>
        </aside>
      </div>
    </div>
    <div className="pw-static-flow"><p>{C.staticNotice}</p>{LENSES.map(id => <section key={id}><h3>{P.lenses[id].label}</h3><ol>{P.lenses[id].stages.map(([status, text], index) => <li key={index}><strong>{id === 'simulation' && index === 2 ? C.agent : C.stages[index]}</strong><p>{text}</p><small>{P.statuses[status]}</small></li>)}</ol><a href={`${locale === 'zh-TW' ? '/zh' : ''}${P.lenses[id].caseHref}`}>{P.detailLabels.caseLink}</a></section>)}</div>
  </div>;
}
