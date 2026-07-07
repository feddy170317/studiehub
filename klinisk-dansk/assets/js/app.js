/* ============================================================
   KLINISK DANSK — app.js
   Bygger stage 1 (ordforråd), 2 (dokumentation), 3 (patientnotat),
   styrer stage-navigation + progress-bar, og starter quizzen (stage 4).
   Kaldes via window.KD_START('dag1').
   ============================================================ */
window.KD_START = function(slug){
  'use strict';
  var day = window.KD_DAYS && window.KD_DAYS[slug];
  if(!day){ console.error('Ingen data for', slug); return; }

  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---------- intro ---------- */
  document.getElementById('dayIntro').textContent = day.intro;

  /* ---------- top score chip ---------- */
  var scoreVal = document.getElementById('score-val');
  function setScore(v){ scoreVal.textContent = v.toLocaleString('da-DK'); }

  /* ---------- progress bar (scroll) ---------- */
  var progEl = document.getElementById('progress');
  function updateProgress(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    progEl.style.width=(h>0?(window.scrollY/h*100):0)+'%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});

  /* =========================================================
     STAGE 1 — ORDFORRÅD (flashcards, grouped by word class)
     ========================================================= */
  var GROUPS = [
    { key:'subst', label:'Substantiver', posLabel:'substantiv' },
    { key:'verb',  label:'Verber',       posLabel:'verbum' },
    { key:'adj',   label:'Adjektiver',   posLabel:'adjektiv' }
  ];
  var tabsEl = document.getElementById('groupTabs');
  var gridEl = document.getElementById('vocabGrid');

  tabsEl.innerHTML = GROUPS.map(function(g,i){
    var n = (day.ordforraad[g.key]||[]).length;
    return '<button data-g="'+g.key+'" class="'+(i===0?'active':'')+'">'+g.label+' ('+n+')</button>';
  }).join('');

  function renderGroup(key){
    var pos = GROUPS.filter(function(g){return g.key===key;})[0].posLabel;
    var items = day.ordforraad[key]||[];
    gridEl.innerHTML = items.map(function(w){
      return '<div class="flip" data-f><div class="flip-in">'+
          '<div class="flface ffront">'+
            '<div class="word">'+esc(w.da)+'</div>'+
            '<div class="pos">'+pos+'</div>'+
            '<div class="fliphint">Klik for engelsk →</div>'+
          '</div>'+
          '<div class="flface fback">'+
            '<div class="en">'+esc(w.en)+'</div>'+
            (w.koll?'<div class="koll">'+esc(w.koll)+'</div>':'')+
            '<div class="eks">“'+esc(w.eks_da)+'”<br><span class="t">'+esc(w.eks_en)+'</span></div>'+
          '</div>'+
        '</div></div>';
    }).join('');
    gridEl.querySelectorAll('[data-f]').forEach(function(f){
      f.addEventListener('click', function(){ f.classList.toggle('flipped'); });
    });
  }
  tabsEl.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      tabsEl.querySelectorAll('button').forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      renderGroup(b.getAttribute('data-g'));
    });
  });
  renderGroup('subst');

  /* =========================================================
     STAGE 2 — DOKUMENTATION (rules + good/bad pairs)
     ========================================================= */
  var ruleList = document.getElementById('ruleList');
  ruleList.innerHTML = (day.dokumentation.regler||[]).map(function(r){
    return '<li>'+esc(r.da)+'<span class="en">'+esc(r.en)+'</span></li>';
  }).join('');

  var docPairs = document.getElementById('docPairs');
  docPairs.innerHTML = (day.dokumentation.par||[]).map(function(p){
    return '<div class="docpair">'+
        '<div class="bad"><div class="lbl">✗ Dårligt</div>'+esc(p.daarlig)+'</div>'+
        '<div class="good"><div class="lbl">✓ Godt</div>'+esc(p.god)+'</div>'+
        '<button class="toggle">Hvorfor? ▾</button>'+
        '<div class="why">'+esc(p.hvorfor)+'</div>'+
      '</div>';
  }).join('');
  docPairs.querySelectorAll('.toggle').forEach(function(t){
    t.addEventListener('click', function(){
      var pair=t.closest('.docpair'); pair.classList.toggle('open');
      t.textContent = pair.classList.contains('open') ? 'Skjul forklaring ▴' : 'Hvorfor? ▾';
    });
  });

  /* =========================================================
     STAGE 3 — PATIENTNOTAT (note + exercises)
     ========================================================= */
  document.getElementById('noteTitle').textContent = day.notat.titel;
  document.getElementById('noteDa').textContent = day.notat.note_da;
  document.getElementById('noteEn').textContent = day.notat.note_en;
  var noteBox=document.getElementById('noteBox'), toggleEn=document.getElementById('toggleEn');
  toggleEn.addEventListener('click', function(){
    noteBox.classList.toggle('show-en');
    toggleEn.textContent = noteBox.classList.contains('show-en') ? 'Skjul engelsk oversættelse' : 'Vis engelsk oversættelse';
  });

  var TYPE_LABEL = { omskriv:'Omskriv objektivt', udfyld:'Udfyld verbet', spot:'Find vurderingen' };
  var exList=document.getElementById('exList');
  exList.innerHTML = (day.notat.ovelser||[]).map(function(e,i){
    return '<div class="ex" data-i="'+i+'">'+
        '<span class="type">'+(TYPE_LABEL[e.type]||'Øvelse')+'</span>'+
        '<div class="q">'+esc(e.sporg)+'</div>'+
        '<textarea placeholder="Skriv dit svar her…"></textarea>'+
        '<div class="row">'+
          '<button class="minibtn act-facit">Vis facit</button>'+
          (e.hjaelp?'<button class="minibtn act-hint">Hjælp</button>':'')+
        '</div>'+
        (e.hjaelp?'<div class="hint">💡 '+esc(e.hjaelp)+'</div>':'')+
        '<div class="facit"><span class="fl">Facit</span><div style="margin-top:6px">'+esc(e.facit)+'</div></div>'+
      '</div>';
  }).join('');
  exList.querySelectorAll('.ex').forEach(function(ex){
    var f=ex.querySelector('.act-facit'); if(f) f.addEventListener('click', function(){ ex.classList.add('reveal'); });
    var h=ex.querySelector('.act-hint');  if(h) h.addEventListener('click', function(){ ex.classList.toggle('hinted'); });
  });

  /* =========================================================
     STAGE NAVIGATION
     ========================================================= */
  var nav=document.getElementById('stagenav');
  var stages=[0,1,2,3].map(function(i){ return document.getElementById('stage-'+i); });
  var quizMounted=false;
  function showStage(n){
    nav.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', +b.getAttribute('data-stage')===n); });
    stages.forEach(function(s,i){ s.classList.toggle('on', i===n); });
    if(n===3 && !quizMounted){
      window.KD_QUIZ.mount(document.getElementById('mc-slot'), day, { onScore:setScore });
      quizMounted=true;
    }
    window.scrollTo({top:0,behavior:'smooth'});
    updateProgress();
  }
  nav.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){ showStage(+b.getAttribute('data-stage')); });
  });

  updateProgress();
};
