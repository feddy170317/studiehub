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
  var STREAK_BONUS_STEP = 50; // flad bonus pr. streak-trin: 2 rigtige i træk = +50, 3 = +100, osv.
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
    players: {},           // playerId -> {name, score, correctCount, registered}
    gameRef: null,
    answersListener: null,
    stateListener: null,
    questionStartAt: 0,
    autoAdvanced: false,
    imagesMap: {},          // imgId -> data-URL (kun til lokal host-visning, publiceres aldrig)
    tiedPlayers: [],        // pids delt om 1.-pladsen ved podiet — udfyldt af showPodiumHost()
    sd: null                // aktiv Sudden Death-sessions-tilstand, se startSuddenDeath()
  };

  /* Slå et billede op i g.imagesMap — returnerer data-URL eller null.
     Bruges KUN på host — spillerne ser aldrig billeder. */
  function imgSrc(idOrEmpty) {
    if (!idOrEmpty) return null;
    var v = g.imagesMap[idOrEmpty];
    return v || null;
  }

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

  /* --- Vedvarende "Spørgsmål N/Total"-badge (synlig på tværs af spørgsmål,
     reveal og scoreboard — ikke kun mens selve spørgsmålet vises) --- */
  function setProgressBadge(text) {
    var el = document.getElementById('host-progress-badge');
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
  }
  function hideProgressBadge() {
    var el = document.getElementById('host-progress-badge');
    if (el) el.style.display = 'none';
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

  /* --- Quiz-manifest + DB-quizzer i setup-dropdown (skjult <select>) --- */
  var dbQuizzesMap = {}; // id -> quiz-objekt fra DB

  /* Indbyggede quizzer fra manifest — tilføjes med det samme (afhænger ikke af DB) */
  (function populateBuiltinOptions() {
    var sel = document.getElementById('sel-quiz');
    if (window.QUIZ_MANIFEST && window.QUIZ_MANIFEST.length > 0) {
      var grpBuiltin = document.createElement('optgroup');
      grpBuiltin.label = 'Indbygget';
      window.QUIZ_MANIFEST.forEach(function (qm) {
        var opt = document.createElement('option');
        opt.value = qm.id;
        opt.textContent = qm.title + ' (' + qm.count + ' spørgsmål)';
        grpBuiltin.appendChild(opt);
      });
      sel.appendChild(grpBuiltin);
    }
  })();

  /* Auto-genererede spørgsmålsbanke — tilføjes med det samme (afhænger ikke af DB).
     VIGTIGT: en <select>'s .value kan kun sættes til en værdi, der findes som
     en <option> INDE i den — ellers ignoreres tildelingen stiltiende, og
     "Opret spil" tror bagefter at intet er valgt. Uden disse <option>-elementer
     ville et klik på en bank-quiz i kataloget aldrig rent faktisk vælge noget. */
  (function populateBankOptions() {
    var sel = document.getElementById('sel-quiz');
    if (window.QUESTION_BANKS && window.QUESTION_BANKS.length > 0) {
      var grpBank = document.createElement('optgroup');
      grpBank.label = 'Automatiske quizzer';
      window.QUESTION_BANKS.forEach(function (bank) {
        var opt = document.createElement('option');
        opt.value = 'bank:' + bank.id;
        opt.textContent = bank.title + ' (' + bank.drawCount + ' tilfældige spørgsmål)';
        grpBank.appendChild(opt);
      });
      sel.appendChild(grpBank);
    }
  })();

  /* Saml pr. "semester · fag" (fallback: forfatter) — bruges af den skjulte <select> */
  function groupLabel(q) {
    var sem = (q.semester || '').trim();
    var course = (q.course || '').trim();
    if (sem && course) return sem + ' · ' + course;
    if (sem) return sem;
    if (course) return course;
    return 'Ukategoriseret — af ' + (q.author || 'ukendt').trim();
  }

  /* --- Katalog-datastruktur (drill-down UI) ---
     catalog.semesters['3. semester'].courses['ELE 1'].lectures['Lektion 2'] = [{id, quiz}, ...]
     catalog.uncategorized = [{id, quiz}, ...]  (DB-quizzer uden semester) */
  var catalog = {
    semesters: {},
    uncategorized: [],
    loaded: false
  };

  (function populateQuizList() {
    var sel = document.getElementById('sel-quiz');

    /* Hent DB-quizzer én gang */
    db.ref('quizzes').once('value').then(function (snap) {
      if (!snap.exists()) {
        catalog.loaded = true;
        renderCatalogTop();
        return;
      }

      var byGroup = {};
      snap.forEach(function (child) {
        var q = child.val();
        q._id = child.key;

        /* Spørgsmålsbanke (isBank:true) er de RÅ 100+ spørgsmåls-puljer bag
           "Automatiske quizzer" — de skal IKKE optræde i den normale liste
           (ville vise en kæmpe fast quiz på 100+ spørgsmål og kunne
           ved en fejl slettes via editoren). De håndteres separat af
           loadQuestionBanks() og deres eget katalog-afsnit. */
        if (q.isBank) return;

        dbQuizzesMap[child.key] = q;

        /* --- Flad optgroup-struktur (uændret — bruges kun til den skjulte <select>) --- */
        var key = groupLabel(q);
        if (!byGroup[key]) byGroup[key] = [];
        byGroup[key].push({ id: child.key, quiz: q });

        /* --- Nested katalog-struktur (drill-down UI) --- */
        var sem = (q.semester || '').trim();
        if (!sem) {
          catalog.uncategorized.push({ id: child.key, quiz: q });
        } else {
          var course = (q.course || '').trim() || 'Andet fag';
          var lecture = (q.lecture || '').trim() || 'Andet';
          if (!catalog.semesters[sem]) catalog.semesters[sem] = { courses: {} };
          var semObj = catalog.semesters[sem];
          if (!semObj.courses[course]) semObj.courses[course] = { lectures: {} };
          var courseObj = semObj.courses[course];
          if (!courseObj.lectures[lecture]) courseObj.lectures[lecture] = [];
          courseObj.lectures[lecture].push({ id: child.key, quiz: q });
        }
      });

      /* Sortér: semestre numerisk først, Ukategoriseret sidst */
      var groupKeys = Object.keys(byGroup).sort(function (a, b) {
        var ma = a.match(/^(\d+)\. semester/);
        var mb = b.match(/^(\d+)\. semester/);
        if (ma && mb) {
          var d = parseInt(ma[1], 10) - parseInt(mb[1], 10);
          if (d !== 0) return d;
          return a.toLowerCase().localeCompare(b.toLowerCase(), 'da');
        }
        if (ma) return -1;
        if (mb) return 1;
        var ua = a.indexOf('Ukategoriseret') === 0;
        var ub = b.indexOf('Ukategoriseret') === 0;
        if (ua !== ub) return ua ? 1 : -1;
        return a.toLowerCase().localeCompare(b.toLowerCase(), 'da');
      });

      groupKeys.forEach(function (gKey) {
        var grp = document.createElement('optgroup');
        grp.label = gKey;
        byGroup[gKey].sort(function (x, y) {
          return (x.quiz.title || '').toLowerCase().localeCompare((y.quiz.title || '').toLowerCase(), 'da');
        });
        byGroup[gKey].forEach(function (item) {
          var qCnt = Array.isArray(item.quiz.questions) ? item.quiz.questions.length : 0;
          var opt = document.createElement('option');
          opt.value = 'db:' + item.id;
          opt.textContent = item.quiz.title + ' (' + qCnt + ' spørgsmål · ' + (item.quiz.author || 'ukendt') + ')';
          grp.appendChild(opt);
        });
        sel.appendChild(grp);
      });

      /* Options for både indbyggede og DB-quizzer findes nu i <select> —
         katalog-UI'et kan trygt sætte sel.value til en af disse strenge. */
      catalog.loaded = true;
      renderCatalogTop();
    }).catch(function () {
      /* Hvis DB-hentning fejler, kør videre kun med built-in quizzer */
      catalog.loaded = true;
      renderCatalogTop();
    });
  })();

  /* ================================================================
     Katalog-UI: drill-down semester → fag → lektion → quiz
     ================================================================ */
  var catalogWrap       = document.getElementById('quiz-catalog');
  var catalogBreadcrumb = document.getElementById('catalog-breadcrumb');
  var catalogBody       = document.getElementById('catalog-body');
  var quizSelectedBox   = document.getElementById('quiz-selected');
  var quizSelectedText  = document.getElementById('quiz-selected-text');
  var linkChangeQuiz    = document.getElementById('link-change-quiz');
  var selQuizHidden     = document.getElementById('sel-quiz');
  var btnCreateEl       = document.getElementById('btn-create');

  /* Udtræk første tal i en streng (til naturlig sortering, "Lektion 10" > "Lektion 2") */
  function firstNumIn(str) {
    var m = String(str || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : Infinity;
  }
  /* Naturlig sortering: tal-præfiks først, ellers alfabetisk (dansk) */
  function naturalCompare(a, b) {
    var na = firstNumIn(a);
    var nb = firstNumIn(b);
    if (na !== nb) return na - nb;
    return String(a).toLowerCase().localeCompare(String(b).toLowerCase(), 'da');
  }
  /* Sortering med en bestemt "sidste" bucket-værdi (Andet/Andet fag) altid til sidst */
  function compareWithFallbackLast(fallbackVal) {
    return function (a, b) {
      if (a === fallbackVal && b !== fallbackVal) return 1;
      if (b === fallbackVal && a !== fallbackVal) return -1;
      return naturalCompare(a, b);
    };
  }

  function makeTile(title, sub, onClick) {
    var tile = document.createElement('div');
    tile.className = 'catalog-tile';
    tile.innerHTML = '<span>' + escHtml(title) + '</span>' +
      (sub ? '<span class="tile-sub">' + escHtml(sub) + '</span>' : '');
    tile.addEventListener('click', onClick);
    return tile;
  }

  function makeBackBtn(label, onClick) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary catalog-back-btn';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function makeQuizRow(value, quiz) {
    var row = document.createElement('div');
    row.className = 'catalog-quiz-row';
    var qCnt = Array.isArray(quiz.questions) ? quiz.questions.length : (typeof quiz.count === 'number' ? quiz.count : 0);
    row.innerHTML =
      '<span class="cq-title">' + escHtml(quiz.title || '(uden titel)') + '</span>' +
      '<span class="cq-meta">' + qCnt + ' spørgsmål' + (quiz.author ? ' · ' + escHtml(quiz.author) : '') + '</span>';
    row.addEventListener('click', function () {
      selectQuiz(value, quiz.title || '(uden titel)');
    });
    return row;
  }

  function renderBreadcrumb(segments) {
    catalogBreadcrumb.innerHTML = '';
    segments.forEach(function (seg, i) {
      if (i > 0) {
        var sep = document.createElement('span');
        sep.className = 'crumb-sep';
        sep.textContent = '›';
        catalogBreadcrumb.appendChild(sep);
      }
      var el = document.createElement('span');
      el.className = 'crumb' + (seg.onClick ? '' : ' crumb-current');
      el.textContent = seg.label;
      if (seg.onClick) el.addEventListener('click', seg.onClick);
      catalogBreadcrumb.appendChild(el);
    });
  }

  function countSemesterQuizzes(sem) {
    var n = 0;
    var courses = catalog.semesters[sem].courses;
    Object.keys(courses).forEach(function (c) {
      var lects = courses[c].lectures;
      Object.keys(lects).forEach(function (l) { n += lects[l].length; });
    });
    return n;
  }
  function countCourseQuizzes(sem, course) {
    var n = 0;
    var lects = catalog.semesters[sem].courses[course].lectures;
    Object.keys(lects).forEach(function (l) { n += lects[l].length; });
    return n;
  }

  /* --- Niveau 1: semester / indbygget / ukategoriseret --- */
  function renderCatalogTop() {
    renderBreadcrumb([{ label: 'Kataloger' }]);
    catalogBody.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'catalog-grid';

    var semKeys = Object.keys(catalog.semesters).sort(function (a, b) {
      var ma = a.match(/^(\d+)/);
      var mb = b.match(/^(\d+)/);
      var na = ma ? parseInt(ma[1], 10) : Infinity;
      var nb = mb ? parseInt(mb[1], 10) : Infinity;
      if (na !== nb) return na - nb;
      return a.toLowerCase().localeCompare(b.toLowerCase(), 'da');
    });
    semKeys.forEach(function (sem) {
      grid.appendChild(makeTile(sem, countSemesterQuizzes(sem) + ' quizzer', function () {
        renderCatalogCourses(sem);
      }));
    });

    if (window.QUESTION_BANKS && window.QUESTION_BANKS.length > 0) {
      grid.appendChild(makeTile('🎲 Automatiske quizzer', window.QUESTION_BANKS.length + ' emner', renderCatalogAuto));
    }
    if (window.QUIZ_MANIFEST && window.QUIZ_MANIFEST.length > 0) {
      grid.appendChild(makeTile('📦 Indbygget', window.QUIZ_MANIFEST.length + ' quizzer', renderCatalogBuiltin));
    }
    if (catalog.uncategorized.length > 0) {
      grid.appendChild(makeTile('❓ Ukategoriseret', catalog.uncategorized.length + ' quizzer', renderCatalogUncategorized));
    }

    catalogBody.appendChild(grid);

    if (!catalog.loaded) {
      var loading = document.createElement('div');
      loading.className = 'catalog-empty';
      loading.textContent = 'Indlæser quizzer...';
      catalogBody.appendChild(loading);
    } else if (grid.children.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'catalog-empty';
      empty.textContent = 'Ingen quizzer fundet — opret en i quiz-editoren.';
      catalogBody.appendChild(empty);
    }
  }

  /* --- Niveau 2: fag (inden for et semester) --- */
  function renderCatalogCourses(sem) {
    renderBreadcrumb([
      { label: 'Kataloger', onClick: renderCatalogTop },
      { label: sem }
    ]);
    catalogBody.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'catalog-grid';

    var courses = catalog.semesters[sem].courses;
    var courseKeys = Object.keys(courses).sort(compareWithFallbackLast('Andet fag'));
    courseKeys.forEach(function (course) {
      grid.appendChild(makeTile(course, countCourseQuizzes(sem, course) + ' quizzer', function () {
        renderCatalogLectures(sem, course);
      }));
    });
    catalogBody.appendChild(grid);
    catalogBody.appendChild(makeBackBtn('◀ Tilbage', renderCatalogTop));
  }

  /* --- Niveau 3: lektion + quiz-liste (inden for fag) --- */
  function renderCatalogLectures(sem, course) {
    renderBreadcrumb([
      { label: 'Kataloger', onClick: renderCatalogTop },
      { label: sem, onClick: function () { renderCatalogCourses(sem); } },
      { label: course }
    ]);
    catalogBody.innerHTML = '';

    var lects = catalog.semesters[sem].courses[course].lectures;
    var lectKeys = Object.keys(lects).sort(compareWithFallbackLast('Andet'));
    lectKeys.forEach(function (lect) {
      var heading = document.createElement('div');
      heading.className = 'catalog-lecture-heading';
      heading.textContent = lect;
      catalogBody.appendChild(heading);
      lects[lect].forEach(function (item) {
        catalogBody.appendChild(makeQuizRow('db:' + item.id, item.quiz));
      });
    });
    catalogBody.appendChild(makeBackBtn('◀ Tilbage', function () { renderCatalogCourses(sem); }));
  }

  /* --- Flad liste: indbyggede manifest-quizzer --- */
  function renderCatalogBuiltin() {
    renderBreadcrumb([
      { label: 'Kataloger', onClick: renderCatalogTop },
      { label: '📦 Indbygget' }
    ]);
    catalogBody.innerHTML = '';
    (window.QUIZ_MANIFEST || []).forEach(function (qm) {
      catalogBody.appendChild(makeQuizRow(qm.id, { title: qm.title, count: qm.count }));
    });
    catalogBody.appendChild(makeBackBtn('◀ Tilbage', renderCatalogTop));
  }

  /* --- Flad liste: auto-genererede quizzer trukket fra en spørgsmålsbank --- */
  function renderCatalogAuto() {
    renderBreadcrumb([
      { label: 'Kataloger', onClick: renderCatalogTop },
      { label: '🎲 Automatiske quizzer' }
    ]);
    catalogBody.innerHTML = '';
    (window.QUESTION_BANKS || []).forEach(function (bank) {
      var row = document.createElement('div');
      row.className = 'catalog-quiz-row';
      row.innerHTML =
        '<span class="cq-title">🎲 ' + escHtml(bank.title) + '</span>' +
        '<span class="cq-meta">' + bank.drawCount + ' tilfældige spørgsmål af ' + (bank.poolSize || '100+') + '</span>';
      row.addEventListener('click', function () {
        selectQuiz('bank:' + bank.id, bank.title + ' (auto, ' + bank.drawCount + ' spørgsmål)');
      });
      catalogBody.appendChild(row);
    });
    var note = document.createElement('div');
    note.className = 'catalog-empty';
    note.textContent = 'Trækker ' + ((window.QUESTION_BANKS && window.QUESTION_BANKS[0] && window.QUESTION_BANKS[0].drawCount) || 15) +
      ' tilfældige spørgsmål hver gang. Et spørgsmål går ikke igen, før alle andre i banken er brugt.';
    catalogBody.appendChild(note);
    catalogBody.appendChild(makeBackBtn('◀ Tilbage', renderCatalogTop));
  }

  /* --- Flad liste: DB-quizzer uden semester --- */
  function renderCatalogUncategorized() {
    renderBreadcrumb([
      { label: 'Kataloger', onClick: renderCatalogTop },
      { label: '❓ Ukategoriseret' }
    ]);
    catalogBody.innerHTML = '';
    catalog.uncategorized.forEach(function (item) {
      catalogBody.appendChild(makeQuizRow('db:' + item.id, item.quiz));
    });
    catalogBody.appendChild(makeBackBtn('◀ Tilbage', renderCatalogTop));
  }

  /* --- Vælg quiz: sæt den skjulte <select>, vis bekræftelse, aktivér "Opret spil" --- */
  function selectQuiz(value, title) {
    selQuizHidden.value = value;
    try {
      var evt = new Event('change', { bubbles: true });
      selQuizHidden.dispatchEvent(evt);
    } catch (e) { /* ældre browsere ignoreres — value er stadig sat */ }

    quizSelectedText.textContent = '✅ Valgt: ' + title;
    quizSelectedBox.style.display = 'flex';
    catalogWrap.style.display = 'none';
    btnCreateEl.disabled = false;
  }

  linkChangeQuiz.addEventListener('click', function (e) {
    e.preventDefault();
    selQuizHidden.value = '';
    btnCreateEl.disabled = true;
    quizSelectedBox.style.display = 'none';
    catalogWrap.style.display = 'block';
    renderCatalogTop();
  });

  /* Initial visning (mens DB-quizzer evt. stadig hentes) */
  renderCatalogTop();

  /* --- Generér 6-cifret PIN --- */
  function generatePin() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /* --- Træk N tilfældige, ubrugte spørgsmål fra en spørgsmålsbank ---
     ("shuffle bag": intet spørgsmål går igen, før ALLE andre i banken er
     brugt — når puljen løber tør, nulstilles hele cyklussen og der trækkes
     helt friskt). Bruges af de auto-genererede quizzer (Dansk/Verdens
     Almenviden). Banken ligger under quizzes/{bankId} (samme skrivbare
     Firebase-sti som almindelige DB-quizzer, blot med isBank:true). */
  function drawFromBank(bankId, count, cb) {
    var questionsRef = db.ref('quizzes/' + bankId + '/questions');
    var usedRef = db.ref('quizzes/' + bankId + '/bankUsed');

    Promise.all([questionsRef.once('value'), usedRef.once('value')]).then(function (results) {
      var qSnap = results[0], usedSnap = results[1];
      var allQ = [];
      qSnap.forEach(function (child) {
        var v = child.val();
        v._id = child.key;
        allQ.push(v);
      });
      if (allQ.length === 0) {
        cb(new Error('Spørgsmålsbanken er tom — tjek Firebase-opsætningen.'));
        return;
      }

      var used = usedSnap.val() || {};
      var availableIds = allQ.map(function (q) { return q._id; }).filter(function (id) { return !used[id]; });

      // Ikke nok utrukne spørgsmål tilbage til en hel quiz — cyklussen er
      // udtømt. Nulstil hele "brugt"-mængden og træk fra en frisk cyklus.
      if (availableIds.length < Math.min(count, allQ.length)) {
        used = {};
        availableIds = allQ.map(function (q) { return q._id; });
      }

      var pool = shuffleArray(availableIds.slice());
      var picked = pool.slice(0, Math.min(count, pool.length));

      var byId = {};
      allQ.forEach(function (q) { byId[q._id] = q; });
      var drawnQuestions = picked.map(function (id) { return byId[id]; });

      var newUsed = Object.assign({}, used);
      picked.forEach(function (id) { newUsed[id] = true; });

      usedRef.set(newUsed).then(function () {
        cb(null, drawnQuestions, allQ.length);
      }).catch(function (err) { cb(err); });
    }).catch(function (err) { cb(err); });
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  /* Normaliserer et bank-spørgsmål til samme form som quiz.questions[i]
     forventer (img/optImgs er valgfrie felter, banken har dem ikke). */
  function normalizeBankQuestion(q) {
    return { q: q.q, level: q.level, why: q.why || '', img: q.img || '', options: q.options, optImgs: q.optImgs || ['', '', '', ''], correct: q.correct };
  }

  /* --- Opret spil-node i Firebase og gå til lobbyen (fælles slutpunkt for
     alle quiz-kilder: indbygget, DB-quiz eller auto-trukket bank) --- */
  function startGameWithQuiz(quizId, quiz, timerSec) {
    g.quizId = quizId;
    g.quiz = quiz;
    g.timerSec = timerSec;
    g.qIndex = 0;
    g.players = {};
    if (!g.imagesMap) g.imagesMap = {};

    var pin = generatePin();
    g.pin = pin;
    g.gameRef = db.ref('games/' + pin);

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
  }

  /* --- Opret spil --- */
  document.getElementById('btn-create').addEventListener('click', function () {
    var selValue = document.getElementById('sel-quiz').value;
    var timerSec = parseInt(document.getElementById('sel-timer').value, 10);
    var createBtn = this;

    if (!selValue) {
      alert('Vælg en quiz først.');
      return;
    }

    // Auto-genereret quiz: træk N tilfældige spørgsmål fra spørgsmålsbanken først
    if (selValue.indexOf('bank:') === 0) {
      var bankId = selValue.slice(5);
      var bankMeta = (window.QUESTION_BANKS || []).filter(function (b) { return b.id === bankId; })[0];
      var bankTitle = bankMeta ? bankMeta.title : bankId;
      var drawCount = bankMeta ? bankMeta.drawCount : 15;

      createBtn.disabled = true;
      var originalLabel = createBtn.textContent;
      createBtn.textContent = 'Trækker spørgsmål...';

      drawFromBank(bankId, drawCount, function (err, questions) {
        createBtn.disabled = false;
        createBtn.textContent = originalLabel;
        if (err || !questions || questions.length === 0) {
          alert('Kunne ikke trække spørgsmål fra banken: ' + (err ? err.message : 'ukendt fejl'));
          return;
        }
        g.imagesMap = {};
        var quiz = { title: bankTitle, questions: questions.map(normalizeBankQuestion) };
        startGameWithQuiz(bankId, quiz, timerSec);
      });
      return;
    }

    // Hent quiz-data — enten fra DB eller fra window.QUIZZES
    var quiz;
    var quizId;
    if (selValue.indexOf('db:') === 0) {
      var dbId = selValue.slice(3);
      quiz     = dbQuizzesMap[dbId];
      quizId   = dbId;
    } else {
      quizId = selValue;
      quiz   = window.QUIZZES && window.QUIZZES[quizId];
    }

    if (!quiz) {
      alert('Quiz-data ikke fundet. Tjek at quizzen er loadet korrekt.');
      return;
    }

    // Hent quiz-billeder (kun DB-quizzer kan have billeder) FØR lobbyen vises.
    // Billederne hentes én gang og bruges kun lokalt på host — de publiceres
    // aldrig til /games, så spillerne ser dem aldrig.
    if (selValue.indexOf('db:') === 0) {
      db.ref('quizimages/' + quizId).once('value').then(function (snap) {
        g.imagesMap = snap.exists() ? snap.val() : {};
        startGameWithQuiz(quizId, quiz, timerSec);
      }).catch(function () {
        g.imagesMap = {};
        startGameWithQuiz(quizId, quiz, timerSec);
      });
    } else {
      g.imagesMap = {};
      startGameWithQuiz(quizId, quiz, timerSec);
    }
  });

  /* --- Lobby --- */
  function showLobby() {
    document.getElementById('host-pin').textContent = g.pin;

    // Byg join-URL
    var base = window.location.href.replace('host.html', 'index.html');
    var joinUrl = base + '?pin=' + g.pin;
    document.getElementById('host-url').textContent = joinUrl;
    g.joinUrl = joinUrl; // gemmes til "Kopiér link"-knappen

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
    hideProgressBadge();

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
          g.players[pid] = {
            name: data.name,
            score: data.score || 0,
            correctCount: data.correctCount || 0,
            streak: data.streak || 0,
            registered: !!data.registered
          };
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

  /* --- Kopiér join-link (til at dele i chat i stedet for PIN/QR) --- */
  var btnCopyLink = document.getElementById('btn-copy-link');
  btnCopyLink.addEventListener('click', function () {
    if (!g.joinUrl) return;
    var onDone = function (ok) {
      var original = '📋 Kopiér link';
      btnCopyLink.textContent = ok ? '✅ Kopieret!' : '⚠ Kunne ikke kopiere';
      setTimeout(function () { btnCopyLink.textContent = original; }, 2000);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(g.joinUrl).then(function () {
          onDone(true);
        }).catch(function () {
          fallbackCopyLink(g.joinUrl, onDone);
        });
      } else {
        fallbackCopyLink(g.joinUrl, onDone);
      }
    } catch (e) {
      fallbackCopyLink(g.joinUrl, onDone);
    }
  });

  function fallbackCopyLink(text, cb) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      cb(ok);
    } catch (e) {
      cb(false);
    }
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
    var optImgs = Array.isArray(q.optImgs) ? q.optImgs : ['', '', '', ''];
    return {
      q: q.q,
      level: q.level,
      why: q.why,
      img: q.img || '',
      options: order.map(function (idx) { return q.options[idx]; }),
      optImgs: order.map(function (idx) { return optImgs[idx] || ''; }),
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
      timerSec: g.timerSec,
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
    setProgressBadge('Spørgsmål ' + (qIdx + 1) + '/' + total);
    document.getElementById('q-text').textContent = q.q;

    // Spørgsmålsbillede (kun vist på host — publiceres ikke til spillerne)
    var qImgWrap = document.getElementById('q-img-wrap');
    var qImgEl = document.getElementById('q-img');
    var qImgUrl = imgSrc(q.img);
    if (qImgUrl) {
      qImgEl.src = qImgUrl;
      qImgWrap.classList.add('show');
    } else {
      qImgEl.src = '';
      qImgWrap.classList.remove('show');
    }

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
      var optImgUrl = imgSrc(q.optImgs ? q.optImgs[i] : '');
      var thumbHtml = optImgUrl ? '<img class="opt-thumb" src="' + optImgUrl + '" alt="">' : '';
      card.innerHTML = thumbHtml + '<span class="icon">' + SHAPES[i] + '</span><span>' + escHtml(opt) + '</span>';
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

  /* --- Beregn scorer og vis reveal ---
     Inkl. streak-bonus: hver spiller der svarer rigtigt N gange i træk (N>=2)
     får +50 pr. streak-trin oveni de faste sværhedsgrad-point. Forkert svar
     eller intet svar nulstiller streaken. Vi løber over ALLE kendte spillere
     (ikke kun dem der svarede på dette spørgsmål), så en spiller der springer
     over/tiden løber ud får streaken nulstillet korrekt. */
  function computeAndReveal(qIdx, q) {
    var correctIdx = q.correct;
    var pts = LEVEL_POINTS[q.level] || 100;
    var deadline = g.questionStartAt + (g.timerSec + 1) * 1000; // +1s grace

    // Læs alle svar
    g.gameRef.child('answers/' + qIdx).once('value', function (snap) {
      var answersMap = {};
      if (snap.exists()) {
        snap.forEach(function (child) {
          answersMap[child.key] = child.val();
        });
      }

      var updates = {};
      Object.keys(g.players).forEach(function (pid) {
        var ans = answersMap[pid];
        var inTime = !!ans && ans.at <= deadline;
        var isCorrect = inTime && ans.choice === correctIdx;
        var prevStreak = g.players[pid].streak || 0;

        if (isCorrect) {
          var newStreak = prevStreak + 1;
          var bonus = newStreak >= 2 ? (newStreak - 1) * STREAK_BONUS_STEP : 0;
          var totalPts = pts + bonus;
          var newScore = (g.players[pid].score || 0) + totalPts;
          var newCorrect = (g.players[pid].correctCount || 0) + 1;

          g.players[pid].score = newScore;
          g.players[pid].correctCount = newCorrect;
          g.players[pid].streak = newStreak;

          updates['games/' + g.pin + '/players/' + pid + '/score'] = newScore;
          updates['games/' + g.pin + '/players/' + pid + '/correctCount'] = newCorrect;
          updates['games/' + g.pin + '/players/' + pid + '/streak'] = newStreak;
          updates['games/' + g.pin + '/players/' + pid + '/lastBonus'] = bonus;
        } else {
          if (prevStreak !== 0) {
            g.players[pid].streak = 0;
            updates['games/' + g.pin + '/players/' + pid + '/streak'] = 0;
          }
          updates['games/' + g.pin + '/players/' + pid + '/lastBonus'] = 0;
        }
      });

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

    // Spørgsmålsbillede (kun vist på host)
    var revealImgWrap = document.getElementById('reveal-img-wrap');
    var revealImgEl = document.getElementById('reveal-img');
    var revealImgUrl = imgSrc(q.img);
    if (revealImgUrl) {
      revealImgEl.src = revealImgUrl;
      revealImgWrap.classList.add('show');
    } else {
      revealImgEl.src = '';
      revealImgWrap.classList.remove('show');
    }

    // Svarmuligheder med highlight
    var optionsEl = document.getElementById('reveal-options');
    optionsEl.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var card = document.createElement('div');
      var cls = 'option-card ' + SHAPE_CLASSES[i];
      if (i === correctIdx) cls += ' correct';
      else cls += ' dim';
      card.className = cls;
      var optImgUrl = imgSrc(q.optImgs ? q.optImgs[i] : '');
      var thumbHtml = optImgUrl ? '<img class="opt-thumb" src="' + optImgUrl + '" alt="">' : '';
      card.innerHTML = thumbHtml + '<span class="icon">' + SHAPES[i] + '</span><span>' + escHtml(opt) + '</span>';
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

  /* --- Podiet (host) ---
     sdWinnerId (valgfri): sættes når podiet vises EFTER en afgjort Sudden
     Death — sikrer at vinderen vises alene på 1.-pladsen, og at "Uafgjort"-
     knappen ikke tilbydes igen. */
  function showPodiumHost(sdWinnerId) {
    hideProgressBadge();
    g.gameRef.child('state').update({ phase: 'podium', sdWinnerId: sdWinnerId || null });

    g.gameRef.child('players').once('value', function (snap) {
      var players = [];
      if (snap.exists()) {
        snap.forEach(function (child) {
          var d = child.val();
          players.push({
            pid: child.key,
            name: d.name,
            score: d.score || 0,
            correctCount: d.correctCount || 0,
            registered: !!d.registered
          });
        });
      }
      players.sort(function (a, b) { return b.score - a.score; });

      // Uafgjort-detektion for førstepladsen (rå score, uafhængig af evt.
      // tidligere sudden death) — styrer om "Afgør uafgjort"-knappen vises.
      var btnSd = document.getElementById('btn-sudden-death');
      if (players.length > 0 && !sdWinnerId) {
        var topScore = players[0].score;
        var tiedForFirst = players.filter(function (p) { return p.score === topScore; });
        if (tiedForFirst.length > 1) {
          g.tiedPlayers = tiedForFirst.map(function (p) { return p.pid; });
          if (btnSd) btnSd.style.display = 'block';
        } else if (btnSd) {
          btnSd.style.display = 'none';
        }
      } else if (btnSd) {
        btnSd.style.display = 'none';
      }

      var ranks = computeRanks(players, sdWinnerId);

      var medals = ['🥇', '🥈', '🥉'];
      var list = document.getElementById('podium-host-list');
      list.innerHTML = '';

      players.forEach(function (p, i) {
        var row = document.createElement('div');
        row.className = 'podium-row';
        var sdTag = (sdWinnerId && p.pid === sdWinnerId) ? ' <span style="font-size:0.8rem; color:#f59e0b;">⚡ Sudden Death-vinder</span>' : '';
        // Medalje efter RANG, ikke listeposition — delt score = samme medalje
        row.innerHTML =
          '<div class="medal">' + (medals[ranks[i] - 1] || ranks[i] + '.') + '</div>' +
          '<div class="p-name">' + escHtml(p.name) + sdTag + '</div>' +
          '<div class="p-pts">' + p.score + ' pt</div>';
        list.appendChild(row);
        // Animér én ad gangen (top-3 med forsinkelse)
        var delay = i < 3 ? (2 - i) * 600 : i * 80;
        setTimeout(function () { row.classList.add('show'); }, delay + 200);
      });

      // Side-effekt: gem resultat pr. REGISTRERET elev (ikke gæster).
      // Fire-and-forget — påvirker ikke podie-visning, ranking eller score.
      recordResultsForRegisteredPlayers(players);

      showScreen('screen-podium-host');
    });
  }

  document.getElementById('btn-sudden-death').addEventListener('click', function () {
    this.style.display = 'none';
    startSuddenDeath();
  });

  /* --- Gem ét /results-opslag pr. REGISTRERET elev (gæster springes over) ---
     Fire-and-forget: fejl logges men blokerer aldrig podie-UI'et. */
  function recordResultsForRegisteredPlayers(players) {
    var totalQuestions = g.quiz && Array.isArray(g.quiz.questions) ? g.quiz.questions.length : 0;
    players.forEach(function (p) {
      if (!p.registered) return; // gæster tracks aldrig
      var percent = totalQuestions > 0 ? Math.round(100 * p.correctCount / totalQuestions) : 0;
      db.ref('results/' + p.pid).push({
        name: p.name,
        quizId: g.quizId,
        quizTitle: g.quiz.title,
        semester: g.quiz.semester || '',
        course: g.quiz.course || '',
        lecture: g.quiz.lecture || '',
        score: p.score,
        correctCount: p.correctCount,
        totalQuestions: totalQuestions,
        percent: percent,
        gamePin: g.pin,
        playedAt: firebase.database.ServerValue.TIMESTAMP
      }).catch(function (err) {
        console.error('Kunne ikke gemme resultat for spiller ' + p.pid + ':', err);
      });
    });
  }

  /* --- Afslut spil --- */
  document.getElementById('btn-end').addEventListener('click', function () {
    if (!g.pin) { showScreen('screen-setup'); return; }
    if (!confirm('Er du sikker? Spillet og alle scorer slettes.')) return;
    db.ref('games/' + g.pin).remove().then(function () {
      g.pin = '';
      g.gameRef = null;
      hideProgressBadge();
      showScreen('screen-setup');
    });
  });

  /* --- Competition-ranking: delt score = delt placering (1, 1, 3, ...) ---
     sdWinnerId (valgfri): hvis sat, flyttes denne spiller forrest i
     sortedPlayers (muterer arrayet — bevidst, så kaldere der bagefter
     looper over samme array/rækkefølge også får vinderen først), og der
     tvinges et rang-spring lige efter vinderen, så resten af den
     oprindeligt uafgjorte gruppe fortsat deler plads med hinanden, men
     IKKE længere med vinderen. */
  function computeRanks(sortedPlayers, sdWinnerId) {
    if (sdWinnerId) {
      var wIdx = sortedPlayers.findIndex(function (p) { return p.pid === sdWinnerId; });
      if (wIdx > 0) {
        var w = sortedPlayers.splice(wIdx, 1)[0];
        sortedPlayers.unshift(w);
      }
    }
    var ranks = [];
    sortedPlayers.forEach(function (p, i) {
      if (i === 0) { ranks.push(1); return; }
      var sameScore = p.score === sortedPlayers[i - 1].score;
      var isSdBoundary = sdWinnerId && i === 1 && sortedPlayers[0].pid === sdWinnerId;
      if (sameScore && !isSdBoundary) {
        ranks.push(ranks[i - 1]);
      } else if (sameScore && isSdBoundary) {
        ranks.push(ranks[i - 1] + 1);
      } else {
        ranks.push(i + 1);
      }
    });
    return ranks;
  }

  /* ================================================================
     Sudden Death — afgør uafgjort førsteplads
     Trækker nye spørgsmål (starter let, eskalerer til middel → svær og
     bliver der) kun til de spillere, der stadig er tilbage i uafgjortheden.
     Forkert svar = ude. Rammer alle forkert samme runde = ingen ude, prøv
     igen. Kun 1 tilbage = vinder. Rører ALDRIG den normale score/rangering
     undervejs — kun en endelig sdWinnerId ved afslutning. Fast 10s-timer,
     uafhængig af spillets valgte tid pr. spørgsmål. Bruger egne DB-stier
     (sdAnswers/{round}) og egne timer/lytter-variable, adskilt fra den
     almindelige spørgsmålsflow, for slet ikke at kunne kollidere med den. */
  var sdTimerInterval = null;

  function startSuddenDeath() {
    g.sd = {
      candidatePids: g.tiedPlayers.slice(),
      round: 0,           // 0-baseret — bruges også som DB-nøgle ('r'+round)
      usedQuestionTexts: [],
      active: true
    };
    runSuddenDeathRound();
  }

  function sdLevelForRound(round) {
    if (round === 0) return 'let';
    if (round === 1) return 'middel';
    return 'svaer';
  }

  /* Finder ét ubrugt spørgsmål på det ønskede niveau. Bruger den samme
     Firebase-bank som quizzen selv stammer fra, hvis quizzen ER en
     auto-genereret bank-quiz (den mest almindelige sudden death-situation).
     Ellers falder den tilbage til at genbruge quizzens EGNE spørgsmål
     (foretrækker rigtigt niveau, ellers hvad som helst ubrugt). */
  function drawSuddenDeathQuestion(level, cb) {
    var isFromBank = (window.QUESTION_BANKS || []).some(function (b) { return b.id === g.quizId; });
    var shownTexts = g.quiz.questions.map(function (q) { return q.q; }).concat(g.sd.usedQuestionTexts);

    if (isFromBank) {
      db.ref('quizzes/' + g.quizId + '/questions').once('value', function (snap) {
        var all = [];
        snap.forEach(function (child) { var v = child.val(); v._id = child.key; all.push(v); });
        if (all.length === 0) { cb(new Error('Banken er tom.')); return; }
        var leveled = all.filter(function (q) { return q.level === level && shownTexts.indexOf(q.q) === -1; });
        var candidates = leveled.length > 0 ? leveled : all.filter(function (q) { return shownTexts.indexOf(q.q) === -1; });
        if (candidates.length === 0) candidates = all; // banken er brugt helt op — accepteret edge-case, genbrug
        var pick = candidates[Math.floor(Math.random() * candidates.length)];
        g.sd.usedQuestionTexts.push(pick.q);
        cb(null, pick);
      }, function (err) { cb(err); });
      return;
    }

    var pool = g.quiz.questions.filter(function (q) { return shownTexts.indexOf(q.q) === -1; });
    var leveled2 = pool.filter(function (q) { return q.level === level; });
    var chooseFrom = leveled2.length > 0 ? leveled2 : pool;
    if (chooseFrom.length === 0) chooseFrom = g.quiz.questions; // alt brugt — accepteret edge-case for en tiebreak
    var pick2 = chooseFrom[Math.floor(Math.random() * chooseFrom.length)];
    g.sd.usedQuestionTexts.push(pick2.q);
    cb(null, pick2);
  }

  function runSuddenDeathRound() {
    var level = sdLevelForRound(g.sd.round);
    drawSuddenDeathQuestion(level, function (err, qObj) {
      if (err || !qObj) {
        alert('Kunne ikke finde flere spørgsmål til sudden death: ' + (err ? err.message : 'ukendt fejl'));
        finishSuddenDeath(g.sd.candidatePids[0] || null);
        return;
      }

      var shuffled = shuffleQuestion(qObj);
      var roundKey = 'r' + g.sd.round;

      g.gameRef.child('question').set({ text: shuffled.q, options: shuffled.options, level: shuffled.level });
      g.gameRef.child('state').update({
        phase: 'suddendeath',
        questionStartAt: firebase.database.ServerValue.TIMESTAMP,
        timerSec: 10,
        correctChoice: -1,
        sdParticipantIds: g.sd.candidatePids,
        sdRound: g.sd.round
      }).then(function () {
        g.gameRef.child('state/questionStartAt').once('value', function (snap) {
          var startAt = snap.val() || serverNow();
          showSdQuestion(shuffled, g.sd.round, g.sd.candidatePids);

          var settled = false;
          var offAnswers = sdListenForAnswers(roundKey, g.sd.candidatePids, function () {
            if (settled) return;
            settled = true;
            sdClearTimer();
            resolveSuddenDeathRound(shuffled, startAt, roundKey);
          });

          sdStartTimer(startAt, 10, function () {
            if (settled) return;
            settled = true;
            offAnswers();
            resolveSuddenDeathRound(shuffled, startAt, roundKey);
          });
        });
      });
    });
  }

  function sdListenForAnswers(roundKey, candidatePids, onAllAnswered) {
    var ref = g.gameRef.child('sdAnswers/' + roundKey);
    var off = ref.on('value', function (snap) {
      if (snap.numChildren() >= candidatePids.length) {
        ref.off('value', off);
        onAllAnswered();
      }
    });
    return function () { ref.off('value', off); };
  }

  function resolveSuddenDeathRound(shuffled, startAt, roundKey) {
    g.gameRef.child('sdAnswers/' + roundKey).once('value', function (snap) {
      var answers = snap.val() || {};
      var deadline = startAt + 11000; // 10s + 1s kulance
      var survivors = [];
      var eliminated = [];
      g.sd.candidatePids.forEach(function (pid) {
        var a = answers[pid];
        var correct = a && a.choice === shuffled.correct && a.at <= deadline;
        if (correct) survivors.push(pid); else eliminated.push(pid);
      });

      g.gameRef.child('state/correctChoice').set(shuffled.correct);
      showSdReveal(shuffled, survivors, eliminated);

      setTimeout(function () {
        if (survivors.length === 0) {
          // Alle dumpede denne runde — ingen ryger ud, prøv igen (sværhedsgraden fortsætter med at eskalere)
          g.sd.round++;
          runSuddenDeathRound();
        } else if (survivors.length === 1) {
          finishSuddenDeath(survivors[0]);
        } else {
          g.sd.candidatePids = survivors;
          g.sd.round++;
          runSuddenDeathRound();
        }
      }, 3500);
    });
  }

  function finishSuddenDeath(winnerId) {
    g.sd.active = false;
    showPodiumHost(winnerId);
  }

  /* --- Sudden Death-timer (helt adskilt fra den almindelige spørgsmålstimer) --- */
  function sdStartTimer(startAt, timerSec, onExpire) {
    sdClearTimer();
    var bar = document.getElementById('sd-timer-bar');
    var numEl = document.getElementById('sd-timer-display');
    function tick() {
      var elapsed = (serverNow() - startAt) / 1000;
      var remaining = timerSec - elapsed;
      if (remaining < 0) remaining = 0;
      var pct = (remaining / timerSec) * 100;
      bar.style.width = pct + '%';
      var secs = Math.ceil(remaining);
      numEl.textContent = secs;
      if (remaining <= 5) { bar.classList.add('urgent'); numEl.classList.add('urgent'); }
      else { bar.classList.remove('urgent'); numEl.classList.remove('urgent'); }
      if (remaining <= 0) {
        sdClearTimer();
        onExpire();
      }
    }
    tick();
    sdTimerInterval = setInterval(tick, 100);
  }
  function sdClearTimer() {
    if (sdTimerInterval) { clearInterval(sdTimerInterval); sdTimerInterval = null; }
  }

  /* --- Sudden Death-skærm (host) --- */
  function showSdQuestion(shuffled, round, participantPids) {
    document.getElementById('sd-progress').textContent = '🔥 Runde ' + (round + 1) + ' — ' + (LEVEL_LABELS[shuffled.level] || shuffled.level) + '-niveau';
    document.getElementById('sd-participants').textContent =
      participantPids.map(function (pid) { return (g.players[pid] && g.players[pid].name) || '?'; }).join(' 🆚 ');
    document.getElementById('sd-q-text').textContent = shuffled.q;
    var badge = document.getElementById('sd-level-badge');
    badge.textContent = LEVEL_LABELS[shuffled.level] || shuffled.level;
    badge.className = 'level-badge ' + (LEVEL_CSS[shuffled.level] || 'level-let');

    var optionsEl = document.getElementById('sd-options');
    optionsEl.innerHTML = '';
    shuffled.options.forEach(function (opt, i) {
      var card = document.createElement('div');
      card.className = 'option-card ' + SHAPE_CLASSES[i];
      card.innerHTML = '<span class="icon">' + SHAPES[i] + '</span><span>' + escHtml(opt) + '</span>';
      optionsEl.appendChild(card);
    });

    document.getElementById('sd-status').style.display = 'none';
    showScreen('screen-sd');
  }

  function showSdReveal(shuffled, survivorPids, eliminatedPids) {
    var cards = document.querySelectorAll('#sd-options .option-card');
    cards.forEach(function (card, i) {
      card.classList.add(i === shuffled.correct ? 'correct' : 'dim');
    });
    var survivorNames = survivorPids.map(function (pid) { return (g.players[pid] && g.players[pid].name) || '?'; });
    var eliminatedNames = eliminatedPids.map(function (pid) { return (g.players[pid] && g.players[pid].name) || '?'; });
    var lines = [];
    if (survivorNames.length) lines.push('✅ Går videre: ' + survivorNames.join(', '));
    if (eliminatedNames.length) lines.push('❌ Ude: ' + eliminatedNames.join(', '));
    var status = document.getElementById('sd-status');
    status.innerHTML = lines.join('<br>');
    status.style.display = 'block';
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
