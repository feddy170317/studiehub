/* HverdagsHelte-modul: Engelsk — ordforråd, lytning, tale og læsning.
   Engelsk starter i 3. klasse i den danske folkeskole → grades [3,9]. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "engelsk",
  "name": "Engelsk 🇬🇧",
  "version": 3,
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

    { "id": "quiz-eng-3", "title": "Quiz: Engelsk 3. klasse", "desc": "De første engelske ord", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [3, 3],
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

    { "id": "quiz-eng-4", "title": "Quiz: Engelsk 4. klasse", "desc": "Hverdagsord, dage og udsagnsord", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [4, 4],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad betyder 'family'?", "answers": ["Familie", "Ferie", "Fabrik", "Fest"] },
        { "q": "Hvad betyder 'breakfast'?", "answers": ["Morgenmad", "Frokost", "Aftensmad", "Kage"] },
        { "q": "Hvad er 'eleven' på dansk?", "answers": ["11", "12", "7", "1"] },
        { "q": "Hvad betyder 'winter'?", "answers": ["Vinter", "Vind", "Sommer", "Vante"] },
        { "q": "Hvad betyder 'to run'?", "answers": ["At løbe", "At gå", "At hoppe", "At råbe"] },
        { "q": "Hvad betyder 'happy'?", "answers": ["Glad", "Sur", "Træt", "Bange"] },
        { "q": "Hvad betyder 'door'?", "answers": ["Dør", "Vindue", "Gulv", "Væg"] },
        { "q": "Hvad betyder 'Monday'?", "answers": ["Mandag", "Måned", "Morgen", "Måne"] },
        { "q": "Hvad betyder 'to eat'?", "answers": ["At spise", "At drikke", "At sove", "At lege"] },
        { "q": "Hvad betyder 'little'?", "answers": ["Lille", "Stor", "Lang", "Let"] },
        { "q": "Hvad betyder 'rain'?", "answers": ["Regn", "Sne", "Sol", "Storm"] },
        { "q": "Hvad betyder 'friend'?", "answers": ["Ven", "Fjende", "Familie", "Fremmed"] }
      ] },
      "rewards": [{ "skill": "engelsk.ordforraad", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-eng-5", "title": "Quiz: Engelsk 5. klasse", "desc": "Sværere gloser fra hverdagen", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 5],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad betyder 'weather'?", "answers": ["Vejret", "Verden", "Vandet", "Vejen"] },
        { "q": "Hvad betyder 'yesterday'?", "answers": ["I går", "I morgen", "I dag", "I aften"] },
        { "q": "Hvad betyder 'neighbour'?", "answers": ["Nabo", "Fætter", "Gæst", "Kollega"] },
        { "q": "Hvad betyder 'kitchen'?", "answers": ["Køkken", "Kælder", "Killing", "Kuffert"] },
        { "q": "Hvad betyder 'always'?", "answers": ["Altid", "Aldrig", "Allerede", "Alligevel"] },
        { "q": "Hvad betyder 'early'?", "answers": ["Tidligt", "Sent", "Hurtigt", "Snart"] },
        { "q": "Hvad betyder 'journey'?", "answers": ["Rejse", "Dagbog", "Turnering", "Glæde"] },
        { "q": "Hvad betyder 'clothes'?", "answers": ["Tøj", "Sko", "Klude", "Knapper"] },
        { "q": "Hvad betyder 'angry'?", "answers": ["Vred", "Glad", "Bange", "Træt"] },
        { "q": "Hvad betyder 'to remember'?", "answers": ["At huske", "At glemme", "At gætte", "At håbe"] },
        { "q": "Hvad betyder 'expensive'?", "answers": ["Dyr", "Billig", "Gammel", "Flot"] },
        { "q": "Hvad betyder 'beautiful'?", "answers": ["Smuk", "Sjov", "Stor", "Sur"] }
      ] },
      "rewards": [{ "skill": "engelsk.ordforraad", "xp": 30 }, { "gold": 5 }] },

    { "id": "quiz-eng-6", "title": "Quiz: Engelsk 6. klasse", "desc": "Ord og enkel grammatik", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [6, 6],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "She ___ a teacher.", "answers": ["is", "are", "am", "be"] },
        { "q": "I ___ two brothers.", "answers": ["have", "has", "am", "is"] },
        { "q": "Hvad betyder 'tomorrow'?", "answers": ["I morgen", "I går", "I dag", "I aften"] },
        { "q": "They ___ football right now.", "answers": ["are playing", "plays", "is playing", "player"] },
        { "q": "Hvad betyder 'dangerous'?", "answers": ["Farlig", "Dejlig", "Doven", "Dyster"] },
        { "q": "___ she like pizza?", "answers": ["Does", "Do", "Is", "Have"] },
        { "q": "Hvad betyder 'to borrow'?", "answers": ["At låne", "At købe", "At bygge", "At bære"] },
        { "q": "We went to London last ___.", "answers": ["year", "years", "yearly", "ago"] },
        { "q": "Hvad betyder 'proud'?", "answers": ["Stolt", "Pralende", "Stærk", "Stille"] },
        { "q": "He can ___ very fast.", "answers": ["run", "runs", "running", "ran"] },
        { "q": "Hvad betyder 'to choose'?", "answers": ["At vælge", "At jage", "At tygge", "At snyde"] },
        { "q": "There isn't ___ milk left.", "answers": ["any", "some", "no", "many"] }
      ] },
      "rewards": [{ "skill": "engelsk.laesning", "xp": 30 }, { "gold": 5 }] },

    { "id": "quiz-eng-7", "title": "Quiz: Engelsk 7. klasse", "desc": "Byg sætningen — grammatik i praksis", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 10, "pass": 8, "questions": [
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
      "rewards": [{ "skill": "engelsk.laesning", "xp": 35 }, { "gold": 10 }] },

    { "id": "quiz-eng-8", "title": "Quiz: Engelsk 8. klasse", "desc": "Avanceret grammatik og gloser", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "If it rains, we ___ inside.", "answers": ["will stay", "would stay", "stayed", "staying"] },
        { "q": "Hvad betyder 'to improve'?", "answers": ["At forbedre", "At bevise", "At importere", "At imponere"] },
        { "q": "The book ___ by millions of people.", "answers": ["was read", "was reading", "readed", "did read"] },
        { "q": "Hvad betyder 'although'?", "answers": ["Selvom", "Altid", "Allerede", "Sammen"] },
        { "q": "She has lived here ___ five years.", "answers": ["for", "since", "in", "at"] },
        { "q": "Hvad betyder 'responsible'?", "answers": ["Ansvarlig", "Respektfuld", "Fornuftig", "Mulig"] },
        { "q": "I wish I ___ taller.", "answers": ["were", "am", "will be", "is"] },
        { "q": "Hvad betyder 'to achieve'?", "answers": ["At opnå", "At tro", "At ankomme", "At undgå"] },
        { "q": "He asked me where I ___.", "answers": ["lived", "live", "do live", "living"] },
        { "q": "Hvad betyder 'suddenly'?", "answers": ["Pludselig", "Sikkert", "Sjældent", "Særligt"] },
        { "q": "This is the house ___ I grew up.", "answers": ["where", "which", "who", "what"] },
        { "q": "Hvad betyder 'however'?", "answers": ["Men alligevel", "Hvordan", "For evigt", "Uanset hvad"] }
      ] },
      "rewards": [{ "skill": "engelsk.laesning", "xp": 25 }, { "skill": "engelsk.ordforraad", "xp": 15 }, { "gold": 10 }] },

    { "id": "quiz-eng-9", "title": "Quiz: Engelsk 9. klasse", "desc": "Eksamensniveau: svær grammatik og ordforråd", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "By next year, I ___ my exams.", "answers": ["will have finished", "will finishing", "finished", "have finish"] },
        { "q": "Hvad betyder 'to persuade'?", "answers": ["At overtale", "At forfølge", "At udholde", "At foregive"] },
        { "q": "Neither of them ___ the answer.", "answers": ["knows", "know", "knowing", "are knowing"] },
        { "q": "Hvad betyder 'inevitable'?", "answers": ["Uundgåelig", "Utrolig", "Usynlig", "Ufattelig"] },
        { "q": "The essay must ___ by Friday.", "answers": ["be handed in", "hand in", "be handing in", "have hand in"] },
        { "q": "Hvad betyder 'to emphasize'?", "answers": ["At understrege", "At undskylde", "At misunde", "At erstatte"] },
        { "q": "Hardly ___ arrived when it started to rain.", "answers": ["had we", "we had", "did we", "we have"] },
        { "q": "Hvad betyder 'reluctant'?", "answers": ["Modvillig", "Afslappet", "Pålidelig", "Genert"] },
        { "q": "I'd rather you ___ smoke in here.", "answers": ["didn't", "don't", "won't", "not"] },
        { "q": "Hvad betyder 'to accomplish'?", "answers": ["At fuldføre", "At følge med", "At acceptere", "At samle"] },
        { "q": "___ the weather, the match went ahead.", "answers": ["Despite", "Although", "However", "Because"] },
        { "q": "Hvad betyder 'thorough'?", "answers": ["Grundig", "Gennemsigtig", "Tørstig", "Hårdfør"] }
      ] },
      "rewards": [{ "skill": "engelsk.laesning", "xp": 30 }, { "skill": "engelsk.ordforraad", "xp": 20 }, { "gold": 10 }] }
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
