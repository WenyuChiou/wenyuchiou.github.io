import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../features/flood-lab/scene.js', import.meta.url), 'utf8');
const THREE = await import('three');
const baseline = { scenarioId: 'moderate', tenure: 'owner', fixtureVersion: 'flood-teaching-v1', appliedAction: 'hold', selectedObject: 'household', theme: 'light', reducedMotion: false };

class Target extends EventTarget {
  listeners = new Map();
  addEventListener(type, fn, options) { super.addEventListener(type, fn, options); this.listeners.set(fn, type); }
  removeEventListener(type, fn, options) { super.removeEventListener(type, fn, options); this.listeners.delete(fn); }
  emit(type, values = {}) { const event = new Event(type, { cancelable: true }); Object.assign(event, values); this.dispatchEvent(event); return event; }
}

function fixture(width = 1100, height = 500, options = {}) {
  const frames = new Map(), observers = [], renderers = [];
  const window = new Target(), document = new Target(), host = new Target();
  document.defaultView = window; document.hidden = false;
  host.ownerDocument = document; host.clientWidth = width; host.clientHeight = height;
  host.dataset = {}; host.children = [];
  host.appendChild = (canvas) => { host.children.push(canvas); canvas.parentNode = host; };
  let frameId = 0;
  window.devicePixelRatio = 3;
  window.requestAnimationFrame = (fn) => { frames.set(++frameId, fn); return frameId; };
  window.cancelAnimationFrame = (id) => frames.delete(id);
  window.ResizeObserver = class { constructor(callback) { this.callback = callback; observers.push(this); } observe() {} disconnect() { this.disconnected = true; } };
  window.IntersectionObserver = class extends window.ResizeObserver {};
  class Renderer {
    constructor() {
      if (options.createError) throw new Error('context unavailable');
      this.domElement = new Target(); this.domElement.style = {}; this.domElement.setAttribute = () => {};
      this.domElement.getBoundingClientRect = () => ({ left: 0, top: 0, width: host.clientWidth, height: host.clientHeight });
      this.domElement.remove = () => { host.children = host.children.filter((c) => c !== this.domElement); };
      this.renderLists = { dispose: () => { this.listsDisposed = true; } }; renderers.push(this);
    }
    setClearColor() {}
    setPixelRatio(value) { this.dpr = value; }
    setSize(w, h) { this.size = [w, h]; }
    render(scene, camera) { if (this.fail) throw new Error('draw failed'); this.scene = scene; this.camera = camera; scene.updateMatrixWorld(true); }
    dispose() { this.disposed = true; }
    forceContextLoss() { this.contextReleased = true; }
  }
  const context = vm.createContext({ THREE: { ...THREE, WebGLRenderer: Renderer } });
  vm.runInContext(source.replace(/^import \* as THREE from 'three';/m, '').replace('export function createFloodScene', 'function createFloodScene') + '\nthis.create = createFloodScene;', context);
  const errors = [], selections = [];
  const api = context.create(host, baseline, { onError: (error) => errors.push(error), onSelect: (id) => selections.push(id) });
  const flush = () => { for (const [id, fn] of [...frames]) { frames.delete(id); fn(); } };
  const visible = (value) => observers[1].callback([{ target: host, isIntersecting: value }]);
  visible(true); flush();
  return { api, host, document, window, frames, observers, renderer: renderers[0], errors, selections, flush, visible };
}

function geometry(root) {
  root.updateWorldMatrix(true, true);
  const values = [];
  root.traverse((object) => {
    if (!object.geometry) return;
    let shown = true;
    for (let parent = object; parent; parent = parent.parent) shown &&= parent.visible;
    if (shown) values.push({ name: object.name, matrix: [...object.matrixWorld.elements], position: [...object.geometry.attributes.position.array] });
  });
  return values;
}

test('frozen API and applied-action geometry invariants across sixteen contexts', () => {
  const f = fixture();
  assert.deepEqual(Object.keys(f.api).sort(), ['dispose', 'resetCamera', 'rotate', 'setView', 'update']);
  const moderateRiver = geometry(f.renderer.scene.getObjectByName('river'));
  for (const scenarioId of ['moderate', 'severe']) for (const tenure of ['owner', 'renter']) {
    const state = { ...baseline, scenarioId, tenure };
    f.api.update(state); f.flush();
    const group = (name) => f.renderer.scene.getObjectByName(name);
    const river = geometry(group('river')), neighbors = geometry(group('neighbors')), house = geometry(group('household'));
    if (scenarioId === 'severe') assert.notDeepEqual(river, moderateRiver);
    for (const appliedAction of ['hold', 'prepare', 'insure', 'elevate']) {
      f.api.update({ ...state, appliedAction }); f.flush();
      assert.deepEqual(geometry(group('river')), river);
      assert.deepEqual(geometry(group('neighbors')), neighbors);
      if (appliedAction === 'hold' || appliedAction === 'insure' || (appliedAction === 'elevate' && tenure === 'renter')) assert.deepEqual(geometry(group('household')), house);
      else assert.notDeepEqual(geometry(group('household')), house);
    }
  }
  f.api.dispose();
});

test('demand rendering coalesces, caps DPR, pauses offscreen and hidden, and resumes', () => {
  const f = fixture();
  assert.equal(f.renderer.dpr, 1.5);
  assert.equal(f.host.dataset.floodSceneReady, 'true');
  const count = Number(f.host.dataset.floodSceneRenderCount);
  f.api.update(baseline); f.api.rotate(1); f.api.rotate(-1);
  assert.equal(f.frames.size, 1); f.flush();
  assert.equal(Number(f.host.dataset.floodSceneRenderCount), count + 1);
  assert.equal(f.frames.size, 0);
  f.visible(false); f.api.update({ ...baseline, scenarioId: 'severe' }); assert.equal(f.frames.size, 0);
  f.visible(true); f.flush();
  f.document.hidden = true; f.document.emit('visibilitychange'); f.api.rotate(1); assert.equal(f.frames.size, 0);
  f.document.hidden = false; f.document.emit('visibilitychange'); assert.equal(f.frames.size, 1);
  f.api.dispose(); assert.equal(f.frames.size, 0);
});

test('camera fits all scene geometry at mobile and desktop, rotation clamps and reset restores', () => {
  for (const [width, height] of [[320, 300], [1100, 500]]) {
    const f = fixture(width, height), camera = f.renderer.camera;
    const initial = [...camera.position.toArray(), camera.left, camera.top];
    const checkFit = () => {
      const bounds = new THREE.Box3().setFromObject(f.renderer.scene);
      for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
        const projected = new THREE.Vector3(x, y, z).project(camera);
        assert.ok(Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1, `${width}: scene clipping`);
      }
    };
    checkFit();
    for (let i = 0; i < 20; i++) f.api.rotate(1);
    f.flush(); const capped = camera.position.toArray(); f.api.rotate(1); f.flush(); assert.deepEqual(camera.position.toArray(), capped);
    checkFit();
    const theta = Math.atan2(camera.position.x, camera.position.z);
    assert.ok(Math.abs(theta - Math.PI / 6) <= 35 * Math.PI / 180 + 1e-9);
    f.api.setView('household'); f.flush(); assert.notDeepEqual(camera.position.toArray(), capped);
    f.api.setView('river'); f.flush(); assert.ok(camera.projectionMatrix.elements.every(Number.isFinite));
    f.api.resetCamera(); f.flush(); assert.deepEqual([...camera.position.toArray(), camera.left, camera.top], initial);
    for (let i = 0; i < 20; i++) f.api.rotate(-1);
    f.flush(); const left = camera.position.toArray(); f.api.rotate(-1); f.flush(); assert.deepEqual(camera.position.toArray(), left); checkFit();
    f.api.rotate(0); f.api.setView('unknown'); assert.equal(f.frames.size, 0);
    f.api.dispose();
  }
});

test('selection uses three IDs, touch scroll and wheel stay native, mouse drag is bounded', () => {
  const f = fixture(), canvas = f.renderer.domElement;
  assert.ok(![...canvas.listeners.values()].some((type) => /wheel|touch/.test(type)));
  const initial = f.renderer.camera.position.toArray();
  for (const type of ['pointerdown', 'pointermove', 'pointerup']) {
    const event = canvas.emit(type, { pointerType: 'touch', pointerId: 1, button: 0, isPrimary: true, clientX: 200, clientY: 150 });
    assert.equal(event.defaultPrevented, false);
  }
  f.flush(); assert.deepEqual(f.renderer.camera.position.toArray(), initial);
  f.renderer.scene.updateMatrixWorld(true);
  const center = new THREE.Vector3(2.7, 1.0, 1.5).project(f.renderer.camera);
  const pointer = { pointerType: 'mouse', pointerId: 2, button: 0, isPrimary: true, clientX: (center.x + 1) * 550, clientY: (1 - center.y) * 250 };
  canvas.emit('pointerdown', pointer); canvas.emit('pointerup', pointer);
  assert.equal(f.selections.at(-1), 'household');
  for (const [id, position] of [['river', [0, 0.13, -0.8]], ['neighbors', [-3.9, 1, 1.3]]]) {
    const projected = new THREE.Vector3(...position).project(f.renderer.camera);
    const click = { ...pointer, clientX: (projected.x + 1) * 550, clientY: (1 - projected.y) * 250 };
    canvas.emit('pointerdown', click); canvas.emit('pointerup', click); assert.equal(f.selections.at(-1), id);
  }
  canvas.emit('pointerdown', pointer); canvas.emit('pointermove', { ...pointer, clientX: pointer.clientX + 10000 }); canvas.emit('pointerup', { ...pointer, clientX: pointer.clientX + 10000 });
  f.flush(); assert.notDeepEqual(f.renderer.camera.position.toArray(), initial);
  assert.equal(f.selections.length, 3);
  f.api.dispose();
});

test('context and render failures report once and release every resource/listener', () => {
  for (const failure of ['context', 'render']) {
    const f = fixture(), resources = new Set();
    f.renderer.scene.traverse((object) => { if (object.geometry) resources.add(object.geometry); if (object.material) resources.add(object.material); });
    let released = 0;
    for (const resource of resources) resource.addEventListener('dispose', () => released++);
    if (failure === 'context') f.renderer.domElement.emit('webglcontextlost');
    else { f.renderer.fail = true; f.api.rotate(1); f.flush(); }
    assert.equal(f.errors.length, 1); assert.equal(released, resources.size);
    assert.equal(f.host.children.length, 0); assert.equal(f.frames.size, 0);
    assert.ok(f.renderer.disposed && f.renderer.listsDisposed && f.renderer.contextReleased);
    assert.ok(f.observers.every((observer) => observer.disconnected));
    assert.equal(f.window.listeners.size + f.document.listeners.size + f.renderer.domElement.listeners.size, 0);
    assert.equal(f.host.dataset.floodSceneDisposed, 'true');
    f.api.dispose(); f.api.update(baseline); f.api.rotate(1); f.flush(); assert.equal(f.errors.length, 1);
    f.visible(true); f.observers[0].callback(); assert.equal(f.frames.size, 0);
  }
  assert.throws(() => fixture(320, 300, { createError: true }), /context unavailable/);
});

test('zero-size resize recovers and reduced-motion updates remain immediate', () => {
  const f = fixture();
  f.host.clientWidth = 0; f.observers[0].callback(); f.api.update({ ...baseline, reducedMotion: true, appliedAction: 'prepare' });
  assert.equal(f.frames.size, 0);
  assert.equal(f.renderer.scene.getObjectByName('preparedness').visible, true);
  f.host.clientWidth = 320; f.host.clientHeight = 300; f.observers[0].callback(); f.flush();
  assert.deepEqual(f.renderer.size, [320, 300]); assert.equal(f.frames.size, 0);
  f.api.dispose();
});

test('module is isolated, deterministic, and has no continuous animation or service imports', async () => {
  const module = await import('../features/flood-lab/scene.js');
  assert.deepEqual(Object.keys(module), ['createFloodScene']);
  assert.deepEqual([...source.matchAll(/^import .* from ['"]([^'"]+)['"]/gm)].map((match) => match[1]), ['three']);
  assert.doesNotMatch(source, /\bfetch\s*\(|Math\.random|setInterval|setAnimationLoop|atlas|Turnstile|NVIDIA/);
});
