/* HverdagsHelte-modul: Matematik — subskills efter webmatematik.dk's emneopdeling (0.–9. kl.).
   Quests er sat til start-3.-klasse; de avancerede (brøker, algebra, statistik) ligger klar
   som inaktive og slås til efterhånden som klassetrinnet stiger. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "matematik",
  "name": "Matematik 🔢",
  "version": 4,
  "author": "Frederik",
  "category": "skole",
  "grades": [0, 9],
  "description": "Subskills dækker hele grundskolen (jf. webmatematik.dk): talforståelse, de fire regnearter, brøker/procent, geometri, måling, algebra, statistik og problemregning. Slå quests til/fra efter klassetrin.",

  "skills": [
    { "id": "matematik", "name": "Matematik", "icon": "🔢", "color": "#4fc3f7" },
    { "id": "matematik.tal",           "name": "Tal & talforståelse",       "icon": "💯", "color": "#4fc3f7", "parent": "matematik" },
    { "id": "matematik.plusminus",     "name": "Plus & minus",              "icon": "➕", "color": "#81c784", "parent": "matematik" },
    { "id": "matematik.gangedivision", "name": "Gange & division",          "icon": "✖️", "color": "#ffb74d", "parent": "matematik" },
    { "id": "matematik.broker",        "name": "Brøker & procent",          "icon": "🍕", "color": "#ff8a65", "parent": "matematik" },
    { "id": "matematik.geometri",      "name": "Geometri & former",         "icon": "📐", "color": "#ba68c8", "parent": "matematik" },
    { "id": "matematik.maaling",       "name": "Måling, tid & penge",       "icon": "⏰", "color": "#f06292", "parent": "matematik" },
    { "id": "matematik.algebra",       "name": "Algebra & ligninger",       "icon": "🧮", "color": "#9c6bff", "parent": "matematik" },
    { "id": "matematik.statistik",     "name": "Statistik & sandsynlighed", "icon": "📊", "color": "#66d98c", "parent": "matematik" },
    { "id": "matematik.problem",       "name": "Problemregning",            "icon": "🧩", "color": "#ffd54f", "parent": "matematik" }
  ],

  "quests": [
    { "id": "tabel10", "title": "Øv gangetabeller i 10 minutter", "desc": "På papir, med kort eller på nettet", "icon": "✖️",
      "type": "daily", "days": [1, 2, 3, 4, 5], "grades": [1, 9], "rewards": [{ "skill": "matematik.gangedivision", "xp": 20 }] },
    { "id": "plusside", "title": "Én side plus- og minusstykker", "desc": "", "icon": "➕",
      "type": "daily", "days": [1, 2, 3, 4, 5], "rewards": [{ "skill": "matematik.plusminus", "xp": 20 }] },
    { "id": "klokken", "title": "Læs klokken når en voksen spørger", "desc": "Både hel, halv og kvart", "icon": "⏰",
      "type": "daily", "rewards": [{ "skill": "matematik.maaling", "xp": 10 }] },
    { "id": "regnehistorie", "title": "Regn en regnehistorie og forklar den", "desc": "En tekstopgave — forklar hvordan du løste den", "icon": "🧩",
      "type": "weekly", "rewards": [{ "skill": "matematik.problem", "xp": 30 }, { "gold": 10 }] },
    { "id": "former", "title": "Find og tegn 5 former derhjemme", "desc": "Firkanter, trekanter, cirkler — mål siderne", "icon": "📐",
      "type": "weekly", "rewards": [{ "skill": "matematik.geometri", "xp": 30 }, { "gold": 10 }] },
    { "id": "lommepenge", "title": "Tæl dine penge og læg et lille budget", "desc": "Hvor meget har du? Hvad sparer du op til?", "icon": "🪙",
      "type": "weekly", "rewards": [{ "skill": "matematik.maaling", "xp": 25 }, { "gold": 10 }] },
    { "id": "brokside", "title": "Én side brøker eller procent", "desc": "4.–9. klasse", "icon": "🍕",
      "type": "daily", "days": [1, 2, 3, 4, 5], "active": false, "grades": [4, 9], "rewards": [{ "skill": "matematik.broker", "xp": 25 }] },
    { "id": "ligninger", "title": "Løs ligninger på webmatematik.dk", "desc": "7.–9. klasse: webmatematik.dk/lektioner/7-9-klasse", "icon": "🧮",
      "type": "weekly", "active": false, "grades": [7, 9], "rewards": [{ "skill": "matematik.algebra", "xp": 40 }, { "gold": 15 }] },
    { "id": "statistik", "title": "Lav en lille undersøgelse derhjemme", "desc": "6.–9. klasse: saml data, lav et diagram, fortæl hvad det viser", "icon": "📊",
      "type": "weekly", "active": false, "grades": [6, 9], "rewards": [{ "skill": "matematik.statistik", "xp": 40 }, { "gold": 15 }] },

    { "id": "quiz-mat-0", "title": "Quiz: Matematik 0. klasse", "desc": "Tal, tælle og former", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [0, 0],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad kommer efter 7?", "answers": ["8", "6", "9", "10"] },
        { "q": "Hvor mange ben har en hund?", "answers": ["4", "2", "3", "6"] },
        { "q": "2 + 1 = ?", "answers": ["3", "2", "4", "5"] },
        { "q": "Hvilket tal er mindst?", "answers": ["1", "5", "9", "3"] },
        { "q": "3 + 2 = ?", "answers": ["5", "4", "6", "3"] },
        { "q": "Hvor mange fingre har du på én hånd?", "answers": ["5", "4", "10", "6"] },
        { "q": "Hvad kommer lige før 5?", "answers": ["4", "6", "3", "2"] },
        { "q": "4 − 1 = ?", "answers": ["3", "4", "2", "5"] },
        { "q": "Hvor mange hjørner har en trekant?", "answers": ["3", "4", "2", "5"] },
        { "q": "5 + 5 = ?", "answers": ["10", "9", "11", "8"] },
        { "q": "Hvilken form er helt rund?", "answers": ["Cirkel", "Firkant", "Trekant", "Stjerne"] },
        { "q": "2 + 2 = ?", "answers": ["4", "3", "5", "6"] }
      ] },
      "rewards": [{ "skill": "matematik.tal", "xp": 20 }, { "skill": "matematik.geometri", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-mat-1", "title": "Quiz: Matematik 1. klasse", "desc": "Plus og minus til 20", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [1, 1],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "6 + 3 = ?", "answers": ["9", "8", "10", "7"] },
        { "q": "10 − 4 = ?", "answers": ["6", "5", "7", "4"] },
        { "q": "7 + 7 = ?", "answers": ["14", "13", "15", "12"] },
        { "q": "Hvad er halvdelen af 10?", "answers": ["5", "4", "6", "2"] },
        { "q": "12 − 5 = ?", "answers": ["7", "6", "8", "5"] },
        { "q": "Hvilket tal er størst?", "answers": ["41", "14", "24", "32"] },
        { "q": "8 + 5 = ?", "answers": ["13", "12", "14", "11"] },
        { "q": "Hvad kommer efter 19?", "answers": ["20", "18", "21", "29"] },
        { "q": "15 − 6 = ?", "answers": ["9", "8", "10", "7"] },
        { "q": "4 + 4 + 4 = ?", "answers": ["12", "8", "16", "10"] },
        { "q": "Hvor mange sider har en firkant?", "answers": ["4", "3", "5", "6"] },
        { "q": "9 + 6 = ?", "answers": ["15", "14", "16", "13"] }
      ] },
      "rewards": [{ "skill": "matematik.plusminus", "xp": 20 }, { "skill": "matematik.tal", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-mat-2", "title": "Quiz: Matematik 2. klasse", "desc": "Regning til 100, de små tabeller og klokken", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [2, 2],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "23 + 10 = ?", "answers": ["33", "32", "34", "43"] },
        { "q": "2 × 5 = ?", "answers": ["10", "7", "12", "15"] },
        { "q": "46 − 20 = ?", "answers": ["26", "24", "28", "66"] },
        { "q": "5 × 5 = ?", "answers": ["25", "20", "30", "10"] },
        { "q": "Klokken er halv tre. Hvad viser den om en halv time?", "answers": ["Tre", "Halv fire", "To", "Kvart i tre"] },
        { "q": "10 × 3 = ?", "answers": ["30", "13", "33", "20"] },
        { "q": "37 + 8 = ?", "answers": ["45", "44", "46", "43"] },
        { "q": "2 × 8 = ?", "answers": ["16", "10", "18", "14"] },
        { "q": "60 − 25 = ?", "answers": ["35", "45", "30", "40"] },
        { "q": "Hvor mange 10'ere er der i 70?", "answers": ["7", "6", "8", "10"] },
        { "q": "5 × 4 = ?", "answers": ["20", "15", "25", "9"] },
        { "q": "Hvad koster 2 is til 12 kr. stykket?", "answers": ["24 kr.", "22 kr.", "26 kr.", "12 kr."] }
      ] },
      "rewards": [{ "skill": "matematik.plusminus", "xp": 15 }, { "skill": "matematik.gangedivision", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-mat-3", "title": "Quiz: Matematik 3. klasse", "desc": "Gangetabeller, division og større tal", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [3, 3],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "7 × 8 = ?", "answers": ["56", "54", "64", "48"] },
        { "q": "6 × 7 = ?", "answers": ["42", "36", "48", "44"] },
        { "q": "27 ÷ 3 = ?", "answers": ["9", "8", "7", "6"] },
        { "q": "Hvad er halvdelen af 48?", "answers": ["24", "22", "26", "28"] },
        { "q": "9 × 4 = ?", "answers": ["36", "32", "40", "38"] },
        { "q": "125 + 75 = ?", "answers": ["200", "190", "210", "175"] },
        { "q": "40 ÷ 5 = ?", "answers": ["8", "7", "9", "6"] },
        { "q": "Klokken er kvart over 7. Hvor mange minutter er der til halv 8?", "answers": ["15", "10", "20", "30"] },
        { "q": "8 × 8 = ?", "answers": ["64", "56", "72", "62"] },
        { "q": "302 − 150 = ?", "answers": ["152", "148", "162", "252"] },
        { "q": "Hvad er en fjerdedel af 20?", "answers": ["5", "4", "6", "10"] },
        { "q": "6 × 9 = ?", "answers": ["54", "56", "45", "63"] }
      ] },
      "rewards": [{ "skill": "matematik.gangedivision", "xp": 20 }, { "skill": "matematik.plusminus", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-mat-4", "title": "Quiz: Matematik 4. klasse", "desc": "Brøker, decimaltal og areal", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [4, 4],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "12 × 11 = ?", "answers": ["132", "121", "122", "144"] },
        { "q": "Hvad er 1/2 + 1/4?", "answers": ["3/4", "2/6", "1/6", "2/4"] },
        { "q": "3,5 + 2,7 = ?", "answers": ["6,2", "5,2", "6,1", "5,7"] },
        { "q": "144 ÷ 12 = ?", "answers": ["12", "11", "13", "14"] },
        { "q": "Hvad er omkredsen af et kvadrat med siden 6 cm?", "answers": ["24 cm", "36 cm", "12 cm", "18 cm"] },
        { "q": "25 × 4 = ?", "answers": ["100", "90", "110", "75"] },
        { "q": "Hvilket tal er størst?", "answers": ["0,9", "0,45", "0,09", "0,109"] },
        { "q": "Hvad er 3/4 af 40?", "answers": ["30", "28", "32", "20"] },
        { "q": "7,0 − 2,4 = ?", "answers": ["4,6", "4,4", "5,6", "5,4"] },
        { "q": "56 ÷ 8 = ?", "answers": ["7", "6", "8", "9"] },
        { "q": "Hvor mange minutter er 2½ time?", "answers": ["150", "120", "130", "250"] },
        { "q": "Hvad er arealet af et rektangel på 5 × 8 cm?", "answers": ["40 cm²", "26 cm²", "45 cm²", "13 cm²"] }
      ] },
      "rewards": [{ "skill": "matematik.broker", "xp": 15 }, { "skill": "matematik.geometri", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-mat-5", "title": "Quiz: Matematik 5. klasse", "desc": "Procent, negative tal og gennemsnit", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 5],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad er 25 % af 80?", "answers": ["20", "25", "15", "40"] },
        { "q": "2/3 af 18 = ?", "answers": ["12", "9", "6", "15"] },
        { "q": "0,75 skrevet som brøk er…", "answers": ["3/4", "1/4", "7/5", "3/5"] },
        { "q": "−3 + 8 = ?", "answers": ["5", "−5", "11", "−11"] },
        { "q": "Hvad er gennemsnittet af 4, 6 og 8?", "answers": ["6", "5", "7", "9"] },
        { "q": "1,2 × 10 = ?", "answers": ["12", "1,20", "120", "2,2"] },
        { "q": "Hvor mange grader er en ret vinkel?", "answers": ["90°", "45°", "180°", "100°"] },
        { "q": "3/5 + 1/5 = ?", "answers": ["4/5", "4/10", "3/25", "2/5"] },
        { "q": "Hvad er 10 % af 350?", "answers": ["35", "30", "45", "3,5"] },
        { "q": "17 × 100 = ?", "answers": ["1700", "170", "17000", "1070"] },
        { "q": "Hvilket tal er mindst?", "answers": ["−7", "−2", "0", "3"] },
        { "q": "Hvad er halvdelen af 3,6?", "answers": ["1,8", "1,6", "1,3", "2,8"] }
      ] },
      "rewards": [{ "skill": "matematik.broker", "xp": 20 }, { "skill": "matematik.tal", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-mat-6", "title": "Quiz: Matematik 6. klasse", "desc": "Procent, forhold, rumfang og enkle ligninger", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [6, 6],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad er 15 % af 200?", "answers": ["30", "25", "35", "15"] },
        { "q": "Løs: x + 7 = 15", "answers": ["x = 8", "x = 7", "x = 9", "x = 22"] },
        { "q": "Rumfanget af en kasse på 2 × 3 × 4 cm?", "answers": ["24 cm³", "9 cm³", "20 cm³", "12 cm³"] },
        { "q": "3/4 skrevet i procent er…", "answers": ["75 %", "34 %", "43 %", "80 %"] },
        { "q": "Æbler og pærer i forholdet 2:3. Der er 8 æbler — hvor mange pærer?", "answers": ["12", "10", "16", "6"] },
        { "q": "0,4 × 0,5 = ?", "answers": ["0,2", "2,0", "0,02", "0,9"] },
        { "q": "Vinklerne i en trekant giver tilsammen…", "answers": ["180°", "360°", "90°", "270°"] },
        { "q": "Hvad er 2³?", "answers": ["8", "6", "9", "23"] },
        { "q": "Punktet (3, 5) — hvad er x-koordinaten?", "answers": ["3", "5", "8", "35"] },
        { "q": "120 ÷ 0,5 = ?", "answers": ["240", "60", "24", "600"] },
        { "q": "1/3 som decimaltal er cirka…", "answers": ["0,33", "0,3", "0,13", "3,1"] },
        { "q": "En vare til 250 kr. sættes ned med 20 %. Ny pris?", "answers": ["200 kr.", "230 kr.", "210 kr.", "50 kr."] }
      ] },
      "rewards": [{ "skill": "matematik.broker", "xp": 15 }, { "skill": "matematik.algebra", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-mat-7", "title": "Quiz: Matematik 7. klasse", "desc": "Ligninger, reduktion og sandsynlighed", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Løs: 3x = 21", "answers": ["x = 7", "x = 6", "x = 18", "x = 63"] },
        { "q": "Reducér: 2a + 3a", "answers": ["5a", "6a", "5a²", "a⁵"] },
        { "q": "Hvad er 30 % af 150?", "answers": ["45", "50", "35", "30"] },
        { "q": "Løs: 2x − 4 = 10", "answers": ["x = 7", "x = 3", "x = 6", "x = 14"] },
        { "q": "Sandsynligheden for at slå en 6'er med én terning?", "answers": ["1/6", "1/3", "1/2", "6/1"] },
        { "q": "(−4) × (−5) = ?", "answers": ["20", "−20", "9", "−9"] },
        { "q": "Hvad er 5² + 3²?", "answers": ["34", "64", "16", "28"] },
        { "q": "En cykel til 3.000 kr. stiger 10 %. Ny pris?", "answers": ["3.300 kr.", "3.100 kr.", "3.030 kr.", "3.500 kr."] },
        { "q": "Gang parentesen ud: 4(x + 2)", "answers": ["4x + 8", "4x + 2", "4x + 6", "8x"] },
        { "q": "Hvad er medianen af 2, 5, 7, 9, 11?", "answers": ["7", "5", "9", "6,8"] },
        { "q": "10⁴ = ?", "answers": ["10.000", "1.000", "100.000", "40"] },
        { "q": "Løs: x/4 = 6", "answers": ["x = 24", "x = 10", "x = 2", "x = 1,5"] }
      ] },
      "rewards": [{ "skill": "matematik.algebra", "xp": 20 }, { "skill": "matematik.statistik", "xp": 10 }, { "gold": 10 }] },

    { "id": "quiz-mat-8", "title": "Quiz: Matematik 8. klasse", "desc": "Ligninger, Pythagoras og funktioner", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Løs: 5x + 3 = 2x + 12", "answers": ["x = 3", "x = 5", "x = 4", "x = 15"] },
        { "q": "En retvinklet trekant har kateter 3 og 4. Hypotenusen?", "answers": ["5", "6", "7", "3,5"] },
        { "q": "Hvad er hældningen i y = 2x + 5?", "answers": ["2", "5", "7", "x"] },
        { "q": "√81 = ?", "answers": ["9", "8", "81", "40,5"] },
        { "q": "Reducér: 3(2a − 1) + 2a", "answers": ["8a − 3", "8a − 1", "6a − 3", "5a − 3"] },
        { "q": "En trøje koster 240 kr. efter 20 % rabat. Hvad var førprisen?", "answers": ["300 kr.", "288 kr.", "260 kr.", "480 kr."] },
        { "q": "(a²)³ = ?", "answers": ["a⁶", "a⁵", "a⁸", "2a³"] },
        { "q": "Hvad er typetallet i 2, 3, 3, 5, 7, 3?", "answers": ["3", "5", "2", "7"] },
        { "q": "Løs: x² = 49", "answers": ["7 og −7", "kun 7", "24,5", "98"] },
        { "q": "y = 3x − 2. Hvad er y, når x = 4?", "answers": ["10", "14", "12", "5"] },
        { "q": "2⁵ = ?", "answers": ["32", "25", "16", "64"] },
        { "q": "Omregn 2,5 km til meter", "answers": ["2.500 m", "250 m", "25.000 m", "2.050 m"] }
      ] },
      "rewards": [{ "skill": "matematik.algebra", "xp": 20 }, { "skill": "matematik.geometri", "xp": 10 }, { "gold": 10 }] },

    { "id": "quiz-mat-9", "title": "Quiz: Matematik 9. klasse", "desc": "Funktioner, potenser og sandsynlighed — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Løs: 2(x − 3) = x + 5", "answers": ["x = 11", "x = 8", "x = 2", "x = −1"] },
        { "q": "Kateterne er 6 og 8. Hvad er hypotenusen?", "answers": ["10", "12", "14", "7"] },
        { "q": "Hvad er 3⁻¹?", "answers": ["1/3", "−3", "0,3", "−1/3"] },
        { "q": "To terninger: sandsynligheden for to 6'ere?", "answers": ["1/36", "1/12", "1/6", "2/6"] },
        { "q": "f(x) = x² − 4. Hvad er f(3)?", "answers": ["5", "9", "−1", "13"] },
        { "q": "√2 er cirka…", "answers": ["1,41", "1,73", "2,14", "1,21"] },
        { "q": "Hvor skærer y = −2x + 7 y-aksen?", "answers": ["7", "−2", "5", "0"] },
        { "q": "150 øges med 30 % og sænkes så med 30 %. Resultat?", "answers": ["136,5", "150", "139", "135"] },
        { "q": "Reducér: (2a)² · a", "answers": ["4a³", "2a³", "4a²", "2a²"] },
        { "q": "Hvad er 5 % af 5 % af 400?", "answers": ["1", "20", "4", "10"] },
        { "q": "Løs: x² − 9 = 0", "answers": ["x = 3 og −3", "x = 3", "x = 9", "x = 81"] },
        { "q": "En linje går gennem (0, 2) og (2, 6). Hældning?", "answers": ["2", "4", "3", "1"] }
      ] },
      "rewards": [{ "skill": "matematik.algebra", "xp": 20 }, { "skill": "matematik.problem", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "regnemester", "name": "Regnemester", "icon": "🏆", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "matematik", "level": 5 } },
    { "id": "tabeltrold", "name": "Tabel-troldmanden", "icon": "🧙", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "matematik.gangedivision", "level": 3 } },
    { "id": "mate25", "name": "25 mate-quests", "icon": "🔢", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "matematik" }, "count": 25 } },
    { "id": "matemaraton", "name": "Mate-maraton", "icon": "🏅", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "matematik" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "matestreak", "name": "Mate-streak", "icon": "🔥",
      "period": "week", "target": 3, "scope": { "skill": "matematik" },
      "milestones": [4, 10, 25, 52] }
  ]
});
