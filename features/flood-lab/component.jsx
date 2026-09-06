import React, { useEffect, useReducer, useRef, useState } from "react";
import { Box, Check, RotateCcw, RotateCw, ArrowLeft, ArrowRight, Home, Waves, ShieldCheck } from "lucide-react";
import { ACTIONS, OBJECTS, floodViewModel, initialFloodState, reduceFloodState } from "./data.js";
import { FLOOD_LABELS } from "./content.js";

function FloodDiagram({ model, labels }) {
  return <figure className="flood-diagram" data-flood-fallback data-action={model.appliedAction}>
    <svg viewBox="0 0 900 380" role="img" aria-labelledby="flood-diagram-title flood-diagram-desc">
      <title id="flood-diagram-title">{labels.diagram}</title><desc id="flood-diagram-desc">{labels.diagramDescription}</desc>
      <path className="flood-ground" d="M45 115 480 40 855 160 435 335Z" />
      <path className="flood-river-bank" d="M115 97 Q320 155 425 175T780 207L722 230Q510 244 390 205T90 125Z" />
      <path className="flood-water" d={model.scenarioId === "severe" ? "M90 99Q295 129 420 161T810 195L720 258Q497 258 360 218T58 126Z" : "M112 108Q290 144 420 187T774 214L730 235Q502 244 380 205T98 126Z"} />
      <g className="flood-current"><path d="M165 128 227 146M360 175 403 188M521 220 583 230M666 224 720 222" /></g>
      <g className="flood-neighbor"><path d="m554 68 44-13 30 18-43 13Z" /><path d="m554 68 31 18v44l-31-18ZM585 86l43-13v44l-43 13Z" /><path className="flood-roof" d="m548 66 30-30 57 33-47 20Z" /></g>
      <g className="flood-neighbor"><path d="m678 104 36-10 27 15-35 12Z" /><path d="m678 104 28 17v36l-28-17ZM706 121l35-12v36l-35 12Z" /><path className="flood-roof" d="m671 102 28-25 49 28-40 18Z" /></g>
      {model.appliedAction === "elevate" && <g className="flood-stilts"><path d="M240 221v36M306 254v40M367 235v32" /></g>}
      <g className="flood-focus-house" transform={model.appliedAction === "elevate" ? "translate(0 -35)" : undefined}>
        <path d="m234 216 77-24 65 38-77 26Z" /><path className="flood-wall" d="m234 216 65 40v57l-65-39ZM299 256l77-26v57l-77 26Z" />
        <path className="flood-roof" d="m221 214 46-58 127 72-94 32Z" />
        <path className="flood-door" d="m319 270 19-6v36l-19 6Z" /><path className="flood-window" d="m252 242 20 12v17l-20-12ZM350 258l15-5v16l-15 5Z" />
      </g>
      {model.appliedAction === "prepare" && <path className="flood-preparation" d="m211 272 86 51 110-35M216 266l82 49 102-33" />}
      <path className="flood-contour" d="M95 183 144 207M474 300l55-15M739 164l45 17" />
    </svg>
    <figcaption>{labels.diagramDescription}</figcaption>
  </figure>;
}

export function HumanEnvironmentLab({ locale = "en" }) {
  const labels = FLOOD_LABELS[locale] || FLOOD_LABELS.en;
  const [state, dispatch] = useReducer(reduceFloodState, undefined, initialFloodState);
  const [enhanced, setEnhanced] = useState(false);
  const [theme, setTheme] = useState("light");
  const [reducedMotion, setReducedMotion] = useState(true);
  const [sceneStatus, setSceneStatus] = useState("idle");
  const container = useRef(null), renderer = useRef(null), epoch = useRef(0), mounted = useRef(false), loading = useRef(false);
  const model = floodViewModel(state, theme, reducedMotion);
  const latestModel = useRef(model);
  latestModel.current = model;
  const contextKey = state.scenarioId + ":" + state.tenure;

  function stopScene() {
    epoch.current++;
    loading.current = false;
    renderer.current?.dispose();
    renderer.current = null;
  }
  useEffect(() => {
    mounted.current = true;
    setEnhanced(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readTheme = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    const readMotion = () => setReducedMotion(media.matches);
    readTheme(); readMotion();
    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    media.addEventListener("change", readMotion);
    const onPageHide = () => { stopScene(); if (mounted.current) setSceneStatus("idle"); };
    window.addEventListener("pagehide", onPageHide);
    return () => { mounted.current = false; stopScene(); observer.disconnect(); media.removeEventListener("change", readMotion); window.removeEventListener("pagehide", onPageHide); };
  }, []);
  useEffect(() => {
    // A pending import must never attach a scene belonging to a previous context.
    epoch.current++;
    loading.current = false;
    setSceneStatus(renderer.current ? "ready" : "idle");
    renderer.current?.resetCamera();
  }, [contextKey]);
  useEffect(() => {
    try { renderer.current?.update(model); }
    catch { stopScene(); setSceneStatus("failed"); }
  }, [state, theme, reducedMotion]);

  async function activateScene() {
    if (loading.current || renderer.current || !mounted.current) return;
    const generation = ++epoch.current;
    loading.current = true;
    setSceneStatus("loading");
    const fail = () => {
      if (!mounted.current || generation !== epoch.current) return;
      stopScene();
      setSceneStatus("failed");
    };
    try {
      if (typeof __FLOOD_SCENE_URL__ === "undefined") throw new Error("missing_scene");
      const sceneUrl = String(__FLOOD_SCENE_URL__);
      const module = await import(sceneUrl);
      if (!mounted.current || generation !== epoch.current) return;
      const instance = module.createFloodScene(container.current, latestModel.current, {
        onSelect: (id) => { if (mounted.current) dispatch({ type: "select", value: id }); },
        onError: () => {
          if (!mounted.current || renderer.current !== instance) return;
          stopScene(); setSceneStatus("failed");
        },
      });
      renderer.current = instance;
      loading.current = false;
      setSceneStatus("ready");
    } catch { fail(); }
  }
  function reset() {
    epoch.current++;
    loading.current = false;
    setSceneStatus(renderer.current ? "ready" : "idle");
    dispatch({ type: "reset" }); renderer.current?.resetCamera();
  }
  const visibleAction = model.appliedAction;
  const physical = ["prepare", "elevate"].includes(visibleAction) ? labels[visibleAction] : labels.hold;
  return <section id="human-environment-lab" className="interactive-artifact flood-lab" data-enhanced={enhanced} data-flood-status={sceneStatus} data-flood-action={state.appliedAction} aria-labelledby="flood-lab-title">
    <header className="flood-lab-heading"><p className="flood-synthetic">{labels.synthetic}</p><h3 id="flood-lab-title">{labels.title}</h3><p>{labels.intro}</p></header>
    <div className="flood-controls" data-flood-controls>
      <label>{labels.scenario}<select aria-label={labels.scenario} data-flood-scenario value={state.scenarioId} onChange={(event) => dispatch({ type: "scenario", value: event.target.value })}><option value="moderate">{labels.moderate}</option><option value="severe">{labels.severe}</option></select></label>
      <fieldset><legend>{labels.tenure}</legend><div className="flood-segments">{["owner", "renter"].map((value) => <button key={value} type="button" data-flood-tenure={value} aria-pressed={state.tenure === value} onClick={() => dispatch({ type: "tenure", value })}>{labels[value]}</button>)}</div></fieldset>
      <label>{labels.action}<select aria-label={labels.action} data-flood-draft value={state.draftAction} onChange={(event) => dispatch({ type: "draft", value: event.target.value })}>{ACTIONS.map((value) => <option key={value} value={value} disabled={value === "elevate" && state.tenure === "renter"}>{labels[value]}</option>)}</select></label>
      <button type="button" className="button button-primary" data-flood-apply onClick={() => dispatch({ type: "apply" })}><Check size={18} aria-hidden="true" />{labels.apply}</button>
      <button type="button" className="flood-icon-button" data-flood-reset title={labels.reset} aria-label={labels.reset} onClick={reset}><RotateCcw size={20} aria-hidden="true" /></button>
    </div>
    {state.tenure === "renter" && <p className="flood-constraint">{labels.ownerOnly}</p>}
    <p className="flood-status" role="status" aria-live="polite">{labels[state.status]}</p>
    <div className="flood-comparison" data-flood-controls role="group" aria-label={labels.comparison}>{["baseline", "applied"].map((value) => <button type="button" key={value} data-flood-compare={value} aria-pressed={state.comparing === value} onClick={() => dispatch({ type: "compare", value })}>{value === "baseline" ? labels.baseline : labels.appliedView}</button>)}</div>
    <div className="flood-stage" data-scene-ready={sceneStatus === "ready"}>
      <div className="flood-canvas" ref={container} data-flood-canvas aria-hidden="true" />
      <FloodDiagram model={model} labels={labels} />
    </div>
    <div className="flood-view-controls" data-flood-controls>
      {sceneStatus !== "ready" ? <button type="button" className="button button-outline" data-flood-activate disabled={sceneStatus === "loading"} onClick={activateScene}><Box size={19} aria-hidden="true" />{sceneStatus === "loading" ? labels.loading : sceneStatus === "failed" ? labels.retry : labels.activate}</button> : <div className="flood-segments" role="group" aria-label={labels.view}>{["overview", "household", "river"].map((view) => <button type="button" key={view} data-flood-view={view} onClick={() => renderer.current?.setView(view)}>{labels[view]}</button>)}<button className="flood-icon-button" title={labels.rotateLeft} aria-label={labels.rotateLeft} onClick={() => renderer.current?.rotate(-1)}><ArrowLeft size={18} /></button><button className="flood-icon-button" title={labels.rotateRight} aria-label={labels.rotateRight} onClick={() => renderer.current?.rotate(1)}><ArrowRight size={18} /></button><button className="flood-icon-button" title={labels.resetCamera} aria-label={labels.resetCamera} onClick={() => renderer.current?.resetCamera()}><RotateCw size={18} /></button></div>}
      {sceneStatus === "failed" && <p role="status">{labels.failed}</p>}
    </div>
    <div className="flood-inspection">
      <div><div className="flood-object-controls" data-flood-controls role="group" aria-label={labels.objects}>{OBJECTS.map((object, index) => { const Icon = [Home, Waves, Home][index]; return <button type="button" key={object} data-flood-object={object} aria-pressed={state.selectedObject === object} onClick={() => dispatch({ type: "select", value: object })}><Icon size={18} aria-hidden="true" />{labels[object]}</button>; })}</div><p data-flood-explanation>{labels.explanations[state.selectedObject]}</p></div>
      <dl><div><dt>{labels.context}</dt><dd>{labels[state.scenarioId]} · {labels[state.tenure]}</dd></div><div><dt>{labels.current}</dt><dd>{labels[visibleAction]}</dd></div><div><dt>{labels.physical}</dt><dd>{physical}</dd></div><div><dt><ShieldCheck size={16} aria-hidden="true" />{labels.insurance}</dt><dd>{visibleAction === "insure" ? labels.included : labels.absent}</dd></div></dl>
    </div>
    <details className="flood-assumptions"><summary>{labels.assumptions}</summary><p>{labels.boundary}</p><p>{labels.methodology}</p><a href="https://github.com/WenyuChiou/FLOODABM" target="_blank" rel="noopener noreferrer">{labels.source}</a></details>
  </section>;
}
