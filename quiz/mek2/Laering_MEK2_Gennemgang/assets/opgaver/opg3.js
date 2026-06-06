/* MEK2 Gennemgang — Opgave 3: Tryktank med spiralsøm og torsion.
   Kilde: Besvarelse_MEK2_S26/opg3.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg3'] = {
  titel: 'Tryktank med spiralsøm',
  undertitel: 'Trykbeholder + torsion + søm-transformation',
  opgavetekst:
    '<p>Tyndvægget aluminiumstank, svejset langs en spiralsøm med vinkel <b>β = 60°</b> til aksen. E = 70 GPa, ν = 0,3. Indre overtryk <b>p = 2 MPa</b>, torsionsmoment <b>T = 20 kNm</b>. Ydre Ø = <b>500 mm</b>, indre = <b>496 mm</b>.</p>'+
    '<p class="dim">a) Spændingstilstand i punkt B. &nbsp; b) Von Mises i B. &nbsp; c) Mohrs cirkel: hovedspændinger + max forskydning (i-plan og ude-af-plan). &nbsp; d) Spændinger vinkelret på/langs sømmen.</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> trykket giver to træk (ring + længde), torsionen lægger en ren forskydning oveni — og pas på 3D-fælden: den absolut største forskydning gemmer sig "ud af planet".</p>',
  reference: [
    { navn:'Vægtykkelse & tyndvæg', formel:'t = \\dfrac{D-d}{2} \\qquad r/t > 10', nb:'Her r/t = 124 — rigeligt tyndvægget.', kilde:'Hibbeler · kap. 8 (tyndvægget trykbeholder)' },
    { navn:'Ringspænding (hoop)', formel:'\\sigma_h = \\dfrac{p\\,r}{t}', nb:'Tangentiel; dobbelt af længdespændingen.', kilde:'Hibbeler · lign. 8-1 (ringspænding, kap. 8)' },
    { navn:'Længdespænding', formel:'\\sigma_l = \\dfrac{p\\,r}{2t}', nb:'Aksial; halvdelen af hoop.', kilde:'Hibbeler · lign. 8-2 (længdespænding, kap. 8)' },
    { navn:'Torsionsforskydning', formel:'\\tau = \\dfrac{T\\,(D/2)}{I_p} \\qquad I_p = \\dfrac{\\pi}{32}(D^4-d^4)', nb:'Lægges oven på trykspændingerne.', kilde:'Hibbeler · lign. 3-13 (torsion, kap. 3)' },
    { navn:'Von Mises', formel:'\\sigma_{vM} = \\sqrt{\\sigma_1^2 - \\sigma_1\\sigma_2 + \\sigma_2^2}', nb:'Koger tilstanden ned til ét tal mod flydegrænsen.', kilde:'Hibbeler · lign. 7-12 (Von Mises); hovedspændinger lign. 7-17' }
  ],
  steps: [
    { del:'a · spændingstilstand',
      hvad:'Tjek tyndvæg og beregn ring- og længdespænding',
      hvorfor:'En trykbeholder presses udad af trykket → det skaber to slags træk i pladen: en <span class="key">ringspænding (hoop)</span>, der prøver at sprænge dåsen <b>på langs</b>, og en <span class="key">længdespænding</span>, der trækker enderne af. Ringspændingen er præcis <b>dobbelt</b> så stor — derfor revner en pølse i kogende vand altid på langs. Formlerne gælder kun, når væggen er tynd (r/t > 10); her er r/t = 124, rigeligt.',
      formel:'\\begin{gathered}t = \\dfrac{500-496}{2} = 2\\,\\text{mm} \\quad r = 248\\,\\text{mm} \\Rightarrow r/t = 124 \\\\ \\sigma_h = \\dfrac{p\\,r}{t} = \\dfrac{2\\cdot 248}{2} \\\\ \\sigma_l = \\dfrac{p\\,r}{2t} = \\dfrac{2\\cdot 248}{4}\\end{gathered}',
      figur:'<svg viewBox="0 0 320 190" width="320" height="190" role="img" aria-label="Trykbeholder ring- og laengdespaending"><rect x="80" y="65" width="150" height="60" fill="rgba(94,200,255,0.07)" stroke="#5ec8ff" stroke-width="2.5"/><ellipse cx="80" cy="95" rx="20" ry="30" fill="rgba(94,200,255,0.1)" stroke="#5ec8ff" stroke-width="2.5"/><ellipse cx="230" cy="95" rx="20" ry="30" fill="#0b1a29" stroke="#5ec8ff" stroke-width="2.5"/><line x1="150" y1="65" x2="150" y2="40" stroke="#ff6b6b" stroke-width="2.5"/><polygon points="150,33 144,47 156,47" fill="#ff6b6b"/><line x1="150" y1="125" x2="150" y2="150" stroke="#ff6b6b" stroke-width="2.5"/><polygon points="150,157 144,143 156,143" fill="#ff6b6b"/><text x="160" y="36" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ff9b9b">σ_h = pr/t</text><line x1="230" y1="95" x2="278" y2="95" stroke="#ffd24a" stroke-width="2.5"/><polygon points="285,95 271,89 271,101" fill="#ffd24a"/><text x="232" y="150" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#ffd24a">σ_l = pr/2t</text><text x="150" y="20" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#9bd4ff">σ_h : σ_l = 2 : 1</text></svg>',
      figcap:'Ringspændingen (hoop) er dobbelt så stor som længdespændingen — derfor revner trykbeholdere på langs.',
      resultat:'σ_h = <b>248 MPa</b> (hoop), σ_l = <b>124 MPa</b> (axial) — præcis 2:1.' },

    { del:'a · spændingstilstand',
      hvad:'Læg torsionen oven på: opstil (σ_x, σ_y, τ_xy)',
      hvorfor:'Lad <b>x = akseretning</b> og <b>y = hoopretning</b>. Trykket giver de to normalspændinger (σ_x = σ_l, σ_y = σ_h); torsionen giver forskydningen τ. Tilsammen er det <b>én plan spændingstilstand</b>, vi kan transformere med Mohr. Vi <span class="key">superponerer</span>: hver effekt regnes for sig og lægges sammen.',
      formel:'\\begin{gathered}I_p = \\dfrac{\\pi}{32}(500^4-496^4) = 1{,}940\\cdot 10^8\\,\\text{mm}^4 \\\\ \\tau = \\dfrac{T\\,(D/2)}{I_p} = \\dfrac{20\\cdot 10^6\\cdot 250}{1{,}940\\cdot 10^8}\\end{gathered}',
      resultat:'(σ_x, σ_y, τ_xy) = (<b>124</b>, <b>248</b>, <b>25,8</b>) MPa.' },

    { del:'b · Von Mises',
      hvad:'Hovedspændinger og Von Mises-spænding',
      hvorfor:'Mohr giver σ₁, σ₂. <span class="key">Von Mises</span> "koger" hele tilstanden ned til ét tal, som vi kan holde op mod aluminiums flydegrænse — den korrelerer godt med, hvornår duktile metaller faktisk flyder.',
      formel:'\\begin{gathered}\\bar\\sigma = 186{,}0 \\qquad R = \\sqrt{(-62)^2 + 25{,}8^2} = 67{,}1 \\\\ \\sigma_1 = 253{,}1 \\qquad \\sigma_2 = 118{,}9 \\\\ \\sigma_{vM} = \\sqrt{\\sigma_1^2 - \\sigma_1\\sigma_2 + \\sigma_2^2}\\end{gathered}',
      resultat:'σ₁ = <b>253,1 MPa</b>, σ₂ = <b>118,9 MPa</b> (begge træk). σ_vM = <b>219,4 MPa</b> — tæt på Al-flydegrænsen (~240–270).' },

    { del:'c · Mohr (3D)',
      hvad:'Ude-af-plan forskydning: tag σ₃ = 0 med',
      hvorfor:'<b>3D-fælden:</b> punkt B ligger på ydersiden, hvor der intet tryk er udefra → den tredje spænding er <b>σ₃ = 0</b>. Selvom forskydningen <i>inde i pladens plan</i> ser moderat ud (67), gemmer den <b>absolut</b> største forskydning sig "ud af planet" — mellem den største spænding og nul. Tegner man <b>tre Mohr-cirkler</b> (σ₁–σ₂, σ₁–σ₃, σ₂–σ₃), er det den store (σ₁ til 0), der styrer.',
      formel:'\\begin{gathered}\\tau_{\\max,\\text{i-plan}} = R = 67{,}1\\,\\text{MPa} \\\\ \\tau_{\\max,\\text{abs}} = \\dfrac{\\sigma_1 - \\sigma_3}{2} = \\dfrac{253{,}1 - 0}{2}\\end{gathered}',
      figur:'<svg viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="Tre Mohr-cirkler"><line x1="20" y1="150" x2="305" y2="150" stroke="#cfe3f5" stroke-width="1.5"/><text x="300" y="166" font-family="Nunito,sans-serif" font-size="10" fill="#cfe3f5">σ</text><line x1="40" y1="200" x2="40" y2="30" stroke="#cfe3f5" stroke-width="1.5"/><text x="30" y="38" font-family="Nunito,sans-serif" font-size="10" fill="#cfe3f5">τ</text><circle cx="153.9" cy="150" r="113.9" fill="none" stroke="#ff6b6b" stroke-width="2.5"/><circle cx="207.4" cy="150" r="60.4" fill="none" stroke="#5ec8ff" stroke-width="2"/><circle cx="93.5" cy="150" r="53.5" fill="none" stroke="#7e9ab0" stroke-width="1.6"/><circle cx="267.8" cy="150" r="4" fill="#9bd4ff"/><text x="252" y="142" font-family="Nunito,sans-serif" font-weight="700" font-size="10" fill="#9bd4ff">σ₁=253</text><circle cx="147" cy="150" r="4" fill="#9bd4ff"/><text x="128" y="168" font-family="Nunito,sans-serif" font-size="10" fill="#9bd4ff">σ₂=119</text><circle cx="40" cy="150" r="4" fill="#9bd4ff"/><text x="20" y="142" font-family="Nunito,sans-serif" font-size="10" fill="#9bd4ff">σ₃=0</text><line x1="153.9" y1="150" x2="153.9" y2="36" stroke="#ff9b9b" stroke-width="1.4" stroke-dasharray="4 3"/><text x="160" y="50" font-family="Nunito,sans-serif" font-weight="700" font-size="10" fill="#ff9b9b">τ_abs=127</text></svg>',
      figcap:'Tre cirkler: den store (rød, σ₁→σ₃=0) giver den absolut største forskydning — ikke den lille i-plan-cirkel (blå).',
      resultat:'τ_max,abs = <b>126,6 MPa</b> (ude-af-plan) ≫ τ_i-plan = 67,1 MPa. Den røde cirkel styrer.' },

    { del:'d · sømmen',
      hvad:'Spændinger vinkelret på og langs sømmen',
      hvorfor:'Sømmen er en <b>svaghedslinje</b> (en lang "ar"). Vi vil vide, hvor hårdt den trækkes fra hinanden (σ_w, vinkelret på) og skubbes langs (τ_w). Det fås ved at <span class="key">sætte sømvinklen ind i transformationsligningerne</span> — drej tilstanden (σ_x, σ_y, τ_xy) til akser, hvor den ene står vinkelret på sømmen (θ = β = 60°). De to tal sammenlignes med svejsningens tilladelige træk- og forskydningsspænding.',
      formel:'\\begin{gathered}\\sigma_w = \\bar\\sigma + \\tfrac{\\sigma_x-\\sigma_y}{2}\\cos 2\\theta + \\tau_{xy}\\sin 2\\theta \\\\ \\tau_w = -\\tfrac{\\sigma_x-\\sigma_y}{2}\\sin 2\\theta + \\tau_{xy}\\cos 2\\theta \\quad (\\theta = 60^\\circ)\\end{gathered}',
      resultat:'Metoden: opstil (σ_x,σ_y,τ_xy) → indsæt θ = 60° → σ_w er trækket der flænser svejsningen, τ_w skubber langs den.' }
  ],
  selvcheck: [
    { status:'ok', tjek:'σ_h = 2·σ_l', note:'248 = 2·124 — klassisk for en cylinder.' },
    { status:'ok', tjek:'Invariant', note:'σ₁ + σ₂ = 372 = σ_x + σ_y — summen er bevaret under transformation.' },
    { status:'ok', tjek:'τ_abs > τ_i-plan', note:'127 > 67: ude-af-plan styrer, fordi σ₃ = 0. En klassisk begynderfejl er kun at se i-planet.' },
    { status:'ok', tjek:'Von Mises rimelig', note:'219 MPa — under, men tæt på, typisk Al-flydegrænse (240–270).' }
  ],
  variant:
    '<p>Samme tank uden torsion (T = 0). Vis at tilstanden bliver ren toakset uden forskydning.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>Uden torsion: (σ_x, σ_y, τ) = (124, 248, 0). Da τ = 0 er akse- og hoopretning SELV hovedretningerne → σ₁ = 248, σ₂ = 124. τ_i-plan = (248−124)/2 = <b>62 MPa</b>. (Men ude-af-plan er stadig σ₁/2 = 124 MPa — σ₃ = 0 tæller fortsat.)</div></div>'
};
