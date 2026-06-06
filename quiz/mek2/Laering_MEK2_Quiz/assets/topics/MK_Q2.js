/* MEK2 Quiz — Emne S2: Torsion. Kilde: Besvarelse_MEK2_S26 (opg2, opg5).
   12 Q · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['MK_Q2'] = {
  intro: 'Torsion er vridning af en aksel om sin egen akse. Forskydningsspændingen <b>τ = Tρ/I_p</b> vokser lineært med radius ρ — nul i centrum, størst i overfladen. Vridningsvinklen <b>φ = TL/(G·I_p)</b>. For et rør er I_p = π/32·(D⁴ − d⁴).',
  analogi: '⚒ Analogi: tænk på akslen som en blød fjeder — jo større moment T og jo længere aksel L, jo mere drejer enden. Jo stivere materiale (G) og kraftigere form (I_p), jo mindre. Det er præcis, hvad brøken φ = TL/GI_p siger.',
  examQs: [
    'Find τ ved yder- og inderradius for et rør i torsion.',
    'Beregn vridningsvinklen φ og brug ren forskydning (σ₁,₂ = ±τ ved 45°).',
    'Sammensæt vridning over flere segmenter (fjedre i serie).'
  ],
  svgCap: 'Torsion: momentet T vrider akslen, og forskydningsspændingen τ = Tρ/I_p vokser lineært med radius — nul i centrum, maksimal i yderfiberen (ρ = D/2).',
  svg: torsSVG(),
  mc: [
    { level:'let', q:'Hvor i et massivt akseltværsnit er forskydningsspændingen fra torsion størst?',
      options:['I centrum','I yderfiberen (største radius)','Jævnt fordelt overalt','På den neutrale akse'],
      correct:1,
      why:'τ = Tρ/I_p vokser lineært med radius ρ. Den er nul i centrum og maksimal i overfladen (ρ = D/2). Derfor dimensioneres efter yderfiberen.' },
    { level:'let', q:'Hvad er torsionsformlen for forskydningsspænding?',
      options:['τ = T/A','τ = T·ρ / I_p','τ = M·y / I','τ = V·Q / (I·t)'],
      correct:1,
      why:'τ = Tρ/I_p, hvor T er torsionsmomentet, ρ afstanden fra centrum og I_p det polære inertimoment. (My/I er bøjning; VQ/It er tværkraft-forskydning.)' },
    { level:'let', q:'Hvad er det polære inertimoment I_p for en MASSIV cirkulær aksel (diameter D)?',
      options:['π/64 · D⁴','π/32 · D⁴','π/4 · D²','π/16 · D³'],
      correct:1,
      why:'I_p = π/32·D⁴ for en massiv aksel. (π/64·D⁴ er det almindelige I til bøjning — bemærk I_p = 2·I for cirkler.)' },
    { level:'let', q:'Hvad beskriver vridningsvinklen φ = TL/(G·I_p)?',
      options:['Spændingen i overfladen','Hvor meget den ene ende drejer i forhold til den anden','Akslens forlængelse','Den kritiske last'],
      correct:1,
      why:'φ er den relative drejning mellem akslens ender (i radianer). Den vokser med moment og længde, og falder med materialets stivhed G og formens I_p.' },
    { level:'middel', q:'Hvad er I_p for et HULT rør (yderdiameter D, inderdiameter d)?',
      options:['π/32 · D⁴','π/32 · (D⁴ − d⁴)','π/64 · (D⁴ − d⁴)','π/32 · (D − d)⁴'],
      correct:1,
      why:'For et rør trækkes det "borede" hul fra: I_p = π/32·(D⁴ − d⁴). Det er som en stor massiv aksel minus den lille indre del.' },
    { level:'middel', q:'Et element på akslens overflade er i REN forskydning. Hvad er hovedspændingerne?',
      options:['σ₁ = σ₂ = τ','σ₁ = +τ_max og σ₂ = −τ_max, på et 45°-plan','σ₁ = 2τ, σ₂ = 0','Der er ingen hovedspændinger'],
      correct:1,
      why:'Ren forskydning giver σ₁ = +τ_max (træk) og σ₂ = −τ_max (tryk) på et element drejet 45°. Derfor revner sprøde aksler i en 45°-spiral (langs maksimal trækspænding).' },
    { level:'middel', q:'Hvordan hænger forskydningstøjningen γ sammen med τ?',
      options:['γ = τ · G','γ = τ / G','γ = τ / E','γ = τ · E'],
      correct:1,
      why:'Hookes lov for forskydning: γ = τ/G, hvor G er forskydningsmodulet. (Normaltøjning bruger E; γ bruger G.)' },
    { level:'middel', q:'Hvordan beregnes forskydningsmodulet G ud fra E og ν?',
      options:['G = E·(1+ν)','G = E / (2(1+ν))','G = 2E(1+ν)','G = E/ν'],
      correct:1,
      why:'G = E/(2(1+ν)). For stål (ν ≈ 0,3) bliver G ≈ 0,385·E ≈ 80 GPa.' },
    { level:'middel', q:'En aksel med to segmenter (AB og BC) i serie vrides. Hvad er den samlede vinkel i C?',
      options:['Den største af de to','φ_AB + φ_BC (summen, fjedre i serie)','Gennemsnittet','φ_AB − φ_BC'],
      correct:1,
      why:'Vridningen lægger sig sammen led for led fra den faste ende: φ_C = Σ TL/(GI_p) over segmenterne — ligesom bløde fjedre i serie. Hvert segment tæller med sin egen længde og I_p.' },
    { level:'svaer', q:'To aksler har samme T og længde og samme materialemængde, men én er massiv og én er et rør. Hvilken er stivest mod vridning?',
      options:['Den massive','Røret — materialet sidder længere fra centrum → større I_p','De er ens','Det afhænger kun af længden'],
      correct:1,
      why:'I_p afhænger af materialets afstand fra centrum (∝ r⁴). Flytter man samme materiale ud i et rør, vokser I_p markant → mindre τ og mindre φ. Derfor er hule aksler effektive til torsion.' },
    { level:'svaer', q:'En aksel skal overholde BÅDE en max-spænding og en max-vinkel. Hver grænse giver et tilladeligt T. Hvilket bruges?',
      options:['Det største af de to','Det mindste af de to (den grænse man rammer først)','Gennemsnittet','Summen'],
      correct:1,
      why:'Designet skal overholde begge grænser samtidig, så det er den MINDSTE tilladelige T der styrer: T_max = min(T_τ, T_φ) — den grænse, der nås først.' },
    { level:'svaer', q:'Hvis akslens diameter fordobles (massiv), hvor meget falder forskydningsspændingen ved samme T?',
      options:['Til det halve','Til 1/8 (τ ∝ 1/D³)','Til 1/4','Uændret'],
      correct:1,
      why:'τ_max = T·(D/2)/I_p = T·(D/2)/(π/32·D⁴) = 16T/(πD³) ∝ 1/D³. Fordobles D, falder τ med en faktor 2³ = 8. Diameteren er en meget effektiv knap.' }
  ],
  cards: [
    { q:'Torsions-formlerne?', a:'τ = Tρ/I_p (max ved ρ = D/2). φ = TL/(G·I_p). I_p = π/32·D⁴ (massiv) eller π/32·(D⁴−d⁴) (rør). G = E/(2(1+ν)).' },
    { q:'Ren forskydning på akseloverfladen?', a:'σ₁ = +τ_max, σ₂ = −τ_max på et 45°-element. Sprøde aksler revner derfor i en 45°-spiral langs maksimal trækspænding.' },
    { q:'Aksel i flere segmenter?', a:'Torsionsmomentet er det samme hele vejen (ved én belastning), men diameter/I_p kan skifte. Samlet vinkel = sum af TL/GI_p over segmenterne (fjedre i serie).' },
    { q:'Hvorfor er hule aksler effektive?', a:'I_p ∝ r⁴, så materiale langt fra centrum tæller mest. Et rør har næsten samme I_p som en massiv aksel men meget mindre vægt — bedst styrke/vægt mod torsion.' }
  ]
};

function torsSVG(){ return '\
<svg viewBox="0 0 520 240" width="520" height="240" role="img" aria-label="Torsion af aksel">\
<style>.ax{font:600 11px Nunito,sans-serif;fill:#cfe3f5} .lb{font:700 11px Nunito,sans-serif}</style>\
<ellipse cx="170" cy="95" rx="110" ry="34" fill="rgba(94,200,255,0.08)" stroke="#5ec8ff" stroke-width="2.5"/>\
<ellipse cx="170" cy="95" rx="46" ry="14" fill="#0a1a2b" stroke="#9bd4ff" stroke-width="1.6"/>\
<circle cx="170" cy="95" r="3" fill="#cfe3f5"/>\
<path d="M70 95 a100 30 0 1 0 200 0" fill="none" stroke="#ffd24a" stroke-width="3"/>\
<polygon points="270,95 258,82 262,108" fill="#ffd24a"/>\
<text x="170" y="55" text-anchor="middle" class="lb" fill="#ffd24a">T (torsionsmoment)</text>\
<line x1="320" y1="170" x2="320" y2="225" stroke="#cfe3f5" stroke-width="2"/>\
<line x1="320" y1="225" x2="470" y2="225" stroke="#cfe3f5" stroke-width="2"/>\
<text x="312" y="165" class="ax">τ</text>\
<text x="474" y="222" class="ax">ρ</text>\
<line x1="320" y1="225" x2="470" y2="150" stroke="#ff6b6b" stroke-width="3"/>\
<text x="356" y="148" class="ax" fill="#ff9b9b">τ = Tρ/I_p</text>\
<text x="330" y="245" class="ax" font-size="10" fill="#7e9ab0">0 i centrum</text>\
<text x="430" y="245" class="ax" font-size="10" fill="#7e9ab0">max yderst</text>\
<text x="90" y="150" class="ax" fill="#9bd4ff">τ vokser lineært med radius</text>\
</svg>'; }
