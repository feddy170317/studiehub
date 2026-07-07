/* ============================================================
   KLINISK DANSK — quiz-motor (stage 4)
   Arcade-scoring + sværhedsgrader, adapteret fra MMT smedje-quiz.
   Eksponerer window.KD_QUIZ.mount(container, dayData, hooks).
   ============================================================ */
window.KD_QUIZ = (function(){
  'use strict';
  var PTS={ let:100, middel:200, svaer:300 };
  var LVL={ let:{t:'LET',c:'let'}, middel:{t:'MIDDEL',c:'mid'}, svaer:{t:'SVÆR',c:'sv'} };
  var ORDER={ let:0, middel:1, svaer:2 };
  var LS='kd_best_v1::';

  var Q=null, els=null, onScore=null;

  function getBest(id){ try{ return JSON.parse(localStorage.getItem(LS+id)); }catch(e){ return null; } }
  function setBest(id,o){ try{ localStorage.setItem(LS+id, JSON.stringify(o)); }catch(e){} }
  function lvlOf(q){ return (q.level && PTS[q.level]) ? q.level : 'middel'; }
  function sortedMC(mc){ return (mc||[]).slice().sort(function(a,b){ return ORDER[lvlOf(a)]-ORDER[lvlOf(b)]; }); }

  function grade(pct){
    if(pct>=90) return {t:'OVERLÆGE-DANSK', s:'★★★★★', d:'Dit fagsprog er skarpt og objektivt — klar til klinikken.'};
    if(pct>=75) return {t:'RUTINERET',      s:'★★★★☆', d:'Solidt greb om dokumentationssproget.'};
    if(pct>=60) return {t:'PÅ VEJ',          s:'★★★☆☆', d:'God form — finpuds verber og betingelser.'};
    if(pct>=40) return {t:'ØVER SIG',        s:'★★☆☆☆', d:'Grundlaget er der. Kør flip-kortene og prøv igen.'};
    return             {t:'NYBEGYNDER',     s:'★☆☆☆☆', d:'Læs ordforrådet igennem og tag quizzen en gang til.'};
  }

  function mount(container, day, hooks){
    onScore = hooks && hooks.onScore;
    els = {
      slot: container,
      count: document.getElementById('q-count'),
      fill:  document.getElementById('q-fill'),
      combo: document.getElementById('combo')
    };
    Q = { id:day.slug, mc:sortedMC(day.quiz.mc), cards:day.quiz.cards||[], idx:0, score:0, combo:0, correct:0, answered:false };
    Q.total = Q.mc.length;
    setScore(0); hideCombo();
    renderMC();
  }

  function setScore(v){ if(onScore) onScore(v); }

  function renderMC(){
    var q=Q.mc[Q.idx]; Q.answered=false;
    var lv=LVL[lvlOf(q)];
    els.count.textContent='Spørgsmål '+(Q.idx+1)+' af '+Q.total;
    els.fill.style.width=(Q.idx/Q.total*100)+'%';
    var opts=q.options.map(function(o,i){
      var L=String.fromCharCode(65+i);
      return '<button class="opt" data-i="'+i+'"><span class="lett">'+L+'</span><span class="txt">'+o+'</span><span class="mark"></span></button>';
    }).join('');
    els.slot.innerHTML=
      '<div class="panel">'+
        '<div class="mc-top"><span class="qn">Spørgsmål '+(Q.idx+1)+'</span>'+
          '<span class="lvl '+lv.c+'">'+lv.t+' · '+PTS[lvlOf(q)]+'p</span></div>'+
        '<div class="qtext">'+q.q+'</div>'+
        '<div id="opts">'+opts+'</div>'+
        '<div class="why" id="why"></div>'+
        '<div id="nextrow" style="margin-top:16px;display:none"></div>'+
      '</div>';
    els.slot.querySelectorAll('.opt').forEach(function(b){
      b.addEventListener('click', function(){ answer(parseInt(b.getAttribute('data-i'),10)); });
    });
  }

  function answer(i){
    if(Q.answered) return; Q.answered=true;
    var q=Q.mc[Q.idx], correct=(i===q.correct);
    els.slot.querySelectorAll('#opts .opt').forEach(function(b,bi){
      b.disabled=true;
      if(bi===q.correct){ b.classList.add('correct'); b.querySelector('.mark').textContent='✓'; }
      if(bi===i && !correct){ b.classList.add('wrong'); b.querySelector('.mark').textContent='✗'; }
    });
    var gained=0;
    if(correct){ Q.combo++; Q.correct++; gained=PTS[lvlOf(q)]*Q.combo; Q.score+=gained; setScore(Q.score); showCombo(Q.combo); }
    else { Q.combo=0; hideCombo(); }
    var why=document.getElementById('why');
    why.className='why '+(correct?'':'miss')+' show';
    why.innerHTML='<span class="wtag">'+(correct?'✓ Rigtigt!':'✗ Ikke helt')+'</span>'+
      (correct?'<span class="pts">+'+gained.toLocaleString('da-DK')+'p'+(Q.combo>1?' (combo ×'+Q.combo+')':'')+'</span>':'')+
      '<div style="margin-top:8px">'+q.why+'</div>';
    var last=(Q.idx>=Q.total-1);
    var row=document.getElementById('nextrow'); row.style.display='block';
    row.innerHTML='<button class="bigbtn" id="nextbtn">'+(last?'Se resultat →':'Næste →')+'</button>';
    els.fill.style.width=((Q.idx+1)/Q.total*100)+'%';
    var nb=document.getElementById('nextbtn');
    nb.addEventListener('click', function(){ if(last){ renderResults(); } else { Q.idx++; renderMC(); window.scrollTo({top:0,behavior:'smooth'}); } });
    nb.focus();
  }

  function showCombo(c){
    if(c<2){ hideCombo(); return; }
    els.combo.textContent='🔥 COMBO ×'+c;
    els.combo.classList.add('on'); els.combo.classList.remove('bump');
    void els.combo.offsetWidth; els.combo.classList.add('bump');
  }
  function hideCombo(){ els.combo.classList.remove('on'); }

  function renderResults(){
    var pct=Math.round(Q.correct/Q.total*100), g=grade(pct);
    var prev=getBest(Q.id), isRecord=!prev || Q.score>prev.score;
    if(isRecord) setBest(Q.id,{pct:pct,score:Q.score});
    var cards=Q.cards.map(function(c){
      return '<div class="flip" data-f><div class="flip-in">'+
        '<div class="flface ffront"><div class="word">'+c.q+'</div><div class="fliphint">Klik for at vende</div></div>'+
        '<div class="flface fback"><div>'+c.a+'</div></div></div></div>';
    }).join('');
    els.slot.innerHTML=
      '<div class="panel results">'+
        '<div class="dim" style="font-size:34px">🫀</div>'+
        '<div class="big">'+Q.score.toLocaleString('da-DK')+'</div>'+
        '<div class="dim">point · '+Q.correct+'/'+Q.total+' rigtige ('+pct+'%)</div>'+
        '<div class="stars">'+g.s+'</div>'+
        '<div class="grade">'+g.t+'</div>'+
        '<div class="detail">'+g.d+'</div>'+
        (isRecord?'<div class="detail" style="color:var(--gold);font-weight:700">🏆 Ny topscore!</div>'
                 :(prev?'<div class="detail">Topscore: '+prev.score.toLocaleString('da-DK')+'p ('+prev.pct+'%)</div>':''))+
        '<div class="row">'+
          '<button class="bigbtn" id="retry">↻ Prøv igen</button>'+
          '<a class="bigbtn alt" href="index.html">← Alle dage</a>'+
        '</div>'+
      '</div>'+
      (cards?'<div class="panel"><h3 style="margin-top:0">🃏 Træn videre — flip-kort</h3>'+
        '<p class="dim" style="margin-top:0">Sig svaret højt, klik for at vende. Ingen point her — ren genkaldelse.</p>'+
        '<div class="cardgrid">'+cards+'</div></div>':'');
    els.fill.style.width='100%';
    els.count.textContent='Færdig!';
    hideCombo();
    els.slot.querySelectorAll('[data-f]').forEach(function(f){ f.addEventListener('click',function(){ f.classList.toggle('flipped'); }); });
    document.getElementById('retry').addEventListener('click', function(){ Q.idx=0;Q.score=0;Q.combo=0;Q.correct=0; setScore(0); renderMC(); window.scrollTo({top:0,behavior:'smooth'}); });
    window.scrollTo({top:0,behavior:'smooth'});
  }

  return { mount: mount };
})();
