#!/usr/bin/env node
/* Builds the dam and snake commit maps from one year of daily commit counts.
   Fetches WenyuChiou's public, non-fork repositories from the GitHub REST API (US Eastern dates),
   renders assets/commit-maps/{activity-dam.svg,activity-snake.svg,year.json}, and writes all three or none.
   Usage: node scripts/commit-maps.mjs [--from year.json] [--out dir] [--end YYYY-MM-DD]
   Set GITHUB_TOKEN (or GH_TOKEN) to avoid the anonymous rate limit. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OWNER = "WenyuChiou", N = 365, API = "https://api.github.com", TZ = "America/New_York";
const DEFAULT_OUT = "assets/commit-maps";

/* ---------- rendering (ported unchanged from the concept profile builder) ---------- */
const DISP = `"Bricolage Grotesque","Segoe UI Variable Display","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif`, MONO = `ui-monospace,"SF Mono","Cascadia Mono",Consolas,monospace`;
const DEFS = `<linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#13444d"/><stop offset=".75" stop-color="#0b2026"/></linearGradient>`;
const BASE = `text{font-family:${DISP}}.m{font-family:${MONO}}.fillc{fill:currentColor;stroke:none}`;
const IC = {
  robot: `<rect x="10" y="15" width="28" height="22" rx="7"/><path d="M24 15V9M10 23H6v7h4M38 23h4v7h-4M19 31h10"/><circle cx="24" cy="7" r="2"/><circle cx="18.5" cy="24.5" r="2.4" class="fillc"/><circle cx="29.5" cy="24.5" r="2.4" class="fillc"/>`,
};
const svg = (W, H, body, css = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><style>${BASE}${css}</style><defs>${DEFS}</defs>${body}</svg>`;
const gi = (k, x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s / 48})" style="color:${col}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</g>`;
const FULL = 1240;
const f1 = (v) => (+v).toFixed(1), f4 = (v) => (+v).toFixed(4).replace(/^0\./, ".").replace(/0+$/, "").replace(/\.$/, "") || "0", clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const qt = (a, p) => { const s = a.slice().sort((x, y) => x - y), k = (s.length - 1) * p, f = Math.floor(k); return s[f] + (s[Math.min(f + 1, s.length - 1)] - s[f]) * (k - f); };
const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

const year = (Y) => { const D = Y.days, N = D.length, C = D.map((d) => d[1]), maxC = Math.max(...C), TAU = 14, S = [], RL = []; let st = 0;
  C.forEach((v) => { const r = st / TAU; st = st - r + v; S.push(st); RL.push(r); });
  const maxS = Math.max(...S) * 1.06, maxR = Math.max(...RL) || 1, mo = D.map((d) => d[0].slice(0, 7)), mk = [...new Set(mo)], band = {};
  mk.forEach((m) => { const v = S.filter((_, i) => mo[i] === m); band[m] = [qt(v, 0.25), qt(v, 0.75)]; });
  const ease = (k) => { const raw = mo.map((m) => band[m][k]); return raw.map((_, i) => { const a = Math.max(0, i - 7), b = Math.min(N - 1, i + 7); let s = 0; for (let j = a; j <= b; j++) s += raw[j]; return s / (b - a + 1); }); };
  const LO = ease(0), UP = ease(1), Z = S.map((s, i) => (s > UP[i] ? 2 : s < LO[i] ? 0 : 1));
  return { D, N, C, maxC, S, RL, maxS, maxR, mo, mk, LO, UP, Z }; };

const CLOUD = "M8 30a9 9 0 0 1 2-17.800a13 13 0 0 1 24.500-5.200a11 11 0 0 1 19.500 6.200a8.500 8.500 0 0 1 1 16.800z";
export const damSvg = (Y) => { const { D, N, C, maxC, S, RL, maxS, maxR, mo, mk, LO, UP, Z } = year(Y), W = FULL, X0 = 24, SW = W - 48, Y0 = 24, Hs = 392, sb = Y0 + Hs;
  const xd = X0 + SW * 0.7, cy = Y0 + 132, fy = sb - 20, hw = 34, dw = 86, bx = X0 + SW * 0.17, sky = Y0 + 64, base = sb + 16 + 48, H = base + 52;
  const yl = (v) => fy - 12 - clamp(v / maxS, 0, 1) * (fy - 12 - (cy + 18));
  /* one day every 0.1 s, then RST frames in which the water drains back to day one */
  const RST = 16, M = N + RST, DUR = `${(M * 0.1).toFixed(1)}s`, F = (N - 1) / (M - 1), REP = `dur="${DUR}" repeatCount="indefinite"`;
  const back = (arr, to, fmt) => arr.map(fmt).concat(Array.from({ length: RST }, (_, k) => fmt(arr[N - 1] + (to - arr[N - 1]) * (k + 1) / RST))).join(";");
  const disc = (fn) => Array.from({ length: M }, (_, i) => (fn(i < N ? i : 0) ? 1 : 0)).join(";");
  const ty = (arr) => back(arr.map(yl), yl(arr[0]), (v) => `0 ${f1(v)}`);
  const bank = `M${X0} ${cy - 8}C${f1(X0 + SW * 0.05)} ${cy + 50} ${f1(X0 + (bx - X0) * 0.62)} ${fy - 8} ${f1(bx)} ${fy}`, xo = xd + dw * 0.66, yo = fy - (fy - cy) * 0.2;
  let wv = `M${X0 - 90} 0`; for (let i = X0 - 90; i < xd + 90; i += 40) wv += "q10 -5 20 0t20 0"; wv += `V${Hs + 60}H${X0 - 90}Z`;
  /* rain in tiers: tier j shows on days with enough commits, so the amount of rain follows the day */
  const TIERS = 8, PER = 12, rg = rnd(7), K = TIERS * PER, fall = fy - sky - 10, kOf = (i) => (C[i] ? Math.max(1, Math.round(Math.sqrt(C[i] / maxC) * TIERS)) : 0); let rain = "";
  for (let j = 0; j < TIERS; j++) { let g = ""; for (let s = 0; s < PER; s++) { const idx = s * TIERS + j, rx = X0 + 30 + ((idx * 0.618034) % 1) * (xd - X0 - 64), ry = sky + rg() * 26; g += `<line class="rn" x1="${f1(rx)}" y1="${f1(ry)}" x2="${f1(rx - 6)}" y2="${f1(ry + 24)}" style="animation-delay:-${(rg() * 1.2).toFixed(2)}s;animation-duration:${(0.55 + rg() * 0.4).toFixed(2)}s"/>`; }
    rain += `<g opacity="0"><animate attributeName="opacity" calcMode="discrete" ${REP} values="${disc((i) => kOf(i) > j)}"/>${g}</g>`; }
  const clouds = [[0.2, 16, 1.3], [0.42, 4, 1.75], [0.66, 20, 1.35]].map((p) => `<path fill="#2c4a52" transform="translate(${f1(X0 + p[0] * (xd - X0 - 70))} ${Y0 + p[1] + 12}) scale(${p[2]})" d="${CLOUD}"/>`).join("");
  const cloudOp = back(C.map((_, i) => 0.35 + 0.65 * Math.min(1, kOf(i) / (TIERS * 0.5))), 0.35, (v) => v.toFixed(2));
  /* year strip */
  const pl = X0 + 12, dx = (SW - 24) / (N - 1), bw = 2.4, xi = (i) => pl + i * dx; let bars = "", ticks = "";
  for (let i = 0; i < N; i++) { const hh = C[i] ? Math.max(2, C[i] / maxC * 48) : 1; bars += `M${f1(xi(i) - bw / 2)} ${f1(base - hh)}h${bw}v${f1(hh)}h-${bw}z`; }
  D.forEach((d, k) => { if (d[0].slice(8) !== "01") return; const m = +d[0].slice(5, 7), xx = f1(xi(k) - dx / 2); ticks += `<line x1="${xx}" y1="${base - 52}" x2="${xx}" y2="${base + 24}" stroke="#ecf4f2" stroke-opacity=".13" stroke-dasharray="2 4"/><text x="${f1(xi(k) - dx / 2 + 6)}" y="${base + 26}" class="m" font-size="17" fill="#8aa3a3">${m === 1 ? d[0].slice(0, 4) : MON[m - 1]}</text>`; });
  const months = mk.map((m) => `<text x="${X0 + 26}" y="${Y0 + 54}" font-size="36" font-weight="600" letter-spacing="-.8" fill="#ecf4f2" opacity="0">${MON[+m.slice(5) - 1]} ${m.slice(0, 4)}<animate attributeName="opacity" calcMode="discrete" ${REP} values="${disc((i) => mo[i] === m)}"/></text>`).join("");
  const CALLS = [["Store water", "#d3d0fb"], ["Steady release", "#ecf4f2"], ["Open the gates", "#f7d67f"]], cx0 = xd + 36, cyc = cy - 6 - 42;
  const calls = CALLS.map(([lab, col], z) => `<g opacity="0"><animate attributeName="opacity" calcMode="discrete" ${REP} values="${disc((i) => Z[i] === z)}"/><rect x="${f1(cx0)}" y="${cyc}" width="${Math.round(lab.length * 9.8 + 30)}" height="36" rx="11" fill="#0b1c21" stroke="${col}" stroke-opacity=".5"/><text x="${f1(cx0 + 15)}" y="${cyc + 24}" font-size="18" font-weight="500" fill="${col}">${lab}</text></g>`).join("");
  const gate = RL.map((r) => r / maxR), jetW = back(gate.map((g) => (g > 0.02 ? 3 + g * 16 : 0)), 0, f1), dnH = gate.map((g) => 30 * (0.14 + g * 0.86));
  const chip = (lab, col, y) => `<rect x="${f1(X0 + SW * 0.26)}" y="${y - 17}" width="${lab.length * 10 + 18}" height="24" rx="7" fill="#0b1c21" fill-opacity=".9"/><text x="${f1(X0 + SW * 0.26 + 9)}" y="${y}" class="m" font-size="17" font-weight="500" fill="${col}">${lab}</text>`;
  const css = `.rn{stroke:#8de4e6;stroke-width:2.6;stroke-linecap:round;opacity:.85;animation:rf .7s linear infinite}@keyframes rf{to{transform:translate(${f1(-fall * 0.25)}px,${f1(fall)}px)}}.wave{animation:wv 4.5s linear infinite}@keyframes wv{to{transform:translateX(-80px)}}.jet{animation:fl .5s linear infinite}@keyframes fl{to{stroke-dashoffset:-17}}@media (prefers-reduced-motion:reduce){.rn,.wave,.jet{animation:none}}`;
  const body = `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d262d"/><stop offset="1" stop-color="#10242a"/></linearGradient>
<linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe1e6"/><stop offset=".25" stop-color="#58bcc4"/><stop offset="1" stop-color="#2f7c86"/></linearGradient>
<linearGradient id="dmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a6168"/><stop offset="1" stop-color="#1b343b"/></linearGradient>
<clipPath id="bs"><path d="${bank}H${f1(xd - hw)}L${f1(xd - 12)} ${cy}V${Y0}H${X0}Z"/></clipPath><clipPath id="sc"><rect x="${X0}" y="${Y0}" width="${SW}" height="${Hs}" rx="18"/></clipPath>
<clipPath id="lit"><rect x="0" y="${base - 50}" width="0" height="52"><animate attributeName="width" ${REP} values="${f1(xi(0))};${f1(xi(N - 1) + bw)};${f1(xi(N - 1) + bw)}" keyTimes="0;${f4(F)};1"/></rect></clipPath><path id="bars" d="${bars}"/></defs>
<rect width="${W}" height="${H}" rx="28" fill="#10242a" stroke="#27424a"/>
<g clip-path="url(#sc)"><rect x="${X0}" y="${Y0}" width="${SW}" height="${Hs}" fill="url(#sk)"/><g>${clouds}<animate attributeName="opacity" ${REP} values="${cloudOp}"/></g>${rain}
<g clip-path="url(#bs)"><g><animateTransform attributeName="transform" type="translate" ${REP} values="${ty(S)}"/><g class="wave"><path d="${wv}" fill="url(#wg)"/></g></g>
<g><animateTransform attributeName="transform" type="translate" ${REP} values="${ty(UP)}"/><line x1="${X0}" x2="${f1(xd)}" stroke="#f7d67f" stroke-width="2" stroke-dasharray="9 7"/>${chip("upper", "#f7d67f", -9)}</g>
<g><animateTransform attributeName="transform" type="translate" ${REP} values="${ty(LO)}"/><line x1="${X0}" x2="${f1(xd)}" stroke="#d3d0fb" stroke-width="2" stroke-dasharray="9 7"/>${chip("lower", "#d3d0fb", 27)}</g></g>
<path d="${bank}H${W - X0}V${sb}H${X0}Z" fill="#0b1c21"/><path d="${bank}H${W - X0}" fill="none" stroke="#ecf4f2" stroke-opacity=".28" stroke-width="1.5"/>
<rect x="${f1(xd + dw - 2)}" width="${f1(W - X0 - xd - dw + 2)}" fill="#3f8d95"><animate attributeName="height" ${REP} values="${back(dnH, dnH[0], f1)}"/><animate attributeName="y" ${REP} values="${back(dnH.map((v) => fy - v), fy - dnH[0], f1)}"/></rect>
<path class="jet" d="M${f1(xo)} ${f1(yo)}Q${f1(xo + 34)} ${f1(yo - 4)} ${f1(xo + 50)} ${fy - 6}" fill="none" stroke="#63dbe5" stroke-linecap="round" stroke-dasharray="10 7"><animate attributeName="stroke-width" ${REP} values="${jetW}"/></path>
<path d="M${f1(xd - 12)} ${cy}H${f1(xd + 12)}L${f1(xd + dw)} ${fy}H${f1(xd - hw)}Z" fill="url(#dmg)" stroke="#ecf4f2" stroke-opacity=".26"/><rect x="${f1(xd - 24)}" y="${cy - 7}" width="48" height="8" rx="3.5" fill="#5c8a90"/>
<path d="M${f1(xd)} ${cy + 6}V${f1(yo)}H${f1(xo - 4)}" fill="none" stroke="#f7d67f" stroke-opacity=".32" stroke-width="1.5" stroke-dasharray="3 5"/><path d="M${f1(xd)} ${cy + 6}V${f1(yo)}H${f1(xo - 4)}" fill="none" stroke="#f7d67f" stroke-width="1.8" stroke-dasharray="3 5" opacity="0"><animate attributeName="opacity" calcMode="discrete" ${REP} values="${disc((i) => Z[i] === 2)}"/></path>
<rect x="${f1(xd - 26)}" y="${cyc - 5}" width="52" height="52" rx="16" fill="#f7d67f" fill-opacity=".18"/><rect x="${f1(xd - 21)}" y="${cyc}" width="42" height="42" rx="12" fill="#f7d67f"/>${gi("robot", xd - 14, cyc + 7, 28, "#2a2106")}${calls}
${months}<text x="${X0 + 28}" y="${Y0 + 82}" class="m" font-size="17" font-weight="500" fill="#8de4e6">rain = commits that day</text>
<text x="${f1((bx + xd - hw) / 2)}" y="${fy - 18}" text-anchor="middle" class="m" font-size="17" font-weight="500" fill="#06282c">storage</text><text x="${W - X0 - 18}" y="${fy - 44}" text-anchor="end" class="m" font-size="17" fill="#a9bfbe">release</text></g>
<line x1="${pl}" y1="${base + 0.5}" x2="${W - X0 - 12}" y2="${base + 0.5}" stroke="#ecf4f2" stroke-opacity=".14"/>${ticks}<use href="#bars" fill="#ecf4f2" fill-opacity=".17"/><use href="#bars" fill="#8de4e6" clip-path="url(#lit)"/>
<g><animateTransform attributeName="transform" type="translate" ${REP} values="${f1(xi(0))} 0;${f1(xi(N - 1))} 0;${f1(xi(N - 1))} 0" keyTimes="0;${f4(F)};1"/><line y1="${sb + 6}" y2="${base}" stroke="#f7d67f" stroke-width="1.8"/><circle cy="${sb + 6}" r="5" fill="#f7d67f"/></g>`;
  return svg(W, H, body, css); };

/* ---------- the year as a grid of days; the snake eats the faintest squares first ---------- */
export const snakeSvg = (Y) => { const D = Y.days, N = D.length, C = D.map((d) => d[1]), nz = C.filter((v) => v > 0), Q = [qt(nz, 0.25), qt(nz, 0.5), qt(nz, 0.75)], LV = C.map((v) => (v === 0 ? 0 : v <= Q[0] ? 1 : v <= Q[1] ? 2 : v <= Q[2] ? 3 : 4));
  const dow0 = new Date(D[0][0] + "T12:00:00Z").getUTCDay(), nW = Math.ceil((N + dow0) / 7), W = FULL, pitch = Math.floor((W - 80) / nW * 10) / 10, cs = +(pitch - 3.4).toFixed(1), ox = (W - nW * pitch + pitch - cs) / 2, top = 104, H = Math.round(top + 7 * pitch + 60);
  const X = (col) => +(ox + col * pitch).toFixed(1), Yr = (r) => +(top + r * pitch).toFixed(1), pos = C.map((_, i) => [Math.floor((i + dow0) / 7), (i + dow0) % 7]);
  /* the route: lowest level first, nearest square next, sideways then up or down */
  let head = [0, 0], steps = 0; const eatAt = new Array(N).fill(-1), done = new Array(N).fill(false), pts = [[0, 0]], span = {};
  for (let v = 1; v <= 4; v++) { for (;;) { let best = -1, bd = 1e9; for (let i = 0; i < N; i++) if (!done[i] && LV[i] === v) { const d = Math.abs(pos[i][0] - head[0]) + Math.abs(pos[i][1] - head[1]); if (d < bd) { bd = d; best = i; } } if (best < 0) break;
    const p = pos[best]; if (p[0] !== head[0] && p[1] !== head[1]) pts.push([p[0], head[1]]); if (bd) pts.push(p.slice()); if (!(v in span)) span[v] = [steps, steps]; steps += bd; span[v][1] = steps; eatAt[best] = steps; done[best] = true; head = p.slice(); } }
  const FR = 0.95, DUR = `${(steps * 0.045 + 3).toFixed(1)}s`, REP = `dur="${DUR}" repeatCount="indefinite"`, tOf = (s) => clamp(s / steps * FR, 0.001, FR);
  const path = pts.map((p, i) => (i ? "L" : "M") + X(p[0]) + " " + Yr(p[1])).join("");
  let base = "", cells = "", lab = "";
  for (let i = 0; i < N; i++) { const x = X(pos[i][0]), y = Yr(pos[i][1]); base += `<use href="#c" x="${x}" y="${y}"/>`;
    if (LV[i]) { const t = tOf(eatAt[i]); cells += `<use href="#c" x="${x}" y="${y}" class="l${LV[i]}"><animate attributeName="opacity" ${REP} values="1;1;0;0;1" keyTimes="0;${f4(t)};${f4(t + 0.003)};.985;1"/></use>`; }
    if (D[i][0].slice(8) === "01") { const m = +D[i][0].slice(5, 7); lab += `<text x="${X(pos[i][0])}" y="${top - 12}" class="m" font-size="17" fill="#8aa3a3">${m === 1 ? D[i][0].slice(0, 4) : MON[m - 1]}</text>`; } }
  const lx = W - ox - 5 * (cs + 5) - 58, ly = H - 38; let lg = `<text x="${f1(lx - 10)}" y="${ly + cs * 0.8}" text-anchor="end" class="m" font-size="17" fill="#8aa3a3">Less</text><text x="${f1(lx + 5 * (cs + 5) + 6)}" y="${ly + cs * 0.8}" class="m" font-size="17" fill="#8aa3a3">More</text>`;
  for (let v = 0; v < 5; v++) { lg += `<use href="#c" x="${f1(lx + v * (cs + 5))}" y="${ly}" class="l${v}"/>`; if (span[v]) lg += `<rect x="${f1(lx + v * (cs + 5) - 2)}" y="${ly - 2}" width="${cs + 4}" height="${cs + 4}" rx="6" fill="none" stroke="#f7d67f" stroke-width="2" opacity="0"><animate attributeName="opacity" calcMode="discrete" ${REP} values="0;1;0" keyTimes="0;${f4(Math.max(0.0005, tOf(span[v][0]) - 0.0005))};${f4(v === 4 ? 0.985 : tOf(span[v][1]))}"/></rect>`; }
  const seg = (k) => { const lag = k / steps; return `<rect width="${cs}" height="${cs}" rx="${(cs * 0.3).toFixed(1)}" fill="${k ? "#8de4e6" : "#f7d67f"}"${k ? ` opacity="${(0.9 - k * 0.14).toFixed(2)}"` : ""}><animateMotion ${REP} calcMode="linear" path="${path}" keyPoints="${k ? `0;0;${f4(1 - lag)};${f4(1 - lag)}` : "0;1;1"}" keyTimes="${k ? `0;${f4(lag * FR)};${f4(FR)};1` : `0;${f4(FR)};1`}"/></rect>`; };
  const eyes = `<g><circle cx="${(cs * 0.32).toFixed(1)}" cy="${(cs * 0.42).toFixed(1)}" r="1.9" fill="#2a2106"/><circle cx="${(cs * 0.68).toFixed(1)}" cy="${(cs * 0.42).toFixed(1)}" r="1.9" fill="#2a2106"/><animateMotion ${REP} calcMode="linear" path="${path}" keyPoints="0;1;1" keyTimes="0;${f4(FR)};1"/></g>`;
  const css = `.l0{fill:#ecf4f2;fill-opacity:.055}.l1{fill:#1d4b53}.l2{fill:#2c7f88}.l3{fill:#55c3ca}.l4{fill:#c6f7f5}`;
  const body = `<defs><rect id="c" width="${cs}" height="${cs}" rx="${(cs * 0.24).toFixed(1)}"/></defs><rect width="${W}" height="${H}" rx="28" fill="#10242a" stroke="#27424a"/>
<text x="${f1(ox)}" y="50" font-size="32" font-weight="600" letter-spacing="-.7" fill="#ecf4f2">${MON[+D[0][0].slice(5, 7) - 1]} ${D[0][0].slice(0, 4)} → ${MON[+D[N - 1][0].slice(5, 7) - 1]} ${D[N - 1][0].slice(0, 4)}</text><text x="${W - ox}" y="50" text-anchor="end" class="m" font-size="17" font-weight="500" fill="#8de4e6">one square per day · the snake eats the faintest first</text>
${lab}<g class="l0">${base}</g>${cells}${lg}${[4, 3, 2, 1, 0].map(seg).join("")}${eyes}`;
  return svg(W, H, body, css); };



/* ---------- dates and fetching ---------- */
export const nyDate = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });

export const buildDates = (end, n = N) => {
  const endT = Date.parse(end + "T12:00:00Z");
  return Array.from({ length: n }, (_, i) => new Date(endT - (n - 1 - i) * 864e5).toISOString().slice(0, 10));
};

const requestJson = async (fetchImpl, token, url, allow409 = false) => {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "commit-maps" };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try { res = await fetchImpl(url, { headers }); }
  catch (e) { throw new Error(`network error for ${new URL(url).pathname}: ${e.message}`); }
  if (allow409 && res.status === 409) return [];
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${new URL(url).pathname}`);
  return res.json();
};

const paginate = async (fetchImpl, token, urlFor, allow409) => {
  const all = [];
  for (let page = 1; ; page++) {
    const items = await requestJson(fetchImpl, token, urlFor(page), allow409);
    all.push(...items);
    if (items.length < 100) return all;
  }
};

export const fetchYear = async ({ end, owner = OWNER, token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN, fetchImpl = fetch, log = () => {} } = {}) => {
  const dates = buildDates(end), since = new Date(Date.parse(dates[0] + "T00:00:00Z") - 864e5).toISOString();
  const all = await paginate(fetchImpl, token, (p) => `${API}/users/${owner}/repos?type=owner&per_page=100&page=${p}`, false);
  const repos = all.filter((r) => !r.fork && !r.private && r.pushed_at >= since);
  const count = Object.fromEntries(dates.map((d) => [d, 0]));
  for (const r of repos) {
    const commits = await paginate(fetchImpl, token, (p) => `${API}/repos/${owner}/${r.name}/commits?author=${owner}&since=${since}&per_page=100&page=${p}`, true);
    let k = 0;
    for (const c of commits) { const d = nyDate(c.commit.author.date); if (d in count) { count[d]++; k++; } }
    log(r.name, k);
  }
  return {
    fetchedAt: new Date().toISOString(),
    window: [dates[0], end],
    scope: "public repositories owned by " + owner + ", forks excluded, default branch, author = " + owner + ", US Eastern dates",
    repos: repos.length,
    days: dates.map((d) => [d, count[d]]),
  };
};

/* ---------- validation and output ---------- */
export const validate = (year, dam, snake) => {
  const fail = (m) => { throw new Error("validation failed: " + m); };
  const days = year.days;
  if (!Array.isArray(days) || days.length !== N) fail(`expected ${N} days, got ${days && days.length}`);
  days.forEach(([d, c], i) => {
    if (!/^\d{4}-\d\d-\d\d$/.test(d)) fail("bad date " + d);
    if (i && Date.parse(d + "T12:00:00Z") - Date.parse(days[i - 1][0] + "T12:00:00Z") !== 864e5) fail("dates are not consecutive at " + d);
    if (!Number.isInteger(c) || c < 0) fail("bad count on " + d);
  });
  if (!(year.repos > 0)) fail("repos must be > 0");
  if (!days.some(([, c]) => c > 0)) fail("total commits is 0");
  for (const [name, s] of [["dam", dam], ["snake", snake]]) {
    if (typeof s !== "string" || !s.startsWith("<svg")) fail(name + " svg does not start with <svg");
    if (/NaN|undefined|Infinity|<script/.test(s)) fail(name + " svg contains NaN, undefined, Infinity or <script");
  }
};

export const writeAll = (outDir, files) => {
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = Object.keys(files).map((name) => [path.join(outDir, name + ".tmp"), path.join(outDir, name), files[name]]);
  try {
    for (const [t, , data] of tmp) fs.writeFileSync(t, data);
  } catch (e) {
    for (const [t] of tmp) fs.rmSync(t, { force: true });
    throw e;
  }
  for (const [t, f] of tmp) fs.renameSync(t, f);
};

const todayNY = () => nyDate(new Date().toISOString());

const parseArgs = (argv) => {
  const o = { out: DEFAULT_OUT };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = argv[i + 1];
    if (!["--from", "--out", "--end"].includes(k) || v === undefined) throw new Error("usage: commit-maps.mjs [--from year.json] [--out dir] [--end YYYY-MM-DD]");
    o[k.slice(2)] = v; i++;
  }
  return o;
};

const main = async () => {
  const opts = parseArgs(process.argv.slice(2));
  const year = opts.from
    ? JSON.parse(fs.readFileSync(opts.from, "utf8"))
    : await fetchYear({ end: opts.end || todayNY(), log: (name, k) => console.log(name, k) });
  const dam = damSvg(year), snake = snakeSvg(year);
  validate(year, dam, snake);
  writeAll(opts.out, { "year.json": JSON.stringify(year), "activity-dam.svg": dam, "activity-snake.svg": snake });
  const counts = year.days.map((d) => d[1]);
  console.log(`wrote ${opts.out}: repos ${year.repos}, total ${counts.reduce((a, b) => a + b, 0)}, max day ${Math.max(...counts)}`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e.message); process.exitCode = 1; });
}
