export const LENSES = ['evaluation', 'governance', 'simulation'];
export const STAGES = ['evidence', 'context', 'decision', 'validation', 'consequence'];
export const INITIAL_STATE = Object.freeze({ resources: 6, protected: false });
export const REJECTED_PROPOSAL = Object.freeze({ action: 'protect-contents', cost: 9 });
export const REPAIRED_PROPOSAL = Object.freeze({ action: 'protect-contents', cost: 2 });

export function validateProposal(proposal, state = INITIAL_STATE) {
  const format = proposal !== null && typeof proposal === 'object' && !Array.isArray(proposal)
    && Object.keys(proposal).length === 2 && typeof proposal.action === 'string'
    && Number.isFinite(proposal.cost) && proposal.cost >= 0;
  const permission = format && proposal.action === 'protect-contents';
  const budget = format && proposal.cost <= state.resources;
  return { format, permission, budget, accepted: Boolean(format && permission && budget) };
}

export function applyProposal(state, proposal) {
  if (!validateProposal(proposal, state).accepted) return state;
  return { resources: state.resources - proposal.cost, protected: true };
}

// Versioned teaching rules, not a hydrologic model or published results.
export function simulationState(tenure, stage) {
  if (!['owner', 'renter'].includes(tenure) || !Number.isInteger(stage) || stage < 0 || stage > 4) throw new RangeError('Invalid simulation view');
  const action = tenure === 'owner' ? 'barrier' : 'contents';
  const cost = tenure === 'owner' ? 2 : 1;
  return { version: 'provenance-synthetic-v1', action, hazard: 3, resources: stage === 4 ? 6 - cost : 6, applied: stage === 4, canElevate: false };
}

export function readTrace(hash, fallbackLens = 'evaluation') {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return { lens: LENSES.includes(params.get('trace')) ? params.get('trace') : LENSES.includes(fallbackLens) ? fallbackLens : 'evaluation', stage: Math.max(0, STAGES.indexOf(params.get('stage'))) };
}
