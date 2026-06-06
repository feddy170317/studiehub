/* MEK2 Gennemgang — Opgave 8: Indspændt bjælke (superposition + integration).
   Kilde: Besvarelse_MEK2_S26/opg8.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg8'] = {
  titel: 'Indspændt bjælke',
  undertitel: 'Superposition og dobbelt integration',
  opgavetekst:
    '<p>2400 mm fast indspændt bjælke (A indspændt, C fri). UDL <b>w = 2 kN/m nedad</b> over hele længden; punktlast <b>P = wL opad</b> præcis midtspans (x = L/2). E = 210 GPa, I = 3,50·10⁶ mm⁴.</p>'+
    '<p class="dim">a) Brug superposition til (i) udbøjning i C og (ii) rotation i C. &nbsp; b) Vis hvordan kurven findes ved integration; angiv rand- og kontinuitetsbetingelser.</p>'+
    '<p><span style="color:var(--cyan)">Den sjove pointe:</span> da P = wL, er den samlede lodrette kraft OG det samlede moment om A nul → indspændingens reaktioner er nul. Men bjælken bøjer sig alligevel, fordi lasterne sidder forskellige steder. "Nul reaktioner" ≠ "ingen deformation".</p>',
  reference: [
    { navn:'UDL over hele L', formel:'\\delta_C = \\dfrac{wL^4}{8EI} \\qquad \\theta_C = \\dfrac{wL^3}{6EI}', nb:'Tabeltilfælde, udkraget bjælke.', kilde:'Hibbeler · Appendiks C (bjælketabeller: udkraget + UDL)' },
    { navn:'Punktlast i a fra indsp.', formel:'\\delta_C = \\dfrac{Pa^2}{6EI}(3L-a) \\qquad \\theta_C = \\dfrac{Pa^2}{2EI}', nb:'Fri ende i L.', kilde:'Hibbeler · Appendiks C (udkraget + punktlast)' },
    { navn:'Elastisk kurve', formel:'EI\\,v\'\' = M(x)', nb:'Integreres med rand- og kontinuitetsbetingelser.', kilde:'Hibbeler · lign. 9-10 (elastisk kurve, kap. 9)' }
  ],
  steps: [
    { del:'a · superposition',
      hvad:'Beregn P = wL og slå de to tabeltilfælde op',
      hvorfor:'UDL og en punktlast ved a = L/2 er begge <b>standardtilfælde</b> for en udkraget bjælke — tabellerne giver δ_C og θ_C direkte, så vi slipper for at integrere. Bemærk den selvbalancerende last: da P = wL, er reaktionerne i A nul, men bjælken bøjer sig stadig.',
      formel:'\\begin{gathered}P = wL = 2\\cdot 2{,}4 = 4{,}8\\,\\text{kN} \\\\ EI = 210000\\cdot 3{,}50\\cdot 10^6 = 7{,}35\\cdot 10^{11}\\,\\text{Nmm}^2 \\quad a = 1200\\,\\text{mm}\\end{gathered}',
      figur:'<svg viewBox="0 0 360 180" width="360" height="180" role="img" aria-label="Udkraget bjaelke to laster"><rect x="34" y="55" width="10" height="60" fill="#1a3a55" stroke="#5ec8ff" stroke-width="2"/><line x1="34" y1="115" x2="48" y2="128" stroke="#7e9ab0" stroke-width="1.5"/><line x1="34" y1="100" x2="48" y2="113" stroke="#7e9ab0" stroke-width="1.5"/><line x1="34" y1="85" x2="48" y2="98" stroke="#7e9ab0" stroke-width="1.5"/><line x1="44" y1="85" x2="320" y2="85" stroke="#5ec8ff" stroke-width="4"/><text x="40" y="74" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">A</text><text x="316" y="74" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">C</text><g stroke="#ff6b6b" stroke-width="1.6"><line x1="60" y1="58" x2="60" y2="81"/><line x1="95" y1="58" x2="95" y2="81"/><line x1="130" y1="58" x2="130" y2="81"/><line x1="165" y1="58" x2="165" y2="81"/><line x1="200" y1="58" x2="200" y2="81"/><line x1="235" y1="58" x2="235" y2="81"/><line x1="270" y1="58" x2="270" y2="81"/><line x1="305" y1="58" x2="305" y2="81"/></g><line x1="60" y1="58" x2="305" y2="58" stroke="#ff6b6b" stroke-width="1.6"/><text x="150" y="52" font-family="Nunito,sans-serif" font-size="9" fill="#ff9b9b">UDL w (ned)</text><line x1="182" y1="87" x2="182" y2="112" stroke="#5fd17a" stroke-width="3"/><polygon points="182,116 176,102 188,102" fill="#5fd17a"/><text x="158" y="130" font-family="Nunito,sans-serif" font-size="9" fill="#5fd17a">P=wL (op), midt</text></svg>',
      figcap:'UDL trykker ned over hele bjælken; punktlasten P = wL løfter op på midten. Reaktionerne i A bliver nul.',
      resultat:'P = <b>4,8 kN</b>. Begge tabeltilfælde slås op med a = L/2.' },

    { del:'a · superposition',
      hvad:'Superponér med fortegn: UDL ned (−), P op (+)',
      hvorfor:'Læg de to bidrag sammen med korrekt fortegn. Resultatet er <b>lille</b>, fordi lasterne næsten ophæver hinanden — men <b>ikke helt</b>: UDL\'ens "tyngdepunkt" ligger tættere på den frie ende end punktlasten, så UDL\'en vinder en smule, og C ender med at hænge ned.',
      formel:'\\begin{gathered}\\delta_{C,w} = -\\dfrac{wL^4}{8EI} = -11{,}28\\,\\text{mm} \\\\ \\delta_{C,P} = +\\dfrac{Pa^2}{6EI}(3L-a) = +9{,}40\\,\\text{mm} \\\\ \\delta_C = \\delta_{C,w} + \\delta_{C,P}\\end{gathered}',
      resultat:'δ_C = −11,28 + 9,40 = <b>−1,88 mm</b> (ned), θ_C = <b>−1,57·10⁻³ rad</b>.' },

    { del:'b · integration',
      hvad:'Opstil M(x) i to segmenter og integrér',
      hvorfor:'Punktlasten <b>"knækker" momentkurven</b> ved x = L/2, så vi deler bjælken i to dele. Hver del integreres for sig og giver 2 konstanter → <b>4 i alt</b>. (Reaktionerne er nul, så M kommer kun fra lasterne selv.)',
      formel:'\\begin{gathered}0 \\le x \\le L/2:\\ EI\\,v_1\'\' = -\\dfrac{wx^2}{2} \\\\ L/2 \\le x \\le L:\\ EI\\,v_2\'\' = -\\dfrac{wx^2}{2} + P\\left(x - \\tfrac{L}{2}\\right)\\end{gathered}',
      resultat:'To momentudtryk M₁, M₂ → fire integrationskonstanter C₁…C₄.' },

    { del:'b · betingelser',
      hvad:'Find de 4 konstanter af 2 rand- + 2 kontinuitetsbetingelser',
      hvorfor:'Indspændingen <b>låser bjælken i A</b>: den kan hverken flytte sig eller dreje → <span class="key">v(0) = 0 og v′(0) = 0</span> (to randbetingelser). Ved x = L/2 skal bjælken hænge sammen: <span class="key">v og v′ må ikke "springe"</span> → to kontinuitetsbetingelser. Det giver netop fire ligninger til de fire konstanter.',
      formel:'\\begin{gathered}v_1(0) = 0,\\ v_1\'(0) = 0 \\quad (\\text{indsp.}) \\\\ v_1(\\tfrac{L}{2}) = v_2(\\tfrac{L}{2}),\\ v_1\'(\\tfrac{L}{2}) = v_2\'(\\tfrac{L}{2}) \\quad (\\text{kont.})\\end{gathered}',
      resultat:'Ved x = L: v(L) = <b>−1,88 mm</b>, v′(L) = −1,57·10⁻³ rad — i fuld overensstemmelse med superpositionen (kontrol).' }
  ],
  selvcheck: [
    { status:'ok', tjek:'To metoder enige', note:'Superposition og integration: δ_C = −1,88 mm, θ_C = −1,57·10⁻³.' },
    { status:'ok', tjek:'Reaktioner', note:'R_A = wL − P = 0, M_A = 0 (selvbalancerende last) — men deformation ≠ 0!' },
    { status:'ok', tjek:'M(L) = 0, V(L) = 0', note:'Fri ende.' },
    { status:'ok', tjek:'Fortegn', note:'Nettoresultat nedad, da UDL\'ens arm mod C er større end punktlastens.' }
  ],
  variant:
    '<p>Flyt punktlasten til den frie ende (a = L, stadig P = wL opad). Beregn δ_C, θ_C.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit</span></div>'+
    '<div class="res"><span class="navn">Facit</span>Punktlast i a = L: δ_C,P = +PL³/(3EI) = +4800·2400³/(3·7,35·10¹¹) = +<b>12,03 mm</b> (op). Med UDL −11,28 mm: δ_C = +12,03 − 11,28 = <b>+0,75 mm</b> (nu OPAD). θ_C,P = +PL²/(2EI) = +7,53·10⁻³; sum θ_C = +1,26·10⁻³ rad. Pointen: med P helt ude løfter den mere effektivt end UDL\'en trykker, så C går opad.</div></div>'
};
