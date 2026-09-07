import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { FIXTURES, getComparison } from '../features/provenance/behavior-data.js';
import { INITIAL_STATE, REJECTED_PROPOSAL, REPAIRED_PROPOSAL, validateProposal, applyProposal, simulationState, readTrace } from '../features/provenance/state.js';
import { COPY } from '../features/provenance/copy.js';

test('three corresponding fixtures retain their different failure modes', () => {
  assert.deepEqual(getComparison('direction','direction').rows.map(row => [row.reference,row.model[0]]), [[0,4],[4,0]]);
  assert.deepEqual(getComparison('groups','groups').rows.map(row => [row.reference,row.model[0]]), [[3,1],[1,3]]);
  assert.deepEqual(getComparison('repeats','repeats').overall.model, [4,4,4]);
  assert.equal(getComparison('repeats','repeats').changedRecords,8);
  assert.equal(FIXTURES.direction.version,'behavior-lab-v1');
});
test('rejected, malformed, unauthorized and unaffordable proposals never mutate state', () => {
  for (const proposal of [REJECTED_PROPOSAL,null,{},[],{action:'elevate-house',cost:2},{action:'protect-contents',cost:-1},{action:'protect-contents',cost:NaN},{action:'protect-contents',cost:2,extra:true}]) {
    assert.equal(validateProposal(proposal).accepted,false);
    assert.equal(applyProposal(INITIAL_STATE,proposal),INITIAL_STATE);
  }
  assert.deepEqual(INITIAL_STATE,{resources:6,protected:false});
});
test('repair passes all three checks before a new state is returned', () => {
  assert.deepEqual(validateProposal(REPAIRED_PROPOSAL),{format:true,permission:true,budget:true,accepted:true});
  assert.deepEqual(applyProposal(INITIAL_STATE,REPAIRED_PROPOSAL),{resources:4,protected:true});
  assert.equal(applyProposal({resources:1,protected:false},REPAIRED_PROPOSAL).protected,false);
});
test('tenure constraints and fixed river hazard hold through all five stages', () => {
  for (const tenure of ['owner','renter']) for(let stage=0;stage<5;stage++) {
    const state=simulationState(tenure,stage);
    assert.equal(state.hazard,3);
    assert.equal(state.canElevate,false);
    assert.equal(state.applied,stage===4);
    if (tenure==='renter') assert.equal(state.action,'contents');
  }
  assert.throws(()=>simulationState('unknown',1));
});
test('hash parsing supports exact existing stages and rejects unknown values', () => {
  assert.deepEqual(readTrace('#trace=simulation&stage=decision'),{lens:'simulation',stage:2});
  assert.deepEqual(readTrace('#trace=evil&stage=bad'),{lens:'evaluation',stage:0});
});
test('localized workbench copy has identical keys and synthetic boundaries', () => {
  assert.deepEqual(Object.keys(COPY.en),Object.keys(COPY['zh-TW']));
  assert.equal(COPY.en.stages.length,5);
  assert.equal(COPY['zh-TW'].stages.length,5);
  for(const copy of Object.values(COPY)) {
    assert.equal(Object.keys(copy.modes).length,3);
    assert.ok(copy.synthetic && copy.renterLimit && copy.syntheticUnits);
  }
});
test('main bundle defers workbench code and static markup remains available', () => {
  const bundle=readFileSync('assets/app.bundle.js','utf8');
  assert.ok(!bundle.includes('provenance-synthetic-v1'));
  assert.ok(!bundle.includes('pw-state-fields'));
  const manifest=JSON.parse(readFileSync('assets/provenance/manifest.json','utf8'));
  assert.match(manifest.js,/workbench-[A-Z0-9]+\.js$/);
  const html=readFileSync('index.html','utf8');
  assert.ok(html.includes('data-provenance-island'));
  assert.ok(html.includes('pw-static-flow'));
  assert.ok(html.includes(manifest.css));
});
