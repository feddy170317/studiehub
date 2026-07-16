/* HverdagsHelte-modul: Engelsk — ordforråd, lytning, tale og læsning.
   Engelsk starter i 3. klasse i den danske folkeskole → grades [3,9]. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "engelsk",
  "name": "Engelsk 🇬🇧",
  "version": 1,
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
      "type": "weekly", "active": false, "grades": [6, 9], "rewards": [{ "skill": "engelsk.tale", "xp": 40 }, { "gold": 15 }] }
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
