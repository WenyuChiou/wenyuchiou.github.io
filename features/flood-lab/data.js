export const FLOOD_VERSION = "flood-teaching-v1";
export const SCENARIOS = ["moderate", "severe"];
export const TENURES = ["owner", "renter"];
export const ACTIONS = ["hold", "prepare", "insure", "elevate"];
export const OBJECTS = ["household", "river", "neighbors"];

export function initialFloodState(scenarioId = "moderate", tenure = "owner") {
  if (!SCENARIOS.includes(scenarioId) || !TENURES.includes(tenure)) throw new Error("invalid_context");
  return { scenarioId, tenure, fixtureVersion: FLOOD_VERSION, draftAction: "hold", appliedAction: "hold", comparing: "applied", selectedObject: "household", status: "ready" };
}

export function reduceFloodState(state, event) {
  const invalid = () => ({ ...state, status: "invalid" });
  switch (event.type) {
    case "scenario": return SCENARIOS.includes(event.value) ? initialFloodState(event.value, state.tenure) : invalid();
    case "tenure": return TENURES.includes(event.value) ? initialFloodState(state.scenarioId, event.value) : invalid();
    case "draft": return ACTIONS.includes(event.value) ? { ...state, draftAction: event.value, status: "draft" } : invalid();
    case "apply":
      if (state.fixtureVersion !== FLOOD_VERSION || !SCENARIOS.includes(state.scenarioId) || !TENURES.includes(state.tenure) || !ACTIONS.includes(state.draftAction)) return invalid();
      if (state.tenure === "renter" && state.draftAction === "elevate") return { ...state, status: "ownerOnly" };
      return { ...state, appliedAction: state.draftAction, comparing: "applied", status: "applied" };
    case "compare": return ["baseline", "applied"].includes(event.value) ? { ...state, comparing: event.value } : invalid();
    case "select": return OBJECTS.includes(event.value) ? { ...state, selectedObject: event.value } : invalid();
    case "reset": return initialFloodState();
    default: return invalid();
  }
}

export function floodViewModel(state, theme = "light", reducedMotion = false) {
  return {
    scenarioId: state.scenarioId, tenure: state.tenure, fixtureVersion: state.fixtureVersion,
    appliedAction: state.comparing === "baseline" ? "hold" : state.appliedAction,
    selectedObject: state.selectedObject, theme, reducedMotion,
  };
}
