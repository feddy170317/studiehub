/* HverdagsHelte-modul: Samfundsfag — folkeskolefag 8.-9. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "samfundsfag",
  "name": "Samfundsfag 🗳️",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [8, 9],
  "description": "Demokrati, økonomi, medier og det globale samfund. Bunden mundtlig prøve i 9. klasse... hvis den udtrækkes.",

  "skills": [
    { "id": "samfundsfag", "name": "Samfundsfag", "icon": "🗳️", "color": "#e05a6c" },
    { "id": "samfundsfag.demokrati", "name": "Demokrati & politik", "icon": "🗳️", "color": "#4fc3f7", "parent": "samfundsfag" },
    { "id": "samfundsfag.oekonomi",  "name": "Samfundsøkonomi",     "icon": "💰", "color": "#ffd54f", "parent": "samfundsfag" },
    { "id": "samfundsfag.medier",    "name": "Medier & kritik",     "icon": "📰", "color": "#ba68c8", "parent": "samfundsfag" },
    { "id": "samfundsfag.verden",    "name": "Det globale samfund", "icon": "🌐", "color": "#81c784", "parent": "samfundsfag" }
  ],

  "quests": [
    { "id": "nyhedsreferat", "title": "Forklar én nyhedssag med dine egne ord", "desc": "Hvem, hvad, hvorfor — og hvad synes du selv?", "icon": "📰",
      "type": "weekly", "rewards": [{ "skill": "samfundsfag.medier", "xp": 25 }, { "gold": 5 }] },
    { "id": "djaevlens", "title": "Tag en debat som djævlens advokat", "desc": "Argumentér for det MODSATTE af hvad du mener — god træning!", "icon": "😈",
      "type": "weekly", "rewards": [{ "skill": "samfundsfag.demokrati", "xp": 30 }] },
    { "id": "politiksag", "title": "Følg en politisk sag i en uge", "desc": "Hvad vil partierne? Hvem er uenige, og hvorfor?", "icon": "🏛️",
      "type": "weekly", "rewards": [{ "skill": "samfundsfag.demokrati", "xp": 25 }, { "gold": 5 }] },
    { "id": "budgetkig", "title": "Se på familiens faste udgifter sammen med en voksen", "desc": "Husleje, mad, forsikring, skat — hvor bliver pengene af?", "icon": "💰",
      "type": "once", "rewards": [{ "skill": "samfundsfag.oekonomi", "xp": 40 }, { "gold": 10 }] },

    { "id": "quiz-sam-8", "title": "Quiz: Samfundsfag 8. klasse", "desc": "Demokrati, Folketinget og magtens tredeling", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvor mange medlemmer har Folketinget?", "answers": ["179", "175", "200", "150"] },
        { "q": "Hvad er magtens tredeling?", "answers": ["Lovgivende, udøvende og dømmende magt", "Konge, kirke og folk", "Stat, region og kommune", "Politi, militær og domstole"] },
        { "q": "Hvornår må man stemme til folketingsvalg?", "answers": ["Fra 18 år", "Fra 16 år", "Fra 21 år", "Fra 15 år"] },
        { "q": "Hvem udgør den udøvende magt?", "answers": ["Regeringen", "Folketinget", "Domstolene", "Pressen"] },
        { "q": "Hvad betyder demokrati?", "answers": ["Folkestyre", "Kongestyre", "Militærstyre", "Ekspertstyre"] },
        { "q": "Hvad står kommunerne bl.a. for?", "answers": ["Folkeskoler og lokale veje", "Udenrigspolitik", "Forsvaret", "Møntfoden"] },
        { "q": "Hvad kræver det at vedtage en lov?", "answers": ["Flertal i Folketinget efter tre behandlinger", "Kongens ordre", "Altid en folkeafstemning", "Dommernes godkendelse"] },
        { "q": "Hvad er ytringsfrihed?", "answers": ["Retten til at sige sin mening", "Pligt til at udtale sig", "Retten til at lyve i retten", "Gratis aviser til alle"] },
        { "q": "Hvornår fejres grundlovsdag?", "answers": ["5. juni", "1. maj", "24. december", "4. juli"] },
        { "q": "Hvem dømmer i konflikter om loven?", "answers": ["Domstolene", "Politiet", "Statsministeren", "Medierne"] }
      ] },
      "rewards": [{ "skill": "samfundsfag.demokrati", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-sam-9", "title": "Quiz: Samfundsfag 9. klasse", "desc": "Økonomi, velfærd og ideologier — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad finansierer velfærdsstaten primært?", "answers": ["Skatter", "Lotteri", "Donationer", "Kun eksport"] },
        { "q": "Hvad er BNP?", "answers": ["Værdien af et lands produktion på et år", "Statens gæld", "Antallet af borgere", "Bankernes formue"] },
        { "q": "Hvilken ideologi vægter det frie marked højest?", "answers": ["Liberalisme", "Socialisme", "Kommunisme", "Anarkisme"] },
        { "q": "Hvad er EU's indre marked?", "answers": ["Fri bevægelighed for varer, tjenester, kapital og personer", "En børs i Bruxelles", "Kun en toldaftale", "Et fælles militær"] },
        { "q": "Hvad er inflation?", "answers": ["At priserne generelt stiger", "At priserne falder", "At lønnen altid stiger", "At valutaen forsvinder"] },
        { "q": "Hvad kaldes medierne ofte?", "answers": ["Den fjerde statsmagt", "Den anden statsmagt", "Folkets domstol", "Den stille magt"] },
        { "q": "Hvad er en fagforening?", "answers": ["En organisation der varetager lønmodtageres interesser", "En bank", "Et politisk parti", "En domstol"] },
        { "q": "Hvad kendetegner socialisme?", "answers": ["Vægt på lighed og fællesskab", "Vægt på fri konkurrence alene", "Kongestyre", "Ingen skatter"] },
        { "q": "Hvor ofte skal der senest holdes folketingsvalg?", "answers": ["Hvert 4. år", "Hvert 2. år", "Hvert 5. år", "Hvert 8. år"] },
        { "q": "Hvad laver Nationalbanken?", "answers": ["Udsteder penge og sikrer kronens stabilitet", "Opkræver skat", "Vedtager love", "Driver folkeskoler"] }
      ] },
      "rewards": [{ "skill": "samfundsfag.oekonomi", "xp": 25 }, { "skill": "samfundsfag.demokrati", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "samfundssind", "name": "Samfundssind", "icon": "🗳️", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "samfundsfag", "level": 5 } },
    { "id": "sam20", "name": "20 samfundsfags-quests", "icon": "📰", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "samfundsfag" }, "count": 20 } },
    { "id": "statsminister", "name": "Statsministeren", "icon": "🏛️", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "samfundsfag" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "samstreak", "name": "Samfunds-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "samfundsfag" },
      "milestones": [4, 10, 25, 52] }
  ]
});
