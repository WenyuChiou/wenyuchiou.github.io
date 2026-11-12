/* The homepage, written out as static HTML at build time (prerender.mjs calls renderHome once per locale).
   One language per page; the two commit maps are drawn in the browser by home/client/activity.js. */
const { icon, bi, valley } = require("./lib.cjs");
const PR = require("./prs.cjs"), T5 = require("./tiles.cjs");

const A = "/assets", n = (v) => v.toLocaleString("en-US");
const DOI = "https://doi.org/10.1029/2025WR042111", SCH = "https://scholar.google.com/citations?user=vSQ3zT4AAAAJ&hl=en", GHU = "https://github.com/WenyuChiou", LI = "https://www.linkedin.com/in/wenyu-chiou", MAIL = "wec324@lehigh.edu";
const CV_EN = `${A}/Wenyu_Chiou_Academic_CV_EN.pdf`, CV_ZH = `${A}/Wenyu_Chiou_Academic_CV_zh-TW.pdf`, RES = `${A}/Wenyu_Chiou_Industry_Resume_EN.pdf`, POSTER = `${A}/AGU2025_poster_Wenyu_Chiou.pdf`;

/* locale: "en" | "zh-TW"; repos: data/github.json; year: assets/commit-maps/year.json */
function renderHome({ locale, repos: site, year: YEAR }) {
const zhPage = locale === "zh-TW", lang = zhPage ? "zh" : "en", base = zhPage ? "/zh/" : "/";
const t = (en, zh) => `<span class="${lang}">${zhPage ? zh : en}</span>`;
const em = (s) => `<em class="em">${s}</em>`, arr = `<span class="arr">↗</span>`;
const tabs = (id, items, aria) => `<div class="tabs" role="tablist" data-tabs="${id}" aria-label="${aria}"><span class="ind"></span>${items.map(([k, l], i) => `<button role="tab" data-k="${k}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${l}</button>`).join("")}</div>`;
const chip = (en, zh, live) => `<span class="chip${live ? " live" : ""}">${live ? "<i></i>" : ""}${t(en, zh)}</span>`;
const starsOf = (r) => { const v = site.repositories[r] && site.repositories[r].stars; if (!(v >= 0)) throw new Error(`home: data/github.json has no star count for ${r}`); return v; };
const forks = site.repositories["awesome-agentic-ai-zh"].forks, asOf = site.checkedAt.slice(0, 10);

/* ---------- hero ---------- */
const links = [["github", "GitHub", GHU], ["linkedin", "LinkedIn", LI], ["scholar", "Google Scholar", SCH], ["mail", "Email", "mailto:" + MAIL], ["cv", "CV", "#cv"]];
const phases = [
  ["Ask", "問", "It starts with a survey: what would your household do before the next flood?", "從問卷開始：下一次淹水前，你家會怎麼做？", "Household survey I designed and fielded", "問卷由我設計、發放"],
  ["Decide", "決定", "Agents carry those choices into the model: adapt, insure, or wait.", "代理把這些選擇帶進模型：調適、買保險，或先等等。", "Rule-based agents in FLOODABM · LLM agents in the WRR paper", "FLOODABM 用規則式代理 · WRR 論文用 LLM 代理"],
  ["Flood", "淹水", "Then the river answers. Same water, different outcomes.", "接著換河流回答。同一場水，結果不一樣。", "Drag the river, or switch adaptation off", "拖拖看水位，或把調適關掉", true],
  ["Next year", "下一年", "Damage and payouts shape what each household can do next.", "損失和理賠，決定每一戶下一步還能做什麼。", "Then the loop runs again", "然後再跑下一輪"],
];
const hero = `<div class="wrap hero">
<div class="intro">
<span class="who"><img src="${A}/portrait.jpg" alt="" width="72" height="72">${t("Hydrologist who builds AI agents", "水文出身，做 AI 代理")}</span>
<h1>${zhPage ? `<span class="zh"><span>邱文昱</span></span>` : `<span class="en"><span>Wenyu</span><span class="l2">Chiou</span></span>`}</h1>
<p class="lead">${t(`I study how people ${em("decide")} under flood risk, using surveys, simulation and ${em("LLM agents")}.`, `我研究人在洪災風險下怎麼${em("做決定")}，用問卷、模擬，還有 ${em("LLM 代理")}。`)}</p>
<div class="links">${links.map(([k, l, h]) => `<a class="ib" href="${h}" aria-label="${l}" title="${l}">${bi(k, 22)}<span>${l}</span></a>`).join("")}</div>
${chip("Open to Summer 2027 internships", "2027 暑期實習開放中", true)}
</div>
<div class="blk deep fig">
<div class="stage"><svg id="valley" class="valley p0" viewBox="0 0 640 460" role="img" aria-label="${zhPage ? "示意圖：洪泛平原上的家戶做決定，河水上漲，結果再影響下一次決定" : "Illustration: households on a floodplain decide, the river rises, and the outcome feeds the next decision"}">${valley("hv")}</svg>
<span class="note">${t("Illustration, not model output", "示意圖，不是模型結果")}</span>
<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="r0" cx="22" cy="22" r="18"/><circle class="r1" cx="22" cy="22" r="18" pathLength="4" stroke-dasharray="1 4"/></svg></div>
<div class="ctl">
${tabs("ph", phases.map((p, i) => [i, `<b>${i + 1}</b>${t(p[0], p[1])}`]), zhPage ? "研究循環" : "Research loop")}
${phases.map((p, i) => `<p class="cap${i ? "" : " on"}" data-panel="ph:${i}"><b class="so">${i + 1} · ${t(p[0], p[1])}</b>${t(p[2], p[3])}<small${p[6] ? ' class="jo"' : ""}>${t(p[4], p[5])}</small></p>`).join("")}
<div class="knobs"><label>${t("River", "水位")}<input type="range" id="lv" min="0" max="100" value="8" aria-label="${zhPage ? "河川水位" : "River level"}"></label><label><button class="sw" id="adapt" aria-pressed="false" aria-label="${zhPage ? "家戶調適" : "Households adapt"}"></button>${t("Households adapt", "家戶做調適")}</label></div>
<div class="legend"><span><i style="background:#eef6f4"></i>${t("dry", "沒淹")}</span><span><i style="background:#f4a285"></i>${t("flooded", "淹水")}</span><span><i style="background:#f7d67f"></i>${t("flooded, insured", "淹水但有保險")}</span></div>
</div></div></div>`;
const mqItems = [["Human–water interaction", "人水互動"], ["Decision-making under risk", "風險下的決策"], ["Agent-based modeling", "代理人基模型"], ["LLM multi-agent systems", "LLM 多代理系統"], ["Catastrophe modeling", "巨災模型"], ["Agent evaluation &amp; governance", "代理的評估與治理"]];
const mq = `<div class="mq" aria-hidden="true"><div>${[0, 1].map(() => mqItems.map(([e, z]) => `<span>${t(e, z)}</span><b>✦</b>`).join("")).join("")}</div></div>`;

/* ---------- research ---------- */
const rcard = (k, on, cls, ch, q, what, cite, mine, btns, ic) => `<article class="blk ${cls} rcard${on ? " on" : ""}" data-panel="rs:${k}">
<div>${ch}<h3>${q}</h3><p class="what">${what}</p><p class="cite">${cite}</p><div class="btns">${btns}</div></div>
<div class="mine"><h4>${t("My part", "我做的部分")}</h4><ul>${mine.map(([e, z]) => `<li>${t(e, z)}</li>`).join("")}</ul></div>
<span class="deco">${icon(ic, 260)}</span></article>`;
const research = `<section id="research"><div class="wrap">
<p class="eb">01 · ${t("Research", "研究")}</p>
<div class="sec-h"><h2>${t(`How do people ${em("decide")} under flood risk, and what do those decisions ${em("change")}?`, `人在洪災風險下怎麼${em("做決定")}？這些決定又${em("改變")}了什麼？`)}</h2>
${tabs("rs", [["wrr", `${icon("paper", 18)}${t("WRR paper", "WRR 論文")}`], ["abm", `${icon("env", 18)}FLOODABM`]], zhPage ? "研究成果" : "Research work")}</div>
${rcard("wrr", 1, "sand", chip("Published · Water Resources Research, 2026", "已發表 · Water Resources Research，2026"),
    t("Can LLM agents stand in for households in a human–water simulation?", "在人水系統模擬裡，LLM 代理能扮演家戶嗎？"),
    t("The paper tests large language models as the decision-making part of a human–water simulation.", "這篇論文測試：把大型語言模型放進人水系統模擬，當成做決定的那一部分，行不行。"),
    "Yang, Y. C. E., &amp; Chiou, W. (2026). <i>Water Resources Research</i>, 62(6), e2025WR042111.",
    [["Co-author, second of two authors", "共同作者（兩位作者中的第二作者）"]],
    `<a class="btn pri" href="${DOI}">${t("Read the paper", "讀論文")}${arr}</a><a class="btn" href="${SCH}">${t("Scholar record", "Scholar 紀錄")}</a>`, "robot")}
${rcard("abm", 0, "aqua", chip("In revision · Water Resources Research", "修改中 · Water Resources Research"),
    t("What do household flood choices cost over time?", "家戶面對洪災的選擇，長期下來要付出什麼？"),
    t("A coupled household and flood-catastrophe model that follows each choice through to flood damage, insurance payouts and out-of-pocket cost. The households here are rule-based agents, not LLM.", "把家戶和洪災巨災模型接在一起，將每個選擇一路追到洪水損失、保險理賠和自付金額。這裡的家戶是規則式代理，不是 LLM。"),
    "Chiou, W. Y., Yang, Y. C. E., Tanaka, T., Jamrussri, S., &amp; Feng, S. Household Flood Adaptation and Financial Outcomes.",
    [["Designed and fielded the household survey (Passaic River Basin, NJ)", "設計並發放家戶問卷（紐澤西 Passaic 河流域）"], ["Built the pipeline that turns survey answers into agent parameters", "建立把問卷答案轉成代理參數的流程"], ["Built the coupled model, with NFIP premium, payout and deductible rules", "建立耦合模型，含 NFIP 保費、理賠與自負額機制"], ["First author", "第一作者"]],
    `<a class="btn pri" href="${base}work/floodabm/">${t("Read the case", "看案例")}${arr}</a><a class="btn" href="${POSTER}">${t("AGU25 poster", "AGU25 海報")}</a>`, "env")}
</div></section>`;

/* ---------- projects ---------- */
const repos = [
  ["awesome-agentic-ai-zh", "learn", "map", "A learning map for agentic AI, in three languages", "三種語言的 AI agent 學習地圖"],
  ["agent-board", "multi", "board", "One board that shows what every agent is doing", "一個看板，看到每個代理正在做什麼"],
  ["agent-collab-skills", "multi", "person", "Split, merge and accept multi-agent work", "多代理工作的拆分、整合與驗收"],
  ["codex-delegate", "multi", "robot", "Hand coding work to Codex CLI and get a checked result back", "把程式工作交給 Codex CLI，拿回可檢查的結果"],
  ["research-hub", "research", "book", "Zotero, Obsidian and NotebookLM in one workspace", "把 Zotero、Obsidian、NotebookLM 接成一個工作區"],
  ["ai-research-skills", "research", "book", "A catalog of skills for research workflows", "研究流程用的技能目錄"],
  ["academic-writing-skills", "research", "paper", "Paper writing and revision with claims tied to evidence", "論文寫作與修訂，主張都對得上證據"],
  ["zotero-skills", "research", "paper", "Manage Zotero references by script", "用程式管理 Zotero 文獻"],
];
/* the learning map's own route, as its README lays it out (read 2026-11-12): Stages 0-2 are shared, then Track A (A1, A2, 5, A3, 8)
   or Track B (3, 4, 5, 6, 7, 7.5, 8); Stages 5 and 8 are shared by both tracks. Drawn in the empty half of the flagship tile. */
const routeMap = (() => { const LA = 42, LB = 114, stop = (x, y, s) => `<g class="rs"><circle cx="${x}" cy="${y}" r="14"/><text x="${x}" y="${y + 4.5}">${s}</text></g>`,
  hub = (x, s) => `<g class="rs hub"><rect x="${x - 15}" y="${LA - 15}" width="30" height="${LB - LA + 30}" rx="15"/><text x="${x}" y="${(LA + LB) / 2 + 5}">${s}</text></g>`;
  return `<svg class="rmap" viewBox="0 0 520 160" width="520" height="160" role="img" aria-label="${zhPage ? "這張地圖的路線：Stage 0 到 2 是共用基礎；Track A 依序是 A1、A2、Stage 5、A3、Stage 8；Track B 依序是 Stage 3、4、5、6、7、7.5、8。" : "The map’s route: Stages 0 to 2 are shared; Track A goes A1, A2, Stage 5, A3, Stage 8; Track B goes Stages 3, 4, 5, 6, 7, 7.5, 8."}">
<path class="rl" d="M20 78H104C128 78 128 ${LA} 152 ${LA}H490"/><path class="rl" d="M104 78C128 78 128 ${LB} 152 ${LB}H490"/>
${stop(20, 78, "0")}${stop(62, 78, "1")}${stop(104, 78, "2")}${stop(192, LA, "A1")}${stop(246, LA, "A2")}${stop(395, LA, "A3")}${stop(182, LB, "3")}${stop(236, LB, "4")}${stop(352, LB, "6")}${stop(398, LB, "7")}${stop(444, LB, "7.5")}${hub(300, "5")}${hub(490, "8")}
<text class="rc" x="6" y="50">${zhPage ? "共用基礎" : "Shared base"}</text><text class="rc" x="152" y="14">${zhPage ? "Track A · 使用 CLI Agent 把工作做完" : "Track A · get work done with CLI agents"}</text><text class="rc" x="152" y="152">${zhPage ? "Track B · 從零打造 Agent" : "Track B · build an agent from scratch"}</text></svg>`; })();
/* repo tiles: area and colour follow stars (square-root scale for the area) */
const repoTiles = T5.layout(repos.map(([r, g, ic, e, z]) => ({ r, g, ic, e, z, v: starsOf(r) })), [1, 2, 99], 590);
const tileHtml = (x, i) => { const [bg, fg, f2] = T5.starTone(x.v, repoTiles.max), top = i === 0;
  return `<a class="tl5 tile${top ? " t1" : ""}" data-g="${x.g}" data-r="${x.r}" href="${GHU}/${x.r}" style="--w:${x.w.toFixed(2)};--u:${x.u.toFixed(3)};--bg:${bg};--fg:${fg};--f2:${f2}"><span class="tp"><span class="ic1">${icon(x.ic, top ? 26 : 20)}</span><b class="nm">${x.r}</b>${top ? `<span class="go">↗</span>` : `<span class="sn"><b>${n(x.v)}</b><small>★</small></span>`}</span>
<span class="ds">${top ? t("A learning map for agentic AI that I write and maintain in three languages.", "我自己寫、自己維護的 AI agent 學習地圖，三種語言。") : t(x.e, x.z)}</span>${top ? `<span class="lg3"><i>繁體中文</i><i>简体中文</i><i>English</i></span>` : ""}
${top ? `<span class="bt"><span class="sn"><b>${n(x.v)}</b><small>★ · ${t(`${n(forks)} forks`, `${n(forks)} 個 fork`)}</small></span>${routeMap}</span>` : ""}</a>`; };
const repoBlock = `<div class="stm">${repoTiles.rows.map((row, k) => `<div class="tr" style="--h:${row.h}px">${row.items.map((x) => tileHtml(x, k === 0 ? 0 : 1)).join("")}</div>`).join("")}</div>
<p class="tmn">${t(`Tile size and colour follow stars · as of ${asOf}`, `面板大小和顏色跟著星數 · ${asOf} 的數字`)}</p>`;

/* pull requests merged into other people's projects: how many, and what they did. Size = PRs, colour = the project's stars */
const prTiles = T5.layout(PR.groups.map((g) => ({ g, v: g.prs.length })), [2, 99], 530);
const prMax = Math.max(...PR.groups.map((g) => g.stars));
const prTile = (x) => { const g = x.g, [bg, fg, f2] = T5.irisTone(g.stars, prMax), k = g.prs.length;
  return `<a class="tl5 ptile" href="${k > 1 ? g.list : g.prs[0].url}" style="--w:${x.w.toFixed(2)};--u:${x.u.toFixed(3)};--bg:${bg};--fg:${fg};--f2:${f2}"><span class="tp"><b class="nm">${g.repo.replace("/", "/<wbr>")}</b></span><span class="us">★ ${g.starsK}</span>
<span class="pn"><b>${k}</b><small>${t(k > 1 ? "PRs merged" : "PR merged", "個 PR 已合併")}</small></span><span class="ds">${t(g.didEn, g.didZh)}</span></a>`; };
const prBlock = `<div class="prh"><div><h3>${t(`Merged into ${em("other people’s")} projects`, `合併進${em("別人專案")}的 PR`)}</h3></div></div>
<div class="stm ptm">${prTiles.rows.map((row) => `<div class="tr" style="--h:${row.h}px">${row.items.map(prTile).join("")}</div>`).join("")}</div>
<p class="tmn">${t(`Tile size follows how many PRs were merged; colour follows that project’s stars · public PRs only, as of ${PR.asOf}`, `面板大小跟著合併的 PR 數，顏色跟著該專案的星數 · 只算公開的 PR，${PR.asOf} 的數字`)}</p>`;
const pipe = [["person", "I plan", "我規劃", "agent-collab-skills"], ["robot", "Agents execute", "代理執行", "codex-delegate"], ["gate", "I review", "我審查", "agent-collab-skills"], ["board", "The board keeps watch", "看板盯進度", "agent-board"]];
const projects = `<section id="projects"><div class="wrap">
<p class="eb">03 · ${t("Projects", "專案")}</p>
<div class="sec-h"><div><h2>${t(`Open-source tools I ${em("build")} and use every day`, `我自己做、每天在用的${em("開源工具")}`)}</h2><p class="sub">${t("I plan and review. Agents do the legwork. Nothing ships unchecked.", "我規劃、我審查，苦工交給代理；沒檢查過的不出門。")}</p></div>${tabs("pj", [["all", t("All", "全部")], ["multi", t("Multi-agent", "多代理")], ["research", t("Research tools", "研究工具")]], zhPage ? "專案篩選" : "Project filter")}</div>
${repoBlock}
<div class="blk glass flow band"><h3>${t("How I work with agents", "我怎麼跟代理合作")}</h3><ol id="flow">${pipe.map(([ic, e, z, r]) => `<li><button data-r="${r}"><span class="fi">${icon(ic, 24)}</span><b>${t(e, z)}</b><code>${r}</code></button></li>`).join("")}</ol></div>
${prBlock}
</div></section>`;

/* ---------- cv ---------- */
const ln = (when, en, zh, den, dzh, href) => `<div class="ln"><time>${when.includes("|") ? t(...when.split("|")) : when}</time><div><b>${href ? `<a href="${href}">${t(en, zh)}</a>` : t(en, zh)}</b><span>${t(den, dzh)}</span></div></div>`;
const cvTabs = {
  exp: [["2024–now|2024 至今", "Complex Adaptive Water Systems Lab, Lehigh University", "Lehigh University，Complex Adaptive Water Systems Lab", "Household survey, a coupled household and flood model, and LLM agents in human–water simulation.", "家戶問卷、家戶與洪災的耦合模型，以及人水系統模擬裡的 LLM 代理。"],
    ["2023–24", "Research assistant, Surface Hydrology Group, National Central University", "中央大學地表水文研究室，研究助理", "2D and 3D groundwater modeling and calibration for the Taoyuan coastal zone.", "桃園海岸地區的 2D／3D 地下水數值模擬與率定。"],
    ["Summer 2023|2023 夏", "Research intern, National Science and Technology Center for Disaster Reduction", "國家災害防救科技中心，暑期研究實習", "IPCC AR6 downscaled climate ensembles for Taiwan; automated multi-model comparison.", "處理台灣的 IPCC AR6 降尺度氣候模式系集，自動化多模式比較。"],
    ["Summer 2020|2020 夏", "Research intern, Institute of Earth Sciences, Academia Sinica", "中央研究院地球科學研究所，大學部研究實習", "Stable-isotope hydrology at Feitsui Reservoir.", "翡翠水庫的穩定同位素水文。"]],
  edu: [["2024–now|2024 至今", "Ph.D. program, Civil &amp; Environmental Engineering", "土木與環境工程博士班", "Lehigh University", "Lehigh University"],
    ["2021–2023", "M.S., Hydrological and Oceanic Sciences", "水文與海洋科學碩士", "National Central University · Dean’s Award, College of Earth Sciences", "中央大學 · 地球科學學院院長獎"],
    ["2017–2021", "B.S., Earth Sciences", "地球科學學士", "National Central University", "中央大學"]],
  award: [["2023", "Dean’s Award, College of Earth Sciences", "地球科學學院院長獎", "National Central University", "中央大學"],
    ["2021–2023", "Interdisciplinary Research Fellowship", "跨領域研究獎學金", "National Science and Technology Council, Taiwan", "國科會"],
    ["2020", "Best Undergraduate Student Project and Report in Earth Sciences", "地球科學系最佳大學部專題與報告", "National Central University", "中央大學"],
    ["2020–21", "Undergraduate Student Research Project Grant", "大專學生研究計畫", "National Science and Technology Council, Taiwan", "國科會"]],
};
/* Publications, posters and talks, every entry from cv/academic.html. Titles, authors and venues stay in English on both
   locales. Each row has a detail card (with the PDF's first page where the site holds the PDF) shown on hover, focus or tap. */
const PV = `${A}/previews`, EN = (s) => t(s, s);
const refs = {
  pub: [
    { k: "wrr", when: "2026", kind: "Journal article", title: "Leveraging Large Language Models for Agent-Based Simulation of Human–Water System Interactions", where: "Water Resources Research, 62(6), e2025WR042111", href: DOI,
      by: "Yang, Y. C. E., &amp; Chiou, W.", note: ["Tests large language models as the decision-making part of a human–water simulation.", "測試把大型語言模型放進人水系統模擬，當成做決定的那一部分。"],
      links: [["DOI", "DOI", DOI], ["Scholar record", "Scholar 紀錄", SCH]] },
    { k: "hfa", when: "In revision", kind: "Manuscript", title: "Household Flood Adaptation and Financial Outcomes: A Coupled Human–Flood Modeling Analysis of Homeowners and Renters", where: "Water Resources Research",
      by: "Chiou, W. Y., Yang, Y. C. E., Tanaka, T., Jamrussri, S., &amp; Feng, S.", note: ["A household agent-based model coupled to catastrophe, insurance and financial mechanics in New Jersey census tracts.", "紐澤西州普查區的家戶代理人模型，與巨災、保險及財務機制耦合。"],
      links: [["Read the case", "看案例", `${base}work/floodabm/`]] },
    { k: "agu25", when: "2025", kind: "Poster", title: "Modeling Long-Term Flood Adaptation Action Across Marginalized and Non-Marginalized Groups: A Coupled Agent-Based Model", where: "AGU25, New Orleans · NH41E-0449", href: POSTER,
      by: "Chiou, W., Yang, Y. C. E., Tanaka, T., Jamrussri, S., &amp; Feng, S.", note: ["Abstract 1890827. Homeowners and renters in the Passaic River Basin, simulated for 2011–2023.", "摘要編號 1890827。模擬 Passaic 河流域的屋主與租屋者，2011–2023。"],
      img: ["agu25-poster.webp", 960, 776, "First page of the AGU25 poster", "AGU25 海報第一頁"], links: [["Poster PDF", "海報 PDF", POSTER], ["Official program", "大會議程", "https://agu.confex.com/agu/f/ScienceNexusAGU25"]] },
  ],
  talk: [
    { k: "isdsa", when: "2026", kind: "Paper presentation", title: "What Makes AI Believable? Comparing AI and Human Responses in Mental Health Risk Assessment", where: "2026 ISDSA Meeting on Data Science and Analytics, Beijing",
      by: "Chiou, W., &amp; Chiou, H.", note: ["July 28–31, 2026. International Society for Data Science and Analytics.", "2026 年 7 月 28–31 日，International Society for Data Science and Analytics 年會。"], links: [] },
    { k: "ishc", when: "2025", kind: "Oral presentation", title: "Investigating the Decision-Making Process and Causal Relationships between Flood Risk Perception and Adaptation Actions", where: "2nd International Sociohydrology Conference, Tokyo · 38-03",
      note: ["July 2025. Co-authored with collaborators across Lehigh, FAU, Kyoto and UTokyo.", "2025 年 7 月。與 Lehigh、FAU、Kyoto、UTokyo 的合作者共同發表。"], links: [] },
    { k: "agu23", when: "2023", kind: "Conference abstract", title: "Submarine groundwater discharge study combining electrical resistivity tomography, field observation, and numerical simulation", where: "AGU Fall Meeting 2023", links: [] },
  ],
};
const refRow = (r, i) => `<div class="ln pkr${i ? "" : " on"}" data-pk="${r.k}" style="order:${i * 2}"><time>${EN(r.when)}</time><div><b>${r.href ? `<a href="${r.href}">${EN(r.title)}</a>` : EN(r.title)}</b><span>${EN(`${r.kind} · ${r.where}`)}</span></div><button class="pkx" type="button" aria-pressed="${!i}" aria-controls="pk-${r.k}">${t("Details", "細節")}</button></div>`;
const refCard = (r, i) => `<div class="pkd${i ? "" : " on"}" id="pk-${r.k}" data-pk="${r.k}" style="order:${i * 2 + 1}">${r.img ? `<a class="pki" href="${r.href}"><img src="${PV}/${r.img[0]}" alt="${zhPage ? r.img[4] : r.img[3]}" width="${r.img[1]}" height="${r.img[2]}" loading="lazy" decoding="async"><span>${t("Open the PDF", "打開 PDF")}${arr}</span></a>` : ""}<p class="pkk">${EN(r.kind)}<i>${EN(r.when)}</i></p><p class="pkt">${EN(r.title)}</p>${r.by ? `<p class="pkb">${EN(r.by)}</p>` : ""}<p class="pkw">${EN(r.where)}</p>${r.note ? `<p class="pkn">${t(...r.note)}</p>` : ""}${r.links.length ? `<div class="btns">${r.links.map(([e, z, h]) => `<a class="btn sm" href="${h}">${t(e, z)}${arr}</a>`).join("")}</div>` : ""}</div>`;
const refPanel = (k) => `<div class="pk"><div class="pkl">${refs[k].map(refRow).join("")}<p class="pkh">${t("Hover over a row, or press Details, to see more.", "滑過一列或按「細節」，看更多資訊。")}</p></div><div class="pkv">${refs[k].map(refCard).join("")}</div></div>`;
/* the path: study and research on one time axis, every entry from cv/academic.html */
const Y0 = 2017.35, Y1 = 2027.1, NOW = 2026.86, px = (y) => (y - Y0) / (Y1 - Y0) * 100;
const pathItems = [
  { k: "bs", lane: 0, a: 2017.67, b: 2021.5, short: ["B.S. · NCU", "學士 · 中央大學"], when: ["Sep 2017 – Jun 2021", "2017/9 – 2021/6"], role: ["B.S., Earth Sciences", "地球科學學士"], place: ["National Central University, Taiwan", "國立中央大學"],
    pts: [["Best Undergraduate Student Project and Report in Earth Sciences, 2020.", "2020 年地球科學系最佳大學部專題與報告。"], ["Undergraduate Student Research Project Grant, National Science and Technology Council.", "國科會大專學生研究計畫。"], ["GPA 3.9 / 4.3.", "GPA 3.9 / 4.3。"]], links: [] },
  { k: "sinica", lane: 1, tiny: 1, a: 2020.5, b: 2020.67, short: ["Sinica", "中研院"], when: ["Jul – Aug 2020", "2020/7 – 8"], role: ["Undergraduate research intern", "大學部研究實習"], place: ["Institute of Earth Sciences, Academia Sinica", "中央研究院地球科學研究所"],
    pts: [["Stable-isotope hydrology (δD, δ¹⁸O) at Feitsui Reservoir.", "翡翠水庫的穩定同位素水文（δD、δ¹⁸O）。"]], links: [] },
  { k: "ms", lane: 0, a: 2021.67, b: 2023.5, short: ["M.S. · NCU", "碩士 · 中央大學"], when: ["Sep 2021 – Jun 2023", "2021/9 – 2023/6"], role: ["M.S., Hydrological and Oceanic Sciences", "水文與海洋科學碩士"], place: ["Surface Hydrology Group, National Central University", "國立中央大學 地表水文研究室"],
    pts: [["Thesis: groundwater flow characteristics of the Taoyuan coastal zone.", "碩士論文：桃園海岸地區的地下水流動特性。"], ["Dean’s Award, College of Earth Sciences, 2023.", "2023 年地球科學學院院長獎。"], ["GPA 4.3 / 4.3.", "GPA 4.3 / 4.3。"]], links: [] },
  { k: "ncdr", lane: 1, tiny: 1, a: 2023.5, b: 2023.67, short: ["NCDR", "災防中心"], when: ["Summer 2023", "2023 夏"], role: ["Summer research intern", "暑期研究實習"], place: ["National Science and Technology Center for Disaster Reduction, Taiwan", "國家災害防救科技中心"],
    pts: [["Processed IPCC AR6 downscaled climate-model ensembles for Taiwan.", "處理台灣的 IPCC AR6 降尺度氣候模式系集。"], ["Automated the multi-model comparison in Python and MATLAB.", "用 Python 和 MATLAB 把多模式比較自動化。"]], links: [] },
  { k: "ra", lane: 1, a: 2023.67, b: 2024.5, short: ["RA · NCU", "中大 RA"], when: ["2023 – 2024", "2023 – 2024"], role: ["Research assistant", "研究助理"], place: ["Surface Hydrology Group, National Central University", "國立中央大學 地表水文研究室"],
    pts: [["2D and 3D groundwater numerical modeling and calibration for the Taoyuan coastal zone (HydroGeoChem).", "桃園海岸地區的 2D／3D 地下水數值模擬與率定（HydroGeoChem）。"], ["Evaluated nature-based solutions for groundwater and watershed management.", "評估地下水與集水區管理的自然解方。"]], links: [] },
  { k: "phd", lane: 0, a: 2024.58, b: NOW, open: 1, short: ["Ph.D. program · Lehigh", "博士班 · Lehigh"], when: ["Aug 2024 – now", "2024/8 至今"], role: ["Ph.D. program, Civil &amp; Environmental Engineering", "土木與環境工程博士班"], place: ["Lehigh University", "Lehigh University"],
    pts: [["Advisor: Prof. Y.C. Ethan Yang, Complex Adaptive Water Systems Lab.", "指導教授：Y.C. Ethan Yang，Complex Adaptive Water Systems Lab。"], ["Center for Catastrophe Modeling and Resilience.", "Center for Catastrophe Modeling and Resilience。"], ["Graduate Student Committee member, Civil &amp; Environmental Engineering, since 2025.", "2025 年起擔任系上研究生委員會委員。"]], links: [] },
  { k: "caws", lane: 1, a: 2024.58, b: NOW, open: 1, short: ["CAWS Lab · Lehigh", "CAWS Lab · Lehigh"], when: ["Aug 2024 – now", "2024/8 至今"], role: ["Complex Adaptive Water Systems Lab", "Complex Adaptive Water Systems Lab"], place: ["Lehigh University", "Lehigh University"],
    pts: [["Designed and fielded a household flood-adaptation survey in the Passaic River Basin, New Jersey.", "設計並發放家戶洪災調適問卷（紐澤西 Passaic 河流域）。"], ["Built a coupled household and flood-catastrophe model with NFIP premium, payout and deductible rules.", "建立家戶與洪災巨災的耦合模型，含 NFIP 保費、理賠與自負額規則。"], ["Co-authored the 2026 Water Resources Research paper on large language models in human–water simulation.", "共同發表 2026 年 Water Resources Research 論文：大型語言模型用於人水系統模擬。"]],
    links: [["paper", "WRR paper", "WRR 論文", DOI], ["env", "FLOODABM", "FLOODABM", "#research"], ["paper", "AGU25 poster", "AGU25 海報", POSTER]] },
];
const order = pathItems.slice().sort((x, y) => x.a - y.a || x.lane - y.lane).map((x) => x.k);
const ti = (x) => `<button class="ti${x.tiny ? " tiny" : ""}${x.open ? " open" : ""}" data-k="${x.k}" data-o="${order.indexOf(x.k)}" aria-pressed="${x.k === "caws"}" style="--a:${px(x.tiny ? x.b : x.a).toFixed(2)}%;--w:${(px(x.b) - px(x.a)).toFixed(2)}%"><b>${t(...x.short)}</b><span>${t(...x.role)} · ${t(...x.when)}</span></button>`;
const lane = (i, en, zh) => `<p class="tlb">${t(en, zh)}</p><div class="tln l${i}">${pathItems.filter((x) => x.lane === i).map(ti).join("")}</div>`;
const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const pathPanel = `<div class="tl" id="tl" role="group" aria-label="${zhPage ? "學習與研究的時間軸" : "Study and research on a time axis"}"><div class="tax">${years.map((y) => `<i style="--a:${px(y).toFixed(2)}%">${y}</i>`).join("")}<i class="now" style="--a:${px(NOW).toFixed(2)}%">${t("now", "現在")}</i></div>
${lane(0, "Study", "學歷")}${lane(1, "Research", "研究")}</div>
<div class="td">${order.slice().reverse().map((k) => pathItems.find((x) => x.k === k)).map((x) => `<div class="tdp${x.k === "caws" ? " on" : ""}" data-td="${x.k}"><div><time>${t(...x.when)}</time><h3>${t(...x.role)}</h3><p>${t(...x.place)}</p>${x.links.length ? `<div class="btns">${x.links.map(([ic, e, z, h]) => `<a class="btn sm" href="${h}">${icon(ic, 16)}${t(e, z)}</a>`).join("")}</div>` : ""}</div>
<ul>${x.pts.map(([e, z]) => `<li>${t(e, z)}</li>`).join("")}</ul></div>`).join("")}</div>`;
/* .so = shown only in the static layout (no script), where the tab bar is hidden and every panel is open; .jo = a hint that only makes sense with the script */
const cvLabels = { path: t("Path", "經歷"), pub: t("Publications &amp; posters", "論文與海報"), talk: t("Talks", "發表"), award: t("Awards", "獎項") };
const cvLabel = (k) => `<h3 class="so">${cvLabels[k]}</h3>`;
const cv = `<section id="cv"><div class="wrap">
<p class="eb">02 · ${t("Experience", "經歷")}</p>
<div class="sec-h"><div><h2>${t(`Field hydrology first, then ${em("agents")}`, `先跑野外水文，再做${em("代理")}`)}</h2><p class="sub">${t("Isotopes at a reservoir, groundwater on a coast, climate ensembles, then households and floods.", "從水庫的同位素、海岸的地下水、氣候模式系集，到家戶與洪災。")}<span class="jo">${t(" Pick a stop.", "點一站看看。")}</span></p></div></div>
<div class="blk sand cv"><div class="cvh">${tabs("cv", Object.entries(cvLabels), zhPage ? "經歷分頁" : "Experience sections")}</div>
<div data-panel="cv:path" class="on">${cvLabel("path")}${pathPanel}</div>
${["pub", "talk"].map((k) => `<div data-panel="cv:${k}">${cvLabel(k)}${refPanel(k)}</div>`).join("")}
<div data-panel="cv:award">${cvLabel("award")}${cvTabs.award.map((r) => ln(...r)).join("")}</div>
<div class="cvd"><span>${t("Full CV", "完整履歷")}</span><div class="btns"><a class="btn pri" href="${CV_EN}">${icon("paper", 18)}${t("Academic CV · PDF", "學術履歷 · PDF（英文）")}</a><a class="btn" href="${CV_ZH}">${icon("paper", 18)}${t("中文版 · PDF", "學術履歷 · PDF（中文）")}</a><a class="btn" href="${RES}">${icon("paper", 18)}${t("Industry résumé · PDF", "業界履歷 · PDF")}</a></div></div>
</div></div></section>`;

/* ---------- activity ---------- */
const y0 = YEAR.days[0][0], y1 = YEAR.days[YEAR.days.length - 1][0], ymd = (d) => d.replace(/-0?/g, "/"), MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], mdy = (d) => `${MONS[+d.slice(5, 7) - 1]} ${+d.slice(8)}, ${d.slice(0, 4)}`;
/* static picture of each map (the daily SVG), shown only when the script that draws the live one does not run */
const mapImg = (name, height, en, zh) => `<img class="a5f" src="${A}/commit-maps/activity-${name}.svg" alt="${zhPage ? zh : en}" width="1240" height="${height}" loading="lazy" decoding="async">`;
const playBtn = `<button class="a5p" aria-pressed="false" aria-label="${zhPage ? "播放或暫停" : "Play or pause"}"><svg viewBox="0 0 16 16" aria-hidden="true"><path class="pl" d="M5 2.500l9 5.500-9 5.500z"/><path class="pa" d="M3.500 2.500h3.200v11H3.500zM9.300 2.500h3.200v11H9.300z"/></svg></button>`;
const activity = `<section id="activity"><div class="wrap">
<p class="eb">04 · ${t("Activity", "動態")}</p>
<div class="sec-h"><div><h2>${t(`A year of commits, run like a ${em("reservoir")}`, `一年的 commit，當成一座${em("水庫")}來操作`)}</h2><p class="sub">${t("Each day’s commits fall as rain. The reservoir keeps about two weeks of them, and the fuller it gets, the more the gate lets out.", "每天的 commit 是雨量。水庫大約留住兩週的量，水位越高，閘門放得越多。")}</p></div>${tabs("ac", [["dam", t("The dam", "水壩")], ["snake", t("Snake", "貪吃蛇")]], zhPage ? "Commit 地圖" : "Commit map")}</div>
<div id="act5" data-days='${JSON.stringify(YEAR.days)}'>
<div class="blk a5 on" data-panel="ac:dam" data-a5="dam"><div class="a5s" tabindex="0" role="application" aria-label="${zhPage ? "一年的 commit 注入水庫。用方向鍵逐日移動。" : "Dam filled by one year of commits. Arrow keys move through the days."}"><div class="a5c"></div><span class="a5ag">${icon("robot", 22)}</span><span class="a5call"></span>${playBtn}</div>${mapImg("dam", 532, "The past year of commits drawn as rain that fills a reservoir behind a dam, month by month.", "過去一年的 commit 畫成雨水，逐月注入水壩後方的水庫。")}</div>
<div class="blk a5" data-panel="ac:snake" data-a5="snake"><div class="a5s" tabindex="0" role="application" aria-label="${zhPage ? "一年的 commit 排成每日方格。用方向鍵操控貪吃蛇。" : "One year of commits as a grid of days. Arrow keys steer the snake."}"><div class="a5c"></div>${playBtn}</div>${mapImg("snake", 317, "The past year of commits as a grid with one square per day, and a snake that eats the squares from the quietest day to the busiest.", "過去一年的 commit 排成每日一格，貪吃蛇從最少的那天吃到最多的那天。")}</div>
</div>
<p class="tmn">${t("Public repositories only · ", "只算公開專案 · ")}<span id="a5range">${zhPage ? `${ymd(y0)} → ${ymd(y1)}` : `${mdy(y0)} → ${mdy(y1)}`}</span><span class="jo">${t(" · hover, drag or use the arrow keys", " · 可以滑過、拖曳，或用方向鍵")}</span></p>
</div></section>`;

/* ---------- contact ---------- */
const cc = (cls, href, k, title, sub) => `<a class="blk cc ${cls}" href="${href}"><div class="tp"><span class="bi">${bi(k, 28)}</span><span class="go">↗</span></div><div><b>${title}</b><code>${sub}</code></div></a>`;
const contact = `<section id="contact"><div class="wrap">
<p class="eb">05 · ${t("Contact", "聯絡")}</p>
<div class="sec-h"><h2>${t(`Say ${em("hello")}`, `${em("聊聊")}吧`)}</h2></div>
<div class="cgrid">
${cc("aqua w6 mail", "mailto:" + MAIL, "mail", MAIL, t("Internships, research, or the tools", "實習、研究，或這些工具"))}
${cc("", GHU, "github", "GitHub", "@WenyuChiou")}
${cc("iris", LI, "linkedin", "LinkedIn", "in/wenyu-chiou")}
${cc("sand w4", SCH, "scholar", "Google Scholar", t("Papers and citations", "論文與引用"))}
${cc("sun w4", CV_EN, "cv", "CV", t("PDF · English and 中文", "PDF · 英文與中文"))}
<div class="blk cc w4 photo"><img src="${A}/agu2025-photo.webp" alt="${zhPage ? "邱文昱在 AGU 2025 的海報前" : "Wenyu Chiou presenting a poster at AGU 2025"}" width="900" height="1200" loading="lazy" decoding="async"></div>
</div></div></section>`;

/* links that leave the site open in a new tab without handing over the referrer, the same as on the inner pages */
const offSite = (html) => html.replace(/<a\b([^>]*?)\bhref="(https?:\/\/[^"]+)"([^>]*)>/g, (m, a, u, b) => /\btarget=/.test(a + b) || u.startsWith("https://wenyuchiou.github.io/") ? m : `<a${a}href="${u}"${b} target="_blank" rel="noopener noreferrer">`);
const inner = [["work/", "Work", "專案作品"], ["research/", "Research notes", "研究計畫"], ["publications/", "Publications & talks", "著作與演講"], ["hire/", "Recruiter brief", "招募摘要"], ["about/", "About", "關於我"]];
return offSite(`<a class="skip" href="#main">${zhPage ? "跳至主要內容" : "Skip to content"}</a>
<svg id="under" aria-hidden="true"></svg>
<header class="nav"><a class="brand" href="#top" aria-label="${zhPage ? "回到頁首" : "Top"}">WC</a><nav aria-label="${zhPage ? "頁面區塊" : "Sections"}"><span class="ind"></span><a href="#research">${t("Research", "研究")}</a><a href="#cv">${t("Experience", "經歷")}</a><a href="#projects">${t("Projects", "專案")}</a><a href="#activity">${t("Activity", "動態")}</a><a href="#contact">${t("Contact", "聯絡")}</a></nav><a id="lang" href="${zhPage ? "/" : "/zh/"}" hreflang="${zhPage ? "en" : "zh-Hant-TW"}" lang="${zhPage ? "en" : "zh-Hant-TW"}" aria-label="${zhPage ? "Switch to English" : "切換到繁體中文"}">${zhPage ? "EN" : "中文"}</a></header>
<main id="main">${hero}${mq}${research}${cv}${projects}${activity}${contact}</main>
<footer><div class="wrap"><nav aria-label="${zhPage ? "其他頁面" : "More pages"}">${inner.map(([p, e, z]) => `<a href="${base}${p}">${zhPage ? z : e}</a>`).join("")}</nav><p>© 2026 Wenyu Chiou · ${t("Design method: unslop by Damir Sokolovsky (CC BY 4.0)", "設計方法：Damir Sokolovsky 的 unslop（CC BY 4.0）")}</p></div></footer>`);
}

module.exports = { renderHome };
