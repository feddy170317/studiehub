/* MEK2 Quiz — Emne S3: Bøjning & bøjespændinger. Kilde: Besvarelse_MEK2_S26 (opg4, opg5, opg7).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q3'] = {
  intro: 'Når en bjælke bøjes, strækkes den ene side og trykkes den anden. Bøjespændingen <b>σ = My/I</b> varierer lineært over højden: nul på <b>neutralaksen</b> (gennem tyngdepunktet) og størst i yderfiberen. Inertimomentet I beskriver, hvor effektivt tværsnittet modstår bøjning.',
  analogi: '⚒ Tip: det er armen, der gør lasten farlig. En lille vægt langt ude på et dykkerbræt giver et stort bøjemoment ved fastgørelsen — derfor knækker brættet altid ved indspændingen, ikke ude ved spidsen.',
  examQs: [
    'Beregn bøjespændingen σ = My/I i et givet punkt.',
    'Find inertimomentet I for tværsnittet (evt. med parallelakse-sætning).',
    'Bestem hvor bøjemomentet og dermed σ er størst.'
  ],
  svgCap: 'Bøjespændingen varierer lineært over højden: tryk (−) på den ene side af neutralaksen, træk (+) på den anden, og nul i selve neutralaksen. Den er størst i yderfiberen (y = c).',
  svg: bendSVG(),
  mc: [
    { level:'let', q:'Hvad er formlen for bøjespænding?',
      options:['σ = N/A','σ = M·y / I','σ = T·ρ / I_p','σ = V·Q / (I·t)'],
      correct:1,
      why:'σ = My/I, hvor M er bøjemomentet, y afstanden fra neutralaksen og I inertimomentet. (N/A er aksial; Tρ/I_p er torsion.)' },
    { level:'let', q:'Hvor i tværsnittet er bøjespændingen NUL?',
      options:['I yderfiberen','På neutralaksen (gennem tyngdepunktet)','I et hjørne','Den er aldrig nul'],
      correct:1,
      why:'På neutralaksen er y = 0, så σ = My/I = 0. Neutralaksen går gennem tværsnittets tyngdepunkt (ved ren bøjning).' },
    { level:'let', q:'Hvor er bøjespændingen STØRST?',
      options:['På neutralaksen','I yderfiberen (størst afstand y fra neutralaksen)','I midten','Lige under overfladen'],
      correct:1,
      why:'σ ∝ y, så den er numerisk størst, hvor y er størst — i den yderste fiber (y = c). Derfor dimensioneres efter yderfiberen.' },
    { level:'let', q:'Hvad er inertimomentet I for et rektangulært tværsnit (bredde b, højde h) om vandret akse?',
      options:['b·h³ / 12','b·h / 2','π·h⁴ / 64','b·h³ / 3'],
      correct:0,
      why:'I = b·h³/12 om den vandrette tyngdepunktsakse. Bemærk h³: højden tæller i tredje potens — derfor er en høj, smal bjælke meget stivere end en lav, bred.' },
    { level:'middel', q:'Hvor ligger neutralaksen ved ren bøjning?',
      options:['Altid i geometrisk midte','Gennem tværsnittets tyngdepunkt (centroide)','I yderfiberen','Hvor lasten virker'],
      correct:1,
      why:'Neutralaksen går altid gennem tyngdepunktet. For symmetriske tværsnit falder det sammen med midten, men for fx en T-profil ligger det forskudt.' },
    { level:'middel', q:'Hvordan varierer bøjespændingen over tværsnittets højde?',
      options:['Konstant','Lineært med afstanden y fra neutralaksen','Parabolsk','Springvis'],
      correct:1,
      why:'σ = My/I er lineær i y: tryk på den ene side, træk på den anden, nul i neutralaksen. (Tværkraft-forskydningen τ = VQ/It er derimod parabolsk.)' },
    { level:'middel', q:'Hvad er sammenhængen mellem σ_max, M og modstandsmomentet S = I/c?',
      options:['σ_max = M·S','σ_max = M / S','σ_max = S / M','σ_max = M·c·S'],
      correct:1,
      why:'σ_max = M·c/I = M/S, hvor S = I/c er modstandsmomentet (section modulus). Et større S giver lavere spænding ved samme moment.' },
    { level:'middel', q:'Hvad er inertimomentet I for et massivt cirkulært tværsnit (diameter d)?',
      options:['π·d⁴ / 32','π·d⁴ / 64','π·d² / 4','π·d³ / 16'],
      correct:1,
      why:'I = π·d⁴/64 til bøjning. (π·d⁴/32 er det polære I_p til torsion = 2·I.)' },
    { level:'middel', q:'Et delareal ligger en afstand d fra den samlede neutralakse. Hvordan finder man dets bidrag til I?',
      options:['Kun Ī (eget inertimoment)','Parallelakse-sætningen: I = Ī + A·d²','I = A·d','I = Ī − A·d²'],
      correct:1,
      why:'Parallelakse-sætningen: I = Ī + A·d². For sammensatte tværsnit (I-profiler, T-profiler) lægges hvert delareals eget Ī plus "flytte-leddet" A·d² sammen.' },
    { level:'svaer', q:'En udkraget bjælke har en punktlast i den frie ende. Hvor er bøjespændingen størst?',
      options:['Ved den frie ende','Ved indspændingen (længste arm til lasten)','I midten','Jævnt fordelt'],
      correct:1,
      why:'Bøjemomentet M = P·x vokser med afstanden til lasten og er størst ved indspændingen (x = L). Da σ ∝ M, er bøjespændingen også størst der. Derfor svigter udkragede bjælker ved fastgørelsen.' },
    { level:'svaer', q:'To tværsnit har SAMME areal. Hvilket har størst bøjestivhed om den vandrette akse?',
      options:['Det med materialet samlet nær neutralaksen','Det med materialet placeret langt fra neutralaksen (fx en høj I-profil)','De er altid ens','Det med størst bredde'],
      correct:1,
      why:'I ∝ afstand² fra neutralaksen, så materiale langt ude (flanger på en I-profil) bidrager mest. Derfor er I-bjælker så effektive: meget af materialet sidder, hvor det tæller.' },
    { level:'svaer', q:'Hvis et rektangulært tværsnits HØJDE h fordobles (samme bredde, samme M), hvad sker der med σ_max?',
      options:['Falder til det halve','Falder til 1/4 (σ_max ∝ 1/h²)','Uændret','Fordobles'],
      correct:1,
      why:'σ_max = 6M/(b·h²) ∝ 1/h². Fordobles h, falder spændingen med en faktor 4. Højden er en meget effektiv knap — derfor orienteres bjælker "på højkant".' }
  ],
  cards: [
    { q:'Bøjnings-formlerne?', a:'σ = My/I (max i yderfiber). I_rektangel = bh³/12, I_cirkel = πd⁴/64. Modstandsmoment S = I/c, σ_max = M/S. Parallelakse: I = Ī + Ad².' },
    { q:'Hvad sker på neutralaksen?', a:'σ = 0 (y = 0). Neutralaksen går gennem tyngdepunktet. Spændingen er lineær: tryk på den ene side, træk på den anden.' },
    { q:'Hvorfor er I-profiler effektive?', a:'I ∝ afstand² fra neutralaksen. Flangerne sidder langt ude og bærer det meste af bøjningen, mens kroppen (web) primært tager forskydningen. Max stivhed pr. vægt.' },
    { q:'Hvor er M (og σ) størst?', a:'Hvor armen til lasten er længst. Udkraget bjælke med tiplast: ved indspændingen (M = P·L). Generelt: find M(x)-kurvens maksimum.' }
  ]
};

function bendSVG(){ return '\
<svg viewBox="0 0 520 240" width="520" height="240" role="img" aria-label="Boejespaendings-fordeling">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 11px Nunito,sans-serif}</style>\
<rect x="120" y="40" width="70" height="160" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2"/>\
<line x1="100" y1="120" x2="210" y2="120" stroke="#9bd4ff" stroke-width="1.6" stroke-dasharray="5 3"/>\
<text x="92" y="124" class="ax" text-anchor="end" fill="#9bd4ff">NA</text>\
<line x1="300" y1="40" x2="300" y2="200" stroke="#cfe3f5" stroke-width="1.5"/>\
<line x1="300" y1="120" x2="430" y2="120" stroke="#cfe3f5" stroke-width="1.5"/>\
<polygon points="300,40 410,40 300,120" fill="rgba(94,200,255,0.18)" stroke="#5ec8ff" stroke-width="2"/>\
<text x="360" y="36" class="ax" fill="#9bd4ff">− tryk</text>\
<polygon points="300,120 410,200 300,200" fill="rgba(255,107,107,0.16)" stroke="#ff6b6b" stroke-width="2"/>\
<text x="356" y="216" class="ax" fill="#ff9b9b">+ træk (yderfiber)</text>\
<text x="300" y="124" class="ax" text-anchor="end" fill="#9bd4ff">0</text>\
<text x="330" y="232" class="ax" fill="#7e9ab0" font-size="10">σ lineær med y</text>\
<text x="155" y="28" class="lb" fill="#cfe3f5" text-anchor="middle">Tværsnit</text>\
<text x="365" y="28" class="lb" fill="#cfe3f5" text-anchor="middle">σ = My/I</text>\
<line x1="210" y1="80" x2="296" y2="80" stroke="#7e9ab0" stroke-width="1" stroke-dasharray="3 3"/>\
<text x="118" y="80" class="ax" text-anchor="end" font-size="10" fill="#7e9ab0">y</text>\
</svg>'; }
