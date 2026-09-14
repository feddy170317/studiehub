/* Bordfodbold — table football trophy tracker
   Realtime state via Firebase RTDB under /bordfodbold, shared with QuizLive's project. */

const PLAYERS = ['Frederik', 'Steffan', 'Line', 'Mads', 'Sebastian', 'Johannes'];
const PLAYER_COLOR = { Frederik: 'var(--frederik)', Steffan: 'var(--steffan)', Line: 'var(--line)', Mads: 'var(--mads)', Sebastian: 'var(--sebastian)', Johannes: 'var(--johannes)' };
const DEFAULT_PIN = '2026';
const SEASON_LABEL = 'Season ' + new Date().getFullYear();
const TEAM_SELECT_IDS = ['teamA1', 'teamA2', 'teamB1', 'teamB2'];
const TEAM_DEFAULTS = { teamA1: 'Frederik', teamA2: 'Line', teamB1: 'Steffan', teamB2: 'Mads' };

let db, matchesRef, pinRef;
let matches = [];
let currentPin = DEFAULT_PIN;
let currentMode = '1v1';

function initials(name) {
  return name.slice(0, 2).toUpperCase();
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function teamLabel(names) {
  return names.join(' & ');
}

/* Every stored match — old 1v1 records (playerA/playerB/winner/loser) and new
   1v1-or-2v2 records (mode/teamA/teamB) alike — normalizes to a common shape:
   { mode, teamA: [...1 or 2 names], teamB: [...1 or 2 names], winners, losers }.
   Everything downstream (standings, trophy, history, head-to-head) reads only
   this normalized shape so both record generations render identically. */
function normalizeMatch(raw) {
  const teamAWon = raw.scoreA > raw.scoreB;
  if (raw.mode === '2v2' && Array.isArray(raw.teamA) && Array.isArray(raw.teamB)) {
    return {
      ...raw, mode: '2v2', teamA: raw.teamA, teamB: raw.teamB,
      winners: teamAWon ? raw.teamA : raw.teamB,
      losers: teamAWon ? raw.teamB : raw.teamA,
    };
  }
  const teamA = raw.playerA ? [raw.playerA] : (raw.teamA || []);
  const teamB = raw.playerB ? [raw.playerB] : (raw.teamB || []);
  return {
    ...raw, mode: '1v1', teamA, teamB,
    winners: raw.winner ? [raw.winner] : (teamAWon ? teamA : teamB),
    losers: raw.loser ? [raw.loser] : (teamAWon ? teamB : teamA),
  };
}

/* KDA-style rating: goals scored weighted against goals conceded. A player
   who has never conceded shows their raw goal count (mirrors how a 0-death
   KDA is conventionally reported) rather than blowing up to Infinity. */
function rating(s) {
  if (!s.matches) return '—';
  return (s.goalsFor / (s.goalsAgainst || 1)).toFixed(2);
}

function computeStandings(list) {
  const stats = {};
  PLAYERS.forEach(p => { stats[p] = { wins: 0, losses: 0, matches: 0, goalsFor: 0, goalsAgainst: 0 }; });
  list.forEach(raw => {
    const m = normalizeMatch(raw);
    const teamAWon = m.scoreA > m.scoreB;
    m.teamA.forEach(p => {
      const s = stats[p]; if (!s) return;
      s.matches++; s.goalsFor += m.scoreA; s.goalsAgainst += m.scoreB;
      if (teamAWon) s.wins++; else s.losses++;
    });
    m.teamB.forEach(p => {
      const s = stats[p]; if (!s) return;
      s.matches++; s.goalsFor += m.scoreB; s.goalsAgainst += m.scoreA;
      if (!teamAWon) s.wins++; else s.losses++;
    });
  });
  return stats;
}

/* Chronological sort key: the match's actual played DATE decides order, never
   the order it was typed into the app. This lets a forgotten match get logged
   late (e.g. entering yesterday's game after today's is already in) without
   scrambling who holds the trophy today — it slots into its true place in the
   timeline and the state is recomputed from there. Same-day matches fall back
   to entry order (ts) as the best available tiebreak. */
function matchDateKey(m) {
  return `${m.date || '0000-00-00'}#${String(m.ts || 0).padStart(20, '0')}`;
}

/* The trophy (🏆) and poo (💩) are a personal 1-on-1 challenge mechanic, so
   only 1v1 matches feed them — a 2v2 co-op win/loss never touches either.

   The trophy only changes hands via a successful CHALLENGE against its
   current holder:
     - holder plays and wins   -> trophy stays put
     - holder plays and loses  -> trophy passes to whoever beat them
     - holder isn't playing    -> nothing happens, no matter who wins
   Beating some other, non-holding player never earns you the trophy — you can
   only take it off the person who has it. The very first 1v1 match ever
   logged has no holder yet, so it bootstraps the trophy onto its winner.

   The poo mirrors the same shape, just inverted:
     - holder plays and wins  -> poo passes to the player they beat
     - holder plays and loses -> holder keeps it
     - holder isn't playing   -> nothing happens, no matter who wins
   It bootstraps onto the first match's loser. */
function computeTrophyState(list) {
  const chrono = list
    .map(normalizeMatch)
    .filter(m => m.mode === '1v1')
    .sort((a, b) => matchDateKey(a).localeCompare(matchDateKey(b)));
  let gold = null, poo = null;
  chrono.forEach(m => {
    const winner = m.winners[0], loser = m.losers[0];
    if (!winner || !loser) return;
    if (gold === null) {
      gold = winner; // bootstrap: first match ever awards the trophy
    } else if (gold === loser) {
      gold = winner; // holder was challenged and lost -> trophy passes
    }
    // else: holder won (keeps it) or wasn't playing (no change)
    if (poo === null) {
      poo = loser; // bootstrap on the very first match
    } else if (poo === winner) {
      poo = loser; // holder won -> passes it on
    }
    // else: holder lost (keeps it) or wasn't playing (no change)
  });
  return { gold, poo };
}

function render() {
  const sorted = [...matches].sort((a, b) => matchDateKey(b).localeCompare(matchDateKey(a)));
  const { gold, poo } = computeTrophyState(matches);
  const stats = computeStandings(sorted);

  renderPlayers(gold, poo, stats);
  renderStandings(stats);
  renderHistory(sorted);
  renderHeadToHead();
}

function renderPlayers(gold, poo, stats) {
  const el = document.getElementById('players');
  el.innerHTML = PLAYERS.map(p => {
    const isGold = p === gold;
    const isPoo = p === poo && !isGold;
    const cardClass = isGold ? 'trophy' : (isPoo ? 'poo' : '');
    const badge = isGold
      ? '<div class="badge gold">🏆</div>'
      : (isPoo ? '<div class="badge poo-badge">💩</div>' : '');
    const status = isGold
      ? '<div class="player-status gold-text">Holds the trophy</div>'
      : (isPoo ? '<div class="player-status poo-text">Stuck with the 💩</div>' : '<div class="player-status">&nbsp;</div>');
    const s = stats[p];
    const winPct = s.matches ? Math.round((s.wins / s.matches) * 100) : 0;
    return `
      <div class="player-card ${cardClass}">
        <div class="avatar-wrap">
          <div class="avatar" style="background:${PLAYER_COLOR[p]}">${initials(p)}</div>
          ${badge}
        </div>
        <div class="player-name">${p}</div>
        ${status}
        <div class="player-stats">
          <div class="stat"><b>${s.wins}</b><span>Wins</span></div>
          <div class="stat"><b>${s.goalsFor}</b><span>Goals</span></div>
          <div class="stat"><b>${rating(s)}</b><span>Rating</span></div>
          <div class="stat"><b>${winPct}%</b><span>Win%</span></div>
        </div>
      </div>`;
  }).join('');
}

function renderStandings(stats) {
  const rows = PLAYERS
    .map(p => ({ name: p, ...stats[p], diff: stats[p].goalsFor - stats[p].goalsAgainst }))
    .sort((a, b) => b.wins - a.wins || b.diff - a.diff || b.goalsFor - a.goalsFor);
  const body = document.getElementById('standings-body');
  body.innerHTML = rows.map((r, i) => `
    <tr>
      <td class="rank">${i + 1}</td>
      <td>${r.name}</td>
      <td class="num">${r.wins}</td>
      <td class="num">${r.matches}</td>
      <td class="num">${r.goalsFor}</td>
      <td class="num">${r.diff > 0 ? '+' : ''}${r.diff}</td>
      <td class="num">${rating(r)}</td>
    </tr>`).join('');
}

function matchRowHTML(raw, m) {
  const teamAWon = m.scoreA > m.scoreB;
  const winTeam = teamAWon ? m.teamA : m.teamB;
  const loseTeam = teamAWon ? m.teamB : m.teamA;
  const winScore = teamAWon ? m.scoreA : m.scoreB;
  const loseScore = teamAWon ? m.scoreB : m.scoreA;
  const modeBadge = m.mode === '2v2' ? '<span class="mode-badge">2v2</span>' : '';
  return `
    <div class="who">
      ${modeBadge}
      <span class="win">${teamLabel(winTeam)}</span>
      <span class="score">${winScore} – ${loseScore}</span>
      <span class="lose">${teamLabel(loseTeam)}</span>
    </div>`;
}

function renderHistory(sorted) {
  const el = document.getElementById('match-list');
  const countEl = document.getElementById('history-count');
  if (countEl) countEl.textContent = sorted.length ? `(${sorted.length})` : '';

  if (!sorted.length) {
    el.innerHTML = '<div class="empty-note">No matches logged yet — be the first to challenge for the trophy.</div>';
    return;
  }
  el.innerHTML = sorted.map(raw => {
    const m = normalizeMatch(raw);
    return `
    <div class="match-row" data-id="${raw.id}">
      ${matchRowHTML(raw, m)}
      <div class="who">
        <span class="date">${formatDate(raw.date)}</span>
        <button class="del-btn" title="Delete this match" data-del="${raw.id}">🗑</button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => deleteMatch(btn.getAttribute('data-del')));
  });
}

/* ---- Head-to-head ---- */
function populateH2HSelects() {
  const selA = document.getElementById('h2hPlayerA');
  const selB = document.getElementById('h2hPlayerB');
  if (selA.options.length) return; // only needs populating once
  selA.innerHTML = PLAYERS.map(p => `<option value="${p}">${p}</option>`).join('');
  selB.innerHTML = PLAYERS.map(p => `<option value="${p}">${p}</option>`).join('');
  selB.value = PLAYERS[1];
  syncH2HOptions();
}

function syncH2HOptions() {
  const a = document.getElementById('h2hPlayerA').value;
  const selB = document.getElementById('h2hPlayerB');
  const prevB = selB.value;
  selB.innerHTML = PLAYERS.filter(p => p !== a).map(p => `<option value="${p}">${p}</option>`).join('');
  if (PLAYERS.filter(p => p !== a).includes(prevB)) selB.value = prevB;
  renderHeadToHead();
}

/* A match counts for a p1-vs-p2 head-to-head only when they were on OPPOSING
   sides (works for 1v1 automatically; for 2v2 it only counts when they're on
   different teams — teammate matches aren't a "vs" result and are excluded).
   Goals tallied are each side's full match score — in 2v2 that's the shared
   team score, same attribution logic used for standings/rating. */
function computeHeadToHead(list, p1, p2) {
  const between = [];
  list.forEach(raw => {
    const m = normalizeMatch(raw);
    const p1InA = m.teamA.includes(p1), p1InB = m.teamB.includes(p1);
    const p2InA = m.teamA.includes(p2), p2InB = m.teamB.includes(p2);
    if ((p1InA && p2InB) || (p1InB && p2InA)) {
      between.push({ raw, m, p1Side: p1InA ? 'A' : 'B' });
    }
  });
  between.sort((a, b) => matchDateKey(b.raw).localeCompare(matchDateKey(a.raw)));
  let wins1 = 0, wins2 = 0, goals1 = 0, goals2 = 0;
  between.forEach(({ m, p1Side }) => {
    const g1 = p1Side === 'A' ? m.scoreA : m.scoreB;
    const g2 = p1Side === 'A' ? m.scoreB : m.scoreA;
    goals1 += g1; goals2 += g2;
    if (g1 > g2) wins1++; else wins2++;
  });
  return { between, wins1, wins2, goals1, goals2 };
}

function renderHeadToHead() {
  const selA = document.getElementById('h2hPlayerA');
  const selB = document.getElementById('h2hPlayerB');
  if (!selA || !selB) return;
  const p1 = selA.value, p2 = selB.value;
  const resultsEl = document.getElementById('h2h-results');
  if (!p1 || !p2 || p1 === p2) {
    resultsEl.innerHTML = '<div class="empty-note">Pick two different players.</div>';
    return;
  }
  const { between, wins1, wins2, goals1, goals2 } = computeHeadToHead(matches, p1, p2);
  if (!between.length) {
    resultsEl.innerHTML = `<div class="empty-note">${p1} and ${p2} haven’t played each other yet.</div>`;
    return;
  }
  const rating1 = (goals1 / (goals2 || 1)).toFixed(2);
  const rating2 = (goals2 / (goals1 || 1)).toFixed(2);
  const summary = `
    <div class="h2h-summary">
      <div class="h2h-side"><span class="h2h-name" style="color:${PLAYER_COLOR[p1]}">${p1}</span><b>${wins1}</b></div>
      <div class="h2h-mid">wins &middot; ${between.length} played</div>
      <div class="h2h-side"><b>${wins2}</b><span class="h2h-name" style="color:${PLAYER_COLOR[p2]}">${p2}</span></div>
    </div>
    <div class="h2h-goals">Goals: ${goals1} &ndash; ${goals2} &middot; Rating: ${rating1} / ${rating2}</div>`;
  const list = between.map(({ raw, m }) => `
    <div class="match-row">
      ${matchRowHTML(raw, m)}
      <div class="who"><span class="date">${formatDate(raw.date)}</span></div>
    </div>`).join('');
  resultsEl.innerHTML = summary + `<div class="match-list h2h-list">${list}</div>`;
}

function deleteMatch(id) {
  const pin = prompt('Enter PIN to delete this match:');
  if (pin === null) return;
  if (pin !== currentPin) { alert('Wrong PIN.'); return; }
  if (!confirm('Delete this match? This cannot be undone.')) return;
  matchesRef.child(id).remove();
}

/* ---- Modal / log match ---- */
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('mode-1v1-fields').style.display = mode === '1v1' ? '' : 'none';
  document.getElementById('mode-2v2-fields').style.display = mode === '2v2' ? '' : 'none';
  document.getElementById('scoreALabel').textContent = mode === '2v2' ? 'Team A score' : 'Score A';
  document.getElementById('scoreBLabel').textContent = mode === '2v2' ? 'Team B score' : 'Score B';
}

function populatePlayerSelects() {
  const selA = document.getElementById('playerA');
  const selB = document.getElementById('playerB');
  [selA, selB].forEach(sel => {
    sel.innerHTML = PLAYERS.map(p => `<option value="${p}">${p}</option>`).join('');
  });
  selB.value = PLAYERS[1];
  syncOpponentOptions();
}

function syncOpponentOptions() {
  const a = document.getElementById('playerA').value;
  const selB = document.getElementById('playerB');
  const prevB = selB.value;
  selB.innerHTML = PLAYERS.filter(p => p !== a).map(p => `<option value="${p}">${p}</option>`).join('');
  if (PLAYERS.filter(p => p !== a).includes(prevB)) selB.value = prevB;
}

/* Four independent player pickers for 2v2 (Team A x2, Team B x2). Each
   select's option list excludes whoever is currently picked in the OTHER
   three, so the four selections can never collide — while staying fully
   editable rather than locked to the usual Frederik+Line vs Steffan+Mads split. */
function populateTeamSelects() {
  TEAM_SELECT_IDS.forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = PLAYERS.map(p => `<option value="${p}">${p}</option>`).join('');
    if (PLAYERS.includes(TEAM_DEFAULTS[id])) sel.value = TEAM_DEFAULTS[id];
  });
  syncTeamOptions();
}

function syncTeamOptions() {
  const selects = TEAM_SELECT_IDS.map(id => document.getElementById(id));
  const values = selects.map(s => s.value);
  selects.forEach((sel, i) => {
    const usedByOthers = values.filter((v, j) => j !== i);
    const current = values[i];
    const options = PLAYERS.filter(p => !usedByOthers.includes(p) || p === current);
    sel.innerHTML = options.map(p => `<option value="${p}">${p}</option>`).join('');
    sel.value = current;
  });
}

function openModal() {
  document.getElementById('match-form').reset();
  document.getElementById('matchDate').value = todayStr();
  setMode('1v1');
  populatePlayerSelects();
  populateTeamSelects();
  document.getElementById('form-error').textContent = '';
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('playerA').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function submitMatch(e) {
  e.preventDefault();
  const errEl = document.getElementById('form-error');
  const scoreA = parseInt(document.getElementById('scoreA').value, 10);
  const scoreB = parseInt(document.getElementById('scoreB').value, 10);
  const date = document.getElementById('matchDate').value;
  const pin = document.getElementById('pinInput').value;

  if (Number.isNaN(scoreA) || Number.isNaN(scoreB) || scoreA < 0 || scoreB < 0) { errEl.textContent = 'Enter valid scores.'; return; }
  if (scoreA === scoreB) { errEl.textContent = 'Foosball has no draws — one score must be higher.'; return; }
  if (!date) { errEl.textContent = 'Pick a date.'; return; }
  if (pin !== currentPin) { errEl.textContent = 'Wrong PIN.'; return; }

  let payload;
  if (currentMode === '2v2') {
    const teamA = [document.getElementById('teamA1').value, document.getElementById('teamA2').value];
    const teamB = [document.getElementById('teamB1').value, document.getElementById('teamB2').value];
    if (new Set([...teamA, ...teamB]).size !== 4) { errEl.textContent = 'Pick four different players.'; return; }
    payload = { mode: '2v2', teamA, teamB, scoreA, scoreB, date };
  } else {
    const playerA = document.getElementById('playerA').value;
    const playerB = document.getElementById('playerB').value;
    if (playerA === playerB) { errEl.textContent = 'Pick two different players.'; return; }
    const winner = scoreA > scoreB ? playerA : playerB;
    const loser = winner === playerA ? playerB : playerA;
    payload = { mode: '1v1', playerA, playerB, scoreA, scoreB, date, winner, loser };
  }

  matchesRef.push({
    ...payload,
    ts: firebase.database.ServerValue.TIMESTAMP
  }).then(() => {
    closeModal();
  }).catch(err => {
    errEl.textContent = 'Could not save: ' + err.message;
  });
}

function initFirebase() {
  firebase.initializeApp(window.FIREBASE_CONFIG);
  db = firebase.database();
  matchesRef = db.ref('bordfodbold/matches');
  pinRef = db.ref('bordfodbold/config/pin');

  pinRef.once('value').then(snap => {
    if (snap.exists()) {
      currentPin = snap.val();
    } else {
      pinRef.set(DEFAULT_PIN);
      currentPin = DEFAULT_PIN;
    }
  });

  matchesRef.on('value', snap => {
    const val = snap.val() || {};
    matches = Object.keys(val).map(id => ({ id, ...val[id] }));
    render();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('season-label').textContent = SEASON_LABEL;
  document.getElementById('open-modal-btn').addEventListener('click', openModal);
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.getElementById('match-form').addEventListener('submit', submitMatch);
  document.getElementById('playerA').addEventListener('change', syncOpponentOptions);
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
  TEAM_SELECT_IDS.forEach(id => {
    document.getElementById(id).addEventListener('change', syncTeamOptions);
  });
  populateH2HSelects();
  document.getElementById('h2hPlayerA').addEventListener('change', syncH2HOptions);
  document.getElementById('h2hPlayerB').addEventListener('change', renderHeadToHead);
  initFirebase();
});
