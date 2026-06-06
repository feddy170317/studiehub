/* MEK2 Gennemgang — Opgave 9: Aluminiumssøjle (udknækning og Euler).
   Kilde: Besvarelse_MEK2_S26/opg9.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg9'] = {
  titel: 'Aluminiumssøjle',
  undertitel: 'Udknækning og Euler',
  opgavetekst:
    '<p>5 m lang aluminiumssøjle, fast indspændt i bunden. Toppen holdes af to stålkabler, der forhindrer bevægelse i x-retningen (fri i y). H-tværsnit: flanger 200×50 mm, krop 50 mm × 200 mm. E = 70 GPa, σ_y = 215 MPa.</p>'+
    '<p class="dim">a) Gyrationsradius om x. &nbsp; b) Gyrationsradius om y. &nbsp; c) Største tilladelige last P (knæk + flydning, n = 3). &nbsp; d) Skitsér Euler-kurven.</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> en søjle svigter ikke ved at blive mast, men ved pludseligt at <b>bøje ud</b> den svageste vej. Og det kontraintuitive: den "stærke" akse kan tabe, hvis dens ender er dårligere holdt.</p>',
  reference: [
    { navn:'Gyrationsradius', formel:'r = \\sqrt{I/A}', nb:'Hvor langt materialet "effektivt" sidder fra aksen.', kilde:'Hibbeler · kap. 11 (gyrationsradius)' },
    { navn:'Kritisk last', formel:'P_{cr} = \\dfrac{\\pi^2 EI}{(KL)^2} \\qquad \\sigma_{cr} = \\dfrac{\\pi^2 E}{(KL/r)^2}', nb:'Falder kraftigt med effektiv længde.', kilde:'Hibbeler · lign. 11-7 (Euler-formlen, kap. 11)' },
    { navn:'Effektiv længde', formel:'K = 2{,}0\\ (\\text{indsp.-fri}) \\qquad K = 0{,}7\\ (\\text{indsp.-led})', nb:'Understøtningen bestemmer K.', kilde:'Hibbeler · kap. 11 (effektiv længde / K-faktorer)' },
    { navn:'Flydning', formel:'P_y = \\sigma_y\\,A \\qquad P_{\\text{till}} = \\dfrac{\\min(P_{cr},\\,P_y)}{n}', nb:'Den laveste kapacitet styrer; n = 3.', kilde:'Hibbeler · kap. 11 (flydning vs. knæk + sikkerhedsfaktor)' }
  ],
  steps: [
    { del:'a–b · gyrationsradius',
      hvad:'Find A, I_x, I_y og r = √(I/A) om begge akser',
      hvorfor:'<span class="key">Gyrationsradius</span> siger, "hvor langt materialet i snittet sidder fra aksen" — jo større r, jo sværere at knække om den akse. Vi skal bruge <b>begge</b>, fordi understøtningen er forskellig i de to retninger. Flangerne ligger langt fra x-aksen → stor I_x → stor r_x.',
      formel:'\\begin{gathered}A = 2(200\\cdot 50) + 50\\cdot 200 = 30000\\,\\text{mm}^2 \\\\ I_x = 3{,}50\\cdot 10^8 \\Rightarrow r_x = \\sqrt{I_x/A} = 108{,}0\\,\\text{mm} \\\\ I_y = 6{,}875\\cdot 10^7 \\Rightarrow r_y = \\sqrt{I_y/A} = 47{,}9\\,\\text{mm}\\end{gathered}',
      resultat:'r_x = <b>108,0 mm</b>, r_y = <b>47,9 mm</b>. Profilet er mere end dobbelt så stivt om x — burde gøre x til den stærke akse … men se næste trin.' },

    { del:'c · K-faktorer',
      hvad:'Tildel K efter retning',
      hvorfor:'<b>Understøtningen er alt.</b> Kablerne stopper x-bevægelse — det er præcis det, knæk <b>om y</b> ville give, så den retning er "indspændt–leddelt" → <span class="key">K_y = 0,7</span> (stærk fastholdt). Knæk <b>om x</b> (bevægelse i y) er <b>ufastholdt foroven</b> → "indspændt–fri" → <span class="key">K_x = 2,0</span> (den bløde slags). Den effektive længde KL er altså næsten 3× længere om x end om y.',
      formel:'\\begin{gathered}L_{\\text{eff}} = K\\cdot L \\\\ x\\text{-akse}:\\ K_x = 2{,}0\\ (\\text{fri top}) \\\\ y\\text{-akse}:\\ K_y = 0{,}7\\ (\\text{kabel-holdt})\\end{gathered}',
      resultat:'Effektiv længde: (KL)_x = 10000 mm, (KL)_y = 3500 mm.' },

    { del:'c · kritisk last',
      hvad:'Beregn slankhed og P_cr; den mindste styrer',
      hvorfor:'Slankheden <b>KL/r</b> afgør, hvilken akse der knækker først: <b>størst slankhed = lavest knæk-spænding = kritisk</b>. Her er x-aksen mest slank (92,6 mod 73,1) — <b>trods størst I</b> — fordi den frie top fordobler dens effektive længde. Lektien: i søjler tæller geometri OG understøtning, ikke kun stivhed.',
      formel:'\\begin{gathered}(KL/r)_x = \\dfrac{2{,}0\\cdot 5000}{108{,}0} = 92{,}6 \\\\ (KL/r)_y = \\dfrac{0{,}7\\cdot 5000}{47{,}9} = 73{,}1 \\\\ P_{cr} = \\dfrac{\\pi^2\\cdot 70000\\cdot 3{,}50\\cdot 10^8}{(2{,}0\\cdot 5000)^2}\\end{gathered}',
      figur:'<svg viewBox="0 0 360 210" width="360" height="210" role="img" aria-label="Euler-kurve"><line x1="40" y1="185" x2="345" y2="185" stroke="#cfe3f5" stroke-width="1.5"/><line x1="40" y1="195" x2="40" y2="25" stroke="#cfe3f5" stroke-width="1.5"/><text x="300" y="203" font-family="Nunito,sans-serif" font-size="10" fill="#cfe3f5">λ = KL/r</text><text x="20" y="40" font-family="Nunito,sans-serif" font-size="10" fill="#cfe3f5">σ_cr</text><line x1="40" y1="56" x2="146" y2="56" stroke="#ff6b6b" stroke-width="2.5"/><text x="60" y="50" font-family="Nunito,sans-serif" font-size="9" fill="#ff9b9b">flydning σ_y=215</text><path d="M146 56 Q180 105 213 142 Q280 168 340 176" fill="none" stroke="#5ec8ff" stroke-width="2.5"/><text x="250" y="150" font-family="Nunito,sans-serif" font-size="9" fill="#9bd4ff">Euler σ_cr=π²E/λ²</text><line x1="146" y1="185" x2="146" y2="56" stroke="#3d6188" stroke-width="1" stroke-dasharray="3 3"/><text x="120" y="198" font-family="Nunito,sans-serif" font-size="8" fill="#7e9ab0">λ₁=56,7</text><circle cx="213" cy="142" r="4.5" fill="#ffd24a"/><text x="200" y="135" font-family="Nunito,sans-serif" font-weight="700" font-size="9" fill="#ffd24a">søjlen λ=92,6</text></svg>',
      figcap:'Korte søjler (lille λ) flyder (rød plateau); slanke søjler (stor λ) knækker elastisk (blå Euler-hyperbel). Vores søjle ligger på den blå gren.',
      resultat:'P_cr = <b>2418 kN</b> (om x — den mest slanke). σ_cr = 80,6 MPa < σ_y = 215 → Euler gælder (elastisk knæk).' },

    { del:'c · tilladelig last',
      hvad:'Sammenlign knæk med flydning; del med n = 3',
      hvorfor:'Søjlen kan svigte enten ved at <b>knække</b> eller ved at <b>flyde</b>. Den <b>laveste kapacitet vinder</b>, og sikkerhedsfaktoren anvendes på den. Knæk er pludseligt og farligt (uden varsel), så søjler får ofte en høj n.',
      formel:'\\begin{gathered}P_y = \\sigma_y\\,A = 215\\cdot 30000 = 6450\\,\\text{kN} \\\\ P_{\\text{till}} = \\dfrac{\\min(P_{cr},\\,P_y)}{3} = \\dfrac{\\min(2418,\\,6450)}{3}\\end{gathered}',
      resultat:'P_till = 2418/3 = <b>806 kN</b>. Søjlen knækker om x — den frie top er svagheden, ikke materialet.' }
  ],
  selvcheck: [
    { status:'ok', tjek:'I_x > I_y', note:'Flangerne ligger langt fra x-aksen.' },
    { status:'ok', tjek:'σ_cr < σ_y', note:'80,6 < 215 → Euler gyldig (elastisk knæk).' },
    { status:'ok', tjek:'Mindst P styrer', note:'Knæk om x (2418 kN) < flydning (6450 kN).' },
    { status:'warn', tjek:'Kontraintuitivt', note:'Selvom I_x > I_y, knækker søjlen om x — den frie top (K = 2) dominerer over den større stivhed.' }
  ],
  variant:
    '<p>Hvis toppen også fastholdes i y (ekstra afstivning), bliver begge akser indspændt–leddelt (K = 0,7). Genberegn og find den nye tilladelige last.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>Nu K = 0,7 på begge akser. (KL/r)_x = (0,7·5000)/108 = 32,4; (KL/r)_y = 73,1 → nu styrer y (størst slankhed). P_cr,y = π²·70000·6,875·10⁷/(0,7·5000)² = <b>3877 kN</b>. Stadig < flydning (6450). P_till = 3877/3 = <b>1292 kN</b> — kapaciteten steg fra 806 til 1292 kN (+60 %) ved blot at afstive toppen. Pointen: at reducere K mangedobler kapaciteten.</div></div>'
};
