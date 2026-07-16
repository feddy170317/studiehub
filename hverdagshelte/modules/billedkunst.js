/* HverdagsHelte-modul: Billedkunst — folkeskolefag 1.-6. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "billedkunst",
  "name": "Billedkunst 🖼️",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [1, 6],
  "description": "Tegning, maleri, skulptur og billedsnak. Supplerer Kreativitet (fritid) med skolefagets teknikker og billedanalyse.",

  "skills": [
    { "id": "billedkunst", "name": "Billedkunst", "icon": "🖼️", "color": "#ba68c8" },
    { "id": "billedkunst.tegning",  "name": "Tegneteknik",     "icon": "✏️", "color": "#ffb74d", "parent": "billedkunst" },
    { "id": "billedkunst.farver",   "name": "Farver & maleri", "icon": "🎨", "color": "#e05a6c", "parent": "billedkunst" },
    { "id": "billedkunst.form",     "name": "Skulptur & form", "icon": "🗿", "color": "#81c784", "parent": "billedkunst" },
    { "id": "billedkunst.analyse",  "name": "Billedsnak",      "icon": "🔍", "color": "#4fc3f7", "parent": "billedkunst" }
  ],

  "quests": [
    { "id": "iagttag", "title": "Tegn en ting du kan se foran dig", "desc": "Kig mere på tingen end på papiret — det er tricket!", "icon": "✏️",
      "type": "weekly", "rewards": [{ "skill": "billedkunst.tegning", "xp": 20 }] },
    { "id": "farvebland", "title": "Bland dine egne farver og lav et farvekort", "desc": "Hvad giver rød + gul? Blå + gul? Prøv dig frem", "icon": "🎨",
      "type": "weekly", "rewards": [{ "skill": "billedkunst.farver", "xp": 25 }, { "gold": 5 }] },
    { "id": "skulptur", "title": "Lav en figur i ler, pap eller naturmaterialer", "desc": "3D! Den skal kunne stå selv", "icon": "🗿",
      "type": "weekly", "rewards": [{ "skill": "billedkunst.form", "xp": 25 }, { "gold": 5 }] },
    { "id": "billedsnak", "title": "Vælg et billede og fortæl hvad du ser", "desc": "Et maleri, foto eller plakat — hvad sker der? Hvad føler du?", "icon": "🔍",
      "type": "weekly", "rewards": [{ "skill": "billedkunst.analyse", "xp": 20 }] },
    { "id": "selvportraet", "title": "⭐ Tegn eller mal et selvportræt", "desc": "Brug et spejl — og giv det en titel", "icon": "🪞",
      "type": "once", "rewards": [{ "skill": "billedkunst.tegning", "xp": 40 }, { "skill": "billedkunst.analyse", "xp": 15 }, { "gold": 15 }] }
  ],

  "badges": [
    { "id": "maler", "name": "Maleren", "icon": "🖼️", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "billedkunst", "level": 5 } },
    { "id": "bil20", "name": "20 billedkunst-quests", "icon": "🎨", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "billedkunst" }, "count": 20 } },
    { "id": "frida", "name": "Frida", "icon": "🌺", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "billedkunst" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "bilstreak", "name": "Kunst-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "billedkunst" },
      "milestones": [4, 10, 25, 52] }
  ]
});
