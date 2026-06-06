/* MEK2 Gennemgang — Opgave 7: Reklameskilt på hul stolpe (kombineret last).
   Kilde: Besvarelse_MEK2_S26/opg7.tex. Fokus: HVORFOR vi gør, som vi gør. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg7'] = {
  titel: 'Reklameskilt på hul stolpe',
  undertitel: 'Kombineret last: aksial + bøjning + torsion',
  opgavetekst:
    '<p>Et reklameskilt (vægt <b>36 kN</b>) holdes af en hul, cirkulær stolpe (ydre Ø <b>375 mm</b>, godstykkelse <b>t = 12 mm</b>). Stål: E = 210 GPa, flydespænding <b>S_y = 235 MPa</b>. En vindtryk-resultant på <b>12 kN</b> rammer midt på skiltet, hvis centrum sidder <b>0,9 m</b> ude fra stolpeaksen.</p>'+
    '<p class="dim">a) Alle bidrag til normalspænding i H. &nbsp; b) Alle bidrag til forskydningsspænding i H. &nbsp; c) Hovedspændinger og vinkler i H. &nbsp; d) Sikkerhedsfaktor mht. Tresca.</p>'+
    '<p><span style="color:var(--cyan)">Idéen i én sætning:</span> tre laster mødes i bunden (punkt H) — vægten trykker og bøjer, vinden vrider. Vi samler alt "træk/tryk" i ét σ og alt "vrid/skub" i ét τ, og transformerer.</p>',
  reference: [
    { navn:'Aksial spænding', formel:'\\sigma = \\dfrac{N}{A} \\qquad A = \\pi\\left[(d_y/2)^2 - (d_i/2)^2\\right]', nb:'Kraft fordelt jævnt over bærearealet.', kilde:'Hibbeler · kap. 1 (gennemsnitlig normalspænding)' },
    { navn:'Bøjespænding', formel:'\\sigma = \\dfrac{M\\,(d_y/2)}{I} \\qquad I = \\dfrac{\\pi}{64}(d_y^4 - d_i^4)', nb:'I = tværsnittets stivhed mod bøjning; y = d_y/2 fordi spændingen er størst i yderfiberen.', kilde:'Hibbeler · lign. 5-13 (bøjeformlen, kap. 5)' },
    { navn:'Torsionsspænding', formel:'\\tau = \\dfrac{T\\,(d_y/2)}{I_p} \\qquad I_p = \\dfrac{\\pi}{32}(d_y^4 - d_i^4) = 2I', nb:'I_p = stivhed mod vridning; τ vokser lineært med radius.', kilde:'Hibbeler · lign. 3-13 (torsion, kap. 3)' },
    { navn:'Hovedspændinger (Mohr)', formel:'\\sigma_{1,2} = \\bar\\sigma \\pm R \\qquad R = \\sqrt{\\left(\\tfrac{\\sigma_x-\\sigma_y}{2}\\right)^2 + \\tau^2}', nb:'Finder de retninger, hvor forskydningen forsvinder.', kilde:'Hibbeler · lign. 7-17 (hovedspændinger, kap. 7)' },
    { navn:'Tresca-sikkerhed', formel:'n = \\dfrac{S_y}{\\sigma_1 - \\sigma_3} \\qquad \\sigma_3 = 0', nb:'Flydning styres af det største forskydningsspænd (plan spænding ⇒ σ₃ = 0).', kilde:'Hibbeler · lign. 7-26 (max forskydnings-kriterium, kap. 7)' }
  ],
  steps: [
    { del:'a · normalspænding',
      hvad:'Find tværsnitsdata: areal A og inertimoment I',
      hvorfor:'Vi skal bruge to geometri-tal, og det er værd at forstå <b>hvorfor netop dem</b>. <span class="key">A (areal)</span> bruges til den aksiale spænding σ = N/A — kraften fordeles over alt det materiale, der bærer. <span class="key">I (inertimomentet)</span> bruges til bøjningen σ = My/I. Hvorfor lige I? Fordi <b>I udtrykker, hvor stift tværsnittet er mod bøjning i forhold til sin geometri</b> — materiale langt fra neutralaksen tæller mest (det går i FJERDE potens, d⁴). Et rør har næsten alt sit materiale yderst, så det er meget effektivt mod bøjning pr. vægt. Derfor: I = den store massive aksel minus det hul, vi har boret væk.',
      formel:'\\begin{gathered}d_i = 375 - 2\\cdot 12 = \\textcolor{#5ec8ff}{351\\,\\text{mm}} \\\\ A = \\pi\\left[(375/2)^2 - (351/2)^2\\right] \\\\ I = \\dfrac{\\pi}{64}(375^4 - 351^4)\\end{gathered}',
      resultat:'A = <b>1,368·10⁴ mm²</b> &nbsp;·&nbsp; I = <b>2,257·10⁸ mm⁴</b>' },

    { del:'a · normalspænding',
      hvad:'Vægtens rene tryk: σ_F = F / A',
      hvorfor:'Skiltets vægt trykker lige ned gennem stolpen. Den kraft fordeler sig <b>jævnt over hele tværsnittet</b> — som når du står oven på en søjle: hver lille bid materiale mærker det samme. Derfor σ = N/A, bare kraft delt med bæreareal. Den bliver <b>lille</b>, netop fordi arealet er stort. Fortegnet er minus, fordi det er tryk (ikke træk).',
      formel:'\\sigma_F = \\dfrac{-36\\cdot 10^3\\,\\text{N}}{1{,}368\\cdot 10^4\\,\\text{mm}^2}',
      resultat:'σ_F = <b>−2,63 MPa</b> (tryk) — overraskende lille.' },

    { del:'a · normalspænding',
      hvad:'Bøjningen: armen gør vægten farlig. σ_b = M_z·(d_y/2) / I',
      hvorfor:'Her er hele pointen. Skiltet hænger <b>0,9 m ud til siden</b> — så vægten laver et <span class="key">bøjemoment</span> M = 0,9·F om stolpens fod. Det er <b>armen, ikke vægten i sig selv, der er fjenden</b>: en lille vægt gange en lang arm giver et stort moment. I bøjespændingen σ = My/I bruger vi <b>I</b> (geometriens stivhed) og <b>y = d_y/2</b>, fordi spændingen vokser lineært ud fra neutralaksen og er <b>størst i yderfiberen</b>. Punkt H ligger netop dér — så det er der, bøjningen rammer hårdest.',
      formel:'\\begin{gathered}M_z = 0{,}9\\cdot 36 = \\textcolor{#5ec8ff}{32{,}4\\,\\text{kNm}} \\\\ \\sigma_b = \\dfrac{32{,}4\\cdot 10^6\\cdot 187{,}5}{2{,}257\\cdot 10^8}\\end{gathered}',
      figur:'<svg viewBox="0 0 320 250" width="320" height="250" role="img" aria-label="Reklameskilt paa stolpe"><line x1="20" y1="225" x2="300" y2="225" stroke="#cfe3f5" stroke-width="2"/><rect x="148" y="50" width="18" height="175" fill="#102a42" stroke="#5ec8ff" stroke-width="2"/><rect x="166" y="70" width="62" height="9" fill="#102a42" stroke="#5ec8ff" stroke-width="2"/><rect x="226" y="44" width="78" height="54" rx="3" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2"/><text x="265" y="67" text-anchor="middle" font-family="Anton,sans-serif" font-size="14" fill="#ffd24a">KØB</text><text x="265" y="86" text-anchor="middle" font-family="Anton,sans-serif" font-size="14" fill="#ffd24a">NU</text><line x1="265" y1="98" x2="265" y2="132" stroke="#ff6b6b" stroke-width="3"/><polygon points="265,140 259,126 271,126" fill="#ff6b6b"/><text x="278" y="124" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ff9b9b">36 kN</text><line x1="312" y1="71" x2="300" y2="71" stroke="#5ec8ff" stroke-width="3"/><polygon points="292,71 306,65 306,77" fill="#5ec8ff"/><text x="244" y="34" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#9bd4ff">VIND 12 kN</text><line x1="157" y1="40" x2="265" y2="40" stroke="#ffd24a" stroke-width="1.4" stroke-dasharray="5 4"/><text x="200" y="33" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ffd24a">arm 0,9 m</text><circle cx="157" cy="218" r="6" fill="#ff6b6b" stroke="#cfe3f5" stroke-width="2"/><text x="170" y="223" font-family="Anton,sans-serif" font-size="14" fill="#cfe3f5">H</text></svg>',
      figcap:'Vægten i 0,9 m’s afstand bliver til et stort bøjemoment om stolpens fod (H); vinden vrider stolpen.',
      resultat:'σ_b = <b>+26,92 MPa</b> (træk i H).<br>Bøjningen (27 MPa) <b>knuser</b> det rene vægttryk (2,6 MPa) — armen er afgørende.' },

    { del:'a · normalspænding',
      hvad:'Saml normalbidragene: σ_H = σ_b + σ_F',
      hvorfor:'Begge er <b>normalspændinger</b> (træk/tryk LANGS stolpen), så de virker på samme led og kan lægges direkte sammen — det er <span class="key">superposition</span>. Bøjningen er træk i H, vægten er tryk, så de modarbejder hinanden en smule.',
      formel:'\\sigma_H = 26{,}92 - 2{,}63',
      resultat:'σ_H = <b>24,29 MPa</b>' },

    { del:'b · forskydning',
      hvad:'Vinden vrider stolpen: torsion τ_T = T·(d_y/2) / I_p',
      hvorfor:'Vinden rammer skiltet, der sidder 0,9 m ude → den <b>vrider hele stolpen</b> = torsion. I τ = Tρ/I_p bruger vi det <span class="key">polære inertimoment I_p</span> (formens stivhed mod VRIDNING, = 2·I for et rør) og <b>ρ = d_y/2</b>, fordi forskydningen — ligesom bøjningen — vokser lineært med radius og er størst i overfladen, hvor H sidder.',
      formel:'\\begin{gathered}T = 0{,}9\\cdot 12 = \\textcolor{#5ec8ff}{10{,}8\\,\\text{kNm}} \\\\ I_p = \\dfrac{\\pi}{32}(375^4 - 351^4) = 4{,}513\\cdot 10^8\\,\\text{mm}^4 \\\\ \\tau_T = \\dfrac{10{,}8\\cdot 10^6\\cdot 187{,}5}{4{,}513\\cdot 10^8}\\end{gathered}',
      resultat:'τ_T = <b>4,49 MPa</b>' },

    { del:'b · forskydning',
      hvad:'Den direkte tværkraft-forskydning er NUL i H — og hvorfor vi deler med (I·t)',
      hvorfor:'Vinden giver også en tværkraft V, der ellers ville give forskydning τ = V·Q/(I·t). Hvad betyder symbolerne? <span class="key">Q</span> er det statiske moment af arealet <b>uden for</b> snittet — altså "hvor meget materiale hænger udenfor og vil glide forbi". <span class="key">t</span> er bredden ved snittet; vi deler med I·t for at <b>fordele forskydnings-flowet ud over den bredde, materialet faktisk har</b> dér (et bredt snit fordeler kraften, så spændingen falder). I punkt H står vi <b>yderst</b> i vindens retning → der er <b>intet areal uden for snittet → Q = 0 → τ_V = 0</b>. Derfor bidrager kun torsionen i H. (Et smart valg af punkt: ét bidrag forsvinder.)',
      formel:'\\begin{gathered}\\tau_V = \\dfrac{V\\,Q}{I\\,t} \\quad\\text{men}\\quad Q = 0 \\Rightarrow \\tau_V = 0 \\\\ \\tau_H = \\tau_T\\end{gathered}',
      resultat:'τ_H = <b>4,49 MPa</b> (kun torsion).' },

    { del:'c · hovedspændinger',
      hvad:'Transformér til hovedspændinger med Mohrs cirkel',
      hvorfor:'Nu har H <b>både</b> en normalspænding (σ_y = 24,29) og en forskydning (τ = 4,49) — så de "rigtige" retninger er skæve. <span class="key">Mohrs cirkel</span> finder netop de vinkler, hvor forskydningen forsvinder, og spændingen er rent træk eller rent tryk: hovedspændingerne σ₁ (størst træk) og σ₂. Centrum ligger i gennemsnittet σ̄, og radius R er den maksimale forskydning.',
      formel:'\\begin{gathered}\\bar\\sigma = \\dfrac{0 + 24{,}29}{2} = \\textcolor{#5ec8ff}{12{,}15} \\\\ R = \\sqrt{12{,}15^2 + 4{,}49^2} \\\\ \\sigma_{1,2} = \\bar\\sigma \\pm R\\end{gathered}',
      figur:'<svg viewBox="0 0 360 240" width="360" height="240" role="img" aria-label="Mohrs cirkel for punkt H"><line x1="50" y1="140" x2="345" y2="140" stroke="#cfe3f5" stroke-width="1.5"/><text x="348" y="144" font-family="Nunito,sans-serif" font-size="11" fill="#cfe3f5">σ</text><line x1="95" y1="235" x2="95" y2="30" stroke="#cfe3f5" stroke-width="1.5"/><text x="83" y="38" font-family="Nunito,sans-serif" font-size="11" fill="#cfe3f5">τ</text><circle cx="180" cy="140" r="90.7" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2.5"/><circle cx="180" cy="140" r="3" fill="#cfe3f5"/><text x="150" y="158" font-family="Nunito,sans-serif" font-size="10" fill="#9bd4ff">C=12,15</text><circle cx="270.6" cy="140" r="4.5" fill="#5ec8ff"/><text x="250" y="132" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#9bd4ff">σ₁=25,1</text><circle cx="89.4" cy="140" r="4.5" fill="#5ec8ff"/><text x="50" y="132" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#9bd4ff">σ₂=−0,8</text><line x1="180" y1="140" x2="180" y2="49" stroke="#ffd24a" stroke-width="1.6" stroke-dasharray="4 3"/><circle cx="180" cy="49" r="4" fill="#ffd24a"/><text x="186" y="50" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ffd24a">τ_max=12,95</text><circle cx="265" cy="109" r="3.5" fill="#cfe3f5"/><text x="268" y="105" font-family="Nunito,sans-serif" font-size="9" fill="#cfe3f5">(σ_y,τ)</text><circle cx="95" cy="171" r="3.5" fill="#cfe3f5"/><line x1="265" y1="109" x2="95" y2="171" stroke="#7e9ab0" stroke-width="1" stroke-dasharray="3 3"/></svg>',
      figcap:'Mohrs cirkel: centrum i σ̄=12,15, radius R=12,95. Skæringerne med σ-aksen er σ₁ og σ₂; toppen er τ_max.',
      resultat:'R = 12,95 → σ₁ = <b>25,09 MPa</b>, σ₂ = <b>−0,80 MPa</b><br>τ_max = 12,95 MPa, θ_p1 = 10,1°.<br>Næsten al spændingen er træk langs stolpen; forskydningen skubber blot σ₁ lidt op.' },

    { del:'d · sikkerhed',
      hvad:'Sikkerhedsfaktor mod flydning (Tresca): n = S_y / (σ₁ − σ₃)',
      hvorfor:'<span class="key">Tresca</span> siger: materialet flyder, når den <b>største forskydning</b> bliver for stor — og den afhænger af spændet σ₁ − σ₃. I plan spænding er der ingen spænding ud af planen, så <b>σ₃ = 0</b>. Da σ₂ er negativ, er det største spænd σ₁ − σ₂. Tallet <b>n fortæller, hvor mange gange lasten kan øges</b>, før stolpen flyder.',
      formel:'\\begin{gathered}n = \\dfrac{S_y}{\\sigma_1 - \\sigma_3} \\quad (\\sigma_3 = 0,\\ \\sigma_2 < 0 \\Rightarrow \\sigma_1 - \\sigma_2) \\\\ n = \\dfrac{235}{25{,}09 - (-0{,}80)}\\end{gathered}',
      resultat:'n = 235 / 25,90 = <b>9,07</b> — stolpen kan bære ca. 9× lasten før flydning (stor sikkerhed).' }
  ],
  selvcheck: [
    { status:'ok', tjek:'Enheder', note:'N·mm·mm/mm⁴ = MPa — konsistent hele vejen.' },
    { status:'ok', tjek:'Bøjning dominerer', note:'26,9 ≫ 2,6 MPa — armen gør vægten til en bøjelast, præcis som forventet.' },
    { status:'ok', tjek:'Facit (Mathcad)', note:'σ_H = 24,29 · τ = 4,49 · σ₁ = 25,09 · σ₂ = −0,80 · n = 9,07 — matcher Mathcad-arket eksakt.' }
  ],
  variant:
    '<p>Fordobl vindlasten til <b>24 kN</b> (storm) og genberegn. Bemærk, at τ fordobles direkte, men da bøjningen dominerer σ, falder n kun moderat.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit på storm-varianten</span></div>'+
    '<div class="res"><span class="navn">Facit</span>T = 0,9·24 = 21,6 kNm ⇒ τ_T = 2·4,49 = <b>8,98 MPa</b>. R = √(12,15² + 8,98²) = 15,10 ⇒ σ₁ = <b>27,25</b>, σ₂ = <b>−2,96 MPa</b>. n = 235/(27,25+2,96) = <b>7,78</b> (faldt kun fra 9,07 → 7,78).</div></div>'
};
