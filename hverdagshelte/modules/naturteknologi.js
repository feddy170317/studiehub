/* HverdagsHelte-modul: Natur & Teknologi — nysgerrighed på verden.
   Faget natur/teknologi ligger i 1.–6. klasse → grades [1,6]. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "naturteknologi",
  "name": "Natur & Teknologi 🔬",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [1, 6],
  "description": "Nysgerrighed på naturen, små eksperimenter, teknik og rummet. Alt kan laves hjemme eller udenfor — ingen indkøb nødvendige.",

  "skills": [
    { "id": "natur", "name": "Natur & Teknologi", "icon": "🔬", "color": "#66d98c" },
    { "id": "natur.udenfor",     "name": "Naturen udenfor", "icon": "🌳", "color": "#81c784", "parent": "natur" },
    { "id": "natur.eksperiment", "name": "Eksperimenter",   "icon": "🧪", "color": "#4fc3f7", "parent": "natur" },
    { "id": "natur.teknik",      "name": "Teknik & maskiner", "icon": "⚙️", "color": "#ffb74d", "parent": "natur" },
    { "id": "natur.rummet",      "name": "Rummet",          "icon": "🚀", "color": "#9c6bff", "parent": "natur" }
  ],

  "quests": [
    { "id": "opdagelse", "title": "Gå på opdagelse i naturen — find 3 spændende ting", "desc": "Blade, insekter, sten, spor... fortæl hvad du fandt", "icon": "🔍",
      "type": "weekly", "rewards": [{ "skill": "natur.udenfor", "xp": 25 }, { "gold": 5 }] },
    { "id": "eksperiment", "title": "Lav et lille eksperiment hjemme", "desc": "F.eks. bagepulver + eddike, flyde/synke, regnbue i vandglas", "icon": "🧪",
      "type": "weekly", "rewards": [{ "skill": "natur.eksperiment", "xp": 30 }, { "gold": 10 }] },
    { "id": "hvorfor", "title": "Stil et hvorfor-spørgsmål og find svaret", "desc": "Hvorfor er himlen blå? Slå det op sammen med en voksen", "icon": "❓",
      "type": "weekly", "rewards": [{ "skill": "natur.eksperiment", "xp": 20 }] },
    { "id": "maane", "title": "Kig på månen eller stjernerne", "desc": "Find ét stjernebillede eller se hvilken fase månen er i", "icon": "🌙",
      "type": "weekly", "rewards": [{ "skill": "natur.rummet", "xp": 20 }, { "gold": 5 }] },
    { "id": "skil", "title": "Skil noget ad og se hvordan det virker", "desc": "3.–6. klasse: en gammel kuglepen, cykellygte... SPØRG FØRST!", "icon": "🔧",
      "type": "weekly", "grades": [3, 6], "rewards": [{ "skill": "natur.teknik", "xp": 30 }, { "gold": 10 }] },
    { "id": "fuglekig", "title": "Sæt navn på 3 fugle eller dyr du ser", "desc": "Brug en bog eller en app til at finde ud af hvad de hedder", "icon": "🦅",
      "type": "weekly", "rewards": [{ "skill": "natur.udenfor", "xp": 20 }] }
  ],

  "badges": [
    { "id": "forsker", "name": "Den lille Forsker", "icon": "🔬", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "natur", "level": 5 } },
    { "id": "opdagelsesrejsende", "name": "Opdagelsesrejsende", "icon": "🧭", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "natur.udenfor", "level": 3 } },
    { "id": "natur25", "name": "25 natur-quests", "icon": "🌿", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "naturteknologi" }, "count": 25 } },
    { "id": "galileo", "name": "Lille Galileo", "icon": "🔭", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "naturteknologi" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "naturstreak", "name": "Nysgerrig-streak", "icon": "🔥",
      "period": "week", "target": 2, "scope": { "module": "naturteknologi" },
      "milestones": [4, 10, 25, 52] }
  ]
});
