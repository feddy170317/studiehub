/* MMT2 Quiz — Emne T-3: Plademetalsformning. Kilde: T_Q3_Plademetalsformning.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['T_Q3'] = {
  intro: 'Plademetalsformning omdanner flade plader til 3D-emner med tryk — uden at fjerne materiale. Tre kernebegreber: <b>FLD</b> (Forming Limit Diagram) = "sikkerheds-kort" over hvilke stræk-kombinationer der får materialet til at briste/rynke; <b>spring-back</b> = metallet springer elastisk delvist tilbage når trykket slippes; <b>draw beads</b> = riller der bremser metalflow og forhindrer rynker i dybtrækning.',
  analogi: '⚒ Spring-back-tip: bøjer du en clips til 90°, fjedrer den lidt tilbage. Derfor overbøjer man (fx til 93°) for at ramme 90° — jo stærkere materiale (højt σ_y/E), jo mere fjedrer det.',
  examQs: [
    'Definér minor og major strain i et FLD og hvordan de forudsiger brud.',
    'Forskel på blanking og punching + typiske anvendelser.',
    'Hvad er spring-back, og hvordan kompenseres det?',
    'Formålet med draw beads i dybtrækning.',
    'Sammenlign regular og fine blanking.'
  ],
  svgCap: 'Forming Limit Diagram (FLD): x = minor strain ε₂ (kan være negativ = kompression), y = major strain ε₁. Den røde Forming Limit Curve (FLC) deler i en sikker zone (under) og en brud-/lunke-zone (over).',
  svg: fldSVG(),
  mc: [
    { level:'let', q:'Hvad er <b>spring-back</b> i pladebøjning?',
      options:['Materialet revner ved bøjning','Metallet er elastisk og springer delvist tilbage når pressekraften fjernes','Pladen krymper ved afkøling','Værktøjet slides ned'],
      correct:1,
      why:'Under bøjning er deformationen både elastisk og plastisk. Når trykket slippes, genoprettes den elastiske del → vinklen åbner sig lidt igen. Derfor skal man kompensere (fx overbøje).' },
    { level:'let', q:'Hvad er formålet med <b>draw beads</b> i dybtrækning?',
      options:['At skære hullet ud','At bremse metalflowet ind i matricen og forhindre rynker','At opvarme pladen','At fjerne grater'],
      correct:1,
      why:'Draw beads (riller i trykringen) tvinger materialet til at bøje frem og tilbage over perlen → øget modstand mod flow → forhindrer for hurtigt indløb og dermed rynker i flangen.' },
    { level:'let', q:'Ved <b>blanking</b> — hvad er produktet?',
      options:['Hullet i pladen','Den udstemplede del (blanken)','Spånerne','Selve værktøjet'],
      correct:1,
      why:'Ved blanking er den udskårne del (blanken) produktet, og den resterende plade er skrot. Blanken har matricens dimensioner. (Modsat punching, hvor hullet er formålet.)' },
    { level:'let', q:'Ved <b>punching</b> — hvad er produktet?',
      options:['Den udstemplede del (slug)','Hullet — den resterende plade med huller er produktet','Begge dele','Hverken eller'],
      correct:1,
      why:'Ved punching er formålet hullet (fx boltehuller, ventilationshuller). Den udstansede bid (slug) er spild. Hullet har stemplets dimensioner.' },
    { level:'middel', q:'Hvad viser akserne i et FLD?',
      options:['Spænding vs. tøjning','Minor strain ε₂ (x) vs. major strain ε₁ (y); over FLC-kurven sker brud','Tid vs. temperatur','Kraft vs. forskydning'],
      correct:1,
      why:'FLD plotter minor strain ε₂ (mindste principal-tøjning, x-akse) mod major strain ε₁ (største, y-akse). Forming Limit Curve (FLC) deler i en sikker zone (under) og brud/lunke (over).' },
    { level:'middel', q:'Hvilke metoder kompenserer for spring-back?',
      options:['Kun at vente','Overbøjning, bottoming (slagslutning), stræk-bøjning og FEM-baseret værktøjsdesign','Hurtigere afkøling','At tilsætte kulstof'],
      correct:1,
      why:'Man kan overbøje (fx 93° for 90°), bottome (presse hårdt i bunden så den elastiske del minimeres), kombinere bøjning med stræk, eller forudsige fjedringen med FEM og kompensere i værktøjet.' },
    { level:'middel', q:'Spring-back er proportional med …',
      options:['kulstofindholdet','σ_y/E (flydegrænse/elasticitetsmodul) — derfor fjedrer højstyrkestål og titan mest','pladetykkelsen alene','temperaturen'],
      correct:1,
      why:'Mere elastisk tøjning ved flydning (høj σ_y) og lav stivhed (lav E) = mere spring-back. Højstyrkestål og titan har høj σ_y/E og fjedrer derfor markant mere end blødt stål.' },
    { level:'middel', q:'Hvad adskiller <b>fine blanking</b> fra regular blanking?',
      options:['Fine blanking er hurtigere og billigere','Fine blanking giver en glat, ren skærekant og meget tætte tolerancer (±0,005–0,05 mm) vha. en V-ring','Regular blanking giver bedst overflade','Der er ingen forskel'],
      correct:1,
      why:'Fine blanking bruger en V-ring (låsering) + modtryk der holder materialet under hydrostatisk tryk → rent plastisk snit uden revnedannelse → glat kant og meget tætte tolerancer (gear, synkronringe). Dyrere tooling.' },
    { level:'middel', q:'Udover at forhindre rynker, hvad gør draw beads også?',
      options:['Sænker temperaturen','Kontrollerer spændingsfordelingen → mere jævn tykkelsesfordeling i emnet','Fjerner anisotropi','Øger spring-back'],
      correct:1,
      why:'Ved at styre, hvor meget materiale der flyder ind hvor, kontrollerer draw beads spændingsbilledet → jævnere tykkelse og kan justeres lokalt for komplekse geometrier.' },
    { level:'svaer', q:'Hvad er forskellen på <b>major</b> og <b>minor strain</b>?',
      options:['Major er altid negativ','Major strain ε₁ = den STØRSTE principal-tøjning i planen (strækretning); minor ε₂ = den MINDSTE, der kan være negativ (kompression)','De er altid ens','Minor strain måles ud af planen'],
      correct:1,
      why:'I planen er ε₁ den største principal-tøjning (langs hovedstrækket) og ε₂ den mindste vinkelret derpå. ε₂ kan være negativ (kompression, fx ved dybtrækning) eller positiv (biaxialt stræk).' },
    { level:'svaer', q:'Hvad gør <b>V-ringen</b> i fine blanking?',
      options:['Den varmer pladen op','Den klemmer materialet fast og holder det under hydrostatisk tryk → rent plastisk skær uden revner','Den bøjer emnet bagefter','Den måler tolerancen'],
      correct:1,
      why:'V-ringen presses ned i pladen omkring snittet og fastlåser materialet. Det hydrostatiske tryk undertrykker revnedannelse, så snittet sker rent plastisk hele vejen igennem → glat (burnished) kant.' },
    { level:'svaer', q:'Ved dybtrækning af en kop opstår "earing" (ujævne ører i topkanten). Hvad er årsagen?',
      options:['For lav pressekraft','Planar anisotropi (Δr) i pladen fra valseprocessens kornorientering — ører dannes i retninger med lavest r-værdi','For høj temperatur','Forkert smøremiddel'],
      correct:1,
      why:'Earing skyldes retningsafhængige egenskaber (planar anisotropi Δr) indført ved valsning. Ørerne opstår, hvor Lankford-værdien (r) er lavest. Modvirkes ved at vælge materiale med lav Δr eller kompensere trykringprofilen.' }
  ],
  cards: [
    { q:'Blanking vs. punching?', a:'Blanking: den udskårne del (blanken) er produktet (møntskiver, dæksler). Punching: hullet er produktet, den udstansede bid er spild (boltehuller). Blank = matricemål, hul = stempelmål.' },
    { q:'Fire måder at kompensere spring-back?', a:'Overbøjning (bøj forbi målvinklen), bottoming (hårdt modtryk i bunden), stræk-bøjning (bøj + aksial stræk), og FEM-simulering der forudsiger fjedringen i værktøjsdesignet.' },
    { q:'FLD — hvad fortæller det?', a:'Forming Limit Diagram: ε₂ (minor, x) mod ε₁ (major, y). FLC-kurven adskiller sikker formning (under) fra brud/lunke (over). Venstre side = dybtræk/kompression, højre = stræk; yderst venstre = rynkefare.' },
    { q:'Regular vs. fine blanking?', a:'Regular: delvis revet kant, ±0,05–0,2 mm, efterbehandling nødvendig, billig. Fine: glat burnished kant, ±0,005–0,05 mm, V-ring + hydrostatisk tryk, dyr tooling (gear, synkronringe).' }
  ]
};

function fldSVG(){ return '\
<svg viewBox="0 0 520 320" width="520" height="320" role="img" aria-label="Forming Limit Diagram">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cdd3da} .zn{font:700 12px Nunito,sans-serif}</style>\
<rect x="70" y="30" width="400" height="250" fill="#12151a"/>\
<path d="M85 100 Q170 190 230 178 Q320 158 458 78 L458 30 L85 30 Z" fill="#ff5a4d" opacity="0.13"/>\
<path d="M85 100 Q170 190 230 178 Q320 158 458 78 L458 280 L85 280 Z" fill="#5fd17a" opacity="0.10"/>\
<rect x="70" y="30" width="34" height="250" fill="#ff9b3d" opacity="0.12"/>\
<text x="87" y="160" class="ax" fill="#ff9b3d" transform="rotate(-90 87,160)" text-anchor="middle">Rynkefare</text>\
<path d="M85 100 Q170 190 230 178 Q320 158 458 78" fill="none" stroke="#ff5a4d" stroke-width="3.5"/>\
<text x="410" y="70" class="ax" fill="#ff8a80">FLC</text>\
<text x="250" y="62" text-anchor="middle" class="zn" fill="#ff8a80" font-size="12">Brud / lunke-zone</text>\
<text x="250" y="250" text-anchor="middle" class="zn" fill="#7fe39a" font-size="12">Sikker formningszone</text>\
<circle cx="120" cy="150" r="4" fill="#62b0e0"/><text x="124" y="146" class="ax" fill="#9ad0f0">Dybt træk</text>\
<circle cx="230" cy="178" r="4" fill="#62b0e0"/><text x="180" y="198" class="ax" fill="#9ad0f0">Plan strain</text>\
<circle cx="400" cy="120" r="4" fill="#62b0e0"/><text x="404" y="116" class="ax" fill="#9ad0f0">Stræk</text>\
<line x1="70" y1="280" x2="470" y2="280" stroke="#cdd3da" stroke-width="2"/>\
<line x1="270" y1="280" x2="270" y2="30" stroke="#cdd3da" stroke-width="2"/>\
<text x="270" y="306" class="ax" text-anchor="middle">Minor strain ε₂</text>\
<text x="150" y="298" class="ax" text-anchor="middle" font-size="10">← kompression</text>\
<text x="390" y="298" class="ax" text-anchor="middle" font-size="10">stræk →</text>\
<text x="28" y="155" class="ax" text-anchor="middle" transform="rotate(-90 28,155)">Major strain ε₁</text>\
</svg>'; }
