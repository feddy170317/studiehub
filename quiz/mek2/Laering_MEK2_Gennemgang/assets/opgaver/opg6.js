/* MEK2 Gennemgang — Opgave 6: Overhængsbjælke (udbøjning ved superposition).
   Kilde: Besvarelse_MEK2_S26/opg6.tex. Fokus: HVORFOR. */
window.WALK_OPGAVER = window.WALK_OPGAVER || {};
window.WALK_OPGAVER['opg6'] = {
  titel: 'Overhængsbjælke',
  undertitel: 'Reaktioner, integration og superposition',
  opgavetekst:
    '<p>Simpelt understøttet bjælke AE (2400 mm). Led i A (x = 0), rulle i B (x = 1600); E (x = 2400) er frit overhæng. Laster: UDL <b>q = 2 kN/m</b> mellem A og B; <b>3 kNm</b> mod-uret moment i C (x = 800); punktlast <b>4 kN opad</b> i D (x = 1200). E = 210 GPa, I = 3,50·10⁶ mm⁴.</p>'+
    '<p class="dim">a) Udbøjning i C. &nbsp; b) Udbøjning i E. &nbsp; c) Deformationskurver (moment alene / punktlast alene / samlet). &nbsp; d) Reaktioner hvis A bliver fast indspænding.</p>'+
    '<p><span style="color:var(--cyan)">Idéen:</span> en vippe med et udhæng. Det ubelastede overhæng B–E er snorlige og vipper bare om B — så v_E = θ_B·L_BE. Det sparer en masse regnearbejde.</p>',
  reference: [
    { navn:'Elastisk kurve', formel:'EI\\,v\'\' = M(x)', nb:'Integreres to gange til v′ og v.', kilde:'Hibbeler · lign. 9-10 (elastisk kurve, kap. 9)' },
    { navn:'Superposition', formel:'v = \\sum v_i', nb:'Udbøjninger fra hver last lægges sammen (lineær teori).', kilde:'Hibbeler · kap. 9 + Appendiks C (bjælketabeller)' },
    { navn:'Ubelastet overhæng', formel:'v_E = v_B + \\theta_B\\,L_{BE}', nb:'Snorlige overhæng = ret linje fra støtten.', kilde:'Hibbeler · kap. 9 (geometri af overhæng)' },
    { navn:'Statisk ubestemt', formel:'v_B = 0 \\;\\;(\\text{kompatibilitet})', nb:'Ekstra geometrisk ligning når ligevægt ikke rækker.', kilde:'Hibbeler · kap. 9 (statisk ubestemte bjælker, kraftmetoden)' }
  ],
  steps: [
    { del:'a–b · reaktioner',
      hvad:'Find reaktionerne R_A og R_B af ligevægt',
      hvorfor:'Bjælken er <b>statisk bestemt</b> (led + rulle = 2 reaktioner), så ren ligevægt er nok: ΣF_y = 0 og ΣM_A = 0. Vær omhyggelig med <b>fortegn</b>: punktlasten peger opad, og momentet er mod-uret. Et <span class="key">negativt R_B</span> betyder, at rullen faktisk trækker nedad — den opadrettede last og momentet vipper bjælken, så B må holde igen.',
      formel:'\\begin{gathered}\\sum M_A:\\ R_B\\cdot 1600 - 3200\\cdot 800 + 3{,}0\\cdot 10^6 + 4000\\cdot 1200 = 0 \\\\ \\sum F_y:\\ R_A + R_B - 3200 + 4000 = 0\\end{gathered}',
      figur:'<svg viewBox="0 0 360 180" width="360" height="180" role="img" aria-label="Overhaengsbjaelke"><line x1="40" y1="90" x2="320" y2="90" stroke="#5ec8ff" stroke-width="4"/><polygon points="40,90 32,108 48,108" fill="none" stroke="#9bd4ff" stroke-width="2"/><polygon points="227,90 219,106 235,106" fill="none" stroke="#9bd4ff" stroke-width="2"/><circle cx="227" cy="112" r="3" fill="none" stroke="#9bd4ff" stroke-width="1.5"/><text x="38" y="128" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">A</text><text x="130" y="128" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">C</text><text x="176" y="128" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">D</text><text x="222" y="132" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">B</text><text x="316" y="108" font-family="Anton,sans-serif" font-size="11" fill="#cfe3f5">E</text><g stroke="#ff6b6b" stroke-width="1.6"><line x1="55" y1="66" x2="55" y2="86"/><line x1="85" y1="66" x2="85" y2="86"/><line x1="115" y1="66" x2="115" y2="86"/><line x1="145" y1="66" x2="145" y2="86"/><line x1="175" y1="66" x2="175" y2="86"/><line x1="205" y1="66" x2="205" y2="86"/></g><line x1="55" y1="66" x2="205" y2="66" stroke="#ff6b6b" stroke-width="1.6"/><text x="95" y="60" font-family="Nunito,sans-serif" font-size="9" fill="#ff9b9b">UDL q</text><line x1="180" y1="92" x2="180" y2="68" stroke="#5fd17a" stroke-width="2.5"/><polygon points="180,62 174,76 186,76" fill="#5fd17a"/><text x="186" y="70" font-family="Nunito,sans-serif" font-size="9" fill="#5fd17a">P↑</text><path d="M122 78 a10 10 0 1 1 16 6" fill="none" stroke="#ffd24a" stroke-width="2"/><text x="120" y="64" font-family="Nunito,sans-serif" font-size="9" fill="#ffd24a">M₀</text></svg>',
      figcap:'Bjælken AE: led i A, rulle i B, frit overhæng B–E. UDL (rød), opadrettet punktlast P i D (grøn), moment M₀ i C (gul).',
      resultat:'R_B = <b>−3275 N</b> (B trækker nedad!), R_A = <b>+2475 N</b>.' },

    { del:'a–b · udbøjning',
      hvad:'Integrér EI·v″ = M(x) og find v_C og v_E',
      hvorfor:'Den systematiske metode (Macaulay) tager alle laster på én gang. De <b>to integrationskonstanter</b> findes af, at bjælken <b>ikke kan flytte sig ved de to støtter</b>: v(0) = 0 og v(1600) = 0. C aflæses direkte af kurven. For E bruger vi <span class="key">overhæng-tricket</span>: B–E er ubelastet → snorlige → v_E = θ_B·L_BE.',
      formel:'\\begin{gathered}EI = 210000\\cdot 3{,}50\\cdot 10^6 = 7{,}35\\cdot 10^{11}\\,\\text{Nmm}^2 \\\\ v_C = v(800) \\qquad \\theta_B = v\'(1600) \\qquad v_E = \\theta_B\\cdot 800\\end{gathered}',
      resultat:'v_C = <b>+0,087 mm</b> (op), v_E = θ_B·800 = <b>−0,456 mm</b> (ned). Begge små — bjælken er stiv.' },

    { del:'c · superposition',
      hvad:'Deformationskurver: hvert lasttilfælde for sig',
      hvorfor:'<span class="key">Superposition</span> gjort visuelt: momentet bøjer bjælken den ene vej, den opadrettede punktlast den anden. Den samlede kurve er den <b>punktvise sum</b> af de to. Det er den lette måde at forstå en sammensat last på — og hvad censor vil se dig forklare.',
      formel:'v_{\\text{total}}(x) = v_M(x) + v_P(x)',
      resultat:'(i) momentet vrider om C/D, (ii) punktlasten slynger overhænget ned, (iii) summen: lille opbuling om C, nedadgående mod E.' },

    { del:'d · statisk ubestemt',
      hvad:'Hvis A bliver fast indspænding: brug kompatibilitet',
      hvorfor:'En indspænding tilføjer et reaktionsmoment M_A. Nu er der <b>3 ubekendte</b> (R_Ay, M_A, R_B) men kun <b>2 ligevægtsligninger</b> → bjælken er 1× <span class="key">statisk ubestemt</span>. Vi mangler én ligning og <b>henter den fra geometrien</b>: B kan ikke flytte sig (v_B = 0). Det er kraftmetoden — vi "låner" en ligning fra kompatibilitet, fordi ligevægt alene ikke længere rækker.',
      formel:'\\begin{gathered}\\delta_{B,0} + R_B\\,\\delta_{BB} = 0 \\\\ \\Rightarrow R_B = -\\dfrac{\\delta_{B,0}}{\\delta_{BB}}\\end{gathered}',
      resultat:'Metoden: vælg R_B som redundant → find udbøjning i B fra (1) ydre laster og (2) en enheds-R_B → sæt v_B = 0 → løs.' }
  ],
  selvcheck: [
    { status:'ok', tjek:'ΣM_B = 0', note:'Reaktioner verificeret uafhængigt.' },
    { status:'ok', tjek:'v_B = 0', note:'Randbetingelsen er opfyldt af kurven.' },
    { status:'ok', tjek:'M(E) = 0, V(E) = 0', note:'Frit overhæng-endepunkt.' },
    { status:'ok', tjek:'v_E to metoder', note:'Integration og θ_B·L_BE giver begge −0,456 mm.' }
  ],
  variant:
    '<p>Vend punktlasten i D nedad (P = 4 kN ned) og fjern momentet i C. Genberegn reaktioner og v_C.</p>'+
    '<div class="reveal" data-r tabindex="0" role="button"><div class="cover"><span class="q">?</span><span>Klik for facit (kvalitativt)</span></div>'+
    '<div class="res"><span class="navn">Facit</span>Nu trækker ALLE laster nedad. ΣM_A: R_B·1600 − 3200·800 − 4000·1200 = 0 → R_B = +4600 N (positiv — B trykker op, intuitivt). R_A = 3200 + 4000 − 4600 = +2600 N. v_C bliver nu <b>negativ</b> (nedad), fordi ingen opadrettet last løfter den. Et meget mere intuitivt fortegnsbillede end originalen.</div></div>'
};
