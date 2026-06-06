/* ============================================================
   MEK2 Gennemgang — motor (hub + opgave-view).
   Datadrevet: WALK_MANIFEST (alle 9 opgaver) + WALK_OPGAVER[id].
   En opgave er "klar" hvis den har data i WALK_OPGAVER.
   Aktivt format: resultatet er skjult bag klik (eller "vis alt").
   ============================================================ */
(function(){
  'use strict';
  var app, progEl, showBtn;

  document.addEventListener('DOMContentLoaded', function(){
    app=document.getElementById('app');
    progEl=document.getElementById('progress');
    showBtn=document.getElementById('show-btn');
    document.getElementById('home-btn').addEventListener('click', renderHub);
    showBtn.addEventListener('click', toggleShowAll);
    document.addEventListener('keydown', function(e){
      if(e.key==='s'||e.key==='S') toggleShowAll();
    });
    window.addEventListener('scroll', updateProgress, {passive:true});
    renderHub();
  });

  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function ready(id){ return !!(window.WALK_OPGAVER && window.WALK_OPGAVER[id]); }

  // Formel: hvis strengen indeholder en backslash (LaTeX) → KaTeX-render hver linje (\n-delt);
  // ellers gammeldags HTML (uændret). Gør konvertering inkrementel.
  function renderFormel(f){
    if(!f) return '';
    if(f.indexOf('\\')<0) return '<div class="formel">'+f+'</div>';
    var inner=f.split('\n').map(function(l){ return '<div class="mathline">'+l+'</div>'; }).join('');
    return '<div class="formel tex">'+inner+'</div>';
  }
  // Auto-konverter prosa-matematik (σ_x, τ_θ, R_A, σ̄, σ₁ …) til inline-LaTeX \( … \).
  // Beskytter eksisterende \( … \) og rører ikke ved HTML-tags (ingen græsk/underscore-subscript dér).
  var GREEK={'σ':'\\sigma','τ':'\\tau','θ':'\\theta','ρ':'\\rho','ν':'\\nu','φ':'\\varphi','γ':'\\gamma','ε':'\\varepsilon','λ':'\\lambda','δ':'\\delta','π':'\\pi','μ':'\\mu','Σ':'\\Sigma','Δ':'\\Delta'};
  var SUBU={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4'};
  function mathify(s){
    if(!s) return s;
    var stash=[];
    s=s.replace(/\\\([\s\S]*?\\\)/g, function(m){ stash.push(m); return '@@P'+(stash.length-1)+'@@'; });
    s=s.replace(/([στ])̄/g, function(m,b){ return '\\(\\bar'+(GREEK[b]||b)+'\\)'; });        // σ̄, τ̄
    s=s.replace(/([A-Za-zσττθρνφγελδπμΣΔ])_(\{[^}]+\}|[A-Za-z0-9θæøåÆØÅ]+)/g, function(m,b,sub){     // base_subscript
      var base=GREEK[b]||b;
      sub=sub.replace(/^\{|\}$/g,'').replace(/θ/g,'\\theta')
             .replace(/æ/g,'ae').replace(/ø/g,'oe').replace(/å/g,'aa').replace(/Æ/g,'Ae').replace(/Ø/g,'Oe').replace(/Å/g,'Aa');
      if(/^[A-Za-z]{2,}$/.test(sub)) sub='\\text{'+sub+'}';                                          // fler-bogstavs-indeks opret
      return '\\('+base+'_{'+sub+'}\\)';
    });
    s=s.replace(/([A-Za-zσττθρνφγελδπμΣΔ])([₀₁₂₃₄]+)/g, function(m,b,sub){                          // base+unicode-subscript
      var base=GREEK[b]||b, d=sub.replace(/[₀₁₂₃₄]/g,function(c){return SUBU[c];});
      return '\\('+base+'_{'+d+'}\\)';
    });
    s=s.replace(/[σττθρνφγελδπμΣΔ]/g, function(c){ return '\\('+(GREEK[c]||c)+'\\)'; });             // standalone græsk
    s=s.replace(/@@P(\d+)@@/g, function(m,i){ return stash[+i]; });
    return s;
  }

  function renderMath(){
    if(!window.katex){ setTimeout(renderMath,60); return; }
    document.querySelectorAll('.mathline:not([data-done])').forEach(function(el){
      try{ katex.render(el.textContent, el, {displayMode:true, throwOnError:false, fleqn:true}); }
      catch(e){}
      el.setAttribute('data-done','1');
    });
    // inline-matematik i overskrifter/tekst via \( ... \)
    if(window.renderMathInElement){
      try{ renderMathInElement(document.getElementById('app'), {
        delimiters:[{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}],
        ignoredClasses:['mathline'], throwOnError:false
      }); }catch(e){}
    }
  }
  function updateProgress(){ var h=document.documentElement.scrollHeight-window.innerHeight; progEl.style.width=(h>0?(window.scrollY/h*100):0)+'%'; }
  function toggleShowAll(){
    var on=document.body.classList.toggle('show-all');
    showBtn.textContent = on ? '🙈 Skjul facit' : '👁 Vis alt';
  }

  /* ===== HUB ===== */
  function renderHub(){
    window.scrollTo(0,0);
    document.body.classList.remove('show-all'); showBtn.textContent='👁 Vis alt';
    var man=window.WALK_MANIFEST||[];
    var klar=man.filter(function(m){return ready(m.id);}).length;
    var cards=man.map(function(m){
      var a=ready(m.id);
      return '<div class="ocard '+(a?'':'locked')+'" data-id="'+m.id+'">'+
        (a?'':'<span class="soon">Kommer snart</span>')+
        (a?'<span class="vaegt">'+esc(m.badge||'')+'</span>':'')+
        '<div class="no">'+esc(m.no)+'</div>'+
        '<h3>'+esc(m.titel)+'</h3>'+
        '<div class="sub">'+esc(m.sub||'')+'</div>'+
      '</div>';
    }).join('');
    app.innerHTML=''+
      '<div class="hero">'+
        '<h1>MEK2 <span class="ink">GENNEMGANG</span></h1>'+
        '<p>Forstå <b>hvorfor</b> vi gør, som vi gør — trin for trin gennem eksamensopgaverne. Vælg en opgave. '+klar+' af '+man.length+' er klar.</p>'+
      '</div>'+
      '<div class="grid">'+cards+'</div>';
    app.querySelectorAll('.ocard[data-id]').forEach(function(c){
      c.addEventListener('click', function(){ var id=c.getAttribute('data-id'); if(ready(id)) openOpgave(id); });
    });
    updateProgress();
  }

  /* ===== OPGAVE VIEW ===== */
  function openOpgave(id){
    window.scrollTo(0,0);
    document.body.classList.remove('show-all'); showBtn.textContent='👁 Vis alt';
    var o=window.WALK_OPGAVER[id];
    var man=(window.WALK_MANIFEST||[]).filter(function(m){return m.id===id;})[0]||{};

    var ref=(o.reference||[]).map(function(r){
      return '<div class="ref-item"><span class="navn">'+mathify(r.navn)+'</span>'+
        renderFormel(r.formel)+
        (r.nb?'<div class="nb">'+mathify(r.nb)+'</div>':'')+
        (r.kilde?'<div class="kilde">📖 '+r.kilde+'</div>':'')+'</div>';
    }).join('');

    var steps=(o.steps||[]).map(function(s,i){
      return '<div class="step">'+
        '<div class="trin"><span class="tnum">'+(i+1)+'</span>'+(s.del?'<span class="del">'+s.del+'</span>':'')+'</div>'+
        '<div class="hvad">'+mathify(s.hvad)+'</div>'+
        '<div class="hvorfor"><span class="tag">Hvorfor?</span>'+mathify(s.hvorfor)+'</div>'+
        renderFormel(s.formel)+
        (s.kilde?'<div class="kilde">📖 '+s.kilde+'</div>':'')+
        (s.figur?'<div class="figbox">'+s.figur+'</div>'+(s.figcap?'<div class="figcap">'+mathify(s.figcap)+'</div>':''):'')+
        (s.resultat?'<div class="reveal" data-r tabindex="0" role="button">'+
            '<div class="cover"><span class="q">?</span><span>Klik for resultat</span></div>'+
            '<div class="res"><span class="navn">Resultat</span>'+mathify(s.resultat)+'</div>'+
          '</div>':'')+
      '</div>';
    }).join('');

    var check=(o.selvcheck||[]).map(function(c){
      return '<div class="'+(c.status==='warn'?'warn':'ok')+'">'+(c.status==='warn'?'!':'✓')+'</div>'+
             '<div><b>'+mathify(c.tjek)+'</b> — <span class="dim">'+mathify(c.note)+'</span></div>';
    }).join('');

    app.innerHTML=''+
      '<div class="ohead">'+
        '<div class="kk">Opgave '+esc(man.no)+(man.badge?' · '+esc(man.badge):'')+'</div>'+
        '<h2>'+esc(o.titel)+'</h2>'+
        (o.undertitel?'<div class="vaegt">'+esc(o.undertitel)+'</div>':'')+
      '</div>'+
      (o.opgavetekst?'<div class="panel opg"><h3>Opgaven</h3><div class="delspg">'+mathify(o.opgavetekst)+'</div></div>':'')+
      (ref?'<details class="ref"><summary>Formler &amp; reference — hvad bruger vi?</summary><div class="kilde" style="margin:4px 0 2px">📚 Lærebog: Hibbeler, <i>Mechanics of Materials</i> (Mekanik bog 2)</div>'+ref+'</details>':'')+
      steps+
      (check?'<div class="panel"><h3>Selv-tjek</h3><div class="check">'+check+'</div></div>':'')+
      (o.variant?'<div class="panel variant"><h3>Øvelsesvariant</h3><div>'+mathify(o.variant)+'</div></div>':'')+
      '<div class="row"><button class="bigbtn" id="back">← Alle opgaver</button>'+
        '<button class="bigbtn alt" id="showall2">👁 Vis alle resultater</button></div>';

    app.querySelectorAll('.reveal[data-r]').forEach(function(b){
      var open=function(){ b.classList.add('shown'); };
      b.addEventListener('click', open);
      b.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
    });
    document.getElementById('back').addEventListener('click', renderHub);
    document.getElementById('showall2').addEventListener('click', toggleShowAll);
    renderMath();
    updateProgress();
  }
})();
