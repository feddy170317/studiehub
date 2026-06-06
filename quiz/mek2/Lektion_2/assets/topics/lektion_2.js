/* MEK2 Lektion 2 — Quiz data */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['L2_aksial_belastning'] = {
  intro: 'Aksial belastning (GG 2.1–2.6): Længdeændringer, multi-segment systemer, statisk ubestemte stænger, og spænding på skrå snit.',
  mc: [
    /* LET (3 stk) */
    { level: 'let', q: 'Hvad er enheden for stivhed k?', options: ['Pa', 'N/m', 'mm', 'MPa'], correct: 1, why: 'Stivhed = kraft/forlængelse = N/m' },
    { level: 'let', q: 'I formlen δ = (L/EA)P, hvad betyder A?', options: ['Acceleration', 'Tværsnitsareal', 'Afstand', 'Amplitud'], correct: 1, why: 'A = tværsnitsareal. Større område → mindre forlængelse.' },
    { level: 'let', q: 'En prismatisk stang betyder …', options: ['Konisk form', 'Konstant tværsnit hele vejen', 'Variable egenskaber', 'Fladt tværsnit'], correct: 1, why: 'Prismatisk = uniform tværsnit (samme A fra ende til ende).' },

    /* MIDDEL (5 stk) */
    { level: 'middel', q: 'Multi-segment forlængelse: δ = Σ(Li/EiAi)Ni bruges til …', options: ['At finde maksimal kraft', 'At beregne samlet forlængelse fra multiple segmenter', 'At finde arbejde', 'At beregne kritisk vrid'], correct: 1, why: 'Multi-segment forlængelse = sum af hver segments forlængelse.' },
    { level: 'middel', q: 'Hvad betyder "statisk ubestemt" struktur?', options: ['Flere ligevægtsligninger end kræfter', 'Flere ukendte kræfter end ligevægtsligninger', 'Ingen løsning', 'Strukturen er brudt'], correct: 1, why: 'Statisk ubestemt: # ukendte > # ligevægte. Kræver kompatibilitet for løsning.' },
    { level: 'middel', q: 'I en statisk ubestemt stang fastgjort i begge ender, hvad skal bruges?', options: ['Arbejds-princip', 'Kompatibilitetsligning: δ_total = 0', 'Maksimum-princip', 'Euler-formlen'], correct: 1, why: 'Kompatibilitet: endeflytning = 0 da både ender er faste.' },
    { level: 'middel', q: 'For skrå snit ved θ = 45° under aksialt stress σx, hvad er τ?', options: ['σx', 'σx/2', '0', '-σx/2'], correct: 3, why: 'τmax = σx/2 ved θ=45° (maksimal shear stress).' },
    { level: 'middel', q: 'Hvad er fleksibilitet f?', options: ['f = k²', 'f = 1/k', 'f = 2k', 'f = k + 1'], correct: 1, why: 'Fleksibilitet er det reciprokale af stivhed: f = 1/k = L/(EA).' },

    /* SVÆR (4 stk) */
    { level: 'svaer', q: 'En tre-segment stang: hvilken L/A-ratio får maksimal forlængelse?', options: ['Længste og mindste område', 'Korteste og største område', 'Det afhænger kun af kraft', 'Alle segmenter har samme'], correct: 0, why: 'δ = (L/EA)P → maksimal når L stor og A lille.' },
    { level: 'svaer', q: 'Statisk ubestemt: stang med last P mellem A og B (længder a, b). Find RA?', options: ['RA = P', 'RA = b·P/(a+b)', 'RA = a·P/(a+b)', 'RA = P/2'], correct: 1, why: 'Længere arm fra center → mindre reaktion. RA = b·P/(a+b).' },
    { level: 'svaer', q: 'Stang under σx: snit ved θ=60°. Hvad er σθ?', options: ['σx·cos(60°) = 50%σx', 'σx·cos²(60°) = 25%σx', 'σx·sin(60°) = 86.6%σx', 'σx (konstant)'], correct: 1, why: 'σθ = σx·cos²θ = σx·(1/2)² = 25%σx ved θ=60°.' },
    { level: 'svaer', q: 'Stang 1: A=100mm², L=500mm, E=70GPa. Stang 2: A=200mm², L=250mm. Forlængelsesforhold δ1/δ2?', options: ['1/2', '2', '4', '1/4'], correct: 2, why: 'δ1/δ2 = (500·200)/(250·100) = 4. Længde vægtes stærkt.' }
  ]
};
