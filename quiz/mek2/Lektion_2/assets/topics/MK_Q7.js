/* MEK2 Quiz — Emne K3: Søjleknækning (Euler). Kilde: Besvarelse_MEK2_S26 (opg9).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q7'] = {
  intro: 'En slank søjle under tryk svigter ikke ved at flyde, men ved at <b>knække</b> (bukle) til siden. Den kritiske last er <b>P_cr = π²EI/(KL)²</b>, hvor KL er den effektive længde. Knækning sker om den akse, der giver den laveste P_cr — ofte den med mindst inertimoment, men understøtningen (K) tæller med.',
  analogi: '⚒ Tip: en lang, tynd lineal knækker let; en kort, tyk gør ikke. Det handler om slankheden λ = KL/r — jo slankere, jo lavere knæk-last. Og en fri top (mast) er meget værre end fastholdte ender: K = 2 mod K = 1.',
  examQs: [
    'Find A, I og gyrationsradius r = √(I/A) om begge akser.',
    'Tildel K efter understøtning og beregn P_cr = π²EI/(KL)² for begge akser.',
    'Sammenlign med flydning P_y = σ_y·A; den mindste styrer, divider med n.'
  ],
  svgCap: 'Effektiv længde KL afhænger af understøtningen: ledret-ledret K = 1,0; indspændt-fri (mast) K = 2,0; indspændt-ledret K = 0,7; indspændt-indspændt K = 0,5. Lavere K = højere knæk-last.',
  svg: buckSVG(),
  mc: [
    { level:'let', q:'Hvad er Eulers formel for den kritiske knæk-last?',
      options:['P_cr = EI/(KL)','P_cr = π²EI/(KL)²','P_cr = σ_y·A','P_cr = π²E/(KL)'],
      correct:1,
      why:'P_cr = π²EI/(KL)². Den vokser med bøjestivheden EI og falder kraftigt med den effektive længde KL (kvadreret).' },
    { level:'let', q:'Hvad er K-faktoren for en ledret-ledret (pinned-pinned) søjle?',
      options:['0,5','0,7','1,0','2,0'],
      correct:2,
      why:'Ledret-ledret er referencetilfældet med K = 1,0 → effektiv længde = den fysiske længde L.' },
    { level:'let', q:'Hvordan defineres slankheden λ?',
      options:['λ = KL · r','λ = KL / r','λ = r / KL','λ = I / A'],
      correct:1,
      why:'Slankhedstallet λ = KL/r, hvor r er gyrationsradius. Stor slankhed = let at knække (lav kritisk spænding).' },
    { level:'let', q:'Hvad er gyrationsradius r?',
      options:['r = I·A','r = √(I/A)','r = I/A','r = A/I'],
      correct:1,
      why:'r = √(I/A). Den fortæller, hvor langt tværsnittets areal "effektivt" sidder fra aksen — jo større r, jo sværere at knække om den akse.' },
    { level:'middel', q:'Hvad er K-faktoren for en indspændt-fri søjle (fast i bunden, fri top — fx en mast)?',
      options:['0,5','1,0','2,0','0,7'],
      correct:2,
      why:'Indspændt-fri har K = 2,0 → effektiv længde 2L. Det er det "blødeste" tilfælde og giver lavest knæk-last. Derfor er frie master udsatte.' },
    { level:'middel', q:'Om hvilken akse knækker en søjle?',
      options:['Om den akse med størst I','Om den akse, der giver den LAVESTE P_cr (mindst styrende)','Altid om den lodrette akse','Om begge samtidig'],
      correct:1,
      why:'Søjlen knækker om den "svageste" akse — den med lavest P_cr. Det er typisk aksen med mindst I, men hvis understøtningen (K·L) er forskellig i de to retninger, kan det ændre sig.' },
    { level:'middel', q:'Hvad er den kritiske knæk-spænding σ_cr?',
      options:['σ_cr = π²E/(KL/r)²','σ_cr = π²EI/L','σ_cr = S_y','σ_cr = P_cr · A'],
      correct:0,
      why:'σ_cr = P_cr/A = π²E/(KL/r)² = π²E/λ². Den afhænger kun af materialet (E) og slankheden λ — ikke af styrken S_y.' },
    { level:'middel', q:'Hvad er K-faktoren for en indspændt-indspændt søjle?',
      options:['0,5','1,0','2,0','0,7'],
      correct:0,
      why:'Indspændt-indspændt har K = 0,5 → effektiv længde L/2. Det er det "stiveste" tilfælde og giver den højeste knæk-last (4× ledret-ledret).' },
    { level:'middel', q:'Hvad er den effektive længde L_eff?',
      options:['L_eff = L/K','L_eff = K·L','L_eff = L + K','L_eff = K²·L'],
      correct:1,
      why:'L_eff = K·L. Den repræsenterer længden af den tilsvarende ledret-ledrede søjle og indgår direkte i P_cr og λ.' },
    { level:'svaer', q:'En søjle kan svigte ved enten knækning eller flydning. Hvilken kapacitet styrer designet?',
      options:['Altid knækning','Den MINDSTE af P_cr og P_y = σ_y·A; den divideres med sikkerhedsfaktoren n','Altid flydning','Summen af de to'],
      correct:1,
      why:'Den laveste kapacitet vinder: P_till = min(P_cr, P_y)/n. Slanke søjler styres af knækning (P_cr); korte/tykke styres af flydning (P_y).' },
    { level:'svaer', q:'Kan den "stærke" akse (størst I) ende med at knække FØR den svage?',
      options:['Nej, aldrig','Ja — hvis dens effektive længde KL er meget længere (fx ufastholdt i den retning), kan dens P_cr blive lavest','Kun for aluminium','Kun hvis materialet flyder'],
      correct:1,
      why:'P_cr afhænger af BÅDE I og (KL)². En akse med stort I men meget lang effektiv længde (ufastholdt) kan få lavere P_cr end den "svage" akse, der er afstivet. Tjek altid begge akser.' },
    { level:'svaer', q:'Hvis den effektive længde KL fordobles, hvad sker der med den kritiske last P_cr?',
      options:['Halveres','Falder til 1/4 (P_cr ∝ 1/(KL)²)','Uændret','Fordobles'],
      correct:1,
      why:'P_cr = π²EI/(KL)² ∝ 1/(KL)². Fordobles den effektive længde, falder knæk-lasten med en faktor 4. Afstivning (mindre KL) er derfor enormt effektiv.' }
  ],
  cards: [
    { q:'Euler — formler?', a:'P_cr = π²EI/(KL)². σ_cr = π²E/(KL/r)² = π²E/λ². Slankhed λ = KL/r, r = √(I/A). Effektiv længde L_eff = KL.' },
    { q:'K-faktorer (de fire klassiske)?', a:'Ledret-ledret K = 1,0. Indspændt-fri (mast) K = 2,0 (værst). Indspændt-ledret K = 0,7. Indspændt-indspændt K = 0,5 (bedst).' },
    { q:'Hvilken akse + hvilken svigtform styrer?', a:'Knæk om aksen med lavest P_cr (tjek begge — I OG KL tæller). Søjlen svigter ved min(P_cr, P_y): slank → knækning, kort/tyk → flydning. P_till = min/n.' },
    { q:'Hvorfor er afstivning så effektiv?', a:'P_cr ∝ 1/(KL)². Halveres den effektive længde (fx ved en afstivning på midten), firdobles knæk-lasten. Små KL-ændringer giver store gevinster.' }
  ]
};

function buckSVG(){ return '\
<svg viewBox="0 0 520 230" width="520" height="230" role="img" aria-label="Soejleknaekning K-faktorer">\
<style>.ax{font:600 10px Nunito,sans-serif;fill:#cfe3f5} .k{font:700 13px Nunito,sans-serif} .n{font:600 10px Nunito,sans-serif;fill:#9bd4ff}</style>\
<g>\
<line x1="40" y1="40" x2="90" y2="40" stroke="#7e9ab0" stroke-width="2"/>\
<path d="M65 40 Q95 110 65 180" fill="none" stroke="#5ec8ff" stroke-width="3"/>\
<line x1="40" y1="180" x2="90" y2="180" stroke="#7e9ab0" stroke-width="2"/>\
<text x="65" y="200" text-anchor="middle" class="k" fill="#5ec8ff">K=1,0</text>\
<text x="65" y="214" text-anchor="middle" class="n">ledret-ledret</text>\
</g>\
<g>\
<rect x="135" y="178" width="50" height="6" fill="#7e9ab0"/>\
<path d="M160 180 Q210 100 195 35" fill="none" stroke="#ff6b6b" stroke-width="3"/>\
<text x="160" y="200" text-anchor="middle" class="k" fill="#ff9b9b">K=2,0</text>\
<text x="160" y="214" text-anchor="middle" class="n">indsp.-fri (mast)</text>\
</g>\
<g>\
<rect x="255" y="178" width="50" height="6" fill="#7e9ab0"/>\
<line x1="255" y1="40" x2="305" y2="40" stroke="#7e9ab0" stroke-width="2"/>\
<path d="M280 40 Q310 95 280 140 Q258 165 280 180" fill="none" stroke="#5ec8ff" stroke-width="3"/>\
<text x="280" y="200" text-anchor="middle" class="k" fill="#5ec8ff">K=0,7</text>\
<text x="280" y="214" text-anchor="middle" class="n">indsp.-ledret</text>\
</g>\
<g>\
<rect x="375" y="178" width="50" height="6" fill="#7e9ab0"/>\
<rect x="375" y="36" width="50" height="6" fill="#7e9ab0"/>\
<path d="M400 42 Q430 75 400 110 Q372 145 400 178" fill="none" stroke="#5fd17a" stroke-width="3"/>\
<text x="400" y="200" text-anchor="middle" class="k" fill="#7fe39a">K=0,5</text>\
<text x="400" y="214" text-anchor="middle" class="n">indsp.-indsp.</text>\
</g>\
<text x="470" y="110" class="ax" fill="#7e9ab0" transform="rotate(-90 470,110)" text-anchor="middle">lavere K = højere P_cr</text>\
</svg>'; }
