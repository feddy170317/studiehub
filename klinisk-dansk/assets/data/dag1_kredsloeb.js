/* ============================================================
   KLINISK DANSK — Dag 1: Kredsløb & blodtryk
   (Cardiovascular / blood pressure)

   Single source of truth for BOTH the HTML app and the PDF.
   Consumed via the global window.KD_DAYS['dag1'].

   Data model:
     ordforraad : [{ da, ordklasse:'subst|verb|adj', en, koll, eks_da, eks_en }]
     dokumentation : { regler:[...], par:[{ daarlig, god, hvorfor }] }
     notat : { titel, note_da, note_en, ovelser:[{ type, sporg, facit, hjaelp }] }
     quiz : { mc:[{ level, q, options, correct, why }], cards:[{ q, a }] }
   ============================================================ */
window.KD_DAYS = window.KD_DAYS || {};
window.KD_DAYS['dag1'] = {
  no: 1,
  slug: 'kredsloeb',
  titel: 'Kredsløb & blodtryk',
  titel_en: 'Circulation & blood pressure',
  emoji: '🫀',
  intro: 'Første dag handler om hjertet, karrene og blodtrykket — og om at beskrive '
       + 'det, du ser og måler, i objektivt fagsprog. Fokus: puls, blodtryk, '
       + 'iltmætning, brystsmerter og perifer cirkulation.',

  /* -------------------------------------------------- 1. ORDFORRÅD */
  ordforraad: {
    /* Substantiver — organer, symptomer, måleværdier */
    subst: [
      { da:'hjertet',            en:'the heart',                     koll:'hjertet pumper blodet rundt',
        eks_da:'Hjertet pumper iltet blod ud i det store kredsløb.',
        eks_en:'The heart pumps oxygenated blood into the systemic circulation.' },
      { da:'blodkar / kar',      en:'blood vessel',                  koll:'et kar / karrene',
        eks_da:'Karrene i benene er svære at palpere pga. ødem.',
        eks_en:'The vessels in the legs are hard to palpate due to oedema.' },
      { da:'arterie (pulsåre)',  en:'artery',                        koll:'arteriel blødning',
        eks_da:'Blodet i en arterie er iltrigt og lyserødt.',
        eks_en:'Blood in an artery is oxygen-rich and bright red.' },
      { da:'vene (blodåre)',     en:'vein',                          koll:'perifert venekateter (PVK)',
        eks_da:'Der anlægges et perifert venekateter i venstre underarm.',
        eks_en:'A peripheral venous catheter is inserted in the left forearm.' },
      { da:'kapillær (hårkar)',  en:'capillary',                     koll:'kapillærrespons (CR)',
        eks_da:'Kapillærresponsen er under 2 sekunder — normal.',
        eks_en:'Capillary refill is under 2 seconds — normal.' },
      { da:'hjerteklap',         en:'heart valve',                   koll:'utæt hjerteklap',
        eks_da:'Der høres en mislyd fra en af hjerteklapperne.',
        eks_en:'A murmur is heard from one of the heart valves.' },
      { da:'blodtryk (BT)',      en:'blood pressure (BP)',           koll:'måle blodtrykket',
        eks_da:'BT måles til 138/86 mmHg i højre arm.',
        eks_en:'BP is measured at 138/86 mmHg in the right arm.' },
      { da:'det systoliske tryk',en:'systolic pressure',             koll:'systolisk over 140',
        eks_da:'Det systoliske tryk er forhøjet.',
        eks_en:'The systolic pressure is elevated.' },
      { da:'det diastoliske tryk',en:'diastolic pressure',           koll:'diastolisk under 90',
        eks_da:'Det diastoliske tryk ligger stabilt omkring 80.',
        eks_en:'The diastolic pressure stays stable around 80.' },
      { da:'puls',               en:'pulse',                         koll:'palpere pulsen / pulsen er kraftig',
        eks_da:'Pulsen er 102 og regelmæssig.',
        eks_en:'The pulse is 102 and regular.' },
      { da:'hjertefrekvens (HF)',en:'heart rate (HR)',               koll:'HF stiger ved anstrengelse',
        eks_da:'HF falder til 68 efter hvile.',
        eks_en:'HR drops to 68 after rest.' },
      { da:'iltmætning / saturation (SAT)', en:'oxygen saturation',  koll:'saturation på atmosfærisk luft',
        eks_da:'Saturation 96 % på atmosfærisk luft.',
        eks_en:'Saturation 96 % on room air.' },
      { da:'brystsmerter',       en:'chest pain',                    koll:'trykkende brystsmerter',
        eks_da:'Pt. angiver trykkende brystsmerter med udstråling til venstre arm.',
        eks_en:'Pt. reports pressing chest pain radiating to the left arm.' },
      { da:'hjertebanken / palpitationer', en:'palpitations',        koll:'anfald af hjertebanken',
        eks_da:'Pt. beskriver anfald af hjertebanken i hvile.',
        eks_en:'Pt. describes episodes of palpitations at rest.' },
      { da:'ødem',               en:'oedema / swelling',             koll:'perifert ødem, ankelødem',
        eks_da:'Der ses bilateralt ankelødem, gradtrykbart.',
        eks_en:'Bilateral ankle oedema is seen, pitting.' },
      { da:'blodprop (trombe)',  en:'blood clot / thrombus',         koll:'blodprop i benet (DVT)',
        eks_da:'Mistanke om blodprop i venstre underben.',
        eks_en:'Suspicion of a blood clot in the left lower leg.' },
      { da:'hjerteinfarkt (AMI)',en:'myocardial infarction',        koll:'akut hjerteinfarkt',
        eks_da:'Symptomerne rejser mistanke om akut hjerteinfarkt.',
        eks_en:'The symptoms raise suspicion of an acute myocardial infarction.' },
      { da:'ordination',         en:'order / prescription',          koll:'efter lægens ordination',
        eks_da:'Nitroglycerin gives efter ordination.',
        eks_en:'Nitroglycerin is given as prescribed (per the order).' },
      { da:'kredsløbet',         en:'the circulation',               koll:'stabilt kredsløb',
        eks_da:'Pt. er kredsløbsmæssigt stabil.',
        eks_en:'Pt. is haemodynamically (circulatory) stable.' }
    ],
    /* Verber — sygepleje-handlinger */
    verb: [
      { da:'at observere',   en:'to observe',           koll:'observere for ændringer',
        eks_da:'Pt. observeres for ændringer i bevidsthedsniveau.',
        eks_en:'Pt. is observed for changes in level of consciousness.' },
      { da:'at måle',        en:'to measure',           koll:'måle BT og puls',
        eks_da:'Der måles BT, puls og saturation hver time.',
        eks_en:'BP, pulse and saturation are measured every hour.' },
      { da:'at palpere',     en:'to palpate',           koll:'palpere pulsen / palpere maven',
        eks_da:'Radialispulsen palperes kraftig og regelmæssig.',
        eks_en:'The radial pulse is palpated strong and regular.' },
      { da:'at auskultere',  en:'to auscultate',        koll:'auskultere hjerte og lunger',
        eks_da:'Hjertet auskulteres uden mislyde.',
        eks_en:'The heart is auscultated without murmurs.' },
      { da:'at monitorere',  en:'to monitor',           koll:'monitorere kredsløbet',
        eks_da:'Pt. monitoreres kontinuerligt med EKG.',
        eks_en:'Pt. is continuously monitored with ECG.' },
      { da:'at administrere',en:'to administer',        koll:'administrere medicin efter ordination',
        eks_da:'Furosemid 40 mg administreres i.v. efter ordination.',
        eks_en:'Furosemide 40 mg is administered i.v. as prescribed.' },
      { da:'at ordinere',    en:'to prescribe / order', koll:'lægen ordinerer',
        eks_da:'Lægen ordinerer ilt 2 l/min på næsekateter.',
        eks_en:'The doctor prescribes oxygen 2 l/min via nasal cannula.' },
      { da:'at dokumentere', en:'to document',          koll:'dokumentere i journalen',
        eks_da:'Observationerne dokumenteres i sygeplejejournalen.',
        eks_en:'The observations are documented in the nursing record.' },
      { da:'at registrere',  en:'to record',            koll:'registrere værdierne',
        eks_da:'Værdierne registreres i observationsskemaet.',
        eks_en:'The values are recorded in the observation chart.' },
      { da:'at angive',      en:'to report / state (patient)', koll:'pt. angiver smerter',
        eks_da:'Pt. angiver smerter svarende til 6 på VAS-skalaen.',
        eks_en:'Pt. reports pain corresponding to 6 on the VAS scale.' },
      { da:'at klage over',  en:'to complain of',       koll:'klage over svimmelhed',
        eks_da:'Pt. klager over svimmelhed ved sengekanten.',
        eks_en:'Pt. complains of dizziness at the edge of the bed.' },
      { da:'at desaturere',  en:'to desaturate',        koll:'desaturere ved aktivitet',
        eks_da:'Pt. desaturerer til 88 % ved gang på gangen.',
        eks_en:'Pt. desaturates to 88 % when walking in the corridor.' }
    ],
    /* Adjektiver — beskrivelser af symptomer og værdier */
    adj: [
      { da:'regelmæssig / uregelmæssig', en:'regular / irregular', koll:'regelmæssig puls',
        eks_da:'Pulsen er uregelmæssig — mistanke om atrieflimren.',
        eks_en:'The pulse is irregular — suspicion of atrial fibrillation.' },
      { da:'forhøjet',       en:'elevated',             koll:'forhøjet blodtryk',
        eks_da:'Blodtrykket er forhøjet gennem hele vagten.',
        eks_en:'The blood pressure is elevated throughout the shift.' },
      { da:'hypertensiv',    en:'hypertensive (high BP)',koll:'hypertensiv krise',
        eks_da:'Pt. er hypertensiv med BT 178/104.',
        eks_en:'Pt. is hypertensive with BP 178/104.' },
      { da:'hypotensiv',     en:'hypotensive (low BP)', koll:'hypotensiv ved rejsning',
        eks_da:'Pt. bliver hypotensiv ved skift til stående (ortostatisk).',
        eks_en:'Pt. becomes hypotensive when standing up (orthostatic).' },
      { da:'takykard',       en:'tachycardic (fast HR)',koll:'takykard i hvile',
        eks_da:'Pt. er takykard med HF 118 i hvile.',
        eks_en:'Pt. is tachycardic with HR 118 at rest.' },
      { da:'bradykard',      en:'bradycardic (slow HR)',koll:'bradykard om natten',
        eks_da:'Pt. er bradykard med HF 46 under søvn.',
        eks_en:'Pt. is bradycardic with HR 46 during sleep.' },
      { da:'perifer',        en:'peripheral',           koll:'perifer cirkulation',
        eks_da:'Den perifere cirkulation i tæerne er nedsat.',
        eks_en:'The peripheral circulation in the toes is reduced.' },
      { da:'kold og klam',   en:'cold and clammy',      koll:'kold og klam hud',
        eks_da:'Huden er kold og klam, pt. er bleg.',
        eks_en:'The skin is cold and clammy, pt. is pale.' },
      { da:'marmoreret',     en:'mottled',              koll:'marmoreret hud på knæene',
        eks_da:'Huden på knæene er marmoreret — tegn på dårlig cirkulation.',
        eks_en:'The skin on the knees is mottled — a sign of poor circulation.' },
      { da:'jagende / skarp',en:'sharp / stabbing',     koll:'jagende smerte',
        eks_da:'Pt. beskriver en jagende smerte ved indånding.',
        eks_en:'Pt. describes a sharp pain on inhalation.' },
      { da:'dump',           en:'dull',                 koll:'dump smerte',
        eks_da:'En dump, murrende smerte bag brystbenet.',
        eks_en:'A dull, aching pain behind the sternum.' },
      { da:'murrende',       en:'aching / nagging',     koll:'murrende ubehag',
        eks_da:'Pt. angiver murrende ubehag i brystet.',
        eks_en:'Pt. reports aching discomfort in the chest.' },
      { da:'trykkende',      en:'pressing / squeezing', koll:'trykkende brystsmerter',
        eks_da:'Trykkende brystsmerter, som ved en snørende fornemmelse.',
        eks_en:'Pressing chest pain, like a constricting sensation.' },
      { da:'bleg',           en:'pale',                 koll:'bleg og forpint',
        eks_da:'Pt. er bleg og forpint ved ankomst.',
        eks_en:'Pt. is pale and distressed on arrival.' },
      { da:'cyanotisk',      en:'cyanotic (bluish)',    koll:'cyanotiske læber',
        eks_da:'Læberne er let cyanotiske.',
        eks_en:'The lips are slightly cyanotic.' }
    ]
  },

  /* -------------------------------------------------- 2. DOKUMENTATION */
  dokumentation: {
    regler: [
      { da:'Skriv objektivt — beskriv hvad du ser, hører og måler, ikke hvad du tror eller føler.',
        en:'Write objectively — describe what you see, hear and measure, not what you think or feel.' },
      { da:'Ingen personlig vurdering. Undgå ord som "virker", "ser ud til", "er sød/besværlig".',
        en:'No personal judgement. Avoid words like "seems", "looks like", "is nice/difficult".' },
      { da:'Adskil hvad patienten SIGER fra hvad du OBSERVERER. Brug "pt. angiver …" for det subjektive.',
        en:'Separate what the patient SAYS from what you OBSERVE. Use "pt. reports …" for the subjective.' },
      { da:'Brug tal og enheder: BT 138/86 mmHg, puls 102, SAT 96 %, VAS 6/10.',
        en:'Use numbers and units: BP 138/86 mmHg, pulse 102, SAT 96 %, VAS 6/10.' },
      { da:'Angiv altid betingelsen for en måling: "SAT 92 % på atmosfærisk luft" vs. "på 2 l ilt".',
        en:'Always state the condition of a measurement: "SAT 92 % on room air" vs. "on 2 l oxygen".' },
      { da:'Skriv i datid/nutid, kort og telegramagtigt. Forkortelser: pt. (patient), i.v., p.n. (efter behov).',
        en:'Write in past/present tense, short and telegraphic. Abbreviations: pt., i.v., p.n. (as needed).' }
    ],
    par: [
      { daarlig:'Pt. virker dårlig og har vist lidt ondt i brystet.',
        god:'Pt. angiver trykkende brystsmerter VAS 6/10 med udstråling til venstre arm. BT 165/98, puls 102 regelmæssig, SAT 95 % på atm. luft, hud kold og klam.',
        hvorfor:'"Virker dårlig" og "vist lidt" er vurdering og gætteri. Den gode note adskiller det subjektive (pt. angiver) fra objektive målte værdier med tal og enheder.' },
      { daarlig:'Gav ham hans hjertemedicin.',
        god:'Metoprolol 50 mg administreret p.o. kl. 08.00 efter ordination.',
        hvorfor:'Dokumentér præparat, dosis, administrationsvej, tidspunkt og at det skete efter ordination — aldrig bare "medicinen".' },
      { daarlig:'Pt. er sur og vil ikke samarbejde om blodtrykket.',
        god:'Pt. afviser BT-måling kl. 10 og angiver, at han "vil have ro". BT ikke målt. Informeret om formålet, forsøges igen kl. 12.',
        hvorfor:'"Sur" og "vil ikke samarbejde" er en personlig, negativ vurdering. Beskriv i stedet handlingen (afviser), patientens egne ord i citat, og hvad du gør ved det.' },
      { daarlig:'Saturationen var fin.',
        god:'SAT 97 % på atmosfærisk luft, upåvirket respiration, RF 16.',
        hvorfor:'"Fin" siger intet. Angiv den målte værdi, betingelsen (atm. luft/ilt) og gerne respirationsfrekvensen.' },
      { daarlig:'Benene er lidt hævede, tror det er væske.',
        god:'Bilateralt ankelødem, gradtrykbart. Vægt +1,3 kg ift. i går. Lægen orienteret.',
        hvorfor:'Erstat "tror" og "lidt" med en objektiv beskrivelse (bilateralt, gradtrykbart), et måltal (vægtændring) og handlingen (lægen orienteret).' }
    ]
  },

  /* -------------------------------------------------- 3. PATIENTNOTAT */
  notat: {
    titel: 'Sygeplejenotat — indlæggelse, medicinsk afdeling',
    note_da:
      'Pt. 74-årig mand indlagt kl. 21.40 med trykkende brystsmerter opstået i hvile, '
      + 'VAS 7/10, med udstråling til venstre skulder. Pt. bleg og klamtsvedende. '
      + 'BT 178/102 mmHg, puls 108 uregelmæssig, SAT 93 % på atmosfærisk luft, RF 22, temp. 37,1 °C. '
      + 'Perifert kølige ekstremiteter, kapillærrespons 3 sek. '
      + 'Nitroglycerin 0,5 mg gives sublingualt efter ordination kl. 21.55; smerte falder til VAS 3/10. '
      + 'Ilt 2 l/min ordineret og påbegyndt; SAT stiger til 96 %. Pt. monitoreres med EKG. Lægen tilser.',
    note_en:
      'Pt. 74-year-old man admitted 21:40 with pressing chest pain arising at rest, '
      + 'VAS 7/10, radiating to the left shoulder. Pt. pale and clammy/sweaty. '
      + 'BP 178/102 mmHg, pulse 108 irregular, SAT 93 % on room air, RR 22, temp 37.1 °C. '
      + 'Peripherally cool extremities, capillary refill 3 sec. '
      + 'Nitroglycerin 0.5 mg given sublingually as prescribed at 21:55; pain drops to VAS 3/10. '
      + 'Oxygen 2 l/min prescribed and started; SAT rises to 96 %. Pt. monitored with ECG. Doctor attends.',
    ovelser: [
      { type:'omskriv',
        sporg:'Omskriv til objektivt fagsprog: "Den gamle mand så virkelig dårlig ud og havde det skidt med brystet."',
        facit:'Pt. er bleg og forpint, angiver trykkende brystsmerter VAS 7/10 med udstråling til venstre skulder.',
        hjaelp:'Fjern vurderingen ("så dårlig ud", "havde det skidt"). Brug "pt. angiver" + tal + placering.' },
      { type:'omskriv',
        sporg:'Omskriv: "Gav ham noget under tungen og det hjalp på smerten."',
        facit:'Nitroglycerin 0,5 mg administreret sublingualt efter ordination; smerte falder fra VAS 7/10 til 3/10.',
        hjaelp:'Navngiv præparat, dosis, vej (sublingualt), "efter ordination" og den målte effekt.' },
      { type:'udfyld',
        sporg:'Udfyld verbet: "SAT 93 % på atmosfærisk luft. Ilt 2 l/min ______ og påbegyndt; SAT stiger til 96 %."',
        facit:'ordineret',
        hjaelp:'Hvem bestemmer, at ilt skal gives? Lægen __ det.' },
      { type:'udfyld',
        sporg:'Udfyld verbet: "Metoprolol 50 mg ______ p.o. efter ordination kl. 08.00."',
        facit:'administreret',
        hjaelp:'Sygeplejersken giver medicinen — hvad hedder handlingen fagligt?' },
      { type:'spot',
        sporg:'Find den subjektive vurdering, der IKKE hører hjemme i et notat: "Pt. angiver kvalme. BT 138/84. Pt. er en smule krævende. SAT 97 %."',
        facit:'"Pt. er en smule krævende" — en personlig, negativ vurdering uden observation bag.',
        hjaelp:'Ét af udsagnene siger noget om din holdning, ikke om patienten.' }
    ]
  },

  /* -------------------------------------------------- 4. QUIZ */
  quiz: {
    mc: [
      { level:'let',
        q:'Hvad betyder <b>ordination</b> i en dansk sygeplejekontekst?',
        options:['At give medicinen','Lægens beslutning/anvisning om behandling','Journalen','En blodprøve'],
        correct:1,
        why:'<b>Ordination</b> = lægens ordre/anvisning (prescription/order). Sygeplejersken <i>administrerer</i> derefter medicinen <i>efter ordination</i>.' },
      { level:'let',
        q:'Hvilken sætning er korrekt objektivt fagsprog?',
        options:['Pt. virker rigtig dårlig i dag.','Pt. har det skidt med brystet.','SAT 93 % på atmosfærisk luft, RF 22.','Blodtrykket var vist lidt højt.'],
        correct:2,
        why:'Kun mulighed 3 er en målt, objektiv observation med tal og betingelse. De øvrige er vurderinger ("virker", "skidt", "vist lidt").' },
      { level:'let',
        q:'Hvad er den korrekte fagterm for "the pulse is fast"?',
        options:['bradykard','takykard','hypotensiv','cyanotisk'],
        correct:1,
        why:'<b>Takykard</b> = hurtig hjertefrekvens. <b>Bradykard</b> er langsom, <b>hypotensiv</b> er lavt blodtryk.' },
      { level:'middel',
        q:'Hvilket verbum bruges korrekt her: "Furosemid 40 mg ______ i.v. efter ordination"?',
        options:['ordineres','angives','administreres','auskulteres'],
        correct:2,
        why:'Sygeplejersken <b>administrerer</b> (giver) medicinen. Lægen <b>ordinerer</b> den. "Angive" bruges om patientens udsagn.' },
      { level:'middel',
        q:'Hvornår er formuleringen "SAT 92 %" ufuldstændig i et notat?',
        options:['Når patienten sover','Når betingelsen (atm. luft vs. ilt) mangler','Når det er nat','Aldrig — 92 % er nok'],
        correct:1,
        why:'En saturation skal altid ledsages af betingelsen: "92 % på atmosfærisk luft" er noget helt andet end "92 % på 2 l ilt".' },
      { level:'middel',
        q:'Hvad beskriver <b>gradtrykbart ødem</b>?',
        options:['Hævelse der efterlader en fordybning ved tryk','En blodprop','Hurtig puls','Blå læber'],
        correct:0,
        why:'Gradtrykbart (pitting) ødem: trykker du på huden, bliver der en fordybning. Det dokumenteres fx som "bilateralt ankelødem, gradtrykbart".' },
      { level:'middel',
        q:'Hvilken formulering adskiller korrekt det subjektive fra det objektive?',
        options:['Pt. har ondt og er blodtrykket højt.','Pt. angiver brystsmerter VAS 6/10; BT 165/98.','Han klager altid.','Smerterne er nok ikke så slemme.'],
        correct:1,
        why:'"Pt. angiver … VAS 6/10" markerer det subjektive (patientens udsagn), mens "BT 165/98" er den objektive måling. De holdes adskilt.' },
      { level:'svaer',
        q:'Et notat lyder: "Pt. er lidt utilpas, huden er kold og klam, marmoreret på knæene, CR 4 sek, BT 88/54." Hvad er problemet sprogligt?',
        options:['Alt er fint','"Lidt utilpas" er en vurdering; resten er god objektiv beskrivelse','Der er for mange tal','"Marmoreret" er forkert'],
        correct:1,
        why:'De objektive tegn (kold/klam, marmoreret, CR 4 sek, BT 88/54) er præcise og korrekte. "Lidt utilpas" er en upræcis vurdering — erstat med et observeret tegn eller pt.\'s eget udsagn.' },
      { level:'svaer',
        q:'"Pt. desaturerer til 88 % ved gang" — hvad fortæller verbet <b>desaturere</b> præcist?',
        options:['At saturationen stiger','At iltmætningen falder under aktivitet','At pulsen stiger','At blodtrykket falder'],
        correct:1,
        why:'<b>At desaturere</b> = iltmætningen falder. Sætningen kobler faldet til en betingelse (ved gang), hvilket er klinisk vigtigt.' },
      { level:'svaer',
        q:'Hvilken note er BEDST dokumentationsfagligt?',
        options:[
          'Gav hjertemedicin, virkede fint.',
          'Metoprolol 50 mg administreret p.o. kl. 08.00 efter ordination; HF falder fra 108 til 82, BT 142/88.',
          'Pulsen blev bedre af pillerne.',
          'Han fik sin medicin som altid.'],
        correct:1,
        why:'Mulighed 2 har præparat, dosis, vej, tid, "efter ordination" og den målte effekt (HF/BT). De øvrige mangler tal og bruger vurderinger.' }
    ],
    cards: [
      { q:'ordination', a:'order / prescription — lægens anvisning. Medicin gives <i>efter ordination</i>.' },
      { q:'at administrere', a:'to administer — sygeplejersken giver medicinen (dosis, vej, tid).' },
      { q:'at ordinere', a:'to prescribe/order — det gør lægen.' },
      { q:'at angive', a:'to report/state — bruges om patientens egne udsagn: "pt. angiver smerter".' },
      { q:'takykard / bradykard', a:'tachycardic (fast HR) / bradycardic (slow HR).' },
      { q:'hypertensiv / hypotensiv', a:'hypertensive (high BP) / hypotensive (low BP).' },
      { q:'gradtrykbart ødem', a:'pitting oedema — tryk efterlader en fordybning.' },
      { q:'SAT på atmosfærisk luft', a:'saturation on room air — angiv altid betingelsen (luft vs. ilt).' },
      { q:'kapillærrespons (CR)', a:'capillary refill — normal < 2 sek; forlænget ved dårlig cirkulation.' },
      { q:'kold og klam / marmoreret', a:'cold & clammy / mottled — tegn på nedsat perifer cirkulation.' },
      { q:'jagende · dump · murrende · trykkende', a:'sharp · dull · aching · pressing — smertekvaliteter.' },
      { q:'at desaturere', a:'to desaturate — iltmætningen falder (fx ved aktivitet).' }
    ]
  }
};
