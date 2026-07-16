/* HverdagsHelte-modul: Idræt — folkeskolefag 0.-9. klasse (Fælles Mål).
   Skolefagets vinkel: alsidighed, regler og fairplay. Fitness-modulet (fritid)
   dækker den personlige træning — de to supplerer hinanden. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "idraet",
  "name": "Idræt 🤸",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [0, 9],
  "description": "Skolefaget idræt: løb/spring/kast, boldspil, dans & bevægelse og fairplay. Prøvefag i 9. klasse (udtræk) — og det vigtigste fag for kroppen.",

  "skills": [
    { "id": "idraet", "name": "Idræt", "icon": "🤸", "color": "#4fc3f7" },
    { "id": "idraet.atletik",    "name": "Løb, spring & kast",  "icon": "🏃", "color": "#ffb74d", "parent": "idraet" },
    { "id": "idraet.boldspil",   "name": "Boldspil & regler",   "icon": "⚽", "color": "#81c784", "parent": "idraet" },
    { "id": "idraet.bevaegelse", "name": "Dans & bevægelse",    "icon": "💃", "color": "#f06292", "parent": "idraet" },
    { "id": "idraet.fairplay",   "name": "Samarbejde & fairplay", "icon": "🤝", "color": "#ba68c8", "parent": "idraet" }
  ],

  "quests": [
    { "id": "opvarmning", "title": "Lav din egen opvarmning med 5 øvelser", "desc": "Led den for familien — hvorfor varmer man op?", "icon": "🔥",
      "type": "weekly", "rewards": [{ "skill": "idraet.atletik", "xp": 20 }] },
    { "id": "nytspil", "title": "Lær et nyt spil og forklar reglerne", "desc": "Rundbold, stikbold, badminton — lær det videre til andre", "icon": "⚽",
      "type": "weekly", "rewards": [{ "skill": "idraet.boldspil", "xp": 25 }, { "gold": 5 }] },
    { "id": "dans", "title": "Lav en lille dans eller rutine til en sang", "desc": "Mindst 30 sekunder — vis den for nogen!", "icon": "💃",
      "type": "weekly", "rewards": [{ "skill": "idraet.bevaegelse", "xp": 25 }, { "gold": 5 }] },
    { "id": "dommer", "title": "Vær dommer i en leg eller kamp — og døm fair", "desc": "Også når din bedste ven laver frispark", "icon": "🤝",
      "type": "weekly", "rewards": [{ "skill": "idraet.fairplay", "xp": 25 }] },
    { "id": "rekord", "title": "Slå din egen rekord", "desc": "Løb, længdespring, kast eller planke — mål og notér", "icon": "📏",
      "type": "weekly", "rewards": [{ "skill": "idraet.atletik", "xp": 25 }, { "gold": 5 }] },
    { "id": "sjipning", "title": "Sjip 50 gange uden fejl", "desc": "0.–4. klasse: også baglæns hvis du tør!", "icon": "🪢",
      "type": "weekly", "grades": [0, 4], "rewards": [{ "skill": "idraet.bevaegelse", "xp": 20 }] }
  ],

  "badges": [
    { "id": "atlet", "name": "Atleten", "icon": "🤸", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "idraet", "level": 5 } },
    { "id": "idr20", "name": "20 idræts-quests", "icon": "⚽", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "idraet" }, "count": 20 } },
    { "id": "olympisk", "name": "Olympisk Ånd", "icon": "🏅", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "idraet" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "idrstreak", "name": "Idræts-streak", "icon": "🔥",
      "period": "week", "target": 2, "scope": { "module": "idraet" },
      "milestones": [4, 10, 25, 52] }
  ]
});
