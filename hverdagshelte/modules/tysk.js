/* HverdagsHelte-modul: Tysk — 2. fremmedsprog 5.-9. klasse (Fælles Mål).
   Skoler med fransk i stedet: modulet kan klones til fransk på samme skabelon. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "tysk",
  "name": "Tysk 🇩🇪",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [5, 9],
  "description": "2. fremmedsprog fra 5. klasse: gloser, lytning, mundtlig tysk og grammatik. Quizzerne følger klassetrinnet.",

  "skills": [
    { "id": "tysk", "name": "Tysk", "icon": "🇩🇪", "color": "#ffb74d" },
    { "id": "tysk.ordforraad", "name": "Ordforråd",     "icon": "🔤", "color": "#ffd54f", "parent": "tysk" },
    { "id": "tysk.lytning",    "name": "Lytning",       "icon": "🎧", "color": "#81c784", "parent": "tysk" },
    { "id": "tysk.tale",       "name": "Mundtlig tysk", "icon": "🗣️", "color": "#4fc3f7", "parent": "tysk" },
    { "id": "tysk.grammatik",  "name": "Grammatik",     "icon": "✏️", "color": "#ba68c8", "parent": "tysk" }
  ],

  "quests": [
    { "id": "app10", "title": "Øv tysk i 10 minutter i en app", "desc": "F.eks. Duolingo — alle dage tæller", "icon": "🦉",
      "type": "daily", "rewards": [{ "skill": "tysk.ordforraad", "xp": 15 }] },
    { "id": "gloser5", "title": "Lær 5 nye tyske gloser", "desc": "Skriv dem ned og brug dem i en sætning", "icon": "🔤",
      "type": "weekly", "rewards": [{ "skill": "tysk.ordforraad", "xp": 20 }, { "gold": 5 }] },
    { "id": "tysklyd", "title": "Se eller hør noget på tysk", "desc": "En serie, sang eller YouTube — undertekster er okay", "icon": "🎬",
      "type": "weekly", "rewards": [{ "skill": "tysk.lytning", "xp": 20 }, { "gold": 5 }] },
    { "id": "tysksnak", "title": "Sig 5 sætninger på tysk ved aftensmaden", "desc": "'Ich heiße…', 'Das schmeckt gut!'", "icon": "🗣️",
      "type": "weekly", "rewards": [{ "skill": "tysk.tale", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-tysk-5", "title": "Quiz: Tysk 5. klasse", "desc": "De første tyske ord", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 5],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad betyder 'die Katze'?", "answers": ["Kat", "Kasse", "Kjole", "Kop"] },
        { "q": "Hvad betyder 'rot'?", "answers": ["Rød", "Rådden", "Rolig", "Rund"] },
        { "q": "Hvad er 'drei' på dansk?", "answers": ["3", "2", "13", "30"] },
        { "q": "Hvad betyder 'das Haus'?", "answers": ["Hus", "Hue", "Have", "Hest"] },
        { "q": "Hvad betyder 'die Schule'?", "answers": ["Skole", "Skål", "Sko", "Skov"] },
        { "q": "Hvad er 'fünf' på dansk?", "answers": ["5", "4", "9", "15"] },
        { "q": "Hvad betyder 'der Hund'?", "answers": ["Hund", "Høne", "Hare", "Hval"] },
        { "q": "Hvad betyder 'grün'?", "answers": ["Grøn", "Grim", "Grå", "Gul"] },
        { "q": "Hvad betyder 'die Mutter'?", "answers": ["Mor", "Moster", "Mund", "Mus"] },
        { "q": "Hvad er 'zehn' på dansk?", "answers": ["10", "6", "16", "100"] }
      ] },
      "rewards": [{ "skill": "tysk.ordforraad", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-tysk-6", "title": "Quiz: Tysk 6. klasse", "desc": "Hverdagsord og de første udsagnsord", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [6, 6],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad betyder 'ich heiße'?", "answers": ["Jeg hedder", "Jeg er varm", "Jeg har", "Jeg hejser"] },
        { "q": "Ich ___ Fußball.", "answers": ["spiele", "spielst", "spielt", "spielen"] },
        { "q": "Hvad betyder 'der Bruder'?", "answers": ["Bror", "Brød", "Brud", "Bord"] },
        { "q": "Wir ___ in Dänemark.", "answers": ["wohnen", "wohne", "wohnst", "wohnt"] },
        { "q": "Hvad betyder 'das Frühstück'?", "answers": ["Morgenmad", "Tidlig gymnastik", "Frost", "Frugt"] },
        { "q": "Hvad er 'zwanzig' på dansk?", "answers": ["20", "12", "2", "22"] },
        { "q": "Hvad betyder 'müde'?", "answers": ["Træt", "Modig", "Sur", "Sulten"] },
        { "q": "Du ___ nett.", "answers": ["bist", "bin", "ist", "sind"] },
        { "q": "Hvad betyder 'die Stadt'?", "answers": ["By", "Stat", "Sted", "Stald"] },
        { "q": "Hvad betyder 'trinken'?", "answers": ["At drikke", "At træne", "At trække", "At tro"] }
      ] },
      "rewards": [{ "skill": "tysk.ordforraad", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-tysk-7", "title": "Quiz: Tysk 7. klasse", "desc": "Sætninger, akkusativ og klokken", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Ich habe ___ Hund.", "answers": ["einen", "ein", "einer", "eines"] },
        { "q": "Hvad betyder 'Wie spät ist es?'", "answers": ["Hvad er klokken?", "Hvor sent kommer du?", "Hvor er det?", "Hvem er for sen?"] },
        { "q": "Hvad betyder 'immer'?", "answers": ["Altid", "Aldrig", "Igen", "Indenfor"] },
        { "q": "Er ___ nach Hause.", "answers": ["geht", "gehe", "gehst", "gehen"] },
        { "q": "Hvad betyder 'das Fahrrad'?", "answers": ["Cykel", "Færge", "Fart", "Farbror"] },
        { "q": "Ich kann gut ___.", "answers": ["schwimmen", "schwimme", "schwimmst", "geschwommen"] },
        { "q": "Hvad betyder 'teuer'?", "answers": ["Dyr", "Tør", "Tidlig", "Tung"] },
        { "q": "Hvad betyder 'der Bahnhof'?", "answers": ["Banegård", "Bondegård", "Badehotel", "Baghave"] },
        { "q": "Wir fahren ___ Deutschland.", "answers": ["nach", "zu", "bei", "aus"] },
        { "q": "Hvad betyder 'lecker'?", "answers": ["Lækker", "Utæt", "Sjov", "Klog"] }
      ] },
      "rewards": [{ "skill": "tysk.grammatik", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-tysk-8", "title": "Quiz: Tysk 8. klasse", "desc": "Perfektum, præpositioner og gloser", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Ich habe Fußball ___.", "answers": ["gespielt", "spielte", "gespielen", "spielen"] },
        { "q": "Hvad betyder 'gestern'?", "answers": ["I går", "I morgen", "Gerne", "Gæster"] },
        { "q": "___ dem Essen putzen wir die Zähne.", "answers": ["Nach", "Zwischen", "Über", "Gegen"] },
        { "q": "Hvad betyder 'die Zeitung'?", "answers": ["Avis", "Tid", "Telt", "Tegning"] },
        { "q": "Er ist ___ als ich.", "answers": ["älter", "alt", "am ältesten", "älteste"] },
        { "q": "Hvad betyder 'arbeiten'?", "answers": ["At arbejde", "At arve", "At vente", "At bede"] },
        { "q": "Wir sind nach Berlin ___.", "answers": ["gefahren", "gefahrt", "fuhren", "fahren"] },
        { "q": "Hvad betyder 'die Woche'?", "answers": ["Uge", "Våge", "Vugge", "Vase"] },
        { "q": "Hvad betyder 'kaufen'?", "answers": ["At købe", "At kaste", "At kalde", "At kæmpe"] },
        { "q": "Ich freue mich ___ die Ferien.", "answers": ["auf", "über", "an", "für"] }
      ] },
      "rewards": [{ "skill": "tysk.grammatik", "xp": 25 }, { "skill": "tysk.ordforraad", "xp": 10 }, { "gold": 10 }] },

    { "id": "quiz-tysk-9", "title": "Quiz: Tysk 9. klasse", "desc": "Kasus, bisætninger og sværere gloser — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvilket køn har 'Mädchen'?", "answers": ["Intetkøn (das)", "Hunkøn (die)", "Hankøn (der)", "Kun flertal"] },
        { "q": "___ ich Zeit habe, lese ich.", "answers": ["Wenn", "Ob", "Dass", "Weil ob"] },
        { "q": "Hvad betyder 'die Verspätung'?", "answers": ["Forsinkelse", "Forår", "Forsikring", "Fortid"] },
        { "q": "Ich helfe ___ Mann. (dativ)", "answers": ["dem", "den", "der", "das"] },
        { "q": "Hvad betyder 'gefährlich'?", "answers": ["Farlig", "Færdig", "Behagelig", "Gavmild"] },
        { "q": "Er sagt, ___ er müde ist.", "answers": ["dass", "das", "denn", "also"] },
        { "q": "Hvad betyder 'die Umwelt'?", "answers": ["Miljøet", "Omvejen", "Uvejret", "Ungdommen"] },
        { "q": "Hvad betyder 'entscheiden'?", "answers": ["At beslutte", "At undskylde", "At forsvinde", "At adskille"] },
        { "q": "Weil es regnet, ___ wir zu Hause.", "answers": ["bleiben", "bleibt", "blieb", "geblieben"] },
        { "q": "Hvad betyder 'zufrieden'?", "answers": ["Tilfreds", "Frossen", "For tidlig", "Fredelig"] }
      ] },
      "rewards": [{ "skill": "tysk.grammatik", "xp": 25 }, { "skill": "tysk.ordforraad", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "berliner", "name": "Der Berliner", "icon": "🇩🇪", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "tysk", "level": 5 } },
    { "id": "tysk20", "name": "20 tysk-quests", "icon": "🔤", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "tysk" }, "count": 20 } },
    { "id": "goethe", "name": "Goethe", "icon": "🪶", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "tysk" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "tyskstreak", "name": "Tysk-streak", "icon": "🔥",
      "period": "week", "target": 2, "scope": { "skill": "tysk" },
      "milestones": [4, 10, 25, 52] }
  ]
});
