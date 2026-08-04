/* Studiehub — fælles login-gate (PIN-baseret elevlogin, delt på tværs af hele sitet).
   Se STUDIEHUB_AUTH.md for opsætning af Firebase-regler.

   Datamodel i Realtime Database (projekt via-quiz):
     studiehub/students/{id}     = { name, avatar, pin, createdAt }
     studiehub/scores/{id}/...   = fag-/quiz-specifikke resultater, skrevet af den enkelte quiz-motor
     studiehub/audit/{push}      = { ts, studentId, name, action, detail }
     studiehub/superadmins/{uid} = true — sættes KUN i Firebase-konsollen, aldrig fra klienten

   Sikkerhedsdesign: PIN'en tjekkes client-side (samme model som HverdagsHelte) —
   ingen reel adgangskontrol, kun en høflig lås. Det er bevidst: linket deles kun
   internt, og underviseren (super admin) kender alle PIN'er i forvejen. */
(function () {
  'use strict';

  var SESSION_KEY = 'sh_student_id';
  var db = null;

  function initFirebase() {
    if (db) return db;
    if (!window.FIREBASE_CONFIG || !window.firebase) return null;
    try {
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      db = firebase.database();
      return db;
    } catch (e) { console.error('Firebase init fejlede', e); return null; }
  }
  function ref(path) {
    var d = initFirebase();
    return d ? d.ref('studiehub' + (path ? '/' + path : '')) : null;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var st = { students: {}, ready: false };
  var onReadyCbs = [];

  function currentId() { return localStorage.getItem(SESSION_KEY) || null; }
  function currentStudent() { return st.students[currentId()] || null; }

  function audit(action, detail) {
    var r = ref('audit');
    if (!r) return;
    r.push({ ts: Date.now(), studentId: currentId() || '?', name: (currentStudent() || {}).name || '?', action: action, detail: detail || '' });
  }

  // ---------- Overlay (appendes til <html>, så det virker uanset <body>-indhold) ----------
  var overlayEl = null;
  function buildOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'sh-gate';
    document.documentElement.appendChild(overlayEl);
    return overlayEl;
  }
  function hidePage() { document.documentElement.classList.add('sh-pending'); }
  function reveal() {
    document.documentElement.classList.remove('sh-pending');
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
  }

  function renderPicker() {
    var box = buildOverlay();
    var ids = Object.keys(st.students);
    box.innerHTML =
      '<div class="sh-gate-card">' +
        '<div class="sh-gate-logo">📚</div>' +
        '<h1 class="sh-gate-title">Studiehub</h1>' +
        '<p class="sh-gate-sub">Vælg dig selv for at fortsætte</p>' +
        '<div class="sh-profiles">' +
          (ids.length
            ? ids.map(function (id) {
                var s = st.students[id];
                return '<button class="sh-profile-btn" data-id="' + id + '">' +
                  '<span class="sh-avatar">' + esc(s.avatar || '🙂') + '</span>' +
                  '<span class="sh-name">' + esc(s.name) + '</span></button>';
              }).join('')
            : '<div class="sh-empty">Ingen elever oprettet endnu.</div>') +
        '</div>' +
      '</div>';
    Array.prototype.forEach.call(box.querySelectorAll('.sh-profile-btn'), function (btn) {
      btn.addEventListener('click', function () { renderPin(btn.getAttribute('data-id')); });
    });
  }

  function renderPin(id) {
    var s = st.students[id];
    if (!s) return renderPicker();
    var box = buildOverlay();
    box.innerHTML =
      '<div class="sh-gate-card">' +
        '<div class="sh-gate-logo">' + esc(s.avatar || '🙂') + '</div>' +
        '<h1 class="sh-gate-title" style="font-size:1.6rem">' + esc(s.name) + '</h1>' +
        '<p class="sh-gate-sub">Tast din 4-cifrede kode</p>' +
        '<div class="sh-pin-dots">' +
          '<span class="sh-pin-dot"></span><span class="sh-pin-dot"></span>' +
          '<span class="sh-pin-dot"></span><span class="sh-pin-dot"></span>' +
        '</div>' +
        '<div class="sh-pin-grid"></div>' +
        '<button class="sh-back-btn">← Vælg en anden</button>' +
      '</div>';
    var pin = '';
    var dots = box.querySelectorAll('.sh-pin-dot');
    var grid = box.querySelector('.sh-pin-grid');
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'].forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sh-pin-key' + (k === 'del' ? ' sh-pin-del' : k === 'ok' ? ' sh-pin-ok' : '');
      b.textContent = k === 'del' ? '⌫' : k === 'ok' ? '✓' : String(k);
      b.addEventListener('click', function () {
        if (k === 'del') pin = pin.slice(0, -1);
        else if (k === 'ok') { if (pin.length === 4) submit(); return; }
        else if (pin.length < 4) {
          pin += k;
          if (pin.length === 4) setTimeout(submit, 120);
        }
        Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('filled', i < pin.length); });
      });
      grid.appendChild(b);
    });
    box.querySelector('.sh-back-btn').addEventListener('click', renderPicker);

    function submit() {
      if (String(s.pin) === pin) {
        localStorage.setItem(SESSION_KEY, id);
        audit('login');
        reveal();
      } else {
        var dotsWrap = box.querySelector('.sh-pin-dots');
        dotsWrap.classList.add('sh-shake');
        setTimeout(function () { dotsWrap.classList.remove('sh-shake'); }, 400);
        pin = '';
        Array.prototype.forEach.call(dots, function (d) { d.classList.remove('filled'); });
      }
    }
  }

  // ---------- Boot ----------
  function boot() {
    hidePage();
    var d = initFirebase();
    if (!d) { reveal(); return; } // ingen forbindelse — bloker ikke offline-adgang til statisk indhold
    ref('students').on('value', function (snap) {
      st.students = snap.val() || {};
      st.ready = true;
      var id = currentId();
      if (id && st.students[id]) reveal();
      else { localStorage.removeItem(SESSION_KEY); renderPicker(); }
      onReadyCbs.forEach(function (fn) { fn(); });
      onReadyCbs = [];
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // ---------- Offentligt API (bruges af quiz-motorer til at gemme resultater) ----------
  window.ShAuth = {
    currentId: currentId,
    currentStudent: currentStudent,
    logout: function () { localStorage.removeItem(SESSION_KEY); audit('logout'); location.reload(); },
    onReady: function (fn) { if (st.ready) fn(); else onReadyCbs.push(fn); },
    // course/key vælges frit af den kaldende quiz (fx 'dyn2'/'kap3' eller 'mek2-l1'/'quiz').
    reportScore: function (course, key, data) {
      var id = currentId();
      if (!id) return;
      var r = ref('scores/' + id + '/' + course + '/' + key);
      if (!r) return;
      r.set(Object.assign({}, data, { ts: Date.now() }));
    },
    audit: audit
  };
})();
