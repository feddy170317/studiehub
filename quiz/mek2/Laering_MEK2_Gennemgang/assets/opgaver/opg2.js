/* MEK2 Gennemgang — Opgave 2: Rør i torsion.
   Kilde: Besvarelse_MEK2_S26/opg2.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg2'] = {
  titel: 'Rør i torsion',
  undertitel: 'Vridning, ren forskydning og tøjninger',
  opgavetekst:
    '<p>Et <b>2000 mm</b> langt rør (E = 2,1·10⁵ MPa, ν = 0,3) belastes med torsionsmoment <b>T = 250 Nm</b>. Ydre Ø = <b>50 mm</b>, indre = <b>45 mm</b>.</p>'+
    '<p class="dim">a) Total vridningsvinkel (rad). &nbsp; b) τ_max på ydre og indre overflade. &nbsp; c) Max tryk-/trækspænding + spændingselement. &nbsp; d) Ekstreme tøjninger. &nbsp; e) Største tilladelige T hvis ε_till = 1,5·10⁻⁴ og φ_till = 1,5°.</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> torsion er REN forskydning — men der gemmer sig et træk og et tryk på 45° (kridt-spiralen).</p>',
  reference: [
    { navn:'Polært inertimoment', formel:'I_p = \\dfrac{\\pi}{32}(D^4 - d^4)', nb:'Formens stivhed mod vridning; = 2·I for cirkler.', kilde:'Hibbeler · lign. 3-19 (polært inertimoment, kap. 3)' },
    { navn:'Vridningsvinkel', formel:'\\varphi = \\dfrac{T\\,L}{G\\,I_p}', nb:'Som en blød fjeder: mere T og L → mere drejning; mere G og I_p → mindre.', kilde:'Hibbeler · lign. 3-15 (vridningsvinkel, kap. 3)' },
    { navn:'Forskydningsspænding', formel:'\\tau = \\dfrac{T\\,\\rho}{I_p}', nb:'Vokser lineært med radius ρ — nul i centrum, max yderst.', kilde:'Hibbeler · lign. 3-13 (torsionsformlen, kap. 3)' },
    { navn:'Forskydningsmodul', formel:'G = \\dfrac{E}{2(1+\\nu)}', nb:'Materialets stivhed mod forskydning.', kilde:'Hibbeler · kap. 3 (sammenhæng E, G, ν)' },
    { navn:'Ren forskydning', formel:'\\sigma_{1,2} = \\pm\\tau \\;\\;(45^\\circ) \\qquad \\gamma = \\dfrac{\\tau}{G} \\qquad \\varepsilon = \\dfrac{\\tau(1+\\nu)}{E}', nb:'Hooke med σ₁ = +τ, σ₂ = −τ.', kilde:'Hibbeler · kap. 7 (transformation) + Hookes lov, kap. 3' }
  ],
  steps: [
    { del:'a · vinkel',
      hvad:'Find materialets G og formens I_p',
      hvorfor:'<span class="key">G</span> er "materialets stivhed mod forskydning" — hvor meget det modstår at blive skubbet sideværts. <span class="key">I_p</span> er "formens evne til at modstå vridning" — jo mere materiale langt fra centrum, jo større (igen en fjerde-potens af diameteren). For et rør er I_p bare den store massive aksel <b>minus</b> den lille, vi har boret væk.',
      formel:'\\begin{gathered}G = \\dfrac{210000}{2\\cdot 1{,}3} \\\\ I_p = \\dfrac{\\pi}{32}(50^4 - 45^4) = \\dfrac{\\pi}{32}(6\\,250\\,000 - 4\\,100\\,625)\\end{gathered}',
      resultat:'G = <b>80 769 MPa</b> (≈ 80,8 GPa). I_p = <b>2,110·10⁵ mm⁴</b>.' },

    { del:'a · vinkel',
      hvad:'Vridningsvinklen: φ = T·L / (G·I_p)',
      hvorfor:'Tænk på det som en blød fjeder: jo større moment (T) og jo længere rør (L), jo mere drejer enden. Jo stivere materiale (G) og kraftigere form (I_p), jo mindre. Det er præcis, hvad brøken siger. <b>Pas på enheder:</b> T = 250 Nm SKAL blive til 250 000 Nmm.',
      formel:'\\varphi = \\dfrac{250\\,000 \\cdot 2000}{80\\,769 \\cdot 2{,}110\\cdot 10^5}',
      resultat:'φ = <b>0,0293 rad</b> = 1,68° (gang med 180/π). En lille, men målbar vridning.' },

    { del:'b · spænding',
      hvad:'τ_max på ydre og indre overflade: τ = T·ρ / I_p',
      hvorfor:'Forskydningen følger radius <b>lineært</b> — nul i centrum, størst i overfladen. Derfor regner vi den både yderst (ρ = 25) og inderst (ρ = 22,5) og ser, at den følger radius direkte. Det er også <b>derfor aksler laves hule</b>: materialet i midten laver næsten intet arbejde.',
      formel:'\\begin{gathered}\\tau_{\\text{ydre}} = \\dfrac{250\\,000\\cdot 25}{2{,}110\\cdot 10^5} \\\\ \\tau_{\\text{indre}} = \\dfrac{250\\,000\\cdot 22{,}5}{2{,}110\\cdot 10^5}\\end{gathered}',
      figur:'<svg viewBox="0 0 340 210" width="340" height="210" role="img" aria-label="Roertvaersnit og lineaer forskydning"><circle cx="90" cy="110" r="60" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2.5"/><circle cx="90" cy="110" r="48" fill="#0b1a29" stroke="#9bd4ff" stroke-width="1.6"/><circle cx="90" cy="110" r="2.5" fill="#cfe3f5"/><path d="M42 110 a48 48 0 1 0 96 0" fill="none" stroke="#ffd24a" stroke-width="2.5"/><polygon points="138,110 128,100 132,121" fill="#ffd24a"/><text x="78" y="40" font-family="Nunito,sans-serif" font-weight="700" font-size="13" fill="#ffd24a">T</text><line x1="200" y1="165" x2="325" y2="165" stroke="#cfe3f5" stroke-width="1.5"/><line x1="200" y1="165" x2="200" y2="55" stroke="#cfe3f5" stroke-width="1.5"/><text x="196" y="52" text-anchor="end" font-family="Nunito,sans-serif" font-size="10" fill="#cfe3f5">τ</text><text x="322" y="178" font-family="Nunito,sans-serif" font-size="10" fill="#cfe3f5">ρ</text><line x1="200" y1="165" x2="315" y2="70" stroke="#ff6b6b" stroke-width="2.5"/><line x1="303" y1="165" x2="303" y2="80" stroke="#3d6188" stroke-width="1" stroke-dasharray="3 3"/><text x="246" y="172" font-family="Nunito,sans-serif" font-size="9" fill="#7e9ab0">0 i centrum</text><text x="276" y="62" font-family="Nunito,sans-serif" font-weight="700" font-size="10" fill="#ff9b9b">29,6 (yderst)</text></svg>',
      figcap:'Forskydningen vokser lineært med radius — nul i centrum, størst i overfladen. Derfor laves aksler hule.',
      resultat:'τ_ydre = <b>29,6 MPa</b>, τ_indre = <b>26,7 MPa</b>. Forholdet 26,7/29,6 = 0,90 = 45/50 — præcis som radius-forholdet.' },

    { del:'c · træk/tryk',
      hvad:'Ren forskydning → træk og tryk på 45° (kridt-spiralen)',
      hvorfor:'Selvom det ligner ren vridning, gemmer der sig et lige stort træk og tryk på 45°. Når et element kun har forskydning, er Mohrs cirkel <b>centreret i origo</b> med radius τ. Drejer vi 45° (= 90° på cirklen), forsvinder forskydningen og bliver til <b>rent træk</b> på den ene led og <b>rent tryk</b> på den anden. Et stykke kridt vrides og knækker netop i en pæn 45°-spiral — fordi kridt er svagt i træk, og trækket topper på 45°.',
      formel:'\\sigma_1 = +\\tau_{\\max} \\qquad \\sigma_2 = -\\tau_{\\max} \\quad (45^\\circ)',
      resultat:'σ_træk = <b>+29,6 MPa</b>, σ_tryk = <b>−29,6 MPa</b>.' },

    { del:'d · tøjninger',
      hvad:'Ekstreme tøjninger: γ = τ/G og ε = ±τ(1+ν)/E',
      hvorfor:'<span class="key">γ</span> (forskydningstøjning) er "hvor skævt" akse-elementet bliver, og hører til 0°/90°-elementet. <span class="key">ε</span> (normaltøjning) er "hvor meget" 45°-elementet strækkes/forkortes, og fås af Hookes lov med σ₁ = +τ, σ₂ = −τ. Kontrollen γ = ε_træk − ε_tryk = 2ε passer altid for ren forskydning.',
      formel:'\\begin{gathered}\\gamma_{\\max} = \\dfrac{\\tau_{\\max}}{G} = \\dfrac{29{,}6}{80769} \\\\ \\varepsilon = \\dfrac{\\tau(1+\\nu)}{E} = \\dfrac{29{,}6\\cdot 1{,}3}{210000}\\end{gathered}',
      resultat:'γ_max = <b>3,67·10⁻⁴</b>; ε_træk = +1,83·10⁻⁴, ε_tryk = −1,83·10⁻⁴. Kontrol: 2·1,83 = 3,67·10⁻⁴ ✓.' },

    { del:'e · dimensionering',
      hvad:'Største tilladelige T: to grænser, "den laveste vinder"',
      hvorfor:'Vi har to stopklodser: én for tøjning og én for vinkel. Hver giver et maksimalt T. Designet skal overholde <b>begge</b> samtidig, så det er den <b>mindste</b> af de to, der sætter loftet — den grænse, vi rammer først.',
      formel:'\\begin{gathered}\\tau_{\\text{till}} = \\dfrac{\\varepsilon E}{1+\\nu} = \\dfrac{1{,}5\\cdot 10^{-4}\\cdot 210000}{1{,}3} = 24{,}23\\,\\text{MPa} \\\\ T_\\varepsilon = \\dfrac{\\tau_{\\text{till}}\\,I_p}{D/2} = \\dfrac{24{,}23\\cdot 2{,}110\\cdot 10^5}{25} \\\\ T_\\varphi = \\dfrac{\\varphi\\,G\\,I_p}{L} = \\dfrac{0{,}0262\\cdot 80769\\cdot 2{,}110\\cdot 10^5}{2000}\\end{gathered}',
      resultat:'T_ε = <b>204,5 Nm</b>, T_φ = 223,1 Nm ⇒ T_max = min = <b>204,5 Nm</b> (tøjningen rammes først).' }
  ],
  selvcheck: [
    { status:'ok', tjek:'Enheder', note:'N·mm·mm/mm⁴ = MPa; rad er dimensionsløs.' },
    { status:'ok', tjek:'γ = 2·ε₁', note:'Følger af G = E/[2(1+ν)] ved ren forskydning.' },
    { status:'ok', tjek:'τ_indre/τ_ydre = d/D', note:'26,7/29,6 = 0,90 = 45/50 — spændingen følger radius.' },
    { status:'warn', tjek:'Designkritik', note:'Det aktuelle T = 250 Nm overstiger BEGGE grænser (φ = 1,68° > 1,5° og ε = 1,83·10⁻⁴ > 1,5·10⁻⁴) — T skal reduceres til ≤ 205 Nm.' }
  ],
  variant:
    '<p>Massiv aksel med samme ydre diameter D = 50 mm (ingen boring), samme T. Beregn φ og τ_max.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>I_p = (π/32)·50⁴ = 6,136·10⁵ mm⁴ (mod 2,110·10⁵ for røret). φ = (250000·2000)/(80769·6,136·10⁵) = <b>0,0101 rad</b> = 0,58°. τ_max = (250000·25)/6,136·10⁵ = <b>10,2 MPa</b>. Bemærk: I_p voksede ~3×, selvom vi kun tilføjede materiale TÆT på centrum — netop pointen i at materiale nær aksen bidrager lidt til torsionsstivheden, og derfor laves aksler hule.</div></div>'
};
