/* HverdagsHelte-modul: Hjemmet — pligter kategoriseret efter DOMÆNE (værelse, køkken, tøj,
   affald, planter/dyr), ikke efter alder. Alderen styrer hvilke quests admin slår til.
   Quests herunder er sat til ca. 9 år (6–8- og 9–11-års-listerne). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "hjemmet",
  "name": "Hjemmet 🏠",
  "version": 2,
  "author": "Frederik",
  "category": "hjem",
  "description": "Pligter i hjemmet fordelt på 5 domæner: Mit værelse, Køkkenhjælp, Tøj & vasketøj, Affald & genbrug, Planter & kæledyr. Justér quests efter alder — domænerne er de samme fra 2 til 15 år.",

  "skills": [
    { "id": "hjemmet", "name": "Hjemmehelt", "icon": "🏠", "color": "#66d98c" },
    { "id": "hjemmet.vaerelse", "name": "Mit værelse",      "icon": "🛏️", "color": "#ba68c8", "parent": "hjemmet" },
    { "id": "hjemmet.koekken",  "name": "Køkkenhjælp",      "icon": "🍽️", "color": "#ffb74d", "parent": "hjemmet" },
    { "id": "hjemmet.toej",     "name": "Tøj & vasketøj",   "icon": "🧺", "color": "#4fc3f7", "parent": "hjemmet" },
    { "id": "hjemmet.affald",   "name": "Affald & genbrug", "icon": "♻️", "color": "#81c784", "parent": "hjemmet" },
    { "id": "hjemmet.omsorg",   "name": "Planter & kæledyr","icon": "🪴", "color": "#f06292", "parent": "hjemmet" }
  ],

  "quests": [
    { "id": "seng", "title": "Red din seng", "desc": "Hver morgen inden skole", "icon": "🛏️",
      "type": "daily", "rewards": [{ "skill": "hjemmet.vaerelse", "xp": 10 }] },
    { "id": "taske", "title": "Tøm skoletaske og madpakke", "desc": "Lige når du kommer hjem", "icon": "🎒",
      "type": "daily", "days": [1, 2, 3, 4, 5], "rewards": [{ "skill": "hjemmet.koekken", "xp": 10 }] },
    { "id": "bord", "title": "Dæk bord eller tag ud af bordet", "desc": "", "icon": "🍽️",
      "type": "daily", "rewards": [{ "skill": "hjemmet.koekken", "xp": 10 }] },
    { "id": "opvask", "title": "Tøm opvaskemaskinen helt selv", "desc": "Fra ca. 8 år", "icon": "🫧",
      "type": "daily", "grades": [2, 9], "rewards": [{ "skill": "hjemmet.koekken", "xp": 15 }] },
    { "id": "skrald", "title": "Gå ud med skraldet / sortér affald", "desc": "", "icon": "♻️",
      "type": "daily", "grades": [1, 9], "rewards": [{ "skill": "hjemmet.affald", "xp": 10 }] },
    { "id": "planter", "title": "Vand planterne", "desc": "Mandag og torsdag", "icon": "🪴",
      "type": "daily", "days": [1, 4], "rewards": [{ "skill": "hjemmet.omsorg", "xp": 10 }] },
    { "id": "stovsug", "title": "Støvsug dit værelse", "desc": "Fra ca. 8 år", "icon": "🌀",
      "type": "weekly", "grades": [2, 9], "rewards": [{ "skill": "hjemmet.vaerelse", "xp": 25 }, { "gold": 5 }] },
    { "id": "toejsammen", "title": "Læg dit rene tøj sammen og på plads", "desc": "", "icon": "🧺",
      "type": "weekly", "grades": [1, 9], "rewards": [{ "skill": "hjemmet.toej", "xp": 20 }, { "gold": 5 }] },
    { "id": "madlavning", "title": "Hjælp med aftensmaden", "desc": "Snit grøntsager, rør i gryden, vej ingredienser af", "icon": "👩‍🍳",
      "type": "weekly", "grades": [3, 9], "rewards": [{ "skill": "hjemmet.koekken", "xp": 30 }, { "gold": 10 }] },
    { "id": "sengetoej", "title": "Skift sengetøj (med lidt hjælp)", "desc": "", "icon": "🛌",
      "type": "weekly", "grades": [3, 9], "rewards": [{ "skill": "hjemmet.vaerelse", "xp": 30 }, { "gold": 10 }] },
    { "id": "gulvvask", "title": "Støv af og vask gulv på dit værelse", "desc": "10–11 år+: hele værelset, også under sengen", "icon": "🧽",
      "type": "weekly", "active": false, "grades": [4, 9], "rewards": [{ "skill": "hjemmet.vaerelse", "xp": 35 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "hjemmehelt", "name": "Hjemmehelt", "icon": "🦸", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "hjemmet", "level": 5 } },
    { "id": "vaervogter", "name": "Værelses-vogteren", "icon": "🛡️", "rarity": "silver",
      "rule": { "type": "counter", "scope": { "skill": "hjemmet.vaerelse" }, "count": 30 } },
    { "id": "pligt50", "name": "50 pligter", "icon": "🧹", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "hjemmet" }, "count": 50 } },
    { "id": "pligtmaraton", "name": "Pligt-maraton", "icon": "🎖️", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "hjemmet" }, "count": 200 } }
  ],

  "streaks": [
    { "id": "hjemmestreak", "name": "Hjemme-streak", "icon": "🔥",
      "period": "day", "target": 1, "scope": { "module": "hjemmet" },
      "milestones": [7, 30, 100, 365] }
  ]
});
