/* HverdagsHelte-modul: Dansk — de fire officielle sprogområder.
   Bundlet som .js så det virker ved file:// (samme mønster som QuizLive-quizzer).
   Selve indholdet er ren JSON i hverdagshelte-module@1-formatet. */
window.HQ_BUNDLED = window.HQ_BUNDLED || [];
window.HQ_BUNDLED.push({
  "format": "hverdagshelte-module@1",
  "id": "dansk",
  "name": "Dansk 📖",
  "version": 3,
  "author": "Frederik",
  "category": "skole",
  "grades": [0, 9],
  "description": "Bygget over de fire grundlæggende sprogområder: læseforståelse, skriftlig fremstilling, mundtlig kommunikation og lytteforståelse. Passer 2.–9. klasse — slå quests til/fra efter klassetrin.",

  "skills": [
    { "id": "dansk", "name": "Dansk", "icon": "📖", "color": "#e05a6c" },
    { "id": "dansk.laesning",  "name": "Læseforståelse",        "icon": "📚", "color": "#ba68c8", "parent": "dansk" },
    { "id": "dansk.skrivning", "name": "Skriftlig fremstilling", "icon": "✍️", "color": "#ffb74d", "parent": "dansk" },
    { "id": "dansk.mundtlig",  "name": "Mundtlig kommunikation", "icon": "🗣️", "color": "#4fc3f7", "parent": "dansk" },
    { "id": "dansk.lytning",   "name": "Lytteforståelse",        "icon": "👂", "color": "#81c784", "parent": "dansk" }
  ],

  "quests": [
    { "id": "laes20", "title": "Læs 20 minutter i din bog", "desc": "Selvvalgt bog — alle dage tæller", "icon": "📚",
      "type": "daily", "rewards": [{ "skill": "dansk.laesning", "xp": 20 }] },
    { "id": "dagbog", "title": "Skriv dagbog: 3 sætninger om din dag", "desc": "Husk stort begyndelsesbogstav og punktum", "icon": "📓",
      "type": "daily", "days": [1, 2, 3, 4, 5], "rewards": [{ "skill": "dansk.skrivning", "xp": 15 }] },
    { "id": "genfortael", "title": "Genfortæl din bog ved aftensmaden", "desc": "Hvad er sket? Hvem er med? Hvad tror du der sker nu?", "icon": "🍽️",
      "type": "weekly", "rewards": [{ "skill": "dansk.mundtlig", "xp": 25 }, { "gold": 5 }] },
    { "id": "lyt3", "title": "Lyt til lydbog eller podcast — fortæl 3 ting", "desc": "Mindst 15 minutter, og fortæl bagefter 3 ting du hørte", "icon": "🎧",
      "type": "weekly", "rewards": [{ "skill": "dansk.lytning", "xp": 25 }, { "gold": 5 }] },
    { "id": "historie", "title": "Skriv en lille historie (en halv side)", "desc": "Fri fantasi! Læs den højt for en voksen bagefter", "icon": "🏰",
      "type": "weekly", "rewards": [{ "skill": "dansk.skrivning", "xp": 40 }, { "gold": 10 }] },
    { "id": "anmeldelse", "title": "Skriv en anmeldelse af en bog eller film", "desc": "4.–9. klasse: hvad var godt, hvad var skidt, og hvorfor?", "icon": "⭐",
      "type": "weekly", "active": false, "grades": [4, 9], "rewards": [{ "skill": "dansk.skrivning", "xp": 40 }, { "gold": 15 }] },
    { "id": "oplaeg", "title": "Hold et lille oplæg for familien", "desc": "5.–9. klasse: 5 minutter om et emne du selv vælger", "icon": "🎤",
      "type": "weekly", "active": false, "grades": [5, 9], "rewards": [{ "skill": "dansk.mundtlig", "xp": 50 }, { "gold": 15 }] },

    { "id": "quiz-da-0", "title": "Quiz: Dansk 0. klasse", "desc": "Bogstaver, lyde og rim", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [0, 0],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvilket bogstav kommer først i alfabetet?", "answers": ["A", "B", "O", "Å"] },
        { "q": "Hvad rimer på 'kat'?", "answers": ["Hat", "Hund", "Ko", "Bil"] },
        { "q": "Hvilket ord starter med S?", "answers": ["Sol", "Måne", "Bil", "Hus"] },
        { "q": "Hvor mange bogstaver er der i ordet 'is'?", "answers": ["2", "3", "1", "4"] },
        { "q": "Hvilket bogstav kommer lige efter B?", "answers": ["C", "D", "A", "E"] },
        { "q": "Hvad rimer på 'mus'?", "answers": ["Hus", "Kat", "Sko", "Træ"] },
        { "q": "Hvilket ord starter med M?", "answers": ["Mor", "Far", "Bror", "Ven"] },
        { "q": "Hvilket af ordene er et dyr?", "answers": ["Hest", "Stol", "Kage", "Cykel"] },
        { "q": "Hvor mange bogstaver er der i 'sol'?", "answers": ["3", "2", "4", "5"] },
        { "q": "Hvilket bogstav er en vokal?", "answers": ["E", "K", "T", "S"] },
        { "q": "Hvad rimer på 'bil'?", "answers": ["Pil", "Bog", "Kop", "Dør"] },
        { "q": "Hvilket ord er skrevet rigtigt?", "answers": ["Hund", "Hnud", "Duhn", "Hudn"] }
      ] },
      "rewards": [{ "skill": "dansk.laesning", "xp": 20 }, { "gold": 5 }] },

    { "id": "quiz-da-1", "title": "Quiz: Dansk 1. klasse", "desc": "Små ord, stavelser og stavning", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [1, 1],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Skole", "Sgole", "Skoele", "Skolle"] },
        { "q": "Hvad er flertal af 'kat'?", "answers": ["Katte", "Kats", "Katter", "Kattes"] },
        { "q": "Hvilket ord er et navneord (en ting)?", "answers": ["Bord", "Løbe", "Glad", "Hurtigt"] },
        { "q": "Hvilket ord passer: '___ leger i haven'", "answers": ["Vi", "Og", "På", "At"] },
        { "q": "Hvad rimer på 'sne'?", "answers": ["Le", "Sol", "Vind", "Frost"] },
        { "q": "Hvilket ord starter med en vokal?", "answers": ["And", "Bold", "Kat", "Sten"] },
        { "q": "Hvor mange stavelser er der i 'banan'?", "answers": ["2", "1", "3", "4"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Venner", "Vener", "Vennere", "Vænner"] },
        { "q": "Hvad er det modsatte af 'stor'?", "answers": ["Lille", "Lang", "Tyk", "Høj"] },
        { "q": "Hvilket ord er et udsagnsord (noget man gør)?", "answers": ["Hopper", "Hus", "Rød", "Bold"] },
        { "q": "Hvad er flertal af 'hus'?", "answers": ["Huse", "Husser", "Huser", "Husene"] },
        { "q": "Hvilket ord skal skrives med stort?", "answers": ["Danmark", "hund", "bold", "skole"] }
      ] },
      "rewards": [{ "skill": "dansk.skrivning", "xp": 20 }, { "gold": 5 }] },

    { "id": "quiz-da-2", "title": "Quiz: Dansk 2. klasse", "desc": "Stavning, ordklasser og tegn", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [2, 2],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Cykel", "Sykel", "Cykkel", "Cyckel"] },
        { "q": "Hvad er navneordet i 'Pigen løber hurtigt'?", "answers": ["Pigen", "løber", "hurtigt", "i"] },
        { "q": "Hvad er det modsatte af 'mørk'?", "answers": ["Lys", "Grå", "Sort", "Kold"] },
        { "q": "Hvor mange stavelser er der i 'elefant'?", "answers": ["3", "2", "4", "5"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Hjerte", "Jerte", "Hjærte", "Hjerde"] },
        { "q": "Hvad er flertal af 'barn'?", "answers": ["Børn", "Barne", "Barner", "Børner"] },
        { "q": "Hvilket tegn slutter et spørgsmål?", "answers": ["?", ".", "!", ","] },
        { "q": "Hvad hedder 'at gå' i datid?", "answers": ["Gik", "Gåede", "Går", "Gånde"] },
        { "q": "Hvilket ord er et tillægsord (beskriver noget)?", "answers": ["Smuk", "Hoppe", "Stol", "Under"] },
        { "q": "Hvad rimer på 'regn'?", "answers": ["Tegn", "Sol", "Sky", "Vand"] },
        { "q": "Hvad er det modsatte af 'begynde'?", "answers": ["Slutte", "Starte", "Vente", "Løbe"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Længe", "Lenge", "Læjne", "Lænnge"] }
      ] },
      "rewards": [{ "skill": "dansk.skrivning", "xp": 15 }, { "skill": "dansk.laesning", "xp": 15 }, { "gold": 5 }] },

    { "id": "quiz-da-3", "title": "Quiz: Dansk 3. klasse", "desc": "Stavning, datid og ordklasser", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [3, 3],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Meget", "Maget", "Megget", "Mejet"] },
        { "q": "Hvad er udsagnsordet i 'Drengen spiser et æble'?", "answers": ["spiser", "Drengen", "æble", "et"] },
        { "q": "Hvad hedder 'at spise' i datid?", "answers": ["Spiste", "Spisede", "Spis", "Spiser"] },
        { "q": "Hvilket ord skal skrives med stort?", "answers": ["Odense", "hund", "cykel", "fredag"] },
        { "q": "Hvad er flertal af 'mand'?", "answers": ["Mænd", "Mander", "Mande", "Mænder"] },
        { "q": "Hvilket ord er et navneord?", "answers": ["Lærer", "Løbe", "Sjov", "Altid"] },
        { "q": "Hvilken sætning er et spørgsmål?", "answers": ["Hvor bor du?", "Jeg bor i Horsens.", "Kom herover!", "Det regner."] },
        { "q": "Hvad er det modsatte af 'modig'?", "answers": ["Bange", "Stærk", "Klog", "Hurtig"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Gerne", "Gærne", "Gjerne", "Geerne"] },
        { "q": "Hvor mange navneord er der i 'Hunden jagter katten i haven'?", "answers": ["3", "2", "1", "4"] },
        { "q": "Hvad hedder 'at drikke' i datid?", "answers": ["Drak", "Drikkede", "Drukkede", "Drikker"] },
        { "q": "Hvad betyder 'at fryse'?", "answers": ["At have det koldt", "At have det varmt", "At være sulten", "At være træt"] }
      ] },
      "rewards": [{ "skill": "dansk.skrivning", "xp": 20 }, { "skill": "dansk.laesning", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-da-4", "title": "Quiz: Dansk 4. klasse", "desc": "Grundled, stavning og bindeord", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [4, 4],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Interessant", "Intresant", "Interesant", "Intressant"] },
        { "q": "Hvad er grundleddet i 'Pigen kaster bolden'?", "answers": ["Pigen", "kaster", "bolden", "et af de andre"] },
        { "q": "Hvad hedder 'at synge' i førnutid?", "answers": ["Har sunget", "Har synget", "Sang", "Syngede"] },
        { "q": "Hvilket ord er et stedord?", "answers": ["Hun", "Hus", "Løbe", "Flot"] },
        { "q": "Hvad betyder 'omhyggelig'?", "answers": ["Grundig og passer på", "Hurtig", "Doven", "Larmende"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Selvfølgelig", "Selfølgelig", "Selvfølelig", "Sælvfølgelig"] },
        { "q": "Hvad er flertal af 'bog'?", "answers": ["Bøger", "Boger", "Bøgere", "Bogene"] },
        { "q": "Hvilken sætning er i datid?", "answers": ["Vi legede i går.", "Vi leger nu.", "Vi vil lege.", "Vi leger tit."] },
        { "q": "Hvad er det modsatte af 'sjældent'?", "answers": ["Ofte", "Aldrig", "Langsomt", "Snart"] },
        { "q": "Hvad kaldes ord som 'og', 'men' og 'eller'?", "answers": ["Bindeord", "Navneord", "Udsagnsord", "Tillægsord"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Øjeblik", "Øjenblik", "Øjelbik", "Øjebligg"] },
        { "q": "Hvad hedder 'at finde' i datid?", "answers": ["Fandt", "Findede", "Fundede", "Finder"] }
      ] },
      "rewards": [{ "skill": "dansk.skrivning", "xp": 20 }, { "skill": "dansk.laesning", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-da-5", "title": "Quiz: Dansk 5. klasse", "desc": "Genstandsled, synonymer og genrer", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [5, 5],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad er genstandsleddet i 'Anna læser bogen'?", "answers": ["bogen", "Anna", "læser", "der er ikke noget"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Lidt", "Lit", "Lidtt", "Ledt"] },
        { "q": "Hvad kaldes en fortælling om ens eget liv?", "answers": ["Selvbiografi", "Eventyr", "Fabel", "Roman"] },
        { "q": "Hvilket ord er et forholdsord?", "answers": ["Under", "Løbe", "Smuk", "Hun"] },
        { "q": "Hvad betyder 'at tøve'?", "answers": ["At vente lidt før man gør noget", "At skynde sig", "At råbe højt", "At give op"] },
        { "q": "Hvilken sætning er korrekt?", "answers": ["Hans og jeg spiller fodbold.", "Hans og mig spiller fodbold.", "Mig og Hans spiller fodbold.", "Ham og mig spiller fodbold."] },
        { "q": "Hvad er bestemt form af 'hus'?", "answers": ["Huset", "Husets", "Huse", "Et hus"] },
        { "q": "Hvad er et synonym for 'glad'?", "answers": ["Lykkelig", "Vred", "Træt", "Bange"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Nemlig", "Nemli", "Nehmlig", "Nemmelig"] },
        { "q": "Hvad kaldes det, når 'solen smiler' (ting får følelser)?", "answers": ["Besjæling", "Rim", "Fakta", "Bogstavrim"] },
        { "q": "Hvad hedder 'at springe' i datid?", "answers": ["Sprang", "Springede", "Sprungede", "Springer"] },
        { "q": "Hvad er 'hurtigere' for en grad?", "answers": ["2. grad (højere grad)", "1. grad", "3. grad", "Det er et navneord"] }
      ] },
      "rewards": [{ "skill": "dansk.laesning", "xp": 20 }, { "skill": "dansk.skrivning", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-da-6", "title": "Quiz: Dansk 6. klasse", "desc": "Sprogbilleder, genrer og grammatik", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [6, 6],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad kaldes en sammenligning med 'som' ('stærk som en bjørn')?", "answers": ["En sammenligning", "En metafor", "Et rim", "En fabel"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Overraskelse", "Overaskelse", "Overraskellse", "Overasskelse"] },
        { "q": "Hvad er en metafor?", "answers": ["Et sprogbillede uden 'som'", "Et rim", "En lang sætning", "Et spørgsmål"] },
        { "q": "Hvornår bruges 'nogle'?", "answers": ["Om flere (flertal)", "Om cirka én", "Altid", "Aldrig"] },
        { "q": "Hvad er datid af 'at byde'?", "answers": ["Bød", "Bydede", "Budt", "Byder"] },
        { "q": "Hvilken genre er 'Den grimme ælling'?", "answers": ["Eventyr", "Krimi", "Biografi", "Avisartikel"] },
        { "q": "Hvad betyder 'ironi'?", "answers": ["At sige det modsatte af det man mener", "At tale højt", "At skrive digte", "At synge"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Situation", "Sitvation", "Situasion", "Situastion"] },
        { "q": "Hvad er udsagnsleddet i 'Katten sover på sofaen'?", "answers": ["sover", "Katten", "sofaen", "på"] },
        { "q": "Hvad kaldes teksten bag på en bog?", "answers": ["Bagsidetekst", "Indholdsfortegnelse", "Fodnote", "Kolofon"] },
        { "q": "Hvad er et synonym for 'bange'?", "answers": ["Frygtsom", "Modig", "Rolig", "Glad"] },
        { "q": "Hvilken sætning er korrekt?", "answers": ["Der ligger en bog på bordet.", "Der lægger en bog på bordet.", "Der ligge en bog på bordet.", "Der lå en bog på bordet i morgen."] }
      ] },
      "rewards": [{ "skill": "dansk.laesning", "xp": 20 }, { "skill": "dansk.skrivning", "xp": 10 }, { "gold": 5 }] },

    { "id": "quiz-da-7", "title": "Quiz: Dansk 7. klasse", "desc": "Ligge/lægge, argumentation og genrer", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [7, 7],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad er forskellen på 'ligge' og 'lægge'?", "answers": ["Ligge = være placeret, lægge = placere noget", "De betyder det samme", "Lægge = være placeret", "Kun 'ligge' findes"] },
        { "q": "Hvad er et argument?", "answers": ["En begrundelse for en påstand", "En overskrift", "Et rim", "En pause"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Anderledes", "Anderledens", "Anderleddes", "Andeledes"] },
        { "q": "Hvad kaldes afsenderens troværdighed i argumentation?", "answers": ["Etos", "Patos", "Logos", "Tempo"] },
        { "q": "Hvad er datid af 'at gide'?", "answers": ["Gad", "Gidede", "Gidt", "Gider"] },
        { "q": "Hvad er 'synsvinklen' i en tekst?", "answers": ["Hvem der ser og fortæller", "Skrifttypen", "Længden", "Sproget"] },
        { "q": "Hvilken sætning er korrekt?", "answers": ["Hun gjorde det godt.", "Hun gjorde det god.", "Hun gør det godt i går.", "Hun gjort det godt."] },
        { "q": "Hvad kaldes appel til følelser?", "answers": ["Patos", "Etos", "Logos", "Ekko"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Efterhånden", "Efterhånen", "Efterhaanden", "Efterhånnen"] },
        { "q": "Hvad er en kronik?", "answers": ["En holdningstekst i en avis", "Et eventyr", "En sms", "Et digt"] },
        { "q": "Hvad er 'nutids-r'?", "answers": ["R på udsagnsord i nutid (han løber)", "R i navneord", "Altid en fejl", "R kun i datid"] },
        { "q": "Hvad er et synonym for 'diskutere'?", "answers": ["Drøfte", "Diktere", "Distancere", "Dissekere"] }
      ] },
      "rewards": [{ "skill": "dansk.skrivning", "xp": 20 }, { "skill": "dansk.mundtlig", "xp": 10 }, { "gold": 10 }] },

    { "id": "quiz-da-8", "title": "Quiz: Dansk 8. klasse", "desc": "Komma, ledsætninger og fortælleteknik", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [8, 8],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvor skal kommaet stå: 'Da vi kom hjem spiste vi'?", "answers": ["Efter 'hjem'", "Efter 'Da'", "Efter 'spiste'", "Der skal intet komma"] },
        { "q": "Hvad er 'logos' i argumentation?", "answers": ["Appel til fornuft og fakta", "Appel til følelser", "Troværdighed", "Overdrivelse"] },
        { "q": "Hvordan skrives det rigtigt?", "answers": ["I hvert fald", "Ihvertfald", "I hvertfald", "Ihvert fald"] },
        { "q": "Hvad er en ledsætning?", "answers": ["En sætning der ikke kan stå alene", "En hovedsætning", "En overskrift", "Et citat"] },
        { "q": "Hvad betyder 'implicit'?", "answers": ["Underforstået", "Tydeligt sagt", "Højtideligt", "Forkert"] },
        { "q": "Hvad er datid af 'at synes'?", "answers": ["Syntes", "Synes", "Synede", "Syns"] },
        { "q": "Hvad kaldes en tekst, der vil overbevise?", "answers": ["Argumenterende tekst", "Berettende tekst", "Digt", "Referat"] },
        { "q": "Hvilken sætning har korrekte kommaer?", "answers": ["Bilen, som holder derovre, er min.", "Bilen som, holder derovre, er min.", "Bilen som holder, derovre er min.", "Bilen, som holder derovre er, min."] },
        { "q": "Hvad er forskellen på 'af' og 'ad'?", "answers": ["Af = fra noget, ad = langs/gennem", "De er helt ens", "Ad = fra noget", "Af bruges aldrig"] },
        { "q": "Hvad kaldes en fortæller, der ved alt?", "answers": ["Alvidende fortæller", "Jeg-fortæller", "Upålidelig fortæller", "Replik"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Umiddelbart", "Umidelbart", "Umiddelbardt", "Umidellbart"] },
        { "q": "Hvad betyder 'at nuancere'?", "answers": ["At vise flere sider af en sag", "At forenkle", "At gentage", "At afvise"] }
      ] },
      "rewards": [{ "skill": "dansk.skrivning", "xp": 20 }, { "skill": "dansk.laesning", "xp": 10 }, { "gold": 10 }] },

    { "id": "quiz-da-9", "title": "Quiz: Dansk 9. klasse", "desc": "Eksamensniveau: analyse, sin/sit og retorik", "icon": "🧠",
      "type": "weekly", "active": false, "grades": [9, 9],
      "quiz": { "draw": 10, "pass": 8, "questions": [
        { "q": "Hvad kendetegner en novelle?", "answers": ["Kort, få personer, én konflikt", "Lang med mange kapitler", "Altid på rim", "Kun fakta"] },
        { "q": "Hvornår bruges 'sin/sit' frem for 'hans/hendes'?", "answers": ["Når det viser tilbage til grundleddet", "Altid", "Aldrig", "Kun om ting"] },
        { "q": "Hvad er en 'præmis' i argumentation?", "answers": ["En forudsætning bag et argument", "Konklusionen", "En overdrivelse", "Et citat"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Tilsyneladende", "Tilsynelagende", "Tilsyneladene", "Til syneladende"] },
        { "q": "Hvad betyder 'eksplicit'?", "answers": ["Direkte udtrykt", "Underforstået", "Skjult", "Ligegyldigt"] },
        { "q": "Hvad er et 'motiv' i en tekst?", "answers": ["Et genkendeligt emne eller mønster", "Forfatterens navn", "Sidetallet", "En trykfejl"] },
        { "q": "Hvad kaldes et spring tilbage i tid i en fortælling?", "answers": ["Flashback", "Varsling", "Klimaks", "Epilog"] },
        { "q": "Hvilken sætning er korrekt?", "answers": ["Hverken han eller jeg kunne svare.", "Hverken han og jeg kunne svare.", "Hverken han eller mig kunne svare.", "Hverken ham eller jeg kunne svare."] },
        { "q": "Hvad er 'temaet' i en tekst?", "answers": ["Det teksten grundlæggende handler om", "Handlingen kort fortalt", "Titlen", "Genren"] },
        { "q": "Hvad sættes der komma omkring?", "answers": ["Indskudte sætninger", "Alle navneord", "Alle udsagnsord", "Overskrifter"] },
        { "q": "Hvad betyder 'retorik'?", "answers": ["Læren om overbevisende tale", "Læren om stavning", "En digtform", "En avisgenre"] },
        { "q": "Hvilket ord er stavet rigtigt?", "answers": ["Overhovedet", "Overhovede", "Overhoveddet", "Over hovedet"] }
      ] },
      "rewards": [{ "skill": "dansk.laesning", "xp": 20 }, { "skill": "dansk.skrivning", "xp": 10 }, { "gold": 10 }] }
  ],

  "badges": [
    { "id": "bogorm", "name": "Bogorm", "icon": "🐛", "rarity": "gold",
      "rule": { "type": "milestone", "skill": "dansk.laesning", "level": 5 } },
    { "id": "fortaeller", "name": "Fortælleren", "icon": "🎭", "rarity": "silver",
      "rule": { "type": "milestone", "skill": "dansk.mundtlig", "level": 3 } },
    { "id": "dansk25", "name": "25 dansk-quests", "icon": "📕", "rarity": "bronze",
      "rule": { "type": "counter", "scope": { "module": "dansk" }, "count": 25 } },
    { "id": "danskdrage", "name": "Dansk-dragen", "icon": "🐉", "rarity": "legendary", "secret": true,
      "rule": { "type": "counter", "scope": { "module": "dansk" }, "count": 100 } }
  ],

  "streaks": [
    { "id": "laesestreak", "name": "Læse-streak", "icon": "🔥",
      "period": "day", "target": 1, "scope": { "skill": "dansk.laesning" },
      "milestones": [7, 30, 100, 365] }
  ]
});
