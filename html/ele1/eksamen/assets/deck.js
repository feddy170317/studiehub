/* deck.js · fælles, usynlig motor til fremlæggelses-slides (MEM1).
   Hvert deck har sit eget design (CSS + markup). Motoren giver kun:
   16:9-skalering, navigation (pile, mellemrum, klikker, F = fuld skærm), KaTeX,
   fjernstyring af 3D-labs (postMessage) og små lærreds-hjælpere. */
(function () {
'use strict';
var D = window.Deck = {}, slides = [], cur = 0, hooks = [];
D.$ = function (id) { return document.getElementById(id); };
D.fmt = function (x, n) { return (+x).toFixed(n == null ? 0 : n).replace('.', ','); };
D.css = function (name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); };

/* ---------- skalering + navigation ---------- */
D.init = function (o) {
  o = o || {};
  var W = o.w || 1600, H = o.h || 900, deck = document.querySelector('.deck');
  slides = [].slice.call(document.querySelectorAll('.slide'));
  function fit() { var s = Math.min(innerWidth / W, innerHeight / H); deck.style.transform = 'scale(' + s + ')'; }
  addEventListener('resize', fit); fit();
  var nav = document.createElement('div'); nav.className = 'dnav';
  nav.innerHTML = '<span class="pg"></span><span class="dots"></span><button class="pv" title="Forrige (←)">‹</button><button class="nx" title="Næste (→)">›</button><button class="fs" title="Fuld skærm (F)">⛶</button>';
  document.body.appendChild(nav);
  var dots = nav.querySelector('.dots');
  slides.forEach(function (s, i) { var d = document.createElement('i'); d.title = s.dataset.title || ''; d.onclick = function () { D.go(i); }; dots.appendChild(d); });
  nav.querySelector('.pv').onclick = function () { D.go(cur - 1); };
  nav.querySelector('.nx').onclick = function () { D.go(cur + 1); };
  nav.querySelector('.fs').onclick = D.fs;
  D.go = function (i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, j) { s.classList.toggle('on', j === cur); });
    [].forEach.call(dots.children, function (d, j) { d.classList.toggle('on', j === cur); });
    nav.querySelector('.pg').textContent = (cur + 1) + ' / ' + slides.length;
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
    hooks.forEach(function (f) { f(cur); });
  };
  addEventListener('keydown', D.key);
  document.querySelectorAll('input[type=range]').forEach(function (r) {
    r.addEventListener('change', function () { r.blur(); });
    r.addEventListener('pointerup', function () { setTimeout(function () { r.blur(); }, 0); });
  });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button'); if (b) b.blur(); });
  var h = parseInt(location.hash.slice(1), 10); D.go(h > 0 ? h - 1 : 0);
  D.tex();
};
D.onSlide = function (f) { hooks.push(f); };
D.key = function (e) {
  var t = e.target && e.target.tagName;
  if (t === 'INPUT' && /Arrow/.test(e.key)) return;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].indexOf(e.key) >= 0) { e.preventDefault(); D.go(cur + 1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].indexOf(e.key) >= 0) { e.preventDefault(); D.go(cur - 1); }
  else if (e.key === 'Home') D.go(0); else if (e.key === 'End') D.go(slides.length - 1);
  else if (e.key === 'f' || e.key === 'F') D.fs();
};
D.fs = function () { if (!document.fullscreenElement) { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } else document.exitFullscreen(); };

/* ---------- KaTeX: data-tex (inline) og data-texd (display) ---------- */
D.tex = function (root) {
  if (!window.katex) return setTimeout(function () { D.tex(root); }, 80);
  (root || document).querySelectorAll('[data-tex],[data-texd]').forEach(function (el) {
    var s = el.getAttribute('data-tex') || el.getAttribute('data-texd');
    try { katex.render(s, el, { throwOnError: false, displayMode: el.hasAttribute('data-texd') }); } catch (e) { el.textContent = s; }
  });
};

/* ---------- kontroller ---------- */
/* knapgruppe: Deck.group('[data-x]', function (værdi, knap) {...}, kumulativ) */
D.group = function (sel, cb, cumulative) {
  var bs = document.querySelectorAll(sel);
  function pick(b) {
    var v = b.getAttribute(sel.replace(/[\[\]]/g, '').split('=')[0]);
    bs.forEach(function (o) { var ov = o.getAttribute(sel.replace(/[\[\]]/g, '').split('=')[0]); o.classList.toggle('on', cumulative ? +ov <= +v : o === b); });
    cb(v, b);
  }
  bs.forEach(function (b) { b.addEventListener('click', function () { pick(b); }); });
  return { pick: function (i) { pick(bs[i]); } };
};
/* slider med output-felt id+'o': Deck.range('id', cb, fmt) → {set(v)} */
D.range = function (id, cb, fmt) {
  var el = D.$(id), out = D.$(id + 'o');
  function show() { if (out) out.textContent = fmt ? fmt(+el.value) : el.value; }
  el.addEventListener('input', function () { show(); cb(+el.value); });
  show();
  return { set: function (v) { el.value = v; show(); }, get: function () { return +el.value; } };
};
/* relativ ændring i forhold til opgavens tal */
D.rel = function (id, v, v0) {
  var e = D.$(id); if (!e) return; var r = v / v0;
  if (Math.abs(r - 1) < 0.005) { e.className = 'eq'; e.textContent = 'som opgaven'; }
  else { e.className = r > 1 ? 'up' : 'dn'; e.textContent = '×' + D.fmt(r, r < 0.1 || r > 9.95 ? 3 : 2); }
};

/* ---------- 3D-lab i iframe ---------- */
/* Deck.lab('iframeId', 'trykbeholder', function () { return {'inderradius': 40, ...}; }) → send() */
D.lab = function (id, file, getP) {
  var f = D.$(id), ready = false;
  function send() { if (!ready) return; try { f.contentWindow.postMessage({ lab: getP() }, '*'); } catch (e) {} }
  f.addEventListener('load', function () {
    ready = true; send(); setTimeout(send, 400);
    try { f.contentWindow.addEventListener('keydown', D.key); } catch (e) {}
  });
  f.src = '../../../../lab/mem1/' + file + '.html#embed&light';
  return send;
};

/* ---------- lærred ---------- */
D.cv = function (id) {
  var c = D.$(id), x = c.getContext('2d'), font = D.css('--chart-font') || 'system-ui,sans-serif';
  var g = {
    c: c, x: x, W: c.width, H: c.height,
    clear: function () { x.clearRect(0, 0, c.width, c.height); },
    txt: function (s, px, py, size, col, al, bl, wt) { x.font = (wt || 600) + ' ' + size + 'px ' + font; x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = bl || 'middle'; x.fillText(s, px, py); },
    line: function (pts, col, w, dash) { x.strokeStyle = col; x.lineWidth = w || 3; x.setLineDash(dash || []); x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.stroke(); x.setLineDash([]); },
    poly: function (pts, fill, stroke, w) { x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = w || 2; x.stroke(); } },
    dot: function (px, py, r, col) { x.fillStyle = col; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); },
    rect: function (px, py, w, h, col) { x.fillStyle = col; x.fillRect(px, py, w, h); },
    arrow: function (x0, y0, x1, y1, col, w) {
      var a = Math.atan2(y1 - y0, x1 - x0), h = 8 + (w || 3) * 3;
      g.line([[x0, y0], [x1 - Math.cos(a) * h * 0.6, y1 - Math.sin(a) * h * 0.6]], col, w);
      g.poly([[x1, y1], [x1 - h * Math.cos(a - 0.4), y1 - h * Math.sin(a - 0.4)], [x1 - h * Math.cos(a + 0.4), y1 - h * Math.sin(a + 0.4)]], col);
    },
    /* koordinatsystem: g.plot({l,r,t,b, x0,x1,y0,y1}) → {X(v), Y(v)} */
    frame: function (o) {
      return {
        X: function (v) { return o.l + (v - o.x0) / (o.x1 - o.x0) * (o.r - o.l); },
        Y: function (v) { return o.b - (v - o.y0) / (o.y1 - o.y0) * (o.b - o.t); }
      };
    },
    fn: function (F, f, a, b, col, w, dash, n) { var pts = []; n = n || 120; for (var i = 0; i <= n; i++) { var v = a + (b - a) * i / n, y = f(v); if (isFinite(y)) pts.push([F.X(v), F.Y(y)]); } g.line(pts, col, w, dash); }
  };
  return g;
};
})();
