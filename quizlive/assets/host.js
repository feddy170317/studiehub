/* ============================================================
   QuizLive — Host-logik (assets/host.js)
   Host er autoritativ: genererer PIN, styrer state-maskinen,
   beregner scorer, avancerer faser.
   Ingen ES-moduler. Ren globals.
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

  /* --- Konstanter --- */
  var SHAPES = ['▲', '◆', '●', '■'];
  var SHAPE_CLASSES = ['a', 'b', 'c', 'd'];
  var LEVEL_POINTS = { 'let': 100, 'middel': 150, 'svaer': 200, 'svær': 200 };
  var LEVEL_LABELS = { 'let': 'Nem', 'middel': 'Middel', 'svaer': 'Svær', 'svær': 'Svær' };
  var LEVEL_CSS = { 'let': 'level-let', 'middel': 'level-middel', 'svaer': 'level-svaer', 'svær': 'level-svaer' };

  /* --- State --- */
  var g = {
    pin: '',
    quizId: '',
    quiz: null,
    timerSec: 20,
    qIndex: 0,
    serverTimeOffset: 0,
    timerInterval: null,
    playerCount: 0,
    players: {},           // playerId -> {name, score}
    gameRef: null,
    answersListener: null,
    stateListener: null,
    questionStartAt: 0,
    autoAdvanced: false
  };

  /* --- Server-tid offset --- */
  db.ref('.info/serverTimeOffset').on('value', function (snap) {
    g.serverTimeOffset = snap.val() || 0;
  });

  function serverNow() {
    return Date.now() + g.serverTimeOffset;
  }

  /* --- Skærm-hjælper --- */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.remove('active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* --- Keyboard shortcut: Space/Enter = next --- */
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      // Klik "næste"-knapper afhængigt af aktiv skærm
      var activeScreen = document.querySelector('.screen.active');
      if (!activeScreen) return;
      var id = activeScreen.id;
      if (id === 'screen-reveal-host') {
        var btn = document.getElementById('btn-next');
        if (btn && !btn.disabled) btn.click();
      } else if (id === 'screen-score') {
        var btn2 = document.getElementById('btn-next-q');
        if (btn2 && !btn2.disabled) btn2.click();
      }
    }
  });

  /* --- Quiz-manifest i setup-dropdown --- */
  (function populateQuizList() {
    var sel = document.getElementById('sel-quiz');
    if (!window.QUIZ_MANIFEST) return;
    window.QUIZ_MANIFEST.forEach(function (qm) {
      var opt = document.createElement('option');
      opt.value = qm.id;
      opt.textContent = qm.title + ' (' + qm.count + ' spørgsmål)';
      sel.appendChild(opt);
    });
  })();

  /* --- Generér 6-cifret PIN --- */
  function generatePin() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /* --- Opret spil --- */
  document.getElementById('btn-create').addEventListener('click', function () {
    var quizId = document.getElementById('sel-quiz').value;
    var timerSec = parseInt(document.getElementById('sel-timer').value, 10);

    if (!quizId) {
      alert('Vælg en quiz først.');
      return;
    }

    // Hent quiz-data
    var quiz = window.QUIZZES && window.QUIZZES[quizId];
    if (!quiz) {
      alert('Quiz-data ikke fundet. Tjek at quizzen er loadet korrekt.');
      return;
    }

    g.quizId = quizId;
    g.quiz = quiz;
    g.timerSec = timerSec;
    g.qIndex = 0;
    g.players = {};

    var pin = generatePin();
    g.pin = pin;
    g.gameRef = db.ref('games/' + pin);

    // Opret spil-node
    g.gameRef.set({
      config: {
        timerSec: timerSec,
        quizId: quizId,
        title: quiz.title,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      },
      state: {
        phase: 'lobby',
        qIndex: 0,
        totalQ: quiz.questions.length,
        questionStartAt: 0,
        correctChoice: -1,
        lastPts: 0
      }
    }).then(function () {
      showLobby();
    });
  });

  /* --- Lobby --- */
  function showLobby() {
    document.getElementById('host-pin').textContent = g.pin;

    // Byg join-URL
    var base = window.location.href.replace('host.html', 'index.html');
    var joinUrl = base + '?pin=' + g.pin;
    document.getElementById('host-url').textContent = joinUrl;

    // QR-kode
    var qrDiv = document.getElementById('qr-code');
    qrDiv.innerHTML = '';
    try {
      new QRCode(qrDiv, {
        text: joinUrl,
        width: 140,
        height: 140,
        colorDark: '#1a1040',
        colorLight: '#ffffff'
      });
    } catch (e) {
      qrDiv.textContent = '(QR ikke tilgængeligt)';
    }

    showScreen('screen-lobby-host');

    // Lyt på spillere
    g.gameRef.child('players').on('value', function (snap) {
      g.players = {};
      var playerList = document.getElementById('player-list');
      playerList.innerHTML = '';
      var count = 0;
      if (snap.exists()) {
        snap.forEach(function (child) {
          var pid = child.key;
          var data = child.val();
          g.players[pid] = { name: data.name, score: data.score || 0 };
          count++;
          var chip = document.createElement('div');
          chip.className = 'player-chip';
          chip.textContent = data.name;
          playerList.appendChild(chip);
        });
      }
      g.playerCount = count;
      document.getElementById('player-count-label').textContent =
        count + ' spiller' + (count !== 1 ? 'e' : '');
      document.getElementById('btn-start').disabled = count < 1;
    });
  }

  /* --- Start spillet --- */
  document.getElementById('btn-start').addEventListener('click', function () {
    startQuestion(0);
  });

  /* --- Runtime-shuffle af svarmuligheder (korrekt svar må ikke kunne gættes på position) --- */
  function shuffleQuestion(q) {
    var order = [0, 1, 2, 3];
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    return {
      q: q.q,
      level: q.level,
      why: q.why,
      options: order.map(function (idx) { return q.options[idx]; }),
      correct: order.indexOf(q.correct)
    };
  }

  /* --- Start spørgsmål --- */
  function startQuestion(qIdx) {
    g.qIndex = qIdx;
    g.autoAdvanced = false;
    revealDone = false;
    var q = shuffleQuestion(g.quiz.questions[qIdx]);

    // Publicér spørgsmål UDEN correct-index (anti-cheat)
    g.gameRef.child('question').set({
      text: q.q,
      options: q.options,
      level: q.level
    });

    // Opdatér state
    g.gameRef.child('state').update({
      phase: 'question',
      qIndex: qIdx,
      totalQ: g.quiz.questions.length,
      questionStartAt: firebase.database.ServerValue.TIMESTAMP,
      correctChoice: -1,
      lastPts: 0
    }).then(function () {
      // Læs questionStartAt fra serveren
      g.gameRef.child('state/questionStartAt').once('value', function (snap) {
        g.questionStartAt = snap.val() || serverNow();
        showQuestionScreen(q, qIdx);
      });
    });
  }

  /* --- Spørgsmål-skærm (host) --- */
  function showQuestionScreen(q, qIdx) {
    var total = g.quiz.questions.length;
    document.getElementById('q-progress').textContent =
      'Spørgsmål ' + (qIdx + 1) + '/' + total;
    document.getElementById('q-text').textContent = q.q;

    // Level-badge
    var badge = document.getElementById('q-level-badge');
    var lvl = q.level || 'let';
    badge.textContent = LEVEL_LABELS[lvl] || lvl;
    badge.className = 'level-badge ' + (LEVEL_CSS[lvl] || 'level-let');

    // Svarmuligheder
    var optionsEl = document.getElementById('q-options');
    optionsEl.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var card = document.createElement('div');
      card.className = 'option-card ' + SHAPE_CLASSES[i];
      card.innerHTML = '<span class="icon">' + SHAPES[i] + '</span><span>' + escHtml(opt) + '</span>';
      optionsEl.appendChild(card);
    });

    showScreen('screen-q');

    // Nulstil svar-tæller
    document.getElementById('q-answer-count').textContent = '0/' + g.playerCount + ' har svaret';

    // Start timer
    startHostTimer(g.questionStartAt, g.timerSec, qIdx, q);

    // Lyt på svar
    listenForAnswers(qIdx, q);
  }

  /* --- Host timer --- */
  function startHostTimer(startAt, timerSec, qIdx, q) {
    clearHostTimer();
    var bar = document.getElementById('host-timer-bar');
    var numEl = document.getElementById('timer-display');

    function tick() {
      var elapsed = (serverNow() - startAt) / 1000;
      var remaining = timerSec - elapsed;
      if (remaining < 0) remaining = 0;
      var pct = (remaining / timerSec) * 100;
      bar.style.width = pct + '%';
      var secs = Math.ceil(remaining);
      numEl.textContent = secs;

      if (remaining <= 5) {
        bar.classList.add('urgent');
        numEl.classList.add('urgent');
      } else {
        bar.classList.remove('urgent');
        numEl.classList.remove('urgent');
      }

      if (remaining <= 0 && !g.autoAdvanced) {
        clearHostTimer();
        autoReveal(qIdx, q);
      }
    }

    tick();
    g.timerInterval = setInterval(tick, 100);
  }

  function clearHostTimer() {
    if (g.timerInterval) {
      clearInterval(g.timerInterval);
      g.timerInterval = null;
    }
  }

  /* --- Lyt på svar --- */
  function listenForAnswers(qIdx, q) {
    if (g.answersListener) {
      g.answersListener();
      g.answersListener = null;
    }
    var answersRef = g.gameRef.child('answers/' + qIdx);
    var off = answersRef.on('value', function (snap) {
      var count = snap.numChildren();
      document.getElementById('q-answer-count').textContent =
        count + '/' + g.playerCount + ' har svaret';

      // Auto-advance hvis alle har svaret
      if (count >= g.playerCount && g.playerCount > 0 && !g.autoAdvanced) {
        g.autoAdvanced = true;
        clearHostTimer();
        setTimeout(function () { autoReveal(qIdx, q); }, 800);
      }
    });
    g.answersListener = function () { answersRef.off('value', off); };
  }

  /* --- Auto-reveal (tid udløbet eller alle svaret) --- */
  var revealDone = false;
  function autoReveal(qIdx, q) {
    // Guard: må kun køre én gang pr. spørgsmål (timer + "alle har svaret" kan race)
    if (revealDone && g.qIndex === qIdx) return;
    revealDone = true;
    g.autoAdvanced = true;
    if (g.answersListener) {
      g.answersListener();
      g.answersListener = null;
    }
    computeAndReveal(qIdx, q);
  }

  /* --- Beregn scorer og vis reveal --- */
  function computeAndReveal(qIdx, q) {
    var correctIdx = q.correct;
    var pts = LEVEL_POINTS[q.level] || 100;
    var deadline = g.questionStartAt + (g.timerSec + 1) * 1000; // +1s grace

    // Læs alle svar
    g.gameRef.child('answers/' + qIdx).once('value', function (snap) {
      var updates = {};
      if (snap.exists()) {
        snap.forEach(function (child) {
          var pid = child.key;
          var ans = child.val();
          // Tjek tidsstempel (grace = +1s)
          var inTime = ans.at <= deadline;
          if (ans.choice === correctIdx && inTime) {
            var currentScore = (g.players[pid] && g.players[pid].score) || 0;
            var newScore = currentScore + pts;
            if (g.players[pid]) g.players[pid].score = newScore;
            updates['games/' + g.pin + '/players/' + pid + '/score'] = newScore;
          }
        });
      }

      // Skriv scorer + sæt state til reveal
      var stateUpdate = {};
      stateUpdate['games/' + g.pin + '/state/phase'] = 'reveal';
      stateUpdate['games/' + g.pin + '/state/correctChoice'] = correctIdx;
      stateUpdate['games/' + g.pin + '/state/lastPts'] = pts;

      db.ref().update(Object.assign({}, updates, stateUpdate)).then(function () {
        showRevealHost(qIdx, q, correctIdx, pts);
      });
    });
  }

  /* --- Reveal-skærm (host) --- */
  function showRevealHost(qIdx, q, correctIdx, pts) {
    document.getElementById('reveal-q-text').textContent = q.q;
    document.getElementById('reveal-why').textContent = q.why || '';

    // Svarmuligheder med highlight
    var optionsEl = document.getElementById('reveal-options');
    optionsEl.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var card = document.createElement('div');
      var cls = 'option-card ' + SHAPE_CLASSES[i];
      if (i === correctIdx) cls += ' correct';
      else cls += ' dim';
      card.className = cls;
      card.innerHTML = '<span class="icon">' + SHAPES[i] + '</span><span>' + escHtml(opt) + '</span>';
      optionsEl.appendChild(card);
    });

    // Bar-chart: læs svar-fordeling
    g.gameRef.child('answers/' + qIdx).once('value', function (snap) {
      var counts = [0, 0, 0, 0];
      var deadline = g.questionStartAt + (g.timerSec + 1) * 1000;
      if (snap.exists()) {
        snap.forEach(function (child) {
          var ans = child.val();
          if (ans.at <= deadline && ans.choice >= 0 && ans.choice < 4) {
            counts[ans.choice]++;
          }
        });
      }
      var maxCount = Math.max.apply(null, counts) || 1;
      var chart = document.getElementById('reveal-chart');
      chart.innerHTML = '';
      counts.forEach(function (c, i) {
        var col = document.createElement('div');
        col.className = 'bar-col';
        var pct = (c / maxCount) * 100;
        col.innerHTML =
          '<span class="bar-count">' + c + '</span>' +
          '<div class="bar-fill ' + SHAPE_CLASSES[i] + '" style="height:' + Math.max(pct, 4) + '%;"></div>' +
          '<span class="bar-label">' + SHAPES[i] + '</span>';
        chart.appendChild(col);
      });

      showScreen('screen-reveal-host');
    });
  }

  /* --- Næste-knap på reveal --- */
  document.getElementById('btn-next').addEventListener('click', function () {
    showScoreboard();
  });

  /* --- Scoreboard --- */
  function showScoreboard() {
    g.gameRef.child('state').update({ phase: 'scoreboard' });

    // Hent opdaterede scorer
    g.gameRef.child('players').once('value', function (snap) {
      var players = [];
      if (snap.exists()) {
        snap.forEach(function (child) {
          players.push({ name: child.val().name, score: child.val().score || 0 });
        });
      }
      players.sort(function (a, b) { return b.score - a.score; });
      var maxScore = players.length ? players[0].score : 1;
      var ranks = computeRanks(players);

      var wrap = document.getElementById('score-bars-wrap');
      wrap.innerHTML = '';
      var top5 = players.slice(0, 5);
      top5.forEach(function (p, i) {
        var row = document.createElement('div');
        row.className = 'score-row';
        row.style.animationDelay = (i * 0.08) + 's';
        var barPct = maxScore > 0 ? (p.score / maxScore) * 100 : 0;
        row.innerHTML =
          '<div class="score-bar-fill" style="width:' + barPct + '%;"></div>' +
          '<div class="rank">' + ranks[i] + '</div>' +
          '<div class="name">' + escHtml(p.name) + '</div>' +
          '<div class="pts">' + p.score + ' pt</div>';
        wrap.appendChild(row);
      });

      showScreen('screen-score');
    });
  }

  /* --- Næste spørgsmål-knap --- */
  document.getElementById('btn-next-q').addEventListener('click', function () {
    var nextIdx = g.qIndex + 1;
    if (nextIdx >= g.quiz.questions.length) {
      showPodiumHost();
    } else {
      startQuestion(nextIdx);
    }
  });

  /* --- Podiet (host) --- */
  function showPodiumHost() {
    g.gameRef.child('state').update({ phase: 'podium' });

    g.gameRef.child('players').once('value', function (snap) {
      var players = [];
      if (snap.exists()) {
        snap.forEach(function (child) {
          players.push({ name: child.val().name, score: child.val().score || 0 });
        });
      }
      players.sort(function (a, b) { return b.score - a.score; });
      var ranks = computeRanks(players);

      var medals = ['🥇', '🥈', '🥉'];
      var list = document.getElementById('podium-host-list');
      list.innerHTML = '';

      players.forEach(function (p, i) {
        var row = document.createElement('div');
        row.className = 'podium-row';
        // Medalje efter RANG, ikke listeposition — delt score = samme medalje
        row.innerHTML =
          '<div class="medal">' + (medals[ranks[i] - 1] || ranks[i] + '.') + '</div>' +
          '<div class="p-name">' + escHtml(p.name) + '</div>' +
          '<div class="p-pts">' + p.score + ' pt</div>';
        list.appendChild(row);
        // Animér én ad gangen (top-3 med forsinkelse)
        var delay = i < 3 ? (2 - i) * 600 : i * 80;
        setTimeout(function () { row.classList.add('show'); }, delay + 200);
      });

      showScreen('screen-podium-host');
    });
  }

  /* --- Afslut spil --- */
  document.getElementById('btn-end').addEventListener('click', function () {
    if (!g.pin) { showScreen('screen-setup'); return; }
    if (!confirm('Er du sikker? Spillet og alle scorer slettes.')) return;
    db.ref('games/' + g.pin).remove().then(function () {
      g.pin = '';
      g.gameRef = null;
      showScreen('screen-setup');
    });
  });

  /* --- Competition-ranking: delt score = delt placering (1, 1, 3, ...) --- */
  function computeRanks(sortedPlayers) {
    var ranks = [];
    sortedPlayers.forEach(function (p, i) {
      if (i > 0 && p.score === sortedPlayers[i - 1].score) {
        ranks.push(ranks[i - 1]);
      } else {
        ranks.push(i + 1);
      }
    });
    return ranks;
  }

  /* --- HTML-escape hjælper --- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

}());
