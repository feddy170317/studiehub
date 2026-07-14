/* HverdagsHelte-modul: Dansk — de fire officielle sprogområder.
   Bundlet som .js så det virker ved file:// (samme mønster som QuizLive-quizzer).
   Selve indholdet er ren JSON i hverdagshelte-module@1-formatet. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "dansk",
  "name": "Dansk 📖",
  "version": 1,
  "author": "Frederik",
  "description": "Bygget over de fire grundlæggende sprogområder: læseforståelse, skriftlig fremstilling, mundtlig kommunikation og lytteforståelse. Passer 2.–9. klasse — slå quests til/fra efter klassetrin.",

  "skills": [
    { "id": "dansk", "name": "Dansk", "icon": "📖", "color": "#e05a6c" },
    { "id": "dansk.laesning",  "name": "Læseforståelse",        "icon": "📚", "color": "#ba68c8", "parent": "dansk" },
    { "id": "dansk.skrivning", "name": "Skriftlig fremstilling", "icon": "✍️", "color": "#ffb74d", "parent": "dansk" },
    { "id": "dansk.mundtlig",  "name": "Mundtlig kommunikation", "icon": "🗣️", "color": "#4fc3f7", "parent": "dansk" },
    { "id": "dansk.lytning",   "name": "Lytteforståelse",        "icon": "👂", "color": "#81c784", "parent": "dansk" }
  ],

  "quests": [
    { "id": "laes20", "title": "Læs 20 minutter i din bog", "desc": "Selvvalgt bog — alle dage tæller", "icon": "📚",
      "type": "daily", "rewards": [{ "skill": "dansk.laesning", "xp": 20 }] },
    { "id": "dagbog", "title": "Skriv dagbog: 3 sætninger om din dag", "desc": "Husk stort begyndelsesbogstav og punktum", "icon": "📓",
      "type": "daily", "days": [1, 2, 3, 4, 5], "rewards": [{ "skill": "dansk.skrivning", "xp": 15 }] },
    { "id": "genfortael", "title": "Genfortæl din bog ved aftensmaden", "desc": "Hvad er sket? Hvem er med? Hvad tror du der sker nu?", "icon": "🍽️",
      "type": "weekly", "rewards": [{ "skill": "dansk.mundtlig", "xp": 25 }, { "gold": 5 }] },
    { "id": "lyt3", "title": "Lyt til lydbog eller podcast — fortæl 3 ting", "desc": "Mindst 15 minutter, og fortæl bagefter 3 ting du hørte", "icon": "🎧",
      "type": "weekly", "rewards": [{ "skill": "dansk.lytning", "xp": 25 }, { "gold": 5 }] },
    { "id": "historie", "title": "Skriv en lille historie (en halv side)", "desc": "Fri fantasi! Læs den højt for en voksen bagefter", "icon": "🏰",
      "type": "weekly", "rewards": [{ "skill": "dansk.skrivning", "xp": 40 }, { "gold": 10 }] },
    { "id": "anmeldelse", "title": "Skriv en anmeldelse af en bog eller film", "desc": "4.–9. klasse: hvad var godt, hvad var skidt, og hvorfor?", "icon": "⭐",
      "type": "weekly", "active": false, "rewards": [{ "skill": "dansk.skrivning", "xp": 40 }, { "gold": 15 }] },
    { "id": "oplaeg", "title": "Hold et lille oplæg for familien", "desc": "5.–9. klasse: 5 minutter om et emne du selv vælger", "icon": "🎤",
      "type": "weekly", "active": false, "rewards": [{ "skill": "dansk.mundtlig", "xp": 50 }, { "gold": 15 }] }
  ],

  "badges": [
    { "id": "bogorm", "name": "Bogorm", "icon": "🐛", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "dansk.laesning", "level": 5 } },
    { "id": "fortaeller", "name": "Fortælleren", "icon": "🎭", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "dansk.mundtlig", "level": 3 } },
    { "id": "dansk25", "name": "25 dansk-quests", "icon": "📕", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "dansk" }, "count": 25 } },
    { "id": "danskdrage", "name": "Dansk-dragen", "icon": "🐉", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "dansk" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "laesestreak", "name": "Læse-streak", "icon": "🔥",
      "period": "day", "target": 1, "scope": { "skill": "dansk.laesning" },
      "milestones": [7, 30, 100, 365] }
  ]
});
