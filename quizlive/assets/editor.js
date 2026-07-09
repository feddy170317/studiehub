/* ============================================================
   QuizLive — Quiz-editor (assets/editor.js)
   Giver enhver med linket mulighed for at oprette/redigere
   quizzer og gemme dem i Firebase Realtime Database.
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
  var ServerValue = firebase.database.ServerValue;

  /* --- Konstanter --- */
  var SHAPES        = ['▲', '◆', '●', '■'];
  var OPT_CLASSES   = ['opt-a', 'opt-b', 'opt-c', 'opt-d'];
  var OPT_LETTERS   = ['A', 'B', 'C', 'D'];

  /* ================================================================
     Slide-data: array af objekter
     { q, options:[4 strings], correct (0-3), level, why }
     ================================================================ */
  var slides = [emptySlide()];
  var currentIdx = 0;        // aktivt slide-indeks
  var editingQuizId = null;  // null = ny quiz, string = eksisterende id
  var editingCreatedAt = null; // beholder createdAt ved redigering

  /* Alle quizzer fra DB (til biblioteks-panel) */
  var dbQuizzes = {};        // id -> quiz-objekt incl. title, author, questions, createdAt

  /* --- HTML-escape hjælper --- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* --- Tom slide --- */
  function emptySlide() {
    return { q: '', options: ['', '', '', ''], correct: -1, level: 'middel', why: '' };
  }

  /* ================================================================
     Dom-referencer
     ================================================================ */
  var inpTitle        = document.getElementById('inp-quiz-title');
  var inpAuthor       = document.getElementById('inp-author');
  var btnSave         = document.getElementById('btn-save-quiz');
  var topbarError     = document.getElementById('topbar-error');
  var inpQuestion     = document.getElementById('inp-question');
  var inpOpts         = [
    document.getElementById('inp-opt-0'),
    document.getElementById('inp-opt-1'),
    document.getElementById('inp-opt-2'),
    document.getElementById('inp-opt-3')
  ];
  var inpLevel        = document.getElementById('inp-level');
  var inpWhy          = document.getElementById('inp-why');
  var slideLabel      = document.getElementById('slide-label');
  var slideDotsWrap   = document.getElementById('slide-dots');
  var btnPrev         = document.getElementById('btn-prev-slide');
  var btnNext         = document.getElementById('btn-next-slide');
  var btnNewSlide     = document.getElementById('btn-new-slide');
  var btnDeleteSlide  = document.getElementById('btn-delete-slide');
  var shapeButtons    = document.querySelectorAll('.option-shape-btn');
  var libraryToggle   = document.getElementById('library-toggle');
  var libraryContent  = document.getElementById('library-content');
  var libraryStatus   = document.getElementById('library-status');
  var libraryList     = document.getElementById('library-list');
  var btnNewQuiz      = document.getElementById('btn-new-quiz');
  var toast           = document.getElementById('editor-toast');

  /* ================================================================
     localStorage: forfatter-navn
     ================================================================ */
  var LS_AUTHOR = 'quizlive_author';

  (function prefillAuthor() {
    var saved = '';
    try { saved = localStorage.getItem(LS_AUTHOR) || ''; } catch (e) {}
    if (saved) inpAuthor.value = saved;
  })();

  inpAuthor.addEventListener('change', function () {
    try { localStorage.setItem(LS_AUTHOR, inpAuthor.value.trim()); } catch (e) {}
  });

  /* ================================================================
     Gem og indlæs slides fra/til DOM
     ================================================================ */

  /* Gem aktuelle DOM-inputfelter til slides[currentIdx] */
  function saveCurrentSlide() {
    var s = slides[currentIdx];
    s.q       = inpQuestion.value;
    s.options = inpOpts.map(function (inp) { return inp.value; });
    s.level   = inpLevel.value;
    s.why     = inpWhy.value.trim();
    /* correct sættes via shapeButtons (se nedenfor) — intet at gøre her */
  }

  /* Indlæs slides[idx] i DOM */
  function loadSlide(idx) {
    var s = slides[idx];
    inpQuestion.value = s.q;
    inpOpts.forEach(function (inp, i) { inp.value = s.options[i]; });
    inpLevel.value = s.level || 'middel';
    inpWhy.value   = s.why || '';
    updateCorrectUI(s.correct);
  }

  /* Opdatér de farvede shape-knapper baseret på correct-indeks */
  function updateCorrectUI(correctIdx) {
    shapeButtons.forEach(function (btn) {
      var i = parseInt(btn.dataset.opt, 10);
      if (i === correctIdx) {
        btn.classList.add('correct-marked');
      } else {
        btn.classList.remove('correct-marked');
      }
    });
  }

  /* ================================================================
     Shape-knapper: klik markerer korrekt svar
     ================================================================ */
  shapeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var i = parseInt(btn.dataset.opt, 10);
      slides[currentIdx].correct = i;
      updateCorrectUI(i);
      renderDots(); /* opdatér ufuldstændig-markering */
    });
  });

  /* ================================================================
     Slide-navigation
     ================================================================ */

  /* Skift til slide idx (gem aktuelle først) */
  function goToSlide(idx) {
    saveCurrentSlide();
    currentIdx = idx;
    loadSlide(idx);
    renderDots();
    renderNavButtons();
  }

  /* Rendér slide-label og forrige/næste-knapper */
  function renderNavButtons() {
    slideLabel.textContent = 'Slide ' + (currentIdx + 1) + ' af ' + slides.length;
    btnPrev.disabled = currentIdx === 0;
    btnNext.disabled = currentIdx === slides.length - 1;
  }

  /* Rendér thumbnail-dot strip */
  function renderDots() {
    slideDotsWrap.innerHTML = '';
    slides.forEach(function (s, i) {
      var dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === currentIdx ? ' active-dot' : '');
      dot.textContent = i + 1;
      dot.title = 'Gå til slide ' + (i + 1);
      dot.type = 'button';

      /* Markér ufuldstændige slides med rød prik */
      if (!isSlideComplete(s)) {
        dot.classList.add('incomplete');
      }
      var warn = document.createElement('span');
      warn.className = 'dot-warn';
      dot.appendChild(warn);

      dot.addEventListener('click', function () { goToSlide(i); });
      slideDotsWrap.appendChild(dot);
    });
  }

  /* Validér om et enkelt slide er komplet */
  function isSlideComplete(s) {
    if (!s.q.trim()) return false;
    for (var i = 0; i < 4; i++) {
      if (!s.options[i].trim()) return false;
    }
    if (s.correct < 0 || s.correct > 3) return false;
    return true;
  }

  btnPrev.addEventListener('click', function () {
    if (currentIdx > 0) goToSlide(currentIdx - 1);
  });

  btnNext.addEventListener('click', function () {
    if (currentIdx < slides.length - 1) goToSlide(currentIdx + 1);
  });

  btnNewSlide.addEventListener('click', addSlide);
  btnDeleteSlide.addEventListener('click', deleteCurrentSlide);

  function addSlide() {
    saveCurrentSlide();
    var newSlide = emptySlide();
    slides.splice(currentIdx + 1, 0, newSlide);
    goToSlide(currentIdx + 1);
  }

  function deleteCurrentSlide() {
    if (slides.length <= 1) {
      showToast('Du kan ikke slette det eneste slide.', true);
      return;
    }
    if (!confirm('Slet slide ' + (currentIdx + 1) + '? Dette kan ikke fortrydes.')) return;
    slides.splice(currentIdx, 1);
    var newIdx = Math.min(currentIdx, slides.length - 1);
    currentIdx = newIdx;
    loadSlide(currentIdx);
    renderDots();
    renderNavButtons();
  }

  /* --- Ctrl+Enter = ny slide --- */
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      addSlide();
    }
  });

  /* --- Sørg for dot-opdatering ved ændring i felter --- */
  inpQuestion.addEventListener('input', function () {
    slides[currentIdx].q = inpQuestion.value;
    renderDots();
  });
  inpOpts.forEach(function (inp, i) {
    inp.addEventListener('input', function () {
      slides[currentIdx].options[i] = inp.value;
      renderDots();
    });
  });

  /* ================================================================
     Gem quiz til Firebase
     ================================================================ */
  btnSave.addEventListener('click', saveQuiz);

  function saveQuiz() {
    /* 1. Gem aktuelle DOM til slides-array */
    saveCurrentSlide();

    /* 2. Valider titel og forfatter */
    var title  = inpTitle.value.trim();
    var author = inpAuthor.value.trim();
    topbarError.textContent = '';
    clearInvalidMarks();

    if (!title) {
      topbarError.textContent = 'Udfyld quizzens navn før du gemmer.';
      inpTitle.focus();
      return;
    }
    if (!author) {
      topbarError.textContent = 'Udfyld dit navn før du gemmer.';
      inpAuthor.focus();
      return;
    }

    /* 3. Valider alle slides */
    var firstInvalid = -1;
    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];
      if (!isSlideComplete(s)) {
        if (firstInvalid === -1) firstInvalid = i;
      }
    }
    if (firstInvalid !== -1) {
      goToSlide(firstInvalid);
      markInvalidFields(slides[firstInvalid]);
      topbarError.textContent =
        'Slide ' + (firstInvalid + 1) + ' er ufuldstændigt — udfyld spørgsmål, alle 4 svarmuligheder og markér korrekt svar.';
      return;
    }

    /* 4. Gem forfatter-navn */
    try { localStorage.setItem(LS_AUTHOR, author); } catch (e) {}

    /* 5. Byg quiz-objekt */
    var questions = slides.map(function (s) {
      var q = {
        q:       s.q.trim(),
        options: s.options.map(function (o) { return o.trim(); }),
        correct: s.correct,
        level:   s.level
      };
      if (s.why) q.why = s.why.trim();
      return q;
    });

    /* 6. Skriv til Firebase */
    btnSave.disabled = true;
    btnSave.textContent = 'Gemmer...';

    if (editingQuizId) {
      /* Redigér eksisterende */
      db.ref('quizzes/' + editingQuizId).set({
        title:       title,
        author:      author,
        createdAt:   editingCreatedAt || ServerValue.TIMESTAMP,
        updatedAt:   ServerValue.TIMESTAMP,
        questions:   questions
      }).then(function () {
        onSaveSuccess(title);
      }).catch(onSaveError);
    } else {
      /* Ny quiz */
      db.ref('quizzes').push({
        title:     title,
        author:    author,
        createdAt: ServerValue.TIMESTAMP,
        updatedAt: ServerValue.TIMESTAMP,
        questions: questions
      }).then(function (ref) {
        editingQuizId = ref.key;
        onSaveSuccess(title);
      }).catch(onSaveError);
    }
  }

  function onSaveSuccess(title) {
    btnSave.disabled  = false;
    btnSave.textContent = '💾 Gem quiz';
    topbarError.textContent = '';
    showToast('Quizzen \'' + title + '\' er gemt! ✔');
    loadLibrary(); /* opdatér biblioteks-panelet */
  }

  function onSaveError(err) {
    btnSave.disabled  = false;
    btnSave.textContent = '💾 Gem quiz';
    topbarError.textContent = 'Fejl ved gem: ' + (err && err.message ? err.message : 'Ukendt fejl');
    showToast('Gem fejlede — tjek konsollog.', true);
  }

  /* Markér ugyldige felter på det aktive slide */
  function markInvalidFields(s) {
    if (!s.q.trim()) inpQuestion.classList.add('invalid');
    inpOpts.forEach(function (inp, i) {
      if (!s.options[i].trim()) inp.classList.add('invalid');
    });
  }

  function clearInvalidMarks() {
    inpQuestion.classList.remove('invalid');
    inpOpts.forEach(function (inp) { inp.classList.remove('invalid'); });
  }

  /* Ryd invalid-markering ved ændring */
  inpQuestion.addEventListener('input', function () { inpQuestion.classList.remove('invalid'); });
  inpOpts.forEach(function (inp) {
    inp.addEventListener('input', function () { inp.classList.remove('invalid'); });
  });

  /* ================================================================
     Quiz-bibliotek: indlæs og vis
     ================================================================ */
  function loadLibrary() {
    libraryStatus.textContent = 'Indlæser quizzer...';
    libraryList.innerHTML = '';
    db.ref('quizzes').once('value').then(function (snap) {
      dbQuizzes = {};
      if (!snap.exists()) {
        libraryStatus.textContent = 'Ingen gemte quizzer endnu.';
        return;
      }
      snap.forEach(function (child) {
        dbQuizzes[child.key] = child.val();
        dbQuizzes[child.key]._id = child.key;
      });
      renderLibrary();
    }).catch(function (err) {
      libraryStatus.textContent = 'Kunne ikke indlæse quizzer: ' + (err && err.message ? err.message : 'fejl');
    });
  }

  function renderLibrary() {
    libraryList.innerHTML = '';
    var ids = Object.keys(dbQuizzes);
    if (ids.length === 0) {
      libraryStatus.textContent = 'Ingen gemte quizzer endnu.';
      return;
    }
    libraryStatus.textContent = '';

    /* Gruppér efter forfatter (sorter alfabetisk) */
    var byAuthor = {};
    ids.forEach(function (id) {
      var q = dbQuizzes[id];
      var a = (q.author || 'Ukendt').trim();
      if (!byAuthor[a]) byAuthor[a] = [];
      byAuthor[a].push({ id: id, quiz: q });
    });

    var authors = Object.keys(byAuthor).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase(), 'da');
    });

    authors.forEach(function (author) {
      var group = document.createElement('div');
      group.className = 'author-group';

      var label = document.createElement('div');
      label.className = 'author-group-label';
      label.textContent = author;
      group.appendChild(label);

      byAuthor[author].forEach(function (item) {
        var qObj  = item.quiz;
        var qId   = item.id;
        var qCnt  = Array.isArray(qObj.questions) ? qObj.questions.length : 0;
        var date  = qObj.updatedAt ? formatDate(qObj.updatedAt) : '';

        var row = document.createElement('div');
        row.className = 'quiz-library-row';

        var titleDiv = document.createElement('div');
        titleDiv.className = 'quiz-lib-title';
        titleDiv.textContent = qObj.title || '(Uden titel)';

        var metaDiv = document.createElement('div');
        metaDiv.className = 'quiz-lib-meta';
        metaDiv.textContent = qCnt + ' spørgsmål' + (date ? ' · ' + date : '');

        var btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-lib-edit';
        btnEdit.textContent = 'Redigér';
        btnEdit.type = 'button';
        btnEdit.addEventListener('click', function () { loadQuizForEdit(qId); });

        var btnDel = document.createElement('button');
        btnDel.className = 'btn btn-lib-delete';
        btnDel.textContent = '🗑';
        btnDel.title = 'Slet quiz';
        btnDel.type = 'button';
        btnDel.addEventListener('click', function () { deleteQuiz(qId, qObj.title); });

        row.appendChild(titleDiv);
        row.appendChild(metaDiv);
        row.appendChild(btnEdit);
        row.appendChild(btnDel);
        group.appendChild(row);
      });

      libraryList.appendChild(group);
    });
  }

  /* Formatér timestamp (ms) til "dd/mm/yyyy" */
  function formatDate(ts) {
    try {
      var d = new Date(ts);
      return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    } catch (e) { return ''; }
  }

  /* Indlæs en quiz fra DB til editoren */
  function loadQuizForEdit(id) {
    var qObj = dbQuizzes[id];
    if (!qObj) return;

    /* Sæt felter */
    inpTitle.value  = qObj.title  || '';
    inpAuthor.value = qObj.author || '';
    editingQuizId   = id;
    editingCreatedAt = qObj.createdAt || null;

    /* Konvertér questions til slides */
    if (Array.isArray(qObj.questions) && qObj.questions.length > 0) {
      slides = qObj.questions.map(function (q) {
        return {
          q:       q.q || '',
          options: Array.isArray(q.options) ? q.options.slice(0, 4).concat(['','','','']).slice(0,4) : ['','','',''],
          correct: (typeof q.correct === 'number') ? q.correct : -1,
          level:   q.level || 'middel',
          why:     q.why   || ''
        };
      });
    } else {
      slides = [emptySlide()];
    }

    currentIdx = 0;
    loadSlide(0);
    renderDots();
    renderNavButtons();
    topbarError.textContent = '';
    showToast('Quiz \'' + (qObj.title || '') + '\' indlæst til redigering.');

    /* Fold biblioteket sammen */
    libraryContent.classList.remove('open');
    libraryToggle.classList.remove('open');

    /* Scroll til toppen */
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Slet en quiz fra DB */
  function deleteQuiz(id, title) {
    if (!confirm('Slet quizzen "' + (title || id) + '"?\nDette kan ikke fortrydes.')) return;
    db.ref('quizzes/' + id).remove().then(function () {
      /* Hvis vi redigerede denne quiz, nulstil editoren */
      if (editingQuizId === id) {
        resetEditor();
      }
      delete dbQuizzes[id];
      renderLibrary();
      showToast('Quizzen er slettet.');
    }).catch(function (err) {
      showToast('Slet fejlede: ' + (err && err.message ? err.message : 'fejl'), true);
    });
  }

  /* ================================================================
     Ny quiz-knap: nulstil editor
     ================================================================ */
  btnNewQuiz.addEventListener('click', function () {
    if (!confirm('Opret ny quiz? Ikke-gemte ændringer til den aktuelle quiz mistes.')) return;
    resetEditor();
    libraryContent.classList.remove('open');
    libraryToggle.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function resetEditor() {
    editingQuizId    = null;
    editingCreatedAt = null;
    inpTitle.value   = '';
    slides           = [emptySlide()];
    currentIdx       = 0;
    loadSlide(0);
    renderDots();
    renderNavButtons();
    topbarError.textContent = '';
  }

  /* ================================================================
     Biblioteks-toggle
     ================================================================ */
  libraryToggle.addEventListener('click', function () {
    var isOpen = libraryContent.classList.toggle('open');
    libraryToggle.classList.toggle('open', isOpen);
    if (isOpen) {
      loadLibrary();
    }
  });

  /* ================================================================
     Toast-hjælper
     ================================================================ */
  var toastTimer = null;
  function showToast(msg, isError) {
    toast.textContent = msg;
    toast.className = 'show' + (isError ? ' toast-error' : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.className = '';
    }, 3500);
  }

  /* ================================================================
     Initialisering
     ================================================================ */
  loadSlide(0);
  renderDots();
  renderNavButtons();

}());
