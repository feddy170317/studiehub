/* HverdagsHelte-modul: Kreativitet — tegning, musik, byggeri og historier. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "kreativitet",
  "name": "Kreativitet 🎨",
  "version": 1,
  "author": "Frederik",
  "category": "fritid",
  "description": "Tegning & maling, musik, byg & skab og historiefortælling. Det færdige resultat er ligegyldigt — det er lysten til at skabe der giver XP.",

  "skills": [
    { "id": "kreativ", "name": "Kreativitet", "icon": "🎨", "color": "#f06292" },
    { "id": "kreativ.tegning",  "name": "Tegning & maling",    "icon": "🖍️", "color": "#ffb74d", "parent": "kreativ" },
    { "id": "kreativ.musik",    "name": "Musik",               "icon": "🎵", "color": "#4fc3f7", "parent": "kreativ" },
    { "id": "kreativ.byg",      "name": "Byg & skab",          "icon": "🧱", "color": "#81c784", "parent": "kreativ" },
    { "id": "kreativ.historie", "name": "Historiefortælling",  "icon": "🎭", "color": "#ba68c8", "parent": "kreativ" }
  ],

  "quests": [
    { "id": "tegn20", "title": "Tegn eller mal i 20 minutter", "desc": "Frit valg — kruseduller tæller også", "icon": "🖍️",
      "type": "daily", "rewards": [{ "skill": "kreativ.tegning", "xp": 15 }] },
    { "id": "musik", "title": "Lav eller øv musik i 15 minutter", "desc": "Syng, spil, klap rytmer eller lav en sang", "icon": "🎵",
      "type": "daily", "rewards": [{ "skill": "kreativ.musik", "xp": 15 }] },
    { "id": "byg", "title": "Byg noget med dine hænder", "desc": "LEGO, perler, pap, træ, modellervoks — hvad som helst", "icon": "🧱",
      "type": "weekly", "rewards": [{ "skill": "kreativ.byg", "xp": 25 }, { "gold": 5 }] },
    { "id": "genbrugskunst", "title": "Lav kunst af genbrugsting", "desc": "Toiletruller, mælkekartoner, aviser — skrald bliver til skat", "icon": "♻️",
      "type": "weekly", "rewards": [{ "skill": "kreativ.byg", "xp": 25 }, { "gold": 5 }] },
    { "id": "fortael", "title": "Find på en historie og fortæl den", "desc": "For familien ved aftensmaden — eller som godnathistorie for en mindre søskende", "icon": "🎭",
      "type": "weekly", "rewards": [{ "skill": "kreativ.historie", "xp": 25 }, { "gold": 5 }] },
    { "id": "udstilling", "title": "⭐ Lav en udstilling af dine værker", "desc": "Saml dine bedste ting og invitér familien til fernisering 🥂", "icon": "🖼️",
      "type": "once", "rewards": [{ "skill": "kreativ.tegning", "xp": 40 }, { "skill": "kreativ.historie", "xp": 20 }, { "gold": 25 }] }
  ],

  "badges": [
    { "id": "kunstner", "name": "Kunstneren", "icon": "🎨", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "kreativ", "level": 5 } },
    { "id": "arkitekt", "name": "Lille Arkitekt", "icon": "🏗️", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "kreativ.byg", "level": 3 } },
    { "id": "krea25", "name": "25 krea-quests", "icon": "🖌️", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "kreativitet" }, "count": 25 } },
    { "id": "davinci", "name": "Da Vinci", "icon": "🌟", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "kreativitet" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "kreastreak", "name": "Skaber-streak", "icon": "🔥",
      "period": "week", "target": 3, "scope": { "module": "kreativitet" },
      "milestones": [4, 10, 25, 52] }
  ]
});
