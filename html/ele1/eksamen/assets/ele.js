/* ele.js · fælles hjælpere til ELE1-eksamensdecks og træning.
   Cx: kompleks regning. Ckt: kredsløbstegner (SVG, lyst tema) + ladder-DSL.
   Wave: sinus- og viser-tegning på Deck.cv-lærreder. */
(function () {
'use strict';
var PI = Math.PI, D2R = PI / 180;

/* ---------------- kompleks regning ---------------- */
var Cx = window.Cx = function (re, im) { return { re: re, im: im || 0 }; };
Cx.pol = function (m, deg) { return Cx(m * Math.cos(deg * D2R), m * Math.sin(deg * D2R)); };
Cx.add = function () { var r = 0, i = 0; [].forEach.call(arguments, function (z) { z = Cx.z(z); r += z.re; i += z.im; }); return Cx(r, i); };
Cx.sub = function (a, b) { a = Cx.z(a); b = Cx.z(b); return Cx(a.re - b.re, a.im - b.im); };
Cx.mul = function (a, b) { a = Cx.z(a); b = Cx.z(b); return Cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); };
Cx.div = function (a, b) { a = Cx.z(a); b = Cx.z(b); var d = b.re * b.re + b.im * b.im; return Cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
Cx.inv = function (a) { return Cx.div(1, a); };
Cx.par = function () { var s = Cx(0, 0); [].forEach.call(arguments, function (z) { s = Cx.add(s, Cx.inv(z)); }); return Cx.inv(s); };
Cx.conj = function (a) { a = Cx.z(a); return Cx(a.re, -a.im); };
Cx.abs = function (a) { a = Cx.z(a); return Math.hypot(a.re, a.im); };
Cx.arg = function (a) { a = Cx.z(a); return Math.atan2(a.im, a.re) / D2R; };   /* grader */
Cx.z = function (a) { return typeof a === 'number' ? Cx(a, 0) : a; };
Cx.ZL = function (L, f) { return Cx(0, 2 * PI * f * L); };
Cx.ZC = function (C, f) { return Cx(0, -1 / (2 * PI * f * C)); };

/* dansk talformat med n betydende cifre */
var num = window.num = function (x, sig) {
  if (!isFinite(x)) return '–';
  sig = sig || 4; if (Math.abs(x) < 1e-12) return '0';
  var d = Math.max(0, Math.min(6, sig - 1 - Math.floor(Math.log10(Math.abs(x)))));
  var s = x.toFixed(d);
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  s = s.replace('-', '−').replace('.', ',');
  var p = s.split(','), ip = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return ip + (p[1] ? ',' + p[1] : '');
};
Cx.str = function (z, sig) { return num(Cx.abs(z), sig || 4) + '∠' + num(Cx.arg(z), 3) + '°'; };
Cx.rect = function (z, sig) { z = Cx.z(z); return num(z.re, sig || 4) + (z.im < 0 ? ' − j' : ' + j') + num(Math.abs(z.im), sig || 4); };

/* ---------------- kredsløbstegner ---------------- */
var INK = '#14202d', NS = 'http://www.w3.org/2000/svg';
var Ckt = window.Ckt = {};
/* parts: {t:'w', pts} | {t:'R'|'C'|'L'|'V'|'AC'|'I'|'Z', a, b, label, id, side:'l'|'r'|'t'|'b', color}
          {t:'node', at} | {t:'gnd', at} | {t:'txt', at, s, id, color, anchor, size} | {t:'iarrow', at, dir, color} */
Ckt.svg = function (parts, viewBox, o) {
  o = o || {};
  var svg = document.createElementNS(NS, 'svg'), ids = {};
  svg.setAttribute('viewBox', viewBox); svg.setAttribute('class', 'ckt');
  if (o.h) svg.style.maxHeight = o.h + 'px';
  function mk(tag, at, par) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); (par || svg).appendChild(e); return e; }
  var st = { stroke: INK, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  function S(extra) { var r = {}; for (var k in st) r[k] = st[k]; for (k in extra) r[k] = extra[k]; return r; }
  function text(x, y, s, oo) {
    oo = oo || {};
    var t = mk('text', { x: x, y: y, fill: oo.color || INK, 'font-size': oo.size || 15, 'font-weight': oo.w || 600, 'font-family': 'system-ui,Segoe UI,sans-serif', 'text-anchor': oo.anchor || 'middle', 'dominant-baseline': 'middle' });
    t.textContent = s; if (oo.id) ids[oo.id] = t; return t;
  }
  parts.forEach(function (p) {
    if (p.t === 'w') { mk('polyline', S({ points: p.pts.map(function (q) { return q.join(','); }).join(' '), stroke: p.color || INK })); return; }
    if (p.t === 'node') { mk('circle', { cx: p.at[0], cy: p.at[1], r: 4, fill: p.color || INK }); return; }
    if (p.t === 'gnd') { var x = p.at[0], y = p.at[1]; mk('path', S({ d: 'M' + x + ',' + y + ' v9 M' + (x - 13) + ',' + (y + 9) + ' h26 M' + (x - 8) + ',' + (y + 14) + ' h16 M' + (x - 3) + ',' + (y + 19) + ' h6' })); return; }
    if (p.t === 'txt') { text(p.at[0], p.at[1], p.s, p); return; }
    if (p.t === 'iarrow') {
      var g0 = mk('g', { transform: 'translate(' + p.at[0] + ',' + p.at[1] + ') rotate(' + ({ r: 0, d: 90, l: 180, u: 270 }[p.dir || 'r']) + ')' });
      mk('path', { d: 'M-10,0 H7 M2,-6 L9,0 L2,6', stroke: p.color || '#d97a00', 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g0);
      return;
    }
    var ax = p.a[0], ay = p.a[1], bx = p.b[0], by = p.b[1];
    var len = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax) * 180 / PI, half = 24, m = len / 2;
    var g = mk('g', { transform: 'translate(' + ax + ',' + ay + ') rotate(' + ang + ')' });
    var col = p.color || INK;
    var isSrc = p.t === 'V' || p.t === 'AC' || p.t === 'I';
    var hb = isSrc ? 17 : half;
    mk('path', S({ d: 'M0,0 H' + (m - hb) + ' M' + (m + hb) + ',0 H' + len }), g);
    if (p.t === 'R') mk('path', S({ d: 'M' + (m - half) + ',0 l4,-8 l8,16 l8,-16 l8,16 l8,-16 l8,16 l4,-8', stroke: col }), g);
    else if (p.t === 'Z') mk('rect', { x: m - half, y: -10, width: 2 * half, height: 20, stroke: col, 'stroke-width': 2.2, fill: '#fff4e0' }, g);
    else if (p.t === 'C') mk('path', S({ d: 'M' + (m - half) + ',0 H' + (m - 5) + ' M' + (m - 5) + ',-14 V14 M' + (m + 5) + ',-14 V14 M' + (m + 5) + ',0 H' + (m + half), stroke: col }), g);
    else if (p.t === 'L') { var d = 'M' + (m - half) + ',0'; for (var k = 0; k < 4; k++) d += ' a6,8 0 0,1 12,0'; mk('path', S({ d: d, stroke: col }), g); }
    else if (isSrc) {
      mk('circle', S({ cx: m, cy: 0, r: 17, fill: '#fff' }), g);
      if (p.t === 'AC') mk('path', S({ d: 'M' + (m - 9) + ',0 q4.5,-9 9,0 t9,0' }), g);
      if (p.t === 'I') mk('path', S({ d: 'M' + (m - 9) + ',0 H' + (m + 7) + ' M' + (m + 2) + ',-6 L' + (m + 9) + ',0 L' + (m + 2) + ',6' }), g);
      if (p.t === 'V' || p.t === 'AC') {
        [['+', m + 9], ['−', m - 9]].forEach(function (q) {
          if (p.t === 'AC' && q[0] === '−') return;
          var t = mk('text', { x: q[1], y: 0, fill: INK, 'font-size': 14, 'font-weight': 700, 'text-anchor': 'middle', 'dominant-baseline': 'middle', transform: 'rotate(' + (-ang) + ' ' + q[1] + ' 0)' }, g);
          t.textContent = q[0];
          if (p.t === 'AC') t.setAttribute('x', q[1] + 18), t.setAttribute('transform', 'rotate(' + (-ang) + ' ' + (q[1] + 18) + ' 0)');
        });
      }
    }
    if (p.label) {
      var mx = (ax + bx) / 2, my = (ay + by) / 2, vert = Math.abs(bx - ax) < Math.abs(by - ay);
      var side = p.side || (vert ? 'r' : 't'), off = isSrc ? 26 : 20;
      var lines = String(p.label).split('\n');
      lines.forEach(function (s, i) {
        var dy = (i - (lines.length - 1) / 2) * 17;
        if (vert) text(mx + (side === 'l' ? -off : off), my + dy, s, { anchor: side === 'l' ? 'end' : 'start', id: i ? null : p.id, color: p.lc });
        else text(mx, my + (side === 'b' ? off + 2 : -off) + dy, s, { id: i ? null : p.id, color: p.lc });
      });
    }
  });
  return { el: svg, set: function (id, s) { if (ids[id]) ids[id].textContent = s; }, color: function (id, c) { if (ids[id]) ids[id].setAttribute('fill', c); } };
};

/* ladder-DSL: items = [{p:'V:12 V'} | {p:['L:0,5 H','R:3 kΩ']} | {s:'R:2 kΩ'} | {s:{par:['L:..','R:..']}} | {n:'A'}]
   Typer: R C L V I AC Z; 'Vr' = + nedad, 'Id' = pil nedad. */
Ckt.ladder = function (items, o) {
  o = o || {};
  var top = 60, bot = 220, parts = [], x0 = null, cur = null, minY = top - 30, nodes = [];
  var GAP = o.gap || 120, SL = o.sl || 120;
  function el(spec, a, b, side) {
    var i = spec.indexOf(':'), t = spec.slice(0, i), lab = spec.slice(i + 1), rev = false, id = null, h = lab.indexOf('#');
    if (h >= 0) { id = lab.slice(h + 1); lab = lab.slice(0, h); }
    if (t === 'Vr') { t = 'V'; rev = true; } if (t === 'Id') { t = 'I'; rev = true; }
    if (t === 'ACr') { t = 'AC'; rev = true; }
    return { t: t, a: rev ? b : a, b: rev ? a : b, label: lab, side: side, id: id };
  }
  var lastWasP = false, pendN = null;
  function nodeLabel(it, x) { if (it.n) parts.push({ t: 'txt', at: [x - 8, top - 16], s: it.n, color: '#0a7fc2', size: 17, anchor: 'end', id: it.id }); }
  items.forEach(function (it, k) {
    if (it.p) {
      var x = cur == null ? 60 : (lastWasP ? cur + GAP : cur);
      if (cur != null && x > cur) parts.push({ t: 'w', pts: [[cur, top], [x, top]] });
      if (x0 == null) x0 = x;
      var arr = [].concat(it.p), side = x === 60 ? 'l' : 'r';
      if (arr.length === 1) parts.push(el(arr[0], [x, bot], [x, top], side));
      else { var mid = (top + bot) / 2; parts.push(el(arr[0], [x, mid], [x, top], side)); parts.push(el(arr[1], [x, bot], [x, mid], side)); }
      if (k > 0) parts.push({ t: 'node', at: [x, top] });
      if (pendN) { nodes.push(x); nodeLabel(pendN, x); pendN = null; }
      cur = x; lastWasP = true;
    } else if (it.s) {
      if (cur == null) cur = 60, x0 = 60;
      if (typeof it.s === 'string') parts.push(el(it.s, [cur, top], [cur + SL, top]));
      else {
        var y2 = top - 70; minY = Math.min(minY, y2 - 30);
        parts.push({ t: 'w', pts: [[cur, top], [cur, y2]] }, { t: 'w', pts: [[cur + SL, top], [cur + SL, y2]] });
        parts.push(el(it.s.par[0], [cur, y2], [cur + SL, y2]));
        parts.push(el(it.s.par[1], [cur, top], [cur + SL, top], 'b'));
        parts.push({ t: 'node', at: [cur, top] }, { t: 'node', at: [cur + SL, top] });
      }
      cur += SL; lastWasP = false;
    } else if (it.n != null) {
      /* knude mellem to parallelle grene: mærket hører til forgreningen ved den NÆSTE gren, ikke til hjørnet ved kilden */
      if (lastWasP && items[k + 1] && items[k + 1].p) { pendN = it; return; }
      nodes.push(cur);
      parts.push({ t: 'node', at: [cur, top] });
      nodeLabel(it, cur);
    }
  });
  if (!lastWasP) { parts.push({ t: 'w', pts: [[cur, top], [cur + 30, top], [cur + 30, bot]] }); cur += 30; }
  parts.push({ t: 'w', pts: [[x0, bot], [cur, bot]] });
  if (o.gnd !== false) parts.push({ t: 'gnd', at: [(x0 + cur) / 2, bot] });
  var W = cur + 110, left = items[0] && items[0].p ? -95 : 0;
  return { parts: parts, vb: left + ' ' + minY + ' ' + (W - left) + ' ' + (bot + 34 - minY) };
};
Ckt.make = function (spec, h) {
  if (spec.parts) return Ckt.svg(spec.parts, spec.vb, { h: h });
  var L = Ckt.ladder(spec.items || spec, spec.o);
  return Ckt.svg(L.parts, L.vb, { h: h });
};
/* trefaset Y-last: labels = ['Z1','Z2','Z3'], zn = 'R_N' eller null */
Ckt.wye = function (src, labels, zn) {
  var p = [], ys = [50, 110, 170], cy = 290;   /* kilde-stjernepunkt nederst */
  ys.forEach(function (y, i) {
    var x = 70 + i * 70;
    p.push({ t: 'AC', a: [x, cy], b: [x, cy - 80] });
    p.push({ t: 'txt', at: [x + 24, cy - 52], s: src[i], size: 14, anchor: 'start' });
    p.push({ t: 'w', pts: [[x, cy - 80], [x, y], [330, y]] });
    p.push({ t: 'Z', a: [330, y], b: [470, y], label: labels[i] });
    p.push({ t: 'w', pts: [[470, y], [520, y], [520, 110]] });
  });
  p.push({ t: 'w', pts: [[70, cy], [210, cy]] }, { t: 'node', at: [140, cy] });
  p.push({ t: 'node', at: [520, 110] }, { t: 'txt', at: [512, 92], s: 'N′', anchor: 'end', color: '#0a7fc2' });
  p.push({ t: 'w', pts: [[520, 110], [590, 110], [590, 140]] });
  if (zn) p.push({ t: 'R', a: [590, 140], b: [590, 260], label: zn, side: 'r' }, { t: 'w', pts: [[590, 260], [590, 330], [140, 330], [140, cy]] });
  else p.push({ t: 'w', pts: [[590, 140], [590, 330], [140, 330], [140, cy]] });
  p.push({ t: 'txt', at: [365, 316], s: 'nulleder', color: '#5a6b7d', size: 14 });
  return { parts: p, vb: '20 15 660 335' };
};

/* ---------------- sinus- og viser-tegning (Deck.cv) ---------------- */
var Wave = window.Wave = {};
/* akser: o = {l,r,t,b,x0,x1,y0,y1, xt:[...], yt:[...], xl, yl, xf, yf} */
Wave.axes = function (g, o) {
  var F = g.frame(o), MUT = '#5a6b7d';
  (o.yt || []).forEach(function (v) { g.line([[o.l, F.Y(v)], [o.r, F.Y(v)]], v === 0 ? '#9fb0c2' : '#e6ecf2', v === 0 ? 2.5 : 2); g.txt(o.yf ? o.yf(v) : String(v), o.l - 12, F.Y(v), o.fs || 24, MUT, 'right', 'middle', 600); });
  (o.xt || []).forEach(function (v) { g.line([[F.X(v), o.t], [F.X(v), o.b]], '#eef2f6', 2); g.txt(o.xf ? o.xf(v) : String(v), F.X(v), o.b + 28, o.fs || 24, MUT, 'center', 'middle', 600); });
  g.line([[o.l, o.t], [o.l, o.b], [o.r, o.b]], '#9fb0c2', 3);
  if (o.yl) g.txt(o.yl, o.l + 10, o.t - 18, o.fs || 24, MUT, 'left', 'middle', 700);
  if (o.xl) g.txt(o.xl, o.r, o.b + 60, o.fs || 24, MUT, 'right', 'middle', 700);
  return F;
};
/* viserdiagram: list = [{z, col, lab, from(z)}] */
Wave.phasors = function (g, cx, cy, sc, list, o) {
  o = o || {};
  var R = o.R || 0;
  if (R) { g.line([[cx - R, cy], [cx + R, cy]], '#d3dde8', 2); g.line([[cx, cy - R], [cx, cy + R]], '#d3dde8', 2);
    g.txt('Re', cx + R + 6, cy, 22, '#5a6b7d', 'left', 'middle', 700); g.txt('Im', cx, cy - R - 16, 22, '#5a6b7d', 'center', 'middle', 700); }
  list.forEach(function (v) {
    var f = v.from || Cx(0, 0), x0 = cx + f.re * sc, y0 = cy - f.im * sc, x1 = cx + (f.re + v.z.re) * sc, y1 = cy - (f.im + v.z.im) * sc;
    if (Math.hypot(x1 - x0, y1 - y0) < 3) return;
    if (v.dash) g.line([[x0, y0], [x1, y1]], v.col, v.w || 3, [8, 7]); else g.arrow(x0, y0, x1, y1, v.col, v.w || 5);
    if (v.lab) { var a = Math.atan2(y1 - y0, x1 - x0); g.txt(v.lab, x1 + Math.cos(a) * 26 + (v.dx || 0), y1 + Math.sin(a) * 26 + (v.dy || 0), v.fs || 28, v.col, 'center', 'middle', 800); }
  });
};
Wave.PI = PI;
})();
