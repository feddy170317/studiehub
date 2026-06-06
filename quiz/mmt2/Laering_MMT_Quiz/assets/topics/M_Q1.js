/* MMT2 Quiz — Emne M-1: Jern-kulstof-diagrammet. Kilde: M_Q1_v2_Jern_Kulstof_Diagram.tex
   12 spørgsmål · spredning: 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['M_Q1'] = {
  intro: 'Hvorfor er jern så indviklet? Fordi rent jern <b>skifter krystalstruktur tre gange</b> under afkøling fra smelte til stuetemperatur — det kaldes <b>allotropi</b>, og det er hele grunden til at stål kan varmebehandles. FCC-austenit har større huller mellem atomerne og opløser meget mere kulstof (op til 2,14 %) end BCC-ferrit (maks. 0,022 %) — netop den forskel gør hærdning mulig.',
  analogi: '⚒ Analogi: Ligesom vand stivner til is ved 0 °C, "fryser" austenit til <b>perlit</b> ved præcis 0,76 % C og 727 °C — begge nye faser (ferrit + cementit) dannes på én gang. "-oid" betyder "som om": en eutektoid ligner en eutektisk reaktion, men starter fra fast stof.',
  examQs: [
    'Redegør for jern-kulstof-diagrammets opbygning og de vigtigste faser (austenit, ferrit, cementit, perlit) og linjer.',
    'Forklar eutektoid transformation og illustrér med et skitseret fasediagram.',
    'Forskelle i mikrostruktur/egenskaber for under-eutektoidt vs. over-eutektoidt stål.',
    'Forklar hvordan vægtreglen bestemmer faseandele i et to-fase-område.',
    'Diskutér sammenhængen mellem kulstofindhold, mikrostruktur og mekaniske egenskaber.'
  ],
  svgCap: 'Forenklet Fe-Fe₃C-fasediagram. Punkt A = eutektisk (1148 °C, 4,30 % C), punkt B = eutektoid (727 °C, 0,76 % C). Cementit Fe₃C er den lodrette linje ved 6,7 % C. Grænsen stål/støbejern går ved 2,14 % C.',
  svg: feCSVG(),
  mc: [
    { level:'let', q:'Hvilken fase er <b>FCC</b> og opløser mest kulstof (op til 2,14 %)?',
      options:['Ferrit (α)','Austenit (γ)','Cementit (Fe₃C)','Perlit'],
      correct:1,
      why:'Austenit (γ-Fe) er FCC og har større interstitielle huller → opløser op til 2,14 % C ved 1148 °C. Ferrit (BCC) kun 0,022 %. Det er denne forskel i opløselighed der gør hærdning mulig.' },
    { level:'let', q:'Cementit (Fe₃C) har et fast kulstofindhold på:',
      options:['0,022 %','0,76 %','2,14 %','6,7 %'],
      correct:3,
      why:'Cementit er en intermetallisk forbindelse med fast støkiometri ved 6,7 % C — derfor tegnes den som en lodret linje i diagrammet. Den er meget hård og sprød.' },
    { level:'let', q:'Hvad kendetegner <b>perlit</b>?',
      options:['Ren ferrit','En BCT-struktur med fanget kulstof','En lameleret blanding af ferrit + cementit','Kuglet cementit i en ferritmasse'],
      correct:2,
      why:'Perlit er alternerende lameller af blød ferrit og hård cementit, dannet ved eutektoid transformation. BCT med fanget C = martensit; kuglet cementit = sfæroidit.' },
    { level:'let', q:'Hvilken fase er <b>blød og sej</b>, har BCC-struktur og opløser maks. 0,022 % C?',
      options:['Ferrit (α)','Austenit (γ)','Cementit (Fe₃C)','Martensit'],
      correct:0,
      why:'Ferrit (α-Fe) er BCC, blød og sej, med meget lav kulstofopløselighed (maks. 0,022 % ved 727 °C). Det er hovedfasen i blødt konstruktionsstål.' },
    { level:'middel', q:'Den <b>eutektoide</b> reaktion er:',
      options:['L → γ + Fe₃C','γ → α + Fe₃C','L → α + γ','α → γ + Fe₃C'],
      correct:1,
      why:'Ved 727 °C og 0,76 % C omdannes fast austenit til ferrit + cementit (= perlit). Den eutektiske reaktion (L → γ + Fe₃C) sker derimod fra smelte ved 1148 °C / 4,30 %.' },
    { level:'middel', q:'Det <b>eutektiske</b> punkt i Fe-C-diagrammet ligger ved:',
      options:['727 °C og 0,76 % C','1148 °C og 4,30 % C','912 °C og 0,022 % C','1538 °C og 6,7 % C'],
      correct:1,
      why:'Punkt A (eutektisk): 1148 °C, 4,30 % C, hvor L → γ + Fe₃C. Det er grænsen mellem stål og støbejern. Punkt B (eutektoid) er derimod 727 °C / 0,76 %.' },
    { level:'middel', q:'Et <b>under-eutektoidt</b> stål (&lt;0,76 % C) består ved stuetemperatur af:',
      options:['Cementit-netværk + perlit','Pro-eutektoid ferrit + perlit','Ren perlit','Martensit + ferrit'],
      correct:1,
      why:'Under afkøling krydses A₃-linjen først → pro-eutektoid ferrit dannes ved korngrænserne. Resten når 0,76 % C ved 727 °C og bliver til perlit.' },
    { level:'middel', q:'Hvorfor bliver <b>over-eutektoidt</b> stål sprødt?',
      options:['For meget blød ferrit','Et sammenhængende pro-eutektoid cementit-netværk langs korngrænserne','Fordi der dannes martensit ved langsom køling','Fordi perlitten bliver for grov'],
      correct:1,
      why:'Over 0,76 % C krydses A_cm først, og hård, sprød cementit udfældes som et netværk langs korngrænserne. Dette netværk er svaghedsbanen der gør stålet sprødt.' },
    { level:'middel', q:'Klassifikationen efter kulstofindhold: hvad er intervallet for <b>stål</b>?',
      options:['0–0,008 % C','0,008–2,14 % C','2,14–6,67 % C','0,76–4,30 % C'],
      correct:1,
      why:'Jern: 0–0,008 %. Stål: 0,008–2,14 % (grænsen = austenittens maks. C-opløselighed). Støbejern: 2,14–6,67 % C.' },
    { level:'svaer', q:'Vægtreglen lige under 727 °C (i α+Fe₃C): vægtandelen <b>cementit</b> for et stål med C₀ % er:',
      options:['(6,7 − C₀) / (6,7 − 0,022)','(C₀ − 0,022) / (6,7 − 0,022)','(C₀ − 0,022) / (0,76 − 0,022)','(6,7 − C₀) / (6,7 − 0,76)'],
      correct:1,
      why:'Tie-linjen går fra α (0,022 % C) til Fe₃C (6,7 % C). Cementit-armen er afstanden til α-enden: (C₀ − 0,022)/(6,7 − 0,022). Svar C/D er perlit-tie-linjer LIGE OVER A₁ — pas på ikke at bytte om.' },
    { level:'svaer', q:'For et <b>hypoeutektoidt</b> stål: andelen <b>perlit</b> (= W<sub>γ</sub> lige over A₁) bestemmes som:',
      options:['(C₀ − 0,022) / (6,7 − 0,022)','(C₀ − 0,022) / (0,76 − 0,022)','(0,76 − C₀) / (0,76 − 0,022)','(6,7 − C₀) / (6,7 − 0,76)'],
      correct:1,
      why:'Perlit dannes af den austenit, der når 0,76 % ved 727 °C. Tie-linjen lige OVER A₁ går fra α (0,022 %) til γ (0,76 %); perlit-armen er (C₀ − 0,022)/(0,76 − 0,022). Det er en ANDEN tie-line end cementit-vægtreglen under A₁.' },
    { level:'svaer', q:'Allotropi: rent jern skifter struktur under afkøling fra smelte i rækkefølgen:',
      options:['FCC → BCC → FCC','δ-ferrit (BCC, 1538 °C) → austenit (FCC, 1394 °C) → ferrit (BCC, 912 °C)','Forbliver altid BCC','Kun jern med kulstof skifter struktur'],
      correct:1,
      why:'Smelte → δ-ferrit (BCC) ved 1538 °C → austenit γ (FCC) ved 1394 °C → ferrit α (BCC) ved 912 °C. δ og α er begge BCC; γ er FCC. Det er denne γ↔α-allotropi der muliggør varmebehandling.' }
  ],
  cards: [
    { q:'Eutektisk vs. eutektoid punkt?', a:'Eutektisk: 1148 °C, 4,30 % C, L → γ + Fe₃C (grænsen stål/støbejern). Eutektoid: 727 °C, 0,76 % C, γ → α + Fe₃C (basis for al varmebehandling).' },
    { q:'Ferrit vs. austenit — struktur og C-opløselighed?', a:'Ferrit α: BCC, blød/sej, maks. 0,022 % C. Austenit γ: FCC, maks. 2,14 % C, stabil 727–1394 °C, udgangspunkt for varmebehandling.' },
    { q:'Hvad er A₁-, A₃- og A_cm-linjerne?', a:'A₁ = 727 °C, eutektoid-temperatur. A₃ = grænse austenit/(α+γ) for under-eutektoidt stål. A_cm = grænse for sekundær cementit-udfældning (>0,76 % C).' },
    { q:'Sammenhæng C-indhold ↔ egenskaber?', a:'Styrke og hårdhed stiger med C op til ~0,8 % (ren perlit); derover gør cementit-netværket stålet sprødt. Duktilitet falder konsekvent med C. Konstruktionsstål ligger derfor på 0,1–0,5 % C.' },
    { q:'Klassifikation efter C-indhold?', a:'Jern: 0–0,008 %. Stål: 0,008–2,14 %. Støbejern: 2,14–6,67 % C. Grænsen stål/støbejern er det eutektiske punkts γ-opløselighed (2,14 %).' }
  ]
};

function feCSVG(){ return '\
<svg viewBox="0 0 520 360" width="520" height="360" role="img" aria-label="Forenklet jern-kulstof fasediagram">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cdd3da} .zn{font:700 12px Nunito,sans-serif} .pt{font:700 10px Nunito,sans-serif}</style>\
<rect x="60" y="30" width="420" height="290" fill="#12151a"/>\
<g stroke="#2a2f37" stroke-width="1">\
<line x1="60" y1="80" x2="480" y2="80"/><line x1="60" y1="139" x2="480" y2="139"/><line x1="60" y1="196" x2="480" y2="196"/><line x1="60" y1="241" x2="480" y2="241"/></g>\
<polygon points="60,30 130,75 200,139 330,139 480,80 480,30" fill="#3aa0d8" opacity="0.10"/>\
<polygon points="60,80 130,75 200,139 108,241 60,196" fill="#62b0e0" opacity="0.13"/>\
<polygon points="60,196 108,241 60,241" fill="#3fd0d6" opacity="0.16"/>\
<polygon points="60,241 480,241 480,320 60,320" fill="#ff5a4d" opacity="0.07"/>\
<polygon points="108,241 480,241 480,139 200,139" fill="#ff6a00" opacity="0.09"/>\
<polygon points="330,139 480,80 480,139" fill="#ffb627" opacity="0.12"/>\
<line x1="60" y1="241" x2="480" y2="241" stroke="#ff5a4d" stroke-width="3"/>\
<text x="484" y="245" fill="#ff5a4d" class="pt">727 °C</text>\
<line x1="200" y1="139" x2="480" y2="139" stroke="#b39ddb" stroke-width="3"/>\
<text x="484" y="143" fill="#b39ddb" class="pt">1148 °C</text>\
<line x1="480" y1="320" x2="480" y2="80" stroke="#ff5a4d" stroke-width="3"/>\
<text x="470" y="200" fill="#ff5a4d" class="pt" transform="rotate(-90 470,200)" text-anchor="middle">Fe₃C (cementit) 6,7 %</text>\
<path d="M60 196 Q92 232 108 241" fill="none" stroke="#62b0e0" stroke-width="2"/>\
<text x="64" y="188" fill="#62b0e0" class="pt">A₃</text>\
<path d="M108 241 Q150 178 200 139" fill="none" stroke="#62b0e0" stroke-width="2"/>\
<text x="138" y="205" fill="#62b0e0" class="pt">A_cm</text>\
<path d="M60 80 Q150 92 330 139" fill="none" stroke="#7fb8d8" stroke-width="1.5" opacity="0.8"/>\
<path d="M330 139 Q420 118 480 80" fill="none" stroke="#7fb8d8" stroke-width="1.5" opacity="0.8"/>\
<circle cx="108" cy="241" r="4.5" fill="#ff5a4d" stroke="#fff" stroke-width="1"/>\
<text x="114" y="258" fill="#ff8a80" class="pt">B (0,76 % · 727 °C)</text>\
<circle cx="330" cy="139" r="4.5" fill="#b39ddb" stroke="#fff" stroke-width="1"/>\
<text x="250" y="132" fill="#c7b3e8" class="pt">A (4,30 % · 1148 °C)</text>\
<text x="118" y="170" fill="#62b0e0" class="zn">γ</text>\
<text x="64" y="226" fill="#3fd0d6" class="zn" font-size="10">α</text>\
<text x="300" y="200" fill="#ffb083" class="zn" font-size="11">γ + Fe₃C</text>\
<text x="240" y="295" fill="#ff9b90" class="zn" font-size="11">α + Fe₃C</text>\
<text x="392" y="108" fill="#ffd27a" class="zn" font-size="11">L + Fe₃C</text>\
<text x="150" y="58" fill="#9ad0f0" class="zn" font-size="11">L (smelte)</text>\
<line x1="60" y1="320" x2="480" y2="320" stroke="#cdd3da" stroke-width="2"/>\
<line x1="60" y1="320" x2="60" y2="30" stroke="#cdd3da" stroke-width="2"/>\
<text x="270" y="352" class="ax" text-anchor="middle">C-indhold (vægt-%)</text>\
<text x="20" y="180" class="ax" text-anchor="middle" transform="rotate(-90 20,180)">Temperatur (°C)</text>\
<g class="ax" text-anchor="middle">\
<line x1="60" y1="320" x2="60" y2="325" stroke="#cdd3da"/><text x="60" y="337">0</text>\
<line x1="108" y1="320" x2="108" y2="325" stroke="#cdd3da"/><text x="108" y="337">0,76</text>\
<line x1="194" y1="320" x2="194" y2="325" stroke="#cdd3da"/><text x="194" y="337">2,14</text>\
<line x1="330" y1="320" x2="330" y2="325" stroke="#cdd3da"/><text x="330" y="337">4,30</text>\
<line x1="480" y1="320" x2="480" y2="325" stroke="#cdd3da"/><text x="480" y="337">6,7</text></g>\
<g class="ax" text-anchor="end">\
<text x="55" y="245">727</text><text x="55" y="200">912</text><text x="55" y="143">1148</text><text x="55" y="84">1394</text><text x="55" y="49">1538</text></g>\
</svg>'; }
