/* MMT2 Quiz — Emne M-2: TTT- og CCT-diagrammer. Kilde: M_Q2_TTT_CCT_Diagrammer.tex
   12 spørgsmål · spredning: 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['M_Q2'] = {
  intro: 'Et <b>TTT-diagram</b> (Time–Temperature–Transformation) svarer på: "Hvis jeg holder stål ved én fast temperatur — hvornår starter og slutter omdannelsen?" Tre zoner fra top til bund: høj temperatur (nær 727 °C) → <b>grov perlit</b> (blød); mellem (300–550 °C) → <b>bainit</b>; lav (under M<sub>s</sub> ≈ 230 °C) → <b>martensit</b> (hårdest, sprød). <b>CCT</b> er den praktiske bror: den viser hvad der sker ved kontinuerlig afkøling, og kurverne er forskudt ned og til højre.',
  analogi: '⚒ Analogi: TTT = "hvad sker der, hvis du trykker en knap og holder den nede?" (isoterm). CCT = "hvad sker der i den virkelige verden, hvor du trykker og slipper gradvist?" (kontinuerlig afkøling i ovn/luft/olie/vand).',
  examQs: [
    'Sammenhængen mellem jern-kulstof-diagrammet og TTT-diagrammet.',
    'Forskellen mellem TTT og CCT, og hvornår de hver især bruges.',
    'Dannelsen af perlit, bainit, sfæroidit og martensit via et TTT-diagram.',
    'Hvordan kølehastighed påvirker den resulterende mikrostruktur.',
    'De mekaniske egenskaber for de forskellige mikrostrukturer.',
    'Hvorfor CCT er mere praksisnær end TTT ved industrielle processer.'
  ],
  svgCap: 'Skematisk TTT-diagram for eutektoidt stål (0,76 % C). Blå = TTT start/slut (C-kurver). Rød stiplet = CCT (forskudt ned/højre). Langsom afkøling → perlit; kritisk afkøling forbi "næsen" → martensit.',
  svg: tttSVG(),
  mc: [
    { level:'let', q:'Hvad står <b>TTT</b> for?',
      options:['Total Thermal Treatment','Time – Temperature – Transformation','Temperature – Tension – Time','Transformation – Tempering – Time'],
      correct:1,
      why:'Time–Temperature–Transformation: diagrammet plotter, hvornår omdannelsen starter og slutter som funktion af tid ved en given (fast) temperatur.' },
    { level:'let', q:'Et TTT-diagram beskriver omdannelse ved …',
      options:['kontinuerlig afkøling','konstant (isoterm) temperatur','opvarmning fra stuetemperatur','konstant tryk'],
      correct:1,
      why:'TTT = isoterm: prøven afkøles brat til én fast temperatur og holdes der. Det giver de karakteristiske C-formede start/slut-kurver. CCT beskriver derimod kontinuerlig afkøling.' },
    { level:'let', q:'Martensit har krystalstrukturen:',
      options:['FCC','BCC','BCT (body-centered tetragonal) med fanget kulstof','HCP'],
      correct:2,
      why:'Kulstoffet er "fanget" i et forvrænget BCC-gitter → BCT med store interne trykspændinger. Det giver ekstrem hårdhed, men lav sejhed.' },
    { level:'let', q:'Hvilken struktur har <b>højest hårdhed</b> (HB)?',
      options:['Grov perlit (~200)','Øvre bainit (~400)','Martensit (700+)','Sfæroidit (~170)'],
      correct:2,
      why:'Hårdheden stiger fra sfæroidit → perlit → bainit → martensit. Martensit topper (700+ HB), men er sprød og kræver anløbning. Sfæroidit er blødest.' },
    { level:'middel', q:'Hvilken mikrostruktur dannes ved den <b>hurtigste (kritiske)</b> afkøling, under M<sub>s</sub>?',
      options:['Grov perlit','Øvre bainit','Martensit','Sfæroidit'],
      correct:2,
      why:'Køler man hurtigere end "næsen" på C-kurven, når kulstoffet ikke at diffundere → diffusionsløs omdannelse til martensit (hårdest men sprød). Den anløbes altid bagefter.' },
    { level:'middel', q:'CCT-kurverne ligger i forhold til TTT-kurverne:',
      options:['Forskudt op og til venstre','Helt identiske','Forskudt ned og til højre','Lodret stablet'],
      correct:2,
      why:'Pga. inkubationstiden under kontinuerlig afkøling forskydes kurverne ned og til højre. CCT er mere praksisnær, fordi industriprocesser køler kontinuerligt.' },
    { level:'middel', q:'<b>Sfæroidit</b> — hvornår dannes den, og hvad kendetegner den?',
      options:['Kritisk afkøling; hårdest','Langvarig glødning lige under A₁; kuglet cementit i ferrit, blødest — ideel til maskinering','Isoterm 400–550 °C; bainit','Hurtig køling; fine lameller'],
      correct:1,
      why:'Ved langvarig opvarmning under A₁ samler cementit-lamellerne sig til kugler (overfladespændings-minimering). Resultatet er den blødeste struktur — perfekt til maskinering.' },
    { level:'middel', q:'Hvad er sammenhængen mellem Fe-C-diagrammet og TTT-diagrammet?',
      options:['TTT erstatter Fe-C-diagrammet helt','TTT beskriver transformationskinetikken UNDER A₁ for én bestemt sammensætning; udgangspunktet er austenit fra Fe-C-diagrammet','TTT gælder kun for støbejern','De har intet med hinanden at gøre'],
      correct:1,
      why:'Stål austenitiseres (op i γ-feltet i Fe-C-diagrammet), og TTT/CCT beskriver så, hvilken mikrostruktur austenitten omdannes til afhængigt af afkølingen — et diagram pr. sammensætning.' },
    { level:'middel', q:'<b>Bainit</b> dannes ved og kendetegnes ved:',
      options:['Høj temp. nær 727 °C; blødest','Isoterm mellemtemperatur (~250–550 °C); hårdere end perlit men sejere end martensit','Kun ved kritisk afkøling; sprødest','Langvarig glødning; kuglet cementit'],
      correct:1,
      why:'Bainit dannes ved isoterm holdning i mellemtemperatur-zonen. Øvre bainit (~400–550 °C) og nedre bainit (~250–400 °C) giver en god kombination af hårdhed og sejhed.' },
    { level:'svaer', q:'<b>Austempering</b> er processen hvor man …',
      options:['hærder til martensit og anløber bagefter','holder isotermt i bainit-zonen (~350 °C) → nedre bainit med høj hårdhed OG bedre sejhed/færre spændinger end martensit','udgløder langsomt til sfæroidit','normaliserer i stille luft'],
      correct:1,
      why:'Ved austempering stoppes den raske afkøling i bainit-zonen i stedet for at fortsætte til M<sub>s</sub>. Resultatet er nedre bainit: næsten martensit-hårdhed, men markant bedre sejhed og færre hærdespændinger/revner.' },
    { level:'svaer', q:'Hvorfor er <b>CCT</b> mere praksisnær end TTT ved industrielle processer?',
      options:['Fordi CCT er hurtigere at tegne','Fordi industriprocesser næsten aldrig holder isotermt — man køler kontinuerligt i luft/olie/vand, og CCT viser direkte hvilken struktur en given kølehastighed giver','Fordi TTT kun gælder for aluminium','Fordi CCT ikke kræver austenitisering'],
      correct:1,
      why:'TTT forudsætter en brat nedkøling til fast temperatur + isoterm holdning — det sker sjældent i praksis. CCT modellerer den virkelige kontinuerlige afkøling og kobler kølehastighed direkte til slutstruktur.' },
    { level:'svaer', q:'Hvorfor skal hærdet (martensitisk) stål <b>altid anløbes</b> (tempereres)?',
      options:['For at gøre det endnu hårdere','Fordi ren martensit er ekstremt hård men sprød (fanget C + store interne spændinger); anløbning genvinder sejhed mod en let lavere hårdhed','For at omdanne det til austenit igen','For at fjerne al kulstof'],
      correct:1,
      why:'Frisk martensit er hård men sprød og fuld af indre spændinger. Anløbning (opvarmning til moderat temp.) lader noget kulstof udfælde som fine carbider → sejheden stiger markant mod en kontrolleret reduktion i hårdhed.' }
  ],
  cards: [
    { q:'De tre temperatur-zoner i et TTT (top → bund)?', a:'Høj (nær 727 °C): grov perlit, blød/sej. Mellem (300–550 °C): bainit. Lav (under M_s ≈ 230 °C): martensit, hårdest men sprød.' },
    { q:'TTT vs. CCT — hvornår bruges de?', a:'TTT (isoterm): teori + austempering/martempering. CCT (kontinuerlig): industriprocesser — normalisering, hærdning, afkøling i ovn/luft/olie/vand. CCT er praksisnær.' },
    { q:'Hvorfor anløbes (tempereres) martensit altid?', a:'Ren martensit er ekstremt hård men sprød pga. fanget kulstof og store interne spændinger. Anløbning genvinder sejhed mod en let reduktion i hårdhed.' },
    { q:'Kølehastighed → struktur?', a:'Langsom → grov perlit. Hurtigere → fin perlit/bainit. Kritisk hurtig (forbi næsen) → martensit. Jo hurtigere køling, jo hårdere og mindre duktil.' }
  ]
};

function tttSVG(){ return '\
<svg viewBox="0 0 520 320" width="520" height="320" role="img" aria-label="Skematisk TTT-diagram">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cdd3da} .zn{font:700 11px Nunito,sans-serif}</style>\
<rect x="60" y="30" width="420" height="250" fill="#12151a"/>\
<rect x="60" y="30" width="420" height="40" fill="#ffb627" opacity="0.08"/>\
<rect x="60" y="70" width="420" height="80" fill="#5fd17a" opacity="0.07"/>\
<rect x="60" y="150" width="420" height="60" fill="#3fd0d6" opacity="0.07"/>\
<rect x="60" y="240" width="420" height="40" fill="#ff5a4d" opacity="0.08"/>\
<line x1="60" y1="70" x2="480" y2="70" stroke="#ff9b3d" stroke-width="2" stroke-dasharray="7 4"/>\
<text x="484" y="74" fill="#ff9b3d" class="ax">A₁ 727 °C</text>\
<line x1="60" y1="240" x2="480" y2="240" stroke="#ff5a4d" stroke-width="2" stroke-dasharray="7 4"/>\
<text x="484" y="244" fill="#ff5a4d" class="ax">M_s ≈230</text>\
<line x1="60" y1="265" x2="480" y2="265" stroke="#ff8a80" stroke-width="1.5" stroke-dasharray="4 4"/>\
<text x="484" y="269" fill="#ff8a80" class="ax">M_f</text>\
<path d="M250 75 C150 105 120 135 120 158 C120 180 160 205 188 222" fill="none" stroke="#62b0e0" stroke-width="3"/>\
<path d="M330 75 C235 105 205 135 205 158 C205 180 245 205 272 222" fill="none" stroke="#7fb8d8" stroke-width="2.5" stroke-dasharray="7 5"/>\
<path d="M300 75 C205 110 178 140 182 168 C188 198 218 218 250 234" fill="none" stroke="#ff6a00" stroke-width="2.5" stroke-dasharray="3 4"/>\
<text x="300" y="250" fill="#ff8a3d" class="ax">CCT</text>\
<line x1="400" y1="36" x2="400" y2="118" stroke="#5fd17a" stroke-width="3" marker-end="url(#ag)"/>\
<text x="356" y="132" fill="#5fd17a" class="ax">Langsom → Perlit</text>\
<line x1="78" y1="36" x2="100" y2="250" stroke="#ff5a4d" stroke-width="3" marker-end="url(#ar2)"/>\
<text x="92" y="206" fill="#ff5a4d" class="ax">Kritisk</text>\
<defs>\
<marker id="ag" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><polygon points="0,0 8,0 4,8" fill="#5fd17a"/></marker>\
<marker id="ar2" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><polygon points="0,0 8,0 4,8" fill="#ff5a4d"/></marker>\
</defs>\
<text x="360" y="55" fill="#ffd27a" class="zn">Austenit (ustabil)</text>\
<text x="360" y="115" fill="#7fe39a" class="zn">Perlit-region</text>\
<text x="360" y="185" fill="#6fe0e6" class="zn">Bainit-region</text>\
<text x="370" y="262" fill="#ff8a80" class="zn">Martensit</text>\
<text x="128" y="150" fill="#9ad0f0" class="ax">Start</text>\
<text x="210" y="150" fill="#9ad0f0" class="ax">Slut</text>\
<line x1="60" y1="280" x2="480" y2="280" stroke="#cdd3da" stroke-width="2"/>\
<line x1="60" y1="280" x2="60" y2="30" stroke="#cdd3da" stroke-width="2"/>\
<text x="270" y="306" class="ax" text-anchor="middle">log(tid) →</text>\
<text x="20" y="155" class="ax" text-anchor="middle" transform="rotate(-90 20,155)">Temperatur (°C)</text>\
</svg>'; }
