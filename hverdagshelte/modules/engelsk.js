/* HverdagsHelte-modul: Engelsk — ordforråd, lytning, tale og læsning.
   Engelsk starter i 3. klasse i den danske folkeskole → grades [3,9]. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "engelsk",
  "name": "Engelsk 🇬🇧",
  "version": 2,
  "author": "Frederik",
  "category": "skole",
  "grades": [3, 9],
  "description": "De fire engelsk-områder: ordforråd, lytteforståelse, mundtligt engelsk og læsning. Quests passer fra 3. klasse — de sværere slås til efter klassetrin.",

  "skills": [
    { "id": "engelsk", "name": "Engelsk", "icon": "🇬🇧", "color": "#5c7cfa" },
    { "id": "engelsk.ordforraad", "name": "Ordforråd",         "icon": "🔤", "color": "#ffb74d", "parent": "engelsk" },
    { "id": "engelsk.lytning",    "name": "Lytteforståelse",   "icon": "🎧", "color": "#81c784", "parent": "engelsk" },
    { "id": "engelsk.tale",       "name": "Mundtligt engelsk", "icon": "🗣️", "color": "#4fc3f7", "parent": "engelsk" },
    { "id": "engelsk.laesning",   "name": "Læsning",           "icon": "📖", "color": "#ba68c8", "parent": "engelsk" }
  ],

  "quests": [
    { "id": "app10", "title": "Øv engelsk i 10 minutter i en app", "desc": "F.eks. Duolingo — alle dage tæller", "icon": "🦉",
      "type": "daily", "rewards": [{ "skill": "engelsk.ordforraad", "xp": 15 }] },
    { "id": "ord5", "title": "Lær 5 nye engelske ord", "desc": "Skriv dem ned og brug dem i en sætning", "icon": "🔤",
      "type": "weekly", "rewards": [{ "skill": "engelsk.ordforraad", "xp": 20 }, { "gold": 5 }] },
    { "id": "film", "title": "Se en film eller serie med engelsk tale", "desc": "Danske undertekster er helt okay", "icon": "🎬",
      "type": "weekly", "rewards": [{ "skill": "engelsk.lytning", "xp": 20 }, { "gold": 5 }] },
    { "id": "samtale", "title": "Snak engelsk ved aftensmaden i 5 minutter", "desc": "Fortæl om din dag — 'Today I...'", "icon": "🗣️",
      "type": "weekly", "rewards": [{ "skill": "engelsk.tale", "xp": 25 }, { "gold": 5 }] },
    { "id": "sang", "title": "Oversæt en engelsk sang du kan lide", "desc": "Hvad synger de egentlig om?", "icon": "🎵",
      "type": "weekly", "rewards": [{ "skill": "engelsk.lytning", "xp": 25 }, { "gold": 5 }] },
    { "id": "bog", "title": "Læs 10 sider i en engelsk bog", "desc": "5.–9. klasse: en letlæst bog på engelsk", "icon": "📖",
      "type": "weekly", "active": false, "grades": [5, 9], "rewards": [{ "skill": "engelsk.laesning", "xp": 40 }, { "gold": 10 }] },
    { "id": "video", "title": "Optag en lille video hvor du taler engelsk", "desc": "6.–9. klasse: 2 minutter om et emne du vælger", "icon": "📱",
      "type": "weekly", "active": false, "grades": [6, 9], "rewards": [{ "skill": "engelsk.tale", "xp": 40 }, { "gold": 15 }] },
    { "id": "billedbog", "title": "Læs en let engelsk bog eller billedbog", "desc": "3.–4. klasse: læs højt og fortæl hvad den handlede om", "icon": "📚",
      "type": "weekly", "grades": [3, 4], "rewards": [{ "skill": "engelsk.laesning", "xp": 20 }, { "gold": 5 }] },

    { "id": "quiz-ord-basis", "title": "Quiz: Engelske ord (basis)", "desc": "Hvad betyder ordene? 10 spørgsmål", "icon": "🧠",
      "type": "weekly", "grades": [3, 4],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad betyder 'dog'?", "answers": ["Hund", "Kat", "Hest", "Fugl"] },
        { "q": "Hvad betyder 'house'?", "answers": ["Hus", "Have", "Hytte", "Havn"] },
        { "q": "Hvad betyder 'apple'?", "answers": ["Æble", "Pære", "Banan", "Ananas"] },
        { "q": "Hvad betyder 'red'?", "answers": ["Rød", "Blå", "Grøn", "Gul"] },
        { "q": "Hvad betyder 'water'?", "answers": ["Vand", "Mælk", "Saft", "Suppe"] },
        { "q": "Hvad betyder 'book'?", "answers": ["Bog", "Blad", "Brev", "Bord"] },
        { "q": "Hvad betyder 'sun'?", "answers": ["Sol", "Sky", "Sne", "Søn"] },
        { "q": "Hvad betyder 'milk'?", "answers": ["Mælk", "Møl", "Mel", "Majs"] },
        { "q": "Hvad betyder 'chair'?", "answers": ["Stol", "Skab", "Seng", "Sofa"] },
        { "q": "Hvad betyder 'school'?", "answers": ["Skole", "Skov", "Butik", "Kirke"] },
        { "q": "Hvad betyder 'bird'?", "answers": ["Fugl", "Fisk", "Frø", "Flue"] },
        { "q": "Hvad betyder 'green'?", "answers": ["Grøn", "Grå", "Gul", "Brun"] }
      ] },
      "rewards": [{ "skill": "engelsk.ordforraad", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-ord-oevet", "title": "Quiz: Engelske ord (øvet)", "desc": "5.–7. klasse: sværere gloser", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 7],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad betyder 'weather'?", "answers": ["Vejret", "Verden", "Vandet", "Vejen"] },
        { "q": "Hvad betyder 'yesterday'?", "answers": ["I går", "I morgen", "I dag", "I aften"] },
        { "q": "Hvad betyder 'breakfast'?", "answers": ["Morgenmad", "Frokost", "Aftensmad", "Madpakke"] },
        { "q": "Hvad betyder 'neighbour'?", "answers": ["Nabo", "Fætter", "Gæst", "Kollega"] },
        { "q": "Hvad betyder 'kitchen'?", "answers": ["Køkken", "Kælder", "Killing", "Kuffert"] },
        { "q": "Hvad betyder 'always'?", "answers": ["Altid", "Aldrig", "Allerede", "Alligevel"] },
        { "q": "Hvad betyder 'early'?", "answers": ["Tidligt", "Sent", "Hurtigt", "Snart"] },
        { "q": "Hvad betyder 'journey'?", "answers": ["Rejse", "Dagbog", "Turnering", "Glæde"] },
        { "q": "Hvad betyder 'clothes'?", "answers": ["Tøj", "Sko", "Klude", "Knapper"] },
        { "q": "Hvad betyder 'angry'?", "answers": ["Vred", "Glad", "Bange", "Træt"] },
        { "q": "Hvad betyder 'to remember'?", "answers": ["At huske", "At glemme", "At gætte", "At håbe"] },
        { "q": "Hvad betyder 'expensive'?", "answers": ["Dyr", "Billig", "Gammel", "Flot"] }
      ] },
      "rewards": [{ "skill": "engelsk.ordforraad", "xp": 35 }, { "gold": 10 }] },

    { "id": "quiz-saetning", "title": "Quiz: Byg sætningen", "desc": "5.–9. klasse: vælg ordet der passer i sætningen", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 9],
      "quiz": { "draw": 10, "pass": 7, "questions": [
        { "q": "I ___ football every Saturday.", "answers": ["play", "plays", "playing", "played"] },
        { "q": "She ___ to school by bus.", "answers": ["goes", "go", "going", "gone"] },
        { "q": "Yesterday we ___ a great film.", "answers": ["watched", "watch", "watches", "watching"] },
        { "q": "There ___ three apples on the table.", "answers": ["are", "is", "be", "am"] },
        { "q": "He is ___ than his brother.", "answers": ["taller", "tall", "tallest", "more tall"] },
        { "q": "___ you like ice cream?", "answers": ["Do", "Does", "Is", "Are"] },
        { "q": "We have lived here ___ 2020.", "answers": ["since", "for", "from", "at"] },
        { "q": "I can't find ___ keys.", "answers": ["my", "me", "mine", "I"] },
        { "q": "They ___ playing outside right now.", "answers": ["are", "is", "was", "be"] },
        { "q": "This is the ___ book I have ever read.", "answers": ["best", "goodest", "better", "most good"] },
        { "q": "She didn't ___ her homework.", "answers": ["do", "did", "does", "done"] },
        { "q": "___ old are you?", "answers": ["How", "What", "Who", "Where"] }
      ] },
      "rewards": [{ "skill": "engelsk.laesning", "xp": 35 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "wordwizard", "name": "Word Wizard", "icon": "🧙", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "engelsk.ordforraad", "level": 5 } },
    { "id": "speaker", "name": "The Speaker", "icon": "🎤", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "engelsk.tale", "level": 3 } },
    { "id": "eng25", "name": "25 engelsk-quests", "icon": "🇬🇧", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "engelsk" }, "count": 25 } },
    { "id": "londonloeve", "name": "London-løven", "icon": "🦁", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "engelsk" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "engstreak", "name": "Engelsk-streak", "icon": "🔥",
      "period": "week", "target": 3, "scope": { "skill": "engelsk" },
      "milestones": [4, 10, 25, 52] }
  ]
});
