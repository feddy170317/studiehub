/* Bordfodbold — table football trophy tracker
   Realtime state via Firebase RTDB under /bordfodbold, shared with QuizLive's project. */

const PLAYERS = ['Frederik', 'Stefan', 'Line'];
const PLAYER_COLOR = { Frederik: 'var(--frederik)', Stefan: 'var(--stefan)', Line: 'var(--line)' };
const DEFAULT_PIN = '2026';
const SEASON_LABEL = 'Season ' + new Date().getFullYear();

let db, matchesRef, pinRef;
let matches = [];
let currentPin = DEFAULT_PIN;

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

function computeStandings(list) {
  const stats = {};
  PLAYERS.forEach(p => { stats[p] = { wins: 0, losses: 0, matches: 0, goalsFor: 0, goalsAgainst: 0 }; });
  list.forEach(m => {
    const a = stats[m.playerA], b = stats[m.playerB];
    if (!a || !b) return;
    a.matches++; b.matches++;
    a.goalsFor += m.scoreA; a.goalsAgainst += m.scoreB;
    b.goalsFor += m.scoreB; b.goalsAgainst += m.scoreA;
    if (m.winner === m.playerA) { a.wins++; b.losses++; } else { b.wins++; a.losses++; }
  });
  return stats;
}

/* Trophy always sits with whoever won the most recent match — a challenger
   who beats the incumbent simply takes it, a challenger who loses gets nothing.

   The poo (💩) is stickier: it only ever moves when its CURRENT holder is one
   of the two players in a match.
     - holder plays and wins  -> poo passes to the player they beat
     - holder plays and loses -> holder keeps it
     - holder isn't playing   -> nothing happens, no matter who wins
   The very first match ever logged has no holder yet, so it bootstraps the
   poo onto its loser (mirroring the trophy bootstrapping onto its winner). */
function computeTrophyState(list) {
  const chrono = [...list].sort((a, b) => (a.ts || 0) - (b.ts || 0));
  let gold = null, poo = null;
  chrono.forEach(m => {
    const { winner, loser } = m;
    if (!winner || !loser) return;
    gold = winner; // winner of the latest match always holds the trophy
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
  const sorted = [...matches].sort((a, b) => (b.ts || 0) - (a.ts || 0));
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
          <div class="stat"><b>${winPct}%</b><span>Win rate</span></div>
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
    </tr>`).join('');
}

function renderHistory(sorted) {
  const el = document.getElementById('match-list');
  if (!sorted.length) {
    el.innerHTML = '<div class="empty-note">No matches logged yet — be the first to challenge for the trophy.</div>';
    return;
  }
  el.innerHTML = sorted.map(m => `
    <div class="match-row" data-id="${m.id}">
      <div class="who">
        <span class="win">${m.winner}</span>
        <span class="score">${m.winner === m.playerA ? m.scoreA : m.scoreB} – ${m.winner === m.playerA ? m.scoreB : m.scoreA}</span>
        <span class="lose">${m.loser}</span>
      </div>
      <div class="who">
        <span class="date">${formatDate(m.date)}</span>
        <button class="del-btn" title="Delete this match" data-del="${m.id}">🗑</button>
      </div>
    </div>`).join('');

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

function computeHeadToHead(list, p1, p2) {
  const between = list
    .filter(m => (m.playerA === p1 && m.playerB === p2) || (m.playerA === p2 && m.playerB === p1))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  let wins1 = 0, wins2 = 0, goals1 = 0, goals2 = 0;
  between.forEach(m => {
    const g1 = m.playerA === p1 ? m.scoreA : m.scoreB;
    const g2 = m.playerA === p1 ? m.scoreB : m.scoreA;
    goals1 += g1; goals2 += g2;
    if (m.winner === p1) wins1++; else wins2++;
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
  const summary = `
    <div class="h2h-summary">
      <div class="h2h-side"><span class="h2h-name" style="color:${PLAYER_COLOR[p1]}">${p1}</span><b>${wins1}</b></div>
      <div class="h2h-mid">wins &middot; ${between.length} played</div>
      <div class="h2h-side"><b>${wins2}</b><span class="h2h-name" style="color:${PLAYER_COLOR[p2]}">${p2}</span></div>
    </div>
    <div class="h2h-goals">Goals: ${goals1} &ndash; ${goals2}</div>`;
  const list = between.map(m => `
    <div class="match-row">
      <div class="who">
        <span class="win">${m.winner}</span>
        <span class="score">${m.winner === m.playerA ? m.scoreA : m.scoreB} – ${m.winner === m.playerA ? m.scoreB : m.scoreA}</span>
        <span class="lose">${m.loser}</span>
      </div>
      <div class="who"><span class="date">${formatDate(m.date)}</span></div>
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

function openModal() {
  document.getElementById('match-form').reset();
  document.getElementById('matchDate').value = todayStr();
  populatePlayerSelects();
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
  const playerA = document.getElementById('playerA').value;
  const playerB = document.getElementById('playerB').value;
  const scoreA = parseInt(document.getElementById('scoreA').value, 10);
  const scoreB = parseInt(document.getElementById('scoreB').value, 10);
  const date = document.getElementById('matchDate').value;
  const pin = document.getElementById('pinInput').value;

  if (playerA === playerB) { errEl.textContent = 'Pick two different players.'; return; }
  if (Number.isNaN(scoreA) || Number.isNaN(scoreB) || scoreA < 0 || scoreB < 0) { errEl.textContent = 'Enter valid scores.'; return; }
  if (scoreA === scoreB) { errEl.textContent = 'Foosball has no draws — one score must be higher.'; return; }
  if (!date) { errEl.textContent = 'Pick a date.'; return; }
  if (pin !== currentPin) { errEl.textContent = 'Wrong PIN.'; return; }

  const winner = scoreA > scoreB ? playerA : playerB;
  const loser = winner === playerA ? playerB : playerA;

  matchesRef.push({
    playerA, playerB, scoreA, scoreB, date, winner, loser,
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
  populateH2HSelects();
  document.getElementById('h2hPlayerA').addEventListener('change', syncH2HOptions);
  document.getElementById('h2hPlayerB').addEventListener('change', renderHeadToHead);
  initFirebase();
});
