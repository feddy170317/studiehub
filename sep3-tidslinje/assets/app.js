/* SEP3 Fremdriftsplan — vanilla JS + Firebase RTDB (compat SDK), node: /sep3 */
'use strict';

const ROOT = 'sep3';
const DEFAULT_START = '2026-09-07';   // mandag i uge 1 (kan ændres i UI)
const WEEKS = 12;

const PHASES = [
  { id: 'analyse',        name: 'Analyse',        from: 1,  to: 3 },
  { id: 'koncept',        name: 'Koncept',        from: 4,  to: 5 },
  { id: 'dimensionering', name: 'Dimensionering', from: 6,  to: 9 },
  { id: 'dokumentation',  name: 'Dokumentation',  from: 10, to: 12 }
];
const AREAS = {
  A: 'Metode og dokumentation',
  B: 'Maskindele',
  C: 'Elektronik og styring',
  D: 'Dimensionering',
  E: 'Sikkerhed og standarder',
  F: 'Drift og omgivelser'
};
const KINDS = { opgave: 'Opgave', beslutning: 'Beslutning', milepael: 'Milepæl', aflevering: 'Aflevering' };
const GATES = ['beslutning', 'milepael', 'aflevering'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

/* [phase, fra, til, område, type, delvist, dato?, titel] */
const SEED = [
  ['analyse', 1, 3, 'A', 'opgave', 0, 0, 'Miro-brainstorm: tre løsningsforslag pr. delproblem'],
  ['analyse', 2, 3, 'A', 'opgave', 0, 0, 'Omskriv problemformulering til den nye afgrænsning'],
  ['analyse', 2, 3, 'F', 'opgave', 1, 0, 'Afklar case og adgang til et lukket anlæg (Finagy eller andet) og mål op'],
  ['analyse', 2, 3, 'E', 'opgave', 0, 0, 'Indledende risikovurdering efter EN ISO 12100'],
  ['analyse', 3, 3, 'E', 'opgave', 0, 0, 'Afklar Maskindirektiv 2006/42/EF mod Maskinforordning 2023/1230 med vejleder'],
  ['analyse', 3, 3, 'A', 'opgave', 0, 0, 'Slå tolerancer og standarder op i standardbogen'],
  ['analyse', 3, 3, 'A', 'milepael', 0, 0, 'Afgrænsning godkendt af vejleder: drivlinje, motor og styring på lukket areal'],
  ['analyse', 3, 3, 'A', 'milepael', 0, 0, 'Kravspec for drivlinje og styring låst (Bilag B)'],
  ['analyse', 3, 3, 'A', 'aflevering', 0, 1, 'Obligatorisk: præsentation af projektbeskrivelsen'],

  ['koncept', 4, 4, 'A', 'opgave', 0, 0, 'Vælg beslutningsmodel (vægtet matrix, Pugh eller AHP) og fastlæg kriterievægte'],
  ['koncept', 4, 4, 'A', 'opgave', 0, 0, 'Morfologisk matrix for drivlinje og styring'],
  ['koncept', 4, 4, 'B', 'beslutning', 0, 0, 'Beslutning: drivlinje-koncept (bælter, hjul eller halvbælte)'],
  ['koncept', 4, 5, 'B', 'beslutning', 0, 0, 'Beslutning: drivteknologi (BLDC, børstet DC eller hydrostatisk)'],
  ['koncept', 5, 5, 'C', 'beslutning', 0, 0, 'Beslutning: motorstyring (FOC-driver, H-bro eller servodrive)'],
  ['koncept', 5, 5, 'C', 'beslutning', 0, 0, 'Beslutning: styrearkitektur (PLC, MCU eller SBC)'],
  ['koncept', 5, 5, 'E', 'opgave', 0, 0, 'Skitse af sikkerhedsarkitektur: nødstop og STO'],
  ['koncept', 5, 5, 'C', 'opgave', 1, 0, 'Vælg sensorer til motorregulering: encoder, strøm og temperatur'],
  ['koncept', 5, 5, 'C', 'opgave', 1, 0, 'Fastlæg intern kommunikation (CAN) mellem controller og driver'],
  ['koncept', 5, 5, 'A', 'milepael', 0, 0, 'Konceptvalg dokumenteret (Bilag C)'],

  ['dimensionering', 6, 7, 'D', 'opgave', 0, 0, 'Friktions- og trækkraftmodel: friktion for sne og is, hældning, rullemodstand'],
  ['dimensionering', 7, 7, 'D', 'opgave', 0, 0, 'Moment og effekt: gearudveksling og motorvalg'],
  ['dimensionering', 7, 8, 'D', 'opgave', 1, 0, 'Energiforbrug for drivlinjen over en rydningscyklus (Matlab)'],
  ['dimensionering', 8, 8, 'D', 'opgave', 1, 0, 'Termik: motor- og drivertemperatur'],
  ['dimensionering', 8, 8, 'D', 'opgave', 0, 0, 'Dynamik og stopdistance på glat føre'],
  ['dimensionering', 8, 8, 'B', 'opgave', 1, 0, 'Fail-safe bremse og fastholdelse på hældning'],
  ['dimensionering', 8, 8, 'C', 'opgave', 0, 0, 'Motordriver og effektkreds: sikringer, kontaktor og forladning'],
  ['dimensionering', 8, 9, 'A', 'opgave', 0, 0, 'Simulering af drivlinjen (MATLAB eller pybullet)'],
  ['dimensionering', 8, 8, 'A', 'aflevering', 0, 1, 'Obligatorisk: peer feedback-præsentation'],
  ['dimensionering', 9, 9, 'C', 'opgave', 0, 0, 'Hastighedsregulering og slipkontrol'],
  ['dimensionering', 9, 9, 'E', 'opgave', 0, 0, 'Krævet Performance Level og validering af stopfunktioner (EN ISO 13849)'],
  ['dimensionering', 9, 9, 'A', 'milepael', 0, 0, 'Alle hovedkomponenter dimensioneret'],

  ['dokumentation', 10, 10, 'A', 'opgave', 0, 0, '3D-CAD og samling af drivlinjen'],
  ['dokumentation', 10, 11, 'A', 'opgave', 0, 0, '2D-tegninger med tolerancer fra standardbogen'],
  ['dokumentation', 10, 11, 'E', 'opgave', 0, 0, 'Færdig risikovurdering og teknisk fil'],
  ['dokumentation', 10, 10, 'A', 'aflevering', 0, 1, 'Obligatorisk: opdateret individuel portfolio-rapport'],
  ['dokumentation', 11, 11, 'A', 'opgave', 1, 0, 'Stykliste (BOM) og prisestimat for drivlinjen'],
  ['dokumentation', 11, 11, 'E', 'opgave', 1, 0, 'Gennemgå styring og effektkreds mod EN 60204-1'],
  ['dokumentation', 11, 11, 'A', 'opgave', 1, 0, 'Økonomisk og miljømæssig vurdering'],
  ['dokumentation', 11, 12, 'A', 'opgave', 0, 0, 'Skriv rapport (8-12 sider, 2400 anslag pr. side)'],
  ['dokumentation', 11, 12, 'A', 'opgave', 0, 0, 'Lav A1-poster'],
  ['dokumentation', 12, 12, 'A', 'opgave', 0, 0, 'Saml bilag A-J'],
  ['dokumentation', 12, 12, 'A', 'opgave', 0, 0, 'Øv eksamenspræsentation (20 min)'],
  ['dokumentation', 12, 12, 'A', 'aflevering', 0, 1, 'Aflevering af rapport, bilag og poster']
];

/* ---------- state ---------- */
let db, tasksRef, configRef, activityRef, metaRef;
let tasks = [];
let activity = [];
let config = { startDate: DEFAULT_START };
let loaded = { tasks: false, config: false };
let filters = { area: 'all', status: 'all', gatesOnly: false, person: null };
const expanded = new Set();
const openIds = new Set();
let pendingRender = false;
let session = null;   // {name}

try { session = JSON.parse(localStorage.getItem('sep3_session') || 'null'); } catch (e) { session = null; }

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function parseDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return parseDate(DEFAULT_START);
  return new Date(+m[1], +m[2] - 1, +m[3]);
}
function weekStartDate(n) {
  const d = parseDate(config.startDate);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
}
function shortDate(d) { return d.getDate() + '. ' + MONTHS[d.getMonth()]; }
function fmtStamp(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return shortDate(d) + ' kl. ' + hh + ':' + mm;
}
function currentWeek() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - parseDate(config.startDate)) / 86400000);
  return Math.floor(diff / 7) + 1;   // <1 før start, >WEEKS efter slut
}
function weekLabel(t) { return t.start === t.end ? 'U' + t.start : 'U' + t.start + '–' + t.end; }
function isLate(t) { const wk = currentWeek(); return !t.done && wk >= 1 && t.end < wk; }
function statusOf(t) { return t.done ? 'done' : (t.startedAt ? 'doing' : 'todo'); }
function sinceLabel(ms) {
  if (!ms) return '';
  const days = Math.floor((Date.now() - ms) / 86400000);
  return days <= 0 ? 'i dag' : (days === 1 ? '1 dag' : days + ' dage');
}
function phaseFor(week) {
  const p = PHASES.find((x) => week >= x.from && week <= x.to);
  return p ? p.id : PHASES[PHASES.length - 1].id;
}
function showBanner(msg) {
  const b = $('banner');
  b.textContent = msg;
  b.hidden = !msg;
}
function friendlyErr(err) {
  if (err && /permission/i.test(err.message || err.code || '')) {
    return 'Databasen afviste skrivningen. Tilføj noden "sep3" i Firebase-reglerne (se SETUP.md) og prøv igen.';
  }
  return 'Kunne ikke gemme: ' + ((err && err.message) || err);
}

/* ---------- login (kun navn) ---------- */
function requireLogin() {
  return new Promise((resolve, reject) => {
    if (session && session.name) { resolve(session.name); return; }
    const dlg = $('dlg-login');
    $('in-name').value = '';
    const form = $('form-login');
    const cancel = $('login-cancel');
    function cleanup() { form.removeEventListener('submit', onSubmit); cancel.removeEventListener('click', onCancel); }
    function onSubmit(e) {
      e.preventDefault();
      const name = $('in-name').value.trim();
      if (!name) return;
      session = { name };
      try { localStorage.setItem('sep3_session', JSON.stringify(session)); } catch (er) { /* ignore */ }
      cleanup(); dlg.close(); renderWho(); render(); resolve(name);
    }
    function onCancel() { cleanup(); dlg.close(); reject(new Error('cancelled')); }
    form.addEventListener('submit', onSubmit);
    cancel.addEventListener('click', onCancel);
    dlg.showModal();
    $('in-name').focus();
  });
}
function renderWho() {
  const el = $('whoami');
  if (session && session.name) {
    el.innerHTML = 'Du er <b>' + esc(session.name) + '</b> · <button type="button" id="btn-switch">skift navn</button>';
    $('btn-switch').addEventListener('click', () => { session = null; try { localStorage.removeItem('sep3_session'); } catch (e) { /* ignore */ } renderWho(); render(); });
  } else {
    el.textContent = '';
  }
}

/* ---------- writes ---------- */
function logActivity(by, text) {
  return activityRef.push({ ts: firebase.database.ServerValue.TIMESTAMP, by, text }).catch(() => {});
}
function guard(fn) {
  return requireLogin().then(fn).catch((err) => {
    if (err && err.message === 'cancelled') return;
    showBanner(friendlyErr(err));
  });
}
function toggleDone(t) {
  guard((name) => {
    const nowDone = !t.done;
    const patch = nowDone
      ? { done: true, doneBy: name, doneAt: firebase.database.ServerValue.TIMESTAMP }
      : { done: false, doneBy: null, doneAt: null };
    return tasksRef.child(t.id).update(patch).then(() => {
      showBanner('');
      return logActivity(name, (nowDone ? 'gjorde færdig: "' : 'åbnede igen: "') + t.title + '"');
    });
  });
}
function startTask(t) {
  guard((name) => {
    if (t.startedAt && t.owner && t.owner !== name && !confirm(t.owner + ' er i gang med denne. Vil du overtage den?')) return;
    return tasksRef.child(t.id).update({ owner: name, startedAt: firebase.database.ServerValue.TIMESTAMP, done: false, doneBy: null, doneAt: null }).then(() => {
      showBanner('');
      return logActivity(name, 'startede "' + t.title + '"');
    });
  });
}
function releaseTask(t) {
  guard((name) => tasksRef.child(t.id).update({ owner: null, startedAt: null }).then(() => {
    showBanner('');
    return logActivity(name, 'gav slip på "' + t.title + '"');
  }));
}
function saveTask(t, fields) {
  guard((name) => tasksRef.child(t.id).update(fields).then(() => { showBanner(''); return logActivity(name, 'rettede "' + (fields.title || t.title) + '"'); }));
}
function deleteTask(t) {
  if (!confirm('Slet "' + t.title + '"? Det kan ikke fortrydes.')) return;
  guard((name) => tasksRef.child(t.id).remove().then(() => { openIds.delete(t.id); showBanner(''); return logActivity(name, 'slettede "' + t.title + '"'); }));
}
function seedIfEmpty() {
  metaRef.child('seeded').once('value').then((snap) => {
    if (snap.exists()) return;
    return metaRef.child('seeded').transaction((cur) => (cur ? undefined : Date.now()), (err, committed) => {
      if (err) { showBanner(friendlyErr(err)); return; }
      if (!committed) return;
      const up = {};
      SEED.forEach((s, i) => {
        const id = 't' + String(i + 1).padStart(2, '0');
        up['tasks/' + id] = {
          phase: s[0], start: s[1], end: s[2], area: s[3], kind: s[4],
          partial: !!s[5], est: !!s[6], title: s[7],
          done: false, note: '', createdBy: 'Plan', createdAt: Date.now()
        };
      });
      up['config/startDate'] = DEFAULT_START;
      db.ref(ROOT).update(up).catch((e) => showBanner(friendlyErr(e)));
    }, false);
  }).catch((e) => showBanner(friendlyErr(e)));
}

/* ---------- render ---------- */
function visibleTasks() {
  return tasks.filter((t) => {
    if (filters.area !== 'all' && t.area !== filters.area) return false;
    if (filters.status === 'open' && t.done) return false;
    if (filters.status === 'doing' && statusOf(t) !== 'doing') return false;
    if (filters.status === 'late' && !isLate(t)) return false;
    if (filters.status === 'done' && !t.done) return false;
    if (filters.person && t.owner !== filters.person && t.doneBy !== filters.person) return false;
    if (filters.gatesOnly && GATES.indexOf(t.kind) < 0) return false;
    return true;
  });
}

function renderSummary() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const wk = currentWeek();
  $('tb-pct').textContent = pct + ' %';
  $('tb-meter').style.width = pct + '%';
  $('tb-sub').textContent = done + ' af ' + total + ' opgaver færdige';
  if (wk < 1) $('tb-week').textContent = 'Før start';
  else if (wk > WEEKS) $('tb-week').textContent = 'Efter U' + WEEKS;
  else $('tb-week').textContent = wk + ' / ' + WEEKS;

  const cards = PHASES.map((p) => {
    const list = tasks.filter((t) => t.phase === p.id);
    const d = list.filter((t) => t.done).length;
    const w = list.length ? Math.round((d / list.length) * 100) : 0;
    const cur = wk >= p.from && wk <= p.to;
    return '<div class="pcard' + (cur ? ' current' : '') + '">' +
      '<div class="pn">' + esc(p.name) + '</div>' +
      '<div class="pw">U' + p.from + '–' + p.to + (cur ? ' · nu' : '') + '</div>' +
      '<div class="pc">' + d + '<small> / ' + list.length + '</small></div>' +
      '<div class="meter"><span style="width:' + w + '%"></span></div></div>';
  });
  $('phase-cards').innerHTML = cards.join('');

  const next = tasks.filter((t) => !t.done && GATES.indexOf(t.kind) >= 0)
    .sort((a, b) => a.end - b.end || a.title.localeCompare(b.title, 'da')).slice(0, 5);
  $('next-list').innerHTML = next.length
    ? next.map((t) => '<li class="area-' + esc(t.area) + '"><span class="nw">U' + t.end + '</span><span>' + esc(t.title) + '</span></li>').join('')
    : '<li class="empty">Ingen åbne afvejninger.</li>';
}

function trackMarkup(t, wk) {
  const now = wk >= 1 && wk <= WEEKS ? '<div class="nowline" style="left:calc(var(--wk) * ' + (wk - 1) + ')"></div>' : '';
  let mark;
  if (t.kind === 'opgave') {
    mark = '<div class="bar" style="left:calc(var(--wk) * ' + (t.start - 1) + ' + 2px);width:calc(var(--wk) * ' + (t.end - t.start + 1) + ' - 4px)"></div>';
  } else {
    const sq = t.kind === 'aflevering' ? ' sq' : '';
    mark = '<div class="dia' + sq + '" style="left:calc(var(--wk) * ' + (t.end - 1) + ')"></div>';
  }
  return '<div class="track" aria-hidden="true">' + now + mark + '</div>';
}

function actionsMarkup(t) {
  const id = esc(t.id);
  const st = statusOf(t);
  if (st === 'todo') return '<button type="button" class="mini go" data-start="' + id + '">Start</button>';
  if (st === 'doing') return '<button type="button" class="mini ok" data-finish="' + id + '">Færdig</button><button type="button" class="mini" data-release="' + id + '">Giv slip</button>';
  return '';
}

function detailMarkup(t) {
  const areaOpts = Object.keys(AREAS).map((k) => '<option value="' + k + '"' + (k === t.area ? ' selected' : '') + '>' + k + ' · ' + esc(AREAS[k]) + '</option>').join('');
  const kindOpts = Object.keys(KINDS).map((k) => '<option value="' + k + '"' + (k === t.kind ? ' selected' : '') + '>' + esc(KINDS[k]) + '</option>').join('');
  const who = t.done
    ? 'Udført af <b>' + esc(t.doneBy || 'ukendt') + '</b>' + (t.doneAt ? ' · ' + esc(fmtStamp(t.doneAt)) : '')
    : 'Ikke udført endnu';
  const created = t.createdBy && t.createdBy !== 'Plan' ? ' · oprettet af ' + esc(t.createdBy) : '';
  const id = esc(t.id);
  return '<div class="detail" data-detail="' + id + '">' +
    '<div class="who">' + who + created + '</div>' +
    '<div class="drow">' +
      '<div><label for="e-title-' + id + '">Opgave</label><input id="e-title-' + id + '" type="text" maxlength="140" value="' + esc(t.title) + '"></div>' +
      '<div><label for="e-from-' + id + '">Uge fra</label><input id="e-from-' + id + '" type="number" min="1" max="12" value="' + t.start + '"></div>' +
      '<div><label for="e-to-' + id + '">Uge til</label><input id="e-to-' + id + '" type="number" min="1" max="12" value="' + t.end + '"></div>' +
      '<div><label for="e-area-' + id + '">Område</label><select id="e-area-' + id + '">' + areaOpts + '</select></div>' +
      '<div><label for="e-kind-' + id + '">Type</label><select id="e-kind-' + id + '">' + kindOpts + '</select></div>' +
    '</div>' +
    '<div class="drow owner"><div><label for="e-owner-' + id + '">Ansvarlig</label><input id="e-owner-' + id + '" type="text" list="people-list" maxlength="40" value="' + esc(t.owner || '') + '" placeholder="Hvem skal lave den?"></div></div>' +
    '<div><label for="e-note-' + id + '">Note</label><textarea id="e-note-' + id + '" maxlength="600" placeholder="Fx link til beregning, fil eller aftale">' + esc(t.note || '') + '</textarea></div>' +
    '<div class="dbtns"><button type="button" class="btn primary" data-save="' + id + '">Gem</button>' +
    '<button type="button" class="btn danger" data-del="' + id + '">Slet opgave</button></div>' +
  '</div>';
}

function renderTimeline() {
  const wk = currentWeek();
  const list = visibleTasks();
  let html = '<div class="tl-inner"><div class="weekhead"><div></div><div></div><div class="track">';
  for (let w = 1; w <= WEEKS; w++) {
    html += '<div class="wcell' + (w === wk ? ' now' : '') + '"><b>U' + w + '</b><span>' + weekStartDate(w).getDate() + '/' + (weekStartDate(w).getMonth() + 1) + '</span></div>';
  }
  html += '</div><div></div></div>';

  PHASES.forEach((p) => {
    const inPhase = list.filter((t) => t.phase === p.id)
      .sort((a, b) => a.start - b.start || a.end - b.end || (GATES.indexOf(a.kind) >= 0) - (GATES.indexOf(b.kind) >= 0) || a.title.localeCompare(b.title, 'da'));
    if (!inPhase.length) return;
    const all = tasks.filter((t) => t.phase === p.id);
    const d = all.filter((t) => t.done).length;
    html += '<div class="phase"><div class="pname"><b>' + esc(p.name) + '</b><span>U' + p.from + '–' + p.to + ' · ' + d + ' af ' + all.length + ' færdige</span></div>' +
      '<div class="track"><div class="span" style="left:calc(var(--wk) * ' + (p.from - 1) + ' + 2px);width:calc(var(--wk) * ' + (p.to - p.from + 1) + ' - 4px)"></div></div><div></div></div>';
    inPhase.forEach((t) => {
      const open = openIds.has(t.id);
      const kindTag = t.kind !== 'opgave' ? '<span class="tag kind">' + esc(KINDS[t.kind]) + '</span>' : '';
      const partial = t.partial ? '<span class="tag">delvist</span>' : '';
      const est = t.est ? '<span class="tag warn">dato?</span>' : '';
      const by = t.done && t.doneBy ? '<span class="byline">✓ ' + esc(t.doneBy) + (t.doneAt ? ' · ' + esc(fmtStamp(t.doneAt)) : '') + '</span>' : '';
      const late = isLate(t) ? '<span class="tag late">bagud</span>' : '';
      const st = statusOf(t);
      const pill = st === 'doing'
        ? '<span class="pill doing">I gang · ' + esc(t.owner || '?') + ' · ' + esc(sinceLabel(t.startedAt)) + '</span>'
        : (st === 'todo' && t.owner ? '<span class="pill">Tildelt: ' + esc(t.owner) + '</span>' : '');
      const acts = actionsMarkup(t);
      html += '<div class="row area-' + esc(t.area) + (t.done ? ' done' : '') + (st === 'doing' ? ' doing' : '') + (isLate(t) ? ' late' : '') + '" data-id="' + esc(t.id) + '">' +
        '<div class="chkcell"><button type="button" class="chk" data-toggle="' + esc(t.id) + '" aria-pressed="' + (t.done ? 'true' : 'false') + '" aria-label="' + (t.done ? 'Fjern afkrydsning: ' : 'Kryds af: ') + esc(t.title) + '">✓</button></div>' +
        '<div class="main"><div class="ttl">' + esc(t.title) + '</div>' +
          '<div class="meta"><span class="area-tag"><i></i>' + esc(AREAS[t.area] || t.area) + '</span><span class="wk">' + weekLabel(t) + '</span>' + kindTag + partial + est + late + pill + by + '</div>' + (acts ? '<div class="acts">' + acts + '</div>' : '') + '</div>' +
        trackMarkup(t, wk) +
        '<button type="button" class="more" data-more="' + esc(t.id) + '" aria-expanded="' + (open ? 'true' : 'false') + '" aria-label="Detaljer">▾</button>' +
        (open ? detailMarkup(t) : '') +
      '</div>';
    });
  });
  if (!list.length) html += '<div class="row"><div></div><div class="main"><div class="ttl" style="color:var(--muted)">' + (tasks.length ? 'Ingen opgaver matcher filteret.' : 'Indlæser plan …') + '</div></div></div>';
  html += '</div>';
  $('timeline').innerHTML = html;
}

function cardMarkup(t) {
  const st = statusOf(t);
  const kind = t.kind !== 'opgave' ? '<span class="tag kind">' + esc(KINDS[t.kind]) + '</span>' : '';
  const est = t.est ? '<span class="tag warn">dato?</span>' : '';
  let who = '';
  if (st === 'doing') who = '<div class="cwho doing">I gang: <b>' + esc(t.owner || '?') + '</b> · ' + esc(sinceLabel(t.startedAt)) + '</div>';
  else if (t.owner) who = '<div class="cwho">Tildelt: <b>' + esc(t.owner) + '</b></div>';
  else who = '<div class="cwho free">Ingen har taget den</div>';
  const acts = actionsMarkup(t);
  return '<article class="card area-' + esc(t.area) + (isLate(t) ? ' late' : '') + '">' +
    '<div class="ct">' + esc(t.title) + '</div>' +
    '<div class="cm"><span class="area-tag"><i></i>' + esc(AREAS[t.area] || t.area) + '</span><span class="wk">' + weekLabel(t) + '</span>' + kind + est + '</div>' +
    who + (acts ? '<div class="acts">' + acts + '</div>' : '') + '</article>';
}

function renderBoard() {
  const wk = currentWeek();
  const open = tasks.filter((t) => !t.done);
  const byEnd = (a, b) => a.end - b.end || a.start - b.start || a.title.localeCompare(b.title, 'da');
  const late = open.filter(isLate).sort(byEnd);
  const doing = open.filter((t) => !isLate(t) && statusOf(t) === 'doing').sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0));
  const rest = open.filter((t) => !isLate(t) && statusOf(t) === 'todo').sort((a, b) => a.start - b.start || a.end - b.end || a.title.localeCompare(b.title, 'da'));
  const next = rest.filter((t) => t.start <= wk + 1);
  const later = rest.filter((t) => t.start > wk + 1);
  const cols = [
    ['late', 'Bagud', late, 'Intet bagud lige nu.'],
    ['doing', 'I gang', doing, 'Ingen er i gang. Tryk Start på en opgave.'],
    ['next', 'Næste op', next, 'Ikke flere opgaver denne og næste uge.'],
    ['later', 'Senere', later, 'Ingen fremtidige opgaver.']
  ];
  const LIMIT = 4;
  $('cols').innerHTML = cols.map((c) => {
    const all = expanded.has(c[0]);
    const list = all ? c[2] : c[2].slice(0, LIMIT);
    const more = c[2].length > LIMIT
      ? '<button type="button" class="more-btn" data-expand="' + c[0] + '">' + (all ? 'Vis færre' : 'Vis alle ' + c[2].length) + '</button>' : '';
    return '<div class="col col-' + c[0] + '"><div class="colhead"><h3>' + c[1] + '</h3><span class="count">' + c[2].length + '</span></div>' +
      '<div class="cards">' + (list.length ? list.map(cardMarkup).join('') : '<div class="empty">' + c[3] + '</div>') + more + '</div></div>';
  }).join('');

  const names = {};
  tasks.forEach((t) => {
    [t.owner, t.doneBy, t.createdBy && t.createdBy !== 'Plan' ? t.createdBy : null].forEach((n) => { if (n) names[n] = names[n] || { doing: 0, done: 0 }; });
    if (t.owner && !t.done && t.startedAt) names[t.owner].doing++;
    if (t.doneBy && t.done) names[t.doneBy].done++;
  });
  if (session && session.name && !names[session.name]) names[session.name] = { doing: 0, done: 0 };
  const list = Object.keys(names).sort((a, b) => a.localeCompare(b, 'da'));
  $('people').innerHTML = list.length
    ? list.map((n) => '<button type="button" class="person" data-person="' + esc(n) + '" aria-pressed="' + (filters.person === n) + '"><b>' + esc(n) + '</b><span>' + names[n].doing + ' i gang · ' + names[n].done + ' færdige</span></button>').join('')
    : '<span class="empty">Ingen navne endnu. Tryk Start på en opgave.</span>';
  $('people-list').innerHTML = list.map((n) => '<option value="' + esc(n) + '"></option>').join('');
}

function onBoardClick(e) {
  const ex = e.target.closest('[data-expand]');
  if (ex) { const k = ex.dataset.expand; if (expanded.has(k)) expanded.delete(k); else expanded.add(k); render(); return; }
  onTimelineClick(e);
}

function renderActivity() {
  const el = $('activity');
  if (!activity.length) { el.innerHTML = '<li class="empty"><span></span><span>Ingen aktivitet endnu. Kryds den første opgave af.</span></li>'; return; }
  el.innerHTML = activity.map((a) =>
    '<li><span class="ts">' + esc(fmtStamp(a.ts)) + '</span><span><b>' + esc(a.by) + '</b> ' + esc(a.text) + '</span></li>').join('');
}

function renderFilters() {
  const areas = [['all', 'Alle områder', '']].concat(Object.keys(AREAS).map((k) => [k, k + ' · ' + AREAS[k], k]));
  $('area-filter').innerHTML = areas.map((a) =>
    '<button type="button" class="chip-btn' + (a[2] ? ' area-' + a[2] : '') + '" data-area="' + a[0] + '" aria-pressed="' + (filters.area === a[0]) + '">' + (a[2] ? '<i></i>' : '') + esc(a[1]) + '</button>').join('');
}

function render() {
  const ae = document.activeElement;
  if (ae && ae.closest && ae.closest('.detail')) { pendingRender = true; return; }
  pendingRender = false;
  renderSummary();
  renderBoard();
  renderTimeline();
  renderActivity();
}

/* ---------- events ---------- */
function onTimelineClick(e) {
  const st = e.target.closest('[data-start]');
  if (st) { const t = tasks.find((x) => x.id === st.dataset.start); if (t) startTask(t); return; }
  const fin = e.target.closest('[data-finish]');
  if (fin) { const t = tasks.find((x) => x.id === fin.dataset.finish); if (t && !t.done) toggleDone(t); return; }
  const rel = e.target.closest('[data-release]');
  if (rel) { const t = tasks.find((x) => x.id === rel.dataset.release); if (t) releaseTask(t); return; }
  const tog = e.target.closest('[data-toggle]');
  if (tog) { const t = tasks.find((x) => x.id === tog.dataset.toggle); if (t) toggleDone(t); return; }
  const more = e.target.closest('[data-more]');
  if (more) {
    const id = more.dataset.more;
    if (openIds.has(id)) openIds.delete(id); else openIds.add(id);
    render();
    return;
  }
  const save = e.target.closest('[data-save]');
  if (save) {
    const t = tasks.find((x) => x.id === save.dataset.save); if (!t) return;
    const id = t.id;
    const start = Math.max(1, Math.min(WEEKS, parseInt($('e-from-' + id).value, 10) || t.start));
    const end = Math.max(start, Math.min(WEEKS, parseInt($('e-to-' + id).value, 10) || t.end));
    const title = $('e-title-' + id).value.trim() || t.title;
    saveTask(t, {
      title, start, end, phase: phaseFor(end),
      area: $('e-area-' + id).value, kind: $('e-kind-' + id).value,
      note: $('e-note-' + id).value.trim(),
      owner: $('e-owner-' + id).value.trim() || null
    });
    return;
  }
  const del = e.target.closest('[data-del]');
  if (del) { const t = tasks.find((x) => x.id === del.dataset.del); if (t) deleteTask(t); }
}

function initUI() {
  renderFilters();
  renderWho();
  const areaSel = $('t-area');
  areaSel.innerHTML = Object.keys(AREAS).map((k) => '<option value="' + k + '">' + k + ' · ' + esc(AREAS[k]) + '</option>').join('');

  $('timeline').addEventListener('click', onTimelineClick);
  $('board').addEventListener('click', onBoardClick);
  $('people').addEventListener('click', (e) => {
    const b = e.target.closest('[data-person]'); if (!b) return;
    filters.person = filters.person === b.dataset.person ? null : b.dataset.person;
    render();
  });
  $('timeline').addEventListener('focusout', () => { if (pendingRender) setTimeout(() => { const a = document.activeElement; if (!(a && a.closest && a.closest('.detail'))) render(); }, 0); });

  $('area-filter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-area]'); if (!b) return;
    filters.area = b.dataset.area; renderFilters(); render();
  });
  $('status-filter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    filters.status = b.dataset.v;
    document.querySelectorAll('#status-filter button').forEach((x) => x.classList.toggle('on', x === b));
    render();
  });
  $('gates-only').addEventListener('change', (e) => { filters.gatesOnly = e.target.checked; render(); });

  $('btn-add').addEventListener('click', () => {
    guard(() => {
      const wk = Math.min(WEEKS, Math.max(1, currentWeek()));
      $('t-title').value = ''; $('t-from').value = wk; $('t-to').value = wk; $('t-kind').value = 'opgave';
      $('task-err').textContent = '';
      $('dlg-task').showModal(); $('t-title').focus();
    });
  });
  $('task-cancel').addEventListener('click', () => $('dlg-task').close());
  $('form-task').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('t-title').value.trim();
    const start = Math.max(1, Math.min(WEEKS, parseInt($('t-from').value, 10) || 1));
    const end = Math.max(start, Math.min(WEEKS, parseInt($('t-to').value, 10) || start));
    if (!title) { $('task-err').textContent = 'Skriv en titel.'; return; }
    const name = session && session.name ? session.name : 'Ukendt';
    const ref = tasksRef.push();
    ref.set({
      title, start, end, phase: phaseFor(end), area: $('t-area').value, kind: $('t-kind').value,
      partial: false, est: false, done: false, note: '', createdBy: name, createdAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => { showBanner(''); $('dlg-task').close(); return logActivity(name, 'tilføjede "' + title + '"'); })
      .catch((err) => { $('task-err').textContent = friendlyErr(err); });
  });

  $('btn-settings').addEventListener('click', () => {
    guard(() => { $('in-start').value = config.startDate; $('dlg-start').showModal(); });
  });
  $('start-cancel').addEventListener('click', () => $('dlg-start').close());
  $('form-start').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('in-start').value;
    if (!v) return;
    const name = session && session.name ? session.name : 'Ukendt';
    configRef.child('startDate').set(v).then(() => { $('dlg-start').close(); return logActivity(name, 'satte startdato for uge 1 til ' + shortDate(parseDate(v))); })
      .catch((err) => showBanner(friendlyErr(err)));
  });
}

/* ---------- firebase ---------- */
function initFirebase() {
  firebase.initializeApp(window.FIREBASE_CONFIG);
  db = firebase.database();
  tasksRef = db.ref(ROOT + '/tasks');
  configRef = db.ref(ROOT + '/config');
  activityRef = db.ref(ROOT + '/activity');
  metaRef = db.ref(ROOT + '/meta');

  configRef.on('value', (snap) => {
    const v = snap.val() || {};
    config = { startDate: v.startDate || DEFAULT_START };
    loaded.config = true;
    render();
  }, (err) => showBanner(friendlyErr(err)));

  tasksRef.on('value', (snap) => {
    const v = snap.val() || {};
    tasks = Object.keys(v).map((id) => {
      const t = v[id];
      return {
        id, title: t.title || '', phase: t.phase || phaseFor(t.end || 1),
        start: t.start || 1, end: t.end || t.start || 1, area: t.area || 'A', kind: t.kind || 'opgave',
        partial: !!t.partial, est: !!t.est, done: !!t.done, doneBy: t.doneBy || null, doneAt: t.doneAt || null,
        owner: t.owner || null, startedAt: t.startedAt || null,
        note: t.note || '', createdBy: t.createdBy || ''
      };
    });
    if (!loaded.tasks) { loaded.tasks = true; if (!tasks.length) seedIfEmpty(); }
    render();
  }, (err) => showBanner(friendlyErr(err)));

  activityRef.orderByChild('ts').limitToLast(25).on('value', (snap) => {
    const arr = [];
    snap.forEach((c) => { arr.push(c.val()); });
    activity = arr.reverse();
    render();
  }, () => {});
}

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  render();
  initFirebase();
});
