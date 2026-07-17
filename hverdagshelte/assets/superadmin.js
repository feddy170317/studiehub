/* HverdagsHelte — Super admin-panel (fase F).
   SIKKERHEDSDESIGN:
   - Rettigheden bor i hq/superadmins/{uid} som INGEN klient kan skrive til
     (ingen .write-regel) — den kan kun tildeles/fjernes i Firebase-konsollen.
   - Alle regler håndhæves på serveren; dette panel er kun et vindue.
   - Kodeord kan ALDRIG ses eller sættes direkte (Firebase hasher dem) —
     support-vejen er en nulstillingsmail. Børns PIN'er er org-data og KAN nulstilles.
   - Alle handlinger auditeres i familiens egen log (by: 'superadmin'). */
(function () {
  'use strict';
  var $ = HQ.$, esc = HQ.esc;
  var st = { user: null, users: {}, orgs: {}, open: {} };

  if (!HQ.initFirebase()) {
    document.body.innerHTML = '<div class="login-screen"><div class="login-logo">😴</div><h1 class="login-title" style="font-size:1.6rem">Ingen forbindelse</h1></div>';
    return;
  }

  function show(id) {
    ['sa-auth', 'sa-denied', 'sa-panel'].forEach(function (s) {
      $('#' + s).style.display = s === id ? (s === 'sa-panel' ? 'block' : 'flex') : 'none';
    });
  }
  // Viser UID'et så Frederik kan kopiere det direkte til Firebase-konsollen
  function showDenied(user) {
    $('#sa-uid').value = user.uid;
    show('sa-denied');
  }

  HQ.auth().onAuthStateChanged(function (user) {
    if (!user) { show('sa-auth'); return; }
    st.user = user;
    HQ.raw('hq/superadmins/' + user.uid).once('value').then(function (s) {
      if (s.val() !== true) { showDenied(user); return; }
      enterPanel();
    }).catch(function () { showDenied(user); });
  });

  $('#sa-go').addEventListener('click', function () {
    var email = $('#sa-email').value.trim(), pass = $('#sa-pass').value;
    if (!email || !pass) return HQ.toast('Udfyld e-mail og kodeord');
    HQ.auth().signInWithEmailAndPassword(email, pass)
      .catch(function (e) { HQ.toast('❌ ' + HQ.authErrorText(e)); });
  });
  $('#sa-logout').addEventListener('click', function () { HQ.auth().signOut().then(function () { location.reload(); }); });
  $('#sa-logout-denied').addEventListener('click', function () { HQ.auth().signOut().then(function () { location.reload(); }); });

  function enterPanel() {
    show('sa-panel');
    $('#sa-sub').textContent = st.user.email + ' · alle handlinger logges i familiernes aktivitetslog';
    HQ.raw('hq/users').once('value').then(function (s) { st.users = s.val() || {}; render(); });
    HQ.raw('hq/orgs').on('value', function (s) { st.orgs = s.val() || {}; render(); });
    $('#sa-search').addEventListener('input', render);
  }

  function sAudit(orgId, action, detail) {
    HQ.raw('hq/orgs/' + orgId + '/audit').push({
      ts: Date.now(), uid: st.user.uid, email: st.user.email,
      action: action, detail: detail || '', by: 'superadmin'
    });
  }
  function ownerEmail(org) {
    var uid = (org.meta || {}).ownerUid;
    return (st.users[uid] || {}).email || Object.keys(org.members || {}).map(function (u) {
      return (org.members[u] || {}).name;
    })[0] || '?';
  }

  function render() {
    var box = $('#sa-orgs');
    var q = ($('#sa-search').value || '').toLowerCase();
    var ids = Object.keys(st.orgs).filter(function (id) {
      var o = st.orgs[id];
      var hay = ((o.meta || {}).name || '') + ' ' + ownerEmail(o);
      return hay.toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return ((st.orgs[b].meta || {}).createdAt || 0) - ((st.orgs[a].meta || {}).createdAt || 0); });
    $('#sa-count').textContent = ids.length + ' i alt';
    if (!ids.length) { box.innerHTML = '<div class="card empty">Ingen familier matcher</div>'; return; }
    box.innerHTML = ids.map(function (id) {
      var o = st.orgs[id];
      var meta = o.meta || {};
      var nKids = Object.keys(o.kids || {}).length;
      var nMembers = Object.keys(o.members || {}).length;
      var open = !!st.open[id];
      return '<div class="card">' +
        '<div class="mod-head" data-sa-toggle="' + id + '">' +
          '<span style="font-size:1.6rem">' + (open ? '📂' : '🏰') + '</span>' +
          '<div style="flex:1"><div class="m-name">' + esc(meta.name || id) + '</div>' +
          '<div class="m-sub">' + esc(ownerEmail(o)) + ' · ' + nMembers + ' voksne · ' + nKids + ' helte · oprettet ' + (meta.createdAt ? HQ.fmtTs(meta.createdAt) : '?') + '</div></div>' +
        '</div>' +
        (open ? orgBody(id, o) : '') +
      '</div>';
    }).join('');
  }

  function orgBody(id, o) {
    var members = Object.keys(o.members || {}).map(function (uid) {
      var u = st.users[uid] || {};
      return '<div class="admin-row"><span style="font-size:1.2rem">👤</span>' +
        '<div class="a-main"><div class="a-title" style="font-size:0.9rem">' + esc(u.email || uid) + '</div>' +
        '<div class="a-sub">' + esc((o.members[uid] || {}).role || '?') + (u.name ? ' · ' + esc(u.name) : '') + '</div></div>' +
        (u.email ? '<button class="btn small ghost" data-sa-reset="' + esc(u.email) + '" style="padding:5px 10px;font-size:0.72rem">📧 Nulstillingsmail</button>' : '') +
        '</div>';
    }).join('');
    var kids = Object.keys(o.kids || {}).map(function (kid) {
      var k = o.kids[kid] || {};
      return '<div class="admin-row"><span style="font-size:1.2rem">' + esc(k.avatar || '🧒') + '</span>' +
        '<div class="a-main"><div class="a-title" style="font-size:0.9rem">' + esc(k.name || kid) + (k.archived ? ' (arkiveret)' : '') + '</div>' +
        '<div class="a-sub">PIN: ' + esc(k.pin || '?') + (k.grade != null ? ' · ' + k.grade + '. kl.' : '') + '</div></div>' +
        '<button class="btn small ghost" data-sa-pin="' + id + '|' + kid + '" style="padding:5px 10px;font-size:0.72rem">🔑 Ny PIN</button>' +
        '</div>';
    }).join('');
    var audit = Object.keys(o.audit || {}).sort(function (a, b) { return (o.audit[b].ts || 0) - (o.audit[a].ts || 0); })
      .slice(0, 8).map(function (aid) {
        var a = o.audit[aid];
        return '<div class="log-row"><span class="log-ico">' + (a.by === 'superadmin' ? '👑' : '🛡️') + '</span>' +
          '<div class="log-main">' + esc(a.action) + (a.detail ? ' — ' + esc(a.detail) : '') +
          '<div class="log-time">' + esc(a.email || '') + ' · ' + HQ.fmtTs(a.ts) + '</div></div></div>';
      }).join('');
    return '<div class="mod-body">' +
      '<div class="mod-section-label">Voksne</div>' + (members || '<div class="empty">Ingen</div>') +
      '<div class="mod-section-label">Helte</div>' + (kids || '<div class="empty">Ingen</div>') +
      '<div class="mod-section-label">Seneste aktivitet</div>' + (audit || '<div class="empty">Ingen</div>') +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
        '<a class="btn small" href="admin.html?org=' + esc(id) + '">🛠️ Åbn i admin (support)</a>' +
        '<button class="btn red small" data-sa-del="' + id + '">💀 Slet familien (GDPR)</button>' +
      '</div></div>';
  }

  document.addEventListener('click', function (e) {
    var tg = e.target.closest('[data-sa-toggle]');
    if (tg && !e.target.closest('button') && !e.target.closest('a')) {
      var id = tg.getAttribute('data-sa-toggle');
      st.open[id] = !st.open[id];
      render();
      return;
    }
    var rs = e.target.closest('[data-sa-reset]');
    if (rs) {
      var email = rs.getAttribute('data-sa-reset');
      if (!confirm('Send nulstillingsmail til ' + email + '?')) return;
      HQ.auth().sendPasswordResetEmail(email).then(function () {
        HQ.toast('📧 Nulstillingsmail sendt til ' + email);
      }).catch(function (err) { HQ.toast('❌ ' + HQ.authErrorText(err)); });
      // find org for audit: log på alle orgs hvor emailen er medlem er overkill — log på den åbne
      Object.keys(st.open).forEach(function (oid) { if (st.open[oid]) sAudit(oid, 'nulstillingsmail-sendt', email); });
      return;
    }
    var pn = e.target.closest('[data-sa-pin]');
    if (pn) {
      var parts = pn.getAttribute('data-sa-pin').split('|');
      var kid = (st.orgs[parts[0]] || {}).kids ? st.orgs[parts[0]].kids[parts[1]] : null;
      if (!kid) return;
      var pin = prompt('Ny 4-cifret PIN til ' + (kid.name || 'helten') + ':');
      if (pin === null) return;
      if (!/^\d{4}$/.test(pin.trim())) { HQ.toast('PIN skal være 4 cifre'); return; }
      HQ.raw('hq/orgs/' + parts[0] + '/kids/' + parts[1] + '/pin').set(pin.trim());
      sAudit(parts[0], 'pin-nulstillet', kid.name || parts[1]);
      HQ.toast('🔑 PIN opdateret');
      return;
    }
    var dl = e.target.closest('[data-sa-del]');
    if (dl) {
      var oid = dl.getAttribute('data-sa-del');
      var org = st.orgs[oid];
      if (!org) return;
      var name = (org.meta || {}).name || oid;
      var typed = prompt('SLET HELE FAMILIEN "' + name + '" permanent?\n\nAl data (helte, XP, kontobog, historik) forsvinder for altid.\nSkriv familiens navn for at bekræfte:');
      if (typed === null) return;
      if (typed.trim() !== name) { HQ.toast('Navnet matchede ikke — intet slettet'); return; }
      var memberUids = Object.keys(org.members || {});
      HQ.raw('hq/orgs/' + oid).remove().then(function () {
        // Fjern org-referencen hos medlemmerne, så deres login lander i onboarding igen
        memberUids.forEach(function (uid) { HQ.raw('hq/users/' + uid + '/orgs/' + oid).remove(); });
        HQ.toast('💀 ' + name + ' er slettet');
      }).catch(function (err) { HQ.toast('❌ Kunne ikke slette: ' + (err.message || err)); });
    }
  });
})();
