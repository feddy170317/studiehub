/* ============================================================
   QuizLive — Elevliste-admin (assets/roster.js)
   Genererer 4-cifrede PIN-koder til elever og gemmer dem i
   /students/{pin} = { name, createdAt }. Kun fornavn gemmes
   (databasen er læsbar for alle med linket).
   Ingen ES-moduler. Ren globals. IIFE + 'use strict'.
   Groundwork til kommende PIN-login + resultat-sporing —
   den funktionalitet er IKKE en del af denne fil.
   ============================================================ */

(function () {
  'use strict';

  /* --- Tjek Firebase-config --- */
  if (!window.FIREBASE_CONFIG || window.FIREBASE_CONFIG.apiKey.indexOf('INDSAET') !== -1) {
    document.getElementById('firebase-banner').classList.add('show');
    return;
  }

  /* --- Firebase init --- */
  firebase.initializeApp(window.FIREBASE_CONFIG);
  var db = firebase.database();
  var ServerValue = firebase.database.ServerValue;

  /* --- Dom-referencer --- */
  var inpBulkNames   = document.getElementById('inp-bulk-names');
  var btnBulkGen     = document.getElementById('btn-bulk-generate');
  var inpSingleName  = document.getElementById('inp-single-name');
  var btnSingleAdd   = document.getElementById('btn-single-add');
  var btnCopyList    = document.getElementById('btn-copy-list');
  var btnPrintList   = document.getElementById('btn-print-list');
  var rosterStatus   = document.getElementById('roster-status');
  var rosterTbody    = document.getElementById('roster-tbody');
  var toast          = document.getElementById('roster-toast');

  /* --- Lokal cache af elever (pin -> {name, createdAt}) --- */
  var students = {};

  /* ================================================================
     Toast-hjælper (kopieret fra editor.js-mønstret)
     ================================================================ */
  var toastTimer = null;
  function showToast(msg, isError) {
    toast.textContent = msg;
    toast.className = 'show' + (isError ? ' toast-error' : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.className = '';
    }, 3500);
  }

  /* --- HTML-escape hjælper --- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ================================================================
     PIN-generering: 4 cifre, unik i /students, maks. 20 forsøg
     ================================================================ */
  function generateUniquePin() {
    var tries = 0;
    function attempt() {
      tries++;
      var pin = String(Math.floor(1000 + Math.random() * 9000));
      return db.ref('students/' + pin).once('value').then(function (snap) {
        if (snap.exists() || students[pin]) {
          if (tries >= 20) {
            throw new Error('Kunne ikke generere en unik PIN-kode efter 20 forsøg.');
          }
          return attempt();
        }
        return pin;
      });
    }
    return attempt();
  }

  /* Udtræk fornavn (første whitespace-separerede token) — tom streng hvis intet fundet */
  function firstNameFrom(line) {
    var trimmed = String(line || '').trim();
    if (!trimmed) return '';
    var parts = trimmed.split(/\s+/);
    return parts[0] || '';
  }

  /* Opret én elev med et givent (allerede udtrukket) fornavn.
     Returnerer et promise der resolver til { pin, name }. */
  function createStudent(firstName) {
    return generateUniquePin().then(function (pin) {
      var data = { name: firstName, createdAt: ServerValue.TIMESTAMP };
      return db.ref('students/' + pin).set(data).then(function () {
        students[pin] = { name: firstName, createdAt: Date.now() };
        return { pin: pin, name: firstName };
      });
    });
  }

  /* ================================================================
     Bulk-generering fra tekstfelt
     ================================================================ */
  btnBulkGen.addEventListener('click', function () {
    var lines = inpBulkNames.value.split('\n');
    var names = [];
    lines.forEach(function (line) {
      var fn = firstNameFrom(line);
      if (fn) names.push(fn);
    });

    if (names.length === 0) {
      showToast('Indsæt mindst ét navn først.', true);
      return;
    }

    btnBulkGen.disabled = true;
    btnBulkGen.textContent = 'Opretter...';

    /* Sekventiel oprettelse (undgår PIN-kollisioner mellem parallelle kald) */
    var added = 0;
    var failed = 0;
    var chain = names.reduce(function (p, name) {
      return p.then(function () {
        return createStudent(name).then(function () {
          added++;
        }).catch(function () {
          failed++;
        });
      });
    }, Promise.resolve());

    chain.then(function () {
      btnBulkGen.disabled = false;
      btnBulkGen.textContent = '➕ Generér PIN-koder';
      inpBulkNames.value = '';
      loadRoster();
      if (failed > 0) {
        showToast(added + ' elev' + (added !== 1 ? 'er' : '') + ' tilføjet, ' + failed + ' fejlede.', true);
      } else {
        showToast(added + ' elev' + (added !== 1 ? 'er' : '') + ' tilføjet.');
      }
    });
  });

  /* ================================================================
     Enkelt-tilføj
     ================================================================ */
  function handleSingleAdd() {
    var fn = firstNameFrom(inpSingleName.value);
    if (!fn) {
      showToast('Skriv et navn først.', true);
      return;
    }
    btnSingleAdd.disabled = true;
    createStudent(fn).then(function (result) {
      btnSingleAdd.disabled = false;
      inpSingleName.value = '';
      loadRoster();
      showToast(result.name + ' tilføjet med PIN ' + result.pin + '.');
    }).catch(function (err) {
      btnSingleAdd.disabled = false;
      showToast('Kunne ikke tilføje elev: ' + (err && err.message ? err.message : 'ukendt fejl'), true);
    });
  }
  btnSingleAdd.addEventListener('click', handleSingleAdd);
  inpSingleName.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSingleAdd();
    }
  });

  /* ================================================================
     Slet elev
     ================================================================ */
  function deleteStudent(pin, name) {
    if (!confirm('Slet "' + (name || pin) + '" (PIN ' + pin + ')?\nDette kan ikke fortrydes.')) return;
    db.ref('students/' + pin).remove().then(function () {
      delete students[pin];
      renderRoster();
      showToast('Eleven er slettet.');
    }).catch(function (err) {
      showToast('Slet fejlede: ' + (err && err.message ? err.message : 'fejl'), true);
    });
  }

  /* ================================================================
     Indlæs + rendér elevliste (live)
     ================================================================ */
  function loadRoster() {
    db.ref('students').on('value', function (snap) {
      students = {};
      if (snap.exists()) {
        snap.forEach(function (child) {
          students[child.key] = child.val();
        });
      }
      renderRoster();
    }, function (err) {
      rosterStatus.textContent = 'Kunne ikke indlæse elevlisten: ' + (err && err.message ? err.message : 'fejl');
    });
  }

  function renderRoster() {
    var pins = Object.keys(students);
    rosterTbody.innerHTML = '';

    if (pins.length === 0) {
      rosterStatus.textContent = 'Ingen elever endnu — indsæt en liste ovenfor.';
      return;
    }
    rosterStatus.textContent = pins.length + ' elev' + (pins.length !== 1 ? 'er' : '') + ' i alt';

    /* Sortér efter navn (dansk), PIN som tie-breaker for stabilitet */
    pins.sort(function (a, b) {
      var na = (students[a].name || '').toLowerCase();
      var nb = (students[b].name || '').toLowerCase();
      var c = na.localeCompare(nb, 'da');
      if (c !== 0) return c;
      return a.localeCompare(b);
    });

    pins.forEach(function (pin) {
      var s = students[pin];
      var tr = document.createElement('tr');

      var tdName = document.createElement('td');
      tdName.textContent = s.name || '';
      tr.appendChild(tdName);

      var tdPin = document.createElement('td');
      tdPin.className = 'col-pin';
      tdPin.textContent = pin;
      tr.appendChild(tdPin);

      var tdDel = document.createElement('td');
      tdDel.className = 'col-del';
      var btnDel = document.createElement('button');
      btnDel.className = 'btn btn-del-student';
      btnDel.type = 'button';
      btnDel.textContent = '🗑 Slet';
      btnDel.addEventListener('click', function () { deleteStudent(pin, s.name); });
      tdDel.appendChild(btnDel);
      tr.appendChild(tdDel);

      rosterTbody.appendChild(tr);
    });
  }

  /* ================================================================
     Kopiér liste ("Navn: PIN" pr. linje, sorteret efter navn)
     ================================================================ */
  btnCopyList.addEventListener('click', function () {
    var pins = Object.keys(students);
    if (pins.length === 0) {
      showToast('Ingen elever at kopiere endnu.', true);
      return;
    }
    pins.sort(function (a, b) {
      return (students[a].name || '').toLowerCase().localeCompare((students[b].name || '').toLowerCase(), 'da');
    });
    var text = pins.map(function (pin) {
      return (students[pin].name || '') + ': ' + pin;
    }).join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Listen er kopieret! 📋');
        }).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    } catch (e) {
      fallbackCopy(text);
    }
  });

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        showToast('Listen er kopieret! 📋');
      } else {
        showToast('Kunne ikke kopiere listen automatisk.', true);
      }
    } catch (e) {
      showToast('Kunne ikke kopiere listen automatisk.', true);
    }
  }

  /* ================================================================
     Udskriv
     ================================================================ */
  btnPrintList.addEventListener('click', function () {
    window.print();
  });

  /* ================================================================
     Initialisering
     ================================================================ */
  loadRoster();

}());
