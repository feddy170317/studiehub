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

function currentTrophyHolders(list) {
  if (!list.length) return { gold: null, poo: null };
  const latest = list[0]; // list is sorted newest first
  return { gold: latest.winner, poo: latest.loser };
}

function render() {
  const sorted = [...matches].sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const { gold, poo } = currentTrophyHolders(sorted);
  const stats = computeStandings(sorted);

  renderPlayers(gold, poo, stats);
  renderStandings(stats);
  renderHistory(sorted);
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
      : (isPoo ? '<div class="player-status poo-text">Lost the last challenge</div>' : '<div class="player-status">&nbsp;</div>');
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
  initFirebase();
});
