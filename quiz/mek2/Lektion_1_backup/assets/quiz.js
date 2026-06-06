/* ============================================================
   MEK2 QUIZ-MOTOR — arcade-scoring + sværhedsgrader
   Datadrevet: window.MEK2_L1 (fuldt indhold for lektion)
   ============================================================ */
(function(){
  'use strict';
  var app, topbarScore, comboEl, progEl;
  var PTS={ let:100, middel:200, svaer:300 };
  var LVL={ let:{t:'LET',c:'lvl-let'}, middel:{t:'MIDDEL',c:'lvl-mid'}, svaer:{t:'SVÆR',c:'lvl-svaer'} };
  var ORDER={ let:0, middel:1, svaer:2 };
  var LS='mek2_l1_best::';

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

  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function getBest(id){ try{ return JSON.parse(localStorage.getItem(LS+id)); }catch(e){ return null; } }
  function setBest(id,o){ try{ localStorage.setItem(LS+id, JSON.stringify(o)); }catch(e){} }
  function lvlOf(q){ return (q.level && PTS[q.level]) ? q.level : 'middel'; }
  function updateProgress(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    progEl.style.width=(h>0?(window.scrollY/h*100):0)+'%';
  }
  function setScore(v){ topbarScore.textContent=v.toLocaleString('da-DK'); }
  function sortedMC(t){ return (t.mc||[]).slice().sort(function(a,b){ return ORDER[lvlOf(a)]-ORDER[lvlOf(b)]; }); }

  function grade(pct){
    if(pct>=90) return {t:'MESTER', s:'★★★★★', d:'Perfekt — du kan alt!'};
    if(pct>=75) return {t:'AVANCERET', s:'★★★★☆', d:'Solid viden. Klar til eksamen.'};
    if(pct>=60) return {t:'DYGTIG', s:'★★★☆☆', d:'Godt fundament — øv lidt mere.'};
    if(pct>=40) return {t:'BEGYNDER', s:'★★☆☆☆', d:'Du er på vej. Kør igen!'};
    return            {t:'NYBEGYNDER', s:'★☆☆☆☆', d:'Varmen er tændt — kør igen!'};
  }

  /* HUB — Emnevalg */
  function renderHub(){
    window.scrollTo(0,0);
    var topic = window.MEK2_L1 && window.MEK2_L1['L1_spaending_toejning'];
    if(!topic){ app.innerHTML='<p style="color:red; padding:2rem;">Fejl: Quiz-data ikke indlæst. Tjek at lektion_1.js er aktiveret.</p>'; return; }
    var best=getBest('L1_spaending_toejning');
    var intro = topic.intro || 'MEK2 Lektion 1: Spænding og Tøjning';
    app.innerHTML=''+
      '<div class="hero">'+
        '<h1>📐 MEK2 LEKTION 1</h1>'+
        '<p>'+intro+'</p>'+
        '<button class="btn-start" onclick="window.startQuiz(\'L1_spaending_toejning\')">Start Quiz</button>'+
        (best ? '<div class="best-score"><strong>Din bedste:</strong> '+best.pct+'% ('+best.score+' point)</div>' : '')+
      '</div>';
  }

  /* QUIZ */
  window.startQuiz = function(topicId){
    window.scrollTo(0,0);
    var topic = window.MEK2_L1 && window.MEK2_L1[topicId];
    if(!topic){ alert('Emne ikke fundet: '+topicId); return; }
    var mc = sortedMC(topic);
    var state = { topicId:topicId, mc:mc, idx:0, score:0, correct:0, combo:0, answered:[] };
    renderQuestion(state);
  };

  function renderQuestion(state){
    window.scrollTo(0,0);
    if(state.idx >= state.mc.length){
      var pct = Math.round(state.correct / state.mc.length * 100);
      var best = getBest(state.topicId);
      if(!best || state.score > best.score){
        setBest(state.topicId, {score:state.score, pct:pct});
      }
      renderResult(state, pct);
      return;
    }
    var q = state.mc[state.idx];
    var lvl = lvlOf(q);
    var lbl = LVL[lvl];
    var html = '<div class="question-container">'+
      '<div class="q-header">'+
        '<span class="q-level '+lbl.c+'">'+lbl.t+'</span>'+
        '<span class="q-progress">'+esc(state.idx+1)+' / '+esc(state.mc.length)+'</span>'+
      '</div>'+
      '<div class="q-text">'+esc(q.q)+'</div>'+
      '<div class="q-options">';
    (q.options||[]).forEach(function(opt, i){
      html+='<button class="opt" onclick="window.answerQuestion('+i+', '+state.idx+')">'+esc(opt)+'</button>';
    });
    html+='</div></div>';
    app.innerHTML = html;
  }

  window.answerQuestion = function(chosenIdx, qIdx){
    var topic = window.MEK2_L1 && window.MEK2_L1[document.querySelector('.q-header') ? 'L1_spaending_toejning' : ''];
    if(!topic) return;
    var mc = sortedMC(topic);
    var q = mc[qIdx];
    var isCorrect = (chosenIdx === q.correct);
    var lvl = lvlOf(q);
    var pts = PTS[lvl] || 0;
    var state = window._quizState || { topicId:'L1_spaending_toejning', mc:mc, idx:0, score:0, correct:0, combo:0, answered:[] };

    state.idx = qIdx;
    state.answered.push({q:q.q, chosen:q.options[chosenIdx], correct:q.options[q.correct], isCorrect:isCorrect});
    if(isCorrect){
      state.correct++;
      state.combo++;
      state.score += pts * (1 + Math.floor(state.combo/2) * 0.1);
    } else {
      state.combo = 0;
      state.score += 0;
    }

    comboEl.textContent = state.combo > 1 ? '🔥 x'+state.combo : '';
    setScore(state.score);

    window._quizState = state;
    setTimeout(function(){ state.idx++; renderQuestion(state); }, 800);
  };

  function renderResult(state, pct){
    var gradeInfo = grade(pct);
    var html = '<div class="result-container">'+
      '<h2>Quiz Færdig!</h2>'+
      '<div class="result-grade">'+
        '<div class="grade-title">'+esc(gradeInfo.t)+'</div>'+
        '<div class="grade-stars">'+esc(gradeInfo.s)+'</div>'+
        '<div class="grade-desc">'+esc(gradeInfo.d)+'</div>'+
      '</div>'+
      '<div class="result-stats">'+
        '<div><strong>Point:</strong> '+state.score+'</div>'+
        '<div><strong>Rigtige:</strong> '+state.correct+' / '+state.mc.length+'</div>'+
        '<div><strong>Procent:</strong> '+pct+'%</div>'+
      '</div>';

    if(state.answered && state.answered.length > 0){
      html+='<div class="review"><h3>Gennemgang</h3>';
      state.answered.forEach(function(a, i){
        var cls = a.isCorrect ? 'review-correct' : 'review-wrong';
        html+='<div class="'+cls+'">'+
          '<strong>'+esc(a.q)+'</strong><br>'+
          'Dit svar: '+esc(a.chosen)+'<br>'+
          (a.isCorrect ? '' : 'Korrekt: '+esc(a.correct)+'<br>')+
        '</div>';
      });
      html+='</div>';
    }

    html+='<button class="btn-again" onclick="window.location.reload()">Prøv igen</button>'+
      '<button class="btn-home" onclick="window.startQuiz=null; window._quizState=null; renderHub();">← Hjem</button>'+
    '</div>';

    app.innerHTML = html;
  }

  function spawnEmbers(){
    var cont = document.getElementById('embers');
    if(!cont) return;
    for(var i=0; i<5; i++){
      var e = document.createElement('div');
      e.className = 'ember';
      e.style.left = Math.random()*100+'%';
      e.style.top = Math.random()*100+'%';
      e.style.animationDelay = (Math.random()*2)+'s';
      cont.appendChild(e);
    }
  }

  // Eksporter til global scope
  window.renderHub = renderHub;
})();
