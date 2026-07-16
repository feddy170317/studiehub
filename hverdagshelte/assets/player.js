/* HverdagsHelte — spiller-app v2 (modul-drevet, ledger som sandhed, skattekiste) */
(function () {
  'use strict';
  var $ = HQ.$, esc = HQ.esc;

  var st = {
    kidId: null, kids: {}, modules: {}, content: HQ.assemble({}),
    ledger: {}, state: HQ.computeState({}),
    completions: {}, shop: {}, purchases: {}, jobs: {}
  };
  var AVATARS = ['🦸‍♀️','🦸‍♂️','🧙‍♀️','🧝‍♀️','🧜‍♀️','🦄','🐱','🐶','🦊','🐼','🐨','🐸','🦋','🌟','🔥','🌈','👑','🎀','⚡','🍀','🐯','🦁','🐰','🐧'];
  var awardedGuard = {};
  var chestOpen = false;

  if (!HQ.initFirebase()) {
    document.body.innerHTML = '<div class="login-screen"><div class="login-logo">😴</div>' +
      '<h1 class="login-title" style="font-size:1.6rem">Ingen forbindelse</h1>' +
      '<p class="login-sub">Tjek internettet og prøv igen</p></div>';
    return;
  }

  // ═══════════ FAMILIE-LOGIN (v3: auth → org → heltevalg) ═══════════
  HQ.auth().onAuthStateChanged(function (user) {
    if (!user) {
      $('#screen-auth').style.display = 'flex';
      $('#screen-login').style.display = 'none';
      return;
    }
    HQ.raw('hq/users/' + user.uid + '/orgs').once('value').then(function (snap) {
      var orgId = Object.keys(snap.val() || {})[0];
      if (!orgId) {
        $('#auth-hint').textContent = 'Kontoen har ingen familie endnu — opret den i admin-appen først.';
        $('#screen-auth').style.display = 'flex';
        return;
      }
      HQ.setOrg(orgId);
      startPlayer();
    });
  });

  $('#auth-go').addEventListener('click', function () {
    var email = $('#auth-email').value.trim();
    var pass = $('#auth-pass').value;
    if (!email || !pass) return HQ.toast('Udfyld e-mail og kodeord');
    var btn = this;
    btn.disabled = true;
    HQ.auth().signInWithEmailAndPassword(email, pass).catch(function (e) {
      btn.disabled = false;
      HQ.toast('❌ ' + HQ.authErrorText(e));
    });
  });

  function startPlayer() {
    $('#screen-auth').style.display = 'none';
    if (!st.kidId) $('#screen-login').style.display = 'flex';
    HQ.ref('kids').on('value', function (snap) {
      st.kids = snap.val() || {};
      if (!st.kidId) renderProfiles();
      else { renderHeader(); renderPet(); renderStyleShop(); }
    });
    var saved = localStorage.getItem('hq_kid');
    if (saved) {
      HQ.ref('kids').once('value').then(function (snap) {
        var kids = snap.val() || {};
        if (kids[saved] && !kids[saved].archived && !st.kidId) enterApp(saved);
      });
    }
  }

  function renderProfiles() {
    var box = $('#profiles');
    var ids = Object.keys(st.kids).filter(function (id) { return !st.kids[id].archived; });
    if (!ids.length) {
      box.innerHTML = '<div class="empty">Ingen helte endnu.<br>Bed en voksen om at oprette dig i admin-appen 🙂</div>';
      return;
    }
    box.innerHTML = ids.map(function (id) {
      var k = st.kids[id];
      return '<button class="profile-btn" data-id="' + id + '">' +
        '<span class="p-avatar">' + esc(k.avatar || '🦸‍♀️') + '</span>' +
        '<span class="p-name">' + esc(k.name) + '</span></button>';
    }).join('');
  }

  var pinCtl = null, pendingKidId = null;
  $('#profiles').addEventListener('click', function (e) {
    var btn = e.target.closest('.profile-btn');
    if (!btn) return;
    pendingKidId = btn.getAttribute('data-id');
    var k = st.kids[pendingKidId];
    $('#pin-avatar').textContent = k.avatar || '🦸‍♀️';
    $('#pin-name').textContent = k.name;
    $('#screen-login').style.display = 'none';
    $('#screen-pin').style.display = 'flex';
    var pad = $('#pin-pad');
    pad.innerHTML = '';
    pinCtl = HQ.pinPad(pad, {
      length: 4, autoSubmit: true,
      onSubmit: function (pin) {
        var kid = st.kids[pendingKidId];
        if (kid && String(kid.pin) === pin) enterApp(pendingKidId);
        else { pinCtl.shake(); HQ.toast('Forkert kode — prøv igen 🙈'); }
      }
    });
  });
  $('#pin-back').addEventListener('click', function () {
    $('#screen-pin').style.display = 'none';
    $('#screen-login').style.display = 'flex';
  });

  // ═══════════ APP-START ═══════════
  function enterApp(kidId) {
    st.kidId = kidId;
    localStorage.setItem('hq_kid', kidId);
    $('#screen-login').style.display = 'none';
    $('#screen-pin').style.display = 'none';
    $('#screen-app').style.display = 'block';
    updateSoundBtn();

    sub('modules', function (v) { st.modules = v || {}; st.content = HQ.assemble(st.modules, st.kidId); recompute(); });
    sub('ledger/' + kidId, function (v) { st.ledger = v || {}; recompute(); });
    sub('completions/' + kidId, function (v) { st.completions = v || {}; renderQuests(); renderLog(); });
    sub('shop', function (v) { st.shop = v || {}; renderShop(); });
    sub('jobs', function (v) { st.jobs = v || {}; renderJobs(); });
    sub('purchases', function (v) {
      var all = v || {}, mine = {};
      Object.keys(all).forEach(function (id) { if (all[id].kidId === kidId) mine[id] = all[id]; });
      st.purchases = mine;
      renderPurchases(); renderLog();
    });
  }
  function sub(path, fn) { HQ.ref(path).on('value', function (snap) { fn(snap.val()); }); }

  $('#logout-btn').addEventListener('click', function () {
    localStorage.removeItem('hq_kid');
    location.reload();
  });
  $('#sound-btn').addEventListener('click', function () { HQ.toggleSound(); updateSoundBtn(); });
  function updateSoundBtn() { $('#sound-btn').textContent = HQ.soundOn() ? '🔊' : '🔇'; }

  // ═══════════ GENBEREGN ALT ═══════════
  function recompute() {
    if (!st.kidId) return;
    st.state = HQ.computeState(st.ledger);
    awardBadges();
    renderHeader();
    renderQuests();
    renderSkills();
    renderBadgeWall();
    renderStickers();
    renderPet();
    renderStreaks();
    renderShop();
    renderStyleShop();
    renderLog();
    maybeShowChest();
  }

  // ═══════════ KÆLEDYR ═══════════
  function renderPet() {
    var box = $('#pet-card');
    if (!box) return;
    var kid = st.kids[st.kidId];
    if (!kid) return;
    var hero = HQ.heroLevel(st.state.totalXp);
    if (kid.pet && kid.pet.type) {
      var pv = HQ.petView(kid.pet, hero.level);
      if (!pv) { box.innerHTML = ''; return; }
      var patted = kid.pet.patTs && HQ.dateKey(new Date(kid.pet.patTs)) === HQ.dateKey();
      var nextTxt = pv.next
        ? 'Udvikler sig ved heltelevel ' + pv.next.level + ' (' + pv.next.label + ')'
        : 'Fuldt udviklet — en legende! ✨';
      box.innerHTML = '<h2 class="section-title">🐾 Dit kæledyr</h2>' +
        '<div class="card" style="display:flex;gap:14px;align-items:center;position:relative" id="pet-box">' +
          '<div class="pet-card-face ' + pv.stage.cls + '"><span class="pet-face-emoji">' + esc(pv.emoji) + '</span></div>' +
          '<div style="flex:1;min-width:0">' +
            '<b style="font-size:1.1rem">' + esc(pv.name) + '</b>' +
            '<div style="color:var(--muted);font-size:0.82rem">' + esc(pv.typeName) + ' · ' + esc(pv.stage.label) + '</div>' +
            '<div style="color:var(--muted);font-size:0.78rem;margin-top:4px">' + nextTxt + '</div>' +
            '<div class="q-chips" style="margin-top:8px">' +
              '<button class="btn small green" id="pet-pat"' + (patted ? ' disabled' : '') + '>' + (patted ? '❤️ Nusset i dag' : '🤗 Nus ' + esc(pv.name)) + '</button>' +
              '<button class="btn small ghost" id="pet-rename">✏️ Navn</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else if (kid.pet && kid.pet.stage === 'egg') {
      box.innerHTML = '<h2 class="section-title">🐾 Dit kæledyr</h2>' +
        '<div class="card" style="display:flex;gap:14px;align-items:center">' +
          '<div class="pet-card-face"><span class="pet-face-emoji egg-wobble" style="font-size:2.2rem">🥚</span></div>' +
          '<div><b>Et mystisk æg…</b><div style="color:var(--muted);font-size:0.82rem">Det klækker når du når heltelevel ' + HQ.PET_HATCH_LEVEL + '. Bliv ved med at klare quests!</div></div>' +
        '</div>';
    } else {
      box.innerHTML = '';
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#pet-pat')) {
      var kid = st.kids[st.kidId];
      if (!kid || !kid.pet) return;
      HQ.ref('kids/' + st.kidId + '/pet/patTs').set(Date.now());
      HQ.chime('pop');
      var boxEl = $('#pet-box');
      for (var i = 0; i < 6; i++) {
        var h = document.createElement('span');
        h.className = 'heart-float';
        h.textContent = ['❤️', '💖', '💕'][i % 3];
        h.style.left = (20 + Math.random() * 60) + '%';
        h.style.top = '40%';
        h.style.animationDelay = (i * 0.12) + 's';
        boxEl.appendChild(h);
        setTimeout(function (el) { return function () { el.remove(); }; }(h), 1500 + i * 120);
      }
      return;
    }
    if (e.target.closest('#pet-rename')) {
      var kid2 = st.kids[st.kidId];
      if (!kid2 || !kid2.pet || !kid2.pet.type) return;
      var name = prompt('Hvad skal dit kæledyr hedde?', kid2.pet.name || '');
      if (name === null) return;
      name = name.trim().slice(0, 20);
      if (name) {
        HQ.ref('kids/' + st.kidId + '/pet/name').set(name);
        HQ.toast('💛 ' + name + '!');
      }
    }
  });

  function awardBadges() {
    var pend = HQ.pendingBadges(st.content, st.state);
    pend.forEach(function (p) {
      if (awardedGuard[p.key]) return;
      awardedGuard[p.key] = true;
      HQ.ref('ledger/' + st.kidId + '/' + p.key).set({
        ts: Date.now(), type: 'badge', badgeId: p.badge.id,
        name: p.badge.name || '', icon: p.badge.icon || '🏅',
        rarity: p.badge.rarity || 'bronze', module: p.badge.module || '',
        source: 'auto', unseen: true
      });
    });
  }

  // ═══════════ HEADER ═══════════
  function cosmeticById(id) {
    return HQ.COSMETICS.filter(function (c) { return c.id === id; })[0] || null;
  }
  function equippedIn(slot) {
    var kid = st.kids[st.kidId] || {};
    var id = (kid.equipped || {})[slot];
    if (!id || !st.state.cosmetics[id]) return null;   // skal både være valgt OG ejet
    return cosmeticById(id);
  }

  function renderHeader() {
    var kid = st.kids[st.kidId];
    if (!kid) return;
    var hero = HQ.heroLevel(st.state.totalXp);
    var tier = HQ.heroTier(hero.level);
    var frame = equippedIn('frame'), bg = equippedIn('bg'), title = equippedIn('title');
    var av = $('#avatar-btn');
    var petHtml = '';
    if (kid.pet && kid.pet.type) {
      var pv = HQ.petView(kid.pet, hero.level);
      if (pv) petHtml = '<span class="pet-bubble">' + esc(pv.emoji) + '</span>';
    } else if (kid.pet && kid.pet.stage === 'egg') {
      petHtml = '<span class="pet-bubble"><span class="egg-wobble">🥚</span></span>';
    }
    av.innerHTML = esc(kid.avatar || '🦸‍♀️') + petHtml;
    av.className = 'avatar-ring ' + tier.cls + (frame ? ' ' + frame.cls : '');
    var bar = av.closest('.hero-bar');
    bar.className = 'card hero-bar' + (bg ? ' ' + bg.cls : '');
    $('#hero-name').textContent = kid.name + (title ? ' ' + title.text : '');
    $('#hero-sub').textContent = tier.icon + ' ' + tier.name + '-helt · Level ' + hero.level;
    $('#hero-xp-fill').style.width = hero.pct + '%';
    $('#hero-xp-label').textContent = hero.into + ' / ' + hero.need + ' XP til level ' + (hero.level + 1);
    $('#hero-gold').textContent = st.state.gold;
    $('#coin-pill').style.display = st.state.coin > 0 ? 'inline-flex' : 'none';
    $('#hero-coin').textContent = st.state.coin;
  }

  // ═══════════ QUESTS ═══════════
  function questsFor(type) {
    var day = new Date().getDay();
    return st.content.quests.filter(function (q) {
      if (q.active === false || (q.type || 'daily') !== type) return false;
      if (q.kidId && q.kidId !== 'all' && q.kidId !== st.kidId) return false;
      if (type === 'daily' && q.days && q.days.length && q.days.indexOf(day) < 0) return false;
      return true;
    });
  }
  function periodKey(type) {
    return type === 'daily' ? HQ.dateKey() : type === 'weekly' ? HQ.isoWeekKey() : 'once';
  }
  function getCompletion(type, questKey) {
    return (st.completions[periodKey(type)] || {})[questKey] || null;
  }

  function renderQuests() {
    if (!st.kidId) return;
    var d = new Date();
    $('#today-label').textContent = HQ.DAY_NAMES[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1);
    $('#daily-quests').innerHTML = questListHtml('daily');
    $('#weekly-quests').innerHTML = questListHtml('weekly');
    var onceHtml = questListHtml('once', true);
    $('#once-section').style.display = onceHtml ? 'block' : 'none';
    $('#once-quests').innerHTML = onceHtml;
    renderTeaser();
    updateQuestBadge();
  }

  function skillName(id) { var s = st.content.skills[id]; return s ? s.name : id; }
  function skillIcon(id) { var s = st.content.skills[id]; return s ? (s.icon || '⭐') : '⭐'; }

  function questListHtml(type, hideEmpty) {
    var list = questsFor(type);
    if (type === 'once') list = list.filter(function (q) {
      var c = getCompletion('once', q.key);
      return !(c && c.status === 'approved');
    });
    if (!list.length) return hideEmpty ? '' : '<div class="card empty">Ingen quests her ' + (type === 'daily' ? 'i dag' : 'i denne uge') + ' 🎈</div>';
    return list.map(function (q) {
      var c = getCompletion(type, q.key);
      var mainSkill = (q.rewards || []).filter(function (r) { return r.skill; })[0];
      var act;
      if (!c || c.status === 'rejected') {
        act = '<button class="btn green small" data-complete="' + q.key + '" data-type="' + type + '">Færdig!</button>';
      } else if (c.status === 'pending') {
        act = '<div class="status pending">⏳ Venter på godkendelse</div>';
      } else {
        act = '<div class="status approved">✅ Godkendt!</div>';
      }
      var rejectNote = (c && c.status === 'rejected')
        ? '<div class="q-desc" style="color:var(--red);margin-top:4px">💬 ' + esc(c.note || 'Prøv igen!') + '</div>' : '';
      return '<div class="quest' + (c && c.status === 'approved' ? ' done' : '') + '">' +
        '<div class="q-ico">' + esc(q.icon || (mainSkill ? skillIcon(mainSkill.skill) : '⭐')) + '</div>' +
        '<div class="q-main">' +
          '<div class="q-title">' + esc(q.title) + '</div>' +
          (q.desc ? '<div class="q-desc">' + esc(q.desc) + '</div>' : '') +
          rejectNote +
          '<div class="q-chips">' +
            (mainSkill ? '<span class="chip">' + esc(skillIcon(mainSkill.skill)) + ' ' + esc(skillName(mainSkill.skill)) + '</span>' : '') +
            HQ.rewardChips(q.rewards) +
          '</div>' +
        '</div>' +
        '<div class="q-act">' + act + '</div>' +
      '</div>';
    }).join('');
  }

  function updateQuestBadge() {
    var open = 0;
    ['daily', 'weekly', 'once'].forEach(function (type) {
      questsFor(type).forEach(function (q) {
        var c = getCompletion(type, q.key);
        if (type === 'once' && c && c.status === 'approved') return;
        if (!c || c.status === 'rejected') open++;
      });
    });
    var btn = document.querySelector('.tab-btn[data-page="quests"]');
    var badge = btn.querySelector('.tab-badge');
    if (open > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'tab-badge'; btn.appendChild(badge); }
      badge.textContent = open;
    } else if (badge) badge.remove();
  }

  function renderTeaser() {
    var html = '';
    Object.keys(st.content.modules).forEach(function (mid) {
      var m = st.content.modules[mid];
      if (m.state !== 'before' || !m.window) return;
      var days = Math.ceil((new Date(m.window.from) - new Date()) / 86400000);
      if (days > 0 && days <= (m.window.teaserDays || 7)) {
        html += '<div class="teaser-banner">⏳ <b>' + esc(m.name) + '</b> starter om ' + days + ' dag' + (days > 1 ? 'e' : '') + '! Gør dig klar…</div>';
      }
    });
    $('#teaser-box').innerHTML = html;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-complete]');
    if (!btn) return;
    var key = btn.getAttribute('data-complete');
    var type = btn.getAttribute('data-type');
    var q = st.content.quests.filter(function (x) { return x.key === key; })[0];
    if (!q) return;
    btn.disabled = true;
    HQ.ref('completions/' + st.kidId + '/' + periodKey(type) + '/' + key).set({
      status: 'pending', ts: Date.now(),
      module: q.module, questId: q.id, questKey: key,
      taskTitle: q.title || '', icon: q.icon || '⭐', type: type,
      rewards: q.rewards || []
    }).then(function () {
      HQ.chime('pop');
      HQ.toast('🚀 Sendt til godkendelse — flot klaret!');
    });
  });

  // ═══════════ OPSLAGSTAVLEN (fase D: jobs fra familien, fx farfar) ═══════════
  function jobRewardChips(j) {
    var r = j.reward || {};
    var bits = '';
    if (r.gold) bits += '<span class="chip gold">+' + r.gold + ' 🪙</span>';
    if (r.realNote) bits += '<span class="chip">💵 ' + esc(r.realNote) + '</span>';
    return bits;
  }
  function renderJobs() {
    var box = $('#jobs-list');
    if (!box || !st.kidId) return;
    // Kun aktive opslag vises for barnet — udførte/lukkede lever videre i admin
    var ids = Object.keys(st.jobs).filter(function (id) {
      var j = st.jobs[id];
      return j && (j.status === 'open' || j.status === 'taken' || j.status === 'submitted');
    }).sort(function (a, b) { return (st.jobs[b].ts || 0) - (st.jobs[a].ts || 0); });
    $('#jobs-section').style.display = ids.length ? 'block' : 'none';
    if (!ids.length) { box.innerHTML = ''; return; }
    box.innerHTML = ids.map(function (id) {
      var j = st.jobs[id];
      var mine = j.takenBy === st.kidId;
      var takerName = (st.kids[j.takenBy] || {}).name || 'en anden helt';
      var act, note = '';
      if (j.status === 'open') {
        act = '<button class="btn green small" data-take-job="' + id + '">Tag jobbet!</button>';
      } else if (j.status === 'taken' && mine) {
        act = '<button class="btn green small" data-submit-job="' + id + '">✅ Meld færdig</button>' +
          '<button class="btn ghost small" data-return-job="' + id + '" style="margin-top:6px">😞 Giv tilbage</button>';
        if (j.note) note = '<div class="q-desc" style="color:var(--red);margin-top:4px">💬 ' + esc(j.note) + '</div>';
      } else if (j.status === 'submitted' && mine) {
        act = '<div class="status pending">⏳ Venter på godkendelse</div>';
      } else {
        act = '<div class="status pending">💪 Taget af ' + esc(takerName) + '</div>';
      }
      return '<div class="quest' + (mine ? '' : (j.status !== 'open' ? ' done' : '')) + '">' +
        '<div class="q-ico">' + esc(j.icon || '📌') + '</div>' +
        '<div class="q-main">' +
          '<div class="q-title">' + esc(j.title) + '</div>' +
          (j.desc ? '<div class="q-desc">' + esc(j.desc) + '</div>' : '') +
          note +
          '<div class="q-chips"><span class="chip">📌 ' + esc(j.poster || 'Familien') + '</span>' + jobRewardChips(j) + '</div>' +
        '</div>' +
        '<div class="q-act" style="display:flex;flex-direction:column;align-items:flex-end">' + act + '</div>' +
      '</div>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var tk = e.target.closest('[data-take-job]');
    if (tk) {
      var id = tk.getAttribute('data-take-job');
      tk.disabled = true;
      // Først-til-mølle: transaction gør låsen race-sikker på serveren
      HQ.ref('jobs/' + id).transaction(function (j) {
        if (!j || j.status !== 'open') return; // abort — en anden var først
        return Object.assign({}, j, { status: 'taken', takenBy: st.kidId, takenTs: Date.now() });
      }, function (err, committed) {
        if (committed) { HQ.chime('pop'); HQ.toast('💪 Jobbet er dit — gå i gang!'); }
        else HQ.toast('Øv — en anden helt nåede det først 🙈');
      });
      return;
    }
    var sj = e.target.closest('[data-submit-job]');
    if (sj) {
      var id2 = sj.getAttribute('data-submit-job');
      var j2 = st.jobs[id2];
      if (!j2 || j2.status !== 'taken' || j2.takenBy !== st.kidId) return;
      HQ.ref('jobs/' + id2).update({ status: 'submitted', submittedTs: Date.now(), note: null });
      HQ.chime('pop');
      HQ.toast('🚀 Meldt færdig — en voksen kigger på det!');
      return;
    }
    var rj = e.target.closest('[data-return-job]');
    if (rj) {
      var id3 = rj.getAttribute('data-return-job');
      var j3 = st.jobs[id3];
      if (!j3 || j3.status !== 'taken' || j3.takenBy !== st.kidId) return;
      if (!confirm('Giv jobbet tilbage til opslagstavlen?')) return;
      HQ.ref('jobs/' + id3).update({ status: 'open', takenBy: null, takenTs: null, note: null });
      HQ.toast('Jobbet er tilbage på tavlen 🙂');
    }
  });

  // ═══════════ STREAKS ═══════════
  function renderStreaks() {
    var box = $('#streak-strip');
    if (!st.content.streaks.length) { box.innerHTML = ''; return; }
    box.innerHTML = st.content.streaks.map(function (rule) {
      var s = HQ.computeStreak(rule, st.state);
      var missing = Math.max(0, s.target - s.progress);
      var lbl = missing === 0 ? 'i hus denne ' + s.periodName + '! ✔'
        : missing + ' mere denne ' + s.periodName;
      return '<div class="streak-chip' + (s.progress >= s.target ? ' lit' : '') + '">' +
        '<span class="fl">' + esc(rule.icon || '🔥') + '</span>' +
        '<span class="num">' + s.current + '</span>' +
        '<span class="lbl">' + esc(rule.name) + '<br>' + esc(lbl) + (s.best > s.current ? ' · bedste: ' + s.best : '') + '</span>' +
      '</div>';
    }).join('');
  }

  // ═══════════ SKILLS (hierarki m. roll-up) ═══════════
  function renderSkills() {
    var box = $('#skills-list');
    var mains = HQ.mainSkills(st.content);
    if (!mains.length) { box.innerHTML = '<div class="card empty">Ingen moduler installeret endnu</div>'; return; }
    box.innerHTML = mains.map(function (id) {
      var def = st.content.skills[id];
      var lv = displayLevel(id);
      var xp = HQ.skillXpOf(st.content, st.state, id);
      var subs = HQ.childrenOf(st.content, id).map(function (sid) {
        var sdef = st.content.skills[sid];
        var slv = displayLevel(sid);
        return '<div class="subskill-row">' +
          '<div class="ss-ico" style="background:' + esc(sdef.color || '#888') + '22">' + esc(sdef.icon || '⭐') + '</div>' +
          '<div class="ss-main"><div class="ss-top"><span>' + esc(sdef.name) + '</span><span class="ss-lvl">LVL ' + slv.level + '</span></div>' +
          '<div class="xp-bar"><div class="xp-fill" style="width:' + slv.pct + '%;background:linear-gradient(90deg,' + esc(sdef.color || '#9c6bff') + ',#fff8)"></div></div></div>' +
        '</div>';
      }).join('');
      return '<div class="card">' +
        '<div class="skill-card">' +
          '<div class="skill-ico" style="background:' + esc(def.color || '#555') + '22;border:1px solid ' + esc(def.color || '#555') + '55">' + esc(def.icon || '⭐') + '</div>' +
          '<div class="skill-main">' +
            '<div class="skill-top"><span class="skill-name">' + esc(def.name) + '</span>' +
            '<span class="skill-lvl">LVL ' + lv.level + '</span></div>' +
            '<div class="xp-bar"><div class="xp-fill" style="width:' + lv.pct + '%;background:linear-gradient(90deg,' + esc(def.color || '#9c6bff') + ',#fff8)"></div></div>' +
            '<div class="xp-label">' + lv.into + ' / ' + lv.need + ' XP · ' + xp + ' XP i alt</div>' +
          '</div>' +
        '</div>' + subs +
      '</div>';
    }).join('');
  }

  // Level må aldrig vises lavere end tidligere opnået (hvis nye subskills gør kurven stejlere)
  function displayLevel(skillId) {
    var lv = HQ.skillLevelOf(st.content, st.state, skillId);
    var kid = st.kids[st.kidId] || {};
    var high = (kid.levelHigh || {})[HQ.safeKey(skillId)] || 0;
    if (lv.level > high) {
      HQ.ref('kids/' + st.kidId + '/levelHigh/' + HQ.safeKey(skillId)).set(lv.level);
    } else if (high > lv.level) {
      return { level: high, into: lv.into, need: lv.need, pct: lv.pct };
    }
    return lv;
  }

  // ═══════════ TROFÆ-VÆG ═══════════
  function renderBadgeWall() {
    var box = $('#badge-wall');
    var earned = Object.keys(st.state.badges).map(function (k) { return st.state.badges[k]; })
      .sort(function (a, b) { return b.ts - a.ts; });
    var earnedIds = {};
    earned.forEach(function (b) { earnedIds[b.badgeId] = true; });
    var locked = st.content.badges.filter(function (b) { return !st.state.badges[b.key] && !b.secret; });
    $('#badge-count').textContent = earned.length + ' badge' + (earned.length === 1 ? '' : 's');
    if (!earned.length && !locked.length) { box.innerHTML = '<div class="empty" style="grid-column:1/-1">Dine trofæer kommer her ✨</div>'; return; }
    box.innerHTML = earned.map(function (b) {
      var rar = HQ.RARITY[b.rarity] || HQ.RARITY.bronze;
      return '<div class="badge-card r-' + esc(b.rarity || 'bronze') + '">' +
        '<div class="b-ico">' + esc(b.icon || '🏅') + '</div>' +
        '<div class="b-name">' + esc(b.name) + '</div>' +
        '<div class="b-rar">' + rar.name + '</div></div>';
    }).join('') + locked.map(function (b) {
      return '<div class="badge-card locked r-' + esc(b.rarity || 'bronze') + '">' +
        '<div class="b-ico">' + esc(b.icon || '🏅') + '</div>' +
        '<div class="b-name">' + esc(b.name) + '</div>' +
        '<div class="b-rar">Låst</div></div>';
    }).join('');
  }

  // ═══════════ SKATTEKISTEN ═══════════
  function maybeShowChest() {
    if (chestOpen) return;
    if (!st.state.unseen.length) return;
    chestOpen = true;
    var n = st.state.unseen.length;
    var ov = document.createElement('div');
    ov.className = 'chest-overlay';
    ov.innerHTML = '<div class="chest-emoji">🧰</div>' +
      '<div class="chest-title">Du har ' + n + ' belønning' + (n > 1 ? 'er' : '') + '!</div>' +
      '<div class="chest-progress">Tryk på kisten for at åbne den</div>';
    document.body.appendChild(ov);
    HQ.chime('chest');
    ov.querySelector('.chest-emoji').addEventListener('click', function () {
      openChest(ov, st.state.unseen.slice());
    }, { once: true });
  }

  function openChest(ov, entries) {
    // Niveauer FØR (uden usete posteringer) til level-up-sammenligning
    var pre = HQ.computeState(st.ledger, { excludeUnseen: true });
    var post = st.state;
    var cards = [];

    // Gruppér quest-belønninger (xp+guld+mønt fra samme gennemførelse) til ét kort
    var groups = {}, order = [];
    entries.forEach(function (e) {
      if (e.type === 'badge') { cards.push({ kind: 'badge', e: e }); return; }
      if (e.type === 'sticker') { cards.push({ kind: 'sticker', e: e }); return; }
      if (e.type === 'cosmetic') return;
      var gk = e.questKey ? e.questKey + '|' + (e.earnedTs || e.ts) : 'misc|' + e._id;
      if (!groups[gk]) { groups[gk] = { name: e.name || '', icon: e.icon || '✨', xp: [], gold: 0, coin: 0 }; order.push(gk); }
      if (e.type === 'xp') groups[gk].xp.push({ skill: e.skill, amount: e.amount || 0 });
      if (e.type === 'gold') groups[gk].gold += (e.amount || 0);
      if (e.type === 'coin') groups[gk].coin += (e.amount || 0);
      if (e.realNote) groups[gk].real = e.realNote; // job-løn i rigtige penge (fase D)
    });
    var badgeCards = cards;
    cards = order.map(function (gk) { return { kind: 'quest', g: groups[gk] }; }).concat(badgeCards);

    // Level-ups (subskills, hovedskills, heltelevel)
    st.content.skillOrder.forEach(function (sid) {
      var a = HQ.skillLevelOf(st.content, pre, sid).level;
      var b = HQ.skillLevelOf(st.content, post, sid).level;
      if (b > a) cards.push({ kind: 'levelup', name: st.content.skills[sid].name, icon: st.content.skills[sid].icon, level: b });
    });
    var ha = HQ.heroLevel(pre.totalXp).level, hb = HQ.heroLevel(post.totalXp).level;
    if (hb > ha) cards.push({
      kind: 'hero', level: hb, tier: HQ.heroTier(hb),
      newTier: HQ.heroTier(hb).name !== HQ.heroTier(ha).name
    });

    // Kæledyrs-øjeblikke: æg → klækning → evolution
    var kidNow = st.kids[st.kidId] || {};
    if (!kidNow.pet && hb >= HQ.PET_EGG_LEVEL) {
      cards.push({ kind: 'egg', hatchesNow: hb >= HQ.PET_HATCH_LEVEL });
    }
    if ((kidNow.pet && kidNow.pet.stage === 'egg' && hb >= HQ.PET_HATCH_LEVEL) ||
        (!kidNow.pet && hb >= HQ.PET_HATCH_LEVEL)) {
      cards.push({ kind: 'hatch' });
    }
    if (kidNow.pet && kidNow.pet.type) {
      var stA = HQ.petStageFor(ha), stB = HQ.petStageFor(hb);
      if (stB > stA && stA >= 0) {
        cards.push({ kind: 'petEvolve', pet: kidNow.pet, stageIdx: stB });
      }
    }

    var i = 0;
    function show() {
      if (i >= cards.length) {
        // Markér alt set
        var upd = {};
        entries.forEach(function (e) { upd[e._id + '/unseen'] = false; });
        HQ.ref('ledger/' + st.kidId).update(upd).then(function () { chestOpen = false; });
        ov.remove();
        return;
      }
      var c = cards[i];
      var inner = '';
      if (c.kind === 'quest') {
        var lines = c.g.xp.map(function (x) {
          return '+' + x.amount + ' XP ' + esc(skillName(x.skill));
        });
        if (c.g.gold) lines.push('+' + c.g.gold + ' 🪙 guld');
        if (c.g.coin) lines.push('+' + c.g.coin + ' 💠');
        if (c.g.real) lines.push('💵 ' + esc(c.g.real) + ' — rigtig løn!');
        if (!lines.length) lines.push('Godt klaret!');
        inner = '<div class="r-ico">' + esc(c.g.icon) + '</div>' +
          '<div class="r-big">' + lines[0] + '</div>' +
          (lines.length > 1 ? '<div class="r-sub">' + lines.slice(1).join(' · ') + '</div>' : '') +
          '<div class="r-sub">' + esc(c.g.name) + '</div>';
        HQ.chime(c.g.gold ? 'coin' : 'xp');
        HQ.confetti({ count: 50 });
      } else if (c.kind === 'badge') {
        var rar = HQ.RARITY[c.e.rarity] || HQ.RARITY.bronze;
        inner = '<div class="r-ico">' + esc(c.e.icon || '🏅') + '</div>' +
          '<div class="r-big">NY BADGE!</div>' +
          '<div class="r-sub" style="font-weight:800;color:' + rar.color + '">' + esc(c.e.name) + ' · ' + rar.name + '</div>';
        HQ.chime('badge');
        HQ.confetti({ count: 110 });
      } else if (c.kind === 'sticker') {
        inner = '<div class="r-ico" style="font-size:3.6rem">' + esc(c.e.icon || '🌟') + '</div>' +
          '<div class="r-big">SJÆLDENT FUND!</div>' +
          '<div class="r-sub">Klistermærket <b>' + esc(c.e.name) + '</b> lå gemt i kisten!<br>Se dit album under Skills 📔</div>';
        HQ.chime('badge');
        HQ.confetti({ count: 120 });
      } else if (c.kind === 'levelup') {
        inner = '<div class="r-ico">' + esc(c.icon || '⭐') + '</div>' +
          '<div class="r-big">LEVEL ' + c.level + '!</div>' +
          '<div class="r-sub">' + esc(c.name) + ' steg i level!</div>';
        HQ.chime('levelup');
        HQ.confetti({ count: 130 });
      } else if (c.kind === 'egg') {
        // Ægget skrives til profilen i det øjeblik det vises
        HQ.ref('kids/' + st.kidId + '/pet').set({ stage: 'egg', foundTs: Date.now() });
        inner = '<div class="r-ico" style="font-size:3.6rem"><span class="egg-wobble" style="display:inline-block">🥚</span></div>' +
          '<div class="r-big">DU HAR FUNDET ET ÆG!</div>' +
          '<div class="r-sub">' + (c.hatchesNow ? 'Og det er allerede ved at klække…!' :
            'Pas godt på det — det klækker når du når heltelevel ' + HQ.PET_HATCH_LEVEL) + '</div>';
        HQ.chime('badge');
        HQ.confetti({ count: 90 });
      } else if (c.kind === 'hatch') {
        // Særligt kort: valget ER knappen — barnet vælger sit kæledyr
        ov.innerHTML = '<div class="reveal-card">' +
          '<div class="r-ico" style="font-size:3.6rem">✨🥚✨</div>' +
          '<div class="r-big">ÆGGET KLÆKKER!</div>' +
          '<div class="r-sub">Hvem gemmer sig derinde? Vælg dit kæledyr:</div>' +
          '<div class="hatch-choices">' +
          Object.keys(HQ.PETS).map(function (pid) {
            var p = HQ.PETS[pid];
            return '<button class="hatch-choice" data-hatch="' + pid + '">' +
              '<span class="hc-emoji">' + p.emojis[0] + '</span>' + esc(p.name) + '</button>';
          }).join('') +
          '</div></div>' +
          '<div class="chest-progress">' + (i + 1) + ' / ' + cards.length + '</div>';
        HQ.chime('levelup');
        HQ.confetti({ count: 150 });
        ov.addEventListener('click', function onHatch(e2) {
          var b = e2.target.closest('[data-hatch]');
          if (!b) return;
          ov.removeEventListener('click', onHatch);
          var type = b.getAttribute('data-hatch');
          HQ.ref('kids/' + st.kidId + '/pet').set({ type: type, hatchedTs: Date.now() });
          HQ.chime('badge');
          HQ.confetti({ count: 140 });
          // Velkomst-kort lige efter valget, så det store øjeblik får lov at lande
          cards.splice(i + 1, 0, { kind: 'petWelcome', type: type });
          i++; show();
        });
        return;
      } else if (c.kind === 'petWelcome') {
        var wdef = HQ.PETS[c.type] || {};
        inner = '<div class="r-ico" style="font-size:3.6rem">' + esc((wdef.emojis || ['🐾'])[0]) + '</div>' +
          '<div class="r-big">VELKOMMEN, LILLE ' + esc((wdef.name || 'VEN').toUpperCase()) + '!</div>' +
          '<div class="r-sub">Din nye ven vokser når DU vokser.<br>Giv den et navn under Skills 📔</div>';
        HQ.chime('badge');
        HQ.confetti({ count: 100 });
      } else if (c.kind === 'petEvolve') {
        var pdef = HQ.PETS[c.pet.type] || {};
        var stg = HQ.PET_STAGES[c.stageIdx];
        var last2 = i === cards.length - 1;
        ov.innerHTML =
          '<div class="evolve-wrap"><div class="evolve-rays"></div>' +
          '<div class="evolve-avatar">' + esc((pdef.emojis || ['🐾'])[c.stageIdx]) + '</div></div>' +
          '<div class="evolve-title">' + esc((c.pet.name || pdef.name || 'Dit kæledyr').toUpperCase()) + ' UDVIKLER SIG!</div>' +
          '<div class="evolve-sub">✨ Nu: <b>' + esc(stg.label) + '</b></div>' +
          '<button class="btn gold" style="margin-top:26px">' + (last2 ? 'Færdig ✨' : 'Næste →') + '</button>' +
          '<div class="chest-progress">' + (i + 1) + ' / ' + cards.length + '</div>';
        HQ.chime('levelup');
        HQ.confetti({ count: 180 });
        setTimeout(function () { HQ.chime('badge'); }, 900);
        ov.querySelector('.btn').addEventListener('click', function () { i++; show(); }, { once: true });
        return;
      } else {
        // EVOLVE-FEJRING: helten udvikler sig (heltelevel/tier-skift)
        var kid = st.kids[st.kidId] || {};
        var frame = equippedIn('frame');
        var last0 = i === cards.length - 1;
        ov.innerHTML =
          '<div class="evolve-wrap"><div class="evolve-rays"></div>' +
          '<div class="evolve-avatar' + (frame ? ' ' + frame.cls : '') + '" style="border-color:' + (c.tier.cls === 'tier-diamond' ? '#7fe7ff' : c.tier.cls === 'tier-gold' ? '#ffd54f' : c.tier.cls === 'tier-silver' ? '#c9d3e0' : '#b0764a') + '">' + esc(kid.avatar || '🦸‍♀️') + '</div></div>' +
          '<div class="evolve-title">DIN HELT UDVIKLER SIG!</div>' +
          '<div class="evolve-sub">' + c.tier.icon + ' Heltelevel <b>' + c.level + '</b> — ' + c.tier.name + '-helt' +
          (c.newTier ? '<br>✨ NY RANG: din ring er nu af ' + c.tier.name.toLowerCase() + '!' : '') + '</div>' +
          '<button class="btn gold" style="margin-top:26px">' + (last0 ? 'Færdig ✨' : 'Næste →') + '</button>' +
          '<div class="chest-progress">' + (i + 1) + ' / ' + cards.length + '</div>';
        HQ.chime('levelup');
        HQ.confetti({ count: 200 });
        setTimeout(function () { HQ.chime('badge'); }, 900);
        ov.querySelector('.btn').addEventListener('click', function () { i++; show(); }, { once: true });
        return;
      }
      var last = i === cards.length - 1;
      ov.innerHTML = '<div class="reveal-card' + (c.kind === 'badge' && c.e.rarity === 'legendary' ? ' r-legendary' : '') + '">' + inner + '</div>' +
        '<button class="btn gold" style="margin-top:26px">' + (last ? 'Færdig ✨' : 'Næste →') + '</button>' +
        '<div class="chest-progress">' + (i + 1) + ' / ' + cards.length + '</div>';
      ov.querySelector('.btn').addEventListener('click', function () { i++; show(); }, { once: true });
    }
    show();
  }

  // ═══════════ BUTIK ═══════════
  function renderShop() {
    if (!st.kidId) return;
    var box = $('#shop-grid');
    var gold = st.state.gold;
    var ids = Object.keys(st.shop).filter(function (id) { return st.shop[id].active !== false; });
    if (!ids.length) { box.innerHTML = '<div class="card empty" style="grid-column:1/-1">Butikken er tom — spørg en voksen 😄</div>'; return; }
    box.innerHTML = ids.map(function (id) {
      var it = st.shop[id];
      var afford = gold >= (it.cost || 0);
      return '<div class="shop-item">' +
        '<div class="s-ico">' + esc(it.icon || '🎁') + '</div>' +
        '<div class="s-title">' + esc(it.title) + '</div>' +
        (it.desc ? '<div class="s-desc">' + esc(it.desc) + '</div>' : '') +
        '<button class="btn gold small" data-buy="' + id + '"' + (afford ? '' : ' disabled') + '>🪙 ' + (it.cost || 0) + '</button>' +
      '</div>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-buy]');
    if (!btn) return;
    var itemId = btn.getAttribute('data-buy');
    var it = st.shop[itemId];
    if (!it) return;
    if (st.state.gold < (it.cost || 0)) { HQ.toast('Ikke nok guld endnu 🪙'); return; }
    if (!confirm('Køb "' + it.title + '" for ' + it.cost + ' guld?')) return;
    btn.disabled = true;
    var pRef = HQ.ref('purchases').push();
    pRef.set({
      kidId: st.kidId, itemId: itemId, title: it.title || '',
      icon: it.icon || '🎁', cost: it.cost || 0, status: 'pending', ts: Date.now()
    });
    HQ.ref('ledger/' + st.kidId).push({
      ts: Date.now(), type: 'gold', amount: -(it.cost || 0),
      name: 'Køb: ' + (it.title || ''), icon: it.icon || '🎁',
      source: 'purchase', purchaseId: pRef.key, unseen: false
    });
    HQ.chime('coin');
    HQ.toast('🎁 Købt! En voksen skal nu levere den 😄');
    HQ.confetti({ count: 70 });
  });

  // ═══════════ STYLE-BUTIK (avatar-kosmetik for guld/💠) ═══════════
  function renderStyleShop() {
    var box = $('#style-grid');
    if (!box || !st.kidId) return;
    var kid = st.kids[st.kidId] || {};
    box.innerHTML = HQ.COSMETICS.map(function (c) {
      var owned = !!st.state.cosmetics[c.id];
      var inUse = owned && (kid.equipped || {})[c.slot] === c.id;
      var priceTxt = c.gold ? '🪙 ' + c.gold : '💠 ' + c.coin;
      var afford = c.gold ? st.state.gold >= c.gold : st.state.coin >= c.coin;
      var btn;
      if (!owned) btn = '<button class="btn gold small" data-buy-style="' + c.id + '"' + (afford ? '' : ' disabled') + '>' + priceTxt + '</button>';
      else if (inUse) btn = '<button class="btn small inuse" data-equip="' + c.id + '">Brugt ✔</button>';
      else btn = '<button class="btn small" data-equip="' + c.id + '">Brug</button>';
      return '<div class="shop-item style-item">' +
        '<div class="s-ico">' + esc(c.icon) + '</div>' +
        '<div class="s-title">' + esc(c.name) + '</div>' +
        (owned ? '<div class="s-owned">✓ Ejet</div>' : '') +
        btn + '</div>';
    }).join('');
  }

  document.addEventListener('click', function (e) {
    var bs = e.target.closest('[data-buy-style]');
    if (bs) {
      var c = cosmeticById(bs.getAttribute('data-buy-style'));
      if (!c || st.state.cosmetics[c.id]) return;
      var canPay = c.gold ? st.state.gold >= c.gold : st.state.coin >= c.coin;
      if (!canPay) { HQ.toast(c.gold ? 'Ikke nok guld endnu 🪙' : 'Kræver event-mønter 💠 — de kommer fra særlige challenges'); return; }
      if (!confirm('Køb "' + c.name + '" for ' + (c.gold ? c.gold + ' guld' : c.coin + ' 💠') + '?')) return;
      var lRef = HQ.ref('ledger/' + st.kidId);
      lRef.push({ ts: Date.now(), type: 'cosmetic', item: c.id, slot: c.slot, name: c.name, icon: c.icon, source: 'purchase', unseen: false });
      lRef.push({ ts: Date.now(), type: c.gold ? 'gold' : 'coin', amount: -(c.gold || c.coin), name: 'Køb: ' + c.name, icon: c.icon, source: 'purchase', unseen: false });
      HQ.ref('kids/' + st.kidId + '/equipped/' + c.slot).set(c.id);
      HQ.chime('coin');
      HQ.confetti({ count: 60 });
      HQ.toast('🎨 ' + c.name + ' er dit — og taget i brug!');
      return;
    }
    var eq = e.target.closest('[data-equip]');
    if (eq) {
      var c2 = cosmeticById(eq.getAttribute('data-equip'));
      if (!c2 || !st.state.cosmetics[c2.id]) return;
      var kid = st.kids[st.kidId] || {};
      var cur = (kid.equipped || {})[c2.slot];
      HQ.ref('kids/' + st.kidId + '/equipped/' + c2.slot).set(cur === c2.id ? null : c2.id);
      HQ.chime('pop');
    }
  });

  // ═══════════ KLISTERMÆRKE-ALBUM ═══════════
  function renderStickers() {
    var box = $('#sticker-album');
    if (!box) return;
    var owned = 0;
    box.innerHTML = HQ.STICKERS.map(function (s) {
      var has = !!st.state.stickers[s.id];
      if (has) owned++;
      return '<div class="sticker ' + (has ? 'owned' : 'missing') + '">' +
        (has ? '<span>' + esc(s.icon) + '</span><span class="st-name">' + esc(s.name) + '</span>'
             : '<span class="st-q">?</span>') +
      '</div>';
    }).join('');
    $('#sticker-count').textContent = owned + ' / ' + HQ.STICKERS.length;
  }

  function renderPurchases() {
    var box = $('#my-purchases');
    var ids = Object.keys(st.purchases).sort(function (a, b) { return st.purchases[b].ts - st.purchases[a].ts; });
    if (!ids.length) { box.innerHTML = '<div class="empty">Ingen køb endnu</div>'; return; }
    var STATUS = { pending: ['⏳', 'Venter på levering'], delivered: ['✅', 'Leveret'], cancelled: ['↩️', 'Annulleret (guld retur)'] };
    box.innerHTML = ids.map(function (id) {
      var p = st.purchases[id], s = STATUS[p.status] || ['❔', p.status];
      return '<div class="log-row"><span class="log-ico">' + esc(p.icon) + '</span>' +
        '<div class="log-main"><b>' + esc(p.title) + '</b> · 🪙 ' + p.cost +
        '<div class="log-time">' + s[0] + ' ' + s[1] + ' · ' + HQ.fmtTs(p.ts) + '</div></div></div>';
    }).join('');
  }

  // ═══════════ LOG ═══════════
  function renderLog() {
    var box = $('#adventure-log');
    var rows = [];
    Object.keys(st.ledger).forEach(function (id) {
      var e = st.ledger[id];
      if (!e || !e.type) return;
      if (e.type === 'xp') rows.push({ ts: e.ts, ico: '✨', html: '+' + e.amount + ' XP <b>' + esc(skillName(e.skill)) + '</b> — ' + esc(e.name || '') });
      else if (e.type === 'badge') rows.push({ ts: e.ts, ico: '🏅', html: 'Ny badge: <b>' + esc(e.name) + '</b>' });
      else if (e.type === 'gold' && e.amount < 0) rows.push({ ts: e.ts, ico: '🛒', html: esc(e.name || 'Køb') + ' · ' + e.amount + ' 🪙' });
      else if (e.type === 'gold') rows.push({ ts: e.ts, ico: '🪙', html: '+' + e.amount + ' guld — ' + esc(e.name || '') });
      else if (e.type === 'coin') rows.push({ ts: e.ts, ico: '💠', html: '+' + e.amount + ' 💠 — ' + esc(e.name || '') });
      else if (e.type === 'job') rows.push({ ts: e.ts, ico: '📌', html: esc(e.name || 'Job udført') + (e.realNote ? ' · 💵 ' + esc(e.realNote) : '') });
    });
    Object.keys(st.completions).forEach(function (pk) {
      Object.keys(st.completions[pk]).forEach(function (qk) {
        var c = st.completions[pk][qk];
        if (c.status === 'pending') rows.push({ ts: c.ts, ico: '⏳', html: '<b>' + esc(c.taskTitle) + '</b> venter på godkendelse' });
      });
    });
    if (!rows.length) { box.innerHTML = '<div class="empty">Din historie starter her…</div>'; return; }
    rows.sort(function (a, b) { return b.ts - a.ts; });
    box.innerHTML = rows.slice(0, 50).map(function (r) {
      return '<div class="log-row"><span class="log-ico">' + r.ico + '</span>' +
        '<div class="log-main">' + r.html + '<div class="log-time">' + HQ.fmtTs(r.ts) + '</div></div></div>';
    }).join('');
  }

  // ═══════════ AVATAR-VÆLGER ═══════════
  $('#avatar-btn').addEventListener('click', function () {
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal"><h2>Vælg din avatar</h2>' +
      '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:12px">' +
      AVATARS.map(function (a) {
        return '<button class="icon-btn" style="width:100%;height:52px;font-size:1.6rem" data-av="' + a + '">' + a + '</button>';
      }).join('') +
      '</div><div class="modal-actions"><button class="btn ghost small" data-close>Luk</button></div></div>';
    document.body.appendChild(bg);
    bg.addEventListener('click', function (e) {
      if (e.target === bg || e.target.closest('[data-close]')) { bg.remove(); return; }
      var b = e.target.closest('[data-av]');
      if (b) {
        HQ.ref('kids/' + st.kidId + '/avatar').set(b.getAttribute('data-av'));
        bg.remove();
        HQ.toast('Ny avatar! ' + b.getAttribute('data-av'));
      }
    });
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
