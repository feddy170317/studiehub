/* Hurtigstart-oversigt: bygger hele siden ud fra window.CFG (se index.html). */
(function () {
'use strict';
var C = window.CFG, app = document.getElementById('app');
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function tex(root) {
  if (!window.katex) return setTimeout(function () { tex(root); }, 80);
  root.querySelectorAll('[data-tex]').forEach(function (el) { katex.render(el.getAttribute('data-tex'), el, { throwOnError: false, displayMode: false }); });
}
/* "a_G" -> a<sub>G</sub> i almindelig tekst */
function sub(s) { return String(s).replace(/_\{([^}]+)\}/g, '<sub>$1</sub>').replace(/_([A-Za-z0-9θ]+)/g, '<sub>$1</sub>'); }
function svgSub(s) { return esc(s).replace(/_([A-Za-z0-9θ]+)/g, '<tspan baseline-shift="sub" font-size="10">$1</tspan>'); }

var h = '';
h += '<div class="top">' + C.links.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '</a>'; }).join('') + '</div>';
h += '<span class="tag">' + C.tagline + '</span><h1>' + C.h1 + '</h1><p class="lead">' + C.lead + '</p>';
h += '<div class="three">' + C.three.map(function (t) { return '<div class="' + t[0] + '"><b>' + t[1] + '</b>' + t[2] + '</div>'; }).join('') + '</div>';

/* ---------- kort ---------- */
h += '<h2>Det store billede</h2><p class="sub">Klik på et tema for at se, hvad det henter fra de andre.</p>';
var N = C.nodes, svg = '<svg viewBox="0 0 ' + C.mapW + ' ' + C.mapH + '" role="img" aria-label="Kort over hvordan temaerne bygger på hinanden">';
svg += '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="15" markerHeight="15" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7d8fa3"/></marker></defs>';
function anchor(a, b) {
  var ax = a.x + a.w / 2, ay = a.y + a.h / 2, bx = b.x + b.w / 2, by = b.y + b.h / 2;
  if (Math.abs(bx - ax) > Math.abs(by - ay) * 0.8) {
    return bx > ax ? [a.x + a.w, ay, b.x - 4, by] : [a.x, ay, b.x + b.w + 4, by];
  }
  return by > ay ? [ax, a.y + a.h, bx, b.y - 4] : [ax, a.y, bx, b.y + b.h + 4];
}
C.edges.forEach(function (e, i) {
  var p = anchor(N[e[0]], N[e[1]]), id = e[0] + '-' + e[1];
  svg += '<path class="edge" data-e="' + id + '" d="M' + p[0] + ',' + p[1] + ' L' + p[2] + ',' + p[3] + '" marker-end="url(#ah)"' + (e[3] ? ' stroke-dasharray="7 6"' : '') + '/>';
  var vert = Math.abs(p[0] - p[2]) < 20, mx = (p[0] + p[2]) / 2 + (vert ? 10 : 0), my = (p[1] + p[3]) / 2 + (vert ? 4 : -6);
  svg += '<text class="elbl" data-e="' + id + '" x="' + mx + '" y="' + my + '" text-anchor="' + (vert ? 'start' : 'middle') + '">' + svgSub(e[2]) + '</text>';
});
Object.keys(N).forEach(function (k) {
  var n = N[k], cx = n.x + n.w / 2;
  svg += '<g class="node ' + n.k + '" data-n="' + k + '"><rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="12"' + (n.dash ? ' stroke-dasharray="6 5"' : '') + '/>' +
    '<text class="t1x" x="' + cx + '" y="' + (n.y + n.h * 0.32) + '" text-anchor="middle">' + esc(n.l1) + '</text>' +
    '<text class="t2x" x="' + cx + '" y="' + (n.y + n.h * 0.56) + '" text-anchor="middle">' + esc(n.l2) + '</text>' +
    '<text class="t3x" x="' + cx + '" y="' + (n.y + n.h * 0.8) + '" text-anchor="middle">' + svgSub(n.l3) + '</text></g>';
});
svg += '</svg>';
h += '<div class="map">' + svg + '<div class="info" id="info"></div></div>';

/* ---------- værktøjsvælger ---------- */
h += '<h2>Hvilket værktøj passer til spørgsmålet?</h2><p class="sub">Det meste af en opgave er afgjort, når metoden er valgt. Vælg, hvad opgaven spørger om.</p>';
h += '<div class="picker"><div class="qs" id="qs">' + C.qs.map(function (q, i) { return '<button class="' + q[0] + '" data-i="' + i + '">' + q[1] + '</button>'; }).join('') + '</div><div class="ans" id="ans"></div></div>';
if (C.tip) h += '<div class="tip">' + C.tip + '</div>';

/* ---------- decks ---------- */
h += '<h2>' + C.decksTitle + '</h2><p class="sub">' + C.decksSub + '</p><div class="grid">' + C.decks.map(function (d) {
  return '<a class="card ' + d[0] + '" href="' + d[1] + '/"><div class="nr">' + d[2] + '</div><h3>' + d[3] + '</h3><p>' + d[4] + '</p><div class="f" data-tex="' + esc(d[5]) + '"></div><div class="meta">5 slides · ca. 5 min</div></a>';
}).join('') + '</div>';

/* ---------- eksamen ---------- */
h += '<h2>' + C.exTitle + '</h2><table><thead><tr>' + C.exHead.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + C.ex.map(function (e) {
  return '<tr class="' + e[0] + '"><td><b>' + e[1] + '</b></td><td>' + e[2].map(function (o) { return '<a href="' + C.exBase + o[0] + '">' + o[1] + '</a>'; }).join(', ') + '</td><td>' + sub(e[3]) + '</td></tr>';
}).join('') + '</tbody></table>';
if (C.exNote) h += '<p class="exnote">' + C.exNote + '</p>';
h += '<footer>' + C.footer + '</footer>';
app.innerHTML = h;

/* ---------- interaktion ---------- */
var deckOf = {}; C.decks.forEach(function (d) { deckOf[d[0]] = d[1]; });
function show(k) {
  var n = N[k];
  document.querySelectorAll('.node').forEach(function (g) { g.classList.toggle('on', g.dataset.n === k); });
  document.querySelectorAll('.edge,.elbl').forEach(function (e) { var p = e.dataset.e.split('-'); e.classList.toggle('on', p[0] === k || p[1] === k); });
  var info = document.getElementById('info'); info.className = 'info ' + n.k;
  info.innerHTML = '<h3>' + n.t + '</h3><p>' + sub(n.p) + '</p><ul>' + n.li.map(function (s) { return '<li>' + sub(s) + '</li>'; }).join('') + '</ul>' +
    (deckOf[n.k] ? '<a class="go" href="' + deckOf[n.k] + '/">Åbn intro-decket →</a>' : '');
}
document.querySelectorAll('.node').forEach(function (g) { g.addEventListener('click', function () { show(g.dataset.n); }); });
show(Object.keys(N)[0]);
function pick(i) {
  var q = C.qs[i], a = document.getElementById('ans');
  document.querySelectorAll('#qs button').forEach(function (b) { b.classList.toggle('on', +b.dataset.i === i); });
  a.className = 'ans ' + q[0];
  var d = C.decks.filter(function (x) { return x[0] === q[0]; })[0];
  a.innerHTML = '<div class="ex">' + (d ? d[2] : '') + '</div><div class="m" data-tex="' + esc(q[2]) + '"></div><div class="why">' + sub(q[3]) + '</div>' +
    (q[4] ? '<div class="ex">Til eksamen: <a href="' + C.exBase + q[4][0] + '">' + q[4][1] + '</a></div>' : '') +
    (d ? '<a class="go" href="' + d[1] + '/">Intro: ' + d[3] + ' →</a>' : '');
  tex(a);
}
document.querySelectorAll('#qs button').forEach(function (b) { b.addEventListener('click', function () { pick(+b.dataset.i); }); });
pick(0);
tex(app);
})();
