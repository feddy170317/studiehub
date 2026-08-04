/* Studiehub — Super admin-panel.
   SIKKERHEDSDESIGN (samme princip som HverdagsHelte):
   - Rettigheden bor i studiehub/superadmins/{uid}, som INGEN klient kan skrive til
     (ingen .write-regel på den knude) — tildeles/fjernes kun i Firebase-konsollen.
   - Elevernes PIN er almindelig data og KAN ses/nulstilles herfra — det er meningen,
     så Frederik kan give koden igen hvis en elev glemmer den.
   - Alle handlinger auditeres i studiehub/audit. */
(function () {
  'use strict';

  var AVATARS = ['🦸‍♂️', '🧑‍🚀', '🥷', '🧑‍🔧', '🧙‍♂️', '🕵️', '🧑‍🎓', '🦾', '🐺', '🦊', '🐯', '🦅'];
  var ROSTER = ['Alexandre', 'Frederik', 'Jacob H', 'Jacob Ø', 'Jimmy', 'Jonas', 'Lukas', 'Nicolai', 'Simon', 'Thomas'];

  var st = { user: null, students: {}, audit: {} };
  var db = null, auth = null;

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtTs(ts) {
    if (!ts) return '';
    var d = new Date(ts), pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' kl. ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  var toastTimer = null;
  function toast(msg) {
    var t = $('#sa-toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function initFirebase() {
    if (db) return;
    firebase.initializeApp(window.FIREBASE_CONFIG);
    db = firebase.database();
    auth = firebase.auth();
  }
  function ref(path) { return db.ref('studiehub' + (path ? '/' + path : '')); }

  function show(id) {
    ['sa-auth', 'sa-denied', 'sa-panel'].forEach(function (s) {
      $('#' + s).style.display = s === id ? (s === 'sa-panel' ? 'block' : 'flex') : 'none';
    });
  }
  function showDenied(user) {
    $('#sa-uid').value = user.uid;
    show('sa-denied');
  }

  initFirebase();
  auth.onAuthStateChanged(function (user) {
    if (!user) { show('sa-auth'); return; }
    st.user = user;
    ref('superadmins/' + user.uid).once('value').then(function (s) {
      if (s.val() !== true) { showDenied(user); return; }
      enterPanel();
    }).catch(function () { showDenied(user); });
  });

  $('#sa-go').addEventListener('click', function () {
    var email = $('#sa-email').value.trim(), pass = $('#sa-pass').value;
    if (!email || !pass) return toast('Udfyld e-mail og kodeord');
    auth.signInWithEmailAndPassword(email, pass).catch(function (e) {
      toast('❌ ' + (e.message || 'Login fejlede'));
    });
  });
  $('#sa-logout').addEventListener('click', function () { auth.signOut().then(function () { location.reload(); }); });
  $('#sa-logout-denied').addEventListener('click', function () { auth.signOut().then(function () { location.reload(); }); });

  function enterPanel() {
    show('sa-panel');
    $('#sa-sub').textContent = st.user.email + ' · alle handlinger logges';
    ref('students').on('value', function (s) { st.students = s.val() || {}; renderStudents(); });
    ref('audit').on('value', function (s) { st.audit = s.val() || {}; renderAudit(); });
  }

  function auditLog(action, detail) {
    ref('audit').push({ ts: Date.now(), studentId: 'admin', name: st.user.email, action: action, detail: detail || '' });
  }

  function safeKey(s) { return String(s).replace(/[.#$/\[\]]/g, '_'); }
  function randomPin() { return String(Math.floor(1000 + Math.random() * 9000)); }
  function pinTaken(pin) {
    return Object.keys(st.students).some(function (id) { return String(st.students[id].pin) === pin; });
  }
  function freshPin() {
    var p; do { p = randomPin(); } while (pinTaken(p));
    return p;
  }

  function renderStudents() {
    var box = $('#sa-students');
    var ids = Object.keys(st.students).sort(function (a, b) {
      return (st.students[a].name || '').localeCompare(st.students[b].name || '', 'da');
    });
    $('#sa-count').textContent = ids.length + ' i alt';
    if (!ids.length) { box.innerHTML = '<div class="empty">Ingen elever endnu — brug "Opret klasse-liste" eller "Tilføj elev".</div>'; return; }
    box.innerHTML = ids.map(function (id) {
      var s = st.students[id];
      return '<div class="student-row">' +
        '<span class="s-avatar">' + esc(s.avatar || '🙂') + '</span>' +
        '<div class="s-main"><div class="s-name">' + esc(s.name) + '</div>' +
        '<div class="s-pin">PIN: ' + esc(s.pin || '?') + '</div></div>' +
        '<button class="btn ghost small" data-reset="' + id + '">🔑 Ny PIN</button>' +
        '<button class="btn red small" data-del="' + id + '">🗑️</button>' +
        '</div>';
    }).join('');
  }

  function renderAudit() {
    var box = $('#sa-audit');
    var ids = Object.keys(st.audit).sort(function (a, b) { return (st.audit[b].ts || 0) - (st.audit[a].ts || 0); }).slice(0, 25);
    if (!ids.length) { box.innerHTML = '<div class="empty">Ingen aktivitet endnu</div>'; return; }
    box.innerHTML = ids.map(function (id) {
      var a = st.audit[id];
      return '<div class="log-row"><span>' + (a.action === 'login' ? '🔓' : a.action === 'logout' ? '🔒' : '👑') + '</span>' +
        '<div style="flex:1">' + esc(a.name || a.studentId || '?') + ' — ' + esc(a.action) + (a.detail ? ' · ' + esc(a.detail) : '') + '</div>' +
        '<div class="log-time">' + fmtTs(a.ts) + '</div></div>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var rs = e.target.closest('[data-reset]');
    if (rs) {
      var id = rs.getAttribute('data-reset');
      var s = st.students[id];
      if (!s) return;
      var pin = prompt('Ny 4-cifret PIN til ' + s.name + ' (blank = generér tilfældig):');
      if (pin === null) return;
      pin = pin.trim();
      if (pin && !/^\d{4}$/.test(pin)) { toast('PIN skal være 4 cifre'); return; }
      var finalPin = pin || freshPin();
      ref('students/' + id + '/pin').set(finalPin).then(function () {
        auditLog('pin-nulstillet', s.name);
        toast('🔑 Ny PIN til ' + s.name + ': ' + finalPin);
      });
      return;
    }
    var dl = e.target.closest('[data-del]');
    if (dl) {
      var id2 = dl.getAttribute('data-del');
      var s2 = st.students[id2];
      if (!s2) return;
      if (!confirm('Slet ' + s2.name + '? Deres login og gemte resultater forsvinder.')) return;
      ref('students/' + id2).remove();
      ref('scores/' + id2).remove();
      auditLog('elev-slettet', s2.name);
      toast('🗑️ ' + s2.name + ' er slettet');
    }
  });

  $('#sa-add').addEventListener('click', function () {
    var name = prompt('Elevens navn:');
    if (!name) return;
    name = name.trim();
    if (!name) return;
    var av = AVATARS[Object.keys(st.students).length % AVATARS.length];
    var pin = freshPin();
    var id = ref('students').push().key;
    ref('students/' + id).set({ name: name, avatar: av, pin: pin, createdAt: Date.now() }).then(function () {
      auditLog('elev-oprettet', name);
      toast('✅ ' + name + ' oprettet — PIN: ' + pin);
    });
  });

  $('#sa-seed').addEventListener('click', function () {
    var existingNames = Object.keys(st.students).map(function (id) { return st.students[id].name; });
    var toCreate = ROSTER.filter(function (n) { return existingNames.indexOf(n) === -1; });
    if (!toCreate.length) { toast('Alle på klasse-listen findes allerede'); return; }
    if (!confirm('Opret ' + toCreate.length + ' elev(er): ' + toCreate.join(', ') + '?')) return;
    var updates = {};
    var summary = [];
    toCreate.forEach(function (name, i) {
      var id = ref('students').push().key;
      var av = AVATARS[(existingNames.length + i) % AVATARS.length];
      var pin = freshPin();
      updates[id] = { name: name, avatar: av, pin: pin, createdAt: Date.now() };
      // freshPin() tjekker mod st.students, som ikke opdateres før write —
      // registrér straks lokalt så to nye elever ikke kan få samme PIN i samme batch.
      st.students[id] = updates[id];
      summary.push(name + ': ' + pin);
    });
    ref('students').update(updates).then(function () {
      auditLog('klasse-liste-oprettet', toCreate.join(', '));
      toast('🌱 Oprettet ' + toCreate.length + ' elever — se PIN i listen');
      alert('Nye PIN-koder:\n\n' + summary.join('\n'));
    });
  });
})();
