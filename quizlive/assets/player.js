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

  /* --- State --- */
  var state = {
    pin: '',
    playerId: '',
    name: '',
    currentPhase: '',
    currentQIndex: -1,
    hasAnswered: false,
    serverTimeOffset: 0,
    timerInterval: null,
    timerSec: 20
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
      name: state.name
    }));
  }

  function clearSession() {
    localStorage.removeItem('quizlive_player');
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
    var name = document.getElementById('input-name').value.trim();

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError('PIN skal være 6 cifre.');
      return;
    }
    if (!name) {
      setError('Indtast dit navn.');
      return;
    }

    setError('');
    joinGame(pin, name, null);
  });

  function joinGame(pin, name, existingPlayerId) {
    db.ref('games/' + pin).once('value', function (snap) {
      if (!snap.exists()) {
        setError('Spillet findes ikke. Tjek PIN.');
        return;
      }
      var gameData = snap.val();
      var phase = gameData.state ? gameData.state.phase : '';

      // Generér eller genbrug playerId
      var playerId = existingPlayerId || ('p_' + Math.random().toString(36).slice(2, 10));

      state.pin = pin;
      state.playerId = playerId;
      state.name = name;
      state.timerSec = gameData.config ? (gameData.config.timerSec || 20) : 20;

      // Skriv spiller til databasen (merge-safe: sæt kun navn+joinedAt hvis ny)
      var playerRef = db.ref('games/' + pin + '/players/' + playerId);
      playerRef.once('value', function (pSnap) {
        if (!pSnap.exists()) {
          playerRef.set({ name: name, score: 0, joinedAt: firebase.database.ServerValue.TIMESTAMP });
        }
        saveSession();
        startListening(phase);
      });
    });
  }

  /* --- Lyt på state-ændringer --- */
  function startListening(initialPhase) {
    // Vis lobby med det samme
    document.getElementById('lobby-greeting').textContent = 'Du er med, ' + state.name + '! 🎉 Kig op på skærmen.';
    showScreen('screen-lobby');

    if (initialPhase && initialPhase !== 'lobby') {
      handlePhase(initialPhase);
    }

    db.ref('games/' + state.pin + '/state').on('value', function (snap) {
      if (!snap.exists()) {
        // Spillet er slettet
        clearSession();
        showScreen('screen-join');
        setError('Spillet er afsluttet.');
        return;
      }
      var s = snap.val();
      handlePhase(s.phase, s);
    });
  }

  function handlePhase(phase, stateData) {
    stateData = stateData || {};
    var prevPhase = state.currentPhase;
    state.currentPhase = phase;

    if (phase === 'lobby') {
      showScreen('screen-lobby');

    } else if (phase === 'question') {
      var qIndex = stateData.qIndex !== undefined ? stateData.qIndex : state.currentQIndex;
      if (qIndex !== state.currentQIndex) {
        state.currentQIndex = qIndex;
        state.hasAnswered = false;
      }
      showQuestionScreen(stateData);

    } else if (phase === 'reveal') {
      clearTimer();
      showRevealScreen(stateData);

    } else if (phase === 'scoreboard') {
      // Vis fortsat reveal / score mens host viser scoreboard
      // Player opdaterer score-visning
      showRevealScreen(stateData, true);

    } else if (phase === 'podium') {
      clearTimer();
      showPodiumScreen();
    }
  }

  /* --- Spørgsmål-skærm --- */
  function showQuestionScreen(stateData) {
    showScreen('screen-question');

    // Nulstil knapper
    var btns = document.querySelectorAll('.answer-btn');
    btns.forEach(function (b) {
      b.disabled = false;
      b.style.opacity = '';
    });
    var answeredMsg = document.getElementById('answered-msg');
    answeredMsg.style.display = 'none';
    answeredMsg.textContent = 'Svar sendt! ✔ Vent på resultatet...';

    if (state.hasAnswered) {
      // Allerede besvaret — vis locked state
      btns.forEach(function (b) { b.disabled = true; });
      document.getElementById('answered-msg').style.display = 'block';
    }

    // Timer
    startTimerBar(stateData.questionStartAt, state.timerSec);
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
      if (remaining <= 0) {
        clearTimer();
        // Lås knapperne — for sene svar tæller alligevel ikke hos hosten
        if (!state.hasAnswered) {
          state.hasAnswered = true;
          document.querySelectorAll('.answer-btn').forEach(function (b) { b.disabled = true; });
          var msg = document.getElementById('answered-msg');
          msg.textContent = 'Tiden er udløbet! ⏰';
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

  /* --- Svar-knapper klik --- */
  document.querySelectorAll('.answer-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (state.hasAnswered || !state.pin || !state.playerId) return;
      if (state.currentPhase !== 'question') return;

      var choice = parseInt(btn.dataset.choice, 10);
      state.hasAnswered = true;

      // Deaktivér alle knapper
      document.querySelectorAll('.answer-btn').forEach(function (b) {
        b.disabled = true;
      });
      document.getElementById('answered-msg').style.display = 'block';

      // Skriv svar til databasen
      var answerRef = db.ref(
        'games/' + state.pin + '/answers/' + state.currentQIndex + '/' + state.playerId
      );
      answerRef.set({
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
        var correctChoice = stateData.correctChoice;
        var myAnswer = aSnap.exists() ? aSnap.val().choice : -1;
        var isCorrect = (myAnswer === correctChoice) && (myAnswer !== -1) && (correctChoice !== undefined);

        var feedbackBox = document.getElementById('feedback-box');
        if (correctChoice === undefined) {
          // Endnu ikke reveal-data — vis score
          feedbackBox.textContent = 'Vent...';
          feedbackBox.className = 'feedback-box mb16';
        } else if (isCorrect) {
          var pts = stateData.lastPts || 0;
          feedbackBox.textContent = 'RIGTIGT! +' + pts;
          feedbackBox.className = 'feedback-box correct mb16';
        } else {
          feedbackBox.textContent = 'FORKERT';
          feedbackBox.className = 'feedback-box wrong mb16';
        }

        document.getElementById('reveal-score').textContent = myScore;
        document.getElementById('reveal-placement').textContent =
          'Du er nr. ' + placement + ' af ' + total;

        showScreen('screen-reveal');
      });
    });
  }

  /* --- Podiet-skærm --- */
  function showPodiumScreen() {
    db.ref('games/' + state.pin + '/players').once('value', function (snap) {
      var players = snap.val() || {};
      var myScore = (players[state.playerId] && players[state.playerId].score) || 0;
      var scores = Object.values(players).map(function (p) { return p.score || 0; });
      scores.sort(function (a, b) { return b - a; });
      var placement = scores.indexOf(myScore) + 1;
      var total = scores.length;

      document.getElementById('podium-score').textContent = myScore;
      var placeTxt = '';
      if (placement === 1) placeTxt = '🥇 Du vandt! Tillykke!';
      else if (placement === 2) placeTxt = '🥈 Du kom på 2.-pladsen!';
      else if (placement === 3) placeTxt = '🥉 Du kom på 3.-pladsen!';
      else placeTxt = 'Du endte på ' + placement + '. pladsen af ' + total + '.';
      document.getElementById('podium-placement-text').textContent = placeTxt;

      showScreen('screen-podium');
      clearSession();

      // Konfetti for top-3
      if (placement <= 3) {
        launchConfetti();
      }
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
  if (restored) {
    document.getElementById('input-pin').value = restored.pin;
    document.getElementById('input-name').value = restored.name;
    joinGame(restored.pin, restored.name, restored.playerId);
  }

}());
