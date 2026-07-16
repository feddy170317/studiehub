/* HverdagsHelte-modul: Musik — folkeskolefag 1.-6. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "musik",
  "name": "Musik 🎵",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [1, 6],
  "description": "Sang, spil, musikforståelse og at skabe egen musik. Det færdige resultat er ligegyldigt — det er lysten der giver XP.",

  "skills": [
    { "id": "musik", "name": "Musik", "icon": "🎵", "color": "#f06292" },
    { "id": "musik.sang",    "name": "Sang",             "icon": "🎤", "color": "#4fc3f7", "parent": "musik" },
    { "id": "musik.spil",    "name": "Spil & rytme",     "icon": "🥁", "color": "#ffb74d", "parent": "musik" },
    { "id": "musik.lytning", "name": "Musikforståelse",  "icon": "👂", "color": "#81c784", "parent": "musik" },
    { "id": "musik.skabe",   "name": "Skab musik",       "icon": "✍️", "color": "#ba68c8", "parent": "musik" }
  ],

  "quests": [
    { "id": "syng", "title": "Syng en hel sang — højt!", "desc": "I badet tæller også. Ekstra sejt: for hele familien", "icon": "🎤",
      "type": "weekly", "rewards": [{ "skill": "musik.sang", "xp": 20 }] },
    { "id": "rytme", "title": "Lav en rytme og lær den til en anden", "desc": "Klap, tramp eller brug gryder — kan de gentage den?", "icon": "🥁",
      "type": "weekly", "rewards": [{ "skill": "musik.spil", "xp": 20 }] },
    { "id": "nygenre", "title": "Lyt til en genre du ikke kender", "desc": "Jazz, opera, folkemusik — beskriv hvordan den lyder", "icon": "👂",
      "type": "weekly", "rewards": [{ "skill": "musik.lytning", "xp": 25 }, { "gold": 5 }] },
    { "id": "instrument", "title": "Øv på et instrument i 15 minutter", "desc": "Klaver, guitar, blokfløjte — alt tæller", "icon": "🎹",
      "type": "daily", "rewards": [{ "skill": "musik.spil", "xp": 15 }] },
    { "id": "egen-sang", "title": "⭐ Find på din egen lille sang eller melodi", "desc": "Mindst 4 linjer — optag den eller syng den live", "icon": "✍️",
      "type": "once", "rewards": [{ "skill": "musik.skabe", "xp": 50 }, { "gold": 15 }] }
  ],

  "badges": [
    { "id": "sanger", "name": "Sangfuglen", "icon": "🎵", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "musik", "level": 5 } },
    { "id": "mus20", "name": "20 musik-quests", "icon": "🎤", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "musik" }, "count": 20 } },
    { "id": "mozart", "name": "Mozart", "icon": "🎼", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "musik" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "musstreak", "name": "Musik-streak", "icon": "🔥",
      "period": "week", "target": 2, "scope": { "module": "musik" },
      "milestones": [4, 10, 25, 52] }
  ]
});
