/* HverdagsHelte-modul: Geografi — folkeskolefag 7.-9. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "geografi",
  "name": "Geografi 🌍",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [7, 9],
  "description": "Kort og lande, naturgeografi, kulturgeografi og klima. Udtræksfag til 9.-klasses-prøven.",

  "skills": [
    { "id": "geografi", "name": "Geografi", "icon": "🌍", "color": "#4fc3f7" },
    { "id": "geografi.kort",      "name": "Kort & lande",     "icon": "🗺️", "color": "#ffb74d", "parent": "geografi" },
    { "id": "geografi.natur",     "name": "Naturgeografi",    "icon": "🌋", "color": "#e05a6c", "parent": "geografi" },
    { "id": "geografi.mennesker", "name": "Kulturgeografi",   "icon": "🏙️", "color": "#ba68c8", "parent": "geografi" },
    { "id": "geografi.klima",     "name": "Klima & bæredygtighed", "icon": "♻️", "color": "#81c784", "parent": "geografi" }
  ],

  "quests": [
    { "id": "nyhedskort", "title": "Find ugens nyhedssted på et kort", "desc": "Vælg en udenlandsk nyhed — find stedet og fortæl 3 fakta om landet", "icon": "📰",
      "type": "weekly", "rewards": [{ "skill": "geografi.kort", "xp": 25 }, { "gold": 5 }] },
    { "id": "landetraening", "title": "Øv lande og hovedstæder i 10 minutter", "desc": "F.eks. Seterra eller et atlas", "icon": "🗺️",
      "type": "daily", "days": [1, 2, 3, 4, 5], "rewards": [{ "skill": "geografi.kort", "xp": 15 }] },
    { "id": "vejrlog", "title": "Følg vejret i 5 dage og forklar hvorfor", "desc": "Notér tryk, vind og nedbør — hvad hænger sammen?", "icon": "🌦️",
      "type": "weekly", "rewards": [{ "skill": "geografi.natur", "xp": 30 }, { "gold": 5 }] },
    { "id": "klimasnak", "title": "Find 3 ting jeres familie kan gøre mere bæredygtigt", "desc": "Og prøv mindst én af dem i denne uge", "icon": "♻️",
      "type": "weekly", "rewards": [{ "skill": "geografi.klima", "xp": 25 }] },

    { "id": "quiz-geo-7", "title": "Quiz: Geografi 7. klasse", "desc": "Kort, plader og klimazoner", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvor mange verdensdele regner man normalt med?", "answers": ["7", "5", "6", "9"] },
        { "q": "Hvad kan bevægelser i jordens plader skabe?", "answers": ["Jordskælv og vulkaner", "Regnbuer", "Tidevand", "Vind alene"] },
        { "q": "Hvad er en vulkan?", "answers": ["Et sted hvor magma kan komme op", "Et vandfald", "En gletsjer", "En ørkendal"] },
        { "q": "Hvilken klimazone ligger Danmark i?", "answers": ["Den tempererede", "Den tropiske", "Polarzonen", "Subtroperne"] },
        { "q": "Hvilken flod regnes ofte som verdens længste?", "answers": ["Nilen", "Donau", "Gudenåen", "Rhinen"] },
        { "q": "Hvad er en fjord?", "answers": ["En smal havarm", "En sø", "Et bjerg", "En flodmunding altid"] },
        { "q": "Hvad hedder Australiens hovedstad?", "answers": ["Canberra", "Sydney", "Melbourne", "Perth"] },
        { "q": "Hvad viser signaturforklaringen på et kort?", "answers": ["Hvad farver og symboler betyder", "Vejrudsigten", "Landets historie", "Afstanden til solen"] },
        { "q": "Hvad hedder breddegrad 0?", "answers": ["Ækvator", "Nulmeridianen", "Polarcirklen", "Datolinjen"] },
        { "q": "Hvilket verdenshav er størst?", "answers": ["Stillehavet", "Atlanterhavet", "Det Indiske Ocean", "Ishavet"] }
      ] },
      "rewards": [{ "skill": "geografi.kort", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-geo-8", "title": "Quiz: Geografi 8. klasse", "desc": "Befolkning, erhverv og vejr", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad er urbanisering?", "answers": ["At folk flytter til byerne", "At bygge motorveje", "At dyrke mere jord", "At rejse på ferie"] },
        { "q": "Hvad bringer et lavtryk typisk?", "answers": ["Skyer og nedbør", "Tørke", "Altid klart vejr", "Nordlys"] },
        { "q": "Hvad kaldes erhverv som landbrug og fiskeri?", "answers": ["Primære erhverv", "Sekundære erhverv", "Tertiære erhverv", "Frie erhverv"] },
        { "q": "Hvor stor en del af Jordens overflade er dækket af vand?", "answers": ["Cirka 70 %", "Cirka 50 %", "Cirka 30 %", "Cirka 90 %"] },
        { "q": "Hvad er en megaby?", "answers": ["En by med over 10 mio. indbyggere", "En hovedstad", "En by med metro", "En gammel by"] },
        { "q": "Hvilket land har flest indbyggere?", "answers": ["Indien", "Kina", "USA", "Rusland"] },
        { "q": "Hvad kaldes industri og produktion?", "answers": ["Sekundære erhverv", "Primære erhverv", "Tertiære erhverv", "Kvartære erhverv"] },
        { "q": "Hvad måler BNP?", "answers": ["Et lands samlede produktion", "Befolkningens højde", "Årlig nedbør", "Bjergenes højde"] },
        { "q": "Hvorfor regner det ofte meget på bjergsider?", "answers": ["Luften tvinges op og afkøles", "Bjerge tiltrækker skyer magnetisk", "Det er koldere om natten", "Det gør det ikke"] },
        { "q": "Hvad er migration?", "answers": ["At mennesker flytter mellem områder eller lande", "Kun fugletræk", "En vejrtype", "En jordbundstype"] }
      ] },
      "rewards": [{ "skill": "geografi.mennesker", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-geo-9", "title": "Quiz: Geografi 9. klasse", "desc": "Klima, globalisering og bæredygtighed — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad er drivhuseffekten?", "answers": ["Gasser holder på varmen i atmosfæren", "Solen bliver varmere", "Jorden nærmer sig solen", "Ozonlaget vokser"] },
        { "q": "Hvilken gas bidrager mest til menneskeskabt opvarmning?", "answers": ["CO2", "Ilt", "Kvælstof", "Helium"] },
        { "q": "Hvad er bæredygtighed?", "answers": ["At dække behov uden at ødelægge det for kommende generationer", "At bygge stærke huse", "At spare penge op", "Kun at rejse mindre"] },
        { "q": "Hvad er globalisering?", "answers": ["At verden bindes tættere sammen gennem handel og kultur", "At Jorden bliver større", "Kun turisme", "En klimazone"] },
        { "q": "Hvad viser en befolkningspyramide?", "answers": ["Alders- og kønsfordelingen", "Bjerges højde", "Byernes størrelse", "Temperaturer over året"] },
        { "q": "Hvad sker der med havniveauet ved global opvarmning?", "answers": ["Det stiger", "Det falder", "Det er uændret", "Det fryser til"] },
        { "q": "Hvad er vedvarende energikilder?", "answers": ["Sol, vind og vand", "Kul og olie", "Gas og benzin", "Kun atomkraft"] },
        { "q": "Hvad kaldes flytning for at finde arbejde i et andet land?", "answers": ["Arbejdsmigration", "Turisme", "Urbanisering", "Kolonisering"] },
        { "q": "Hvad er den demografiske transition?", "answers": ["Overgang fra høje til lave fødsels- og dødsrater", "En flodtype", "Et valgsystem", "En klimamodel"] },
        { "q": "Hvilket land er størst i areal?", "answers": ["Rusland", "Kina", "Canada", "USA"] }
      ] },
      "rewards": [{ "skill": "geografi.klima", "xp": 25 }, { "skill": "geografi.mennesker", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "verdensborger", "name": "Verdensborgeren", "icon": "🌍", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "geografi", "level": 5 } },
    { "id": "geo20", "name": "20 geografi-quests", "icon": "🗺️", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "geografi" }, "count": 20 } },
    { "id": "magellan", "name": "Magellan", "icon": "🧭", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "geografi" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "geostreak", "name": "Geografi-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "geografi" },
      "milestones": [4, 10, 25, 52] }
  ]
});
