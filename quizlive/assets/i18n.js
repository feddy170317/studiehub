/* ============================================================
   QuizLive — Sprog-infrastruktur (assets/i18n.js)
   Delt DA/EN-ordbog + sprogvalg for PLAYER- og HOST-UI'et
   (elev/vært-vendt chrome). Rører aldrig quiz-INDHOLD, som
   altid vises på det sprog quiz-forfatteren skrev det i.
   Ingen ES-moduler. Ren globals. Ingen Firebase-afhængighed —
   må loades før eller efter Firebase-scripts, blot FØR
   player.js/host.js.
   ============================================================ */

window.QL_I18N = {
  da: {
    /* --- Deltag-skærm (index.html) --- */
    'join.pinLabel': 'Spil-PIN',
    'join.elevPinLabel': 'Elev-PIN (hvis du er tilmeldt)',
    'join.orDivider': '— eller —',
    'join.nameLabel': 'Dit navn (som gæst)',
    'join.pinPlaceholder': '000000',
    'join.elevPinPlaceholder': '0000',
    'join.namePlaceholder': 'Dit navn',
    'join.btnJoin': 'Deltag',
    'join.errPinLength': 'PIN skal være 6 cifre.',
    'join.errElevPinLength': 'Elev-PIN skal være 4 cifre.',
    'join.errElevPinNotFound': 'PIN ikke genkendt — tjek koden, eller lad feltet stå tomt for at deltage som gæst.',
    'join.errElevPinLookupFailed': 'Kunne ikke slå elev-PIN op. Prøv igen.',
    'join.errNameRequired': 'Indtast dit navn.',
    'join.errGameNotFound': 'Spillet findes ikke. Tjek PIN.',
    'game.endedMsg': 'Spillet er afsluttet.',

    /* --- Lobby --- */
    'lobby.greetingDefault': 'Du er med!',
    'lobby.greeting': 'Du er med, {{name}}! 🎉 Kig op på skærmen.',
    'lobby.waitingMsg': 'Kig op på skærmen — spillet starter snart...',

    /* --- Spørgsmål/fremdrift --- */
    'question.answeredMsg': 'Svar sendt! ✔ Vent på resultatet...',
    'question.timeUp': 'Tiden er udløbet! ⏰',
    'progress.label': 'Spørgsmål {{n}}/{{total}}',

    /* --- Reveal (player) --- */
    'reveal.totalScoreLabel': 'Din totalscore',
    'reveal.waitingNext': 'Venter på næste spørgsmål...',
    'reveal.waiting': 'Vent...',
    'reveal.correct': 'RIGTIGT! +{{pts}}',
    'reveal.wrong': 'FORKERT',
    'reveal.streakBonus': '🔥 {{n}} i træk — +{{bonus}} bonus!',
    'reveal.placement': 'Du er nr. {{n}} af {{total}}',
    'reveal.placementDefault': 'Du er nr. ? af ?',

    /* --- Podiet --- */
    'podium.gameOver': 'Spillet er slut! 🏆',
    'podium.pointsLabel': 'point',
    'podium.wonSuddenDeath': '🥇 Du vandt sudden death! Tillykke!',
    'podium.first': '🥇 Du vandt! Tillykke!',
    'podium.second': '🥈 Du kom på 2.-pladsen!',
    'podium.third': '🥉 Du kom på 3.-pladsen!',
    'podium.other': 'Du endte på {{n}}. pladsen af {{total}}.',

    /* --- Sudden Death (player) --- */
    'sd.spectatorTitle': 'Sudden Death!',
    'sd.decidingDefault': 'Afgør uafgjort...',
    'sd.spectatorWaiting': 'Se skærmen — det er ikke dig denne gang.',
    'sd.roundLabel': '🔥 Runde {{n}} — {{level}}-niveau',
    'sd.survivors': '✅ Går videre: ',
    'sd.eliminated': '❌ Ude: ',
    'sd.winnerTag': '⚡ Sudden Death-vinder',

    /* --- Host: Setup-skærm --- */
    'host.chooseQuizLabel': 'Vælg quiz',
    'host.quizSelectedPrefix': '✅ Valgt: {{title}}',
    'host.changeQuiz': 'Skift quiz',
    'host.timerLabel': 'Tid per spørgsmål',
    'host.timer10': '10 sekunder',
    'host.timer15': '15 sekunder',
    'host.timer20': '20 sekunder',
    'host.timer30': '30 sekunder',
    'host.difficultyLabel': 'Sværhedsgrad',
    'host.diffRandom': 'Random (alle spørgsmål)',
    'host.diffEasy': 'Kun Let',
    'host.diffMedium': 'Kun Middel',
    'host.diffHard': 'Kun Svær',
    'host.btnCreate': 'Opret spil',
    'host.editorLink': '✏️ Åbn quiz-editoren',
    'host.rosterLink': '🎓 Administrér elevliste',
    'host.leaderboardLink': '🏆 Leaderboard',

    /* --- Host: Lobby --- */
    'host.shareCode': 'Del denne kode med spillerne',
    'host.copyLink': '📋 Kopiér link',
    'host.copyLinkDone': '✅ Kopieret!',
    'host.copyLinkFailed': '⚠ Kunne ikke kopiere',
    'host.qrUnavailable': '(QR ikke tilgængeligt)',
    'host.playerCountSingular': '{{n}} spiller',
    'host.playerCountPlural': '{{n}} spillere',
    'host.btnStart': 'Start spillet',

    /* --- Host: Spørgsmål/reveal/scoreboard --- */
    'host.answerCount': '{{n}}/{{total}} har svaret',
    'host.btnNext': 'Næste →',
    'host.scoreboardTitle': 'Stillingen',
    'host.btnNextQuestion': 'Næste spørgsmål →',
    'host.suddenDeathBtn': '⚡ Uafgjort! Afgør med Sudden Death',
    'host.btnEnd': 'Afslut & slet spil',
    'host.confirmEndGame': 'Er du sikker? Spillet og alle scorer slettes.',
    'host.drawingQuestions': 'Trækker spørgsmål...',

    /* --- Host: fejlbeskeder --- */
    'host.errChooseQuizFirst': 'Vælg en quiz først.',
    'host.errQuizDataNotFound': 'Quiz-data ikke fundet. Tjek at quizzen er loadet korrekt.',
    'host.errNoQuestionsForDifficulty': 'Denne quiz har ingen spørgsmål med sværhedsgraden "{{level}}".',
    'host.errBankDrawFailed': 'Kunne ikke trække spørgsmål fra banken: {{msg}}',
    'host.errSdNoMoreQuestions': 'Kunne ikke finde flere spørgsmål til sudden death: {{msg}}',
    'host.errSaveResultFailed': 'Kunne ikke gemme resultat for spiller {{pid}}:',

    /* --- Niveauer/sværhedsgrader --- */
    'level.let': 'Nem',
    'level.middel': 'Middel',
    'level.svaer': 'Svær',
    'difficulty.let': 'Let',
    'difficulty.middel': 'Middel',
    'difficulty.svaer': 'Svær',

    /* --- Katalog (host quiz-vælger) --- */
    'catalog.root': 'Kataloger',
    'catalog.builtin': '📦 Indbygget',
    'catalog.uncategorized': '❓ Ukategoriseret',
    'catalog.otherCourse': 'Andet fag',
    'catalog.otherLecture': 'Andet',
    'catalog.back': '◀ Tilbage',
    'catalog.quizCount': '{{n}} quizzer',
    'catalog.empty': 'Ingen quizzer fundet — opret en i quiz-editoren.',
    'catalog.loading': 'Indlæser quizzer...',
    'catalog.autoQuizzes': '🎲 Automatiske quizzer',
    'catalog.topicsCount': '{{n}} emner',
    'catalog.bankDrawInfo': '{{n}} tilfældige spørgsmål af {{pool}}',
    'catalog.bankNote': 'Trækker {{n}} tilfældige spørgsmål hver gang. Et spørgsmål går ikke igen, før alle andre i banken er brugt.',
    'catalog.questionCount': '{{n}} spørgsmål',
    'catalog.untitled': '(uden titel)',
    'catalog.unknownAuthor': 'ukendt',
    'catalog.uncategorizedWord': 'Ukategoriseret',
    'catalog.uncategorizedByAuthor': 'Ukategoriseret — af {{author}}',

    /* --- Spørgsmålsbank (drawFromBank) --- */
    'bank.errEmpty': 'Spørgsmålsbanken er tom — tjek Firebase-opsætningen.',
    'bank.errEmptyShort': 'Banken er tom.',
    'bank.errNoDifficulty': 'Banken har ingen spørgsmål med sværhedsgraden "{{level}}".',
    'bank.errReserveFailed': 'Kunne ikke reservere spørgsmål (en anden vært trak samtidig) — prøv igen.',

    /* --- Diverse --- */
    'error.unknown': 'ukendt fejl'
  },

  en: {
    /* --- Join screen (index.html) --- */
    'join.pinLabel': 'Game PIN',
    'join.elevPinLabel': 'Student PIN (if you are registered)',
    'join.orDivider': '— or —',
    'join.nameLabel': 'Your name (as guest)',
    'join.pinPlaceholder': '000000',
    'join.elevPinPlaceholder': '0000',
    'join.namePlaceholder': 'Your name',
    'join.btnJoin': 'Join',
    'join.errPinLength': 'PIN must be 6 digits.',
    'join.errElevPinLength': 'Student PIN must be 4 digits.',
    'join.errElevPinNotFound': 'PIN not recognized — check the code, or leave the field empty to join as a guest.',
    'join.errElevPinLookupFailed': 'Could not look up student PIN. Try again.',
    'join.errNameRequired': 'Enter your name.',
    'join.errGameNotFound': 'Game not found. Check the PIN.',
    'game.endedMsg': 'The game has ended.',

    /* --- Lobby --- */
    'lobby.greetingDefault': "You're in!",
    'lobby.greeting': "You're in, {{name}}! 🎉 Look up at the screen.",
    'lobby.waitingMsg': 'Look up at the screen — the game starts soon...',

    /* --- Question/progress --- */
    'question.answeredMsg': 'Answer sent! ✔ Waiting for the result...',
    'question.timeUp': "Time's up! ⏰",
    'progress.label': 'Question {{n}}/{{total}}',

    /* --- Reveal (player) --- */
    'reveal.totalScoreLabel': 'Your total score',
    'reveal.waitingNext': 'Waiting for the next question...',
    'reveal.waiting': 'Wait...',
    'reveal.correct': 'CORRECT! +{{pts}}',
    'reveal.wrong': 'WRONG',
    'reveal.streakBonus': '🔥 {{n}} in a row — +{{bonus}} bonus!',
    'reveal.placement': "You're #{{n}} of {{total}}",
    'reveal.placementDefault': "You're # ? of ?",

    /* --- Podium --- */
    'podium.gameOver': 'Game over! 🏆',
    'podium.pointsLabel': 'points',
    'podium.wonSuddenDeath': '🥇 You won sudden death! Congratulations!',
    'podium.first': '🥇 You won! Congratulations!',
    'podium.second': '🥈 You came 2nd!',
    'podium.third': '🥉 You came 3rd!',
    'podium.other': 'You finished #{{n}} of {{total}}.',

    /* --- Sudden Death (player) --- */
    'sd.spectatorTitle': 'Sudden Death!',
    'sd.decidingDefault': 'Deciding the tie...',
    'sd.spectatorWaiting': "Watch the screen — it's not your turn this time.",
    'sd.roundLabel': '🔥 Round {{n}} — {{level}} level',
    'sd.survivors': '✅ Moving on: ',
    'sd.eliminated': '❌ Out: ',
    'sd.winnerTag': '⚡ Sudden Death winner',

    /* --- Host: Setup screen --- */
    'host.chooseQuizLabel': 'Choose quiz',
    'host.quizSelectedPrefix': '✅ Selected: {{title}}',
    'host.changeQuiz': 'Change quiz',
    'host.timerLabel': 'Time per question',
    'host.timer10': '10 seconds',
    'host.timer15': '15 seconds',
    'host.timer20': '20 seconds',
    'host.timer30': '30 seconds',
    'host.difficultyLabel': 'Difficulty',
    'host.diffRandom': 'Random (all questions)',
    'host.diffEasy': 'Easy only',
    'host.diffMedium': 'Medium only',
    'host.diffHard': 'Hard only',
    'host.btnCreate': 'Create game',
    'host.editorLink': '✏️ Open quiz editor',
    'host.rosterLink': '🎓 Manage student roster',
    'host.leaderboardLink': '🏆 Leaderboard',

    /* --- Host: Lobby --- */
    'host.shareCode': 'Share this code with the players',
    'host.copyLink': '📋 Copy link',
    'host.copyLinkDone': '✅ Copied!',
    'host.copyLinkFailed': '⚠ Could not copy',
    'host.qrUnavailable': '(QR not available)',
    'host.playerCountSingular': '{{n}} player',
    'host.playerCountPlural': '{{n}} players',
    'host.btnStart': 'Start game',

    /* --- Host: Question/reveal/scoreboard --- */
    'host.answerCount': '{{n}}/{{total}} answered',
    'host.btnNext': 'Next →',
    'host.scoreboardTitle': 'Standings',
    'host.btnNextQuestion': 'Next question →',
    'host.suddenDeathBtn': '⚡ Tied! Decide with Sudden Death',
    'host.btnEnd': 'End & delete game',
    'host.confirmEndGame': 'Are you sure? The game and all scores will be deleted.',
    'host.drawingQuestions': 'Drawing questions...',

    /* --- Host: error messages --- */
    'host.errChooseQuizFirst': 'Choose a quiz first.',
    'host.errQuizDataNotFound': 'Quiz data not found. Check that the quiz loaded correctly.',
    'host.errNoQuestionsForDifficulty': 'This quiz has no questions with difficulty "{{level}}".',
    'host.errBankDrawFailed': 'Could not draw questions from the bank: {{msg}}',
    'host.errSdNoMoreQuestions': 'Could not find more questions for sudden death: {{msg}}',
    'host.errSaveResultFailed': 'Could not save result for player {{pid}}:',

    /* --- Levels/difficulties --- */
    'level.let': 'Easy',
    'level.middel': 'Medium',
    'level.svaer': 'Hard',
    'difficulty.let': 'Easy',
    'difficulty.middel': 'Medium',
    'difficulty.svaer': 'Hard',

    /* --- Catalog (host quiz picker) --- */
    'catalog.root': 'Catalog',
    'catalog.builtin': '📦 Built-in',
    'catalog.uncategorized': '❓ Uncategorized',
    'catalog.otherCourse': 'Other course',
    'catalog.otherLecture': 'Other',
    'catalog.back': '◀ Back',
    'catalog.quizCount': '{{n}} quizzes',
    'catalog.empty': 'No quizzes found — create one in the quiz editor.',
    'catalog.loading': 'Loading quizzes...',
    'catalog.autoQuizzes': '🎲 Automatic quizzes',
    'catalog.topicsCount': '{{n}} topics',
    'catalog.bankDrawInfo': '{{n}} random questions from {{pool}}',
    'catalog.bankNote': 'Draws {{n}} random questions each time. A question won\'t repeat until every other one in the bank has been used.',
    'catalog.questionCount': '{{n}} questions',
    'catalog.untitled': '(untitled)',
    'catalog.unknownAuthor': 'unknown',
    'catalog.uncategorizedWord': 'Uncategorized',
    'catalog.uncategorizedByAuthor': 'Uncategorized — by {{author}}',

    /* --- Question bank (drawFromBank) --- */
    'bank.errEmpty': 'The question bank is empty — check the Firebase setup.',
    'bank.errEmptyShort': 'The bank is empty.',
    'bank.errNoDifficulty': 'The bank has no questions with difficulty "{{level}}".',
    'bank.errReserveFailed': 'Could not reserve questions (another host was drawing at the same time) — try again.',

    /* --- Misc --- */
    'error.unknown': 'unknown error'
  }
};

window.QL_LANG = (function () {
  var KEY = 'quizlive_lang';

  function get() {
    try { return localStorage.getItem(KEY) || 'da'; } catch (e) { return 'da'; }
  }

  function set(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  /* t(key, vars) — vars er valgfri {navn: værdi} til simpel {{navn}}-substitution */
  function t(key, vars) {
    var lang = get();
    var dict = window.QL_I18N[lang] || window.QL_I18N.da;
    var str = (dict && dict[key] !== undefined) ? dict[key] : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split('{{' + k + '}}').join(vars[k]);
      });
    }
    return str;
  }

  /* Oversæt alle elementer med data-i18n (textContent), data-i18n-placeholder
     (placeholder-attribut), data-i18n-title (title-attribut) på siden. */
  function applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
    document.documentElement.lang = get();
  }

  /* Bygger en lille DA/EN-toggle-pille i det angivne container-element.
     Klik på et sprog sætter det og genindlæser siden (sikkert: player.js
     og host.js har begge eksisterende localStorage-baseret
     session-genoprettelse der reetablerer spil-tilstand efter reload). */
  function renderToggle(container) {
    if (!container) return;
    var current = get();
    container.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'lang-toggle';
    ['da', 'en'].forEach(function (lang) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-btn' + (lang === current ? ' active' : '');
      btn.textContent = lang === 'da' ? '🇩🇰 Dansk' : '🇬🇧 English';
      btn.addEventListener('click', function () {
        if (lang === get()) return;
        set(lang);
        location.reload();
      });
      wrap.appendChild(btn);
    });
    container.appendChild(wrap);
  }

  return { get: get, set: set, t: t, applyStatic: applyStatic, renderToggle: renderToggle };
})();
