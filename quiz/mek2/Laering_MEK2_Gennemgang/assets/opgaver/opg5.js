/* MEK2 Gennemgang — Opgave 5: Maskindel ABCD (torsion + bøjning).
   Kilde: Besvarelse_MEK2_S26/opg5.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg5'] = {
  titel: 'Maskindel ABCD',
  undertitel: 'Torsion + bøjning kombineret i Von Mises',
  opgavetekst:
    '<p>Maskindel ABCD: aksel AB (massiv Ø50, L = 150 mm), aksel BC (massiv Ø40, L = 250 mm), arm CD (L = 200 mm, vinkelret på akslen). Last <b>F = 1200 N</b> nedad i D. E = 210 GPa, G = 80 GPa.</p>'+
    '<p class="dim">a) Torsionsmoment på akslerne. &nbsp; b) Forskydning ved A (torsion). &nbsp; c) Vridningsvinkel i C. &nbsp; d) Bøjespænding i B₁. &nbsp; e) Von Mises i B₁.</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> armen CD er en svensknøgle — vægten både VRIDER akslen (torsion) og BØJER den (fordi den hænger et stykke ude). Vi holder dem adskilt og kombinerer i B₁.</p>',
  reference: [
    { navn:'Torsion', formel:'\\tau = \\dfrac{T\\,\\rho}{I_p} \\qquad I_p = \\dfrac{\\pi}{32}D^4 \\qquad \\varphi = \\dfrac{TL}{G\\,I_p}', nb:'T konstant hele vejen; kun D skifter.', kilde:'Hibbeler · lign. 3-13 & 3-15 (torsion + vinkel, kap. 3)' },
    { navn:'Bøjning', formel:'\\sigma = \\dfrac{M\\,c}{I} \\qquad I = \\dfrac{\\pi}{64}D^4', nb:'Bøjemoment fra armen langs aksen.', kilde:'Hibbeler · lign. 5-13 (bøjeformlen, kap. 5)' },
    { navn:'Von Mises (σ + τ)', formel:'\\sigma_{vM} = \\sqrt{\\sigma^2 + 3\\tau^2}', nb:'Faktor 3 gør forskydning "dyr".', kilde:'Hibbeler · lign. 7-12 (Von Mises for σ+τ, kap. 7)' }
  ],
  steps: [
    { del:'a · torsion',
      hvad:'Torsionsmomentet: T = F·L_CD',
      hvorfor:'Armen CD står <b>vinkelret</b> på akslen, så hele dens længde er "vrider-armen". Det er præcis som momentet på en skruenøgle: <b>kraft gange greblængde</b>. Det samme T løber gennem både BC og AB — torsionsmomentet ændrer sig ikke langs akslen.',
      formel:'T = F\\cdot L_{CD} = 1200\\cdot 200',
      figur:'<svg viewBox="0 0 340 200" width="340" height="200" role="img" aria-label="Maskindel ABCD"><rect x="30" y="55" width="10" height="60" fill="#1a3a55" stroke="#5ec8ff" stroke-width="2"/><line x1="30" y1="120" x2="44" y2="134" stroke="#7e9ab0" stroke-width="1.5"/><line x1="30" y1="105" x2="44" y2="119" stroke="#7e9ab0" stroke-width="1.5"/><line x1="30" y1="90" x2="44" y2="104" stroke="#7e9ab0" stroke-width="1.5"/><rect x="40" y="78" width="110" height="14" fill="rgba(94,200,255,0.12)" stroke="#5ec8ff" stroke-width="2"/><rect x="150" y="80" width="110" height="10" fill="rgba(94,200,255,0.12)" stroke="#5ec8ff" stroke-width="2"/><rect x="255" y="85" width="10" height="80" fill="rgba(255,210,74,0.12)" stroke="#ffd24a" stroke-width="2"/><text x="42" y="72" font-family="Anton,sans-serif" font-size="12" fill="#cfe3f5">A</text><text x="146" y="72" font-family="Anton,sans-serif" font-size="12" fill="#cfe3f5">B</text><text x="248" y="78" font-family="Anton,sans-serif" font-size="12" fill="#cfe3f5">C</text><text x="268" y="162" font-family="Anton,sans-serif" font-size="12" fill="#cfe3f5">D</text><line x1="260" y1="165" x2="260" y2="190" stroke="#ff6b6b" stroke-width="3"/><polygon points="260,196 254,182 266,182" fill="#ff6b6b"/><text x="270" y="185" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ff9b9b">F=1200 N</text><text x="95" y="110" text-anchor="middle" font-family="Nunito,sans-serif" font-size="9" fill="#9bd4ff">AB Ø50</text><text x="205" y="108" text-anchor="middle" font-family="Nunito,sans-serif" font-size="9" fill="#9bd4ff">BC Ø40</text><text x="288" y="125" font-family="Nunito,sans-serif" font-size="9" fill="#ffd24a">arm CD</text></svg>',
      figcap:'Vægten i D virker som en svensknøgle: armen CD vrider akslen (T = F·L_CD), og afstanden BC bøjer den.',
      resultat:'T = <b>240 000 Nmm = 240 Nm</b> — samme T gennem AB og BC.' },

    { del:'b · forskydning',
      hvad:'Forskydning ved A: τ_A = T·(D/2)/I_p',
      hvorfor:'A ligger på den <b>tykke</b> aksel AB (Ø50), så vi bruger den diameter. Torsionsmomentet er det samme hele vejen fra D til indspændingen — kun I_p skifter med diameteren. Forskydningen bliver lav, netop fordi Ø50 er kraftig (τ ∝ 1/D³).',
      formel:'\\begin{gathered}I_p = \\dfrac{\\pi}{32}\\cdot 50^4 = 6{,}136\\cdot 10^5\\,\\text{mm}^4 \\\\ \\tau_A = \\dfrac{240000\\cdot 25}{6{,}136\\cdot 10^5}\\end{gathered}',
      resultat:'τ_A = <b>9,78 MPa</b> — lav, fordi akslen er kraftig.' },

    { del:'c · vinkel',
      hvad:'Vridningsvinkel i C: φ_C = Σ TL/(G·I_p)',
      hvorfor:'Vridningen lægger sig sammen led for led fra den faste ende til C — som <b>to bløde fjedre i serie</b>. Begge segmenter tæller med deres egen længde og I_p. Den smalle aksel BC bidrager klart mest (den er både længere OG tyndere → mindre I_p).',
      formel:'\\begin{gathered}I_{p,AB} = 6{,}136\\cdot 10^5 \\qquad I_{p,BC} = \\dfrac{\\pi}{32}\\cdot 40^4 = 2{,}513\\cdot 10^5 \\\\ \\varphi_C = \\dfrac{T\\,L_{AB}}{G\\,I_{p,AB}} + \\dfrac{T\\,L_{BC}}{G\\,I_{p,BC}}\\end{gathered}',
      resultat:'φ_C = 7,33·10⁻⁴ + 2,98·10⁻³ = <b>3,72·10⁻³ rad</b> (0,21°). BC dominerer.' },

    { del:'d · bøjning',
      hvad:'Bøjespænding i B₁: σ = M_B·(D/2)/I',
      hvorfor:'Vægten hænger <b>L_BC væk fra B</b> langs akslen, så bøjemomentet er "kraft gange denne arm" — som vægten af en person på et dykkerbræt. B₁ tages på den store aksel AB (Ø50) ved snit B.',
      formel:'\\begin{gathered}M_B = F\\cdot L_{BC} = 1200\\cdot 250 = 300\\,\\text{Nm} \\\\ I = \\dfrac{\\pi}{64}\\cdot 50^4 = 3{,}068\\cdot 10^5\\,\\text{mm}^4 \\\\ \\sigma_{B1} = \\dfrac{300000\\cdot 25}{3{,}068\\cdot 10^5}\\end{gathered}',
      resultat:'σ_B1 = <b>24,4 MPa</b> (bøjning). På den smalle BC-side ville σ = 47,7 MPa — se varianten.' },

    { del:'e · Von Mises',
      hvad:'Kombinér bøjning og torsion i Von Mises: σ_vM = √(σ² + 3τ²)',
      hvorfor:'B₁ er et punkt på akslens yderfiber ved B: her er bøjespændingen størst <b>og</b> torsionsforskydningen til stede. <span class="key">σ_vM = √(σ² + 3τ²)</span> samler dem til ét tal. <b>Faktoren 3 foran τ²</b> er grunden til, at forskydning vejer tungt — torsionen "løfter" den rene bøjespænding mærkbart op.',
      formel:'\\begin{gathered}\\sigma = 24{,}4\\,\\text{MPa} \\qquad \\tau = 9{,}78\\,\\text{MPa} \\\\ \\sigma_{vM} = \\sqrt{24{,}4^2 + 3\\cdot 9{,}78^2} = \\sqrt{596 + 287}\\end{gathered}',
      resultat:'σ_vM = <b>29,7 MPa</b>. Torsionen løftede 24,4 → 29,7 via faktor 3-leddet.' }
  ],
  selvcheck: [
    { status:'ok', tjek:'Enheder', note:'N·mm·mm/mm⁴ = MPa; rad dimensionsløs.' },
    { status:'ok', tjek:'T konstant, φ akkumuleres', note:'BC bidrager mest til φ (mindre I_p, længere).' },
    { status:'ok', tjek:'σ_vM > σ', note:'Torsionsbidraget løfter Von Mises over den rene bøjning.' },
    { status:'ok', tjek:'Størrelsesorden', note:'~30 MPa ≪ stålflyde — lav udnyttelse, kraftig aksel.' }
  ],
  variant:
    '<p>Hvis B₁ i stedet er på aksel BC (Ø40): hvad bliver σ, τ og σ_vM?</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>På Ø40: σ = 47,7 MPa, τ = 19,1 MPa, σ_vM = <b>58,1 MPa</b>. Den mindre diameter næsten <b>fordobler</b> spændingerne (σ ∝ 1/D³) — derfor er den smalle aksel det kritiske sted, og diameterspringet Ø50→Ø40 er også et sted med spændingskoncentration (lav en blød filet).</div></div>'
};
