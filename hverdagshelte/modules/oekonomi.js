/* HverdagsHelte-modul: Lommepenge & Økonomi — forstå penge i den virkelige verden.
   Spiller sammen med guld-økonomien i appen og opslagstavle-jobs (fase D). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "oekonomi",
  "name": "Lommepenge & Økonomi 🪙",
  "version": 1,
  "author": "Frederik",
  "category": "fritid",
  "grades": [2, 9],
  "description": "Opsparing, budget og forståelse af penge — med rigtige lommepenge, ikke kun guld i spillet. Godt sammen med jobs fra opslagstavlen.",

  "skills": [
    { "id": "oekonomi", "name": "Økonomi", "icon": "🪙", "color": "#ffd54f" },
    { "id": "oekonomi.opsparing", "name": "Opsparing",         "icon": "🏦", "color": "#81c784", "parent": "oekonomi" },
    { "id": "oekonomi.budget",    "name": "Budget & overblik", "icon": "📒", "color": "#4fc3f7", "parent": "oekonomi" },
    { "id": "oekonomi.kloge",     "name": "Kloge valg",        "icon": "💡", "color": "#ba68c8", "parent": "oekonomi" }
  ],

  "quests": [
    { "id": "taelop", "title": "Tæl dine penge og skriv beløbet ned", "desc": "Sparegris + konto — hvor meget har du i alt?", "icon": "🧮",
      "type": "weekly", "rewards": [{ "skill": "oekonomi.budget", "xp": 15 }] },
    { "id": "sparop", "title": "Læg penge til side i stedet for at bruge dem", "desc": "Bare en del af dine lommepenge — opsparing er en superkraft", "icon": "🏦",
      "type": "weekly", "rewards": [{ "skill": "oekonomi.opsparing", "xp": 20 }, { "gold": 5 }] },
    { "id": "prisjagt", "title": "Find den billigste pris på en vare", "desc": "Sammenlign i tilbudsaviser eller på nettet — hvor meget kan man spare?", "icon": "🔍",
      "type": "weekly", "rewards": [{ "skill": "oekonomi.kloge", "xp": 20 }] },
    { "id": "oenskeliste", "title": "Skriv en ønskeliste med rigtige priser", "desc": "Hvad koster dine drømme? Hvad vil du helst have — og hvor længe skal du spare?", "icon": "📝",
      "type": "once", "rewards": [{ "skill": "oekonomi.budget", "xp": 30 }, { "gold": 10 }] },
    { "id": "sparemaal", "title": "⭐ Sæt et opsparingsmål — og nå det!", "desc": "Vælg noget du vil købe, regn ud hvor længe det tager, og spar op til det", "icon": "🎯",
      "type": "once", "rewards": [{ "skill": "oekonomi.opsparing", "xp": 75 }, { "skill": "oekonomi.kloge", "xp": 25 }, { "gold": 50 }] },
    { "id": "budget", "title": "Lav et lille månedsbudget", "desc": "5.–9. klasse: hvad får du ind, hvad bruger du, hvad sparer du?", "icon": "📒",
      "type": "once", "active": false, "grades": [5, 9], "rewards": [{ "skill": "oekonomi.budget", "xp": 50 }, { "gold": 20 }] }
  ],

  "badges": [
    { "id": "sparegris", "name": "Guld-grisen", "icon": "🐷", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "oekonomi.opsparing", "level": 5 } },
    { "id": "overblik", "name": "Overbliks-ørnen", "icon": "🦅", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "oekonomi.budget", "level": 3 } },
    { "id": "oeko10", "name": "10 penge-quests", "icon": "🪙", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "oekonomi" }, "count": 10 } },
    { "id": "moneypenny", "name": "Den lille Investor", "icon": "💼", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "oekonomi" }, "count": 50 } }
  ],

  "streaks": [
    { "id": "sparestreak", "name": "Opsparings-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "skill": "oekonomi.opsparing" },
      "milestones": [4, 10, 26, 52] }
  ]
});
