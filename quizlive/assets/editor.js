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
    return {
      q: '', options: ['', '', '', ''], correct: -1, level: 'middel', why: '',
      img: '', optImgs: ['', '', '', '']
    };
  }

  /* ================================================================
     Dom-referencer
     ================================================================ */
  var inpTitle        = document.getElementById('inp-quiz-title');
  var inpAuthor       = document.getElementById('inp-author');
  var inpSemester     = document.getElementById('inp-semester');
  var inpCourse       = document.getElementById('inp-course');
  var inpLecture      = document.getElementById('inp-lecture');
  var courseDatalist  = document.getElementById('course-suggestions');
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
  var fileQImg        = document.getElementById('file-q-img');
  var btnQImg         = document.getElementById('btn-q-img');
  var qImgPreview     = document.getElementById('q-img-preview');
  var qImgPreviewImg  = document.getElementById('q-img-preview-img');
  var btnQImgRemove   = document.getElementById('btn-q-img-remove');
  var fileOptImg      = document.getElementById('file-opt-img');
  var optImgBtns      = document.querySelectorAll('.opt-img-btn');
  var optImgThumbs    = document.querySelectorAll('.opt-img-thumb');
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
  var LS_AUTHOR   = 'quizlive_author';
  var LS_SEMESTER = 'quizlive_semester';
  var LS_COURSE   = 'quizlive_course';
  var LS_LECTURE  = 'quizlive_lecture';

  (function prefillAuthor() {
    try {
      var a = localStorage.getItem(LS_AUTHOR)   || '';
      var s = localStorage.getItem(LS_SEMESTER) || '';
      var c = localStorage.getItem(LS_COURSE)   || '';
      var l = localStorage.getItem(LS_LECTURE)  || '';
      if (a) inpAuthor.value = a;
      if (s) inpSemester.value = s;
      if (c) inpCourse.value = c;
      if (l) inpLecture.value = l;
    } catch (e) {}
  })();

  inpAuthor.addEventListener('change', function () {
    try { localStorage.setItem(LS_AUTHOR, inpAuthor.value.trim()); } catch (e) {}
  });
  inpSemester.addEventListener('change', function () {
    try { localStorage.setItem(LS_SEMESTER, inpSemester.value); } catch (e) {}
  });
  inpCourse.addEventListener('change', function () {
    try { localStorage.setItem(LS_COURSE, inpCourse.value.trim()); } catch (e) {}
  });
  inpLecture.addEventListener('change', function () {
    try { localStorage.setItem(LS_LECTURE, inpLecture.value.trim()); } catch (e) {}
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
    updateQImgUI(s.img || '');
    var oImgs = s.optImgs || ['', '', '', ''];
    for (var i = 0; i < 4; i++) { updateOptImgUI(i, oImgs[i] || ''); }
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
     Billeder: komprimering + preview-UI (spørgsmål + svarmuligheder)
     ================================================================ */

  /* Læs en billedfil, skalér til maxDim og komprimér til JPEG data-URL.
     Fylder canvas med hvid baggrund først, så gennemsigtige PNG'er
     ikke bliver sorte. Kalder callback(dataUrl) ved succes. */
  function readAndCompressImage(file, maxDim, callback) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Billedet er for stort (maks. 10 MB).', true);
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var w = img.width || 1;
        var h = img.height || 1;
        var scale = Math.min(1, maxDim / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale));
        var ch = Math.max(1, Math.round(h * scale));
        var canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, cw, ch);
        callback(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = function () {
        showToast('Kunne ikke indlæse billedet.', true);
      };
      img.src = e.target.result;
    };
    reader.onerror = function () {
      showToast('Kunne ikke læse filen.', true);
    };
    reader.readAsDataURL(file);
  }

  /* Vis/skjul spørgsmålsbillede-preview + skift knaptekst */
  function updateQImgUI(dataUrl) {
    if (dataUrl) {
      qImgPreviewImg.src = dataUrl;
      qImgPreview.classList.add('show');
      btnQImg.textContent = '📷 Skift billede';
    } else {
      qImgPreviewImg.src = '';
      qImgPreview.classList.remove('show');
      btnQImg.textContent = '📷 Tilføj billede';
    }
  }

  /* Vis/skjul svarmulighed-thumbnail for option-indeks i */
  function updateOptImgUI(i, dataUrl) {
    var thumb = document.querySelector('.opt-img-thumb[data-opt="' + i + '"]');
    if (!thumb) return;
    var img = thumb.querySelector('img');
    if (dataUrl) {
      img.src = dataUrl;
      thumb.classList.add('show');
    } else {
      img.src = '';
      thumb.classList.remove('show');
    }
  }

  /* --- Spørgsmålsbillede: vælg/fjern --- */
  btnQImg.addEventListener('click', function () { fileQImg.click(); });
  fileQImg.addEventListener('change', function () {
    var file = fileQImg.files && fileQImg.files[0];
    fileQImg.value = ''; /* nulstil så samme fil kan vælges igen */
    if (!file) return;
    readAndCompressImage(file, 800, function (dataUrl) {
      slides[currentIdx].img = dataUrl;
      updateQImgUI(dataUrl);
      renderDots();
    });
  });
  btnQImgRemove.addEventListener('click', function () {
    slides[currentIdx].img = '';
    updateQImgUI('');
    renderDots();
  });

  /* --- Svarmulighed-billeder: vælg/fjern --- */
  var pendingOptImgIdx = -1;
  optImgBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pendingOptImgIdx = parseInt(btn.dataset.opt, 10);
      fileOptImg.click();
    });
  });
  fileOptImg.addEventListener('change', function () {
    var file = fileOptImg.files && fileOptImg.files[0];
    fileOptImg.value = ''; /* nulstil så samme fil kan vælges igen */
    var idx = pendingOptImgIdx;
    pendingOptImgIdx = -1;
    if (!file || idx < 0) return;
    readAndCompressImage(file, 400, function (dataUrl) {
      slides[currentIdx].optImgs[idx] = dataUrl;
      updateOptImgUI(idx, dataUrl);
    });
  });
  optImgThumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var idx = parseInt(thumb.dataset.opt, 10);
      slides[currentIdx].optImgs[idx] = '';
      updateOptImgUI(idx, '');
    });
  });

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

    /* 4. Gem forfatter/semester/fag/lektion til næste gang */
    var semester = inpSemester.value;
    var course   = inpCourse.value.trim();
    var lecture  = inpLecture.value.trim();
    try {
      localStorage.setItem(LS_AUTHOR, author);
      localStorage.setItem(LS_SEMESTER, semester);
      localStorage.setItem(LS_COURSE, course);
      localStorage.setItem(LS_LECTURE, lecture);
    } catch (e) {}

    /* 5. Byg quiz-objekt — saml billeder i separat map (imgId -> data-URL) */
    var imagesMap = {};
    function registerImage(dataUrl) {
      var id = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      imagesMap[id] = dataUrl;
      return id;
    }

    var questions = slides.map(function (s) {
      var q = {
        q:       s.q.trim(),
        options: s.options.map(function (o) { return o.trim(); }),
        correct: s.correct,
        level:   s.level
      };
      if (s.why) q.why = s.why.trim();
      if (s.img) q.img = registerImage(s.img);
      var hasOptImgs = Array.isArray(s.optImgs) && s.optImgs.some(function (v) { return !!v; });
      if (hasOptImgs) {
        q.optImgs = [0, 1, 2, 3].map(function (i) {
          var v = s.optImgs[i];
          return v ? registerImage(v) : '';
        });
      }
      return q;
    });

    /* 6. Skriv til Firebase (quiz-node + billed-node) */
    btnSave.disabled = true;
    btnSave.textContent = 'Gemmer...';

    var payload = {
      title:     title,
      author:    author,
      updatedAt: ServerValue.TIMESTAMP,
      questions: questions
    };
    if (semester) payload.semester = semester;
    if (course)   payload.course   = course;
    if (lecture)  payload.lecture  = lecture;

    /* Skriv billed-noden: sæt hele noden (fjernede billeder forsvinder),
       eller fjern noden helt hvis der ingen billeder er */
    function writeImages(quizId) {
      var imgRef = db.ref('quizimages/' + quizId);
      return Object.keys(imagesMap).length > 0 ? imgRef.set(imagesMap) : imgRef.remove();
    }

    if (editingQuizId) {
      /* Redigér eksisterende */
      payload.createdAt = editingCreatedAt || ServerValue.TIMESTAMP;
      db.ref('quizzes/' + editingQuizId).set(payload).then(function () {
        return writeImages(editingQuizId);
      }).then(function () {
        onSaveSuccess(title);
      }).catch(onSaveError);
    } else {
      /* Ny quiz — hent id fra push-ref FØR vi skriver billeder */
      payload.createdAt = ServerValue.TIMESTAMP;
      var newRef = db.ref('quizzes').push();
      var newQuizId = newRef.key;
      newRef.set(payload).then(function () {
        editingQuizId = newQuizId;
        return writeImages(newQuizId);
      }).then(function () {
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

    /* Gruppér efter semester · fag (fallback: forfatter) */
    var byGroup = {};
    ids.forEach(function (id) {
      var q = dbQuizzes[id];
      var key = groupLabel(q);
      if (!byGroup[key]) byGroup[key] = [];
      byGroup[key].push({ id: id, quiz: q });
    });

    var groupKeys = Object.keys(byGroup).sort(compareGroupLabels);

    /* Opdatér fag-forslag (datalist) med kendte fag */
    refreshCourseSuggestions();

    groupKeys.forEach(function (gKey) {
      var group = document.createElement('div');
      group.className = 'author-group';

      var label = document.createElement('div');
      label.className = 'author-group-label';
      label.textContent = gKey;
      group.appendChild(label);

      byGroup[gKey].forEach(function (item) {
        var qObj  = item.quiz;
        var qId   = item.id;
        var qCnt  = Array.isArray(qObj.questions) ? qObj.questions.length : 0;
        var date  = qObj.updatedAt ? formatDate(qObj.updatedAt) : '';

        var row = document.createElement('div');
        row.className = 'quiz-library-row';

        var titleDiv = document.createElement('div');
        titleDiv.className = 'quiz-lib-title';
        titleDiv.textContent = qObj.title || '(Uden titel)';

        var hasImg = Array.isArray(qObj.questions) && qObj.questions.some(function (q) {
          return !!q.img || (Array.isArray(q.optImgs) && q.optImgs.some(function (v) { return !!v; }));
        });

        var metaDiv = document.createElement('div');
        metaDiv.className = 'quiz-lib-meta';
        metaDiv.textContent = qCnt + ' spørgsmål · af ' + (qObj.author || 'ukendt') + (date ? ' · ' + date : '') + (hasImg ? ' · 📷' : '');

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

  /* Gruppelabel: "3. semester · ELE 1" — fallback til forfatter */
  function groupLabel(q) {
    var sem = (q.semester || '').trim();
    var course = (q.course || '').trim();
    if (sem && course) return sem + ' · ' + course;
    if (sem) return sem;
    if (course) return course;
    return 'Ukategoriseret — af ' + (q.author || 'ukendt').trim();
  }

  /* Sortér: semestre numerisk først, "Ukategoriseret" til sidst */
  function compareGroupLabels(a, b) {
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
  }

  /* Fyld datalist med kendte fag fra eksisterende quizzer */
  function refreshCourseSuggestions() {
    if (!courseDatalist) return;
    var seen = {};
    courseDatalist.innerHTML = '';
    Object.keys(dbQuizzes).forEach(function (id) {
      var c = (dbQuizzes[id].course || '').trim();
      if (c && !seen[c]) {
        seen[c] = true;
        var opt = document.createElement('option');
        opt.value = c;
        courseDatalist.appendChild(opt);
      }
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
    inpTitle.value    = qObj.title    || '';
    inpAuthor.value   = qObj.author   || '';
    inpSemester.value = qObj.semester || '';
    inpCourse.value   = qObj.course   || '';
    inpLecture.value  = qObj.lecture  || '';
    editingQuizId   = id;
    editingCreatedAt = qObj.createdAt || null;

    /* Hent billed-map og konvertér id-refs tilbage til data-URLs i slides */
    db.ref('quizimages/' + id).once('value').then(function (snap) {
      var imagesMap = snap.exists() ? snap.val() : {};

      if (Array.isArray(qObj.questions) && qObj.questions.length > 0) {
        slides = qObj.questions.map(function (q) {
          return {
            q:       q.q || '',
            options: Array.isArray(q.options) ? q.options.slice(0, 4).concat(['','','','']).slice(0,4) : ['','','',''],
            correct: (typeof q.correct === 'number') ? q.correct : -1,
            level:   q.level || 'middel',
            why:     q.why   || '',
            img:     (q.img && imagesMap[q.img]) ? imagesMap[q.img] : '',
            optImgs: [0, 1, 2, 3].map(function (i) {
              var ref = Array.isArray(q.optImgs) ? q.optImgs[i] : '';
              return (ref && imagesMap[ref]) ? imagesMap[ref] : '';
            })
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
    }).catch(function (err) {
      showToast('Kunne ikke indlæse billeder: ' + (err && err.message ? err.message : 'fejl'), true);
    });
  }

  /* Slet en quiz fra DB (inkl. tilhørende billed-node) */
  function deleteQuiz(id, title) {
    if (!confirm('Slet quizzen "' + (title || id) + '"?\nDette kan ikke fortrydes.')) return;
    Promise.all([
      db.ref('quizzes/' + id).remove(),
      db.ref('quizimages/' + id).remove()
    ]).then(function () {
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
  loadLibrary(); /* fylder også fag-forslag (datalist) fra start */

}());
