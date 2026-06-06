/* MEK2 Quiz — Lektion 2: Aksial belastning
   Kilde: Læseguide GG 2.1–2.6 (8 kernebegreber, 6 formler, praktiske tilfælde).
   12 Q · 3 lette (1pt) / 5 middel (2pt) / 4 svære (3pt) */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['L2_aksial_belastning'] = {
  intro: 'Aksial belastning GG 2.1–2.6: Forlængelse af prismatiske stænger under aksialkraft. Vi lærer lineær fjeder P = k&delta;, stivhed k = EA/L, og forlængelse &delta; = (L/EA)P. Multi-segment belastning beregnes ved summation &delta; = &Sigma;(L/EA)N. Statisk ubestemte stænger løses med ligevægt + kompatibilitet. Spænding på skrå snit: &sigma;&theta; = &sigma;<sub>x</sub>·cos²&theta;, &tau;&theta; = −&sigma;<sub>x</sub>·cos&theta;·sin&theta;.',
  analogi: '⚒ Kerneidé: Stivhed k = EA/L forbinder kraft P og forlængelse &delta;. Jo længere stang, jo større forlængelse. Jo større område eller E, jo mindre forlængelse. Statisk ubestemte problemer kræver kompatibilitet: "endeflytning = 0" eller "samme forlængelse". Skrå snit-analyse roterer koordinater for at finde max spænding på hver vinkel.',
  examQs: [
    'Beregn forlængelse &delta; fra P, L, E, A ved given kraft.',
    'Multi-segment: &delta; = &Sigma;(L<sub>i</sub>/E<sub>i</sub>A<sub>i</sub>)N<sub>i</sub> — summation over alle segmenter.',
    'Statisk ubestemt: reaktioner via kompatibilitet (ingen nettoflytning ved fastgjort ende).',
    'Spændingstransformation: &sigma;&theta; og &tau;&theta; på skrå snit ved vinkel &theta;.'
  ],
  mc: [
    /* LET (3 stk) */
    { level: 'let', q: 'Hvad er enheden for stivhed k?',
      options: ['Pa', 'N/m', 'mm', 'MPa'],
      correct: 1,
      why: 'Stivhed = kraft/forlængelse = N/m (eller N/mm). Enhed for k kommer fra P = k&delta;.' },

    { level: 'let', q: 'I formlen &delta; = (L/EA)P, hvad betyder A?',
      options: ['Acceleration', 'Tværsnitsareal [mm² eller m²]', 'Afstand', 'Amplitud'],
      correct: 1,
      why: 'A = cross-sectional area (tværsnitsareal). Større område → mindre forlængelse (GG 2.2).' },

    { level: 'let', q: 'En prismatisk stang betyder …',
      options: ['Afrundet eller konisk form', 'Konstant tværsnit hele vejen', 'Variable egenskaber langs længden', 'Fladt tværsnit'],
      correct: 1,
      why: 'Prismatisk = uniform tværsnit (samme A fra ende til ende). Dette tillader simple forlængelsesformler som &delta; = (L/EA)P.' },

    /* MIDDEL (5 stk) */
    { level: 'middel', q: 'En stang i to segmenter belastes aksialt. Hvad bruges summation-formlen &delta; = &Sigma;(L<sub>i</sub>/E<sub>i</sub>A<sub>i</sub>)N<sub>i</sub> til?',
      options: ['At finde maksimal kraft', 'At beregne samlet forlængelse fra multiple segmenter med forskellige egenskaber', 'At finde arbejde eller energi', 'At beregne kritisk vrid'],
      correct: 1,
      why: 'Multi-segment forlængelse = sum af hver segments forlængelse. Hver segment bidrager &delta;<sub>i</sub> = (L<sub>i</sub>/E<sub>i</sub>A<sub>i</sub>)N<sub>i</sub> (GG 2.3).' },

    { level: 'middel', q: 'Hvad betyder "statisk ubestemt" struktur i aksial belastning?',
      options: ['Der er flere ligevægtsligninger end ukendte reaktionskræfter', 'Der er flere ukendte reaktionskræfter end ligevægtsligninger', 'Der er ingen løsning på problemet', 'Strukturen er allerede brudt'],
      correct: 1,
      why: 'Statisk ubestemt: antal ukendte > antal ligevægtslgn. Eksempel: stang fastgjort i begge ender. Skal bruge kompatibilitetsbetingelse for at løse (GG 2.4).' },

    { level: 'middel', q: 'I en statisk ubestemt stang fastgjort i begge ender, hvilken ekstra betingelse skal bruges for at finde reaktionerne?',
      options: ['Arbejds-princip', 'Kompatibilitetsligning: samlet forlængelse &delta;<sub>total</sub> = 0 (endeflytning nul)', 'Maksimum-princip', 'Euler-formlen for knækling'],
      correct: 1,
      why: 'Kompatibilitet: da begge ender er faste, kan stangen ikke forlænges eller forkortes netto. &delta;<sub>AB</sub> + &delta;<sub>BC</sub> = 0. Dette giver ekstra ligning for at løse reaktionerne (GG 2.4).' },

    { level: 'middel', q: 'For en skrå snit ved vinkel &theta; = 45° i en stang under aksialt spænding &sigma;<sub>x</sub>, hvad er forskydningsspændingen &tau;&theta;?',
      options: ['&sigma;<sub>x</sub>', '&sigma;<sub>x</sub>/2', '0', '−&sigma;<sub>x</sub>·sin(2·45°) / 2 = −&sigma;<sub>x</sub>/2'],
      correct: 3,
      why: '&tau;&theta; = −&sigma;<sub>x</sub>·cos&theta;·sin&theta; = −&sigma;<sub>x</sub>·(1/√2)·(1/√2) = −&sigma;<sub>x</sub>/2 ved &theta;=45°. Maksimal shear-stress (GG 2.6 Mohr-transform).' },

    { level: 'middel', q: 'Hvad betyder fleksibilitet f, og hvordan hænger det sammen med stivhed k?',
      options: ['f = k²', 'f = 1/k (fleksibilitet er det omvendte af stivhed)', 'f = 2k', 'f og k er uafhængige'],
      correct: 1,
      why: 'Fleksibilitet f [m/N] = 1/k. Stor stivhed → lille fleksibilitet (stiv = mindre bevægelighed). &delta; = f·P = P/k.' },

    /* SVÆR (4 stk) */
    { level: 'svaer', q: 'En tre-segment stang (samme material E) har længder L<sub>1</sub> = 100 mm, L<sub>2</sub> = 200 mm, L<sub>3</sub> = 150 mm og områder A<sub>1</sub> = 50 mm², A<sub>2</sub> = 100 mm², A<sub>3</sub> = 75 mm². Hvilken segment får den maksimale forlængelse under samme kraft P?',
      options: ['Segment 1 (korteste, mindste område)', 'Segment 2 (længste), selvom område er større', 'Segment 3', 'Alle får samme forlængelse (samme kraft)'],
      correct: 1,
      why: '&delta;<sub>i</sub> = (L<sub>i</sub>/EA<sub>i</sub>)P. Segment 2: &delta;<sub>2</sub> = (200/E·100)P = (2/E)P. Segment 1: &delta;<sub>1</sub> = (100/E·50)P = (2/E)P. Segment 3: &delta;<sub>3</sub> = (150/E·75)P = (2/E)P. Alle er egentlig ens! Men hvis områderne varierer mere, større L/A → større &delta; (GG 2.3).' },

    { level: 'svaer', q: 'En statisk ubestemt stang (længde L, område A, modul E) fastgjort i begge ender med kraft P påført i afstand a fra venstre ende (afstand b = L−a til højre). Hvad er reaktionen R<sub>A</sub> ved venstre ende?',
      options: ['R<sub>A</sub> = P/2 (altid halvdelen)', 'R<sub>A</sub> = P·b/(a+b)', 'R<sub>A</sub> = P·a/(a+b)', 'R<sub>A</sub> = P (alt går gennem venstre ende)'],
      correct: 2,
      why: 'Kompatibilitet + ligevægt: &delta;<sub>AB</sub> + &delta;<sub>BC</sub> = 0 → R<sub>A</sub>·a/(EA) = R<sub>B</sub>·b/(EA). Ligevægt: R<sub>A</sub> + R<sub>B</sub> = P. Resultat: R<sub>A</sub> = P·a/(a+b). Længere arm fra kraftpunktet → mindre reaktion (GG 2.4 eksempel).' },

    { level: 'svaer', q: 'En stang påvirkes af aksialt spænding &sigma;<sub>x</sub> = 100 MPa. Snittet drejes til &theta; = 60° fra aksialretningen. Hvad er normalspændingen &sigma;&theta; på det skrå snit?',
      options: ['&sigma;&theta; = 100·cos(60°) = 50 MPa', '&sigma;&theta; = 100·cos²(60°) = 100·(1/2)² = 25 MPa', '&sigma;&theta; = 100·sin(60°) ≈ 86,6 MPa', '&sigma;&theta; = 100 MPa (konstant)'],
      correct: 1,
      why: '&sigma;&theta; = &sigma;<sub>x</sub>·cos²&theta;. Ved &theta;=60°: &sigma;&theta; = 100·(1/2)² = 25 MPa. Normalspænding falder med cos²&theta;, ikke lineært (GG 2.6 Mohr).' },

    { level: 'svaer', q: 'Sammenlign to stænger: Stang 1: A<sub>1</sub> = 100 mm², L<sub>1</sub> = 500 mm, E = 70 GPa. Stang 2: A<sub>2</sub> = 200 mm², L<sub>2</sub> = 250 mm, samme E. Begge får samme kraft P. Hvad er forlængelsesforhold &delta;<sub>1</sub>/&delta;<sub>2</sub>?',
      options: ['&delta;<sub>1</sub>/&delta;<sub>2</sub> = 1/2', '&delta;<sub>1</sub>/&delta;<sub>2</sub> = 2', '&delta;<sub>1</sub>/&delta;<sub>2</sub> = 4', '&delta;<sub>1</sub>/&delta;<sub>2</sub> = 1/4'],
      correct: 2,
      why: '&delta;<sub>1</sub> = (500 / 70·100)P, &delta;<sub>2</sub> = (250 / 70·200)P. Forhold: &delta;<sub>1</sub>/&delta;<sub>2</sub> = (500·200) / (250·100) = (5·2) / 2.5 = 4. Stang 1 forlænges 4× mere fordi længde vægtes stærkt (GG 2.2).' }
  ],
  cards: [
    { q: 'Hvad er forlængelse &delta;, og hvilken enhed har den?', a: '&delta; = længdeændring [mm eller m]. &delta; = (L/EA)P for prismatisk stang under kraft P (GG 2.2).' },
    { q: 'Lineær fjeder P = k&delta; — hvad betyder konstanten k?', a: 'k = EA/L [N/mm eller N/m] er stivhed. Større k → mindre forlængelse ved samme kraft.' },
    { q: 'Multi-segment forlængelse — summation-formlen?', a: '&delta;<sub>total</sub> = &Sigma;(L<sub>i</sub>/E<sub>i</sub>A<sub>i</sub>)N<sub>i</sub>. Hver segment bidrager proportionalt til L/EA (GG 2.3).' },
    { q: 'Statisk ubestemt stang — hvad kræves for løsning?', a: 'Kombination: (1) Ligevægt &Sigma;F = 0, (2) Kompatibilitet (f.eks. &delta;<sub>total</sub> = 0 ved begge ender faste) (GG 2.4).' },
    { q: 'Normalspænding på skrå snit: formlen og hvad &theta; betyder?', a: '&sigma;&theta; = &sigma;<sub>x</sub>·cos²&theta;, hvor &theta; er vinklen fra aksialen. Max ved &theta;=0°, min ved &theta;=90° (GG 2.6).' },
    { q: 'Forskydningsspænding på skrå snit: formlen?', a: '&tau;&theta; = −&sigma;<sub>x</sub>·cos&theta;·sin&theta;. Max ved &theta;=45° (størrelse &sigma;<sub>x</sub>/2) (GG 2.6 Mohr).' },
    { q: 'Hvad betyder "kompatibilitet" i statisk ubestemt aksial belastning?', a: 'Fysisk betingelse: endepunkter kan ikke flytte mere end det fysiske lager tillader. F.eks. stang fastgjort i begge ender: &delta;<sub>total</sub> = 0.' },
    { q: 'Hvorfor falder &sigma;&theta; som cos²&theta;, ikke lineært?', a: 'Tværsnits-areal på skrå snit er A/cos&theta;, men kraft-komponent normalt til snit er P·cos&theta;. Begge ændres → cos²&theta; (GG 2.6).' }
  ]
};
