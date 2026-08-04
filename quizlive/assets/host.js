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
    autoAdvanced: false,
    imagesMap: {}           // imgId -> data-URL (kun til lokal host-visning, publiceres aldrig)
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

  /* --- Opret spil --- */
  document.getElementById('btn-create').addEventListener('click', function () {
    var selValue = document.getElementById('sel-quiz').value;
    var timerSec = parseInt(document.getElementById('sel-timer').value, 10);

    if (!selValue) {
      alert('Vælg en quiz først.');
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

    g.quizId = quizId;
    g.quiz = quiz;
    g.timerSec = timerSec;
    g.qIndex = 0;
    g.players = {};
    g.imagesMap = {};

    var pin = generatePin();
    g.pin = pin;
    g.gameRef = db.ref('games/' + pin);

    function createGameNode() {
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
    }

    // Hent quiz-billeder (kun DB-quizzer kan have billeder) FØR lobbyen vises.
    // Billederne hentes én gang og bruges kun lokalt på host — de publiceres
    // aldrig til /games, så spillerne ser dem aldrig.
    if (selValue.indexOf('db:') === 0) {
      db.ref('quizimages/' + quizId).once('value').then(function (snap) {
        g.imagesMap = snap.exists() ? snap.val() : {};
        createGameNode();
      }).catch(function () {
        g.imagesMap = {};
        createGameNode();
      });
    } else {
      createGameNode();
    }
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
