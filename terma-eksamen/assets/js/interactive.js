/* ============================================================
   interactive.js — klikbare beslutningsmatricer + billed-lightbox
   - Genbruger modal-mønsteret fra main.js (CAD-modal)
   - Datadrevet: matricerne ligger i MX-objektet (kilde: rapportens
     sektion 6 "Konceptudvikling" + sektion 7 "Materialevalg").
   - file:// -sikkert: ingen ES-moduler, ingen eksterne kald.
   ============================================================ */
(function () {
  'use strict';

  // Hver matrix: options[].win markerer valgt søjle (0-baseret).
  // rows: { c: kriterium, w: vægt, v: [[S,V], ...] pr. option }
  var MX = {
    sugehoved: {
      title: 'Beslutningsmatrice — Sugehoved',
      subtitle: 'Side-tragten (B) vandt på arbejdsmiljø, optisk kvalitet og ergonomi.',
      options: ['A: Ring-sug', 'B: Side-tragt', 'C: Shield'],
      win: 1,
      rows: [
        { c: 'Arbejdsmiljø (støj)', w: '24%', v: [[1, '0,24'], [5, '1,20'], [4, '0,96']] },
        { c: 'Optisk kvalitet', w: '24%', v: [[1, '0,24'], [5, '1,20'], [2, '0,48']] },
        { c: 'Ergonomi', w: '19%', v: [[4, '0,76'], [5, '0,95'], [1, '0,19']] },
        { c: 'Luftteknisk effektivitet', w: '14%', v: [[1, '0,14'], [4, '0,56'], [4, '0,56']] },
        { c: 'ESD-sikkerhed', w: '19%', v: [[5, '0,95'], [5, '0,95'], [2, '0,38']] }
      ],
      total: ['2,33', '4,86', '2,57']
    },
    kanalfoering: {
      title: 'Beslutningsmatrice — Kanalføring',
      subtitle: '"Arm som kanal" (C) vandt: armens egen profil bliver luftkanalen.',
      options: ['A: Invendig', 'B: Rør udenpå', 'C: Arm som kanal', 'D: Loftsug'],
      win: 2,
      rows: [
        { c: 'Bevægelsesfrihed', w: '27%', v: [[2, '0,54'], [2, '0,54'], [5, '1,35'], [4, '1,08']] },
        { c: 'Justérbarhed', w: '18%', v: [[3, '0,54'], [3, '0,54'], [5, '0,90'], [5, '0,90']] },
        { c: 'Slidstyrke', w: '27%', v: [[2, '0,54'], [2, '0,54'], [5, '1,35'], [5, '1,35']] },
        { c: 'Pris', w: '10%', v: [[2, '0,20'], [2, '0,20'], [5, '0,50'], [3, '0,30']] },
        { c: 'Tæthed udsugning', w: '18%', v: [[5, '0,90'], [5, '0,90'], [3, '0,54'], [5, '0,90']] }
      ],
      total: ['2,72', '2,72', '4,64', '4,53']
    },
    arm: {
      title: 'Beslutningsmatrice — Armkonstruktion',
      subtitle: '3D-printede stænger (B) vandt på produktion, pris, kabelføring og vægt.',
      options: ['A: Runde stænger', 'B: 3D-printede stænger'],
      win: 1,
      rows: [
        { c: 'Produktion', w: '25%', v: [[3, '0,75'], [4, '1,00']] },
        { c: 'Styrke', w: '38%', v: [[5, '1,90'], [3, '1,14']] },
        { c: 'Pris', w: '12%', v: [[1, '0,12'], [5, '0,60']] },
        { c: 'Kabelføring', w: '13%', v: [[2, '0,26'], [5, '0,65']] },
        { c: 'Vægt', w: '12%', v: [[2, '0,24'], [4, '0,48']] }
      ],
      total: ['3,27', '3,87']
    },
    holde: {
      title: 'Beslutningsmatrice — Holdemekanisme',
      subtitle: 'Gas-/hydraulikholdt (C) vandt på brugervenlighed og trinfri justérbarhed.',
      options: ['A: Skrue', 'B: Fjeder', 'C: Gas'],
      win: 2,
      rows: [
        { c: 'Brugervenlighed', w: '30%', v: [[2, '0,60'], [3, '0,90'], [4, '1,20']] },
        { c: 'Pris', w: '10%', v: [[4, '0,40'], [3, '0,30'], [2, '0,20']] },
        { c: 'Justérbarhed', w: '10%', v: [[2, '0,20'], [3, '0,30'], [5, '0,50']] },
        { c: 'Slid', w: '20%', v: [[5, '1,00'], [4, '0,80'], [5, '1,00']] },
        { c: 'Sikkerhed', w: '30%', v: [[4, '1,20'], [4, '1,20'], [4, '1,20']] }
      ],
      total: ['3,40', '3,50', '4,10']
    },
    materiale: {
      title: 'Beslutningsmatrice — Materialevalg',
      subtitle: 'ESD-PETG vandt den samlede vurdering (3,70) — bedste balance mellem ESD, FDM-egnethed og vægt.',
      options: ['PETG', 'AES', 'ASA', 'PA6-GF', 'PA66-GF'],
      win: 0,
      rows: [
        { c: 'ESD-egnethed', w: '25%', v: [[4, '1,00'], [3, '0,75'], [2, '0,50'], [5, '1,25'], [5, '1,25']] },
        { c: 'FDM-fremstillingsegnethed', w: '25%', v: [[5, '1,25'], [4, '1,00'], [3, '0,75'], [2, '0,50'], [1, '0,25']] },
        { c: 'Densitet (lav = 5)', w: '15%', v: [[2, '0,30'], [5, '0,75'], [5, '0,75'], [2, '0,30'], [3, '0,45']] },
        { c: 'Max. driftstemperatur', w: '15%', v: [[3, '0,45'], [4, '0,60'], [3, '0,45'], [4, '0,60'], [4, '0,60']] },
        { c: 'E-modul (stivhed)', w: '8%', v: [[3, '0,24'], [2, '0,16'], [2, '0,16'], [5, '0,40'], [5, '0,40']] },
        { c: 'Trækstyrke', w: '7%', v: [[3, '0,21'], [2, '0,14'], [2, '0,14'], [5, '0,35'], [5, '0,35']] },
        { c: 'Genanvendelighed', w: '5%', v: [[5, '0,25'], [5, '0,25'], [5, '0,25'], [5, '0,25'], [5, '0,25']] }
      ],
      total: ['3,70', '3,65', '3,00', '3,65', '3,55']
    }
  };

  var modal = document.getElementById('info-modal');
  var backdrop = document.getElementById('info-backdrop');
  var bodyEl = document.getElementById('info-body');
  var titleEl = document.getElementById('info-title');
  var closeBtn = document.getElementById('info-close');
  if (!modal || !backdrop || !bodyEl) return;
  var isOpen = false;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function show() {
    modal.hidden = false; backdrop.hidden = false; isOpen = true;
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }
  function close() {
    modal.hidden = true; backdrop.hidden = true; isOpen = false;
    document.body.style.overflow = ''; bodyEl.innerHTML = ''; titleEl.textContent = '';
  }

  function renderMatrix(key, note, hl) {
    var m = MX[key]; if (!m) return;
    var hlSet = {};
    (hl || '').split(',').forEach(function (x) { if (x !== '') hlSet[parseInt(x, 10)] = 1; });
    titleEl.textContent = m.title;

    var h = '';
    if (note || m.subtitle) h += '<p class="info-note">' + (note || m.subtitle) + '</p>';
    h += '<div class="mx-scroll"><table class="mx-table"><thead><tr>';
    h += '<th class="mx-crit-h">Kriterium</th><th>Vægt</th>';
    m.options.forEach(function (o, i) {
      h += '<th class="' + (i === m.win ? 'mx-win' : '') + '">' + esc(o) + (i === m.win ? ' <span class="mx-star">★</span>' : '') + '</th>';
    });
    h += '</tr></thead><tbody>';
    m.rows.forEach(function (r, ri) {
      h += '<tr class="' + (hlSet[ri] ? 'mx-hl' : '') + '">';
      h += '<td class="mx-crit">' + esc(r.c) + '</td><td class="mx-w">' + esc(r.w) + '</td>';
      r.v.forEach(function (cell, i) {
        h += '<td class="' + (i === m.win ? 'mx-win' : '') + '"><span class="mx-v">' + esc(cell[1]) +
          '</span><span class="mx-s">S ' + esc(cell[0]) + '</span></td>';
      });
      h += '</tr>';
    });
    h += '<tr class="mx-total"><td>Samlet vægtet score</td><td>100%</td>';
    m.total.forEach(function (t, i) {
      h += '<td class="' + (i === m.win ? 'mx-win' : '') + '">' + esc(t) + '</td>';
    });
    h += '</tr></tbody></table></div>';
    h += '<p class="info-foot">Score S: 1 = uegnet · 5 = fremragende &nbsp;·&nbsp; V = S × vægt &nbsp;·&nbsp; valgt = fremhævet søjle. Kilde: rapportens beslutningsmatricer.</p>';
    bodyEl.innerHTML = h;
    show();
  }

  function renderImage(src, cap) {
    titleEl.textContent = '';
    var h = '<div class="info-img-wrap"><img src="' + src + '" alt="' + esc(cap || '') +
      '" onerror="this.parentNode.innerHTML=\'<p class=&quot;info-note&quot;>Billede ikke fundet.</p>\'"></div>';
    if (cap) h += '<p class="info-note info-cap">' + cap + '</p>';
    bodyEl.innerHTML = h;
    show();
  }

  function renderGallery(srcs, caps, title) {
    titleEl.textContent = title || '';
    var arr = srcs.split('|');
    var capArr = (caps || '').split('||');
    var h = '<div class="info-gallery">';
    arr.forEach(function (s, i) {
      h += '<figure class="info-gfig"><img src="' + s.trim() + '" alt="" ' +
        'onerror="this.parentNode.classList.add(\'gf-missing\')">';
      if (capArr[i]) h += '<figcaption>' + capArr[i] + '</figcaption>';
      h += '</figure>';
    });
    h += '</div>';
    bodyEl.innerHTML = h;
    show();
  }

  function bind(el) {
    if (el.hasAttribute('data-gallery')) {
      var fnG = function () { renderGallery(el.getAttribute('data-gallery'), el.getAttribute('data-galcaps'), el.getAttribute('data-cap')); };
      el.addEventListener('click', fnG);
      el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fnG(); } });
    } else if (el.hasAttribute('data-matrix')) {
      var fn = function () { renderMatrix(el.getAttribute('data-matrix'), el.getAttribute('data-mx-note'), el.getAttribute('data-mx-hl')); };
      el.addEventListener('click', fn);
      if (el.tagName !== 'BUTTON') {
        el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
      }
    } else if (el.hasAttribute('data-lightbox')) {
      var fn2 = function () { renderImage(el.getAttribute('data-lightbox'), el.getAttribute('data-cap')); };
      el.addEventListener('click', fn2);
      el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn2(); } });
    }
  }
  document.querySelectorAll('[data-matrix],[data-lightbox],[data-gallery]').forEach(bind);

  if (closeBtn) closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  // Frys deck-navigation (keyboard + wheel) mens modal er åben — capture-fasen
  // stopper main.js-handlerne, men lader modalens egen scroll køre videre.
  var NAV = { 'ArrowDown': 1, 'ArrowUp': 1, 'PageDown': 1, 'PageUp': 1, 'Home': 1, 'End': 1, ' ': 1, 'Spacebar': 1 };
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { close(); return; }
    if (NAV[e.key]) { e.stopImmediatePropagation(); e.preventDefault(); }
  }, true);
  document.addEventListener('wheel', function (e) {
    if (isOpen) e.stopImmediatePropagation();
  }, true);
})();
