// Natteskift 3D: HUD. Startskærm, beskeder, statuschips, instrumenter (fart, plov, fritlegeme), telemetri,
// minikort, værkstedsliste (reserve, når garage.js mangler), slutskærm og hjælp. Ingen 3D her; world.js styrer spillet.
// Logik og tekster er genbrugt fra 2D-spillets UI-script (Simulering/Snerydderspil/index.html).
(() => {
'use strict';
const $ = id => document.getElementById(id);
const fmt = (x, d = 0) => { let t = (Number.isFinite(x) ? x : 0).toFixed(d); if (/^-0(\.0*)?$/.test(t)) t = t.slice(1); return t.replace('.', ',').replace('-', '−'); };
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const clock = t => { const m = 120 + Math.floor(t / 60); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const tilbage = st => { const left = Math.max(0, st.slut - st.t); return Math.floor(left / 3600) + ' t ' + String(Math.floor(left % 3600 / 60)).padStart(2, '0') + ' min tilbage'; };
const kr = x => Math.round(x).toLocaleString('da-DK') + ' kr';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
let DPR = Math.min(2, devicePixelRatio || 1);
let cb = {};

// ---------- startskærm
let valg = { scen: 'let', tire: 'vinter', ballast: 0, svaer: 'ing' };
try { const s = JSON.parse(localStorage.getItem('snerydder3d-valg') || 'null'); if (s && SCENARIER[s.scen]) valg = { ...valg, ...s }; } catch (e) {}
function renderStart() {
  $('scenList').innerHTML = Object.entries(SCENARIER).map(([k, s]) => {
    const f = s.faser[0];
    const w = s.faser.length > 1 ? s.faser.length + ' faser' : fmt(f.T) + ' °C · ' + (f.sne ? fmt(f.sne, 1) + ' cm/t' : f.is ? fmt(f.is, 1) + ' mm is/t' : 'ingen nedbør');
    return `<button data-k="${k}" aria-pressed="${valg.scen === k}"><span class="kf">${s.kf}</span><span class="nm">${s.navn}</span><span class="d">${s.kort}</span><span class="w">${w}</span></button>`;
  }).join('');
  $('segTire').innerHTML = Object.entries(DAEK).map(([k, d]) => `<button data-t="${k}" aria-pressed="${valg.tire === k}">${d.navn}</button>`).join('');
  for (const b of $('segBallast').children) b.setAttribute('aria-pressed', +b.dataset.b === valg.ballast);
  for (const b of $('segDiff').children) b.setAttribute('aria-pressed', b.dataset.d === valg.svaer);
}
function saveValg() { try { localStorage.setItem('snerydder3d-valg', JSON.stringify(valg)); } catch (e) {} }

// ---------- modaler
const MODALS = ['mStart', 'mShop', 'mEnd', 'mHelp'];
const anyModal = () => MODALS.some(m => !$(m).hidden);
function showModal(id, on) { $(id).hidden = !on; if (cb.modalChanged) cb.modalChanged(); }

// ---------- beskeder
let toastsSeen = 0; const recent = {};
function toast(ev) {
  if (!ev) return;
  const el = document.createElement('div'); el.className = 'toast ' + (ev.sev || 'info');
  el.innerHTML = '<b></b><span></span>'; el.firstChild.textContent = ev.title || ''; el.lastChild.textContent = ev.msg || '';
  const box = $('toasts'); box.prepend(el);
  const maxN = innerWidth <= 600 ? 2 : 4;
  while (box.children.length > maxN) box.lastChild.remove();
  setTimeout(() => el.remove(), ev.sev === 'crit' ? 14000 : 8000);
}
function pumpEvents(sim) {
  const E = sim.st.events, now = performance.now();
  while (toastsSeen < E.length) {
    const ev = E[toastsSeen++]; if (!ev) continue;
    const k = String(ev.key || ev.title || '').replace(/\d$/, '');
    if (recent[k] && now - recent[k] < 9000 && ev.sev !== 'crit') continue;
    recent[k] = now; toast(ev);
  }
}
function reset() { toastsSeen = 0; for (const k in recent) delete recent[k]; $('toasts').innerHTML = ''; endChartSim = null; }

// ---------- telemetri
const SIDE_ROWS = [
  ['Motortemperatur', s => s.motorOK ? [(s.temp + 15) / 170, fmt(s.temp) + ' °C', s.temp > 140 ? 1 : s.temp > 120 ? 0.75 : 0] : [1, 'brændt', 1]],
  ['Slipkobling, slid', s => [s.clutchWear, fmt(Math.min(1, s.clutchWear) * 100) + ' %']],
  ['Mellemaksel, udmattelse', s => s.shaftOK ? [s.shaftD, fmt(s.shaftD * 100, s.shaftD < 0.1 ? 1 : 0) + ' %'] : [1, 'knækket', 1]],
  ['Lejer, brugt levetid', s => [1 - Math.max(0, s.bearing), fmt((1 - Math.max(0, s.bearing)) * 100, 1) + ' %']],
  ['Kæde, længning', s => s.chainOK ? [s.chain / 3, fmt(s.chain, 2) + ' %'] : [1, 'af', 1]],
  ['Moment, mellemaksel', s => [s.Tmel / 36, fmt(s.Tmel, 1) + ' Nm']],
  ['Motormoment', s => [s.Tm / 2.5, fmt(s.Tm, 2) + ' Nm', s.Tm > 1.5 ? 0.75 : 0]],
];
function buildTele() {
  $('dtBody').innerHTML = '<tr><th></th><th>V</th><th>H</th></tr>' + SIDE_ROWS.map((r, k) => `<tr><td class="n">${r[0]}</td><td class="c"><div class="bar"><i id="b${k}0"></i><em id="e${k}0"></em></div></td><td class="c"><div class="bar"><i id="b${k}1"></i><em id="e${k}1"></em></div></td></tr>`).join('');
}
function setBar(id, frac, txt, forced) {
  const i = $('b' + id), e = $('e' + id); frac = clamp(frac, 0, 1);
  i.style.width = (frac * 100).toFixed(1) + '%';
  const lvl = forced !== undefined && forced !== 0 ? forced : frac;
  i.className = lvl >= 0.95 ? 'crit' : lvl >= 0.7 ? 'warn' : ''; e.textContent = txt;
}
function rows(el, list) { el.innerHTML = list.map(([l, r, c]) => `<span class="l">${l}</span><span class="r ${c || ''}">${r}</span>`).join(''); }
let teleOpen = innerWidth > 900;
function setTele(on) { teleOpen = on; $('tele').classList.toggle('lukket', !on); $('btnTele').classList.toggle('on', on); }

function update(sim, ui) {
  const st = sim.st, R = sim.R, S = sim.S, L = st.live || {}, P = L.P || {}, C = sim.C;
  $('vClock').textContent = clock(st.t);
  $('vLeft').textContent = tilbage(st);
  $('vRyd').textContent = fmt(st.ryddet * 100) + ' %';
  $('vRyd').style.color = st.ryddet >= 0.95 ? 'var(--ok)' : '';
  $('pRyd').style.width = (clamp(st.ryddet, 0, 1) * 100).toFixed(1) + '%';
  $('pRyd').className = st.ryddet >= 0.95 ? 'ok' : '';
  $('vBat').textContent = fmt(R.soc * 100) + ' %';
  $('vBat').style.color = R.soc < 0.12 ? 'var(--crit)' : R.soc < 0.25 ? 'var(--warn)' : '';
  $('pBat').style.width = (clamp(R.soc, 0, 1) * 100).toFixed(1) + '%';
  $('pBat').className = R.soc < 0.12 ? 'crit' : R.soc < 0.25 ? 'warn' : 'ok';
  $('vBatS').textContent = fmt(R.soc * C.Ebatt * sim.kT(), 2) + ' kWh · ' + fmt(L.Ptot || 0) + ' W';
  $('vVejr').textContent = st.w.navn + ', ' + fmt(st.w.T, 1) + ' °C';
  $('vVejrS').textContent = (st.w.sne ? fmt(st.w.sne, 1) + ' cm sne/t' : st.w.is ? fmt(st.w.is, 1) + ' mm is/t' : 'ingen nedbør') + ' · vind ' + st.w.vind + ' m/s';
  $('teleSub').textContent = fmt(C.m0 + R.ballast) + ' kg · ' + DAEK[R.tire].navn.toLowerCase();
  if (teleOpen) {
    SIDE_ROWS.forEach((r, k) => { for (let i = 0; i < 2; i++) { const [f, t, forced] = r[1](S[i]); setBar(k + '' + i, f, t, forced); } });
    $('surf').innerHTML = S.map((s, i) => `<div><div class="t">${i ? 'Højre' : 'Venstre'} side</div><div class="u" style="color:${s.surf === 2 ? 'var(--ice)' : s.surf === 1 ? 'var(--snow)' : 'var(--muted)'}">${UNDERLAG[s.surf]}</div><div class="m">μ ${fmt(s.mu, 2)} · maks ${fmt(s.lim)} N</div><div class="m" style="color:${s.limited ? (s.limBy === 'trac' ? 'var(--warn)' : 'var(--crit)') : 'var(--muted)'}">${s.limited ? (s.limBy === 'trac' ? 'hjulspin' : s.limBy === 'clutch' ? 'koblingen glider' : s.limBy === 'dead' ? 'trækker ikke' : 'motor på maks.') : 'greb ok'}</div></div>`).join('');
    const Fr = S.reduce((a, s) => a + (C.crr + 0.5 * Math.min(s.dd || 0, 0.3)) * (L.Nn || 0) / 2, 0);
    const Ftr = S[0].F + S[1].F, Fmax = S[0].lim + S[1].lim;
    const u = Math.max(Math.abs(S[0].F) / Math.max(1, S[0].lim), Math.abs(S[1].F) / Math.max(1, S[1].lim));
    const limName = { trac: 'friktion μ · N', clutch: 'slipkobling', motor: 'motor', dead: 'ingen træk' };
    const by = S[0].lim <= S[1].lim ? S[0].limBy : S[1].limBy;
    rows($('forceRows'), [
      ['Plovkraft F<sub>plov</sub>', fmt(P.F || 0) + ' N'],
      ['  heraf kile μ<sub>G</sub> · m · g', fmt(P.Fkile || 0) + ' N'],
      ['  heraf impuls ρ · h · B · v²', fmt(P.Fimp || 0, 1) + ' N'],
      ['Rullemodstand c<sub>rr</sub> · N', fmt(Fr) + ' N'],
      ['Drejemodstand (skrub)', fmt((L.Fturn || 0) * 2) + ' N'],
      ['Trækkraft i alt', fmt(Ftr) + ' N'],
      ['Største trækkraft', fmt(Fmax) + ' N' + (limName[by] ? ' · ' + limName[by] : '')],
      ['Udnyttelse', fmt(u * 100) + ' %', u > 0.98 ? 'crit' : u > 0.8 ? 'warn' : 'ok'],
    ]);
    const a = Math.abs(R.ang);
    $('hPlov').textContent = (R.down ? 'sænket' : 'løftet') + ' · ' + fmt(a) + '°' + (a > 1 ? ' · kaster til ' + (R.ang > 0 ? 'venstre' : 'højre') : ' · skubber');
    rows($('plovRows'), [
      ['Vinkel θ (mål)', fmt(R.ang) + '° (' + fmt(R.angTarget) + '°)'],
      ['Arbejdsbredde B · cos θ', fmt(C.B * Math.cos(a * Math.PI / 180), 2) + ' m'],
      ['Kapacitet h<sub>kap</sub>', fmt((P.hkap || 0) * 100, 1) + ' cm'],
      ['Sne foran skjoldet', fmt((P.hInd || 0) * 100, 1) + ' cm', (P.hInd || 0) > (P.hkap || 1) ? 'warn' : ''],
      ['Kilen fyldt', fmt((P.fill || 0) * 100) + ' %', (P.fill || 0) > 0.97 ? 'crit' : (P.fill || 0) > 0.8 ? 'warn' : ''],
      ['Snedensitet ρ', fmt(sim.rho()) + ' kg/m³'],
      ['Skjold', fmt(R.plovH * 100) + ' %', R.plovH < 0.95 ? 'warn' : ''],
      ['Arbejdsfart (Z/X)', fmt(R.vSet, 1) + ' m/s'],
    ]);
    rows($('energyRows'), [
      ['Elektrisk effekt nu', fmt(L.Ptot || 0) + ' W'],
      ['Brugt indtil nu', fmt(st.stats.kWh, 2) + ' kWh'],
      ['Kuldefaktor', fmt(sim.kT(), 2)],
      ['Salt', fmt(R.saltKg, 1) + ' kg' + (R.saltOn ? ' · spreder' : ''), R.saltOn ? 'ok' : ''],
      ['Værkstedstid', st.vaerkMin + ' min'],
      ['Udgifter', kr(st.kr)],
      ['Vejr', st.w.navn + ', ' + fmt(st.w.T, 1) + ' °C'],
    ]);
  }
  // statuschips
  const chips = [];
  if (S.some(s => s.limited && s.limBy === 'trac')) chips.push(['warn', 'Hjulspin']);
  if (S.some(s => s.limited && s.limBy === 'clutch')) chips.push(['', 'Koblingen glider']);
  S.forEach((s, i) => { if (s.motorOK && s.temp > 120) chips.push([s.temp > 140 ? '' : 'warn', 'Motor ' + (i ? 'H' : 'V') + ' ' + fmt(s.temp) + ' °C']); if (!s.motorOK) chips.push(['', 'Motor ' + (i ? 'H' : 'V') + ' brændt']); if (!s.shaftOK) chips.push(['', 'Aksel ' + (i ? 'H' : 'V') + ' knækket']); if (!s.chainOK) chips.push(['', 'Kæde ' + (i ? 'H' : 'V') + ' af']); });
  if ((P.fill || 0) > 0.98 && R.down) chips.push(['info', 'Skjoldet løber over']);
  if (R.dead) chips.push(['', 'Batteri fladt']);
  if (R.plovH < 0.95) chips.push(['warn', 'Plov bøjet ' + fmt(R.plovH * 100) + ' %']);
  if (!R.down) chips.push(['info', 'Plov løftet']);
  if (R.saltOn) chips.push(['ok', 'Salt']);
  if (sim.AP.on) chips.push(['info', sim.AP.mode === 'service' ? 'Autopilot → værksted' : sim.AP.mode === 'station' ? 'På station' : 'Autopilot']);
  $('chips').innerHTML = chips.map(([c, t]) => `<span class="chip ${c}">${t}</span>`).join('');
  $('stationBtn').hidden = !sim.inStation();
  $('btnAuto').classList.toggle('on', !!sim.AP.on);
  $('btnPause').classList.toggle('on', !!ui.paused);
  for (const b of $('segSpeed').children) b.setAttribute('aria-pressed', +b.dataset.s === ui.scale);
  for (const b of $('segCam').querySelectorAll('button')) b.setAttribute('aria-pressed', b.dataset.cam === ui.cam);
  $('pauseVeil').hidden = !(ui.paused && !anyModal() && !ui.garage);
}

// ---------- instrumenter: fartmåler, plovvinkel og fritlegeme set ovenfra
function sizeCanvas(c) {
  const r = c.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width * DPR)), h = Math.max(1, Math.round(r.height * DPR));
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
}
function arrow(c, x1, y1, x2, y2, col, w) {
  const L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, hs = Math.min(8, L * 0.45) * w;
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.2 * w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2 - ux * hs * 0.8, y2 - uy * hs * 0.8); c.stroke();
  c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - ux * hs - uy * hs * 0.5, y2 - uy * hs + ux * hs * 0.5); c.lineTo(x2 - ux * hs + uy * hs * 0.5, y2 - uy * hs - ux * hs * 0.5); c.closePath(); c.fill();
}
function drawInst(sim) {
  const cv = $('instCv'); sizeCanvas(cv);
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, d = DPR, R = sim.R, S = sim.S, L = sim.st.live || {}, P = L.P || {};
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  const compact = W / d < 260;
  // fartmåler
  const v = Math.abs(L.v || 0), vMax = 1.5;
  const r = Math.min(H * 0.40, W * (compact ? 0.24 : 0.17)), cx = r + 12 * d, cy = H * 0.5 + r * 0.12;
  const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2, A = t => a0 + (a1 - a0) * clamp(t, 0, 1);
  x.lineCap = 'round';
  x.lineWidth = 7 * d; x.strokeStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.arc(cx, cy, r, a0, a1); x.stroke();
  x.strokeStyle = R.tire === 'kaede' ? '#8cc6e6' : '#f0a43a'; x.beginPath(); x.arc(cx, cy, r, a0, A(v / vMax) + 1e-3); x.stroke();
  x.lineCap = 'butt';
  for (let k = 0; k <= 6; k++) { const a = A(k / 6); x.strokeStyle = 'rgba(230,237,246,.45)'; x.lineWidth = 1.2 * d; x.beginPath(); x.moveTo(cx + Math.cos(a) * (r - 9 * d), cy + Math.sin(a) * (r - 9 * d)); x.lineTo(cx + Math.cos(a) * (r - 5 * d), cy + Math.sin(a) * (r - 5 * d)); x.stroke(); }
  { const a = A(R.vSet / vMax); x.strokeStyle = '#8cc6e6'; x.lineWidth = 3 * d; x.beginPath(); x.moveTo(cx + Math.cos(a) * (r + 6 * d), cy + Math.sin(a) * (r + 6 * d)); x.lineTo(cx + Math.cos(a) * (r - 4 * d), cy + Math.sin(a) * (r - 4 * d)); x.stroke(); }
  x.textAlign = 'center'; x.fillStyle = '#e6edf6'; x.font = `600 ${Math.round(r * 0.52)}px "Saira Condensed", sans-serif`;
  x.fillText(fmt(v, 2), cx, cy + r * 0.12);
  x.fillStyle = '#8ea0b9'; x.font = `500 ${Math.round(Math.max(9, r * 0.2))}px "IBM Plex Mono", monospace`;
  x.fillText('m/s', cx, cy + r * 0.42);
  x.fillText('mål ' + fmt(R.vSet, 1), cx, cy + r * 0.78);
  // fritlegeme set ovenfra, robotten peger opad
  const fx0 = compact ? cx + r + 14 * d : cx + r + 22 * d, fw = compact ? W - fx0 - 6 * d : W * 0.34;
  const k = Math.min(H / 3.4, fw / 2.1), bx = fx0 + fw / 2, by = H * 0.6;
  const sc = k / 400, maxA = 1.0 * k;
  const sideCol = s => s.limited ? (s.limBy === 'trac' ? '#f2c14e' : '#ee5a4b') : '#5cc28d';
  x.save(); x.translate(bx, by);
  x.fillStyle = '#2b3952'; x.strokeStyle = '#44516a'; x.lineWidth = 1 * d;
  x.fillRect(-0.36 * k, -0.55 * k, 0.72 * k, 1.1 * k); x.strokeRect(-0.36 * k, -0.55 * k, 0.72 * k, 1.1 * k);
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { x.fillStyle = '#05070b'; x.fillRect(sx * 0.45 * k - 0.07 * k, sy * 0.35 * k - 0.18 * k, 0.14 * k, 0.36 * k); }
  // plov: θ > 0 kaster til venstre (venstre ende trukket bagud)
  const a = Math.abs(R.ang) * Math.PI / 180, s = R.ang >= 0 ? 1 : -1, py = -0.92 * k;
  const ex = Math.cos(a) * 0.7 * k, ey = Math.sin(a) * 0.7 * k;
  x.strokeStyle = R.down ? '#f0a43a' : '#7a5320'; x.lineWidth = 4 * d; x.lineCap = 'round'; x.beginPath();
  x.moveTo(-s * ex, py + ey); x.lineTo(s * ex, py - ey); x.stroke(); x.lineCap = 'butt';
  // kilen fyldes
  const fill = clamp(P.fill || 0, 0, 1.2);
  if (R.down && fill > 0.02) { x.fillStyle = fill > 0.97 ? 'rgba(238,90,75,.7)' : 'rgba(230,237,246,.75)'; x.beginPath(); x.moveTo(-s * ex, py + ey); x.lineTo(s * ex, py - ey); x.lineTo(s * ex * (1 - 0.2 * fill), py - ey - 0.28 * k * fill); x.lineTo(-s * ex * (1 - 0.2 * fill), py + ey - 0.28 * k * fill); x.closePath(); x.fill(); }
  // kasteside
  if (R.down && a > 0.05) { x.strokeStyle = 'rgba(140,198,230,.9)'; x.lineWidth = 1.6 * d; const ax = -s * ex, ay = py + ey; arrow(x, ax, ay, ax - s * 0.38 * k, ay + 0.05 * k, 'rgba(140,198,230,.9)', d * 0.8); }
  const Fp = P.F || 0, lp = Math.min(maxA, Fp * sc);
  arrow(x, 0, py - 0.05 * k - lp - 2 * d, 0, py - 0.05 * k, '#ee5a4b', d);
  for (let i = 0; i < 2; i++) {
    const xx = (i === 0 ? -0.45 : 0.45) * k, F = S[i].F || 0, lf = clamp(F * sc, -maxA, maxA), y0 = 0.35 * k;
    arrow(x, xx, y0, xx, y0 - lf, sideCol(S[i]), d);
  }
  x.restore();
  // tal
  if (!compact) {
    const tx = bx + fw / 2 + 12 * d, tr = W - 12 * d; let ty = 26 * d;
    const lh = Math.min(19 * d, (H - 30 * d) / 6.3);
    x.font = `600 ${Math.round(10.5 * d)}px "Saira Condensed", sans-serif`; x.fillStyle = '#f0a43a'; x.textAlign = 'left';
    x.fillText('KRÆFTER', tx, 16 * d);
    x.font = `500 ${Math.round(11.5 * d)}px "IBM Plex Mono", monospace`;
    const line = (n, val, c) => { x.textAlign = 'left'; x.fillStyle = c; x.fillText(n, tx, ty + 6 * d); x.textAlign = 'right'; x.fillText(val, tr, ty + 6 * d); ty += lh; };
    const u = Math.max(Math.abs(S[0].F) / Math.max(1, S[0].lim), Math.abs(S[1].F) / Math.max(1, S[1].lim));
    line('F_plov', fmt(Fp) + ' N', '#ee5a4b');
    line('F_V', fmt(S[0].F) + ' N', sideCol(S[0]));
    line('F_H', fmt(S[1].F) + ' N', sideCol(S[1]));
    line('Udnyt.', fmt(u * 100) + ' %', u > 0.98 ? '#ee5a4b' : u > 0.8 ? '#f2c14e' : '#8ea0b9');
    line('θ plov', fmt(R.ang) + '°' + (R.down ? '' : ' op'), R.down ? '#f0a43a' : '#8ea0b9');
    line('Kile', fmt(fill * 100) + ' %', fill > 0.97 ? '#ee5a4b' : '#8ea0b9');
  } else {
    x.font = `500 ${Math.round(10 * d)}px "IBM Plex Mono", monospace`; x.fillStyle = R.down ? '#f0a43a' : '#8ea0b9'; x.textAlign = 'right';
    x.fillText(fmt(R.ang) + '°' + (R.down ? '' : ' op'), W - 6 * d, 13 * d);
    x.fillStyle = '#ee5a4b'; x.fillText(fmt(Fp) + ' N', W - 6 * d, H - 6 * d);
  }
}

// ---------- minikort
const gcv = document.createElement('canvas'), gctx = gcv.getContext('2d');
let gimg = null, base = null, baseFor = null;
function buildBase(G) {
  gcv.width = G.NX; gcv.height = G.NY; gimg = gctx.createImageData(G.NX, G.NY);
  base = new Uint8ClampedArray(G.NX * G.NY * 3); baseFor = G.zone;
  for (let j = 0; j < G.NY; j++) for (let i = 0; i < G.NX; i++) {
    const id = j * G.NX + i, x = G.X0 + (i + 0.5) * G.cell, y = G.Y0 + (j + 0.5) * G.cell, z = G.zone[id];
    let r, g, b;
    if (z === 0) { r = 52; g = 56; b = 62; if (Math.abs(y - 12.5) < 0.1 && ((x % 3) + 3) % 3 < 1.6) { r = 214; g = 172; b = 62; } }
    else if (z === 2) { r = 48; g = 40; b = 34; }
    else if (z === 3) { r = 112; g = 116; b = 120; }
    else if (z === 5) { r = 120; g = 124; b = 126; }
    else { r = 44; g = 52; b = 40; }
    base[id * 3] = r; base[id * 3 + 1] = g; base[id * 3 + 2] = b;
  }
}
function updateMiniGround(sim) {
  const G = sim.grid; if (baseFor !== G.zone) buildBase(G);
  const D = G.depth, I = G.ice, px = gimg.data, NX = G.NX, NY = G.NY;
  for (let j = 0; j < NY; j++) {
    const jy = NY - 1 - j;
    for (let i = 0; i < NX; i++) {
      const id = j * NX + i, o = (jy * NX + i) * 4, d = D[id];
      let r = base[id * 3], g = base[id * 3 + 1], b = base[id * 3 + 2];
      if (I[id] > 0.08) { const k = Math.min(0.6, I[id] / 1.4); r += (150 - r) * k; g += (196 - g) * k; b += (226 - b) * k; }
      if (d > 0.003) { const a = Math.min(1, Math.sqrt(d / 0.035)), deep = Math.min(1, d / 0.8); r += (226 - 70 * deep - r) * a; g += (234 - 50 * deep - g) * a; b += (244 - 10 * deep - b) * a; }
      px[o] = r; px[o + 1] = g; px[o + 2] = b; px[o + 3] = 255;
    }
  }
  gctx.putImageData(gimg, 0, 0);
}
function drawMini(sim, camInfo) {
  const m = $('mini'); sizeCanvas(m);
  const c = m.getContext('2d'), G = sim.grid, W = m.width, H = m.height, q = DPR;
  c.imageSmoothingEnabled = true; c.drawImage(gcv, 0, 0, W, H);
  const sx = x => (x - G.X0) / (G.NX * G.cell) * W, sy = y => H - (y - G.Y0) / (G.NY * G.cell) * H;
  c.strokeStyle = 'rgba(240,164,58,.7)'; c.lineWidth = 1; c.strokeRect(sx(0), sy(25), sx(80) - sx(0), sy(0) - sy(25));
  const ST = sim.STATION; c.strokeStyle = sim.inStation() ? '#5cc28d' : 'rgba(240,164,58,.9)'; c.strokeRect(sx(ST.x0), sy(ST.y1), sx(ST.x1) - sx(ST.x0), sy(ST.y0) - sy(ST.y1));
  // kameraets synsretning
  if (camInfo) { c.fillStyle = 'rgba(140,198,230,.18)'; c.beginPath(); const x0 = sx(camInfo.x), y0 = sy(camInfo.y), L = 34 * q; c.moveTo(x0, y0); c.arc(x0, y0, L, -camInfo.h - 0.5, -camInfo.h + 0.5); c.closePath(); c.fill(); }
  const R = sim.R, rx = sx(R.x), ry = sy(R.y), s = Math.max(4, W / 70);
  c.save(); c.translate(rx, ry); c.rotate(-R.h); c.fillStyle = '#f0a43a'; c.strokeStyle = '#1a1206'; c.lineWidth = 1 * q;
  c.beginPath(); c.moveTo(s * 1.3, 0); c.lineTo(-s, s * 0.85); c.lineTo(-s * 0.5, 0); c.lineTo(-s, -s * 0.85); c.closePath(); c.fill(); c.stroke(); c.restore();
  c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, 0, W, 17 * q);
  c.fillStyle = '#e6edf6'; c.font = `600 ${Math.round(11 * q)}px "Saira Condensed", sans-serif`; c.textAlign = 'left';
  c.fillText('OVERSIGT · ' + fmt(sim.st.ryddet * 100) + ' % RYDDET', 6 * q, 12.5 * q);
}

// ---------- værksted (reserve uden garage.js)
let shopSim = null;
function openShopFallback(sim) { shopSim = sim; renderShop(); showModal('mShop', true); }
function renderShop() {
  const sim = shopSim, L = sim.vaerkListe(), grp = {};
  for (const it of L) (grp[it.grp] = grp[it.grp] || []).push(it);
  $('shopBody').innerHTML = Object.entries(grp).map(([g, its]) => `<h2>${g}</h2><div class="shop">` + its.map(it =>
    `<button data-id="${it.id}" ${it.dis ? 'disabled' : ''} class="${it.need ? 'need' : it.soon ? 'soon' : ''}"><span class="nm">${it.navn}${it.cur ? ' · monteret' : ''}</span><span class="st">${it.st}</span><span class="co">${it.min} min${it.kr ? ' · ' + kr(it.kr) : ''}</span></button>`).join('') + '</div>').join('');
  $('shopEyebrow').textContent = 'Kl. ' + clock(sim.st.t) + ' · ' + tilbage(sim.st);
  $('shopTotals').textContent = 'Værkstedstid i alt: ' + sim.st.vaerkMin + ' min · udgifter: ' + kr(sim.st.kr);
}

// ---------- slutskærm
let endChartSim = null;
function showEnd(sim) {
  const st = sim.st, pass = st.ryddet >= 0.95;
  $('endVerdict').textContent = (pass ? 'KF3 bestået · ' : 'KF3 ikke bestået · ') + fmt(st.ryddet * 100) + ' % ryddet';
  $('endVerdict').className = 'verdict ' + (pass ? 'pass' : 'fail');
  const bestT = st.hist.reduce((a, h) => h.r > a.r ? h : a, { r: 0, t: 0 });
  $('endText').textContent = pass ? 'Arealet var klar, da produktionen startede. Robotten kørte ' + fmt(st.stats.dist / 1000, 2) + ' km og brugte ' + fmt(st.stats.kWh, 2) + ' kWh.'
    : 'Kl. 06:00 manglede ' + fmt(Math.max(0, 0.95 - st.ryddet) * 2000) + ' m² for at nå kravet. Bedste tidspunkt var kl. ' + clock(bestT.t) + ' med ' + fmt(bestT.r * 100) + ' %.';
  const G = [
    ['Kørt', fmt(st.stats.dist / 1000, 2) + ' km'], ['Energi', fmt(st.stats.kWh, 2) + ' kWh'], ['Runder', st.stats.runder],
    ['Værkstedstid', st.vaerkMin + ' min'], ['Udgifter', kr(st.kr)], ['Hjulspin', fmt(st.stats.spin / 60, 1) + ' min'],
    ['Koblingen gled', fmt(st.stats.slip / 60, 1) + ' min'], ['Skjoldet løb over', fmt(st.stats.over / 60, 1) + ' min'], ['Varmeste motor', fmt(st.stats.maxTemp) + ' °C'],
    ['Stød', st.stats.stoed], ['Salt brugt', fmt(st.stats.saltKg, 1) + ' kg'], ['Bjærgninger', st.stats.bjaerg],
  ];
  $('endGrid').innerHTML = G.map(([k, v]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
  const L = [];
  if (st.stats.over > 600) L.push('Skjoldet løb over i ' + fmt(st.stats.over / 60) + ' min. Kapaciteten h<sub>kap</sub> falder hurtigt ved små vinkler, og i snestorm kommer der mere sne ind, end skjoldet kan kaste af. Det er samme konklusion som i Bilag D: et større skjold eller en anden rydningsmetode.');
  if (st.stats.spin > 120) L.push('Hjulene spandt i ' + fmt(st.stats.spin / 60, 1) + ' min. Trækkraften er begrænset af μ · N. På is skal dækkene skiftes, eller arealet saltes først.');
  if (st.stats.slip > 120) L.push('Slipkoblingen gled i ' + fmt(st.stats.slip / 60, 1) + ' min. Den beskytter drivlinjen, men den slides, og akslen bruger levetid, når den kører tæt på 36 Nm.');
  if (st.stats.maxTemp > 120) L.push('Den varmeste motor nåede ' + fmt(st.stats.maxTemp) + ' °C. Varmen vokser med momentet i anden potens, så lange tunge bid koster mere end mange lette.');
  if (st.repairs.length) L.push('Værkstedet: ' + st.repairs.map(r => r.navn.toLowerCase() + ' (' + r.min + ' min)').join(', ') + '.');
  if (st.stats.vold > 30) L.push('Snevolden ved kanten blev for høj. Sneen skal et sted hen, og på 2.000 m² er det mange kubikmeter.');
  if (!L.length) L.push('Drivlinjen klarede natten uden at nå sine grænser. Prøv et hårdere vejr, eller kør uden autopilot.');
  $('endLessons').innerHTML = L.map(x => `<li>${x}</li>`).join('');
  endChartSim = sim;
  showModal('mEnd', true);
  requestAnimationFrame(drawEndChart);
}
function drawEndChart() {
  const sim = endChartSim; if (!sim) return;
  const c = $('endChart'), dpr = DPR, r = c.getBoundingClientRect(); if (r.width < 2) return;
  c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
  const x = c.getContext('2d'), W = c.width, H = c.height, pl = 40 * dpr, pr = 12 * dpr, pt = 12 * dpr, pb = 24 * dpr;
  x.fillStyle = '#172236'; x.fillRect(0, 0, W, H);
  const X = t => pl + (W - pl - pr) * t / (4 * 3600), Y = v => pt + (H - pt - pb) * (1 - v);
  x.font = `500 ${Math.round(10 * dpr)}px "IBM Plex Mono", monospace`; x.fillStyle = '#8ea0b9'; x.strokeStyle = '#24334c'; x.lineWidth = 1;
  for (const v of [0, 0.25, 0.5, 0.75, 1]) { x.beginPath(); x.moveTo(pl, Y(v)); x.lineTo(W - pr, Y(v)); x.stroke(); x.textAlign = 'right'; x.fillText(Math.round(v * 100) + ' %', pl - 5 * dpr, Y(v) + 3 * dpr); }
  for (let h = 0; h <= 4; h++) { x.textAlign = h === 0 ? 'left' : h === 4 ? 'right' : 'center'; x.fillText(String(2 + h).padStart(2, '0') + ':00', X(h * 3600) + (h === 0 ? -4 * dpr : h === 4 ? 2 * dpr : 0), H - 7 * dpr); }
  x.textAlign = 'right'; x.fillStyle = '#5cc28d'; x.fillText('krav 95 %', W - pr, Y(0.95) - 5 * dpr);
  x.setLineDash([4 * dpr, 4 * dpr]); x.strokeStyle = '#5cc28d'; x.beginPath(); x.moveTo(pl, Y(0.95)); x.lineTo(W - pr, Y(0.95)); x.stroke(); x.setLineDash([]);
  const hs = sim.st.hist; if (!hs.length) return;
  x.beginPath(); x.moveTo(X(hs[0].t), Y(0)); for (const h of hs) x.lineTo(X(h.t), Y(h.r)); x.lineTo(X(hs[hs.length - 1].t), Y(0)); x.closePath(); x.fillStyle = 'rgba(240,164,58,.18)'; x.fill();
  x.beginPath(); hs.forEach((h, i) => i ? x.lineTo(X(h.t), Y(h.r)) : x.moveTo(X(h.t), Y(h.r))); x.strokeStyle = '#f0a43a'; x.lineWidth = 2 * dpr; x.stroke();
  const e = hs[hs.length - 1]; x.fillStyle = '#f0a43a'; x.beginPath(); x.arc(X(e.t), Y(e.r), 4 * dpr, 0, 7); x.fill();
}

// ---------- opsætning
function init(callbacks) {
  cb = callbacks;
  renderStart(); buildTele(); setTele(teleOpen);
  $('scenList').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { valg.scen = b.dataset.k; renderStart(); } });
  $('segTire').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { valg.tire = b.dataset.t; renderStart(); } });
  $('segBallast').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { valg.ballast = +b.dataset.b; renderStart(); } });
  $('segDiff').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { valg.svaer = b.dataset.d; renderStart(); } });
  const start = () => { saveValg(); showModal('mStart', false); showModal('mEnd', false); cb.start({ ...valg }); };
  $('btnStart').onclick = start; $('btnAgain').onclick = start;
  $('btnNew').onclick = () => { showModal('mEnd', false); showModal('mStart', true); };
  $('btnHelp').onclick = () => showModal('mHelp', true);
  $('btnHelp2').onclick = () => showModal('mHelp', true);
  $('btnHelpClose').onclick = () => showModal('mHelp', false);
  $('btnPause').onclick = () => cb.togglePause();
  $('btnAuto').onclick = () => cb.toggleAuto();
  $('btnTele').onclick = () => setTele(!teleOpen);
  $('teleHead').onclick = () => setTele(!teleOpen);
  $('stationBtn').onclick = () => cb.openShop();
  $('mapBox').onclick = () => cb.setCam('overview');
  $('btnShopClose').onclick = () => { showModal('mShop', false); cb.shopClosed(); };
  $('shopBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-id]'); if (!b || b.disabled || !shopSim) return;
    const it = shopSim.vaerk(b.dataset.id);
    if (it) toast({ sev: 'ok', title: it.navn, msg: 'Det tog ' + it.min + ' min' + (it.kr ? ' og kostede ' + kr(it.kr) : '') + '. Sneen faldt imens.' });
    if (cb.repaired) cb.repaired();
    if (shopSim.st.ended) { showModal('mShop', false); cb.shopClosed(); return; }
    renderShop();
  });
  $('segSpeed').addEventListener('click', e => { const b = e.target.closest('button'); if (b) cb.setScale(+b.dataset.s); });
  $('segCam').addEventListener('click', e => { const b = e.target.closest('button'); if (b) cb.setCam(b.dataset.cam); });
  // et museklik må ikke efterlade fokus på en knap, ellers trykker mellemrum (plov op/ned) også på knappen
  for (const id of ['hud']) $(id).addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  // touch: hold-knapper og klik-knapper
  document.querySelectorAll('#touch [data-k]').forEach(b => {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', e => { e.preventDefault(); cb.hold(k, true); b.classList.add('on'); });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) b.addEventListener(ev, () => { cb.hold(k, false); b.classList.remove('on'); });
  });
  document.querySelectorAll('#touch [data-a]').forEach(b => b.addEventListener('click', () => cb.action(b.dataset.a)));
  addEventListener('resize', () => { DPR = Math.min(2, devicePixelRatio || 1); if (!$('mEnd').hidden) drawEndChart(); });
}
function ready(on) { const b = $('btnStart'); b.disabled = !on; b.textContent = on ? 'Start skiftet' : 'Indlæser …'; }

window.HUD = { valg: () => ({ ...valg }), $, fmt, clamp, clock, init, ready, toast, pumpEvents, reset, update, drawInst, drawMini, updateMiniGround,
  openShopFallback, renderShop, showEnd, showModal, anyModal, setTele, get teleOpen() { return teleOpen; }, RM };
})();
