/* Tiles whose area follows a number. Rows of flex tiles: inside a row the width follows sqrt(value),
   and each row's height follows the row's total, so every tile's area is proportional to sqrt(value). */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
const lum = (h) => { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ramp = (stops) => (t) => { t = Math.max(0, Math.min(1, t)); const k = t * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(k)); return mix(stops[i], stops[i + 1], k - i); };
/* the text colour with the better contrast on that background */
const ink = (bg, dark, light) => { const L = lum(bg), cd = (L + 0.05) / (lum(dark) + 0.05), cl = (lum(light) + 0.05) / (L + 0.05); return cd >= cl ? dark : light; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/* [background, ink, soft ink]. A mid-tone background is moved away from its ink until the pair reaches 4.6:1 (WCAG AA is 4.5:1),
   so the text stays readable whatever the star count is; the soft ink is the ink mixed toward the background as far as 4.6:1 allows. */
const tone = (stops, dark, light) => (v, max) => { let bg = ramp(stops)((v / max) ** 0.65); const fg = ink(bg, dark, light);
  for (let k = 0; k < 24 && ratio(bg, fg) < 4.6; k++) bg = mix(bg, fg === light ? "#000000" : "#ffffff", 0.05);
  const soft = [0.2, 0.15, 0.1, 0.05].map((t) => mix(fg, bg, t)).find((c) => ratio(c, bg) >= 4.6) || fg;
  return [bg, fg, soft]; };
const starTone = tone(["#12292f", "#8de4e6", "#f7d67f"], "#06282c", "#ecf4f2");
const irisTone = tone(["#1a1c3a", "#d3d0fb"], "#1b1a3c", "#ecf4f2");
/* items: [{v, ...}] ; rows: how many tiles per row from the largest down (the last row takes the rest) ; total: summed row heights in px */
const layout = (items, rows, total) => { const sorted = items.slice().sort((a, b) => b.v - a.v).map((x) => ({ ...x, w: Math.sqrt(x.v) })), max = sorted[0].v, out = []; let k = 0;
  for (const cnt of rows) { if (k >= sorted.length) break; const part = sorted.slice(k, k + cnt); k += cnt; out.push({ items: part, sum: part.reduce((a, x) => a + x.w, 0) }); }
  const all = out.reduce((a, r) => a + r.sum, 0); out.forEach((r) => { r.h = Math.round(total * r.sum / all); r.items.forEach((x) => { x.u = Math.sqrt(x.v / max); x.share = x.w / r.sum; }); });
  return { rows: out, max }; };
module.exports = { layout, starTone, irisTone, mix, lum, ink, ratio };
