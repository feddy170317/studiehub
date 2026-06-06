/* ============================================================
   QUIZ-MOTOR (tema-agnostisk) — arcade-scoring + sværhedsgrader
   Datadrevet: window.MMT_MANIFEST (alle emner) +
   window.MMT_TOPICS[id] (fuldt indhold for byggede emner).
   Et emne er "aktivt" hvis det har data i MMT_TOPICS.

   Sværhedsgrader pr. spørgsmål: q.level = 'let' | 'middel' | 'svaer'
   (default 'middel'). Sværere spørgsmål giver flere grundpoint.
   Spørgsmål sorteres let → middel → svær (optrapning).
   ============================================================ */
(function(){
  'use strict';
  var app, topbarScore, comboEl, progEl;
  var PTS={ let:100, middel:200, svaer:300 };   // grundpoint pr. niveau
  var LVL={ let:{t:'LET',c:'lvl-let'}, middel:{t:'MIDDEL',c:'lvl-mid'}, svaer:{t:'SVÆR',c:'lvl-svaer'} };
  var ORDER={ let:0, middel:1, svaer:2 };
  var LS='mmt_best_v1::';

  document.addEventListener('DOMContentLoaded', function(){
    app=document.getElementById('app');
    topbarScore=document.getElementById('score-val');
    comboEl=document.getElementById('combo');
    progEl=document.getElementById('progress');
    spawnEmbers();
    window.addEventListener('scroll', updateProgress, {passive:true});
    document.getElementById('home-btn').addEventListener('click', renderHub);
    renderHub();
  });

  /* ---------- helpers ---------- */
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function getBest(id){ try{ return JSON.parse(localStorage.getItem(LS+id)); }catch(e){ return null; } }
  function setBest(id,o){ try{ localStorage.setItem(LS+id, JSON.stringify(o)); }catch(e){} }
  function isActive(id){ return !!(window.MMT_TOPICS && window.MMT_TOPICS[id]); }
  function lvlOf(q){ return (q.level && PTS[q.level]) ? q.level : 'middel'; }
  function renderMath(node){
    if(window.renderMathInElement){
      try{ renderMathInElement(node,{delimiters:[{left:'\\(',right:'\\)',display:false},{left:'\\[',right:'\\]',display:true}],throwOnError:false}); }catch(e){}
    }
  }
  function updateProgress(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    progEl.style.width=(h>0?(window.scrollY/h*100):0)+'%';
  }
  function setScore(v){ topbarScore.textContent=v.toLocaleString('da-DK'); }
  function sortedMC(t){ return (t.mc||[]).slice().sort(function(a,b){ return ORDER[lvlOf(a)]-ORDER[lvlOf(b)]; }); }
  function levelCounts(t){ var c={let:0,middel:0,svaer:0}; (t.mc||[]).forEach(function(q){ c[lvlOf(q)]++; }); return c; }

  /* ---------- grader (smede-tema, kan overstyres pr. tema) ----------
     Tema-override: sæt window.QUIZ_GRADES = [{min,t,s,d}, …] (faldende min). */
  function grade(pct){
    if(window.QUIZ_GRADES){
      for(var i=0;i<window.QUIZ_GRADES.length;i++){ if(pct>=window.QUIZ_GRADES[i].min) return window.QUIZ_GRADES[i]; }
      return window.QUIZ_GRADES[window.QUIZ_GRADES.length-1];
    }
    if(pct>=90) return {t:'STÅLMESTER', s:'★★★★★', d:'Damaskstål-niveau — du kan faget i søvne.'};
    if(pct>=75) return {t:'MESTERSMED', s:'★★★★☆', d:'Solidt hærdet. Klar til eksamensbordet.'};
    if(pct>=60) return {t:'SMEDESVEND', s:'★★★☆☆', d:'God form — finpuds de sidste emner.'};
    if(pct>=40) return {t:'LÆRLING',    s:'★★☆☆☆', d:'Grundlaget er der. Kør en runde til.'};
    return            {t:'RÅJERN',     s:'★☆☆☆☆', d:'Ubearbejdet endnu — varmen er tændt, kør igen!'};
  }

  /* ============================================================ HUB */
  function renderHub(){
    window.scrollTo(0,0);
    var man=window.MMT_MANIFEST||[];
    var done=0, sumPct=0, builtCount=0;
    man.forEach(function(m){ if(isActive(m.id)){ builtCount++; var b=getBest(m.id); if(b){ done++; sumPct+=b.pct; } } });
    var avg=done?Math.round(sumPct/done):0;
    var mat=man.filter(function(m){return m.cat==='mat';});
    var tek=man.filter(function(m){return m.cat==='tek';});

    app.innerHTML=''+
      '<div class="hero">'+
        '<h1>'+(window.QUIZ_TITLE||'MMT2 <span class="heat-text">SMEDJE</span>-QUIZ')+'</h1>'+
        '<p>'+(window.QUIZ_INTRO||'Hærd din eksamensviden i ilden. Vælg et emne, svar rigtigt, byg combo — og slå din egen topscore.')+' '+builtCount+' af '+man.length+' emner er smedet klar.</p>'+
        '<div class="overall">'+
          '<div><div class="lab">Emner gennemført</div><div class="num gold">'+done+'/'+builtCount+'</div></div>'+
          '<div><div class="lab">Gennemsnit</div><div class="num">'+avg+'%</div></div>'+
        '</div>'+
      '</div>'+
      '<div class="cat-head mat"><span class="dot"></span>'+(window.QUIZ_CAT1||'Materialevidenskab')+'</div>'+
      '<div class="grid">'+ mat.map(cardHTML).join('') +'</div>'+
      (tek.length?'<div class="cat-head tek"><span class="dot"></span>'+(window.QUIZ_CAT2||'Fremstillingsteknologi')+'</div><div class="grid">'+ tek.map(cardHTML).join('') +'</div>':'');

    setScore(0);
    app.querySelectorAll('.card[data-id]').forEach(function(c){
      c.addEventListener('click', function(){ var id=c.getAttribute('data-id'); if(isActive(id)) openTopic(id); });
    });
    updateProgress();
  }

  function cardHTML(m){
    var active=isActive(m.id);
    var best=active?getBest(m.id):null;
    var nq=active?(window.MMT_TOPICS[m.id].mc||[]).length:0;
    var spread='';
    if(active){ var c=levelCounts(window.MMT_TOPICS[m.id]); spread='<span class="dim">'+c.let+' lette · '+c.middel+' middel · '+c.svaer+' svære</span>'; }
    var bestLine=best?'<span class="best">🔥 '+best.pct+'% · '+best.score.toLocaleString('da-DK')+'p</span>':(active?'<span class="dim">Ikke spillet endnu</span>':'');
    return ''+
    '<div class="card '+(active?'':'locked')+'" data-id="'+m.id+'">'+
      '<span class="qno">'+m.no+'</span>'+
      '<div class="emoji">'+m.emoji+'</div>'+
      '<h3>'+esc(m.title)+'</h3>'+
      '<div class="sub">'+esc(m.sub)+'</div>'+
      '<div class="meta">'+
        (active? '<span class="pill">'+nq+' spørgsmål</span>'+bestLine
               : '<span class="pill soon">Kommer snart</span>')+
      '</div>'+
      (active?'<div class="meta" style="margin-top:6px">'+spread+'</div>':'')+
    '</div>';
  }

  /* ============================================================ QUIZ */
  var Q=null;
  function openTopic(id){
    window.scrollTo(0,0);
    var t=window.MMT_TOPICS[id];
    var man=(window.MMT_MANIFEST||[]).filter(function(m){return m.id===id;})[0]||{};
    Q={ id:id, t:t, man:man, mc:sortedMC(t), idx:0, score:0, combo:0, correct:0, answered:false };
    Q.total=Q.mc.length;
    setScore(0); hideCombo();

    var catClass=man.cat==='tek'?'tek':'mat';
    var examList=(t.examQs||[]).map(function(q){return '<li>'+esc(q)+'</li>';}).join('');
    app.innerHTML=''+
      '<div class="qhead">'+
        '<span class="kk '+catClass+'"><span class="dot"></span>'+(man.cat==='tek'?(window.QUIZ_CAT2||'Fremstillingsteknologi'):(window.QUIZ_CAT1||'Materialevidenskab'))+' · '+man.no+'</span>'+
        '<h2>'+esc(man.title)+'</h2>'+
      '</div>'+
      '<div class="panel intro">'+
        '<h3>🔥 Intuition</h3><div>'+t.intro+'</div>'+
        (t.analogi?'<div class="analogi">'+t.analogi+'</div>':'')+
        (examList?'<details><summary class="dim" style="cursor:pointer;margin-top:10px">Vis de oprindelige eksamensspørgsmål</summary><ul class="exam-qs">'+examList+'</ul></details>':'')+
      '</div>'+
      (t.svg?'<div class="panel"><h3>Diagram</h3><div class="figbox">'+t.svg+'</div>'+(t.svgCap?'<div class="figcap">'+t.svgCap+'</div>':'')+'</div>':'')+
      '<div class="qprog"><span class="lab" id="q-count"></span><div class="bar"><i id="q-fill"></i></div></div>'+
      '<div id="mc-slot"></div>';
    renderMath(app);
    renderMC();
  }

  function renderMC(){
    var q=Q.mc[Q.idx];
    Q.answered=false;
    var lv=LVL[lvlOf(q)];
    document.getElementById('q-count').textContent='Spørgsmål '+(Q.idx+1)+' af '+Q.total;
    document.getElementById('q-fill').style.width=(Q.idx/Q.total*100)+'%';
    var opts=q.options.map(function(o,i){
      var L=String.fromCharCode(65+i);
      return '<button class="opt" data-i="'+i+'"><span class="lett">'+L+'</span><span class="txt">'+o+'</span><span class="mark"></span></button>';
    }).join('');
    var slot=document.getElementById('mc-slot');
    slot.innerHTML=''+
      '<div class="mc">'+
        '<div class="mc-top"><span class="qn">Spørgsmål '+(Q.idx+1)+'</span><span class="lvl '+lv.c+'">'+lv.t+' · '+PTS[lvlOf(q)]+'p</span></div>'+
        '<div class="qtext">'+q.q+'</div>'+
        '<div id="opts">'+opts+'</div>'+
        '<div class="why" id="why"></div>'+
        '<div id="nextrow" style="margin-top:16px;display:none"></div>'+
      '</div>';
    renderMath(slot);
    slot.querySelectorAll('.opt').forEach(function(b){
      b.addEventListener('click', function(){ answer(parseInt(b.getAttribute('data-i'),10)); });
    });
    window.scrollTo({top:slot.getBoundingClientRect().top+window.scrollY-70, behavior:'smooth'});
  }

  function answer(i){
    if(Q.answered) return; Q.answered=true;
    var q=Q.mc[Q.idx];
    var correct=(i===q.correct);
    document.querySelectorAll('#opts .opt').forEach(function(b,bi){
      b.disabled=true;
      if(bi===q.correct){ b.classList.add('correct'); b.querySelector('.mark').textContent='✓'; }
      if(bi===i && !correct){ b.classList.add('wrong'); b.querySelector('.mark').textContent='✗'; }
    });
    var gained=0;
    if(correct){
      Q.combo++; Q.correct++; gained=PTS[lvlOf(q)]*Q.combo; Q.score+=gained;
      setScore(Q.score); showCombo(Q.combo);
    } else { Q.combo=0; hideCombo(); }
    var why=document.getElementById('why');
    why.className='why '+(correct?'':'miss')+' show';
    why.innerHTML='<span class="wtag">'+(correct?'🔥 Rigtigt!':'✗ Ikke helt')+'</span>'+
      (correct?'<span class="pts">+'+gained.toLocaleString('da-DK')+'p'+(Q.combo>1?' (combo ×'+Q.combo+')':'')+'</span>':'')+
      '<div style="margin-top:8px">'+q.why+'</div>';
    renderMath(why);

    var last=(Q.idx>=Q.total-1);
    var row=document.getElementById('nextrow'); row.style.display='block';
    row.innerHTML='<button class="bigbtn" id="nextbtn">'+(last?'⚒ Se resultat':'Næste →')+'</button>';
    document.getElementById('q-fill').style.width=((Q.idx+1)/Q.total*100)+'%';
    document.getElementById('nextbtn').addEventListener('click', function(){ if(last){ renderResults(); } else { Q.idx++; renderMC(); } });
    document.getElementById('nextbtn').focus();
  }

  function showCombo(c){
    if(c<2){ hideCombo(); return; }
    comboEl.textContent='🔥 COMBO ×'+c;
    comboEl.classList.add('on'); comboEl.classList.remove('bump');
    void comboEl.offsetWidth; comboEl.classList.add('bump');
  }
  function hideCombo(){ comboEl.classList.remove('on'); }

  /* ============================================================ RESULTS */
  function renderResults(){
    var t=Q.t;
    var pct=Math.round(Q.correct/Q.total*100);
    var g=grade(pct);
    var prev=getBest(Q.id);
    var isRecord=!prev || Q.score>prev.score;
    if(isRecord) setBest(Q.id,{pct:pct,score:Q.score});

    var cards=(t.cards||[]).map(function(c){
      return '<div class="flip" data-f><div class="flip-in">'+
        '<div class="flface ffront"><div class="q">'+c.q+'</div></div>'+
        '<div class="flface fback"><div>'+c.a+'</div></div></div></div>';
    }).join('');

    document.getElementById('mc-slot').innerHTML=''+
      '<div class="results">'+
        '<div class="anvil">'+(window.QUIZ_RESULT_ICON||'⚒')+'</div>'+
        '<div class="big"><span class="heat-text">'+Q.score.toLocaleString('da-DK')+'</span></div>'+
        '<div class="dim">point · '+Q.correct+'/'+Q.total+' rigtige ('+pct+'%)</div>'+
        '<div class="stars">'+g.s+'</div>'+
        '<div class="grade">'+g.t+'</div>'+
        '<div class="detail">'+g.d+'</div>'+
        (isRecord?'<div class="detail" style="color:var(--gold)">🏆 Ny topscore!</div>':(prev?'<div class="detail">Topscore: '+prev.score.toLocaleString('da-DK')+'p ('+prev.pct+'%)</div>':''))+
        '<div class="row">'+
          '<button class="bigbtn" id="retry">🔥 Prøv igen</button>'+
          '<button class="bigbtn alt" id="back">← Alle emner</button>'+
        '</div>'+
      '</div>'+
      (cards?'<div class="cards-sec"><h3>🃏 Træn videre — flip-kort</h3><div class="hint">Sig svaret højt, klik for at vende. Ingen point her — ren genkaldelse.</div><div class="cardgrid">'+cards+'</div></div>':'');
    document.getElementById('q-fill').style.width='100%';
    document.getElementById('q-count').textContent='Færdig!';
    renderMath(document.getElementById('mc-slot'));
    hideCombo();
    document.querySelectorAll('[data-f]').forEach(function(f){ f.addEventListener('click',function(){ f.classList.toggle('flipped'); }); });
    document.getElementById('retry').addEventListener('click', function(){ openTopic(Q.id); });
    document.getElementById('back').addEventListener('click', renderHub);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  /* ---------- embers ---------- */
  function spawnEmbers(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box=document.getElementById('embers'); if(!box) return;
    for(var i=0;i<22;i++){
      var e=document.createElement('span'); e.className='ember';
      e.style.left=(Math.random()*100)+'%';
      e.style.animationDuration=(6+Math.random()*9)+'s';
      e.style.animationDelay=(Math.random()*12)+'s';
      var s=2+Math.random()*4; e.style.width=s+'px'; e.style.height=s+'px';
      if(Math.random()>.5) e.style.background='var(--ember)';
      box.appendChild(e);
    }
  }
})();
