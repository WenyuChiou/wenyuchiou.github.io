// Wenyu Chiou — personal site (v2 editorial)
const { useState, useEffect, useRef } = React;
const T = (val, lang) => (typeof val === "string" ? val : val?.[lang] ?? "");

function useScrollReveal() {
  useEffect(() => {
    const reveal = (el) => {
      el.classList.add("in");
      // Force any stuck transitions to complete
      el.getAnimations().forEach(a => a.finish());
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -10% 0px" });
    const obs = () => {
      document.querySelectorAll(".reveal:not(.in), .reveal-stagger:not(.in)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          reveal(el);
        } else {
          io.observe(el);
        }
      });
    };
    requestAnimationFrame(obs);
    const t1 = setTimeout(obs, 250);
    const t2 = setTimeout(obs, 800);
    // Safety net: if anything is still invisible after 2s, just reveal it
    const safety = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in), .reveal-stagger:not(.in)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.2) reveal(el);
      });
    }, 1500);
    return () => { io.disconnect(); clearTimeout(t1); clearTimeout(t2); clearTimeout(safety); };
  }, []);
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids.join(",")]);
  return active;
}

function Nav({ lang, setLang, theme, setTheme, active }) {
  const C = window.CONTENT.nav;
  const links = [
    ["about",    C.about,    "01"],
    ["research", C.research, "02"],
    ["projects", C.projects, "03"],
    ["skills",   { en: "Skills", zh: "技能" }, "04"],
    ["pubs",     C.pubs,     "05"],
    ["linkedin", { en: "LinkedIn", zh: "LinkedIn" }, "06"],
    ["repos",    C.repos,    "07"],
    ["contact",  C.contact,  "08"],
  ];
  return (
    <nav className="nav">
      <div className="wrap nav-row">
        <a href="#top" className="brand">
          <div className="brand-mark"><span>w</span></div>
          <div className="brand-name">
            Wenyu Chiou
            <span className="zh">{lang === "en" ? "邱文昱" : "Wenyu"}</span>
          </div>
        </a>
        <div className="nav-links">
          {links.map(([id, label, num]) => (
            <a key={id} href={`#${id}`} data-num={num} className={active === id ? "active" : ""}>{T(label, lang)}</a>
          ))}
        </div>
        <div className="nav-tools">
          <button className="icon-btn" onClick={() => setLang(lang === "en" ? "zh" : "en")} title="Language">
            <span style={{fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14}}>{lang === "en" ? "中" : "EN"}</span>
          </button>
          <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Theme">
            {theme === "dark" ? window.Icons.sun : window.Icons.moon}
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ lang }) {
  const C = window.CONTENT.hero;
  return (
    <header className="hero-v2" id="top">
      <div className="wrap hero-v2-grid">
        <div className="hero-v2-photo reveal">
          <img src="assets/cover.jpg" alt="Wenyu Chiou presenting at AGU 2025"/>
          <div className="hero-v2-photo-cap">
            <span className="dot"/>
            <span>{lang === "en" ? "AGU Fall Meeting 2025 · New Orleans" : "AGU 2025 · 紐奧良"}</span>
          </div>
        </div>

        <div className="hero-v2-text">
          <div className="hero-v2-eyebrow reveal">
            <span>{lang === "en" ? "Ph.D. Candidate" : "博士候選人"}</span>
            <span className="sep"/>
            <span>Lehigh · CEE</span>
            <span className="sep"/>
            <span className="live">{lang === "en" ? "Open for 2026" : "2026 開放合作"}</span>
          </div>

          <h1 className="hero-v2-h1 reveal">
            {lang === "en" ? (
              <>Modeling how households <em>decide</em> under <span className="mark">flood risk</span>, <span className="serif-italic tail">and how cities adapt.</span></>
            ) : (
              <>以 LLM 智能體模擬家戶面對 <span className="mark">洪水風險</span> 的<em>決策</em>，<span className="serif-italic tail">以及城市如何調適。</span></>
            )}
          </h1>

          <p className="hero-v2-lede reveal">{T(C.lede, lang)}</p>

          <div className="hero-v2-currently reveal">
            <span className="hero-currently-label">{lang === "en" ? "Currently" : "目前"}</span>
            <ul className="hero-currently-list">
              <li><span className="hero-currently-dot" style={{background: "oklch(0.62 0.16 150)"}}/>{lang === "en" ? "Drafting FLOODABM journal paper" : "撰寫 FLOODABM 期刊論文中"}</li>
              <li><span className="hero-currently-dot" style={{background: "oklch(0.65 0.15 240)"}}/>{lang === "en" ? "Developing LLM-agent framework + multi-agent system coupled with catastrophe flood model" : "開發 LLM 代理框架與多智能體系統，與災害洪水模型耦合"}</li>
              <li><span className="hero-currently-dot" style={{background: "oklch(0.70 0.14 60)"}}/>{lang === "en" ? "Open to 2026 internships & collaborations" : "開放 2026 實習與學術合作"}</li>
            </ul>
          </div>

          <div className="hero-v2-cta reveal">
            <a className="btn primary" href="#contact">{window.Icons.mail}{T(C.contact, lang)}</a>
            <a className="btn" href="https://github.com/WenyuChiou" target="_blank" rel="noopener">{window.Icons.github}GitHub</a>
            <a className="btn ghost" href="#projects">{lang === "en" ? "See work" : "看作品"}{window.Icons.arrow}</a>
          </div>

          <dl className="hero-v2-facts reveal">
            <div><dt>{lang === "en" ? "Group" : "研究群"}</dt><dd>Complex Water Adaptive System</dd></div>
            <div><dt>{lang === "en" ? "Center" : "中心"}</dt><dd>{lang === "en" ? "Catastrophe Modeling & Resilience" : "災害建模與韌性中心"}</dd></div>
            <div><dt>{lang === "en" ? "Focus" : "重心"}</dt><dd>ABM · LLM Agents · Flood Risk</dd></div>
            <div><dt>{lang === "en" ? "Based in" : "地點"}</dt><dd>Bethlehem, PA · US</dd></div>
          </dl>
        </div>
      </div>
    </header>
  );
}

function SectionHead({ num, kicker, lang, sub }) {
  return (
    <header className="section-head reveal">
      <div className="section-head-meta">
        <span className="section-num">{num}</span>
        <div className="section-rule"/>
        {sub && <span className="section-sub">{T(sub, lang)}</span>}
      </div>
      <h2 className="section-title">{T(kicker, lang)}</h2>
    </header>
  );
}

function About({ lang }) {
  const C = window.CONTENT.about;
  return (
    <section id="about" className="wrap section-pad">
      <SectionHead num="01" kicker={C.kicker} lang={lang}/>

      <div className="about-v2">
        <div className="about-v2-lead reveal">
          <p className="lead-text">
            {lang === "en" ? (
              <>I build <em>agent-based models</em> coupled with catastrophe simulators, and use <em>LLM agents</em> to study long-term household adaptation to flood risk.</>
            ) : (
              <>我結合 <em>智能體模擬 (ABM)</em> 與災害模型，並以 <em>LLM 智能體</em> 研究家戶面對洪水風險的長期調適行為。</>
            )}
          </p>
        </div>

        <div className="about-v2-body reveal">
          <p>{T(C.p1, lang)}</p>
          <p>{T(C.p2, lang)}</p>
        </div>

        <aside className="about-v2-card reveal">
          <div className="about-v2-card-inner">
            <div className="about-v2-portrait">
              <img src="assets/avatar.jpg" alt="Wenyu Chiou"/>
            </div>
            <dl>
              <dt>{lang === "en" ? "Role" : "身分"}</dt>
              <dd>{lang === "en" ? "Ph.D. Candidate" : "博士候選人"}</dd>
              <dt>{lang === "en" ? "At" : "任職"}</dt>
              <dd>Lehigh University · CEE</dd>
              <dt>{lang === "en" ? "Since" : "起始"}</dt>
              <dd>Aug 2024</dd>
              <dt>{lang === "en" ? "Based in" : "地點"}</dt>
              <dd>Bethlehem, PA</dd>
            </dl>
            <div className="interests">
              {C.interests.slice(0, 6).map((i, idx) => <span className="chip" key={idx}>{T(i, lang)}</span>)}
            </div>
          </div>
        </aside>
      </div>

      <div className="field-strip reveal-stagger">
        <figure className="field-item">
          <img src="assets/ies.jpg" alt="Institute of Earth Sciences internship"/>
          <figcaption>
            <span className="y">2020</span>
            <span className="t">{lang === "en" ? "Academia Sinica — IES Summer Research" : "中研院 · 地科所暑期研究"}</span>
          </figcaption>
        </figure>
        <figure className="field-item">
          <img src="assets/ncdr.jpg" alt="NCDR summer internship"/>
          <figcaption>
            <span className="y">2022</span>
            <span className="t">{lang === "en" ? "NCDR — Climate Adaptation Internship" : "NCDR · 氣候調適實習"}</span>
          </figcaption>
        </figure>
        <figure className="field-item">
          <img src="assets/cover.jpg" alt="AGU 2025 poster"/>
          <figcaption>
            <span className="y">2025</span>
            <span className="t">{lang === "en" ? "AGU Fall Meeting — Poster NH41E-0449" : "AGU 年會 · 海報 NH41E-0449"}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Timeline({ items, lang }) {
  // Vertical fallback (used for Education)
  return (
    <div className="timeline reveal-stagger">
      {items.map((it, i) => (
        <div className="t-item" key={i}>
          <div className="t-date">{T(it.date, lang)}</div>
          <div className="t-dot" aria-hidden="true"></div>
          <div className="t-body">
            <h3>{T(it.role, lang)}</h3>
            <span className="t-org">{T(it.org, lang)}</span>
            <p>{T(it.desc, lang)}</p>
            <div className="t-tags">
              {it.tags.map((t, j) => <span className="chip" key={j}>{t}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Horizontal interactive timeline — industry-facing
function CareerTrack({ items, lang }) {
  // items come newest-first from content; reverse so time reads left→right
  const chrono = [...items].reverse();
  const defaultIdx = chrono.length - 1; // most recent selected
  const [sel, setSel] = useState(defaultIdx);
  const [hover, setHover] = useState(null);
  const active = hover != null ? hover : sel;
  const cur = chrono[active];

  // Short year label for axis (e.g. "2020", "2024")
  const yearOf = (it) => {
    const d = T(it.date, "en");
    const m = d.match(/(19|20)\d{2}/);
    return m ? m[0] : "";
  };
  const shortRole = (it) => {
    const r = T(it.role, "en");
    // abbreviations suitable for the tick labels
    if (/Ph\.?D/i.test(r)) return "Ph.D.";
    if (/Candidate/i.test(r)) return "Ph.D.";
    if (/Summer Intern/i.test(r)) return "Intern";
    if (/Research Intern/i.test(r)) return "Intern";
    if (/Research Assistant/i.test(r)) return "RA";
    return r.split(" ")[0];
  };
  const shortOrg = (it) => {
    const o = T(it.org, "en");
    if (/Lehigh/.test(o)) return "Lehigh";
    if (/National Central/.test(o)) return "NCU";
    if (/NCDR/.test(o)) return "NCDR";
    if (/Academia Sinica/.test(o)) return "IES";
    return o.split(/[·,]/)[0].trim();
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") setSel(i => Math.min(chrono.length - 1, i + 1));
    if (e.key === "ArrowLeft") setSel(i => Math.max(0, i - 1));
  };

  return (
    <div className="career" tabIndex={0} onKeyDown={onKey}>
      {/* Axis with nodes + a ghost "next" node on the right */}
      <div className="career-axis" role="tablist" aria-label={lang === "en" ? "Career timeline" : "職涯時間軸"}>
        <div className="career-line"/>
        {chrono.map((it, i) => (
          <button
            key={i}
            className={"career-node" + (active === i ? " is-active" : "") + (sel === i ? " is-selected" : "")}
            role="tab"
            aria-selected={sel === i}
            onClick={() => setSel(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setSel(i)}
          >
            <span className="node-dot" aria-hidden="true"></span>
            <span className="node-year mono">{yearOf(it)}</span>
            <span className="node-label">
              <span className="node-role">{shortRole(it)}</span>
              <span className="node-org">{shortOrg(it)}</span>
            </span>
          </button>
        ))}
        <div className="career-node career-node-next" aria-hidden="true">
          <span className="node-dot node-dot-future"></span>
          <span className="node-year mono">2026</span>
          <span className="node-label">
            <span className="node-role">{lang === "en" ? "Next" : "下一步"}</span>
            <span className="node-org">{lang === "en" ? "Industry" : "業界"}</span>
          </span>
        </div>
      </div>

      {/* Detail panel */}
      <div className="career-panel" key={active}>
        <div className="career-panel-head">
          <span className="career-date mono">{T(cur.date, lang)}</span>
          <span className="career-org-line">{T(cur.org, lang)}</span>
        </div>
        <h3 className="career-role">{T(cur.role, lang)}</h3>
        <p className="career-desc">{T(cur.desc, lang)}</p>
        <div className="career-tags">
          {cur.tags.map((t, j) => <span className="chip" key={j}>{t}</span>)}
        </div>
      </div>

      {/* Controls */}
      <div className="career-controls">
        <button className="career-btn" onClick={() => setSel(i => Math.max(0, i - 1))} disabled={sel === 0} aria-label="Previous">←</button>
        <span className="career-count mono">{String(sel + 1).padStart(2, "0")} / {String(chrono.length).padStart(2, "0")}</span>
        <button className="career-btn" onClick={() => setSel(i => Math.min(chrono.length - 1, i + 1))} disabled={sel === chrono.length - 1} aria-label="Next">→</button>
      </div>
    </div>
  );
}

function Research({ lang }) {
  const E = window.CONTENT.experience;
  const D = window.CONTENT.education;
  return (
    <section id="research" className="wrap section-pad">
      <SectionHead num="02" kicker={E.kicker} lang={lang} sub={{en: "Career trajectory · open for 2026 industry roles", zh: "職涯軌跡 · 2026 業界機會開放中"}}/>
      <CareerTrack items={E.items} lang={lang}/>
      <div className="edu-compact reveal-stagger">
        <h4 className="col-title">{lang === "en" ? "Education" : "學歷"}</h4>
        <ul className="edu-list">
          {D.items.map((it, i) => (
            <li className="edu-row" key={i}>
              <span className="edu-date mono">{T(it.date, lang)}</span>
              <div className="edu-body">
                <span className="edu-role">{T(it.role, lang)}</span>
                <span className="edu-org">{T(it.org, lang)}</span>
              </div>
              <div className="edu-tags">{it.tags.map((t, j) => <span className="chip" key={j}>{t}</span>)}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Projects({ lang }) {
  const C = window.CONTENT.projects;
  return (
    <section id="projects" className="wrap section-pad">
      <SectionHead num="03" kicker={C.kicker} lang={lang} sub={{en: "Posters, frameworks, open-source", zh: "海報 · 框架 · 開源"}}/>
      <p className="reveal section-intro">{T(C.intro, lang)}</p>
      <div className="proj-v2-grid reveal-stagger">
        {C.items.map((p, i) => {
          const roleLbl = {
            lead:    lang === "en" ? "Lead"         : "主導",
            builder: lang === "en" ? "Builder"      : "建構者",
            collab:  lang === "en" ? "Collaborator" : "合作者",
          }[p.role];
          return (
          <a className={"proj-v2" + (p.featured ? " featured" : "")} key={i} href={p.href} target="_blank" rel="noopener">
            <div className="proj-v2-media">
              {p.image ? <img src={p.image} alt={T(p.title, lang)}/> : <div className="proj-v2-placeholder">{window.Covers[p.cover]}</div>}
              {p.role && <span className={"proj-v2-role proj-v2-role-" + p.role}>{roleLbl}</span>}
            </div>
            <div className="proj-v2-body">
              <div className="proj-v2-meta">
                <span className="pill">{T(p.meta, lang)}</span>
                {p.featured && <span className="pill pill-featured">★ {lang === "en" ? "Featured" : "精選"}</span>}
              </div>
              <h3 className="proj-v2-title">{T(p.title, lang)}</h3>
              <p className="proj-v2-desc">{T(p.desc, lang)}</p>
              {p.stack && (
                <div className="proj-v2-stack">
                  <span className="proj-v2-stack-label">{lang === "en" ? "Stack" : "技術棧"}</span>
                  {p.stack.map((s, j) => <span className="stack-pill mono" key={j}>{s}</span>)}
                </div>
              )}
              <div className="proj-v2-tags">
                {p.tags.map((t, j) => <span className="chip" key={j}>{t}</span>)}
              </div>
              <div className="proj-v2-foot">
                <span className="mono">{T(p.foot, lang)}</span>
                <span className="arr">{window.Icons.external}</span>
              </div>
            </div>
          </a>
          );
        })}
      </div>
    </section>
  );
}

function Publications({ lang }) {
  const C = window.CONTENT.pubs;
  const [expanded, setExpanded] = React.useState(null);
  const [copied, setCopied] = React.useState(null);

  const typeLabel = {
    journal: lang === "en" ? "Journal" : "期刊",
    poster:  lang === "en" ? "Poster"  : "海報",
    report:  lang === "en" ? "Report"  : "報告",
    preprint: lang === "en" ? "Preprint" : "預印本",
  };

  const totalCites = C.items.reduce((s, p) => s + (p.cites || 0), 0);
  const journalCount = C.items.filter(p => p.type === "journal").length;
  const posterCount = C.items.filter(p => p.type === "poster").length;

  const makeBibtex = (p) => {
    const first = p.authors.split(",")[0].trim().toLowerCase().replace(/[^a-z]/g, "");
    const key = `${first}${p.year}`;
    return `@${p.type === "journal" ? "article" : "misc"}{${key},\n  author = {${p.authors}},\n  title  = {${T(p.title, "en")}},\n  venue  = {${p.venue}},\n  year   = {${p.year}}${p.doi ? `,\n  doi    = {${p.doi}}` : ""}\n}`;
  };

  const copyBib = (e, p, i) => {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(makeBibtex(p));
    setCopied(i);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section id="pubs" className="wrap section-pad">
      <SectionHead num="05" kicker={C.kicker} lang={lang}/>
      <p className="reveal section-intro">{T(C.intro, lang)}</p>

      <div className="pub-summary reveal">
        <div className="pub-sum-item"><span className="pub-sum-num">{C.items.length}</span><span className="pub-sum-lbl">{lang === "en" ? "Publications" : "著作"}</span></div>
        <div className="pub-sum-item"><span className="pub-sum-num">{posterCount}</span><span className="pub-sum-lbl">{lang === "en" ? "Conference posters" : "會議海報"}</span></div>
        <div className="pub-sum-item"><span className="pub-sum-num">{journalCount}</span><span className="pub-sum-lbl">{lang === "en" ? "Journal articles" : "期刊論文"}</span></div>
        <div className="pub-sum-item"><span className="pub-sum-num">{totalCites}</span><span className="pub-sum-lbl">{lang === "en" ? "Citations (GS)" : "引用 (GS)"}</span></div>
      </div>

      <div className="pub-list reveal-stagger">
        {C.items.map((p, i) => {
          const parts = p.authors.split("Chiou, W.-Y.");
          const isOpen = expanded === i;
          return (
            <article className={"pub" + (p.featured ? " pub-featured" : "") + (isOpen ? " pub-open" : "")} key={i}>
              <div className="pub-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="pub-body">
                <div className="pub-meta-top">
                  <span className={"pub-type pub-type-" + p.type}>{typeLabel[p.type] || p.type}</span>
                  {p.quartile && <span className="pub-q">{p.quartile}</span>}
                  {p.featured && <span className="pub-featured-badge">★ {lang === "en" ? "Featured" : "精選"}</span>}
                  <span className="pub-venue-short mono">{p.venue_short || p.venue}</span>
                </div>
                <h4 className="pub-title" onClick={() => setExpanded(isOpen ? null : i)}>
                  {T(p.title, lang)}
                </h4>
                <div className="pub-authors">
                  {parts.map((chunk, j) => (
                    <React.Fragment key={j}>
                      {chunk}
                      {j < parts.length - 1 && <span className="me">Chiou, W.-Y.</span>}
                    </React.Fragment>
                  ))}
                </div>
                {isOpen && p.abstract && (
                  <p className="pub-abstract">{T(p.abstract, lang)}</p>
                )}
                <div className="pub-actions">
                  <span className="pub-cites">
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="M6 2a1 1 0 000 2h4a1 1 0 100-2H6zM4 6a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1zm-1 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z"/></svg>
                    {lang === "en" ? "Cited by " : "被引用 "}{p.cites || 0}
                  </span>
                  {p.doi && (
                    <a className="pub-link" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
                      DOI ↗
                    </a>
                  )}
                  <button className="pub-link" onClick={(e) => copyBib(e, p, i)}>
                    {copied === i ? (lang === "en" ? "✓ Copied" : "✓ 已複製") : "BibTeX"}
                  </button>
                  <button className="pub-link pub-expand" onClick={(e) => { e.preventDefault(); setExpanded(isOpen ? null : i); }}>
                    {isOpen ? (lang === "en" ? "Hide abstract ↑" : "收合摘要 ↑") : (lang === "en" ? "Abstract ↓" : "摘要 ↓")}
                  </button>
                </div>
              </div>
              <div className="pub-year">{p.year}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Skills({ lang }) {
  const C = window.CONTENT.skills;
  const iconMap = {
    brain: window.Icons.brain || window.Icons.repo,
    code:  window.Icons.code  || window.Icons.repo,
    ai:    window.Icons.ai    || window.Icons.repo,
    flow:  window.Icons.flow  || window.Icons.repo,
    data:  window.Icons.data  || window.Icons.repo,
    write: window.Icons.write || window.Icons.repo,
  };
  return (
    <section id="skills" className="wrap section-pad">
      <SectionHead num="05" kicker={C.kicker} lang={lang} sub={{en: "Methods, tools, and AI-native workflows", zh: "方法、工具與 AI 原生工作流"}}/>
      <div className="skills-grid reveal-stagger">
        {C.cats.map((cat, i) => (
          <div className="skill-card" key={i}>
            <div className="skill-head">
              <span className="skill-icon">{iconMap[cat.icon]}</span>
              <h4>{T(cat.name, lang)}</h4>
            </div>
            <div className="skill-items">
              {cat.items.map((it, j) => <span className="chip" key={j}>{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LinkedIn({ lang }) {
  const C = window.CONTENT.linkedin;
  return (
    <section id="linkedin" className="wrap section-pad">
      <SectionHead num="07" kicker={C.kicker} lang={lang} sub={{en: "Recent posts & notes", zh: "近期貼文與筆記"}}/>
      <div className="ln-head reveal">
        <p className="section-intro" style={{margin: 0, flex: 1}}>{T(C.intro, lang)}</p>
        <a className="btn" href={C.profile_url} target="_blank" rel="noopener">
          {window.Icons.linkedin}{lang === "en" ? "Follow on LinkedIn" : "在 LinkedIn 追蹤"}
        </a>
      </div>
      <div className="ln-grid reveal-stagger">
        {C.items.map((it, i) => (
          <a className="ln-card" key={i} href={C.profile_url} target="_blank" rel="noopener">
            <div className="ln-author">
              <div className="ln-avatar">WC</div>
              <div className="ln-author-meta">
                <div className="ln-author-name">{T(window.CONTENT.nav.name, lang)} <span className="ln-verify" aria-hidden>✓</span></div>
                <div className="ln-author-sub">{lang === "en" ? "PhD Candidate · Lehigh University — Catastrophe Modeling & Resilience" : "博士候選人 · Lehigh 大學 — 災害建模與韌性中心"}</div>
                <div className="ln-author-time mono">{T(it.date, lang)} · <span className="ln-globe">🌐</span></div>
              </div>
              <span className="ln-tag">{T(it.tag, lang)}</span>
            </div>
            <h4 className="ln-title">{T(it.title, lang)}</h4>
            <p className="ln-excerpt">{T(it.excerpt, lang)}</p>
            <div className="ln-reactions">
              <span className="ln-react-dots" aria-hidden>
                <span className="ln-react-dot ln-react-like">👍</span>
                <span className="ln-react-dot ln-react-love">❤</span>
                <span className="ln-react-dot ln-react-insight">💡</span>
              </span>
              <span className="ln-react-count">{it.reactions}</span>
              <span className="ln-react-sep">·</span>
              <span className="ln-react-count">{it.comments} {lang === "en" ? "comments" : "則留言"}</span>
              <span className="ln-more">{lang === "en" ? "Read →" : "閱讀 →"}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Repos({ lang }) {
  const C = window.CONTENT.repos;
  // Group repos by theme so the reading flow matches the About story
  const groups = [
    {
      label: { en: "Research code", zh: "研究程式碼" },
      tag:   { en: "Dissertation & catastrophe modeling", zh: "博士研究與災害建模" },
      names: ["FLOODABM", "WAGF", "Cat_framework"]
    },
    {
      label: { en: "AI skills & agentic workflows", zh: "AI 技能與代理工作流" },
      tag:   { en: "Composable tools for researchers", zh: "給研究者的可組合工具" },
      names: ["research-hub", "zotero-skills", "codex-delegate", "gemini-delegate-skill", "session-sweep"]
    },
    {
      label: { en: "Trading & market sensing", zh: "量化與市場感測" },
      tag:   { en: "Multi-agent desks & sentiment", zh: "多代理交易桌與情緒分析" },
      names: ["multi-analyst-desk", "ai-trader-ollama", "moodring", "Event-Driven-Strategy"]
    },
  ];
  const byName = Object.fromEntries(C.items.map(r => [r.name, r]));
  return (
    <section id="repos" className="wrap section-pad">
      <SectionHead num="06" kicker={C.kicker} lang={lang} sub={{en: "Grouped by what they do", zh: "依用途分組"}}/>
      <p className="reveal section-intro">{T(C.intro, lang)}</p>
      <div className="repo-groups reveal-stagger">
        {groups.map((g, gi) => (
          <div className="repo-group" key={gi}>
            <div className="repo-group-head">
              <h3 className="repo-group-label">{T(g.label, lang)}</h3>
              <span className="repo-group-tag">{T(g.tag, lang)}</span>
            </div>
            <div className="repo-list">
              {g.names.map((n, i) => {
                const r = byName[n]; if (!r) return null;
                const statusLabel = {
                  active: lang === "en" ? "Active" : "活躍",
                  experimental: lang === "en" ? "Experimental" : "實驗中",
                  archived: lang === "en" ? "Archived" : "已封存",
                }[r.status] || null;
                return (
                  <a className="repo-row" key={i} href={r.href} target="_blank" rel="noopener">
                    <span className="repo-row-num mono">{String(i + 1).padStart(2, "0")}</span>
                    <div className="repo-row-body">
                      <div className="repo-row-top">
                        <span className="repo-row-name">{r.name}</span>
                        <span className="repo-row-lang" style={{"--lang-color": r.color}}>{r.lang}</span>
                        {statusLabel && <span className={"repo-status repo-status-" + r.status}>{statusLabel}</span>}
                      </div>
                      <p className="repo-row-desc">{T(r.desc, lang)}</p>
                      <div className="repo-row-stats">
                        <span className="repo-stat"><svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M8 .25l2.39 4.84 5.34.78-3.87 3.77.91 5.32L8 12.48l-4.77 2.48.91-5.32L.27 5.87l5.34-.78z"/></svg>{r.stars}</span>
                        <span className="repo-stat"><svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v5.256a2.251 2.251 0 101.5 0V5.372zM5 13a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9.75-.75a.75.75 0 110 1.5.75.75 0 010-1.5zM13.25 7a3.251 3.251 0 11-3.25-3.25h.879l-.44-.44a.75.75 0 011.06-1.06l1.72 1.72a.75.75 0 010 1.06l-1.72 1.72a.75.75 0 11-1.06-1.06l.44-.44H10A1.75 1.75 0 0011.75 7z"/></svg>{r.forks}</span>
                        <span className="repo-stat repo-stat-date mono">↻ {T(r.updated, lang)}</span>
                      </div>
                    </div>
                    <span className="repo-row-arrow">{window.Icons.external}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ lang }) {
  const C = window.CONTENT.contact;
  return (
    <section id="contact" className="wrap section-pad contact">
      <SectionHead num="08" kicker={C.kicker} lang={lang}/>
      <div className="contact-inner reveal">
        <h2 className="serif italic">{T(C.title, lang)}</h2>
        <p>{T(C.body, lang)}</p>
        <div className="contact-actions">
          <a className="btn primary" href="mailto:wec324@lehigh.edu">{window.Icons.mail}wec324@lehigh.edu</a>
          <a className="btn" href="https://github.com/WenyuChiou" target="_blank" rel="noopener">{window.Icons.github}{T(C.github_label, lang)}</a>
          <a className="btn" href="https://www.linkedin.com/in/wenyu-chiou" target="_blank" rel="noopener">{window.Icons.linkedin}{T(C.linkedin_label, lang)}</a>
          <a className="btn" href="https://www.threads.com/@wenyu_chiou" target="_blank" rel="noopener">{window.Icons.threads}Threads</a>
          <a className="btn" href="https://orcid.org/0009-0005-8006-1288" target="_blank" rel="noopener">{T(C.orcid_label, lang)}</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }) {
  const C = window.CONTENT.footer;
  return (
    <footer className="footer wrap">
      <div className="footer-row">
        <span>{T(C.copy, lang)}</span>
        <span className="mono">{T(C.note, lang)}</span>
      </div>
    </footer>
  );
}

function TweaksPanel({ lang, theme, setTheme, setLang }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") setActive(true);
      if (e.data?.type === "__deactivate_edit_mode") setActive(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({type: "__edit_mode_available"}, "*");
    return () => window.removeEventListener("message", handler);
  }, []);
  if (!active) return null;
  return (
    <div className="tweaks-panel active">
      <h5>Tweaks</h5>
      <div className="tweak-row"><span>Theme</span>
        <div className="seg">
          <button className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>Light</button>
          <button className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>Dark</button>
        </div>
      </div>
      <div className="tweak-row"><span>Language</span>
        <div className="seg">
          <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>中文</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("wy-lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("wy-theme") || "light");
  useEffect(() => { localStorage.setItem("wy-lang", lang); document.documentElement.lang = lang === "zh" ? "zh-TW" : "en"; }, [lang]);
  useEffect(() => { localStorage.setItem("wy-theme", theme); document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useScrollReveal();
  const active = useActiveSection(["top","about","research","projects","skills","pubs","linkedin","repos","contact"]);
  return (
    <>
      <Nav lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} active={active}/>
      <Hero lang={lang}/>
      <About lang={lang}/>
      <Research lang={lang}/>
      <Projects lang={lang}/>
      <Skills lang={lang}/>
      <Publications lang={lang}/>
      <LinkedIn lang={lang}/>
      <Repos lang={lang}/>
      <Contact lang={lang}/>
      <Footer lang={lang}/>
      <TweaksPanel lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
