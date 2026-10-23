/* Studiehub 3D-laboratorium: fælles motor for alle scenarier.
 * Klassisk global THREE (r137) — ingen ES-moduler, så siden virker ved dobbeltklik (file://) og offline.
 *
 *   Lab.scene(stageEl, opts)  → 3D-scene med egen orbit (træk = drej, hjul/knib = zoom, dobbeltklik = nulstil)
 *   Lab.arrow(color)          → vektorpil: .set(origin, vec) i verdenskoordinater
 *   Lab.arc(color)            → buet pil om en akse (højrehåndsreglen)
 *   Lab.tag(lab, text, color) → HTML-label der følger et 3D-punkt
 *   Lab.slider/select/seg/check/button/readouts → kontrolpanel
 *   Lab.plot(canvas)          → simpel 2D-graf (akser, kurver, punkter, felter)
 *   Lab.loop(fn)              → animationsløkke; mellemrum = pause (dt = 0, men skydere opdaterer stadig)
 *   Lab.fmt(x, d)             → tal med dansk decimalkomma
 */
(function () {
  'use strict';
  var Lab = (window.Lab = {});
  var EMBED = /(^|[#&])embed\b/.test(location.hash);
  if (EMBED) document.documentElement.classList.add('embed'), document.addEventListener('DOMContentLoaded', function () { document.body.classList.add('embed'); });

  Lab.fmt = function (x, d) {
    if (!isFinite(x)) return '–';
    if (d === undefined) d = Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2;
    return x.toFixed(d).replace('-', '−').replace('.', ',');
  };
  Lab.clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  Lab.lerp = function (a, b, t) { return a + (b - a) * t; };
  Lab.mix = function (c1, c2, t) { // hex-farver → THREE.Color
    var a = new THREE.Color(c1), b = new THREE.Color(c2);
    return a.lerp(b, Lab.clamp(t, 0, 1));
  };

  /* ---------- 3D-scene ---------- */
  Lab.scene = function (stage, opts) {
    opts = opts || {};
    if (!window.THREE) { stage.innerHTML = '<p style="padding:2rem;color:#ff5e5e">Three.js kunne ikke indlæses (assets/three.min.js mangler).</p>'; throw new Error('THREE mangler'); }
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch (e) { stage.innerHTML = '<p style="padding:2rem;color:#ff5e5e">Din browser kunne ikke starte WebGL (3D). Prøv en anden browser eller slå hardwareacceleration til.</p>'; throw e; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = 'gl';
    stage.insertBefore(renderer.domElement, stage.firstChild);
    var tags = document.createElement('div'); tags.className = 'lab-tags'; stage.appendChild(tags);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(opts.fov || 40, 1, 0.01, 500);
    scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x1a2633, 0.85));
    var sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(3, 6, 4); scene.add(sun);
    var fill = new THREE.DirectionalLight(0x9fd2ff, 0.3); fill.position.set(-4, 2, -3); scene.add(fill);

    var o = { target: new THREE.Vector3(), theta: 0.6, phi: 1.15, radius: 4 };
    var home = {};
    function setView(v) {
      if (v.target) o.target.copy(v.target);
      if (v.theta !== undefined) o.theta = v.theta;
      if (v.phi !== undefined) o.phi = v.phi;
      if (v.radius !== undefined) o.radius = v.radius;
    }
    function saveHome() { home = { target: o.target.clone(), theta: o.theta, phi: o.phi, radius: o.radius }; }
    setView(opts.view || {}); saveHome();
    var minR = opts.minRadius || 0.2, maxR = opts.maxRadius || 60;

    function applyCam() {
      o.phi = Lab.clamp(o.phi, 0.08, Math.PI - 0.08);
      o.radius = Lab.clamp(o.radius, minR, maxR);
      var s = Math.sin(o.phi);
      camera.position.set(o.target.x + o.radius * s * Math.sin(o.theta), o.target.y + o.radius * Math.cos(o.phi), o.target.z + o.radius * s * Math.cos(o.theta));
      camera.lookAt(o.target);
    }

    // egen orbit: mus + touch (1 finger drej, 2 fingre knib-zoom)
    var el = renderer.domElement, drag = null, pinch = null, auto = !!(EMBED || opts.autoRotate), lastTap = 0;
    el.addEventListener('pointerdown', function (e) {
      el.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; auto = false;
      var now = Date.now(); if (now - lastTap < 300) setView(home); lastTap = now;
    });
    el.addEventListener('pointermove', function (e) {
      if (!drag || pinch || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
      if (e.buttons === 2 || e.shiftKey) { // panorér
        var k = o.radius * 0.0016, right = new THREE.Vector3(), up = new THREE.Vector3();
        camera.matrix.extractBasis(right, up, new THREE.Vector3());
        o.target.addScaledVector(right, -dx * k).addScaledVector(up, dy * k);
      } else { o.theta -= dx * 0.008; o.phi -= dy * 0.008; }
    });
    el.addEventListener('pointerup', function () { drag = null; });
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('wheel', function (e) { e.preventDefault(); o.radius *= Math.exp(e.deltaY * 0.0012); }, { passive: false });
    el.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) { pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); drag = null; }
    }, { passive: true });
    el.addEventListener('touchmove', function (e) {
      if (pinch && e.touches.length === 2) {
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        o.radius *= pinch / d; pinch = d;
      }
    }, { passive: true });
    el.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinch = null; });

    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    var tagList = [], v3 = new THREE.Vector3();
    function placeTags() {
      var w = stage.clientWidth, h = stage.clientHeight;
      for (var i = 0; i < tagList.length; i++) {
        var t = tagList[i];
        if (!t.visible) { t.el.style.display = 'none'; continue; }
        v3.copy(t.pos).project(camera);
        if (v3.z > 1) { t.el.style.display = 'none'; continue; }
        t.el.style.display = '';
        t.el.style.left = ((v3.x + 1) / 2 * w) + 'px';
        t.el.style.top = ((1 - v3.y) / 2 * h) + 'px';
      }
    }
    var lab = {
      scene: scene, camera: camera, renderer: renderer, stage: stage, tagLayer: tags, tags: tagList, orbit: o,
      setView: function (v, asHome) { setView(v); if (asHome) saveHome(); },
      render: function (dt) {
        if (auto) o.theta += (dt || 0.016) * 0.25;
        applyCam(); renderer.render(scene, camera); placeTags();
      },
      resize: resize
    };
    return lab;
  };

  Lab.tag = function (lab, text, color) {
    var el = document.createElement('div'); el.className = 'lab-tag'; el.innerHTML = text; el.style.color = color || '#e3e9ef';
    lab.tagLayer.appendChild(el);
    var t = { el: el, pos: new THREE.Vector3(), visible: true, set: function (p, txt) { this.pos.copy(p); if (txt !== undefined && txt !== this._t) { el.innerHTML = txt; this._t = txt; } return this; } };
    lab.tags.push(t); return t;
  };

  /* Vektorpil: skaft + kegle. set(origin, vec, maxLen) — skjules når vektoren ≈ 0. */
  Lab.arrow = function (color, opts) {
    opts = opts || {};
    var r = opts.radius || 0.012;
    var mat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.35, roughness: 0.5 });
    var g = new THREE.Group();
    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 12), mat);
    var head = new THREE.Mesh(new THREE.ConeGeometry(r * 2.8, 1, 16), mat);
    g.add(shaft); g.add(head);
    var up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3();
    g.set = function (origin, vec) {
      var L = vec.length();
      if (L < 1e-6) { g.visible = false; return g; }
      g.visible = true;
      var hl = Math.min(r * 9, L * 0.45);
      shaft.scale.set(1, L - hl, 1); shaft.position.set(0, (L - hl) / 2, 0);
      head.scale.set(1, hl, 1); head.position.set(0, L - hl / 2, 0);
      g.position.copy(origin);
      dir.copy(vec).normalize(); g.quaternion.setFromUnitVectors(up, dir);
      return g;
    };
    return g;
  };

  /* Buet pil om aksen axis (enhedsvektor) gennem center: sign = ±1 (højrehåndsregel), radius rad. */
  Lab.arc = function (color, opts) {
    opts = opts || {};
    var mat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.35 });
    var g = new THREE.Group(), tube = null, head = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.09, 14), mat);
    g.add(head);
    g.set = function (center, axis, radius, sign, sweep) {
      if (!sign) { g.visible = false; return g; }
      g.visible = true; sweep = sweep || 4.2;
      if (tube) { g.remove(tube); tube.geometry.dispose(); }
      var pts = [], N = 40;
      for (var i = 0; i <= N; i++) { var a = sign * sweep * i / N; pts.push(new THREE.Vector3(radius * Math.cos(a), 0, -radius * Math.sin(a))); }
      tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, opts.thick || 0.008, 8, false), mat);
      g.add(tube);
      var aEnd = sign * sweep, tip = pts[N];
      head.position.copy(tip);
      var tan = new THREE.Vector3(-Math.sin(aEnd), 0, -Math.cos(aEnd)).multiplyScalar(sign);
      head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan.normalize());
      g.position.copy(center);
      g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize());
      return g;
    };
    return g;
  };

  /* ---------- kontrolpanel ---------- */
  function row(parent, html) { var d = document.createElement('div'); d.className = 'ctl'; d.innerHTML = html; parent.appendChild(d); return d; }
  Lab.slider = function (parent, o) {
    var d = row(parent, '<label><span>' + o.label + '</span><span class="v"></span></label><input type="range">' + (o.sub ? '<div class="sub">' + o.sub + '</div>' : ''));
    var inp = d.querySelector('input'), v = d.querySelector('.v');
    inp.min = o.min; inp.max = o.max; inp.step = o.step || 'any'; inp.value = o.value;
    var api = {
      el: inp,
      get: function () { return parseFloat(inp.value); },
      set: function (x, silent) { inp.value = x; show(); if (!silent && o.onInput) o.onInput(api.get()); },
      range: function (min, max, step) { inp.min = min; inp.max = max; if (step) inp.step = step; show(); },
      show: show
    };
    function show() { v.textContent = (o.fmt ? o.fmt(api.get()) : Lab.fmt(api.get())) + (o.unit ? ' ' + o.unit : ''); }
    inp.addEventListener('input', function () { show(); if (o.onInput) o.onInput(api.get()); });
    show(); return api;
  };
  Lab.select = function (parent, o) {
    var d = row(parent, '<label><span>' + o.label + '</span></label><select></select>' + (o.sub ? '<div class="sub">' + o.sub + '</div>' : ''));
    var s = d.querySelector('select');
    o.options.forEach(function (op) { var e = document.createElement('option'); e.value = op.value; e.textContent = op.label; s.appendChild(e); });
    if (o.value !== undefined) s.value = o.value;
    s.addEventListener('change', function () { if (o.onChange) o.onChange(s.value); });
    return { el: s, get: function () { return s.value; }, set: function (x, silent) { s.value = x; if (!silent && o.onChange) o.onChange(x); } };
  };
  Lab.seg = function (parent, o) {
    var d = row(parent, (o.label ? '<label><span>' + o.label + '</span></label>' : '') + '<div class="seg"></div>');
    var box = d.querySelector('.seg'), cur = o.value, btns = {};
    o.options.forEach(function (op) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = op.label; btns[op.value] = b;
      b.onclick = function () { api.set(op.value); }; box.appendChild(b);
    });
    var api = { get: function () { return cur; }, set: function (v, silent) { cur = v; for (var k in btns) btns[k].classList.toggle('on', k == v); if (!silent && o.onChange) o.onChange(v); } };
    api.set(cur, true); return api;
  };
  Lab.check = function (parent, o) {
    var l = document.createElement('label'); l.className = 'chk';
    l.innerHTML = '<input type="checkbox"' + (o.value ? ' checked' : '') + '><span>' + o.label + '</span>';
    parent.appendChild(l);
    var c = l.querySelector('input'); c.addEventListener('change', function () { if (o.onChange) o.onChange(c.checked); });
    return { get: function () { return c.checked; }, set: function (v) { c.checked = v; } };
  };
  Lab.button = function (parent, label, cls, fn) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (cls || ''); b.innerHTML = label; b.onclick = fn; parent.appendChild(b); return b;
  };
  /* readouts(parent, [[key, label], ...]) → set(key, text, cls) */
  Lab.readouts = function (parent, rows) {
    var g = document.createElement('div'); g.className = 'ro'; parent.appendChild(g); var map = {};
    rows.forEach(function (r) {
      if (r === '-') { g.appendChild(document.createElement('hr')); return; }
      var k = document.createElement('div'); k.className = 'k'; k.innerHTML = r[1];
      var x = document.createElement('div'); x.className = 'x'; x.textContent = '–';
      g.appendChild(k); g.appendChild(x); map[r[0]] = x;
    });
    return { set: function (key, txt, cls) { var x = map[key]; if (!x) return; if (x._t !== txt) { x.innerHTML = txt; x._t = txt; } x.className = 'x' + (cls ? ' ' + cls : ''); } };
  };

  /* ---------- 2D-graf ---------- */
  Lab.plot = function (canvas) {
    var ctx = canvas.getContext('2d'), W = 0, H = 0, pad = { l: 46, r: 10, t: 10, b: 30 }, ax = null;
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); W = w; H = h;
    }
    function X(x) { return pad.l + (x - ax.xmin) / (ax.xmax - ax.xmin) * (W - pad.l - pad.r); }
    function Y(y) { return H - pad.b - (y - ax.ymin) / (ax.ymax - ax.ymin) * (H - pad.t - pad.b); }
    function nice(span) { var p = Math.pow(10, Math.floor(Math.log10(span / 4))), m = span / 4 / p; return p * (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10); }
    var P = {
      begin: function (a) {
        size(); ax = a; ctx.clearRect(0, 0, W, H);
        ctx.font = '11px Segoe UI, sans-serif'; ctx.lineWidth = 1;
        var sx = nice(a.xmax - a.xmin), sy = nice(a.ymax - a.ymin), fx = a.fx || Lab.fmt, fy = a.fy || Lab.fmt;
        ctx.strokeStyle = 'rgba(143,163,184,.13)'; ctx.fillStyle = '#8fa3b8';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (var x = Math.ceil(a.xmin / sx) * sx; x <= a.xmax + 1e-9; x += sx) { ctx.beginPath(); ctx.moveTo(X(x), pad.t); ctx.lineTo(X(x), H - pad.b); ctx.stroke(); ctx.fillText(fx(x), X(x), H - pad.b + 4); }
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        for (var y = Math.ceil(a.ymin / sy) * sy; y <= a.ymax + 1e-9; y += sy) { ctx.beginPath(); ctx.moveTo(pad.l, Y(y)); ctx.lineTo(W - pad.r, Y(y)); ctx.stroke(); ctx.fillText(fy(y), pad.l - 5, Y(y)); }
        ctx.strokeStyle = 'rgba(143,163,184,.55)';
        if (a.ymin < 0 && a.ymax > 0) { ctx.beginPath(); ctx.moveTo(pad.l, Y(0)); ctx.lineTo(W - pad.r, Y(0)); ctx.stroke(); }
        if (a.xmin < 0 && a.xmax > 0) { ctx.beginPath(); ctx.moveTo(X(0), pad.t); ctx.lineTo(X(0), H - pad.b); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();
        ctx.fillStyle = '#8fa3b8'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        if (a.xlabel) ctx.fillText(a.xlabel, W - pad.r, H - 1);
        ctx.save(); ctx.translate(11, pad.t); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; if (a.ylabel) ctx.fillText(a.ylabel, 0, 0); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(pad.l, pad.t - 2, W - pad.l - pad.r + 2, H - pad.t - pad.b + 4); ctx.clip();
        return P;
      },
      end: function () { ctx.restore(); return P; },
      line: function (pts, color, w, dash) {
        if (!pts.length) return P;
        ctx.strokeStyle = color; ctx.lineWidth = w || 2; ctx.setLineDash(dash || []); ctx.beginPath();
        pts.forEach(function (p, i) { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); });
        ctx.stroke(); ctx.setLineDash([]); return P;
      },
      fill: function (pts, color) {
        ctx.fillStyle = color; ctx.beginPath();
        pts.forEach(function (p, i) { if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); });
        ctx.closePath(); ctx.fill(); return P;
      },
      dot: function (x, y, color, r) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(x), Y(y), r || 4.5, 0, 7); ctx.fill(); ctx.strokeStyle = '#0a1a2b'; ctx.lineWidth = 1.5; ctx.stroke(); return P; },
      hline: function (y, color, label, dash) {
        P.line([[ax.xmin, y], [ax.xmax, y]], color, 1.2, dash || [5, 4]);
        if (label) { ctx.fillStyle = color; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(label, W - pad.r - 2, Y(y) - 2); }
        return P;
      },
      vline: function (x, color, label, dash) {
        P.line([[x, ax.ymin], [x, ax.ymax]], color, 1.2, dash || [5, 4]);
        if (label) { ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(label, X(x) + 3, pad.t + 2); }
        return P;
      },
      text: function (x, y, txt, color, align) { ctx.fillStyle = color || '#e3e9ef'; ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, X(x), Y(y)); return P; },
      X: X, Y: Y, ctx: ctx
    };
    return P;
  };

  /* ---------- løkke med pause ---------- */
  Lab.loop = function (fn, opts) {
    opts = opts || {};
    var paused = false, last = performance.now(), flag = opts.flag, btn = opts.button;
    function setPaused(p) {
      paused = p; if (flag) flag.classList.toggle('on', p);
      if (btn) { btn.textContent = p ? '▶ Fortsæt' : '⏸ Pause'; btn.classList.toggle('gold', p); }
    }
    if (btn) btn.onclick = function () { setPaused(!paused); };
    window.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); setPaused(!paused); }
      else if (e.code === 'Space' && document.activeElement && document.activeElement.type === 'range') { e.preventDefault(); setPaused(!paused); }
    });
    function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      try { fn(paused ? 0 : dt, dt); } catch (err) { console.error(err); showError(err); return; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return { pause: function () { setPaused(true); }, play: function () { setPaused(false); }, paused: function () { return paused; } };
  };

  /* ---------- sidelayout ----------
   * Lab.build({ chip, title, src, side: ['Last', ...], graphs: [{id, title, sub}], formulas: true,
   *             notes: '<li>..</li>', model: '<li>..</li>', legend: true })
   * → { stage, status, note, legend, paused, side: [cardEl...], formulas, graphs: {id: canvas} } */
  Lab.build = function (c) {
    var b = document.body, h = '';
    h += '<header class="lab-top"><a class="back" href="../index.html">← 3D-lab</a><span class="chip">' + c.chip + '</span><h1>' + c.title + '</h1>' + (c.src ? '<span class="src">' + c.src + '</span>' : '') + '</header>';
    h += '<main class="lab-main"><section class="lab-stage" id="stage"><div class="lab-hud"><div class="lab-status" id="status"></div><div class="lab-note" id="note"></div></div>' +
      '<div class="lab-paused" id="pausedFlag">PAUSE · mellemrum fortsætter</div><div class="lab-legend" id="legend"' + (c.legend === false ? ' style="display:none"' : '') + '></div>' +
      '<div class="lab-hint">Træk = drej · hjul/knib = zoom · dobbeltklik = nulstil visning · mellemrum = pause</div></section><aside class="lab-side">';
    (c.side || []).forEach(function (t, i) { h += '<div class="card" id="side' + i + '"><h2>' + t + '</h2></div>'; });
    h += '</aside></main>';
    if (c.graphs && c.graphs.length) {
      h += '<section class="lab-graphs" style="grid-template-columns:repeat(' + c.graphs.length + ',minmax(0,1fr))">';
      c.graphs.forEach(function (g) { h += '<div class="graph"><h3><span class="gt">' + g.title + '</span>' + (g.sub ? ' <span>' + g.sub + '</span>' : '') + '</h3><canvas id="' + g.id + '"></canvas>' + (g.extra || '') + '</div>'; });
      h += '</section>';
    }
    h += '<section class="lab-text"><div class="card"><h2>Formler med dine tal</h2><div id="formulas"></div></div><div class="card"><h2>Hvad skal du lægge mærke til?</h2><ul>' + (c.notes || '') + '</ul>' +
      (c.model ? '<h2 style="margin-top:.8rem">Model og antagelser</h2><ul>' + c.model + '</ul>' : '') + '</div></section>';
    b.insertAdjacentHTML('afterbegin', h);
    if (/(^|[#&])embed\b/.test(location.hash)) b.classList.add('embed');
    var g = {}; (c.graphs || []).forEach(function (x) { g[x.id] = document.getElementById(x.id); });
    return {
      stage: document.getElementById('stage'), status: document.getElementById('status'), note: document.getElementById('note'),
      legend: document.getElementById('legend'), paused: document.getElementById('pausedFlag'), formulas: document.getElementById('formulas'),
      side: (c.side || []).map(function (_, i) { return document.getElementById('side' + i); }), graphs: g
    };
  };
  Lab.setStatus = function (el, txt, kind) { if (el._t !== txt) { el.textContent = txt; el._t = txt; } el.className = 'lab-status' + (kind ? ' ' + kind : ''); };
  Lab.legendKeys = function (el, keys) { // [[farve, html], ...]
    el.innerHTML = keys.map(function (k) { return '<div class="key"><span class="sw" style="background:' + k[0] + '"></span><span>' + k[1] + '</span></div>'; }).join('');
  };
  Lab.n = function (x, d) { return '<span class="num">' + Lab.fmt(x, d) + '</span>'; };
  Lab.F = function (expr, where) { return '<div class="f">' + expr + '</div>' + (where ? '<div class="where">' + where + '</div>' : ''); };
  Lab.presets = function (parent, list) { // [[html, fn], ...]
    var d = document.createElement('div'); d.className = 'btns'; parent.appendChild(d);
    list.forEach(function (p) { Lab.button(d, p[0], 'preset', p[1]); }); return d;
  };
  Lab.btnRow = function (parent) { var d = document.createElement('div'); d.className = 'btns'; parent.appendChild(d); return d; };

  /* ---------- farver ---------- */
  var C_BLUE = new THREE.Color(0x5ec8ff), C_GREY = new THREE.Color(0x7d8fa3), C_RED = new THREE.Color(0xff5e5e);
  var HEAT = [0x16365c, 0x2f7fd1, 0x3fd0c9, 0xb6e35a, 0xffc93c, 0xff5e3a].map(function (x) { return new THREE.Color(x); });
  Lab.cmapDiv = function (t, out) { // t ∈ [-1, 1]: tryk blå → grå → træk rød
    out = out || new THREE.Color(); t = Lab.clamp(t, -1, 1);
    return out.copy(C_GREY).lerp(t < 0 ? C_BLUE : C_RED, Math.abs(t));
  };
  Lab.cmapHeat = function (t, out) { // t ∈ [0, 1]: lav → høj
    out = out || new THREE.Color(); t = Lab.clamp(t, 0, 1) * (HEAT.length - 1);
    var i = Math.min(HEAT.length - 2, Math.floor(t)); return out.copy(HEAT[i]).lerp(HEAT[i + 1], t - i);
  };
  Lab.heatCSS = 'linear-gradient(90deg,#16365c,#2f7fd1,#3fd0c9,#b6e35a,#ffc93c,#ff5e3a)';
  Lab.divCSS = 'linear-gradient(90deg,#5ec8ff,#7d8fa3,#ff5e5e)';
  Lab.mat = function (color, o) {
    o = o || {};
    return new THREE.MeshStandardMaterial({ color: color, metalness: o.metal !== undefined ? o.metal : 0.35, roughness: o.rough !== undefined ? o.rough : 0.5,
      transparent: !!o.opacity, opacity: o.opacity || 1, side: o.double ? THREE.DoubleSide : THREE.FrontSide, emissive: o.emissive || 0x000000, vertexColors: !!o.vc });
  };

  /* ---------- geometri ---------- */
  // cylinder (stang) mellem to punkter: rod = Lab.rod(radius, mat); rod.between(a, b)
  Lab.rod = function (radius, mat, seg) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, seg || 16), mat), up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
    m.between = function (a, b) {
      d.subVectors(b, a); var L = d.length();
      m.visible = L > 1e-9; if (!m.visible) return m;
      m.scale.set(1, L, 1); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(up, d.normalize()); return m;
    };
    return m;
  };
  // skruefjeder langs +y fra 0 til length: spring = Lab.spring({R, wire, turns, mat}); spring.set(length) eller spring.between(a, b)
  Lab.spring = function (o) {
    var R = o.R || 0.05, wire = o.wire || 0.006, turns = o.turns || 10, mat = o.mat || Lab.mat(0xc9d6e3, { metal: 0.7, rough: 0.3 });
    var g = new THREE.Group(), mesh = null, lastL = -1, up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
    g.set = function (L) {
      if (Math.abs(L - lastL) < 1e-5) return g; lastL = L;
      if (mesh) { g.remove(mesh); mesh.geometry.dispose(); }
      var pts = [], N = Math.max(60, turns * 24);
      for (var i = 0; i <= N; i++) {
        var t = i / N, a = t * turns * 2 * Math.PI, end = (i < 6 || i > N - 6);
        pts.push(new THREE.Vector3((end ? 0.98 : 1) * R * Math.cos(a), t * L, R * Math.sin(a)));
      }
      mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, wire, 8, false), mat);
      g.add(mesh); return g;
    };
    g.between = function (a, b) { d.subVectors(b, a); g.set(d.length()); g.position.copy(a); g.quaternion.setFromUnitVectors(up, d.normalize()); return g; };
    g.material = mat;
    return g;
  };
  // tandhjul (ekstruderet, akse langs y): R = delecirkelradius, m = modul. Returnerer {geo, N}
  Lab.gearGeo = function (R, m, depth, hole) {
    var N = Math.max(6, Math.round(2 * R / m)), p = 2 * Math.PI / N, rt = R + m, rr = R - 1.25 * m, sh = new THREE.Shape();
    for (var i = 0; i < N; i++) {
      var a = i * p, pts = [[rr, a - 0.5 * p], [rr, a - 0.27 * p], [rt, a - 0.11 * p], [rt, a + 0.11 * p], [rr, a + 0.27 * p]];
      pts.forEach(function (q, j) { var x = q[0] * Math.cos(q[1]), y = q[0] * Math.sin(q[1]); if (i === 0 && j === 0) sh.moveTo(x, y); else sh.lineTo(x, y); });
    }
    sh.closePath();
    if (hole) { var hp = new THREE.Path(); hp.absarc(0, 0, hole, 0, 2 * Math.PI, true); sh.holes.push(hp); }
    var geo = new THREE.ExtrudeGeometry(sh, { depth: depth, bevelEnabled: false, curveSegments: 6 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, -depth / 2, 0);
    return { geo: geo, N: N };
  };
  // linje(r) til hjælpelinjer: Lab.line(color, dashed) → obj.set([v3, v3, ...])
  Lab.line = function (color, dashed, opacity) {
    var geo = new THREE.BufferGeometry(), mat = dashed ? new THREE.LineDashedMaterial({ color: color, dashSize: 0.04, gapSize: 0.03, transparent: true, opacity: opacity || 0.8 })
      : new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity || 0.8 });
    var l = new THREE.Line(geo, mat);
    l.set = function (pts) { geo.setFromPoints(pts); if (dashed) l.computeLineDistances(); geo.computeBoundingSphere(); return l; };
    return l;
  };
  Lab.grid = function (lab, size, y) { var g = new THREE.GridHelper(size, Math.round(size * 5), 0x2a4560, 0x1a3248); g.position.y = y || 0; lab.scene.add(g); return g; };

  function showError(err) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;background:#3a1418;color:#ffb3b3;border:1px solid #ff5e5e;padding:.7rem 1rem;border-radius:8px;font:13px Consolas,monospace;z-index:99';
    d.textContent = 'Fejl i laboratoriet: ' + (err && err.message || err); document.body.appendChild(d);
  }
  window.addEventListener('error', function (e) { if (e && e.message) showError(e.message); });
})();
