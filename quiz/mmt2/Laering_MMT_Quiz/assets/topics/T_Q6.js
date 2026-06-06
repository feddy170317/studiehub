/* MMT2 Quiz — Emne T-6: Slibning og overfladebehandling. Kilde: T_Q6_*.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['T_Q6'] = {
  intro: 'Slibning og finbearbejdning bruges til at opnå <b>tætte tolerancer og glatte overflader</b> — ud over hvad drejning og fræsning kan. Og rustfrit stål er ikke "magisk": almindeligt stål kan også gøres korrosionsbestandigt ved overfladebehandling (fx galvanisering, hvor zinken "ofrer sig").',
  analogi: '⚒ Analogi: en slibeskive er som et blyantspidser med tusindvis af hårde abrasive korn. Når kornene slides sløve, stopper de med at skære — så skal skiven "dresses" (afrettes og skærpes med en diamant).',
  examQs: [
    'Definér dressing i slibning. Hvorfor er det nødvendigt?',
    'Forklar lapping, honing, reaming og fræsning (anvendelse + tolerance).',
    'Hvordan påvirker tættere tolerancekrav fremstillingsprisen?',
    'Metoder til at gøre stål korrosionsbestandigt.',
    'Hvordan gøres aluminium typisk korrosionsbestandigt?'
  ],
  svgCap: 'Fremstillingsprisen stiger eksponentielt med tættere tolerancer (lavere IT-klasse). Grovbearbejdning er billigt; honing/lapping i de tætteste klasser kræver specialprocesser, lange cyklustider og mere kontrol.',
  svg: costSVG(),
  mc: [
    { level:'let', q:'Hvad er <b>dressing</b> af en slibeskive?',
      options:['At smøre skiven','At gendanne skivens form og skæreevne med et diamantredskab (fjerne sløve korn, eksponere skarpe)','At køle emnet','At måle tolerancen'],
      correct:1,
      why:'Dressing afretter og skærper slibeskiven: et diamantværktøj fjerner sløve/tilstoppede korn og blotter friske, skarpe korn — så skiven skærer effektivt igen.' },
    { level:'let', q:'Hvordan gøres aluminium typisk EKSTRA korrosionsbestandigt?',
      options:['Galvanisering med zink','Anodisering — elektrolytisk fortykkelse af det naturlige Al₂O₃-lag (5–25 µm)','Tilsætning af kulstof','Hærdning i vand'],
      correct:1,
      why:'Al danner naturligt et tyndt (~4 nm) Al₂O₃-lag. Anodisering fortykker det elektrolytisk til 5–25 µm; porerne kan farves (dekorativt) eller forsegles for endnu bedre beskyttelse.' },
    { level:'let', q:'Hvad er <b>galvanisering</b> af stål?',
      options:['En malingstype','En zink-belægning der virker som offeranode (katodisk beskyttelse) og barriere','En slibeproces','En hærdningsmetode'],
      correct:1,
      why:'Ved varmforzinkning dyppes stål i smeltet zink. Zinklaget beskytter dobbelt: som barriere og som offeranode (zink er mindre ædel og ofrer sig, selv ved ridser). Bruges til tagplader, rækværk, skruer.' },
    { level:'let', q:'Hvilken proces giver de tætteste tolerancer og glatteste overflade?',
      options:['Fræsning','Lapping (IT3–IT5, Ra < 0,1 µm)','Boring','Grovdrejning'],
      correct:1,
      why:'Lapping bruger en meget fin abrasiv slurry mellem to flader → ekstremt glat (Ra < 0,1 µm) og tætte tolerancer (IT3–IT5). Bruges til optiske flader, ventilsæder og målehoveder.' },
    { level:'middel', q:'Hvorfor er regelmæssig dressing nødvendig?',
      options:['For at gøre skiven større','Fordi sløve korn genererer mere varme og giver dårligere finish/nøjagtighed (øgede skærekræfter, termisk skade)','For at farve emnet','For at fjerne kølemiddel'],
      correct:1,
      why:'Slidte/sløve korn skærer ikke rent → mere friktion og varme, højere skærekræfter, dårligere Ra og risiko for termisk beskadigelse af emnet. Dressing genopretter skæreevnen.' },
    { level:'middel', q:'Hvad er <b>honing</b>, og hvor bruges det typisk?',
      options:['Slibning af flade plader','Abrasive sten i en ekspanderende dorn der roterer og oscillerer i et borehul — fx cylinderforinger i motorer','Udskæring af blanks','Galvanisering'],
      correct:1,
      why:'Honing finbearbejder borehuller: stenene presses ud mod væggen og bevæger sig roterende + frem/tilbage → et "krydshatch"-mønster. Bruges til motorcylinderforinger og hydraulikcylindre.' },
    { level:'middel', q:'Hvordan påvirker tættere tolerancekrav fremstillingsprisen?',
      options:['Lineært (lille effekt)','Prisen stiger eksponentielt med tættere tolerancer','Prisen falder','Ingen sammenhæng'],
      correct:1,
      why:'At gå fra fx IT14 til IT6 kan koste 10–50× mere pr. operation: specialprocesser (honing/lapping), mere spild/kassering, temperatur-/vibrationskontrol og hyppigere måling.' },
    { level:'middel', q:'Reaming vs. honing — hvad er forskellen?',
      options:['De er identiske','Reaming følger et eksisterende hul og fjerner lidt materiale (præcist pasbor, H7); honing giver finere Ra + krydshatch-mønster','Honing borer nye huller','Reaming farver overfladen'],
      correct:1,
      why:'Reaming bruger en flerskærs-rival til at gøre et eksisterende hul præcist (IT6–IT8, H7). Honing er finere (IT5–IT6, lavere Ra) og giver det karakteristiske krydshatch til smørefilm/tæthed.' },
    { level:'middel', q:'Hvad er princippet i <b>anodisering</b>?',
      options:['Påsprøjtning af maling','Elektrolytisk oxidation (fx i svovlsyrebad) der fortykker Al₂O₃-laget; porerne kan farves eller forsegles','Varmforzinkning','Mekanisk polering'],
      correct:1,
      why:'Anodisering er en kontrolleret elektrolytisk oxidation der bygger et tykt, hårdt Al₂O₃-lag. Det giver slid-/korrosionsbeskyttelse og kan farves (dekorativt) — bruges til facader, elektronik-housings, sportsgrej.' },
    { level:'svaer', q:'Hvad er forskellen på <b>truing</b> og <b>dressing</b> af en slibeskive?',
      options:['De er det samme','Truing gendanner skivens geometri (gør den præcis rund/korrekt profil); dressing fjerner sløve korn og blotter skarpe (skærpning)','Truing er en korrosionsbehandling','Dressing måler diameteren'],
      correct:1,
      why:'Truing handler om FORM/geometri (skiven skal være rund og have rette profil). Dressing handler om SKÆREEVNE (fjerne sløve/tilstoppede korn og eksponere friske). Diamantredskabet kan gøre begge dele.' },
    { level:'svaer', q:'Hvorfor vælges honing frem for slibning som AFSLUTTENDE trin på en hydraulikcylinder?',
      options:['Honing er hurtigere og billigere','Honing giver et krydshatch-mønster (god smørefilm + tæthed mod tætningsring), ingen termisk skade og ingen indlejrede abrasivpartikler','Slibning kan ikke ramme tolerancen','Honing fjerner mere materiale'],
      correct:1,
      why:'Slibning kan give chatter-mærker, termisk påvirkning og indlejrede abrasivkorn. Honing er mild (ingen varmeskade) og efterlader krydshatch, der holder på smørefilmen og tætner mod stempelringen — derfor ideel som finish.' },
    { level:'svaer', q:'Hvorfor stiger prisen <b>eksponentielt</b> (ikke lineært) med tættere tolerance?',
      options:['Fordi materialet bliver dyrere','Fordi det kræver specialprocesser med lange cyklustider, øget kassering, temperatur-/vibrationskontrol og hyppigere/dyrere måling — alt sammen samtidig','Fordi man bruger mere kølemiddel','Fordi emnet bliver tungere'],
      correct:1,
      why:'Tætte tolerancer kræver flere ting på én gang: dyre finprocesser (honing/lapping), flere kasserede emner, klimakontrol af maskinen og intensiv måling. Effekterne lægger sig oven i hinanden → eksponentiel prisstigning.' }
  ],
  cards: [
    { q:'Lapping / honing / reaming / fræsning?', a:'Lapping: fin slurry mellem flader, Ra<0,1 µm (optik, ventilsæder). Honing: sten i dorn, krydshatch (cylinderforinger). Reaming: præcist eksisterende hul, H7. Fræsning: generel bearbejdning, Ra 0,8–3,2 µm.' },
    { q:'Truing vs. dressing?', a:'Truing = gendan geometrien (skiven skal være præcis rund/profileret). Dressing = skærp skiven (fjern sløve korn, eksponer skarpe). Begge gøres med diamantredskab.' },
    { q:'Korrosionsbeskyttelse af stål?', a:'Galvanisering (Zn-offeranode + barriere), maling/coating (epoxy/PU), krom/nikkel-plettering, phosphatering (forbehandling), katodisk beskyttelse (offeranode/strøm), legering (>10,5 % Cr = rustfrit).' },
    { q:'Korrosionsbeskyttelse af aluminium?', a:'Naturligt selvhelende Al₂O₃-film (~4 nm). For mere: anodisering (fortykker til 5–25 µm, kan farves/forsegles), chromat-konvertering (Alodine, luftfart) og maling/lak ovenpå.' }
  ]
};

function costSVG(){ return '\
<svg viewBox="0 0 520 300" width="520" height="300" role="img" aria-label="Tolerance vs fremstillingspris">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cdd3da} .pr{font:600 9px Nunito,sans-serif;fill:#9aa1ab}</style>\
<rect x="70" y="30" width="400" height="230" fill="#12151a"/>\
<path d="M85 250 Q200 244 300 200 Q380 165 420 110 Q445 78 458 48" fill="none" stroke="#ff6a00" stroke-width="3.5"/>\
<path d="M85 250 Q200 244 300 200 Q380 165 420 110 Q445 78 458 48 L458 260 L85 260 Z" fill="#ff6a00" opacity="0.10"/>\
<g class="pr">\
<text x="120" y="244">Grovbearbejdn.</text>\
<text x="215" y="226">Boring</text>\
<text x="300" y="190">Fræsning</text>\
<text x="372" y="150">Slibning</text>\
<text x="408" y="92">Honing/Lapping</text></g>\
<line x1="70" y1="260" x2="470" y2="260" stroke="#cdd3da" stroke-width="2"/>\
<line x1="70" y1="260" x2="70" y2="30" stroke="#cdd3da" stroke-width="2"/>\
<g class="ax" text-anchor="middle">\
<text x="110" y="278">IT14</text><text x="190" y="278">IT11</text><text x="275" y="278">IT9</text><text x="360" y="278">IT7</text><text x="440" y="278">IT5</text></g>\
<text x="270" y="296" class="ax" text-anchor="middle">Tolerance (IT-klasse) — tættere →</text>\
<g class="ax" text-anchor="end">\
<text x="64" y="250">Lav</text><text x="64" y="180">Middel</text><text x="64" y="110">Høj</text><text x="64" y="55">Meget høj</text></g>\
<text x="26" y="145" class="ax" text-anchor="middle" transform="rotate(-90 26,145)">Relativ pris</text>\
</svg>'; }
