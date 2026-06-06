/* MEK2 Quiz — Lektion 1: Spænding og Tøjning
   Kilde: HTML-læseguide (9 kernebegreber, 7 formler, 8 mnemoteknik).
   12 Q · 4 lette (1pt) / 5 middel (2pt) / 3 svære (3pt) */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['L1_spaending_toejning'] = {
  intro: 'Spænding og tøjning er de fundamentale byggeklodser i materialemekanik. Normalspænding &sigma; måler kraft pr. areal vinkelret på tværsnit, mens normal tøjning &epsilon; måler relativ længdeændring. Hookes lov &sigma; = E&epsilon; forbinder dem ved små deformationer. Du lærer også forskydningsspænding &tau; i bolte, Poissons forhold &nu; for lateral kontraktion, og hvordan man beregner lejespænding.',
  analogi: '⚒ Kerneidé: spænding = kraft/areal, tøjning = deformation/oprindelig længde. Hookes lov er lineær og gælder før flydning. Centroiden er hvor kraftresultanten virker.',
  examQs: [
    'Beregn &sigma; og &epsilon; fra kraft, areal og lengdeændring.',
    'Anvend Hookes lov og beregn lateral tøjning via Poissons forhold.',
    'Analyse: single vs. double shear i boltesamlinger.'
  ],
  mc: [
    { level: 'let', q: 'Normalspænding &sigma; defineres som …',
      options: ['Kraft gange areal', 'Kraft divideret areal', 'Forlængelse divideret oprindelig længde', 'Youngs modul gange tøjning'],
      correct: 1,
      why: '&sigma; = P/A [Pa]. Kraft pr. enhedsareal vinkelret på tværsnit. Det er den mest grundlæggende definition fra læseguide afsnit 1 (normalspænding).' },

    { level: 'let', q: 'Normal tøjning &epsilon; er …',
      options: ['Kraft pr. areal', 'Absolut længdeændring', 'Relativ længdeændring = &delta;/L', 'Altid større end spænding'],
      correct: 2,
      why: '&epsilon; = &delta;/L [dimensionsløs], hvor &delta; er længdeændring og L er oprindelig længde. Positiv ved strækning, negativ ved sammentrykning (læseguide afsnit 2).' },

    { level: 'let', q: 'Youngs modul E måler …',
      options: ['Kraft', 'Stivhed i normalretning [Pa]', 'Lateral kontraktion', 'Tværsnitsareal'],
      correct: 1,
      why: 'E [Pa] er stivhedskonstanten i normalretning. Højere E = stivere materiale. Stål ~200 GPa, aluminium ~70 GPa (læseguide afsnit 3).' },

    { level: 'let', q: 'Hookes lov &sigma; = E&epsilon; gælder …',
      options: ['Altid', 'Kun for elastiske (små) deformationer før flydning', 'Kun ved høj temperatur', 'Aldrig i praksis'],
      correct: 1,
      why: 'Hookes lov er lineær og gælder kun inden for det elastiske område før materialets flydegrænse. Hvis stress-strain-kurven buer af, er du uden for det lineære regime (læseguide afsnit "Hookes lov lineær").' },

    { level: 'middel', q: 'Poissons forhold &nu; = −(&epsilon;<sub>lat</sub>/&epsilon;<sub>aks</sub>). Hvad betyder det fysisk?',
      options: ['Lateral tøjning er altid positiv', 'Når materiale strekkes aksielt, bliver det smalere i siden', 'Lateral og aksial tøjning har samme størrelse', 'Kun tungmetaller har Poisson-forhold'],
      correct: 1,
      why: 'Når du trækker i en elastik (positiv &epsilon;<sub>aks</sub>), bliver den tyndere (negativ &epsilon;<sub>lat</sub>). Derfor er &nu; negativ. Typisk 0,2–0,35 for metaller (læseguide afsnit 4 og mnemoteknik "Tynn → Smalere").' },

    { level: 'middel', q: 'En stang af stål (E = 200 GPa) belastes med 100 MPa. Hvad siger Hookes lov om tøjningen?',
      options: ['&epsilon; ≈ 0,0005 = 0,05%', '&epsilon; = 200 GPa / 100 MPa', '&epsilon; ≈ 20 GPa', 'Der er ikke tilstrækkelig data'],
      correct: 0,
      why: '&sigma; = E&epsilon; → &epsilon; = &sigma;/E = 100 MPa / 200 GPa = 100×10⁶ Pa / 200×10⁹ Pa = 0,0005 = 0,05%. Enkel omregning af Hookes lov.' },

    { level: 'middel', q: 'Centroiden er vigtig fordi …',
      options: ['Den er den geometriske tyngdepunkt, og kraftresultanten for uniform spænding ligger der', 'Den ligger altid i midten af tværsnittet', 'Den bestemmer materialets farve', 'Den ændres når materialet strekkes'],
      correct: 0,
      why: 'Centroiden (&x̄, ȳ) er det punkt hvor resultanten af uniform normalspænding virker. Hvis lasten går gennem centroiden, får du rent træk/tryk uden bøjningsmoment (læseguide afsnit 5).' },

    { level: 'middel', q: 'Hvad er forskydningsmodul G, og hvordan hænger det sammen med E?',
      options: ['G er samme som E', 'G = E / (2(1 + &nu;)) — relaterer &tau; og &gamma; via &tau; = G&gamma;', 'G er altid større end E', 'G har enhed meter'],
      correct: 1,
      why: 'G [Pa] er stivhedskonstanten i forskydning: &tau; = G&gamma; analogt til &sigma; = E&epsilon;. Formlen G = E/(2(1+&nu;)) giver G fra E og Poisson-forhold. Stål ~80 GPa (læseguide afsnit 9).' },

    { level: 'middel', q: 'I en boltesamling med double shear er bolten belastet fra begge sider. Hvis Total kraft P virker, hvad er forskydningskraften V i hver plan?',
      options: ['V = P (alt går gennem)', 'V = P/2 (deles mellem to snit)', 'V = 2P (fordobles)', 'V er ubestemt'],
      correct: 1,
      why: 'Double shear betyder bolten er skåret på to steder. Kraften P fordeles: hver snit får V = P/2. Single shear (kun ét snit) får V = P (læseguide afsnit "Double vs. Single Shear").' },

    { level: 'svaer', q: 'En bolt (diameter d_b = 10 mm) i et stål-lag (tykkelse t = 20 mm) udsættes for lateral kontakt-belastning F_b = 50 kN. Hvad er lejespændingen &sigma;<sub>b</sub>?',
      options: ['&sigma;<sub>b</sub> = 50 kN / (π(5mm)²) ≈ 637 MPa', '&sigma;<sub>b</sub> = 50 kN / (t·d<sub>b</sub>) = 50×10³ N / (0,02 m × 0,01 m) = 250 MPa', '&sigma;<sub>b</sub> = 50 kN / 20 mm', 'Kan ikke beregnes uden E'],
      correct: 1,
      why: 'Lejespænding bruger PROJICERET AREAL A_b = t·d_b (rektangel), ikke cirkelareal! &sigma;<sub>b</sub> = F_b / (t·d_b) = 50×10³ / (0,02×0,01) = 250 MPa. Dette er en kritisk huske-punkt (læseguide mnemoteknik "Lejespænding — Projektion, ikke cirkel!").' },

    { level: 'svaer', q: 'Et materiale med E = 200 GPa og &nu; = 0,3 strekkes aksielt med &epsilon; = 0,001. Hvad er Poissons lateral tøjning &epsilon;<sub>lat</sub>, og hvad siger det fysisk?',
      options: ['&epsilon;<sub>lat</sub> = +0,001 (samme som aksial)', '&epsilon;<sub>lat</sub> = −&nu;·&epsilon;<sub>aks</sub> = −0,0003 (materialet bliver smalere)', '&epsilon;<sub>lat</sub> er lig 0,3', 'Lateral tøjning findes ikke'],
      correct: 1,
      why: '&nu; = −(&epsilon;<sub>lat</sub> / &epsilon;<sub>aks</sub>) → &epsilon;<sub>lat</sub> = −&nu;·&epsilon;<sub>aks</sub> = −0,3 × 0,001 = −0,0003. Materialet bliver mindre i tværsnittet når det strekkes aksielt — man kan fornemme det på en gummistrik (læseguide kernebegreb 4).' },

    { level: 'svaer', q: 'I en kompliceret spændingstilstand med enkelt-aksial last gennem centroiden: hvilken af disse udsagn er <b>forkert</b>?',
      options: ['Normalspændingen er uniform over tværsnittet', 'Der er ingen bøjningsmoment', 'Lateral tøjning beregnes fra Poissons forhold', 'Der er ikke uniform spænding over tværsnittet fordi kraft ikke går gennem centroiden'],
      correct: 3,
      why: 'Alle fire har en forskel — den sidste siger at der <b>ikke</b> er uniform spænding når kraft går gennem centroiden. Dette er <b>FORKERT</b>! Når lasten går gennem centroiden, er spændingen uniform. Hvis lasten er ekscentrisk, får du bøjningsmoment og ikke-uniform spænding (læseguide afsnit "Centroiden — Kraft gennem tyngdepunktet").' }
  ],
  cards: [
    { q: 'Hvad er &sigma; og &epsilon;, og hvilken enhed har de?', a: '&sigma; = normalspænding [Pa] = kraft/areal. &epsilon; = normal tøjning [dimensionsløs] = forlængelse/oprindelig længde.' },
    { q: 'Hookes lov i normal- og forskydningsretning?', a: '&sigma; = E&epsilon; for normalretning. &tau; = G&gamma; for forskydning. Begge gælder inden for det elastiske område før flydning.' },
    { q: 'Poissons forhold — hvad er det og hvad betyder det?', a: '&nu; = −(&epsilon;<sub>lat</sub>/&epsilon;<sub>aks</sub>) [dimensionsløs], typisk 0,2–0,35 for metaller. Når materiale strekkes, bliver det smalere.' },
    { q: 'Centroide og kraftresultant?', a: 'Centroiden er det geometriske tyngdepunkt. Hvis aksial last går gennem centroiden, er spændingen uniform uden bøjning.' },
    { q: 'Hvordan beregnes lejespænding &sigma;<sub>b</sub>?', a: '&sigma;<sub>b</sub> = F_b / A_b, hvor A_b = t·d_b (tykkelse × bolt-diameter). VIGTIG: projiceret areal, ikke cirkelareal!' },
    { q: 'Single vs. double shear — hvad er forskellen?', a: 'Single shear: bolt belastet fra én side, V = P. Double shear: belastet fra begge sider, V = P/2 i hver plan.' },
    { q: 'Forskydningsmodul G — formel og værdi?', a: 'G = E / (2(1+&nu;)). Stål ~80 GPa. Relaterer &tau; og &gamma; via &tau; = G&gamma;.' },
    { q: 'Hvad er forskydningstøjning &gamma;?', a: '&gamma; [rad] er ændring i vinkel mellem vinkelrette planer. &gamma; > 0 når vinklen mindskes. For små vinkler: d ≈ t·&gamma;.' }
  ]
};
