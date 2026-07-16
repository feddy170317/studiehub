/* HverdagsHelte-modul: Natur & Teknologi — nysgerrighed på verden.
   Faget natur/teknologi ligger i 1.–6. klasse → grades [1,6]. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "naturteknologi",
  "name": "Natur & Teknologi 🔬",
  "version": 2,
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
      "type": "weekly", "rewards": [{ "skill": "natur.udenfor", "xp": 20 }] },

    { "id": "quiz-nat-1", "title": "Quiz: Natur & Teknologi 1. klasse", "desc": "Dyr, årstider og naturen", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [1, 1],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvilket dyr lægger æg?", "answers": ["Høne", "Hund", "Ko", "Kat"] },
        { "q": "Hvad falder ned fra skyerne, når det regner?", "answers": ["Vand", "Sand", "Blade", "Sten"] },
        { "q": "Hvilken årstid kommer efter vinter?", "answers": ["Forår", "Sommer", "Efterår", "Jul"] },
        { "q": "Hvad skal planter bruge for at gro?", "answers": ["Vand og lys", "Kun mørke", "Slik", "Sten"] },
        { "q": "Hvilket dyr går i hi om vinteren?", "answers": ["Pindsvin", "Hund", "Hest", "Måge"] },
        { "q": "Hvad er solen?", "answers": ["En stjerne", "En planet", "En sky", "En måne"] },
        { "q": "Hvor bor en fisk?", "answers": ["I vandet", "På land", "I et træ", "I en hule"] },
        { "q": "Hvad smelter is til?", "answers": ["Vand", "Damp", "Sne", "Salt"] },
        { "q": "Hvilket dyr har otte ben?", "answers": ["Edderkop", "Myre", "Bille", "Flue"] },
        { "q": "Hvornår kan man bedst se stjernerne?", "answers": ["Om natten", "Om morgenen", "Midt på dagen", "Ved frokost"] },
        { "q": "Hvad hedder koens unge?", "answers": ["Kalv", "Føl", "Lam", "Killing"] },
        { "q": "Hvilken farve har de fleste blade om sommeren?", "answers": ["Grøn", "Rød", "Gul", "Brun"] }
      ] },
      "rewards": [{ "skill": "natur.udenfor", "xp": 20 }, { "gold": 5 }] },

    { "id": "quiz-nat-2", "title": "Quiz: Natur & Teknologi 2. klasse", "desc": "Insekter, vand og vejret", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [2, 2],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad hedder det, når vand bliver til damp?", "answers": ["Fordampning", "Frysning", "Regn", "Smeltning"] },
        { "q": "Hvilken planet bor vi på?", "answers": ["Jorden", "Mars", "Månen", "Venus"] },
        { "q": "Hvad spiser en larve mest?", "answers": ["Blade", "Kød", "Sten", "Brød"] },
        { "q": "Hvad bliver en larve til?", "answers": ["Sommerfugl", "Frø", "Fugl", "Bi"] },
        { "q": "Hvor mange ben har et insekt?", "answers": ["6", "8", "4", "10"] },
        { "q": "Hvad suger planten op gennem rødderne?", "answers": ["Vand", "Luft", "Lys", "Varme"] },
        { "q": "Hvornår er dagene længst?", "answers": ["Om sommeren", "Om vinteren", "Om efteråret", "De er altid ens"] },
        { "q": "Hvad hedder frosne regndråber, der falder som kugler?", "answers": ["Hagl", "Tåge", "Dug", "Torden"] },
        { "q": "Hvilket materiale laves af træer?", "answers": ["Papir", "Glas", "Metal", "Beton"] },
        { "q": "Hvad gør en magnet?", "answers": ["Tiltrækker jern", "Lyser", "Larmer", "Flyder"] },
        { "q": "Hvad hedder hestens unge?", "answers": ["Føl", "Kalv", "Lam", "Kid"] },
        { "q": "Hvorfor har vi nat og dag?", "answers": ["Jorden drejer om sig selv", "Solen slukker", "Månen lyser", "Skyerne dækker"] }
      ] },
      "rewards": [{ "skill": "natur.udenfor", "xp": 15 }, { "skill": "natur.eksperiment", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-nat-3", "title": "Quiz: Natur & Teknologi 3. klasse", "desc": "Kroppen, solsystemet og fotosyntese", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [3, 3],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad hedder processen, hvor planter laver ilt?", "answers": ["Fotosyntese", "Fordampning", "Forbrænding", "Fotografering"] },
        { "q": "Hvilket organ pumper blodet rundt?", "answers": ["Hjertet", "Lungerne", "Hjernen", "Maven"] },
        { "q": "Hvad hedder vores galakse?", "answers": ["Mælkevejen", "Andromeda", "Solsystemet", "Karlsvognen"] },
        { "q": "Hvilken tilstand har vand ved minus 5 grader?", "answers": ["Fast (is)", "Flydende", "Gas", "Damp"] },
        { "q": "Hvad bruger vi lungerne til?", "answers": ["At trække vejret", "At spise", "At tænke", "At pumpe blod"] },
        { "q": "Hvilket dyr er et pattedyr?", "answers": ["Delfin", "Haj", "Krokodille", "Ørn"] },
        { "q": "Hvad måler et termometer?", "answers": ["Temperatur", "Vægt", "Længde", "Tid"] },
        { "q": "Hvor mange planeter er der i solsystemet?", "answers": ["8", "9", "7", "10"] },
        { "q": "Hvad er genbrug?", "answers": ["At bruge materialer igen", "At smide alt ud", "At købe nyt", "At brænde affald"] },
        { "q": "Hvilken kraft trækker ting mod jorden?", "answers": ["Tyngdekraften", "Magnetisme", "Vindkraft", "Elektricitet"] },
        { "q": "Hvad lever en bi mest af?", "answers": ["Nektar fra blomster", "Græs", "Kød", "Bark"] },
        { "q": "Hvad er skelettets vigtigste opgave?", "answers": ["At holde kroppen oppe", "At fordøje mad", "At pumpe blod", "At lave ilt"] }
      ] },
      "rewards": [{ "skill": "natur.eksperiment", "xp": 15 }, { "skill": "natur.udenfor", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-nat-4", "title": "Quiz: Natur & Teknologi 4. klasse", "desc": "Fødekæder, strøm og planeter", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [4, 4],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad kaldes kæden 'græs → hare → ræv'?", "answers": ["En fødekæde", "En cyklus", "En familie", "Et kredsløb"] },
        { "q": "Hvilken planet er tættest på solen?", "answers": ["Merkur", "Venus", "Mars", "Jorden"] },
        { "q": "Hvilken gas er der mest af i luften?", "answers": ["Kvælstof", "Ilt", "CO2", "Brint"] },
        { "q": "Hvad kaldes dyr, der kun spiser planter?", "answers": ["Planteædere", "Rovdyr", "Altædere", "Insekter"] },
        { "q": "Hvad skal der til, for at en pære kan lyse?", "answers": ["Et lukket kredsløb", "Vand", "Varme", "En magnet"] },
        { "q": "Hvad hedder trinnet i vandets kredsløb fra hav til sky?", "answers": ["Fordampning", "Nedbør", "Frysning", "Sivning"] },
        { "q": "Hvilket metal tiltrækkes af en magnet?", "answers": ["Jern", "Guld", "Aluminium", "Kobber"] },
        { "q": "Hvad kendetegner et pattedyr?", "answers": ["Ungerne dier mælk", "Det lægger æg", "Det har skæl", "Det kan altid flyve"] },
        { "q": "Hvor lang tid tager Jordens tur rundt om solen?", "answers": ["Et år", "En måned", "En dag", "En uge"] },
        { "q": "I tordenvejr — hvad kommer først?", "answers": ["Lynet ses før tordenen høres", "Tordenen høres først", "De kommer altid samtidig", "Det er tilfældigt"] },
        { "q": "Hvad kaldes dyr uden rygrad?", "answers": ["Hvirvelløse dyr", "Pattedyr", "Krybdyr", "Padder"] },
        { "q": "Hvad gør et filter i et akvarium?", "answers": ["Renser vandet", "Fodrer fiskene", "Varmer vandet", "Lyser"] }
      ] },
      "rewards": [{ "skill": "natur.udenfor", "xp": 15 }, { "skill": "natur.teknik", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-nat-5", "title": "Quiz: Natur & Teknologi 5. klasse", "desc": "Energi, kroppen og Mars", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 5],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad er vedvarende energi?", "answers": ["Energi der ikke slipper op (sol, vind)", "Kul og olie", "Batterier", "Benzin"] },
        { "q": "Hvilken energiform har en bold på toppen af en bakke?", "answers": ["Beliggenhedsenergi", "Bevægelsesenergi", "Varmeenergi", "Lydenergi"] },
        { "q": "Hvad producerer en vindmølle?", "answers": ["Elektricitet", "Vind", "Varme direkte", "Benzin"] },
        { "q": "Hvad hedder det stof, der gør blade grønne?", "answers": ["Klorofyl", "Klor", "Karbon", "Kalk"] },
        { "q": "Hvor mange kamre har menneskets hjerte?", "answers": ["4", "2", "3", "6"] },
        { "q": "Hvad måles elektrisk spænding i?", "answers": ["Volt", "Watt", "Ampere", "Grader"] },
        { "q": "Hvilken planet kaldes 'den røde planet'?", "answers": ["Mars", "Venus", "Jupiter", "Saturn"] },
        { "q": "Hvad sker der ved forbrænding i kroppen?", "answers": ["Mad omdannes til energi", "Man fryser", "Blodet stopper", "Man holder op med at vokse"] },
        { "q": "Hvad er CO2?", "answers": ["En drivhusgas", "Rent ilt", "Et metal", "En vitamin"] },
        { "q": "Hvad bruges en lup til?", "answers": ["At forstørre små ting", "At måle vægt", "At varme", "At lyse"] },
        { "q": "Hvad kaldes månen, når den vokser?", "answers": ["Tiltagende", "Aftagende", "Fuldmåne", "Formørket"] },
        { "q": "Hvilket organ renser blodet?", "answers": ["Nyrerne", "Lungerne", "Hjertet", "Huden"] }
      ] },
      "rewards": [{ "skill": "natur.teknik", "xp": 15 }, { "skill": "natur.eksperiment", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-nat-6", "title": "Quiz: Natur & Teknologi 6. klasse", "desc": "Atomer, økosystemer og energi", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [6, 6],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad hedder de mindste byggesten i alle stoffer?", "answers": ["Atomer", "Celler", "Gener", "Krystaller"] },
        { "q": "Hvilken gas optager planter fra luften?", "answers": ["CO2", "Ilt", "Kvælstof", "Brint"] },
        { "q": "Hvad er en art?", "answers": ["Dyr/planter der kan få afkom sammen", "Alle dyr i en skov", "En dyrefamilie", "Et enkelt dyr"] },
        { "q": "Hvad viser et kompas?", "answers": ["Retning (nord)", "Temperatur", "Højde", "Tid"] },
        { "q": "Hvad er fordelen ved solceller?", "answers": ["De laver strøm uden CO2-udslip", "De virker bedst om natten", "De bruger benzin", "De er altid billigst"] },
        { "q": "Hvor lang tid tager månens tur rundt om Jorden cirka?", "answers": ["En måned", "Et år", "En dag", "En time"] },
        { "q": "Hvad er et økosystem?", "answers": ["Dyr, planter og miljø der påvirker hinanden", "Kun dyrene i et område", "En dyrepark", "Et drivhus"] },
        { "q": "Hvad sker der med vandstanden ved ebbe?", "answers": ["Den falder", "Den stiger", "Den er konstant", "Den fryser"] },
        { "q": "Hvilket materiale leder strøm bedst?", "answers": ["Kobber", "Træ", "Glas", "Gummi"] },
        { "q": "Hvad er pubertet?", "answers": ["Kroppens udvikling fra barn til voksen", "En sygdom", "En muskel", "Et stof i maden"] },
        { "q": "Hvad kaldes energien gemt i kul og olie?", "answers": ["Fossil energi", "Vedvarende energi", "Atomkraft", "Vindenergi"] },
        { "q": "Hvor stor er tyngdeaccelerationen på Jorden cirka?", "answers": ["9,8 m/s²", "1,6 m/s²", "98 m/s²", "0,98 m/s²"] }
      ] },
      "rewards": [{ "skill": "natur.eksperiment", "xp": 15 }, { "skill": "natur.teknik", "xp": 15 }, { "gold": 5 }] }
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
