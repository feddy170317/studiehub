/* ELE1 Øvelseslab: fælles motor for interaktive opgaver.
   Ingen eksterne biblioteker og ingen ES-moduler, så siderne virker offline og ved dobbeltklik (file://).
   Brug: Lab.task(cfg) opretter et opgavepanel; Lab.slider/readout/check/steps/plot/phasor/circuit bygger indholdet. */
var Lab = (function () {
  'use strict';
  var COL = { cyan: '#5ec8ff', green: '#00d984', gold: '#ffa500', purple: '#d984ff', red: '#ff5e5e',
              txt: '#e0e0e0', dim: 'rgba(224,224,224,0.55)', grid: 'rgba(255,255,255,0.07)', axis: 'rgba(255,255,255,0.35)' };

  /* ---------- Komplekse tal ---------- */
  function C(re, im) { return { re: re, im: im || 0 }; }
  var Cx = {
    c: C,
    polar: function (r, th) { return C(r * Math.cos(th), r * Math.sin(th)); },
    add: function (a, b) { return C(a.re + b.re, a.im + b.im); },
    sub: function (a, b) { return C(a.re - b.re, a.im - b.im); },
    mul: function (a, b) { return C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); },
    div: function (a, b) { var d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); },
    scale: function (a, k) { return C(a.re * k, a.im * k); },
    abs: function (a) { return Math.hypot(a.re, a.im); },
    arg: function (a) { return Math.atan2(a.im, a.re); },
    conj: function (a) { return C(a.re, -a.im); },
    par: function (a, b) { return Cx.div(Cx.mul(a, b), Cx.add(a, b)); }
  };
  var deg = function (r) { return r * 180 / Math.PI; }, rad = function (d) { return d * Math.PI / 180; };

  /* ---------- Talformat (dansk komma, SI-præfikser) ---------- */
  function fmt(x, sig) {
    if (x === null || x === undefined || isNaN(x)) return '–';
    if (!isFinite(x)) return x > 0 ? '∞' : '−∞';
    sig = sig || 3;
    if (Math.abs(x) < 1e-12) return '0';
    var a = Math.abs(x), s;
    if (a >= Math.pow(10, sig)) s = x.toFixed(0);
    else { s = x.toPrecision(sig); if (s.indexOf('e') >= 0) s = Number(s).toString(); }
    if (s.indexOf('.') >= 0 && s.indexOf('e') < 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    s = s.replace('-', '−').replace('.', ',');
    if (a >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return s;
  }
  var PRE = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n']];
  function fu(x, unit, sig) {
    if (x === null || isNaN(x)) return '–';
    if (!isFinite(x)) return fmt(x) + ' ' + unit;
    var a = Math.abs(x);
    if (a < 1e-11) return '0 ' + unit;   // afrundingsstøj fra numerisk integration vises som 0
    for (var i = 0; i < PRE.length; i++) {
      if (a >= PRE[i][0] * 0.9995) return fmt(x / PRE[i][0], sig) + ' ' + PRE[i][1] + unit;
    }
    return fmt(x / 1e-9, sig) + ' n' + unit;
  }
  function clean(z) { // afrundingsstøj (< 10⁻⁵ af længden) vises som 0
    var m = Cx.abs(z), e = 1e-5 * m;
    return C(Math.abs(z.re) < e ? 0 : z.re, Math.abs(z.im) < e ? 0 : z.im);
  }
  function fc(z, unit, sig) { // kartesisk
    z = clean(z);
    var im = z.im, sgn = im < 0 ? ' − j' : ' + j';
    return fmt(z.re, sig) + sgn + fmt(Math.abs(im), sig) + (unit ? ' ' + unit : '');
  }
  function fp(z, unit, sig, inRad) { // polær
    z = clean(z);
    var a = Cx.arg(z);
    return fmt(Cx.abs(z), sig) + '∠' + (inRad ? fmt(a, 3) + ' rad' : fmt(deg(a), 3) + '°') + (unit ? ' ' + unit : '');
  }

  /* ---------- Hjælpere ---------- */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  var redrawers = [];
  window.addEventListener('resize', function () { redrawers.forEach(function (f) { f(); }); });

  function canvas(parent, aspect) {
    var cv = el('canvas'); parent.appendChild(cv); cv._aspect = aspect || 0.5;
    return cv;
  }
  function prep(cv) {
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 600, h = Math.round(w * cv._aspect);
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.height = h + 'px'; }
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, W: w, H: h };
  }
  function niceStep(span, n) {
    var raw = span / (n || 5), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
  }

  /* ---------- Opgavepanel ---------- */
  var taskCount = 0;
  function task(cfg) {
    taskCount++;
    var id = cfg.id || ('opg' + taskCount);
    var sec = el('section', 'task'); sec.id = id;
    sec.appendChild(el('div', 'task-head', '<span class="tag">' + (cfg.tag || ('Opgave ' + taskCount)) + '</span><h2>' + cfg.title + '</h2>'));
    if (cfg.text) sec.appendChild(el('p', 'task-text', cfg.text));
    if (cfg.learn) sec.appendChild(el('p', 'learn', '<b>Det skal du se:</b> ' + cfg.learn));
    var body = el('div', 'task-body');
    var controls = el('div', 'controls', '<h3>Indstillinger</h3>');
    var stage = el('div', 'stage');
    body.appendChild(controls); body.appendChild(stage); sec.appendChild(body);
    var foot = el('div', 'foot'); sec.appendChild(foot);
    document.getElementById('tasks').appendChild(sec);
    var nav = document.getElementById('tasknav');
    if (nav) { var a = el('a', null, (cfg.tag || ('Opgave ' + taskCount)) + ': ' + (cfg.short || cfg.title)); a.href = '#' + id; nav.appendChild(a); }
    var T = { el: sec, controls: controls, stage: stage, foot: foot, p: {}, sliders: [], fns: [] };
    T.update = function () { T.fns.forEach(function (f) { f(T.p); }); };
    T.on = function (f) { T.fns.push(f); };
    T.reset = function () { T.sliders.forEach(function (s) { s.set(s.def); }); T.update(); };
    T.ready = function () {
      var b = el('button', 'btn sec full', '↺ Opgavens værdier'); b.onclick = T.reset; controls.appendChild(b);
      redrawers.push(T.update); T.update();
    };
    return T;
  }

  /* slider: {key,label,min,max,step,value,unit,sig,log,fmt} */
  function slider(T, o) {
    var row = el('div', 'slider-row');
    var lab = el('label', null, '<span>' + o.label + '</span><span class="val"></span>');
    var inp = el('input'); inp.type = 'range';
    var log = !!o.log;
    if (log) { inp.min = 0; inp.max = 1000; inp.step = 1; } else { inp.min = o.min; inp.max = o.max; inp.step = o.step || (o.max - o.min) / 200; }
    row.appendChild(lab); row.appendChild(inp); T.controls.appendChild(row);
    var valEl = lab.querySelector('.val');
    function toVal(v) { return log ? o.min * Math.pow(o.max / o.min, v / 1000) : Number(v); }
    function toPos(x) { return log ? 1000 * Math.log(x / o.min) / Math.log(o.max / o.min) : x; }
    function show(x) { valEl.textContent = o.fmt ? o.fmt(x) : (o.unit !== undefined ? (o.noPrefix ? fmt(x, o.sig) + ' ' + o.unit : fu(x, o.unit, o.sig)) : fmt(x, o.sig)); }
    var S = { key: o.key, def: o.value, set: function (x) { inp.value = toPos(x); T.p[o.key] = log ? x : Number(inp.value); show(T.p[o.key]); } };
    inp.addEventListener('input', function () { T.p[o.key] = toVal(inp.value); show(T.p[o.key]); T.update(); });
    S.set(o.value); T.sliders.push(S);
    return S;
  }
  function select(T, o) {
    var row = el('div', 'sel-row', o.label);
    var s = el('select'); o.options.forEach(function (op) { var x = el('option', null, op[1]); x.value = op[0]; s.appendChild(x); });
    row.appendChild(s); T.controls.appendChild(row);
    T.p[o.key] = o.value || o.options[0][0]; s.value = T.p[o.key];
    s.addEventListener('change', function () { T.p[o.key] = s.value; T.update(); });
    T.sliders.push({ key: o.key, def: T.p[o.key], set: function (v) { s.value = v; T.p[o.key] = v; } });
  }
  /* presets: knapper der sætter flere skydere på én gang, fx delopgave a-d eller bogens eksempeltal.
     list: [{label, v:{key:værdi}}] */
  function presets(T, list, title) {
    var box = el('div', 'sel-row', title || 'Vælg delopgave');
    var row = el('div', 'btn-row'); row.style.cssText = 'display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.3rem';
    list.forEach(function (ps) {
      var b = el('button', 'btn sec', ps.label); b.style.padding = '.35rem .6rem';
      b.onclick = function () {
        T.sliders.forEach(function (s) { if (s.key in ps.v) s.set(ps.v[s.key]); });
        row.querySelectorAll('button').forEach(function (x) { x.style.outline = ''; }); b.style.outline = '2px solid #5ec8ff';
        T.update();
      };
      row.appendChild(b);
    });
    box.appendChild(row); T.controls.insertBefore(box, T.controls.children[1] || null);
  }
  function hint(T, html) { T.controls.appendChild(el('p', 'note', html)); }

  /* readout: items [{key,label,color}] -> fn(values) */
  function readout(T, items) {
    var box = el('div', 'readout'); var map = {};
    items.forEach(function (it) {
      var d = el('div', null, '<div class="lbl">' + it.label + '</div><div class="num" style="color:' + (it.color || COL.txt) + '">–</div>');
      box.appendChild(d); map[it.key] = d.querySelector('.num');
    });
    T.stage.appendChild(box);
    return function (vals) { for (var k in vals) if (map[k]) map[k].innerHTML = vals[k]; };
  }

  /* check: [{q, unit, answer:function(p) -> tal i den viste enhed, tol}] */
  function check(T, items) {
    var box = el('div', 'checkbox', '<h3>Prøv selv først</h3>');
    items.forEach(function (it) {
      var row = el('div', 'check-row');
      row.appendChild(el('span', 'q', it.q));
      var inp = el('input'); inp.type = 'text'; inp.placeholder = 'dit svar';
      var btn = el('button', 'btn', 'Tjek'); var fb = el('span', 'fb');
      row.appendChild(inp); row.appendChild(el('span', 'unit', it.unit || '')); row.appendChild(btn); row.appendChild(fb);
      function doCheck() {
        var s = inp.value.replace(/\s/g, '').replace(',', '.').replace('−', '-');
        var x = parseFloat(s), ans = it.answer(T.p), tol = it.tol || 0.02;
        if (isNaN(x)) { fb.className = 'fb bad'; fb.textContent = 'Skriv et tal'; return; }
        var err = Math.abs(ans) > 1e-12 ? Math.abs((x - ans) / ans) : Math.abs(x - ans);
        if (err <= tol) { fb.className = 'fb ok'; fb.textContent = '✓ Rigtigt (' + fmt(ans, 4) + ')'; }
        else if (err <= 5 * tol || (Math.abs(ans) > 1e-12 && Math.abs(Math.abs(x) - Math.abs(ans)) / Math.abs(ans) <= tol)) {
          fb.className = 'fb near'; fb.textContent = Math.sign(x) !== Math.sign(ans) && Math.abs(Math.abs(x) - Math.abs(ans)) / Math.abs(ans) <= tol ? '≈ Tjek fortegnet' : '≈ Tæt på, tjek afrunding';
        }
        else { fb.className = 'fb bad'; fb.textContent = '✗ Ikke helt. Prøv igen eller se løsningen'; }
      }
      btn.onclick = doCheck; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') doCheck(); });
      T.on(function () { fb.textContent = ''; });
      box.appendChild(row);
    });
    box.appendChild(el('p', 'note', 'Svaret tjekkes mod de værdier, der står i indstillingerne lige nu. Brug komma eller punktum som decimaltegn.'));
    T.foot.appendChild(box);
  }

  /* steps: fn(p) -> array af html-strenge; genberegnes ved hver ændring */
  function steps(T, fn) {
    var box = el('div', 'steps', '<h3>Løsning trin for trin</h3>');
    var btn = el('button', 'btn sec', 'Vis løsning'); var body = el('div', 'steps-body');
    btn.onclick = function () { body.classList.toggle('show'); btn.textContent = body.classList.contains('show') ? 'Skjul løsning' : 'Vis løsning'; };
    box.appendChild(btn); box.appendChild(body); T.foot.appendChild(box);
    T.on(function (p) { body.innerHTML = '<ol>' + fn(p).map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>'; });
  }

  /* ---------- Plot ----------
     cfg: {x:[x0,x1], y:[y0,y1]|null (auto), xlabel, ylabel, series:[{fn|pts, color, label, width, dash}],
           markers:[{x,y,color,label}], hlines:[{y,color,label,dash}], vlines:[{x,color,label}], logx, n} */
  function plot(cv, cfg) {
    var g = prep(cv), ctx = g.ctx, W = g.W, H = g.H;
    var L = 56, R = 14, Tp = 16, B = 38, n = cfg.n || 600;
    var x0 = cfg.x[0], x1 = cfg.x[1];
    var tx = cfg.logx ? function (x) { return L + (Math.log10(x) - Math.log10(x0)) / (Math.log10(x1) - Math.log10(x0)) * (W - L - R); }
                      : function (x) { return L + (x - x0) / (x1 - x0) * (W - L - R); };
    var data = cfg.series.map(function (s) {
      if (s.pts) return s.pts;
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var x = cfg.logx ? x0 * Math.pow(x1 / x0, i / n) : x0 + (x1 - x0) * i / n;
        pts.push([x, s.fn(x)]);
      }
      return pts;
    });
    var y0, y1;
    if (cfg.y) { y0 = cfg.y[0]; y1 = cfg.y[1]; }
    else {
      y0 = Infinity; y1 = -Infinity;
      data.forEach(function (pts) { pts.forEach(function (p) { if (isFinite(p[1])) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } }); });
      (cfg.hlines || []).forEach(function (h) { y0 = Math.min(y0, h.y); y1 = Math.max(y1, h.y); });
      (cfg.markers || []).forEach(function (m) { y0 = Math.min(y0, m.y); y1 = Math.max(y1, m.y); });
      if (cfg.zero !== false) { y0 = Math.min(y0, 0); y1 = Math.max(y1, 0); }
      if (y1 - y0 < 1e-12) { y1 = y0 + 1; }
      var pad = (y1 - y0) * 0.08; y0 -= pad; y1 += pad;
    }
    var ty = function (y) { return Tp + (y1 - y) / (y1 - y0) * (H - Tp - B); };
    // gitter + akser
    ctx.font = '11px Segoe UI, sans-serif'; ctx.fillStyle = COL.dim; ctx.strokeStyle = COL.grid; ctx.lineWidth = 1;
    var sy = niceStep(y1 - y0, 6);
    for (var yv = Math.ceil(y0 / sy) * sy; yv <= y1 + 1e-9; yv += sy) {
      var py = ty(yv); ctx.beginPath(); ctx.moveTo(L, py); ctx.lineTo(W - R, py); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(fmt(Math.abs(yv) < sy * 1e-6 ? 0 : yv, 3), L - 6, py + 4);
    }
    if (cfg.logx) {
      for (var e = Math.floor(Math.log10(x0)); e <= Math.ceil(Math.log10(x1)); e++) {
        var xv = Math.pow(10, e); if (xv < x0 || xv > x1) continue;
        var px = tx(xv); ctx.beginPath(); ctx.moveTo(px, Tp); ctx.lineTo(px, H - B); ctx.stroke();
        ctx.textAlign = 'center'; ctx.fillText(fu(xv, cfg.xunit || '', 2).trim(), px, H - B + 15);
      }
    } else {
      var sx = niceStep(x1 - x0, 7);
      for (var xv2 = Math.ceil(x0 / sx) * sx; xv2 <= x1 + 1e-9; xv2 += sx) {
        var px2 = tx(xv2); ctx.beginPath(); ctx.moveTo(px2, Tp); ctx.lineTo(px2, H - B); ctx.stroke();
        ctx.textAlign = 'center'; ctx.fillText(fmt(Math.abs(xv2) < sx * 1e-6 ? 0 : xv2, 3), px2, H - B + 15);
      }
    }
    ctx.strokeStyle = COL.axis; ctx.beginPath();
    if (y0 < 0 && y1 > 0) { ctx.moveTo(L, ty(0)); ctx.lineTo(W - R, ty(0)); }
    ctx.moveTo(L, Tp); ctx.lineTo(L, H - B); ctx.lineTo(W - R, H - B); ctx.stroke();
    ctx.fillStyle = COL.txt; ctx.textAlign = 'center'; ctx.fillText(cfg.xlabel || '', (L + W - R) / 2, H - 6);
    ctx.save(); ctx.translate(13, (Tp + H - B) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(cfg.ylabel || '', 0, 0); ctx.restore();
    // klip til plotområde
    ctx.save(); ctx.beginPath(); ctx.rect(L, Tp, W - L - R, H - Tp - B); ctx.clip();
    (cfg.hlines || []).forEach(function (h) {
      ctx.strokeStyle = h.color || COL.gold; ctx.setLineDash(h.dash === false ? [] : [6, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(L, ty(h.y)); ctx.lineTo(W - R, ty(h.y)); ctx.stroke(); ctx.setLineDash([]);
    });
    (cfg.vlines || []).forEach(function (v) {
      ctx.strokeStyle = v.color || COL.dim; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tx(v.x), Tp); ctx.lineTo(tx(v.x), H - B); ctx.stroke(); ctx.setLineDash([]);
    });
    cfg.series.forEach(function (s, k) {
      ctx.strokeStyle = s.color || COL.cyan; ctx.lineWidth = s.width || 2.2; ctx.setLineDash(s.dash ? [6, 4] : []);
      ctx.beginPath(); var started = false;
      data[k].forEach(function (p) {
        if (!isFinite(p[1])) { started = false; return; }
        var X = tx(p[0]), Y = ty(p[1]);
        if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
      });
      ctx.stroke(); ctx.setLineDash([]);
    });
    (cfg.markers || []).forEach(function (m) {
      ctx.fillStyle = m.color || COL.red; ctx.beginPath(); ctx.arc(tx(m.x), ty(m.y), 5, 0, 2 * Math.PI); ctx.fill();
    });
    ctx.restore();
    // forklaringer
    var lx = L + 8, ly = Tp + 6;
    ctx.textAlign = 'left'; ctx.font = '12px Segoe UI, sans-serif';
    cfg.series.concat(cfg.hlines || []).concat(cfg.markers || []).forEach(function (s) {
      if (!s.label) return;
      ctx.fillStyle = s.color || COL.cyan; ctx.fillRect(lx, ly + 4, 14, 3);
      ctx.fillStyle = COL.txt; ctx.fillText(s.label, lx + 20, ly + 9); ly += 16;
    });
  }

  /* ---------- Fasordiagram ----------
     vecs: [{z, from, color, label, width, dash}], cfg: {max, labels:true, title} */
  function phasor(cv, vecs, cfg) {
    cfg = cfg || {};
    var g = prep(cv), ctx = g.ctx, W = g.W, H = g.H, cx = W / 2, cy = H / 2;
    var m = cfg.max || 0;
    vecs.forEach(function (v) { var f = v.from || C(0, 0); m = Math.max(m, Cx.abs(f), Cx.abs(Cx.add(f, v.z))); });
    if (m < 1e-12) m = 1;
    var sc = 0.42 * Math.min(W, H) / m;
    ctx.strokeStyle = COL.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, m * sc, 0, 2 * Math.PI); ctx.stroke();
    ctx.strokeStyle = COL.axis; ctx.beginPath(); ctx.moveTo(12, cy); ctx.lineTo(W - 12, cy); ctx.moveTo(cx, H - 10); ctx.lineTo(cx, 10); ctx.stroke();
    ctx.fillStyle = COL.dim; ctx.font = '12px Segoe UI, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Re', W - 28, cy - 6); ctx.fillText('Im', cx + 6, 20);
    vecs.forEach(function (v) {
      var f = v.from || C(0, 0), t = Cx.add(f, v.z);
      var X0 = cx + f.re * sc, Y0 = cy - f.im * sc, X1 = cx + t.re * sc, Y1 = cy - t.im * sc;
      arrow(ctx, X0, Y0, X1, Y1, v.color || COL.cyan, v.width || 3, v.dash);
      if (v.label) {
        ctx.fillStyle = v.color || COL.cyan; ctx.font = 'bold 13px Segoe UI, sans-serif';
        var a = Math.atan2(Y1 - Y0, X1 - X0);
        ctx.textAlign = Math.cos(a) >= 0 ? 'left' : 'right';
        ctx.fillText(v.label, X1 + 8 * Math.cos(a) + (Math.cos(a) >= 0 ? 2 : -2), Y1 + 8 * Math.sin(a) + 4);
      }
    });
    if (cfg.note) { ctx.fillStyle = COL.dim; ctx.font = '11px Segoe UI, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(cfg.note, 10, H - 10); }
    return { cx: cx, cy: cy, sc: sc };
  }
  function arrow(ctx, x0, y0, x1, y1, color, width, dash) {
    var len = Math.hypot(x1 - x0, y1 - y0); if (len < 1) return;
    var a = Math.atan2(y1 - y0, x1 - x0), h = Math.min(11, len * 0.4);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width || 3; ctx.setLineDash(dash ? [6, 4] : []);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - h * 0.7 * Math.cos(a), y1 - h * 0.7 * Math.sin(a)); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - h * Math.cos(a - 0.45), y1 - h * Math.sin(a - 0.45));
    ctx.lineTo(x1 - h * Math.cos(a + 0.45), y1 - h * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill();
  }

  /* ---------- Kredsløbstegner (SVG) ----------
     parts: {t:'w', pts:[[x,y],...]} ledning | {t:'R'|'C'|'L'|'V'|'AC'|'I'|'Z'|'bat', a:[x,y], b:[x,y], label, id, side}
            {t:'node', at} | {t:'gnd', at} | {t:'txt', at, s, id, color, anchor} | {t:'iarrow', at, dir, id, color}
     Returnerer {set(id, tekst), color(id, farve)} til live-værdier. */
  function circuit(T, parts, viewBox, height) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', viewBox); if (height) svg.style.maxHeight = height + 'px';
    var ids = {};
    function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; }
    var stroke = { stroke: COL.txt, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    function text(x, y, s, o) {
      o = o || {};
      var t = mk('text', { x: x, y: y, fill: o.color || COL.txt, 'font-size': o.size || 13, 'font-family': 'Segoe UI, sans-serif', 'text-anchor': o.anchor || 'middle' });
      t.textContent = s; if (o.id) ids[o.id] = t; return t;
    }
    parts.forEach(function (p) {
      if (p.t === 'w') { mk('polyline', Object.assign({ points: p.pts.map(function (q) { return q.join(','); }).join(' ') }, stroke, p.dash ? { 'stroke-dasharray': '5,4' } : {})); return; }
      if (p.t === 'node') { mk('circle', { cx: p.at[0], cy: p.at[1], r: 3.5, fill: COL.txt }); return; }
      if (p.t === 'gnd') {
        var x = p.at[0], y = p.at[1];
        mk('path', Object.assign({ d: 'M' + x + ',' + y + ' v8 M' + (x - 12) + ',' + (y + 8) + ' h24 M' + (x - 7) + ',' + (y + 13) + ' h14 M' + (x - 3) + ',' + (y + 18) + ' h6' }, stroke)); return;
      }
      if (p.t === 'txt') { text(p.at[0], p.at[1], p.s, { id: p.id, color: p.color, anchor: p.anchor, size: p.size }); return; }
      if (p.t === 'iarrow') {
        var g0 = mk('g', { transform: 'translate(' + p.at[0] + ',' + p.at[1] + ') rotate(' + ({ r: 0, d: 90, l: 180, u: 270 }[p.dir || 'r']) + ')' });
        mk('path', { d: 'M-9,0 H6 M2,-5 L8,0 L2,5', stroke: p.color || COL.gold, 'stroke-width': 2.2, fill: 'none' }, g0);
        if (p.id) ids[p.id] = g0;
        return;
      }
      // tokomponent mellem a og b
      var ax = p.a[0], ay = p.a[1], bx = p.b[0], by = p.b[1];
      var len = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI, half = 22;
      var g = mk('g', { transform: 'translate(' + ax + ',' + ay + ') rotate(' + ang + ')' });
      mk('path', Object.assign({ d: 'M0,0 H' + (len / 2 - half) + ' M' + (len / 2 + half) + ',0 H' + len }, stroke), g);
      var m = len / 2, body;
      if (p.t === 'R' || p.t === 'Z') body = mk('rect', { x: m - half, y: -8, width: 2 * half, height: 16, stroke: p.t === 'Z' ? COL.gold : COL.txt, 'stroke-width': 2, fill: p.t === 'Z' ? 'rgba(255,165,0,.12)' : 'none' }, g);
      else if (p.t === 'C') mk('path', Object.assign({ d: 'M' + (m - half) + ',0 H' + (m - 5) + ' M' + (m - 5) + ',-13 V13 M' + (m + 5) + ',-13 V13 M' + (m + 5) + ',0 H' + (m + half) }, stroke), g);
      else if (p.t === 'L') {
        var d = 'M' + (m - half) + ',0';
        for (var k = 0; k < 4; k++) d += ' a5.5,7 0 0,1 11,0';
        mk('path', Object.assign({ d: d }, stroke), g);
      }
      else if (p.t === 'bat') mk('path', Object.assign({ d: 'M' + (m - half) + ',0 H' + (m - 4) + ' M' + (m - 4) + ',-15 V15 M' + (m + 4) + ',-8 V8 M' + (m + 4) + ',0 H' + (m + half) }, stroke), g);
      else if (p.t === 'V' || p.t === 'AC' || p.t === 'I') {
        mk('circle', Object.assign({ cx: m, cy: 0, r: 15 }, stroke), g);
        mk('path', Object.assign({ d: 'M' + (m - half) + ',0 H' + (m - 15) + ' M' + (m + 15) + ',0 H' + (m + half) }, stroke), g);
        if (p.t === 'AC') mk('path', Object.assign({ d: 'M' + (m - 8) + ',0 q4,-8 8,0 t8,0' }, stroke), g);
        if (p.t === 'I') mk('path', Object.assign({ d: 'M' + (m - 8) + ',0 H' + (m + 7) + ' M' + (m + 2) + ',-5 L' + (m + 8) + ',0 L' + (m + 2) + ',5' }, stroke), g);
        if (p.t === 'V') { // + ved b-enden, − ved a-enden
          var tp = mk('text', { x: m + 7, y: -3, fill: COL.txt, 'font-size': 12, 'text-anchor': 'middle', transform: 'rotate(' + (-ang) + ' ' + (m + 7) + ' -3)' }, g); tp.textContent = '+';
          var tm = mk('text', { x: m - 7, y: -3, fill: COL.txt, 'font-size': 12, 'text-anchor': 'middle', transform: 'rotate(' + (-ang) + ' ' + (m - 7) + ' -3)' }, g); tm.textContent = '−';
        }
      }
      if (p.label) {
        var mx = (ax + bx) / 2, my = (ay + by) / 2, vert = Math.abs(bx - ax) < Math.abs(by - ay), s = p.side === 'l' || p.side === 't' ? -1 : 1;
        var off = (p.t === 'V' || p.t === 'AC' || p.t === 'I') ? 24 : 18;
        if (vert) text(mx + s * off, my + 4, p.label, { anchor: s > 0 ? 'start' : 'end', id: p.id, color: p.color });
        else text(mx, my + (s > 0 ? 28 : -14), p.label, { id: p.id, color: p.color });
      }
    });
    T.stage.insertBefore(svg, T.stage.firstChild);
    return {
      set: function (id, s) { if (ids[id] && ids[id].tagName === 'text') ids[id].textContent = s; },
      color: function (id, c) { if (ids[id]) { if (ids[id].tagName === 'text') ids[id].setAttribute('fill', c); else ids[id].querySelector('path').setAttribute('stroke', c); } },
      dir: function (id, sgn) { if (ids[id] && ids[id].tagName === 'g') { var tr = ids[id].getAttribute('transform').replace(/ scale\(-?1\)/, ''); ids[id].setAttribute('transform', tr + (sgn < 0 ? ' scale(-1)' : '')); } }
    };
  }

  /* ---------- Lineær algebra (lille Gauss) ---------- */
  function solve(A, b) {
    var n = b.length, M = A.map(function (r, i) { return r.slice().concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var piv = c; for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      var tmp = M[c]; M[c] = M[piv]; M[piv] = tmp;
      for (var r2 = 0; r2 < n; r2++) if (r2 !== c) { var f = M[r2][c] / M[c][c]; for (var k = c; k <= n; k++) M[r2][k] -= f * M[c][k]; }
    }
    return M.map(function (r, i) { return r[n] / r[i]; });
  }
  function matHtml(A, b, x, unitA) {
    var rows = A.map(function (r, i) {
      var td = '<td style="padding:1px 9px;text-align:right">';
      return '<tr>' + r.map(function (v) { return td + fmt(v, 3) + '</td>'; }).join('') +
        '<td style="padding:1px 12px;color:#ffa500;border-left:1px solid rgba(255,255,255,.25)">' + (x ? x[i] : '') + '</td>' +
        '<td style="padding:1px 4px">' + (i === Math.floor(b.length / 2) ? '=' : '') + '</td>' + td + fmt(b[i], 4) + '</td></tr>';
    }).join('');
    return '<table style="font-family:Consolas,monospace;border-collapse:collapse;margin:.4rem 0;border-left:2px solid rgba(255,255,255,.4);border-right:2px solid rgba(255,255,255,.4)">' + rows + '</table>';
  }

  /* ---------- Animation (pause med mellemrum) ---------- */
  function animate(T, fn) {
    var last = null, t = 0, paused = false;
    var b = el('button', 'btn sec full', '⏸ Pause animation');
    b.onclick = function () { paused = !paused; b.textContent = paused ? '▶ Afspil animation' : '⏸ Pause animation'; };
    T.controls.appendChild(b);
    function loop(ts) {
      if (last === null) last = ts;
      var dt = Math.min((ts - last) / 1000, 0.1); last = ts;
      if (!paused && !document.hidden) t += dt;
      fn(t);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  return { COL: COL, C: C, Cx: Cx, deg: deg, rad: rad, fmt: fmt, fu: fu, fc: fc, fp: fp,
           task: task, slider: slider, select: select, presets: presets, hint: hint, readout: readout, check: check, steps: steps,
           canvas: canvas, plot: plot, phasor: phasor, circuit: circuit, solve: solve, matHtml: matHtml, animate: animate, el: el };
})();
