/* ============================================================
   QuizLive — Player-logik (assets/player.js)
   Mobilfirst. Ingen ES-moduler. Ren globals.
   ============================================================ */

(function () {
  'use strict';

  /* --- Tjek Firebase-config --- */
  if (!window.FIREBASE_CONFIG || window.FIREBASE_CONFIG.apiKey.indexOf('INDSAET') !== -1) {
    document.getElementById('firebase-banner').classList.add('show');
    return;
  }

  /* --- Firebase init --- */
  firebase.initializeApp(window.FIREBASE_CONFIG);
  var db = firebase.database();

  /* --- Sprog: byg toggle-pillen + oversæt alt statisk mærket indhold --- */
  if (window.QL_LANG) {
    QL_LANG.renderToggle(document.getElementById('lang-toggle-container'));
    QL_LANG.applyStatic();
  }
  var t = window.QL_LANG ? QL_LANG.t : function (key) { return key; };

  /* --- State --- */
  var state = {
    pin: '',
    playerId: '',
    name: '',
    registered: false,
    currentPhase: '',
    currentQIndex: -1,
    hasAnswered: false,
    serverTimeOffset: 0,
    timerInterval: null,
    timerSec: 20,
    stateRef: null,
    stateListener: null,
    sdRound: 0,       // aktiv Sudden Death-runde (0-baseret) — bruges som DB-svar-nøgle
    estLoadedKey: null, // hvilket spørgsmål prisgæt-panelet sidst er udfyldt til
    estQ: null,         // seneste /question-data for prisgæt (ledetråde publiceres løbende af hosten)
    estQRef: null,
    estQListener: null
  };

  /* --- Skærm-hjælper --- */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* --- localStorage genindmeld --- */
  function tryRestore() {
    try {
      var saved = JSON.parse(localStorage.getItem('quizlive_player') || 'null');
      if (saved && saved.pin && saved.playerId && saved.name) {
        return saved;
      }
    } catch (e) {}
    return null;
  }

  function saveSession() {
    localStorage.setItem('quizlive_player', JSON.stringify({
      pin: state.pin,
      playerId: state.playerId,
      name: state.name,
      registered: state.registered
    }));
  }

  function clearSession() {
    localStorage.removeItem('quizlive_player');
  }

  /* --- Elev-PIN huskes på tværs af spil (separat fra sessionen ovenfor,
     som ryddes efter hvert spil) --- */
  function saveElevPin(elevPin) {
    try { localStorage.setItem('quizlive_elevpin', elevPin); } catch (e) {}
  }
  function getSavedElevPin() {
    try { return localStorage.getItem('quizlive_elevpin') || ''; } catch (e) { return ''; }
  }

  /* --- URL-param PIN --- */
  function getUrlPin() {
    try {
      return new URLSearchParams(window.location.search).get('pin') || '';
    } catch (e) { return ''; }
  }

  /* --- Pre-udfyld PIN fra URL --- */
  var urlPin = getUrlPin();
  if (urlPin) {
    document.getElementById('input-pin').value = urlPin;
  }

  /* --- Pre-udfyld elev-PIN fra tidligere besøg --- */
  var savedElevPin = getSavedElevPin();
  if (savedElevPin) {
    document.getElementById('input-elevpin').value = savedElevPin;
  }

  /* --- Server-tid offset --- */
  db.ref('.info/serverTimeOffset').on('value', function (snap) {
    state.serverTimeOffset = snap.val() || 0;
  });

  function serverNow() {
    return Date.now() + state.serverTimeOffset;
  }

  /* --- Fejl-besked --- */
  function setError(msg) {
    document.getElementById('join-error').textContent = msg;
  }

  /* --- Deltag-knap --- */
  document.getElementById('btn-join').addEventListener('click', function () {
    var pin = document.getElementById('input-pin').value.trim();
    var elevPin = document.getElementById('input-elevpin').value.trim();
    var name = document.getElementById('input-name').value.trim();

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError(t('join.errPinLength'));
      return;
    }

    // Registreret elev — elev-PIN har forrang over gæste-navn
    if (elevPin) {
      if (!/^\d{4}$/.test(elevPin)) {
        setError(t('join.errElevPinLength'));
        return;
      }
      setError('');
      db.ref('students/' + elevPin).once('value', function (snap) {
        if (!snap.exists()) {
          setError(t('join.errElevPinNotFound'));
          return;
        }
        var studentName = (snap.val() && snap.val().name) || '';
        saveElevPin(elevPin);
        joinGame(pin, studentName, elevPin, true);
      }, function () {
        setError(t('join.errElevPinLookupFailed'));
      });
      return;
    }

    // Gæst — kræver navn
    if (!name) {
      setError(t('join.errNameRequired'));
      return;
    }

    setError('');
    joinGame(pin, name, null, false);
  });

  function joinGame(pin, name, existingPlayerId, registered) {
    db.ref('games/' + pin).once('value', function (snap) {
      if (!snap.exists()) {
        setError(t('join.errGameNotFound'));
        return;
      }
      var gameData = snap.val();
      var phase = gameData.state ? gameData.state.phase : '';

      // Registrerede elever bruger deres elev-PIN som stabilt playerId
      // (samme id ved genindmeldelse); gæster får et tilfældigt id.
      var playerId = existingPlayerId || ('p_' + Math.random().toString(36).slice(2, 10));

      state.pin = pin;
      state.playerId = playerId;
      state.name = name;
      state.registered = !!registered;
      state.timerSec = gameData.config ? (gameData.config.timerSec || 20) : 20;

      // Skriv spiller til databasen (merge-safe: sæt kun navn+joinedAt hvis ny)
      var playerRef = db.ref('games/' + pin + '/players/' + playerId);
      playerRef.once('value', function (pSnap) {
        if (!pSnap.exists()) {
          var playerData = { name: name, score: 0, joinedAt: firebase.database.ServerValue.TIMESTAMP };
          if (registered) playerData.registered = true;
          playerRef.set(playerData);
        }
        saveSession();
        startListening(phase);
      });
    });
  }

  /* --- Lyt på state-ændringer --- */
  function startListening(initialPhase) {
    // Vis lobby med det samme
    document.getElementById('lobby-greeting').textContent = t('lobby.greeting', { name: state.name });
    showScreen('screen-lobby');
    updateLeaveBtnVisibility();

    if (initialPhase && initialPhase !== 'lobby') {
      handlePhase(initialPhase);
    }

    state.stateRef = db.ref('games/' + state.pin + '/state');
    state.stateListener = function (snap) {
      if (!snap.exists()) {
        // Spillet er slettet
        leaveGame(t('game.endedMsg'));
        return;
      }
      var s = snap.val();
      handlePhase(s.phase, s);
    };
    state.stateRef.on('value', state.stateListener);
  }

  /* --- Forlad det aktuelle spil (manuelt via knap, eller fordi spillet er væk) ---
     Frakobler DB-lytteren, rydder session + timer, og viser deltag-skærmen igen.
     Uden dette sidder en spiller fast i et gammelt/afsluttet spil, hvis værten
     lukker fanen uden at trykke "Afslut spil" — se play-again-bug 2026-08-05. */
  function leaveGame(msg) {
    if (state.stateRef && state.stateListener) {
      state.stateRef.off('value', state.stateListener);
    }
    state.stateRef = null;
    state.stateListener = null;
    stopEstimateListener();
    clearTimer();
    clearSession();
    state.pin = '';
    state.playerId = '';
    state.registered = false;
    state.currentPhase = '';
    state.currentQIndex = -1;
    state.hasAnswered = false;
    updateLeaveBtnVisibility();
    showScreen('screen-join');
    document.getElementById('input-pin').value = getUrlPin();
    setError(msg || '');
  }

  /* --- "Forlad spil"-knap: vises på alle skærme undtagen deltag-skærmen --- */
  var btnLeave = document.getElementById('btn-leave');
  if (btnLeave) {
    btnLeave.addEventListener('click', function () {
      leaveGame('');
    });
  }
  function updateLeaveBtnVisibility() {
    if (!btnLeave) return;
    btnLeave.style.display = state.pin ? 'flex' : 'none';
  }

  /* --- Vedvarende "Spørgsmål N/Total"-badge (synlig på tværs af alle skærme
     mens quizzen kører, ikke kun mens selve spørgsmålet vises) --- */
  function updateProgressBadge(current, total) {
    var el = document.getElementById('player-progress-badge');
    if (!el || !total) return;
    el.textContent = t('progress.label', { n: current, total: total });
    el.style.display = 'block';
  }
  function hideProgressBadge() {
    var el = document.getElementById('player-progress-badge');
    if (el) el.style.display = 'none';
  }

  function handlePhase(phase, stateData) {
    stateData = stateData || {};
    state.lastStateData = stateData;
    var prevPhase = state.currentPhase;
    state.currentPhase = phase;
    if (phase !== 'question' && phase !== 'suddendeath') stopEstimateListener();

    if (phase === 'lobby') {
      hideProgressBadge();
      showScreen('screen-lobby');

    } else if (phase === 'question') {
      var qIndex = stateData.qIndex !== undefined ? stateData.qIndex : state.currentQIndex;
      if (qIndex !== state.currentQIndex) {
        state.currentQIndex = qIndex;
        state.hasAnswered = false;
        state.lastGuessMsg = null;
      }
      if (stateData.totalQ) updateProgressBadge(qIndex + 1, stateData.totalQ);
      showQuestionScreen(stateData);

    } else if (phase === 'reveal') {
      clearTimer();
      if (stateData.totalQ) {
        var qi = stateData.qIndex !== undefined ? stateData.qIndex : state.currentQIndex;
        updateProgressBadge(qi + 1, stateData.totalQ);
      }
      showRevealScreen(stateData);

    } else if (phase === 'scoreboard') {
      // Vis fortsat reveal / score mens host viser scoreboard
      // Player opdaterer score-visning
      if (stateData.totalQ) {
        var qi2 = stateData.qIndex !== undefined ? stateData.qIndex : state.currentQIndex;
        updateProgressBadge(qi2 + 1, stateData.totalQ);
      }
      showRevealScreen(stateData, true);

    } else if (phase === 'suddendeath') {
      hideProgressBadge();
      state.sdRound = stateData.sdRound || 0;
      var participants = stateData.sdParticipantIds || [];
      var amParticipant = participants.indexOf(state.playerId) !== -1;
      if (amParticipant) {
        var sdKey = 'sd_' + state.sdRound;
        if (sdKey !== state.currentQIndex) {
          state.currentQIndex = sdKey;
          state.hasAnswered = false;
          state.lastGuessMsg = null;
        }
        showQuestionScreen(stateData);
      } else {
        clearTimer();
        showSdSpectatorScreen(stateData);
      }

    } else if (phase === 'podium') {
      clearTimer();
      hideProgressBadge();
      showPodiumScreen();
    }
  }

  /* --- Spørgsmål-skærm (bruges til både almindelige spørgsmål og Sudden Death) --- */
  function showQuestionScreen(stateData) {
    showScreen('screen-question');

    var sdBanner = document.getElementById('sd-player-banner');
    if (sdBanner) sdBanner.style.display = (state.currentPhase === 'suddendeath') ? 'block' : 'none';

    // Prisgæt ("Hvad koster det?") viser billede + talfelt i stedet for de 4 knapper
    var isEst = stateData.qType === 'estimate';
    document.getElementById('answer-grid').style.display = isEst ? 'none' : '';
    document.getElementById('estimate-panel').style.display = isEst ? 'flex' : 'none';
    if (isEst) loadEstimateQuestion();

    // Nulstil knapper
    var btns = document.querySelectorAll('.answer-btn');
    btns.forEach(function (b) {
      b.style.opacity = '';
    });
    setInputsLocked(false);
    var answeredMsg = document.getElementById('answered-msg');
    answeredMsg.style.display = 'none';
    answeredMsg.textContent = t('question.answeredMsg');

    if (state.hasAnswered) {
      // Allerede besvaret — vis locked state
      setInputsLocked(true);
      if (isEst && state.lastGuessMsg) answeredMsg.textContent = state.lastGuessMsg;
      answeredMsg.style.display = 'block';
    }
    // Sudden Death-prisgæt: vis prisen + alle bud, når hosten har afgjort runden
    var qBids = document.getElementById('q-bids');
    if (isEst && state.currentPhase === 'suddendeath' && typeof stateData.estAnswer === 'number') {
      answeredMsg.textContent = t('est.priceWas', { answer: fmtKr(stateData.estAnswer) });
      answeredMsg.style.display = 'block';
      showBids(qBids);
    } else {
      qBids.style.display = 'none';
    }

    // Timer — brug spørgsmålets EGEN tid, hvis den er publiceret (Sudden
    // Death har altid 10s uanset spillets normale indstilling), ellers
    // faldes tilbage til tiden fra da spilleren meldte sig ind.
    startTimerBar(stateData.questionStartAt, stateData.timerSec || state.timerSec);
  }

  /* --- Sudden Death: tilskuer-skærm (spilleren er IKKE med i afgørelsen) --- */
  function showSdSpectatorScreen(stateData) {
    db.ref('games/' + state.pin + '/players').once('value', function (snap) {
      var players = snap.val() || {};
      var names = (stateData.sdParticipantIds || []).map(function (pid) {
        return (players[pid] && players[pid].name) || '?';
      });
      document.getElementById('sd-spectator-names').textContent = names.join(' 🆚 ');
      var specBids = document.getElementById('sd-spectator-bids');
      if (stateData.qType === 'estimate' && typeof stateData.estAnswer === 'number') showBids(specBids);
      else specBids.style.display = 'none';
      showScreen('screen-sd-spectator');
    });
  }

  function startTimerBar(questionStartAt, timerSec) {
    clearTimer();
    if (!questionStartAt) return;

    var bar = document.getElementById('q-timer-bar');

    function tick() {
      var elapsed = (serverNow() - questionStartAt) / 1000;
      var remaining = timerSec - elapsed;
      if (remaining < 0) remaining = 0;
      var pct = (remaining / timerSec) * 100;
      bar.style.width = pct + '%';
      if (remaining <= 5) {
        bar.classList.add('urgent');
      } else {
        bar.classList.remove('urgent');
      }
      updateEstMeter(elapsed);
      if (remaining <= 0) {
        clearTimer();
        // Lås knapperne — for sene svar tæller alligevel ikke hos hosten
        if (!state.hasAnswered) {
          state.hasAnswered = true;
          setInputsLocked(true);
          var msg = document.getElementById('answered-msg');
          msg.textContent = t('question.timeUp');
          msg.style.display = 'block';
        }
      }
    }

    tick();
    state.timerInterval = setInterval(tick, 100);
  }

  function clearTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  /* --- Lås/oplås alle svar-input (4 knapper + prisgæt-felt) --- */
  function setInputsLocked(locked) {
    document.querySelectorAll('.answer-btn').forEach(function (b) { b.disabled = locked; });
    var inp = document.getElementById('est-input');
    var sub = document.getElementById('est-submit');
    if (inp) inp.disabled = locked;
    if (sub) sub.disabled = locked;
  }

  function fmtKr(n) {
    return Number(n).toLocaleString('da-DK') + ' kr';
  }

  /* Svar-sti: Sudden Death bruger sdAnswers/{round}, ellers answers/{qIndex} */
  function answerRefFor() {
    if (state.currentPhase === 'suddendeath') {
      return db.ref('games/' + state.pin + '/sdAnswers/r' + (state.sdRound || 0) + '/' + state.playerId);
    }
    return db.ref('games/' + state.pin + '/answers/' + state.currentQIndex + '/' + state.playerId);
  }

  /* --- Prisgæt: lyt på det aktuelle spørgsmål. Hosten publicerer ledetrådene
     løbende (sløret billede → skarpt + navn → stand/mærke → citat → antal
     cifre), så vi abonnerer i stedet for at læse én gang. --- */
  function loadEstimateQuestion() {
    var key = String(state.currentQIndex);
    if (state.estLoadedKey === key) return;
    stopEstimateListener();
    state.estLoadedKey = key;
    state.estQ = null;
    var img = document.getElementById('est-img');
    var input = document.getElementById('est-input');
    img.setAttribute('src', '');
    img.classList.remove('est-blur');
    document.getElementById('est-item').textContent = '';
    document.getElementById('est-clues').innerHTML = '';
    document.getElementById('est-meter').textContent = '';
    if (!state.hasAnswered) input.value = '';
    state.estQRef = db.ref('games/' + state.pin + '/question');
    state.estQListener = function (snap) {
      if (state.estLoadedKey !== key) return; // nyt spørgsmål er kommet i mellemtiden
      var q = snap.val() || {};
      state.estQ = q;
      if (img.getAttribute('src') !== (q.imgUrl || '')) img.setAttribute('src', q.imgUrl || '');
      img.classList.toggle('est-blur', !!q.progressive && (q.step || 0) === 0);
      document.getElementById('est-item').textContent = q.item || (q.progressive ? t('est.unknownItem') : '');
      document.getElementById('est-unit').textContent = q.unit || 'kr';
      var clues = q.clues || [];
      renderClueList(document.getElementById('est-clues'), clues, !!q.progressive);
      document.getElementById('estimate-panel').classList.toggle('has-clues', clues.length > 0);
    };
    state.estQRef.on('value', state.estQListener);
  }

  function stopEstimateListener() {
    if (state.estQRef && state.estQListener) state.estQRef.off('value', state.estQListener);
    state.estQRef = null;
    state.estQListener = null;
    state.estLoadedKey = null;
  }

  function renderClueList(container, clues, markNewest) {
    var have = container.children.length;
    if (have > clues.length) { container.innerHTML = ''; have = 0; }
    Array.prototype.forEach.call(container.children, function (el) { el.classList.remove('newest'); });
    for (var i = have; i < clues.length; i++) {
      var div = document.createElement('div');
      div.className = 'est-clue' + (markNewest && i === clues.length - 1 ? ' newest' : '');
      div.textContent = clues[i];
      container.appendChild(div);
    }
  }

  /* Samme trin-/faktor-regel som host.js's estFactor() — kun til visning;
     hosten beregner de rigtige point ud fra svarets server-tidsstempel. */
  function estFactorLocal(step, n) {
    if (n <= 1) return 1;
    return 1 - 0.5 * step / (n - 1);
  }
  function estStepAt(elapsedSec) {
    var q = state.estQ;
    if (!q || !q.progressive || !q.stepCount || !q.stepMs) return null;
    return Math.max(0, Math.min(q.stepCount - 1, Math.floor((elapsedSec * 1000) / q.stepMs)));
  }

  function updateEstMeter(elapsedSec) {
    var el = document.getElementById('est-meter');
    if (!el) return;
    var q = state.estQ;
    var k = estStepAt(elapsedSec);
    if (k === null || state.hasAnswered || state.currentPhase !== 'question') { el.textContent = ''; return; }
    var pct = Math.round(estFactorLocal(k, q.stepCount) * 100);
    if (k < q.stepCount - 1) {
      var s = Math.max(1, Math.ceil(((k + 1) * q.stepMs - elapsedSec * 1000) / 1000));
      el.textContent = t('est.meterShort', { pct: pct, s: s });
    } else {
      el.textContent = t('est.meterShortLast', { pct: pct });
    }
  }

  /* --- "Alle bud": hele budrunden på mobilen (skrevet af hosten til games/{pin}/bids) --- */
  function showBids(container) {
    db.ref('games/' + state.pin + '/bids').once('value', function (snap) {
      var b = snap.val();
      var rows = (b && b.rows) || [];
      if (!rows.length) { container.style.display = 'none'; return; }
      var html = '<div class="bids-title">' + escHtml(t('est.bidsTitle')) + '</div><div class="bids-list">';
      rows.forEach(function (r, i) {
        var me = r.pid === state.playerId;
        var sub = escHtml(r.pct || '') + (typeof r.factor === 'number' ? ' · ' + escHtml(t('est.factorTag', { pct: r.factor })) : '');
        html += '<div class="bid-row' + (r.closest ? ' best' : '') + (me ? ' me' : '') + '">' +
          '<div>' + (r.closest ? '🎯' : (i + 1) + '.') + '</div>' +
          '<div class="bid-name">' + escHtml(r.name || '?') + (me ? ' (' + escHtml(t('est.you')) + ')' : '') +
            '<span class="bid-sub">' + sub + '</span></div>' +
          '<div class="bid-guess">' + escHtml(fmtKr(r.guess)) +
            (typeof r.pts === 'number' ? '<span class="bid-pts">+' + r.pts + '</span>' : '') + '</div>' +
          '</div>';
      });
      container.innerHTML = html + '</div>';
      container.style.display = 'block';
      var myRow = container.querySelector('.bid-row.me');
      if (myRow && myRow.scrollIntoView) myRow.scrollIntoView({ block: 'nearest' });
    });
  }

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Tusindtals-punktummer mens man taster (1000000 → 1.000.000) */
  var estInput = document.getElementById('est-input');
  estInput.addEventListener('input', function () {
    var digits = estInput.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 10);
    estInput.value = digits ? Number(digits).toLocaleString('da-DK') : '';
  });

  document.getElementById('est-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (state.hasAnswered || !state.pin || !state.playerId) return;
    if (state.currentPhase !== 'question' && state.currentPhase !== 'suddendeath') return;
    var digits = estInput.value.replace(/\D/g, '');
    var form = this;
    if (!digits) {
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      estInput.placeholder = t('est.invalid');
      return;
    }
    var guess = parseInt(digits, 10);
    state.hasAnswered = true;
    state.lastGuessText = fmtKr(guess);
    setInputsLocked(true);
    estInput.blur();
    var msg = document.getElementById('answered-msg');
    msg.textContent = t('est.sentMsg', { guess: state.lastGuessText });
    var sAt = state.currentPhase === 'question' && state.lastStateData ? state.lastStateData.questionStartAt : null;
    var k = sAt ? estStepAt((serverNow() - sAt) / 1000) : null;
    if (k !== null) {
      msg.textContent = t('est.lockedFactor', { guess: state.lastGuessText, n: k + 1,
        pct: Math.round(estFactorLocal(k, state.estQ.stepCount) * 100) });
    }
    state.lastGuessMsg = msg.textContent;
    document.getElementById('est-meter').textContent = '';
    msg.style.display = 'block';
    answerRefFor().set({ guess: guess, at: firebase.database.ServerValue.TIMESTAMP });
  });

  /* --- Svar-knapper klik --- */
  document.querySelectorAll('.answer-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (state.hasAnswered || !state.pin || !state.playerId) return;
      if (state.currentPhase !== 'question' && state.currentPhase !== 'suddendeath') return;

      var choice = parseInt(btn.dataset.choice, 10);
      state.hasAnswered = true;

      // Deaktivér alle knapper
      document.querySelectorAll('.answer-btn').forEach(function (b) {
        b.disabled = true;
      });
      document.getElementById('answered-msg').style.display = 'block';

      // Skriv svar til databasen — Sudden Death bruger en separat sti
      // (sdAnswers/{round}), så den aldrig kan kollidere med det almindelige
      // spørgsmåls svar-node.
      answerRefFor().set({
        choice: choice,
        at: firebase.database.ServerValue.TIMESTAMP
      });
    });
  });

  /* --- Reveal-skærm --- */
  function showRevealScreen(stateData, isScoreboard) {
    // Læs egen score og alle spillere for placering
    db.ref('games/' + state.pin + '/players').once('value', function (snap) {
      var players = snap.val() || {};
      var myScore = (players[state.playerId] && players[state.playerId].score) || 0;
      var myStreak = (players[state.playerId] && players[state.playerId].streak) || 0;
      var myBonus = (players[state.playerId] && players[state.playerId].lastBonus) || 0;
      var scores = Object.values(players).map(function (p) { return p.score || 0; });
      scores.sort(function (a, b) { return b - a; });
      var placement = scores.indexOf(myScore) + 1;
      var total = scores.length;

      // Læs om svaret var rigtigt
      var qIndex = stateData.qIndex !== undefined ? stateData.qIndex : state.currentQIndex;
      db.ref('games/' + state.pin + '/answers/' + qIndex + '/' + state.playerId).once('value', function (aSnap) {
        // Vi kan ikke se correct-index fra klienten (anti-cheat).
        // Host skriver score direkte til players — vi aflæser om score steg.
        // Vi bruger en simpel heuristik: sammenlign med forrige score.
        // Men for at gøre det enkelt: host skriver "correct" felt til state ved reveal.
        var wasCorrect = stateData.lastCorrect === state.playerId; // ikke brugt
        // Vi bruger i stedet: host sætter state.phase='reveal' og vi læser players score.
        // Sammenlign: vi gemte scoren inden reveal — men det er komplekst.
        // Løsning: host skriver state.correctChoice ved reveal.
        var estDetail = document.getElementById('est-detail');
        estDetail.style.display = 'none';
        document.getElementById('reveal-bids').style.display = 'none';
        if (stateData.qType === 'estimate') {
          showEstimateReveal(stateData, aSnap.exists() ? aSnap.val() : null, players[state.playerId] || {}, myScore, placement, total);
          return;
        }

        var correctChoice = stateData.correctChoice;
        var myAnswer = aSnap.exists() ? aSnap.val().choice : -1;
        var isCorrect = (myAnswer === correctChoice) && (myAnswer !== -1) && (correctChoice !== undefined);

        var feedbackBox = document.getElementById('feedback-box');
        if (correctChoice === undefined) {
          // Endnu ikke reveal-data — vis score
          feedbackBox.textContent = t('reveal.waiting');
          feedbackBox.className = 'feedback-box mb16';
        } else if (isCorrect) {
          var pts = stateData.lastPts || 0;
          var totalPts = pts + myBonus;
          feedbackBox.textContent = t('reveal.correct', { pts: totalPts });
          feedbackBox.className = 'feedback-box correct mb16';
        } else {
          feedbackBox.textContent = t('reveal.wrong');
          feedbackBox.className = 'feedback-box wrong mb16';
        }

        // Streak-badge: kun vist når der er en aktiv bonus (streak >= 2)
        var streakEl = document.getElementById('streak-badge');
        if (streakEl) {
          if (isCorrect && myStreak >= 2) {
            streakEl.textContent = t('reveal.streakBonus', { n: myStreak, bonus: myBonus });
            streakEl.style.display = 'block';
          } else {
            streakEl.style.display = 'none';
          }
        }

        document.getElementById('reveal-score').textContent = myScore;
        document.getElementById('reveal-placement').textContent =
          t('reveal.placement', { n: placement, total: total });

        showScreen('screen-reveal');
      });
    });
  }

  /* --- Reveal for prisgæt: prisen, eget bud, point --- */
  function showEstimateReveal(stateData, myAns, me, myScore, placement, total) {
    var feedbackBox = document.getElementById('feedback-box');
    var estDetail = document.getElementById('est-detail');
    var answer = stateData.estAnswer;
    var hasGuess = !!myAns && typeof myAns.guess === 'number';
    var pts = me.lastPts || 0;

    if (typeof answer !== 'number') {
      feedbackBox.textContent = t('reveal.waiting');
      feedbackBox.className = 'feedback-box mb16';
    } else if (!hasGuess) {
      feedbackBox.textContent = t('est.noGuess');
      feedbackBox.className = 'feedback-box wrong mb16';
    } else if (me.lastClosest) {
      feedbackBox.textContent = t('est.closest', { pts: pts });
      feedbackBox.className = 'feedback-box correct mb16';
    } else if (pts > 0) {
      feedbackBox.textContent = t('est.points', { pts: pts });
      feedbackBox.className = 'feedback-box correct mb16';
    } else {
      feedbackBox.textContent = t('est.noPoints');
      feedbackBox.className = 'feedback-box wrong mb16';
    }

    if (typeof answer === 'number') {
      if (hasGuess) {
        var pct = answer > 0 ? Math.round(((myAns.guess - answer) / answer) * 100) : 0;
        var pctTxt = pct === 0 ? t('est.exact') : (pct > 0 ? '+' : '') + pct + ' %';
        estDetail.innerHTML = t('est.detail', { answer: fmtKr(answer), guess: fmtKr(myAns.guess), pct: pctTxt }) +
          (typeof me.lastFactor === 'number' && me.lastStep
            ? '<br><span class="text-muted">' + escHtml(t('est.detailFactor', { n: me.lastStep, pct: me.lastFactor })) + '</span>'
            : '');
      } else {
        estDetail.textContent = t('est.priceWas', { answer: fmtKr(answer) });
      }
      estDetail.style.display = 'block';
    }

    var streakEl = document.getElementById('streak-badge');
    if (streakEl) {
      var streak = me.streak || 0;
      if (me.lastClosest && streak >= 2) {
        streakEl.textContent = t('reveal.streakBonus', { n: streak, bonus: me.lastBonus || 0 });
        streakEl.style.display = 'block';
      } else {
        streakEl.style.display = 'none';
      }
    }

    if (typeof answer === 'number') showBids(document.getElementById('reveal-bids'));

    document.getElementById('reveal-score').textContent = myScore;
    document.getElementById('reveal-placement').textContent = t('reveal.placement', { n: placement, total: total });
    showScreen('screen-reveal');
  }

  /* --- Podiet-skærm --- */
  function showPodiumScreen() {
    db.ref('games/' + state.pin + '/players').once('value', function (snap) {
      var players = snap.val() || {};
      var myScore = (players[state.playerId] && players[state.playerId].score) || 0;

      db.ref('games/' + state.pin + '/state/sdWinnerId').once('value', function (sdSnap) {
        var sdWinnerId = sdSnap.exists() ? sdSnap.val() : null;

        // Samme rangerings-logik som host.js's computeRanks(): normalt
        // score-baseret, men hvis en Sudden Death har kåret en vinder,
        // rykkes vedkommende alene på 1.-pladsen, og resten af den
        // oprindeligt uafgjorte gruppe deler fortsat plads med hinanden.
        var arr = Object.keys(players).map(function (pid) {
          return { pid: pid, score: players[pid].score || 0 };
        });
        arr.sort(function (a, b) { return b.score - a.score; });
        if (sdWinnerId) {
          var wIdx = arr.findIndex(function (p) { return p.pid === sdWinnerId; });
          if (wIdx > 0) {
            var w = arr.splice(wIdx, 1)[0];
            arr.unshift(w);
          }
        }
        var ranks = [];
        arr.forEach(function (p, i) {
          if (i === 0) { ranks.push(1); return; }
          var sameScore = p.score === arr[i - 1].score;
          var isSdBoundary = sdWinnerId && i === 1 && arr[0].pid === sdWinnerId;
          if (sameScore && !isSdBoundary) ranks.push(ranks[i - 1]);
          else if (sameScore && isSdBoundary) ranks.push(ranks[i - 1] + 1);
          else ranks.push(i + 1);
        });
        var myIdx = arr.findIndex(function (p) { return p.pid === state.playerId; });
        var placement = myIdx >= 0 ? ranks[myIdx] : (arr.length + 1);
        var total = arr.length;

        document.getElementById('podium-score').textContent = myScore;
        var placeTxt = '';
        if (sdWinnerId && state.playerId === sdWinnerId) placeTxt = t('podium.wonSuddenDeath');
        else if (placement === 1) placeTxt = t('podium.first');
        else if (placement === 2) placeTxt = t('podium.second');
        else if (placement === 3) placeTxt = t('podium.third');
        else placeTxt = t('podium.other', { n: placement, total: total });
        document.getElementById('podium-placement-text').textContent = placeTxt;

        showScreen('screen-podium');
        clearSession();
        updateLeaveBtnVisibility();

        // Konfetti for top-3
        if (placement <= 3) {
          launchConfetti();
        }
      });
    });
  }

  /* --- Konfetti --- */
  function launchConfetti() {
    var colors = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
    for (var i = 0; i < 80; i++) {
      (function (delay) {
        setTimeout(function () {
          var el = document.createElement('div');
          el.className = 'confetti-piece';
          el.style.left = Math.random() * 100 + 'vw';
          el.style.top = '-20px';
          el.style.background = colors[Math.floor(Math.random() * colors.length)];
          el.style.width = (8 + Math.random() * 8) + 'px';
          el.style.height = (8 + Math.random() * 8) + 'px';
          el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
          el.style.animationDuration = (2 + Math.random() * 3) + 's';
          el.style.animationDelay = '0s';
          document.body.appendChild(el);
          setTimeout(function () { el.remove(); }, 5000);
        }, delay);
      })(i * 40);
    }
  }

  /* --- Forsøg genindmeld ved page-load --- */
  var restored = tryRestore();

  // Hvis siden er åbnet med en PIN i URL'en (nyt QR-scan/link) der IKKE matcher
  // en evt. gemt session, har den friske PIN forrang. Ellers ville en spiller,
  // der stadig har en gammel session liggende (fx fordi værten lukkede fanen
  // uden at trykke "Afslut spil"), altid blive trukket tilbage ind i det gamle
  // spil i stedet for det nye vedkommende lige har scannet sig ind i.
  // Se play-again-bug 2026-08-05.
  if (restored && urlPin && restored.pin !== urlPin) {
    clearSession();
    restored = null;
  }

  if (restored) {
    document.getElementById('input-pin').value = restored.pin;
    if (restored.registered) {
      // Registreret elev — genbekræft at PIN'en stadig findes i elevlisten
      // (kan være slettet/omdøbt siden sidst), brug altid det nuværende navn.
      document.getElementById('input-elevpin').value = restored.playerId;
      db.ref('students/' + restored.playerId).once('value', function (snap) {
        if (snap.exists()) {
          var freshName = (snap.val() && snap.val().name) || restored.name;
          joinGame(restored.pin, freshName, restored.playerId, true);
        } else {
          // PIN findes ikke længere — lad brugeren melde sig ind igen manuelt
          clearSession();
        }
      });
    } else {
      document.getElementById('input-name').value = restored.name;
      joinGame(restored.pin, restored.name, restored.playerId, false);
    }
  }

}());
