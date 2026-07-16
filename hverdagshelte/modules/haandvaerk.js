/* HverdagsHelte-modul: Håndværk og design — folkeskolefag 4.-7. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "haandvaerk",
  "name": "Håndværk & Design 🔨",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [4, 7],
  "description": "Designproces, værktøj, træ/metal og tekstil. Skitse først, byg bagefter — og altid med en voksen ved skarpt værktøj.",

  "skills": [
    { "id": "haandvaerk", "name": "Håndværk & Design", "icon": "🔨", "color": "#b0764a" },
    { "id": "haandvaerk.design",   "name": "Designproces",     "icon": "✏️", "color": "#4fc3f7", "parent": "haandvaerk" },
    { "id": "haandvaerk.vaerktoej","name": "Værktøjskendskab", "icon": "🧰", "color": "#ffb74d", "parent": "haandvaerk" },
    { "id": "haandvaerk.byg",      "name": "Træ & byg",        "icon": "🪚", "color": "#81c784", "parent": "haandvaerk" },
    { "id": "haandvaerk.tekstil",  "name": "Tekstil & syning", "icon": "🧵", "color": "#f06292", "parent": "haandvaerk" }
  ],

  "quests": [
    { "id": "skitse", "title": "Tegn en skitse FØR du bygger noget", "desc": "Mål, materialer og plan — som en rigtig designer", "icon": "✏️",
      "type": "weekly", "rewards": [{ "skill": "haandvaerk.design", "xp": 20 }] },
    { "id": "nytvaerktoej", "title": "Lær et nyt værktøj at kende (med en voksen)", "desc": "Sav, boremaskine, limpistol — hvad kan det, og hvad skal man passe på?", "icon": "🧰",
      "type": "weekly", "rewards": [{ "skill": "haandvaerk.vaerktoej", "xp": 25 }, { "gold": 5 }] },
    { "id": "reparation", "title": "Reparér noget i stedet for at smide det ud", "desc": "Sy en knap i, lim et ben, lap et dæk", "icon": "🩹",
      "type": "weekly", "rewards": [{ "skill": "haandvaerk.tekstil", "xp": 25 }, { "gold": 5 }] },
    { "id": "syning", "title": "Sy noget — i hånden eller på maskine", "desc": "En knap, et mærke, en lille pude", "icon": "🧵",
      "type": "weekly", "rewards": [{ "skill": "haandvaerk.tekstil", "xp": 20 }] },
    { "id": "byggeprojekt", "title": "⭐ Gennemfør et byggeprojekt fra skitse til færdig", "desc": "Fuglehus, knagerække, telefonholder — vis det frem!", "icon": "🔨",
      "type": "once", "rewards": [{ "skill": "haandvaerk.byg", "xp": 50 }, { "skill": "haandvaerk.design", "xp": 25 }, { "gold": 25 }] }
  ],

  "badges": [
    { "id": "smed", "name": "Mestersmeden", "icon": "🔨", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "haandvaerk", "level": 5 } },
    { "id": "haa20", "name": "20 håndværker-quests", "icon": "🧰", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "haandvaerk" }, "count": 20 } },
    { "id": "davinci-vaerksted", "name": "Værkstedsmesteren", "icon": "⚙️", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "haandvaerk" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "haastreak", "name": "Værksteds-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "haandvaerk" },
      "milestones": [4, 10, 25, 52] }
  ]
});
