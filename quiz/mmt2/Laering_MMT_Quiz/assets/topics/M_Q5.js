/* MMT2 Quiz — Emne M-5: Stål, rustfrit stål, støbejern, aluminium. Kilde: M_Q5_*.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['M_Q5'] = {
  intro: 'Stål er jern med <b>&lt;2,14 % C</b> — verdens mest brugte metalgruppe pga. balancen mellem styrke, duktilitet, bearbejdelighed og pris. Støbejern har <b>&gt;2 % C</b>, hvor kulstoffet udfælder forskelligt (grafit = blødere, cementit = hårdere). Aluminium er let (2,7 g/cm³) og korrosionsbestandigt, men kræver legering + modningshærdning for høj styrke.',
  analogi: '⚒ Kaffe-analogi: ulegeret stål = sort kaffe (kun Fe+C). Legeret stål = kaffe med mælk/sukker (Cr, Ni, Mo for særlige egenskaber). Rustfrit stål = kaffe i ståltermos — beskyttet af >10,5 % Cr.',
  examQs: [
    'Definér stål; forskel på ulegeret, legeret og rustfrit stål.',
    'De vigtigste legeringselementer i rustfrit stål (Cr, Ni, Mo, N).',
    'De vigtigste typer rustfrit stål (ferritisk, austenitisk, martensitisk, duplex).',
    'Overblik over støbejern og forskelle i mikrostruktur.',
    'Aluminiumlegeringer: serier 1xxx–7xxx og modningshærdning.'
  ],
  svgCap: 'Kulstoffets form i støbejern bestemmer egenskaberne: gråt (grafitflager = sprødt, dæmpende), hvidt (cementit = hårdt/sprødt), SG/nodular (grafitkugler fra Mg = sejt), tempergods (grafitklynger fra varmebehandling).',
  svg: castIronSVG(),
  mc: [
    { level:'let', q:'Hvad definerer <b>stål</b> mht. kulstofindhold?',
      options:['Jern med >4 % C','Jern med <2,14 % C','Rent jern uden kulstof','Jern med >10 % Cr'],
      correct:1,
      why:'Stål = jernlegering med under 2,14 % C (grænsen = austenittens maks. C-opløselighed ved det eutektiske punkt). Over 2,14 % C taler vi om støbejern.' },
    { level:'let', q:'Hvad er minimumskravet for at et stål er <b>rustfrit</b>?',
      options:['>2 % C','>10,5 % Cr','>8 % Ni','>3 % Mo'],
      correct:1,
      why:'Mindst 10,5 % krom danner den selvhelende Cr₂O₃-passivfilm der gør stålet rustfrit. Ni, Mo og N er sekundære elementer der justerer struktur og egenskaber.' },
    { level:'let', q:'Hvilket element stabiliserer den austenitiske (FCC, ikke-magnetiske) struktur i rustfrit stål?',
      options:['Krom (Cr)','Nikkel (Ni)','Kulstof (C)','Silicium (Si)'],
      correct:1,
      why:'Nikkel er austenitstabiliserende → bevarer FCC ved stuetemperatur (18Cr/8Ni = AISI 304). Det giver høj sejhed, formbarhed og ikke-magnetisk materiale. Cr alene er ferritstabiliserende (BCC).' },
    { level:'let', q:'Hvad gør aluminium attraktivt som konstruktionsmateriale?',
      options:['Det er meget billigt og tungt','Det er let (2,7 g/cm³) og korrosionsbestandigt','Det er hårdere end hærdet stål','Det leder ikke strøm'],
      correct:1,
      why:'Al er let (2,7 vs. 7,8 for stål), korrosionsbestandigt (Al₂O₃-film) og let at forme. Til gengæld kræver det legering + modningshærdning for at opnå høj styrke.' },
    { level:'middel', q:'Hvad tilfører molybdæn (Mo) i AISI 316 sammenlignet med 304?',
      options:['Lavere pris','Øget modstand mod pittingkorrosion (højere PREN-tal)','Magnetiske egenskaber','Lavere kromindhold'],
      correct:1,
      why:'316 = 304 + 2–3 % Mo. Mo hæver PREN-tallet markant → meget bedre modstand mod pitting i klor-/havvandsmiljøer. Derfor bruges 316/316L i marine og kemisk industri.' },
    { level:'middel', q:'Hvad kendetegner <b>gråt støbejern</b>?',
      options:['Cementit-netværk; ekstremt sejt','Grafitflager i perlitmatrix; sprødt, men god vibrationsdæmpning og let at maskinere','Grafitkugler; høj duktilitet','Ingen kulstof'],
      correct:1,
      why:'Gråt støbejern har grafitflager der virker som indre spændingskoncentratorer → sprødt. Til gengæld er det let at støbe/maskinere og dæmper vibrationer godt (motorblokke, maskinfundamenter).' },
    { level:'middel', q:'Hvad gør grafitten <b>kugleformet</b> i SG-jern (nodulargrafitjern), og hvad er effekten?',
      options:['Hurtig vandafkøling; lavere styrke','Tilsætning af magnesium under støbning; kombinerer støbeegenskaber med stållignende sejhed/duktilitet','Højere kulstofindhold; mere sprødt','Slibning af overfladen'],
      correct:1,
      why:'Mg-tilsætning får grafitten til at udfælde som kugler i stedet for flager. Kugler er langt mildere spændingskoncentratorer → høj trækstyrke og duktilitet (krumtapaksler, rørfittings).' },
    { level:'middel', q:'Hvilken Al-legeringsserie modningshærdes og bruges til profiler/konstruktion (fx 6061-T6)?',
      options:['1xxx (ren Al)','3xxx (Al-Mn)','6xxx (Al-Mg-Si)','5xxx (Al-Mg)'],
      correct:2,
      why:'6xxx (Al-Mg-Si) modningshærdes og er arbejdshesten til ekstruderede profiler og konstruktion (6061-T6 ≈ 310 MPa). 2xxx og 7xxx hærdes også (luftfart); 1xxx/3xxx/5xxx gør ikke.' },
    { level:'middel', q:'Austenitisk (304) vs. ferritisk rustfrit stål — hvad er forskellen?',
      options:['Begge er FCC og ens','Austenitisk = FCC (18Cr/8Ni, ikke-magnetisk, sej, svejsbar); ferritisk = BCC (~17 % Cr, ingen Ni, magnetisk, billigere)','Ferritisk indeholder mest nikkel','Austenitisk er altid hårdest'],
      correct:1,
      why:'Austenitisk (FCC) er ikke-magnetisk, sej og svejsbar pga. Ni. Ferritisk (BCC, ingen/lidt Ni) er magnetisk, billigere og har god formbarhed, men lavere sejhed. Martensitisk (BCT) kan hærdes.' },
    { level:'svaer', q:'Hvad er den rigtige rækkefølge i <b>modningshærdning</b> (precipitation hardening)?',
      options:['Modning → vandafkøling → opløsningsglødning','Opløsningsglødning (~500 °C) → hurtig vandafkøling (overmættet opløsning) → modning (fine udfældninger)','Austenitisering → langsom ovnkøling → anløbning','Sintring → presning → modning'],
      correct:1,
      why:'1) Opløsningsglødning: alle legeringselementer i opløsning. 2) Vandafkøling: "fastfryser" den overmættede opløsning. 3) Modning (naturlig/kunstig 100–200 °C): fine intermetalliske udfældninger blokerer dislokationer → styrke/hårdhed stiger.' },
    { level:'svaer', q:'Hvorfor er <b>hvidt støbejern</b> hårdt og sprødt, og hvad bruges det til?',
      options:['Det har grafitkugler; bruges til fjedre','Det har et cementit-netværk (hurtig afkøling, ingen grafit); bruges som mellemprodukt til tempergods','Det er rent ferrit; bruges til ledninger','Det er austenitisk; bruges i havvand'],
      correct:1,
      why:'Hurtig afkøling forhindrer grafitdannelse → al kulstoffet bindes som hårdt, sprødt cementit-netværk. Det er slidstærkt men sprødt og bruges bl.a. som udgangspunkt for tempergods (varmebehandles til grafitklynger).' },
    { level:'svaer', q:'Et austenitisk rustfrit stål svejses og angribes derefter ved korngrænserne i den varmepåvirkede zone. Hvad hedder fænomenet?',
      options:['Pitting','Sensibilisering — Cr₂₃C₆ udfældes ved korngrænserne (425–815 °C) → lokal Cr-udtynding → interkrystallinsk korrosion','Erosionskorrosion','Modningshærdning'],
      correct:1,
      why:'Ved svejsevarmen (425–815 °C) udfældes kromcarbid (Cr₂₃C₆) langs korngrænserne. Det udtømmer krom lokalt, så passivfilmen svigter → interkrystallinsk korrosion. Modvirkes med low-carbon grade (316L) eller Ti/Nb-stabiliseret stål.' }
  ],
  cards: [
    { q:'Ulegeret / legeret / rustfrit stål?', a:'Ulegeret: Fe+C (<2 %), god styrke/pris (S235). Legeret: + Mn/Cr/Ni/Mo for hårdhed/sejhed/korrosion (42CrMo4). Rustfrit: >10,5 % Cr → passivfilm (304, 316L).' },
    { q:'De fire rustfri-typer?', a:'Ferritisk (BCC, ~17%Cr, magnetisk, billig). Austenitisk (FCC, 18/8, sej, svejsbar). Martensitisk (BCT, høj C, hærdes — knive). Duplex (FCC+BCC, høj styrke + chloridmodstand — offshore).' },
    { q:'Cr / Ni / Mo / N i rustfrit stål?', a:'Cr: passivfilm (ferritstabil.). Ni: austenitstabil. (FCC, sejhed). Mo: pittingmodstand (PREN). N: styrke + pittingmodstand, billigt Ni-alternativ.' },
    { q:'De vigtigste støbejernstyper?', a:'Gråt (grafitflager, sprødt/dæmpende), hvidt (cementit, hårdt/sprødt), SG/nodular (grafitkugler fra Mg, sejt), tempergods (hvidt jern varmebehandlet → grafitklynger, duktilt).' }
  ]
};

function castIronSVG(){ return '\
<svg viewBox="0 0 520 230" width="520" height="230" role="img" aria-label="Stoebejern grafitformer">\
<style>.t{font:700 11px Nunito,sans-serif} .s{font:600 10px Nunito,sans-serif;fill:#9aa1ab}</style>\
<g>\
<rect x="20" y="38" width="110" height="120" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<text x="75" y="28" text-anchor="middle" class="t" fill="#cdd3da">Gråt</text>\
<g stroke="#ece0cd" stroke-width="2" stroke-linecap="round">\
<line x1="35" y1="60" x2="60" y2="72"/><line x1="80" y1="55" x2="108" y2="63"/><line x1="40" y1="95" x2="70" y2="88"/><line x1="78" y1="110" x2="115" y2="118"/><line x1="33" y1="130" x2="58" y2="140"/><line x1="85" y1="135" x2="110" y2="128"/><line x1="55" y1="115" x2="80" y2="122"/></g>\
<text x="75" y="174" text-anchor="middle" class="s">grafit-flager · sprødt</text>\
</g>\
<g>\
<rect x="145" y="38" width="110" height="120" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<text x="200" y="28" text-anchor="middle" class="t" fill="#cdd3da">Hvidt</text>\
<g stroke="#62b0e0" stroke-width="1.4" opacity="0.8">\
<line x1="160" y1="50" x2="160" y2="150"/><line x1="180" y1="50" x2="180" y2="150"/><line x1="200" y1="50" x2="200" y2="150"/><line x1="220" y1="50" x2="220" y2="150"/><line x1="240" y1="50" x2="240" y2="150"/><line x1="150" y1="70" x2="250" y2="70"/><line x1="150" y1="100" x2="250" y2="100"/><line x1="150" y1="130" x2="250" y2="130"/></g>\
<text x="200" y="174" text-anchor="middle" class="s">cementit-net · hårdt</text>\
</g>\
<g>\
<rect x="270" y="38" width="110" height="120" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<text x="325" y="28" text-anchor="middle" class="t" fill="#cdd3da">SG / nodular</text>\
<g fill="#ffb627">\
<circle cx="295" cy="65" r="6"/><circle cx="340" cy="58" r="7"/><circle cx="360" cy="95" r="6"/><circle cx="300" cy="105" r="7"/><circle cx="330" cy="130" r="6"/><circle cx="290" cy="140" r="5"/><circle cx="365" cy="135" r="6"/><circle cx="320" cy="90" r="5"/></g>\
<text x="325" y="174" text-anchor="middle" class="s">grafit-kugler · sejt</text>\
</g>\
<g>\
<rect x="395" y="38" width="110" height="120" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<text x="450" y="28" text-anchor="middle" class="t" fill="#cdd3da">Tempergods</text>\
<g fill="#ff8a3d">\
<circle cx="420" cy="62" r="2.2"/><circle cx="425" cy="68" r="2.2"/><circle cx="416" cy="70" r="2.2"/><circle cx="423" cy="60" r="2.2"/>\
<circle cx="465" cy="80" r="2.2"/><circle cx="470" cy="86" r="2.2"/><circle cx="461" cy="87" r="2.2"/><circle cx="468" cy="78" r="2.2"/>\
<circle cx="430" cy="120" r="2.2"/><circle cx="436" cy="126" r="2.2"/><circle cx="427" cy="127" r="2.2"/><circle cx="434" cy="118" r="2.2"/>\
<circle cx="475" cy="130" r="2.2"/><circle cx="480" cy="124" r="2.2"/><circle cx="472" cy="123" r="2.2"/></g>\
<text x="450" y="174" text-anchor="middle" class="s">grafit-klynger · duktilt</text>\
</g>\
</svg>'; }
