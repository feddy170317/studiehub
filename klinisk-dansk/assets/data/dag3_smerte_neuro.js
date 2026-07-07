/* ============================================================
   KLINISK DANSK — Dag 3: Smerte & neuro
   (Pain / neurology)
   Datamodel: se dag1_kredsloeb.js
   ============================================================ */
window.KD_DAYS = window.KD_DAYS || {};
window.KD_DAYS['dag3'] = {
  no: 3,
  slug: 'smerte_neuro',
  titel: 'Smerte & neuro',
  titel_en: 'Pain & neurology',
  emoji: '🧠',
  intro: 'Tredje dag handler om smerte og neurologiske observationer: at beskrive '
       + 'smertens kvalitet, placering og intensitet (VAS), og at vurdere bevidsthed, '
       + 'pupiller og orientering objektivt. Fokus: skelne patientens udsagn fra '
       + 'dine observationer.',

  /* -------------------------------------------------- 1. ORDFORRÅD */
  ordforraad: {
    subst: [
      { da:'smerte', en:'pain', koll:'jagende/dump smerte',
        eks_da:'Pt. angiver en jagende smerte i højre side.',
        eks_en:'Pt. reports a sharp pain in the right side.' },
      { da:'VAS-skala', en:'VAS (pain) scale', koll:'VAS 6/10',
        eks_da:'Smerten angives til VAS 6 ud af 10.',
        eks_en:'The pain is reported as VAS 6 out of 10.' },
      { da:'udstråling', en:'radiation (of pain)', koll:'udstråling til venstre arm',
        eks_da:'Smerten har udstråling til venstre arm.',
        eks_en:'The pain radiates to the left arm.' },
      { da:'smertestillende / analgetika', en:'analgesic / painkiller', koll:'fast smertestillende',
        eks_da:'Pt. får fast smertestillende og p.n. ved gennembrudssmerter.',
        eks_en:'Pt. has regular analgesics and PRN for breakthrough pain.' },
      { da:'bevidsthedsniveau', en:'level of consciousness (LOC)', koll:'faldende bevidsthedsniveau',
        eks_da:'Faldende bevidsthedsniveau siden morgen.',
        eks_en:'Falling level of consciousness since the morning.' },
      { da:'GCS (Glasgow Coma Scale)', en:'Glasgow Coma Scale', koll:'GCS 14',
        eks_da:'GCS 14 (E4 V4 M6).',
        eks_en:'GCS 14 (E4 V4 M6).' },
      { da:'pupil', en:'pupil', koll:'sidelige, reagerende pupiller',
        eks_da:'Pupiller sidelige og reagerer prompte på lys.',
        eks_en:'Pupils equal and react promptly to light.' },
      { da:'orientering', en:'orientation', koll:'orienteret i tid, sted og person',
        eks_da:'Pt. er orienteret i tid, sted og person.',
        eks_en:'Pt. is oriented to time, place and person.' },
      { da:'hovedpine', en:'headache', koll:'pulserende hovedpine',
        eks_da:'Pt. angiver pulserende hovedpine i venstre tinding.',
        eks_en:'Pt. reports a throbbing headache in the left temple.' },
      { da:'svimmelhed', en:'dizziness', koll:'svimmelhed ved rejsning',
        eks_da:'Pt. klager over svimmelhed ved rejsning (ortostatisk).',
        eks_en:'Pt. complains of dizziness on standing (orthostatic).' },
      { da:'kvalme', en:'nausea', koll:'kvalme med opkastning',
        eks_da:'Kvalme ledsaget af en enkelt opkastning.',
        eks_en:'Nausea accompanied by a single vomit.' },
      { da:'lammelse / parese', en:'paralysis / paresis', koll:'højresidig parese',
        eks_da:'Begyndende højresidig parese i ansigt og arm.',
        eks_en:'Emerging right-sided paresis in the face and arm.' },
      { da:'kramper', en:'seizures / convulsions', koll:'anfald af kramper',
        eks_da:'Observeret et generaliseret krampeanfald på ca. 40 sek.',
        eks_en:'A generalised seizure of approx. 40 sec. was observed.' },
      { da:'forvirring / konfusion', en:'confusion', koll:'tiltagende konfusion',
        eks_da:'Pt. er tiltagende konfus og desorienteret.',
        eks_en:'Pt. is increasingly confused and disoriented.' },
      { da:'apopleksi / slagtilfælde', en:'stroke', koll:'mistanke om apopleksi',
        eks_da:'Pludselig lammelse rejser mistanke om apopleksi.',
        eks_en:'Sudden paralysis raises suspicion of a stroke.' },
      { da:'føleforstyrrelse', en:'sensory disturbance', koll:'føleforstyrrelse i benet',
        eks_da:'Pt. angiver føleforstyrrelse (snurren) i venstre ben.',
        eks_en:'Pt. reports a sensory disturbance (tingling) in the left leg.' }
    ],
    verb: [
      { da:'at angive (smerte)', en:'to report / state', koll:'angive smerte VAS 6/10',
        eks_da:'Pt. angiver smerte svarende til VAS 6/10.',
        eks_en:'Pt. reports pain corresponding to VAS 6/10.' },
      { da:'at lindre', en:'to relieve', koll:'lindre smerten',
        eks_da:'Smerten lindres til VAS 2/10 efter morfin.',
        eks_en:'The pain is relieved to VAS 2/10 after morphine.' },
      { da:'at vurdere (bevidsthed)', en:'to assess', koll:'vurdere bevidsthedsniveau',
        eks_da:'Bevidsthedsniveauet vurderes med GCS.',
        eks_en:'The level of consciousness is assessed with GCS.' },
      { da:'at reagere (på tiltale/smerte)', en:'to respond', koll:'reagerer på tiltale',
        eks_da:'Pt. reagerer på tiltale, men er sløv.',
        eks_en:'Pt. responds to speech but is drowsy.' },
      { da:'at orientere sig', en:'to be oriented', koll:'orientere sig i tid og sted',
        eks_da:'Pt. kan ikke orientere sig i tid og sted.',
        eks_en:'Pt. cannot orient to time and place.' },
      { da:'at udstråle', en:'to radiate', koll:'udstråle til kæben',
        eks_da:'Smerten udstråler til kæben.',
        eks_en:'The pain radiates to the jaw.' },
      { da:'at besvime', en:'to faint', koll:'besvime kortvarigt',
        eks_da:'Pt. besvimede kortvarigt ved rejsning.',
        eks_en:'Pt. fainted briefly on standing.' },
      { da:'at observere (pupiller)', en:'to observe', koll:'observere pupilrespons',
        eks_da:'Pupilresponsen observeres hver 15. minut.',
        eks_en:'The pupil response is observed every 15 minutes.' },
      { da:'at administrere (analgetika)', en:'to administer', koll:'administrere smertestillende',
        eks_da:'Morfin 5 mg administreret s.c. efter ordination.',
        eks_en:'Morphine 5 mg administered s.c. as prescribed.' }
    ],
    adj: [
      { da:'skarp / jagende', en:'sharp / stabbing', koll:'jagende smerte',
        eks_da:'En skarp, jagende smerte ved bevægelse.',
        eks_en:'A sharp, stabbing pain on movement.' },
      { da:'dump', en:'dull', koll:'dump smerte',
        eks_da:'En dump smerte i lænden.',
        eks_en:'A dull pain in the lower back.' },
      { da:'murrende', en:'aching / nagging', koll:'murrende ubehag',
        eks_da:'Et murrende ubehag hele dagen.',
        eks_en:'A nagging discomfort all day.' },
      { da:'brændende', en:'burning', koll:'brændende smerte',
        eks_da:'En brændende smerte langs nerven.',
        eks_en:'A burning pain along the nerve.' },
      { da:'pulserende', en:'throbbing', koll:'pulserende hovedpine',
        eks_da:'Pulserende hovedpine, forværret af lys.',
        eks_en:'A throbbing headache, worsened by light.' },
      { da:'konstant / intermitterende', en:'constant / intermittent', koll:'intermitterende smerte',
        eks_da:'Smerten er intermitterende, i anfald.',
        eks_en:'The pain is intermittent, in bouts.' },
      { da:'lokaliseret / diffus', en:'localised / diffuse', koll:'diffus mavesmerte',
        eks_da:'Smerten er diffus, uden klar lokalisation.',
        eks_en:'The pain is diffuse, without a clear location.' },
      { da:'vågen / klar', en:'awake / alert', koll:'vågen og klar',
        eks_da:'Pt. er vågen og klar ved kontakt.',
        eks_en:'Pt. is awake and alert on contact.' },
      { da:'sløv / somnolent', en:'drowsy / somnolent', koll:'sløv men vækkelig',
        eks_da:'Pt. er sløv, men vækkelig ved tiltale.',
        eks_en:'Pt. is drowsy but rousable to speech.' },
      { da:'desorienteret', en:'disoriented', koll:'desorienteret i tid',
        eks_da:'Pt. er desorienteret i tid og sted.',
        eks_en:'Pt. is disoriented to time and place.' },
      { da:'bevidstløs', en:'unconscious', koll:'reagerer ikke, bevidstløs',
        eks_da:'Pt. er bevidstløs og reagerer ikke på smerte.',
        eks_en:'Pt. is unconscious and does not respond to pain.' }
    ]
  },

  /* -------------------------------------------------- 2. DOKUMENTATION */
  dokumentation: {
    regler: [
      { da:'Beskriv smerten systematisk: placering, kvalitet (skarp/dump/brændende), intensitet (VAS), udstråling, forværrende/lindrende faktorer.',
        en:'Describe pain systematically: site, quality, intensity (VAS), radiation, aggravating/relieving factors.' },
      { da:'Smerte er subjektiv — skriv "pt. angiver …". Din opgave er at gengive den, ikke at vurdere om den er "rigtig".',
        en:'Pain is subjective — write "pt. reports …". Your job is to record it, not judge whether it is "real".' },
      { da:'Bevidsthed vurderes objektivt: GCS eller AVPU + orientering (tid/sted/person). Undgå "virker lidt væk".',
        en:'Assess consciousness objectively: GCS or AVPU + orientation. Avoid "seems a bit out of it".' },
      { da:'Dokumentér pupiller objektivt: størrelse, sidelighed, lysreaktion ("sidelige, reagerer prompte").',
        en:'Document pupils objectively: size, equality, light reaction.' },
      { da:'Dokumentér effekt af smertestillende med før/efter-VAS: "VAS 7/10 → 2/10 efter morfin 5 mg s.c.".',
        en:'Document analgesic effect with before/after VAS.' },
      { da:'Ved ændring i neurologi (parese, konfusion, kramper): beskriv objektivt, notér tidspunkt, orientér lægen.',
        en:'For neurological change: describe objectively, note the time, inform the doctor.' }
    ],
    par: [
      { daarlig:'Pt. har vildt ondt, klager konstant.',
        god:'Pt. angiver skarp, jagende smerte i højre flanke VAS 8/10 med udstråling mod lysken; forværres ved bevægelse.',
        hvorfor:'"Vildt ondt" og "klager konstant" er vurderinger. Beskriv placering, kvalitet, intensitet (VAS), udstråling og hvad der forværrer.' },
      { daarlig:'Han virker lidt fjern og forvirret i dag.',
        god:'Pt. er sløv men vækkelig ved tiltale, desorienteret i tid og sted, orienteret i person. GCS 13.',
        hvorfor:'"Virker lidt fjern" er upræcist. Brug objektive begreber: bevidsthedsniveau (sløv/vækkelig), orientering og GCS.' },
      { daarlig:'Gav ham smertestillende, hjalp vist.',
        god:'Morfin 5 mg administreret s.c. kl. 11.20 efter ordination; VAS falder fra 7/10 til 2/10 efter 30 min.',
        hvorfor:'Angiv præparat, dosis, vej, tid, "efter ordination" og den målte effekt (VAS før/efter).' },
      { daarlig:'Øjnene så mærkelige ud.',
        god:'Højre pupil udvidet og træg lysreaktion, venstre sidelig og prompt. Lægen straks orienteret.',
        hvorfor:'"Mærkelige ud" siger intet. Beskriv pupilstørrelse, sidelighed og lysreaktion objektivt — og handlingen.' },
      { daarlig:'Fik vist et krampeanfald eller sådan noget.',
        god:'Observeret generaliseret krampeanfald kl. 03.15, varighed ca. 40 sek., efterfulgt af 10 min. konfusion. Lægen tilkaldt.',
        hvorfor:'Erstat usikkerheden med objektiv beskrivelse: type, tidspunkt, varighed, efterforløb og handling.' }
    ]
  },

  /* -------------------------------------------------- 3. PATIENTNOTAT */
  notat: {
    titel: 'Sygeplejenotat — akut modtagelse (hovedpine + neuro)',
    note_da:
      'Pt. 57-årig mand, pludselig kraftig hovedpine debuteret kl. 19.40 ("den værste '
      + 'nogensinde"). Ved tilsyn kl. 19.55: angiver pulserende hovedpine VAS 9/10 i '
      + 'nakke og baghoved, ledsaget af kvalme og en enkelt opkastning. Lyssky. Pt. vågen, '
      + 'orienteret i tid, sted og person, GCS 15. Pupiller sidelige, reagerer prompt på '
      + 'lys. Ingen parese, griber lige kraftigt med begge hænder. BT 168/96, puls 92. '
      + 'Paracetamol 1 g administreret p.o. efter ordination; VAS uændret 9/10 efter 30 min. '
      + 'Lægen tilser akut, ordinerer CT-skanning.',
    note_en:
      'Pt. 57-year-old man, sudden severe headache onset at 19:40 ("the worst ever"). On '
      + 'review at 19:55: reports throbbing headache VAS 9/10 in the neck and occiput, with '
      + 'nausea and a single vomit. Photophobic. Pt. awake, oriented to time, place and person, '
      + 'GCS 15. Pupils equal, react promptly to light. No paresis, grips equally strongly with '
      + 'both hands. BP 168/96, pulse 92. Paracetamol 1 g administered p.o. as prescribed; VAS '
      + 'unchanged 9/10 after 30 min. Doctor attends urgently, orders a CT scan.',
    ovelser: [
      { type:'omskriv',
        sporg:'Omskriv objektivt: "Han havde helt vildt ondt i hovedet og var helt fjern."',
        facit:'Pt. angiver pulserende hovedpine VAS 9/10 i nakke/baghoved. Pt. vågen, orienteret i tid, sted og person, GCS 15.',
        hjaelp:'Del op: smerten (angiver + kvalitet + VAS + sted) og bevidstheden (objektivt: vågen/orienteret/GCS).' },
      { type:'omskriv',
        sporg:'Omskriv: "Gav ham en hovedpinepille men den gjorde ikke noget."',
        facit:'Paracetamol 1 g administreret p.o. efter ordination; VAS uændret 9/10 efter 30 min.',
        hjaelp:'Navngiv præparat, dosis, vej, "efter ordination" og den målte effekt (VAS før/efter).' },
      { type:'udfyld',
        sporg:'Udfyld verbet: "Bevidsthedsniveauet ______ med GCS til 15."',
        facit:'vurderes',
        hjaelp:'Hvad gør man med bevidsthedsniveauet ved hjælp af en skala?' },
      { type:'udfyld',
        sporg:'Udfyld: "Pupiller sidelige og ______ prompt på lys."',
        facit:'reagerer',
        hjaelp:'Hvad gør pupillerne, når man lyser i øjet?' },
      { type:'spot',
        sporg:'Find den subjektive vurdering: "VAS 9/10. Pt. overdriver nok lidt. Pupiller sidelige. GCS 15."',
        facit:'"Pt. overdriver nok lidt" — en personlig vurdering af patientens smerte, som ikke hører hjemme i et notat.',
        hjaelp:'Smerte er subjektiv — du gengiver den, du dømmer den ikke.' }
    ]
  },

  /* -------------------------------------------------- 4. QUIZ */
  quiz: {
    mc: [
      { level:'let',
        q:'Hvad angiver <b>VAS 6/10</b>?',
        options:['Blodtrykket','Smerteintensiteten på en skala 0–10','Bevidsthedsniveauet','Pulsen'],
        correct:1,
        why:'VAS = Visuel Analog Skala for smerteintensitet, her 6 ud af 10.' },
      { level:'let',
        q:'Hvad betyder <b>parese</b>?',
        options:['Hovedpine','(Delvis) lammelse','Kvalme','Svimmelhed'],
        correct:1,
        why:'<b>Parese</b> = delvis lammelse / kraftnedsættelse. Fuld lammelse = paralyse.' },
      { level:'let',
        q:'Hvilket ord bruges om patientens EGET udsagn om smerte?',
        options:['observerer','angiver','auskulterer','ordinerer'],
        correct:1,
        why:'Pt. <b>angiver</b> smerte (subjektivt). Du <b>observerer</b> objektive tegn.' },
      { level:'middel',
        q:'Hvilken beskrivelse af bevidsthed er mest objektiv?',
        options:['Virker lidt fjern.','Er ikke helt sig selv.','Sløv men vækkelig ved tiltale, GCS 13, desorienteret i tid.','Har det ikke så godt.'],
        correct:2,
        why:'Kun mulighed 3 bruger objektive begreber: bevidsthedsniveau, GCS og orientering. De øvrige er vurderinger.' },
      { level:'middel',
        q:'Hvordan dokumenteres pupiller korrekt?',
        options:['Øjnene ser fine ud.','Sidelige, reagerer prompt på lys.','Han kigger normalt.','Pupillerne er OK.'],
        correct:1,
        why:'Angiv sidelighed (ens/uens) og lysreaktion (prompt/træg). "Fine/OK" er ikke klinisk information.' },
      { level:'middel',
        q:'Hvad hører systematisk med, når du beskriver smerte?',
        options:['Kun VAS','Placering, kvalitet, intensitet, udstråling, forværrende/lindrende faktorer','Kun placeringen','Patientens humør'],
        correct:1,
        why:'En fuld smertebeskrivelse indeholder placering, kvalitet (skarp/dump/brændende), intensitet (VAS), udstråling og hvad der forværrer/lindrer.' },
      { level:'middel',
        q:'Hvilket verbum passer: "Smerten ______ til venstre arm og kæbe"?',
        options:['lindrer','udstråler','vurderer','orienterer'],
        correct:1,
        why:'<b>At udstråle</b> = smerten breder sig/stråler ud til et andet område.' },
      { level:'svaer',
        q:'"VAS 7/10 → 2/10" i et notat. Hvad gør denne dokumentation stærk?',
        options:['Den viser en holdning','Den dokumenterer effekten af en intervention med målte før/efter-værdier','Den er kort','Den nævner ingen medicin'],
        correct:1,
        why:'Før/efter-VAS dokumenterer objektivt, at smertestillende virkede — forudsat præparat, dosis, vej og tid også er noteret.' },
      { level:'svaer',
        q:'En pt. med pludselig "værste hovedpine nogensinde", kvalme og lysskyhed. Hvad er vigtigst i notatet?',
        options:[
          'At pt. nok overdriver',
          'Objektiv beskrivelse (debut, VAS, ledsagesymptomer, neuro-status) + tidspunkt + at lægen er orienteret',
          'At det sikkert går over',
          'Kun at der blev givet paracetamol'],
        correct:1,
        why:'Pludselig "worst-ever" hovedpine kan være alvorlig. Notér objektivt: debut, intensitet, ledsagesymptomer, neuro-status, tid og handling (lægen orienteret).' },
      { level:'svaer',
        q:'Hvilken note er BEDST dokumentationsfagligt om et krampeanfald?',
        options:[
          'Fik vist en krampe eller sådan noget.',
          'Observeret generaliseret krampeanfald kl. 03.15, varighed ca. 40 sek., efterfulgt af 10 min. konfusion; lægen tilkaldt.',
          'Rystede lidt i sengen.',
          'Han var urolig om natten.'],
        correct:1,
        why:'Mulighed 2 angiver type, tidspunkt, varighed, efterforløb og handling — alt objektivt og handlingsanvisende.' }
    ],
    cards: [
      { q:'VAS 6/10', a:'Visual Analogue Scale — smerteintensitet 6 ud af 10 (subjektivt, pt. angiver).' },
      { q:'at angive vs. at observere', a:'to report (patientens udsagn) vs. to observe (dine objektive tegn).' },
      { q:'GCS / bevidsthedsniveau', a:'Glasgow Coma Scale — objektiv vurdering af bevidsthed (E+V+M).' },
      { q:'orienteret i tid, sted og person', a:'oriented to time, place and person — standard for orientering.' },
      { q:'pupiller: sidelige, reagerer prompt', a:'pupils equal, react promptly to light — objektiv pupil-status.' },
      { q:'parese / paralyse', a:'paresis (delvis lammelse) / paralysis (fuld lammelse).' },
      { q:'skarp · dump · brændende · pulserende', a:'sharp · dull · burning · throbbing — smertekvaliteter.' },
      { q:'udstråling', a:'radiation — smerten stråler til et andet område (fx arm, kæbe).' },
      { q:'sløv / somnolent / bevidstløs', a:'drowsy / somnolent / unconscious — faldende bevidsthedsniveau.' },
      { q:'apopleksi', a:'stroke — pludselig parese/talebesvær; notér tid, orientér lægen straks.' },
      { q:'før/efter-VAS', a:'document analgesic effect: fx VAS 7/10 → 2/10 efter morfin 5 mg s.c.' },
      { q:'konfusion / desorienteret', a:'confusion / disoriented — beskriv objektivt, ikke "virker fjern".' }
    ]
  }
};
