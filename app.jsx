import React, { useEffect, useRef, useState } from "react";
import { Timeline } from "./features/editorial/Timeline.jsx";
import { GUIDE_INTENTS } from "./portfolio-guide-data.js";
import {
  AlertTriangle,
  AtSign,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheckBig,
  CircleX,
  ChevronDown,
  ChevronRight,
  Download,
  Droplets,
  FileText,
  GitCompareArrows,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Waves,
  X,
} from "lucide-react";
import { CONTENT, counterpartPath, localizedPath } from "./content.js";
import githubData from "./data/github.json";
import updatesData from "./data/updates.json";
import { FIT_ROLE_PRESETS } from "./fit-data.js";
import { ProvenanceIsland } from "./features/provenance/island.jsx";

const isExternal = (href) => /^(https?:)?\/\//.test(href);
const lp = (href, locale) => (href.startsWith("/assets/") ? href : href.startsWith("/") ? localizedPath(href, locale) : href);
const CASE_ROLES = {
  "human-grounded-llm-evaluation": { role: "evaluation", Icon: GitCompareArrows },
  wagf: { role: "governance", Icon: ShieldCheck },
  floodabm: { role: "simulation", Icon: Waves },
};

function SmartLink({ href, locale, children, className, download = false, title, provenanceCase = false }) {
  const resolved = lp(href, locale);
  const external = isExternal(resolved);
  return (
    <a className={className} href={resolved} download={download || undefined} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} title={title} data-provenance-case={provenanceCase || undefined}>
      {children}
    </a>
  );
}

function HeroSocialLinks({ content, locale }) {
  const links = [
    { label: content.labels.linkedin, href: "https://www.linkedin.com/in/wenyu-chiou", Icon: Linkedin },
    { label: content.labels.github, href: "https://github.com/WenyuChiou", Icon: Github },
    { label: content.labels.email, href: `mailto:${content.contact.email}`, Icon: Mail },
    { label: content.labels.threads, href: "https://www.threads.com/@wenyu_chiou", Icon: AtSign },
  ];
  return (
    <ul className="hero-socials" aria-label={content.labels.socialLinks}>
      {links.map(({ label, href, Icon }) => (
        <li key={href}>
          <SmartLink className="hero-social-link" href={href} locale={locale} title={label}>
            <Icon aria-hidden="true" size={18} />
            <span className="sr-only">{label}</span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

function SectionHead({ eyebrow, title, intro, action, locale, id }) {
  return (
    <header className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
      {action ? (
        <SmartLink className="text-link section-action" href={action.href} locale={locale}>
          {action.label}<ArrowUpRight aria-hidden="true" size={16} />
        </SmartLink>
      ) : null}
    </header>
  );
}

function ThemeButton({ labels }) {
  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem("wy-theme", next); } catch {}
  };
  return (
    <button className="icon-button theme-button" type="button" onClick={toggle} aria-label={labels.theme} title={labels.theme}>
      <Sun className="theme-sun" aria-hidden="true" size={18} />
      <Moon className="theme-moon" aria-hidden="true" size={18} />
    </button>
  );
}

function SiteHeader({ content, locale, page, basePath }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      if (document.querySelector(".work-dropdown[open]")) return;
      if (document.querySelector(".navigator-dialog[open]")) return;
      setOpen(false);
      menuRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  const otherLocale = locale === "en" ? "zh-TW" : "en";
  const otherPath = counterpartPath(basePath, locale);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">{content.skip}</a>
      <div className="header-inner">
        <a className="brand" href={localizedPath("/", locale)} aria-label={content.name}>
          <span className="brand-mark" aria-hidden="true">{content.initials}</span>
          <span>{content.name}</span>
        </a>
        <button ref={menuRef} className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? content.labels.close : content.labels.menu} data-open-label={content.labels.menu} data-close-label={content.labels.close}>
          <Menu className="menu-open-icon" aria-hidden="true" />
          <X className="menu-close-icon" aria-hidden="true" />
        </button>
        <nav id="primary-navigation" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary">
          <ul>
            {content.nav.map((item) => {
              const isCurrent = page === item.id || (page.startsWith("case:") && item.id === "work") || (page.startsWith("article:") && item.id === "articles") || (page === "publications" && item.id === "research");
              if (!["work", "research"].includes(item.id)) return <li key={item.id}><a href={localizedPath(item.href, locale)} aria-current={isCurrent ? "page" : undefined}>{item.label}</a></li>;
              return (
                <li className="work-dropdown-item" key={item.id}>
                  <details className="work-dropdown" data-work-dropdown={item.id === "work" || undefined} data-nav-group={item.id}>
                    <summary aria-current={isCurrent ? "page" : undefined}>
                      <span>{item.label}</span><ChevronDown className="work-dropdown-chevron" aria-hidden="true" size={16} />
                    </summary>
                    <div className="work-dropdown-panel">
                      {item.id === "research" ? content.editorial.researchLinks.map(link => <SmartLink className="work-dropdown-all" href={link.href} locale={locale} key={link.href}><span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} /></SmartLink>) : <><SmartLink className="work-dropdown-all" href={item.href} locale={locale}>
                        <span>{content.labels.allWork}</span><ArrowUpRight aria-hidden="true" size={15} />
                      </SmartLink>
                      {content.flagship.items.map((project) => (
                        <SmartLink className="work-dropdown-project" href={project.href} locale={locale} key={project.slug}>
                          <span className="work-dropdown-index">{project.index}</span>
                          <span><strong>{project.title}</strong><small>{project.line}</small></span>
                        </SmartLink>
                      ))}</>}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
          <div className="nav-actions">
            <a className="locale-link" href={otherPath} hrefLang={otherLocale}>{content.switchLabel}</a>
            <ThemeButton labels={content.labels} />
            <a className="button button-small" href="#contact"><Mail aria-hidden="true" size={16} />{content.labels.contact}</a>
          </div>
        </nav>
        {page !== "hire" ? <PortfolioNavigator content={content} locale={locale} header /> : null}
      </div>
    </header>
  );
}

function Hero({ content, locale }) {
  const resume = content.documents.items[0];
  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="hero-content wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">{content.hero.eyebrow}</p>
          <h1 id="hero-name">{content.hero.title}</h1>
          <p className="hero-headline">{content.hero.headline}</p>
          <p className="hero-intro">{content.hero.intro}</p>
          <div className="hero-actions">
            <SmartLink className="button" href={content.hero.primary.href} locale={locale}>{content.hero.primary.label}<ArrowRight aria-hidden="true" size={17} /></SmartLink>
            <SmartLink className="button button-outline" href={content.hero.secondary.href} locale={locale}>{content.hero.secondary.label}<ArrowUpRight aria-hidden="true" size={17} /></SmartLink>
          </div>
          <a className="hero-work-link" href={resume.href} download>{resume.label}<Download aria-hidden="true" size={15} /></a>
          <div className="hero-meta">
            <HeroSocialLinks content={content} locale={locale} />
            <p className="hero-availability">{content.hero.availability}</p>
          </div>
        </div>
        <figure className="hero-figure">
          <picture>
            <source media="(max-width: 620px)" srcSet="/assets/agu2025-photo-mobile.webp" />
            <img className="hero-media" src="/assets/agu2025-photo-tablet.webp" sizes="(max-width: 620px) 100px, 220px" width="1108" height="1477" alt={content.hero.imageAlt} fetchPriority="high" />
          </picture>
          <figcaption className="hero-caption">{content.hero.imageCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function RecruiterFitTeaser({ content, locale }) {
  const F = content.hire.fitExplorer;
  return <section className="fit-teaser" aria-labelledby="fit-teaser-title"><div className="wrap fit-teaser-layout"><div><p className="eyebrow"><Sparkles aria-hidden="true" size={16} />{F.homeEyebrow}</p><h2 id="fit-teaser-title">{F.homeTitle}</h2><p>{F.homeIntro}</p></div><nav aria-label={F.roleLabel}>{Object.entries(FIT_ROLE_PRESETS).map(([id, preset]) => <SmartLink href={`/hire/?role=${id}#fit-explorer`} locale={locale} key={id}><span>{preset.shortTitle[locale]}</span><ArrowRight aria-hidden="true" size={16} /></SmartLink>)}</nav></div></section>;
}

function Expertise({ content }) {
  const E = content.expertise;
  return (
    <section className="section expertise" aria-labelledby="expertise-title">
      <div className="wrap">
        <SectionHead eyebrow={E.eyebrow} title={E.title} intro={E.intro} id="expertise-title" />
        <div className="expertise-layout">
          <article className="expertise-primary">
            <p className="section-label">{E.primaryLabel}</p>
            <h3>{E.primaryTitle}</h3>
            <p>{E.primaryText}</p>
          </article>
          <div className="expertise-supporting">
            <p className="section-label">{E.supportingLabel}</p>
            <ol>{E.items.map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>
          </div>
        </div>
        <p className="expertise-scope"><span>{E.scopeLabel}</span>{E.scope}</p>
      </div>
    </section>
  );
}

function Observatory({ content, locale }) {
  const O = content.observatory;
  return (
    <section id="observatory" className="section observatory" aria-labelledby="observatory-title">
      <div className="wrap">
        <SectionHead eyebrow={O.eyebrow} title={O.title} intro={O.intro} id="observatory-title" />
        <p className="interaction-hint">{O.hint}</p>
        <div className="stage-chain">
          {O.stages.map((stage, index) => (
            <details className="stage" id={`observatory-stage-${stage.id}`} name="observatory-stages" key={stage.id} open={index === 0}>
              <summary><span className="stage-number">{stage.number}</span><span className="stage-title">{stage.title}</span><ChevronRight className="stage-chevron" aria-hidden="true" size={18} /></summary>
              <div className="stage-body">
                <p className="stage-question">{stage.question}</p>
                <dl className="stage-evidence">
                  <div><dt>{O.fields.input}</dt><dd>{stage.input}</dd></div><div><dt>{O.fields.method}</dt><dd>{stage.method}</dd></div><div><dt>{O.fields.output}</dt><dd>{stage.output}</dd></div><div className="stage-risk"><dt>{O.fields.risk}</dt><dd>{stage.risk}</dd></div>
                </dl>
                <div className="stage-relevance"><span>{O.fields.teams}</span><p>{stage.relevance}</p></div>
                <SmartLink className="text-link" href={stage.caseStudy} locale={locale}>{content.labels.details}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlagshipCards({ content, locale, full = false }) {
  const F = content.flagship;
  return (
    <section id="selected-work" className="section flagship" aria-labelledby="flagship-title"><div className="wrap">
      <SectionHead eyebrow={F.eyebrow} title={F.title} intro={F.intro} id="flagship-title" />
      <div className="application-contexts">{content.editorial.contexts.map((context, index) => <div key={context.title}><p className="section-label">0{index + 1}</p><h3>{context.title}</h3><p>{context.text}</p><SmartLink className="text-link" href={context.href} locale={locale}>{content.labels.evidence}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></div>)}</div>
      <p className="agent-distinction">{content.editorial.distinction}</p>
      <div className="flagship-list">{F.items.map((item, index) => {
        const { role, Icon } = CASE_ROLES[item.slug];
        return (
        <article className={`flagship-record case-${role}`} key={item.slug}><details className={`flagship-entry case-${role}`} name="selected-work-projects" open={index === 0}>
          <summary className="flagship-trigger">
            <span className="flagship-meta">{item.index}</span>
            <span className="flagship-summary"><h3>{item.title}</h3><span>{item.line}</span><span className="flagship-role"><strong>{content.editorial.contributionLabel}</strong> {item.role}</span><span className="flagship-outcome"><strong>{content.editorial.outcomeLabel}</strong> {item.outcome}</span></span>
            <span className="flagship-signal" aria-hidden="true"><Icon size={20} /><span>{role}</span></span>
            <ChevronDown className="flagship-chevron" aria-hidden="true" size={20} />
          </summary>
          <div className="flagship-panel">
            <dl className="flagship-detail"><div><dt>{content.editorial.methodLabel}</dt><dd>{item.practice.join(" · ")}</dd></div><div><dt>{content.editorial.limitsLabel}</dt><dd>{content.editorial.limits[item.slug]}</dd></div></dl>
          </div>
        </details><SmartLink className="text-link flagship-case-link" href={item.href} locale={locale}>{content.labels.details}<ArrowUpRight aria-hidden="true" size={16} /><span className="sr-only">: {item.title}</span></SmartLink></article>
      );})}</div>
      {full ? null : <div className="section-tail"><SmartLink className="text-link" href="/work/" locale={locale}>{content.workPage.title}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></div>}
    </div></section>
  );
}

function formatCount(value, locale) {
  if (value < 1000) return String(value);
  return `${Math.floor(value / 100) / 10}K`;
}

function RepoPreview({ previewUrl }) {
  if (!previewUrl) return <Github className="repo-glyph" aria-hidden="true" size={20} />;
  return (
    <div className="repo-preview" aria-hidden="true">
      <Github className="repo-preview-fallback" size={24} />
      <img
        src={previewUrl}
        alt=""
        width="640"
        height="320"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function OpenSource({ content, locale, compact = false }) {
  const O = content.openSource;
  const featured = new Set(["awesome-agentic-ai-zh", "ai-research-skills", "agent-collab-skills"]);
  const repositories = compact ? O.repos.filter((repo) => featured.has(repo.key)) : O.repos;
  return (
    <section id="open-source" className="section open-source" aria-labelledby="oss-title"><div className="wrap">
      <SectionHead eyebrow={O.eyebrow} title={O.title} intro={O.intro} id="oss-title" />
      <div className="repo-list">{repositories.map((repo) => {
        const stats = githubData.repositories[repo.key];
        return (
          <article className={`repo-row${stats?.previewUrl ? " has-preview" : ""}`} key={repo.key}>
            <RepoPreview previewUrl={stats?.previewUrl} />
            <div className="repo-copy"><h3>{repo.name}</h3><p>{repo.desc}</p></div>
            {stats ? <p className="repo-stats"><strong>{formatCount(stats.stars, locale)}</strong> {content.labels.stars} <span>·</span> {formatCount(stats.forks, locale)} {content.labels.forks}</p> : null}
            <SmartLink className="icon-link" href={repo.href} locale={locale}><ArrowUpRight aria-hidden="true" /><span className="sr-only">{repo.name}</span></SmartLink>
          </article>
        );
      })}</div>
      <p className="data-note">{content.labels.updated}: {githubData.checkedAt.slice(0, 10)} · {content.labels.source}: {content.labels.snapshot}</p>
    </div></section>
  );
}


function SystemConsequenceMap({ flow, activeStage = 0, compact = false }) {
  const humanActive = Math.min(activeStage, 2);
  const environmentActive = activeStage < 2 ? -1 : Math.min(activeStage - 2, 2);
  return (
    <figure className={`system-map${compact ? " is-compact" : ""}`} aria-labelledby="system-map-title system-map-desc">
      <figcaption>
        <strong id="system-map-title">{flow.title}</strong>
        <span id="system-map-desc">{flow.description}</span>
      </figcaption>
      <div className="system-map-canvas">
        <svg viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
          <defs><marker id="system-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker></defs>
          <path className={`system-path is-human${activeStage <= 2 ? " is-active" : ""}`} d="M180 82H820" markerEnd="url(#system-arrow)" />
          <path className={`system-path is-environment${activeStage >= 2 ? " is-active" : ""}`} d="M180 278H820" markerEnd="url(#system-arrow)" />
          <path className={`system-path is-impact${activeStage >= 3 ? " is-active" : ""}`} d="M820 105C930 145 930 215 820 255" markerEnd="url(#system-arrow)" />
          <path className={`system-path is-feedback${activeStage === 4 ? " is-active" : ""}`} d="M180 255C70 215 70 145 180 105" markerEnd="url(#system-arrow)" />
        </svg>
        <div className="system-lane system-lane-human">
          <p><Users aria-hidden="true" size={18} />{flow.humanLabel}</p>
          <ol>{flow.human.map((label, index) => <React.Fragment key={label}><li className={humanActive === index ? "is-active" : ""}><span>0{index + 1}</span><strong>{label}</strong></li>{index < flow.human.length - 1 ? <ArrowRight className="system-node-arrow" aria-hidden="true" size={18} /> : null}</React.Fragment>)}</ol>
        </div>
        <div className="system-lane system-lane-environment">
          <p><Droplets aria-hidden="true" size={18} />{flow.environmentLabel}</p>
          <ol>{flow.environment.map((label, index) => <React.Fragment key={label}><li className={environmentActive === index ? "is-active" : ""}><span>0{index + 1}</span><strong>{label}</strong></li>{index < flow.environment.length - 1 ? <ArrowRight className="system-node-arrow" aria-hidden="true" size={18} /> : null}</React.Fragment>)}</ol>
        </div>
      </div>
      <p className="system-feedback"><RotateCcw aria-hidden="true" size={17} />{flow.feedback}</p>
    </figure>
  );
}


function ResearchIllustration({ content }) {
  const figure = useRef(null);
  const [run, setRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const copy = content.provenance.illustration;
  const localeSuffix = content.locale === "zh-TW" ? "-zh-TW" : "";

  useEffect(() => {
    if (!figure.current || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver((entries) => {
      setRun(entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.15) ? 1 : 0);
    }, { threshold: 0.15 });
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, []);

  const asset = (dark, mobile, staticOnly = false) => {
    const still = staticOnly || run === 0 || paused;
    return `/assets/research/research-loop${localeSuffix}${mobile ? "-mobile" : ""}${dark ? "-dark" : ""}${still ? "-static" : ""}.svg?v=loop-1${still ? "" : `&play=${run}`}`;
  };
  return <figure ref={figure} className="research-illustration" data-research-illustration>
    {[false, true].map((dark) => <picture key={String(dark)} className={`research-art-${dark ? "dark" : "light"}`}>
      <source media="(max-width: 620px) and (prefers-reduced-motion: reduce)" srcSet={asset(dark, true, true)} />
      <source media="(prefers-reduced-motion: reduce)" srcSet={asset(dark, false, true)} />
      <source media="(max-width: 620px)" srcSet={asset(dark, true)} />
      <img src={asset(dark, false)} width="1200" height="750" alt={copy.alt} loading="lazy" decoding="async" />
    </picture>)}
    <button className="icon-button research-illustration-toggle" type="button" title={paused ? copy.play : copy.pause} aria-label={paused ? copy.play : copy.pause} data-paused={paused} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}</button>
  </figure>;
}

function DecisionProvenanceExplorer({ content }) {
  const P = content.provenance;
  return <section id="decision-provenance" className="section provenance decision-trace" data-provenance-explorer aria-labelledby="provenance-title"><div className="wrap"><SectionHead eyebrow={content.editorial.observatoryLabel} title={content.editorial.observatoryTitle} intro={content.editorial.observatoryIntro} id="provenance-title" /><ProvenanceIsland content={content} compact /></div></section>;
}

function EvidenceSlice({ content, locale, slug }) {
  const E = content.evidenceSlices[slug];
  const L = content.evidenceLabels;
  const fields = [[L.problem, E.problem], [L.role, E.role], [L.input, E.input], [L.decision, E.decision], [L.validation, E.validation], [L.consequence, E.consequence]];
  return <section className="section evidence-slice" aria-labelledby="evidence-slice-title"><div className="wrap"><SectionHead eyebrow={L.eyebrow} title={L.title} id="evidence-slice-title" /><dl>{fields.map(([label, value], index) => <div key={label}><dt><span>0{index + 1}</span>{label}</dt><dd>{value}</dd></div>)}</dl><p className="evidence-sources"><strong>{L.sources}</strong>{E.sources.map((source) => <SmartLink href={source.href} locale={locale} className="text-link" key={source.href}>{source.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink>)}</p></div></section>;
}



function PublicUpdates({ content, locale }) {
  const E = content.editorial;
  const posts = updatesData.items.filter(item => item.type.en === "LinkedIn").slice(0, 3);
  return <section id="public-updates" className="section public-updates" aria-labelledby="public-updates-title"><div className="wrap">
    <SectionHead eyebrow={E.updatesEyebrow} title={E.updatesTitle} intro={E.updatesIntro} id="public-updates-title" />
    <div className="curated-notes">{posts.map(post => <article className="curated-note" key={post.url}>
      <p className="section-label">LinkedIn{post.date && /^\d{4}-\d{2}-\d{2}$/.test(post.date) ? <> · <time dateTime={post.date}>{post.date}</time></> : null}</p>
      <div><h3>{post.title[locale]}</h3><p>{post.summary[locale]}</p><SmartLink className="text-link" href={post.url} locale={locale}>{E.originalPost}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></div>
    </article>)}<SmartLink className="text-link" href="https://www.linkedin.com/in/wenyu-chiou/recent-activity/all/" locale={locale}>{E.allPosts}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></div>
  </div></section>;
}

function PublicationsPreview({ content, locale }) {
  const entries = [content.publicationsPage.groups[0].entries[0], content.publicationsPage.groups[2].entries[0], content.publicationsPage.groups[2].entries[1], content.publicationsPage.groups[2].entries[2]];
  const T = content.talksPreview;
  return <section className="section talks-preview" aria-labelledby="talks-title"><div className="wrap"><SectionHead eyebrow={T.eyebrow} title={T.title} action={T.link} locale={locale} id="talks-title" /><ol className="record-list">{entries.map((entry) => <li key={entry.title}><span className="record-year">{entry.year}</span><div><p className="status-label">{entry.status}</p><h3>{entry.title}</h3><p>{entry.citation}</p></div></li>)}</ol></div></section>;
}

function RecentUpdates({ content }) {
  const U = content.updates;
  return <section className="section updates" aria-labelledby="updates-title"><div className="wrap"><SectionHead eyebrow={U.eyebrow} title={U.title} intro={U.intro} id="updates-title" /><div className="updates-grid">{updatesData.items.map((item) => <article className="update-item" key={item.url}><p className="status-label">{item.type[content.locale]}</p><h3>{item.title[content.locale]}</h3><p>{item.summary[content.locale]}</p><SmartLink className="text-link" href={item.url} locale={content.locale}>{content.labels.open}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></article>)}</div></div></section>;
}

function Documents({ content }) {
  return <section className="section documents" aria-labelledby="documents-title"><div className="wrap documents-layout"><div><p className="eyebrow">PDF</p><h2 id="documents-title">{content.documents.title}</h2><p>{content.documents.intro}</p></div><div className="document-list">{content.documents.items.map((doc) => <a className="document-link" key={doc.href} href={doc.href} download><FileText aria-hidden="true" size={20} /><span>{doc.label}</span><small>{doc.type}</small><Download aria-hidden="true" size={18} /></a>)}</div></div></section>;
}

function Contact({ content }) {
  const C = content.contact;
  return <section id="contact" className="contact-band" aria-labelledby="contact-title"><div className="wrap contact-layout"><div><p className="eyebrow">{C.eyebrow}</p><h2 id="contact-title">{C.title}</h2><p>{C.text}</p><SmartLink className="contact-brief-link" href="/hire/" locale={content.locale}>{C.recruiterLink}<ArrowRight aria-hidden="true" size={15} /></SmartLink></div><div className="contact-actions"><a className="button button-light" href={`mailto:${C.email}`}><Mail aria-hidden="true" size={18} />{C.email}</a>{C.workAuth && <p>{C.workAuth}</p>}<ul>{C.links.map((link) => <li key={link.href}><SmartLink href={link.href} locale={content.locale}>{link.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink></li>)}</ul></div></div></section>;
}

function Home({ content, locale }) {
  return <><Hero content={content} locale={locale} /><FlagshipCards content={content} locale={locale} /><DecisionProvenanceExplorer content={content} /><OpenSource content={content} locale={locale} compact /><PublicUpdates content={content} locale={locale} /><Contact content={content} /></>;
}

function PageHero({ eyebrow, title, intro }) {
  return <header className="page-hero wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>;
}

function Breadcrumbs({ content, locale, page }) {
  if (page === "home") return null;
  const parent = page.startsWith("case:")
    ? { label: content.workPage.title, href: "/work/" }
    : null;
  const current = page.startsWith("case:")
    ? content.caseStudies[page.slice(5)]?.title
    : ({ work: content.workPage.title, research: content.researchPage.title, publications: content.publicationsPage.title, hire: content.hire.navLabel, about: content.aboutPage.title })[page];
  return <nav className="breadcrumbs wrap" aria-label={locale === "zh-TW" ? "階層導覽" : "Breadcrumb"}><ol><li><SmartLink href="/" locale={locale}>{locale === "zh-TW" ? "首頁" : "Home"}</SmartLink></li>{parent ? <li><SmartLink href={parent.href} locale={locale}>{parent.label}</SmartLink></li> : null}<li aria-current="page">{current}</li></ol></nav>;
}

function WorkPage({ content, locale }) {
  const W = content.workPage;
  return <><PageHero eyebrow={W.eyebrow} title={W.title} intro={W.intro} /><FlagshipCards content={content} locale={locale} full /><OpenSource content={content} locale={locale} /><Documents content={content} /><Contact content={content} /></>;
}

function ResearchPage({ content, locale }) {
  const R = content.researchPage;
  const targets = ["human-evidence", "llm-evaluation", "governance-repair", "external-feedback"];
  const roles = ["human", "model", "validation", "environment"];
  const icons = [Users, GitCompareArrows, ShieldCheck, Waves];
  return <><PageHero eyebrow={R.eyebrow} title={R.title} intro={R.intro} /><section className="section research-program" aria-label={R.eyebrow}><div className="wrap research-map"><svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M90 60H910" /></svg><ol>{R.questions.map((item, index) => { const Icon = icons[index]; return <li data-color-role={roles[index]} key={item.title}><a href={`#observatory-stage-${targets[index]}`}><span>0{index + 1}</span><Icon aria-hidden="true" size={22} /><h2>{item.title}</h2><p>{item.text}</p><ArrowDown aria-hidden="true" size={18} /></a></li>; })}</ol></div></section><section className="section research-methods"><div className="wrap two-column"><div><p className="eyebrow">{R.toolkitLabel}</p><h2>{R.methodsTitle}</h2><ol>{R.methods.map((item) => <li key={item}>{item}</li>)}</ol></div><div className="limits-panel"><AlertTriangle aria-hidden="true" /><h2>{R.limitsTitle}</h2><ul>{R.limits.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section><Observatory content={content} locale={locale} /><Contact content={content} /></>;
}

function PublicationsPage({ content, locale }) {
  const P = content.publicationsPage;
  return <><PageHero eyebrow={P.eyebrow} title={P.title} intro={P.intro} /><div className="wrap publication-groups">{P.groups.map((group, groupIndex) => <section className="publication-group" key={group.title} aria-labelledby={`pub-group-${groupIndex}`}><h2 id={`pub-group-${groupIndex}`}>{group.title}</h2><ol>{group.entries.map((entry) => <li key={entry.title}><span className="record-year">{entry.year}</span><article><p className="status-label">{entry.status}</p><h3>{entry.title}</h3><p>{entry.citation}</p>{entry.links.length ? <p className="record-links">{entry.links.map((link) => <SmartLink key={link.href} className="text-link" href={link.href} locale={locale}>{link.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink>)}</p> : null}</article></li>)}</ol></section>)}</div><Contact content={content} /></>;
}

function AboutPage({ content, locale }) {
  const A = content.aboutPage;
  return <>
    <PageHero eyebrow={A.eyebrow} title={A.title} intro={A.bio[0]} />
    <section className="section about-body">
      <div className="wrap about-layout">
        <figure><img src="/assets/portrait.jpg" width="560" height="751" alt={content.editorial.portraitAlt} loading="eager" /><figcaption>{content.hero.eyebrow}</figcaption></figure>
        <div className="prose">{A.bio.slice(1).map((text) => <p key={text}>{text}</p>)}<SmartLink className="button button-outline about-brief-link" href="/hire/" locale={locale}>{content.hire.primaryLabel}<ArrowRight aria-hidden="true" size={16} /></SmartLink></div>
      </div>
    </section>
    <section className="section"><div className="wrap">
      <div><p className="eyebrow"><GraduationCap aria-hidden="true" size={16} />{A.educationTitle}</p><h2>{A.educationTitle}</h2><ol className="education-list">{A.education.map((item) => <li key={item.degree}><h3>{item.degree}</h3><p>{item.school}</p><span>{item.date}</span></li>)}</ol></div>
    </div></section>
    <section className="section" id="experience"><div className="wrap"><SectionHead eyebrow={A.timelineLabel} title={A.trajectoryTitle} /><Timeline content={content} locale={locale} /></div></section>
    <Documents content={content} /><Contact content={content} />
  </>;
}

function RecruiterFitExplorer({ content, locale, resume }) {
  const F = content.hire.fitExplorer;
  return <section id="fit-explorer" className="section recruiter-fit" aria-labelledby="fit-explorer-title"><div className="wrap"><div className="hire-section-title"><p className="hire-number">06</p><h2 id="fit-explorer-title">{F.title}</h2><p>{F.intro}</p></div><div className="fit-explorer-shell" data-recruiter-fit-explorer data-locale={locale} data-resume-href={resume.href} data-email-href={`mailto:${content.contact.email}`} data-linkedin-href="https://www.linkedin.com/in/wenyu-chiou"><form data-fit-form><fieldset><legend>{F.roleLabel}</legend><div className="fit-role-options">{Object.entries(FIT_ROLE_PRESETS).map(([id, preset], index) => <label data-color-role={["model", "validation", "environment"][index]} key={id}><input type="radio" name="rolePreset" value={id} data-fit-role defaultChecked={index === 0} /><span>{preset.title[locale]}</span></label>)}</div></fieldset><label className="fit-jd-label" htmlFor="fit-job-description"><span>{F.jdLabel}</span><span><span data-fit-count>0</span> / 8,000</span></label><textarea id="fit-job-description" data-fit-jd rows="8" maxLength="8000" placeholder={F.jdPlaceholder} autoComplete="off" /><div className="fit-submit-row"><button className="button button-dark" type="submit" data-fit-submit><Sparkles aria-hidden="true" size={17} />{F.submit}</button><p><ShieldCheck aria-hidden="true" size={17} />{F.privacy}</p></div><div className="fit-turnstile" data-fit-turnstile /></form><div className="fit-analysis-status" role="status" aria-live="polite"><span className="fit-status-pulse" aria-hidden="true" /><span data-fit-status>{F.ready}</span></div><div className="fit-report" data-fit-result hidden /><noscript><p className="fit-noscript">{F.noScript}</p></noscript></div></div></section>;
}

function HirePage({ content, locale }) {
  const H = content.hire;
  const resume = content.documents.items[0];
  const skillRoles = ["engineering", "model", "context", "environment"];
  return <div className="hire-page">
    <header className="hire-hero wrap"><div><p className="eyebrow">{H.eyebrow}</p><h1>{H.title}</h1><p>{H.intro}</p></div><figure><img src="/assets/agu2025-photo-mobile.webp" width="360" height="480" alt={content.hero.imageAlt} /><figcaption>{content.hero.imageCaption}</figcaption></figure></header>
    <section className="section hire-profile" aria-labelledby="hire-role-title"><div className="wrap"><div className="hire-split hire-role"><div><p className="hire-number">01</p><h2 id="hire-role-title">{H.roleFitTitle}</h2></div><p>{H.roleFitText}</p></div><div className="hire-section-title hire-own-title"><p className="hire-number">02</p><h2 id="hire-own-title">{H.ownTitle}</h2></div><ol className="hire-ownership">{H.own.map((item, index) => <li data-color-role={["human", "validation", "system"][index]} key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></div></section>
    <section className="section hire-evidence" aria-labelledby="hire-evidence-title"><div className="wrap"><div className="hire-section-title"><p className="hire-number">03</p><h2 id="hire-evidence-title">{H.evidenceTitle}</h2><p>{H.evidenceIntro}</p></div><div className="hire-evidence-list">{content.flagship.items.map((project) => { const slice = content.evidenceSlices[project.slug]; const role = CASE_ROLES[project.slug].role; return <article className={`case-${role}`} key={project.slug}><header><span>{project.index}</span><div><h3>{project.title}</h3></div></header><dl><div><dt>{H.evidenceLabels.problem}</dt><dd>{project.line}</dd></div><div><dt>{H.evidenceLabels.role}</dt><dd>{project.role}</dd></div><div><dt>{H.evidenceLabels.capabilities}</dt><dd>{project.practice.join(" · ")}</dd></div></dl><p className="hire-evidence-links"><SmartLink className="text-link" href={project.href} locale={locale}>{H.evidenceLabels.source}<ArrowRight aria-hidden="true" size={15} /></SmartLink>{slice.sources.slice(0, 1).map((source) => <SmartLink className="text-link" href={source.href} locale={locale} key={source.href}>{source.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink>)}</p></article>; })}</div></div></section>
    <section className="section hire-fit" aria-labelledby="hire-fit-title"><div className="wrap hire-fit-grid"><div><div className="hire-section-title"><p className="hire-number">04</p><h2 id="hire-fit-title">{H.fitTitle}</h2><p>{H.fitIntro}</p></div><dl className="hire-skills">{H.skillGroups.map((group, index) => <div data-color-role={skillRoles[index]} key={group.label}><dt>{group.label}</dt><dd>{group.items.join(" · ")}</dd></div>)}</dl></div><aside className="hire-availability" aria-labelledby="hire-availability-title"><p className="hire-number">05</p><h2 id="hire-availability-title">{H.availabilityTitle}</h2><ul>{H.availability.map((item) => <li key={item}><Check aria-hidden="true" size={18} />{item}</li>)}</ul></aside></div></section>
    <RecruiterFitExplorer content={content} locale={locale} resume={resume} />
    <section id="contact" className="section hire-contact" aria-labelledby="hire-contact-title"><div className="wrap hire-split"><div><p className="hire-number">07</p><h2 id="hire-contact-title">{H.contactTitle}</h2><p>{H.contactText}</p></div><div className="hire-contact-actions"><a className="button button-dark" href={resume.href} download><Download aria-hidden="true" size={17} />{H.resumeLabel}</a><a className="button button-outline" href={`mailto:${content.contact.email}`}><Mail aria-hidden="true" size={17} />{H.emailLabel}</a><SmartLink className="button button-outline" href="https://www.linkedin.com/in/wenyu-chiou" locale={locale}><Linkedin aria-hidden="true" size={17} />{H.linkedinLabel}</SmartLink></div></div></section>
  </div>;
}

function PathwayExplorer({ content }) {
  const [lens, setLens] = useState("overall");
  const labels = content.interactions.pathways;
  const options = [["overall", labels.overall], ["owners", labels.owners], ["renters", labels.renters]];
  return <div className="interactive-artifact pathway-artifact"><div className="segmented-control" role="group" aria-label={labels.controlLabel}>{options.map(([id, label]) => <button key={id} type="button" aria-pressed={lens === id} onClick={() => setLens(id)}>{label}</button>)}</div><p className="artifact-note">{labels.note}</p><div className={`pathway-diagram lens-${lens}`} role="img" aria-label={`${labels.input}, ${labels.constructs}, ${labels.pathways}, ${labels.stability}`}>{[labels.input, labels.constructs, labels.pathways, labels.stability].map((label, index) => <React.Fragment key={label}><div><span>0{index + 1}</span><strong>{label}</strong></div>{index < 3 ? <ChevronRight aria-hidden="true" /> : null}</React.Fragment>)}</div><p className="artifact-result" aria-live="polite"><strong>{labels.lensLabel}</strong>{labels.views[lens]}</p></div>;
}

function FloodTimeline({ content }) {
  const [tenure, setTenure] = useState("owner");
  const labels = content.interactions.timeline;
  return <div className="interactive-artifact timeline-artifact"><div className="segmented-control" role="group" aria-label={labels.controlLabel}>{[["owner", labels.owner], ["renter", labels.renter]].map(([id, label]) => <button key={id} type="button" aria-pressed={tenure === id} onClick={() => setTenure(id)}>{label}</button>)}</div><p className="artifact-note">{labels.note}</p><SystemConsequenceMap flow={content.provenance.flow} activeStage={tenure === "owner" ? 4 : 3} /><ol className={`feedback-timeline is-${tenure}`}>{[labels.start, labels.choice, labels.hazard, labels.finance, labels.repeat].map((label, index) => <li data-color-role={["context", "human", "environment", "validation", "system"][index]} key={label}><span>0{index + 1}</span><strong>{label}</strong>{index === 4 ? <RotateCcw aria-hidden="true" size={18} /> : <ChevronRight aria-hidden="true" size={18} />}</li>)}</ol><p className="artifact-result" aria-live="polite"><strong>{labels.lensLabel}</strong>{labels.views[tenure]}</p></div>;
}

function GovernanceTrace({ content }) {
  const [repaired, setRepaired] = useState(false);
  const labels = content.interactions.governance;
  const steps = [labels.proposal, labels.parse, labels.physical, labels.financial, labels.behavioral, labels.audit, labels.update];
  return <div className="interactive-artifact governance-artifact"><div className="segmented-control" role="group" aria-label={labels.controlLabel}><button type="button" aria-pressed={!repaired} onClick={() => setRepaired(false)}>{labels.first}</button><button type="button" aria-pressed={repaired} onClick={() => setRepaired(true)}>{labels.repaired}</button></div><p className="artifact-note">{labels.note}</p><ol className={repaired ? "governance-trace is-repaired" : "governance-trace"}>{steps.map((step, index) => { const failed = !repaired && index === 3; const blocked = !repaired && index > 3; return <li key={step} className={failed ? "is-failed" : blocked ? "is-blocked" : "is-passed"}>{failed ? <AlertTriangle aria-hidden="true" /> : blocked ? <X aria-hidden="true" /> : <Check aria-hidden="true" />}<span>{step}</span></li>; })}</ol><div className={repaired ? "trace-result is-accepted" : "trace-result is-rejected"}>{repaired ? <ShieldCheck aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}<div><strong>{repaired ? labels.accepted : labels.blocked}</strong><p>{repaired ? labels.passed : labels.failed}</p></div></div></div>;
}

function CaseInteraction({ type, content }) {
  const lens = type === "pathways" ? "evaluation" : type === "timeline" ? "simulation" : "governance";
  const context = type === "pathways" ? <PathwayExplorer content={content} /> : type === "timeline" ? <FloodTimeline content={content} /> : <GovernanceTrace content={content} />;
  return <><div id="decision-provenance" data-provenance-explorer><ProvenanceIsland content={content} initialLens={lens} /></div><details className="case-research-context"><summary>{content.locale === "zh-TW" ? "研究脈絡與方法" : "Research context and method"}</summary>{context}</details></>;
}

function CaseStudyPage({ content, locale, slug }) {
  const C = content.caseStudies[slug];
  const labels = content.caseLabels;
  return <article className="case-study">
    <header className="case-hero wrap"><p className="eyebrow">{C.eyebrow}</p><h1>{C.title}</h1><p className="case-lede">{C.lede}</p><ul>{C.scale.map((item) => <li key={item}>{item}</li>)}</ul></header>
    <section className="section case-overview"><div className="wrap two-column">
      <div data-case-why><h2>{labels.why}</h2><p>{C.problem}</p></div>
      <div data-case-how><h2>{labels.built}</h2><p>{C.role}</p></div>
    </div></section>
    <section className="section case-learned"><div className="wrap" data-case-contribution>
      <h2>{labels.changed}</h2><p>{C.learned}</p>
      <p>{C.relevance}</p>
      <p className="record-links">{C.links.map((link) => <SmartLink key={link.href} className="button button-outline" href={link.href} locale={locale}>{link.label}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink>)}</p>
    </div></section>
    <section className="section"><div className="wrap"><SectionHead eyebrow={labels.artifact} title={labels.inspect} intro={C.artifact} id="artifact-title" /><CaseInteraction type={C.interaction} content={content} /></div></section>
    <section className="section case-method"><div className="wrap two-column">
      <div><h2>{labels.roleMethod}</h2><ol>{C.method.map((item) => <li key={item}>{item}</li>)}</ol></div>
      <div className="limits-panel"><AlertTriangle aria-hidden="true" /><h2>{labels.validation}</h2><h3>{labels.validationShort}</h3><ul>{C.validation.map((item) => <li key={item}>{item}</li>)}</ul><h3>{labels.limitations}</h3><ul>{C.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div></section>
    <EvidenceSlice content={content} locale={locale} slug={slug} />
    <Contact content={content} />
  </article>;
}

function SiteFooter({ content, locale }) {
  return <footer className="site-footer"><div className="wrap"><div><strong>{content.name}</strong><p>{content.footer.line}</p><SmartLink href="/hire/" locale={locale}>{content.hire.footerLabel}<ArrowRight aria-hidden="true" size={14} /></SmartLink></div><p>{content.footer.note}<br />© 2026 Wenyu Chiou</p></div></footer>;
}

function PortfolioNavigator({ content, locale, inline = false, header = false }) {
  const N = content.navigator;
  const suggestions = inline ? content.hire.suggestions : N.suggestions;
  const suggestionFallbacks = inline ? ["/work/human-grounded-llm-evaluation/", "/work/wagf/", "/work/"] : [];
  const titleId = inline ? "recruiter-navigator-title" : "navigator-title";
  const queryId = inline ? "recruiter-navigator-query" : "navigator-query";
  const ai = { nvidia: locale === "zh-TW" ? "NVIDIA 引用摘要" : "NVIDIA cited summary" };
  const frame = <div className="navigator-frame">
    {!inline ? <><header className="navigator-header">
      <p className="eyebrow">{inline ? content.hire.askTitle : N.eyebrow}</p>
      <button className="icon-button navigator-close" type="button" data-navigator-close aria-label={N.close} title={N.close}><X aria-hidden="true" size={18} /></button>
    </header>
    <div className="navigator-intro">
      <h2 id={titleId}>{N.title}</h2>
      <p>{N.intro}</p>
    </div></> : <h3 className="sr-only" id={titleId}>{content.hire.askTitle}</h3>}
    <div className="navigator-suggestions" aria-label={N.label}>
      {inline ? suggestions.map((suggestion, index) => <a href={lp(suggestionFallbacks[index], locale)} data-navigator-query={suggestion} key={suggestion}><span>{suggestion}</span><ArrowRight aria-hidden="true" size={16} /></a>) : GUIDE_INTENTS.map(intent => intent.href
        ? <a key={intent.id} href={lp(intent.href, locale)} data-guide-collaboration><span>{intent.label[locale]}</span><ArrowUpRight aria-hidden="true" size={16} /></a>
        : <button type="button" data-guide-intent={intent.id} aria-pressed="false" key={intent.id}><span>{intent.label[locale]}</span><ArrowRight aria-hidden="true" size={16} /></button>)}
    </div>
    <form className="navigator-form" role="search" action={lp("/work/", locale)} method="get">
      <label className="sr-only" htmlFor={queryId}>{N.label}</label>
      <input id={queryId} name="query" type="search" placeholder={N.placeholder} maxLength="180" autoComplete="off" aria-describedby={`${queryId}-privacy`} />
      <p className="navigator-privacy" id={`${queryId}-privacy`}>{N.privacy}</p>
      <button className="navigator-submit" type="submit"><Sparkles aria-hidden="true" size={18} /><span>{N.submit}</span></button>
    </form>
    <div className="navigator-turnstile" data-turnstile-container />
    <div className="navigator-feedback" aria-live="polite"><span data-navigator-status>{N.ready}</span><span data-navigator-mode /></div>
    <div className="navigator-answer" data-navigator-answer hidden />
    {!inline && <p className="guide-reading-intro" data-guide-intro />}
    <ol className="navigator-results" data-navigator-results />
  </div>;
  return (
    <div
      className={inline ? "recruiter-navigator" : header ? "portfolio-navigator navigator-header-entry" : "portfolio-navigator"}
      data-portfolio-navigator
      data-locale={locale}
      data-inline={inline ? "true" : "false"}
      data-loading={N.loading}
      data-matching={N.matching}
      data-local={N.local}
      data-semantic={N.semantic}
      data-fallback={N.fallback}
      data-ready={N.ready}
      data-generated-ready={N.generatedReady}
      data-result-label={N.resultLabel}
      data-nvidia={ai.nvidia}
    >
      {!inline ? <button className="navigator-launch" type="button" data-navigator-launch aria-haspopup="dialog" aria-controls="portfolio-navigator-dialog" aria-label={`${N.launchShort}: ${N.launch}. ${N.launchScope}`} title={`${N.launch}: ${N.launchScope}`}>
        {header ? <Sparkles aria-hidden="true" size={18} /> : <Search aria-hidden="true" size={18} />}
        <span className="navigator-launch-copy"><strong>{N.launch}</strong><small>{N.launchScope}</small></span>
        <span className="navigator-launch-short" aria-hidden="true">{N.launchShort}</span>
      </button> : null}
      {inline ? <div className="navigator-inline-panel" aria-labelledby={titleId}>{frame}</div> : <dialog className="navigator-dialog" id="portfolio-navigator-dialog" aria-labelledby={titleId}>{frame}</dialog>}
    </div>
  );
}

export function App({ page = "home", locale = "en", basePath = "/" }) {
  const content = CONTENT[locale] || CONTENT.en;
  let body;
  if (page === "home") body = <Home content={content} locale={locale} />;
  else if (page === "work") body = <WorkPage content={content} locale={locale} />;
  else if (page === "research") body = <ResearchPage content={content} locale={locale} />;
  else if (page === "publications") body = <PublicationsPage content={content} locale={locale} />;
  else if (page === "hire") body = <HirePage content={content} locale={locale} />;
  else if (page === "about") body = <AboutPage content={content} locale={locale} />;
  else if (page.startsWith("case:")) body = <CaseStudyPage content={content} locale={locale} slug={page.slice(5)} />;
  else body = <Home content={content} locale={locale} />;
  return <><SiteHeader content={content} locale={locale} page={page} basePath={basePath} /><main id="main"><Breadcrumbs content={content} locale={locale} page={page} />{body}</main><SiteFooter content={content} locale={locale} /></>;
}
