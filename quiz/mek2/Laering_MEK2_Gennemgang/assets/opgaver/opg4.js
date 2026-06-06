/* MEK2 Gennemgang — Opgave 4: Indspændt I-bjælke med skrå punktlast.
   Kilde: Besvarelse_MEK2_S26/opg4.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg4'] = {
  titel: 'Indspændt I-bjælke',
  undertitel: 'Skrå punktlast: aksial + bøjning + forskydning',
  opgavetekst:
    '<p>En <b>2000 mm</b> lang bjælke er fast indspændt i A. I den frie ende B virker <b>P = 20 kN</b> i centroiden, <b>60°</b> ift. x-aksen. I-profil: flanger 100×10 mm, krop 8 mm, total højde 200 mm. E = 210 GPa.</p>'+
    '<p class="dim">a) Indre kræfter (N, V, M) ved A. &nbsp; b) Skitsér normal- og forskydningsfordeling ved A. &nbsp; c) σ₁, σ₂ og vinklen for σ₁ i punkt A₁ (toppen af nederste flange).</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> en skæv kraft deles i en aksial og en tværgående del. Flangerne bærer bøjningen, kroppen bærer forskydningen — det er hele pointen med en I-profil.</p>',
  reference: [
    { navn:'Kraftopløsning', formel:'P_x = P\\cos\\theta \\qquad P_y = P\\sin\\theta', nb:'Aksial del + tværgående del.', kilde:'Statik (vektoropløsning)' },
    { navn:'Normalspænding', formel:'\\sigma = \\dfrac{N}{A} + \\dfrac{M\\,y}{I}', nb:'Konstant aksial + lineær bøjning.', kilde:'Hibbeler · lign. 5-13 (bøjning) + N/A (kap. 1 & 5)' },
    { navn:'Forskydning', formel:'\\tau = \\dfrac{V\\,Q}{I\\,t_w}', nb:'t_w = kropstykkelsen; Q = areal-moment.', kilde:'Hibbeler · lign. 5-41 (forskydningsformlen, kap. 5)' },
    { navn:'Inertimoment (I-profil)', formel:'I = \\dfrac{b_f\\,h^3}{12} - \\dfrac{(b_f-t_w)\\,h_w^3}{12}', nb:'Fuldt rektangel minus de to tomme sidefelter.', kilde:'Hibbeler · kap. 5 + Appendiks A (inertimomenter)' },
    { navn:'Hovedspændinger', formel:'\\sigma_{1,2} = \\dfrac{\\sigma_x}{2} \\pm \\sqrt{\\left(\\tfrac{\\sigma_x}{2}\\right)^2 + \\tau^2} \\qquad \\theta_p = \\tfrac{1}{2}\\arctan\\dfrac{2\\tau}{\\sigma_x}', nb:'Mohr (σ_y = 0).', kilde:'Hibbeler · lign. 7-17 & 7-20 (hovedspændinger + vinkel, kap. 7)' }
  ],
  steps: [
    { del:'a · snitkræfter',
      hvad:'Opløs P i en aksial og en tværgående del',
      hvorfor:'Tænk på at skubbe til en dør i en skæv vinkel: en del af kraften skubber <b>ind</b> i døren (her langs bjælken → <span class="key">aksial</span>), og en del <b>svinger</b> døren (her på tværs → <span class="key">bøjning + forskydning</span>). <b>Kun den tværgående del bøjer bjælken</b>; den aksiale går gennem centroiden og giver ren træk/tryk uden moment. At skille dem ad gør resten enkelt.',
      formel:'\\begin{gathered}P_x = P\\cos 60^\\circ = 20\\cdot 0{,}5 \\\\ P_y = P\\sin 60^\\circ = 20\\cdot 0{,}866\\end{gathered}',
      resultat:'P_x = <b>10,0 kN</b> (aksial, tryk), P_y = <b>17,3 kN</b> (tværgående).' },

    { del:'a · snitkræfter',
      hvad:'Indre kræfter ved A: N = P_x, V = P_y, M = P_y·L',
      hvorfor:'Ved indspændingen skal A optage <b>hele</b> lasten. Bøjemomentet er størst her, fordi <b>armen til lasten er længst</b> (hele L). Det er præcis derfor et dykkerbræt altid knækker ved fastgørelsen — ikke ude ved spidsen.',
      formel:'\\begin{gathered}N = P_x = 10{,}0\\,\\text{kN} \\\\ V = P_y = 17{,}3\\,\\text{kN} \\\\ M = P_y\\,L = 17{,}3\\cdot 2{,}0\\end{gathered}',
      resultat:'N = 10,0 kN, V = 17,3 kN, M = <b>34,6 kNm</b>.' },

    { del:'b · fordeling',
      hvad:'Tværsnitsdata og spændingsfordeling',
      hvorfor:'<b>Hvorfor en I-profil?</b> Materialet er klogt placeret: <span class="key">flangerne</span> (top og bund) ligger langt fra midten og bærer bøjningen (de strækkes/trykkes mest, og I ∝ afstand²), mens <span class="key">kroppen</span> i midten bærer forskydningen. I regnes som "fuldt rektangel minus de to tomme sidefelter". Normalspændingen er lineær (max i flangerne), forskydningen parabolsk (max på neutralaksen) — den modsatte fordeling.',
      formel:'\\begin{gathered}A = 3440\\,\\text{mm}^2 \\quad I = \\dfrac{100\\cdot 200^3}{12} - \\dfrac{92\\cdot 180^3}{12} = \\textcolor{#5ec8ff}{2{,}195\\cdot 10^7\\,\\text{mm}^4} \\\\ \\sigma_{b,\\max} = \\dfrac{Mc}{I} = \\dfrac{34{,}64\\cdot 10^6\\cdot 100}{I} \\approx 158\\,\\text{MPa} \\\\ \\tau_{\\max} = \\dfrac{V\\,Q_{NA}}{I\\,t_w}\\end{gathered}',
      figur:'<svg viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="I-profil med normal- og forskydningsfordeling"><rect x="40" y="40" width="70" height="14" fill="rgba(94,200,255,0.12)" stroke="#5ec8ff" stroke-width="2"/><rect x="40" y="146" width="70" height="14" fill="rgba(94,200,255,0.12)" stroke="#5ec8ff" stroke-width="2"/><rect x="69" y="54" width="12" height="92" fill="rgba(94,200,255,0.12)" stroke="#5ec8ff" stroke-width="2"/><line x1="30" y1="100" x2="120" y2="100" stroke="#9bd4ff" stroke-width="1.4" stroke-dasharray="5 3"/><text x="24" y="104" text-anchor="end" font-family="Nunito,sans-serif" font-size="10" fill="#9bd4ff">NA</text><circle cx="75" cy="146" r="3.5" fill="#ff6b6b"/><text x="84" y="150" font-family="Nunito,sans-serif" font-weight="700" font-size="10" fill="#ff9b9b">A₁</text><line x1="170" y1="40" x2="170" y2="160" stroke="#cfe3f5" stroke-width="1.2"/><line x1="135" y1="100" x2="205" y2="100" stroke="#cfe3f5" stroke-width="1.2"/><line x1="200" y1="44" x2="140" y2="156" stroke="#5ec8ff" stroke-width="2.5"/><text x="150" y="34" font-family="Nunito,sans-serif" font-size="10" fill="#9bd4ff">σ (lineær)</text><text x="204" y="48" font-family="Nunito,sans-serif" font-size="9" fill="#9bd4ff">+155</text><text x="120" y="158" font-family="Nunito,sans-serif" font-size="9" fill="#9bd4ff">−161</text><line x1="270" y1="40" x2="270" y2="160" stroke="#cfe3f5" stroke-width="1.2"/><path d="M270 40 Q330 100 270 160" fill="none" stroke="#ff6b6b" stroke-width="2.5"/><text x="278" y="34" font-family="Nunito,sans-serif" font-size="10" fill="#ff9b9b">τ (parabel)</text><text x="320" y="104" font-family="Nunito,sans-serif" font-size="9" fill="#ff9b9b">12,6</text></svg>',
      figcap:'I-profilens arbejdsdeling: flangerne tager bøjningen (lineær σ, max yderst), kroppen tager forskydningen (parabolsk τ, max på NA).',
      resultat:'Topflange ≈ +155 MPa (træk), bundflange ≈ −161 MPa (tryk), τ_max ≈ <b>12,6 MPa</b> på neutralaksen.' },

    { del:'c · punkt A₁',
      hvad:'Hovedspændinger i A₁ (toppen af nederste flange)',
      hvorfor:'A₁ ligger <b>under</b> neutralaksen (y = −90 mm), og en nedadrettet tiplast trykker bunden sammen → her er <b>aksial og bøjning begge tryk</b> (de lægger sig sammen). Q er den nederste flanges areal-moment om NA, og b = kropstykkelsen t_w. Fordi A₁ har både σ og τ, bruger vi Mohr. Resultatet bliver næsten rent tryk langs x.',
      formel:'\\begin{gathered}\\sigma_x = -\\dfrac{N}{A} + \\dfrac{M\\,y}{I} = -2{,}9 + \\dfrac{34{,}64\\cdot 10^6\\cdot(-90)}{I} = -144{,}9\\,\\text{MPa} \\\\ Q = (100\\cdot 10)\\cdot 95 = 95000\\,\\text{mm}^3 \\quad \\tau_{xy} = \\dfrac{VQ}{I\\,t_w} = 9{,}37\\,\\text{MPa} \\\\ \\sigma_{1,2} = -72{,}5 \\pm \\sqrt{72{,}5^2 + 9{,}37^2}\\end{gathered}',
      resultat:'σ₁ = <b>+0,60 MPa</b>, σ₂ = <b>−145,5 MPa</b>, θ_p = <b>86,3°</b> (for σ₁, ift. x). A₁ er næsten enakset tryk med en lille forskydning.' }
  ],
  selvcheck: [
    { status:'ok', tjek:'Enheder', note:'kN·m, MPa konsistent.' },
    { status:'ok', tjek:'σ₁ + σ₂ = σ_x', note:'0,60 − 145,5 = −144,9 ✓.' },
    { status:'ok', tjek:'σ₁ ≈ 0', note:'A₁ er næsten enakset tryk (lille τ), så den ene hovedspænding er knap positiv.' },
    { status:'ok', tjek:'Størrelsesorden', note:'σ₂ = −146 MPa < stålflyde — en realistisk last (modsat opg 1).' }
  ],
  variant:
    '<p>Samme bjælke, men lasten er 90° ift. x (rent lodret, P_y = 20 kN, N = 0). Beregn M ved A og hovedspændingerne i A₁.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>Nu er N = 0, så σ_x i A₁ skyldes ren bøjning. M = P_y·L = 20·2,0 = <b>40 kNm</b>. σ_b(A₁) = M·y/I = (40·10⁶·(−90))/2,195·10⁷ = <b>−164 MPa</b>. Med τ ≈ 10,8 MPa (V = 20 kN): σ₁ ≈ +0,7, σ₂ ≈ −164,7 MPa. Stadig næsten rent tryk, bare lidt større uden den aksiale modvægt.</div></div>'
};
