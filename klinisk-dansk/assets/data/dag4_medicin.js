/* ============================================================
   KLINISK DANSK — Dag 4: Medicin & ordination
   (Medication / prescribing & administration)
   Datamodel: se dag1_kredsloeb.js
   ============================================================ */
window.KD_DAYS = window.KD_DAYS || {};
window.KD_DAYS['dag4'] = {
  no: 4,
  slug: 'medicin',
  titel: 'Medicin & ordination',
  titel_en: 'Medication & prescribing',
  emoji: '💊',
  intro: 'Fjerde dag samler medicin-sproget: forskellen på at ordinere (lægen) og at '
       + 'administrere (sygeplejersken), administrationsveje, dosis, fast vs. p.n., '
       + 'bivirkninger og korrekt dokumentation af given medicin. Kernen er "de rigtige" '
       + 'ved medicingivning.',

  /* -------------------------------------------------- 1. ORDFORRÅD */
  ordforraad: {
    subst: [
      { da:'ordination', en:'order / prescription', koll:'efter lægens ordination',
        eks_da:'Medicinen gives efter lægens ordination.',
        eks_en:'The medication is given as prescribed by the doctor.' },
      { da:'præparat / lægemiddel', en:'preparation / drug', koll:'det ordinerede præparat',
        eks_da:'Kontrollér, at det er det rigtige præparat.',
        eks_en:'Check that it is the correct preparation.' },
      { da:'dosis', en:'dose', koll:'en enkelt dosis',
        eks_da:'Dosis er 500 mg × 3 dagligt.',
        eks_en:'The dose is 500 mg three times daily.' },
      { da:'administrationsvej', en:'route of administration', koll:'peroral administrationsvej',
        eks_da:'Administrationsvejen er peroral (p.o.).',
        eks_en:'The route of administration is oral (p.o.).' },
      { da:'tablet / kapsel', en:'tablet / capsule', koll:'to tabletter',
        eks_da:'Pt. indtager to tabletter med et glas vand.',
        eks_en:'Pt. takes two tablets with a glass of water.' },
      { da:'injektion', en:'injection', koll:'en subkutan injektion',
        eks_da:'Insulin gives som subkutan injektion.',
        eks_en:'Insulin is given as a subcutaneous injection.' },
      { da:'infusion', en:'infusion / drip', koll:'i.v. infusion over 1 time',
        eks_da:'Antibiotika gives som i.v. infusion over 30 min.',
        eks_en:'The antibiotic is given as an i.v. infusion over 30 min.' },
      { da:'bivirkning', en:'side effect', koll:'observere for bivirkninger',
        eks_da:'Pt. observeres for bivirkninger som kvalme og svimmelhed.',
        eks_en:'Pt. is observed for side effects such as nausea and dizziness.' },
      { da:'indikation / kontraindikation', en:'indication / contraindication', koll:'kontraindikation ved allergi',
        eks_da:'Der er kontraindikation pga. kendt penicillinallergi.',
        eks_en:'There is a contraindication due to known penicillin allergy.' },
      { da:'p.n.-medicin (efter behov)', en:'PRN / as-needed medication', koll:'p.n. ved smerter',
        eks_da:'Paracetamol er ordineret p.n. ved smerter, maks. × 4.',
        eks_en:'Paracetamol is prescribed PRN for pain, max. 4 times.' },
      { da:'fast medicin', en:'regular medication', koll:'fast morgenmedicin',
        eks_da:'Den faste medicin gives til morgen kl. 08.',
        eks_en:'The regular medication is given in the morning at 08:00.' },
      { da:'medicinliste / FMK', en:'medication list', koll:'tjekke medicinlisten',
        eks_da:'Ordinationen fremgår af medicinlisten (FMK).',
        eks_en:'The order appears on the medication list.' },
      { da:'allergi', en:'allergy', koll:'kendt allergi',
        eks_da:'Kendt allergi over for penicillin.',
        eks_en:'Known allergy to penicillin.' },
      { da:'virkning / effekt', en:'effect', koll:'ønsket virkning',
        eks_da:'Den ønskede virkning er faldende blodtryk.',
        eks_en:'The desired effect is a falling blood pressure.' },
      { da:'gennembrudssmerte', en:'breakthrough pain', koll:'p.n. ved gennembrudssmerte',
        eks_da:'P.n.-morfin gives ved gennembrudssmerte.',
        eks_en:'PRN morphine is given for breakthrough pain.' }
    ],
    verb: [
      { da:'at ordinere', en:'to prescribe / order', koll:'lægen ordinerer',
        eks_da:'Lægen ordinerer furosemid 40 mg i.v.',
        eks_en:'The doctor prescribes furosemide 40 mg i.v.' },
      { da:'at administrere', en:'to administer', koll:'administrere efter ordination',
        eks_da:'Sygeplejersken administrerer medicinen efter ordination.',
        eks_en:'The nurse administers the medication as prescribed.' },
      { da:'at dispensere', en:'to dispense', koll:'dispensere til doseringsæske',
        eks_da:'Medicinen dispenseres til doseringsæske dagen før.',
        eks_en:'The medication is dispensed into a dosette box the day before.' },
      { da:'at seponere', en:'to discontinue / stop', koll:'seponere præparatet',
        eks_da:'Præparatet seponeres pga. bivirkninger.',
        eks_en:'The preparation is discontinued due to side effects.' },
      { da:'at pausere', en:'to pause / withhold', koll:'pausere blodtryksmedicin',
        eks_da:'Blodtryksmedicinen pauseres ved lavt BT.',
        eks_en:'The blood-pressure medication is withheld at low BP.' },
      { da:'at optrappe / nedtrappe', en:'to titrate up / down', koll:'nedtrappe dosis',
        eks_da:'Dosis nedtrappes gradvist over en uge.',
        eks_en:'The dose is tapered down gradually over a week.' },
      { da:'at indtage', en:'to take (orally)', koll:'indtage tabletten',
        eks_da:'Pt. indtager tabletten selv.',
        eks_en:'Pt. takes the tablet themselves.' },
      { da:'at injicere', en:'to inject', koll:'injicere subkutant',
        eks_da:'Insulinen injiceres subkutant i maveskindet.',
        eks_en:'The insulin is injected subcutaneously into the abdomen.' },
      { da:'at kontrollere (dobbeltkontrol)', en:'to double-check', koll:'dobbeltkontrollere dosis',
        eks_da:'Risikomedicin dobbeltkontrolleres af to sygeplejersker.',
        eks_en:'High-risk medication is double-checked by two nurses.' },
      { da:'at observere (for bivirkninger)', en:'to observe / monitor', koll:'observere for bivirkninger',
        eks_da:'Pt. observeres for bivirkninger efter første dosis.',
        eks_en:'Pt. is observed for side effects after the first dose.' }
    ],
    adj: [
      { da:'peroral (p.o.)', en:'oral', koll:'peroral administration',
        eks_da:'Tabletten gives peroralt (p.o.).',
        eks_en:'The tablet is given orally (p.o.).' },
      { da:'intravenøs (i.v.)', en:'intravenous', koll:'i.v. antibiotika',
        eks_da:'Antibiotika gives intravenøst.',
        eks_en:'The antibiotic is given intravenously.' },
      { da:'intramuskulær (i.m.)', en:'intramuscular', koll:'i.m. injektion',
        eks_da:'Vaccinen gives intramuskulært i overarmen.',
        eks_en:'The vaccine is given intramuscularly in the upper arm.' },
      { da:'subkutan (s.c.)', en:'subcutaneous', koll:'s.c. injektion',
        eks_da:'Morfin 5 mg gives subkutant.',
        eks_en:'Morphine 5 mg is given subcutaneously.' },
      { da:'sublingual', en:'sublingual (under the tongue)', koll:'sublingual nitroglycerin',
        eks_da:'Nitroglycerin gives sublingualt.',
        eks_en:'Nitroglycerin is given sublingually.' },
      { da:'transdermal', en:'transdermal (via skin patch)', koll:'transdermalt plaster',
        eks_da:'Smertestillende gives som transdermalt plaster.',
        eks_en:'The analgesic is given as a transdermal patch.' },
      { da:'fast / p.n.', en:'regular / as-needed', koll:'fast eller p.n.',
        eks_da:'Skeln mellem fast medicin og p.n.-medicin.',
        eks_en:'Distinguish between regular medication and PRN medication.' },
      { da:'receptpligtig', en:'prescription-only', koll:'receptpligtigt lægemiddel',
        eks_da:'Præparatet er receptpligtigt.',
        eks_en:'The preparation is prescription-only.' }
    ]
  },

  /* -------------------------------------------------- 2. DOKUMENTATION */
  dokumentation: {
    regler: [
      { da:'Skeln skarpt: LÆGEN ordinerer, SYGEPLEJERSKEN administrerer. Skriv aldrig "gav bare medicinen".',
        en:'Distinguish clearly: the DOCTOR prescribes, the NURSE administers. Never "just gave the meds".' },
      { da:'Dokumentér altid: præparat, dosis, administrationsvej, tidspunkt og "efter ordination".',
        en:'Always document: preparation, dose, route, time and "as prescribed".' },
      { da:'Følg "de rigtige": rigtige patient, præparat, dosis, tid, administrationsvej — + dokumentation og virkning.',
        en:'Follow the "rights": right patient, drug, dose, time, route — + documentation and effect.' },
      { da:'Dokumentér virkning OG bivirkning: "VAS 7→2 efter 30 min; ingen kvalme observeret".',
        en:'Document effect AND side effects.' },
      { da:'Ved p.n.-medicin: notér indikationen ("p.n. ved smerte VAS ≥ 4") og at maksimum ikke overskrides.',
        en:'For PRN: note the indication and that the maximum is not exceeded.' },
      { da:'Hvis medicin IKKE gives: dokumentér hvorfor (pauseret/afvist/faste) — et tomt felt er ikke dokumentation.',
        en:'If medication is NOT given: document why (withheld/refused/fasting) — a blank is not documentation.' }
    ],
    par: [
      { daarlig:'Gav ham hans piller som altid.',
        god:'Fast morgenmedicin administreret p.o. kl. 08.00 efter ordination: metoprolol 50 mg, atorvastatin 40 mg.',
        hvorfor:'"Pillerne som altid" er ikke dokumentation. Angiv præparat(er), dosis, vej, tid og "efter ordination".' },
      { daarlig:'Lægen sagde noget om at give ekstra vanddrivende, så det gjorde jeg.',
        god:'Furosemid 40 mg administreret i.v. efter lægens ordination kl. 10.15; diurese tiltager, vægt kontrolleres.',
        hvorfor:'Adskil ordination (lægen) fra administration (dig) præcist, med præparat, dosis, vej, tid og opfølgning.' },
      { daarlig:'Smertestillende p.n. — gav noget morfin.',
        god:'Morfin 5 mg administreret s.c. p.n. ved gennembrudssmerte (VAS 8/10) kl. 13.40 efter ordination; VAS 3/10 efter 30 min. 2. dosis inden for maks.',
        hvorfor:'Ved p.n. skal indikation (hvorfor), dosis, vej, tid, effekt og at maksimum overholdes fremgå.' },
      { daarlig:'Blodtryksmedicinen tog jeg lige væk i dag.',
        god:'Amlodipin pauseret til morgen pga. BT 92/54 efter aftale med lægen; genoptages ved BT > 110 systolisk.',
        hvorfor:'"Tog lige væk" mangler begrundelse og aftale. Notér hvorfor (lavt BT), efter aftale med hvem, og betingelsen for genoptagelse.' },
      { daarlig:'Han ville ikke tage sin medicin.',
        god:'Pt. afviser aftenmedicin kl. 20; angiver kvalme. Informeret om formålet. Medicin ikke givet, lægen orienteret.',
        hvorfor:'Ved afvisning: dokumentér handlingen, patientens begrundelse i egne ord, din information og at lægen er orienteret — ikke bare "ville ikke".' }
    ]
  },

  /* -------------------------------------------------- 3. PATIENTNOTAT */
  notat: {
    titel: 'Sygeplejenotat — medicinadministration, medicinsk afdeling',
    note_da:
      'Medicingivning morgen kl. 08.00: Fast medicin administreret p.o. efter ordination — '
      + 'metoprolol 50 mg, atorvastatin 40 mg, pantoprazol 40 mg. Identitet kontrolleret mod '
      + 'medicinlisten. BT før metoprolol 138/84, puls 76, derfor givet. Insulin (Novorapid '
      + '8 IE) administreret subkutant efter ordination, dobbeltkontrolleret af kollega. '
      + 'Kl. 13.40: Pt. angiver gennembrudssmerte VAS 8/10; morfin 5 mg administreret s.c. '
      + 'p.n. efter ordination; VAS 3/10 efter 30 min., ingen respirationspåvirkning. '
      + 'Amlodipin pauseret til aften pga. BT 96/58 efter aftale med lægen; genoptages ved '
      + 'systolisk BT > 110. Pt. observeret for bivirkninger, ingen bemærket.',
    note_en:
      'Medication round 08:00: Regular medication administered p.o. as prescribed — metoprolol '
      + '50 mg, atorvastatin 40 mg, pantoprazole 40 mg. Identity checked against the medication '
      + 'list. BP before metoprolol 138/84, pulse 76, therefore given. Insulin (Novorapid 8 IU) '
      + 'administered subcutaneously as prescribed, double-checked by a colleague. At 13:40: Pt. '
      + 'reports breakthrough pain VAS 8/10; morphine 5 mg administered s.c. PRN as prescribed; '
      + 'VAS 3/10 after 30 min, no respiratory depression. Amlodipine withheld this evening due '
      + 'to BP 96/58 by agreement with the doctor; to resume at systolic BP > 110. Pt. observed '
      + 'for side effects, none noted.',
    ovelser: [
      { type:'omskriv',
        sporg:'Omskriv fagligt: "Gav ham hans sædvanlige morgenpiller."',
        facit:'Fast morgenmedicin administreret p.o. efter ordination kl. 08.00: metoprolol 50 mg, atorvastatin 40 mg, pantoprazol 40 mg.',
        hjaelp:'Angiv præparat(er) + dosis + vej + tid + "efter ordination".' },
      { type:'omskriv',
        sporg:'Omskriv: "Han havde ondt, så jeg gav lidt morfin, det hjalp."',
        facit:'Pt. angiver gennembrudssmerte VAS 8/10; morfin 5 mg administreret s.c. p.n. efter ordination; VAS 3/10 efter 30 min.',
        hjaelp:'Ved p.n.: indikation (VAS) + dosis + vej + "p.n. efter ordination" + målt effekt.' },
      { type:'udfyld',
        sporg:'Udfyld verbet: "Lægen ______ furosemid 40 mg i.v.; sygeplejersken ______ det efter ordination."',
        facit:'ordinerer … administrerer',
        hjaelp:'Hvem beslutter (lægen __), og hvem giver (sygeplejersken __)?' },
      { type:'udfyld',
        sporg:'Udfyld: "Amlodipin ______ til aften pga. BT 96/58 efter aftale med lægen."',
        facit:'pauseret',
        hjaelp:'Man stopper midlertidigt en dosis pga. lavt blodtryk — hvad hedder det?' },
      { type:'spot',
        sporg:'Find fejlen i dokumentationen: "Gav noget vanddrivende. Virkede vist. Pt. lidt besværlig."',
        facit:'Mangler præparat/dosis/vej/tid/"efter ordination" og målt effekt; desuden er "lidt besværlig" en personlig vurdering.',
        hjaelp:'To problemer: manglende medicin-detaljer OG en vurderende bemærkning.' }
    ]
  },

  /* -------------------------------------------------- 4. QUIZ */
  quiz: {
    mc: [
      { level:'let',
        q:'Hvem <b>ordinerer</b> medicinen?',
        options:['Sygeplejersken','Lægen','Patienten','Apoteket'],
        correct:1,
        why:'<b>Lægen ordinerer</b> (beslutter). Sygeplejersken <b>administrerer</b> (giver) efter ordination.' },
      { level:'let',
        q:'Hvad betyder <b>p.n.-medicin</b>?',
        options:['Fast medicin hver dag','Medicin efter behov','Medicin der er stoppet','Intravenøs medicin'],
        correct:1,
        why:'P.n. (pro necessitate) = efter behov, fx smertestillende ved gennembrudssmerte inden for et maksimum.' },
      { level:'let',
        q:'Hvad er <b>administrationsvejen</b> ved "p.o."?',
        options:['I en vene','Under huden','Gennem munden (peroralt)','Under tungen'],
        correct:2,
        why:'p.o. = peroral = gennem munden. i.v. = i vene, s.c. = subkutant, sublingual = under tungen.' },
      { level:'middel',
        q:'Hvilket verbum passer: "Præparatet ______ pga. alvorlige bivirkninger" (stoppes helt)?',
        options:['pauseres','seponeres','dispenseres','optrappes'],
        correct:1,
        why:'<b>At seponere</b> = stoppe helt. <b>At pausere</b> = midlertidigt. <b>At dispensere</b> = klargøre/lægge i æske.' },
      { level:'middel',
        q:'Hvad SKAL altid med, når du dokumenterer given medicin?',
        options:['Kun præparatets navn','Præparat, dosis, administrationsvej, tidspunkt, "efter ordination"','Kun tidspunktet','Patientens humør'],
        correct:1,
        why:'Minimumsdokumentation: præparat, dosis, vej, tid og at det skete efter ordination — gerne også virkning.' },
      { level:'middel',
        q:'Medicin blev IKKE givet. Hvad gør du dokumentationsmæssigt?',
        options:['Lader feltet stå tomt','Dokumenterer hvorfor (pauseret/afvist/faste)','Skriver "glemt"','Ingenting'],
        correct:1,
        why:'Et tomt felt er ikke dokumentation. Notér hvorfor medicinen ikke blev givet og evt. aftale/handling.' },
      { level:'middel',
        q:'Hvilket verbum passer: "Risikomedicin ______ af to sygeplejersker før administration"?',
        options:['seponeres','dobbeltkontrolleres','indtages','pauseres'],
        correct:1,
        why:'<b>At dobbeltkontrollere</b> = to personer tjekker uafhængigt (fx insulin, morfin) før det gives.' },
      { level:'svaer',
        q:'Hvilken p.n.-dokumentation er komplet?',
        options:[
          'Gav lidt morfin, det hjalp.',
          'Morfin 5 mg s.c. p.n. ved gennembrudssmerte VAS 8/10 kl. 13.40 efter ordination; VAS 3/10 efter 30 min., maks. ikke overskredet.',
          'Smertestillende givet.',
          'Han fik noget mod smerterne.'],
        correct:1,
        why:'Mulighed 2 har indikation (VAS), dosis, vej, "p.n. efter ordination", tid, målt effekt og at maksimum overholdes.' },
      { level:'svaer',
        q:'Hvorfor dokumenteres "BT før metoprolol 138/84, derfor givet"?',
        options:[
          'For at fylde journalen',
          'Fordi visse præparater kun må gives på betingelser — dokumentationen viser at betingelsen blev tjekket',
          'Det er ligegyldigt',
          'For at vise humøret'],
        correct:1,
        why:'Betinget medicin (fx BT-/pulssænkende) kræver kontrol før givning. At notere værdien viser, at du fulgte ordinationens betingelse.' },
      { level:'svaer',
        q:'En patient afviser sin aftenmedicin. Hvad er den BEDSTE note?',
        options:[
          'Ville ikke tage medicin.',
          'Pt. afviser aftenmedicin kl. 20; angiver kvalme. Informeret om formålet. Medicin ikke givet, lægen orienteret.',
          'Nægtede, typisk ham.',
          'Sprang medicinen over.'],
        correct:1,
        why:'Mulighed 2 dokumenterer handlingen, patientens begrundelse i egne ord, din information og at lægen er orienteret — objektivt og handlingsanvisende.' }
    ],
    cards: [
      { q:'at ordinere vs. at administrere', a:'to prescribe (lægen beslutter) vs. to administer (sygeplejersken giver).' },
      { q:'efter ordination', a:'as prescribed — skal med hver gang medicin dokumenteres.' },
      { q:'p.n.-medicin', a:'PRN / as-needed — notér indikation + at maksimum ikke overskrides.' },
      { q:'fast medicin', a:'regular medication — gives til faste tidspunkter.' },
      { q:'p.o. · i.v. · i.m. · s.c. · sublingual', a:'oral · intravenous · intramuscular · subcutaneous · under the tongue.' },
      { q:'at seponere / at pausere', a:'to discontinue (stoppe helt) / to withhold (midlertidigt).' },
      { q:'at dispensere', a:'to dispense — klargøre/lægge medicin i doseringsæske.' },
      { q:'at dobbeltkontrollere', a:'to double-check — to sygeplejersker tjekker risikomedicin.' },
      { q:'dosis · administrationsvej', a:'dose · route of administration — kernedata ved hver givning.' },
      { q:'bivirkning / kontraindikation', a:'side effect / contraindication (fx allergi).' },
      { q:'de "rigtige"', a:'the rights: rigtige patient, præparat, dosis, tid, vej + dokumentation + virkning.' },
      { q:'ikke givet — dokumentér hvorfor', a:'if not given, document why (pauseret/afvist/faste) — blank ≠ dokumentation.' }
    ]
  }
};
