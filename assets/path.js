// Duolingo-stil fremskridtssti for et fag (DYN2 / ELE1 / MEM1).
// Læser kapitler fra content.json, viser dem som en slangesti af noder,
// og gemmer fremskridt (besøgte emner + quiz-resultater) i localStorage.
(function () {
  'use strict';

  var QUIZ_KEY = 'sh_path_progress_v1';   // skrives af assets/path-report.js
  var TOPIC_KEY = 'sh_path_topics_v1';
  var SETTINGS_KEY = 'sh_path_settings_v1';

  var COURSE_META = {
    dyn2: { title: 'Dynamik 2', icon: '⚙️', color: '#6366f1' },
    ele1: { title: 'Elektroteknik', icon: '⚡', color: '#f59e0b' },
    mem1: { title: 'Maskinelementer', icon: '🔩', color: '#14b8a6' }
  };

  var MATERIAL_ICON = { reading: '📖', flashcards: '🃏', practice: '✏️', slides: '📊', link: '🔗' };

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || '') || fallback; }
    catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function getSettings() {
    var s = loadJSON(SETTINGS_KEY, {});
    if (typeof s.threshold !== 'number') s.threshold = 0.6;
    return s;
  }
  function setThreshold(v) {
    var s = getSettings();
    s.threshold = v;
    saveJSON(SETTINGS_KEY, s);
  }

  function isTopicVisited(course, chapterId, url) {
    var t = loadJSON(TOPIC_KEY, {});
    return !!(t[course] && t[course][chapterId] && t[course][chapterId][url]);
  }
  function markTopicVisited(course, chapterId, url) {
    var t = loadJSON(TOPIC_KEY, {});
    if (!t[course]) t[course] = {};
    if (!t[course][chapterId]) t[course][chapterId] = {};
    t[course][chapterId][url] = true;
    saveJSON(TOPIC_KEY, t);
  }
  function getQuizResult(course, chapterNumber) {
    var q = loadJSON(QUIZ_KEY, {});
    return (q[course] && q[course][chapterNumber]) || null;
  }

  function buildChapters(course) {
    var eduList = window.__SH_CONTENT.educations;
    for (var e = 0; e < eduList.length; e++) {
      var sems = eduList[e].semesters;
      for (var s = 0; s < sems.length; s++) {
        var cs = sems[s].courses || [];
        for (var c = 0; c < cs.length; c++) {
          if (cs[c].id === course) {
            var lessons = (cs[c].lessons || []).filter(function (l) {
              return (l.materials || []).some(function (m) { return m.type === 'quiz'; });
            });
            return { course: cs[c], chapters: lessons };
          }
        }
      }
    }
    return { course: null, chapters: [] };
  }

  function chapterState(course, chapters, idx, threshold) {
    var ch = chapters[idx];
    var quiz = getQuizResult(course, quizChapterNumber(ch));
    var passed = !!quiz && quiz.bestRatio >= threshold;
    var prevPassed = idx === 0 ? true : chapterState(course, chapters, idx - 1, threshold).passed;
    var locked = !prevPassed;
    return { passed: passed, locked: locked, quiz: quiz };
  }

  function topicsOf(lesson) {
    return (lesson.materials || []).filter(function (m) { return m.type !== 'quiz'; });
  }
  function quizOf(lesson) {
    return (lesson.materials || []).filter(function (m) { return m.type === 'quiz'; })[0];
  }
  // path-report.js gemmer resultater under kapitel-tallet i quiz-URL'en (fx Kapitel12_Quiz.html -> 12),
  // som ikke nødvendigvis matcher lektionens fortløbende nummer (l01 = nummer 1).
  function quizChapterNumber(lesson) {
    var q = quizOf(lesson);
    if (q && q.url) {
      var m = q.url.match(/Kapitel(\d+)_Quiz\.html/i);
      if (m) return parseInt(m[1], 10);
    }
    return lesson.number;
  }

  function allTopicsVisited(course, lesson) {
    var topics = topicsOf(lesson);
    if (!topics.length) return true;
    return topics.every(function (t) { return t.url && isTopicVisited(course, lesson.id, t.url); });
  }

  function computeXP(course, chapters, threshold) {
    var xp = 0;
    chapters.forEach(function (ch) {
      topicsOf(ch).forEach(function (t) {
        if (t.url && isTopicVisited(course, ch.id, t.url)) xp += 10;
      });
      var q = getQuizResult(course, quizChapterNumber(ch));
      if (q && q.bestRatio >= threshold) xp += 100;
      else if (q) xp += Math.round(q.bestRatio * 50);
    });
    return xp;
  }

  function pct(r) { return Math.round((r || 0) * 100); }

  // content.json-URL'er er relative til Studiehub-roden, men path/-siderne ligger
  // ét niveau nede, så de skal have '../' foran for rent faktisk at pege rigtigt.
  function resolveUrl(url) {
    if (!url) return '#';
    if (/^([a-z]+:)?\/\//i.test(url) || url.charAt(0) === '/') return url;
    return '../' + url;
  }

  function zigzag(i) {
    return Math.round(Math.sin(i * 0.85) * 72);
  }

  function render(container, course) {
    var meta = COURSE_META[course] || { title: course, icon: '📚', color: '#6366f1' };
    var built = buildChapters(course);
    var chapters = built.chapters;
    var settings = getSettings();
    document.documentElement.style.setProperty('--path-accent', meta.color);

    if (!chapters.length) {
      container.innerHTML = '<div class="path-empty">Ingen kapitler fundet for ' + meta.title + '.</div>';
      return;
    }

    var states = chapters.map(function (_, i) { return chapterState(course, chapters, i, settings.threshold); });
    var xp = computeXP(course, chapters, settings.threshold);
    var passedCount = states.filter(function (s) { return s.passed; }).length;

    var html = '';
    html += '<div class="path-header">';
    html += '  <a class="path-back" href="index.html">← Alle fag</a>';
    html += '  <div class="path-title"><span class="path-icon">' + meta.icon + '</span><h1>' + meta.title + '</h1></div>';
    html += '  <div class="path-stats">';
    html += '    <span class="path-stat">🏅 ' + passedCount + '/' + chapters.length + ' kapitler</span>';
    html += '    <span class="path-stat path-xp">✨ ' + xp + ' XP</span>';
    html += '    <button class="path-settings-btn" id="pathSettingsBtn" title="Beståelseskrav">⚙ ' + pct(settings.threshold) + '%</button>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="path-progressbar"><div class="path-progressbar-fill" style="width:' + (chapters.length ? (passedCount / chapters.length * 100) : 0) + '%"></div></div>';

    html += '<div class="path-track">';
    chapters.forEach(function (ch, i) {
      var st = states[i];
      var cls = st.locked ? 'locked' : (st.passed ? 'done' : 'current');
      var offset = zigzag(i);
      var icon = st.locked ? '🔒' : (st.passed ? '★' : (i + 1));
      html += '<div class="path-node-row" style="transform:translateX(' + offset + 'px)">';
      html += '  <button class="path-node ' + cls + '" data-idx="' + i + '" ' + (st.locked ? 'disabled' : '') + '>';
      html += '    <span class="path-node-inner">' + icon + '</span>';
      html += '  </button>';
      html += '  <div class="path-node-label">Kap. ' + ch.number + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="path-modal-backdrop" id="pathModalBackdrop"><div class="path-modal" id="pathModal"></div></div>';

    container.innerHTML = html;

    container.querySelectorAll('.path-node').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openChapter(course, chapters, states, parseInt(btn.dataset.idx, 10), settings);
      });
    });

    var backdrop = container.querySelector('#pathModalBackdrop');
    backdrop.addEventListener('click', function (ev) {
      if (ev.target === backdrop) closeModal();
    });

    var settingsBtn = container.querySelector('#pathSettingsBtn');
    settingsBtn.addEventListener('click', function () {
      var options = [0.5, 0.6, 0.7, 0.8, 0.9];
      var cur = settings.threshold;
      var next = options[(options.indexOf(cur) + 1) % options.length];
      if (options.indexOf(cur) === -1) next = 0.6;
      setThreshold(next);
      render(container, course);
    });
  }

  function closeModal() {
    var backdrop = document.getElementById('pathModalBackdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  function openChapter(course, chapters, states, idx, settings) {
    var ch = chapters[idx];
    var st = states[idx];
    var topics = topicsOf(ch);
    var quizMat = quizOf(ch);
    var quizResult = st.quiz;
    var topicsDone = allTopicsVisited(course, ch);
    var quizLocked = !topicsDone;

    var html = '<button class="path-modal-close" id="pathModalClose">✕</button>';
    html += '<div class="path-modal-head"><span class="path-modal-badge">Kapitel ' + ch.number + '</span>';
    html += '<h2>' + ch.title + '</h2>';
    if (ch.summary) html += '<p class="path-modal-summary">' + ch.summary + '</p>';
    html += '</div>';

    html += '<div class="path-modal-section"><h3>Emner</h3><div class="path-topics">';
    if (!topics.length) {
      html += '<p class="path-modal-summary">Ingen emner — gå direkte til prøven.</p>';
    }
    topics.forEach(function (t) {
      var visited = t.url && isTopicVisited(course, ch.id, t.url);
      html += '<a class="path-topic ' + (visited ? 'visited' : '') + '" href="' + resolveUrl(t.url) + '" target="_blank" rel="noopener" data-url="' + (t.url || '') + '">';
      html += '<span class="path-topic-icon">' + (visited ? '✅' : (MATERIAL_ICON[t.type] || '📌')) + '</span>';
      html += '<span class="path-topic-title">' + t.title + '</span>';
      html += '</a>';
    });
    html += '</div></div>';

    html += '<div class="path-modal-section path-quiz-section">';
    html += '<h3>Prøve';
    if (quizResult) html += ' — bedste: ' + pct(quizResult.bestRatio) + '%';
    html += '</h3>';
    if (quizLocked) {
      html += '<p class="path-quiz-hint">🔓 Åbn alle emner ovenfor for at låse prøven op.</p>';
      html += '<button class="path-quiz-btn" disabled>Start prøve</button>';
    } else {
      html += '<a class="path-quiz-btn" href="' + resolveUrl(quizMat && quizMat.url) + '" target="_blank" rel="noopener">' + (quizResult ? '🔁 Prøv igen' : '▶ Start prøve') + '</a>';
      html += '<p class="path-quiz-hint">Kræver ' + pct(settings.threshold) + '% for at låse næste kapitel op.</p>';
    }
    if (st.passed) html += '<p class="path-quiz-passed">✓ Bestået — næste kapitel er låst op!</p>';
    html += '</div>';

    var modal = document.getElementById('pathModal');
    modal.innerHTML = html;
    document.getElementById('pathModalBackdrop').classList.add('open');

    document.getElementById('pathModalClose').addEventListener('click', closeModal);
    modal.querySelectorAll('.path-topic').forEach(function (a) {
      a.addEventListener('click', function () {
        var url = a.dataset.url;
        if (url) {
          markTopicVisited(course, ch.id, url);
          // Genopbyg modalen så prøve-sektionen afspejler det nye emne-status
          openChapter(course, chapters, states, idx, settings);
        }
      });
    });
  }

  window.StudiehubPath = {
    init: function (course, containerId) {
      var container = document.getElementById(containerId);
      function draw() { render(container, course); }
      draw();
      // Genindlæs når brugeren vender tilbage fra en quiz-/materiale-fane
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) draw();
      });
      window.addEventListener('focus', draw);
    },
    summary: function (course) {
      var built = buildChapters(course);
      var chapters = built.chapters;
      var settings = getSettings();
      var passedCount = chapters.filter(function (_, i) {
        return chapterState(course, chapters, i, settings.threshold).passed;
      }).length;
      return {
        title: (COURSE_META[course] || {}).title || course,
        icon: (COURSE_META[course] || {}).icon || '📚',
        total: chapters.length,
        passed: passedCount,
        xp: computeXP(course, chapters, settings.threshold)
      };
    }
  };
})();
