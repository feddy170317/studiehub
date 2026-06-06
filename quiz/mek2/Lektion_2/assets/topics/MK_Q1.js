/* MEK2 Quiz — Emne S1: Spændingstransformation & Mohrs cirkel.
   Kilde: Besvarelse_MEK2_S26 (opg1, opg3, opg7). 12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q1'] = {
  intro: 'En spændingstilstand (σ_x, σ_y, τ_xy) ser forskellig ud afhængigt af, hvilket snit du kigger på. <b>Spændingstransformation</b> finder spændingerne på et drejet element, og <b>Mohrs cirkel</b> er den grafiske genvej: centrum i σ_avg, radius R, og hovedspændingerne σ₁, σ₂ er cirklens skæringer med σ-aksen.',
  analogi: '⚒ Mohr-tip: en vinkel 2θ på cirklen svarer til θ i det fysiske element — alt går "dobbelt så hurtigt rundt" på Mohrs cirkel. På hovedplanerne (σ₁, σ₂) er forskydningen præcis nul.',
  examQs: [
    'Opstil (σ_x, σ_y, τ_xy) for et punkt og find hovedspændinger + hovedretninger.',
    'Tegn Mohrs cirkel og aflæs σ₁, σ₂ og τ_max.',
    'Ren forskydning: vis at σ₁ = +τ og σ₂ = −τ ved 45°.'
  ],
  svgCap: 'Mohrs cirkel: centrum C = σ_avg på σ-aksen, radius R. Skæringerne med σ-aksen er hovedspændingerne σ₁ og σ₂; cirklens top giver den maksimale forskydningsspænding τ_max = R.',
  svg: mohrSVG(),
  mc: [
    { level:'let', q:'Hvad gælder for forskydningsspændingen på et <b>hovedplan</b> (principal plane)?',
      options:['Den er maksimal','Den er nul','Den er lig normalspændingen','Den er negativ'],
      correct:1,
      why:'Hovedplanerne er netop defineret ved, at forskydningsspændingen = 0. Der virker kun de rene normalspændinger σ₁ og σ₂.' },
    { level:'let', q:'Hvad er centrum i Mohrs cirkel (σ_avg)?',
      options:['(σ_x − σ_y)/2','(σ_x + σ_y)/2','σ_x · σ_y','√(σ_x² + σ_y²)'],
      correct:1,
      why:'Centrum ligger på σ-aksen ved gennemsnittet σ_avg = (σ_x + σ_y)/2. Det er uændret uanset hvordan elementet drejes.' },
    { level:'let', q:'Hvor på Mohrs cirkel aflæses den maksimale forskydningsspænding τ_max?',
      options:['På σ-aksen','I cirklens top (afstanden = radius R)','I centrum','Den findes ikke på cirklen'],
      correct:1,
      why:'τ_max (i planen) svarer til cirklens højeste punkt og er lig radius: τ_max = R. Det sker på et element drejet 45° fra hovedplanerne.' },
    { level:'let', q:'Hovedspændingerne σ₁ og σ₂ er …',
      options:['cirklens top og bund','de to skæringer med σ-aksen (σ_avg ± R)','altid lige store','lig τ_xy'],
      correct:1,
      why:'σ₁ = σ_avg + R og σ₂ = σ_avg − R — netop hvor cirklen skærer σ-aksen (τ = 0). σ₁ er den største, σ₂ den mindste i planen.' },
    { level:'middel', q:'Hvad er radius R i Mohrs cirkel?',
      options:['(σ_x + σ_y)/2','√( ((σ_x − σ_y)/2)² + τ_xy² )','τ_xy/2','σ_x − σ_y'],
      correct:1,
      why:'Radius er afstanden fra centrum til datapunktet (σ_x, τ_xy): R = √( ((σ_x − σ_y)/2)² + τ_xy² ). Den giver både τ_max og afstanden til σ₁/σ₂.' },
    { level:'middel', q:'For et element med ren forskydning (σ_x = σ_y = 0, kun τ): hvad er hovedspændingerne?',
      options:['σ₁ = σ₂ = 0','σ₁ = +τ og σ₂ = −τ, på et element drejet 45°','σ₁ = 2τ, σ₂ = 0','σ₁ = τ, σ₂ = τ'],
      correct:1,
      why:'Ved ren forskydning er Mohrs cirkel centreret i origo med radius τ. Drejes elementet 45°, bliver forskydningen til rent træk (+τ) på den ene led og rent tryk (−τ) på den anden.' },
    { level:'middel', q:'En drejning på 2θ på Mohrs cirkel svarer til hvilken drejning af det fysiske element?',
      options:['2θ','θ (halvdelen)','4θ','90° − θ'],
      correct:1,
      why:'Mohrs cirkel arbejder i dobbeltvinkler: en bevægelse på 2θ langs cirklen = en fysisk drejning af elementet på θ. Derfor ligger τ_max 90° fra σ₁ på cirklen, men kun 45° i virkeligheden.' },
    { level:'middel', q:'Givet σ_x = 0, σ_y = 24,29 MPa, τ_xy = 4,49 MPa (σ_avg = 12,15, R = 12,95). Hvad er σ₁?',
      options:['12,15 MPa','25,09 MPa','−0,80 MPa','24,29 MPa'],
      correct:1,
      why:'σ₁ = σ_avg + R = 12,15 + 12,95 = 25,09 MPa (og σ₂ = 12,15 − 12,95 = −0,80 MPa). Samme tal som i reklameskilt-opgaven (opg 7).' },
    { level:'middel', q:'Hvilken formel giver hovedretningen θ_p?',
      options:['tan(θ_p) = τ_xy/σ_x','tan(2θ_p) = 2τ_xy / (σ_x − σ_y)','θ_p = 45° altid','tan(2θ_p) = (σ_x − σ_y)/τ_xy'],
      correct:1,
      why:'Hovedretningen findes af tan(2θ_p) = 2τ_xy/(σ_x − σ_y). De to løsninger (θ_p og θ_p + 90°) giver retningerne for σ₁ og σ₂.' },
    { level:'svaer', q:'I plan spænding (σ₃ = 0) med σ₁ > 0 > σ₂: hvad er den ABSOLUT maksimale forskydningsspænding?',
      options:['Altid (σ₁ − σ₂)/2 i planen','(σ_max − σ_min)/2 over alle tre hovedspændinger — her (σ₁ − σ₂)/2 da σ₂ er negativ','σ₁/2','Nul'],
      correct:1,
      why:'Absolut τ_max = (σ_max − σ_min)/2 blandt σ₁, σ₂ og σ₃ = 0. Når σ₂ < 0, er spændet σ₁ − σ₂ størst → τ_abs = (σ₁ − σ₂)/2 (lig in-plane). Er begge positive, vinduer σ₃ = 0 ind og giver σ₁/2.' },
    { level:'svaer', q:'En aksialt belastet stang (σ_x) skæres på et snit drejet θ. Hvad er normalspændingen σ_θ på snittet?',
      options:['σ_x','σ_x · cos²θ','σ_x · sinθ','σ_x/2 konstant'],
      correct:1,
      why:'For ren aksial last: σ_θ = σ_x·cos²θ og τ_θ = σ_x·sinθcosθ. Normalspændingen er størst ved θ = 0 (σ_x); forskydningen er størst ved θ = 45° med værdien σ_x/2.' },
    { level:'svaer', q:'For samme aksialstang: ved hvilken vinkel er forskydningsspændingen størst, og hvor stor er den?',
      options:['Ved 0°, lig σ_x','Ved 45°, lig σ_x/2','Ved 90°, lig σ_x','Ved 30°, lig σ_x/3'],
      correct:1,
      why:'τ_θ = σ_x·sinθcosθ = (σ_x/2)·sin(2θ) er maksimal ved 2θ = 90° → θ = 45°, med værdien σ_x/2. Derfor flyder/brister duktile stænger ofte på 45°-plan.' }
  ],
  cards: [
    { q:'σ_avg, R, σ₁, σ₂ — formlerne?', a:'σ_avg = (σ_x+σ_y)/2. R = √(((σ_x−σ_y)/2)² + τ_xy²). σ₁ = σ_avg + R, σ₂ = σ_avg − R. τ_max(plan) = R.' },
    { q:'Hvad sker på hovedplanerne?', a:'Forskydningen er nul; kun σ₁ og σ₂ virker. De ligger 90° fra hinanden fysisk (180° på Mohr), og τ_max-planet ligger 45° derfra.' },
    { q:'Ren forskydning → hovedspændinger?', a:'σ₁ = +τ, σ₂ = −τ på et 45°-drejet element. Mohrs cirkel er centreret i origo med radius τ.' },
    { q:'Absolut vs. in-plane τ_max?', a:'In-plane τ_max = R = (σ₁−σ₂)/2. Absolut τ_max tager σ₃ med (=0 i plan spænding): (σ_max−σ_min)/2 over alle tre — kan blive σ₁/2 hvis σ₂ og σ₃ har samme fortegn.' }
  ]
};

function mohrSVG(){ return '\
<svg viewBox="0 0 520 300" width="520" height="300" role="img" aria-label="Mohrs cirkel">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 11px Nunito,sans-serif}</style>\
<line x1="70" y1="170" x2="470" y2="170" stroke="#cfe3f5" stroke-width="2" marker-end="url(#mh)"/>\
<text x="466" y="190" class="ax">σ</text>\
<line x1="120" y1="285" x2="120" y2="40" stroke="#cfe3f5" stroke-width="2" marker-end="url(#mh)"/>\
<text x="104" y="48" class="ax">τ</text>\
<circle cx="270" cy="170" r="120" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2.5"/>\
<circle cx="270" cy="170" r="3.5" fill="#cfe3f5"/>\
<text x="252" y="188" class="ax" fill="#9bd4ff">C = σ_avg</text>\
<line x1="270" y1="170" x2="390" y2="170" stroke="#ffd24a" stroke-width="1.6" stroke-dasharray="5 3"/>\
<text x="312" y="163" class="ax" fill="#ffd24a">R</text>\
<circle cx="390" cy="170" r="4.5" fill="#5ec8ff"/><text x="372" y="160" class="lb" fill="#9bd4ff">σ₁</text>\
<circle cx="150" cy="170" r="4.5" fill="#5ec8ff"/><text x="138" y="160" class="lb" fill="#9bd4ff">σ₂</text>\
<line x1="270" y1="170" x2="270" y2="50" stroke="#ff6b6b" stroke-width="1.6" stroke-dasharray="4 3"/>\
<circle cx="270" cy="50" r="4.5" fill="#ff6b6b"/><text x="278" y="50" class="lb" fill="#ff9b9b">τ_max = R</text>\
<circle cx="350" cy="118" r="4" fill="#cfe3f5"/><text x="356" y="114" class="ax" font-size="10">(σ_x, τ_xy)</text>\
<circle cx="190" cy="222" r="4" fill="#cfe3f5"/><text x="150" y="240" class="ax" font-size="10">(σ_y, −τ_xy)</text>\
<line x1="350" y1="118" x2="190" y2="222" stroke="#7e9ab0" stroke-width="1.2" stroke-dasharray="3 3"/>\
<defs><marker id="mh" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#cfe3f5"/></marker></defs>\
</svg>'; }
