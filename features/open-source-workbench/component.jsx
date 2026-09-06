import React from "react";
import { ArrowUpRight, BookOpen, Network, Microscope, LayoutGrid } from "lucide-react";
import { GROUPS, getWorkbench } from "./data.js";

const ICONS = { all: LayoutGrid, research: Microscope, collaboration: Network, learning: BookOpen };

export function OpenSourceWorkbench({ locale }) {
  const labels = getWorkbench(locale);
  return <section className="oss-workbench" data-workbench data-locale={locale} data-workbench-group="all" aria-labelledby="workbench-title">
    <header><h3 id="workbench-title">{labels.title}</h3><p>{labels.intro}</p></header>
    <div className="workbench-filters" data-workbench-controls hidden role="group" aria-label={labels.filter}>
      {["all", ...GROUPS].map((group) => { const Icon = ICONS[group]; return <button type="button" key={group} data-workbench-filter={group} aria-pressed={group === "all"} aria-controls="workbench-map"><Icon size={18} aria-hidden="true" />{labels[group]}</button>; })}
    </div>
    <p className="workbench-status" data-workbench-status role="status" aria-live="polite">{labels.ready}</p>
    <div id="workbench-map" className="workbench-map">
      {GROUPS.map((group) => { const Icon = ICONS[group]; return <section className="workbench-lane" key={group} data-workbench-lane={group} aria-labelledby={`workbench-${group}`}>
        <div className="workbench-purpose"><Icon size={28} aria-hidden="true" /><h4 id={`workbench-${group}`}>{labels[group]}</h4></div>
        <svg className="workbench-connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={group === "learning" ? "M0 50H100" : "M0 50H35V25H100M35 50V75H100"} /></svg>
        <div className="workbench-projects">{labels.repos.filter((repo) => repo.group === group).map((repo) => <article className="workbench-project" key={repo.id} data-workbench-repo={repo.id} data-workbench-repo-group={group}><h5><a href={repo.href} target="_blank" rel="noopener noreferrer">{repo.id}<ArrowUpRight size={18} aria-hidden="true" /></a></h5><p>{repo.description}</p></article>)}</div>
      </section>; })}
    </div>
  </section>;
}
