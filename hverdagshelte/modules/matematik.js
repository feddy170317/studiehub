/* HverdagsHelte-modul: Matematik — subskills efter webmatematik.dk's emneopdeling (0.–9. kl.).
   Quests er sat til start-3.-klasse; de avancerede (brøker, algebra, statistik) ligger klar
   som inaktive og slås til efterhånden som klassetrinnet stiger. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "matematik",
  "name": "Matematik 🔢",
  "version": 3,
  "author": "Frederik",
  "category": "skole",
  "grades": [0, 9],
  "description": "Subskills dækker hele grundskolen (jf. webmatematik.dk): talforståelse, de fire regnearter, brøker/procent, geometri, måling, algebra, statistik og problemregning. Slå quests til/fra efter klassetrin.",

  "skills": [
    { "id": "matematik", "name": "Matematik", "icon": "🔢", "color": "#4fc3f7" },
    { "id": "matematik.tal",           "name": "Tal & talforståelse",       "icon": "💯", "color": "#4fc3f7", "parent": "matematik" },
    { "id": "matematik.plusminus",     "name": "Plus & minus",              "icon": "➕", "color": "#81c784", "parent": "matematik" },
    { "id": "matematik.gangedivision", "name": "Gange & division",          "icon": "✖️", "color": "#ffb74d", "parent": "matematik" },
    { "id": "matematik.broker",        "name": "Brøker & procent",          "icon": "🍕", "color": "#ff8a65", "parent": "matematik" },
    { "id": "matematik.geometri",      "name": "Geometri & former",         "icon": "📐", "color": "#ba68c8", "parent": "matematik" },
    { "id": "matematik.maaling",       "name": "Måling, tid & penge",       "icon": "⏰", "color": "#f06292", "parent": "matematik" },
    { "id": "matematik.algebra",       "name": "Algebra & ligninger",       "icon": "🧮", "color": "#9c6bff", "parent": "matematik" },
    { "id": "matematik.statistik",     "name": "Statistik & sandsynlighed", "icon": "📊", "color": "#66d98c", "parent": "matematik" },
    { "id": "matematik.problem",       "name": "Problemregning",            "icon": "🧩", "color": "#ffd54f", "parent": "matematik" }
  ],

  "quests": [
    { "id": "tabel10", "title": "Øv gangetabeller i 10 minutter", "desc": "På papir, med kort eller på nettet", "icon": "✖️",
      "type": "daily", "days": [1, 2, 3, 4, 5], "grades": [1, 9], "rewards": [{ "skill": "matematik.gangedivision", "xp": 20 }] },
    { "id": "plusside", "title": "Én side plus- og minusstykker", "desc": "", "icon": "➕",
      "type": "daily", "days": [1, 2, 3, 4, 5], "rewards": [{ "skill": "matematik.plusminus", "xp": 20 }] },
    { "id": "klokken", "title": "Læs klokken når en voksen spørger", "desc": "Både hel, halv og kvart", "icon": "⏰",
      "type": "daily", "rewards": [{ "skill": "matematik.maaling", "xp": 10 }] },
    { "id": "regnehistorie", "title": "Regn en regnehistorie og forklar den", "desc": "En tekstopgave — forklar hvordan du løste den", "icon": "🧩",
      "type": "weekly", "rewards": [{ "skill": "matematik.problem", "xp": 30 }, { "gold": 10 }] },
    { "id": "former", "title": "Find og tegn 5 former derhjemme", "desc": "Firkanter, trekanter, cirkler — mål siderne", "icon": "📐",
      "type": "weekly", "rewards": [{ "skill": "matematik.geometri", "xp": 30 }, { "gold": 10 }] },
    { "id": "lommepenge", "title": "Tæl dine penge og læg et lille budget", "desc": "Hvor meget har du? Hvad sparer du op til?", "icon": "🪙",
      "type": "weekly", "rewards": [{ "skill": "matematik.maaling", "xp": 25 }, { "gold": 10 }] },
    { "id": "brokside", "title": "Én side brøker eller procent", "desc": "4.–9. klasse", "icon": "🍕",
      "type": "daily", "days": [1, 2, 3, 4, 5], "active": false, "grades": [4, 9], "rewards": [{ "skill": "matematik.broker", "xp": 25 }] },
    { "id": "ligninger", "title": "Løs ligninger på webmatematik.dk", "desc": "7.–9. klasse: webmatematik.dk/lektioner/7-9-klasse", "icon": "🧮",
      "type": "weekly", "active": false, "grades": [7, 9], "rewards": [{ "skill": "matematik.algebra", "xp": 40 }, { "gold": 15 }] },
    { "id": "statistik", "title": "Lav en lille undersøgelse derhjemme", "desc": "6.–9. klasse: saml data, lav et diagram, fortæl hvad det viser", "icon": "📊",
      "type": "weekly", "active": false, "grades": [6, 9], "rewards": [{ "skill": "matematik.statistik", "xp": 40 }, { "gold": 15 }] },

    { "id": "quiz-plusminus", "title": "Quiz: Plus og minus", "desc": "10 hurtige stykker i hovedet — kan du bestå?", "icon": "🧠",
      "type": "weekly", "grades": [0, 3],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "7 + 5 = ?", "answers": ["12", "11", "13", "14"] },
        { "q": "14 − 6 = ?", "answers": ["8", "7", "9", "6"] },
        { "q": "9 + 8 = ?", "answers": ["17", "16", "18", "15"] },
        { "q": "13 − 7 = ?", "answers": ["6", "5", "7", "8"] },
        { "q": "6 + 7 = ?", "answers": ["13", "12", "14", "11"] },
        { "q": "15 − 9 = ?", "answers": ["6", "7", "5", "8"] },
        { "q": "8 + 6 = ?", "answers": ["14", "13", "15", "12"] },
        { "q": "17 − 8 = ?", "answers": ["9", "8", "10", "7"] },
        { "q": "5 + 9 = ?", "answers": ["14", "15", "13", "12"] },
        { "q": "12 − 4 = ?", "answers": ["8", "9", "7", "6"] },
        { "q": "4 + 8 = ?", "answers": ["12", "11", "13", "14"] },
        { "q": "16 − 7 = ?", "answers": ["9", "10", "8", "11"] }
      ] },
      "rewards": [{ "skill": "matematik.plusminus", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-tabeller", "title": "Quiz: Gangetabeller", "desc": "10 gangestykker fra tabellerne 3–9", "icon": "🧠",
      "type": "weekly", "grades": [2, 6],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "3 × 4 = ?", "answers": ["12", "9", "15", "16"] },
        { "q": "6 × 7 = ?", "answers": ["42", "36", "48", "44"] },
        { "q": "8 × 4 = ?", "answers": ["32", "28", "36", "24"] },
        { "q": "7 × 7 = ?", "answers": ["49", "42", "56", "47"] },
        { "q": "9 × 6 = ?", "answers": ["54", "56", "45", "63"] },
        { "q": "5 × 8 = ?", "answers": ["40", "45", "35", "48"] },
        { "q": "4 × 9 = ?", "answers": ["36", "32", "45", "38"] },
        { "q": "7 × 8 = ?", "answers": ["56", "54", "64", "48"] },
        { "q": "6 × 6 = ?", "answers": ["36", "30", "42", "34"] },
        { "q": "9 × 9 = ?", "answers": ["81", "72", "89", "91"] },
        { "q": "3 × 8 = ?", "answers": ["24", "21", "28", "26"] },
        { "q": "7 × 6 = ?", "answers": ["42", "48", "36", "44"] }
      ] },
      "rewards": [{ "skill": "matematik.gangedivision", "xp": 30 }, { "gold": 5 }] },

    { "id": "quiz-broek", "title": "Quiz: Brøker og procent", "desc": "4.–6. klasse: halvdele, fjerdedele og procenter", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [4, 6],
      "quiz": { "draw": 10, "pass": 7, "questions": [
        { "q": "Hvad er halvdelen af 24?", "answers": ["12", "14", "10", "16"] },
        { "q": "1/4 af 20 = ?", "answers": ["5", "4", "6", "10"] },
        { "q": "Hvor mange procent er 1/2?", "answers": ["50 %", "25 %", "75 %", "20 %"] },
        { "q": "Hvad er 10 % af 200?", "answers": ["20", "10", "40", "25"] },
        { "q": "3/4 af 12 = ?", "answers": ["9", "8", "10", "6"] },
        { "q": "Hvilken brøk er størst?", "answers": ["3/4", "1/2", "2/3", "1/4"] },
        { "q": "25 % skrevet som brøk er…", "answers": ["1/4", "1/2", "1/3", "2/3"] },
        { "q": "Hvad er 1/3 af 27?", "answers": ["9", "8", "7", "12"] },
        { "q": "0,5 er det samme som…", "answers": ["1/2", "1/5", "5/1", "1/4"] },
        { "q": "Hvad er 50 % af 90?", "answers": ["45", "40", "50", "55"] },
        { "q": "2/5 af 25 = ?", "answers": ["10", "5", "15", "12"] },
        { "q": "Hvor mange procent er 3/4?", "answers": ["75 %", "50 %", "80 %", "70 %"] }
      ] },
      "rewards": [{ "skill": "matematik.broker", "xp": 35 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "regnemester", "name": "Regnemester", "icon": "🏆", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "matematik", "level": 5 } },
    { "id": "tabeltrold", "name": "Tabel-troldmanden", "icon": "🧙", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "matematik.gangedivision", "level": 3 } },
    { "id": "mate25", "name": "25 mate-quests", "icon": "🔢", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "matematik" }, "count": 25 } },
    { "id": "matemaraton", "name": "Mate-maraton", "icon": "🏅", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "matematik" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "matestreak", "name": "Mate-streak", "icon": "🔥",
      "period": "week", "target": 3, "scope": { "skill": "matematik" },
      "milestones": [4, 10, 25, 52] }
  ]
});
