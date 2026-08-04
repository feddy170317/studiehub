/* ============================================================
   QuizLive — Leaderboard (assets/leaderboard.js)
   Læser /results + /students og bygger tre visninger:
   samlet leaderboard, per-elev detalje, per-quiz detalje.
   Rent visnings-lag — skriver aldrig til databasen.
   Ingen ES-moduler. Ren globals. IIFE + 'use strict'.
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

  /* --- Rådata --- */
  var resultsRaw  = {}; // pin -> { pushId: attempt }
  var studentsRaw = {}; // pin -> { name, createdAt }

  /* --- Afledte strukturer --- */
  var attemptsByPin = {}; // pin -> [attempt, ...] sorteret ældst→nyest
  var quizIndex = {};     // quizId -> { quizId, quizTitle }

  /* --- Dom-referencer --- */
  var overallStatus   = document.getElementById('overall-status');
  var tblOverallBody  = document.getElementById('tbl-overall-body');
  var selQuizPicker   = document.getElementById('sel-quiz-picker');
  var linkBackStudent = document.getElementById('link-back-student');
  var linkBackQuiz    = document.getElementById('link-back-quiz');
  var studentNameEl   = document.getElementById('student-detail-name');
  var tblStudentQuizzesBody   = document.getElementById('tbl-student-quizzes-body');
  var tblStudentAttemptsBody  = document.getElementById('tbl-student-attempts-body');
  var quizTitleEl     = document.getElementById('quiz-detail-title');
  var tblQuizAttemptsBody = document.getElementById('tbl-quiz-attempts-body');

  /* --- HTML-escape hjælper --- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Formatér timestamp (ms) til "dd/mm/yyyy" (samme mønster som editor.js) */
  function formatDate(ts) {
    try {
      var d = new Date(ts);
      return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    } catch (e) { return ''; }
  }

  /* --- Competition-ranking: delt score = delt placering (kopi af host.js' logik) --- */
  function computeRanks(sortedList) {
    var ranks = [];
    sortedList.forEach(function (p, i) {
      if (i > 0 && p.score === sortedList[i - 1].score) {
        ranks.push(ranks[i - 1]);
      } else {
        ranks.push(i + 1);
      }
    });
    return ranks;
  }

  /* --- Skift synlig visning --- */
  function showView(id) {
    document.querySelectorAll('.lb-view').forEach(function (v) {
      v.classList.remove('active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* --- Opdatér ?student=/?quiz= i URL'en uden reload (deep-link, deles nemt) --- */
  function updateUrl(key, value) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete('student');
      url.searchParams.delete('quiz');
      if (key) url.searchParams.set(key, value);
      history.replaceState(null, '', url.toString());
    } catch (e) { /* ældre browsere ignoreres */ }
  }

  /* --- Nuværende visningsnavn for en PIN: foretræk live elevliste,
     fald tilbage til navnet gemt i det seneste resultat (overlever sletning) --- */
  function currentNameFor(pin) {
    if (studentsRaw[pin] && studentsRaw[pin].name) return studentsRaw[pin].name;
    var list = attemptsByPin[pin];
    if (list && list.length) return list[list.length - 1].name || pin;
    return pin;
  }

  /* ================================================================
     Byg attemptsByPin + quizIndex ud fra rådata
     ================================================================ */
  function buildAttemptsIndex() {
    attemptsByPin = {};
    quizIndex = {};
    Object.keys(resultsRaw).forEach(function (pin) {
      var byPushId = resultsRaw[pin] || {};
      var list = [];
      Object.keys(byPushId).forEach(function (pushId) {
        var a = byPushId[pushId] || {};
        a._pushId = pushId;
        a.playedAt = a.playedAt || 0;
        list.push(a);
        if (a.quizId && !quizIndex[a.quizId]) {
          quizIndex[a.quizId] = { quizId: a.quizId, quizTitle: a.quizTitle || a.quizId };
        }
      });
      list.sort(function (x, y) { return (x.playedAt || 0) - (y.playedAt || 0); });
      attemptsByPin[pin] = list;
    });
  }

  /* ================================================================
     View 1: Samlet leaderboard
     ================================================================ */
  function buildOverallRows() {
    var rows = [];
    Object.keys(attemptsByPin).forEach(function (pin) {
      var list = attemptsByPin[pin];
      if (!list || list.length === 0) return;

      var bestByQuiz = {};
      list.forEach(function (a) {
        var cur = bestByQuiz[a.quizId];
        if (cur === undefined || (a.score || 0) > cur) bestByQuiz[a.quizId] = a.score || 0;
      });
      var totalBest = 0;
      var quizIds = Object.keys(bestByQuiz);
      quizIds.forEach(function (qid) { totalBest += bestByQuiz[qid]; });

      rows.push({
        pin: pin,
        name: currentNameFor(pin),
        score: totalBest,             // = "Samlet bedste-score" — felt hedder "score" for computeRanks
        quizzesAttempted: quizIds.length,
        totalAttempts: list.length
      });
    });
    rows.sort(function (a, b) { return b.score - a.score; });
    return rows;
  }

  function renderOverall() {
    var rows = buildOverallRows();
    tblOverallBody.innerHTML = '';

    if (rows.length === 0) {
      overallStatus.textContent = 'Ingen resultater endnu — de vises her, når registrerede elever har spillet quizzer.';
      return;
    }
    overallStatus.textContent = rows.length + ' elev' + (rows.length !== 1 ? 'er' : '') + ' med resultater';

    var ranks = computeRanks(rows);
    rows.forEach(function (r, i) {
      var tr = document.createElement('tr');
      tr.className = 'lb-row-clickable';
      tr.innerHTML =
        '<td class="col-rank">' + ranks[i] + '</td>' +
        '<td>' + escHtml(r.name) + '</td>' +
        '<td>' + r.score + '</td>' +
        '<td>' + r.quizzesAttempted + '</td>' +
        '<td>' + r.totalAttempts + '</td>';
      tr.addEventListener('click', function () { showStudentView(r.pin); });
      tblOverallBody.appendChild(tr);
    });
  }

  /* ================================================================
     Quiz-vælger (View 3-indgang)
     ================================================================ */
  function populateQuizPicker() {
    selQuizPicker.innerHTML = '<option value="">— vælg en quiz —</option>';
    var quizList = Object.keys(quizIndex).map(function (qid) { return quizIndex[qid]; });
    quizList.sort(function (a, b) {
      return (a.quizTitle || '').toLowerCase().localeCompare((b.quizTitle || '').toLowerCase(), 'da');
    });
    quizList.forEach(function (q) {
      var opt = document.createElement('option');
      opt.value = q.quizId;
      opt.textContent = q.quizTitle;
      selQuizPicker.appendChild(opt);
    });
  }

  selQuizPicker.addEventListener('change', function () {
    if (selQuizPicker.value) showQuizView(selQuizPicker.value);
  });

  /* ================================================================
     View 2: Per-elev detalje
     ================================================================ */
  function showStudentView(pin) {
    var list = attemptsByPin[pin] || [];
    studentNameEl.textContent = currentNameFor(pin);

    /* --- Tabel: distinkte quizzer + tendens --- */
    var byQuiz = {};
    list.forEach(function (a) {
      if (!byQuiz[a.quizId]) byQuiz[a.quizId] = [];
      byQuiz[a.quizId].push(a);
    });

    tblStudentQuizzesBody.innerHTML = '';
    var quizIds = Object.keys(byQuiz);
    if (quizIds.length === 0) {
      var trEmpty = document.createElement('tr');
      trEmpty.innerHTML = '<td colspan="6" class="lb-status">Ingen forsøg endnu.</td>';
      tblStudentQuizzesBody.appendChild(trEmpty);
    }
    quizIds.forEach(function (qid) {
      var attempts = byQuiz[qid].slice().sort(function (x, y) { return (x.playedAt || 0) - (y.playedAt || 0); });
      var last = attempts[attempts.length - 1];
      var prev = attempts.length > 1 ? attempts[attempts.length - 2] : null;
      var best = 0;
      attempts.forEach(function (a) { if ((a.percent || 0) > best) best = a.percent || 0; });

      var trend = '→';
      var trendCls = 'trend-same';
      if (prev) {
        if ((last.percent || 0) > (prev.percent || 0)) { trend = '↑'; trendCls = 'trend-up'; }
        else if ((last.percent || 0) < (prev.percent || 0)) { trend = '↓'; trendCls = 'trend-down'; }
      }

      var metaParts = [last.semester, last.course, last.lecture].filter(function (v) { return v; });
      var meta = metaParts.join(' · ');

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + escHtml(last.quizTitle || qid) + '</td>' +
        '<td>' + escHtml(meta) + '</td>' +
        '<td>' + attempts.length + '</td>' +
        '<td>' + best + '%</td>' +
        '<td>' + (last.percent || 0) + '%</td>' +
        '<td class="' + trendCls + '">' + trend + '</td>';
      tblStudentQuizzesBody.appendChild(tr);
    });

    /* --- Flad kronologisk liste, nyeste først --- */
    var flat = list.slice().sort(function (a, b) { return (b.playedAt || 0) - (a.playedAt || 0); });
    tblStudentAttemptsBody.innerHTML = '';
    if (flat.length === 0) {
      var trEmpty2 = document.createElement('tr');
      trEmpty2.innerHTML = '<td colspan="3" class="lb-status">Ingen forsøg endnu.</td>';
      tblStudentAttemptsBody.appendChild(trEmpty2);
    }
    flat.forEach(function (a) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + escHtml(a.quizTitle || a.quizId) + '</td>' +
        '<td>' + (a.percent || 0) + '%</td>' +
        '<td>' + formatDate(a.playedAt) + '</td>';
      tblStudentAttemptsBody.appendChild(tr);
    });

    showView('view-student');
    updateUrl('student', pin);
  }

  /* ================================================================
     View 3: Per-quiz detalje
     ================================================================ */
  function showQuizView(quizId) {
    var q = quizIndex[quizId] || { quizId: quizId, quizTitle: quizId };
    quizTitleEl.textContent = q.quizTitle;

    var allAttempts = [];
    Object.keys(attemptsByPin).forEach(function (pin) {
      attemptsByPin[pin].forEach(function (a) {
        if (a.quizId === quizId) allAttempts.push({ pin: pin, attempt: a });
      });
    });
    allAttempts.sort(function (x, y) { return (x.attempt.playedAt || 0) - (y.attempt.playedAt || 0); });

    tblQuizAttemptsBody.innerHTML = '';
    if (allAttempts.length === 0) {
      var trEmpty = document.createElement('tr');
      trEmpty.innerHTML = '<td colspan="4" class="lb-status">Ingen forsøg registreret på denne quiz.</td>';
      tblQuizAttemptsBody.appendChild(trEmpty);
    }

    var seqCounter = {};
    allAttempts.forEach(function (item) {
      var pin = item.pin;
      seqCounter[pin] = (seqCounter[pin] || 0) + 1;
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + escHtml(currentNameFor(pin)) + '</td>' +
        '<td>' + seqCounter[pin] + '.</td>' +
        '<td>' + (item.attempt.percent || 0) + '%</td>' +
        '<td>' + formatDate(item.attempt.playedAt) + '</td>';
      tblQuizAttemptsBody.appendChild(tr);
    });

    showView('view-quiz');
    updateUrl('quiz', quizId);
  }

  /* ================================================================
     Tilbage-links
     ================================================================ */
  function backToOverall() {
    selQuizPicker.value = '';
    showView('view-overall');
    updateUrl(null, null);
  }
  linkBackStudent.addEventListener('click', function (e) { e.preventDefault(); backToOverall(); });
  linkBackQuiz.addEventListener('click', function (e) { e.preventDefault(); backToOverall(); });

  /* ================================================================
     Deep-link ved indlæsning: ?student=<pin> eller ?quiz=<id>
     ================================================================ */
  function handleInitialDeepLink() {
    try {
      var params = new URLSearchParams(window.location.search);
      var studentPin = params.get('student');
      var quizId = params.get('quiz');
      if (studentPin) { showStudentView(studentPin); return; }
      if (quizId) { showQuizView(quizId); return; }
    } catch (e) { /* ældre browsere ignoreres */ }
  }

  /* ================================================================
     Indlæs data (én gang — ingen live-lytter nødvendig for et overblik)
     ================================================================ */
  function loadData() {
    Promise.all([
      db.ref('results').once('value'),
      db.ref('students').once('value')
    ]).then(function (snaps) {
      resultsRaw  = snaps[0].exists() ? snaps[0].val() : {};
      studentsRaw = snaps[1].exists() ? snaps[1].val() : {};
      buildAttemptsIndex();
      renderOverall();
      populateQuizPicker();
      handleInitialDeepLink();
    }).catch(function (err) {
      overallStatus.textContent = 'Kunne ikke indlæse resultater: ' + (err && err.message ? err.message : 'fejl');
    });
  }

  loadData();

}());
