// Wenyu Chiou — personal site (v2 editorial)
const { useState, useEffect, useRef } = React;
const T = (val, lang) => (typeof val === "string" ? val : val?.[lang] ?? "");

// Mode-specific CV downloads: ACADEMIC and INDUSTRY versions
const CV_FILES = {
  academic: "assets/Wenyu_Chiou_CV_Academic.pdf",
  industry: "assets/Wenyu_Chiou_CV_Industry.pdf",
};

// Reveal-on-scroll. Content is NEVER allowed to depend on JS to be visible:
// the effect re-runs whenever `deps` change (e.g. mode/lang swap remounts
// sections) and a scroll listener re-sweeps so fast scrolling can't outrun
// the reveal. prefers-reduced-motion → reveal everything immediately.
function useScrollReveal(deps = []) {
  useEffect(() => {
    const reveal = (el) => {
      el.classList.add("in");
      el.getAnimations().forEach(a => a.finish());
    };
    const all = () => document.querySelectorAll(".reveal:not(.in), .reveal-stagger:not(.in)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      all().forEach(reveal);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -10% 0px" });
    const sweep = () => {
      all().forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) reveal(el);
        else io.observe(el);
      });
    };
    requestAnimationFrame(sweep);
    const timers = [250, 800, 1500].map(ms => setTimeout(sweep, ms));
    // Fail-safe: re-sweep on scroll so a fast flick never leaves a section blank.
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; sweep(); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, deps);
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

function nowMs() { return new Date().getTime(); }

// Map a GitHub repo URL -> "owner/repo" slug's repo name (or null).
function repoFromHref(href) {
  const m = (href || "").match(/github\.com\/[^/]+\/([^/?#]+)/);
  return m ? m[1].replace(/\/$/, "") : null;
}

// Live GitHub star/fork counts, cached in localStorage for 6h. Returns a map
// { repoName: {stars, forks} } or null (loading / error -> consumers fall back
// to the hardcoded counts in content.js). Never blocks render.
function useGitHubStars(user = "WenyuChiou") {
  const [data, setData] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem("wy-gh-stars") || "null");
      if (c && c.data && nowMs() - c.ts < 6 * 3600 * 1000) return c.data;
    } catch (e) {}
    return null;
  });
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("wy-gh-stars") || "null");
      if (c && c.data && nowMs() - c.ts < 6 * 3600 * 1000) return; // fresh cache
    } catch (e) {}
    let alive = true;
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(repos => {
        if (!alive || !Array.isArray(repos)) return;
        const map = {};
        repos.forEach(r => { map[r.name] = { stars: r.stargazers_count, forks: r.forks_count }; });
        setData(map);
        try { localStorage.setItem("wy-gh-stars", JSON.stringify({ ts: nowMs(), data: map })); } catch (e) {}
      })
      .catch(() => {}); // keep fallback
    return () => { alive = false; };
  }, [user]);
  return data;
}

// Counts up 0 -> end when scrolled into view; respects reduced motion; restarts
// when `end` changes (e.g. the live GitHub value resolves after first paint).
function CountUp({ end, format }) {
  const [val, setVal] = useState(end);
  const ref = useRef(null);
  const seen = useRef(false);
  const fmt = format || ((n) => String(n));
  useEffect(() => {
    const target = Number(end) || 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(target); return; }
    const run = () => {
      const dur = 900, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (seen.current) { run(); return; } // already visible: animate to new target
    const el = ref.current;
    if (!el) { setVal(target); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { seen.current = true; run(); io.disconnect(); } });
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{fmt(val)}</span>;
}

function Nav({ lang, setLang, theme, setTheme, active, mode = "industry", onCmdK }) {
  const C = window.CONTENT.nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const cvFile = CV_FILES[mode] || CV_FILES.industry;
  const cvName = (mode === "academic" ? "Wenyu_Chiou_CV_Academic.pdf" : "Wenyu_Chiou_CV_Industry.pdf");
  const links = [
    ["about",    C.about,    "01"],
    ["research", C.research, "02"],
    ["projects", C.projects, "03"],
    ["skills",   { en: "Skills", zh: "技能" }, "04"],
    ["pubs",     C.pubs,     "05"],
    ["repos",    C.repos,    "06"],
    ["contact",  C.contact,  "07"],
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
          <button className="nav-cmdk" onClick={onCmdK} title={lang === "en" ? "Quick nav (⌘K)" : "快速導覽 (⌘K)"} aria-label={lang === "en" ? "Open quick navigation" : "開啟快速導覽"}>
            {window.Icons.search}<span className="nav-cmdk-keys mono">⌘K</span>
          </button>
          <a className="nav-cv" href={cvFile} download={cvName} title={T(window.CONTENT.hero.cv, lang)}>{window.Icons.download}<span>CV</span></a>
          <button className="icon-btn" onClick={() => setLang(lang === "en" ? "zh" : "en")} title="Language" aria-label={lang === "en" ? "切換至中文 · Switch to Chinese" : "Switch to English · 切換至英文"}>
            <span style={{fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14}}>{lang === "en" ? "中" : "EN"}</span>
          </button>
          <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Theme" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
            {theme === "dark" ? window.Icons.sun : window.Icons.moon}
          </button>
          <button className="icon-btn nav-burger" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen ? "true" : "false"} aria-controls="mobile-nav-menu">
            {menuOpen ? window.Icons.close : window.Icons.menu}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="nav-menu" id="mobile-nav-menu">
          <div className="wrap nav-menu-list">
            {links.map(([id, label, num]) => (
              <a key={id} href={`#${id}`} className={active === id ? "active" : ""} onClick={() => setMenuOpen(false)}>
                <span className="nav-menu-num">{num}</span>{T(label, lang)}
              </a>
            ))}
            <a className="nav-menu-cv" href={cvFile} download={cvName} onClick={() => setMenuOpen(false)}>
              {window.Icons.download}{T(window.CONTENT.hero.cv, lang)}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ lang, mode = "academic" }) {
  const C = window.CONTENT.hero;
  const I = window.CONTENT.industry?.hero;
  if (mode === "industry" && I) return <HeroIndustry lang={lang} C={C} I={I}/>;
  return <HeroAcademic lang={lang} C={C}/>;
}

function HeroIndustry({ lang, C, I }) {
  const eye = I.eyebrow[lang];
  const h1 = I.h1[lang];
  return (
    <header className="hero-v2 hero-industry" id="top">
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
            <span>{eye[0]}</span>
            <span className="sep"/>
            <span>{eye[1]}</span>
            <span className="sep"/>
            <span className="live">{eye[2]}</span>
          </div>

          <h1 className="hero-v2-h1 reveal">
            {h1.a}{" "}<em>{h1.b}</em>{" "}{h1.c}{" "}
            <span className="serif-italic tail">{h1.d}</span>
          </h1>

          <p className="hero-v2-lede reveal">{T(I.lede, lang)}</p>

          <div className="hero-v2-currently reveal">
            <span className="hero-currently-label">{T(I.currently.label, lang)}</span>
            <ul className="hero-currently-list">
              {I.currently.items.map((it, i) => (
                <li key={i}><span className="hero-currently-dot" style={{background: it.dot}}/>{T(it.text, lang)}</li>
              ))}
            </ul>
          </div>

          <div className="hero-v2-cta reveal">
            <a className="btn primary" href="#contact">{window.Icons.mail}{T(I.cta_primary, lang)}</a>
            <a className="btn" href={CV_FILES.industry} download="Wenyu_Chiou_CV_Industry.pdf">{window.Icons.download}{T(C.cv, lang)}</a>
            <a className="btn ghost" href="https://www.linkedin.com/in/wenyu-chiou" target="_blank" rel="noopener noreferrer">{window.Icons.linkedin}{T(I.cta_linkedin, lang)}</a>
            <a className="btn ghost" href="https://github.com/WenyuChiou" target="_blank" rel="noopener noreferrer">{window.Icons.github}GitHub</a>
          </div>

          <dl className="hero-v2-facts reveal">
            <div><dt>{lang === "en" ? "Role sought" : "職位"}</dt><dd>{lang === "en" ? "AI Agent / ML Engineer · Applied Scientist" : "AI 代理 / ML 工程師 · 應用科學家"}</dd></div>
            <div><dt>{lang === "en" ? "Location" : "地點"}</dt><dd>{lang === "en" ? "US · Taiwan · Remote" : "美國 · 台灣 · 遠端"}</dd></div>
            <div><dt>{lang === "en" ? "Available" : "可用時程"}</dt><dd>{lang === "en" ? "Summer 2027 (intern) · Full-time 2027–28" : "2027 夏實習 · 2027–28 全職"}</dd></div>
            <div><dt>{lang === "en" ? "Based in" : "現居"}</dt><dd>Bethlehem, PA · US</dd></div>
          </dl>
        </div>
      </div>
    </header>
  );
}

function HeroAcademic({ lang, C }) {
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
            <a className="btn" href={CV_FILES.academic} download="Wenyu_Chiou_CV_Academic.pdf">{window.Icons.download}{T(C.cv, lang)}</a>
            <a className="btn ghost" href="https://github.com/WenyuChiou" target="_blank" rel="noopener noreferrer">{window.Icons.github}GitHub</a>
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
            aria-selected={sel === i ? "true" : "false"}
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
        {cur.bullets && cur.bullets.length > 0 && (
          <ul className="career-bullets">
            {cur.bullets.map((b, j) => (
              <li key={j} className="career-bullet">
                <span className="career-bullet-num mono">{String(j + 1).padStart(2, "0")}</span>
                <span className="career-bullet-text">{T(b, lang)}</span>
              </li>
            ))}
          </ul>
        )}
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

function Projects({ lang, gh }) {
  const C = window.CONTENT.projects;
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);     // expanded compact card key
  const [lightbox, setLightbox] = useState(null); // {src, alt} or null

  // Live star count for a project (by repo slug), falling back to hardcoded.
  const liveStars = (p) => {
    const n = repoFromHref(p.href);
    const l = n && gh && gh[n];
    return (l ? l.stars : p.stars) || 0;
  };

  // Derive a short compact-card name from the project's URL (repo slug)
  // and fall back to the first 1–2 words of the title.
  const compactName = (p) => {
    const url = p.href || "";
    const m = url.match(/github\.com\/[^/]+\/([^/?#]+)/) ||
              url.match(/wenyuchiou\.github\.io\/([^/?#]+)/);
    if (m && m[1]) return m[1].replace(/\/$/, "");
    const title = (p.title.en || "").split(" — ")[0];
    return title.split(" ").slice(0, 2).join(" ");
  };

  // Star highlight threshold — items with stars >= this get a visible badge
  const STAR_HIGHLIGHT = 30;

  const groupOrder = ["research", "workflow", "learning"];
  const cats = C.categories || {};
  const itemsByCat = (cat) => C.items.filter(p => (p.category || "research") === cat);

  const renderCompact = (p, i) => {
    const key = p.href + i;
    const isOpen = open === key;
    const stars = liveStars(p);
    return (
      <article className={"proj-compact" + (isOpen ? " open" : "")} key={i}>
        <div className="proj-compact-head" role="button" tabIndex={0}
             aria-expanded={isOpen ? "true" : "false"}
             title={lang === "en" ? "Click for details" : "點擊看詳情"}
             onClick={() => setOpen(isOpen ? null : key)}
             onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(isOpen ? null : key); } }}>
          <span className="proj-compact-name">{compactName(p)}</span>
          {stars >= STAR_HIGHLIGHT
            ? <span className="proj-compact-stars" title={stars + " stars"}>★ <CountUp end={stars}/></span>
            : <span className="proj-compact-chevron" aria-hidden="true">{isOpen ? "–" : "+"}</span>}
        </div>
        <div className="proj-compact-meta">{T(p.meta, lang)}</div>
        {p.tldr && <p className="proj-compact-tldr">{T(p.tldr, lang)}</p>}
        <div className="proj-compact-tags">
          {(p.tags || []).slice(0, 3).map((t, j) => <span className="chip chip-sm" key={j}>{t}</span>)}
        </div>
        {isOpen && (
          <div className="proj-detail">
            {p.desc && <p className="proj-detail-desc">{T(p.desc, lang)}</p>}
            {p.image && (
              <button className="proj-detail-poster" onClick={() => setLightbox({ src: p.image, alt: T(p.title, lang) })}
                      aria-label={lang === "en" ? "Enlarge image" : "放大圖片"}>
                <img src={p.image} alt={T(p.title, lang)} loading="lazy"/>
              </button>
            )}
            <a className="proj-detail-link" href={p.href} target="_blank" rel="noopener noreferrer">
              {window.Icons.github}<span>{lang === "en" ? "View on GitHub" : "前往 GitHub"} ↗</span>
            </a>
          </div>
        )}
      </article>
    );
  };

  const renderFlagship = (p) => {
   const fstars = liveStars(p);
   return (
    <div className="proj-flagship reveal">
      <div className="proj-flagship-head">
        <span className="proj-flagship-star">★</span>
        <span className="proj-flagship-tag">{lang === "en" ? "FLAGSHIP" : "旗艦"}</span>
        <span className="proj-flagship-meta">{T(p.meta, lang)}</span>
      </div>
      <h3 className="proj-flagship-title">{T(p.title, lang)}</h3>
      {p.stack && (
        <div className="proj-flagship-subtitle">
          {p.stack.slice(0, 4).map((s, j) => (
            <React.Fragment key={j}>
              {j > 0 && <span className="proj-flagship-dot"> · </span>}
              <span>{s}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <p className="proj-flagship-desc">{T(p.desc, lang)}</p>
      <div className="proj-flagship-tags">
        {p.tags.map((t, j) => <span className="chip" key={j}>{t}</span>)}
      </div>
      {p.image && (
        <button className="proj-flagship-poster" onClick={() => setLightbox({ src: p.image, alt: T(p.title, lang) })}
                aria-label={lang === "en" ? "Enlarge image" : "放大圖片"}>
          <img src={p.image} alt={T(p.title, lang)} loading="lazy"/>
        </button>
      )}
      <div className="proj-flagship-foot">
        {fstars >= STAR_HIGHLIGHT && <span className="proj-flagship-stars">★ <CountUp end={fstars}/></span>}
        <div className="proj-flagship-links">
          <a className="proj-flagship-btn primary" href={p.href} target="_blank" rel="noopener noreferrer">
            {window.Icons.github}
            <span>{lang === "en" ? "View on GitHub" : "前往 GitHub"} ↗</span>
          </a>
        </div>
      </div>
    </div>
   );
  };

  return (
    <section id="projects" className="wrap section-pad">
      <SectionHead num="03" kicker={C.kicker} lang={lang} sub={{en: "Posters, frameworks, open-source", zh: "海報 · 框架 · 開源"}}/>
      <p className="reveal section-intro">{T(C.intro, lang)}</p>

      <div className="proj-filter reveal" role="tablist" aria-label={lang === "en" ? "Filter projects" : "篩選專案"}>
        {[["all", { en: "All", zh: "全部" }, C.items.length], ...groupOrder.map(c => [c, (cats[c] || {}).label || { en: c, zh: c }, itemsByCat(c).length])].map(([key, label, n]) => (
          <button key={key} className={"proj-filter-tab" + (filter === key ? " active" : "")}
                  role="tab" aria-selected={filter === key ? "true" : "false"}
                  onClick={() => { setFilter(key); setOpen(null); }}>
            {T(label, lang)} <span className="proj-filter-count">{n}</span>
          </button>
        ))}
      </div>

      {groupOrder.map((cat, gi) => {
        const items = itemsByCat(cat);
        if (items.length === 0) return null;
        if (filter !== "all" && cat !== filter) return null;
        const catMeta = cats[cat] || { label: { en: cat, zh: cat }, sub: { en: "", zh: "" } };
        const featuredHere = items.find(p => p.featured);
        const compactHere  = items.filter(p => !p.featured);
        return (
          <div className="proj-category reveal" key={cat}>
            <div className="proj-category-head">
              <span className="proj-category-num">{String(gi + 1).padStart(2, "0")} /</span>
              <h3 className="proj-category-label">{T(catMeta.label, lang)}</h3>
              <span className="proj-category-sub">{T(catMeta.sub, lang)}</span>
              <span className="proj-category-count">{items.length}</span>
            </div>
            {featuredHere && renderFlagship(featuredHere)}
            {compactHere.length > 0 && (
              <div className="proj-compact-grid reveal-stagger">
                {compactHere.map((p, i) => renderCompact(p, i))}
              </div>
            )}
          </div>
        );
      })}
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} lang={lang}/>}
    </section>
  );
}

// Dimmed full-image overlay. Esc / click-outside / close button dismisses;
// focus moves to the close button and the page scroll is locked while open.
function Lightbox({ src, alt, onClose, lang }) {
  const btn = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "Tab") { e.preventDefault(); if (btn.current) btn.current.focus(); } // trap focus
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (btn.current) btn.current.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button ref={btn} className="lightbox-close" onClick={onClose} aria-label={lang === "en" ? "Close" : "關閉"}>{window.Icons.close}</button>
      <img className="lightbox-img" src={src} alt={alt} onClick={(e) => e.stopPropagation()}/>
    </div>
  );
}

// Cmd/Ctrl-K quick-nav palette: jump to a section or fire an action. Filter by
// typing, Arrow-Up/Down to move, Enter to run, Esc / click-outside to close.
function CommandPalette({ open, onClose, lang, mode, setLang, setTheme, setMode }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const restore = useRef(null);

  const nav = window.CONTENT.nav;
  const go = (id) => { onClose(); requestAnimationFrame(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }); };
  const ext = (url) => { onClose(); window.open(url, "_blank", "noopener,noreferrer"); };
  const items = [
    { label: nav.about,    hint: "01", run: () => go("about") },
    { label: nav.research, hint: "02", run: () => go("research") },
    { label: nav.projects, hint: "03", run: () => go("projects") },
    { label: { en: "Skills", zh: "技能" }, hint: "04", run: () => go("skills") },
    { label: nav.pubs,     hint: "05", run: () => go("pubs") },
    { label: nav.repos,    hint: "06", run: () => go("repos") },
    { label: nav.contact,  hint: "07", run: () => go("contact") },
    { label: { en: "Download CV", zh: "下載 CV" }, hint: "↓", run: () => { onClose(); window.location.href = CV_FILES[mode] || CV_FILES.industry; } },
    { label: { en: "Email Wenyu", zh: "寄信給我" }, run: () => { onClose(); window.location.href = "mailto:wec324@lehigh.edu"; } },
    { label: { en: "GitHub", zh: "GitHub" }, run: () => ext("https://github.com/WenyuChiou") },
    { label: { en: "LinkedIn profile", zh: "LinkedIn 個人頁" }, run: () => ext("https://www.linkedin.com/in/wenyu-chiou") },
    { label: { en: "Toggle dark / light", zh: "切換深 / 淺色" }, run: () => { onClose(); setTheme(t => t === "dark" ? "light" : "dark"); } },
    { label: { en: mode === "industry" ? "Switch to Academic view" : "Switch to Industry view", zh: mode === "industry" ? "切換到學術版" : "切換到業界版" }, run: () => { onClose(); setMode(m => m === "industry" ? "academic" : "industry"); } },
    { label: { en: "Switch language 中/EN", zh: "切換語言 中/EN" }, run: () => { onClose(); setLang(l => l === "en" ? "zh" : "en"); } },
  ];
  const shown = items.filter(it => T(it.label, lang).toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return;
    setQ(""); setSel(0);
    restore.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => { if (inputRef.current) inputRef.current.focus(); });
    return () => { document.body.style.overflow = prev; if (restore.current && restore.current.focus) restore.current.focus(); };
  }, [open]);
  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, shown.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const it = shown[sel]; if (it) it.run(); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "Tab") { e.preventDefault(); if (inputRef.current) inputRef.current.focus(); } // trap focus to palette
  };
  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-panel" role="dialog" aria-modal="true" aria-label={lang === "en" ? "Quick navigation" : "快速導覽"} onClick={(e) => e.stopPropagation()}>
        <input ref={inputRef} className="cmdk-input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
               placeholder={lang === "en" ? "Jump to a section or action…" : "跳到區塊或執行動作…"}
               aria-label={lang === "en" ? "Search" : "搜尋"} autoComplete="off"/>
        <ul className="cmdk-list" role="listbox">
          {shown.length === 0 && <li className="cmdk-empty">{lang === "en" ? "No matches" : "無相符項目"}</li>}
          {shown.map((it, i) => (
            <li key={i} role="option" aria-selected={i === sel ? "true" : "false"}
                className={"cmdk-item" + (i === sel ? " active" : "")}
                onMouseEnter={() => setSel(i)} onClick={() => it.run()}>
              <span>{T(it.label, lang)}</span>
              {it.hint && <span className="cmdk-hint mono">{it.hint}</span>}
            </li>
          ))}
        </ul>
        <div className="cmdk-foot mono">↑↓ {lang === "en" ? "navigate" : "移動"} · ↵ {lang === "en" ? "select" : "選擇"} · esc {lang === "en" ? "close" : "關閉"}</div>
      </div>
    </div>
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
                <h4 className="pub-title" role="button" tabIndex={0} aria-expanded={isOpen ? "true" : "false"} onClick={() => setExpanded(isOpen ? null : i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(isOpen ? null : i); } }}>
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
      <SectionHead num="04" kicker={C.kicker} lang={lang} sub={{en: "Methods, tools, and AI-native workflows", zh: "方法、工具與 AI 原生工作流"}}/>
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

function Repos({ lang, gh }) {
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
                const live = gh && gh[r.name];
                const stars = live ? live.stars : r.stars;
                const forks = live ? live.forks : r.forks;
                const statusLabel = {
                  active: lang === "en" ? "Active" : "活躍",
                  experimental: lang === "en" ? "Experimental" : "實驗中",
                  archived: lang === "en" ? "Archived" : "已封存",
                }[r.status] || null;
                return (
                  <a className="repo-row" key={i} href={r.href} target="_blank" rel="noopener noreferrer">
                    <span className="repo-row-num mono">{String(i + 1).padStart(2, "0")}</span>
                    <div className="repo-row-body">
                      <div className="repo-row-top">
                        <span className="repo-row-name">{r.name}</span>
                        <span className="repo-row-lang" style={{"--lang-color": r.color}}>{r.lang}</span>
                        {statusLabel && <span className={"repo-status repo-status-" + r.status}>{statusLabel}</span>}
                      </div>
                      <p className="repo-row-desc">{T(r.desc, lang)}</p>
                      <div className="repo-row-stats">
                        <span className="repo-stat"><svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M8 .25l2.39 4.84 5.34.78-3.87 3.77.91 5.32L8 12.48l-4.77 2.48.91-5.32L.27 5.87l5.34-.78z"/></svg><CountUp end={stars}/></span>
                        <span className="repo-stat"><svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v5.256a2.251 2.251 0 101.5 0V5.372zM5 13a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9.75-.75a.75.75 0 110 1.5.75.75 0 010-1.5zM13.25 7a3.251 3.251 0 11-3.25-3.25h.879l-.44-.44a.75.75 0 011.06-1.06l1.72 1.72a.75.75 0 010 1.06l-1.72 1.72a.75.75 0 11-1.06-1.06l.44-.44H10A1.75 1.75 0 0011.75 7z"/></svg>{forks}</span>
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
      <SectionHead num="07" kicker={C.kicker} lang={lang}/>
      <div className="contact-inner reveal">
        <h2 className="serif italic">{T(C.title, lang)}</h2>
        <p>{T(C.body, lang)}</p>
        <div className="contact-actions">
          <a className="btn primary" href="mailto:wec324@lehigh.edu">{window.Icons.mail}wec324@lehigh.edu</a>
          <a className="btn" href="https://github.com/WenyuChiou" target="_blank" rel="noopener noreferrer">{window.Icons.github}{T(C.github_label, lang)}</a>
          <a className="btn" href="https://www.linkedin.com/in/wenyu-chiou" target="_blank" rel="noopener noreferrer">{window.Icons.linkedin}{T(C.linkedin_label, lang)}</a>
          <a className="btn" href="https://www.threads.com/@wenyu_chiou" target="_blank" rel="noopener noreferrer">{window.Icons.threads}Threads</a>
          <a className="btn" href="https://orcid.org/0009-0005-8006-1288" target="_blank" rel="noopener noreferrer">{T(C.orcid_label, lang)}</a>
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

function ModeSwitch({ mode, setMode, lang }) {
  return (
    <div className="mode-switch" role="group" aria-label="Site mode">
      <button className={"mode-opt" + (mode === "industry" ? " active" : "")} onClick={() => setMode("industry")} aria-pressed={mode === "industry" ? "true" : "false"}>
        <span className="mode-dot"/>
        {lang === "en" ? "Industry" : "業界"}
      </button>
      <button className={"mode-opt" + (mode === "academic" ? " active" : "")} onClick={() => setMode("academic")} aria-pressed={mode === "academic" ? "true" : "false"}>
        <span className="mode-dot"/>
        {lang === "en" ? "Academic" : "學術"}
      </button>
    </div>
  );
}

function ImpactStrip({ lang }) {
  const I = window.CONTENT.industry?.impact;
  if (!I) return null;
  return (
    <section className="impact-strip reveal" aria-label="Key impact numbers">
      <div className="wrap">
        <div className="impact-grid">
          {I.items.map((it, i) => (
            <div className="impact-item" key={i}>
              <div className="impact-num">{it.num}</div>
              <div className="impact-lbl">{T(it.lbl, lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("wy-lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("wy-theme") || "light");
  const [mode, setMode] = useState(() => localStorage.getItem("wy-mode") || "industry");
  useEffect(() => { localStorage.setItem("wy-lang", lang); document.documentElement.lang = lang === "zh" ? "zh-TW" : "en"; }, [lang]);
  useEffect(() => { localStorage.setItem("wy-theme", theme); document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("wy-mode", mode); document.documentElement.setAttribute("data-mode", mode); }, [mode]);
  useScrollReveal([mode, lang]);
  const gh = useGitHubStars();
  const [cmdk, setCmdk] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); setCmdk(o => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const active = useActiveSection(["top","about","research","projects","skills","pubs","repos","contact"]);
  return (
    <>
      <a className="skip-link" href="#main-content">{lang === "en" ? "Skip to content" : "跳至內容"}</a>
      <ModeSwitch mode={mode} setMode={setMode} lang={lang}/>
      <Nav lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} active={active} mode={mode} onCmdK={() => setCmdk(true)}/>
      <CommandPalette open={cmdk} onClose={() => setCmdk(false)} lang={lang} mode={mode} setLang={setLang} setTheme={setTheme} setMode={setMode}/>
      <main id="main-content">
        <Hero lang={lang} mode={mode}/>
        <About lang={lang} mode={mode}/>
        <Research lang={lang}/>
        <Projects lang={lang} mode={mode} gh={gh}/>
        <Skills lang={lang} mode={mode}/>
        {mode === "academic" && <Publications lang={lang}/>}
        <Repos lang={lang} gh={gh}/>
        {mode === "industry" && <Publications lang={lang} compact/>}
        <Contact lang={lang}/>
      </main>
      <Footer lang={lang}/>
      <TweaksPanel lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
