/* DYN2 eksamens-decks: navigation, KaTeX og tegnehjælpere (fælles for opg01–opg10).
   Indlæses i bunden af <body>, efter slides. Opgavens egen kode bruger window.D. */
(function () {
'use strict';
var D = window.D = {}, PI = Math.PI;
var $ = D.$ = function (id) { return document.getElementById(id); };
D.PI = PI;
D.fmt = function (x, n) { return x.toFixed(n).replace('.', ',').replace(/^-/, '−'); };
D.rel = function (id, v, v0) {
  var r = v / v0, e = $(id);
  if (!isFinite(r) || Math.abs(r - 1) < 0.005) { e.className = 'eq'; e.textContent = 'uændret'; }
  else { e.className = r > 1 ? 'up' : 'dn'; e.textContent = '×' + D.fmt(r, 2); }
};

/* ---------- navigation ---------- */
var nav = document.createElement('div'); nav.id = 'nav';
nav.innerHTML = '<a href="../" title="Alle 10 opgaver">☰</a><span id="pg"></span><div id="dots"></div><button id="prev" title="Forrige (←)">‹</button><button id="next" title="Næste (→)">›</button><button id="fs" title="Fuld skærm (F)">⛶</button>';
document.body.appendChild(nav);
var deck = $('deck'), slides = [].slice.call(document.querySelectorAll('.slide')), cur = 0, showCb = {};
function fit() { var s = Math.min(innerWidth / 1600, innerHeight / 900); deck.style.transform = 'scale(' + s + ')'; }
addEventListener('resize', fit); fit();
var dots = $('dots');
slides.forEach(function (s, i) { var d = document.createElement('i'); d.title = s.dataset.title || ''; d.onclick = function () { go(i); }; dots.appendChild(d); });
function go(i) {
  cur = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach(function (s, j) { s.classList.toggle('on', j === cur); });
  [].forEach.call(dots.children, function (d, j) { d.classList.toggle('on', j === cur); });
  $('pg').textContent = (cur + 1) + ' / ' + slides.length;
  try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
  (showCb[cur] || []).forEach(function (f) { f(); });
}
D.go = go; D.cur = function () { return cur; };
D.onShow = function (i, f) { (showCb[i] = showCb[i] || []).push(f); };
function fsToggle() { if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
addEventListener('keydown', function (e) {
  var t = e.target && e.target.tagName;
  if (t === 'INPUT' && /Arrow/.test(e.key)) return;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].indexOf(e.key) >= 0) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].indexOf(e.key) >= 0) { e.preventDefault(); go(cur - 1); }
  else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') fsToggle();
});
document.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('change', function () { r.blur(); }); r.addEventListener('pointerup', function () { setTimeout(function () { r.blur(); }, 0); }); });
document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button,input[type=checkbox]'); if (b) b.blur(); });
$('prev').onclick = function () { go(cur - 1); }; $('next').onclick = function () { go(cur + 1); }; $('fs').onclick = fsToggle;
D.start = function () { var h = parseInt(location.hash.slice(1), 10); go(h > 0 ? h - 1 : 0); };

/* ---------- KaTeX ---------- */
D.texEl = function (el, s) { if (window.katex) katex.render(s, el, { throwOnError: false }); else { el.setAttribute('data-tex', s); } };
(function tex() {
  if (!window.katex) return setTimeout(tex, 80);
  document.querySelectorAll('[data-tex]').forEach(function (el) {
    try { katex.render(el.getAttribute('data-tex'), el, { throwOnError: false, displayMode: false }); } catch (e) { el.textContent = el.getAttribute('data-tex'); }
  });
})();

/* ---------- lærred ---------- */
D.cv = function (id) { var c = $(id), x = c.getContext('2d'); return { c: c, x: x, W: c.width, H: c.height }; };
D.txt = function (x, s, px, py, size, col, al, bl, wt) { x.font = (wt || 600) + ' ' + size + 'px system-ui,sans-serif'; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = bl || 'middle'; x.fillText(s, px, py); };
D.arrow = function (x, x0, y0, x1, y1, col, w) {
  var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < 3) return;
  var ux = dx / L, uy = dy / L, hl = Math.min(20, L * 0.45);
  x.strokeStyle = col; x.fillStyle = col; x.lineWidth = w || 5; x.lineCap = 'round'; x.setLineDash([]);
  x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1 - ux * hl * 0.8, y1 - uy * hl * 0.8); x.stroke();
  x.beginPath(); x.moveTo(x1, y1); x.lineTo(x1 - ux * hl - uy * hl * 0.5, y1 - uy * hl + ux * hl * 0.5); x.lineTo(x1 - ux * hl + uy * hl * 0.5, y1 - uy * hl - ux * hl * 0.5); x.closePath(); x.fill();
};
D.line = function (x, pts, col, w, dash) { x.strokeStyle = col; x.lineWidth = w || 3; x.setLineDash(dash || []); x.lineCap = 'round'; x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.stroke(); x.setLineDash([]); };
D.circ = function (x, cx, cy, r, fill, stroke, lw) { x.beginPath(); x.arc(cx, cy, r, 0, 2 * PI); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); } };
D.pin = function (x, cx, cy, r) { D.circ(x, cx, cy, r || 9, '#fff', '#14202d', 3); };
/* moment-pil: bue om (cx,cy), ccw = mod uret */
D.marc = function (x, cx, cy, r, ccw, col, w) {
  var a0 = ccw ? 0.35 * PI : -0.35 * PI, a1 = ccw ? 1.6 * PI : -1.6 * PI;
  x.strokeStyle = col; x.lineWidth = w || 4; x.beginPath(); x.arc(cx, cy, r, -a0, -a1, ccw); x.stroke();
  var ex = cx + r * Math.cos(-a1), ey = cy + r * Math.sin(-a1), tx = ccw ? Math.sin(-a1) : -Math.sin(-a1), ty = ccw ? -Math.cos(-a1) : Math.cos(-a1);
  D.arrow(x, ex - tx * 14, ey - ty * 14, ex + tx * 4, ey + ty * 4, col, w || 4);
};
D.spring = function (x, x0, y0, x1, y1, col, n) {
  var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, w = 12; n = n || 8;
  var p = [[x0, y0], [x0 + ux * L * 0.15, y0 + uy * L * 0.15]];
  for (var i = 0; i < n; i++) { var t = 0.15 + 0.7 * (i + 0.5) / n, s = i % 2 ? -w : w; p.push([x0 + ux * L * t - uy * s, y0 + uy * L * t + ux * s]); }
  p.push([x0 + ux * L * 0.85, y0 + uy * L * 0.85]); p.push([x1, y1]); D.line(x, p, col || '#5a6b7d', 3);
};
D.ground = function (x, x0, x1, y, col) { D.line(x, [[x0, y], [x1, y]], col || '#5a6b7d', 3); for (var i = x0; i < x1; i += 16) D.line(x, [[i, y], [i - 10, y + 12]], col || '#9fb0c2', 2); };

/* ---------- graf ----------
   o: f (funktion), x0, x1, xt [[v,'tekst']], min, max, yt [v], yd, lbl, col, d (decimaler), u (enhed),
      xm (markør), vline (stiplet lodret), ref (stiplet sammenligning), more [{f,col,w,dash}], xl (x-akse-navn), hl ([y, tekst] vandret linje) */
D.graph = function (id, o) {
  var g = D.cv(id), x = g.x, W = g.W, H = g.H, L = o.L || 74, R = W - 18, T = 50, Bt = H - 40, x0 = o.x0 || 0, x1 = o.x1;
  function X(v) { return L + (v - x0) / (x1 - x0) * (R - L); } function Y(v) { return Bt - (v - o.min) / (o.max - o.min) * (Bt - T); }
  x.clearRect(0, 0, W, H);
  D.txt(x, o.lbl, 4, 20, 26, o.col, 'left');
  if (o.xl) D.txt(x, o.xl, R, 20, 22, '#5a6b7d', 'right');
  x.strokeStyle = '#c3d0dd'; x.lineWidth = 2; x.setLineDash([]); x.beginPath(); x.moveTo(L, T - 6); x.lineTo(L, Bt); x.lineTo(R, Bt); x.stroke();
  (o.yt || []).forEach(function (v) { D.txt(x, D.fmt(v, o.yd || 0), L - 8, Y(v), 22, '#5a6b7d', 'right'); x.strokeStyle = 'rgba(159,176,194,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(R, Y(v)); x.stroke(); });
  if (o.min < 0 && o.max > 0) { x.strokeStyle = '#9fb0c2'; x.lineWidth = 2; x.beginPath(); x.moveTo(L, Y(0)); x.lineTo(R, Y(0)); x.stroke(); D.txt(x, '0', L - 8, Y(0), 22, '#5a6b7d', 'right'); }
  (o.xt || []).forEach(function (t, i, a) { D.txt(x, t[1], X(t[0]), Bt + 22, 22, '#5a6b7d', X(t[0]) > R - 30 ? 'right' : (X(t[0]) < L + 20 ? 'left' : 'center')); });
  if (o.hl) { D.line(x, [[L, Y(o.hl[0])], [R, Y(o.hl[0])]], 'rgba(214,58,58,.7)', 2, [8, 6]); D.txt(x, o.hl[1], R - 4, Y(o.hl[0]) - 14, 20, '#d63a3a', 'right'); }
  if (o.vline != null) D.line(x, [[X(o.vline), T - 6], [X(o.vline), Bt]], 'rgba(168,107,0,.6)', 2, [7, 6]);
  function curve(fn, col, w, dash) { x.strokeStyle = col; x.lineWidth = w; x.setLineDash(dash || []); x.beginPath(); var n = 240, first = true; for (var i = 0; i <= n; i++) { var xv = x0 + (x1 - x0) * i / n, v = fn(xv); if (!isFinite(v)) { first = true; continue; } v = Math.max(o.min - (o.max - o.min) * 0.05, Math.min(o.max + (o.max - o.min) * 0.05, v)); first ? x.moveTo(X(xv), Y(v)) : x.lineTo(X(xv), Y(v)); first = false; } x.stroke(); x.setLineDash([]); }
  x.save(); x.beginPath(); x.rect(L, T - 10, R - L, Bt - T + 12); x.clip();
  if (o.ref) curve(o.ref, 'rgba(90,107,125,.65)', 3, [9, 7]);
  (o.more || []).forEach(function (c) { curve(c.f, c.col, c.w || 3, c.dash); });
  if (o.f) curve(o.f, o.col, 5);
  x.restore();
  if (o.f && o.xm != null) {
    var v = o.f(o.xm), s = D.fmt(v, o.d) + (o.u ? ' ' + o.u : '');
    D.circ(x, X(o.xm), Y(v), 9, o.col);
    var lx = Math.min(Math.max(X(o.xm) + 14, L + 10), R - 170), ly = Y(v) > (T + Bt) / 2 ? Y(v) - 28 : Y(v) + 30;
    x.font = '700 26px system-ui,sans-serif'; var tw = x.measureText(s).width;
    x.fillStyle = 'rgba(246,249,252,.9)'; x.fillRect(lx - 4, ly - 17, tw + 8, 34);
    D.txt(x, s, lx, ly, 26, o.col, 'left');
  }
  return { X: X, Y: Y, x: x };
};

/* ---------- stablet bidragsbjælke ----------
   parts: [{v, col, lbl}], lvl: hvor mange der vises (0-baseret), o: {min, max, d, u, note:[tekst pr. niveau]} */
D.stack = function (id, parts, lvl, o) {
  var g = D.cv(id), x = g.x, W = g.W, H = g.H, L = 14, R = W - 14, y = 48, hh = 60;
  function X(v) { return L + (v - o.min) / (o.max - o.min) * (R - L); }
  x.clearRect(0, 0, W, H);
  if (o.min < 0) D.line(x, [[X(0), y - 14], [X(0), y + hh + 14]], '#9fb0c2', 2);
  var s = 0;
  parts.forEach(function (p, i) {
    if (i > lvl) return;
    var a = X(s), b = X(s + p.v); x.fillStyle = p.col; x.globalAlpha = i === lvl ? 1 : 0.75; x.fillRect(Math.min(a, b), y, Math.abs(b - a), hh); x.globalAlpha = 1;
    var lab = (i ? (p.v >= 0 ? '+' : '−') : '') + D.fmt(Math.abs(p.v), o.d).replace('−', ''), mid = (a + b) / 2;
    if (!i && p.v < 0) lab = '−' + lab;
    if (Math.abs(b - a) > 110) D.txt(x, lab, mid, y + hh / 2, 26, '#fff', 'center', 'middle', 700);
    else D.txt(x, lab, Math.max(L + 30, Math.min(R - 30, mid)), y - 20, 24, p.col, 'center', 'middle', 700);
    s += p.v;
  });
  D.line(x, [[X(s), y - 8], [X(s), y + hh + 12]], '#d97a00', 4);
  D.txt(x, '= ' + D.fmt(s, o.d) + (o.u ? ' ' + o.u : ''), R, y + hh + 40, 30, '#d97a00', 'right', 'middle', 700);
  D.txt(x, (o.note || [])[lvl] || parts[lvl].lbl || '', L, y + hh + 40, 24, '#5a6b7d', 'left');
  return s;
};
/* knapper der viser bidrag trin for trin */
D.steps = function (sel, cb) {
  var bb = document.querySelectorAll(sel);
  bb.forEach(function (b) { b.onclick = function () { var l = +b.dataset.l; bb.forEach(function (o) { o.classList.toggle('on', +o.dataset.l <= l); }); cb(l); }; });
};
/* kør en tegnefunktion hvert billede, mens slide i er fremme */
D.anim = function (i, f) {
  var last = 0;
  function tick(t) { if (cur === i) { f(last ? Math.min(0.05, (t - last) / 1000) : 0, t / 1000); } last = t; requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
};
})();
