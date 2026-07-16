/* HverdagsHelte-modul: Fysik/kemi — folkeskolefag 7.-9. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "fysikkemi",
  "name": "Fysik/kemi ⚗️",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [7, 9],
  "description": "Atomer, energi, kemiske reaktioner og stråling. Bunden prøve i 9. klasse (fælles naturfagsprøve).",

  "skills": [
    { "id": "fysikkemi", "name": "Fysik/kemi", "icon": "⚗️", "color": "#9c6bff" },
    { "id": "fysikkemi.stof",       "name": "Stoffer & atomer",     "icon": "⚛️", "color": "#4fc3f7", "parent": "fysikkemi" },
    { "id": "fysikkemi.energi",     "name": "Energi & el",          "icon": "⚡", "color": "#ffd54f", "parent": "fysikkemi" },
    { "id": "fysikkemi.reaktioner", "name": "Kemiske reaktioner",   "icon": "🧪", "color": "#81c784", "parent": "fysikkemi" },
    { "id": "fysikkemi.boelger",    "name": "Bølger & stråling",    "icon": "🌈", "color": "#f06292", "parent": "fysikkemi" }
  ],

  "quests": [
    { "id": "koekkenforsoeg", "title": "Lav et sikkert køkkenforsøg og forklar kemien", "desc": "Bagepulver + eddike, sukker der karamelliserer — hvad sker der?", "icon": "🧪",
      "type": "weekly", "rewards": [{ "skill": "fysikkemi.reaktioner", "xp": 30 }, { "gold": 5 }] },
    { "id": "eljagt", "title": "Find 5 apparaters watt-forbrug derhjemme", "desc": "Tjek mærkaterne — hvad bruger mest strøm?", "icon": "⚡",
      "type": "weekly", "rewards": [{ "skill": "fysikkemi.energi", "xp": 25 }] },
    { "id": "densitet", "title": "Test hvad der flyder og synker — og forklar hvorfor", "desc": "5 ting i en balje vand. Hint: densitet!", "icon": "🛁",
      "type": "weekly", "rewards": [{ "skill": "fysikkemi.stof", "xp": 25 }] },
    { "id": "formeltraening", "title": "Regn 5 fysik-opgaver med formler", "desc": "Ohms lov, densitet eller energi — vis udregningen", "icon": "📐",
      "type": "weekly", "grades": [8, 9], "rewards": [{ "skill": "fysikkemi.energi", "xp": 30 }, { "gold": 5 }] },

    { "id": "quiz-fys-7", "title": "Quiz: Fysik/kemi 7. klasse", "desc": "Atomer, tilstandsformer og pH", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad består et atom af?", "answers": ["Protoner, neutroner og elektroner", "Kun elektroner", "Celler", "Molekyler"] },
        { "q": "Hvad viser det periodiske system?", "answers": ["Alle grundstoffer ordnet i system", "Alle planeter", "Alle dyrearter", "Kun syrer"] },
        { "q": "Hvad er den kemiske formel for vand?", "answers": ["H2O", "CO2", "O2", "NaCl"] },
        { "q": "Hvilke tre tilstandsformer har stoffer typisk?", "answers": ["Fast, flydende og gas", "Varm, kold og lun", "Hård, blød og våd", "Rød, gul og blå"] },
        { "q": "Hvad måler pH-skalaen?", "answers": ["Hvor surt eller basisk noget er", "Temperatur", "Vægt", "Lydstyrke"] },
        { "q": "Hvad er pH 7?", "answers": ["Neutralt", "Meget surt", "Meget basisk", "Umuligt"] },
        { "q": "Hvad er densitet?", "answers": ["Masse pr. rumfang", "Samlet vægt", "Hastighed", "Temperatur"] },
        { "q": "Hvad er det kemiske tegn for ilt?", "answers": ["O", "I", "Il", "Ox"] },
        { "q": "Hvorfor flyder is på vand?", "answers": ["Is har lavere densitet end vand", "Is er tungere end vand", "Vand skubber alt op", "Det gør den ikke"] },
        { "q": "Hvad er et molekyle?", "answers": ["Flere atomer bundet sammen", "En enkelt elektron", "En celle", "Altid et grundstof"] }
      ] },
      "rewards": [{ "skill": "fysikkemi.stof", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-fys-8", "title": "Quiz: Fysik/kemi 8. klasse", "desc": "Elektricitet, energi og reaktioner", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad siger Ohms lov?", "answers": ["U = R · I", "E = mc²", "F = m · a", "P = m · g"] },
        { "q": "Hvad måles strømstyrke i?", "answers": ["Ampere", "Volt", "Watt", "Ohm"] },
        { "q": "Hvad måles effekt i?", "answers": ["Watt", "Volt", "Joule pr. kilo", "Newton"] },
        { "q": "Hvad sker der i en kemisk reaktion?", "answers": ["Stoffer omdannes til nye stoffer", "Stoffer forsvinder helt", "Atomer ødelægges", "Ingenting"] },
        { "q": "Hvad dannes når en syre og en base neutraliserer hinanden?", "answers": ["Salt og vand", "Kun gas", "Guld", "Ren ilt"] },
        { "q": "Hvilket grundstof brænder og danner vand?", "answers": ["Brint", "Kul", "Jern", "Natrium"] },
        { "q": "Hvad kendetegner en serieforbindelse?", "answers": ["Samme strøm gennem alle komponenter", "Komponenterne sidder parallelt", "Den er trådløs", "Den bruger ingen strøm"] },
        { "q": "Hvad er den kemiske formel for kuldioxid?", "answers": ["CO2", "CO", "C2O", "KO2"] },
        { "q": "Hvad siger loven om energibevarelse?", "answers": ["Energi forsvinder ikke, men omdannes", "Energi kan skabes frit", "Energi er kun varme", "Batterier holder evigt"] },
        { "q": "Hvilken energiform har vandet bag en dæmning?", "answers": ["Beliggenhedsenergi", "Kemisk energi", "Lydenergi", "Kerneenergi"] }
      ] },
      "rewards": [{ "skill": "fysikkemi.energi", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-fys-9", "title": "Quiz: Fysik/kemi 9. klasse", "desc": "Radioaktivitet, ioner og bølger — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad er radioaktivitet?", "answers": ["Ustabile atomkerner udsender stråling", "Alle atomer lyser", "Elektricitet i luften", "Magnetisme"] },
        { "q": "Hvad er halveringstid?", "answers": ["Tiden hvor halvdelen af kernerne er henfaldet", "Halvdelen af et batteris levetid", "En halv skoledag", "Halv lysstyrke"] },
        { "q": "Hvilken stråling stoppes af et stykke papir?", "answers": ["Alfastråling", "Betastråling", "Gammastråling", "Røntgenstråling"] },
        { "q": "Hvad er en ion?", "answers": ["Et atom med elektrisk ladning", "Et molekyle", "En neutron", "Et grundstof"] },
        { "q": "Hvad er lysets fart cirka?", "answers": ["300.000 km/s", "300 km/s", "3.000 km/t", "30.000 km/s"] },
        { "q": "Hvilken stråling har højest frekvens?", "answers": ["Gammastråling", "Radiobølger", "Mikrobølger", "Synligt lys"] },
        { "q": "Hvordan laver et kernekraftværk strøm?", "answers": ["Fission opvarmer vand, og dampen driver turbiner", "Med solpaneler", "Med vindmøller", "Ved at brænde kul"] },
        { "q": "Hvad sker der med lyd i vakuum?", "answers": ["Den kan ikke udbrede sig", "Den bliver hurtigere", "Den bliver dybere", "Den er uændret"] },
        { "q": "Hvad er NaCl?", "answers": ["Køkkensalt", "Sukker", "En syre", "Sæbe"] },
        { "q": "Hvad er bølgelængde?", "answers": ["Afstanden mellem to bølgetoppe", "Bølgens fart", "Lydstyrken", "Bølgens vægt"] }
      ] },
      "rewards": [{ "skill": "fysikkemi.boelger", "xp": 25 }, { "skill": "fysikkemi.stof", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "kemiker", "name": "Den unge Kemiker", "icon": "⚗️", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "fysikkemi", "level": 5 } },
    { "id": "fys20", "name": "20 fysik/kemi-quests", "icon": "🧪", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "fysikkemi" }, "count": 20 } },
    { "id": "bohr", "name": "Niels Bohr", "icon": "⚛️", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "fysikkemi" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "fysstreak", "name": "Fysik-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "fysikkemi" },
      "milestones": [4, 10, 25, 52] }
  ]
});
