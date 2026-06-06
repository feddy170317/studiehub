/* MEK2 Quiz — Emne K1: Kombineret last & flydekriterier. Kilde: Besvarelse_MEK2_S26 (opg3, opg5, opg7).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q5'] = {
  intro: 'I virkelige emner virker flere laster på én gang. Metoden er: <b>saml alle normalbidrag (aksial + bøjning) i ét σ, og alle forskydningsbidrag (torsion + tværkraft) i ét τ</b>, transformér til hovedspændinger, og tjek mod et flydekriterium. <b>Von Mises</b>: σ_vm = √(σ² + 3τ²); <b>Tresca</b>: n = S_y/(σ₁ − σ₃).',
  analogi: '⚒ Tip: Von Mises "koger" hele spændingstilstanden ned til ét tal, du kan holde op mod flydegrænsen. Tresca ser på det største forskydningsspænd (σ₁ − σ₃) — den er lidt mere konservativ og forudsiger flydning ved en anelse lavere last.',
  examQs: [
    'Saml σ (aksial + bøjning) og τ (torsion + forskydning) i ét punkt.',
    'Find hovedspændinger og beregn Von Mises- eller Tresca-spændingen.',
    'Bestem sikkerhedsfaktoren n mod flydning.'
  ],
  svgCap: 'Kombineret last i ét punkt: alle træk/tryk samles i σ, al vrid/skub i τ. Elementet transformeres (Mohr) til hovedspændinger σ₁, σ₂, og holdes op mod flydegrænsen via Von Mises eller Tresca.',
  svg: combSVG(),
  mc: [
    { level:'let', q:'Hvad er Von Mises-spændingen for en tilstand med normalspænding σ og forskydning τ?',
      options:['σ_vm = σ + τ','σ_vm = √(σ² + 3τ²)','σ_vm = √(σ² + τ²)','σ_vm = σ − τ'],
      correct:1,
      why:'For en (σ, τ)-tilstand: σ_vm = √(σ² + 3τ²). Faktoren 3 på forskydningsleddet er kernen i Von Mises (distortion energy).' },
    { level:'let', q:'Hvad er Tresca-sikkerhedsfaktoren?',
      options:['n = S_y · (σ₁ − σ₃)','n = S_y / (σ₁ − σ₃)','n = (σ₁ − σ₃) / S_y','n = S_y / σ₁'],
      correct:1,
      why:'Tresca: n_s = S_y/(σ₁ − σ₃). Materialet flyder, når det største forskydningsspænd (σ₁ − σ₃) når flydegrænsen.' },
    { level:'let', q:'I plan spænding er den tredje hovedspænding σ₃ lig …',
      options:['σ₁','σ₂','0','S_y'],
      correct:2,
      why:'Plan spænding betyder, at der ikke er spænding ud af planen → σ₃ = 0. Den skal stadig tages med i Tresca og i absolut τ_max.' },
    { level:'let', q:'Hvordan håndteres flere samtidige laster i ét punkt?',
      options:['Man vælger kun den største','Saml alle normalbidrag i ét σ og alle forskydningsbidrag i ét τ, og transformér','Man lægger spændingerne tilfældigt sammen','Man ignorerer forskydning'],
      correct:1,
      why:'Superposition: aksial + bøjning lægges sammen til ét σ; torsion + tværkraft til ét τ. Derefter findes hovedspændinger (Mohr) og man tjekker flydning.' },
    { level:'middel', q:'Hvad er Von Mises-sikkerhedsfaktoren?',
      options:['n = σ_vm / S_y','n = S_y / σ_vm','n = S_y · σ_vm','n = σ_vm − S_y'],
      correct:1,
      why:'n = S_y/σ_vm: flydegrænsen divideret med Von Mises-spændingen. n > 1 betyder, at emnet ikke flyder.' },
    { level:'middel', q:'Hvad er den generelle Von Mises-spænding for to hovedspændinger σ₁, σ₂ (plan)?',
      options:['σ₁ + σ₂','√(σ₁² − σ₁σ₂ + σ₂²)','√(σ₁² + σ₂²)','(σ₁ − σ₂)/2'],
      correct:1,
      why:'σ_vm = √(σ₁² − σ₁σ₂ + σ₂²) for plan spænding (σ₃ = 0). Krydsledet −σ₁σ₂ er karakteristisk for Von Mises.' },
    { level:'middel', q:'Hvilket flydekriterium er mest KONSERVATIVT?',
      options:['Von Mises','Tresca (forudsiger flydning ved lidt lavere last)','De er altid ens','Det afhænger ikke af kriteriet'],
      correct:1,
      why:'Tresca er mere konservativ — den ligger inden for Von Mises-ellipsen og forudsiger flydning ved en anelse lavere last. Von Mises passer typisk bedst med forsøg på duktile metaller.' },
    { level:'middel', q:'Hvad betyder en sikkerhedsfaktor n_s = 9?',
      options:['Emnet er overbelastet','Lasten kan øges ca. 9 gange, før materialet flyder','Emnet flyder allerede','Spændingen er 9 MPa'],
      correct:1,
      why:'n_s angiver, hvor mange gange den nuværende last kan øges, før flydning. n_s = 9 er meget højt — typisk dimensioneres til 1,5–3.' },
    { level:'middel', q:'Hvilke bidrag samles i τ (forskydning)?',
      options:['Aksial og bøjning','Torsion og direkte tværkraft-forskydning','Kun torsion','Kun bøjning'],
      correct:1,
      why:'τ samler torsion (Tρ/I_p) og direkte tværkraft-forskydning (VQ/It). Normalbidragene (aksial N/A + bøjning My/I) samles derimod i σ.' },
    { level:'svaer', q:'Reklameskilt (opg 7): σ_H = 24,29 MPa, τ = 4,49 MPa. Hvad er Von Mises-spændingen?',
      options:['28,8 MPa','25,5 MPa','24,7 MPa','33,3 MPa'],
      correct:1,
      why:'σ_vm = √(24,29² + 3·4,49²) = √(590 + 60,5) = √650,5 ≈ 25,5 MPa. Med S_y = 235 giver det n = 235/25,5 ≈ 9,2 (tæt på Tresca-resultatet 9,07).' },
    { level:'svaer', q:'Plan spænding med σ₁ > 0 > σ₂. Hvad er det styrende Tresca-spænd?',
      options:['σ₁ − 0','σ₁ − σ₂ (da σ₂ er negativ, er dette det største spænd over σ₁, σ₂ og σ₃ = 0)','σ₂ − 0','σ₁ + σ₂'],
      correct:1,
      why:'Tresca bruger (σ_max − σ_min). Med σ₁ > 0, σ₂ < 0 og σ₃ = 0 er σ_max = σ₁ og σ_min = σ₂ → spændet er σ₁ − σ₂. (Var σ₂ > 0, ville σ₃ = 0 styre.)' },
    { level:'svaer', q:'Hvorfor bruges Von Mises typisk til duktile metaller (stål, aluminium)?',
      options:['Fordi den er nemmest','Fordi den (distortion energy) passer bedst med eksperimentel flydning for duktile metaller','Fordi den altid giver højeste sikkerhed','Fordi den ignorerer forskydning'],
      correct:1,
      why:'Von Mises bygger på formændringsenergi (distortion energy), som korrelerer godt med, hvornår duktile metaller faktisk flyder. Tresca er enklere/mere konservativ og bruges ofte som hurtig kontrol.' }
  ],
  cards: [
    { q:'Von Mises — formler?', a:'For (σ, τ): σ_vm = √(σ² + 3τ²). For hovedspændinger: σ_vm = √(σ₁² − σ₁σ₂ + σ₂²). Sikkerhed: n = S_y/σ_vm.' },
    { q:'Tresca — formel og spænd?', a:'n = S_y/(σ₁ − σ₃), σ₃ = 0 i plan spænding. Brug (σ_max − σ_min) over alle tre. Tresca er mere konservativ end Von Mises.' },
    { q:'Metode ved kombineret last?', a:'1) Saml σ = aksial + bøjning. 2) Saml τ = torsion + tværkraft. 3) Transformér (Mohr) → σ₁, σ₂. 4) Tjek flydning med Von Mises eller Tresca → n_s.' },
    { q:'Hvad betyder n_s?', a:'Hvor mange gange lasten kan øges før flydning. Typisk designmål 1,5–3. n_s < 1 = flyder. Højt n_s = overdimensioneret (eller bygget til ekstreme forhold).' }
  ]
};

function combSVG(){ return '\
<svg viewBox="0 0 520 230" width="520" height="230" role="img" aria-label="Kombineret spaendingselement">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 12px Nunito,sans-serif}</style>\
<rect x="150" y="65" width="100" height="100" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2.5"/>\
<g stroke="#ff6b6b" stroke-width="2.5" fill="#ff6b6b">\
<line x1="200" y1="65" x2="200" y2="38"/><polygon points="200,30 193,46 207,46"/>\
<line x1="200" y1="165" x2="200" y2="192"/><polygon points="200,200 193,184 207,184"/></g>\
<text x="214" y="34" class="ax" fill="#ff9b9b">σ (aksial+bøjning)</text>\
<g stroke="#ffd24a" stroke-width="2.5" fill="#ffd24a">\
<line x1="150" y1="80" x2="120" y2="80"/><polygon points="112,80 128,73 128,87"/>\
<line x1="250" y1="150" x2="280" y2="150"/><polygon points="288,150 272,143 272,157"/></g>\
<text x="40" y="84" class="ax" fill="#ffd24a">τ (torsion</text>\
<text x="40" y="98" class="ax" fill="#ffd24a">+ tværkraft)</text>\
<line x1="300" y1="115" x2="340" y2="115" stroke="#cfe3f5" stroke-width="2" marker-end="url(#cb)"/>\
<text x="320" y="106" class="ax" text-anchor="middle">Mohr</text>\
<rect x="350" y="55" width="150" height="120" rx="8" fill="rgba(94,200,255,0.06)" stroke="#3d6188" stroke-width="1.5"/>\
<text x="425" y="82" text-anchor="middle" class="lb" fill="#9bd4ff">σ₁, σ₂</text>\
<text x="425" y="108" text-anchor="middle" class="ax" fill="#cfe3f5">Von Mises:</text>\
<text x="425" y="124" text-anchor="middle" class="ax" fill="#5ec8ff">√(σ²+3τ²)</text>\
<text x="425" y="146" text-anchor="middle" class="ax" fill="#cfe3f5">Tresca:</text>\
<text x="425" y="162" text-anchor="middle" class="ax" fill="#ff9b9b">S_y/(σ₁−σ₃)</text>\
<defs><marker id="cb" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#cfe3f5"/></marker></defs>\
</svg>'; }
