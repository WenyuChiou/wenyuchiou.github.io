import React, { useEffect, useState } from "react";
import { ArrowUpDown, GitCompareArrows, Repeat2, Users, ChevronDown } from "lucide-react";
import { FIXTURES, SCENARIO_IDS, LENS_IDS, getComparison, selectState } from "./data.js";
import { getLabels } from "./content.js";

const lensIcons = { direction: ArrowUpDown, groups: Users, repeats: Repeat2 };

function CountBar({ count, total, label, tone }) {
  return <div className={`behavior-count behavior-count-${tone}`}>
    <span className="behavior-count-label">{label}</span>
    <svg className="behavior-track" aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none"><rect width={count / total * 100} height="10" /></svg>
    <strong>{count}/{total}</strong>
  </div>;
}

function RecordTable({ scenarioId, labels }) {
  return <table className="behavior-table">
    <caption>{labels.tableCaption}</caption>
    <thead><tr><th scope="col">{labels.record}</th><th scope="col">{labels.efficacy}</th><th scope="col">{labels.referenceShort}</th><th scope="col">{labels.outputs}</th></tr></thead>
    <tbody>{FIXTURES[scenarioId].records.map((record) => <tr key={record.id}>
      <th scope="row">{record.id}<span className="behavior-table-group">{labels[record.group]}</span></th>
      <td>{labels[record.efficacy]}</td><td>{record.reference}</td><td>{record.runs.join(" / ")}</td>
    </tr>)}</tbody>
  </table>;
}

export function BehaviorComparisonLab({ locale = "en" }) {
  const labels = getLabels(locale);
  const [enhanced, setEnhanced] = useState(false);
  const [state, setState] = useState({ scenarioId: "direction", lensId: "direction", selectedRecordId: "A1" });
  useEffect(() => { setEnhanced(true); }, []);
  const { scenarioId, lensId, selectedRecordId } = state;
  const comparison = getComparison(scenarioId, lensId);
  const records = FIXTURES[scenarioId].records;
  const selected = records.find((record) => record.id === selectedRecordId);
  const select = (kind, id) => setState((current) => selectState(current, kind, id));
  const prefix = locale === "zh-TW" ? "/zh" : "";

  return <section id="behavior-comparison" className="interactive-artifact behavior-lab"
    aria-labelledby="behavior-title" data-enhanced={enhanced ? "true" : "false"}
    data-behavior-scenario={scenarioId} data-behavior-lens={lensId}>
    <header className="behavior-heading"><div><p className="behavior-synthetic">{labels.synthetic}</p><h2 id="behavior-title">{labels.title}</h2></div><GitCompareArrows className="behavior-heading-icon" aria-hidden="true" /></header>

    <div className="behavior-enhancement" hidden={!enhanced}>
      <div className="behavior-controls">
        <div className="behavior-control-group" role="group" aria-label={labels.scenarioLabel}>
          <span className="behavior-control-label" aria-hidden="true">{labels.scenarioLabel}</span>
          <div className="behavior-scenario-options">{SCENARIO_IDS.map((id, index) => <button type="button" key={id}
            data-behavior-scenario-button={id} value={id} aria-pressed={scenarioId === id}
            onClick={() => select("scenario", id)}><span aria-hidden="true">{index + 1}</span>{labels.scenarios[id]}</button>)}</div>
        </div>
        <div className="behavior-control-group" role="group" aria-label={labels.lensLabel}>
          <span className="behavior-control-label" aria-hidden="true">{labels.lensLabel}</span>
          <div className="behavior-lens-options">{LENS_IDS.map((id) => { const Icon = lensIcons[id]; return <button type="button" key={id}
            data-behavior-lens-button={id} value={id} aria-pressed={lensId === id}
            onClick={() => select("lens", id)}><Icon aria-hidden="true" size={18} />{labels.lenses[id]}</button>; })}</div>
        </div>
      </div>

      <div className="behavior-finding" role="status" aria-live="polite" aria-atomic="true" data-behavior-finding="">
        <strong>{labels.finding}</strong><p>{labels.findings[scenarioId][lensId]}</p>
      </div>

      <figure className="behavior-chart" aria-labelledby="behavior-chart-caption">
        <figcaption id="behavior-chart-caption">{labels.actionCount}<span>{labels.total} · {labels.referenceShort}: {comparison.overall.reference}/{comparison.overall.total} · {labels.outputs}: {comparison.overall.model.map((count) => `${count}/${comparison.overall.total}`).join(" · ")}</span></figcaption>
        <div className="behavior-pair">
          <section className="behavior-series behavior-reference" aria-label={labels.reference}>
            <h3><span aria-hidden="true" />{labels.reference}</h3>
            {comparison.rows.map((row) => <div className="behavior-chart-row" key={row.id}>
              <h4>{labels[row.id]}</h4><CountBar count={row.reference} total={row.total} label={labels.referenceShort} tone="human" />
            </div>)}
          </section>
          <section className="behavior-series behavior-model" aria-label={labels.model}>
            <h3><span aria-hidden="true" />{labels.model}</h3>
            {comparison.rows.map((row) => <div className="behavior-chart-row" key={row.id}>
              <h4>{labels[row.id]}</h4>{row.model.map((count, index) => <CountBar key={index} count={count} total={row.total} label={labels[`run${(row.run ?? index) + 1}`]} tone="model" />)}
              {lensId === "repeats" && <p className="behavior-row-note">{row.run === 0 ? labels.first : `${labels.previous}: ${row.changed}/${row.total}`}</p>}
            </div>)}
          </section>
        </div>
      </figure>

      <dl className="behavior-metrics"><div><dt>{labels.mismatches}</dt><dd>{comparison.mismatches.map((value) => `${value}/${records.length}`).join(" · ")}<span>{labels.outputs}</span></dd></div><div><dt>{labels.changed}</dt><dd>{comparison.changedRecords}/{records.length}</dd></div></dl>

      <section className="behavior-record-section" aria-labelledby="behavior-records-title">
        <h3 id="behavior-records-title">{labels.records}</h3>
        <div className="behavior-records" role="group" aria-label={labels.records}>
          {records.map((record) => <button type="button" key={record.id} className="behavior-record"
            data-behavior-record-button={record.id} value={record.id} aria-pressed={selectedRecordId === record.id}
            aria-controls="behavior-record-detail" onClick={() => select("record", record.id)}
            aria-label={`${labels.record} ${record.id}; ${labels.referenceShort}: ${record.reference}; ${labels.outputs}: ${record.runs.join(", ")}`}>
            <strong>{record.id}</strong><span className="behavior-record-choices" aria-hidden="true"><span className="behavior-reference-choice">{record.reference}</span><span className="behavior-record-divider">/</span>{record.runs.map((value, index) => <span key={index} className={value === record.reference ? "behavior-match" : "behavior-mismatch"}>{value}</span>)}</span>
          </button>)}
        </div>
        <div id="behavior-record-detail" className="behavior-record-detail" data-behavior-selected-record={selected.id}>
          <h4>{labels.selected} <strong>{selected.id}</strong></h4>
          <dl><div><dt>{labels.conditions}</dt><dd>{labels[selected.efficacy]} · {labels.group}: {selected.group}</dd></div><div><dt>{labels.reference}</dt><dd>{labels.choices[selected.reference]}</dd></div><div><dt>{labels.model}</dt><dd>{selected.runs.map((value, index) => <span key={index}>{labels[`run${index + 1}`]}: {labels.choices[value]}</span>)}</dd></div></dl>
        </div>
      </section>
    </div>

    <div className="behavior-fallback" hidden={enhanced}>
      {SCENARIO_IDS.map((id, index) => <details key={id} open={index === 0} data-behavior-fallback={id}>
        <summary>{labels.scenarios[id]}<ChevronDown aria-hidden="true" size={18} /></summary>
        <p>{labels.findings[id][id]}</p><RecordTable scenarioId={id} labels={labels} />
      </details>)}
    </div>

    <details className="behavior-assumptions"><summary>{labels.assumptions}<ChevronDown aria-hidden="true" size={18} /></summary><p>{labels.boundary}</p><p>{FIXTURES[scenarioId].version}</p></details>
    <footer className="behavior-sources"><nav aria-label={labels.sources}><a href={`${prefix}/work/human-grounded-llm-evaluation/`}>{labels.caseLink}</a><a href={`${prefix}/articles/evaluating-llm-agents-against-measured-human-behavior/`}>{labels.articleLink}</a></nav><p>{labels.sourceNote}</p></footer>
  </section>;
}

export default BehaviorComparisonLab;
