// Viser en tydelig bestået/ikke-bestået-besked efter en kapitel-quiz, ud fra
// samme beståelseskrav som stien (path/) bruger — så det aldrig er tvivlsomt
// om man har låst næste kapitel op.
(function () {
  var SETTINGS_KEY = 'sh_path_settings_v1';

  function getThreshold() {
    try {
      var s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      return typeof s.threshold === 'number' ? s.threshold : 0.6;
    } catch (e) { return 0.6; }
  }

  function detectCourse() {
    var m = location.pathname.match(/quiz\/(dyn2|ele1|mem1)\/Kapitel(\d+)_Quiz\.html/i);
    return m ? m[1] : null;
  }

  var style = document.createElement('style');
  style.textContent = [
    '@keyframes pathResultPop{0%{transform:scale(.85);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}',
    '.path-result{margin-top:18px;padding:20px 16px;border-radius:14px;text-align:center;animation:pathResultPop .35s ease-out}',
    '.path-result-pass{background:linear-gradient(160deg,#123a1e,#0f2e18);border:1.5px solid var(--good,#2ecc71)}',
    '.path-result-fail{background:linear-gradient(160deg,#2a1a12,#20140e);border:1.5px solid #e08b3d}',
    '.path-result-emoji{font-size:2.2rem;margin-bottom:6px}',
    '.path-result-title{font-size:1.15rem;font-weight:800;margin-bottom:4px}',
    '.path-result-pass .path-result-title{color:var(--good,#2ecc71)}',
    '.path-result-fail .path-result-title{color:#f4a460}',
    '.path-result-sub{font-size:.9rem;color:var(--dim,#9fb3c8)}',
    '.path-result-btn{display:inline-block;margin-top:14px;padding:12px 22px;border-radius:10px;background:var(--good,#2ecc71);color:#06210f;font-weight:800;text-decoration:none}'
  ].join('');
  document.head.appendChild(style);

  window.renderPathResultBanner = function (ratio) {
    var threshold = getThreshold();
    var passed = ratio >= threshold;
    var course = detectCourse();
    var pathLink = course ? '../../path/' + course + '.html' : null;
    var pct = Math.round(ratio * 100);
    var reqPct = Math.round(threshold * 100);

    if (passed) {
      return '<div class="path-result path-result-pass">'
        + '<div class="path-result-emoji">🎉🏅</div>'
        + '<div class="path-result-title">Bestået — næste kapitel er låst op!</div>'
        + '<div class="path-result-sub">' + pct + '% (kræver ' + reqPct + '%)</div>'
        + (pathLink ? '<a class="path-result-btn" href="' + pathLink + '">🎮 Tilbage til stien →</a>' : '')
        + '</div>';
    }
    return '<div class="path-result path-result-fail">'
      + '<div class="path-result-title">Ikke bestået endnu</div>'
      + '<div class="path-result-sub">' + pct + '% — kræver ' + reqPct + '% for at låse næste kapitel op</div>'
      + '</div>';
  };
})();
