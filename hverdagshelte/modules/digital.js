/* HverdagsHelte-modul: Digital dannelse — gode skærmvaner, kildekritik og god tone.
   Pointen er IKKE at skærme er farlige, men at barnet lærer at styre dem selv. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "digital",
  "name": "Digital dannelse 💻",
  "version": 1,
  "author": "Frederik",
  "category": "fritid",
  "grades": [2, 9],
  "description": "Gode skærmvaner, kildekritik og god tone online. Belønner selvkontrol og kritisk tænkning — aldrig straf for skærmtid.",

  "skills": [
    { "id": "digital", "name": "Digital dannelse", "icon": "💻", "color": "#9c6bff" },
    { "id": "digital.vaner", "name": "Gode skærmvaner", "icon": "⏳", "color": "#4fc3f7", "parent": "digital" },
    { "id": "digital.kilde", "name": "Kildekritik",     "icon": "🔍", "color": "#ffb74d", "parent": "digital" },
    { "id": "digital.tone",  "name": "God tone online", "icon": "💬", "color": "#81c784", "parent": "digital" }
  ],

  "quests": [
    { "id": "skaermfri", "title": "Skærmfri den sidste time inden sengetid", "desc": "Læs, teg eller hyg i stedet — din hjerne sover bedre", "icon": "🌙",
      "type": "daily", "rewards": [{ "skill": "digital.vaner", "xp": 10 }] },
    { "id": "stopselv", "title": "Stop skærmen til tiden — uden at blive sur", "desc": "Når aftalen siger stop, stopper du. DET er en superkraft", "icon": "⏳",
      "type": "daily", "rewards": [{ "skill": "digital.vaner", "xp": 10 }] },
    { "id": "aegteellerfup", "title": "Ægte eller fup? Tjek en påstand", "desc": "Så du noget vildt online? Find ud af sammen med en voksen om det passer", "icon": "🕵️",
      "type": "weekly", "rewards": [{ "skill": "digital.kilde", "xp": 25 }, { "gold": 5 }] },
    { "id": "venlig", "title": "Skriv en venlig besked til nogen", "desc": "Til en ven, bedsteforældre eller en du ikke har snakket med længe", "icon": "💌",
      "type": "weekly", "rewards": [{ "skill": "digital.tone", "xp": 15 }] },
    { "id": "skaermfridag", "title": "Hold en hel skærmfri dag", "desc": "Fra morgen til aften — planlæg noget sjovt i stedet", "icon": "🏕️",
      "type": "weekly", "rewards": [{ "skill": "digital.vaner", "xp": 40 }, { "gold": 10 }] },
    { "id": "reklame", "title": "Spot en reklame der lader som om den ikke er en", "desc": "5.–9. klasse: influencere, unboxing, 'anbefalinger' — hvem betaler?", "icon": "🎯",
      "type": "weekly", "active": false, "grades": [5, 9], "rewards": [{ "skill": "digital.kilde", "xp": 30 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "selvstyring", "name": "Skærm-mesteren", "icon": "🧘", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "digital.vaner", "level": 5 } },
    { "id": "detektiv", "name": "Fakta-detektiven", "icon": "🕵️", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "digital.kilde", "level": 3 } },
    { "id": "dig25", "name": "25 digital-quests", "icon": "💻", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "digital" }, "count": 25 } },
    { "id": "digitalridder", "name": "Den digitale Ridder", "icon": "🛡️", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "digital" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "vanestreak", "name": "Skærmvane-streak", "icon": "🔥",
      "period": "day", "target": 1, "scope": { "skill": "digital.vaner" },
      "milestones": [7, 30, 100, 365] }
  ]
});
