import * as THREE from 'three';

const PALETTES = {
  light: { earth: 0xd6dbd6, strata: 0xaab7b5, ground: 0xe7ebe4, bank: 0xbfcbbd, contour: 0xa7b8ab, path: 0xf6f7f3, wall: 0xf7f7f3, roof: 0x546b74, trim: 0xdbe4e2, glass: 0x75afbf, door: 0x397b74, water: 0x459dc2, flow: 0xc5edf2, trunk: 0x7d8980, leaf: 0x7c9b81, leafLight: 0xa8b994, preparation: 0xc39257, ink: 0x527275, selection: 0x157b74 },
  dark: { earth: 0x48564e, strata: 0x34434a, ground: 0x667765, bank: 0x869278, contour: 0x91a68c, path: 0xaabbb0, wall: 0xd4dfd7, roof: 0x668798, trim: 0xa7bdba, glass: 0x83c5d2, door: 0x469e90, water: 0x398eb6, flow: 0xb5e7f1, trunk: 0x62746a, leaf: 0x779a7c, leafLight: 0x9db68d, preparation: 0xd1ac76, ink: 0xc3d2cb, selection: 0x7ae1c4 },
};
const SURFACE = 0.3;
const MAX_ROTATION = 35 * Math.PI / 180;
const centerline = (x) => -0.8 + Math.sin(x * 0.55) * 0.3;

export function createFloodScene(host, viewModel, { onSelect, onError } = {}) {
  const document = host.ownerDocument;
  const window = document.defaultView;
  const geometries = new Set(), materials = new Map(), textures = new Set();
  const listeners = [], pickables = [];
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, 0.1, 100);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let renderer, canvas, resizeObserver, intersectionObserver, overviewBounds;
  let state = { ...viewModel }, view = 'overview', rotation = 0;
  let disposed = false, visible = !window.IntersectionObserver, failed = false;
  let frame = null, pointerStart = null, width = 0, height = 0, renderCount = 0;
  let river, household, neighbors, structure, stilts, preparation, waterGeometry, flowGeometry;
  let selectionHouse, selectionRiver, selectionNeighbors;

  host.dataset.floodSceneReady = 'false';
  host.dataset.floodSceneDisposed = 'false';
  host.dataset.floodSceneRenderCount = '0';

  function listen(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    listeners.push(() => target.removeEventListener(type, callback, options));
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    host.dataset.floodSceneReady = 'false';
    host.dataset.floodSceneDisposed = 'true';
    pointerStart = null;
    // Continue releasing the remaining GPU/DOM resources if one driver call fails.
    const release = (fn) => { try { fn(); } catch { /* Context loss can make GPU cleanup unavailable. */ } };
    release(cancelFrame);
    release(() => resizeObserver?.disconnect());
    release(() => intersectionObserver?.disconnect());
    for (const remove of listeners.splice(0)) release(remove);
    for (const material of materials.keys()) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
    for (const texture of textures) release(() => texture.dispose());
    for (const geometry of geometries) release(() => geometry.dispose());
    for (const material of materials.keys()) release(() => material.dispose());
    release(() => scene.clear());
    release(() => renderer?.renderLists.dispose());
    release(() => renderer?.dispose());
    release(() => renderer?.forceContextLoss());
    release(() => canvas?.remove());
    geometries.clear(); materials.clear(); textures.clear(); pickables.length = 0;
  }

  function fail(error) {
    if (failed || disposed) return;
    failed = true;
    dispose();
    onError?.(error);
  }

  function guarded(callback) {
    if (disposed) return;
    try { callback(); } catch (error) { fail(error); }
  }

  function group(name, parent = scene) {
    const value = new THREE.Group(); value.name = name; parent.add(value); return value;
  }

  function material(role, line = false, options = {}) {
    const color = PALETTES.light[role];
    const value = line ? new THREE.LineBasicMaterial({ color, ...options }) : new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, ...options });
    materials.set(value, role); return value;
  }

  function mesh(geometry, finish, parent, position = [0, 0, 0]) {
    geometries.add(geometry);
    const value = new THREE.Mesh(geometry, finish); value.position.set(...position); parent.add(value); return value;
  }

  function box(size, position, finish, parent) { return mesh(new THREE.BoxGeometry(...size), finish, parent, position); }

  function line(points, finish, parent, closed = false) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p)));
    geometries.add(geometry);
    const value = closed ? new THREE.LineLoop(geometry, finish) : new THREE.Line(geometry, finish);
    parent.add(value); return value;
  }

  function slab(points, bottom, depth, finish, parent) {
    const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2); return mesh(geometry, finish, parent, [0, bottom, 0]);
  }

  function house(x, z, scale, parent, paint) {
    const root = group('residence', parent); root.position.set(x, SURFACE, z); root.scale.setScalar(scale);
    box([1.65, 0.14, 1.45], [0, 0.07, 0], paint.trim, root);
    const building = group('structure', root);
    box([1.4, 0.96, 1.15], [0, 0.62, 0], paint.wall, building);
    const roof = new THREE.BufferGeometry();
    roof.setAttribute('position', new THREE.Float32BufferAttribute([-0.86, 1.08, -0.73, 0.86, 1.08, -0.73, 0, 1.68, -0.73, -0.86, 1.08, 0.73, 0.86, 1.08, 0.73, 0, 1.68, 0.73], 3));
    roof.setIndex([0, 2, 1, 3, 4, 5, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 4, 0, 1, 4, 0, 4, 3]);
    roof.computeVertexNormals(); mesh(roof, paint.roof, building);
    box([0.07, 0.065, 1.53], [0, 1.68, 0], paint.trim, building);
    box([0.3, 0.58, 0.055], [0.05, 0.43, 0.596], paint.door, building);
    box([0.035, 0.04, 0.035], [0.15, 0.43, 0.635], paint.preparation, building);
    for (const xWindow of [-0.46, 0.47]) {
      box([0.31, 0.34, 0.055], [xWindow, 0.73, 0.596], paint.trim, building);
      box([0.23, 0.26, 0.025], [xWindow, 0.73, 0.635], paint.glass, building);
      box([0.025, 0.26, 0.035], [xWindow, 0.73, 0.65], paint.trim, building);
      box([0.34, 0.05, 0.1], [xWindow, 0.54, 0.62], paint.trim, building);
    }
    for (const xSide of [-0.715, 0.715]) {
      box([0.04, 0.35, 0.43], [xSide, 0.72, -0.05], paint.trim, building);
      box([0.055, 0.27, 0.33], [xSide, 0.72, -0.05], paint.glass, building);
    }
    box([0.19, 0.47, 0.23], [-0.44, 1.36, -0.28], paint.wall, building);
    box([0.25, 0.08, 0.29], [-0.44, 1.62, -0.28], paint.trim, building);
    return { root, building };
  }

  function updateWater() {
    const severe = state.scenarioId === 'severe';
    const y = severe ? 0.38 : 0.13, halfWidth = severe ? 0.76 : 0.54;
    for (let i = 0; i <= 64; i++) {
      const x = -6.15 + i / 64 * 12.3;
      for (let side = 0; side < 2; side++) waterGeometry.attributes.position.setXYZ(i * 2 + side, x, y, centerline(x) + (side ? 1 : -1) * halfWidth);
    }
    for (let i = 0; i < 12; i++) {
      const x = -5.6 + i * 0.98, z = centerline(x) + (i % 2 ? 0.19 : -0.19);
      const points = [[x - 0.21, y + 0.012, z], [x + 0.21, y + 0.012, z], [x + 0.21, y + 0.012, z], [x + 0.1, y + 0.012, z - 0.06]];
      points.forEach((point, n) => flowGeometry.attributes.position.setXYZ(i * 4 + n, ...point));
    }
    for (const geometry of [waterGeometry, flowGeometry]) {
      geometry.attributes.position.needsUpdate = true; geometry.computeBoundingSphere(); geometry.computeBoundingBox();
    }
    waterGeometry.computeVertexNormals();
  }

  function fitCamera() {
    if (!width || !height || !overviewBounds) return;
    let bounds = overviewBounds;
    if (view === 'household') bounds = new THREE.Box3(new THREE.Vector3(0.65, -0.35, -0.15), new THREE.Vector3(4.85, 3.4, 3.5));
    if (view === 'river') bounds = new THREE.Box3(new THREE.Vector3(-6.4, -0.4, -2.15), new THREE.Vector3(6.4, 0.65, 0.65));
    const target = bounds.getCenter(new THREE.Vector3());
    const azimuth = Math.PI / 6 + rotation;
    camera.position.copy(target).add(new THREE.Vector3(Math.sin(azimuth) * 18, 16, Math.cos(azimuth) * 18));
    camera.up.set(0, 1, 0); camera.lookAt(target); camera.updateMatrixWorld(true);
    let extentX = 0, extentY = 0;
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const point = new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse);
      extentX = Math.max(extentX, Math.abs(point.x)); extentY = Math.max(extentY, Math.abs(point.y));
    }
    const aspect = width / height, halfHeight = Math.max(extentY, extentX / aspect) * 1.075;
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight; camera.updateProjectionMatrix();
  }

  function cancelFrame() { if (frame !== null) window.cancelAnimationFrame(frame); frame = null; }

  function requestRender() {
    if (disposed || !visible || document.hidden || !width || !height || frame !== null) return;
    frame = window.requestAnimationFrame(() => {
      frame = null;
      if (disposed || !visible || document.hidden || !width || !height) return;
      guarded(() => {
        renderer.render(scene, camera);
        host.dataset.floodSceneRenderCount = String(++renderCount);
        host.dataset.floodSceneReady = 'true';
      });
    });
  }

  function resize() {
    width = Math.max(0, host.clientWidth); height = Math.max(0, host.clientHeight);
    if (!width || !height) { cancelFrame(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false); fitCamera(); requestRender();
  }

  function update(next) {
    const oldScenario = state.scenarioId; state = { ...next };
    const palette = PALETTES[state.theme] || PALETTES.light;
    for (const [finish, role] of materials) finish.color.setHex(palette[role]);
    // The parent validates actions; this presentation never derives costs or outcomes.
    const elevated = state.appliedAction === 'elevate' && state.tenure === 'owner';
    structure.position.y = elevated ? 0.85 : 0;
    stilts.visible = elevated; preparation.visible = state.appliedAction === 'prepare';
    selectionHouse.visible = state.selectedObject === 'household';
    selectionRiver.visible = state.selectedObject === 'river';
    selectionNeighbors.visible = state.selectedObject === 'neighbors';
    if (oldScenario !== state.scenarioId) updateWater();
    requestRender();
  }

  function pointerDown(event) {
    pointerStart = null;
    if (event.button !== 0 || event.isPrimary === false) return;
    const rect = canvas.getBoundingClientRect();
    pointerStart = { id: event.pointerId, type: event.pointerType, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, rotation, dragged: false };
  }

  function pointerMove(event) {
    const start = pointerStart;
    if (!start || start.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) <= 6) return;
    start.dragged = true;
    if (start.type !== 'mouse') return;
    guarded(() => { rotation = THREE.MathUtils.clamp(start.rotation + (event.clientX - start.x) * 0.004, -MAX_ROTATION, MAX_ROTATION); fitCamera(); requestRender(); });
  }

  function pointerUp(event) {
    const start = pointerStart; pointerStart = null;
    if (!start || start.id !== event.pointerId || event.button !== 0 || start.dragged || disposed) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6 || Math.abs(rect.top - start.top) > 2 || Math.abs(rect.left - start.left) > 2) return;
    guarded(() => {
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      scene.updateMatrixWorld(true); raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickables, false)[0];
      if (hit) onSelect?.(hit.object.userData.floodSelection);
    });
  }

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0x000000, 0);
    canvas = renderer.domElement; canvas.style.display = 'block'; canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.setAttribute('aria-hidden', 'true');
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x8eaaa0, 2.3);
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-5, 12, 7); scene.add(hemisphere, sun);
    const paint = Object.fromEntries(Object.keys(PALETTES.light).map((role) => [role, material(role)]));
    const contourPaint = material('contour', true), outlinePaint = material('selection', true), flowPaint = material('flow', true);
    const terrain = group('terrain'); river = group('river'); neighbors = group('neighbors'); household = group('household');
    const selection = group('selection'); selectionHouse = group('household-outline', selection); selectionRiver = group('river-outline', selection); selectionNeighbors = group('neighbors-outline', selection);
    const boundary = [[-6.4, -3.3], [-5.8, -3.7], [4.9, -3.7], [6.4, -3.0], [6.4, 3.0], [5.8, 3.7], [-5.7, 3.7], [-6.4, 3.1]];
    slab(boundary, -0.58, 0.22, paint.strata, terrain); slab(boundary, -0.36, 0.35, paint.earth, terrain);
    for (const side of [-1, 1]) {
      const inner = Array.from({ length: 65 }, (_, i) => { const x = -6.15 + i / 64 * 12.3; return [x, centerline(x) + side * 0.8]; });
      const outer = side === -1 ? [[6.15, -3.1], [5.1, -3.55], [-5.65, -3.55], [-6.15, -3.1]] : [[6.15, 3.0], [5.7, 3.55], [-5.65, 3.55], [-6.15, 3.05]];
      slab([...inner, ...outer], -0.01, SURFACE + 0.01, paint.ground, terrain);
      line(inner.map(([x, z]) => [x, SURFACE + 0.012, z]), contourPaint, terrain);
      for (const offset of [0.98, 1.12]) line(inner.map(([x]) => [x, SURFACE + 0.016, centerline(x) + side * offset]), contourPaint, terrain);
      line(inner.map(([x, z]) => [x, 0.43, z]), outlinePaint, selectionRiver);
      for (let i = 0; i < 14; i++) {
        const x = -5.9 + i * 0.91, z = centerline(x) + side * 0.86;
        const stone = mesh(new THREE.DodecahedronGeometry(0.1, 0), paint.bank, terrain, [x, SURFACE + 0.018, z]); stone.scale.set(1.5, 0.55, 0.9);
      }
    }
    for (const [z, start, end] of [[2.83, -4.8, 4.7], [-2.9, -4.8, 3.7]]) {
      line([[start, SURFACE + 0.012, z], [end, SURFACE + 0.012, z]], contourPaint, terrain);
      box([end - start, 0.012, 0.15], [(start + end) / 2, SURFACE + 0.008, z + 0.15], paint.path, terrain);
    }
    waterGeometry = new THREE.BufferGeometry(); waterGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(130 * 3), 3));
    const indices = []; for (let i = 0; i < 64; i++) { const n = i * 2; indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
    waterGeometry.setIndex(indices); const water = mesh(waterGeometry, paint.water, river); water.userData.floodSelection = 'river'; pickables.push(water);
    flowGeometry = new THREE.BufferGeometry(); flowGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12 * 4 * 3), 3)); geometries.add(flowGeometry);
    river.add(new THREE.LineSegments(flowGeometry, flowPaint));
    const focal = house(2.7, 1.5, 1, household, paint); structure = focal.building;
    stilts = group('stilts', focal.root);
    for (const x of [-0.57, 0.57]) for (const z of [-0.45, 0.45]) box([0.13, 0.85, 0.13], [x, 0.565, z], paint.trim, stilts);
    preparation = group('preparedness', focal.root);
    for (const [x, y, z] of [[-0.64, 0.2, 0.97], [-0.26, 0.2, 0.97], [-0.64, 0.48, 0.97]]) {
      box([0.32, 0.24, 0.3], [x, y, z], paint.preparation, preparation);
      box([0.12, 0.035, 0.02], [x, y + 0.035, z + 0.16], paint.ink, preparation);
      box([0.34, 0.035, 0.32], [x, y + 0.13, z], paint.trim, preparation);
    }
    const neighborSites = [[-3.9, 1.3, 0.75], [-1.35, 2.0, 0.7], [-3.1, -2.6, 0.63], [0.1, -2.65, 0.7], [3.65, -2.3, 0.75]];
    const hitPaint = material('ground', false, { transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
    const pickLayer = group('pick-targets');
    const hitHouse = (x, z, scale, id) => { const target = box([2.1 * scale, 3, 2.1 * scale], [x, 1.4, z], hitPaint, pickLayer); target.userData.floodSelection = id; pickables.push(target); };
    const outline = (x, z, scale, parent) => line(Array.from({ length: 49 }, (_, i) => { const a = i / 48 * Math.PI * 2; return [x + Math.cos(a) * scale, SURFACE + 0.025, z + Math.sin(a) * scale * 0.82]; }), outlinePaint, parent);
    outline(2.7, 1.5, 1.36, selectionHouse); hitHouse(2.7, 1.5, 1, 'household');
    for (const [x, z, scale] of neighborSites) { house(x, z, scale, neighbors, paint); outline(x, z, scale * 1.36, selectionNeighbors); hitHouse(x, z, scale, 'neighbors'); }
    const vegetation = group('vegetation', terrain);
    for (const [x, z, scale] of [[-5.35, 2.35, 0.85], [-4.8, -2.5, 0.7], [-1.7, -3.1, 0.55], [1.6, -2.8, 0.8], [5.1, -2.55, 0.75], [5.25, 2.65, 0.95], [0.25, 3.1, 0.55], [-3.5, 3.05, 0.65]]) {
      mesh(new THREE.CylinderGeometry(0.045 * scale, 0.065 * scale, 0.6 * scale, 7), paint.trunk, vegetation, [x, SURFACE + 0.3 * scale, z]);
      const crown = mesh(new THREE.IcosahedronGeometry(0.43 * scale, 1), paint.leaf, vegetation, [x, SURFACE + 0.79 * scale, z]); crown.scale.set(0.9, 1.2, 0.9);
      mesh(new THREE.IcosahedronGeometry(0.25 * scale, 0), paint.leafLight, vegetation, [x + 0.18 * scale, SURFACE + 0.75 * scale, z + 0.09]);
    }
    for (const [x, z] of [[-5.5, 0.4], [4.7, 1.3], [-0.15, 1.1]]) {
      box([0.7, 0.08, 0.18], [x, SURFACE + 0.2, z], paint.path, terrain);
      for (const offset of [-0.25, 0.25]) box([0.05, 0.18, 0.15], [x + offset, SURFACE + 0.09, z], paint.trunk, terrain);
    }
    updateWater(); update(state);
    // Include hidden action details and picking volumes to keep overview framing stable.
    overviewBounds = new THREE.Box3().setFromObject(scene);
    overviewBounds.max.y = Math.max(overviewBounds.max.y, SURFACE + 1.75 + 0.85);
    host.appendChild(canvas);
    for (const [type, handler] of [['pointerdown', pointerDown], ['pointermove', pointerMove], ['pointerup', pointerUp], ['pointercancel', () => { pointerStart = null; }], ['pointerleave', () => { pointerStart = null; }]]) listen(canvas, type, handler, { passive: true });
    listen(canvas, 'webglcontextlost', (event) => { event.preventDefault(); fail(new Error('flood_scene_context_lost')); });
    listen(document, 'visibilitychange', () => { pointerStart = null; if (document.hidden) cancelFrame(); else requestRender(); });
    listen(window, 'resize', () => guarded(resize), { passive: true });
    if (window.ResizeObserver) { resizeObserver = new window.ResizeObserver(() => guarded(resize)); resizeObserver.observe(host); }
    if (window.IntersectionObserver) {
      intersectionObserver = new window.IntersectionObserver((entries) => {
        if (disposed) return;
        visible = entries.some((entry) => entry.target === host && entry.isIntersecting);
        if (visible) requestRender(); else { pointerStart = null; cancelFrame(); }
      }); intersectionObserver.observe(host);
    }
    resize();
  } catch (error) { dispose(); throw error; }

  return {
    update(next) { guarded(() => update(next)); },
    setView(next) { if (!['overview', 'household', 'river'].includes(next)) return; guarded(() => { view = next; fitCamera(); requestRender(); }); },
    rotate(direction) { if (direction !== -1 && direction !== 1) return; guarded(() => { rotation = THREE.MathUtils.clamp(rotation + direction * 10 * Math.PI / 180, -MAX_ROTATION, MAX_ROTATION); fitCamera(); requestRender(); }); },
    resetCamera() { guarded(() => { view = 'overview'; rotation = 0; fitCamera(); requestRender(); }); },
    dispose,
  };
}
