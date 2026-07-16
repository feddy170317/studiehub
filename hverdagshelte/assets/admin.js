/* HverdagsHelte — admin-app v2 (moduler, ledger-godkendelse, import/eksport) */
(function () {
  'use strict';
  var $ = HQ.$, esc = HQ.esc;

  var st = {
    config: null, kids: {}, modules: {}, content: HQ.assemble({}),
    completions: {}, ledgers: {}, shop: {}, purchases: {}, jobs: {},
    openModule: null
  };
  var TYPE_NAMES = { daily: 'Daglig', weekly: 'Ugentlig', once: 'Særlig (engangs)' };
  var PERIOD_OPTS = { day: 'Dagligt', week: 'Ugentligt', month: 'Månedligt' };

  if (!HQ.initFirebase()) {
    document.body.innerHTML = '<div class="login-screen"><div class="login-logo">😴</div>' +
      '<h1 class="login-title" style="font-size:1.6rem">Ingen forbindelse</h1>' +
      '<p class="login-sub">Tjek internettet og genindlæs siden</p></div>';
    return;
  }

  // ═══════════ OPSTART v3: auth → organisation → app ═══════════
  var authMode = 'login';
  function showScreen(id) {
    ['screen-auth', 'screen-onboard', 'screen-setup', 'screen-app'].forEach(function (s) {
      var el = $('#' + s);
      if (el) el.style.display = s === id ? (s === 'screen-app' ? 'block' : 'flex') : 'none';
    });
  }

  HQ.auth().onAuthStateChanged(function (user) {
    if (!user) { showScreen('screen-auth'); return; }
    resolveOrg(user);
  });

  function resolveOrg(user) {
    HQ.raw('hq/users/' + user.uid + '/orgs').once('value').then(function (snap) {
      var orgs = snap.val() || {};
      var orgId = Object.keys(orgs)[0];
      if (!orgId) {
        // Ny konto → onboarding (+ tilbud om at flytte legacy-data ind)
        HQ.raw('liferpg').once('value').then(function (leg) {
          var legacy = leg.val();
          $('#onboard-migrate').style.display = (legacy && legacy.kids && !legacy._migratedTo) ? 'block' : 'none';
          showScreen('screen-onboard');
        }).catch(function () { showScreen('screen-onboard'); });
        return;
      }
      HQ.setOrg(orgId);
      HQ.ref('meta').once('value').then(function (m) {
        var meta = m.val() || {};
        $('#org-title').textContent = meta.name || 'HverdagsHelte';
        $('#org-sub').textContent = (user.email || '') + ' · Godkend quests, opret opgaver og styr butikken';
        return HQ.ref('kids').once('value');
      }).then(function (k) {
        if (!k.val()) { renderSetupModules(); showScreen('screen-setup'); }
        else { showScreen('screen-app'); enterApp(); }
      });
    });
  }

  // --- Auth-skærmens handlers ---
  function setAuthMode(mode) {
    authMode = mode;
    $('#auth-tab-login').className = 'btn small' + (mode === 'login' ? '' : ' ghost');
    $('#auth-tab-signup').className = 'btn small' + (mode === 'signup' ? '' : ' ghost');
    $('#auth-name-row').style.display = mode === 'signup' ? 'block' : 'none';
    $('#auth-go').textContent = mode === 'login' ? 'Log ind' : 'Opret konto';
  }
  $('#auth-tab-login').addEventListener('click', function () { setAuthMode('login'); });
  $('#auth-tab-signup').addEventListener('click', function () { setAuthMode('signup'); });

  $('#auth-go').addEventListener('click', function () {
    var email = $('#auth-email').value.trim();
    var pass = $('#auth-pass').value;
    if (!email || !pass) return HQ.toast('Udfyld e-mail og kodeord');
    var btn = this;
    btn.disabled = true;
    var done = function () { btn.disabled = false; };
    if (authMode === 'signup') {
      var name = $('#auth-name').value.trim();
      if (!name) { done(); return HQ.toast('Skriv dit navn'); }
      HQ.auth().createUserWithEmailAndPassword(email, pass).then(function (cred) {
        return HQ.raw('hq/users/' + cred.user.uid).update({ email: email, name: name, createdAt: Date.now() });
      }).then(done).catch(function (e) { done(); HQ.toast('❌ ' + HQ.authErrorText(e)); });
    } else {
      HQ.auth().signInWithEmailAndPassword(email, pass)
        .then(done).catch(function (e) { done(); HQ.toast('❌ ' + HQ.authErrorText(e)); });
    }
  });

  $('#auth-forgot').addEventListener('click', function () {
    var email = $('#auth-email').value.trim();
    if (!email) return HQ.toast('Skriv din e-mail i feltet først');
    HQ.auth().sendPasswordResetEmail(email).then(function () {
      HQ.toast('📧 Nulstillings-link sendt til ' + email);
    }).catch(function (e) { HQ.toast('❌ ' + HQ.authErrorText(e)); });
  });

  // --- Onboarding: opret familie (organisation) + evt. migrering ---
  $('#onboard-go').addEventListener('click', function () {
    var name = $('#onboard-name').value.trim();
    if (!name) return HQ.toast('Giv familien et navn');
    var user = HQ.auth().currentUser;
    if (!user) return;
    var btn = this;
    btn.disabled = true;
    var orgRef = HQ.raw('hq/orgs').push();
    var org = {
      meta: { name: name, type: 'family', createdAt: Date.now(), ownerUid: user.uid },
      members: {}
    };
    org.members[user.uid] = { role: 'owner', name: user.email || '' };
    orgRef.set(org).then(function () {
      return HQ.raw('hq/users/' + user.uid + '/orgs/' + orgRef.key).set('owner');
    }).then(function () {
      var doMigrate = $('#onboard-migrate').style.display !== 'none' && $('#onboard-migrate-check').checked;
      if (!doMigrate) return null;
      return HQ.raw('liferpg').once('value').then(function (leg) {
        var legacy = leg.val() || {};
        var upd = {};
        ['kids', 'modules', 'completions', 'ledger', 'shop', 'purchases'].forEach(function (n) {
          if (legacy[n]) upd[n] = legacy[n];
        });
        if (!Object.keys(upd).length) return null;
        return orgRef.update(upd).then(function () {
          return HQ.raw('liferpg/_migratedTo').set(orgRef.key);
        });
      });
    }).then(function () {
      HQ.setOrg(orgRef.key);
      HQ.audit('org-oprettet', name);
      HQ.confetti({ count: 120 });
      resolveOrg(user);
    }).catch(function (e) {
      btn.disabled = false;
      HQ.toast('❌ Kunne ikke oprette: ' + (e.message || e));
    });
  });

  function setupGrade() {
    var v = $('#setup-kid-grade').value;
    return v === '' ? null : parseInt(v, 10);
  }
  // Wizard: bundlede moduler grupperet pr. kategori, forvalgt efter klassetrin.
  // Moduler udenfor trinnet vises stadig (aldrig tvang — kun anbefaling).
  function renderSetupModules() {
    var box = $('#setup-modules');
    var grade = setupGrade();
    var mods = window.HQ_BUNDLED || [];
    if (!mods.length) { box.innerHTML = '<p style="color:var(--muted)">Ingen bundlede moduler fundet</p>'; return; }
    var byCat = {};
    mods.forEach(function (m, i) {
      var cat = m.category || 'fritid';
      (byCat[cat] = byCat[cat] || []).push({ m: m, i: i });
    });
    box.innerHTML = ['skole', 'hjem', 'fritid'].filter(function (c) { return byCat[c]; }).map(function (cat) {
      return '<div class="mod-section-label">' + (HQ.CATEGORY_NAMES[cat] || cat) + '</div>' +
        byCat[cat].map(function (e) {
          var fits = HQ.gradeFits(e.m.grades, grade);
          var hint = gradesText(e.m.grades);
          return '<label style="display:flex;align-items:center;gap:8px;margin:6px 0;font-size:0.9rem;color:var(--text);opacity:' + (fits ? '1' : '0.55') + '">' +
            '<input type="checkbox"' + (fits ? ' checked' : '') + ' data-mod-idx="' + e.i + '" style="width:auto"> ' + esc(e.m.name) +
            (hint ? ' <span style="color:var(--muted);font-size:0.75rem">(' + hint + ')</span>' : '') + '</label>';
        }).join('');
    }).join('');
  }

  // Klassetrin-dropdown i wizarden + genberegn forvalget når trinnet ændres
  $('#setup-kid-grade').innerHTML = gradeOptions(null);
  $('#setup-kid-grade').addEventListener('change', renderSetupModules);

  $('#setup-go').addEventListener('click', function () {
    var kidName = $('#setup-kid-name').value.trim();
    var kidAvatar = $('#setup-kid-avatar').value.trim() || '🦸‍♀️';
    var kidPin = $('#setup-kid-pin').value.trim();
    var kidGrade = setupGrade();
    if (!kidName) return HQ.toast('Skriv barnets navn');
    if (!/^\d{4}$/.test(kidPin)) return HQ.toast('Barnets PIN skal være 4 cifre');

    var seed = {
      config: { created: Date.now() },
      shop: {
        s_skaerm: { title: '30 min ekstra skærmtid', icon: '📱', cost: 50, active: true },
        s_mad: { title: 'Vælg aftensmad', desc: 'Du bestemmer menuen', icon: '🍕', cost: 80, active: true },
        s_bio: { title: 'Biograftur', desc: 'Med popcorn!', icon: '🎬', cost: 500, active: true }
      },
      modules: {}
    };
    HQ.$all('#setup-modules input:checked').forEach(function (cb) {
      var m = (window.HQ_BUNDLED || [])[parseInt(cb.getAttribute('data-mod-idx'), 10)];
      if (m) seed.modules[m.id] = installModuleData(m, kidGrade);
    });
    var kid = { name: kidName, avatar: kidAvatar, pin: kidPin, created: Date.now() };
    if (kidGrade != null) kid.grade = kidGrade;
    HQ.ref().update(seed).then(function () {
      return HQ.ref('kids').push(kid);
    }).then(function () {
      st.config = seed.config;
      HQ.audit('helt-oprettet', kidName);
      HQ.confetti({ count: 120 });
      showScreen('screen-app');
      enterApp();
    }).catch(function (e) { HQ.toast('Kunne ikke gemme: ' + e.message); });
  });

  $('#logout-btn').addEventListener('click', function () {
    HQ.auth().signOut().then(function () { location.reload(); });
  });

  // ═══════════ APP ═══════════
  function enterApp() {
    $('#screen-app').style.display = 'block';
    sub('kids', function (v) { st.kids = v || {}; renderKids(); renderPending(); renderPurchases(); });
    sub('modules', function (v) { st.modules = v || {}; st.content = HQ.assemble(st.modules); renderModules(); renderPending(); renderKids(); });
    sub('completions', function (v) { st.completions = v || {}; renderPending(); renderLog(); });
    sub('ledger', function (v) { st.ledgers = v || {}; renderKids(); });
    sub('shop', function (v) { st.shop = v || {}; renderShopList(); });
    sub('purchases', function (v) { st.purchases = v || {}; renderPurchases(); renderLog(); });
    sub('audit', function (v) { st.audit = v || {}; renderLog(); });
    sub('jobs', function (v) { st.jobs = v || {}; renderJobList(); renderPendingJobs(); });
  }
  function sub(path, fn) {
    HQ.ref(path).on('value', function (snap) { fn(snap.val()); }, function (err) {
      var b = $('#fb-banner');
      b.style.display = 'block';
      b.textContent = '⚠️ Databasen afviste adgang (' + err.code + '). Tjek Firebase-reglerne — se SETUP.md.';
    });
  }
  function skillName(id) { var s = st.content.skills[id]; return s ? s.name : id; }

  // ═══════════ GODKENDELSER ═══════════
  function pendingList() {
    var rows = [];
    Object.keys(st.completions).forEach(function (kidId) {
      Object.keys(st.completions[kidId]).forEach(function (pk) {
        Object.keys(st.completions[kidId][pk]).forEach(function (qk) {
          var c = st.completions[kidId][pk][qk];
          if (c.status === 'pending') rows.push({ kidId: kidId, pk: pk, qk: qk, c: c });
        });
      });
    });
    rows.sort(function (a, b) { return a.c.ts - b.c.ts; });
    return rows;
  }

  function rewardSummary(rewards) {
    var bits = [];
    (rewards || []).forEach(function (r) {
      if (r.skill) bits.push('+' + (r.xp || 0) + ' XP ' + skillName(r.skill));
      if (r.gold) bits.push('+' + r.gold + ' 🪙');
      if (r.eventCoin || r.coin) bits.push('+' + (r.eventCoin || r.coin) + ' 💠');
    });
    return bits.join(' · ');
  }

  function renderPending() {
    var rows = pendingList();
    var box = $('#pending-completions');
    if (!rows.length) box.innerHTML = '<div class="empty">Ingenting venter 🎉</div>';
    else box.innerHTML = rows.map(function (r) {
      var kid = st.kids[r.kidId] || {};
      return '<div class="admin-row">' +
        '<span style="font-size:1.5rem">' + esc(kid.avatar || '🧒') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(r.c.taskTitle) + '</div>' +
        '<div class="a-sub">' + esc(kid.name || '?') + ' · ' + rewardSummary(r.c.rewards) + ' · ' + HQ.fmtTs(r.c.ts) + '</div></div>' +
        '<div class="approve-actions">' +
        '<button class="btn green small" data-approve="' + r.kidId + '|' + r.pk + '|' + r.qk + '">Godkend</button>' +
        '<button class="btn red small" data-reject="' + r.kidId + '|' + r.pk + '|' + r.qk + '">Afvis</button>' +
        '</div></div>';
    }).join('');
    updateBadge(rows.length + pendingPurchases().length + pendingJobs().length);
  }

  function updateBadge(n) {
    var btn = document.querySelector('.tab-btn[data-page="approve"]');
    var badge = btn.querySelector('.tab-badge');
    if (n > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'tab-badge'; btn.appendChild(badge); }
      badge.textContent = n;
    } else if (badge) badge.remove();
  }

  document.addEventListener('click', function (e) {
    var ap = e.target.closest('[data-approve]');
    var rj = e.target.closest('[data-reject]');
    if (!ap && !rj) return;
    var parts = (ap || rj).getAttribute(ap ? 'data-approve' : 'data-reject').split('|');
    var kidId = parts[0], pk = parts[1], qk = parts[2];
    var c = ((st.completions[kidId] || {})[pk] || {})[qk];
    if (!c || c.status !== 'pending') return;
    var cRef = HQ.ref('completions/' + kidId + '/' + pk + '/' + qk);

    if (rj) {
      var note = prompt('Besked til ' + ((st.kids[kidId] || {}).name || 'barnet') + ':', 'Prøv lige igen 🙂');
      if (note === null) return;
      cRef.update({ status: 'rejected', note: note });
      HQ.audit('quest-afvist', ((st.kids[kidId] || {}).name || kidId) + ': ' + c.taskTitle);
      return;
    }
    // Godkend → posteringer i kontobogen (ledger er sandheden)
    var now = Date.now();
    var lRef = HQ.ref('ledger/' + kidId);
    var base = {
      ts: now, earnedTs: c.ts, questKey: c.questKey || qk, module: c.module || '',
      name: c.taskTitle || '', icon: c.icon || '⭐', source: 'quest', by: 'admin', unseen: true
    };
    (c.rewards || []).forEach(function (r) {
      if (r.skill) lRef.push(Object.assign({}, base, { type: 'xp', amount: r.xp || 0, skill: r.skill }));
      if (r.gold) lRef.push(Object.assign({}, base, { type: 'gold', amount: r.gold }));
      if (r.eventCoin || r.coin) lRef.push(Object.assign({}, base, { type: 'coin', amount: r.eventCoin || r.coin }));
    });
    rollBonusDrop(kidId, lRef, now);
    cRef.update({ status: 'approved', approvedTs: now });
    HQ.audit('quest-godkendt', ((st.kids[kidId] || {}).name || kidId) + ': ' + c.taskTitle + ' (' + rewardSummary(c.rewards) + ')');
    HQ.toast('✅ Godkendt — ' + rewardSummary(c.rewards));
  });

  // Variabel belønning (jf. INSPIRATION.md §3): 25 % chance for et sjældent fund
  // ved godkendelse — men max ét pr. dag, og det kan ALDRIG købes.
  function rollBonusDrop(kidId, lRef, now) {
    if (Math.random() >= 0.25) return;
    var ledger = st.ledgers[kidId] || {};
    var today = HQ.dateKey();
    var owned = {}, droppedToday = false;
    Object.keys(ledger).forEach(function (id) {
      var e = ledger[id];
      if (!e) return;
      if (e.type === 'sticker') owned[e.item] = true;
      if (e.source === 'drop' && HQ.dateKey(new Date(e.ts)) === today) droppedToday = true;
    });
    if (droppedToday) return;
    var missing = HQ.STICKERS.filter(function (s) { return !owned[s.id]; });
    if (missing.length) {
      var pick = missing[Math.floor(Math.random() * missing.length)];
      lRef.push({ ts: now, type: 'sticker', item: pick.id, name: pick.name, icon: pick.icon, source: 'drop', by: 'auto', unseen: true });
    } else {
      lRef.push({ ts: now, type: 'gold', amount: 15, name: 'Sjældent fund: en pose guld!', icon: '💰', source: 'drop', by: 'auto', unseen: true });
    }
  }

  // ═══════════ KØB ═══════════
  function pendingPurchases() {
    return Object.keys(st.purchases).filter(function (id) { return st.purchases[id].status === 'pending'; });
  }
  function renderPurchases() {
    var box = $('#pending-purchases');
    var ids = pendingPurchases().sort(function (a, b) { return st.purchases[a].ts - st.purchases[b].ts; });
    if (!ids.length) { box.innerHTML = '<div class="empty">Ingen ventende køb</div>'; }
    else box.innerHTML = ids.map(function (id) {
      var p = st.purchases[id];
      var kid = st.kids[p.kidId] || {};
      return '<div class="admin-row">' +
        '<span style="font-size:1.5rem">' + esc(p.icon || '🎁') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(p.title) + '</div>' +
        '<div class="a-sub">' + esc(kid.name || '?') + ' · 🪙 ' + p.cost + ' · ' + HQ.fmtTs(p.ts) + '</div></div>' +
        '<div class="approve-actions">' +
        '<button class="btn green small" data-deliver="' + id + '">Leveret</button>' +
        '<button class="btn red small" data-refund="' + id + '">Annullér</button>' +
        '</div></div>';
    }).join('');
    updateBadge(pendingList().length + ids.length + pendingJobs().length);
  }

  document.addEventListener('click', function (e) {
    var dl = e.target.closest('[data-deliver]');
    var rf = e.target.closest('[data-refund]');
    if (!dl && !rf) return;
    var id = (dl || rf).getAttribute(dl ? 'data-deliver' : 'data-refund');
    var p = st.purchases[id];
    if (!p || p.status !== 'pending') return;
    if (dl) {
      HQ.ref('purchases/' + id).update({ status: 'delivered', deliveredTs: Date.now() });
      HQ.audit('koeb-leveret', p.title + ' (🪙 ' + p.cost + ')');
      HQ.toast('🎁 Markeret som leveret');
    } else {
      if (!confirm('Annullér købet og giv ' + p.cost + ' guld tilbage?')) return;
      HQ.ref('purchases/' + id).update({ status: 'cancelled', cancelledTs: Date.now() });
      HQ.ref('ledger/' + p.kidId).push({
        ts: Date.now(), type: 'gold', amount: p.cost, name: 'Guld retur: ' + (p.title || ''),
        icon: '↩️', source: 'undo', by: 'admin', unseen: true
      });
      HQ.audit('koeb-annulleret', p.title + ' (🪙 ' + p.cost + ' retur)');
    }
  });

  // ═══════════ OPSLAGSTAVLEN (fase D: jobs fra familien, fx farfar) ═══════════
  // jobs/{id}: title, desc, icon, poster (fritekst — admin opretter på andres vegne),
  // reward {gold?, realNote?}, status open→taken→submitted→done, takenBy, ts.
  // Rigtige penge afregnes UDENFOR appen — realNote er kun en påmindelse.
  function pendingJobs() {
    return Object.keys(st.jobs).filter(function (id) { return st.jobs[id].status === 'submitted'; });
  }
  function jobRewardText(j) {
    var r = j.reward || {};
    var bits = [];
    if (r.gold) bits.push('🪙 ' + r.gold);
    if (r.realNote) bits.push('💵 ' + r.realNote);
    return bits.join(' + ') || '—';
  }
  var JOB_STATUS = {
    open: '🟢 Åbent', taken: '💪 Taget', submitted: '⏳ Meldt færdig', done: '✅ Udført', failed: '❌ Ikke udført'
  };

  function renderPendingJobs() {
    var box = $('#pending-jobs');
    var ids = pendingJobs().sort(function (a, b) { return (st.jobs[a].submittedTs || 0) - (st.jobs[b].submittedTs || 0); });
    if (!ids.length) { box.innerHTML = '<div class="empty">Ingen jobs venter</div>'; }
    else box.innerHTML = ids.map(function (id) {
      var j = st.jobs[id];
      var kid = st.kids[j.takenBy] || {};
      return '<div class="admin-row">' +
        '<span style="font-size:1.5rem">' + esc(j.icon || '📌') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(j.title) + '</div>' +
        '<div class="a-sub">' + esc(kid.name || '?') + ' · ' + esc(j.poster || 'Familien') + ' · ' + esc(jobRewardText(j)) + ' · ' + HQ.fmtTs(j.submittedTs) + '</div></div>' +
        '<div class="approve-actions">' +
        '<button class="btn green small" data-job-approve="' + id + '">Godkend</button>' +
        '<button class="btn red small" data-job-reject="' + id + '">Afvis</button>' +
        '</div></div>';
    }).join('');
    updateBadge(pendingList().length + pendingPurchases().length + ids.length);
  }

  function renderJobList() {
    var box = $('#job-list');
    if (!box) return;
    var ids = Object.keys(st.jobs).sort(function (a, b) { return (st.jobs[b].ts || 0) - (st.jobs[a].ts || 0); });
    if (!ids.length) { box.innerHTML = '<div class="empty">Ingen opslag endnu — opret det første (fx fra farfar)</div>'; return; }
    box.innerHTML = ids.map(function (id) {
      var j = st.jobs[id];
      var kidName = j.takenBy ? ((st.kids[j.takenBy] || {}).name || '?') : '';
      var statusTxt = (JOB_STATUS[j.status] || j.status) + (kidName ? ' af ' + kidName : '');
      var btns = '';
      if (j.status === 'open') btns += '<button class="icon-btn" data-edit-job="' + id + '" title="Redigér">✏️</button>';
      if (j.status !== 'open') btns += '<button class="btn small ghost" data-reopen-job="' + id + '" title="Sæt opslaget åbent igen" style="padding:5px 10px;font-size:0.72rem">↩️ Genåbn</button>';
      btns += '<button class="icon-btn" data-del-job="' + id + '" title="Slet opslag">🗑️</button>';
      return '<div class="admin-row' + (j.status === 'done' || j.status === 'failed' ? ' inactive' : '') + '">' +
        '<span style="font-size:1.4rem">' + esc(j.icon || '📌') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(j.title) + '</div>' +
        '<div class="a-sub">' + esc(j.poster || 'Familien') + ' · ' + esc(jobRewardText(j)) + ' · ' + statusTxt + '</div></div>' +
        btns + '</div>';
    }).join('');
  }

  function jobModal(id) {
    var j = id ? st.jobs[id] : { icon: '📌', reward: {} };
    if (!j) return;
    var r = j.reward || {};
    openModal(
      '<h2>' + (id ? 'Redigér opslag' : '＋ Nyt opslag') + '</h2>' +
      '<p style="color:var(--muted);font-size:0.82rem">Et job fra familien — du opretter det på vegne af fx farfar. Først til at tage jobbet får det. Rigtige penge afregnes udenfor appen.</p>' +
      '<label>Titel</label><input id="m-jtitle" value="' + esc(j.title || '') + '" placeholder="F.eks. Riv blade sammen i haven">' +
      '<label>Beskrivelse (valgfri)</label><input id="m-jdesc" value="' + esc(j.desc || '') + '">' +
      '<div class="row2"><div><label>Ikon</label>' + HQ.iconField('m-jicon', j.icon || '📌') + '</div>' +
      '<div><label>Opslået af</label><input id="m-jposter" value="' + esc(j.poster || '') + '" placeholder="F.eks. Farfar"></div></div>' +
      '<div class="row2"><div><label>Løn i guld 🪙 (0 = ingen)</label><input id="m-jgold" type="number" value="' + (r.gold || 0) + '"></div>' +
      '<div><label>Rigtig løn (valgfri)</label><input id="m-jreal" value="' + esc(r.realNote || '') + '" placeholder="F.eks. 50 kr."></div></div>',
      function (bg) {
        var title = $('#m-jtitle', bg).value.trim();
        if (!title) { HQ.toast('Titel mangler'); return false; }
        var gold = parseInt($('#m-jgold', bg).value, 10) || 0;
        var real = $('#m-jreal', bg).value.trim();
        if (!gold && !real) { HQ.toast('Angiv en løn — guld, rigtige penge eller begge'); return false; }
        var reward = {};
        if (gold) reward.gold = gold;
        if (real) reward.realNote = real;
        var data = {
          title: title, desc: $('#m-jdesc', bg).value.trim(),
          icon: $('#m-jicon', bg).value.trim() || '📌',
          poster: $('#m-jposter', bg).value.trim() || 'Familien',
          reward: reward
        };
        if (id) {
          HQ.ref('jobs/' + id).update(data);
          HQ.audit('job-redigeret', title);
        } else {
          HQ.ref('jobs').push(Object.assign({ status: 'open', ts: Date.now() }, data));
          HQ.audit('job-oprettet', title + ' (' + data.poster + ' · ' + jobRewardText({ reward: reward }) + ')');
          HQ.toast('📌 Opslaget hænger nu på tavlen');
        }
      }
    );
  }

  $('#add-job').addEventListener('click', function () { jobModal(null); });
  document.addEventListener('click', function (e) {
    var ej = e.target.closest('[data-edit-job]');
    if (ej) return jobModal(ej.getAttribute('data-edit-job'));
    var dj = e.target.closest('[data-del-job]');
    if (dj) {
      var idD = dj.getAttribute('data-del-job');
      var jD = st.jobs[idD];
      if (jD && confirm('Slet opslaget "' + jD.title + '"?')) {
        HQ.ref('jobs/' + idD).remove();
        HQ.audit('job-slettet', jD.title);
      }
      return;
    }
    var ro = e.target.closest('[data-reopen-job]');
    if (ro) {
      var idR = ro.getAttribute('data-reopen-job');
      var jR = st.jobs[idR];
      if (!jR) return;
      if (!confirm('Sæt "' + jR.title + '" åbent på tavlen igen?')) return;
      HQ.ref('jobs/' + idR).update({ status: 'open', takenBy: null, takenTs: null, submittedTs: null, doneTs: null, note: null });
      HQ.audit('job-genaabnet', jR.title);
      HQ.toast('↩️ Opslaget er åbent igen');
      return;
    }
    var ja = e.target.closest('[data-job-approve]');
    if (ja) {
      var idA = ja.getAttribute('data-job-approve');
      var jA = st.jobs[idA];
      if (!jA || jA.status !== 'submitted') return;
      var kidA = st.kids[jA.takenBy] || {};
      var rA = jA.reward || {};
      // Belønning via kisten som alt andet: guld-postering; kun-rigtige-penge → 'job'-postering
      var entry = {
        ts: Date.now(), name: 'Job: ' + (jA.title || ''), icon: jA.icon || '📌',
        source: 'job', jobId: idA, by: 'admin', unseen: true
      };
      if (rA.realNote) entry.realNote = rA.realNote;
      if (rA.gold) { entry.type = 'gold'; entry.amount = rA.gold; }
      else entry.type = 'job';
      HQ.ref('ledger/' + jA.takenBy).push(entry);
      HQ.ref('jobs/' + idA).update({ status: 'done', doneTs: Date.now() });
      HQ.audit('job-godkendt', (kidA.name || '?') + ': ' + jA.title + ' (' + jobRewardText(jA) + ')');
      HQ.toast(rA.realNote ? '✅ Godkendt — husk den rigtige løn: ' + rA.realNote : '✅ Godkendt — ' + jobRewardText(jA));
      return;
    }
    var jr = e.target.closest('[data-job-reject]');
    if (jr) {
      var idJ = jr.getAttribute('data-job-reject');
      var jJ = st.jobs[idJ];
      if (!jJ || jJ.status !== 'submitted') return;
      var kidJ = st.kids[jJ.takenBy] || {};
      var noteJ = prompt('Besked til ' + (kidJ.name || 'helten') + ':', 'Prøv lige igen 🙂');
      if (noteJ === null) return;
      HQ.ref('jobs/' + idJ).update({ status: 'taken', note: noteJ, submittedTs: null });
      HQ.audit('job-afvist', (kidJ.name || '?') + ': ' + jJ.title);
    }
  });

  // ═══════════ MODAL-HJÆLPER ═══════════
  function openModal(html, onSave) {
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal">' + html +
      '<div class="modal-actions"><button class="btn ghost small" data-close>Annullér</button>' +
      '<button class="btn small" data-save>Gem</button></div></div>';
    document.body.appendChild(bg);
    bg.addEventListener('click', function (e) {
      if (e.target === bg || e.target.closest('[data-close]')) { bg.remove(); return; }
      var dp = e.target.closest('.day-pick');
      if (dp) dp.classList.toggle('on');
      if (e.target.closest('[data-save]')) {
        if (onSave(bg) !== false) bg.remove();
      }
    });
    return bg;
  }
  function skillOptions(selected) {
    return st.content.skillOrder.map(function (id) {
      var s = st.content.skills[id];
      var label = (s.parent ? '— ' : '') + s.icon + ' ' + s.name;
      return '<option value="' + esc(id) + '"' + (selected === id ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }

  // ═══════════ KLASSETRIN (fase C) ═══════════
  // OBS: 0. klasse er et gyldigt trin — test altid med != null, aldrig truthy.
  function gradeOptions(selected) {
    var html = '<option value=""' + (selected == null ? ' selected' : '') + '>Intet klassetrin</option>';
    for (var g = 0; g <= 9; g++) {
      html += '<option value="' + g + '"' + (selected === g ? ' selected' : '') + '>' + g + '. klasse</option>';
    }
    return html;
  }
  function gradesText(grades) {
    if (!grades || !grades.length) return '';
    return grades[0] + '.–' + (grades[1] != null ? grades[1] : 9) + '. kl.';
  }
  // Installations-kopi af et bundlet modul: quests med grades-felt slås til/fra
  // efter barnets klassetrin. Uden klassetrin røres quest-defaults ikke.
  function installModuleData(m, grade) {
    var copy = JSON.parse(JSON.stringify(m));
    if (grade != null) {
      (copy.quests || []).forEach(function (q) {
        if (q.grades) q.active = HQ.gradeFits(q.grades, grade);
      });
    }
    return Object.assign(copy, { installedAt: Date.now(), enabled: true });
  }

  // ═══════════ MODULER ═══════════
  // Tildeling: assignedTo mangler/'all' = alle helte; ellers {heroId: true}
  function isAssignedTo(m, kidId) {
    return !m.assignedTo || m.assignedTo === 'all' || !!m.assignedTo[kidId];
  }
  function assignedNames(m) {
    if (!m.assignedTo || m.assignedTo === 'all') return 'Alle helte';
    var names = Object.keys(m.assignedTo).filter(function (k) { return m.assignedTo[k] && st.kids[k]; })
      .map(function (id) { return st.kids[id].name; });
    return names.length ? names.join(', ') : '⚠️ Ingen (skjult for alle)';
  }
  function activeKidIds() {
    return Object.keys(st.kids).filter(function (id) { return !st.kids[id].archived; });
  }

  function renderModules() {
    var box = $('#module-list');
    var ids = Object.keys(st.modules).sort();
    if (!ids.length) { box.innerHTML = '<div class="card empty">Ingen moduler installeret — importér et, eller nulstil databasen for at få setup-guiden</div>'; return; }
    box.innerHTML = ids.map(function (mid) {
      var m = st.modules[mid];
      var ws = HQ.windowState(m);
      var winTxt = m.window && m.window.from ? ' · 📅 ' + m.window.from + (m.window.to ? ' → ' + m.window.to : '') +
        (ws === 'before' ? ' (kommer)' : ws === 'after' ? ' (udløbet)' : '') : '';
      var catTxt = m.category ? (HQ.CATEGORY_NAMES[m.category] || m.category) + (m.grades ? ' ' + gradesText(m.grades) : '') + ' · ' : '';
      var counts = catTxt + (m.skills || []).length + ' skills · ' + (m.quests || []).length + ' quests · ' +
        (m.badges || []).length + ' badges · ' + (m.streaks || []).length + ' streaks · 👥 ' + esc(assignedNames(m));
      var open = st.openModule === mid;
      return '<div class="card' + (m.enabled === false ? ' inactive' : '') + '">' +
        '<div class="mod-head" data-toggle-mod="' + mid + '">' +
          '<span style="font-size:1.6rem">' + (open ? '📂' : '📦') + '</span>' +
          '<div style="flex:1"><div class="m-name">' + esc(m.name || mid) + ' <span style="color:var(--muted);font-weight:400;font-size:0.75rem">v' + (m.version || 1) + '</span></div>' +
          '<div class="m-sub">' + counts + winTxt + '</div></div>' +
          '<button class="icon-btn" data-export-mod="' + mid + '" title="Eksportér JSON">📤</button>' +
          '<button class="icon-btn" data-enable-mod="' + mid + '" title="Slå til/fra">' + (m.enabled === false ? '▶️' : '⏸️') + '</button>' +
          '<button class="icon-btn" data-del-mod="' + mid + '" title="Afinstallér">🗑️</button>' +
        '</div>' +
        (open ? moduleBody(mid, m) : '') +
      '</div>';
    }).join('');
  }

  function moduleBody(mid, m) {
    var quests = (m.quests || []).map(function (q, i) {
      var days = (q.type === 'daily' && q.days && q.days.length < 7)
        ? ' · ' + q.days.map(function (d) { return HQ.DAY_SHORT[d]; }).join(',') : '';
      return '<div class="admin-row' + (q.active === false ? ' inactive' : '') + '">' +
        '<span style="font-size:1.3rem">' + esc(q.icon || '⭐') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(q.title) + '</div>' +
        '<div class="a-sub">' + (TYPE_NAMES[q.type] || q.type) + days + ' · ' + rewardSummary(q.rewards) + '</div></div>' +
        '<button class="icon-btn" data-edit-quest="' + mid + '|' + i + '">✏️</button>' +
        '<button class="icon-btn" data-del-quest="' + mid + '|' + i + '">🗑️</button>' +
        '</div>';
    }).join('');
    var skills = (m.skills || []).map(function (s, i) {
      return '<div class="admin-row">' +
        '<span style="font-size:1.3rem">' + esc(s.icon || '⭐') + '</span>' +
        '<div class="a-main"><div class="a-title">' + (s.parent ? '↳ ' : '') + esc(s.name) + '</div>' +
        '<div class="a-sub">' + esc(s.id) + '</div></div>' +
        '<button class="icon-btn" data-edit-skill="' + mid + '|' + i + '">✏️</button>' +
        '</div>';
    }).join('');
    var streaks = (m.streaks || []).map(function (s, i) {
      return '<div class="admin-row">' +
        '<span style="font-size:1.3rem">' + esc(s.icon || '🔥') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(s.name) + '</div>' +
        '<div class="a-sub">' + (PERIOD_OPTS[s.period] || s.period) + ' · mål: ' + (s.target || 1) + ' quests · milepæle: ' + (s.milestones || []).join(', ') + '</div></div>' +
        '<button class="icon-btn" data-edit-streak="' + mid + '|' + i + '">✏️</button>' +
        '</div>';
    }).join('');
    var badges = (m.badges || []).map(function (b) {
      var r = b.rule || {};
      var ruleTxt = r.type === 'counter' ? r.count + ' quests' : r.type === 'milestone' ? skillName(r.skill) + ' level ' + r.level : r.type;
      return '<span class="chip" title="' + esc(ruleTxt) + '">' + esc(b.icon) + ' ' + esc(b.name) + (b.secret ? ' 🤫' : '') + '</span>';
    }).join(' ');
    var allAssigned = !m.assignedTo || m.assignedTo === 'all';
    var assignHtml = '<label style="display:flex;align-items:center;gap:8px;margin:4px 0;font-size:0.88rem">' +
      '<input type="checkbox" class="assign-all" data-mid="' + mid + '" style="width:auto"' + (allAssigned ? ' checked' : '') + '> <b>Alle helte</b></label>' +
      activeKidIds().map(function (kidId) {
        var checked = isAssignedTo(m, kidId);
        return '<label style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 22px;font-size:0.88rem;opacity:' + (allAssigned ? '0.5' : '1') + '">' +
          '<input type="checkbox" class="assign-kid" data-mid="' + mid + '" data-kid="' + kidId + '" style="width:auto"' +
          (checked ? ' checked' : '') + (allAssigned ? ' disabled' : '') + '> ' +
          esc(st.kids[kidId].avatar || '🧒') + ' ' + esc(st.kids[kidId].name) + '</label>';
      }).join('');
    return '<div class="mod-body">' +
      '<div class="mod-section-label">Tildelt til</div>' + assignHtml +
      '<div class="mod-section-label">Quests</div>' + (quests || '<div class="empty">Ingen quests</div>') +
      '<button class="btn small ghost" data-add-quest="' + mid + '" style="margin-top:8px">＋ Ny quest</button>' +
      '<div class="mod-section-label">Færdigheder</div>' + (skills || '<div class="empty">Ingen</div>') +
      '<button class="btn small ghost" data-add-skill="' + mid + '" style="margin-top:8px">＋ Ny færdighed</button>' +
      '<div class="mod-section-label">Streaks</div>' + (streaks || '<div class="empty">Ingen</div>') +
      '<div class="mod-section-label">Badges</div><div class="q-chips">' + (badges || '<span class="empty">Ingen</span>') + '</div>' +
    '</div>';
  }

  // Tildelings-checkbokse (delegeret change-handler)
  document.addEventListener('change', function (e) {
    var all = e.target.closest('.assign-all');
    if (all) {
      var mid = all.getAttribute('data-mid');
      if (all.checked) {
        HQ.ref('modules/' + mid + '/assignedTo').set('all');
      } else {
        // Konvertér til eksplicit liste med alle aktive helte (så kan der fravælges)
        var obj = {};
        activeKidIds().forEach(function (id) { obj[id] = true; });
        HQ.ref('modules/' + mid + '/assignedTo').set(obj);
      }
      HQ.audit('modul-tildeling', mid + ' → ' + (all.checked ? 'alle' : 'pr. helt'));
      return;
    }
    var ak = e.target.closest('.assign-kid');
    if (ak && !ak.disabled) {
      var mid2 = ak.getAttribute('data-mid'), kidId = ak.getAttribute('data-kid');
      HQ.ref('modules/' + mid2 + '/assignedTo/' + kidId).set(ak.checked ? true : null);
      HQ.audit('modul-tildeling', mid2 + (ak.checked ? ' +' : ' −') + (st.kids[kidId] || {}).name);
    }
  });

  document.addEventListener('click', function (e) {
    var tg = e.target.closest('[data-toggle-mod]');
    if (tg && !e.target.closest('.icon-btn') && !e.target.closest('label') && !e.target.closest('input')) {
      var mid = tg.getAttribute('data-toggle-mod');
      st.openModule = st.openModule === mid ? null : mid;
      renderModules();
      return;
    }
    var ex = e.target.closest('[data-export-mod]');
    if (ex) return exportModule(ex.getAttribute('data-export-mod'));
    var en = e.target.closest('[data-enable-mod]');
    if (en) {
      var mid2 = en.getAttribute('data-enable-mod');
      HQ.ref('modules/' + mid2 + '/enabled').set(st.modules[mid2].enabled === false);
      return;
    }
    var del = e.target.closest('[data-del-mod]');
    if (del) {
      var mid3 = del.getAttribute('data-del-mod');
      if (confirm('Afinstallér "' + (st.modules[mid3] || {}).name + '"?\n\nBørnenes XP, badges og fremgang BEVARES (kontobogen husker alt) — kun quests og skills-visning forsvinder.')) {
        HQ.audit('modul-fjernet', (st.modules[mid3] || {}).name || mid3);
        HQ.ref('modules/' + mid3).remove();
      }
    }
  });

  function exportModule(mid) {
    var m = Object.assign({}, st.modules[mid]);
    delete m.installedAt; delete m.enabled;
    var blob = new Blob([JSON.stringify(m, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hverdagshelte-modul-' + mid + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    HQ.toast('📤 ' + (m.name || mid) + ' eksporteret');
  }

  // ---- Nyt modul fra bunden (fx "Almas eget modul") ----
  function slugify(s) {
    return String(s).toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'modul';
  }
  $('#new-module').addEventListener('click', function () {
    openModal(
      '<h2>＋ Nyt modul</h2>' +
      '<p style="color:var(--muted);font-size:0.82rem">Et tomt modul du selv fylder med færdigheder og quests — fx et personligt modul til ét barn (tildel det bagefter under "Tildelt til").</p>' +
      '<label>Navn</label><input id="m-nname" placeholder="F.eks. Almas eventyr">' +
      '<div class="row2"><div><label>Ikon</label>' + HQ.iconField('m-nicon', '✨') + '</div><div></div></div>' +
      '<label>Beskrivelse (valgfri)</label><input id="m-ndesc">',
      function (bg) {
        var name = $('#m-nname', bg).value.trim();
        if (!name) { HQ.toast('Navn mangler'); return false; }
        var icon = $('#m-nicon', bg).value.trim();
        var id = slugify(name);
        while (st.modules[id]) id += '2';
        var meta = (HQ.getOrg() && $('#org-title').textContent) || '';
        st.openModule = id;   // FØR set(): Firebase affyrer lyttere synkront ved lokal skrivning
        HQ.ref('modules/' + id).set({
          format: 'hverdagshelte-module@1',
          id: id,
          name: name + (icon ? ' ' + icon : ''),
          version: 1,
          author: meta,
          description: $('#m-ndesc', bg).value.trim(),
          skills: [], quests: [], badges: [], streaks: [],
          installedAt: Date.now(), enabled: true
        });
        HQ.audit('modul-oprettet', name);
        HQ.toast('📦 ' + name + ' oprettet — tilføj færdigheder og quests');
      }
    );
  });

  $('#import-module').addEventListener('click', function () { $('#import-file').click(); });
  $('#import-file').addEventListener('change', function () {
    var f = this.files[0];
    this.value = '';
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var m;
      try { m = JSON.parse(reader.result); } catch (e) { return HQ.toast('❌ Ikke gyldig JSON'); }
      var okFormats = ['hverdagshelte-module@1', 'heltequest-module@1']; // gammelt format-id accepteres stadig
      if (!m || okFormats.indexOf(m.format) < 0) return HQ.toast('❌ Ikke et HverdagsHelte-modul (format-feltet mangler)');
      if (!m.id || !/^[a-z0-9-]+$/.test(m.id)) return HQ.toast('❌ Modulet mangler et gyldigt id (små bogstaver/tal/bindestreg)');
      var exists = !!st.modules[m.id];
      if (exists && !confirm('"' + m.name + '" er allerede installeret. Overskriv med den nye version? (Fremgang bevares)')) return;
      HQ.ref('modules/' + m.id).set(Object.assign({}, m, { installedAt: Date.now(), enabled: true }));
      HQ.audit('modul-installeret', m.name || m.id);
      HQ.toast('📥 ' + (m.name || m.id) + ' installeret');
    };
    reader.readAsText(f);
  });

  // ---- Quest-editor (redigerer modulets DB-kopi; eksportér for at dele) ----
  function questModal(mid, idx) {
    var m = st.modules[mid];
    var isNew = idx == null;
    var q = isNew ? { type: 'daily', active: true, days: [1, 2, 3, 4, 5, 6, 0], rewards: [] } : (m.quests || [])[idx];
    var skillRewards = (q.rewards || []).filter(function (r) { return r.skill; });
    var r0 = skillRewards[0] || {};
    var r1 = skillRewards[1] || {};
    var rGold = ((q.rewards || []).filter(function (r) { return r.gold; })[0] || {}).gold || 0;
    var rCoin = ((q.rewards || []).filter(function (r) { return r.eventCoin || r.coin; })[0] || {});
    rCoin = rCoin.eventCoin || rCoin.coin || 0;
    var days = q.days || [1, 2, 3, 4, 5, 6, 0];
    openModal(
      '<h2>' + (isNew ? 'Ny quest' : 'Redigér quest') + '</h2>' +
      '<label>Titel</label><input id="m-title" value="' + esc(q.title || '') + '">' +
      '<label>Beskrivelse (valgfri)</label><input id="m-desc" value="' + esc(q.desc || '') + '">' +
      '<div class="row2"><div><label>Ikon</label>' + HQ.iconField('m-icon', q.icon) + '</div>' +
      '<div><label>Type</label><select id="m-type">' +
        '<option value="daily"' + (q.type === 'daily' ? ' selected' : '') + '>Daglig</option>' +
        '<option value="weekly"' + (q.type === 'weekly' ? ' selected' : '') + '>Ugentlig</option>' +
        '<option value="once"' + (q.type === 'once' ? ' selected' : '') + '>Særlig (engangs)</option></select></div></div>' +
      '<label>Færdighed (XP gives her)</label><select id="m-skill">' + skillOptions(r0.skill) + '</select>' +
      '<div class="row2"><div><label>XP</label><input id="m-xp" type="number" value="' + (r0.xp || 20) + '"></div>' +
      '<div><label>Guld 🪙</label><input id="m-gold" type="number" value="' + rGold + '"></div></div>' +
      '<label>Færdighed 2 (valgfri — fx løb der giver både udholdenhed og viljestyrke)</label>' +
      '<select id="m-skill2"><option value="">— ingen —</option>' + skillOptions(r1.skill) + '</select>' +
      '<div class="row2"><div><label>XP til færdighed 2</label><input id="m-xp2" type="number" value="' + (r1.xp || 0) + '"></div><div></div></div>' +
      '<div class="row2"><div><label>Event-mønter 💠</label><input id="m-coin" type="number" value="' + rCoin + '"></div>' +
      '<div><label>&nbsp;</label><label style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="m-active" style="width:auto"' + (q.active !== false ? ' checked' : '') + '> Aktiv</label></div></div>' +
      '<label>Dage (kun daglige quests)</label>' +
      '<div class="day-picker">' + [1, 2, 3, 4, 5, 6, 0].map(function (d) {
        return '<button type="button" class="day-pick' + (days.indexOf(d) >= 0 ? ' on' : '') + '" data-day="' + d + '">' + HQ.DAY_SHORT[d] + '</button>';
      }).join('') + '</div>',
      function (bg) {
        var title = $('#m-title', bg).value.trim();
        if (!title) { HQ.toast('Titel mangler'); return false; }
        var rewards = [];
        var xp = parseInt($('#m-xp', bg).value, 10) || 0;
        if (xp) rewards.push({ skill: $('#m-skill', bg).value, xp: xp });
        var skill2 = $('#m-skill2', bg).value;
        var xp2 = parseInt($('#m-xp2', bg).value, 10) || 0;
        if (skill2 && xp2) rewards.push({ skill: skill2, xp: xp2 });
        var gold = parseInt($('#m-gold', bg).value, 10) || 0;
        if (gold) rewards.push({ gold: gold });
        var coin = parseInt($('#m-coin', bg).value, 10) || 0;
        if (coin) rewards.push({ eventCoin: coin });
        var selDays = HQ.$all('.day-pick.on', bg).map(function (b) { return parseInt(b.getAttribute('data-day'), 10); });
        var data = {
          id: q.id || ('q' + Date.now().toString(36)),
          title: title, desc: $('#m-desc', bg).value.trim(), icon: $('#m-icon', bg).value.trim(),
          type: $('#m-type', bg).value, active: $('#m-active', bg).checked,
          days: selDays.length ? selDays : [1, 2, 3, 4, 5, 6, 0],
          rewards: rewards
        };
        var arr = (m.quests || []).slice();
        if (isNew) arr.push(data); else arr[idx] = data;
        HQ.ref('modules/' + mid + '/quests').set(arr);
      }
    );
  }

  function skillModal(mid, idx) {
    var m = st.modules[mid];
    var isNew = idx == null;
    var s = isNew ? { icon: '⭐', color: '#9c6bff' } : (m.skills || [])[idx];
    var parentOpts = '<option value="">— Ny hovedskill —</option>' +
      HQ.mainSkills(st.content).map(function (id) {
        var sk = st.content.skills[id];
        return '<option value="' + esc(id) + '">Under: ' + esc(sk.icon + ' ' + sk.name) + '</option>';
      }).join('');
    openModal(
      '<h2>' + (isNew ? '＋ Ny færdighed' : 'Redigér færdighed') + '</h2>' +
      (isNew ? '' : '<p style="color:var(--muted);font-size:0.8rem">Id\'et (' + esc(s.id) + ') kan ikke ændres — XP er bogført på det.</p>') +
      '<label>Navn</label><input id="m-sname" value="' + esc(s.name || '') + '" placeholder="F.eks. Fodbold">' +
      (isNew ? '<label>Placering</label><select id="m-sparent">' + parentOpts + '</select>' : '') +
      '<div class="row2"><div><label>Ikon</label>' + HQ.iconField('m-sicon', s.icon) + '</div>' +
      '<div><label>Farve</label><input id="m-scolor" type="color" value="' + esc(s.color || '#9c6bff') + '" style="height:44px;padding:4px"></div></div>',
      function (bg) {
        var name = $('#m-sname', bg).value.trim();
        if (!name) { HQ.toast('Navn mangler'); return false; }
        var arr = (m.skills || []).slice();
        if (isNew) {
          var parent = $('#m-sparent', bg).value;
          var slug = slugify(name).replace(/-/g, '');
          var id = parent ? parent + '.' + slug : slug;
          while (st.content.skills[id]) id += '2';
          var data = { id: id, name: name, icon: $('#m-sicon', bg).value.trim() || '⭐', color: $('#m-scolor', bg).value };
          if (parent) data.parent = parent;
          arr.push(data);
          HQ.audit('skill-oprettet', name + ' (' + id + ')');
        } else {
          arr[idx] = Object.assign({}, s, { name: name, icon: $('#m-sicon', bg).value.trim() || '⭐', color: $('#m-scolor', bg).value });
        }
        HQ.ref('modules/' + mid + '/skills').set(arr);
      }
    );
  }

  function streakModal(mid, idx) {
    var m = st.modules[mid];
    var s = (m.streaks || [])[idx];
    openModal(
      '<h2>Justér streak: ' + esc(s.name) + '</h2>' +
      '<div class="row2"><div><label>Periode</label><select id="m-period">' +
        Object.keys(PERIOD_OPTS).map(function (p) {
          return '<option value="' + p + '"' + (s.period === p ? ' selected' : '') + '>' + PERIOD_OPTS[p] + '</option>';
        }).join('') + '</select></div>' +
      '<div><label>Mål (quests pr. periode)</label><input id="m-target" type="number" value="' + (s.target || 1) + '"></div></div>',
      function (bg) {
        var arr = (m.streaks || []).slice();
        arr[idx] = Object.assign({}, s, {
          period: $('#m-period', bg).value,
          target: Math.max(1, parseInt($('#m-target', bg).value, 10) || 1)
        });
        HQ.ref('modules/' + mid + '/streaks').set(arr);
      }
    );
  }

  document.addEventListener('click', function (e) {
    var aq = e.target.closest('[data-add-quest]');
    if (aq) return questModal(aq.getAttribute('data-add-quest'), null);
    var eq = e.target.closest('[data-edit-quest]');
    if (eq) { var p = eq.getAttribute('data-edit-quest').split('|'); return questModal(p[0], parseInt(p[1], 10)); }
    var dq = e.target.closest('[data-del-quest]');
    if (dq) {
      var p2 = dq.getAttribute('data-del-quest').split('|');
      var m = st.modules[p2[0]], i = parseInt(p2[1], 10);
      if (confirm('Slet quest "' + (m.quests[i] || {}).title + '"?')) {
        var arr = m.quests.slice(); arr.splice(i, 1);
        HQ.ref('modules/' + p2[0] + '/quests').set(arr);
      }
      return;
    }
    var as2 = e.target.closest('[data-add-skill]');
    if (as2) return skillModal(as2.getAttribute('data-add-skill'), null);
    var es = e.target.closest('[data-edit-skill]');
    if (es) { var p3 = es.getAttribute('data-edit-skill').split('|'); return skillModal(p3[0], parseInt(p3[1], 10)); }
    var est = e.target.closest('[data-edit-streak]');
    if (est) { var p4 = est.getAttribute('data-edit-streak').split('|'); return streakModal(p4[0], parseInt(p4[1], 10)); }
  });

  // ═══════════ BUTIK (CRUD — uændret koncept) ═══════════
  function renderShopList() {
    var box = $('#shop-list');
    var ids = Object.keys(st.shop);
    if (!ids.length) { box.innerHTML = '<div class="empty">Butikken er tom</div>'; return; }
    ids.sort(function (a, b) { return (st.shop[a].cost || 0) - (st.shop[b].cost || 0); });
    box.innerHTML = ids.map(function (id) {
      var it = st.shop[id];
      return '<div class="admin-row' + (it.active === false ? ' inactive' : '') + '">' +
        '<span style="font-size:1.4rem">' + esc(it.icon || '🎁') + '</span>' +
        '<div class="a-main"><div class="a-title">' + esc(it.title) + '</div>' +
        '<div class="a-sub">🪙 ' + (it.cost || 0) + (it.desc ? ' · ' + esc(it.desc) : '') + '</div></div>' +
        '<button class="icon-btn" data-edit-item="' + id + '">✏️</button>' +
        '<button class="icon-btn" data-del-item="' + id + '">🗑️</button>' +
        '</div>';
    }).join('');
  }
  function itemModal(id) {
    var it = id ? st.shop[id] : { icon: '🎁', cost: 50, active: true };
    openModal(
      '<h2>' + (id ? 'Redigér belønning' : 'Ny belønning') + '</h2>' +
      '<label>Titel</label><input id="m-ititle" value="' + esc(it.title || '') + '">' +
      '<label>Beskrivelse (valgfri)</label><input id="m-idesc" value="' + esc(it.desc || '') + '">' +
      '<div class="row2"><div><label>Ikon</label>' + HQ.iconField('m-iicon', it.icon || '🎁') + '</div>' +
      '<div><label>Pris (guld)</label><input id="m-icost" type="number" value="' + (it.cost || 0) + '"></div></div>' +
      '<label style="display:flex;align-items:center;gap:8px;margin-top:14px"><input type="checkbox" id="m-iactive" style="width:auto"' + (it.active !== false ? ' checked' : '') + '> Aktiv</label>',
      function (bg) {
        var title = $('#m-ititle', bg).value.trim();
        if (!title) { HQ.toast('Titel mangler'); return false; }
        var data = {
          title: title, desc: $('#m-idesc', bg).value.trim(),
          icon: $('#m-iicon', bg).value.trim() || '🎁',
          cost: parseInt($('#m-icost', bg).value, 10) || 0,
          active: $('#m-iactive', bg).checked
        };
        if (id) HQ.ref('shop/' + id).update(data);
        else HQ.ref('shop').push(data);
      }
    );
  }
  $('#add-item').addEventListener('click', function () { itemModal(null); });
  document.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit-item]');
    if (ed) return itemModal(ed.getAttribute('data-edit-item'));
    var del = e.target.closest('[data-del-item]');
    if (del) {
      var id = del.getAttribute('data-del-item');
      if (confirm('Slet "' + (st.shop[id] || {}).title + '" fra butikken?')) HQ.ref('shop/' + id).remove();
    }
  });

  // ═══════════ HELTE ═══════════
  function renderKids() {
    var box = $('#kid-list');
    var ids = Object.keys(st.kids);
    if (!ids.length) { box.innerHTML = '<div class="card empty">Ingen helte endnu — opret den første!</div>'; return; }
    var active = ids.filter(function (id) { return !st.kids[id].archived; });
    var archived = ids.filter(function (id) { return st.kids[id].archived; });
    var html = active.map(function (id) {
      var k = st.kids[id];
      var ks = HQ.computeState(st.ledgers[id] || {});
      var hero = HQ.heroLevel(ks.totalXp);
      var tier = HQ.heroTier(hero.level);
      var nBadges = Object.keys(ks.badges).length;
      var skillsHtml = HQ.mainSkills(st.content).map(function (sid) {
        var s = st.content.skills[sid];
        return '<span class="chip">' + esc(s.icon) + ' LVL ' + HQ.skillLevelOf(st.content, ks, sid).level + '</span>';
      }).join(' ');
      return '<div class="card">' +
        '<div style="display:flex;gap:12px;align-items:center">' +
        '<div class="avatar-ring ' + tier.cls + '" style="width:58px;height:58px;font-size:1.8rem">' + esc(k.avatar || '🧒') + '</div>' +
        '<div style="flex:1"><b style="font-size:1.1rem">' + esc(k.name) + '</b>' +
        (k.grade != null ? ' <span class="chip">🎓 ' + k.grade + '. kl.</span>' : '') +
        '<div style="color:var(--muted);font-size:0.8rem">' + tier.icon + ' Level ' + hero.level + ' · ' + ks.totalXp + ' XP · 🪙 ' + ks.gold +
        (ks.coin ? ' · 💠 ' + ks.coin : '') + ' · 🏅 ' + nBadges + ' · PIN: ' + esc(k.pin) + '</div>' +
        '<div class="q-chips" style="margin-top:6px">' + skillsHtml + '</div></div>' +
        '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<button class="icon-btn" data-edit-kid="' + id + '">✏️</button>' +
        '<button class="icon-btn" data-adjust-kid="' + id + '" title="Justér XP/guld">⚖️</button>' +
        '<button class="icon-btn" data-ledger-kid="' + id + '" title="Kontobog (fortryd posteringer)">📜</button>' +
        '<button class="icon-btn" data-danger-kid="' + id + '" title="Deaktivér eller slet">🗑️</button>' +
        '</div></div></div>';
    }).join('');
    if (!active.length) html += '<div class="card empty">Ingen aktive helte</div>';
    if (archived.length) {
      html += '<h2 class="section-title">🗄️ Arkiverede helte</h2><div class="card">' +
        archived.map(function (id) {
          var k = st.kids[id];
          return '<div class="admin-row inactive" style="opacity:0.7">' +
            '<span style="font-size:1.4rem">' + esc(k.avatar || '🧒') + '</span>' +
            '<div class="a-main"><div class="a-title">' + esc(k.name) + '</div>' +
            '<div class="a-sub">Deaktiveret — al fremgang er bevaret</div></div>' +
            '<button class="btn small green" data-restore-kid="' + id + '">Gendan</button>' +
            '<button class="icon-btn" data-danger-kid="' + id + '" title="Slet permanent">🗑️</button>' +
            '</div>';
        }).join('') + '</div>';
    }
    box.innerHTML = html;
  }

  // Deaktivér / slet permanent
  function dangerModal(id) {
    var k = st.kids[id];
    if (!k) return;
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal"><h2>🗑️ ' + esc(k.name) + '</h2>' +
      '<p style="color:var(--muted);font-size:0.9rem;margin-top:6px">Hvad skal der ske?</p>' +
      (!k.archived ? '<button class="btn small" data-act="archive" style="width:100%;margin-top:14px">🗄️ Deaktivér (skjul fra spillet — XP, badges og alt andet bevares)</button>' : '') +
      '<button class="btn red small" data-act="delete" style="width:100%;margin-top:10px">💀 Slet PERMANENT (helt + kontobog + historik forsvinder for altid)</button>' +
      '<div class="modal-actions"><button class="btn ghost small" data-close>Annullér</button></div></div>';
    document.body.appendChild(bg);
    bg.addEventListener('click', function (e) {
      if (e.target === bg || e.target.closest('[data-close]')) { bg.remove(); return; }
      var act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.getAttribute('data-act') === 'archive') {
        HQ.ref('kids/' + id + '/archived').set(true);
        HQ.audit('helt-deaktiveret', k.name);
        HQ.toast('🗄️ ' + k.name + ' er deaktiveret');
        bg.remove();
      } else {
        var typed = prompt('Skriv heltens navn (' + k.name + ') for at bekræfte PERMANENT sletning:');
        if (typed === null) return;
        if (typed.trim() !== k.name) { HQ.toast('Navnet matchede ikke — intet slettet'); return; }
        HQ.audit('helt-slettet', k.name);
        var upd = {};
        upd['kids/' + id] = null;
        upd['completions/' + id] = null;
        upd['ledger/' + id] = null;
        HQ.ref().update(upd).then(function () {
          HQ.toast('💀 ' + k.name + ' er slettet permanent');
        });
        bg.remove();
      }
    });
  }
  document.addEventListener('click', function (e) {
    var dk = e.target.closest('[data-danger-kid]');
    if (dk) return dangerModal(dk.getAttribute('data-danger-kid'));
    var rk = e.target.closest('[data-restore-kid]');
    if (rk) {
      var id = rk.getAttribute('data-restore-kid');
      HQ.ref('kids/' + id + '/archived').set(null);
      HQ.audit('helt-gendannet', (st.kids[id] || {}).name || id);
      HQ.toast('✅ Gendannet');
    }
  });

  // ═══════════ KONTOBOG (fortryd posteringer) ═══════════
  var TYPE_LABEL = { xp: 'XP', gold: '🪙', coin: '💠', badge: '🏅 Badge', cosmetic: '🎨 Style', sticker: '📔 Mærke' };
  function canUndo(e) { return (e.type === 'xp' || e.type === 'gold' || e.type === 'coin') && e.source !== 'undo' && !e.undone; }

  function undoEntry(kidId, entryId, e) {
    var mp = {
      ts: Date.now(), type: e.type, amount: -(e.amount || 0),
      name: 'Fortrudt: ' + (e.name || ''), icon: '↩️',
      source: 'undo', undoOf: entryId, by: 'admin', unseen: false
    };
    if (e.skill) mp.skill = e.skill;
    HQ.ref('ledger/' + kidId).push(mp);
    HQ.ref('ledger/' + kidId + '/' + entryId + '/undone').set(true);
  }

  function ledgerModal(kidId) {
    var k = st.kids[kidId];
    if (!k) return;
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal" style="max-width:560px"><h2>📜 Kontobog: ' + esc(k.name) + '</h2>' +
      '<p style="color:var(--muted);font-size:0.82rem;margin:4px 0 10px">Fortryd skriver en modpostering — intet slettes, alt kan følges. Korrektioner fejres ikke i skattekisten.</p>' +
      '<div id="lm-list"></div>' +
      '<div class="modal-actions">' +
      '<button class="btn red small" id="lm-undo-selected" disabled>↩️ Fortryd valgte (0)</button>' +
      '<button class="btn ghost small" data-close>Luk</button></div></div>';
    document.body.appendChild(bg);

    function renderList() {
      var ledger = st.ledgers[kidId] || {};
      var ids = Object.keys(ledger).sort(function (a, b) { return (ledger[b].ts || 0) - (ledger[a].ts || 0); }).slice(0, 150);
      var list = $('#lm-list', bg);
      if (!ids.length) { list.innerHTML = '<div class="empty">Kontobogen er tom</div>'; return; }
      list.innerHTML = ids.map(function (id) {
        var e = ledger[id];
        var desc;
        if (e.type === 'xp') desc = (e.amount > 0 ? '+' : '') + e.amount + ' XP ' + esc(skillName(e.skill));
        else if (e.type === 'gold') desc = (e.amount > 0 ? '+' : '') + e.amount + ' 🪙';
        else if (e.type === 'coin') desc = (e.amount > 0 ? '+' : '') + e.amount + ' 💠';
        else desc = TYPE_LABEL[e.type] || e.type;
        var act;
        if (canUndo(e)) {
          act = '<input type="checkbox" class="lm-check" data-id="' + id + '" style="width:auto"> ' +
            '<button class="btn red small" data-undo-entry="' + id + '" style="padding:5px 10px;font-size:0.75rem">↩️</button>';
        } else if ((e.type === 'badge' || e.type === 'cosmetic' || e.type === 'sticker') && e.source !== 'undo') {
          act = '<button class="btn red small" data-remove-entry="' + id + '" style="padding:5px 10px;font-size:0.75rem">Fjern</button>';
        } else {
          act = '<span class="chip">' + (e.undone ? 'fortrudt' : e.source === 'undo' ? 'modpost' : '—') + '</span>';
        }
        return '<div class="admin-row' + (e.undone ? ' inactive' : '') + '">' +
          '<span style="font-size:1.2rem">' + esc(e.icon || '•') + '</span>' +
          '<div class="a-main"><div class="a-title" style="font-size:0.88rem">' + desc + '</div>' +
          '<div class="a-sub">' + esc(e.name || '') + ' · ' + esc(e.source || '') + ' · ' + HQ.fmtTs(e.ts) + '</div></div>' +
          '<div style="display:flex;gap:6px;align-items:center;flex:0 0 auto">' + act + '</div></div>';
      }).join('');
      updateBulkBtn();
    }
    function updateBulkBtn() {
      var n = HQ.$all('.lm-check:checked', bg).length;
      var btn = $('#lm-undo-selected', bg);
      btn.disabled = n === 0;
      btn.textContent = '↩️ Fortryd valgte (' + n + ')';
    }

    bg.addEventListener('change', function (e2) {
      if (e2.target.closest('.lm-check')) updateBulkBtn();
    });
    bg.addEventListener('click', function (e2) {
      if (e2.target === bg || e2.target.closest('[data-close]')) { bg.remove(); return; }
      var ledger = st.ledgers[kidId] || {};
      var ue = e2.target.closest('[data-undo-entry]');
      if (ue) {
        var id1 = ue.getAttribute('data-undo-entry');
        if (ledger[id1] && canUndo(ledger[id1])) {
          undoEntry(kidId, id1, ledger[id1]);
          HQ.audit('postering-fortrudt', k.name + ': ' + (ledger[id1].name || '') + ' (' + ledger[id1].amount + ' ' + ledger[id1].type + ')');
          HQ.toast('↩️ Fortrudt');
          setTimeout(renderList, 500);
        }
        return;
      }
      var re = e2.target.closest('[data-remove-entry]');
      if (re) {
        var id2 = re.getAttribute('data-remove-entry');
        var entry = ledger[id2];
        if (entry && confirm('Fjern "' + (entry.name || entry.type) + '"? (Badges gen-optjenes automatisk hvis betingelsen stadig er opfyldt)')) {
          HQ.ref('ledger/' + kidId + '/' + id2).remove();
          HQ.audit('postering-fjernet', k.name + ': ' + (entry.name || entry.type));
          setTimeout(renderList, 500);
        }
        return;
      }
      if (e2.target.closest('#lm-undo-selected')) {
        var checks = HQ.$all('.lm-check:checked', bg);
        var count = 0;
        checks.forEach(function (cb) {
          var id3 = cb.getAttribute('data-id');
          if (ledger[id3] && canUndo(ledger[id3])) { undoEntry(kidId, id3, ledger[id3]); count++; }
        });
        HQ.audit('posteringer-fortrudt-bulk', k.name + ': ' + count + ' posteringer');
        HQ.toast('↩️ ' + count + ' posteringer fortrudt');
        setTimeout(renderList, 700);
      }
    });
    renderList();
  }
  document.addEventListener('click', function (e) {
    var lk = e.target.closest('[data-ledger-kid]');
    if (lk) ledgerModal(lk.getAttribute('data-ledger-kid'));
  });

  function kidModal(id) {
    var k = id ? st.kids[id] : { avatar: '🦸‍♀️' };
    var moduleBoxes = '';
    if (id) {
      moduleBoxes = '<label style="margin-top:14px">Moduler til denne helt</label>' +
        Object.keys(st.modules).sort().map(function (mid) {
          var m = st.modules[mid];
          return '<label style="display:flex;align-items:center;gap:8px;margin:4px 0;font-size:0.88rem">' +
            '<input type="checkbox" class="km-mod" data-mid="' + mid + '" style="width:auto"' +
            (isAssignedTo(m, id) ? ' checked' : '') + '> ' + esc(m.name || mid) + '</label>';
        }).join('');
    }
    openModal(
      '<h2>' + (id ? 'Redigér helt' : 'Ny helt') + '</h2>' +
      '<label>Navn</label><input id="m-kname" value="' + esc(k.name || '') + '">' +
      '<div class="row2"><div><label>Avatar</label>' + HQ.iconField('m-kavatar', k.avatar || '🦸‍♀️') + '</div>' +
      '<div><label>PIN (4 cifre)</label><input id="m-kpin" type="tel" maxlength="4" value="' + esc(k.pin || '') + '"></div></div>' +
      '<label>Klassetrin (bruges kun til at anbefale moduler og opgaver)</label>' +
      '<select id="m-kgrade">' + gradeOptions(k.grade != null ? k.grade : null) + '</select>' +
      moduleBoxes,
      function (bg) {
        var name = $('#m-kname', bg).value.trim();
        var pin = $('#m-kpin', bg).value.trim();
        if (!name) { HQ.toast('Navn mangler'); return false; }
        if (!/^\d{4}$/.test(pin)) { HQ.toast('PIN skal være 4 cifre'); return false; }
        var gv = $('#m-kgrade', bg).value;
        var grade = gv === '' ? null : parseInt(gv, 10);
        var oldGrade = k.grade != null ? k.grade : null;
        var data = { name: name, avatar: $('#m-kavatar', bg).value.trim() || '🦸‍♀️', pin: pin, grade: grade };
        if (id) {
          HQ.ref('kids/' + id).update(data);
          // Nyt klassetrin → tilbyd de moduler der nu er relevante (aldrig tvang)
          if (grade !== oldGrade && grade != null) setTimeout(function () { recommendModal(id, grade); }, 300);
          // Modul-tildeling fra heltens vinkel
          HQ.$all('.km-mod', bg).forEach(function (cb) {
            var mid = cb.getAttribute('data-mid');
            var m = st.modules[mid];
            if (!m) return;
            var was = isAssignedTo(m, id);
            if (cb.checked === was) return;
            if (cb.checked) {
              if (m.assignedTo && m.assignedTo !== 'all') HQ.ref('modules/' + mid + '/assignedTo/' + id).set(true);
            } else if (!m.assignedTo || m.assignedTo === 'all') {
              // Konvertér 'alle' til eksplicit liste uden denne helt
              var obj = {};
              activeKidIds().forEach(function (kid2) { if (kid2 !== id) obj[kid2] = true; });
              HQ.ref('modules/' + mid + '/assignedTo').set(obj);
            } else {
              HQ.ref('modules/' + mid + '/assignedTo/' + id).set(null);
            }
            HQ.audit('modul-tildeling', mid + (cb.checked ? ' +' : ' −') + name);
          });
        }
        else {
          var kref = HQ.ref('kids').push(Object.assign({ created: Date.now() }, data));
          HQ.audit('helt-oprettet', name + (grade != null ? ' (' + grade + '. kl.)' : ''));
          // Ny helt → anbefal moduler til klassetrinnet (st.kids er allerede
          // opdateret — Firebase affyrer lokale lyttere synkront ved push)
          setTimeout(function () { recommendModal(kref.key, grade); }, 300);
        }
      }
    );
  }

  // ═══════════ ANBEFALEDE MODULER (fase C3) ═══════════
  // Viser bundlede moduler der passer klassetrinnet og endnu ikke er aktive for
  // helten. Forvalgte checkbokse, forælderen fravælger frit — ALDRIG tvang.
  function recommendModal(kidId, grade) {
    var kid = st.kids[kidId];
    if (!kid) return;
    var items = [];
    (window.HQ_BUNDLED || []).forEach(function (m, i) {
      if (!HQ.gradeFits(m.grades, grade)) return;
      var inst = st.modules[m.id];
      if (inst && isAssignedTo(inst, kidId)) return; // allerede aktiv for helten
      items.push({ m: m, idx: i, action: inst ? 'assign' : 'install' });
    });
    if (!items.length) return; // intet nyt at anbefale — vis ingen tom dialog
    var byCat = {};
    items.forEach(function (it) {
      var cat = it.m.category || 'fritid';
      (byCat[cat] = byCat[cat] || []).push(it);
    });
    var listHtml = ['skole', 'hjem', 'fritid'].filter(function (c) { return byCat[c]; }).map(function (cat) {
      return '<div class="mod-section-label">' + (HQ.CATEGORY_NAMES[cat] || cat) + '</div>' +
        byCat[cat].map(function (it) {
          var hint = gradesText(it.m.grades);
          return '<label style="display:flex;align-items:flex-start;gap:8px;margin:7px 0;font-size:0.9rem">' +
            '<input type="checkbox" checked class="rec-mod" data-idx="' + it.idx + '" data-action="' + it.action + '" style="width:auto;margin-top:3px">' +
            '<span>' + esc(it.m.name) + (hint ? ' <span style="color:var(--muted);font-size:0.75rem">(' + hint + ')</span>' : '') +
            (it.action === 'assign' ? ' <span class="chip">allerede installeret — tildeles</span>' : '') +
            '<br><span style="color:var(--muted);font-size:0.76rem">' + esc(it.m.description || '') + '</span></span></label>';
        }).join('');
    }).join('');
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal" style="max-width:520px">' +
      '<h2>✨ Anbefalet til ' + esc(kid.name) + (grade != null ? ' — ' + HQ.gradeLabel(grade) : '') + '</h2>' +
      '<p style="color:var(--muted);font-size:0.82rem;margin:4px 0 8px">Fravælg frit — alt kan ændres senere under Moduler. Opgaver udenfor klassetrinnet installeres som inaktive.</p>' +
      listHtml +
      '<div class="modal-actions"><button class="btn ghost small" data-close>Spring over</button>' +
      '<button class="btn small" id="rec-go">Tilføj valgte</button></div></div>';
    document.body.appendChild(bg);
    bg.addEventListener('click', function (e) {
      if (e.target === bg || e.target.closest('[data-close]')) { bg.remove(); return; }
      if (!e.target.closest('#rec-go')) return;
      var others = activeKidIds().filter(function (x) { return x !== kidId; });
      var count = 0;
      HQ.$all('.rec-mod:checked', bg).forEach(function (cb) {
        var m = (window.HQ_BUNDLED || [])[parseInt(cb.getAttribute('data-idx'), 10)];
        if (!m) return;
        if (cb.getAttribute('data-action') === 'install') {
          var data = installModuleData(m, grade);
          // Er der andre helte, tildeles modulet kun denne — ellers alle
          if (others.length) data.assignedTo = mkAssign(kidId);
          HQ.ref('modules/' + m.id).set(data);
          HQ.audit('modul-installeret', m.name + ' → ' + kid.name + (grade != null ? ' (' + grade + '. kl.)' : ''));
        } else {
          var inst = st.modules[m.id];
          if (inst && inst.assignedTo && inst.assignedTo !== 'all') {
            HQ.ref('modules/' + m.id + '/assignedTo/' + kidId).set(true);
            HQ.audit('modul-tildeling', m.id + ' +' + kid.name);
          }
        }
        count++;
      });
      if (count) HQ.toast('✨ ' + count + ' modul' + (count > 1 ? 'er' : '') + ' tilføjet til ' + kid.name);
      bg.remove();
    });
  }
  function mkAssign(kidId) { var o = {}; o[kidId] = true; return o; }
  function adjustModal(id) {
    var k = st.kids[id];
    var ks = HQ.computeState(st.ledgers[id] || {});
    openModal(
      '<h2>Justér ' + esc(k.name) + '</h2>' +
      '<p style="color:var(--muted);font-size:0.85rem">Skriver en postering i kontobogen (negativt tal trækker fra). Alt kan ses i loggen.</p>' +
      '<div class="row2"><div><label>Guld (nu: ' + ks.gold + ')</label><input id="m-agold" type="number" value="0"></div>' +
      '<div><label>Færdighed</label><select id="m-askill">' + skillOptions() + '</select></div></div>' +
      '<label>XP til færdigheden</label><input id="m-axp" type="number" value="0">' +
      '<label>Note (valgfri)</label><input id="m-anote" placeholder="F.eks. bonus for god uge">',
      function (bg) {
        var dg = parseInt($('#m-agold', bg).value, 10) || 0;
        var dx = parseInt($('#m-axp', bg).value, 10) || 0;
        var skill = $('#m-askill', bg).value;
        var note = $('#m-anote', bg).value.trim() || 'Justering';
        var lRef = HQ.ref('ledger/' + id);
        var base = { ts: Date.now(), name: note, icon: '⚖️', source: 'adjust', by: 'admin' };
        if (dg) lRef.push(Object.assign({}, base, { type: 'gold', amount: dg, unseen: dg > 0 }));
        if (dx && skill) lRef.push(Object.assign({}, base, { type: 'xp', amount: dx, skill: skill, unseen: dx > 0 }));
        HQ.audit('justering', k.name + ': ' + (dg ? dg + ' guld ' : '') + (dx ? dx + ' XP ' + skill : '') + ' — ' + note);
        HQ.toast('⚖️ Bogført');
      }
    );
  }
  $('#add-kid').addEventListener('click', function () { kidModal(null); });
  document.addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit-kid]');
    if (ed) return kidModal(ed.getAttribute('data-edit-kid'));
    var ad = e.target.closest('[data-adjust-kid]');
    if (ad) adjustModal(ad.getAttribute('data-adjust-kid'));
  });

  // ═══════════ LOG (aktivitet + audit + fortryd godkendelse) ═══════════
  function renderLog() {
    var box = $('#activity-log');
    var rows = [];
    Object.keys(st.completions).forEach(function (kidId) {
      var kidName = (st.kids[kidId] || {}).name || '?';
      Object.keys(st.completions[kidId]).forEach(function (pk) {
        Object.keys(st.completions[kidId][pk]).forEach(function (qk) {
          var c = st.completions[kidId][pk][qk];
          var STATUS = { approved: '✅', pending: '⏳', rejected: '❌' };
          rows.push({
            ts: c.approvedTs || c.ts,
            ico: STATUS[c.status] || '❔',
            html: '<b>' + esc(kidName) + '</b>: ' + esc(c.taskTitle) +
              (c.status === 'approved' ? ' · ' + rewardSummary(c.rewards) : c.status === 'rejected' ? ' (afvist)' : ' (venter)'),
            act: c.status === 'approved'
              ? '<button class="btn red small" data-undo-approval="' + kidId + '|' + pk + '|' + qk + '" style="padding:5px 10px;font-size:0.72rem" title="Fortryd — XP/guld trækkes tilbage og questen åbnes igen">↩️ Fortryd</button>'
              : ''
          });
        });
      });
    });
    Object.keys(st.purchases).forEach(function (id) {
      var p = st.purchases[id];
      var kidName = (st.kids[p.kidId] || {}).name || '?';
      rows.push({ ts: p.ts, ico: '🛒', html: '<b>' + esc(kidName) + '</b> købte ' + esc(p.title) + ' · 🪙 ' + p.cost + ' (' + p.status + ')' });
    });
    Object.keys(st.audit || {}).forEach(function (id) {
      var a = st.audit[id];
      rows.push({ ts: a.ts, ico: '🛡️', html: '<span style="color:var(--muted)">' + esc(a.email || 'admin') + ':</span> ' + esc(a.action) + (a.detail ? ' — ' + esc(a.detail) : '') });
    });
    if (!rows.length) { box.innerHTML = '<div class="empty">Ingen aktivitet endnu</div>'; return; }
    rows.sort(function (a, b) { return b.ts - a.ts; });
    box.innerHTML = rows.slice(0, 80).map(function (r) {
      return '<div class="log-row"><span class="log-ico">' + r.ico + '</span>' +
        '<div class="log-main">' + r.html + '<div class="log-time">' + HQ.fmtTs(r.ts) + '</div></div>' +
        (r.act ? '<div style="flex:0 0 auto">' + r.act + '</div>' : '') +
      '</div>';
    }).join('');
  }

  // Fortryd en godkendelse: modposteringer + originaler markeres + quest genåbnes
  document.addEventListener('click', function (e) {
    var ua = e.target.closest('[data-undo-approval]');
    if (!ua) return;
    var parts = ua.getAttribute('data-undo-approval').split('|');
    var kidId = parts[0], pk = parts[1], qk = parts[2];
    var c = ((st.completions[kidId] || {})[pk] || {})[qk];
    if (!c || c.status !== 'approved') return;
    var kidName = (st.kids[kidId] || {}).name || '?';
    if (!confirm('Fortryd godkendelsen af "' + c.taskTitle + '" for ' + kidName + '?\n\nXP/guld trækkes tilbage (som modpostering), og questen bliver tilgængelig igen i samme periode.')) return;

    var ledger = st.ledgers[kidId] || {};
    var count = 0;
    Object.keys(ledger).forEach(function (id) {
      var en = ledger[id];
      if (en && en.questKey === (c.questKey || qk) && en.earnedTs === c.ts && en.source === 'quest' && !en.undone) {
        undoEntry(kidId, id, en);
        count++;
      }
    });
    HQ.ref('completions/' + kidId + '/' + pk + '/' + qk).remove();
    HQ.audit('godkendelse-fortrudt', kidName + ': ' + c.taskTitle + ' (' + count + ' posteringer tilbageført)');
    HQ.toast('↩️ Fortrudt — questen er åben igen');
  });

  // ═══════════ TABS ═══════════
  document.querySelector('.tabs').addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    HQ.$all('.tab-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
    HQ.$all('.page').forEach(function (p) { p.classList.remove('active'); });
    $('#page-' + btn.getAttribute('data-page')).classList.add('active');
  });
})();
