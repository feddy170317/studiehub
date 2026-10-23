// motor.js: "Ballpoint Notebook"-motor til undervisningsvideoer (blå Bic på kollegieblok, kun stemme, ingen lydeffekter).
// En video = manus.json (replikker) + scene.js (hvad pennen tegner). byg.py samler harness.js + denne fil + VO + scene
// til én selvstændig HTML. Alt er en ren funktion af t: window.seek(t) tegner billedet til tid t.
//
// Verden: én lang side. Sektion k ligger i y = 780*k ... 780*k + 720 (lokale koordinater 0..1280 x 0..720).
// Margin (rød linje) ved x = 110; indhold i x = 150..1240. Øverste højre hjørne (x > 1000, y < 70) er til headeren.
(function () {
'use strict';
const PI = Math.PI, TAU = 2 * PI, SEC = 780;
const BP = (window.BP = {});

// ---------------------------------------------------------------- tid
let VO = null;
const norm = (s) => s.toLowerCase().replace(/[.,:;?!»«"]+$/, '').replace(/^[»«"(]+/, '');
BP.L = (id) => { const l = VO.lines[id]; if (!l) throw new Error('replik mangler: ' + id); return l; };
// starttid/sluttid for n'te forekomst af `word` i replik `id`. Findes ordet ikke i ordtiderne, anslås tiden ud fra
// ordets plads i teksten, og der logges en advarsel i BP.WARN (video.py snap/render udskriver dem).
BP.WARN = [];
function find(id, word, n, idx) {
  let k = 0; const q = norm(word), L = BP.L(id);
  for (const w of L.words) { const nw = norm(w[0]); if (nw === q || nw.startsWith(q + ' ')) { if (k++ === n) return w[idx]; } }
  const txt = L.text.toLowerCase(); let pos = -1;
  for (let i = 0; i <= n; i++) pos = txt.indexOf(q, pos + 1);
  BP.WARN.push(`ord mangler i "${id}": ${word} #${n}`);
  return L.start + (L.end - L.start) * (pos < 0 ? 0 : pos / txt.length);
}
BP.wt = (id, word, n = 0) => find(id, word, n, 1);
BP.we = (id, word, n = 0) => find(id, word, n, 2);

// ---------------------------------------------------------------- geometri (fra referencens ballpoint-stil)
const seg = (pts, step = 2.5) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let j = 0; j < n; j++) out.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]);
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const normals = (P) => P.map((p, i) => {
  const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
  return [-dy / d, dx / d];
});
const wob = (pts, nz, seed, amp = 1.0, freq = 0.02) => {
  const N = normals(pts); let L = 0;
  return pts.map((p, i) => {
    if (i) L += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const o = nz.n2(L * freq + seed * 1.37, seed * 0.71) * amp + nz.n2(L * freq * 6 + seed, seed + 3.3) * amp * 0.3;
    return [p[0] + N[i][0] * o, p[1] + N[i][1] * o];
  });
};
const ell = (cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2) => {
  const n = Math.max(10, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / 2.5)), out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return out;
};
const head = (P, len = 20, spread = 0.5) => {
  const a = P[P.length - 1], b = P[Math.max(0, P.length - 4)], an = Math.atan2(a[1] - b[1], a[0] - b[0]);
  return [[a[0] - Math.cos(an - spread) * len, a[1] - Math.sin(an - spread) * len], a, [a[0] - Math.cos(an + spread) * len, a[1] - Math.sin(an + spread) * len]];
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const win = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const camAt = (keys, t) => {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b[0]) {
      const u = eio((t - a[0]) / Math.max(1e-6, b[0] - a[0]));
      return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, Math.exp(Math.log(a[3]) + (Math.log(b[3]) - Math.log(a[3])) * u)];
    }
  }
  return keys[keys.length - 1].slice(1);
};
Object.assign(BP, { seg, ell, head, clamp, win, eio, PI, TAU, SEC });

// 4-farvet Bic: blå (hovedblæk), rød (strøm/rettelser), sort, grøn (resultat/kontrol)
const INK = { blue: [28, 50, 158], red: [196, 34, 44], black: [34, 32, 44], green: [20, 118, 72] };
const ink = (c, a = 0.9) => H.rgba(INK[c], a);
const HAND = (s) => `${s}px 'Gloria Hallelujah', 'Comic Sans MS', cursive`;
const BUB = (s) => `700 ${s}px Fredoka`;
const nzW = H.makeNoise(11);
const mctx = H.layer(8, 8).getContext('2d');

// ---------------------------------------------------------------- scenegraf
const ITEMS = [], DYN = [], CAM = [], DOODLES = [];
let SEED = 1, HEADER = '';
BP.P = (k, x, y) => [x, y + SEC * k]; // lokal -> verden

function mkStroke(pts, w, seed, wobA = 0.9) {
  let P = seg(pts, 3);
  if (P.length > 2) P = wob(P, nzW, seed, wobA, 0.02);
  const n = P.length, Wd = new Float32Array(n), r = H.rng(seed * 7 + 3);
  for (let i = 0; i < n; i++) {
    const u = n > 1 ? i / (n - 1) : 0;
    const press = 0.8 + 0.32 * nzW.n2(i * 0.045 + seed, seed * 0.37);
    const taper = Math.min(1, 0.6 + u * 10) * Math.min(1, (1 - u) * 7 + 0.3);
    Wd[i] = w * press * taper;
  }
  const gl = [];
  for (let k = 0; k < n / 90; k++) if (r.chance(0.55)) gl.push(r.int(3, Math.max(3, n - 3)));
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of P) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const len = []; let L = 0; for (let i = 0; i < n; i++) { if (i) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); len.push(L); }
  return { P, Wd, N: normals(P), gl, len, L, bb: [x0 - w, y0 - w, x1 + w, y1 + w] };
}
// k = sektion; alle punkter er lokale (0..1280, 0..720) i sektionen
const W = (k, pts) => pts.map(([x, y]) => [x, y + SEC * k]);
function line(k, pts, col, w, a, b, o = {}) {
  const it = { k: 'line', S: mkStroke(W(k, pts), w, SEED++, o.wob ?? 0.9), col, a, b, alpha: o.alpha ?? 0.9 };
  it.bb = it.S.bb; ITEMS.push(it); return it;
}
function arrow(k, pts, col, w, a, b, hl = 20) {
  line(k, pts, col, w, a, b);
  line(k, head(seg(pts, 3), hl, 0.45), col, w, b, b + 0.1);
}
function dot(k, x, y, r, col, a) { const p = W(k, [[x, y]])[0]; ITEMS.push({ k: 'dot', x: p[0], y: p[1], r, col, a, b: a + 0.05, bb: [p[0] - r, p[1] - r, p[0] + r, p[1] + r] }); }
// tekst: `_x`/`_{..}` = sænket, `^x`/`^{..}` = hævet (kun håndskrift)
function runsOf(s) {
  const out = []; let i = 0, cur = '';
  const push = (t, m) => { if (t) out.push({ t, m }); };
  while (i < s.length) {
    const c = s[i];
    const prevLetter = i > 0 && /[A-Za-zÆØÅæøåΑ-Ωα-ω)\]|]/.test(s[i - 1]); // alle græske bogstaver (σ_x, τ_{xy}, φ ...)
    if (((c === '_' && prevLetter) || c === '^') && i + 1 < s.length) {
      push(cur, 0); cur = '';
      let t;
      if (s[i + 1] === '{') { const j = s.indexOf('}', i); t = s.slice(i + 2, j); i = j + 1; } else { t = s[i + 1]; i += 2; }
      push(t, c === '_' ? 1 : 2);
    } else { cur += c; i++; }
  }
  push(cur, 0);
  return out;
}
function measureRuns(runs, size) { let w = 0; for (const r of runs) { mctx.font = HAND(r.m ? size * 0.62 : size); w += mctx.measureText(r.t).width; } return w; }
function text(k, s, x, y, size, col, a, b, o = {}) {
  const font = o.font || 'hand', p = W(k, [[x, y]])[0];
  const it = { k: 'text', s, x: p[0], y: p[1], size, col, a, b, font, align: o.align || 'left', rot: o.rot || 0, bold: !!o.bold };
  if (font === 'hand') { it.runs = runsOf(s); it.w = measureRuns(it.runs, size); }
  else { mctx.font = BUB(size); it.w = mctx.measureText(s).width; it.cache = bubbleCache(s, size, col); }
  it.x0 = it.align === 'center' ? -it.w / 2 : it.align === 'right' ? -it.w : 0;
  const R = Math.hypot(it.w, size) + 20;
  it.bb = [p[0] - R, p[1] - R, p[0] + R, p[1] + R];
  it.lx = x; it.ly = y; it.sec = k;
  ITEMS.push(it); return it;
}
// Boblebogstaver til overskrifter og tal; formler (=, ·, +, −, /, Σ, _ ...) bliver hule og svære at læse i
// boblefonten, så de skrives med fed håndskrift i stedet.
const bubble = (k, s, x, y, size, col, a, b, o = {}) => /[=·+−\/≈∝Σ_^()]/.test(s)
  ? text(k, s, x, y, Math.round(size * 0.92), col, a, b, { ...o, font: 'hand', bold: true })
  : text(k, s, x, y, size, col, a, b, { ...o, font: 'bubble' });
const endX = (it, gap = 0) => it.lx + it.x0 + it.w + gap; // lokal x lige efter teksten
const startX = (it) => it.lx + it.x0;

function mkHatch(poly, ang, gap, seed) {
  const r = H.rng(seed), d = [Math.cos(ang), Math.sin(ang)], nrm = [-d[1], d[0]];
  let lo = 1e9, hi = -1e9;
  for (const p of poly) { const s = p[0] * nrm[0] + p[1] * nrm[1]; lo = Math.min(lo, s); hi = Math.max(hi, s); }
  const segs = []; let flip = false;
  for (let s = lo + gap * 0.6; s < hi - gap * 0.3; s += gap * (0.8 + r() * 0.4)) {
    const c = [nrm[0] * s, nrm[1] * s];
    let umin = 1e9, umax = -1e9;
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], e = [q[0] - p[0], q[1] - p[1]];
      const D = -d[0] * e[1] + e[0] * d[1];
      if (Math.abs(D) < 1e-9) continue;
      const w = [p[0] - c[0], p[1] - c[1]];
      const u = (-w[0] * e[1] + e[0] * w[1]) / D, v = (d[0] * w[1] - d[1] * w[0]) / D;
      if (v >= -1e-6 && v <= 1 + 1e-6) { umin = Math.min(umin, u); umax = Math.max(umax, u); }
    }
    if (umax - umin < 4) continue;
    const u0 = umin + r.range(-1.5, 4), u1 = umax - r.range(-1.5, 4), aj = r.range(-0.02, 0.02);
    const dj = [Math.cos(ang + aj), Math.sin(ang + aj)], mid = (u0 + u1) / 2, half = (u1 - u0) / 2;
    const m = [c[0] + d[0] * mid, c[1] + d[1] * mid];
    const A = [m[0] - dj[0] * half, m[1] - dj[1] * half], B = [m[0] + dj[0] * half, m[1] + dj[1] * half];
    segs.push(flip ? [B[0], B[1], A[0], A[1]] : [A[0], A[1], B[0], B[1]]); flip = !flip;
  }
  return segs;
}
function hatch(k, poly, col, a, b, o = {}) {
  const P = W(k, poly), segs = mkHatch(P, o.ang ?? PI / 4, o.gap ?? 9, SEED++);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of P) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  ITEMS.push({ k: 'hatch', segs, col, a, b, w: o.w || 1.5, alpha: o.alpha ?? 0.7, bb: [x0 - 9, y0 - 9, x1 + 9, y1 + 9] });
}
const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
// boks med skraveret slagskygge
function box(k, x, y, w, h, col, a, b, o = {}) {
  const off = o.off ?? 13, sa = o.sa ?? b, sb = o.sb ?? b + 0.9;
  line(k, [[x + 4, y], [x + w, y + 1], [x + w - 1, y + h], [x, y + h - 1], [x + 1, y - 3]], col, 3.2, a, b);
  hatch(k, [[x + w + 4, y + off], [x + w + off, y + off], [x + w + off, y + h + off], [x + w + 4, y + h + off]], col, sa, sa + (sb - sa) * 0.4, { gap: 5.5 });
  hatch(k, [[x + off, y + h + 4], [x + w + 4, y + h + 4], [x + w + 4, y + h + off], [x + off, y + h + off]], col, sa + (sb - sa) * 0.4, sb, { gap: 5.5 });
}
// overstregning af en tekst
function strike(it, a, b, col = 'red') {
  const c = Math.cos(it.rot), s = Math.sin(it.rot), mid = -it.size * 0.32;
  const p = (lx, ly) => [it.lx + lx * c - ly * s, it.ly + lx * s + ly * c];
  const xa = it.x0 - 8, xb = it.x0 + it.w + 8;
  line(it.sec, [p(xa, mid + 3), p((xa + xb) / 2, mid - 2), p(xb, mid + 1), p(xb - 18, mid + 6), p(xa + 6, mid + 4)], col, 3.2, a, b, { wob: 1.4 });
}
// cirkel/oval rundt om en tekst
function ring(it, col, a, b) {
  const cx = it.lx + it.x0 + it.w / 2, cy = it.ly - it.size * 0.32;
  line(it.sec, ell(cx, cy, it.w / 2 + 18, it.size * 0.62, -2.3, -2.3 + TAU * 1.07), col, 2.8, a, b, { wob: 1.6 });
}
// understregning
function under(it, col, a, b) {
  const x0 = it.lx + it.x0 - 4, x1 = it.lx + it.x0 + it.w + 4, y = it.ly + it.size * 0.22;
  line(it.sec, [[x0, y], [(x0 + x1) / 2, y - 2], [x1, y + 1]], col, 3, a, b);
}

// skyggens skravering til boblebogstaver
const BC = {};
function bubbleCache(s, size, col) {
  const key = s + '|' + size + '|' + col;
  if (BC[key]) return BC[key];
  const f = BUB(size); mctx.font = f;
  const w = mctx.measureText(s).width, R = 2, off = size * 0.085, pad = Math.ceil(size * 0.3);
  const cw = Math.ceil(w + pad * 2 + off), ch = Math.ceil(size * 1.55 + off), by = Math.round(size * 1.08);
  const mk = (ang, gap, seed) => {
    const c = H.layer(cw * R, ch * R), g = c.getContext('2d'); g.scale(R, R);
    const r = H.rng(seed), d = [Math.cos(ang), Math.sin(ang)], n = [-d[1], d[0]], L = cw + ch;
    g.strokeStyle = ink(col, 0.75); g.lineWidth = 1.25; g.lineCap = 'round'; g.beginPath();
    for (let q = -L; q < L; q += gap * (0.85 + r() * 0.3)) {
      const cx = cw / 2 + n[0] * q, cy = ch / 2 + n[1] * q, j = r.range(-0.03, 0.03);
      g.moveTo(cx - (d[0] + j) * L, cy - (d[1] - j) * L); g.lineTo(cx + (d[0] - j) * L, cy + (d[1] + j) * L);
    }
    g.stroke();
    g.font = f; g.fillStyle = '#000';
    g.globalCompositeOperation = 'destination-in'; g.fillText(s, pad + off, by + off);
    g.globalCompositeOperation = 'destination-out'; g.fillText(s, pad, by);
    g.lineWidth = size * 0.07; g.strokeText(s, pad, by);
    return c;
  };
  return (BC[key] = { pad, by, cw, ch, h1: mk(PI / 4, 4.2, 11), h2: mk(-PI / 4, 6.5, 12) });
}

// ---------------------------------------------------------------- ligninger
// brøk centreret om cx; y = brøkstregens højde
function frac(k, num, den, cx, y, size, col, a, b, o = {}) {
  const tm = o.tm ?? (a + (b - a) * 0.45);
  const n = text(k, num, cx, y - size * 0.32, size, col, a, tm, { align: 'center' });
  const d = text(k, den, cx, y + size * 1.02, size, col, tm + 0.1, b, { align: 'center' });
  const w = Math.max(n.w, d.w) + 22;
  line(k, [[cx - w / 2, y], [cx + w / 2, y - 1]], col, 2.6, tm - 0.05, tm + 0.12);
  return w;
}
// matrix med skarpe parenteser; rows = [['1,6','-0,6'],...]; (x, y) = øverste venstre hjørne
function matrix(k, rows, x, y, size, col, a, b, o = {}) {
  const cw = o.cw ?? size * 2.1, rh = size * 1.25, nR = rows.length, nC = rows[0].length;
  const w = cw * nC + 16, h = rh * nR + 6, br = 12;
  line(k, [[x + br, y], [x, y + 1], [x + 1, y + h], [x + br, y + h]], col, 2.8, a, a + 0.2);
  line(k, [[x + w - br, y], [x + w, y + 1], [x + w - 1, y + h], [x + w - br, y + h]], col, 2.8, a + 0.15, a + 0.35);
  const n = nR * nC, span = Math.max(0.2, b - a - 0.35);
  rows.forEach((row, i) => row.forEach((s, j) => {
    const u = a + 0.3 + span * (i * nC + j) / n;
    text(k, s, x + 8 + cw * (j + 0.5), y + rh * (i + 0.78), size, (o.colOf && o.colOf(i, j)) || col, u, u + span / n, { align: 'center' });
  }));
  return { w, h };
}

// ---------------------------------------------------------------- kredsløb (lokale koordinater)
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const unit = (p, q) => { const d = sub(q, p), L = Math.hypot(d[0], d[1]); return [d[0] / L, d[1] / L, L]; };
function wire(k, pts, a, b, col = 'blue') { return line(k, pts, col, 3.2, a, b); }
// zigzag-modstand (som i bogen) fra p til q
function resistor(k, p, q, a, b, o = {}) {
  const col = o.col || 'blue', [ux, uy, L] = unit(p, q), nx = -uy, ny = ux, body = o.body ?? 70, s0 = (L - body) / 2;
  const pts = [p, [p[0] + ux * s0, p[1] + uy * s0]];
  for (let i = 1; i <= 6; i++) { const s = s0 + body * (i - 0.5) / 6, sd = i % 2 ? 1 : -1; pts.push([p[0] + ux * s + nx * 13 * sd, p[1] + uy * s + ny * 13 * sd]); }
  pts.push([p[0] + ux * (s0 + body), p[1] + uy * (s0 + body)], q);
  line(k, pts, col, 3.2, a, b);
  if (o.label) { // vandret: side 1 = over, -1 = under; lodret: side 1 = højre, -1 = venstre
    const side = o.side ?? 1, m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], horiz = Math.abs(ux) > 0.5;
    const lx = horiz ? m[0] : m[0] + side * (o.dist ?? 26), ly = horiz ? (side > 0 ? m[1] - 26 : m[1] + 52) : m[1] + 12;
    text(k, o.label, lx + (o.lx || 0), ly + (o.ly || 0), o.size || 34, o.lcol || col, b - 0.05, b + 0.3, { align: horiz ? 'center' : side > 0 ? 'left' : 'right' });
  }
}
// cirkelkilde mellem p og q (lodret eller vandret). type 'I' = strømkilde (pil mod q), 'V' = spændingskilde (+ mod q)
function source(k, p, q, type, a, b, o = {}) {
  const col = o.col || 'blue', [ux, uy, L] = unit(p, q), r = o.r ?? 34, m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const t1 = a + (b - a) * 0.25, t2 = a + (b - a) * 0.7;
  line(k, [p, [m[0] - ux * r, m[1] - uy * r]], col, 3.2, a, t1);
  line(k, ell(m[0], m[1], r, r, Math.atan2(-uy, -ux), Math.atan2(-uy, -ux) + TAU), col, 3.2, t1, t2);
  line(k, [[m[0] + ux * r, m[1] + uy * r], q], col, 3.2, t2, b);
  if (type === 'I') arrow(k, [[m[0] - ux * r * 0.6, m[1] - uy * r * 0.6], [m[0] + ux * r * 0.6, m[1] + uy * r * 0.6]], col, 2.8, t2, b, 11);
  else {
    const pp = [m[0] + ux * r * 0.45, m[1] + uy * r * 0.45], mm = [m[0] - ux * r * 0.45, m[1] - uy * r * 0.45];
    line(k, [[pp[0] - 8, pp[1]], [pp[0] + 8, pp[1]]], col, 2.6, t2, t2 + 0.08); line(k, [[pp[0], pp[1] - 8], [pp[0], pp[1] + 8]], col, 2.6, t2 + 0.08, t2 + 0.16);
    line(k, [[mm[0] - 8, mm[1]], [mm[0] + 8, mm[1]]], col, 2.6, t2 + 0.16, b);
  }
  if (o.label) text(k, o.label, m[0] + (o.lx ?? -r - 12), m[1] + (o.ly ?? 12), o.size || 34, o.lcol || col, b - 0.05, b + 0.3, { align: (o.lx ?? -1) < 0 ? 'right' : 'left' });
}
// kondensator fra p til q (pladerne vinkelret på retningen)
function capacitor(k, p, q, a, b, o = {}) {
  const col = o.col || 'blue', [ux, uy, L] = unit(p, q), nx = -uy, ny = ux, g = o.gap ?? 14, pw = o.plate ?? 30, d = (b - a) / 4;
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], A = [m[0] - ux * g / 2, m[1] - uy * g / 2], Bq = [m[0] + ux * g / 2, m[1] + uy * g / 2];
  line(k, [p, A], col, 3.2, a, a + d);
  line(k, [[A[0] + nx * pw, A[1] + ny * pw], [A[0] - nx * pw, A[1] - ny * pw]], col, 5.5, a + d, a + 2 * d);
  line(k, [[Bq[0] + nx * pw, Bq[1] + ny * pw], [Bq[0] - nx * pw, Bq[1] - ny * pw]], col, 5.5, a + 2 * d, a + 3 * d);
  line(k, [Bq, q], col, 3.2, a + 3 * d, b);
}
// spole (buer) fra p til q
function inductor(k, p, q, a, b, o = {}) {
  const col = o.col || 'blue', [ux, uy, L] = unit(p, q), nx = -uy, ny = ux, n = o.loops ?? 4, body = o.body ?? 90, s0 = (L - body) / 2, r = body / n / 2, pts = [p];
  for (let i = 0; i < n; i++) for (let j = 0; j <= 10; j++) {
    const an = PI - PI * j / 10, s = s0 + r * (2 * i + 1) + r * Math.cos(an), h = r * 1.2 * Math.sin(an);
    pts.push([p[0] + ux * s - nx * h, p[1] + uy * s - ny * h]);
  }
  pts.push(q);
  line(k, pts, col, 3.2, a, b);
}
// motor: cirkel med M mellem p og q
function motorSym(k, p, q, a, b, o = {}) {
  const col = o.col || 'blue', [ux, uy] = unit(p, q), r = o.r ?? 34, m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  line(k, [p, [m[0] - ux * r, m[1] - uy * r]], col, 3.2, a, a + (b - a) * 0.2);
  line(k, ell(m[0], m[1], r, r, -PI / 2, 1.5 * PI), col, 3.2, a + (b - a) * 0.2, a + (b - a) * 0.75);
  line(k, [[m[0] + ux * r, m[1] + uy * r], q], col, 3.2, a + (b - a) * 0.75, b);
  text(k, 'M', m[0], m[1] + r * 0.42, r * 1.1, col, b - 0.1, b + 0.2, { align: 'center' });
}
function ground(k, p, a, col = 'blue') {
  const [x, y] = p;
  line(k, [[x, y], [x, y + 16]], col, 3, a, a + 0.08);
  line(k, [[x - 20, y + 16], [x + 20, y + 16]], col, 3, a + 0.08, a + 0.16);
  line(k, [[x - 12, y + 24], [x + 12, y + 24]], col, 3, a + 0.16, a + 0.22);
  line(k, [[x - 5, y + 32], [x + 5, y + 32]], col, 3, a + 0.22, a + 0.28);
}
const node = (k, p, a, col = 'blue', r = 6.5) => dot(k, p[0], p[1], r, col, a);
// maskestrøm: cirkelpil med uret
function mesh(k, cx, cy, r, label, a, b, col = 'red') {
  const P = ell(cx, cy, r, r * 0.85, -PI * 0.75, PI * 0.95);
  line(k, P, col, 2.6, a, b);
  line(k, head(seg(P, 3), 13, 0.5), col, 2.6, b, b + 0.1);
  text(k, label, cx, cy + 12, 34, col, b - 0.05, b + 0.25, { align: 'center' });
}
// strømpil langs en leder med etiket
function curArrow(k, p, q, label, a, b, o = {}) {
  const col = o.col || 'red';
  arrow(k, [p, q], col, 3, a, b, 13);
  if (label) text(k, label, (p[0] + q[0]) / 2 + (o.lx ?? 0), (p[1] + q[1]) / 2 + (o.ly ?? -14), o.size || 32, col, b - 0.05, b + 0.3, { align: o.align || 'center' });
}
// ---------------------------------------------------------------- mekanik (lokale koordinater)
// bjælke: rektangel fra x0 til x1, overside i y, højde h
function beam(k, x0, y, x1, h, col, a, b) { return line(k, [[x0, y], [x1, y + 1], [x1 - 1, y + h], [x0, y + h - 1], [x0 + 1, y - 2]], col, 3.2, a, b); }
// charnier: trekant med spidsen i (x, y) og skraveret fundament
function pin(k, x, y, a, col = 'black', s = 1) {
  const h = 34 * s, w = 24 * s;
  line(k, [[x, y], [x + w, y + h], [x - w, y + h], [x, y + 1]], col, 3, a, a + 0.35);
  line(k, [[x - w - 12, y + h], [x + w + 12, y + h]], col, 2.6, a + 0.35, a + 0.45);
  hatch(k, rect(x - w - 12, y + h, 2 * w + 24, 12), col, a + 0.45, a + 0.6, { gap: 6 });
}
// rulle: trekant på to små hjul
function roller(k, x, y, a, col = 'black', s = 1) {
  const h = 26 * s, w = 22 * s, r = 6 * s;
  line(k, [[x, y], [x + w, y + h], [x - w, y + h], [x, y + 1]], col, 3, a, a + 0.3);
  for (const dx of [-w * 0.55, w * 0.55]) line(k, ell(x + dx, y + h + r, r, r, -PI / 2, 1.5 * PI), col, 2.4, a + 0.3, a + 0.42);
  line(k, [[x - w - 12, y + h + 2 * r + 1], [x + w + 12, y + h + 2 * r + 1]], col, 2.6, a + 0.42, a + 0.5);
}
// indspænding: lodret væg i x fra y0 til y1; side -1 = skravering til venstre
function wall(k, x, y0, y1, a, col = 'black', side = -1) {
  line(k, [[x, y0], [x, y1]], col, 3.4, a, a + 0.3);
  hatch(k, side < 0 ? rect(x - 20, y0, 20, y1 - y0) : rect(x, y0, 20, y1 - y0), col, a + 0.3, a + 0.5, { gap: 7 });
}
// fordelt last: n pile fra y - h ned til y mellem x0 og x1
function distLoad(k, x0, x1, y, h, col, a, b, n = 8) {
  line(k, [[x0, y - h], [x1, y - h]], col, 2.8, a, a + (b - a) * 0.3);
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * i / (n - 1), t = a + (b - a) * (0.3 + 0.6 * i / n);
    arrow(k, [[x, y - h], [x, y - 3]], col, 2.4, t, t + (b - a) * 0.1, 11);
  }
}
// momentpil: bue om (cx, cy) fra vinkel a0 til a1 (radianer, skærmkoordinater: positiv = med uret); pilen sidder i a1
function moment(k, cx, cy, r, a0, a1, col, a, b) {
  const P = ell(cx, cy, r, r, a0, a1);
  line(k, P, col, 3.2, a, b);
  line(k, head(seg(P, 3), 15, 0.5), col, 3.2, b, b + 0.1);
}
// akser til en graf med origo i (x0, y0); x-akse til x1, y-akse op til y1 (eller ned, hvis y1 > y0)
function axes(k, x0, y0, x1, y1, xl, yl, a, col = 'black') {
  arrow(k, [[x0 - 10, y0], [x1, y0]], col, 2.6, a, a + 0.5, 15);
  arrow(k, [[x0, y0 + (y1 < y0 ? 12 : -12)], [x0, y1]], col, 2.6, a + 0.2, a + 0.7, 15);
  if (xl) text(k, xl, x1 + 8, y0 + 12, 34, col, a + 0.5, a + 0.8);
  if (yl) text(k, yl, x0 - 14, y1 + (y1 < y0 ? 6 : 30), 34, col, a + 0.7, a + 1.0, { align: 'right' });
}
// graf/kurve gennem punkter (mindre rysten end en almindelig streg)
function plot(k, pts, col, a, b, w = 3.6) { return line(k, pts, col, w, a, b, { wob: 0.35 }); }
// stiplet linje (fx hjælpelinjer i grafer)
function dashed(k, p, q, col, a, b, d = 14) {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = Math.max(1, Math.floor(L / (2 * d)));
  for (let i = 0; i < n; i++) {
    const u0 = (2 * i) / (2 * n), u1 = (2 * i + 1) / (2 * n), t = a + (b - a) * i / n;
    line(k, [[p[0] + (q[0] - p[0]) * u0, p[1] + (q[1] - p[1]) * u0], [p[0] + (q[0] - p[0]) * u1, p[1] + (q[1] - p[1]) * u1]], col, 2, t, t + (b - a) / n, { wob: 0.2, alpha: 0.75 });
  }
}

// ladningsprikker, der løber langs en polyline (prikker pr. sekund ~ strøm)
function flow(k, pts, a, b, o = {}) {
  const S = mkStroke(W(k, pts), 1, SEED++, 0);
  DYN.push({ k: 'flow', S, a, b, rate: o.rate ?? 2, col: o.col || 'red', gap: o.gap ?? 34, r: o.r ?? 4.5 });
}
// tænke-ur: urskive tegnes, viseren går én omgang på pausen
function clock(k, x, y, a, b) {
  const p = W(k, [[x, y]])[0];
  line(k, ell(x, y, 30, 30, -PI / 2, 1.5 * PI), 'blue', 2.6, a - 0.3, a);
  DYN.push({ k: 'clock', x: p[0], y: p[1], a, b });
}

// ---------------------------------------------------------------- kamera
// BP.view(t, k, [dx, dy, z]): kameraet står på sektion k fra tid t
const camKey = (t, k, o = []) => CAM.push([t, 640 + (o[0] || 0), 360 + SEC * k + (o[1] || 0), o[2] || 1]);
// flyt til sektion k omkring replikkens start (bevægelsen ligger i talepausen og første ord).
// id kan også være et tidspunkt i sekunder (flyt midt i en replik).
function goto(id, k, o = [], dur = 0.9) {
  const t = typeof id === 'number' ? id : BP.L(id).start, last = CAM[CAM.length - 1];
  const t0 = Math.max(last ? last[0] + 0.05 : 0, t - dur * 0.55);
  if (last) CAM.push([t0, last[1], last[2], last[3]]);
  camKey(t0 + dur, k, o);
  DOODLES.push({ k, t0: t0 + dur });
}

// ---------------------------------------------------------------- kort (titel, se først, tjek, slut)
function titel(k, title, subtitle, id) {
  const L = BP.L(id);
  bubble(k, title, 640, 330, title.length > 20 ? 66 : 80, 'blue', L.start, L.start + 1.4, { align: 'center', rot: -0.012 });
  text(k, subtitle, 640, 410, 36, 'black', L.start + 1.0, L.start + 1.8, { align: 'center' });
}
// "Se først"-notat: items = ['Ohms lov', ...]
function seFoerst(k, items, id, x = 760, y = 540) {
  const L = BP.L(id), t = L.start;
  const h = text(k, 'Se først:', x, y, 36, 'red', t, t + 0.5);
  items.forEach((s, i) => text(k, '→ ' + s, x + 20, y + 46 * (i + 1), 34, 'red', t + 0.5 + i * 0.4, t + 0.9 + i * 0.4));
  under(h, 'red', t + 0.45, t + 0.6);
}
// tjek: spørgsmål skrives under replik qId, tænke-ur på pausen, svaret skrives under replik aId
function tjek(k, sporg, svar, qId, aId, o = {}) {
  const q = BP.L(qId), s = BP.L(aId);
  const h = bubble(k, 'Tjek dig selv', 200, 120, 58, 'green', q.start - 0.1, q.start + 1.0);
  const lines = Array.isArray(sporg) ? sporg : [sporg];
  lines.forEach((sp, i) => text(k, sp, 200, 220 + i * 56, 42, 'blue', q.start + 0.9 + i * 0.6, Math.min(q.end, q.start + 2.4 + i * 0.8)));
  clock(k, 1110, 300, q.end + 0.1, s.start - 0.1);
  text(k, 'pause og tænk', 1110, 375, 32, 'blue', q.end + 0.1, q.end + 0.8, { align: 'center' });
  const sl = Array.isArray(svar) ? svar : [svar];
  const y0 = 220 + lines.length * 56 + 60;
  sl.forEach((sv, i) => text(k, sv, 200, y0 + i * 56, 42, 'green', s.start + 0.2 + i * 0.7, Math.min(s.end, s.start + 1.6 + i * 0.9)));
  return h;
}
function slut(k, kilde, naeste, id) {
  const L = BP.L(id), t = L.start;
  bubble(k, 'Kort sagt', 200, 140, 64, 'blue', t - 0.1, t + 0.9);
  kilde.split(' · ').forEach((kl, i) => text(k, (i ? '' : 'Kilde: ') + kl, i ? 290 : 200, 640 + i * 40, 30, 'black', t + 0.4 + i * 0.6, t + 1.2 + i * 0.6));
  if (naeste) {
    const tn = /næste/i.test(L.text) ? BP.wt(id, 'næste') - 0.15 : L.start + (L.end - L.start) * 0.6;
    const n = text(k, 'Næste: ' + naeste, 200, 570, 38, 'red', tn, tn + 1.1);
    under(n, 'red', tn + 1.05, tn + 1.25);
  }
}

Object.assign(BP, { line, arrow, dot, text, bubble, hatch, box, rect, strike, ring, under, endX, startX, frac, matrix, capacitor, inductor, motorSym,
  wire, resistor, source, ground, node, mesh, curArrow, flow, clock, goto, titel, seFoerst, tjek, slut, ink,
  beam, pin, roller, wall, distLoad, moment, axes, plot, dashed });

// ---------------------------------------------------------------- rendering
function drawStroke(ctx, S, p1, p0 = 0) {
  const n = S.P.length; if (n < 2) return;
  const i0 = Math.floor(p0 * (n - 1)), i1 = Math.max(i0 + 1, Math.round(p1 * (n - 1)));
  ctx.beginPath();
  for (let i = i0; i <= i1; i++) { const w = S.Wd[i] / 2; ctx.lineTo(S.P[i][0] + S.N[i][0] * w, S.P[i][1] + S.N[i][1] * w); }
  for (let i = i1; i >= i0; i--) { const w = S.Wd[i] / 2; ctx.lineTo(S.P[i][0] - S.N[i][0] * w, S.P[i][1] - S.N[i][1] * w); }
  ctx.closePath(); ctx.fill();
  if (p0 === 0) { ctx.beginPath(); ctx.arc(S.P[0][0], S.P[0][1], S.Wd[0] * 0.62 + 0.5, 0, TAU); ctx.fill(); }
  for (const g of S.gl) if (g >= i0 && g <= i1) { ctx.beginPath(); ctx.arc(S.P[g][0], S.P[g][1], S.Wd[g] * 0.55, 0, TAU); ctx.fill(); }
}
function drawHatch(ctx, it, prog) {
  const n = it.segs.length, kk = prog * n, full = Math.floor(kk);
  ctx.strokeStyle = ink(it.col, it.alpha); ctx.lineWidth = it.w; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < Math.min(n, full + 1); i++) {
    const [x0, y0, x1, y1] = it.segs[i], f = i < full ? 1 : kk - full;
    ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f);
  }
  ctx.stroke();
}
function drawRuns(ctx, runs, x, y, size) {
  for (const r of runs) {
    const s = r.m ? size * 0.62 : size, dy = r.m === 1 ? size * 0.2 : r.m === 2 ? -size * 0.42 : 0;
    ctx.font = HAND(s); ctx.fillText(r.t, x, y + dy); x += ctx.measureText(r.t).width;
  }
}
function drawText(ctx, it, t) {
  const p = win(t, it.a, it.b);
  ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
  if (it.font === 'hand') {
    ctx.beginPath(); ctx.rect(it.x0 - 14, -it.size * 1.4, (it.w + 28) * p + 2, it.size * 2.2); ctx.clip();
    ctx.fillStyle = ink(it.col, 0.92); drawRuns(ctx, it.runs, it.x0, 0, it.size);
    if (it.bold) { drawRuns(ctx, it.runs, it.x0 + 1.3, 0.4, it.size); drawRuns(ctx, it.runs, it.x0 + 0.5, -0.9, it.size); }
  } else {
    const c = it.cache, u1 = win(p, 0, 0.62), u2 = win(p, 0.5, 1), u3 = win(t, it.b, it.b + 0.7);
    const img = (im, u) => { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(it.x0 - c.pad, -c.by, c.cw * u, c.ch); ctx.clip(); ctx.drawImage(im, it.x0 - c.pad, -c.by, c.cw, c.ch); ctx.restore(); };
    img(c.h1, u2); img(c.h2, u3);
    ctx.beginPath(); ctx.rect(it.x0 - 10, -it.size * 1.4, (it.w + 20) * u1 + 1, it.size * 2.2); ctx.clip();
    ctx.font = BUB(it.size); ctx.lineJoin = 'round';
    ctx.strokeStyle = ink(it.col, 0.95); ctx.lineWidth = Math.max(2.2, it.size * 0.04); ctx.strokeText(it.s, it.x0, 0);
    ctx.strokeStyle = ink(it.col, 0.35); ctx.lineWidth *= 0.6; ctx.strokeText(it.s, it.x0 + 0.9, 0.7);
  }
  ctx.restore();
}
let FIBRE = null;
function fibre() {
  if (FIBRE) return FIBRE;
  const S = 512, c = H.layer(S, S), g = c.getContext('2d'), nz = H.makeNoise(3);
  for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) {
    const v = nz.fbm2(x * 0.02, y * 0.02, 3) * 0.5 + nz.n2(x * 0.35, y * 0.09) * 0.5;
    g.fillStyle = v > 0 ? `rgba(255,255,250,${v * 0.16})` : `rgba(120,98,60,${-v * 0.07})`;
    g.fillRect(x, y, 2, 2);
  }
  return (FIBRE = c);
}
// margin-doodles (blå kuglepen, spores igen og igen)
const SHAPES = [
  () => { const o = []; for (let a = 0; a <= 5 * PI; a += 0.15) { const r = 2 + 1.9 * a; o.push([Math.cos(a) * r, Math.sin(a) * r]); } return [o]; },
  () => { const o = []; for (let i = 0; i <= 10; i++) { const r = i % 2 ? 12 : 30, a = -PI / 2 + i * PI / 5; o.push([Math.cos(a) * r, Math.sin(a) * r]); } return [o]; },
  () => [[[10, -32], [-10, 3], [5, 3], [-10, 32], [14, -6], [-1, -6], [12, -32], [10, -32]]],
  () => [[[-22, -8], [8, -8], [8, 22], [-22, 22], [-22, -8]], [[-12, -18], [18, -18], [18, 12], [8, 22]], [[-22, -8], [-12, -18]], [[8, -8], [18, -18]]],
  () => [[[-32, 0], [-20, 0], [-15, -12], [-5, 12], [5, -12], [15, 12], [20, 0], [32, 0]]],
  () => { const o = []; for (let x = -32; x <= 32; x += 2) o.push([x, -14 * Math.sin(x / 32 * TAU)]); return [o]; },
];
function buildDoodles() {
  const seen = new Set(), list = [];
  for (const d of DOODLES) if (!seen.has(d.k)) { seen.add(d.k); list.push(d); }
  return list.map((d, di) => {
    const y = SEC * d.k + 150 + (di % 3) * 170, kind = SHAPES[(d.k * 2 + 1) % SHAPES.length], passes = [];
    for (let p = 0; p < 5; p++) {
      const r = H.rng(500 + di * 10 + p), ox = r.range(-1.6, 1.6), oy = r.range(-1.6, 1.6);
      const polys = kind().map((pl) => mkStroke(pl.map(([a, b]) => [58 + a + ox, y + b + oy]), 1.7, 600 + di * 10 + p, 1.1));
      passes.push({ polys, a: d.t0 + 0.4 + p * 2.6, b: d.t0 + 1.5 + p * 2.6 });
    }
    return { y, passes };
  });
}
let DOOD = [];

function explainer(ctx, Wd, Hd, t) {
  const [cx, cy, z] = camAt(CAM, t);
  const vx0 = cx - Wd / 2 / z, vy0 = cy - Hd / 2 / z, vx1 = cx + Wd / 2 / z, vy1 = cy + Hd / 2 / z;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.fillStyle = '#f6f3ea'; ctx.fillRect(0, 0, Wd, Hd);
  ctx.setTransform(z, 0, 0, z, Wd / 2 - cx * z, Hd / 2 - cy * z);
  ctx.fillStyle = ctx.createPattern(fibre(), 'repeat'); ctx.fillRect(vx0, vy0, vx1 - vx0, vy1 - vy0);
  ctx.lineWidth = 1.7;
  for (let y = Math.ceil(vy0 / 40) * 40; y < vy1; y += 40) { ctx.strokeStyle = `rgba(108,150,206,${0.5 + 0.08 * Math.sin(y * 0.37)})`; ctx.beginPath(); ctx.moveTo(vx0, y); ctx.lineTo(vx1, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(214,92,96,0.72)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(110, vy0); ctx.lineTo(110, vy1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(116, vy0); ctx.lineTo(116, vy1); ctx.stroke();

  ctx.globalCompositeOperation = 'multiply';
  const vis = (bb) => bb[2] > vx0 && bb[0] < vx1 && bb[3] > vy0 && bb[1] < vy1;
  for (const d of DOOD) {
    if (d.y < vy0 - 60 || d.y > vy1 + 60) continue;
    for (const ps of d.passes) {
      if (t < ps.a) break;
      ctx.fillStyle = ink('blue', 0.55);
      const p = win(t, ps.a, ps.b), m = ps.polys.length;
      ps.polys.forEach((S, i) => { const u = clamp(p * m - i); if (u > 0) drawStroke(ctx, S, u); });
    }
  }
  for (const it of ITEMS) {
    if (t < it.a || !vis(it.bb)) continue;
    if (it.k === 'line') { ctx.fillStyle = ink(it.col, it.alpha); drawStroke(ctx, it.S, win(t, it.a, it.b)); }
    else if (it.k === 'text') drawText(ctx, it, t);
    else if (it.k === 'hatch') drawHatch(ctx, it, win(t, it.a, it.b));
    else if (it.k === 'dot') { ctx.fillStyle = ink(it.col); ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, TAU); ctx.fill(); }
  }
  for (const d of DYN) {
    if (t < d.a || t >= d.b) continue;
    if (d.k === 'flow') {
      const S = d.S, off = ((t - d.a) * d.rate * d.gap) % d.gap, fade = Math.min(1, (t - d.a) / 0.3, (d.b - t) / 0.3);
      ctx.fillStyle = ink(d.col, 0.85 * fade);
      let i = 0;
      for (let s = off; s < S.L; s += d.gap) {
        while (i < S.len.length - 1 && S.len[i + 1] < s) i++;
        const u = (s - S.len[i]) / Math.max(1e-6, (S.len[i + 1] ?? S.len[i]) - S.len[i]), P0 = S.P[i], P1 = S.P[Math.min(i + 1, S.P.length - 1)];
        ctx.beginPath(); ctx.arc(P0[0] + (P1[0] - P0[0]) * u, P0[1] + (P1[1] - P0[1]) * u, d.r, 0, TAU); ctx.fill();
      }
    } else if (d.k === 'clock') {
      const u = win(t, d.a, d.b), an = -PI / 2 + u * TAU;
      ctx.strokeStyle = ink('red', 0.9); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + Math.cos(an) * 22, d.y + Math.sin(an) * 22); ctx.stroke();
      ctx.fillStyle = ink('red', 0.18); ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.arc(d.x, d.y, 26, -PI / 2, an); ctx.closePath(); ctx.fill();
    }
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (HEADER) {
    const hp = win(t, 0.2, 1.4);
    ctx.save(); ctx.font = HAND(30); const w = ctx.measureText(HEADER).width;
    ctx.beginPath(); ctx.rect(Wd - 34 - w - 4, 0, (w + 10) * hp, 80); ctx.clip();
    ctx.fillStyle = ink('blue', 0.85); ctx.fillText(HEADER, Wd - 34 - w, 50); ctx.restore();
  }
  const OPT = BP.OPT;
  if (OPT.finish === 'baked') finishBaked(ctx, Wd, Hd);
  else {
    if (OPT.vig) { ctx.globalCompositeOperation = 'multiply'; H.vignette(ctx, Wd, Hd, 0.16, '120,100,70'); ctx.globalCompositeOperation = 'source-over'; }
    if (OPT.grain) grainFast(ctx, Wd, Hd);
  }
}
// Kvalitet: BP.OPT.finish = 'full' (vignet + to kornlag; bruges til mp4) eller 'baked' (vignet og mørkt korn bagt i ét
// multiply-lag, som tegnes med én operation; bruges af webafspilleren på svage enheder).
BP.OPT = { finish: 'full', vig: true, grain: true };
let BAKED = null;
function finishBaked(ctx, Wd, Hd) {
  if (!BAKED) {
    BAKED = H.layer(Wd, Hd); const g = BAKED.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, Wd, Hd);
    H.vignette(g, Wd, Hd, 0.16, '120,100,70');
    const im = g.getImageData(0, 0, Wd, Hd), d = im.data, r = H.rng(7), k = 0.03 * 255;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * k, f = n < 0 ? (255 + n) / 255 : 1; d[i] *= f; d[i + 1] *= f; d[i + 2] *= f; }
    g.putImageData(im, 0, 0);
  }
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(BAKED, 0, 0); ctx.restore();
}
// Korn: samme udtryk som H.grain(ctx, W, H, 0.03, 7), men beregnet én gang som to lag (lyse korn lægges til med
// 'lighter', mørke trækkes fra med 'multiply'). H.grain kostede ~19 ms pr. frame; dette koster under 1 ms.
let GRAIN = null;
function grainFast(ctx, Wd, Hd) {
  if (!GRAIN) {
    const plus = H.layer(Wd, Hd), minus = H.layer(Wd, Hd), gp = plus.getContext('2d'), gm = minus.getContext('2d');
    const ip = gp.createImageData(Wd, Hd), im = gm.createImageData(Wd, Hd), r = H.rng(7), k = 0.03 * 255;
    for (let i = 0; i < ip.data.length; i += 4) {
      const n = (r() - 0.5) * k;
      ip.data[i] = ip.data[i + 1] = ip.data[i + 2] = n > 0 ? n : 0; ip.data[i + 3] = 255;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = n < 0 ? 255 + n : 255; im.data[i + 3] = 255;
    }
    gp.putImageData(ip, 0, 0); gm.putImageData(im, 0, 0); GRAIN = { plus, minus };
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(GRAIN.plus, 0, 0);
  ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(GRAIN.minus, 0, 0); ctx.restore();
}

// ---------------------------------------------------------------- afspiller
let BUILD = null;
BP.scene = (opts, fn) => { HEADER = opts.header || ''; BUILD = fn; };
// Forbered scenen på et lærred: returnerer { render(t), DURATION, ready }. Bruges af BP.start (byg/render) og af
// webafspilleren (afspiller.js, BP.live), som tegner videoen live i browseren synkront med lyden.
BP.prepare = function (vo, cv) {
  VO = vo;
  const ctx = cv.getContext('2d'), DURATION = VO.duration;
  const render = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); explainer(ctx, 1280, 720, clamp(t, 0, DURATION)); };
  const ready = (async () => {
    try { await Promise.all([BUB(80), HAND(40)].map((f) => document.fonts.load(f, 'AaÆØÅæøå09µΩ,'))); await document.fonts.ready; } catch (e) { /* tegn alligevel */ }
    camKey(0, 0);
    BUILD(BP);
    CAM.sort((a, b) => a[0] - b[0]);
    DOODLES.unshift({ k: 0, t0: 0 });
    DOOD = buildDoodles();
    render(0);
    return true;
  })();
  return { render, DURATION, ready };
};
BP.start = function (vo) {
  const P = BP.prepare(vo, document.getElementById('cv')), render = P.render, DURATION = P.DURATION;
  window.seek = render; window.DURATION = DURATION;

  const $ = (id) => document.getElementById(id);
  let playing = false, clock0 = 0, t0 = 0, curT = 0, audio = null;
  const fmt = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
  const nowT = () => (audio ? audio.currentTime : playing ? t0 + (performance.now() - clock0) / 1000 : curT);
  const play = () => { if (playing) return; playing = true; $('play').textContent = '❚❚ Pause'; if (curT >= DURATION - 0.05) seekTo(0); if (audio) { audio.currentTime = curT; audio.play(); } else { t0 = curT; clock0 = performance.now(); } };
  const pause = () => { if (!playing) return; playing = false; $('play').textContent = '▶ Afspil'; curT = nowT(); if (audio) audio.pause(); };
  const seekTo = (t) => { curT = clamp(t, 0, DURATION); if (audio) audio.currentTime = curT; t0 = curT; clock0 = performance.now(); render(curT); };
  const tick = () => {
    if (playing) { curT = nowT(); if (curT >= DURATION) { if ($('loop').checked) seekTo(0); else { curT = DURATION; pause(); } } render(curT); }
    $('scrub').value = Math.round(curT / DURATION * 1000); $('time').textContent = fmt(curT);
    requestAnimationFrame(tick);
  };
  $('play').onclick = () => (playing ? pause() : play());
  $('scrub').oninput = (e) => seekTo(e.target.value / 1000 * DURATION);
  const useAudio = (src, name) => { const a = new Audio(); a.preload = 'auto'; a.src = src; a.addEventListener('loadedmetadata', () => { pause(); audio = a; $('voname').textContent = name; seekTo(curT); }, { once: true }); };
  $('vo').onchange = (e) => { const f = e.target.files[0]; if (f) useAudio(URL.createObjectURL(f), f.name); };
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => { e.preventDefault(); const f = [...e.dataTransfer.files].find((x) => x.type.startsWith('audio')); if (f) useAudio(URL.createObjectURL(f), f.name); });
  addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); } });

  window.READY = P.ready.then(() => { useAudio(VO.audio, VO.audio); requestAnimationFrame(tick); return true; });
};
})();
