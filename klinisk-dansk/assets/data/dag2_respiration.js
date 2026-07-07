/* ============================================================
   KLINISK DANSK — Dag 2: Respiration & saturation
   (Respiration / oxygen saturation)
   Datamodel: se dag1_kredsloeb.js
   ============================================================ */
window.KD_DAYS = window.KD_DAYS || {};
window.KD_DAYS['dag2'] = {
  no: 2,
  slug: 'respiration',
  titel: 'Respiration & saturation',
  titel_en: 'Respiration & oxygen saturation',
  emoji: '🫁',
  intro: 'Anden dag handler om vejrtrækningen: respirationsfrekvens, iltmætning, '
       + 'iltbehandling og de lyde og symptomer, du observerer — dyspnø, hoste, '
       + 'ekspektorat, rallen og hvæsen. Fokus: at beskrive respirationen præcist '
       + 'og altid angive iltbetingelsen.',

  /* -------------------------------------------------- 1. ORDFORRÅD */
  ordforraad: {
    subst: [
      { da:'respiration / vejrtrækning', en:'respiration / breathing', koll:'overfladisk vejrtrækning',
        eks_da:'Vejrtrækningen er overfladisk og anstrengt.',
        eks_en:'The breathing is shallow and laboured.' },
      { da:'respirationsfrekvens (RF)', en:'respiratory rate (RR)', koll:'RF måles over et minut',
        eks_da:'RF 24 i hvile — let forhøjet.',
        eks_en:'RR 24 at rest — slightly elevated.' },
      { da:'åndenød / dyspnø', en:'dyspnoea / shortness of breath', koll:'dyspnø ved anstrengelse',
        eks_da:'Pt. angiver tiltagende åndenød ved gang.',
        eks_en:'Pt. reports increasing shortness of breath when walking.' },
      { da:'iltmætning / saturation (SAT)', en:'oxygen saturation', koll:'SAT på atmosfærisk luft',
        eks_da:'SAT 91 % på atmosfærisk luft, stiger til 96 % på 2 l ilt.',
        eks_en:'SAT 91 % on room air, rising to 96 % on 2 l oxygen.' },
      { da:'lunge', en:'lung', koll:'nedsat luftskifte over venstre lunge',
        eks_da:'Der auskulteres nedsat luftskifte over højre lunge.',
        eks_en:'Reduced air entry is auscultated over the right lung.' },
      { da:'luftvej', en:'airway', koll:'fri luftvej',
        eks_da:'Pt. har fri luftvej og taler i hele sætninger.',
        eks_en:'Pt. has a clear airway and speaks in full sentences.' },
      { da:'ekspektorat / opspyt', en:'sputum / expectoration', koll:'purulent ekspektorat',
        eks_da:'Gulligt, purulent ekspektorat.',
        eks_en:'Yellowish, purulent sputum.' },
      { da:'hoste', en:'cough', koll:'produktiv hoste',
        eks_da:'Produktiv hoste med sejt slim.',
        eks_en:'Productive cough with viscous mucus.' },
      { da:'slim', en:'mucus / phlegm', koll:'sejt slim',
        eks_da:'Pt. har svært ved at hoste det seje slim op.',
        eks_en:'Pt. has difficulty coughing up the viscous mucus.' },
      { da:'ilt / oxygen (O₂)', en:'oxygen', koll:'ilt på næsekateter',
        eks_da:'Ilt 2 l/min gives på næsekateter efter ordination.',
        eks_en:'Oxygen 2 l/min is given via nasal cannula as prescribed.' },
      { da:'næsekateter', en:'nasal cannula', koll:'ilt på næsekateter',
        eks_da:'Ilten leveres via næsekateter.',
        eks_en:'The oxygen is delivered via nasal cannula.' },
      { da:'iltmaske', en:'oxygen mask', koll:'maske med reservoir',
        eks_da:'Skiftet til iltmaske med reservoir, 10 l/min.',
        eks_en:'Switched to a reservoir oxygen mask, 10 l/min.' },
      { da:'lungeødem', en:'pulmonary oedema', koll:'begyndende lungeødem',
        eks_da:'Rallen ved basis giver mistanke om lungeødem.',
        eks_en:'Crackles at the bases raise suspicion of pulmonary oedema.' },
      { da:'lungebetændelse (pneumoni)', en:'pneumonia', koll:'behandles for pneumoni',
        eks_da:'Pt. behandles for pneumoni med i.v. antibiotika.',
        eks_en:'Pt. is treated for pneumonia with i.v. antibiotics.' },
      { da:'KOL', en:'COPD', koll:'kendt KOL',
        eks_da:'Pt. er kendt med svær KOL.',
        eks_en:'Pt. has known severe COPD.' },
      { da:'cyanose', en:'cyanosis', koll:'perifer/central cyanose',
        eks_da:'Let central cyanose omkring læberne.',
        eks_en:'Slight central cyanosis around the lips.' },
      { da:'respirationsstop', en:'respiratory arrest', koll:'ved respirationsstop tilkald',
        eks_da:'Ved respirationsstop tilkaldes hjertestopholdet.',
        eks_en:'In case of respiratory arrest, the cardiac-arrest team is called.' }
    ],
    verb: [
      { da:'at trække vejret', en:'to breathe', koll:'trække vejret anstrengt',
        eks_da:'Pt. trækker vejret anstrengt med brug af hjælpemuskler.',
        eks_en:'Pt. breathes with effort using accessory muscles.' },
      { da:'at indånde / inhalere', en:'to inhale', koll:'inhalere via forstøver',
        eks_da:'Medicinen inhaleres via forstøverapparat.',
        eks_en:'The medication is inhaled via a nebuliser.' },
      { da:'at udånde / ekspirere', en:'to exhale', koll:'forlænget ekspiration',
        eks_da:'Der ses forlænget ekspiration, typisk for KOL.',
        eks_en:'A prolonged expiration is seen, typical of COPD.' },
      { da:'at hoste', en:'to cough', koll:'hoste produktivt',
        eks_da:'Pt. hoster produktivt gennem natten.',
        eks_en:'Pt. coughs productively through the night.' },
      { da:'at ekspektorere', en:'to expectorate / cough up', koll:'ekspektorere sejt slim',
        eks_da:'Pt. ekspektorerer sejt, gulligt slim.',
        eks_en:'Pt. coughs up viscous, yellowish mucus.' },
      { da:'at auskultere', en:'to auscultate', koll:'auskultere lungerne',
        eks_da:'Lungerne auskulteres med rallen ved begge baser.',
        eks_en:'The lungs are auscultated with crackles at both bases.' },
      { da:'at desaturere', en:'to desaturate', koll:'desaturere ved aktivitet',
        eks_da:'Pt. desaturerer til 87 % ved gang til toilettet.',
        eks_en:'Pt. desaturates to 87 % when walking to the toilet.' },
      { da:'at iltbehandle', en:'to give oxygen therapy', koll:'iltbehandle efter ordination',
        eks_da:'Pt. iltbehandles med 2 l/min efter ordination.',
        eks_en:'Pt. receives oxygen therapy at 2 l/min as prescribed.' },
      { da:'at måle (SAT/RF)', en:'to measure', koll:'måle SAT og RF',
        eks_da:'SAT og RF måles hver time under forværring.',
        eks_en:'SAT and RR are measured hourly during deterioration.' },
      { da:'at hyperventilere', en:'to hyperventilate', koll:'hyperventilere ved angst',
        eks_da:'Pt. hyperventilerer i forbindelse med angst.',
        eks_en:'Pt. hyperventilates in connection with anxiety.' }
    ],
    adj: [
      { da:'overfladisk', en:'shallow', koll:'overfladisk vejrtrækning',
        eks_da:'Vejrtrækningen er overfladisk og hurtig.',
        eks_en:'The breathing is shallow and rapid.' },
      { da:'anstrengt / besværet', en:'laboured / distressed', koll:'anstrengt respiration',
        eks_da:'Anstrengt respiration med indtrækninger.',
        eks_en:'Laboured respiration with retractions.' },
      { da:'rallende', en:'crackling / rattling', koll:'rallende vejrtrækning',
        eks_da:'Rallende vejrtrækning, hørbar uden stetoskop.',
        eks_en:'Rattling breathing, audible without a stethoscope.' },
      { da:'pibende / hvæsende', en:'wheezing', koll:'pibende ekspiration',
        eks_da:'Pibende, hvæsende ekspiration ved auskultation.',
        eks_en:'A wheezing expiration on auscultation.' },
      { da:'produktiv / tør (hoste)', en:'productive / dry (cough)', koll:'produktiv hoste',
        eks_da:'Hosten er nu produktiv, tidligere tør.',
        eks_en:'The cough is now productive, previously dry.' },
      { da:'purulent / klar (ekspektorat)', en:'purulent / clear (sputum)', koll:'purulent ekspektorat',
        eks_da:'Ekspektoratet er purulent og gulligt.',
        eks_en:'The sputum is purulent and yellowish.' },
      { da:'takypnø', en:'tachypnoeic (fast RR)', koll:'takypnø i hvile',
        eks_da:'Pt. er takypnø med RF 28 i hvile.',
        eks_en:'Pt. is tachypnoeic with RR 28 at rest.' },
      { da:'cyanotisk', en:'cyanotic (bluish)', koll:'cyanotiske læber',
        eks_da:'Læber og negle er let cyanotiske.',
        eks_en:'Lips and nails are slightly cyanotic.' },
      { da:'påvirket / upåvirket', en:'affected / unaffected', koll:'upåvirket respiration',
        eks_da:'Respirationen er upåvirket i hvile.',
        eks_en:'The respiration is unaffected at rest.' }
    ]
  },

  /* -------------------------------------------------- 2. DOKUMENTATION */
  dokumentation: {
    regler: [
      { da:'Angiv ALTID iltbetingelsen ved en saturation: "SAT 92 % på atmosfærisk luft" vs. "på 2 l ilt".',
        en:'ALWAYS state the oxygen condition with a saturation: "92 % on room air" vs. "on 2 l oxygen".' },
      { da:'Beskriv respirationen med RF + karakter (overfladisk/anstrengt/upåvirket), ikke bare "trækker vejret fint".',
        en:'Describe respiration with RR + character, not just "breathing fine".' },
      { da:'Karakterisér hoste (produktiv/tør) og ekspektorat (mængde, farve, konsistens).',
        en:'Characterise the cough (productive/dry) and sputum (amount, colour, consistency).' },
      { da:'Skriv objektive lyde: "rallen ved basis", "pibende ekspiration" — ikke "lyder ikke godt".',
        en:'Write objective sounds: "crackles at the bases", not "sounds bad".' },
      { da:'Dokumentér effekten af iltbehandling: "SAT stiger fra 89 % til 95 % på 2 l ilt".',
        en:'Document the effect of oxygen therapy with before/after values.' },
      { da:'Ved KOL: vær opmærksom på ordineret ilt-mål (ofte 88–92 %) — hold dig til ordinationen.',
        en:'In COPD: note the prescribed target range (often 88–92 %) — follow the order.' }
    ],
    par: [
      { daarlig:'Han trækker ikke rigtig vejret ordentligt og ser blå ud.',
        god:'RF 28, anstrengt respiration med brug af hjælpemuskler. Central cyanose omkring læberne. SAT 88 % på atmosfærisk luft.',
        hvorfor:'"Ikke rigtig ordentligt" og "ser blå ud" er vurderinger. Beskriv RF, respirationens karakter, den objektive cyanose og den målte SAT med betingelse.' },
      { daarlig:'Gav ilt og det blev bedre.',
        god:'Ilt 2 l/min påbegyndt på næsekateter efter ordination; SAT stiger fra 89 % til 95 %, RF falder fra 26 til 20.',
        hvorfor:'Angiv mængde, leveringsmåde, "efter ordination" og den målte effekt (SAT og RF før/efter).' },
      { daarlig:'Hoster meget og har lidt slim.',
        god:'Produktiv hoste natten igennem, ekspektorerer moderat mængde purulent, gulligt slim.',
        hvorfor:'"Meget" og "lidt" er upræcist. Beskriv hostens type og ekspektoratets mængde, farve og konsistens.' },
      { daarlig:'Lungerne lyder ikke så gode.',
        god:'Ved auskultation: rallen ved begge baser og pibende ekspiration bilateralt.',
        hvorfor:'"Lyder ikke gode" siger intet klinisk. Angiv de objektive lyde og hvor de høres.' },
      { daarlig:'Saturationen faldt da han gik.',
        god:'Pt. desaturerer fra 94 % til 87 % ved gang på gangen; retter sig til 93 % efter 3 min. hvile.',
        hvorfor:'Kobl faldet til betingelsen (aktivitet) med målte værdier før/under/efter — det er klinisk vigtigt ved fx KOL.' }
    ]
  },

  /* -------------------------------------------------- 3. PATIENTNOTAT */
  notat: {
    titel: 'Sygeplejenotat — forværring, medicinsk afdeling (KOL)',
    note_da:
      'Pt. 68-årig kvinde, kendt svær KOL, tiltagende åndenød gennem 2 døgn. Ved tilsyn '
      + 'kl. 14.10: RF 28, anstrengt respiration med brug af hjælpemuskler, taler i korte '
      + 'sætninger. SAT 86 % på atmosfærisk luft. Ved auskultation rallen ved begge baser '
      + 'og pibende ekspiration. Produktiv hoste med purulent, gulligt ekspektorat. Let '
      + 'central cyanose. Ilt 1 l/min ordineret på næsekateter (mål 88–92 %); SAT stiger '
      + 'til 90 %, RF falder til 22. Salbutamol inhalation administreret efter ordination. '
      + 'Pt. lejret i hjertesengeleje. Lægen tilser, ordinerer i.v. antibiotika.',
    note_en:
      'Pt. 68-year-old woman, known severe COPD, increasing dyspnoea over 2 days. On review '
      + 'at 14:10: RR 28, laboured respiration with accessory-muscle use, speaks in short '
      + 'sentences. SAT 86 % on room air. On auscultation, crackles at both bases and a '
      + 'wheezing expiration. Productive cough with purulent, yellowish sputum. Slight central '
      + 'cyanosis. Oxygen 1 l/min prescribed via nasal cannula (target 88–92 %); SAT rises to '
      + '90 %, RR falls to 22. Salbutamol inhalation administered as prescribed. Pt. positioned '
      + 'in high sitting. Doctor attends, prescribes i.v. antibiotics.',
    ovelser: [
      { type:'omskriv',
        sporg:'Omskriv objektivt: "Hun trak vejret helt forfærdeligt og så virkelig dårlig ud."',
        facit:'RF 28, anstrengt respiration med brug af hjælpemuskler, taler i korte sætninger, let central cyanose.',
        hjaelp:'Erstat følelses-ord med RF, respirationens karakter og et objektivt tegn (cyanose).' },
      { type:'omskriv',
        sporg:'Omskriv: "Gav hende noget ilt og det hjalp lidt på iltningen."',
        facit:'Ilt 1 l/min ordineret på næsekateter; SAT stiger fra 86 % til 90 %.',
        hjaelp:'Angiv mængde, leveringsmåde, "ordineret" og målt SAT før/efter.' },
      { type:'udfyld',
        sporg:'Udfyld: "SAT 86 % ______ atmosfærisk luft; stiger til 90 % ______ 1 l ilt."',
        facit:'på … på',
        hjaelp:'Hvilken lille forholdsord bruges om iltbetingelsen? "___ atmosfærisk luft".' },
      { type:'udfyld',
        sporg:'Udfyld verbet: "Salbutamol inhalation ______ efter ordination."',
        facit:'administreret',
        hjaelp:'Sygeplejersken giver inhalationen — fagordet for at give medicin.' },
      { type:'spot',
        sporg:'Find den subjektive vurdering: "RF 28. Pt. er lidt en pivet type. SAT 86 % på atm. luft. Pibende ekspiration."',
        facit:'"Pt. er lidt en pivet type" — en nedladende, personlig vurdering uden observation bag.',
        hjaelp:'Ét udsagn siger noget om din holdning, ikke om patienten.' }
    ]
  },

  /* -------------------------------------------------- 4. QUIZ */
  quiz: {
    mc: [
      { level:'let',
        q:'Hvad betyder <b>dyspnø</b>?',
        options:['Hoste','Åndenød / besværet vejrtrækning','Blåfarvning','Feber'],
        correct:1,
        why:'<b>Dyspnø</b> = åndenød / besværet vejrtrækning (shortness of breath).' },
      { level:'let',
        q:'Hvilken oplysning MANGLER, hvis der står "SAT 92 %"?',
        options:['Tidspunktet','Iltbetingelsen (atm. luft vs. ilt)','Patientens navn','Pulsen'],
        correct:1,
        why:'En saturation skal altid ledsages af betingelsen: "92 % på atmosfærisk luft" er noget helt andet end "92 % på 4 l ilt".' },
      { level:'let',
        q:'Hvad er <b>ekspektorat</b>?',
        options:['Opspyt / slim der hostes op','Vejrtrækningsfrekvensen','En iltmaske','En lungebetændelse'],
        correct:0,
        why:'<b>Ekspektorat</b> = det opspyt/slim, patienten hoster op. Beskriv mængde, farve og konsistens.' },
      { level:'middel',
        q:'Hvilken formulering er bedst objektiv dokumentation af respirationen?',
        options:['Trækker vejret fint.','Vejrtrækningen ser anstrengt ud.','RF 28, anstrengt respiration med brug af hjælpemuskler.','Åndedrættet er lidt tungt.'],
        correct:2,
        why:'Kun mulighed 3 har en målt frekvens (RF) + en objektiv beskrivelse af karakteren. De øvrige er vurderinger.' },
      { level:'middel',
        q:'Hvad beskriver <b>rallen</b> ved auskultation?',
        options:['En pibende lyd ved udånding','En knasende/boblende lyd, ofte ved væske i lungerne','Fravær af lyd','En hostelyd'],
        correct:1,
        why:'<b>Rallen</b> (crackles) er en knasende/boblende lyd — ses fx ved lungeødem eller pneumoni. <b>Pibende/hvæsende</b> er wheeze.' },
      { level:'middel',
        q:'Ved kendt KOL er der ofte ordineret et SAT-mål på 88–92 %. Hvad gør du?',
        options:['Skruer op til 100 %','Følger ordinationen og holder SAT i målintervallet','Slukker for ilten','Ignorerer målet'],
        correct:1,
        why:'Ved KOL kan for høj ilt være skadelig. Følg det ordinerede mål (ofte 88–92 %) og dokumentér iltmængden.' },
      { level:'middel',
        q:'Hvilket verbum passer: "Pt. ______ til 87 % ved gang på gangen"?',
        options:['auskulterer','desaturerer','ekspektorerer','hyperventilerer'],
        correct:1,
        why:'<b>At desaturere</b> = iltmætningen falder. Her kobles faldet til aktivitet (ved gang).' },
      { level:'svaer',
        q:'Et notat: "SAT 89 % → 95 %, RF 26 → 20." Hvad mangler for at gøre det fagligt komplet?',
        options:['Intet, det er komplet','Betingelsen/interventionen (fx ilt 2 l/min efter ordination)','Patientens vægt','Temperaturen'],
        correct:1,
        why:'Tallene viser en effekt, men uden interventionen (hvad blev givet, hvor meget, efter ordination) kan man ikke se HVORFOR de ændrede sig.' },
      { level:'svaer',
        q:'Hvilken note er BEDST dokumentationsfagligt?',
        options:[
          'Lungerne lyder skidt og hun hoster meget.',
          'Ved auskultation rallen ved begge baser og pibende ekspiration; produktiv hoste med purulent, gulligt ekspektorat.',
          'Der er vist noget galt med vejrtrækningen.',
          'Hun har det ikke så godt med luften.'],
        correct:1,
        why:'Mulighed 2 angiver objektive lyde + placering + hostens type + ekspektoratets mængde/farve/konsistens. De øvrige er vurderinger uden data.' },
      { level:'svaer',
        q:'"Pt. taler i korte sætninger" — hvorfor er det klinisk relevant at dokumentere?',
        options:['Det er høflighed','Det er et objektivt tegn på graden af åndenød/respirationsarbejde','Det siger noget om humøret','Det er ligegyldigt'],
        correct:1,
        why:'Evnen til at tale i hele vs. korte sætninger er et anerkendt, objektiv mål for åndenødens sværhedsgrad.' }
    ],
    cards: [
      { q:'dyspnø', a:'dyspnoea / shortness of breath — åndenød.' },
      { q:'respirationsfrekvens (RF)', a:'respiratory rate (RR) — antal vejrtrækninger pr. minut.' },
      { q:'SAT på atmosfærisk luft vs. på ilt', a:'saturation on room air vs. on oxygen — angiv altid betingelsen.' },
      { q:'ekspektorat', a:'sputum — opspyt; beskriv mængde, farve, konsistens (fx purulent, gulligt).' },
      { q:'produktiv / tør hoste', a:'productive / dry cough.' },
      { q:'rallen', a:'crackles — knasende/boblende lyd (fx lungeødem, pneumoni).' },
      { q:'pibende / hvæsende', a:'wheezing — typisk ved KOL/astma, forlænget ekspiration.' },
      { q:'at desaturere', a:'to desaturate — SAT falder, ofte koblet til aktivitet.' },
      { q:'at iltbehandle', a:'to give oxygen therapy — angiv mængde, leveringsmåde, efter ordination.' },
      { q:'takypnø / bradypnø', a:'tachypnoeic (fast RR) / bradypnoeic (slow RR).' },
      { q:'central cyanose', a:'central cyanosis — blålige læber/tunge, tegn på lav iltning.' },
      { q:'KOL-iltmål 88–92 %', a:'COPD oxygen target — følg ordinationen; for høj ilt kan skade.' }
    ]
  }
};
