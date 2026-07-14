/* HverdagsHelte — kerne v2: Firebase, modul-motor, ledger, streaks, badges, spilmatematik.
   Se ARKITEKTUR.md — kontobogen (ledger) er sandheden, moduler er data. */
(function () {
  'use strict';

  var ROOT = 'liferpg';

  // ---------- Firebase ----------
  var db = null;
  function initFirebase() {
    if (db) return db;
    if (!window.FIREBASE_CONFIG || !window.firebase) return null;
    try {
      firebase.initializeApp(window.FIREBASE_CONFIG);
      db = firebase.database();
      return db;
    } catch (e) {
      console.error('Firebase init fejlede', e);
      return null;
    }
  }

  // ---------- v3: Auth + organisationer ----------
  // Alt familie-data bor under hq/orgs/{orgId}. HQ.ref() er org-scoped,
  // HQ.raw() er absolut (hq/users, legacy liferpg til migrering m.m.).
  var currentOrgId = null;
  function auth() {
    initFirebase();
    return firebase.auth ? firebase.auth() : null;
  }
  function setOrg(orgId) { currentOrgId = orgId; }
  function getOrg() { return currentOrgId; }
  function raw(path) {
    var d = initFirebase();
    return d ? d.ref(path) : null;
  }
  function ref(path) {
    var d = initFirebase();
    if (!d) return null;
    if (!currentOrgId) throw new Error('HQ.ref kaldt før organisation er valgt');
    return d.ref('hq/orgs/' + currentOrgId + (path ? '/' + path : ''));
  }
  // Dansk oversættelse af de mest almindelige auth-fejl
  function authErrorText(e) {
    var code = (e && e.code) || '';
    if (code.indexOf('invalid-email') >= 0) return 'Ugyldig e-mailadresse';
    if (code.indexOf('email-already-in-use') >= 0) return 'Der findes allerede en konto med den e-mail — log ind i stedet';
    if (code.indexOf('weak-password') >= 0) return 'Kodeordet skal være mindst 6 tegn';
    if (code.indexOf('wrong-password') >= 0 || code.indexOf('invalid-credential') >= 0 || code.indexOf('invalid-login-credentials') >= 0) return 'Forkert e-mail eller kodeord';
    if (code.indexOf('user-not-found') >= 0) return 'Ingen konto med den e-mail — opret en først';
    if (code.indexOf('too-many-requests') >= 0) return 'For mange forsøg — vent lidt og prøv igen';
    if (code.indexOf('network') >= 0) return 'Netværksfejl — tjek internettet';
    if (code.indexOf('configuration-not-found') >= 0 || code.indexOf('operation-not-allowed') >= 0) return 'Login er ikke aktiveret i Firebase endnu (se SETUP.md trin V3)';
    return 'Der gik noget galt (' + code + ')';
  }
  // Audit-log: hvem gjorde hvad hvornår (jf. PLATFORM_VISION §1.7)
  function audit(action, detail) {
    try {
      var u = auth() && auth().currentUser;
      ref('audit').push({ ts: Date.now(), uid: u ? u.uid : '?', email: u ? (u.email || 'enhed') : '?', action: action, detail: detail || '' });
    } catch (e) { /* audit må aldrig vælte en handling */ }
  }

  // RTDB-nøgler må ikke indeholde . # $ / [ ]
  function safeKey(s) { return String(s).replace(/[.#$/\[\]]/g, '_'); }

  // ---------- Dato & perioder ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function isoWeekKey(d) {
    d = d ? new Date(d) : new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    var week1 = new Date(d.getFullYear(), 0, 4);
    var week = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    return d.getFullYear() + '-W' + pad(week);
  }
  function monthKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1);
  }
  function periodKeyFor(period, d) {
    return period === 'day' ? dateKey(d) : period === 'week' ? isoWeekKey(d) : monthKey(d);
  }
  function stepBack(period, d) {
    var x = new Date(d);
    if (period === 'day') x.setDate(x.getDate() - 1);
    else if (period === 'week') x.setDate(x.getDate() - 7);
    else x.setMonth(x.getMonth() - 1);
    return x;
  }
  var DAY_NAMES = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  var DAY_SHORT = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
  var PERIOD_NAMES = { day: 'dag', week: 'uge', month: 'måned' };

  // ---------- Spilmatematik ----------
  // Subskill: L→L+1 kræver 100+25·(L−1). Hovedskill ganges med antal subskills ("pensum-effekten").
  function levelFromXp(xp, mult) {
    mult = Math.max(1, mult || 1);
    xp = Math.max(0, Math.floor(xp || 0));
    var level = 1, need = 100 * mult;
    while (xp >= need) { xp -= need; level++; need = (100 + (level - 1) * 25) * mult; }
    return { level: level, into: xp, need: need, pct: Math.round(100 * xp / need) };
  }
  function heroLevel(totalXp) {
    var xp = Math.max(0, Math.floor(totalXp || 0));
    var level = 1, need = 250;
    while (xp >= need) { xp -= need; level++; need = 250 + (level - 1) * 75; }
    return { level: level, into: xp, need: need, pct: Math.round(100 * xp / need) };
  }
  function heroTier(level) {
    if (level >= 20) return { name: 'Diamant', cls: 'tier-diamond', icon: '💎' };
    if (level >= 10) return { name: 'Guld', cls: 'tier-gold', icon: '🏆' };
    if (level >= 5)  return { name: 'Sølv', cls: 'tier-silver', icon: '🥈' };
    return { name: 'Bronze', cls: 'tier-bronze', icon: '🥉' };
  }
  var RARITY = {
    bronze:    { name: 'Bronze',     color: '#b0764a' },
    silver:    { name: 'Sølv',       color: '#c9d3e0' },
    gold:      { name: 'Guld',       color: '#ffd54f' },
    legendary: { name: 'Legendarisk', color: '#7fe7ff' }
  };

  // ---------- Style-butik (avatar-kosmetik, købes for guld/💠) ----------
  var COSMETICS = [
    { id: 'bg_hav',        slot: 'bg',    name: 'Hav-tema',           icon: '🌊', cls: 'bg-hav',        gold: 60 },
    { id: 'bg_skov',       slot: 'bg',    name: 'Skov-tema',          icon: '🌲', cls: 'bg-skov',       gold: 60 },
    { id: 'bg_solnedgang', slot: 'bg',    name: 'Solnedgangs-tema',   icon: '🌅', cls: 'bg-solnedgang', gold: 80 },
    { id: 'bg_galakse',    slot: 'bg',    name: 'Galakse-tema',       icon: '🌌', cls: 'bg-galakse',    gold: 150 },
    { id: 'frame_flamme',  slot: 'frame', name: 'Flamme-ring',        icon: '🔥', cls: 'frame-flamme',  gold: 120 },
    { id: 'frame_regnbue', slot: 'frame', name: 'Regnbue-ring',       icon: '🌈', cls: 'frame-regnbue', gold: 150 },
    { id: 'frame_stjerne', slot: 'frame', name: 'Stjerne-ring',       icon: '✨', cls: 'frame-stjerne', gold: 200 },
    { id: 'frame_krystal', slot: 'frame', name: 'Krystal-ring',       icon: '💠', cls: 'frame-krystal', coin: 30 },
    { id: 'title_flittig', slot: 'title', name: 'Titel: den Flittige',      icon: '📜', text: 'den Flittige',      gold: 80 },
    { id: 'title_quest',   slot: 'title', name: 'Titel: Questmesteren',     icon: '📜', text: 'Questmesteren',     gold: 120 },
    { id: 'title_legende', slot: 'title', name: 'Titel: den Legendariske',  icon: '📜', text: 'den Legendariske',  coin: 40 }
  ];
  // ---------- Kæledyr (Finch/Joon-mekanikken: vokser af barnets fremgang) ----------
  // Æg findes ved heltelevel 2, klækker ved 3, udvikler sig ved 6/10/20.
  var PET_STAGES = [
    { minLevel: 3,  label: 'Baby',        cls: 'pet-baby' },
    { minLevel: 6,  label: 'Junior',      cls: 'pet-junior' },
    { minLevel: 10, label: 'Voksen',      cls: 'pet-voksen' },
    { minLevel: 20, label: 'Legendarisk', cls: 'pet-legend' }
  ];
  var PETS = {
    drage:       { name: 'Drage',      emojis: ['🐲', '🐲', '🐉', '🐉'] },
    enhjoerning: { name: 'Enhjørning', emojis: ['🐴', '🦄', '🦄', '🦄'] },
    ugle:        { name: 'Ugle',       emojis: ['🐣', '🦉', '🦉', '🦉'] }
  };
  var PET_EGG_LEVEL = 2, PET_HATCH_LEVEL = 3;
  // Returnerer stadie-index (0-3) for et klækket kæledyr, eller -1 hvis under klække-level
  function petStageFor(heroLvl) {
    var idx = -1;
    PET_STAGES.forEach(function (s, i) { if (heroLvl >= s.minLevel) idx = i; });
    return idx;
  }
  function petView(pet, heroLvl) {
    if (!pet || !pet.type || !PETS[pet.type]) return null;
    var idx = Math.max(0, petStageFor(heroLvl));
    var def = PETS[pet.type];
    var next = PET_STAGES[idx + 1] || null;
    return {
      emoji: def.emojis[idx], typeName: def.name, name: pet.name || def.name,
      stage: PET_STAGES[idx], stageIdx: idx,
      next: next ? { label: next.label, level: next.minLevel } : null
    };
  }

  // Klistermærke-album (tilfældige drops fra godkendte quests, max 1/dag)
  var STICKERS = [
    { id: 'st_enhjorning', name: 'Enhjørningen', icon: '🦄' },
    { id: 'st_drage',      name: 'Dragen',       icon: '🐉' },
    { id: 'st_fe',         name: 'Feen',         icon: '🧚' },
    { id: 'st_havfrue',    name: 'Havfruen',     icon: '🧜‍♀️' },
    { id: 'st_orn',        name: 'Ørnen',        icon: '🦅' },
    { id: 'st_ulv',        name: 'Ulven',        icon: '🐺' },
    { id: 'st_ugle',       name: 'Uglen',        icon: '🦉' },
    { id: 'st_skildpadde', name: 'Skildpadden',  icon: '🐢' },
    { id: 'st_raev',       name: 'Ræven',        icon: '🦊' },
    { id: 'st_delfin',     name: 'Delfinen',     icon: '🐬' },
    { id: 'st_sommerfugl', name: 'Sommerfuglen', icon: '🦋' },
    { id: 'st_stjerne',    name: 'Ønskestjernen', icon: '🌟' }
  ];

  // ---------- Modul-motor ----------
  // Samler alle aktiverede moduler til ét indholds-katalog.
  function windowState(mod) {
    if (!mod.window || !mod.window.from) return 'always';
    var today = dateKey();
    if (today < mod.window.from) return 'before';
    if (mod.window.to && today > mod.window.to) return 'after';
    return 'active';
  }
  function assemble(modulesObj) {
    var c = { skills: {}, skillOrder: [], quests: [], badges: [], streaks: [], modules: {} };
    Object.keys(modulesObj || {}).sort().forEach(function (mid) {
      var mod = modulesObj[mid];
      if (!mod || mod.enabled === false) return;
      var ws = windowState(mod);
      c.modules[mid] = { name: mod.name, window: mod.window || null, state: ws };
      (mod.skills || []).forEach(function (s) {
        if (!s || !s.id) return;
        if (!c.skills[s.id]) {
          c.skills[s.id] = Object.assign({}, s, { module: mid });
          c.skillOrder.push(s.id);
        }
      });
      if (ws === 'active' || ws === 'always') {
        (mod.quests || []).forEach(function (q, i) {
          if (!q || !q.id) return;
          c.quests.push(Object.assign({}, q, { module: mid, index: i, key: safeKey(mid + '__' + q.id) }));
        });
      }
      (mod.badges || []).forEach(function (b) {
        if (!b || !b.id) return;
        c.badges.push(Object.assign({}, b, { module: mid, key: safeKey('b_' + mid + '__' + b.id) }));
      });
      (mod.streaks || []).forEach(function (s) {
        if (!s || !s.id) return;
        c.streaks.push(Object.assign({}, s, { module: mid, key: safeKey(mid + '__' + s.id) }));
      });
    });
    return c;
  }
  function childrenOf(content, skillId) {
    return content.skillOrder.filter(function (id) { return content.skills[id].parent === skillId; });
  }
  function mainSkills(content) {
    return content.skillOrder.filter(function (id) { return !content.skills[id].parent; });
  }

  // ---------- Ledger → saldi ----------
  // state = { xp: {skillId: direkteXp}, gold, coin, badges: {badgeKey: entry},
  //           events: [{earnedTs, questKey, module, skills[]}], totalXp }
  function computeState(ledgerObj, opts) {
    opts = opts || {};
    var st = { xp: {}, gold: 0, coin: 0, badges: {}, cosmetics: {}, stickers: {}, events: [], totalXp: 0, unseen: [] };
    var evMap = {};
    Object.keys(ledgerObj || {}).forEach(function (id) {
      var e = ledgerObj[id];
      if (!e || !e.type) return;
      if (e.unseen) st.unseen.push(Object.assign({ _id: id }, e));
      if (opts.excludeUnseen && e.unseen) return;
      if (e.type === 'xp') {
        st.xp[e.skill] = (st.xp[e.skill] || 0) + (e.amount || 0);
        st.totalXp += (e.amount || 0);
        if (e.questKey) {
          var k = e.questKey + '|' + (e.earnedTs || e.ts);
          if (!evMap[k]) evMap[k] = { earnedTs: e.earnedTs || e.ts, questKey: e.questKey, module: e.module || '', skills: [] };
          evMap[k].skills.push(e.skill);
        }
      } else if (e.type === 'gold') st.gold += (e.amount || 0);
      else if (e.type === 'coin') st.coin += (e.amount || 0);
      else if (e.type === 'badge') st.badges[id] = e;
      else if (e.type === 'cosmetic') st.cosmetics[e.item] = e;
      else if (e.type === 'sticker') st.stickers[e.item] = e;
    });
    st.events = Object.keys(evMap).map(function (k) { return evMap[k]; })
      .sort(function (a, b) { return a.earnedTs - b.earnedTs; });
    st.unseen.sort(function (a, b) { return a.ts - b.ts; });
    return st;
  }
  // XP inkl. roll-up + level (hovedskills skaleres med antal subskills)
  function skillXpOf(content, state, skillId) {
    var kids = childrenOf(content, skillId);
    var xp = state.xp[skillId] || 0;
    kids.forEach(function (c) { xp += (state.xp[c] || 0); });
    return xp;
  }
  function skillLevelOf(content, state, skillId) {
    var kids = childrenOf(content, skillId);
    return levelFromXp(skillXpOf(content, state, skillId), kids.length || 1);
  }

  // ---------- Streak-motor ----------
  function eventMatches(scope, ev) {
    if (!scope || scope === 'any' || scope.any) return true;
    if (scope.module) return ev.module === scope.module;
    if (scope.skill) {
      return ev.skills.some(function (s) {
        return s === scope.skill || (s && s.indexOf(scope.skill + '.') === 0);
      });
    }
    return false;
  }
  // Distinkte quest-gennemførelser pr. periode
  function computeStreak(rule, state, now) {
    now = now || new Date();
    var counts = {};
    state.events.forEach(function (ev) {
      if (!eventMatches(rule.scope, ev)) return;
      var pk = periodKeyFor(rule.period, new Date(ev.earnedTs));
      counts[pk] = (counts[pk] || 0) + 1;
    });
    var target = rule.target || 1;
    var curPk = periodKeyFor(rule.period, now);
    var progress = counts[curPk] || 0;

    // Nuværende streak: gå baglæns fra i dag. Igangværende periode tæller hvis mødt,
    // men knækker ikke streaken hvis den (endnu) ikke er mødt.
    var current = 0;
    var cursor = new Date(now);
    if ((counts[periodKeyFor(rule.period, cursor)] || 0) >= target) current++;
    cursor = stepBack(rule.period, cursor);
    for (var i = 0; i < 800; i++) {
      if ((counts[periodKeyFor(rule.period, cursor)] || 0) >= target) { current++; cursor = stepBack(rule.period, cursor); }
      else break;
    }
    // Bedste streak nogensinde: scan fra første event
    var best = current;
    if (state.events.length) {
      var run = 0, c2 = new Date(state.events[0].earnedTs);
      var endPk = periodKeyFor(rule.period, now);
      for (var j = 0; j < 800; j++) {
        var pk2 = periodKeyFor(rule.period, c2);
        if ((counts[pk2] || 0) >= target) { run++; if (run > best) best = run; }
        else run = 0;
        if (pk2 === endPk) break;
        c2 = period_stepFwd(rule.period, c2);
      }
    }
    return { current: current, best: best, progress: progress, target: target, periodName: PERIOD_NAMES[rule.period] || rule.period };
  }
  function period_stepFwd(period, d) {
    var x = new Date(d);
    if (period === 'day') x.setDate(x.getDate() + 1);
    else if (period === 'week') x.setDate(x.getDate() + 7);
    else x.setMonth(x.getMonth() + 1);
    return x;
  }

  // ---------- Badge-evaluering ----------
  // Returnerer liste af badges der ER optjent men mangler i ledgeren (skal tildeles).
  function pendingBadges(content, state) {
    var out = [];
    function counterCount(scope) {
      return state.events.filter(function (ev) { return eventMatches(scope, ev); }).length;
    }
    content.badges.forEach(function (b) {
      if (state.badges[b.key]) return;
      var r = b.rule || {};
      var earned = false;
      if (r.type === 'counter') earned = counterCount(r.scope || { module: b.module }) >= (r.count || 1);
      else if (r.type === 'milestone') earned = skillLevelOf(content, state, r.skill).level >= (r.level || 1);
      if (earned) out.push({ key: b.key, badge: b });
    });
    // Klistermærke-albummet fuldt → legendarisk badge
    if (!state.badges['b_core__album'] && STICKERS.every(function (s) { return state.stickers[s.id]; })) {
      out.push({ key: 'b_core__album', badge: {
        id: 'album', name: 'Klistermærke-mesteren', icon: '📔', rarity: 'legendary', module: 'core'
      } });
    }
    content.streaks.forEach(function (s) {
      var st = computeStreak(s, state);
      (s.milestones || []).forEach(function (m) {
        var key = safeKey('b_' + s.module + '__' + s.id + '_x' + m);
        if (state.badges[key]) return;
        if (st.best >= m) {
          out.push({ key: key, badge: {
            id: s.id + '_x' + m, name: s.name + ' ×' + m, icon: s.icon || '🔥',
            rarity: m >= 100 ? 'legendary' : m >= 25 ? 'gold' : m >= 10 ? 'silver' : 'bronze',
            module: s.module
          } });
        }
      });
    });
    return out;
  }

  // ---------- Lyd (WebAudio, ingen filer) ----------
  var audioCtx = null;
  function soundOn() { return localStorage.getItem('hq_mute') !== '1'; }
  function toggleSound() { localStorage.setItem('hq_mute', soundOn() ? '1' : '0'); return soundOn(); }
  function tone(freq, t0, dur, type, vol) {
    var o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol || 0.18, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function chime(kind) {
    if (!soundOn()) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var t = audioCtx.currentTime;
      if (kind === 'coin') { tone(988, t, 0.09, 'square', 0.08); tone(1319, t + 0.08, 0.22, 'square', 0.08); }
      else if (kind === 'xp') { tone(523, t, 0.12, 'triangle'); tone(784, t + 0.1, 0.2, 'triangle'); }
      else if (kind === 'badge') { tone(523, t, 0.14, 'triangle'); tone(659, t + 0.12, 0.14, 'triangle'); tone(784, t + 0.24, 0.14, 'triangle'); tone(1047, t + 0.36, 0.4, 'triangle', 0.22); }
      else if (kind === 'levelup') { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, t + i * 0.09, 0.25, 'triangle', 0.2); }); }
      else if (kind === 'chest') { tone(196, t, 0.3, 'sawtooth', 0.06); tone(262, t + 0.15, 0.35, 'triangle', 0.12); }
      else tone(660, t, 0.12, 'sine', 0.1);
    } catch (e) { /* lyd er pynt — fejl må aldrig vælte appen */ }
  }

  // ---------- DOM-helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtTs(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' kl. ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function rewardChips(rewards) {
    return (rewards || []).map(function (r) {
      if (r.skill) return '<span class="chip xp">+' + (r.xp || 0) + ' XP</span>';
      if (r.gold) return '<span class="chip gold">+' + r.gold + ' 🪙</span>';
      if (r.eventCoin || r.coin) return '<span class="chip coin">+' + (r.eventCoin || r.coin) + ' 💠</span>';
      return '';
    }).join('');
  }

  // ---------- Toast ----------
  var toastTimer = null;
  function toast(msg, ms) {
    var t = $('#hq-toast');
    if (!t) { t = document.createElement('div'); t.id = 'hq-toast'; document.body.appendChild(t); }
    t.innerHTML = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 2600);
  }

  // ---------- Konfetti ----------
  function confetti(opts) {
    opts = opts || {};
    var canvas = document.createElement('canvas');
    canvas.className = 'hq-confetti';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var colors = ['#ffd54f', '#4fc3f7', '#f06292', '#81c784', '#ba68c8', '#ff8a65'];
    var parts = [];
    for (var i = 0; i < (opts.count || 120); i++) {
      parts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 14, vy: -6 - Math.random() * 9,
        size: 5 + Math.random() * 7, color: colors[i % colors.length],
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3
      });
    }
    var frames = 0;
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      frames++;
      if (frames < 130) requestAnimationFrame(tick);
      else canvas.remove();
    })();
  }

  // ---------- PIN-tastatur ----------
  function pinPad(container, opts) {
    opts = opts || {};
    var len = opts.length || 4;
    var pin = '';
    container.innerHTML =
      '<div class="pin-dots">' +
      Array.apply(null, Array(len)).map(function () { return '<span class="pin-dot"></span>'; }).join('') +
      '</div><div class="pin-grid">' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 'slet', 0, 'ok'].map(function (k) {
        if (k === 'slet') return '<button class="pin-key pin-del" data-k="del">⌫</button>';
        if (k === 'ok') return '<button class="pin-key pin-ok" data-k="ok">✓</button>';
        return '<button class="pin-key" data-k="' + k + '">' + k + '</button>';
      }).join('') + '</div>';
    var dots = $all('.pin-dot', container);
    function render() { dots.forEach(function (d, i) { d.classList.toggle('filled', i < pin.length); }); }
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.pin-key');
      if (!btn) return;
      var k = btn.getAttribute('data-k');
      if (k === 'del') pin = pin.slice(0, -1);
      else if (k === 'ok') { if (pin.length === len && opts.onSubmit) opts.onSubmit(pin); return; }
      else if (pin.length < len) {
        pin += k;
        if (pin.length === len && opts.autoSubmit && opts.onSubmit) {
          var p = pin;
          setTimeout(function () { opts.onSubmit(p); }, 150);
        }
      }
      render();
    });
    return {
      clear: function () { pin = ''; render(); },
      shake: function () {
        var d = $('.pin-dots', container);
        d.classList.add('shake');
        setTimeout(function () { d.classList.remove('shake'); }, 500);
        pin = ''; render();
      }
    };
  }

  window.HQ = {
    ROOT: ROOT, initFirebase: initFirebase, ref: ref, raw: raw, safeKey: safeKey,
    auth: auth, setOrg: setOrg, getOrg: getOrg, authErrorText: authErrorText, audit: audit,
    dateKey: dateKey, isoWeekKey: isoWeekKey, monthKey: monthKey,
    periodKeyFor: periodKeyFor, DAY_NAMES: DAY_NAMES, DAY_SHORT: DAY_SHORT,
    levelFromXp: levelFromXp, heroLevel: heroLevel, heroTier: heroTier, RARITY: RARITY,
    COSMETICS: COSMETICS, STICKERS: STICKERS,
    PETS: PETS, PET_STAGES: PET_STAGES, PET_EGG_LEVEL: PET_EGG_LEVEL, PET_HATCH_LEVEL: PET_HATCH_LEVEL,
    petStageFor: petStageFor, petView: petView,
    windowState: windowState, assemble: assemble, childrenOf: childrenOf, mainSkills: mainSkills,
    computeState: computeState, skillXpOf: skillXpOf, skillLevelOf: skillLevelOf,
    computeStreak: computeStreak, pendingBadges: pendingBadges,
    soundOn: soundOn, toggleSound: toggleSound, chime: chime,
    $: $, $all: $all, esc: esc, fmtTs: fmtTs, rewardChips: rewardChips,
    toast: toast, confetti: confetti, pinPad: pinPad
  };
})();
