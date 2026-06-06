/* MEK2 Gennemgang — Opgave 1: Aksial stang, skråt snit + kombineret last.
   Kilde: Besvarelse_MEK2_S26/opg1.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg1'] = {
  titel: 'Aksial stang — skråt snit',
  undertitel: 'Transformation og kombineret last',
  opgavetekst:
    '<p>En 2 m lang stang trækkes med <b>F = 25 kN</b> langs sin akse. Tværsnit: kvadratisk <b>10×10 mm</b>, stål.</p>'+
    '<p class="dim">a) Normal- og forskydningsspænding på snittet ved θ = 25°. &nbsp; b) Maksimale spændinger + vinkler. &nbsp; c) Spændinger som funktion af snitvinklen 0–90°. &nbsp; d) Med en ekstra vertikal punktlast P = 10 kN midtspans: spændingstilstand, hovedspændinger og τ_max i punkt A (top) og B (neutralakse) ved x = 20 cm.</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> start simpelt (ren træk), drej snittet og se træk blive til forskydning, og slut med at "stable" tre spændinger oven på hinanden (superposition).</p>',
  reference: [
    { navn:'Aksial spænding', formel:'\\sigma_x = \\dfrac{N}{A}', nb:'Kraft delt med areal — den jævne grundspænding.', kilde:'Hibbeler · kap. 1 (gennemsnitlig normalspænding)' },
    { navn:'Skråt snit', formel:'\\sigma_\\theta = \\sigma_x\\cos^2\\theta \\qquad \\tau_\\theta = -\\sigma_x\\sin\\theta\\cos\\theta', nb:'θ måles fra stangaksen til snittets normal.', kilde:'Hibbeler · lign. 2-29 (spændinger på skråt snit, kap. 2)' },
    { navn:'Bøjespænding', formel:'\\sigma = \\dfrac{M\\,y}{I} \\qquad I = \\dfrac{b\\,h^3}{12}', nb:'I = bøjestivhed; y = afstand fra neutralaksen.', kilde:'Hibbeler · lign. 5-13 (bøjeformlen, kap. 5)' },
    { navn:'Forskydning', formel:'\\tau = \\dfrac{V\\,Q}{I\\,b}', nb:'Q = statisk moment af areal uden for snittet; b = bredde ved snittet.', kilde:'Hibbeler · lign. 5-41 (forskydningsformlen, kap. 5)' },
    { navn:'Hovedspændinger', formel:'\\sigma_{1,2} = \\bar\\sigma \\pm \\sqrt{\\left(\\tfrac{\\sigma_x-\\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}', nb:'Mohr — der hvor forskydningen forsvinder.', kilde:'Hibbeler · lign. 7-17 (hovedspændinger, kap. 7)' }
  ],
  steps: [
    { del:'a · transformation',
      hvad:'Den rene trækspænding: \\(\\sigma_x = F/A\\)',
      hvorfor:'Når vi trækker lige i en stang, fordeler kraften sig <b>jævnt over hele tværsnittet</b> — som når du trækker i et viskelæder: hver lille bid mærker det samme. Intet bøjer, intet skubber til siden. Det er det enkleste mulige spændingsbillede og vores "nulpunkt". 1 MPa = 1 N pr. mm².',
      formel:'\\sigma_x = \\dfrac{F}{A} = \\dfrac{25{,}0\\cdot 10^3\\,\\text{N}}{10\\cdot 10\\,\\text{mm}^2} = \\dfrac{25000}{100}',
      resultat:'σ_x = <b>250 MPa</b> — 25 000 N fordelt på 100 mm² giver 250 N på hver mm².' },

    { del:'a · transformation',
      hvad:'Drej snittet til \\(\\theta = 25^\\circ\\): \\(\\sigma_\\theta = \\sigma_x\\cos^2\\theta\\), \\(\\tau_\\theta = -\\sigma_x\\sin\\theta\\cos\\theta\\)',
      hvorfor:'Forestil dig at skære skråt i en spegepølse, mens du trækker i enderne. Den skrå flade er <b>større</b>, og kraften rammer den i en skæv vinkel — så den kan deles i to: en del der <b>trykker vinkelret</b> på fladen (σ_θ) og en der <b>glider langs</b> fladen (τ_θ). <span class="key">cos²θ</span> fortæller, hvor stor en del af trækket der stadig står vinkelret (jo skævere snit, jo mindre); <span class="key">sinθ·cosθ</span> fanger den del, der glider. (Som at skubbe en kasse op ad en rampe: noget løfter, noget trækker langs.)',
      formel:'\\begin{gathered}\\sigma_\\theta = 250\\cos^2 25^\\circ = 250\\cdot 0{,}8214 \\\\ \\tau_\\theta = -250\\sin 25^\\circ\\cos 25^\\circ = -250\\cdot 0{,}4226\\cdot 0{,}9063\\end{gathered}',
      figur:'<svg viewBox="0 0 340 180" width="340" height="180" role="img" aria-label="Skraat snit i aksial stang"><rect x="80" y="65" width="180" height="50" fill="#102a42" stroke="#5ec8ff" stroke-width="2"/><line x1="78" y1="90" x2="44" y2="90" stroke="#ff6b6b" stroke-width="3"/><polygon points="36,90 50,84 50,96" fill="#ff6b6b"/><text x="38" y="80" font-family="Nunito,sans-serif" font-weight="700" font-size="12" fill="#ff9b9b">F</text><line x1="262" y1="90" x2="296" y2="90" stroke="#ff6b6b" stroke-width="3"/><polygon points="304,90 290,84 290,96" fill="#ff6b6b"/><text x="292" y="80" font-family="Nunito,sans-serif" font-weight="700" font-size="12" fill="#ff9b9b">F</text><line x1="70" y1="90" x2="274" y2="90" stroke="#3d6188" stroke-width="1.2" stroke-dasharray="6 4"/><text x="277" y="94" font-family="Nunito,sans-serif" font-size="10" fill="#7e9ab0">x</text><line x1="128" y1="113" x2="226" y2="63" stroke="#ffd24a" stroke-width="2.5"/><text x="110" y="124" font-family="Nunito,sans-serif" font-size="10" fill="#ffd24a">snit</text><path d="M196 90 A23 23 0 0 0 193 80" fill="none" stroke="#cfe3f5" stroke-width="1.4"/><text x="200" y="86" font-family="Nunito,sans-serif" font-size="11" fill="#cfe3f5">θ=25°</text><line x1="198" y1="77" x2="181" y2="44" stroke="#5ec8ff" stroke-width="2.5"/><polygon points="178,37 190,47 183,50" fill="#5ec8ff"/><text x="162" y="36" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#9bd4ff">σ_θ</text><line x1="198" y1="77" x2="223" y2="64" stroke="#ff6b6b" stroke-width="2.5"/><polygon points="230,60 216,62 221,72" fill="#ff6b6b"/><text x="229" y="58" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ff9b9b">τ_θ</text></svg>',
      figcap:'Snittet går fra x-aksen nede til venstre op til toppen til højre (θ = 25° fra x-aksen). Det deler trækket i σ_θ vinkelret på fladen og τ_θ langs fladen.',
      resultat:'σ_θ = <b>205,3 MPa</b>, τ_θ = <b>−95,8 MPa</b>.<br>~82 % af trækket bliver vinkelret tryk; resten dukker op som forskydning. Minus = bare retningen.' },

    { del:'b · maksima',
      hvad:'Hvor er \\(\\sigma\\) og \\(\\tau\\) størst?',
      hvorfor:'Det vinkelrette tryk er størst, når snittet vender <b>lige imod</b> kraften (θ = 0°). Forskydningen topper <b>midt imellem, ved 45°</b>, hvor τ_max = σ_x/2. <b>Aha:</b> et duktilt materiale i træk brister faktisk i en 45°-kegle — ikke lige over — netop fordi det er forskydningen, der "vinder" der. Det ses på en overstrakt ståltrækprøve eller et trukket tyggegummi.',
      formel:'\\begin{gathered}\\sigma_{\\max} = \\sigma_x \\;\\;(\\theta = 0^\\circ) \\\\ \\tau_{\\max} = \\dfrac{\\sigma_x}{2} \\;\\;(\\theta = 45^\\circ)\\end{gathered}',
      resultat:'σ_max = <b>250 MPa</b> (ved 0°), τ_max = <b>125 MPa</b> (ved 45°).' },

    { del:'c · graf',
      hvad:'Spændinger som funktion af snitvinklen 0–90°',
      hvorfor:'Skriver vi om med dobbeltvinkel-formler bliver mønsteret tydeligt: σ_θ = 125(1 + cos2θ) og τ_θ = −125·sin2θ. <b>Når normalspændingen falder, stiger forskydningen</b> — de "bytter plads". Toppen af forskydningen ligger præcis, hvor de to kurver krydser (45°).',
      formel:'\\begin{gathered}\\sigma_\\theta = 125\\,(1 + \\cos 2\\theta) \\\\ \\tau_\\theta = -125\\sin 2\\theta\\end{gathered}',
      resultat:'Blå (σ_θ) daler fra 250 ved 0° til 0 ved 90°. Rød (τ_θ) er 0 i begge ender og dykker til −125 ved 45°.' },

    { del:'d · kombineret last',
      hvad:'Snitkræfter ved \\(x = 0{,}2\\,\\text{m}\\) (nu også en bjælke)',
      hvorfor:'Med punktlasten P er stangen <b>også en bjælke</b>. Tre effekter optræder samtidig (træk, bøjning, forskydning), og vi lægger dem oven på hinanden — <span class="key">superposition</span>. Lasten deles ligeligt mellem støtterne (5 kN hver); momentet er "kraft gange arm" fra venstre støtte; tværkraften er bare reaktionen.',
      formel:'\\begin{gathered}R_A = R_B = \\dfrac{P}{2} = \\textcolor{#5ec8ff}{5\\,\\text{kN}} \\\\ M(0{,}2) = R_A\\cdot 0{,}2 = 1{,}0\\,\\text{kNm} \\qquad V = R_A = 5\\,\\text{kN}\\end{gathered}',
      resultat:'R_A = 5 kN, M = 1,0 kNm, V = 5 kN.' },

    { del:'d · kombineret last',
      hvad:'Tværsnitsdata og bøjespænding: \\(\\sigma_b = Mc/I\\)',
      hvorfor:'Til bøjningen skal vi bruge <span class="key">I = b·h³/12</span> — geometriens stivhed mod bøjning. Bemærk h³: højden tæller i tredje potens, derfor er en høj bjælke meget stivere end en lav. Bøjespændingen σ = Mc/I bruger <b>c = h/2</b> (yderfiberen), fordi spændingen er størst der.',
      formel:'\\begin{gathered}A = 100\\,\\text{mm}^2 \\quad I = \\dfrac{10\\cdot 10^3}{12} = \\textcolor{#5ec8ff}{833{,}3\\,\\text{mm}^4} \\quad c = 5\\,\\text{mm} \\\\ \\sigma_N = \\dfrac{F}{A} = 250\\,\\text{MPa} \\\\ \\sigma_b = \\dfrac{M\\,c}{I} = \\dfrac{1{,}0\\cdot 10^6\\cdot 5}{833{,}3}\\end{gathered}',
      resultat:'σ_b = <b>6000 MPa</b> i yderfiberen. (Urealistisk stort — det kommenterer vi i selv-tjekket; opgaven er en metode-øvelse.)' },

    { del:'d · punkt A',
      hvad:'Punkt A (topfiber): træk og bøjetryk kæmper mod hinanden',
      hvorfor:'I toppen presses bjælken sammen (den hænger nedad), så bøjningen giver <b>tryk</b> her — og det <b>modarbejder</b> det aksiale træk. I yderfiberen er der ingen forskydning, fordi <b>Q = 0</b> (intet areal uden for snittet). A er derfor i ren enakset tryk.',
      formel:'\\begin{gathered}\\sigma_A = \\sigma_N - \\sigma_b = 250 - 6000 \\\\ \\tau_A = 0 \\;\\;(\\text{yderfiber} \\Rightarrow Q = 0)\\end{gathered}',
      resultat:'σ_A = <b>−5750 MPa</b> (enakset tryk). σ₁ = 0, σ₂ = −5750, τ_max = |σ_A|/2 = <b>2875 MPa</b> ved 45°.' },

    { del:'d · punkt B',
      hvad:'Punkt B (neutralakse): bøjning væk, forskydning maksimal → Mohr',
      hvorfor:'På neutralaksen er y = 0, så <b>bøjningen er nul</b> — men forskydningen er <b>størst</b> her. I τ = VQ/(I·b) er <span class="key">Q</span> det statiske moment af det halve tværsnit (størst på NA), og <span class="key">b</span> bredden ved snittet, vi deler ud over. Fordi B har <b>både</b> σ og τ, kræver det Mohrs cirkel for at finde de "ægte" hovedspændinger.',
      formel:'\\begin{gathered}Q = \\left(b\\,\\tfrac{h}{2}\\right)\\tfrac{h}{4} = (10\\cdot 5)\\cdot 2{,}5 = 125\\,\\text{mm}^3 \\\\ \\tau_B = \\dfrac{V\\,Q}{I\\,b} = \\dfrac{5000\\cdot 125}{833{,}3\\cdot 10} = 75\\,\\text{MPa} \\\\ \\bar\\sigma = 125 \\qquad R = \\sqrt{125^2 + 75^2} = 145{,}8\\end{gathered}',
      resultat:'σ₁ = <b>270,8 MPa</b>, σ₂ = <b>−20,8 MPa</b>, τ_max = 145,8 MPa, θ_p = ½·arctan(150/250) = <b>15,5°</b>.' }
  ],
  selvcheck: [
    { status:'ok', tjek:'Enheder', note:'N/mm² = MPa; N·mm·mm/mm⁴ = MPa.' },
    { status:'ok', tjek:'Invariant σ_θ + σ_(θ+90) = σ_x', note:'205,3 + 44,7 = 250 — summen er altid trækspændingen.' },
    { status:'ok', tjek:'τ_max ved 45°', note:'Klassisk for enakset spænding — duktile materialer er svagest dér.' },
    { status:'warn', tjek:'Størrelsesorden', note:'σ i d) overstiger stålets flydegrænse (~235 MPa) ca. 25×. Tværsnittet er urealistisk lille til P — opgaven er en METODE-øvelse i kombineret last, ikke et realistisk design.' }
  ],
  variant:
    '<p>Samme stang, men θ = 60° og F = 40 kN. Beregn σ_θ, τ_θ samt σ_max, τ_max.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>σ_x = 40·10³/100 = 400 MPa. σ_θ = 400·cos²60° = 400·0,25 = <b>100 MPa</b>. τ_θ = −400·sin60°·cos60° = −400·0,433 = <b>−173 MPa</b>. σ_max = 400 MPa (0°), τ_max = 200 MPa (45°). Bemærk: σ_θ er nu lille, mens |τ_θ| er tæt på maksimum — snittet vender næsten "langs" kraften.</div></div>'
};
