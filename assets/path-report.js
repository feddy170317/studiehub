// Bro mellem kapitel-quizzer og Duolingo-stien (path/). Auto-detekterer fag+kapitel
// ud fra quiz-URL'en og skriver resultatet til localStorage, som stien selv læser.
(function () {
  var KEY = 'sh_path_progress_v1';

  function detect() {
    var m = location.pathname.match(/quiz\/(dyn2|ele1|mem1)\/Kapitel(\d+)_Quiz\.html/i);
    if (!m) return null;
    return { course: m[1], chapter: parseInt(m[2], 10) };
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }

  window.reportPathQuiz = function (ratio, score) {
    var d = detect();
    if (!d) return;
    var data = load();
    if (!data[d.course]) data[d.course] = {};
    var prev = data[d.course][d.chapter] || {};
    data[d.course][d.chapter] = {
      bestRatio: Math.max(prev.bestRatio || 0, ratio),
      lastRatio: ratio,
      lastScore: score,
      attempts: (prev.attempts || 0) + 1,
      ts: Date.now()
    };
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  };
})();
