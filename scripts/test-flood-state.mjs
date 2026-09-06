import test from 'node:test';
import assert from 'node:assert/strict';
import { FLOOD_VERSION, initialFloodState, reduceFloodState, floodViewModel } from '../features/flood-lab/data.js';

test('all sixteen controlled context/action combinations', () => {
  for (const scenarioId of ['moderate', 'severe']) for (const tenure of ['owner', 'renter']) for (const action of ['hold', 'prepare', 'insure', 'elevate']) {
    const baseline = initialFloodState(scenarioId, tenure);
    const draft = reduceFloodState(baseline, { type: 'draft', value: action });
    assert.equal(draft.appliedAction, 'hold');
    const next = reduceFloodState(draft, { type: 'apply' });
    const forbidden = tenure === 'renter' && action === 'elevate';
    assert.equal(next.status, forbidden ? 'ownerOnly' : 'applied');
    assert.equal(next.appliedAction, forbidden ? 'hold' : action);
    assert.equal(next.scenarioId, scenarioId);
    assert.equal(next.fixtureVersion, FLOOD_VERSION);
  }
});
test('rejection preserves an already applied action and is immutable', () => {
  let state = initialFloodState('severe', 'renter');
  state = reduceFloodState(reduceFloodState(state, { type: 'draft', value: 'insure' }), { type: 'apply' });
  const rejected = reduceFloodState(reduceFloodState(Object.freeze(state), { type: 'draft', value: 'elevate' }), { type: 'apply' });
  assert.equal(rejected.appliedAction, 'insure');
  assert.equal(state.draftAction, 'insure');
});
test('apply replaces rather than accumulates and is idempotent', () => {
  let state = reduceFloodState(initialFloodState(), { type: 'draft', value: 'prepare' });
  state = reduceFloodState(state, { type: 'apply' });
  assert.deepEqual(reduceFloodState(state, { type: 'apply' }), state);
  state = reduceFloodState(reduceFloodState(state, { type: 'draft', value: 'elevate' }), { type: 'apply' });
  assert.equal(state.appliedAction, 'elevate');
  assert.equal(Object.hasOwn(state, 'cost'), false);
});
test('context switch clears draft and applied snapshots and comparison', () => {
  let state = reduceFloodState(reduceFloodState(initialFloodState(), { type: 'draft', value: 'elevate' }), { type: 'apply' });
  state = reduceFloodState(state, { type: 'compare', value: 'baseline' });
  for (const event of [{ type: 'tenure', value: 'renter' }, { type: 'scenario', value: 'severe' }]) {
    const next = reduceFloodState(state, event);
    assert.equal(next.appliedAction, 'hold');
    assert.equal(next.draftAction, 'hold');
    assert.equal(next.comparing, 'applied');
  }
  assert.deepEqual(reduceFloodState(state, { type: 'reset' }), initialFloodState());
});
test('view-model excludes draft and baseline uses identical scenario/version', () => {
  const state = reduceFloodState(initialFloodState('severe', 'owner'), { type: 'draft', value: 'elevate' });
  const applied = floodViewModel(state, 'dark', true);
  const baseline = floodViewModel(reduceFloodState(state, { type: 'compare', value: 'baseline' }), 'dark', true);
  assert.deepEqual(applied, baseline);
  assert.equal(applied.appliedAction, 'hold');
  assert.equal(Object.hasOwn(applied, 'draftAction'), false);
});
test('unknown IDs, stale versions and objects cannot alter context or applied state', () => {
  for (const event of [{ type: 'scenario', value: 'unknown' }, { type: 'tenure', value: 'unknown' }, { type: 'draft', value: '<script>' }, { type: 'select', value: 'unknown' }]) {
    const next = reduceFloodState(initialFloodState(), event);
    assert.equal(next.status, 'invalid');
    assert.equal(next.scenarioId, 'moderate');
    assert.equal(next.appliedAction, 'hold');
  }
  assert.equal(reduceFloodState({ ...initialFloodState(), fixtureVersion: 'old' }, { type: 'apply' }).status, 'invalid');
});
