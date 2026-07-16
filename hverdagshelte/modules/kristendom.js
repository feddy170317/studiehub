/* HverdagsHelte-modul: Kristendomskundskab — folkeskolefag 1.-9. klasse (Fælles Mål).
   Faget handler om livsfilosofi, etik og religioner — ikke forkyndelse. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "kristendom",
  "name": "Kristendomskundskab ⛪",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [1, 9],
  "description": "Livsfilosofi og etik, bibelske fortællinger, kristendom og andre religioner. Samtale-quests der passer til faget — det handler om at undre sig, ikke om facit.",

  "skills": [
    { "id": "kristendom", "name": "Kristendomskundskab", "icon": "⛪", "color": "#b0764a" },
    { "id": "kristendom.etik",          "name": "Etik & livsfilosofi",     "icon": "💭", "color": "#4fc3f7", "parent": "kristendom" },
    { "id": "kristendom.fortaellinger", "name": "Bibelske fortællinger",   "icon": "📖", "color": "#ffb74d", "parent": "kristendom" },
    { "id": "kristendom.religioner",    "name": "Verdensreligioner",       "icon": "🕌", "color": "#81c784", "parent": "kristendom" },
    { "id": "kristendom.traditioner",   "name": "Højtider & traditioner",  "icon": "🎄", "color": "#f06292", "parent": "kristendom" }
  ],

  "quests": [
    { "id": "dilemma", "title": "Vend et etisk dilemma ved aftensmaden", "desc": "F.eks.: Må man lyve for at beskytte en ven? Hvorfor/hvorfor ikke?", "icon": "💭",
      "type": "weekly", "rewards": [{ "skill": "kristendom.etik", "xp": 25 }, { "gold": 5 }] },
    { "id": "hoejtid", "title": "Fortæl hvad den næste højtid egentlig handler om", "desc": "Jul, påske, ramadan, fastelavn — hvad fejres, og hvorfor?", "icon": "🎄",
      "type": "weekly", "rewards": [{ "skill": "kristendom.traditioner", "xp": 20 }] },
    { "id": "fortaelling", "title": "Hør en bibelsk eller religiøs fortælling og genfortæl den", "desc": "Hvad tror du fortællingen vil lære os?", "icon": "📖",
      "type": "weekly", "rewards": [{ "skill": "kristendom.fortaellinger", "xp": 20 }] },
    { "id": "ligheder", "title": "Find 3 ligheder mellem to religioner", "desc": "5.–9. klasse: fx kristendom og islam — hvad har de tilfælles?", "icon": "🤝",
      "type": "weekly", "active": false, "grades": [5, 9], "rewards": [{ "skill": "kristendom.religioner", "xp": 30 }, { "gold": 5 }] },
    { "id": "besoeg", "title": "⭐ Besøg en kirke, moské eller synagoge", "desc": "Kig på rummet — hvad lægger du mærke til?", "icon": "⛪",
      "type": "once", "rewards": [{ "skill": "kristendom.religioner", "xp": 40 }, { "gold": 15 }] },
    { "id": "livssporgsmaal", "title": "Stil et stort spørgsmål — og snak om det", "desc": "Hvad er lykke? Hvorfor findes ondskab? Der er ikke ét rigtigt svar", "icon": "🌌",
      "type": "weekly", "grades": [4, 9], "rewards": [{ "skill": "kristendom.etik", "xp": 25 }] }
  ],

  "badges": [
    { "id": "filosof", "name": "Den lille Filosof", "icon": "💭", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "kristendom", "level": 5 } },
    { "id": "kri20", "name": "20 undre-quests", "icon": "⛪", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "kristendom" }, "count": 20 } },
    { "id": "sokrates", "name": "Sokrates", "icon": "🏺", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "kristendom" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "kristreak", "name": "Undre-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "kristendom" },
      "milestones": [4, 10, 25, 52] }
  ]
});
