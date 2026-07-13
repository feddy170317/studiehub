/* HelteQuest — admin-app v2 (moduler, ledger-godkendelse, import/eksport) */
(function () {
  'use strict';
  var $ = HQ.$, esc = HQ.esc;

  var st = {
    config: null, kids: {}, modules: {}, content: HQ.assemble({}),
    completions: {}, ledgers: {}, shop: {}, purchases: {},
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

  // ═══════════ OPSTART ═══════════
  HQ.ref('config').once('value').then(function (snap) {
    st.config = snap.val();
    if (!st.config || !st.config.adminPin) {
      renderSetupModules();
      $('#screen-setup').style.display = 'flex';
    } else if (localStorage.getItem('hq_admin') === '1') {
      enterApp();
    } else {
      showPinLogin();
    }
  });

  function renderSetupModules() {
    var box = $('#setup-modules');
    box.innerHTML = (window.HQ_BUNDLED || []).map(function (m, i) {
      return '<label style="display:flex;align-items:center;gap:8px;margin:6px 0;font-size:0.9rem;color:var(--text)">' +
        '<input type="checkbox" checked data-mod-idx="' + i + '" style="width:auto"> ' + esc(m.name) + '</label>';
    }).join('') || '<p style="color:var(--muted)">Ingen bundlede moduler fundet</p>';
  }

  $('#setup-go').addEventListener('click', function () {
    var adminPin = $('#setup-admin-pin').value.trim();
    var kidName = $('#setup-kid-name').value.trim();
    var kidAvatar = $('#setup-kid-avatar').value.trim() || '🦸‍♀️';
    var kidPin = $('#setup-kid-pin').value.trim();
    if (!/^\d{4}$/.test(adminPin)) return HQ.toast('Voksen-PIN skal være 4 cifre');
    if (!kidName) return HQ.toast('Skriv barnets navn');
    if (!/^\d{4}$/.test(kidPin)) return HQ.toast('Barnets PIN skal være 4 cifre');

    var seed = {
      config: { adminPin: adminPin, created: Date.now() },
      shop: {
        s_skaerm: { title: '30 min ekstra skærmtid', icon: '📱', cost: 50, active: true },
        s_mad: { title: 'Vælg aftensmad', desc: 'Du bestemmer menuen', icon: '🍕', cost: 80, active: true },
        s_bio: { title: 'Biograftur', desc: 'Med popcorn!', icon: '🎬', cost: 500, active: true }
      },
      modules: {}
    };
    HQ.$all('#setup-modules input:checked').forEach(function (cb) {
      var m = (window.HQ_BUNDLED || [])[parseInt(cb.getAttribute('data-mod-idx'), 10)];
      if (m) seed.modules[m.id] = Object.assign({}, m, { installedAt: Date.now(), enabled: true });
    });
    var kid = { name: kidName, avatar: kidAvatar, pin: kidPin, created: Date.now() };
    HQ.ref().update(seed).then(function () {
      return HQ.ref('kids').push(kid);
    }).then(function () {
      st.config = seed.config;
      localStorage.setItem('hq_admin', '1');
      $('#screen-setup').style.display = 'none';
      HQ.confetti({ count: 120 });
      enterApp();
    }).catch(function (e) { HQ.toast('Kunne ikke gemme: ' + e.message); });
  });

  function showPinLogin() {
    $('#screen-pin').style.display = 'flex';
    var ctl = HQ.pinPad($('#pin-pad'), {
      length: 4, autoSubmit: true,
      onSubmit: function (pin) {
        if (String(st.config.adminPin) === pin) {
          localStorage.setItem('hq_admin', '1');
          $('#screen-pin').style.display = 'none';
          enterApp();
        } else { ctl.shake(); HQ.toast('Forkert PIN'); }
      }
    });
  }

  $('#logout-btn').addEventListener('click', function () {
    localStorage.removeItem('hq_admin');
    location.reload();
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
    updateBadge(rows.length + pendingPurchases().length);
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
    cRef.update({ status: 'approved', approvedTs: now });
    HQ.toast('✅ Godkendt — ' + rewardSummary(c.rewards));
  });

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
    updateBadge(pendingList().length + ids.length);
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
      HQ.toast('🎁 Markeret som leveret');
    } else {
      if (!confirm('Annullér købet og giv ' + p.cost + ' guld tilbage?')) return;
      HQ.ref('purchases/' + id).update({ status: 'cancelled', cancelledTs: Date.now() });
      HQ.ref('ledger/' + p.kidId).push({
        ts: Date.now(), type: 'gold', amount: p.cost, name: 'Guld retur: ' + (p.title || ''),
        icon: '↩️', source: 'undo', by: 'admin', unseen: true
      });
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

  // ═══════════ MODULER ═══════════
  function renderModules() {
    var box = $('#module-list');
    var ids = Object.keys(st.modules).sort();
    if (!ids.length) { box.innerHTML = '<div class="card empty">Ingen moduler installeret — importér et, eller nulstil databasen for at få setup-guiden</div>'; return; }
    box.innerHTML = ids.map(function (mid) {
      var m = st.modules[mid];
      var ws = HQ.windowState(m);
      var winTxt = m.window && m.window.from ? ' · 📅 ' + m.window.from + (m.window.to ? ' → ' + m.window.to : '') +
        (ws === 'before' ? ' (kommer)' : ws === 'after' ? ' (udløbet)' : '') : '';
      var counts = (m.skills || []).length + ' skills · ' + (m.quests || []).length + ' quests · ' +
        (m.badges || []).length + ' badges · ' + (m.streaks || []).length + ' streaks';
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
    return '<div class="mod-body">' +
      '<div class="mod-section-label">Quests</div>' + (quests || '<div class="empty">Ingen quests</div>') +
      '<button class="btn small ghost" data-add-quest="' + mid + '" style="margin-top:8px">＋ Ny quest</button>' +
      '<div class="mod-section-label">Færdigheder</div>' + (skills || '<div class="empty">Ingen</div>') +
      '<div class="mod-section-label">Streaks</div>' + (streaks || '<div class="empty">Ingen</div>') +
      '<div class="mod-section-label">Badges</div><div class="q-chips">' + (badges || '<span class="empty">Ingen</span>') + '</div>' +
    '</div>';
  }

  document.addEventListener('click', function (e) {
    var tg = e.target.closest('[data-toggle-mod]');
    if (tg && !e.target.closest('.icon-btn')) {
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
    a.download = 'heltequest-modul-' + mid + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    HQ.toast('📤 ' + (m.name || mid) + ' eksporteret');
  }

  $('#import-module').addEventListener('click', function () { $('#import-file').click(); });
  $('#import-file').addEventListener('change', function () {
    var f = this.files[0];
    this.value = '';
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var m;
      try { m = JSON.parse(reader.result); } catch (e) { return HQ.toast('❌ Ikke gyldig JSON'); }
      if (!m || m.format !== 'heltequest-module@1') return HQ.toast('❌ Ikke et HelteQuest-modul (format-feltet mangler)');
      if (!m.id || !/^[a-z0-9-]+$/.test(m.id)) return HQ.toast('❌ Modulet mangler et gyldigt id (små bogstaver/tal/bindestreg)');
      var exists = !!st.modules[m.id];
      if (exists && !confirm('"' + m.name + '" er allerede installeret. Overskriv med den nye version? (Fremgang bevares)')) return;
      HQ.ref('modules/' + m.id).set(Object.assign({}, m, { installedAt: Date.now(), enabled: true }));
      HQ.toast('📥 ' + (m.name || m.id) + ' installeret');
    };
    reader.readAsText(f);
  });

  // ---- Quest-editor (redigerer modulets DB-kopi; eksportér for at dele) ----
  function questModal(mid, idx) {
    var m = st.modules[mid];
    var isNew = idx == null;
    var q = isNew ? { type: 'daily', active: true, days: [1, 2, 3, 4, 5, 6, 0], rewards: [] } : (m.quests || [])[idx];
    var r0 = (q.rewards || []).filter(function (r) { return r.skill; })[0] || {};
    var rGold = ((q.rewards || []).filter(function (r) { return r.gold; })[0] || {}).gold || 0;
    var rCoin = ((q.rewards || []).filter(function (r) { return r.eventCoin || r.coin; })[0] || {});
    rCoin = rCoin.eventCoin || rCoin.coin || 0;
    var days = q.days || [1, 2, 3, 4, 5, 6, 0];
    openModal(
      '<h2>' + (isNew ? 'Ny quest' : 'Redigér quest') + '</h2>' +
      '<label>Titel</label><input id="m-title" value="' + esc(q.title || '') + '">' +
      '<label>Beskrivelse (valgfri)</label><input id="m-desc" value="' + esc(q.desc || '') + '">' +
      '<div class="row2"><div><label>Ikon (emoji)</label><input id="m-icon" value="' + esc(q.icon || '') + '" maxlength="4"></div>' +
      '<div><label>Type</label><select id="m-type">' +
        '<option value="daily"' + (q.type === 'daily' ? ' selected' : '') + '>Daglig</option>' +
        '<option value="weekly"' + (q.type === 'weekly' ? ' selected' : '') + '>Ugentlig</option>' +
        '<option value="once"' + (q.type === 'once' ? ' selected' : '') + '>Særlig (engangs)</option></select></div></div>' +
      '<label>Færdighed (XP gives her)</label><select id="m-skill">' + skillOptions(r0.skill) + '</select>' +
      '<div class="row2"><div><label>XP</label><input id="m-xp" type="number" value="' + (r0.xp || 20) + '"></div>' +
      '<div><label>Guld 🪙</label><input id="m-gold" type="number" value="' + rGold + '"></div></div>' +
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
    var s = (m.skills || [])[idx];
    openModal(
      '<h2>Redigér færdighed</h2>' +
      '<p style="color:var(--muted);font-size:0.8rem">Id\'et (' + esc(s.id) + ') kan ikke ændres — XP er bogført på det.</p>' +
      '<label>Navn</label><input id="m-sname" value="' + esc(s.name || '') + '">' +
      '<div class="row2"><div><label>Ikon (emoji)</label><input id="m-sicon" value="' + esc(s.icon || '') + '" maxlength="4"></div>' +
      '<div><label>Farve</label><input id="m-scolor" type="color" value="' + esc(s.color || '#9c6bff') + '" style="height:44px;padding:4px"></div></div>',
      function (bg) {
        var name = $('#m-sname', bg).value.trim();
        if (!name) { HQ.toast('Navn mangler'); return false; }
        var arr = (m.skills || []).slice();
        arr[idx] = Object.assign({}, s, { name: name, icon: $('#m-sicon', bg).value.trim() || '⭐', color: $('#m-scolor', bg).value });
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
      '<div class="row2"><div><label>Ikon (emoji)</label><input id="m-iicon" value="' + esc(it.icon || '') + '" maxlength="4"></div>' +
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
    box.innerHTML = ids.map(function (id) {
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
        '<div style="color:var(--muted);font-size:0.8rem">' + tier.icon + ' Level ' + hero.level + ' · ' + ks.totalXp + ' XP · 🪙 ' + ks.gold +
        (ks.coin ? ' · 💠 ' + ks.coin : '') + ' · 🏅 ' + nBadges + ' · PIN: ' + esc(k.pin) + '</div>' +
        '<div class="q-chips" style="margin-top:6px">' + skillsHtml + '</div></div>' +
        '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<button class="icon-btn" data-edit-kid="' + id + '">✏️</button>' +
        '<button class="icon-btn" data-adjust-kid="' + id + '" title="Justér XP/guld">⚖️</button>' +
        '</div></div></div>';
    }).join('');
  }

  function kidModal(id) {
    var k = id ? st.kids[id] : { avatar: '🦸‍♀️' };
    openModal(
      '<h2>' + (id ? 'Redigér helt' : 'Ny helt') + '</h2>' +
      '<label>Navn</label><input id="m-kname" value="' + esc(k.name || '') + '">' +
      '<div class="row2"><div><label>Avatar (emoji)</label><input id="m-kavatar" value="' + esc(k.avatar || '🦸‍♀️') + '" maxlength="4"></div>' +
      '<div><label>PIN (4 cifre)</label><input id="m-kpin" type="tel" maxlength="4" value="' + esc(k.pin || '') + '"></div></div>',
      function (bg) {
        var name = $('#m-kname', bg).value.trim();
        var pin = $('#m-kpin', bg).value.trim();
        if (!name) { HQ.toast('Navn mangler'); return false; }
        if (!/^\d{4}$/.test(pin)) { HQ.toast('PIN skal være 4 cifre'); return false; }
        var data = { name: name, avatar: $('#m-kavatar', bg).value.trim() || '🦸‍♀️', pin: pin };
        if (id) HQ.ref('kids/' + id).update(data);
        else HQ.ref('kids').push(Object.assign({ created: Date.now() }, data));
      }
    );
  }
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

  // ═══════════ LOG ═══════════
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
              (c.status === 'approved' ? ' · ' + rewardSummary(c.rewards) : c.status === 'rejected' ? ' (afvist)' : ' (venter)')
          });
        });
      });
    });
    Object.keys(st.purchases).forEach(function (id) {
      var p = st.purchases[id];
      var kidName = (st.kids[p.kidId] || {}).name || '?';
      rows.push({ ts: p.ts, ico: '🛒', html: '<b>' + esc(kidName) + '</b> købte ' + esc(p.title) + ' · 🪙 ' + p.cost + ' (' + p.status + ')' });
    });
    if (!rows.length) { box.innerHTML = '<div class="empty">Ingen aktivitet endnu</div>'; return; }
    rows.sort(function (a, b) { return b.ts - a.ts; });
    box.innerHTML = rows.slice(0, 60).map(function (r) {
      return '<div class="log-row"><span class="log-ico">' + r.ico + '</span>' +
        '<div class="log-main">' + r.html + '<div class="log-time">' + HQ.fmtTs(r.ts) + '</div></div></div>';
    }).join('');
  }

  // ═══════════ TABS ═══════════
  document.querySelector('.tabs').addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    HQ.$all('.tab-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
    HQ.$all('.page').forEach(function (p) { p.classList.remove('active'); });
    $('#page-' + btn.getAttribute('data-page')).classList.add('active');
  });
})();
