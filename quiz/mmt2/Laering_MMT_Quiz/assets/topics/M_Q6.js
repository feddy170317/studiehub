/* MMT2 Quiz — Emne M-6: Polymerer og kompositter. Kilde: M_Q6_*.tex
   12 spørgsmål · 4 lette / 5 middel / 3 svære */
window.MMT_TOPICS = window.MMT_TOPICS || {};
window.MMT_TOPICS['M_Q6'] = {
  intro: 'Polymerer er lange molekylkæder af gentagne enheder (monomerer) — tænk "spaghetti". Mod stål er de <b>lette</b> (0,9–1,4 g/cm³), billige, korrosionsbestandige og isolerende, men har lavere styrke/stivhed og kryber. <b>Kompositter</b> kombinerer det bedste: en polymer-matrix giver form og korrosionsmodstand, mens fibre giver styrke og stivhed (som armeret beton — bare med kulfiber).',
  analogi: '⚒ Termoplast = løse spaghetti-tråde der kan sammenfiltres og smeltes om igen. Hærdeplast = trådene bindes sammen til ét netværk (kovalent krydsbinding) — kan ikke smeltes om, kun nedbrydes.',
  examQs: [
    'Fordele og ulemper ved polymerer sammenlignet med stål.',
    'Polymerers opbygning, herunder repeterende enheder.',
    'Forskellen mellem termoplaster og hærdeplaster.',
    'Sammenhæng mellem struktur og mekaniske egenskaber i polymerer.',
    'Hvorfor kompositter bruges + fordele/ulemper.',
    'Opbygning af kompositter (matrix, fiber, fiberretning).'
  ],
  svgCap: 'Termoplast (venstre): separate kæder bundet af svage van der Waals-kræfter → kan smeltes og genformes. Hærdeplast (højre): kæderne er kovalent krydsbundet til ét netværk → stivt, kan ikke smeltes om.',
  svg: polySVG(),
  mc: [
    { level:'let', q:'Hvad er en polymer opbygget af?',
      options:['Tilfældigt blandede metalatomer','Lange kæder af gentagne enheder (monomerer/mers)','Et krystalgitter af ioner','Korte fibre i en matrix'],
      correct:1,
      why:'En polymer dannes ved at mange monomerer bindes i lange kæder: n·(monomer) → [–monomer–]ₙ. Fx polyethylen: [–CH₂–CH₂–]ₙ. Kædelængden (molarmassen) påvirker egenskaberne.' },
    { level:'let', q:'Hvad er en typisk FORDEL ved polymerer sammenlignet med stål?',
      options:['Højere stivhed','Lette, billige, korrosionsbestandige og elektrisk isolerende','Tåler høje temperaturer bedre','Kryber ikke under last'],
      correct:1,
      why:'Polymerer er lette (0,9–1,4 vs. 7,8 g/cm³), billige, korrosionsbestandige, isolerende og lette at forme. Ulemperne er lavere styrke/stivhed, krybning, dårlig varmebestandighed og UV-nedbrydning.' },
    { level:'let', q:'Hvad sker der med en <b>termoplast</b> ved opvarmning?',
      options:['Den nedbrydes og kan ikke genformes','Den smelter og kan genformes/genanvendes','Den hærder permanent','Den bliver elektrisk ledende'],
      correct:1,
      why:'Termoplaster har separate kæder bundet af svage van der Waals-kræfter → de smelter ved opvarmning og kan genformes/genanvendes (PE, PP, PET, ABS, PA).' },
    { level:'let', q:'Hvad er et kompositmateriale?',
      options:['Et rent metal','En kombination af en matrix + forstærkende fibre','En enkelt polymertype','Et legeret stål'],
      correct:1,
      why:'En komposit kombinerer to materialer: en matrix (binder, overfører last, beskytter) og fibre (bærer den primære last). Resultatet får egenskaber ingen enkeltkomponent har alene.' },
    { level:'middel', q:'Hvad er den strukturelle forskel på termoplaster og hærdeplaster?',
      options:['Termoplaster er krydsbundne; hærdeplaster er lineære','Termoplaster = lineære/forgrenede kæder (van der Waals); hærdeplaster = kovalent krydsbundet netværk','Begge er identiske netværk','Hærdeplaster har ingen kæder'],
      correct:1,
      why:'Termoplaster: separate kæder holdt af svage van der Waals-bindinger → smelter. Hærdeplaster: kæderne er kovalent krydsbundet til ét stift netværk → smelter ikke (epoxy, phenol, polyester).' },
    { level:'middel', q:'Hvad sker der med en <b>hærdeplast</b> ved kraftig opvarmning?',
      options:['Den smelter og kan genstøbes','Den nedbrydes (kan ikke smeltes om igen)','Den bliver gummiagtig og genformbar','Den krystalliserer'],
      correct:1,
      why:'Det kovalente krydsbundne netværk kan ikke brydes op ved opvarmning — i stedet nedbrydes/forkuller materialet. Derfor kan hærdeplaster ikke genformes eller genanvendes som termoplaster.' },
    { level:'middel', q:'Hvordan påvirker øget <b>krystallinitet</b> en polymers egenskaber?',
      options:['Lavere stivhed og smeltepunkt','Højere stivhed, hårdhed og smeltepunkt, men lavere gennemsigtighed','Ingen effekt','Gør den elektrisk ledende'],
      correct:1,
      why:'Ordnede krystalline domæner pakker kæderne tæt → højere stivhed, hårdhed og smeltepunkt, men lavere gennemsigtighed. Fx HDPE (70–80 % krystallin) er stivere end LDPE (40–60 %).' },
    { level:'middel', q:'Hvad er matrixens og fiberens roller i en komposit?',
      options:['Matrix bærer lasten; fiber binder sammen','Fiber er den primære lastbærer (styrke/stivhed); matrix binder, overfører last til fibrene og beskytter dem','Begge bærer lige meget last','Matrix er kun dekorativ'],
      correct:1,
      why:'Fibrene (glas/kulfiber/aramid) bærer den primære last og giver styrke/stivhed. Matrixen (epoxy/polyester) holder fibrene på plads, overfører last imellem dem og beskytter mod miljø/skade.' },
    { level:'middel', q:'Hvad kendetegner et <b>unidirektionelt (UD)</b> laminat?',
      options:['Lige stærkt i alle retninger','Meget høj styrke/stivhed i fiberretningen, men lav på tværs','Tilfældigt orienterede korte fibre','Ingen fibre'],
      correct:1,
      why:'I UD ligger alle fibre i én retning → ekstrem styrke/stivhed langs fibrene, men svagt på tværs (matrix-domineret). Bruges hvor lasten er kendt og enrettet, fx bjælker og rotorblade.' },
    { level:'svaer', q:'Et laminat af KUN 0°-lag (UD-CFRP) knækker ved meget lav spænding i 90°-retning. Hvorfor?',
      options:['Fibrene er for stærke','Fordi lasten på tværs (90°) bæres af MATRIX alene (~70 MPa), ikke af fibrene','Fordi der er for mange lag','Fordi kulfiber ikke kan bære træk'],
      correct:1,
      why:'På tværs af fibrene er der ingen fiberforstærkning → kun den svage matrix bærer (~70 MPa). Løsning til biaxial last: et kvasi-isotrop laminat (0°/±45°/90°), der fordeler lasten i alle retninger.' },
    { level:'svaer', q:'Hvordan påvirker øget <b>molarmasse</b> (kædelængde) en polymer?',
      options:['Lavere styrke og viskositet','Højere styrke, viskositet og smeltepunkt pga. mere sammenfiltring af kæderne','Ingen effekt på styrke','Gør den sprød'],
      correct:1,
      why:'Længere kæder filtrer mere sammen → flere fysiske "knuder" mellem kæderne → højere trækstyrke, smeltepunkt og smelteviskositet. (Det gør også sprøjtestøbning sværere ved meget høj molarmasse.)' },
    { level:'svaer', q:'Hvilken laminat-opbygning passer bedst til et komponent, der belastes <b>biaxialt</b>, og hvorfor?',
      options:['Rent 0°-UD — størst styrke','Kvasi-isotrop (0°/±45°/90°) — fordeler lasten i alle retninger i planen → tilnærmet isotrop','Kun korte random fibre — billigst','Kun 90°-lag'],
      correct:1,
      why:'Et kvasi-isotrop laminat har fibre i flere retninger (0/±45/90), så det opfører sig tilnærmet isotropt i planen og kan bære last fra flere retninger — standard i luftfartskonstruktioner.' }
  ],
  cards: [
    { q:'Polymer vs. stål — fordele og ulemper?', a:'Fordele: lette (0,9–1,4 g/cm³), billige, korrosionsbestandige, isolerende, lette at forme. Ulemper: lavere styrke/stivhed, kryber, dårlige ved høj temp., UV-nedbrydning.' },
    { q:'Termoplast vs. hærdeplast?', a:'Termoplast: lineære kæder (van der Waals), smelter & genanvendes (PE, PP, ABS). Hærdeplast: kovalent krydsbundet netværk, smelter ikke (epoxy, polyester) — bruges som komposit-matrix.' },
    { q:'Tre struktur-knapper i polymerer?', a:'Krystallinitet (↑ → stivere/hårdere). Krydsbinding (↑ → stivere; svag krydsbinding = elastomer/gummi). Molarmasse/kædelængde (↑ → stærkere, mere viskøs). + tilsatsstoffer (blødgørere, UV-stabilisatorer).' },
    { q:'Fiberorienteringer?', a:'UD (alle i én retning — max i fiberretning, svag på tværs). Woven 0°/90° (mere isotrop i plan). Kvasi-isotrop 0/±45/90 (luftfart). Korte random (sprøjtestøbt, billig, lavere egenskaber).' }
  ]
};

function polySVG(){ return '\
<svg viewBox="0 0 520 250" width="520" height="250" role="img" aria-label="Termoplast vs haerdeplast struktur">\
<style>.t{font:700 12px Nunito,sans-serif} .s{font:600 10px Nunito,sans-serif;fill:#9aa1ab}</style>\
<rect x="20" y="36" width="230" height="160" rx="6" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<text x="135" y="26" text-anchor="middle" class="t" fill="#9ad0f0">Termoplast</text>\
<g fill="none" stroke="#62b0e0" stroke-width="2.5" stroke-linecap="round">\
<path d="M35 60 Q70 50 100 62 T165 60 T230 64"/>\
<path d="M35 90 Q75 80 110 92 T175 88 T235 92"/>\
<path d="M30 120 Q65 110 100 122 T165 118 T232 122"/>\
<path d="M38 152 Q72 142 108 154 T172 150 T236 154"/>\
<path d="M33 180 Q70 170 105 182 T170 178 T234 182"/></g>\
<text x="135" y="212" text-anchor="middle" class="s">separate kæder · van der Waals · smelter</text>\
<rect x="270" y="36" width="230" height="160" rx="6" fill="#0f1115" stroke="#566069" stroke-width="1.5"/>\
<text x="385" y="26" text-anchor="middle" class="t" fill="#ff8a3d">Hærdeplast</text>\
<g stroke="#ff6a00" stroke-width="2.5" stroke-linecap="round">\
<line x1="300" y1="60" x2="360" y2="95"/><line x1="360" y1="95" x2="420" y2="65"/><line x1="420" y1="65" x2="470" y2="100"/>\
<line x1="300" y1="120" x2="360" y2="95"/><line x1="360" y1="95" x2="410" y2="135"/><line x1="410" y1="135" x2="470" y2="100"/>\
<line x1="300" y1="120" x2="350" y2="165"/><line x1="350" y1="165" x2="410" y2="135"/><line x1="410" y1="135" x2="460" y2="170"/>\
<line x1="300" y1="60" x2="305" y2="120"/><line x1="470" y1="100" x2="460" y2="170"/></g>\
<g fill="#ffd27a">\
<circle cx="360" cy="95" r="5"/><circle cx="420" cy="65" r="5"/><circle cx="410" cy="135" r="5"/><circle cx="300" cy="60" r="5"/><circle cx="300" cy="120" r="5"/><circle cx="470" cy="100" r="5"/><circle cx="350" cy="165" r="5"/><circle cx="460" cy="170" r="5"/></g>\
<text x="385" y="212" text-anchor="middle" class="s">kovalent krydsbundet net · smelter ikke</text>\
</svg>'; }
