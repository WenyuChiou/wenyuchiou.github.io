export const SCENARIO_IDS = Object.freeze(["direction", "groups", "repeats"]);
export const LENS_IDS = Object.freeze(["direction", "groups", "repeats"]);

// These authored choices are teaching fixtures, not model calls or survey data.
function fixture(rows) {
  return Object.freeze({
    version: "behavior-lab-v1",
    evidenceKind: "synthetic",
    records: Object.freeze(rows.map(([id, group, efficacy, reference, ...runs]) =>
      Object.freeze({ id, group, efficacy, reference, runs: Object.freeze(runs) }))),
  });
}

export const FIXTURES = Object.freeze({
  direction: fixture([
    ["A1", "A", "low", 0, 1, 1, 1], ["A2", "A", "low", 0, 1, 1, 1],
    ["A3", "A", "high", 1, 0, 0, 0], ["A4", "A", "high", 1, 0, 0, 0],
    ["B1", "B", "low", 0, 1, 1, 1], ["B2", "B", "low", 0, 1, 1, 1],
    ["B3", "B", "high", 1, 0, 0, 0], ["B4", "B", "high", 1, 0, 0, 0],
  ]),
  groups: fixture([
    ["A1", "A", "low", 1, 1, 1, 1], ["A2", "A", "low", 1, 0, 0, 0],
    ["A3", "A", "high", 1, 0, 0, 0], ["A4", "A", "high", 0, 0, 0, 0],
    ["B1", "B", "low", 1, 1, 1, 1], ["B2", "B", "low", 0, 1, 1, 1],
    ["B3", "B", "high", 0, 1, 1, 1], ["B4", "B", "high", 0, 0, 0, 0],
  ]),
  repeats: fixture([
    ["A1", "A", "low", 0, 0, 1, 0], ["A2", "A", "low", 0, 0, 1, 0],
    ["A3", "A", "high", 1, 1, 0, 1], ["A4", "A", "high", 1, 1, 0, 1],
    ["B1", "B", "low", 0, 0, 1, 0], ["B2", "B", "low", 0, 0, 1, 0],
    ["B3", "B", "high", 1, 1, 0, 1], ["B4", "B", "high", 1, 1, 0, 1],
  ]),
});

const count = (records, run) => records.reduce((sum, record) => sum + (run === undefined ? record.reference : record.runs[run]), 0);

export function getComparison(scenarioId, lensId) {
  if (!SCENARIO_IDS.includes(scenarioId) || !LENS_IDS.includes(lensId)) throw new RangeError("Unknown behavior comparison state");
  const { records } = FIXTURES[scenarioId];
  const overall = { reference: count(records), model: [0, 1, 2].map((run) => count(records, run)), total: records.length };
  const rows = lensId === "repeats"
    ? [0, 1, 2].map((run) => ({
      id: `run${run + 1}`, total: records.length, reference: overall.reference,
      model: [overall.model[run]], run,
      changed: run === 0 ? 0 : records.filter((record) => record.runs[run] !== record.runs[run - 1]).length,
    }))
    : (lensId === "direction" ? ["low", "high"] : ["A", "B"]).map((id) => {
      const subset = records.filter((record) => record[lensId === "direction" ? "efficacy" : "group"] === id);
      return { id, total: subset.length, reference: count(subset), model: [0, 1, 2].map((run) => count(subset, run)) };
    });
  return {
    scenarioId, lensId, rows, overall,
    changedRecords: records.filter((record) => new Set(record.runs).size > 1).length,
    mismatches: [0, 1, 2].map((run) => records.filter((record) => record.reference !== record.runs[run]).length),
  };
}

export function selectState(state, kind, id) {
  if (kind === "scenario" && SCENARIO_IDS.includes(id)) return { ...state, scenarioId: id };
  if (kind === "lens" && LENS_IDS.includes(id)) return { ...state, lensId: id };
  if (kind === "record" && FIXTURES[state.scenarioId].records.some((record) => record.id === id)) return { ...state, selectedRecordId: id };
  return state;
}
