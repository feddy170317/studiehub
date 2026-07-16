/* HverdagsHelte-modul: Fitness & Bevægelse — inkl. 10-km-questen fra det oprindelige
   interview: én quest der giver XP til BÅDE udholdenhed og viljestyrke (multi-skill-reward). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "fitness",
  "name": "Fitness & Bevægelse 🏃",
  "version": 1,
  "author": "Frederik",
  "category": "fritid",
  "description": "Udholdenhed, styrke, boldspil og viljestyrke. Den store 10-km-quest giver XP til både udholdenhed OG viljestyrke — nogle bedrifter bygger mere end én muskel.",

  "skills": [
    { "id": "fitness", "name": "Fitness", "icon": "💪", "color": "#ff8a65" },
    { "id": "fitness.udholdenhed", "name": "Udholdenhed", "icon": "🏃", "color": "#4fc3f7", "parent": "fitness" },
    { "id": "fitness.styrke",      "name": "Styrke",      "icon": "🏋️", "color": "#ffb74d", "parent": "fitness" },
    { "id": "fitness.bold",        "name": "Boldspil",    "icon": "⚽", "color": "#81c784", "parent": "fitness" },
    { "id": "fitness.vilje",       "name": "Viljestyrke", "icon": "🔥", "color": "#f06292", "parent": "fitness" }
  ],

  "quests": [
    { "id": "bevaeg30", "title": "Bevæg dig 30 minutter", "desc": "Leg, løb, dans, trampolin — bare du får pulsen op", "icon": "🤸",
      "type": "daily", "rewards": [{ "skill": "fitness.udholdenhed", "xp": 15 }] },
    { "id": "styrke", "title": "10 armbøjninger + 20 squats", "desc": "På knæ er helt fint — det tæller!", "icon": "🏋️",
      "type": "daily", "rewards": [{ "skill": "fitness.styrke", "xp": 10 }] },
    { "id": "tur", "title": "Løb eller cykl en rigtig tur", "desc": "Mindst 15 minutter uden pause", "icon": "🚴",
      "type": "weekly", "rewards": [{ "skill": "fitness.udholdenhed", "xp": 25 }, { "gold": 5 }] },
    { "id": "boldspil", "title": "Spil bold i mindst 30 minutter", "desc": "Fodbold, håndbold, basket — også bare i haven", "icon": "⚽",
      "type": "weekly", "rewards": [{ "skill": "fitness.bold", "xp": 20 }, { "gold": 5 }] },
    { "id": "nytforsog", "title": "Prøv noget du ikke kunne sidste gang", "desc": "Vejrmølle, hoppe højere, holde balancen længere — bliv ved!", "icon": "🎯",
      "type": "weekly", "rewards": [{ "skill": "fitness.vilje", "xp": 25 }] },
    { "id": "ti-km", "title": "⭐ DEN STORE: Løb 10 km på én gang", "desc": "Træn dig op til den — når du klarer den, er du en LEGENDE", "icon": "🏅",
      "type": "once", "grades": [4, 9], "rewards": [{ "skill": "fitness.udholdenhed", "xp": 150 }, { "skill": "fitness.vilje", "xp": 100 }, { "gold": 100 }] },
    { "id": "fem-km", "title": "⭐ Løb 5 km på én gang", "desc": "Den første store milepæl — sæt tempoet ned og bliv ved", "icon": "🎖️",
      "type": "once", "rewards": [{ "skill": "fitness.udholdenhed", "xp": 75 }, { "skill": "fitness.vilje", "xp": 50 }, { "gold": 50 }] }
  ],

  "badges": [
    { "id": "jernvilje", "name": "Jernvilje", "icon": "🔥", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "fitness.vilje", "level": 5 } },
    { "id": "sprinter", "name": "Sprinteren", "icon": "🏃", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "fitness.udholdenhed", "level": 3 } },
    { "id": "fit25", "name": "25 fitness-quests", "icon": "💪", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "fitness" }, "count": 25 } },
    { "id": "olympier", "name": "Olympieren", "icon": "🥇", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "fitness" }, "count": 150 } }
  ],

  "streaks": [
    { "id": "fitstreak", "name": "Bevægelses-streak", "icon": "🔥",
      "period": "day", "target": 1, "scope": { "module": "fitness" },
      "milestones": [7, 30, 100, 365] }
  ]
});
