/* MEM1 eksamens-lab motor.
   Hver spoergsmaalsside definerer QDATA + (valgfrit) LAB og kalder Eks.build().
   Ingen ES-moduler, ingen build - virker baade paa GitHub Pages og ved dobbeltklik (file://). */
var Eks = (function () {

  /* ---------- matematik ---------- */
  function tex(src, display) {
    try {
      if (typeof katex !== 'undefined') {
        return katex.renderToString(src, { throwOnError: false, displayMode: !!display });
      }
    } catch (e) { }
    return '<code>' + esc(plainMath(src)) + '</code>';
  }

  /* Fallback naar KaTeX ikke kan hentes (helt offline): oversaet LaTeX til Unicode,
     saa formlerne stadig er laesbare i stedet for at staa som kodesalat. */
  var GREEK = {
    alpha:'α', beta:'β', gamma:'γ', delta:'δ', epsilon:'ε', zeta:'ζ',
    eta:'η', theta:'θ', iota:'ι', kappa:'κ', lambda:'λ', mu:'μ',
    nu:'ν', xi:'ξ', pi:'π', rho:'ρ', sigma:'σ', tau:'τ',
    upsilon:'υ', phi:'ϕ', chi:'χ', psi:'ψ', omega:'ω',
    Gamma:'Γ', Delta:'Δ', Theta:'Θ', Lambda:'Λ', Xi:'Ξ', Pi:'Π',
    Sigma:'Σ', Phi:'Φ', Psi:'Ψ', Omega:'Ω'
  };
  var SYM = {
    cdot:'·', times:'×', pm:'±', mp:'∓', approx:'≈', neq:'≠',
    leq:'≤', geq:'≥', le:'≤', ge:'≥', ll:'≪', gg:'≫',
    Rightarrow:'⇒', rightarrow:'→', to:'→', Leftarrow:'⇐', infty:'∞',
    partial:'∂', int:'∫', sum:'Σ', circ:'°', ldots:'…', dots:'…',
    propto:'∝', equiv:'≡'
  };
  var SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵',
             '6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','n':'ⁿ','p':'ᵖ'};
  var SUB = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅',
             '6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋',
             'a':'ₐ','e':'ₑ','i':'ᵢ','o':'ₒ','r':'ᵣ','u':'ᵤ',
             'v':'ᵥ','x':'ₓ','h':'ₕ','k':'ₖ','l':'ₗ','m':'ₘ',
             'n':'ₙ','p':'ₚ','s':'ₛ','t':'ₜ'};

  // find den matchende afsluttende tuborgklamme fra position i (som peger paa '{')
  function braceSpan(s, i) {
    var d = 0;
    for (var j = i; j < s.length; j++) {
      if (s[j] === '{') d++;
      else if (s[j] === '}') { d--; if (d === 0) return j; }
    }
    return -1;
  }
  function mapScript(txt, tbl) {
    var out = '';
    for (var i = 0; i < txt.length; i++) {
      if (!tbl[txt[i]]) return null;
      out += tbl[txt[i]];
    }
    return out;
  }
  function plainMath(s) {
    s = String(s);
    // escapede tuborgklammer bevares som tegn, kontrol-mellemrum bliver til mellemrum
    s = s.replace(/\\\{/g, '\u0002').replace(/\\\}/g, '\u0003').replace(/\\ /g, ' ');
    // \frac{a}{b} -> (a)/(b)   (indefra og ud)
    for (var guard = 0; guard < 12 && s.indexOf('\\frac') >= 0; guard++) {
      s = s.replace(/\\[dt]?frac\s*\{/, function (m, off) { return '\u0001{'; });
      var k = s.indexOf('\u0001{');
      if (k < 0) break;
      var e1 = braceSpan(s, k + 1); if (e1 < 0) break;
      var num = s.slice(k + 2, e1);
      var rest = s.slice(e1 + 1).replace(/^\s*/, '');
      if (rest[0] !== '{') { s = s.slice(0, k) + num + rest; continue; }
      var off2 = s.length - rest.length;
      var e2 = braceSpan(s, off2); if (e2 < 0) break;
      var den = s.slice(off2 + 1, e2);
      s = s.slice(0, k) + '(' + num + ')/(' + den + ')' + s.slice(e2 + 1);
    }
    s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)')
         .replace(/\\(?:boxed|text|mathrm|mathbf|operatorname|underbrace)\s*\{([^{}]*)\}/g, '$1')
         .replace(/\\left|\\right|\\!|\\,|\\;|\\:/g, '')
         .replace(/\\q?quad/g, '   ')
         .replace(/\\\\/g, '  |  ');
    // hoved-/saenkeskrift
    s = s.replace(/\^\s*\{([^{}]*)\}|\^(\w)/g, function (m, a, b) {
      var t = a !== undefined ? a : b, u = mapScript(t, SUP);
      return u !== null ? u : '^(' + t + ')';
    });
    s = s.replace(/_\s*\{([^{}]*)\}|_(\w)/g, function (m, a, b) {
      var t = a !== undefined ? a : b, u = mapScript(t, SUB);
      return u !== null ? u : '_' + t;
    });
    s = s.replace(/\\([a-zA-Z]+)/g, function (m, w) {
      return GREEK[w] || SYM[w] || '';
    });
    return s.replace(/[{}]/g, '').replace(/\u0002/g, '{').replace(/\u0003/g, '}').replace(/\s+/g, ' ').trim();
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // Inline-matematik i broedtekst skrives med $...$
  function rich(s) {
    if (s == null) return '';
    return String(s).replace(/\$([^$]+)\$/g, function (_, m) { return tex(m, false); });
  }
  function mathBlock(src, small) {
    return '<div class="math' + (small ? ' sm' : '') + '">' + tex(src, true) + '</div>';
  }

  /* ---------- tal ---------- */
  function num(v, dec) {
    if (v === null || v === undefined || !isFinite(v)) return '--';
    var s = Number(v).toFixed(dec === undefined ? 2 : dec);
    return s.replace('.', ',');
  }
  // tal formateret til brug INDE i en KaTeX-streng (komma som decimaltegn kraever {,})
  function tnum(v, dec) {
    if (v === null || v === undefined || !isFinite(v)) return '\\text{--}';
    return Number(v).toFixed(dec === undefined ? 2 : dec).replace('.', '{,}');
  }

  /* ---------- canvas-hjaelpere ---------- */
  var C = {
    grid: function (ctx, W, H, step) {
      step = step || 40;
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 1;
      for (var x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
    },
    arrow: function (ctx, x0, y0, x1, y1, col, w, head) {
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
      if (L < 0.5) return;
      head = head || 9; w = w || 2.5;
      var a = Math.atan2(dy, dx);
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - head * Math.cos(a - Math.PI / 6), y1 - head * Math.sin(a - Math.PI / 6));
      ctx.lineTo(x1 - head * Math.cos(a + Math.PI / 6), y1 - head * Math.sin(a + Math.PI / 6));
      ctx.closePath(); ctx.fill(); ctx.restore();
    },
    // dobbeltpil (til maalsaetning)
    dim: function (ctx, x0, y0, x1, y1, col, label) {
      C.arrow(ctx, x0, y0, x1, y1, col, 1.4, 7);
      C.arrow(ctx, x1, y1, x0, y0, col, 1.4, 7);
      if (label) C.txt(ctx, label, (x0 + x1) / 2, (y0 + y1) / 2 - 6, col, 11, 'center');
    },
    txt: function (ctx, s, x, y, col, size, align, bold) {
      ctx.save();
      ctx.fillStyle = col || '#e3ebf3';
      ctx.font = (bold ? '600 ' : '') + (size || 12) + 'px "Segoe UI",sans-serif';
      ctx.textAlign = align || 'left';
      ctx.fillText(s, x, y); ctx.restore();
    },
    mono: function (ctx, s, x, y, col, size, align) {
      ctx.save();
      ctx.fillStyle = col || '#e3ebf3';
      ctx.font = (size || 12) + 'px Consolas,monospace';
      ctx.textAlign = align || 'left';
      ctx.fillText(s, x, y); ctx.restore();
    },
    line: function (ctx, x0, y0, x1, y1, col, w, dash) {
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.5;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
    },
    poly: function (ctx, pts, stroke, fill, w, dash) {
      if (!pts.length) return;
      ctx.save(); ctx.lineWidth = w || 2;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
      ctx.restore();
    },
    circle: function (ctx, x, y, r, stroke, fill, w, dash) {
      ctx.save(); ctx.lineWidth = w || 2;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0), 0, Math.PI * 2);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
      ctx.restore();
    },
    // skraveret "fastspaending" (vaeg)
    hatch: function (ctx, x, y0, y1, col, dir) {
      dir = dir || 1;
      C.line(ctx, x, y0, x, y1, col, 3);
      for (var y = y0; y <= y1; y += 9) C.line(ctx, x, y, x - 9 * dir, y + 9, col, 1.2);
    },
    axes: function (ctx, x0, y0, x1, y1, xl, yl) {
      var col = 'rgba(227,235,243,.35)';
      C.arrow(ctx, x0, y1, x1, y1, col, 1.4, 7);   // x
      C.arrow(ctx, x0, y1, x0, y0, col, 1.4, 7);   // y
      if (xl) C.txt(ctx, xl, x1 - 4, y1 + 16, 'rgba(227,235,243,.5)', 11, 'right');
      if (yl) C.txt(ctx, yl, x0 + 6, y0 + 10, 'rgba(227,235,243,.5)', 11, 'left');
    }
  };

  /* ---------- sektionsbyggere ---------- */
  // Standalone-kopier (lokale mapper) definerer EKS_BASE; så peger relative links på live-sitet.
  function url(u) {
    if (typeof EKS_LOCAL !== 'undefined' && EKS_LOCAL[u]) return EKS_LOCAL[u];   // lokal mappe-navigation
    if (typeof EKS_BASE === 'undefined' || /^(https?:|#)/.test(u)) return u;
    try { return new URL(u, EKS_BASE).href; } catch (e) { return u; }
  }

  function secHead(ic, t) { return '<h2 class="sec"><span class="ic">' + ic + '</span>' + t + '</h2>'; }

  function buildQuestion(d) {
    var h = '<section id="spm">' + secHead('&#128196;', 'Spørgsmålet, som det står i PDF&apos;en');
    h += '<div class="qbox"><div class="qh">Spørgsmål ' + d.nr + ': ' + esc(d.titel) +
         '  &middot;  Kilde: Kapitel ' + d.kapitel + ', ' + esc(d.kapitelNavn) + '</div>';
    h += '<div class="qp"><span class="tag">(a)</span><b>Teori og udledning:</b> ' + rich(d.spmA) + '</div>';
    h += '<div class="qp"><span class="tag">(b)</span><b>Designopgave:</b> ' + rich(d.spmB) + '</div></div>';
    if (d.bog) h += '<div class="note"><b>&#128214; Find det i bogen</b> (Hamrock, Schmid &amp; Jacobson, <i>Fundamentals of Machine Elements</i>, 3. udg., trykte sidetal): ' + rich(d.bog) + '</div>';
    var pdfu = url('pdf/Svarvejledning_' + (d.nr < 10 ? '0' : '') + d.nr + '.pdf');
    h += '<div class="note gr"><b>&#128196; Svarvejledning som PDF:</b> <a style="color:var(--cy)" href="' + pdfu + '">Svarvejledning_' + (d.nr < 10 ? '0' : '') + d.nr + '.pdf</a> &mdash; samme gennemgang i eksamens-layout, til print og noter.</div>';
    h += '</section>';
    return h;
  }

  function buildPlain(d) {
    var h = '<section id="oversat">' + secHead('&#129504;', 'Oversat: hvad de egentlig beder om');
    h += '<div class="card lead">' + rich(d.oversat) + '</div>';
    if (d.kerne) {
      h += '<div class="note go"><b>Kernen i ét billede:</b> ' + rich(d.kerne) + '</div>';
    }
    h += '</section>';
    return h;
  }

  function buildStory(d) {
    if (!d.historie) return '';
    var h = '<section id="historie">' + secHead('&#128161;', 'Den mekaniske historie &mdash; forstå det før du regner');
    h += '<div class="card">' + d.historie.map(function (p) {
      return p.h ? '<h3>' + esc(p.h) + '</h3><p>' + rich(p.t) + '</p>'
                 : '<p style="margin-top:.6rem">' + rich(p.t) + '</p>';
    }).join('') + '</div>';
    if (d.analogi) h += '<div class="note gr"><b>Hverdagsbilledet:</b> ' + rich(d.analogi) + '</div>';
    h += '</section>';
    return h;
  }

  function buildPlan(d) {
    if (!d.plan) return '';
    var h = '<section id="plan">' + secHead('&#9201;', 'Din 20-minutters tavleplan');
    h += '<div class="note">Eksaminationen er kort. Planen her bruger <b>ca. 14 minutter</b> på din egen fremlæggelse og efterlader luft til spørgsmål. Hold rækkefølgen &mdash; den fortæller en historie.</div>';
    h += '<div class="plan" style="margin-top:.9rem">';
    d.plan.forEach(function (r) {
      h += '<div class="row ' + (r.k || '') + '"><div class="t">' + esc(r.t) + '</div>' +
           '<div><div class="w">' + rich(r.w) + '</div><div class="d">' + rich(r.d) + '</div></div></div>';
    });
    h += '</div></section>';
    return h;
  }

  function buildSteps(d) {
    if (!d.trin) return '';
    var h = '<section id="udledning">' + secHead('&#128207;', 'Udledningen, trin for trin');
    h += '<div class="note">Klik på et trin for at folde det ud. Hvert trin har tre dele: <b>hvad du skriver</b>, <b>hvorfor</b> &mdash; og <b>hvad du siger højt</b>. Det sidste er det, censor bedømmer.</div>';
    h += '<div style="margin-top:.9rem" id="stepwrap">';
    d.trin.forEach(function (s, i) {
      h += '<div class="step' + (i === 0 ? ' open' : '') + '"><div class="sh"><div class="n">' + (i + 1) +
           '</div><div class="ttl">' + rich(s.t) + '</div><div class="chev">&#9654;</div></div><div class="sb">';
      if (s.m) (Array.isArray(s.m) ? s.m : [s.m]).forEach(function (m) { h += mathBlock(m); });
      if (s.hvorfor) h += '<div class="lbl">Hvorfor dette trin</div><div>' + rich(s.hvorfor) + '</div>';
      if (s.sig) h += '<div class="lbl">Sig det sådan her</div><div class="say">&bdquo;' + rich(s.sig) + '&ldquo;</div>';
      h += '</div></div>';
    });
    h += '</div></section>';
    return h;
  }

  function buildLab(d) {
    if (typeof LAB === 'undefined') return '';
    var h = '<section id="lab">' + secHead('&#127918;', 'Live-lab &mdash; skru på tallene');
    h += '<div class="note go">' + rich(LAB.intro || 'Træk i skyderne. Både tegningen, facit og hele udregningen nedenfor følger med i realtid. Sæt dem tilbage på eksamensopgavens værdier med knappen.') + '</div>';

    h += '<div class="lab" style="margin-top:.9rem"><div class="ctrl"><h4>Inddata</h4><div id="sliders"></div>' +
         '<button class="btn" id="resetBtn">&#8634; Tilbage til opgavens tal</button>' +
         (LAB.preset2 ? '<button class="btn sec" id="p2Btn">' + esc(LAB.preset2.navn) + '</button>' : '') +
         '</div>';
    h += '<div class="view"><canvas id="stage" width="' + (LAB.w || 720) + '" height="' + (LAB.h || 420) + '"></canvas>' +
         '<div class="out" id="out"></div><div id="facit"></div>' +
         '<div class="live"><div class="lt">Udregningen, live</div><div id="live"></div></div></div></div>';
    h += '</section>';
    return h;
  }

  function buildTraps(d) {
    if (!d.faldgruber) return '';
    var h = '<section id="faldgruber">' + secHead('&#9888;', 'Faldgruber &mdash; her taber folk point');
    h += '<div class="traps">' + d.faldgruber.map(function (f) {
      return '<div class="trap"><div class="th">' + rich(f.t) + '</div><div class="td">' + rich(f.d) + '</div></div>';
    }).join('') + '</div></section>';
    return h;
  }

  function buildQA(d) {
    if (!d.qa) return '';
    var h = '<section id="qa">' + secHead('&#128172;', 'Det spørger censor sikkert om bagefter');
    h += '<div class="note">Klik for at se et kort, brugbart svar. Øv dem højt &mdash; de fleste kan besvares på 20 sekunder.</div>';
    h += '<div style="margin-top:.9rem" id="qawrap">' + d.qa.map(function (q) {
      return '<div class="qa"><div class="qq"><span class="m">?</span><span>' + rich(q.q) + '</span></div>' +
             '<div class="aa">' + rich(q.a) + '</div></div>';
    }).join('') + '</div></section>';
    return h;
  }

  function buildLinks(d) {
    var h = '<section id="sammenhaeng">' + secHead('&#128279;', 'Sådan hænger det sammen med resten af pensum');
    if (d.sammenhaeng) h += '<div class="card">' + rich(d.sammenhaeng) + '</div>';
    if (d.links && d.links.length) {
      h += '<div class="links" style="margin-top:.8rem">' + d.links.map(function (l) {
        var hu = url(l.u);
        return '<a href="' + hu + '"' + (hu.indexOf('http') === 0 && typeof EKS_BASE === 'undefined' ? ' target="_blank" rel="noopener"' : '') +
               '><span class="k">' + esc(l.k) + '</span>' + esc(l.t) + '</a>';
      }).join('') + '</div>';
    }
    h += '</section>';
    return h;
  }

  /* ---------- lab-motor ---------- */
  function initLab() {
    if (typeof LAB === 'undefined') return;
    var cv = document.getElementById('stage');
    if (!cv) return;
    var W = LAB.w || cv.width, H = LAB.h || cv.height;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var ctx = cv.getContext('2d');
    var vals = {};

    var sw = document.getElementById('sliders');
    LAB.inputs.forEach(function (s) {
      vals[s.id] = s.value;
      var d = document.createElement('div');
      d.className = 'sl';
      d.innerHTML = '<label><span>' + rich(s.label) + '</span><span class="v" id="v_' + s.id + '"></span></label>' +
        '<input type="range" id="s_' + s.id + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + s.value + '">' +
        '<div class="rng"><span>' + fmtIn(s.min, s) + '</span><span>' + fmtIn(s.max, s) + '</span></div>';
      sw.appendChild(d);
      d.querySelector('input').addEventListener('input', function () {
        vals[s.id] = parseFloat(this.value); render();
      });
    });

    // s.choices: diskret skyder med tekstvalg (fx ['Kugleleje', 'Rulleleje'])
    function fmtIn(v, s) {
      if (s.choices) return s.choices[Math.round(v - s.min)] || '';
      return num(v, s.dec === undefined ? 0 : s.dec) + (s.unit ? ' ' + s.unit : '');
    }

    function setPreset(p) {
      LAB.inputs.forEach(function (s) {
        var nv = (p && p.v && p.v[s.id] !== undefined) ? p.v[s.id] : s.value;
        vals[s.id] = nv;
        document.getElementById('s_' + s.id).value = nv;
      });
      render();
    }
    document.getElementById('resetBtn').addEventListener('click', function () { setPreset(null); });
    if (LAB.preset2) document.getElementById('p2Btn').addEventListener('click', function () { setPreset(LAB.preset2); });

    var outEl = document.getElementById('out'), liveEl = document.getElementById('live'), facEl = document.getElementById('facit');

    function render() {
      LAB.inputs.forEach(function (s) {
        document.getElementById('v_' + s.id).textContent = fmtIn(vals[s.id], s);
      });
      var r = LAB.compute(vals);

      outEl.innerHTML = LAB.readout(vals, r).map(function (o) {
        return '<div class="' + (o.k || '') + '"><div class="l">' + rich(o.l) + '</div><div class="n">' +
               (o.raw !== undefined ? o.raw : num(o.v, o.dec)) + (o.unit ? ' ' + o.unit : '') + '</div></div>';
      }).join('');

      liveEl.innerHTML = LAB.steps(vals, r).map(function (s) {
        return '<div class="lstep"><div class="h">' + rich(s.h) + '</div><div class="m">' + tex(s.m, true) + '</div>' +
               (s.c ? '<div class="c">' + rich(s.c) + '</div>' : '') + '</div>';
      }).join('');

      if (LAB.facit) {
        var f = LAB.facit(vals, r);
        facEl.innerHTML = f ? '<div class="facit' + (f.off ? ' off' : '') + '">' + rich(f.t) + '</div>' : '';
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      LAB.draw(ctx, W, H, vals, r, C);
    }
    render();
    // gentegn naar KaTeX er faerdigindlaest (saa live-trinnene ikke staar som raa tekst)
    if (typeof katex === 'undefined') {
      var tries = 0, iv = setInterval(function () {
        if (typeof katex !== 'undefined' || ++tries > 40) { clearInterval(iv); if (typeof katex !== 'undefined') render(); }
      }, 150);
    }
  }

  /* ---------- opbyg hele siden ---------- */
  // KaTeX hentes med defer og koerer foer DOMContentLoaded. Vi venter derfor paa det
  // event, saa matematikken er rigtig allerede foerste gang siden tegnes.
  function build() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doBuild);
    } else { doBuild(); }
  }

  function doBuild() {
    var d = QDATA;
    document.title = 'Spm. ' + d.nr + ': ' + d.titel + ' - MEM1 eksamen';

    var nav = '<div class="topbar"><a href="' + url('index.html') + '">&#8592; Alle 16 spørgsmål</a>' +
      (d.prev ? '<a href="' + url(d.prev) + '">&#8249; Forrige</a>' : '') +
      (d.next ? '<a href="' + url(d.next) + '">Næste &#8250;</a>' : '') +
      '<span class="sp"></span><span class="now">Spm ' + d.nr + '/16 &middot; Kap. ' + d.kapitel + '</span></div>';

    var hero = '<header class="hero"><div class="nr">MUNDTLIG EKSAMEN &middot; SPØRGSMÅL ' + d.nr + '</div>' +
      '<h1>' + esc(d.titel) + '</h1><div class="kap">Kapitel ' + d.kapitel + ' &middot; ' + esc(d.kapitelNavn) + '</div></header>';

    var body = '<main>' + buildQuestion(d) + buildPlain(d) + buildStory(d) + buildPlan(d) +
      buildSteps(d) + buildLab(d) + buildTraps(d) + buildQA(d) + buildLinks(d) + '</main>';

    var foot = '<footer>MEM1 &mdash; Maskinelementer og design af maskiner &middot; VIA Horsens<br>' +
      '<a href="' + url('index.html') + '">Oversigt over alle spørgsmål</a> &middot; ' +
      '<a href="' + url('../../../index.html') + '">Studiehub</a></footer>';

    document.body.innerHTML = nav + hero + body + foot;

    // foldbare trin
    document.querySelectorAll('.step .sh').forEach(function (el) {
      el.addEventListener('click', function () { el.parentNode.classList.toggle('open'); });
    });
    document.querySelectorAll('.qa .qq').forEach(function (el) {
      el.addEventListener('click', function () { el.parentNode.classList.toggle('open'); });
    });
    initLab();
  }

  return { build: build, tex: tex, rich: rich, math: mathBlock, num: num, tnum: tnum, C: C };
})();
