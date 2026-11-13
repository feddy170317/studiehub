/* Studiehub — fjernstyret popup til én bestemt elev (bruges af /lukas-kommandoen).
   Udløses ved at skrive studiehub/students/{id}/popup = { ts } (tools/lukas.py).
   Popup'en vises, til eleven har bekræftet; bekræftelsen gemmes som popupAck = { ts, bekraeftet },
   så den lukker på alle hans enheder på én gang. Kræver sh-auth.js (ShAuth) på siden. */
(function () {
  'use strict';
  if (!window.ShAuth || !window.firebase) return;

  var css =
    '#sh-pop{position:fixed;inset:0;z-index:1000000;display:flex;align-items:center;justify-content:center;padding:16px;' +
    'background:rgba(15,23,42,.82);backdrop-filter:blur(6px);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
    '#sh-pop .k{position:relative;width:100%;max-width:420px;background:#fff;color:#0f172a;border-radius:18px;padding:26px 22px 22px;' +
    'text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:shp .35s cubic-bezier(.2,1.6,.4,1)}' +
    '@keyframes shp{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}' +
    '#sh-pop .i{font-size:2.8rem;line-height:1}#sh-pop h2{margin:8px 0 6px;font-size:1.35rem;color:#0f172a;-webkit-text-fill-color:#0f172a;background:none}' +
    '#sh-pop p{margin:0 0 16px;color:#475569;font-size:.95rem}' +
    '#sh-pop label{display:flex;gap:10px;align-items:center;justify-content:center;font-weight:700;margin-bottom:16px;cursor:pointer}' +
    '#sh-pop input{width:20px;height:20px}' +
    '#sh-pop .r{display:flex;gap:10px;justify-content:center;min-height:46px}' +
    '#sh-pop button{border:0;border-radius:12px;padding:12px 18px;font:inherit;font-weight:800;cursor:pointer}' +
    '#sh-pop .ja{background:#6366f1;color:#fff;opacity:1}#sh-pop .ja:disabled{background:#cbd5e1;cursor:not-allowed}' +
    '#sh-pop .nej{background:#f1f5f9;color:#0f172a;transition:transform .15s}' +
    '#sh-pop .m{min-height:1.2em;margin-top:12px;color:#dc2626;font-weight:700;font-size:.9rem}';

  var NEJ = ['Forkert svar.', 'Prøv igen.', 'Systemet er uenigt.', 'Det er ikke en mulighed.', 'Nice try, Lukas.'];
  var el = null, vist = null, sub = null, subId = null;

  function luk() { if (el) { el.remove(); el = null; } vist = null; }

  function vis(id, ts) {
    if (vist === ts) return;
    luk(); vist = ts;
    if (!document.getElementById('sh-pop-css')) {
      var s = document.createElement('style'); s.id = 'sh-pop-css'; s.textContent = css;
      document.head.appendChild(s);
    }
    el = document.createElement('div'); el.id = 'sh-pop';
    el.innerHTML =
      '<div class="k" role="dialog" aria-modal="true">' +
        '<div class="i">🛑</div>' +
        '<h2>Sikkerhedstjek</h2>' +
        '<p>Før du kan fortsætte på Studiehub, skal du bekræfte følgende.</p>' +
        '<label><input type="checkbox"> Jeg bekræfter, at jeg er et dillerfjæs</label>' +
        '<div class="r"><button class="ja" disabled>Fortsæt</button><button class="nej">Nej</button></div>' +
        '<div class="m"></div>' +
      '</div>';
    document.documentElement.appendChild(el);
    var cb = el.querySelector('input'), ja = el.querySelector('.ja'), nej = el.querySelector('.nej'), m = el.querySelector('.m'), n = 0;
    cb.addEventListener('change', function () { ja.disabled = !cb.checked; });
    function flyt() {
      nej.style.transform = 'translate(' + (Math.random() * 160 - 80) + 'px,' + (Math.random() * 90 - 45) + 'px)';
    }
    nej.addEventListener('mouseenter', flyt);
    nej.addEventListener('click', function (e) { e.preventDefault(); flyt(); m.textContent = NEJ[n++ % NEJ.length]; });
    ja.addEventListener('click', function () {
      if (!cb.checked) return;
      firebase.database().ref('studiehub/students/' + id + '/popupAck').set({ ts: Date.now(), popup: ts, nejKlik: n });
      ShAuth.audit('popup-bekraeftet', 'dillerfjæs (' + n + ' × nej først)');
      luk();
    });
  }

  function lyt(id) {
    if (subId === id) return;
    if (sub) sub.off();
    luk(); subId = id;
    if (!id) { sub = null; return; }
    sub = firebase.database().ref('studiehub/students/' + id);
    sub.on('value', function (snap) {
      var s = snap.val() || {}, p = s.popup, a = s.popupAck;
      if (p && p.ts && !(a && a.popup >= p.ts)) vis(id, p.ts); else luk();
    });
  }

  // Lyt på den indloggede elev; tjek jævnligt, så det også virker lige efter login/log ud.
  ShAuth.onReady(function () {
    lyt(ShAuth.currentId());
    setInterval(function () { lyt(ShAuth.currentId()); }, 3000);
  });
})();
