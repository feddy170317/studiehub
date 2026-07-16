/* HverdagsHelte-modul: Madkundskab — folkeskolefag 4.-7. klasse (Fælles Mål).
   Supplerer Hjemmet-modulets køkkenpligter med FAGETS vinkel: ernæring,
   hygiejne, råvarer og madlavningsteknik. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "madkundskab",
  "name": "Madkundskab 🍳",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [4, 7],
  "description": "Madlavning, ernæring, køkkenhygiejne og råvarekendskab — fra opskrift til færdig ret.",

  "skills": [
    { "id": "madkundskab", "name": "Madkundskab", "icon": "🍳", "color": "#ffb74d" },
    { "id": "madkundskab.lavning",  "name": "Madlavning",           "icon": "👨‍🍳", "color": "#e05a6c", "parent": "madkundskab" },
    { "id": "madkundskab.sundhed",  "name": "Ernæring & sundhed",   "icon": "🥗", "color": "#81c784", "parent": "madkundskab" },
    { "id": "madkundskab.hygiejne", "name": "Køkkenhygiejne",       "icon": "🧼", "color": "#4fc3f7", "parent": "madkundskab" },
    { "id": "madkundskab.raavarer", "name": "Råvarekendskab",       "icon": "🥕", "color": "#ba68c8", "parent": "madkundskab" }
  ],

  "quests": [
    { "id": "opskrift", "title": "Lav en ret efter opskrift (næsten) selv", "desc": "Voksne må hjælpe med det varme — men DU er kokken", "icon": "👨‍🍳",
      "type": "weekly", "rewards": [{ "skill": "madkundskab.lavning", "xp": 30 }, { "gold": 5 }] },
    { "id": "sundttallerken", "title": "Sammensæt et sundt måltid og forklar hvorfor", "desc": "Hvad siger Y-tallerkenen? Grønt, protein og kulhydrat", "icon": "🥗",
      "type": "weekly", "rewards": [{ "skill": "madkundskab.sundhed", "xp": 25 }] },
    { "id": "hygiejnetjek", "title": "Hygiejne-rutinen: hænder, bord og rene redskaber", "desc": "Vis den korrekte håndvask og efterlad køkkenet rent", "icon": "🧼",
      "type": "weekly", "rewards": [{ "skill": "madkundskab.hygiejne", "xp": 20 }] },
    { "id": "saeson", "title": "Find 3 grøntsager i sæson lige nu", "desc": "Tjek i butikken — hvorfor er sæson-grønt bedre og billigere?", "icon": "🥕",
      "type": "weekly", "rewards": [{ "skill": "madkundskab.raavarer", "xp": 20 }] },
    { "id": "smagstest", "title": "Smag noget nyt og beskriv smagen", "desc": "Surt, sødt, salt, bittert eller umami?", "icon": "😋",
      "type": "weekly", "rewards": [{ "skill": "madkundskab.raavarer", "xp": 20 }, { "gold": 5 }] },
    { "id": "gaestebud", "title": "⭐ Lav aftensmad til hele familien", "desc": "Planlæg, køb ind (med voksen), lav maden og dæk bordet", "icon": "🍽️",
      "type": "once", "rewards": [{ "skill": "madkundskab.lavning", "xp": 60 }, { "skill": "madkundskab.sundhed", "xp": 20 }, { "gold": 30 }] }
  ],

  "badges": [
    { "id": "kok", "name": "Køkkenchefen", "icon": "🍳", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "madkundskab", "level": 5 } },
    { "id": "mad20", "name": "20 mad-quests", "icon": "👨‍🍳", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "madkundskab" }, "count": 20 } },
    { "id": "michelin", "name": "Michelin-stjernen", "icon": "⭐", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "madkundskab" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "madstreak", "name": "Køkken-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "madkundskab" },
      "milestones": [4, 10, 25, 52] }
  ]
});
