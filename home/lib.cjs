/* Shared pieces for the homepage generator: line icons, brand icons and the valley figure. Pure string builders. */

/* icons: 48 box, stroke = currentColor */
const IC = {
  human: `<rect x="21" y="9" width="21" height="29" rx="3"/><path d="M27 9V6h9v3M26 19l2 2 4-4M26 29l2 2 4-4M35 20h3M35 30h3"/><circle cx="12" cy="24" r="5"/><path d="M3 42c0-6 4-9 9-9s9 3 9 9"/>`,
  robot: `<rect x="10" y="15" width="28" height="22" rx="7"/><path d="M24 15V9M10 23H6v7h4M38 23h4v7h-4M19 31h10"/><circle cx="24" cy="7" r="2"/><circle cx="18.5" cy="24.5" r="2.4" class="fillc"/><circle cx="29.5" cy="24.5" r="2.4" class="fillc"/>`,
  env: `<path d="M9 25 24 11l15 14M14 21v12M34 21v12M21 33v-7h6v7"/><path d="M3 38c4-3 6.500-3 10.500 0s6.500 3 10.500 0 6.500-3 10.500 0 6.500 3 10.500 0M3 44c4-3 6.500-3 10.500 0s6.500 3 10.500 0 6.500-3 10.500 0 6.500 3 10.500 0"/>`,
  gate: `<path d="M24 5l15 5.500v11.500c0 9.500-6.500 16-15 20-8.500-4-15-10.500-15-20V10.500z"/><path d="M17 23.500l5 5 9.500-10.500"/>`,
  person: `<circle cx="24" cy="15" r="7.500"/><path d="M9 42c0-9.500 6.500-14 15-14s15 4.500 15 14"/>`,
  board: `<rect x="5" y="8" width="38" height="28" rx="4"/><path d="M18 8v28M30 8v28M9 15h5M9 21h5M22 15h4M34 15h5M34 21h5M34 27h5M17 42h14"/>`,
  map: `<path d="M6 13l11-4 14 4 11-4v26l-11 4-14-4-11 4zM17 9v26M31 13v26"/>`,
  paper: `<path d="M12 5h17l9 9v29H12zM29 5v9h9M18 23h14M18 30h14M18 37h9"/>`,
  book: `<path d="M24 12c-4-3-9-4-16-4v29c7 0 12 1 16 4 4-3 9-4 16-4V8c-7 0-12 1-16 4zM24 12v29"/>`,
  mail: `<rect x="5" y="10" width="38" height="28" rx="4"/><path d="M6 13l18 14 18-14"/>`,
};
const icon = (k, size = 24, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${IC[k]}</svg>`;

/* brand marks (filled) */
const BRAND = {
  github: [16, "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"],
  linkedin: [24, "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"],
  scholar: [24, "M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.500 12 9.500c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"],
};
const bi = (k, z = 22) => BRAND[k] ? `<svg class="ic" viewBox="0 0 ${BRAND[k][0]} ${BRAND[k][0]}" width="${z}" height="${z}" style="fill:currentColor;stroke:none" aria-hidden="true"><path d="${BRAND[k][1]}"/></svg>` : icon(k === "cv" ? "paper" : k, z);

/* valley figure, 640x460 coordinate space */
const GP = [[0, 296], [70, 298], [170, 304], [280, 318], [380, 338], [470, 366], [545, 406], [585, 432], [640, 436]];
const seg = (a, b) => `C${(a[0] + b[0]) / 2} ${a[1]} ${(a[0] + b[0]) / 2} ${b[1]} ${b[0]} ${b[1]}`;
const gTop = GP.map((p, i) => (i ? seg(GP[i - 1], p) : `M${p[0]} ${p[1]}`)).join("");
const gBack = GP.slice().reverse().map((p, i, a) => (i ? seg(a[i - 1], p) : "")).join("");
const HS = [[70, 298, "wait"], [170, 304, "wait"], [280, 318, "wait"], [380, 338, "ins"], [470, 366, "up"]];
const GL = {
  ask: `<rect x="-5" y="-6" width="10" height="12" rx="2"/><path d="M-2 -2h4M-2 2h4"/>`,
  up: `<path d="M0 6V-6M-5 -1l5-5 5 5"/>`,
  ins: `<path d="M0 -7l6 2v4c0 4-3 6-6 8-3-2-6-4-6-8v-4z"/>`,
  wait: `<path d="M-4 0h8"/>`,
};
let wv = "M-160 0q20 -7 40 0"; for (let i = 1; i < 24; i++) wv += "t40 0"; wv += "V220H-160Z";
const water = (cls) => `<g class="wtr ${cls}"><g transform="translate(0 440)"><path class="wave" d="${wv}"/></g></g>`;
const house = ([x, gy, k], i) => `<g class="hs ${k}" data-g="${gy}" transform="translate(${x} ${gy})"><path class="stilt" d="M-12 0V-62M12 0V-62"/><g class="bd"><rect class="wall" x="-17" y="-26" width="34" height="26" rx="3"/><path class="roof" d="M-23 -24L0 -45 23 -24Z"/><rect class="door" x="-4" y="-13" width="8" height="13" rx="1.5"/><g transform="translate(0 -66)"><g class="bg ask" style="--d:${i}"><circle r="12"/>${GL.ask}</g><g class="bg dec ${k}" style="--d:${i}"><circle r="12"/>${GL[k]}</g></g></g></g>`;
const rain = Array.from({ length: 18 }, (_, i) => { const x = 24 + i * 36, y = 40 + ((i * 53) % 150); return `<line x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 16}" style="animation-delay:${((i * 0.137) % 0.7).toFixed(2)}s"/>`; }).join("");
const rings = (cx, cy) => Array.from({ length: 6 }, (_, j) => `<ellipse class="cn" cx="${cx}" cy="${cy}" rx="${60 + j * 44}" ry="${34 + j * 26}" transform="rotate(-14 ${cx} ${cy})"/>`).join("");

const VALLEY_CSS = `.valley .hill{fill:#fff;opacity:.04}.valley .cn{fill:none;stroke:#fff;opacity:.06}
.valley .gr{stroke:#8de4e6;stroke-opacity:.55;stroke-width:1.5}
.valley .wave{fill:#35b6c4;animation:wave 7s linear infinite}.valley .wtr.fr .wave{fill:#8de4e6;opacity:.34}
.valley .stilt{fill:none;stroke:#cfe9e8;stroke-width:2.5;stroke-linecap:round}
.valley .wall{fill:#eef6f4}.valley .roof{fill:#8de4e6}.valley .door{fill:#0c2228}
.valley .bg circle{fill:#0c2228;stroke:#8de4e6;stroke-width:1.5}
.valley .bg path,.valley .bg rect{fill:none;stroke:#ecf4f2;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.valley .bg.ins circle{stroke:#f7d67f}.valley .bg.up circle{stroke:#aee6c2}
.valley .hs.wet .wall{fill:#f4a285}.valley .hs.wet.cov .wall{fill:#f7d67f}
.valley .rain line{stroke:#8de4e6;stroke-width:1.4;stroke-linecap:round;animation:fall .7s linear infinite}
@keyframes wave{to{transform:translateX(-160px)}}
@keyframes fall{from{transform:translate(8px,-24px);opacity:0}30%{opacity:.8}to{transform:translate(-10px,44px);opacity:0}}`;

const valley = (id = "v") => `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11363d"/><stop offset="1" stop-color="#071417"/></linearGradient><clipPath id="${id}c"><path d="M0 0H640V436${gBack}Z"/></clipPath></defs>
<g class="valley-in">${rings(470, 150)}<path class="hill" d="M0 262C90 210 170 236 250 216S410 150 510 200 600 186 640 174V460H0Z"/><path class="hill" d="M0 284C120 262 200 286 320 262S520 250 640 236V460H0Z"/>
${water("bk")}<path class="gr" d="${gTop}V460H0Z" fill="url(#${id}g)"/>
${HS.map(house).join("")}
<g clip-path="url(#${id}c)">${water("fr")}</g><g class="rain">${rain}</g></g>`;

/* The page's Content-Security-Policy forbids inline style attributes, so every style="…" the generator writes
   becomes a generated class. The declarations get !important to keep the precedence an inline style had. */
function extractStyles(html, map = new Map()) {
  const out = html.replace(/<([a-zA-Z][\w:-]*)((?:\s+[^\s=<>"']+(?:="[^"]*")?)*)\s*(\/?)>/g, (tag, name, attrs, close) => {
    const m = / style="([^"]*)"/.exec(attrs);
    if (!m) return tag;
    const decl = m[1].trim().replace(/;$/, "");
    if (!map.has(decl)) map.set(decl, "hx" + map.size.toString(36));
    const cls = map.get(decl), rest = attrs.replace(m[0], "");
    return `<${name}${/ class="/.test(rest) ? rest.replace(/ class="([^"]*)"/, (_, c) => ` class="${c} ${cls}"`) : ` class="${cls}"${rest}`}${close ? "/" : ""}>`;
  });
  if (/\sstyle=/.test(out)) throw new Error("home: an inline style attribute survived extraction");
  return out;
}
const styleRules = (map) => [...map].map(([decl, cls]) => `.${cls}{${decl.split(";").map((d) => d.trim()).filter(Boolean).map((d) => d + "!important").join(";")}}`).join("\n");

module.exports = { icon, bi, valley, VALLEY_CSS, extractStyles, styleRules };
