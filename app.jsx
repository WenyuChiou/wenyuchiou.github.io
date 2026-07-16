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
// CaseStudy components to the registry.

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
  academic: { full: "Research & Academic Work", short: "Research & Academic" },
  industry: { full: "AI, Engineering & Systems", short: "AI & Engineering" },
};

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
  pillars: { id: "pillars", label: "Proof" },
  engineering: { id: "selected-engineering", label: "Selected engineering" },
  research: { id: "selected-research", label: "Selected research" },
  focus: { id: "focus", label: "Current focus" },
  documents: { id: "documents", label: "Documents" },
  contact: { id: "contact", label: "Contact" },
};

function selectedOrder(mode) {
  return mode === "academic" ? [SEC.research, SEC.engineering] : [SEC.engineering, SEC.research];
}

function homeSections(mode) {
  return [SEC.top, SEC.pillars, ...selectedOrder(mode), SEC.focus, SEC.documents, SEC.contact];
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
// The CTA is outline-styled — the page's ONE filled .btn-primary is the contact
// block's button (VDS §5.6.7 component invariant).
function Nav({ mode, onModeChange, theme, onThemeChange }) {
  const M = CONTENT.meta;
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Research", href: "/research/", anchor: "academic" },
    { label: "Engineering", href: "/engineering/", anchor: "industry" },
    { label: "Publications", href: "/publications/" },
  ];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="wrap nav-inner">
        <a className="wordmark" href="/">{M.name}</a>
        <nav className={"site-nav" + (open ? " is-open" : "")} aria-label="Site">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  className={"nav-link" + (l.anchor === mode ? " is-path-primary" : "")}
                  href={l.href}
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
        <a className="btn btn-outline nav-cta" href={"mailto:" + M.email}>Email me</a>
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
    <section id="top" className="wrap hero" aria-label="Identity">
      <p className="hero-eyebrow">{M.titleLine}</p>
      <h1 className="hero-name">{M.name}</h1>
      <p className="hero-standfirst">{H.umbrella}</p>
      <p className="hero-dialect">{H.dialect[mode] || H.dialect.industry}</p>
      <p className="hero-lede">{H.workingFormulation}</p>
      <p className="availability"><span className="signal-dot" aria-hidden="true"></span>{H.availability}</p>
      <QuietLinks />
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
      <div className="card-grid cols-2">
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
  const selected = selectedOrder(mode);
  let n = 0;
  const num = () => String(++n).padStart(2, "0");
  return (
    <>
      <Hero mode={mode} />
      <ProofPillars />
      {selected.map((sec) =>
        sec.id === SEC.engineering.id
          ? <SelectedEngineering key={sec.id} num={num()} />
          : <SelectedResearch key={sec.id} num={num()} />
      )}
      <CurrentFocus />
      <DocumentsBlock mode={mode} num={num()} />
      <Contact num={num()} />
    </>
  );
}

// MPA registry — S7 adds research / engineering / publications / case-study
// pages; the prerender step stamps data-page onto each route's markup.
export const PAGES = {
  home: Home,
};

/* ----------------------------- command palette --------------------------- */
// Ctrl/Cmd-K quick-nav (kept per implementation-plan §1.2): jump to a homepage
// section (current mode's order), open a page, or fire an action.
function CommandPalette({ open, onClose, mode, onModeChange, onThemeToggle }) {
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
  const sections = homeSections(mode).map((s, i) => ({
    label: s.label,
    hint: String(i + 1).padStart(2, "0"),
    run: () => go(s.id),
  }));
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

function App({ page }) {
  const [theme, setTheme] = useState(resolveInitialTheme);
  const [mode, setModeState] = useState(resolveInitialMode);
  const [cmdk, setCmdk] = useState(false);

  // Toggling writes the stored preference (IA §7.2); URL-param resolution never does.
  const onModeChange = (next) => {
    setModeState(next);
    try { window.localStorage.setItem("wy-mode", next); } catch (e) { /* storage unavailable */ }
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
      <Nav mode={mode} onModeChange={onModeChange} theme={theme} onThemeChange={onThemeChange} />
      <main id="main">
        <Page mode={mode} />
      </main>
      <Footer />
      <CommandPalette
        open={cmdk}
        onClose={() => setCmdk(false)}
        mode={mode}
        onModeChange={onModeChange}
        onThemeToggle={() => onThemeChange(theme === "dark" ? "light" : "dark")}
      />
    </>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  const page = document.body.getAttribute("data-page") || rootEl.getAttribute("data-page") || "home";
  createRoot(rootEl).render(<App page={page} />);
}
