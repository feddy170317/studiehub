/* MEK2 Quiz — Emne S4: Tværkraft & forskydningsspænding. Kilde: Besvarelse_MEK2_S26 (opg4, opg7).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q4'] = {
  intro: 'En tværkraft V giver forskydningsspænding i bjælken: <b>τ = VQ/(I·t)</b>. Modsat bøjning er den IKKE størst i yderfiberen — den er parabolsk fordelt med <b>maksimum på neutralaksen</b> og nul i top/bund. Q er det statiske moment af arealet uden for snittet.',
  analogi: '⚒ Tip: forestil dig et stak kort der bøjes — kortene glider mest forbi hinanden i midten (neutralaksen) og slet ikke ved over-/underkanten. Det er præcis, hvor forskydningsspændingen er størst, hhv. nul.',
  examQs: [
    'Beregn τ = VQ/(I·t) i et givet punkt af tværsnittet.',
    'Bestem Q (statisk moment) for arealet uden for snittet.',
    'Forklar hvorfor τ er nul i yderfiberen og maksimal på neutralaksen.'
  ],
  svgCap: 'Tværkraft-forskydningen τ = VQ/(I·t) er parabolsk fordelt over højden: nul i top og bund (Q = 0) og maksimal på neutralaksen. For et rektangel er τ_max = 1,5·V/A.',
  svg: shearSVG(),
  mc: [
    { level:'let', q:'Hvad er formlen for tværkraft-forskydningsspænding?',
      options:['τ = V/A','τ = V·Q / (I·t)','τ = T·ρ / I_p','τ = M·y / I'],
      correct:1,
      why:'τ = VQ/(It): V er tværkraften, Q det statiske moment af arealet uden for snittet, I inertimomentet og t bredden ved snittet.' },
    { level:'let', q:'Hvor i et rektangulært tværsnit er forskydningsspændingen STØRST?',
      options:['I yderfiberen','På neutralaksen','I hjørnerne','Jævnt fordelt'],
      correct:1,
      why:'Forskydningen er maksimal på neutralaksen og nul i top/bund — stik modsat bøjespændingen. Det skyldes, at Q er størst ved neutralaksen.' },
    { level:'let', q:'Hvor er tværkraft-forskydningen NUL?',
      options:['På neutralaksen','I yderfibrene (top og bund)','I tyngdepunktet','Den er aldrig nul'],
      correct:1,
      why:'I yderfiberen er der intet areal "uden for" snittet → Q = 0 → τ = 0. Forskydningen bygges gradvist op ind mod neutralaksen.' },
    { level:'let', q:'Hvad er Q i formlen τ = VQ/(It)?',
      options:['Tværkraften','Det statiske moment (første moment) af arealet uden for snittet','Inertimomentet','Bredden'],
      correct:1,
      why:'Q = A′·ȳ′: arealet uden for snittet gange afstanden fra neutralaksen til dette areals tyngdepunkt. Q er størst ved neutralaksen og nul i yderfiberen.' },
    { level:'middel', q:'Hvordan er forskydningsspændingen fordelt over et rektangulært tværsnits højde?',
      options:['Lineært','Parabolsk (maks. på midten)','Konstant','Springvis'],
      correct:1,
      why:'τ følger en parabel: nul i top/bund, maksimum på neutralaksen. (Bøjespændingen er derimod lineær.)' },
    { level:'middel', q:'Hvad er den maksimale forskydningsspænding for et REKTANGULÆRT tværsnit?',
      options:['τ_max = V/A','τ_max = 1,5·V/A','τ_max = 2·V/A','τ_max = V/(2A)'],
      correct:1,
      why:'For et rektangel er τ_max = 1,5·V/A på neutralaksen — altså 50 % højere end den gennemsnitlige forskydning V/A.' },
    { level:'middel', q:'Hvad er t i formlen τ = VQ/(It) for en I-profil ved neutralaksen?',
      options:['Den fulde flangebredde','Bredden ved snittet — dvs. kropstykkelsen (web) t_w','Hele tværsnittets areal','Diameteren'],
      correct:1,
      why:'t er bredden netop, hvor du regner τ. Ved neutralaksen i en I-profil er det den tynde krop t_w → derfor er forskydningsspændingen høj i kroppen.' },
    { level:'middel', q:'Hvorfor er forskydningsspændingen nul i yderfiberen?',
      options:['Fordi bøjningen er størst der','Fordi Q = 0 i yderfiberen (intet areal uden for snittet)','Fordi t = 0','Fordi V = 0'],
      correct:1,
      why:'Q måler arealet uden for snittet. Helt ude ved kanten er der intet areal tilbage → Q = 0 → τ = VQ/(It) = 0.' },
    { level:'middel', q:'Hvordan beregnes Q for et delareal A′ over snittet?',
      options:['Q = A′ / ȳ′','Q = A′ · ȳ′ (areal gange afstand til dets tyngdepunkt fra NA)','Q = A′²','Q = I/A′'],
      correct:1,
      why:'Q = A′·ȳ′: tag arealet uden for snittet og gang med afstanden fra neutralaksen til dette areals eget tyngdepunkt.' },
    { level:'svaer', q:'I en I-profil — hvilken del optager det meste af tværkraften?',
      options:['Flangerne','Kroppen (web)','Hjørnerne','Hele tværsnittet ligeligt'],
      correct:1,
      why:'Forskydningen er koncentreret i kroppen (web), hvor t er lille og Q stor nær neutralaksen. Flangerne tager primært bøjningen. Derfor dimensioneres web mod forskydning, flanger mod bøjning.' },
    { level:'svaer', q:'Hvad er τ_max for et massivt CIRKULÆRT tværsnit?',
      options:['1,5·V/A','4/3·V/A','V/A','2·V/A'],
      correct:1,
      why:'For en massiv cirkel er τ_max = (4/3)·V/A på neutralaksen — lidt lavere end rektanglets 1,5·V/A pga. den anderledes geometri.' },
    { level:'svaer', q:'I reklameskilt-opgaven (opg 7) blev den direkte forskydning τ_V = 0 i punkt H. Hvorfor?',
      options:['Fordi tværkraften var nul','Fordi H ligger i yderfiberen i tværkraftens retning, hvor Q = 0','Fordi torsionen ophævede den','Fordi materialet var for stærkt'],
      correct:1,
      why:'H lå yderst i den retning, tværkraften virkede → Q = 0 der → τ_V = 0. Kun torsionsforskydningen bidrog i H. Det er et klassisk trick: vælg punktet, hvor ét bidrag forsvinder.' }
  ],
  cards: [
    { q:'Forskydnings-formlen?', a:'τ = VQ/(I·t). V = tværkraft, Q = A′ȳ′ (statisk moment af areal uden for snittet), I = inertimoment, t = bredde ved snittet. Max på neutralaksen, nul i yderfiber.' },
    { q:'τ_max for rektangel og cirkel?', a:'Rektangel: τ_max = 1,5·V/A. Massiv cirkel: τ_max = 4/3·V/A. Begge på neutralaksen — 33–50 % over gennemsnittet V/A.' },
    { q:'Bøjning vs. forskydning — fordeling?', a:'Bøjning σ = My/I: lineær, max i yderfiber, nul på NA. Forskydning τ = VQ/It: parabolsk, max på NA, nul i yderfiber. Præcis modsatte fordelinger.' },
    { q:'Hvorfor tager web forskydningen i en I-profil?', a:'Ved neutralaksen er Q stor og bredden t = den tynde krop t_w → høj τ. Flangerne (langt fra NA) bidrager lidt til Q lokalt og tager mest bøjning.' }
  ]
};

function shearSVG(){ return '\
<svg viewBox="0 0 520 240" width="520" height="240" role="img" aria-label="Forskydnings-fordeling">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 11px Nunito,sans-serif}</style>\
<rect x="120" y="40" width="70" height="160" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2"/>\
<line x1="100" y1="120" x2="210" y2="120" stroke="#9bd4ff" stroke-width="1.6" stroke-dasharray="5 3"/>\
<text x="92" y="124" class="ax" text-anchor="end" fill="#9bd4ff">NA</text>\
<text x="155" y="28" class="lb" fill="#cfe3f5" text-anchor="middle">Tværsnit</text>\
<line x1="300" y1="40" x2="300" y2="200" stroke="#cfe3f5" stroke-width="1.5"/>\
<text x="300" y="28" class="lb" fill="#cfe3f5" text-anchor="middle">τ = VQ/It</text>\
<path d="M300 40 Q420 120 300 200" fill="rgba(94,200,255,0.15)" stroke="#5ec8ff" stroke-width="2.5"/>\
<line x1="300" y1="120" x2="408" y2="120" stroke="#ff6b6b" stroke-width="2.5" stroke-dasharray="4 3"/>\
<text x="350" y="113" class="ax" fill="#ff9b9b">τ_max = 1,5·V/A</text>\
<text x="306" y="54" class="ax" font-size="10" fill="#7e9ab0">0 (Q=0)</text>\
<text x="306" y="196" class="ax" font-size="10" fill="#7e9ab0">0 (Q=0)</text>\
<text x="330" y="232" class="ax" fill="#7e9ab0" font-size="10">parabolsk · max på NA</text>\
</svg>'; }
