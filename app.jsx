import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Download,
  FileText,
  Github,
  GraduationCap,
  Mail,
  Menu,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { CONTENT, counterpartPath, localizedPath } from "./content.js";
import githubData from "./data/github.json";
import updatesData from "./data/updates.json";

const isExternal = (href) => /^(https?:)?\/\//.test(href);
const lp = (href, locale) => (href.startsWith("/") ? localizedPath(href, locale) : href);

function SmartLink({ href, locale, children, className, download = false }) {
  const resolved = lp(href, locale);
  const external = isExternal(resolved);
  return (
    <a className={className} href={resolved} download={download || undefined} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children}
    </a>
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
    window.localStorage.setItem("wy-theme", next);
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
        <button className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? content.labels.close : content.labels.menu}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary">
          <ul>
            {content.nav.map((item) => (
              <li key={item.id}><a href={localizedPath(item.href, locale)} aria-current={page === item.id || (page.startsWith("case:") && item.id === "work") ? "page" : undefined}>{item.label}</a></li>
            ))}
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
  return (
    <section className="hero" aria-labelledby="hero-name">
      <img className="hero-media" src="/assets/agu2025-photo.webp" srcSet="/assets/agu2025-photo-mobile.webp 640w, /assets/agu2025-photo.webp 1108w" sizes="100vw" width="1108" height="1477" alt={content.hero.imageAlt} fetchPriority="high" />
      <div className="hero-scrim" aria-hidden="true"></div>
      <div className="hero-content wrap">
        <p className="eyebrow hero-eyebrow">{content.hero.eyebrow}</p>
        <h1 id="hero-name">{content.hero.title}</h1>
        <p className="hero-headline">{content.hero.headline}</p>
        <p className="hero-intro">{content.hero.intro}</p>
        <div className="hero-actions">
          <a className="button button-light" href={content.hero.primary.href}>{content.hero.primary.label}<ArrowDown aria-hidden="true" size={17} /></a>
          <SmartLink className="button button-ghost" href={content.hero.secondary.href} locale={locale}>{content.hero.secondary.label}<ArrowUpRight aria-hidden="true" size={17} /></SmartLink>
        </div>
        <p className="hero-availability">{content.hero.availability}</p>
        <p className="hero-caption">{content.hero.imageCaption}</p>
      </div>
    </section>
  );
}

function ProofStrip({ content }) {
  return <section className="proof-strip" aria-label="Selected evidence"><div className="wrap proof-grid">{content.proof.map((item) => <div className="proof-item" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>;
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
            <details className="stage" key={stage.id} open={index === 0}>
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
    <section className="section flagship" aria-labelledby="flagship-title"><div className="wrap">
      <SectionHead eyebrow={F.eyebrow} title={F.title} intro={F.intro} id="flagship-title" />
      <div className="flagship-grid">{F.items.map((item) => <article className={`flagship-card accent-${item.accent}`} key={item.slug}><div className="card-topline"><span>{item.index}</span><span>{item.status}</span></div><h3>{item.title}</h3><p>{item.line}</p><ul>{item.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul><SmartLink className="card-link" href={item.href} locale={locale}>{content.labels.details}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></article>)}</div>
      {full ? null : <div className="section-tail"><SmartLink className="text-link" href="/work/" locale={locale}>{content.workPage.title}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink></div>}
    </div></section>
  );
}

function EvidenceLedger({ content, locale }) {
  const L = content.ledger;
  return <section className="section ledger-section" aria-labelledby="ledger-title"><div className="wrap"><SectionHead eyebrow={L.eyebrow} title={L.title} id="ledger-title" /><div className="ledger-list">{L.items.map((item, index) => <article className="ledger-row" key={item.title}><span className="ledger-index">0{index + 1}</span><div><p className="status-label">{item.status}</p><h3>{item.title}</h3><p>{item.detail}</p></div><SmartLink className="icon-link" href={item.href} locale={locale}><ArrowUpRight aria-hidden="true" /><span className="sr-only">{content.labels.open}: {item.title}</span></SmartLink></article>)}</div></div></section>;
}

function formatCount(value, locale) {
  if (value < 1000) return String(value);
  return `${Math.floor(value / 100) / 10}K`;
}

function OpenSource({ content, locale }) {
  const O = content.openSource;
  return (
    <section id="open-source" className="section open-source" aria-labelledby="oss-title"><div className="wrap">
      <SectionHead eyebrow={O.eyebrow} title={O.title} intro={O.intro} id="oss-title" />
      <div className="repo-list">{O.repos.map((repo) => { const stats = githubData.repositories[repo.key]; return <article className="repo-row" key={repo.key}><Github aria-hidden="true" size={20} /><div><h3>{repo.name}</h3><p>{repo.desc}</p></div>{stats ? <p className="repo-stats"><strong>{formatCount(stats.stars, locale)}</strong> {content.labels.stars} <span>·</span> {formatCount(stats.forks, locale)} {content.labels.forks}</p> : null}<SmartLink className="icon-link" href={repo.href} locale={locale}><ArrowUpRight aria-hidden="true" /><span className="sr-only">{repo.name}</span></SmartLink></article>; })}</div>
      <p className="data-note">{content.labels.updated}: {githubData.checkedAt.slice(0, 10)} · {content.labels.source}: {content.labels.snapshot}</p>
    </div></section>
  );
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
  return <section id="contact" className="contact-band" aria-labelledby="contact-title"><div className="wrap contact-layout"><div><p className="eyebrow">{C.eyebrow}</p><h2 id="contact-title">{C.title}</h2><p>{C.text}</p></div><div className="contact-actions"><a className="button button-light" href={`mailto:${C.email}`}><Mail aria-hidden="true" size={18} />{C.email}</a><p>{C.workAuth}</p><ul>{C.links.map((link) => <li key={link.href}><SmartLink href={link.href} locale="en">{link.label}<ArrowUpRight aria-hidden="true" size={14} /></SmartLink></li>)}</ul></div></div></section>;
}

function Home({ content, locale }) {
  return <><Hero content={content} locale={locale} /><ProofStrip content={content} /><Observatory content={content} locale={locale} /><FlagshipCards content={content} locale={locale} /><EvidenceLedger content={content} locale={locale} /><OpenSource content={content} locale={locale} /><PublicationsPreview content={content} locale={locale} /><RecentUpdates content={content} /><Documents content={content} /><Contact content={content} /></>;
}

function PageHero({ eyebrow, title, intro }) {
  return <header className="page-hero wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header>;
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

function AboutPage({ content }) {
  const A = content.aboutPage;
  return <><PageHero eyebrow={A.eyebrow} title={A.title} intro={A.bio[0]} /><section className="section about-body"><div className="wrap about-layout"><figure><img src="/assets/portrait.jpg" width="768" height="1024" alt={content.hero.imageAlt} loading="eager" /><figcaption>{content.hero.eyebrow}</figcaption></figure><div className="prose">{A.bio.slice(1).map((text) => <p key={text}>{text}</p>)}</div></div></section><section className="section"><div className="wrap two-column"><div><p className="eyebrow"><GraduationCap aria-hidden="true" size={16} />{A.educationTitle}</p><h2>{A.educationTitle}</h2><ol className="education-list">{A.education.map((item) => <li key={item.degree}><h3>{item.degree}</h3><p>{item.school}</p><span>{item.date}</span></li>)}</ol></div><div><p className="eyebrow">{A.timelineLabel}</p><h2>{A.trajectoryTitle}</h2><ol className="trajectory-list">{A.trajectory.map((item) => <li key={item.year}><span>{item.year}</span><p>{item.text}</p></li>)}</ol></div></div></section><Documents content={content} /><Contact content={content} /></>;
}

function PathwayExplorer({ content }) {
  const [lens, setLens] = useState("overall");
  const labels = content.interactions.pathways;
  const options = [["overall", labels.overall], ["owners", labels.owners], ["renters", labels.renters]];
  return <div className="interactive-artifact pathway-artifact"><div className="segmented-control" aria-label="Pathway lens">{options.map(([id, label]) => <button key={id} type="button" aria-pressed={lens === id} onClick={() => setLens(id)}>{label}</button>)}</div><p className="artifact-note">{labels.note}</p><div className={`pathway-diagram lens-${lens}`} role="img" aria-label={`${labels.input}, ${labels.constructs}, ${labels.pathways}, ${labels.stability}`}>{[labels.input, labels.constructs, labels.pathways, labels.stability].map((label, index) => <React.Fragment key={label}><div><span>0{index + 1}</span><strong>{label}</strong></div>{index < 3 ? <ChevronRight aria-hidden="true" /> : null}</React.Fragment>)}</div></div>;
}

function FloodTimeline({ content }) {
  const [tenure, setTenure] = useState("owner");
  const labels = content.interactions.timeline;
  return <div className="interactive-artifact timeline-artifact"><div className="segmented-control" aria-label="Tenure lens">{[["owner", labels.owner], ["renter", labels.renter]].map(([id, label]) => <button key={id} type="button" aria-pressed={tenure === id} onClick={() => setTenure(id)}>{label}</button>)}</div><p className="artifact-note">{labels.note}</p><ol className={`feedback-timeline is-${tenure}`}>{[labels.start, labels.choice, labels.hazard, labels.finance, labels.repeat].map((label, index) => <li key={label}><span>0{index + 1}</span><strong>{label}</strong>{index === 4 ? <RotateCcw aria-hidden="true" size={18} /> : <ChevronRight aria-hidden="true" size={18} />}</li>)}</ol></div>;
}

function GovernanceTrace({ content }) {
  const [repaired, setRepaired] = useState(false);
  const labels = content.interactions.governance;
  const steps = [labels.proposal, labels.parse, labels.physical, labels.financial, labels.behavioral, labels.audit, labels.update];
  return <div className="interactive-artifact governance-artifact"><div className="segmented-control"><button type="button" aria-pressed={!repaired} onClick={() => setRepaired(false)}>{labels.first}</button><button type="button" aria-pressed={repaired} onClick={() => setRepaired(true)}>{labels.repaired}</button></div><p className="artifact-note">{labels.note}</p><ol className={repaired ? "governance-trace is-repaired" : "governance-trace"}>{steps.map((step, index) => { const failed = !repaired && index === 3; const blocked = !repaired && index > 3; return <li key={step} className={failed ? "is-failed" : blocked ? "is-blocked" : "is-passed"}>{failed ? <AlertTriangle aria-hidden="true" /> : blocked ? <X aria-hidden="true" /> : <Check aria-hidden="true" />}<span>{step}</span></li>; })}</ol><div className={repaired ? "trace-result is-accepted" : "trace-result is-rejected"}>{repaired ? <ShieldCheck aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}<div><strong>{repaired ? labels.accepted : labels.blocked}</strong><p>{repaired ? labels.passed : labels.failed}</p></div></div></div>;
}

function CaseInteraction({ type, content }) {
  if (type === "pathways") return <PathwayExplorer content={content} />;
  if (type === "timeline") return <FloodTimeline content={content} />;
  return <GovernanceTrace content={content} />;
}

function CaseStudyPage({ content, locale, slug }) {
  const C = content.caseStudies[slug];
  const labels = content.caseLabels;
  return <article className="case-study"><header className="case-hero wrap"><p className="eyebrow">{C.eyebrow}</p><p className="case-status">{C.status}</p><h1>{C.title}</h1><p className="case-lede">{C.lede}</p><ul>{C.scale.map((item) => <li key={item}>{item}</li>)}</ul></header><section className="section case-overview"><div className="wrap two-column"><div><p className="eyebrow">{labels.problem}</p><h2>{labels.why}</h2><p>{C.problem}</p></div><aside><p className="eyebrow">{labels.aiTeams}</p><p>{C.relevance}</p></aside></div></section><section className="section"><div className="wrap"><SectionHead eyebrow={labels.artifact} title={labels.inspect} intro={C.artifact} id="artifact-title" /><CaseInteraction type={C.interaction} content={content} /></div></section><section className="section case-method"><div className="wrap two-column"><div><p className="eyebrow">{labels.roleMethod}</p><h2>{labels.built}</h2><p>{C.role}</p><ol>{C.method.map((item) => <li key={item}>{item}</li>)}</ol></div><div className="limits-panel"><AlertTriangle aria-hidden="true" /><h2>{labels.validation}</h2><h3>{labels.validationShort}</h3><ul>{C.validation.map((item) => <li key={item}>{item}</li>)}</ul><h3>{labels.limitations}</h3><ul>{C.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section><section className="section case-learned"><div className="wrap"><p className="eyebrow">{labels.changed}</p><blockquote>{C.learned}</blockquote><p className="record-links">{C.links.map((link) => <SmartLink key={link.href} className="button button-outline" href={link.href} locale={locale}>{link.label}<ArrowUpRight aria-hidden="true" size={16} /></SmartLink>)}</p></div></section><Contact content={content} /></article>;
}

function SiteFooter({ content }) {
  return <footer className="site-footer"><div className="wrap"><div><strong>{content.name}</strong><p>{content.footer.line}</p></div><p>{content.footer.note}<br />© 2026 Wenyu Chiou</p></div></footer>;
}

export function App({ page = "home", locale = "en", basePath = "/" }) {
  const content = CONTENT[locale] || CONTENT.en;
  let body;
  if (page === "home") body = <Home content={content} locale={locale} />;
  else if (page === "work") body = <WorkPage content={content} locale={locale} />;
  else if (page === "research") body = <ResearchPage content={content} locale={locale} />;
  else if (page === "publications") body = <PublicationsPage content={content} locale={locale} />;
  else if (page === "about") body = <AboutPage content={content} />;
  else if (page.startsWith("case:")) body = <CaseStudyPage content={content} locale={locale} slug={page.slice(5)} />;
  else body = <Home content={content} locale={locale} />;
  return <><SiteHeader content={content} locale={locale} page={page} basePath={basePath} /><main id="main">{body}</main><SiteFooter content={content} /></>;
}
