/* HverdagsHelte-modul: Biologi — folkeskolefag 7.-9. klasse (Fælles Mål). */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "biologi",
  "name": "Biologi 🧬",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [7, 9],
  "description": "Celler, kroppen, økologi og genetik. Udtræksfag til 9.-klasses-prøven.",

  "skills": [
    { "id": "biologi", "name": "Biologi", "icon": "🧬", "color": "#66d98c" },
    { "id": "biologi.celler",  "name": "Celler & mikroliv",   "icon": "🔬", "color": "#4fc3f7", "parent": "biologi" },
    { "id": "biologi.krop",    "name": "Kroppen",             "icon": "🫀", "color": "#e05a6c", "parent": "biologi" },
    { "id": "biologi.natur",   "name": "Natur & økologi",     "icon": "🌿", "color": "#81c784", "parent": "biologi" },
    { "id": "biologi.genetik", "name": "Genetik & evolution", "icon": "🧬", "color": "#ba68c8", "parent": "biologi" }
  ],

  "quests": [
    { "id": "artsjagt", "title": "Bestem 5 arter på en tur", "desc": "Planter, fugle eller insekter — brug en app eller bog", "icon": "🌿",
      "type": "weekly", "rewards": [{ "skill": "biologi.natur", "xp": 25 }, { "gold": 5 }] },
    { "id": "pulstest", "title": "Mål din puls i hvile og efter løb — forklar forskellen", "desc": "Hvad sker der i kroppen, når du bevæger dig?", "icon": "🫀",
      "type": "weekly", "rewards": [{ "skill": "biologi.krop", "xp": 25 }] },
    { "id": "mikroverden", "title": "Undersøg noget helt tæt på", "desc": "Lup eller telefonkamera på max zoom — beskriv hvad du ser", "icon": "🔬",
      "type": "weekly", "rewards": [{ "skill": "biologi.celler", "xp": 25 }] },
    { "id": "biodok", "title": "Se en naturdokumentar og fortæl 3 ting", "desc": "F.eks. Attenborough — hvad overraskede dig?", "icon": "🎬",
      "type": "weekly", "rewards": [{ "skill": "biologi.natur", "xp": 20 }, { "gold": 5 }] },

    { "id": "quiz-bio-7", "title": "Quiz: Biologi 7. klasse", "desc": "Celler, fotosyntese og fødekæder", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad er alle levende organismer opbygget af?", "answers": ["Celler", "Kun atomkerner", "Kun vand", "Knogler"] },
        { "q": "Hvad producerer planter ved fotosyntese?", "answers": ["Sukker og ilt", "Kul og CO2", "Protein af jord", "Kun vand"] },
        { "q": "Hvad kaldes dyr, der spiser både planter og kød?", "answers": ["Altædere", "Planteædere", "Rovdyr", "Nedbrydere"] },
        { "q": "Hvad er en fødekæde?", "answers": ["Hvem der spiser hvem i naturen", "En kæde af knogler", "En madopskrift", "Vandets kredsløb"] },
        { "q": "Hvad kaldes cellens 'kraftværker'?", "answers": ["Mitokondrier", "Ribosomer", "Cellekernen", "Vakuoler"] },
        { "q": "Hvad gør nedbrydere som svampe og bakterier?", "answers": ["Omsætter dødt materiale", "Jager dyr", "Laver fotosyntese", "Bygger reder"] },
        { "q": "Hvad indeholder cellekernen?", "answers": ["DNA", "Ilt", "Mavesyre", "Klorofyl"] },
        { "q": "Hvad er et økosystem?", "answers": ["Organismer og deres miljø i samspil", "Kun planterne", "En zoologisk have", "Et laboratorium"] },
        { "q": "Hvilken proces frigiver energi fra sukker i cellerne?", "answers": ["Respiration", "Fotosyntese", "Fordampning", "Osmose"] },
        { "q": "Hvad kaldes variationen af arter i naturen?", "answers": ["Biodiversitet", "Bioteknologi", "Biografi", "Biosfære"] }
      ] },
      "rewards": [{ "skill": "biologi.celler", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-bio-8", "title": "Quiz: Biologi 8. klasse", "desc": "Kroppen: fordøjelse, blod og immunforsvar", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvor optages næringen fra maden primært?", "answers": ["I tyndtarmen", "I mavesækken", "I spiserøret", "I tyktarmen"] },
        { "q": "Hvad transporterer ilt i blodet?", "answers": ["Røde blodlegemer", "Hvide blodlegemer", "Blodplader", "Plasma alene"] },
        { "q": "Hvad gør de hvide blodlegemer?", "answers": ["Bekæmper infektioner", "Transporterer ilt", "Størkner blodet", "Producerer hormoner"] },
        { "q": "Hvad hedder kroppens arvemateriale?", "answers": ["DNA", "ATP", "CO2", "H2O"] },
        { "q": "Hvilket organ producerer insulin?", "answers": ["Bugspytkirtlen", "Leveren", "Nyrerne", "Milten"] },
        { "q": "Hvad gør enzymer i fordøjelsen?", "answers": ["Nedbryder maden kemisk", "Varmer maden op", "Farver maden", "Transporterer blodet"] },
        { "q": "Hvad er et gen?", "answers": ["Et stykke DNA med opskrift på et protein", "En celletype", "Et organ", "En muskel"] },
        { "q": "Hvad sker der ved vaccination?", "answers": ["Immunforsvaret lærer at genkende smitstoffet", "Man får sygdommen fuldt ud", "Blodet udskiftes", "Generne ændres"] },
        { "q": "Hvor sker gasudvekslingen i lungerne?", "answers": ["I alveolerne", "I luftrøret", "I næsen", "I mellemgulvet"] },
        { "q": "Hvad bruger musklerne til at arbejde?", "answers": ["Ilt og sukker", "Kun vand", "Kun salt", "Lys"] }
      ] },
      "rewards": [{ "skill": "biologi.krop", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-bio-9", "title": "Quiz: Biologi 9. klasse", "desc": "Genetik og evolution — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvem er kendt for evolutionsteorien?", "answers": ["Charles Darwin", "Isaac Newton", "Albert Einstein", "Niels Bohr"] },
        { "q": "Hvad er naturlig selektion?", "answers": ["De bedst tilpassede overlever og får afkom", "Alle overlever lige godt", "Mennesker udvælger dyrene", "Tilfældig udryddelse"] },
        { "q": "Hvor mange kromosomer har et menneske normalt?", "answers": ["46", "23", "44", "48"] },
        { "q": "Hvad er en mutation?", "answers": ["En ændring i DNA'et", "Altid en sygdom", "En celledeling", "Et protein"] },
        { "q": "Hvad betyder det, at et gen er dominant?", "answers": ["Det slår igennem, selv i enkelt dosis", "Det er altid skjult", "Det findes kun hos mænd", "Det er sygdomsfremkaldende"] },
        { "q": "Hvad er en GMO?", "answers": ["En genmodificeret organisme", "En grøn miljøorganisation", "En gødningstype", "Et vitamin"] },
        { "q": "Hvad viser et stamtræ i genetik?", "answers": ["Nedarvning af egenskaber i en familie", "Skovens træer", "Fødekæder", "Celledeling"] },
        { "q": "Hvorfor er kvælstof vigtigt i naturen?", "answers": ["Det er byggesten i proteiner", "Det er kun giftigt", "Det laver ilt", "Det har ingen rolle"] },
        { "q": "Hvad kaldes en befrugtet ægcelle?", "answers": ["En zygote", "En gamet", "En neuron", "Et enzym"] },
        { "q": "Hvad kaldes en art, der er ved at forsvinde?", "answers": ["En truet art", "En tam art", "En invasiv art", "En fossil art"] }
      ] },
      "rewards": [{ "skill": "biologi.genetik", "xp": 25 }, { "skill": "biologi.natur", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "biolog", "name": "Den unge Biolog", "icon": "🧬", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "biologi", "level": 5 } },
    { "id": "bio20", "name": "20 biologi-quests", "icon": "🌿", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "biologi" }, "count": 20 } },
    { "id": "darwin", "name": "Darwin", "icon": "🐢", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "biologi" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "biostreak", "name": "Biologi-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "biologi" },
      "milestones": [4, 10, 25, 52] }
  ]
});
