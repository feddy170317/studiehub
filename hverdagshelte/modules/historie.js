/* HverdagsHelte-modul: Historie — folkeskolefag 3.-9. klasse (Fælles Mål).
   Årgangs-quizzer følger den kronologiske progression: vikingetid → middelalder →
   reformation/enevælde → 1800-tallet → industrialisering/1. VK → 2. VK → kold krig. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "historie",
  "name": "Historie 🏛️",
  "version": 1,
  "author": "Frederik",
  "category": "skole",
  "grades": [3, 9],
  "description": "Kronologi, kilder og Danmarks- og verdenshistorie. Quizzerne følger skolens kronologiske rækkefølge fra vikingetiden til den kolde krig.",

  "skills": [
    { "id": "historie", "name": "Historie", "icon": "🏛️", "color": "#c9a15a" },
    { "id": "historie.tid",     "name": "Kronologi & tid",   "icon": "⏳", "color": "#ffb74d", "parent": "historie" },
    { "id": "historie.kilder",  "name": "Kilder",            "icon": "📜", "color": "#ba68c8", "parent": "historie" },
    { "id": "historie.danmark", "name": "Danmarkshistorie",  "icon": "🇩🇰", "color": "#e05a6c", "parent": "historie" },
    { "id": "historie.verden",  "name": "Verdenshistorie",   "icon": "🌍", "color": "#4fc3f7", "parent": "historie" }
  ],

  "quests": [
    { "id": "dokumentar", "title": "Se en historisk dokumentar og fortæl 3 ting", "desc": "En serie, YouTube eller DR — fortæl hvad du lærte", "icon": "🎬",
      "type": "weekly", "rewards": [{ "skill": "historie.verden", "xp": 25 }, { "gold": 5 }] },
    { "id": "bedsteinterview", "title": "Interview en bedsteforælder om gamle dage", "desc": "Hvordan var skolen? Hvad legede de? Hvad kostede en is?", "icon": "👵",
      "type": "weekly", "rewards": [{ "skill": "historie.kilder", "xp": 30 }, { "gold": 5 }] },
    { "id": "museum", "title": "⭐ Besøg et museum eller historisk sted", "desc": "Fortæl om den mest spændende ting du så", "icon": "🏰",
      "type": "once", "rewards": [{ "skill": "historie.kilder", "xp": 50 }, { "skill": "historie.danmark", "xp": 25 }, { "gold": 20 }] },
    { "id": "tidslinje", "title": "Lav en tidslinje over dit eget liv", "desc": "3.–5. klasse: de vigtigste ting fra du blev født til nu", "icon": "⏳",
      "type": "once", "grades": [3, 5], "rewards": [{ "skill": "historie.tid", "xp": 30 }, { "gold": 10 }] },
    { "id": "gammelting", "title": "Find en gammel ting derhjemme og find historien bag", "desc": "Et foto, en mønt, et brev — hvor kommer den fra?", "icon": "🕰️",
      "type": "weekly", "grades": [4, 9], "rewards": [{ "skill": "historie.kilder", "xp": 25 }] },

    { "id": "quiz-his-3", "title": "Quiz: Historie 3. klasse", "desc": "Vikingetiden", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [3, 3],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad hed vikingernes skibe?", "answers": ["Langskibe", "Galejer", "Kanoer", "Færger"] },
        { "q": "Hvilken gud havde en hammer?", "answers": ["Thor", "Odin", "Loke", "Balder"] },
        { "q": "Hvad hedder vikingernes skrifttegn?", "answers": ["Runer", "Hieroglyffer", "Noder", "Tal"] },
        { "q": "Hvem rejste den store Jellingsten?", "answers": ["Harald Blåtand", "Christian 4.", "Margrete 1.", "Holger Danske"] },
        { "q": "Hvad kaldes gudernes verden i nordisk mytologi?", "answers": ["Asgård", "Olympen", "Midgård", "Atlantis"] },
        { "q": "Hvor sejlede vikingerne bl.a. hen?", "answers": ["England", "Australien", "Japan", "Sydafrika"] },
        { "q": "Hvem var konge over de nordiske guder?", "answers": ["Odin", "Thor", "Frej", "Erik"] },
        { "q": "Hvad er Trelleborg?", "answers": ["En rund vikingeborg", "En bro", "En kirke", "Et skib"] },
        { "q": "Hvornår var vikingetiden cirka?", "answers": ["År 800-1050", "År 1800-1900", "År 0-100", "År 1500-1600"] },
        { "q": "Hvad navigerede vikingerne efter på havet?", "answers": ["Solen og stjernerne", "GPS", "Radiosignaler", "Fyrtårne"] }
      ] },
      "rewards": [{ "skill": "historie.danmark", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-his-4", "title": "Quiz: Historie 4. klasse", "desc": "Middelalderen", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [4, 4],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvem grundlagde København?", "answers": ["Absalon", "Christian 4.", "Harald Blåtand", "H.C. Andersen"] },
        { "q": "Hvad var Den Sorte Død?", "answers": ["En pest-epidemi", "En krig", "En storm", "En hungersnød"] },
        { "q": "Hvor boede munkene?", "answers": ["I klostre", "På borge", "I lader", "På skibe"] },
        { "q": "Hvem samlede Danmark, Norge og Sverige i Kalmarunionen?", "answers": ["Margrete 1.", "Dronning Thyra", "Dagmar", "Ingrid"] },
        { "q": "Hvad bar ridderne i kamp?", "answers": ["Rustning", "Vikingehjelm med horn", "Uniform", "Kappe alene"] },
        { "q": "Hvad hedder kirkens største bygninger fra middelalderen?", "answers": ["Domkirker", "Haller", "Stalde", "Templer"] },
        { "q": "Hvornår var middelalderen i Danmark cirka?", "answers": ["1050-1536", "1800-1900", "0-500", "1600-1700"] },
        { "q": "Hvad var en fæstebonde?", "answers": ["En bonde der arbejdede for en herremand", "En fri købmand", "En soldat", "En munk"] },
        { "q": "Hvornår ramte Den Sorte Død Danmark cirka?", "answers": ["År 1350", "År 1950", "År 1050", "År 1650"] },
        { "q": "Hvad byggede man de store borge af?", "answers": ["Sten og mursten", "Plastik", "Beton og glas", "Pap og træpap"] }
      ] },
      "rewards": [{ "skill": "historie.danmark", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-his-5", "title": "Quiz: Historie 5. klasse", "desc": "Reformation, Christian 4. og enevælde", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 5],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvem startede reformationen?", "answers": ["Martin Luther", "Christian 4.", "Absalon", "Paven"] },
        { "q": "Hvornår blev Danmark protestantisk?", "answers": ["1536", "1849", "1660", "1945"] },
        { "q": "Hvilken konge byggede Rundetårn?", "answers": ["Christian 4.", "Frederik 9.", "Harald Blåtand", "Knud den Store"] },
        { "q": "Hvad var enevælde?", "answers": ["Kongen havde al magt", "Folket stemte om alt", "Kirken bestemte alt", "Ingen bestemte"] },
        { "q": "Hvornår blev enevælden indført i Danmark?", "answers": ["1660", "1849", "1536", "1901"] },
        { "q": "Hvem var Tycho Brahe?", "answers": ["En berømt astronom", "En konge", "En maler", "En viking"] },
        { "q": "Hvilke landsdele tabte Danmark til Sverige i 1658?", "answers": ["Skåne, Halland og Blekinge", "Jylland", "Fyn", "Island"] },
        { "q": "Hvad opdagede astronomerne i renæssancen, at Jorden drejer om?", "answers": ["Solen", "Månen", "Mars", "Sig selv alene"] },
        { "q": "Hvad blev Børsen i København bygget som?", "answers": ["Handelsbygning under Christian 4.", "En kirke", "Et fængsel", "En banegård"] },
        { "q": "Hvad betyder 'reformation'?", "answers": ["Fornyelse af kirken", "En fest", "En krig", "En opfindelse"] }
      ] },
      "rewards": [{ "skill": "historie.danmark", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-his-6", "title": "Quiz: Historie 6. klasse", "desc": "1800-tallet: grundlov, 1864 og guldalder", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [6, 6],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvornår fik Danmark sin første grundlov?", "answers": ["1849", "1660", "1949", "1915"] },
        { "q": "Hvilken konge underskrev grundloven?", "answers": ["Frederik 7.", "Christian 4.", "Frederik 9.", "Knud den Store"] },
        { "q": "Hvad tabte Danmark i krigen i 1864?", "answers": ["Slesvig og Holsten", "Skåne", "Norge", "Bornholm"] },
        { "q": "Hvem bombarderede København i 1807?", "answers": ["Englænderne", "Svenskerne", "Tyskerne", "Franskmændene"] },
        { "q": "Hvad betød grundloven for kongens magt?", "answers": ["Den blev begrænset", "Den blev større", "Den var uændret", "Kongen blev afsat"] },
        { "q": "Hvilken berømt digter skrev eventyr i 1800-tallet?", "answers": ["H.C. Andersen", "Halfdan Rasmussen", "Tove Ditlevsen", "Kim Larsen"] },
        { "q": "Hvad var stavnsbåndet?", "answers": ["Bønder skulle blive på deres egn", "En slags bælte", "En skat", "Et våben"] },
        { "q": "Hvornår blev stavnsbåndet ophævet?", "answers": ["1788", "1888", "1688", "1948"] },
        { "q": "Hvad kaldes kunstens storhedstid først i 1800-tallet?", "answers": ["Guldalderen", "Jernalderen", "Stenalderen", "Vikingetiden"] },
        { "q": "Hvem kæmpede Danmark mod i 1864?", "answers": ["Preussen og Østrig", "England og Frankrig", "Sverige og Norge", "Rusland"] }
      ] },
      "rewards": [{ "skill": "historie.danmark", "xp": 25 }, { "gold": 5 }] },

    { "id": "quiz-his-7", "title": "Quiz: Historie 7. klasse", "desc": "Industrialisering og 1. verdenskrig", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvornår var 1. verdenskrig?", "answers": ["1914-1918", "1939-1945", "1900-1910", "1864-1870"] },
        { "q": "Hvad gjorde Danmark under 1. verdenskrig?", "answers": ["Forblev neutralt", "Kæmpede for Tyskland", "Kæmpede for England", "Erklærede Sverige krig"] },
        { "q": "Hvad var Genforeningen i 1920?", "answers": ["Sønderjylland kom tilbage til Danmark", "Norge og Danmark blev ét", "Island blev dansk", "EU blev dannet"] },
        { "q": "Hvornår fik danske kvinder valgret til Folketinget?", "answers": ["1915", "1849", "1945", "2000"] },
        { "q": "Hvad drev de første fabriksmaskiner?", "answers": ["Dampkraft", "Solceller", "Benzinmotorer", "Atomkraft"] },
        { "q": "Hvad var skyttegrave?", "answers": ["Gravede kampstillinger i 1. verdenskrig", "Vandkanaler", "Miner", "Togspor"] },
        { "q": "Hvorfor flyttede folk til byerne i 1800-tallet?", "answers": ["Arbejde på fabrikkerne", "Bedre vejr", "Gratis boliger", "Kongens ordre"] },
        { "q": "Hvilken opfindelse ændrede transporten i 1800-tallet?", "answers": ["Jernbanen", "Flyet til alle", "Elbilen", "Raketten"] },
        { "q": "Hvilken begivenhed udløste 1. verdenskrig?", "answers": ["Skuddet i Sarajevo 1914", "Angrebet på Pearl Harbor", "Berlinmurens fald", "Den franske revolution"] },
        { "q": "Hvad kaldes overgangen til fabrikker og maskiner?", "answers": ["Industrialiseringen", "Reformationen", "Renæssancen", "Oplysningstiden"] }
      ] },
      "rewards": [{ "skill": "historie.verden", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-his-8", "title": "Quiz: Historie 8. klasse", "desc": "2. verdenskrig og besættelsen", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvornår besatte Tyskland Danmark?", "answers": ["9. april 1940", "4. maj 1945", "1. september 1939", "5. juni 1849"] },
        { "q": "Hvornår blev Danmark befriet?", "answers": ["4.-5. maj 1945", "9. april 1940", "24. december 1944", "1. maj 1950"] },
        { "q": "Hvad skete der i oktober 1943?", "answers": ["De danske jøder blev hjulpet til Sverige", "Krigen sluttede", "Danmark erklærede krig", "Berlinmuren faldt"] },
        { "q": "Hvad lavede modstandsbevægelsen?", "answers": ["Sabotage mod besættelsesmagten", "Byggede broer", "Solgte mad", "Holdt taler for tyskerne"] },
        { "q": "Hvem var Tysklands diktator?", "answers": ["Adolf Hitler", "Stalin", "Churchill", "Franco"] },
        { "q": "Hvad var Holocaust?", "answers": ["Nazisternes folkedrab på jøderne", "Et slag i Frankrig", "En flådeoperation", "En fredsaftale"] },
        { "q": "Hvad var samarbejdspolitikken?", "answers": ["Danmark samarbejdede med besættelsesmagten indtil 1943", "En sportsaftale", "EU-samarbejde", "Handel med Sverige"] },
        { "q": "Hvornår brød samarbejdspolitikken sammen?", "answers": ["August 1943", "April 1940", "Maj 1945", "September 1939"] },
        { "q": "Hvilke lande hørte til de allierede?", "answers": ["USA, Storbritannien og Sovjetunionen", "Tyskland og Italien", "Japan og Tyskland", "Spanien og Portugal"] },
        { "q": "Hvornår startede 2. verdenskrig i Europa?", "answers": ["1. september 1939", "9. april 1940", "28. juni 1914", "6. juni 1944"] }
      ] },
      "rewards": [{ "skill": "historie.verden", "xp": 25 }, { "gold": 10 }] },

    { "id": "quiz-his-9", "title": "Quiz: Historie 9. klasse", "desc": "Den kolde krig og nyere tid — eksamensniveau", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 8, "pass": 6, "questions": [
        { "q": "Hvad var den kolde krig?", "answers": ["Spændingen mellem USA og Sovjetunionen", "En krig i Norden", "En vinterkrig i Finland alene", "En handelsaftale"] },
        { "q": "Hvornår faldt Berlinmuren?", "answers": ["1989", "1961", "1945", "2001"] },
        { "q": "Hvornår blev Danmark medlem af NATO?", "answers": ["1949", "1989", "1973", "2004"] },
        { "q": "Hvornår kom Danmark med i EF (nu EU)?", "answers": ["1973", "1949", "1993", "2002"] },
        { "q": "Hvad skete der 11. september 2001?", "answers": ["Terrorangreb i USA", "Murens fald", "Euroen blev indført", "Golfkrigen sluttede"] },
        { "q": "Hvad delte Berlinmuren?", "answers": ["Øst- og Vestberlin", "Nord- og Sydtyskland", "Polen og Tyskland", "Berlin og München"] },
        { "q": "Hvornår blev Sovjetunionen opløst?", "answers": ["1991", "1989", "1945", "2000"] },
        { "q": "Hvad stemte danskerne nej til i 2000?", "answers": ["Euroen", "NATO", "Grundloven", "Storebæltsbroen"] },
        { "q": "Hvad kaldtes kapløbet om at komme først ud i rummet?", "answers": ["Rumkapløbet", "Månekrigen", "Stjernekrigen", "Luftbroen"] },
        { "q": "Hvilke to alliancer stod over for hinanden i den kolde krig?", "answers": ["NATO og Warszawapagten", "EU og FN", "Aksemagterne og de allierede", "Norden og Balkan"] }
      ] },
      "rewards": [{ "skill": "historie.verden", "xp": 25 }, { "skill": "historie.tid", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "tidsrejsende", "name": "Tidsrejsende", "icon": "⏳", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "historie", "level": 5 } },
    { "id": "his20", "name": "20 historie-quests", "icon": "🏛️", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "historie" }, "count": 20 } },
    { "id": "kronikoer", "name": "Krønikeskriveren", "icon": "📜", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "historie" }, "count": 75 } }
  ],

  "streaks": [
    { "id": "hisstreak", "name": "Historie-streak", "icon": "🔥",
      "period": "week", "target": 1, "scope": { "module": "historie" },
      "milestones": [4, 10, 25, 52] }
  ]
});
