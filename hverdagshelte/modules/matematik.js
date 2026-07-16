/* HverdagsHelte-modul: Matematik — subskills efter webmatematik.dk's emneopdeling (0.–9. kl.).
   Quests er sat til start-3.-klasse; de avancerede (brøker, algebra, statistik) ligger klar
   som inaktive og slås til efterhånden som klassetrinnet stiger. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "matematik",
  "name": "Matematik 🔢",
  "version": 2,
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
      "type": "weekly", "active": false, "grades": [6, 9], "rewards": [{ "skill": "matematik.statistik", "xp": 40 }, { "gold": 15 }] }
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
