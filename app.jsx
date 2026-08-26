import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  AtSign,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Moon,
  RotateCcw,
  Search,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { CONTENT, counterpartPath, localizedPath } from "./content.js";
import githubData from "./data/github.json";
import updatesData from "./data/updates.json";

const isExternal = (href) => /^(https?:)?\/\//.test(href);
const lp = (href, locale) => (href.startsWith("/assets/") ? href : href.startsWith("/") ? localizedPath(href, locale) : href);

function SmartLink({ href, locale, children, className, download = false, title }) {
  const resolved = lp(href, locale);
  const external = isExternal(resolved);
  return (
    <a className={className} href={resolved} download={download || undefined} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} title={title}>
      {children}
    </a>
  );
}

function HeroSocialLinks({ content, locale }) {
  const links = [
    { label: content.labels.linkedin, href: "https://www.linkedin.com/in/wenyu-chiou", Icon: Linkedin },
    { label: content.labels.github, href: "https://github.com/WenyuChiou", Icon: Github },
    { label: content.labels.email, href: `mailto:${content.contact.email}`, Icon: Mail },
    { label: content.labels.threads, href: "https://www.threads.com/@wenyuchiou", Icon: AtSign },
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
              const isCurrent = page === item.id || (page.startsWith("case:") && item.id === "work") || (page.startsWith("article:") && item.id === "articles");
              if (item.id !== "work") return <li key={item.id}><a href={localizedPath(item.href, locale)} aria-current={isCurrent ? "page" : undefined}>{item.label}</a></li>;
              return (
                <li className="work-dropdown-item" key={item.id}>
                  <details className="work-dropdown" data-work-dropdown>
                    <summary aria-current={isCurrent ? "page" : undefined}>
                      <span>{item.label}</span><ChevronDown className="work-dropdown-chevron" aria-hidden="true" size={16} />
                    </summary>
                    <div className="work-dropdown-panel">
                      <SmartLink className="work-dropdown-all" href={item.href} locale={locale}>
                        <span>{content.labels.allWork}</span><ArrowUpRight aria-hidden="true" size={15} />
                      </SmartLink>
                      {content.flagship.items.map((project) => (
                        <SmartLink className="work-dropdown-project" href={project.href} locale={locale} key={project.slug}>
                          <span className="work-dropdown-index">{project.index}</span>
                          <span><strong>{project.title}</strong><small>{project.line}</small></span>
                        </SmartLink>
                      ))}
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
          <ul className="hero-capabilities" aria-label={content.expertise.eyebrow}>{content.heroCapabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="hero-actions">
            <SmartLink className="button button-light" href="/hire/" locale={locale}>{content.hire.primaryLabel}<ArrowRight aria-hidden="true" size={17} /></SmartLink>
            <a className="button button-ghost" href={resume.href} download>{resume.label}<Download aria-hidden="true" size={17} /></a>
          </div>
          <a className="hero-work-link" href="#selected-work">{content.hire.selectedWorkLabel}<ArrowDown aria-hidden="true" size={15} /></a>
          <div className="hero-meta">
            <HeroSocialLinks content={content} locale={locale} />
            <p className="hero-availability">{content.hero.availability}</p>
          </div>
        </div>
        <figure className="hero-figure">
          <picture>
            <source media="(max-width: 620px)" srcSet="/assets/agu2025-photo-mobile.webp" />
            <img className="hero-media" src="/assets/agu2025-photo.webp" srcSet="/assets/agu2025-photo-tablet.webp 828w, /assets/agu2025-photo.webp 1108w" sizes="(max-width: 620px) 120px, (max-width: 980px) 260px, 360px" width="1108" height="1477" alt={content.hero.imageAlt} fetchPriority="high" />
          </picture>
          <figcaption className="hero-caption">{content.hero.imageCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
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
            <details className="stage" name="observatory-stages" key={stage.id} open={index === 0}>
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
      <div className="flagship-list">{F.items.map((item, index) => (
        <details className="flagship-entry" name="selected-work-projects" key={item.slug} open={index === 0}>
          <summary className="flagship-trigger">
            <span className="flagship-meta"><span>{item.index}</span><span>{item.status}</span></span>
            <span className="flagship-summary"><h3>{item.title}</h3><span>{item.line}</span></span>
            <span className="flagship-capability-preview" aria-hidden="true">{item.practice.join(" · ")}</span>
            <ChevronDown className="flagship-chevron" aria-hidden="true" size={20} />
          </summary>
          <div className="flagship-panel">
            <div className="flagship-contribution"><p>{item.role}</p><ul>{item.practice.map((practice) => <li key={practice}>{practice}</li>)}</ul></div>
            <SmartLink className="text-link flagship-case-link" href={item.href} locale={locale}>{content.labels.details}<ArrowUpRight aria-hidden="true" size={16} /><span className="sr-only">: {item.title}</span></SmartLink>
          </div>
        </details>
      ))}</div>
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

function CoupledFlowDiagram({ flow, activeStage = 0, full = false }) {
  const points = [190, 500, 810];
  return (
    <div className={`coupled-flow${full ? " is-full" : ""}`}>
      <svg viewBox="0 0 1000 430" role="img" aria-labelledby="coupled-flow-title coupled-flow-desc">
        <title id="coupled-flow-title">{flow.title}</title>
        <desc id="coupled-flow-desc">{flow.description}</desc>
        <defs>
          <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker>
        </defs>
        <text className="flow-lane-label" x="24" y="106">{flow.humanLabel}</text>
        <text className="flow-lane-label" x="24" y="318">{flow.environmentLabel}</text>
        <path className={`flow-path ${activeStage <= 2 ? "is-active" : ""}`} d="M190 104H810" markerEnd="url(#flow-arrow)" />
        <path className={`flow-path ${activeStage >= 2 ? "is-active" : ""}`} d="M190 316H810" markerEnd="url(#flow-arrow)" />
        <path className={`flow-feedback ${activeStage >= 3 ? "is-active" : ""}`} d="M810 132C915 168 915 252 810 288" markerEnd="url(#flow-arrow)" />
        <path className={`flow-feedback ${activeStage === 4 ? "is-active" : ""}`} d="M190 288C85 252 85 168 190 132" markerEnd="url(#flow-arrow)" />
        {flow.human.map((label, index) => <g className={`flow-node ${activeStage === index ? "is-active" : ""}`} key={label} transform={`translate(${points[index]} 104)`}><circle r="42" /><text y="70" textAnchor="middle">{label}</text></g>)}
        {flow.environment.map((label, index) => <g className={`flow-node ${activeStage === index + 2 ? "is-active" : ""}`} key={label} transform={`translate(${points[index]} 316)`}><circle r="42" /><text y="70" textAnchor="middle">{label}</text></g>)}
      </svg>
      <p className="flow-feedback-copy">{flow.feedback}</p>
    </div>
  );
}

function DecisionProvenanceExplorer({ content, full = false }) {
  const P = content.provenance;
  const lensIds = ["evaluation", "governance", "simulation"];
  const [lens, setLens] = useState(full ? "simulation" : "evaluation");
  const [stage, setStage] = useState(0);
  const active = P.lenses[lens];
  const selectLens = (next) => { setLens(next); setStage(0); };
  return (
    <section id="decision-provenance" className={`section provenance${full ? " provenance-full" : ""}`} aria-labelledby="provenance-title">
      <div className="wrap">
        <SectionHead eyebrow={P.eyebrow} title={P.title} intro={P.intro} id="provenance-title" />
        <div className="segmented-control provenance-lenses" role="group" aria-label={P.controlLabel}>{lensIds.map((id) => <button key={id} type="button" aria-pressed={lens === id} onClick={() => selectLens(id)}>{P.lenses[id].label}</button>)}</div>
        <p className="provenance-summary" aria-live="polite">{active.summary}</p>
        <div className="provenance-layout">
          <ol className="provenance-stages" aria-label={P.stageLabel}>{active.stages.map(([status, text], index) => <li className={stage === index ? "is-active" : ""} key={`${lens}-${P.stageNames[index]}`}><button type="button" onClick={() => setStage(index)} aria-current={stage === index ? "step" : undefined}><span className="provenance-index">0{index + 1}</span><span><strong>{P.stageNames[index]}</strong><small>{P.statuses[status]}</small></span></button><p>{text}</p></li>)}</ol>
          <CoupledFlowDiagram flow={P.flow} activeStage={stage} full={full} />
        </div>
      </div>
    </section>
  );
}

function EvidenceSlice({ content, locale, slug }) {
  const E = content.evidenceSlices[slug];
  const L = content.evidenceLabels;
  const fields = [[L.problem, E.problem], [L.role, E.role], [L.input, E.input], [L.decision, E.decision], [L.validation, E.validation], [L.consequence, E.consequence]];
  return <section className="section evidence-slice" aria-labelledby="evidence-slice-title"><div className="wrap"><SectionHead eyebrow={L.eyebrow} title={L.title} id="evidence-slice-title" /><p className="evidence-status"><strong>{L.publicStatus}</strong>{E.status}</p><dl>{fields.map(([label, value], index) => <div key={label}><dt><span>0{index + 1}</span>{label}</dt><dd>{value}</dd></div>)}</dl><p className="evidence-sources"><strong>{L.sources}</strong>{E.sources.map((source) => <SmartLink href={source.href} locale={locale} className="text-link" key={source.href}>{source.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink>)}</p></div></section>;
}

function ArticleDiagram({ type, content }) {
  const isZh = content.locale === "zh-TW";
  const diagrams = {
    evaluation: isZh ? ["實測行為", "受控人物設定", "重複決策", "結構與穩定性"] : ["Measured behavior", "Controlled persona", "Repeated decisions", "Structure + stability"],
    governance: isZh ? ["結構化提案", "確定性驗證", "針對性修正", "允許狀態更新"] : ["Structured proposal", "Deterministic checks", "Targeted repair", "Authorized update"],
    feedback: isZh ? ["理解風險", "受限決策", "危害與損失", "更新後的情境"] : ["Interpret risk", "Constrained choice", "Hazard + loss", "Updated context"],
  };
  return <figure className={`article-diagram diagram-${type}`}><ol>{diagrams[type].map((label, index) => <li key={label}><span>0{index + 1}</span><strong>{label}</strong>{index < 3 ? <ArrowRight aria-hidden="true" size={18} /> : <RotateCcw aria-hidden="true" size={18} />}</li>)}</ol><figcaption>{content.articlesPage.diagram}</figcaption></figure>;
}

function ArticlesPreview({ content, locale }) {
  const A = content.articlesPage;
  return <section className="section articles-preview" aria-labelledby="articles-preview-title"><div className="wrap"><SectionHead eyebrow={A.eyebrow} title={A.title} intro={A.intro} action={{ href: "/articles/", label: A.eyebrow }} locale={locale} id="articles-preview-title" /><div className="article-preview-list">{A.articles.map((article, index) => <article key={article.slug}><span>0{index + 1}</span><div><p className="article-meta"><time dateTime={article.date}>{article.date}</time> · {article.readingTime}</p><h3>{article.title}</h3><p>{article.dek}</p></div><SmartLink className="icon-link" href={`/articles/${article.slug}/`} locale={locale}><ArrowUpRight aria-hidden="true" /><span className="sr-only">{A.read}: {article.title}</span></SmartLink></article>)}</div></div></section>;
}

function ArticlesPage({ content, locale }) {
  const A = content.articlesPage;
  return <><PageHero eyebrow={A.eyebrow} title={A.title} intro={A.intro} /><section className="section articles-index"><div className="wrap">{A.articles.map((article, index) => <article className="article-index-item" key={article.slug}><span>0{index + 1}</span><div><p className="article-meta"><time dateTime={article.date}>{article.date}</time> · {article.readingTime}</p><h2>{article.title}</h2><p>{article.dek}</p><SmartLink className="text-link" href={`/articles/${article.slug}/`} locale={locale}>{A.read}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></div><ArticleDiagram type={article.diagramType} content={content} /></article>)}</div></section><Contact content={content} /></>;
}

function ArticlePage({ content, locale, slug }) {
  const A = content.articlesPage;
  const article = A.articles.find((item) => item.slug === slug) || A.articles[0];
  return <article className="tech-article"><header className="article-hero wrap"><p className="eyebrow">{A.eyebrow}</p><p className="article-meta"><time dateTime={article.date}>{article.date}</time> · {article.readingTime}</p><h1>{article.title}</h1><p>{article.dek}</p><p className="article-byline">{locale === "zh-TW" ? "作者" : "By"} <SmartLink href="/about/" locale={locale}>{content.name}</SmartLink></p></header><section className="section article-body"><div className="wrap article-layout"><aside><p className="eyebrow">{A.thesis}</p><p>{article.thesis}</p><ArticleDiagram type={article.diagramType} content={content} /></aside><div className="article-prose">{article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<footer className="article-sources"><h2>{A.sources}</h2>{article.sources.map((source) => <SmartLink className="text-link" href={source.href} locale={locale} key={source.href}>{source.label}<ArrowUpRight aria-hidden="true" size={15} /></SmartLink>)}<SmartLink className="text-link" href={article.relatedCase} locale={locale}>{A.related}<ArrowUpRight aria-hidden="true" size={15} /></SmartLink></footer></div></div></section><Contact content={content} /></article>;
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
  return <section id="contact" className="contact-band" aria-labelledby="contact-title"><div className="wrap contact-layout"><div><p className="eyebrow">{C.eyebrow}</p><h2 id="contact-title">{C.title}</h2><p>{C.text}</p><SmartLink className="contact-brief-link" href="/hire/" locale={content.locale}>{C.recruiterLink}<ArrowRight aria-hidden="true" size={15} /></SmartLink></div><div className="contact-actions"><a className="button button-light" href={`mailto:${C.email}`}><Mail aria-hidden="true" size={18} />{C.email}</a><p>{C.workAuth}</p><ul>{C.links.map((link) => <li key={link.href}><SmartLink href={link.href} locale={content.locale}>{link.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink></li>)}</ul></div></div></section>;
}

function Home({ content, locale }) {
  return <><Hero content={content} locale={locale} /><FlagshipCards content={content} locale={locale} /><DecisionProvenanceExplorer content={content} /><OpenSource content={content} locale={locale} compact /><ArticlesPreview content={content} locale={locale} /><Contact content={content} /></>;
}

function PageHero({ eyebrow, title, intro }) {
  return <header className="page-hero wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>;
}

function Breadcrumbs({ content, locale, page }) {
  if (page === "home") return null;
  const parent = page.startsWith("case:")
    ? { label: content.workPage.title, href: "/work/" }
    : page.startsWith("article:")
      ? { label: content.articlesPage.eyebrow, href: "/articles/" }
      : null;
  const current = page.startsWith("case:")
    ? content.caseStudies[page.slice(5)]?.title
    : page.startsWith("article:")
      ? content.articlesPage.articles.find((item) => item.slug === page.slice(8))?.title
      : ({ work: content.workPage.title, research: content.researchPage.title, publications: content.publicationsPage.title, articles: content.articlesPage.title, hire: content.hire.navLabel, about: content.aboutPage.title })[page];
  return <nav className="breadcrumbs wrap" aria-label={locale === "zh-TW" ? "階層導覽" : "Breadcrumb"}><ol><li><SmartLink href="/" locale={locale}>{locale === "zh-TW" ? "首頁" : "Home"}</SmartLink></li>{parent ? <li><SmartLink href={parent.href} locale={locale}>{parent.label}</SmartLink></li> : null}<li aria-current="page">{current}</li></ol></nav>;
}

function WorkPage({ content, locale }) {
  const W = content.workPage;
  return <><PageHero eyebrow={W.eyebrow} title={W.title} intro={W.intro} /><FlagshipCards content={content} locale={locale} full /><OpenSource content={content} locale={locale} /><Documents content={content} /><Contact content={content} /></>;
}

function ResearchPage({ content, locale }) {
  const R = content.researchPage;
  return <><PageHero eyebrow={R.eyebrow} title={R.title} intro={R.intro} /><section className="section"><div className="wrap question-grid">{R.questions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></section><section className="section research-methods"><div className="wrap two-column"><div><p className="eyebrow">{R.toolkitLabel}</p><h2>{R.methodsTitle}</h2><ol>{R.methods.map((item) => <li key={item}>{item}</li>)}</ol></div><div className="limits-panel"><AlertTriangle aria-hidden="true" /><h2>{R.limitsTitle}</h2><ul>{R.limits.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section><Observatory content={content} locale={locale} /><Contact content={content} /></>;
}

function PublicationsPage({ content, locale }) {
  const P = content.publicationsPage;
  return <><PageHero eyebrow={P.eyebrow} title={P.title} intro={P.intro} /><div className="wrap publication-groups">{P.groups.map((group, groupIndex) => <section className="publication-group" key={group.title} aria-labelledby={`pub-group-${groupIndex}`}><h2 id={`pub-group-${groupIndex}`}>{group.title}</h2><ol>{group.entries.map((entry) => <li key={entry.title}><span className="record-year">{entry.year}</span><article><p className="status-label">{entry.status}</p><h3>{entry.title}</h3><p>{entry.citation}</p>{entry.links.length ? <p className="record-links">{entry.links.map((link) => <SmartLink key={link.href} className="text-link" href={link.href} locale={locale}>{link.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink>)}</p> : null}</article></li>)}</ol></section>)}</div><Contact content={content} /></>;
}

function AboutPage({ content, locale }) {
  const A = content.aboutPage;
  return <><PageHero eyebrow={A.eyebrow} title={A.title} intro={A.bio[0]} /><section className="section about-body"><div className="wrap about-layout"><figure><img src="/assets/portrait.jpg" width="768" height="1024" alt={content.hero.imageAlt} loading="eager" /><figcaption>{content.hero.eyebrow}</figcaption></figure><div className="prose">{A.bio.slice(1).map((text) => <p key={text}>{text}</p>)}<SmartLink className="button button-outline about-brief-link" href="/hire/" locale={locale}>{content.hire.primaryLabel}<ArrowRight aria-hidden="true" size={16} /></SmartLink></div></div></section><section className="section"><div className="wrap two-column"><div><p className="eyebrow"><GraduationCap aria-hidden="true" size={16} />{A.educationTitle}</p><h2>{A.educationTitle}</h2><ol className="education-list">{A.education.map((item) => <li key={item.degree}><h3>{item.degree}</h3><p>{item.school}</p><span>{item.date}</span></li>)}</ol></div><div><p className="eyebrow">{A.timelineLabel}</p><h2>{A.trajectoryTitle}</h2><ol className="trajectory-list">{A.trajectory.map((item) => <li key={item.year}><span>{item.year}</span><p>{item.text}</p></li>)}</ol></div></div></section><Documents content={content} /><Contact content={content} /></>;
}

function HirePage({ content, locale }) {
  const H = content.hire;
  const resume = content.documents.items[0];
  return <div className="hire-page"><header className="hire-hero wrap"><div><p className="eyebrow">{H.eyebrow}</p><h1>{H.title}</h1><p>{H.intro}</p></div><figure><img src="/assets/agu2025-photo-mobile.webp" width="360" height="480" alt={content.hero.imageAlt} /><figcaption>{content.hero.imageCaption}</figcaption></figure></header><section className="section hire-role" aria-labelledby="hire-role-title"><div className="wrap hire-split"><div><p className="hire-number">01</p><h2 id="hire-role-title">{H.roleFitTitle}</h2></div><p>{H.roleFitText}</p></div></section><section className="section hire-own" aria-labelledby="hire-own-title"><div className="wrap"><div className="hire-section-title"><p className="hire-number">02</p><h2 id="hire-own-title">{H.ownTitle}</h2></div><ol className="hire-ownership">{H.own.map((item, index) => <li key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></div></section><section className="section hire-evidence" aria-labelledby="hire-evidence-title"><div className="wrap"><div className="hire-section-title"><p className="hire-number">03</p><h2 id="hire-evidence-title">{H.evidenceTitle}</h2><p>{H.evidenceIntro}</p></div><div className="hire-evidence-list">{content.flagship.items.map((project) => { const slice = content.evidenceSlices[project.slug]; return <article key={project.slug}><header><span>{project.index}</span><div><p>{project.status}</p><h3>{project.title}</h3></div></header><dl><div><dt>{H.evidenceLabels.problem}</dt><dd>{project.line}</dd></div><div><dt>{H.evidenceLabels.role}</dt><dd>{project.role}</dd></div><div><dt>{H.evidenceLabels.capabilities}</dt><dd>{project.practice.join(" · ")}</dd></div><div><dt>{H.evidenceLabels.status}</dt><dd>{slice.status}</dd></div></dl><p className="hire-evidence-links"><SmartLink className="text-link" href={project.href} locale={locale}>{H.evidenceLabels.source}<ArrowRight aria-hidden="true" size={15} /></SmartLink>{slice.sources.slice(0, 1).map((source) => <SmartLink className="text-link" href={source.href} locale={locale} key={source.href}>{source.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink>)}</p></article>; })}</div></div></section><section className="section hire-fit" aria-labelledby="hire-fit-title"><div className="wrap"><div className="hire-section-title"><p className="hire-number">04</p><h2 id="hire-fit-title">{H.fitTitle}</h2><p>{H.fitIntro}</p></div><dl className="hire-skills">{H.skillGroups.map((group) => <div key={group.label}><dt>{group.label}</dt><dd>{group.items.join(" · ")}</dd></div>)}</dl></div></section><section className="section hire-availability" aria-labelledby="hire-availability-title"><div className="wrap hire-split"><div><p className="hire-number">05</p><h2 id="hire-availability-title">{H.availabilityTitle}</h2></div><ul>{H.availability.map((item) => <li key={item}><Check aria-hidden="true" size={18} />{item}</li>)}</ul></div></section><section className="section hire-ask" aria-labelledby="hire-ask-title"><div className="wrap"><div className="hire-section-title"><p className="hire-number">06</p><h2 id="hire-ask-title">{H.askTitle}</h2><p>{H.askIntro}</p></div><PortfolioNavigator content={content} locale={locale} inline /></div></section><section id="contact" className="section hire-contact" aria-labelledby="hire-contact-title"><div className="wrap hire-split"><div><p className="hire-number">07</p><h2 id="hire-contact-title">{H.contactTitle}</h2><p>{H.contactText}</p></div><div className="hire-contact-actions"><a className="button button-dark" href={resume.href} download><Download aria-hidden="true" size={17} />{H.resumeLabel}</a><a className="button button-outline" href={`mailto:${content.contact.email}`}><Mail aria-hidden="true" size={17} />{H.emailLabel}</a><SmartLink className="button button-outline" href="https://www.linkedin.com/in/wenyu-chiou" locale={locale}><Linkedin aria-hidden="true" size={17} />{H.linkedinLabel}</SmartLink></div></div></section></div>;
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
  return <div className="interactive-artifact timeline-artifact"><div className="segmented-control" role="group" aria-label={labels.controlLabel}>{[["owner", labels.owner], ["renter", labels.renter]].map(([id, label]) => <button key={id} type="button" aria-pressed={tenure === id} onClick={() => setTenure(id)}>{label}</button>)}</div><p className="artifact-note">{labels.note}</p><CoupledFlowDiagram flow={content.provenance.flow} activeStage={tenure === "owner" ? 3 : 1} full /><ol className={`feedback-timeline is-${tenure}`}>{[labels.start, labels.choice, labels.hazard, labels.finance, labels.repeat].map((label, index) => <li key={label}><span>0{index + 1}</span><strong>{label}</strong>{index === 4 ? <RotateCcw aria-hidden="true" size={18} /> : <ChevronRight aria-hidden="true" size={18} />}</li>)}</ol><p className="artifact-result" aria-live="polite"><strong>{labels.lensLabel}</strong>{labels.views[tenure]}</p></div>;
}

function GovernanceTrace({ content }) {
  const [repaired, setRepaired] = useState(false);
  const labels = content.interactions.governance;
  const steps = [labels.proposal, labels.parse, labels.physical, labels.financial, labels.behavioral, labels.audit, labels.update];
  return <div className="interactive-artifact governance-artifact"><div className="segmented-control" role="group" aria-label={labels.controlLabel}><button type="button" aria-pressed={!repaired} onClick={() => setRepaired(false)}>{labels.first}</button><button type="button" aria-pressed={repaired} onClick={() => setRepaired(true)}>{labels.repaired}</button></div><p className="artifact-note">{labels.note}</p><ol className={repaired ? "governance-trace is-repaired" : "governance-trace"}>{steps.map((step, index) => { const failed = !repaired && index === 3; const blocked = !repaired && index > 3; return <li key={step} className={failed ? "is-failed" : blocked ? "is-blocked" : "is-passed"}>{failed ? <AlertTriangle aria-hidden="true" /> : blocked ? <X aria-hidden="true" /> : <Check aria-hidden="true" />}<span>{step}</span></li>; })}</ol><div className={repaired ? "trace-result is-accepted" : "trace-result is-rejected"}>{repaired ? <ShieldCheck aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}<div><strong>{repaired ? labels.accepted : labels.blocked}</strong><p>{repaired ? labels.passed : labels.failed}</p></div></div></div>;
}

function CaseInteraction({ type, content }) {
  if (type === "pathways") return <PathwayExplorer content={content} />;
  if (type === "timeline") return <FloodTimeline content={content} />;
  return <GovernanceTrace content={content} />;
}

function CaseStudyPage({ content, locale, slug }) {
  const C = content.caseStudies[slug];
  const labels = content.caseLabels;
  return <article className="case-study"><header className="case-hero wrap"><p className="eyebrow">{C.eyebrow}</p><p className="case-status">{C.status}</p><h1>{C.title}</h1><p className="case-lede">{C.lede}</p><ul>{C.scale.map((item) => <li key={item}>{item}</li>)}</ul></header><section className="section case-overview"><div className="wrap two-column"><div><p className="eyebrow">{labels.problem}</p><h2>{labels.why}</h2><p>{C.problem}</p></div><aside><p className="eyebrow">{labels.aiTeams}</p><p>{C.relevance}</p></aside></div></section><EvidenceSlice content={content} locale={locale} slug={slug} /><section className="section"><div className="wrap"><SectionHead eyebrow={labels.artifact} title={labels.inspect} intro={C.artifact} id="artifact-title" /><CaseInteraction type={C.interaction} content={content} /></div></section><section className="section case-method"><div className="wrap two-column"><div><p className="eyebrow">{labels.roleMethod}</p><h2>{labels.built}</h2><p>{C.role}</p><ol>{C.method.map((item) => <li key={item}>{item}</li>)}</ol></div><div className="limits-panel"><AlertTriangle aria-hidden="true" /><h2>{labels.validation}</h2><h3>{labels.validationShort}</h3><ul>{C.validation.map((item) => <li key={item}>{item}</li>)}</ul><h3>{labels.limitations}</h3><ul>{C.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section><section className="section case-learned"><div className="wrap"><p className="eyebrow">{labels.changed}</p><blockquote>{C.learned}</blockquote><p className="record-links">{C.links.map((link) => <SmartLink key={link.href} className="button button-outline" href={link.href} locale={locale}>{link.label}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink>)}</p></div></section><Contact content={content} /></article>;
}

function SiteFooter({ content, locale }) {
  return <footer className="site-footer"><div className="wrap"><div><strong>{content.name}</strong><p>{content.footer.line}</p><SmartLink href="/hire/" locale={locale}>{content.hire.footerLabel}<ArrowRight aria-hidden="true" size={14} /></SmartLink></div><p>{content.footer.note}<br />© 2026 Wenyu Chiou</p></div></footer>;
}

function PortfolioNavigator({ content, locale, inline = false }) {
  const N = content.navigator;
  const suggestions = inline ? content.hire.suggestions : N.suggestions;
  const suggestionFallbacks = inline ? ["/work/human-grounded-llm-evaluation/", "/work/wagf/", "/work/"] : [];
  const titleId = inline ? "recruiter-navigator-title" : "navigator-title";
  const queryId = inline ? "recruiter-navigator-query" : "navigator-query";
  const ai = locale === "zh-TW" ? {
    nvidia: "NVIDIA 引用摘要", disclosure: "啟用 AI 時，問題會送至 NVIDIA；若服務不可用，仍保留本機搜尋結果。",
  } : {
    nvidia: "NVIDIA cited summary", disclosure: "When AI is enabled, your question is sent to NVIDIA. Local results remain available if the service fails.",
  };
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
      {suggestions.map((suggestion, index) => inline
        ? <a href={lp(suggestionFallbacks[index], locale)} data-navigator-query={suggestion} key={suggestion}><span>{suggestion}</span><span aria-hidden="true">→</span></a>
        : <button type="button" data-navigator-query={suggestion} key={suggestion}><span>{suggestion}</span><span aria-hidden="true">→</span></button>)}
    </div>
    <form className="navigator-form" role="search" action={lp("/work/", locale)} method="get">
      <label className="sr-only" htmlFor={queryId}>{N.label}</label>
      <input id={queryId} name="query" type="search" placeholder={N.placeholder} maxLength="180" autoComplete="off" />
      <button className="navigator-submit" type="submit" aria-label={N.submit} title={N.submit}><ArrowRight aria-hidden="true" size={18} /></button>
    </form>
    <div className="navigator-feedback" aria-live="polite"><span data-navigator-status>{N.ready}</span><span data-navigator-mode /></div>
    <div className="navigator-answer" data-navigator-answer hidden />
    <ol className="navigator-results" data-navigator-results />
    <div className="navigator-turnstile" data-turnstile-container />
    <p className="navigator-privacy">{ai.disclosure}</p>
  </div>;
  return (
    <div
      className={inline ? "recruiter-navigator" : "portfolio-navigator"}
      data-portfolio-navigator
      data-locale={locale}
      data-inline={inline ? "true" : "false"}
      data-loading={N.loading}
      data-matching={N.matching}
      data-local={N.local}
      data-semantic={N.semantic}
      data-fallback={N.fallback}
      data-ready={N.ready}
      data-result-label={N.resultLabel}
      data-nvidia={ai.nvidia}
    >
      {!inline ? <button className="navigator-launch" type="button" data-navigator-launch aria-haspopup="dialog" aria-controls="portfolio-navigator-dialog" aria-label={N.launch} title={N.launch}>
        <Search aria-hidden="true" size={18} />
        <span>{N.launch}</span>
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
  else if (page === "articles") body = <ArticlesPage content={content} locale={locale} />;
  else if (page.startsWith("article:")) body = <ArticlePage content={content} locale={locale} slug={page.slice(8)} />;
  else if (page === "hire") body = <HirePage content={content} locale={locale} />;
  else if (page === "about") body = <AboutPage content={content} locale={locale} />;
  else if (page.startsWith("case:")) body = <CaseStudyPage content={content} locale={locale} slug={page.slice(5)} />;
  else body = <Home content={content} locale={locale} />;
  return <><SiteHeader content={content} locale={locale} page={page} basePath={basePath} /><main id="main"><Breadcrumbs content={content} locale={locale} page={page} />{body}</main>{page !== "hire" ? <PortfolioNavigator content={content} locale={locale} /> : null}<SiteFooter content={content} locale={locale} /></>;
}
