// motor_keynote.js: "Product Launch Reveal"-motor (big-tech keynote-film) til undervisningsvideoer. Kun stemme, ingen lyd.
// Samme pipeline som motor.js (Ballpoint): manus.json + scene.js -> video.py. Alt er en ren funktion af t.
//
// Opbygning: videoen er en række "shots" (B.shot). Hvert shot har sine egne lokale koordinater 0..1280 x 0..720,
// et langsomt kamera-push og krydsfade til næste shot. Slutkortet åbnes med en lyssweep til en hvid scene.
// Titelshottet har hero-objektet: en blank glasplade (fra referencens product-launch.js) med et lysende symbol.
(function () {
'use strict';
const PI = Math.PI, TAU = 2 * PI;
const BP = (window.BP = {});

// ---------------------------------------------------------------- tid (som motor.js)
let VO = null;
const norm = (s) => s.toLowerCase().replace(/[.,:;?!»«"]+$/, '').replace(/^[»«"(]+/, '');
BP.L = (id) => { const l = VO.lines[id]; if (!l) throw new Error('replik mangler: ' + id); return l; };
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

// ---------------------------------------------------------------- hjælpere
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const win = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
const io = (x) => H.ease.inOut(clamp(x));
const eo = (x) => H.ease.out(clamp(x));
const seg = (pts, step = 3) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let j = 0; j < n; j++) out.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]);
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const arc = (cx, cy, rx, ry, a0, a1) => { const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / 4)), o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
Object.assign(BP, { clamp, win, io, eo, seg, arc, PI, TAU });

// Palet fra referencen
const GV = ['#b69cff', '#e879f9', '#ff9a4d'];   // violet -> orange (nøgletal)
const GT = ['#5eead4', '#38bdf8', '#6d7cff'];   // teal -> blå
const GG = ['#7cf0b8', '#2dd4bf'];               // grøn -> teal (rigtigt / kontrol)
const RED = '#ff453a';
const PAL = { ink: '#f5f5f7', grey: '#a1a1a6', dim: '#6e6e73', red: RED, line: '#d9dbe4', blue: '#64b5ff', violet: '#b69cff', orange: '#ff9a4d', teal: '#5eead4', green: '#7cf0b8' };
const PAL_W = { ink: '#1d1d1f', grey: '#515154', dim: '#86868b', red: '#d70015', line: '#3a3a40', blue: '#0071e3', violet: '#7a4dff', orange: '#e2610b', teal: '#0f9f8f', green: '#1a9b5b' };
const GRAD = { gv: GV, gt: GT, gg: GG };
const INTER = (w, s) => `${w} ${s}px Inter, 'Segoe UI', sans-serif`;
const mctx = H.layer(8, 8).getContext('2d');

// ---------------------------------------------------------------- scenegraf
const SHOTS = [], ITEMS = [], DYN = [];
let HEADER = '';
// nyt shot fra replikkens start (eller et tidspunkt). opts: { push: [s0, s1], white, hero }
function shot(id, opts = {}) {
  const t0 = typeof id === 'number' ? id : Math.max(0, BP.L(id).start - 0.15);
  SHOTS.push({ t0, t1: 1e9, push: opts.push || [1.0, 1.045], drift: opts.drift ?? (SHOTS.length % 2 ? -12 : 12), white: !!opts.white });
  if (SHOTS.length > 1) SHOTS[SHOTS.length - 2].t1 = t0;
  return SHOTS.length - 1;
}
function shotAlpha(s, t) {
  const fin = s.white ? 1 : win(t, s.t0 - 0.3, s.t0 + 0.25);
  const nxt = SHOTS[SHOTS.indexOf(s) + 1];
  const fout = !nxt ? 1 : nxt.white ? (t < nxt.t0 + 0.75 ? 1 : 0) : 1 - win(t, s.t1 - 0.3, s.t1 + 0.2);
  return Math.min(fin, fout);
}
const col = (s, c, a = 1) => H.rgba((s && s.white ? PAL_W : PAL)[c] || c, a);

function runsOf(s) {
  const out = []; let i = 0, cur = '';
  const push = (t, m) => { if (t) out.push({ t, m }); };
  while (i < s.length) {
    const c = s[i], prevLetter = i > 0 && /[A-Za-zÆØÅæøåΔωθαβπ)]/.test(s[i - 1]);
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
function measure(runs, w, size, track) {
  let x = 0;
  for (const r of runs) { const s = r.m ? size * 0.62 : size; mctx.font = INTER(w, s); mctx.letterSpacing = `${track * s}px`; x += mctx.measureText(r.t).width; }
  return x;
}
// tekst. o: { w (vægt), col, grad, align, reveal: 'fade'|'words'|'type', glow, track }
function text(k, s, x, y, size, a, b, o = {}) {
  const w = o.w ?? (size >= 44 ? 800 : 600), track = o.track ?? (size >= 44 ? -0.025 : 0);
  const it = { k: 'text', shot: k, s, x, y, size, a, b, w, track, col: o.col || 'ink', grad: o.grad, align: o.align || 'left',
    reveal: o.reveal || (size >= 52 ? 'words' : 'fade'), glow: o.glow, runs: runsOf(s) };
  it.wid = measure(it.runs, w, size, track);
  it.x0 = it.align === 'center' ? -it.wid / 2 : it.align === 'right' ? -it.wid : 0;
  if (it.reveal === 'words') {
    const words = s.split(' '); let acc = '';
    it.words = words.map((wd) => { const off = measure(runsOf(acc), w, size, track); acc += wd + ' '; return { s: wd, off, runs: runsOf(wd) }; });
  }
  ITEMS.push(it); return it;
}
// stort nøgletal i gradient med glød og et glimt
const num = (k, s, x, y, size, a, b, o = {}) => text(k, s, x, y, size, a, b, { w: 800, grad: o.grad || 'gv', glow: true, reveal: 'fade', track: -0.03, ...o, gleam: true });
const endX = (it, gap = 0) => it.x + it.x0 + it.wid + gap;
// tynd linje. o: { col, w, glow, head (pilespids), dash, grad }
function line(k, pts, a, b, o = {}) {
  const P = seg(pts, 3), len = [0];
  for (let i = 1; i < P.length; i++) len.push(len[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const it = { k: 'line', shot: k, P, len, L: len[len.length - 1], a, b, col: o.col || 'line', w: o.w ?? 2.4, glow: o.glow ?? 0.5, head: o.head, dash: o.dash, grad: o.grad };
  ITEMS.push(it); return it;
}
const arrow = (k, pts, a, b, o = {}) => line(k, pts, a, b, { ...o, head: o.head ?? 16 });
function dot(k, x, y, r, a, o = {}) { const it = { k: 'dot', shot: k, x, y, r, a, b: a + 0.25, col: o.col || 'ink', glow: o.glow ?? 1 }; ITEMS.push(it); return it; }
function poly(k, pts, a, b, o = {}) { const it = { k: 'poly', shot: k, pts, a, b, col: o.col || 'violet', alpha: o.alpha ?? 0.18, grad: o.grad }; ITEMS.push(it); return it; }
// hairline-callout: prik ved p, linje (med knæk) ud til q, etiket ved q
function callout(k, p, q, label, a, b, o = {}) {
  dot(k, p[0], p[1], 4.5, a, { col: o.col || 'ink' });
  const knee = o.knee ?? [q[0] + (q[0] > p[0] ? -40 : 40), q[1]];
  line(k, [p, knee, q], a + 0.05, b - 0.15, { col: o.lcol || 'grey', w: 1.4, glow: 0.2 });
  return text(k, label, q[0] + (q[0] > p[0] ? 12 : -12), q[1] + (o.size || 30) * 0.35, o.size || 30, b - 0.2, b + 0.2,
    { col: o.col || 'ink', align: q[0] > p[0] ? 'left' : 'right', w: 600, reveal: 'fade' });
}
// ren rød overstregning af en tekst
function strike(it, a, b) {
  const y = it.y - it.size * 0.33;
  return line(it.shot, [[it.x + it.x0 - 10, y], [it.x + it.x0 + it.wid + 10, y]], a, b, { col: 'red', w: 4, glow: 0.8 });
}
// afrundet ramme (fx om et resultat)
function frame(k, x, y, w, h, a, b, o = {}) {
  const r = 18, P = [];
  const c = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const an = a0 + i * PI / 12; P.push([cx + Math.cos(an) * r, cy + Math.sin(an) * r]); } };
  c(x + w - r, y + r, -PI / 2); c(x + w - r, y + h - r, 0); c(x + r, y + h - r, PI / 2); c(x + r, y + r, PI); P.push(P[0]);
  return line(k, P, a, b, { col: o.col || 'violet', w: 2, glow: 1, grad: o.grad || 'gv' });
}

// ---------------------------------------------------------------- symboler (tynde, lysende linjer)
const unit = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return [dx / L, dy / L, L]; };
const wire = (k, pts, a, b, o = {}) => line(k, pts, a, b, o);
function resistor(k, p, q, a, b, o = {}) {
  const [ux, uy, L] = unit(p, q), nx = -uy, ny = ux, body = o.body ?? 80, s0 = (L - body) / 2, pts = [p, [p[0] + ux * s0, p[1] + uy * s0]];
  for (let i = 1; i <= 6; i++) { const s = s0 + body * (i - 0.5) / 6, sd = i % 2 ? 1 : -1; pts.push([p[0] + ux * s + nx * 12 * sd, p[1] + uy * s + ny * 12 * sd]); }
  pts.push([p[0] + ux * (s0 + body), p[1] + uy * (s0 + body)], q);
  return line(k, pts, a, b, o);
}
function capacitor(k, p, q, a, b, o = {}) {
  const [ux, uy, L] = unit(p, q), nx = -uy, ny = ux, g = o.gap ?? 14, pw = o.plate ?? 36, m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const A = [m[0] - ux * g / 2, m[1] - uy * g / 2], Bq = [m[0] + ux * g / 2, m[1] + uy * g / 2], d = (b - a) / 4;
  line(k, [p, A], a, a + d, o);
  line(k, [[A[0] + nx * pw, A[1] + ny * pw], [A[0] - nx * pw, A[1] - ny * pw]], a + d, a + 2 * d, { ...o, w: (o.w ?? 2.4) * 1.8 });
  line(k, [[Bq[0] + nx * pw, Bq[1] + ny * pw], [Bq[0] - nx * pw, Bq[1] - ny * pw]], a + 2 * d, a + 3 * d, { ...o, w: (o.w ?? 2.4) * 1.8 });
  line(k, [Bq, q], a + 3 * d, b, o);
}
function inductor(k, p, q, a, b, o = {}) {
  const [ux, uy, L] = unit(p, q), nx = -uy, ny = ux, n = o.loops ?? 4, body = o.body ?? 100, s0 = (L - body) / 2, r = body / n / 2, pts = [p];
  for (let i = 0; i < n; i++) for (let j = 0; j <= 10; j++) {
    const an = PI - PI * j / 10, s = s0 + r * (2 * i + 1) + r * Math.cos(an), h = r * 1.15 * Math.sin(an);
    pts.push([p[0] + ux * s - nx * h * (o.side ?? 1), p[1] + uy * s - ny * h * (o.side ?? 1)]);
  }
  pts.push(q);
  return line(k, pts, a, b, o);
}
function source(k, p, q, type, a, b, o = {}) {
  const [ux, uy, L] = unit(p, q), r = o.r ?? 30, m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = (b - a) / 4;
  line(k, [p, [m[0] - ux * r, m[1] - uy * r]], a, a + d, o);
  line(k, arc(m[0], m[1], r, r, Math.atan2(-uy, -ux), Math.atan2(-uy, -ux) + TAU), a + d, a + 2.5 * d, o);
  line(k, [[m[0] + ux * r, m[1] + uy * r], q], a + 2.5 * d, a + 3 * d, o);
  if (type === 'I') arrow(k, [[m[0] - ux * r * 0.55, m[1] - uy * r * 0.55], [m[0] + ux * r * 0.55, m[1] + uy * r * 0.55]], a + 3 * d, b, { ...o, head: 9 });
  else { text(k, '+', m[0] + ux * r * 0.45, m[1] + uy * r * 0.45 + 9, 26, a + 3 * d, b, { align: 'center', col: o.col || 'line' }); text(k, '−', m[0] - ux * r * 0.45, m[1] - uy * r * 0.45 + 9, 26, a + 3 * d, b, { align: 'center', col: o.col || 'line' }); }
}
function ground(k, p, a, o = {}) { const [x, y] = p; line(k, [[x, y], [x, y + 16]], a, a + 0.1, o); line(k, [[x - 20, y + 16], [x + 20, y + 16]], a + 0.1, a + 0.2, o); line(k, [[x - 12, y + 24], [x + 12, y + 24]], a + 0.2, a + 0.28, o); line(k, [[x - 5, y + 32], [x + 5, y + 32]], a + 0.28, a + 0.35, o); }

// kompleks plan / akser: returnerer P(re, im) -> skærmpunkt. o: { xr: [min,max], yr: [min,max], labels: [x,y] }
function axes(k, x0, y0, w, h, a, o = {}) {
  const [xa, xb] = o.xr || [-1, 1], [ya, yb] = o.yr || [-1, 1];
  const P = (u, v) => [x0 + (u - xa) / (xb - xa) * w, y0 + h - (v - ya) / (yb - ya) * h];
  const O = P(Math.max(xa, Math.min(xb, 0)), Math.max(ya, Math.min(yb, 0)));
  if (o.grid) {
    for (let u = Math.ceil(xa); u <= xb; u++) if (u) line(k, [P(u, ya), P(u, yb)], a + 0.1, a + 0.5, { col: 'dim', w: 1, glow: 0 });
    for (let v = Math.ceil(ya); v <= yb; v++) if (v) line(k, [P(xa, v), P(xb, v)], a + 0.1, a + 0.5, { col: 'dim', w: 1, glow: 0 });
  }
  arrow(k, [[x0, O[1]], [x0 + w + 20, O[1]]], a, a + 0.5, { col: 'grey', w: 1.8, head: 12, glow: 0.2 });
  arrow(k, [[O[0], y0 + h], [O[0], y0 - 20]], a + 0.15, a + 0.65, { col: 'grey', w: 1.8, head: 12, glow: 0.2 });
  const [lx, ly] = o.labels || ['Re', 'Im'];
  text(k, lx, x0 + w + 30, O[1] + 10, 30, a + 0.4, a + 0.7, { col: 'grey', w: 600 });
  text(k, ly, O[0] + 14, y0 - 16, 30, a + 0.5, a + 0.8, { col: 'grey', w: 600 });
  return P;
}
// graf af punkter [[u,v],...] i akser P
const trace = (k, P, pts, a, b, o = {}) => line(k, pts.map(([u, v]) => P(u, v)), a, b, { w: 4, glow: 1, ...o });

// ---------------------------------------------------------------- dynamik
const dyn = (d) => { DYN.push(d); return d; };
// ladningsprikker langs en sti
function flow(k, pts, a, b, o = {}) { const L = line(k, pts, -1, -1, { w: 0 }); ITEMS.pop(); dyn({ k: 'flow', shot: k, P: L.P, len: L.len, L: L.L, a, b, rate: o.rate ?? 2, gap: o.gap ?? 34, col: o.col || 'blue', r: o.r ?? 4.5 }); }
// tænke-ring: en lysende ring, der fyldes på pausen
function ring(k, x, y, a, b) { dyn({ k: 'ring', shot: k, x, y, a, b }); }
// roterende vektor (Euler): vinkel(t) -> radianer; P = akser
function rotvec(k, P, a, b, ang, o = {}) { dyn({ k: 'rotvec', shot: k, P, a, b, ang, r: o.r ?? 1 }); }

// ---------------------------------------------------------------- hero-objektet (fra referencens product-launch.js)
const HALF = 1, RAD = 0.27, THICK = 0.12, SEG = 48;
function rr(a, r, sg) {
  const pts = [], cs = [[a - r, a - r], [-(a - r), a - r], [-(a - r), -(a - r)], [a - r, -(a - r)]];
  cs.forEach(([cx, cz], k) => { for (let i = 0; i <= sg; i++) { const an = k * PI / 2 + (i / sg) * PI / 2; pts.push([cx + r * Math.cos(an), cz + r * Math.sin(an), an]); } });
  return pts;
}
const OUT = rr(HALF, RAD, SEG), DIE = rr(0.66, 0.12, 5);
function cam(c) {
  const cyw = Math.cos(c.yaw), syw = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch), D = 7, F = c.s * 1900;
  const P = (x, y, z) => { const X = x * cyw - z * syw, Z = x * syw + z * cyw, up = y * cp - Z * sp, dep = Z * cp + y * sp, k = F / (D - dep); return [c.cx + X * k, c.cy - up * k, dep]; };
  const N = (nx, nz) => [nx * cyw - nz * syw, nx * syw + nz * cyw];
  return Object.assign({}, c, { P, N, unit: F / D });
}
const polyPath = (x, pts) => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); };
function body(x, c, L, mirror) {
  const hv = L.hover, yT = hv + THICK / 2, yB = hv - THICK / 2, sc = c.unit / 271;
  const P = mirror ? (a, y, b) => c.P(a, -y, b) : c.P;
  const n = OUT.length, top = OUT.map((p) => P(p[0], yT, p[1])), bot = OUT.map((p) => P(p[0], yB, p[1]));
  const segs = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n, a1 = OUT[i][2], a2 = OUT[j][2];
    let nx = Math.cos(a1) + Math.cos(a2), nz = Math.sin(a1) + Math.sin(a2); const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl;
    const [NX, NZ] = c.N(nx, nz);
    segs.push({ i, j, NX, NZ });
    if (NZ < -0.03) continue;
    const lam = Math.max(0, NX * -0.6 + NZ * 0.8), sd = Math.max(0, NX * -0.25 + NZ * 0.97), spec = Math.pow(sd, 18), sheen = Math.pow(sd, 4);
    const rim = Math.pow(Math.max(0, NX), 3);
    let v = 14 + lam * 62 * L.key + Math.min(1, spec * 0.85 + sheen * 0.3) * 140 * L.key + rim * 120 * L.rim;
    if (mirror) v *= 0.9;
    const cc = (m) => `rgb(${Math.min(255, v * 0.96 * m) | 0},${Math.min(255, v * 0.98 * m) | 0},${Math.min(255, (v * 1.05 + 3) * m) | 0})`;
    const m = Math.max(1, Math.ceil(Math.hypot(top[j][0] - top[i][0], top[j][1] - top[i][1]) / 40));
    const lp = (A, B, f) => [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f];
    for (let q = 0; q < m; q++) {
      const t0 = lp(top[i], top[j], q / m), t1 = lp(top[i], top[j], (q + 1) / m), b0 = lp(bot[i], bot[j], q / m), b1 = lp(bot[i], bot[j], (q + 1) / m);
      let ex = t1[0] - t0[0], ey = t1[1] - t0[1]; const el = Math.hypot(ex, ey) || 1; ex /= el; ey /= el;
      const tm = [(t0[0] + t1[0]) / 2, (t0[1] + t1[1]) / 2], bm = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2];
      let gx = -ey, gy = ex, hh = (bm[0] - tm[0]) * gx + (bm[1] - tm[1]) * gy;
      if (Math.abs(hh) < 0.5) { gx = bm[0] - tm[0]; gy = bm[1] - tm[1]; hh = 1; }
      const sg = x.createLinearGradient(tm[0], tm[1], tm[0] + gx * hh, tm[1] + gy * hh);
      if (mirror) { sg.addColorStop(0, cc(0.5)); sg.addColorStop(0.45, cc(1)); sg.addColorStop(1, cc(1.2)); }
      else { sg.addColorStop(0, cc(1.32)); sg.addColorStop(0.3, cc(1.05)); sg.addColorStop(0.52, cc(0.62)); sg.addColorStop(0.74, cc(0.82)); sg.addColorStop(1, cc(0.42)); }
      x.fillStyle = sg; x.strokeStyle = sg; x.lineWidth = 0.9;
      polyPath(x, [t1, t0, b0, b1]); x.fill(); x.stroke();
    }
  }
  x.lineWidth = 1.2 * sc; x.strokeStyle = 'rgba(0,0,0,0.6)';
  for (const s of segs) if (s.NZ > 0) { x.beginPath(); x.moveTo(bot[s.i][0], bot[s.i][1]); x.lineTo(bot[s.j][0], bot[s.j][1]); x.stroke(); }
  if (mirror) { x.fillStyle = '#060608'; polyPath(x, bot); x.fill(); return null; }
  // toppen: mørkt glas med softbox-refleks og en fast stribe
  let minY = 1e9, maxY = -1e9; top.forEach((p) => { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
  polyPath(x, top);
  let g = x.createLinearGradient(0, minY, 0, maxY);
  g.addColorStop(0, '#1d2028'); g.addColorStop(1, '#08090c');
  x.fillStyle = g; x.fill();
  x.save(); polyPath(x, top); x.clip();
  g = x.createLinearGradient(0, minY, 0, maxY);
  g.addColorStop(0, `rgba(255,255,255,${0.16 * L.key})`); g.addColorStop(0.35, `rgba(255,255,255,${0.035 * L.key})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, minY, 1280, maxY - minY);
  { const A = P(-1.1, yT, 0.6), B = P(0.6, yT, -1.1), sg = x.createLinearGradient(A[0], A[1], B[0], B[1]);
    sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.3, 'rgba(255,255,255,0)'); sg.addColorStop(0.46, `rgba(255,255,255,${0.11 * L.key})`); sg.addColorStop(0.5, `rgba(255,255,255,${0.05 * L.key})`); sg.addColorStop(0.66, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = sg; x.fillRect(0, minY, 1280, maxY - minY); }
  const die = DIE.map((p) => P(p[0], yT, p[1]));
  polyPath(x, die); x.fillStyle = 'rgba(4,5,8,0.92)'; x.fill();
  x.lineWidth = 0.6; x.strokeStyle = `rgba(150,160,200,${0.06 + 0.05 * L.act})`; x.beginPath();
  for (let q = -0.56; q <= 0.57; q += 0.08) { let a = P(q, yT, -0.6), b = P(q, yT, 0.6); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); a = P(-0.6, yT, q); b = P(0.6, yT, q); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); }
  x.stroke();
  x.restore();
  return { top, yT, minY, maxY, P };
}
// hero: glasplade med et lysende symbol. glyph = liste af polylinjer i pladens koordinater (u højre, v op, |u|,|v| < 0.6)
function hero(k, a, b, glyph, o = {}) { const d = dyn({ k: 'hero', shot: k, a, b, glyph, o, pts: {} }); return d; }
function drawHero(x, d, t) {
  const u = win(t, d.a, d.b), o = d.o;
  const c = cam({ cx: 640 + (o.dx || 0), cy: o.cy ?? 470, s: H.lerp(0.5, 0.58, io(u)), yaw: H.lerp(-0.85, -0.5, io(u)), pitch: H.lerp(0.5, 0.62, io(u)) });
  const L = { hover: 0.05 + 0.02 * Math.sin(t * 1.3), key: eo(win(t, d.a + 0.2, d.a + 1.6)), rim: eo(win(t, d.a, d.a + 0.9)), act: 1 };
  // gulvrefleksion
  x.save(); x.globalAlpha *= 0.32; body(x, c, L, true); x.restore();
  const fl = x.createLinearGradient(0, c.cy, 0, c.cy + c.unit * 0.9);
  fl.addColorStop(0, 'rgba(3,3,4,0.15)'); fl.addColorStop(1, 'rgba(3,3,4,1)');
  x.fillStyle = fl; x.fillRect(0, c.cy, 1280, c.unit);
  const T = body(x, c, L, false);
  // symbolet i glasset
  const yT = T.yT, Pp = ([uu, vv]) => T.P(uu, yT, -vv);
  const gp = eo(win(t, d.a + 0.6, d.a + 2.0));
  x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
  d.glyph.forEach((pl, gi) => {
    const S = seg(pl, 0.02).map(Pp), m = Math.max(2, Math.round(S.length * clamp(gp * d.glyph.length - gi)));
    if (m < 2) return;
    const g = x.createLinearGradient(S[0][0], S[0][1], S[S.length - 1][0] + 1, S[S.length - 1][1] + 1);
    GV.forEach((cc, i) => g.addColorStop(i / (GV.length - 1), cc));
    x.strokeStyle = g; x.lineWidth = 3; x.shadowColor = 'rgba(232,121,249,0.8)'; x.shadowBlur = 14;
    x.beginPath(); S.slice(0, m).forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.stroke();
  });
  x.restore();
  // kantringen tænder
  const ringOn = eo(win(t, d.a + 1.4, d.a + 2.4));
  if (ringOn > 0) {
    x.save(); polyPath(x, T.top);
    const g = x.createLinearGradient(T.top[0][0] - 300, 0, T.top[0][0] + 300, 0);
    GV.forEach((cc, i) => g.addColorStop(i / (GV.length - 1), cc));
    x.strokeStyle = g; x.globalAlpha *= ringOn; x.lineWidth = 2.2; x.shadowColor = 'rgba(182,156,255,0.9)'; x.shadowBlur = 20; x.stroke(); x.restore();
  }
  // højlys, der glider hen over glasset
  const sw = win(t, d.a + 1.8, d.a + 3.2);
  if (sw > 0 && sw < 1) {
    x.save(); polyPath(x, T.top); x.clip();
    const xs = H.lerp(T.top[0][0] - 700, T.top[0][0] + 500, io(sw)), g = x.createLinearGradient(xs - 120, T.minY, xs + 120, T.maxY);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, T.minY, 1280, T.maxY - T.minY); x.restore();
  }
  d.anchor = (uu, vv) => T.P(uu, yT, -vv);
}

// ---------------------------------------------------------------- kort
function titel(id, title, subtitle, glyph, labels = []) {
  const k = shot(0, { push: [1.0, 1.06] }), L = BP.L(id);
  hero(k, 0, L.end + 1.5, glyph, { cy: 500 });
  text(k, title, 640, 150, title.length > 24 ? 60 : 76, L.start + 0.1, L.start + 1.1, { align: 'center' });
  text(k, subtitle, 640, 205, 30, L.start + 0.9, L.start + 1.4, { align: 'center', col: 'grey', w: 600 });
  labels.forEach(([s, w, side, yy], i) => {
    const tt = BP.wt(id, w) - 0.15;
    text(k, s, side < 0 ? 330 : 950, yy ?? 420 + i * 60, 34, tt, tt + 0.4, { align: side < 0 ? 'right' : 'left', col: 'ink', w: 600 });
    line(k, side < 0 ? [[345, (yy ?? 420 + i * 60) - 11], [470, (yy ?? 420 + i * 60) - 11]] : [[810, (yy ?? 420 + i * 60) - 11], [935, (yy ?? 420 + i * 60) - 11]], tt, tt + 0.35, { col: 'grey', w: 1.4, glow: 0.2 });
  });
  return k;
}
function seFoerst(k, items, id) {
  const t = BP.L(id).start;
  text(k, 'Se først', 640, 610, 30, t, t + 0.4, { align: 'center', col: 'orange', w: 600 });
  text(k, items.join('  ·  '), 640, 655, 30, t + 0.3, t + 0.9, { align: 'center', col: 'ink', w: 600 });
}
function tjek(sporg, svar, qId, aId) {
  const q = BP.L(qId), s = BP.L(aId), k = shot(qId, { push: [1.0, 1.03] });
  text(k, 'Tjek dig selv', 160, 170, 64, q.start, q.start + 0.8, { grad: 'gg', glow: true, reveal: 'words' });
  (Array.isArray(sporg) ? sporg : [sporg]).forEach((sp, i) => text(k, sp, 160, 280 + i * 58, 40, q.start + 0.8 + i * 0.5, q.start + 1.4 + i * 0.5, { w: 600 }));
  ring(k, 1080, 330, q.end + 0.1, s.start - 0.1);
  text(k, 'pause og tænk', 1080, 430, 28, q.end + 0.1, q.end + 0.6, { align: 'center', col: 'grey', w: 600 });
  const n = (Array.isArray(sporg) ? sporg : [sporg]).length;
  (Array.isArray(svar) ? svar : [svar]).forEach((sv, i) => text(k, sv, 160, 300 + n * 58 + 60 + i * 64, 46, s.start + 0.2 + i * 0.6, s.start + 0.7 + i * 0.6, { grad: 'gg', glow: true, w: 800, reveal: 'fade' }));
  return k;
}
// slutkort: lyssweep til hvid scene
function slut(id, punkter, kilde, naeste) {
  const L = BP.L(id), k = shot(id, { white: true, push: [1.0, 1.03] });
  text(k, 'Kort sagt', 160, 170, 72, L.start + 0.4, L.start + 1.2);
  punkter.forEach(([s, w, n], i) => { const t = BP.wt(id, w, n || 0) - 0.15; text(k, s, 160, 290 + i * 70, 44, t, t + 0.5, { w: 600, reveal: 'fade' }); });
  if (naeste) { const tn = /næste/i.test(L.text) ? BP.wt(id, 'næste') - 0.1 : L.start + (L.end - L.start) * 0.6; text(k, 'Næste: ' + naeste, 160, 590, 34, tn, tn + 0.6, { col: 'violet', w: 600 }); }
  kilde.split(' · ').forEach((kl, i) => text(k, (i ? '' : 'Kilde: ') + kl, i ? 250 : 160, 640 + i * 38, 28, L.start + 0.6 + i * 0.3, L.start + 1.1 + i * 0.3, { col: 'grey', w: 600 }));
  return k;
}

Object.assign(BP, { shot, text, num, endX, line, arrow, dot, poly, callout, strike, frame, wire, resistor, capacitor, inductor, source, ground, axes, trace, flow, ring, rotvec, hero, titel, seFoerst, tjek, slut });

// ---------------------------------------------------------------- rendering
function stage(x, W, Hh, t, s) {
  if (s.white) {
    const g = x.createRadialGradient(640, 140, 40, 640, 260, 900);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.55, '#f4f4f7'); g.addColorStop(1, '#dcdce2');
    x.fillStyle = g; x.fillRect(0, 0, W, Hh); return;
  }
  x.fillStyle = '#030304'; x.fillRect(0, 0, W, Hh);
  let g = x.createRadialGradient(640, 300, 10, 640, 380, 820);
  g.addColorStop(0, 'rgba(44,47,60,0.9)'); g.addColorStop(0.45, 'rgba(20,21,28,0.8)'); g.addColorStop(1, 'rgba(3,3,4,0)');
  x.fillStyle = g; x.fillRect(0, 0, W, Hh);
  x.save(); x.translate(640, 560); x.scale(1, 0.24);
  g = x.createRadialGradient(0, 0, 0, 0, 0, 560); g.addColorStop(0, 'rgba(70,74,92,0.42)'); g.addColorStop(1, 'rgba(70,74,92,0)');
  x.fillStyle = g; x.beginPath(); x.arc(0, 0, 560, 0, 7); x.fill(); x.restore();
  const r = H.rng(404);
  for (let i = 0; i < 6; i++) {
    const bx = r() * W + Math.sin(t * 0.2 + i) * 14, by = r.range(0.05, 0.5) * Hh, rad = r.range(40, 110), hue = r.pick(['120,110,255', '255,140,90', '90,200,255']), a = r.range(0.025, 0.05);
    g = x.createRadialGradient(bx, by, 0, bx, by, rad);
    g.addColorStop(0, `rgba(${hue},${a})`); g.addColorStop(0.6, `rgba(${hue},${a * 0.6})`); g.addColorStop(1, `rgba(${hue},0)`);
    x.fillStyle = g; x.beginPath(); x.arc(bx, by, rad, 0, 7); x.fill();
  }
}
function gradFill(x, name, x0, x1) { const g = x.createLinearGradient(x0, 0, x1, 0), cs = GRAD[name]; cs.forEach((c, i) => g.addColorStop(i / (cs.length - 1), c)); return g; }
function drawRuns(x, runs, px, py, size, w, track) {
  for (const r of runs) {
    const s = r.m ? size * 0.62 : size, dy = r.m === 1 ? size * 0.2 : r.m === 2 ? -size * 0.42 : 0;
    x.font = INTER(w, s); x.letterSpacing = `${track * s}px`; x.fillText(r.t, px, py + dy); px += x.measureText(r.t).width;
  }
}
function drawText(x, it, t, s) {
  const x0 = it.x + it.x0;
  const paint = (runs, px, py, alpha) => {
    if (alpha <= 0) return;
    x.save(); x.globalAlpha *= alpha;
    x.fillStyle = it.grad ? gradFill(x, it.grad, x0, x0 + it.wid) : col(s, it.col);
    if (it.glow) { x.shadowColor = it.grad === 'gg' ? 'rgba(124,240,184,0.55)' : 'rgba(232,121,249,0.55)'; x.shadowBlur = it.size * 0.35; }
    drawRuns(x, runs, px, py, it.size, it.w, it.track);
    x.restore();
  };
  if (it.reveal === 'words') {
    const n = it.words.length;
    it.words.forEach((wd, i) => { const ta = it.a + (it.b - it.a) * i / n, u = eo(win(t, ta, ta + 0.35)); paint(wd.runs, x0 + wd.off, it.y + (1 - u) * 14, u); });
  } else {
    const u = eo(win(t, it.a, Math.max(it.a + 0.3, it.b)));
    paint(it.runs, x0, it.y + (1 - u) * 10, u);
  }
  if (it.gleam) { // et glimt glider hen over tallet
    const g = win(t, it.b, it.b + 0.9);
    if (g > 0 && g < 1) {
      x.save(); x.globalCompositeOperation = 'lighter';
      const gx = x0 - 80 + (it.wid + 160) * io(g), gr = x.createLinearGradient(gx - 60, 0, gx + 60, 0);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.65)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; drawRuns(x, it.runs, x0, it.y, it.size, it.w, it.track); x.restore();
    }
  }
}
function drawLine(x, it, t, s) {
  const p = it.a < 0 ? 1 : io(win(t, it.a, it.b)), Ld = it.L * p;
  if (Ld <= 0.5) return;
  x.save(); x.lineCap = 'round'; x.lineJoin = 'round'; x.lineWidth = it.w;
  const st = it.grad ? gradFill(x, it.grad, it.P[0][0], it.P[it.P.length - 1][0] + 1) : col(s, it.col);
  x.strokeStyle = st; x.fillStyle = st;
  if (it.glow && !s.white) { x.shadowColor = it.grad ? 'rgba(232,121,249,0.6)' : 'rgba(140,170,255,0.45)'; x.shadowBlur = 10 * it.glow; }
  if (it.dash) x.setLineDash(it.dash);
  x.beginPath(); let last = it.P[0];
  x.moveTo(last[0], last[1]);
  for (let i = 1; i < it.P.length; i++) {
    if (it.len[i] <= Ld) { x.lineTo(it.P[i][0], it.P[i][1]); last = it.P[i]; }
    else { const f = (Ld - it.len[i - 1]) / (it.len[i] - it.len[i - 1]); last = [it.P[i - 1][0] + (it.P[i][0] - it.P[i - 1][0]) * f, it.P[i - 1][1] + (it.P[i][1] - it.P[i - 1][1]) * f]; x.lineTo(last[0], last[1]); break; }
  }
  x.stroke();
  if (it.head && p > 0.98) {
    const A = it.P[it.P.length - 1], Bq = it.P[Math.max(0, it.P.length - 4)], an = Math.atan2(A[1] - Bq[1], A[0] - Bq[0]), hl = it.head;
    x.setLineDash([]); x.beginPath(); x.moveTo(A[0] + Math.cos(an) * 2, A[1] + Math.sin(an) * 2);
    x.lineTo(A[0] - Math.cos(an - 0.4) * hl, A[1] - Math.sin(an - 0.4) * hl); x.lineTo(A[0] - Math.cos(an + 0.4) * hl, A[1] - Math.sin(an + 0.4) * hl); x.closePath(); x.fill();
  }
  x.restore();
}
function drawDyn(x, d, t, s) {
  if (d.k === 'hero') return drawHero(x, d, t);
  if (t < d.a || t > d.b + 0.5) return;
  if (d.k === 'flow') {
    const off = ((t - d.a) * d.rate * d.gap) % d.gap, fade = Math.min(1, (t - d.a) / 0.3, Math.max(0, d.b - t) / 0.3);
    x.save(); x.fillStyle = col(s, d.col, 0.9 * fade); x.shadowColor = 'rgba(100,181,255,0.8)'; x.shadowBlur = 10;
    let i = 0;
    for (let q = off; q < d.L; q += d.gap) {
      while (i < d.len.length - 1 && d.len[i + 1] < q) i++;
      const f = (q - d.len[i]) / Math.max(1e-6, (d.len[i + 1] ?? d.len[i]) - d.len[i]), A = d.P[i], Bq = d.P[Math.min(i + 1, d.P.length - 1)];
      x.beginPath(); x.arc(A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f, d.r, 0, TAU); x.fill();
    }
    x.restore();
  } else if (d.k === 'ring') {
    const u = win(t, d.a, d.b), fade = Math.min(1, (t - d.a) / 0.3);
    x.save(); x.globalAlpha *= fade; x.lineWidth = 5; x.lineCap = 'round';
    x.strokeStyle = 'rgba(255,255,255,0.12)'; x.beginPath(); x.arc(d.x, d.y, 56, 0, TAU); x.stroke();
    x.strokeStyle = gradFill(x, 'gv', d.x - 56, d.x + 56); x.shadowColor = 'rgba(232,121,249,0.7)'; x.shadowBlur = 16;
    x.beginPath(); x.arc(d.x, d.y, 56, -PI / 2, -PI / 2 + TAU * u); x.stroke(); x.restore();
  } else if (d.k === 'rotvec') {
    const an = d.ang(t), O = d.P(0, 0), E = d.P(Math.cos(an) * d.r, Math.sin(an) * d.r);
    x.save(); x.lineCap = 'round'; x.lineWidth = 4; x.strokeStyle = gradFill(x, 'gv', O[0], E[0] + 1); x.shadowColor = 'rgba(232,121,249,0.7)'; x.shadowBlur = 14;
    x.beginPath(); x.moveTo(O[0], O[1]); x.lineTo(E[0], E[1]); x.stroke();
    x.setLineDash([6, 8]); x.lineWidth = 1.6; x.shadowBlur = 0;
    x.strokeStyle = 'rgba(94,234,212,0.9)'; x.beginPath(); x.moveTo(E[0], E[1]); x.lineTo(E[0], O[1]); x.stroke();
    x.strokeStyle = 'rgba(255,154,77,0.9)'; x.beginPath(); x.moveTo(E[0], E[1]); x.lineTo(O[0], E[1]); x.stroke();
    x.setLineDash([]); x.fillStyle = '#f5f5f7'; x.beginPath(); x.arc(E[0], E[1], 6, 0, TAU); x.fill(); x.restore();
  }
}
function drawShot(x, si, t) {
  const s = SHOTS[si], u = clamp((t - s.t0) / Math.max(1, (s.t1 < 1e8 ? s.t1 : DURATION_) - s.t0));
  const z = H.lerp(s.push[0], s.push[1], io(u)), dx = s.drift * (u - 0.5);
  x.save(); x.translate(640 + dx, 380); x.scale(z, z); x.translate(-640, -380);
  for (const d of DYN) if (d.shot === si && d.k === 'hero') drawDyn(x, d, t, s);
  for (const it of ITEMS) {
    if (it.shot !== si || (it.a >= 0 && t < it.a)) continue;
    if (it.k === 'text') drawText(x, it, t, s);
    else if (it.k === 'line') drawLine(x, it, t, s);
    else if (it.k === 'dot') {
      const u2 = eo(win(t, it.a, it.b));
      x.save(); x.globalAlpha *= u2; x.fillStyle = col(s, it.col); if (!s.white) { x.shadowColor = 'rgba(255,255,255,0.7)'; x.shadowBlur = 10 * it.glow; }
      x.beginPath(); x.arc(it.x, it.y, it.r, 0, TAU); x.fill(); x.restore();
    } else if (it.k === 'poly') {
      const u2 = eo(win(t, it.a, it.b));
      x.save(); x.globalAlpha *= u2 * it.alpha; x.fillStyle = it.grad ? gradFill(x, it.grad, it.pts[0][0], it.pts[2][0]) : col(s, it.col);
      polyPath(x, it.pts); x.fill(); x.restore();
    }
  }
  for (const d of DYN) if (d.shot === si && d.k !== 'hero') drawDyn(x, d, t, s);
  x.restore();
}
let DURATION_ = 10;
function explainer(x, W, Hh, t) {
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  const act = SHOTS.map((s, i) => [i, shotAlpha(s, t)]).filter(([i, a]) => a > 0.001 && t >= SHOTS[i].t0 - 0.35);
  const cur = act.length ? act[act.length - 1][0] : 0;
  stage(x, W, Hh, t, { white: SHOTS[cur].white && t >= SHOTS[cur].t0 + 0.75 });
  for (const [i, a] of act) {
    const s = SHOTS[i];
    if (s.white) {
      // lyssweep: hvid scene afsløres bag et skråt lysbånd
      const wp = io(win(t, s.t0 - 0.1, s.t0 + 0.75)), xw = -200 + 1800 * wp;
      x.save(); x.beginPath(); x.moveTo(0, 0); x.lineTo(xw, 0); x.lineTo(xw - 300, Hh); x.lineTo(0, Hh); x.closePath(); x.clip();
      stage(x, W, Hh, t, s); drawShot(x, i, t); x.restore();
      if (wp > 0 && wp < 1) {
        const g = x.createLinearGradient(xw - 220, 0, xw + 60, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.75, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = g;
        x.beginPath(); x.moveTo(xw - 260, 0); x.lineTo(xw + 60, 0); x.lineTo(xw - 240, Hh); x.lineTo(xw - 560, Hh); x.closePath(); x.fill(); x.restore();
      }
    } else { x.save(); x.globalAlpha = a; drawShot(x, i, t); x.restore(); }
  }
  const white = SHOTS[cur].white && t > SHOTS[cur].t0 + 0.75;
  if (HEADER) { x.save(); x.font = INTER(600, 28); x.letterSpacing = '0.5px'; x.fillStyle = white ? 'rgba(29,29,31,0.55)' : 'rgba(161,161,166,0.8)'; x.fillText(HEADER, 44, 52); x.restore(); }
  if (!white) H.vignette(x, W, Hh, 0.45);
  H.grain(x, W, Hh, 0.025, 7);
}

// ---------------------------------------------------------------- afspiller
let BUILD = null;
BP.scene = (opts, fn) => { HEADER = opts.header || ''; BUILD = fn; };
BP.start = function (vo) {
  VO = vo; DURATION_ = VO.duration;
  const cv = document.getElementById('cv'), ctx = cv.getContext('2d', { willReadFrequently: true });
  const DURATION = VO.duration;
  const render = (t) => explainer(ctx, 1280, 720, clamp(t, 0, DURATION));
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
  window.READY = (async () => {
    try { await Promise.all([INTER(800, 80), INTER(600, 30), INTER(400, 30)].map((f) => document.fonts.load(f, 'AaÆØÅæøå09θπ√∠'))); await document.fonts.ready; } catch (e) { /* tegn alligevel */ }
    BUILD(BP);
    render(0); useAudio(VO.audio, VO.audio); requestAnimationFrame(tick);
    return true;
  })();
};
})();
