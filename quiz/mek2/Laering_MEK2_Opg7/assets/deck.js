/* ============================================================
   MEK2 Opgave 7 — Comic-strip læringsdeck · interaktivitet
   - KaTeX-rendering (normaliserer \\ -> \ fra HTML-kilden)
   - GSAP/ScrollTrigger comic-pop reveal (bevarer panel-tilt)
   - Aktiv genkaldelse: skjul/afslør facit + se-mode toggle
   - Flashcards (flip), eksamens-rehearsal (12-min timer)
   - Tastatur: R = rehearsal, S = se-mode, ←/→ = spring kapitel
   ============================================================ */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    renderMath();
    setupReveals();
    setupFlashcards();
    setupShowAll();
    setupRehearsal();
    setupProgress();
    setupKeyboardNav();
    setupGsap();
  }

  /* ---------- KaTeX ---------- */
  function renderMath(){
    if(!window.katex){ setTimeout(renderMath, 60); return; }
    var inline = document.querySelectorAll('[data-tex]');
    var block  = document.querySelectorAll('[data-tex-block]');
    inline.forEach(function(el){ doRender(el, false); });
    block.forEach(function(el){ doRender(el, true); });
  }
  function doRender(el, display){
    // HTML-kilden bruger \\ (dobbelt) — KaTeX vil have enkelt backslash.
    var tex = el.textContent.replace(/\\\\/g, '\\').trim();
    try{
      katex.render(tex, el, { throwOnError:false, displayMode:display, strict:false });
    }catch(e){
      el.textContent = tex; // graceful fallback
      console.warn('KaTeX-fejl:', e.message, tex);
    }
  }

  /* ---------- Aktiv genkaldelse: skjul/afslør ---------- */
  function setupReveals(){
    document.querySelectorAll('.reveal[data-answer]').forEach(function(box){
      box.setAttribute('tabindex','0');
      box.setAttribute('role','button');
      box.setAttribute('aria-label','Afslør facit');
      var open = function(){
        box.classList.add('shown');
        box.setAttribute('aria-expanded','true');
      };
      box.addEventListener('click', open);
      box.addEventListener('keydown', function(e){
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); }
      });
    });
  }

  /* ---------- Se-mode (vis alt) ---------- */
  function setupShowAll(){
    var btn = document.getElementById('btn-showall');
    var apply = function(on){
      document.body.classList.toggle('show-all', on);
      btn.classList.toggle('on', on);
      btn.innerHTML = on ? '🙈 ØVE-MODE' : '👁 SE-MODE';
      btn.title = on ? 'Skjul facit igen (øve-mode)' : 'Vis alle facit (se-mode)';
    };
    btn.addEventListener('click', function(){
      apply(!document.body.classList.contains('show-all'));
    });
    // tastatur S håndteres i keyboardnav -> kald via window
    window.__toggleShowAll = function(){ apply(!document.body.classList.contains('show-all')); };
  }

  /* ---------- Flashcards ---------- */
  function setupFlashcards(){
    document.querySelectorAll('.flip').forEach(function(card){
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      var flip = function(){ card.classList.toggle('flipped'); };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', function(e){
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); flip(); }
      });
    });
  }

  /* ---------- Eksamens-rehearsal (12 min) ---------- */
  function setupRehearsal(){
    var panel = document.getElementById('rehearsal-panel');
    var timerEl = document.getElementById('reh-timer');
    var TOTAL = 12*60;
    var remaining = TOTAL, tick = null;

    function fmt(s){
      var sign = s<0 ? '-' : '';
      s = Math.abs(s);
      var m = Math.floor(s/60), ss = s%60;
      return sign + m + ':' + (ss<10?'0':'') + ss;
    }
    function paint(){
      timerEl.textContent = fmt(remaining);
      timerEl.classList.toggle('warn', remaining<=120 && remaining>0);
      timerEl.classList.toggle('over', remaining<=0);
    }
    function start(){
      if(tick) return;
      tick = setInterval(function(){ remaining--; paint(); }, 1000);
    }
    function pause(){ clearInterval(tick); tick=null; }
    function reset(){ pause(); remaining=TOTAL; paint(); }
    function open(){ panel.classList.add('open'); reset(); }
    function close(){ panel.classList.remove('open'); pause(); }

    document.getElementById('btn-rehearsal').addEventListener('click', open);
    document.getElementById('reh-start').addEventListener('click', start);
    document.getElementById('reh-pause').addEventListener('click', pause);
    document.getElementById('reh-reset').addEventListener('click', reset);
    document.getElementById('reh-exit').addEventListener('click', close);
    document.getElementById('reh-exit2').addEventListener('click', close);

    paint();
    window.__openRehearsal = open;
    window.__rehearsalOpen = function(){ return panel.classList.contains('open'); };
    window.__closeRehearsal = close;
  }

  /* ---------- Progress-bar ---------- */
  function setupProgress(){
    var bar = document.getElementById('progress');
    var update = function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h>0 ? (window.scrollY / h)*100 : 0;
      bar.style.width = p + '%';
    };
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Tastatur-navigation ---------- */
  function setupKeyboardNav(){
    var stops = [].slice.call(document.querySelectorAll('#cover, section.page[data-step]'));
    document.addEventListener('keydown', function(e){
      if(e.key==='r' || e.key==='R'){
        if(window.__rehearsalOpen && window.__rehearsalOpen()) window.__closeRehearsal();
        else window.__openRehearsal();
        return;
      }
      if(e.key==='s' || e.key==='S'){ window.__toggleShowAll(); return; }
      if(e.key==='Escape' && window.__rehearsalOpen && window.__rehearsalOpen()){ window.__closeRehearsal(); return; }
      if(e.key==='ArrowDown' || e.key==='ArrowRight'){ e.preventDefault(); jump(1); }
      if(e.key==='ArrowUp'   || e.key==='ArrowLeft'){  e.preventDefault(); jump(-1); }
    });
    function jump(dir){
      var y = window.scrollY + 4;
      var idx = 0;
      for(var i=0;i<stops.length;i++){ if(stops[i].offsetTop <= y) idx = i; }
      var next = Math.min(stops.length-1, Math.max(0, idx+dir));
      stops[next].scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  /* ---------- GSAP comic-pop reveal ---------- */
  function setupGsap(){
    // Hvis GSAP eller ScrollTrigger mangler (offline): rør IKKE ved opacity,
    // så alt indhold forbliver synligt i stedet for at hænge skjult.
    if(!window.gsap || !window.ScrollTrigger){ return; }
    gsap.registerPlugin(ScrollTrigger);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ return; }

    gsap.utils.toArray('.reveal-on').forEach(function(el){
      var tilt = parseFloat(getComputedStyle(el).getPropertyValue('--tilt')) || 0;
      gsap.set(el, {opacity:0, y:46, scale:0.9, rotation: tilt-4});
      ScrollTrigger.create({
        trigger: el, start:'top 86%', once:true,
        onEnter: function(){
          gsap.to(el, {opacity:1, y:0, scale:1, rotation:tilt, duration:0.5, ease:'back.out(1.6)'});
        }
      });
    });

    // cover specs pop ind sekventielt
    gsap.from('#cover .spec', {opacity:0, y:24, scale:0.8, stagger:0.08, duration:0.45, ease:'back.out(2)', delay:0.2});
    gsap.from('#cover h1', {opacity:0, scale:0.85, duration:0.6, ease:'back.out(1.7)'});
  }

})();
