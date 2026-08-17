// app.jsx — page components + client interactivity.
// S5: homepage blocks 1–8 (IA §2), nav + footer (IA §5), components per VDS §5.6.
// S6: ModeSwitch v2 (IA §7) — URL param > stored preference > industry default.
//
// Every rendered content string comes from CONTENT (content.js). This file holds
// only markup shape, UI-chrome labels, and behavior — never canonical copy.
//
// MPA architecture: PAGES is a registry keyed by the data-page attribute on
// <body> (or #root), defaulting to "home". Each route is a full page load;
// React hydrates interactivity. S7 adds Research / Engineering / Publications /
// CaseStudy components to the registry; S8 prerenders every registered page to
// a static route (prerender.mjs imports App, so module scope must stay
// SSR-safe — no top-level document/window access outside the mount guard).

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { CONTENT } from "./content.js";
import { Icons } from "./icons.jsx";

/* ---------------------------------------------------------------------------
 * Mode model (IA §7). Two reading paths; internal ids industry / academic.
 * Audience-facing labels name the content, not the reader's employer.
 * Precedence: ?path= URL param > localStorage "wy-mode" > default "industry".
 * The stored preference is written ONLY when the user toggles (IA §7.2).
 * ------------------------------------------------------------------------- */
const MODES = ["industry", "academic"];
const PATH_PARAM_TO_MODE = { research: "academic", engineering: "industry" };
const MODE_LABELS = {
  academic: { full: "Research view", short: "Research" },
  industry: { full: "Industry view", short: "Industry" },
};

const EVIDENCE_MAP = CONTENT.evidenceMap;

function resolveInitialMode() {
  try {
    const param = new URLSearchParams(window.location.search).get("path");
    if (param && PATH_PARAM_TO_MODE[param]) return PATH_PARAM_TO_MODE[param];
    const stored = window.localStorage.getItem("wy-mode");
    if (MODES.indexOf(stored) !== -1) return stored;
  } catch (e) { /* storage/URL unavailable — fall through to default */ }
  return "industry";
}

function resolveInitialTheme() {
  try {
    const stored = window.localStorage.getItem("wy-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch (e) { /* storage unavailable */ }
  return "light";
}

/* ---------------------------------------------------------------------------
 * Homepage section table. Ids double as scroll targets for the command
 * palette. Selected-engineering / selected-research swap order with the mode
 * (IA §7.3); everything else is order-invariant. Pillar order NEVER changes.
 * ------------------------------------------------------------------------- */
const SEC = {
  top: { id: "top", label: "Identity" },
  approach: { id: "approach", label: "Research approach" },
  work: { id: "work", label: "Selected work" },
  now: { id: "now", label: "Current work" },
  // Retained for the older, currently unused homepage block components.
  engineering: { id: "selected-engineering", label: "Selected engineering" },
  research: { id: "selected-research", label: "Selected research" },
  focus: { id: "focus", label: "Current focus" },
  documents: { id: "documents", label: "Documents" },
  contact: { id: "contact", label: "Contact" },
};

function homeSections(mode) {
  return [SEC.top, SEC.approach, SEC.work, SEC.now, SEC.documents, SEC.contact];
}

function resolveEvidenceFocus(fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const focus = new URLSearchParams(window.location.search).get("focus");
    return EVIDENCE_MAP.nodes.some((node) => node.id === focus) ? focus : fallback;
  } catch (e) {
    return fallback;
  }
}

/* --------------------------------- primitives ---------------------------- */

// The evidence link — the site's signature device (VDS §5.6.2): mono, --signal,
// trailing arrow, underline on hover only.
function EvidenceLink({ href, children }) {
  const external = /^https?:/.test(href);
  return (
    <a className="evidence-link" href={href} rel={external ? "noopener" : undefined}>
      {children}
      <span className="evidence-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

// Display text for a pillar's evidence link, derived from its target
// (labels per VDS §5.6.2's pillar table).
function evidenceText(href) {
  if (href.indexOf("https://doi.org/") === 0) return "DOI " + href.slice("https://doi.org/".length);
  if (href.indexOf("https://pypi.org/") === 0) return "pypi.org listing";
  if (href.indexOf("/engineering/") === 0) return "merged PRs";
  try { return new URL(href, "https://wenyuchiou.github.io").host; } catch (e) { return href; }
}

// Section head: margin-rail number (mono micro) + serif h2 (VDS §5.7.2).
function SectionHead({ num, title }) {
  return (
    <div className="section-head">
      <span className="section-num" aria-hidden="true">{num}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function QuietLinks() {
  const M = CONTENT.meta;
  return (
    <p className="quiet-links">
      <a className="quiet-link" href={M.github} rel="noopener">GitHub</a>
      <span className="link-sep" aria-hidden="true">·</span>
      <a className="quiet-link" href={M.orcid} rel="noopener">ORCID</a>
    </p>
  );
}

/* ------------------------------- mode switch ----------------------------- */
// Accessible radiogroup (VDS §5.6.8): two options, roving tabindex, arrow-key
// navigation (selection follows focus, WAI-ARIA radio-group pattern).
// aria-labels carry the full locked path names; visible labels are short at
// desktop widths and full-length inside the mobile menu (CSS swaps the spans).
function ModeSwitch({ mode, onModeChange }) {
  const refs = useRef({});
  const options = ["academic", "industry"]; // Research & Academic Work | AI, Engineering & Systems

  const move = (delta) => {
    const idx = options.indexOf(mode);
    const next = options[(idx + delta + options.length) % options.length];
    onModeChange(next);
    const el = refs.current[next];
    if (el) el.focus();
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1); }
  };

  return (
    <div className="mode-switch" role="radiogroup" aria-label="Reading path">
      {options.map((value) => {
        const active = mode === value;
        return (
          <button
            key={value}
            ref={(el) => { refs.current[value] = el; }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={MODE_LABELS[value].full}
            tabIndex={active ? 0 : -1}
            className={"mode-option" + (active ? " is-active" : "")}
            onClick={() => onModeChange(value)}
            onKeyDown={onKeyDown}
          >
            <span className="mode-label-short" aria-hidden="true">{MODE_LABELS[value].short}</span>
            <span className="mode-label-full" aria-hidden="true">{MODE_LABELS[value].full}</span>
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle({ theme, onThemeChange }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => onThemeChange(dark ? "light" : "dark")}
    >
      {dark ? Icons.sun : Icons.moon}
    </button>
  );
}

/* ------------------------------- nav / footer ---------------------------- */
// Header per IA §5.1: wordmark, three nav links, mode toggle, single mailto CTA.
// Exactly ONE filled .btn-primary per page (visual-gate invariant): on home it
// is the contact block's button (VDS §5.6.7), so the header CTA is outline
// there; on every other page the header CTA is the filled one.
function Nav({ page, mode, onModeChange, theme, onThemeChange }) {
  const M = CONTENT.meta;
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Approach", href: "/#approach" },
    { label: "Work", href: "/engineering/?path=engineering#industry", page: "engineering", anchor: "industry" },
    { label: "Research", href: "/research/?path=research#academic", page: "research", anchor: "academic" },
    { label: "Publications", href: "/publications/", page: "publications" },
    { label: "Resume", href: CONTENT.documents.industry.file, download: true },
  ];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="wrap nav-inner">
        <a className="wordmark" href="/" aria-current={page === "home" ? "page" : undefined}>{M.name}</a>
        <nav className={"site-nav" + (open ? " is-open" : "")} aria-label="Site">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  className={
                    "nav-link" +
                    (l.anchor === mode ? " is-path-primary" : "") +
                    (l.page === page ? " is-current" : "")
                  }
                  aria-current={l.page === page ? "page" : undefined}
                  href={l.href}
                  download={l.download || undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-menu-extras">
            <ModeSwitch mode={mode} onModeChange={onModeChange} />
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          </div>
        </nav>
        <div className="nav-tools">
          <ModeSwitch mode={mode} onModeChange={onModeChange} />
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
        {/* Home's one filled CTA lives in the contact block; every other page's
            one filled CTA is this header button (visual gate: exactly one per page). */}
        <a className={"btn nav-cta " + (page === "home" ? "btn-outline" : "btn-primary")} href={"mailto:" + M.email}>Email me</a>
        <button
          type="button"
          className="nav-menu-btn"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? Icons.close : Icons.menu}
        </button>
      </div>
    </header>
  );
}

// Footer per IA §5.2 — identical on all pages; links are navigation, not CTAs.
function Footer() {
  const F = CONTENT.footer;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="footer-line1">{F.line1}</p>
        <ul className="footer-links">
          {F.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} rel={/^https?:/.test(l.href) ? "noopener" : undefined}>{l.label}</a>
            </li>
          ))}
        </ul>
        <p className="footer-line3">
          <a className="quiet-link" href={"mailto:" + F.email}>{F.email}</a>
          <span className="link-sep" aria-hidden="true">·</span>
          <span>{F.copyright}</span>
        </p>
      </div>
    </footer>
  );
}

/* ----------------------------- homepage blocks --------------------------- */

// Blocks 1–2 (IA §2): identity + value proposition. The h1 is the name; the
// umbrella line is a serif standfirst <p>; the dialect subline is the ONE
// mode-varying line (both variants canonical). Availability per VDS §5.6.1.
function Hero({ mode }) {
  const M = CONTENT.meta;
  const H = CONTENT.hero;
  return (
    <section id="top" className="wrap hero lab-hero" aria-labelledby="hero-title">
      <div className="hero-grid lab-hero-grid">
        <div className="hero-text lab-hero-copy">
          <p className="hero-eyebrow">{M.titleLine}</p>
          <p className="hero-index">01 / RESEARCH ENGINEERING</p>
          <h1 id="hero-title" className="hero-name">{M.name}</h1>
          <p className="hero-standfirst">{H.umbrella}</p>
          <p className="hero-dialect">{H.dialect[mode] || H.dialect.industry}</p>
          <p className="hero-lede">{H.workingFormulation}</p>
          <div className="hero-actions">
            <a className="btn btn-outline" href="#approach">Explore the research<span aria-hidden="true"> ↓</span></a>
            <a className="btn btn-outline" href={CONTENT.documents.industry.file} download>Industry resume<span aria-hidden="true"> ↗</span></a>
          </div>
          <p className="availability"><span className="signal-dot" aria-hidden="true"></span>{H.availability}</p>
          <div className="hero-facts" aria-label="Selected metrics">
            {H.facts.map((fact) => (
              <div className="hero-fact" key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
          <QuietLinks />
        </div>
        {H.portrait ? (
          <figure className="hero-portrait lab-portrait">
            <img src={H.portrait.src} alt={H.portrait.alt} width="560" height="751" loading="eager" fetchPriority="high" />
            <figcaption>Field note / AGU 2025</figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

function LabSectionHead({ id, num, title, intro }) {
  return (
    <div className="lab-section-head">
      <p className="lab-section-kicker">{num} / {title}</p>
      <h2 id={id + "-title"}>{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}

function EvidenceMap({ mode }) {
  const nodes = EVIDENCE_MAP.nodes;
  const [focus, setFocus] = useState(() => resolveEvidenceFocus(EVIDENCE_MAP.defaultFocus));
  const [isVertical, setIsVertical] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767.98px)").matches);
  const tabRefs = useRef({});
  const active = nodes.find((node) => node.id === focus) || nodes[0];

  const selectNode = (id, shouldFocus) => {
    setFocus(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("focus", id);
      window.history.replaceState({}, "", url);
    }
    if (shouldFocus) {
      requestAnimationFrame(() => {
        const button = tabRefs.current[id];
        if (button) button.focus();
      });
    }
  };

  useEffect(() => {
    const onPopState = () => setFocus(resolveEvidenceFocus(EVIDENCE_MAP.defaultFocus));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767.98px)");
    const onChange = () => setIsVertical(media.matches);
    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const move = (delta) => {
    const index = nodes.findIndex((node) => node.id === focus);
    const next = nodes[(index + delta + nodes.length) % nodes.length];
    selectNode(next.id, true);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectNode(nodes[0].id, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectNode(nodes[nodes.length - 1].id, true);
    }
  };

  const lensLabel = mode === "industry" ? "For AI teams" : "Research contribution";
  const relevance = mode === "industry" ? active.industryRelevance : active.academicRelevance;
  return (
    <section id="approach" className="wrap lab-section evidence-map" aria-labelledby="approach-title">
      <LabSectionHead
        id="approach"
        num="02"
        title="Research approach"
        intro="I start with measured human decisions, quantify their pathways, simulate them at scale, and test where LLM-generated behavior agrees or diverges. Select a stage to see the method and why it matters."
      />
      <div className="evidence-layout">
        <div className="evidence-track" role="tablist" aria-orientation={isVertical ? "vertical" : "horizontal"} aria-label="Research sequence">
          {nodes.map((node) => {
            const selected = node.id === active.id;
            return (
              <div className={"evidence-node" + (selected ? " is-active" : "")} key={node.id}>
                <button
                  ref={(element) => { tabRefs.current[node.id] = element; }}
                  id={"evidence-tab-" + node.id}
                  className="evidence-node-button"
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="evidence-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectNode(node.id, false)}
                  onKeyDown={onKeyDown}
                >
                  <span className="evidence-stage">{node.stage}</span>
                  <span className="evidence-node-dot" aria-hidden="true"></span>
                  <span className="evidence-node-title">{node.title}</span>
                  <span className="evidence-node-metric">{node.metric}</span>
                  <span className="evidence-node-label">{node.metricLabel}</span>
                </button>
              </div>
            );
          })}
        </div>
        <article id="evidence-panel" className="evidence-panel" role="tabpanel" aria-labelledby={"evidence-tab-" + active.id}>
          <div className="evidence-panel-topline">
            <p className="evidence-status">{active.status}</p>
            <p className="evidence-panel-stage">Stage {active.stage}</p>
          </div>
          <div className="evidence-panel-metric">
            <strong>{active.metric}</strong>
            <span>{active.metricLabel}</span>
          </div>
          <h3>{active.title}</h3>
          <p className="evidence-summary">{active.summary}</p>
          <div className="evidence-panel-grid">
            <div>
              <p className="evidence-label">Methods / data</p>
              <p>{active.evidence}</p>
            </div>
            <div>
              <p className="evidence-label">{lensLabel}</p>
              <p>{relevance}</p>
            </div>
          </div>
          <div className="evidence-panel-links">
            {active.links.map((link) => <EvidenceLink key={link.href} href={link.href}>{link.label}</EvidenceLink>)}
          </div>
        </article>
      </div>
    </section>
  );
}

function FeaturedWorkExplorer({ mode }) {
  const [filter, setFilter] = useState(mode === "academic" ? "research" : "engineering");
  const categories = ["research", "engineering", "community", "all"];
  const items = [...CONTENT.selectedResearch, ...CONTENT.selectedEngineering];
  const shown = filter === "all" ? items : items.filter((item) => item.category === filter);
  const label = (category) => category === "all" ? "All work" : category[0].toUpperCase() + category.slice(1);
  return (
    <section id="work" className="wrap lab-section work-explorer" aria-labelledby="work-title">
      <LabSectionHead
        id="work"
        num="03"
        title="Featured work"
        intro="Browse the projects by their role in the program: research findings, working systems, or community infrastructure."
      />
      <div className="work-filters" role="group" aria-label="Filter featured work">
        {categories.map((category) => (
          <button
            key={category}
            className="work-filter"
            type="button"
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {label(category)}
          </button>
        ))}
      </div>
      <div className="work-grid">
        {shown.map((item) => (
          <article className={"work-card" + (item.featured ? " is-featured" : "")} key={item.slug}>
            <div className="work-card-topline">
              <p className="work-card-category">{label(item.category)}</p>
              <p className="work-card-status">{item.status}</p>
            </div>
            <h3>{item.name}</h3>
            <p className="work-card-line">{item.line}</p>
            {item.metrics ? (
              <ul className="work-card-metrics" aria-label={item.name + " metrics"}>
                {item.metrics.map((metric) => <li key={metric}>{metric}</li>)}
              </ul>
            ) : null}
            <p className="work-card-link"><a className="evidence-link" href={item.href}>Open case study <span className="evidence-arrow" aria-hidden="true">↗</span></a></p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CurrentWork() {
  const P = CONTENT.publications;
  return (
    <section id="now" className="wrap lab-section current-work" aria-labelledby="now-title">
      <LabSectionHead
        id="now"
        num="04"
        title="Current work"
        intro="The status interface stays explicit: what is published, what is under revision, and what is being prepared for submission or release."
      />
      <div className="current-work-layout">
        <div className="current-status-list">
          {P.underReview.map((item) => (
            <article className="current-status-item" key={item.descriptor}>
              <p className="current-status">{item.status}</p>
              <h3>{item.descriptor}</h3>
              <p className="current-venue">Target venue / {item.target}</p>
            </article>
          ))}
        </div>
        <div className="current-focus-panel">
          <p className="evidence-label">Research software / in preparation</p>
          <p className="current-focus-text">{P.softwareNote}</p>
          <p className="current-focus-text current-focus-text-small">{CONTENT.currentFocus}</p>
          <a className="quiet-link" href="/publications/">View publications and presentations <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}

// Block 3: three proof pillars — order LOCKED in both modes (IA §7.3 outranks
// VDS §5.6.2's swap note). No cards, no icons, no fills; 2px top rules only.
function ProofPillars() {
  return (
    <section id="pillars" className="wrap pillars" aria-label="Proof">
      <div className="pillar-row">
        {CONTENT.pillars.map((p) => (
          <div className="pillar" key={p.id}>
            <p className="pillar-kicker">{p.kicker}</p>
            <p className="pillar-copy">{p.copy}</p>
            {p.label ? <p className="pillar-status">{p.label}</p> : null}
            <p className="pillar-links">
              <EvidenceLink href={p.href}>{evidenceText(p.href)}</EvidenceLink>
              {p.caseStudy ? (
                <a className="quiet-link" href={p.caseStudy}>Case study<span aria-hidden="true"> →</span></a>
              ) : null}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Project card per VDS §5.6.3 — status label + one-line problem statement +
// case-study link. Stars appear only as the one allowed plain-text string.
function ProjectCard({ item }) {
  return (
    <article className="card">
      <div className="card-head">
        <h3 className="card-name">{item.name}</h3>
        <p className="card-status">{item.status}</p>
      </div>
      <p className="card-problem">{item.line}</p>
      {item.stars ? <p className="card-fact">{item.stars}</p> : null}
      <p className="card-links">
        <a className="card-link" href={item.href}>Case study<span aria-hidden="true"> →</span></a>
      </p>
    </article>
  );
}

// Block 4 (industry-first): three engineering cards.
function SelectedEngineering({ num }) {
  return (
    <section id={SEC.engineering.id} className="wrap section" data-block="engineering">
      <SectionHead num={num} title={SEC.engineering.label} />
      <div className="card-grid cols-3">
        {CONTENT.selectedEngineering.map((item) => <ProjectCard key={item.slug} item={item} />)}
      </div>
    </section>
  );
}

// Block 5: two research cards + the full-program text link.
function SelectedResearch({ num }) {
  const link = CONTENT.research.programLink;
  return (
    <section id={SEC.research.id} className="wrap section" data-block="research">
      <SectionHead num={num} title={SEC.research.label} />
      <div className={"card-grid " + (CONTENT.selectedResearch.length > 2 ? "cols-3" : "cols-2")}>
        {CONTENT.selectedResearch.map((item) => <ProjectCard key={item.slug} item={item} />)}
      </div>
      <p className="section-more">
        <a className="quiet-link" href={link.href}>{link.label}<span aria-hidden="true"> →</span></a>
      </p>
    </section>
  );
}

// Block 6: one short mode-invariant paragraph (single string prevents drift).
// The string itself opens with its own label, so the section carries an
// aria-label instead of a redundant visible heading.
function CurrentFocus() {
  return (
    <section id={SEC.focus.id} className="wrap section section-focus" aria-label={SEC.focus.label}>
      <p className="focus-text">{CONTENT.currentFocus}</p>
    </section>
  );
}

// Block 7: mode-aware documents block (VDS §5.6.6). Accent-outline primary —
// the page's single filled CTA stays the contact button.
function DocumentsBlock({ mode, num }) {
  const docs = CONTENT.documents;
  const primary = mode === "academic" ? docs.academic : docs.industry;
  const secondary = mode === "academic" ? docs.industry : docs.academic;
  return (
    <section id={SEC.documents.id} className="wrap section" data-block="documents">
      <SectionHead num={num} title={SEC.documents.label} />
      <div className="cv-block">
        <p className="cv-kicker">{mode === "academic" ? "Curriculum vitae" : "Resume"}</p>
        <a className="btn btn-outline cv-primary" href={primary.file} download>
          {Icons.download}
          <span>Download {primary.label}</span>
        </a>
        <p className="cv-secondary">
          Also available: <a className="quiet-link" href={secondary.file} download>{secondary.label}</a>
        </p>
      </div>
    </section>
  );
}

// Block 8: the single CTA (VDS §5.6.7) — availability verbatim above the ONE
// filled button; address also present as selectable mono text.
function Contact({ num }) {
  const C = CONTENT.contact;
  return (
    <section id={SEC.contact.id} className="wrap section section-contact" data-block="contact">
      <SectionHead num={num} title={SEC.contact.label} />
      <p className="availability"><span className="signal-dot" aria-hidden="true"></span>{C.availability}</p>
      <p className="contact-action">
        <a className="btn btn-primary" href={"mailto:" + C.email}>{C.ctaLabel}</a>
      </p>
      <p className="contact-email">{C.email}</p>
      <QuietLinks />
    </section>
  );
}

/* --------------------------------- pages --------------------------------- */

function Home({ mode }) {
  return (
    <>
      <Hero mode={mode} />
      <EvidenceMap mode={mode} />
      <FeaturedWorkExplorer mode={mode} />
      <CurrentWork />
      <DocumentsBlock mode={mode} num="05" />
      <Contact num="06" />
    </>
  );
}

/* ------------------------------ inner pages (S7) ------------------------- */

// Shared page header for the inner pages: serif h1 (the page name per IA §1.1)
// + optional sans lede. One h1 per page.
function PageHead({ title, lede }) {
  return (
    <header className="wrap page-head">
      <h1 className="page-title">{title}</h1>
      {lede ? <p className="page-lede">{lede}</p> : null}
    </header>
  );
}

// /research/ — the research program as one arc (IA §1.1 row 2). Opens with the
// 202-word academic research summary (positioning §4.10, verbatim in
// content.js), then the five-stage arc as a typographic timeline (VDS §5.7.3:
// stage label, what, evidence, honest status — no graphics), then the link
// back to /publications/.
function ResearchPage() {
  const R = CONTENT.research;
  return (
    <>
      <PageHead title="Research & Academic Work" />
      <section id="academic" className="wrap page-section" aria-label="Research overview">
        <p className="prose-lede">{R.summary}</p>
      </section>
      <section className="wrap section" aria-labelledby="arc-title">
        <div className="section-head">
          <span className="section-num" aria-hidden="true">01</span>
          <h2 id="arc-title" className="section-title">The research program, as one arc</h2>
        </div>
        <ol className="arc-list">
          {R.arc.map((s) => (
            <li className="arc-stage" key={s.n}>
              <p className="arc-num" aria-hidden="true">{String(s.n).padStart(2, "0")}</p>
              <div className="arc-body">
                <h3 className="arc-name">{s.name}</h3>
                <p className="arc-what">{s.what}</p>
                <p className="arc-evidence"><span className="field-label">Methods / source</span> {s.evidence}</p>
                <p className="arc-status">{s.statusNote}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="section-more">
          <a className="quiet-link" href="/publications/">Publications &amp; talks<span aria-hidden="true"> →</span></a>
        </p>
      </section>
      {R.photo ? (
        <section className="wrap page-section" aria-label="At AGU Fall Meeting 2025">
          <figure className="photo-figure">
            <img src={R.photo.src} alt={R.photo.alt} width="1108" height="1477" loading="lazy" />
            <figcaption className="figure-caption">{R.photo.caption}</figcaption>
          </figure>
        </section>
      ) : null}
    </>
  );
}

// /engineering/ — problems solved, systems built, eval/validation record, OSS
// PRs, capabilities (IA §1.1 row 3; positioning §3). The OSS section carries
// id="oss": the homepage proof pillar links to /engineering/#oss.
function EngineeringPage() {
  const E = CONTENT.engineering;
  let n = 0;
  const num = () => String(++n).padStart(2, "0");
  return (
    <>
      <PageHead title="AI, Engineering & Systems" />
      <section id="industry" className="wrap section" data-block="problems">
        <SectionHead num={num()} title="Problems solved" />
        <div className="problem-list">
          {E.problems.map((p) => (
            <div className="problem" key={p.id}>
              <h3 className="problem-title">{p.problem}</h3>
              <p className="problem-response">{p.response}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap section" data-block="systems">
        <SectionHead num={num()} title="Systems" />
        <div className="card-grid cols-2">
          {E.systems.map((s) => (
            <article className="card" key={s.name}>
              <div className="card-head">
                <h3 className="card-name">{s.name}</h3>
                <p className="card-status">{s.statusDetail ? s.status + " · " + s.statusDetail : s.status}</p>
              </div>
              <p className="card-problem">{s.what}</p>
              <p className="card-fact">{s.evidence}</p>
              <p className="card-links">
                <a className="card-link" href={s.href}>Case study<span aria-hidden="true"> →</span></a>
                <EvidenceLink href={s.repo}>Repo</EvidenceLink>
              </p>
            </article>
          ))}
        </div>
        <p className="systems-note">{E.systemsNote}</p>
      </section>
      <section className="wrap section" data-block="eval-record">
        <SectionHead num={num()} title="Evaluation & validation record" />
        <ul className="eval-list">
          {E.evalRecord.map((r, i) => (
            <li className="eval-item" key={i}>
              <span className="eval-project">{r.project}</span>
              <span className="eval-desc">{r.item}</span>
            </li>
          ))}
        </ul>
        <p className="eval-through">{E.evalThroughLine}</p>
      </section>
      <section id="oss" className="wrap section" data-block="oss">
        <SectionHead num={num()} title="Open-source contributions" />
        <p className="oss-intro">{E.oss.intro}</p>
        <ul className="oss-list">
          {E.oss.items.map((pr) => (
            <li className="oss-item" key={pr.url}>
              <span className="oss-ref"><EvidenceLink href={pr.url}>{pr.repo + "#" + pr.number}</EvidenceLink></span>
              <span className="oss-desc">{pr.desc}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap section" data-block="capabilities">
        <SectionHead num={num()} title="Capabilities" />
        <p className="capabilities-line">{E.capabilities.join(" · ")}</p>
      </section>
    </>
  );
}

// Citation text with own name at weight 600 — honest author order, never
// reordered (VDS §5.6.5); the string itself stays byte-identical.
function CitationText({ citation }) {
  const OWN = "Chiou, W.";
  const parts = citation.split(OWN);
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span className="pub-own-name">{OWN}</span> : null}
          {part}
        </React.Fragment>
      ))}
    </>
  );
}

// /publications/ — IA §4.1: peer-reviewed (honest author order, DOI link),
// under-review descriptor entries (NO invented titles — CONFIRM #3),
// presentations (venue + presentation ID only — CONFIRMs #2/#4/#12), and the
// research-software note (public software lines + the WAGF one-liner, nothing
// more). Mode-invariant (IA §7.3).
function PublicationsPage() {
  const P = CONTENT.publications;
  let n = 0;
  const num = () => String(++n).padStart(2, "0");
  return (
    <>
      <PageHead title="Publications & Talks" />
      <section className="wrap section" data-block="peer-reviewed">
        <SectionHead num={num()} title="Peer-Reviewed Publications" />
        <ul className="pub-list">
          {P.peerReviewed.map((pub) => (
            <li className="pub" key={pub.doi}>
              <p className="pub-citation"><CitationText citation={pub.citation} /></p>
              <p className="pub-note">{pub.authorNote}</p>
              <p className="pub-meta">
                <span className="pub-status">{pub.status}</span>
                <span className="link-sep" aria-hidden="true">·</span>
                <EvidenceLink href={pub.doiUrl}>{"DOI " + pub.doi}</EvidenceLink>
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap section" data-block="under-review">
        <SectionHead num={num()} title="Research in Progress" />
        <ul className="pub-list">
          {P.underReview.map((m, i) => (
            <li className="pub" key={i}>
              <p className="pub-citation">{m.descriptor}</p>
              <p className="pub-meta">
                <span className="pub-status">{m.status}</span>
                <span className="link-sep" aria-hidden="true">·</span>
                <span className="pub-target">Target: {m.target}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap section" data-block="presentations">
        <SectionHead num={num()} title="Conference Presentations" />
        <ul className="pub-list">
          {P.presentations.map((t, i) => (
            <li className="pub" key={i}>
              <p className="pub-citation">{t.venue} — {t.detail}</p>
              {t.note ? <p className="pub-note">{t.note}</p> : null}
              {t.href ? (
                <p className="pub-meta"><EvidenceLink href={t.href}>Program listing</EvidenceLink></p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap section" data-block="software">
        <SectionHead num={num()} title="Research software" />
        <ul className="software-list">
          <li className="software-line">
            research-hub-pipeline v1.1.1 on PyPI — maintained open-source tool.{" "}
            <EvidenceLink href="https://pypi.org/project/research-hub-pipeline/">PyPI</EvidenceLink>
          </li>
          <li className="software-line">
            FLOODABM — Zenodo-archived companion code with citation metadata (CITATION.cff) and published seed lists; research prototype.{" "}
            <EvidenceLink href="https://github.com/WenyuChiou/FLOODABM">Repo</EvidenceLink>
          </li>
          <li className="software-line">{P.softwareNote}</li>
        </ul>
      </section>
    </>
  );
}

// Case-study template — renders any CONTENT.caseStudies entry in the VDS
// §5.6.4 4-section layout (Problem → Approach → Validation & limitations →
// Links) covering all 11 IA §3.1 content fields (implementation-plan §0.6
// deviation 3): status (header + rail), problem + why-it-matters (§1), my
// role + approach + system + key challenge (§2), evaluation + results (§3),
// evidence links + transferable relevance (§4). Pages are mode-invariant
// (IA §7.3): a professor and a recruiter who exchange links see the same page.
function CaseStudy({ slug }) {
  const cs = CONTENT.caseStudies[slug];
  const statusLine = cs.statusDetail ? cs.status + " · " + cs.statusDetail : cs.status;
  return (
    <article className="wrap case-study">
      <header className="case-head">
        <p className="case-status">{statusLine}</p>
        <h1 className="page-title">{cs.title}</h1>
      </header>
      <div className="case-layout">
        <aside className="case-rail" aria-label="Project facts">
          <div className="rail-group">
            <p className="field-label">Status</p>
            <p className="rail-value">{statusLine}</p>
          </div>
          <div className="rail-group">
            <p className="field-label">Links</p>
            <ul className="rail-links">
              {cs.evidenceLinks.map((l) => (
                <li key={l.href}><EvidenceLink href={l.href}>{l.label}</EvidenceLink></li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="case-main">
          <section className="case-section" aria-label="Problem">
            <SectionHead num="01" title="Problem" />
            <p className="case-prose">{cs.problem}</p>
            <h3 className="case-subhead">Why it matters</h3>
            <p className="case-prose">{cs.whyItMatters}</p>
          </section>
          <section className="case-section" aria-label="Approach">
            <SectionHead num="02" title="Approach" />
            <h3 className="case-subhead">My role</h3>
            <p className="case-prose">{cs.myRole}</p>
            <h3 className="case-subhead">Method</h3>
            <p className="case-prose">{cs.approach}</p>
            <h3 className="case-subhead">What was built</h3>
            <p className="case-prose">{cs.system}</p>
            <h3 className="case-subhead">Key challenge</h3>
            <p className="case-prose">{cs.keyChallenge}</p>
            {cs.figure ? (
              <figure className="case-figure">
                <img src={cs.figure.src} alt={cs.figure.alt} loading="lazy" />
                <figcaption className="figure-caption">{cs.figure.caption}</figcaption>
              </figure>
            ) : null}
          </section>
          <section className="case-section" aria-label="Validation and limitations">
            <SectionHead num="03" title="Validation & limitations" />
            <p className="case-prose">{cs.evaluation}</p>
            <h3 className="case-subhead">Results & status</h3>
            <p className="case-prose">{cs.results}</p>
          </section>
          <section className="case-section" aria-label="Links">
            <SectionHead num="04" title="Links" />
            <ul className="case-links">
              {cs.evidenceLinks.map((l) => (
                <li key={l.href}><EvidenceLink href={l.href}>{l.label}</EvidenceLink></li>
              ))}
            </ul>
            <h3 className="case-subhead">Transferable relevance</h3>
            <div className="relevance">
              <p className="case-prose"><span className="field-label">Academic</span> {cs.relevance.academic}</p>
              <p className="case-prose"><span className="field-label">Industry</span> {cs.relevance.industry}</p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

// MPA registry — keyed by the data-page attribute the prerender step stamps
// onto each route's markup ("project:<slug>" for the five case studies).
export const PAGES = {
  home: Home,
  research: ResearchPage,
  engineering: EngineeringPage,
  publications: PublicationsPage,
};
for (const slug of Object.keys(CONTENT.caseStudies)) {
  PAGES["project:" + slug] = function CaseStudyPage() {
    return <CaseStudy slug={slug} />;
  };
}

/* ----------------------------- command palette --------------------------- */
// Ctrl/Cmd-K quick-nav (kept per implementation-plan §1.2): jump to a homepage
// section (current mode's order), open a page, or fire an action.
function CommandPalette({ open, onClose, page, mode, onModeChange, onThemeToggle }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const restore = useRef(null);

  const go = (id) => {
    onClose();
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  };
  const visit = (href) => { onClose(); window.location.href = href; };
  const ext = (url) => { onClose(); window.open(url, "_blank", "noopener,noreferrer"); };

  const M = CONTENT.meta;
  const docs = CONTENT.documents;
  const primaryDoc = mode === "academic" ? docs.academic : docs.industry;
  const otherMode = mode === "academic" ? "industry" : "academic";
  // Section jumps only exist on the homepage; inner pages get page links.
  const sections = page === "home"
    ? homeSections(mode).map((s, i) => ({
        label: s.label,
        hint: String(i + 1).padStart(2, "0"),
        run: () => go(s.id),
      }))
    : [{ label: "Home", hint: "/", run: () => visit("/") }];
  const items = [
    ...sections,
    { label: "Research page", hint: "/research/", run: () => visit("/research/") },
    { label: "Engineering page", hint: "/engineering/", run: () => visit("/engineering/") },
    { label: "Publications page", hint: "/publications/", run: () => visit("/publications/") },
    { label: "Download " + primaryDoc.label, hint: "PDF", run: () => visit(primaryDoc.file) },
    { label: CONTENT.contact.ctaLabel, run: () => visit("mailto:" + M.email) },
    { label: "GitHub", run: () => ext(M.github) },
    { label: "ORCID", run: () => ext(M.orcid) },
    { label: "Toggle dark / light", run: () => { onClose(); onThemeToggle(); } },
    { label: "Reading path: " + MODE_LABELS[otherMode].full, run: () => { onClose(); onModeChange(otherMode); } },
  ];
  const shown = items.filter((it) => it.label.toLowerCase().indexOf(q.trim().toLowerCase()) !== -1);
  const activeOptionId = shown[sel] ? "cmdk-option-" + sel : undefined;

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
    restore.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => { if (inputRef.current) inputRef.current.focus(); });
    return () => {
      document.body.style.overflow = prev;
      if (restore.current && restore.current.focus) restore.current.focus();
    };
  }, [open]);
  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const it = shown[sel]; if (it) it.run(); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "Tab") { e.preventDefault(); if (inputRef.current) inputRef.current.focus(); }
  };
  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-panel" role="dialog" aria-modal="true" aria-label="Quick navigation" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          aria-controls="cmdk-list"
          aria-activedescendant={activeOptionId}
          placeholder="Jump to a section or action…"
          aria-label="Search"
          autoComplete="off"
        />
        <ul id="cmdk-list" className="cmdk-list" role="listbox" tabIndex={0} onKeyDown={onKey} aria-label="Quick navigation results">
          {shown.length === 0 && <li className="cmdk-empty">No matches</li>}
          {shown.map((it, i) => (
            <li
              key={it.label}
              id={"cmdk-option-" + i}
              role="option"
              aria-selected={i === sel ? "true" : "false"}
              className={"cmdk-item" + (i === sel ? " is-active" : "")}
              onMouseEnter={() => setSel(i)}
              onClick={() => it.run()}
            >
              <span>{it.label}</span>
              {it.hint ? <span className="cmdk-hint">{it.hint}</span> : null}
            </li>
          ))}
        </ul>
        <div className="cmdk-foot">↑↓ navigate · ↵ select · esc close</div>
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

export function App({ page }) {
  const [theme, setTheme] = useState(resolveInitialTheme);
  const [mode, setModeState] = useState(resolveInitialMode);
  const [cmdk, setCmdk] = useState(false);

  // Toggling writes the stored preference and keeps the compatible path query
  // in sync, so a mode switch survives reloads and shareable URLs.
  const onModeChange = (next) => {
    setModeState(next);
    try {
      window.localStorage.setItem("wy-mode", next);
      const url = new URL(window.location.href);
      url.searchParams.set("path", next === "academic" ? "research" : "engineering");
      window.history.replaceState({}, "", url);
    } catch (e) { /* storage/URL unavailable */ }
  };
  const onThemeChange = (next) => {
    setTheme(next);
    try { window.localStorage.setItem("wy-theme", next); } catch (e) { /* storage unavailable */ }
  };

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { document.documentElement.setAttribute("data-mode", mode); }, [mode]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setCmdk((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Page = PAGES[page] || Home;
  return (
    <>
      <Nav page={page} mode={mode} onModeChange={onModeChange} theme={theme} onThemeChange={onThemeChange} />
      <main id="main">
        <Page mode={mode} />
      </main>
      <Footer />
      <CommandPalette
        open={cmdk}
        onClose={() => setCmdk(false)}
        page={page}
        mode={mode}
        onModeChange={onModeChange}
        onThemeToggle={() => onThemeChange(theme === "dark" ? "light" : "dark")}
      />
    </>
  );
}

// Client mount — guarded so prerender.mjs can import App under Node (SSR).
// The prerendered markup ships the default mode/theme; the client render
// replaces it with the stored/URL-resolved state (identical markup when the
// visitor is on the defaults).
if (typeof document !== "undefined") {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    const page = document.body.getAttribute("data-page") || rootEl.getAttribute("data-page") || "home";
    createRoot(rootEl).render(<App page={page} />);
  }
}
